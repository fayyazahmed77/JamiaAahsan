<?php

use App\Http\Controllers\Student\Auth\StudentLoginController;
use App\Http\Controllers\Student\StudentDashboardController;
use App\Http\Controllers\Student\StudentProfileController;
use App\Http\Controllers\Student\StudentAdmissionController;
use App\Http\Controllers\Student\StudentDigitalIdController;
use App\Http\Controllers\Student\StudentNotificationController;
use App\Http\Controllers\Student\StudentSettingsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Student Portal Routes
|--------------------------------------------------------------------------
| All student portal routes use the dedicated auth:student guard.
| Sessions are completely isolated from the admin/web guard.
*/

Route::prefix('student')->name('student.')->group(function () {

    // ── Guest routes (only accessible when NOT logged in as student) ──
    Route::middleware('guest:student')->group(function () {
        Route::get('/login', [StudentLoginController::class, 'showLogin'])->name('login');
        Route::post('/login', [StudentLoginController::class, 'login'])->name('login.submit');
    });

    // ── Logout ─────────────────────────────────────────────────────────
    Route::post('/logout', [StudentLoginController::class, 'logout'])->name('logout');
    // GET logout removed — GET-based logout is a CSRF security anti-pattern.

    // ── Authenticated student routes ────────────────────────────────────
    Route::middleware(['auth:student', 'student.active'])->group(function () {

        // Dashboard
        Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');

        // Profile
        Route::get('/profile', [StudentProfileController::class, 'show'])->name('profile');
        Route::put('/profile', [StudentProfileController::class, 'update'])->name('profile.update');
        Route::post('/profile/photo', [StudentProfileController::class, 'updatePhoto'])->name('profile.photo');

        // Admission Tracking
        Route::get('/admission', [StudentAdmissionController::class, 'track'])->name('admission');

        // Digital Student ID
        Route::get('/my-id', [StudentDigitalIdController::class, 'show'])->name('digital-id');
        Route::get('/my-id/download', [StudentDigitalIdController::class, 'download'])->name('digital-id.download');

        // Notifications
        Route::get('/notifications', [StudentNotificationController::class, 'index'])->name('notifications');
        Route::post('/notifications/{id}/read', [StudentNotificationController::class, 'markRead'])->name('notifications.read');
        Route::post('/notifications/read-all', [StudentNotificationController::class, 'markAllRead'])->name('notifications.read-all');

        // Settings
        Route::get('/settings', [StudentSettingsController::class, 'index'])->name('settings');
        Route::put('/settings', [StudentSettingsController::class, 'update'])->name('settings.update');
        Route::put('/settings/password', [StudentSettingsController::class, 'updatePassword'])->name('settings.password');

        // ── Phase 2 active routes ─────────────────────────────────────────
        Route::get('/courses', [\App\Http\Controllers\Student\StudentCourseController::class, 'index'])->name('courses');
        Route::get('/courses/{id}', [\App\Http\Controllers\Student\StudentCourseController::class, 'show'])->name('courses.show');
        Route::get('/classes', [\App\Http\Controllers\Student\StudentClassController::class, 'index'])->name('classes');
        Route::get('/attendance', [\App\Http\Controllers\Student\StudentAttendanceController::class, 'index'])->name('attendance');
        
        Route::get('/assignments', [\App\Http\Controllers\Student\StudentAssignmentController::class, 'index'])->name('assignments');
        Route::get('/assignments/{id}', [\App\Http\Controllers\Student\StudentAssignmentController::class, 'show'])->name('assignments.show');
        Route::post('/assignments/{id}/submit', [\App\Http\Controllers\Student\StudentAssignmentController::class, 'submit'])->name('assignments.submit');
        
        Route::get('/hifz', [\App\Http\Controllers\Student\StudentHifzController::class, 'index'])->name('hifz');

        // ── Phase 3 stubs (will be implemented in Phase 3) ────────────────
        // Route::get('/exams', ...)->name('exams');
        // Route::get('/results', ...)->name('results');
        // Route::get('/materials', ...)->name('materials');
        // Route::get('/notices', ...)->name('notices');
        // Route::get('/teachers', ...)->name('teachers');
        // Route::get('/support', ...)->name('support');
        // Route::get('/certificates', ...)->name('certificates');
    });
});

// ── Public Certificate Verification (Phase 4 — not yet implemented) ────────
// Route::get('/verify/{code}', [CertificateVerifyController::class, 'show'])
//     ->name('certificate.verify');
