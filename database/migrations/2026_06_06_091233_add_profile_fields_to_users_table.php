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
            $table->string('profile_image')->nullable()->after('password');
            $table->string('phone')->nullable()->after('profile_image');
            $table->string('country')->nullable()->after('phone');
            $table->string('job_title')->nullable()->after('country');
            $table->string('department')->nullable()->after('job_title');
            $table->text('bio')->nullable()->after('department');
            
            // Social Links
            $table->string('linkedin_url')->nullable()->after('bio');
            $table->string('facebook_url')->nullable()->after('linkedin_url');
            $table->string('instagram_url')->nullable()->after('facebook_url');
            $table->string('twitter_url')->nullable()->after('instagram_url');
            $table->string('portfolio_url')->nullable()->after('twitter_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'profile_image',
                'phone',
                'country',
                'job_title',
                'department',
                'bio',
                'linkedin_url',
                'facebook_url',
                'instagram_url',
                'twitter_url',
                'portfolio_url',
            ]);
        });
    }
};
