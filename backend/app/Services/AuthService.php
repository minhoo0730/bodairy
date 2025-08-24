<?php
namespace App\Services;

use App\Models\RefreshToken;
use App\Models\User;

class AuthService
{
    public function generateRefreshToken(User $user, int $days = 14): string
    {
        $raw = bin2hex(random_bytes(32));   // 64자 hex
        $hashed = hash('sha256', $raw);

        RefreshToken::create([
            'user_id'    => $user->id,
            'token'      => $hashed,
            'expires_at' => now()->addDays($days),
        ]);

        return $raw; // 원문만 클라이언트에 반환
    }

    public function rotateAndGenerate(User $user, ?RefreshToken $old = null, int $days = 14): string
    {
        if ($old && $old->fillable && in_array('revoked_at', $old->getFillable())) {
            $old->update(['revoked_at' => now()]);
        }
        return $this->generateRefreshToken($user, $days);
    }
}
