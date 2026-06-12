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
        Schema::table('exams', function (Blueprint $table) {
            $table->string('status', 20)->default('draft')->comment('draft, review, published');
        });

        Schema::table('student_invoices', function (Blueprint $table) {
            $table->unsignedBigInteger('enrollment_id')->nullable()->after('student_id');
            $table->foreign('enrollment_id')->references('id')->on('student_semesters')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_invoices', function (Blueprint $table) {
            $table->dropForeign(['enrollment_id']);
            $table->dropColumn('enrollment_id');
        });

        Schema::table('exams', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
