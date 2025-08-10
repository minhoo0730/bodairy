<?php

namespace App\Http\Controllers\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\OtpCode;

class AuthController extends Controller
{
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

        // 5. 로그인 성공
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
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
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json(['message' => '정상적으로 로그아웃 되었어요.']);
        } catch (\Exception $e) {
            return response()->json(['error' => '서버에 오류가 발생했습니다.'], 500);
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

    private function maskEmail(string $email): string {
        [$local, $domain] = explode('@', $email, 2);
        $keep = max(1, min(2, strlen($local))); // 앞 1~2글자만 노출
        return substr($local, 0, $keep) . str_repeat('*', max(3, strlen($local)-$keep)) . '@' . $domain;
    }


}
