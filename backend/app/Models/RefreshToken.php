<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class RefreshToken extends Model
{
    protected $fillable = ['user_id', 'token', 'expires_at', 'revoked_at'];
    public $timestamps = false; // created_at/updated_at 없으면
    protected $casts = [
        'expires_at' => 'datetime',
        'revoked_at' => 'datetime',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id'); // FK 명시
    }

    // 유효 토큰 스코프
    public function scopeValid(Builder $q): Builder {
        return $q->whereNull('revoked_at')->where('expires_at', '>', now());
    }
}
