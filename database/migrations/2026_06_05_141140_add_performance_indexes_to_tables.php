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
        try {
            Schema::table('audio', function (Blueprint $table) {
                $table->index(['status', 'publish_date']);
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('videos', function (Blueprint $table) {
                $table->index('status');
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('question_answers', function (Blueprint $table) {
                $table->index(['status', 'topic_id']);
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('user_details', function (Blueprint $table) {
                $table->index('is_approved');
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('latest_news', function (Blueprint $table) {
                $table->index('status');
            });
        } catch (\Exception $e) {}
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        try {
            Schema::table('audio', function (Blueprint $table) {
                $table->dropIndex(['status', 'publish_date']);
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('videos', function (Blueprint $table) {
                $table->dropIndex(['status']);
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('question_answers', function (Blueprint $table) {
                $table->dropIndex(['status', 'topic_id']);
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('user_details', function (Blueprint $table) {
                $table->dropIndex(['is_approved']);
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('latest_news', function (Blueprint $table) {
                $table->dropIndex(['status']);
            });
        } catch (\Exception $e) {}
    }
};
