<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ─── COURSES ────────────────────────────────────────────────────────
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained('programs')->onDelete('cascade');
            $table->string('name', 150);
            $table->string('name_ur', 300)->nullable();
            $table->string('code', 25)->unique();
            $table->tinyInteger('year')->default(1);
            $table->tinyInteger('semester')->default(1);
            $table->tinyInteger('credit_hours')->default(3);
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->onDelete('set null');
            $table->text('description')->nullable();
            $table->text('description_ur')->nullable();
            $table->boolean('is_active')->default(true);
            $table->smallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // ─── STUDENT COURSE ENROLLMENTS ──────────────────────────────────────
        Schema::create('student_course_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->timestamp('enrolled_at')->useCurrent();
            $table->enum('status', ['active', 'dropped', 'completed'])->default('active');
            $table->decimal('progress_percentage', 5, 2)->default(0.00);
            $table->char('grade', 2)->nullable();
            $table->decimal('marks_obtained', 5, 2)->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'course_id']);
        });

        // ─── CLASS ROOMS ────────────────────────────────────────────────────
        Schema::create('class_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->smallInteger('capacity')->default(40);
            $table->enum('type', ['physical', 'virtual'])->default('physical');
            $table->string('location', 150)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ─── CLASS SCHEDULES ────────────────────────────────────────────────
        Schema::create('class_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->onDelete('set null');
            $table->tinyInteger('day_of_week'); // 0 = Sunday, 6 = Saturday
            $table->time('start_time');
            $table->time('end_time');
            $table->foreignId('room_id')->nullable()->constrained('class_rooms')->onDelete('set null');
            $table->enum('type', ['onsite', 'online'])->default('onsite');
            $table->string('meeting_url', 500)->nullable();
            $table->boolean('is_recurring')->default(true);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ─── ATTENDANCE RECORDS ──────────────────────────────────────────────
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('class_schedule_id')->nullable()->constrained('class_schedules')->onDelete('set null');
            $table->date('date');
            $table->enum('status', ['present', 'absent', 'leave', 'late', 'excused'])->default('present');
            $table->foreignId('marked_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'class_schedule_id', 'date'], 'student_schedule_date_unique');
            $table->index(['student_id', 'date']);
        });

        // ─── ASSIGNMENTS ────────────────────────────────────────────────────
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->onDelete('set null');
            $table->string('title', 200);
            $table->string('title_ur', 400)->nullable();
            $table->longText('description')->nullable();
            $table->longText('description_ur')->nullable();
            $table->dateTime('due_date');
            $table->decimal('max_marks', 5, 2)->default(100.00);
            $table->boolean('allow_late_submission')->default(false);
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        // ─── ASSIGNMENT SUBMISSIONS ─────────────────────────────────────────
        Schema::create('assignment_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assignment_id')->constrained('assignments')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->dateTime('submitted_at');
            $table->string('file_path', 500)->nullable();
            $table->string('file_name', 255)->nullable();
            $table->enum('file_type', ['pdf', 'docx', 'image', 'zip', 'other'])->default('pdf');
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'submitted', 'late', 'reviewed', 'graded'])->default('submitted');
            $table->decimal('marks_obtained', 5, 2)->nullable();
            $table->text('feedback')->nullable();
            $table->foreignId('graded_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('graded_at')->nullable();
            $table->timestamps();

            $table->unique(['assignment_id', 'student_id']);
        });

        // ─── HIFZ ENROLLMENTS ───────────────────────────────────────────────
        Schema::create('hifz_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->unique()->constrained('students')->onDelete('cascade');
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->onDelete('set null');
            $table->date('start_date');
            $table->date('target_completion_date')->nullable();
            $table->tinyInteger('total_juz_target')->default(30);
            $table->tinyInteger('juz_completed')->default(0);
            $table->string('current_surah', 100)->nullable();
            $table->smallInteger('current_ayah')->nullable();
            $table->enum('status', ['active', 'paused', 'completed', 'withdrawn'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // ─── HIFZ SESSIONS ──────────────────────────────────────────────────
        Schema::create('hifz_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->onDelete('set null');
            $table->date('session_date');
            
            // New lesson (Sabqi)
            $table->string('sabqi_from', 100)->nullable();
            $table->string('sabqi_to', 100)->nullable();
            $table->tinyInteger('sabqi_pages')->default(0);
            $table->enum('sabqi_quality', ['excellent', 'good', 'average', 'needs_revision'])->default('good');
            
            // Recently memorized (Sabq / Sabqi revision)
            $table->string('manzil_from', 100)->nullable();
            $table->string('manzil_to', 100)->nullable();
            $table->enum('manzil_quality', ['excellent', 'good', 'average', 'needs_revision'])->default('good');
            
            // Old revision (Manzil)
            $table->string('new_lesson_from', 100)->nullable();
            $table->string('new_lesson_to', 100)->nullable();
            $table->tinyInteger('new_lesson_pages')->default(0);
            
            $table->text('teacher_notes')->nullable();
            $table->tinyInteger('mistakes_count')->default(0);
            $table->timestamps();

            $table->index(['student_id', 'session_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hifz_sessions');
        Schema::dropIfExists('hifz_enrollments');
        Schema::dropIfExists('assignment_submissions');
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('attendance_records');
        Schema::dropIfExists('class_schedules');
        Schema::dropIfExists('class_rooms');
        Schema::dropIfExists('student_course_enrollments');
        Schema::dropIfExists('courses');
    }
};
