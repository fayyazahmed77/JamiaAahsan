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
        // 1. Create semesters table
        if (!Schema::hasTable('semesters')) {
            Schema::create('semesters', function (Blueprint $table) {
                $table->id();
                $table->foreignId('program_id')->constrained('programs')->onDelete('cascade');
                $table->string('name', 150);
                $table->string('code', 50)->unique();
                $table->date('start_date');
                $table->date('end_date');
                $table->integer('duration_months')->default(6);
                $table->enum('status', ['active', 'inactive', 'completed'])->default('inactive');
                $table->string('academic_year', 20);
                $table->softDeletes();
                $table->timestamps();
            });
        }

        // 2. Create student_semesters historic tracking table
        if (!Schema::hasTable('student_semesters')) {
            Schema::create('student_semesters', function (Blueprint $table) {
                $table->id();
                $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
                $table->foreignId('semester_id')->constrained('semesters')->onDelete('cascade');
                $table->enum('status', ['enrolled', 'completed', 'failed', 'withdrawn'])->default('enrolled');
                $table->decimal('gpa', 3, 2)->nullable();
                $table->text('remarks')->nullable();
                $table->timestamps();
                
                $table->unique(['student_id', 'semester_id']);
            });
        }

        // 3. Create course_book pivot table
        if (!Schema::hasTable('course_book')) {
            Schema::create('course_book', function (Blueprint $table) {
                $table->id();
                $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
                $table->foreignId('book_id')->constrained('books')->onDelete('cascade');
                $table->timestamps();
                
                $table->unique(['course_id', 'book_id']);
            });
        }

        // 4. Update courses table (add semester_id column)
        if (Schema::hasTable('courses')) {
            Schema::table('courses', function (Blueprint $table) {
                if (!Schema::hasColumn('courses', 'semester_id')) {
                    $table->foreignId('semester_id')->nullable()->after('program_id')->constrained('semesters')->onDelete('set null');
                }
            });
        }

        // 5. Update students table (add current_semester_id column)
        if (Schema::hasTable('students')) {
            Schema::table('students', function (Blueprint $table) {
                if (!Schema::hasColumn('students', 'current_semester_id')) {
                    $table->foreignId('current_semester_id')->nullable()->after('class_id')->constrained('semesters')->onDelete('set null');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('students')) {
            Schema::table('students', function (Blueprint $table) {
                if (Schema::hasColumn('students', 'current_semester_id')) {
                    $table->dropForeign(['current_semester_id']);
                    $table->dropColumn('current_semester_id');
                }
            });
        }

        if (Schema::hasTable('courses')) {
            Schema::table('courses', function (Blueprint $table) {
                if (Schema::hasColumn('courses', 'semester_id')) {
                    $table->dropForeign(['semester_id']);
                    $table->dropColumn('semester_id');
                }
            });
        }

        Schema::dropIfExists('course_book');
        Schema::dropIfExists('student_semesters');
        Schema::dropIfExists('semesters');
    }
};
