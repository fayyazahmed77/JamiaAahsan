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
        Schema::table('latest_news', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('text');
            $table->string('image_uri')->nullable()->after('slug');
            $table->text('excerpt')->nullable()->after('image_uri');
            $table->longText('content')->nullable()->after('excerpt');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('latest_news', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropColumn(['slug', 'image_uri', 'excerpt', 'content']);
        });
    }
};
