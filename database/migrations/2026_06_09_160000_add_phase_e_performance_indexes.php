<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * E3 — Phase E performance indexes for D-phase new tables.
     * Covers the hot-path queries identified in Phase D controllers.
     */
    public function up(): void
    {
        // ── attendance_records ───────────────────────────────────────────────
        // AttendanceController::report() filters by course_id across all dates
        try {
            Schema::table('attendance_records', function (Blueprint $table) {
                $table->index(['course_id', 'date'], 'attendance_course_date_idx');
            });
        } catch (\Exception $e) {}

        // StudentDashboardController fetches attendance by student + date range
        try {
            Schema::table('attendance_records', function (Blueprint $table) {
                $table->index(['student_id', 'course_id', 'status'], 'attendance_student_course_status_idx');
            });
        } catch (\Exception $e) {}

        // ── assignment_submissions ────────────────────────────────────────────
        // AssignmentGradingController::show() — all subs for one assignment
        try {
            Schema::table('assignment_submissions', function (Blueprint $table) {
                $table->index(['assignment_id', 'status'], 'submissions_assignment_status_idx');
            });
        } catch (\Exception $e) {}

        // Student portal — my submissions across courses
        try {
            Schema::table('assignment_submissions', function (Blueprint $table) {
                $table->index(['student_id', 'status'], 'submissions_student_status_idx');
            });
        } catch (\Exception $e) {}

        // ── student_course_enrollments ────────────────────────────────────────
        // EnrollmentController — active enrollments per student
        try {
            Schema::table('student_course_enrollments', function (Blueprint $table) {
                $table->index(['student_id', 'status'], 'enrollments_student_status_idx');
            });
        } catch (\Exception $e) {}

        // AttendanceController — enrolled students per course
        try {
            Schema::table('student_course_enrollments', function (Blueprint $table) {
                $table->index(['course_id', 'status'], 'enrollments_course_status_idx');
            });
        } catch (\Exception $e) {}

        // ── exams ─────────────────────────────────────────────────────────────
        // ExamController::index() — filter by course and published state
        try {
            Schema::table('exams', function (Blueprint $table) {
                $table->index(['course_id', 'is_published'], 'exams_course_published_idx');
            });
        } catch (\Exception $e) {}

        // Student dashboard upcoming exams
        try {
            Schema::table('exams', function (Blueprint $table) {
                $table->index(['exam_date', 'is_published'], 'exams_date_published_idx');
            });
        } catch (\Exception $e) {}

        // ── exam_results ──────────────────────────────────────────────────────
        // ExamController::results() — all results for one exam
        try {
            Schema::table('exam_results', function (Blueprint $table) {
                $table->index(['exam_id', 'student_id'], 'exam_results_exam_student_idx');
            });
        } catch (\Exception $e) {}

        // Student portal — all results for one student
        try {
            Schema::table('exam_results', function (Blueprint $table) {
                $table->index('student_id', 'exam_results_student_idx');
            });
        } catch (\Exception $e) {}

        // ── assignments ────────────────────────────────────────────────────────
        // Dashboard — pending assignments per course
        try {
            Schema::table('assignments', function (Blueprint $table) {
                $table->index(['course_id', 'is_published', 'due_date'], 'assignments_course_published_due_idx');
            });
        } catch (\Exception $e) {}

        // ── hifz_sessions ─────────────────────────────────────────────────────
        // AdminHifzController — sessions per student ordered by date
        try {
            Schema::table('hifz_sessions', function (Blueprint $table) {
                $table->index(['teacher_id', 'session_date'], 'hifz_sessions_teacher_date_idx');
            });
        } catch (\Exception $e) {}

        // ── audit_logs ───────────────────────────────────────────────────────
        // AuditLog viewer ordered by latest
        try {
            Schema::table('audit_logs', function (Blueprint $table) {
                $table->index('created_at', 'audit_logs_created_at_idx');
            });
        } catch (\Exception $e) {}
    }

    public function down(): void
    {
        try {
            Schema::table('attendance_records', function (Blueprint $table) {
                $table->dropIndex('attendance_course_date_idx');
                $table->dropIndex('attendance_student_course_status_idx');
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('assignment_submissions', function (Blueprint $table) {
                $table->dropIndex('submissions_assignment_status_idx');
                $table->dropIndex('submissions_student_status_idx');
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('student_course_enrollments', function (Blueprint $table) {
                $table->dropIndex('enrollments_student_status_idx');
                $table->dropIndex('enrollments_course_status_idx');
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('exams', function (Blueprint $table) {
                $table->dropIndex('exams_course_published_idx');
                $table->dropIndex('exams_date_published_idx');
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('exam_results', function (Blueprint $table) {
                $table->dropIndex('exam_results_exam_student_idx');
                $table->dropIndex('exam_results_student_idx');
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('assignments', function (Blueprint $table) {
                $table->dropIndex('assignments_course_published_due_idx');
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('hifz_sessions', function (Blueprint $table) {
                $table->dropIndex('hifz_sessions_teacher_date_idx');
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('audit_logs', function (Blueprint $table) {
                $table->dropIndex('audit_logs_created_at_idx');
            });
        } catch (\Exception $e) {}
    }
};
