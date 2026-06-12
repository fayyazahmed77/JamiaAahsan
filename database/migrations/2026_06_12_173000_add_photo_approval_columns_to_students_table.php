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
        if (Schema::hasTable('students')) {
            Schema::table('students', function (Blueprint $table) {
                if (!Schema::hasColumn('students', 'pending_profile_photo')) {
                    $table->string('pending_profile_photo', 500)->nullable()->after('profile_photo');
                }
                if (!Schema::hasColumn('students', 'photo_status')) {
                    $table->string('photo_status', 20)->default('none')->after('pending_profile_photo'); // none, pending, approved, rejected
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('students')) {
            Schema::table('students', function (Blueprint $table) {
                if (Schema::hasColumn('students', 'pending_profile_photo')) {
                    $table->dropColumn('pending_profile_photo');
                }
                if (Schema::hasColumn('students', 'photo_status')) {
                    $table->dropColumn('photo_status');
                }
            });
        }
    }
};
