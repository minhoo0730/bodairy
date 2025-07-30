<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Validator;
use App\Models\OtpCode;

class OtpController extends Controller
{
    public function requestOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $otp = rand(100000, 999999); // 6자리 숫자
        $expiresAt = Carbon::now()->addMinutes(10);

        // 이메일 존재 여부 확인
        $checkEmail = User::where('email', $request->email)->first();
        if (!$checkEmail) {
            return response()->json([
                'message' => '등록되지 않은 이메일입니다.'
            ], 404);
        }

        // DB 저장
        OtpCode::create([
            'email' => $request->email,
            'otp_code' => $otp,
            'expires_at' => $expiresAt,
        ]);
        // 메일 발송 (Mail 설정 필요)
        Mail::raw("Your OTP code is: $otp", function ($message) use ($request) {
            $message->to($request->email)
                    ->subject('Your OTP Code');
        });

        return response()->json([
            'message' => '입력하신 이메일로 OTP번호가 발송되었습니다.'
        ]);
    }


    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp_code' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $otpRecord = OtpCode::where('email', $request->email)
            ->where('otp_code', $request->otp_code)
            ->where('expires_at', '>', Carbon::now())
            ->where('verified', false)
            ->latest() // 가장 최근의 OTP 사용
            ->first();
        if (!$otpRecord) {
            return response()->json(['message' => '유효하지 않거나 만료된 인증번호입니다.'], 422);
        }

        if (!$otpRecord instanceof OtpCode) {
            return response()->json(['message' => '인증정보 처리 중 오류가 발생했습니다.'], 500);
        }

        // 인증 성공 시 verified = true
        $otpRecord->verified = true;
        $otpRecord->save();

        // 나머지 인증번호 삭제 (해당 이메일 기준, 방금 인증 성공한 id 제외)
        OtpCode::where('email', $request->email)
            ->where('id', '!=', $otpRecord->id)
            ->delete();

        // 세션에 이메일 저장해두기 → resetPassword에서 인증 여부 확인 가능
        session(['otp_verified_email' => $request->email]);

        return response()->json(['message' => '인증 성공'], 200);
    }
}
