<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('audio')) {
            Schema::create('audio', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('user_title')->nullable();
                $table->string('uri');
                $table->string('youtube_url')->nullable();
                $table->longText('description')->nullable();
                $table->integer('views')->default(0);
                $table->string('thumbnail_uri')->nullable();
                $table->dateTime('publish_date')->nullable();
                $table->tinyInteger('status')->default(1);
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('videos')) {
            Schema::create('videos', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->text('urdu_title')->nullable();
                $table->string('uri');
                $table->string('youtube_url')->nullable();
                $table->longText('description')->nullable();
                $table->integer('views')->default(0);
                $table->string('thumbnail_uri')->nullable();
                $table->tinyInteger('status')->default(1);
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('images')) {
            Schema::create('images', function (Blueprint $table) {
                $table->id();
                $table->string('title')->nullable();
                $table->string('uri');
                $table->longText('description')->nullable();
                $table->string('btn_title')->nullable();
                $table->string('btn_link')->nullable();
                $table->integer('weight')->nullable();
                $table->unsignedBigInteger('parent_id')->nullable();
                $table->tinyInteger('status')->default(1);
                $table->softDeletes();
                $table->timestamps();

                $table->foreign('parent_id')->references('id')->on('images')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('media')) {
            Schema::create('media', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
                $table->foreignId('image_id')->nullable()->constrained()->onDelete('set null');
                $table->foreignId('audio_id')->nullable()->constrained()->onDelete('set null');
                $table->foreignId('video_id')->nullable()->constrained()->onDelete('set null');
                $table->foreignId('speaker_id')->nullable()->constrained()->onDelete('set null');
                $table->foreignId('year_id')->nullable()->constrained()->onDelete('set null');
                $table->string('uri');
                $table->longText('description')->nullable();
                $table->enum('type', ['audio', 'video', 'image'])->default('audio');
                $table->tinyInteger('status')->default(1);
                $table->softDeletes();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
        Schema::dropIfExists('images');
        Schema::dropIfExists('videos');
        Schema::dropIfExists('audio');
    }
};
