<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * D4: Exam scheduling tables.
 *   - exams        : one exam per course per term (midterm / final / quiz etc.)
 *   - exam_results : per-student score for each exam (D5 will use this)
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('title');                       // e.g. "Midterm – June 2026"
            $table->string('type')->default('midterm');    // midterm | final | quiz | other
            $table->date('exam_date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('venue')->nullable();           // room / hall
            $table->decimal('total_marks', 6, 2)->default(100);
            $table->decimal('passing_marks', 6, 2)->default(50);
            $table->text('instructions')->nullable();
            $table->boolean('is_published')->default(false); // visible to students?
            $table->timestamps();

            $table->index(['course_id', 'exam_date']);
        });

        Schema::create('exam_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->decimal('marks_obtained', 6, 2)->nullable();
            $table->string('grade')->nullable();           // A+, A, B, C, D, F
            $table->text('remarks')->nullable();
            $table->foreignId('entered_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['exam_id', 'student_id']);
            $table->index('exam_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_results');
        Schema::dropIfExists('exams');
    }
};
