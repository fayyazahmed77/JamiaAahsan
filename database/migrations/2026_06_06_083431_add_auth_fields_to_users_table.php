<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('otp_code', 60)->nullable()->after('password'); // 60 chars to store BCrypt hash
            $table->timestamp('otp_expires_at')->nullable()->after('otp_code');
            $table->integer('failed_attempts')->default(0)->after('status');
            $table->timestamp('locked_until')->nullable()->after('failed_attempts');
            $table->timestamp('last_login_at')->nullable()->after('locked_until');
            $table->string('last_login_ip', 45)->nullable()->after('last_login_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'otp_code',
                'otp_expires_at',
                'failed_attempts',
                'locked_until',
                'last_login_at',
                'last_login_ip',
            ]);
        });
    }
};
