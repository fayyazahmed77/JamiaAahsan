<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('audio', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('title');
        });

        // Backfill slugs for existing audio records
        DB::table('audio')->orderBy('id')->each(function ($row) {
            $base = Str::slug($row->title);
            $slug = $base;
            $counter = 1;
            while (DB::table('audio')->where('slug', $slug)->where('id', '!=', $row->id)->exists()) {
                $slug = $base . '-' . $counter++;
            }
            DB::table('audio')->where('id', $row->id)->update(['slug' => $slug]);
        });

        // Make slug non-nullable after backfill
        Schema::table('audio', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('audio', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
