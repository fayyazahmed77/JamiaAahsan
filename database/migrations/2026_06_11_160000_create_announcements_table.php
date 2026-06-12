<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('announcements')) {
            Schema::create('announcements', function (Blueprint $table) {
                $table->id();
                $table->string('title', 255);
                $table->string('title_ur', 255)->nullable();
                $table->text('content')->nullable();
                $table->text('content_ur')->nullable();
                $table->enum('audience', ['all', 'students', 'teachers'])->default('all');
                $table->boolean('is_pinned')->default(false);
                $table->timestamp('published_at')->nullable();
                $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
                $table->timestamps();

                $table->index(['audience', 'published_at']);
                $table->index('is_pinned');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
