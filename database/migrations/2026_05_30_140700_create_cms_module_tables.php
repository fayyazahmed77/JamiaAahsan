<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('settings')) {
            Schema::create('settings', function (Blueprint $table) {
                $table->id();
                $table->string('key')->unique();
                $table->text('value')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('prayer_timings')) {
            Schema::create('prayer_timings', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('urdu_name')->nullable();
                $table->time('time');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('latest_news')) {
            Schema::create('latest_news', function (Blueprint $table) {
                $table->id();
                $table->string('text');
                $table->string('link')->nullable();
                $table->tinyInteger('status')->default(1);
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('feedback')) {
            Schema::create('feedback', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email');
                $table->string('country');
                $table->longText('comment')->nullable();
                $table->smallInteger('rating')->default(5);
                $table->string('phone')->nullable();
                $table->softDeletes();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('feedback');
        Schema::dropIfExists('latest_news');
        Schema::dropIfExists('prayer_timings');
        Schema::dropIfExists('settings');
    }
};
