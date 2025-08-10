<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\OtpController;
use App\Http\Controllers\Auth\ResetPasswordController;


// 인증 및 회원가입
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 로그아웃
Route::middleware('auth:api')->post('/logout', [AuthController::class, 'logout']);

// 이메일 찾기
Route::post('/find-email', [AuthController::class, 'findEmail'])
    ->middleware('throttle:5,1');

// 패스워드 재설정
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// OTP 발급 및 인증
Route::post('/request-otp', [OtpController::class, 'requestOtp']);
Route::post('/verify-otp', [OtpController::class, 'verifyOtp']);


// JWT 인증된 사용자만 접근 가능
Route::middleware(['auth:api'])->group(function () {
    Route::get('/me', function () {
        return response()->json(Auth::user());
    });
});
