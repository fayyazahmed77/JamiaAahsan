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
        Schema::table('teachers', function (Blueprint $table) {
            $table->boolean('is_leadership')->default(false)->after('urdu_name');
            $table->string('designation')->nullable()->after('is_leadership');
            $table->string('designation_urdu')->nullable()->after('designation');
            $table->text('bio')->nullable()->after('designation_urdu');
            $table->text('bio_urdu')->nullable()->after('bio');
            $table->string('photo_uri')->nullable()->after('bio_urdu');
            $table->integer('sort_order')->default(0)->after('photo_uri');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            $table->dropColumn([
                'is_leadership',
                'designation',
                'designation_urdu',
                'bio',
                'bio_urdu',
                'photo_uri',
                'sort_order'
            ]);
        });
    }
};
