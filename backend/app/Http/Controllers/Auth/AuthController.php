<?php

namespace App\Http\Controllers\Auth;
use App\Models\User;
use App\Models\RefreshToken;
use App\Models\OtpCode;
use App\Services\AuthService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function __construct(private AuthService $auth) {}

    // 로그인
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        // 1. 로그인 실패
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'message' => '아이디 또는 비밀번호가 올바르지 않습니다.'
            ], 401);
        }

        $user = auth()->user();
        // 2. 탈퇴 회원 확인
        if ($user->status === 'deleted') {
            return response()->json([
                'message' => '탈퇴한 계정입니다.'
            ], 403);
        }

        // 3. 휴면 계정
        if ($user->status === 'dormant') {
            return response()->json([
                'message' => '휴면 계정입니다. 이메일 인증 후 로그인할 수 있습니다.'
            ], 403);
        }

        // 4. 승인 대기 (optional)
        if ($user->status === 'pending') {
            return response()->json([
                'message' => '승인 대기 중인 계정입니다.'
            ], 403);
        }

        // ✅ 여기서 refresh_token 발급
        $refreshToken = $this->generateRefreshToken($user);

        // 5. 로그인 성공
        return response()->json([
            'message' => '로그인에 성공하였습니다',
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'user' => Auth::user(),
        ]);
    }

    // 회원가입
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => ['required','regex:/^01[0-9]{8,9}$/'], // 010 포함 10~11자리
            'password' => 'required|string|min:8|max:30',
            // 'password_confirmation' => 'required|same:password',
        ],[
            'name.required' => '이름은 필수 입력 항목입니다.',
            'email.required' => '이메일은 필수 입력 항목입니다.',
            'email.email' => '이메일 형식이 올바르지 않습니다.',
            'email.unique' => '이미 사용 중인 이메일입니다.',
            'password.required' => '비밀번호를 입력해 주세요.',
            'password.min' => '비밀번호는 최소 8자 이상이어야 합니다.',
            'password.max' => '비밀번호는 최대 30자까지 입력 가능합니다.',
        ]);

        $user = \App\Models\User::create([
            'name' => $request->name,
            'email' => strtolower($request->email),
            'phone' => $request->phone,
            'password' => bcrypt($request->password),
        ]);




        return response()->json([
            'message' => '회원가입이 완료되었습니다.\n로그인을 해주세요.',
            'user' => $user,
        ], 201);
    }

    // 비밀번호 재설정
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'password' => [
                'required',
                'string',
                'min:8',
                'max:30',
                'regex:/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@!%*#?&])[A-Za-z\d$@!%*#?&]{8,30}$/',
                'confirmed', // confirm 필드와 자동 비교
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $verifiedOtp = OtpCode::where('email', $request->email)
            ->where('verified', true)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (!$verifiedOtp) {
            return response()->json(['message' => 'OTP 인증이 완료되지 않았습니다.'], 403);
        }

        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => '비밀번호가 성공적으로 재설정되었습니다.'], 200);
    }

    // 로그아웃
    public function logout(Request $request)
    {
        try {
            // 1) 가능하면 Access 토큰 무효화
            try {
                if ($token = JWTAuth::getToken()) {
                    JWTAuth::invalidate($token); // 현재 access 즉시 무효화
                }
            } catch (\Throwable $e) {
                // access 만료/없음 → 무시
            }

            $rawRt = $request->input('refresh_token');

            if ($rawRt) {
                // 2-a) 전달된 refresh 토큰만 revoke
                RefreshToken::where('token', hash('sha256', (string)$rawRt))
                    ->update(['revoked_at' => now()]);
            } else if ($request->user()) {
                // 2-b) 사용자 전체 refresh 토큰 revoke (권장)
                RefreshToken::where('user_id', $request->user()->id)
                    ->update(['revoked_at' => now()]);
            }

            return response()->json(['message' => 'Logged out'], 200);
        } catch (\Throwable $e) {
            \Log::error('logout failed', ['err' => $e->getMessage()]);
            return response()->json(['message' => 'Logout internal error'], 500);
        }
    }

    // 이메일 찾기
    public function findEmail(Request $request) {
        $data = $request->validate([
            'name'  => ['required','string','max:50'],
            'phone' => ['required','regex:/^01[0-9]{8,9}$/'],
        ]);

        $user = User::where('name', $data['name'])
                    ->where('phone', $data['phone'])
                    ->first();

        // 존재 유무 노출 줄이기: 응답 문구는 동일하게
        if (!$user) {
            return response()->json([
                'message' => '입력하신 정보로 계정을 찾을 수 없습니다.'
            ], 200);
        }

        $masked = $this->maskEmail($user->email);
        return response()->json([
            'message' => '입력하신 정보로 조회를 완료했습니다.',
            'email_masked' => $masked,
        ], 200);
    }

    // 토큰 리프레쉬 컨트롤러
public function refresh(Request $request)
    {
try {
            $raw = (string) $request->input('refresh_token');
            if (!$raw) {
                return response()->json(['message' => 'Refresh token is required'], 400);
            }

            $stored = RefreshToken::where('token', hash('sha256', $raw))->valid()->first();
            if (!$stored) {
                return response()->json(['message' => 'Invalid or expired refresh token'], 401);
            }

            $user = $stored->user;
            if (!$user) {
                return response()->json(['message' => 'User not found'], 401);
            }

            // 1) access 재발급
            $accessToken = JWTAuth::fromUser($user);

            // 2) 이전 refresh 토큰 revoke
            $stored->revoked_at = now();
            $stored->save();

            // 3) 새 refresh 토큰 발급(원문 반환, 해시 저장)
            $newRaw = bin2hex(random_bytes(32));   // 64자 hex
            $newHashed = hash('sha256', $newRaw);
            RefreshToken::create([
                'user_id'    => $user->id,
                'token'      => $newHashed,
                'expires_at' => now()->addDays(14),
            ]);

            return response()->json([
                'access_token'  => $accessToken,
                'refresh_token' => $newRaw,
            ], 200);
        } catch (\Throwable $e) {
            Log::error('refresh failed', ['err' => $e->getMessage()]);
            return response()->json(['message' => 'Refresh internal error'], 500);
        }
    }


    private function maskEmail(string $email): string {
        [$local, $domain] = explode('@', $email, 2);
        $keep = max(1, min(2, strlen($local))); // 앞 1~2글자만 노출
        return substr($local, 0, $keep) . str_repeat('*', max(3, strlen($local)-$keep)) . '@' . $domain;
    }

    // 리프레시 토큰 발급 함수
    private function generateRefreshToken($user)
    {
        $token = Str::random(60);
        RefreshToken::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $token),
            'expires_at' => now()->addDays(7),
        ]);

        return $token;
    }
}
