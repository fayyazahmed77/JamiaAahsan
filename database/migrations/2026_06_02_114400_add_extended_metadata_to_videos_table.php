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
        Schema::table('videos', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('title');
            $table->unsignedInteger('duration')->nullable()->after('uri');
            $table->unsignedInteger('width')->nullable()->after('duration');
            $table->unsignedInteger('height')->nullable()->after('width');
            $table->unsignedBigInteger('file_size')->nullable()->after('height');
            $table->string('mime_type')->nullable()->after('file_size');
            $table->string('meta_title', 60)->nullable()->after('description');
            $table->text('meta_description')->nullable()->after('meta_title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            $table->dropColumn([
                'slug',
                'duration',
                'width',
                'height',
                'file_size',
                'mime_type',
                'meta_title',
                'meta_description'
            ]);
        });
    }
};
