<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('refresh_tokens', function (Blueprint $table) {
            if (!Schema::hasColumn('refresh_tokens', 'revoked_at')) {
                $table->timestamp('revoked_at')->nullable()->index();
            }
            // 안전망 인덱스들 (필요 시만)
            $table->index(['user_id', 'expires_at']);
            // token 컬럼이 유니크가 아니면 유니크로
            // $table->unique('token');
        });
    }
    public function down(): void {
        Schema::table('refresh_tokens', function (Blueprint $table) {
            $table->dropColumn('revoked_at');
        });
    }
};
