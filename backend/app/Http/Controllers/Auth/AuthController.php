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
            'password' => 'required|string|min:6',
            // 'password_confirmation' => 'required|same:password',
        ]);

        $user = \App\Models\User::create([
            'name' => $request->name,
            'email' => strtolower($request->email),
            'password' => bcrypt($request->password),
        ]);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
        ], 201);
    }

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

}
