<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ─── PROGRAMS ──────────────────────────────────────────────────────
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('name_ur', 300)->nullable();
            $table->string('slug', 120)->unique();
            $table->enum('type', ['dars_nizami', 'hifz', 'tajweed', 'arabic', 'ifta', 'other'])->default('dars_nizami');
            $table->tinyInteger('duration_years')->default(8);
            $table->tinyInteger('total_semesters')->default(16);
            $table->text('description')->nullable();
            $table->text('description_ur')->nullable();
            $table->boolean('is_active')->default(true);
            $table->smallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // ─── BATCHES ───────────────────────────────────────────────────────
        Schema::create('batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained('programs')->onDelete('cascade');
            $table->string('name', 60);
            $table->string('name_ur', 120)->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->smallInteger('max_students')->default(50);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ─── STUDENTS (Authenticatable — separate guard) ────────────────────
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('student_id_number', 25)->unique();      // JA-2024-001
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // link to admin user if any
            $table->foreignId('program_id')->nullable()->constrained('programs')->onDelete('set null');
            $table->foreignId('batch_id')->nullable()->constrained('batches')->onDelete('set null');
            $table->foreignId('class_id')->nullable()->constrained('classes')->onDelete('set null');

            // Auth fields
            $table->string('name', 120);
            $table->string('email', 180)->unique();
            $table->string('password');
            $table->rememberToken();
            $table->timestamp('email_verified_at')->nullable();

            // Personal
            $table->string('phone', 25)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female'])->default('male');
            $table->string('profile_photo', 500)->nullable();

            // Academic
            $table->tinyInteger('current_year')->default(1);
            $table->tinyInteger('current_semester')->default(1);
            $table->enum('student_type', ['online', 'onsite'])->default('onsite');
            $table->enum('status', ['pending', 'active', 'inactive', 'graduated', 'withdrawn', 'suspended'])->default('pending');

            $table->date('enrollment_date')->nullable();
            $table->date('graduation_date')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip', 50)->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'student_type']);
            $table->index('program_id');
        });

        // ─── STUDENT PASSWORD RESET TOKENS ─────────────────────────────────
        Schema::create('student_password_reset_tokens', function (Blueprint $table) {
            $table->string('email', 180)->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        // ─── STUDENT PROFILES ───────────────────────────────────────────────
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->unique()->constrained('students')->onDelete('cascade');

            // Personal extended
            $table->string('father_name', 100)->nullable();
            $table->string('mother_name', 100)->nullable();
            $table->string('nationality', 80)->default('Pakistani');
            $table->string('mother_tongue', 80)->nullable();
            $table->string('national_id', 40)->nullable();           // CNIC / B-Form

            // Address
            $table->text('address')->nullable();
            $table->string('city', 80)->nullable();
            $table->string('province', 80)->nullable();
            $table->string('country', 80)->default('Pakistan');

            // Islamic background
            $table->string('previous_madrasa', 200)->nullable();
            $table->string('previous_qualification', 200)->nullable();
            $table->enum('hifz_status', ['non_hafiz', 'in_progress', 'hafiz'])->default('non_hafiz');
            $table->string('maslak', 80)->nullable();
            $table->json('specialization_interests')->nullable(); // ["dars_nizami","hifz","tajweed"]

            // Emergency contact
            $table->string('emergency_contact_name', 100)->nullable();
            $table->string('emergency_contact_phone', 25)->nullable();
            $table->string('emergency_contact_relation', 60)->nullable();

            $table->timestamps();
        });

        // ─── STUDENT GUARDIANS ──────────────────────────────────────────────
        Schema::create('student_guardians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->string('name', 120);
            $table->enum('relation', ['father', 'mother', 'brother', 'uncle', 'grandfather', 'other'])->default('father');
            $table->string('phone', 25)->nullable();
            $table->string('email', 180)->nullable();
            $table->string('cnic', 25)->nullable();
            $table->text('address')->nullable();
            $table->string('occupation', 120)->nullable();
            $table->boolean('is_primary')->default(false);

            // Future parent portal
            $table->boolean('can_access_portal')->default(false);
            $table->string('portal_password', 255)->nullable();
            $table->timestamp('portal_last_login')->nullable();

            $table->timestamps();
            $table->index('student_id');
        });

        // ─── STUDENT LOGIN HISTORY ──────────────────────────────────────────
        Schema::create('student_login_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->string('ip_address', 50)->nullable();
            $table->text('user_agent')->nullable();
            $table->enum('device_type', ['mobile', 'tablet', 'desktop', 'unknown'])->default('unknown');
            $table->string('browser', 80)->nullable();
            $table->string('os', 80)->nullable();
            $table->string('location', 150)->nullable();
            $table->enum('status', ['success', 'failed'])->default('success');
            $table->string('failed_reason', 100)->nullable();
            $table->timestamp('logged_in_at')->useCurrent();
            $table->timestamp('logged_out_at')->nullable();

            $table->index(['student_id', 'logged_in_at']);
        });

        // ─── STUDENT SETTINGS ───────────────────────────────────────────────
        Schema::create('student_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->unique()->constrained('students')->onDelete('cascade');
            $table->enum('language', ['en', 'ur'])->default('en');
            $table->enum('theme', ['light', 'dark', 'system'])->default('system');

            // Notification preferences
            $table->boolean('notify_assignment')->default(true);
            $table->boolean('notify_exam')->default(true);
            $table->boolean('notify_result')->default(true);
            $table->boolean('notify_attendance')->default(true);
            $table->boolean('notify_notice')->default(true);
            $table->boolean('notify_hifz')->default(true);
            $table->boolean('notify_support')->default(true);
            $table->boolean('notify_certificate')->default(true);
            $table->boolean('notify_teacher')->default(true);

            // Security
            $table->boolean('two_factor_enabled')->default(false);
            $table->string('two_factor_secret', 120)->nullable();
            $table->boolean('login_notifications')->default(true);

            $table->timestamps();
        });

        // ─── STUDENT NOTIFICATIONS ──────────────────────────────────────────
        Schema::create('student_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->string('title', 250);
            $table->string('title_ur', 500)->nullable();
            $table->text('message');
            $table->text('message_ur')->nullable();
            $table->enum('type', [
                'assignment', 'exam', 'result', 'attendance_warning',
                'notice', 'certificate', 'hifz', 'general', 'support', 'teacher',
            ])->default('general');
            $table->string('related_model', 100)->nullable();
            $table->unsignedBigInteger('related_id')->nullable();
            $table->string('action_url', 500)->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['student_id', 'is_read', 'created_at']);
        });

        // ─── DIGITAL STUDENT ID CARDS ────────────────────────────────────────
        Schema::create('digital_student_ids', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->unique()->constrained('students')->onDelete('cascade');
            $table->string('card_number', 25)->unique();
            $table->string('qr_code_data', 500)->nullable();
            $table->string('qr_code_path', 500)->nullable();
            $table->string('pdf_path', 500)->nullable();
            $table->date('issued_at')->nullable();
            $table->date('valid_until')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // ─── ISLAMIC CONTENT (daily Quran verse + Hadith) ───────────────────
        Schema::create('islamic_content', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['quran_verse', 'hadith', 'reminder'])->default('quran_verse');

            // Quran verse fields
            $table->text('arabic_text')->nullable();
            $table->text('translation_en')->nullable();
            $table->text('translation_ur')->nullable();
            $table->string('reference', 100)->nullable();    // "Al-Baqarah 2:286"

            // Hadith fields
            $table->text('hadith_text_en')->nullable();
            $table->text('hadith_text_ur')->nullable();
            $table->string('hadith_source', 100)->nullable(); // "Sahih Bukhari"
            $table->string('hadith_grade', 50)->nullable();   // "Sahih"

            $table->boolean('is_active')->default(true);
            $table->smallInteger('display_day')->nullable();  // 1-365 for rotation
            $table->timestamps();

            $table->index(['type', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('islamic_content');
        Schema::dropIfExists('digital_student_ids');
        Schema::dropIfExists('student_notifications');
        Schema::dropIfExists('student_settings');
        Schema::dropIfExists('student_login_history');
        Schema::dropIfExists('student_guardians');
        Schema::dropIfExists('student_profiles');
        Schema::dropIfExists('student_password_reset_tokens');
        Schema::dropIfExists('students');
        Schema::dropIfExists('batches');
        Schema::dropIfExists('programs');
    }
};
