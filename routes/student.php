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

        // Support tickets and general notices (remain open for students to contact helpdesk)
        Route::get('/notices', [\App\Http\Controllers\Student\StudentAnnouncementController::class, 'index'])->name('notices');
        Route::get('/support', [\App\Http\Controllers\Student\StudentSupportController::class, 'index'])->name('support');
        Route::post('/support', [\App\Http\Controllers\Student\StudentSupportController::class, 'store'])->name('support.store');

        // ── Gated by Active Enrollment ─────────────────────────────────────
        Route::middleware('student.enrolled')->group(function () {
            // Digital Student ID
            Route::get('/my-id', [StudentDigitalIdController::class, 'show'])->name('digital-id');
            Route::get('/my-id/download', [StudentDigitalIdController::class, 'download'])->name('digital-id.download');

            // Course & Classes (Timetable)
            Route::get('/courses', [\App\Http\Controllers\Student\StudentCourseController::class, 'index'])->name('courses');
            Route::get('/courses/{id}', [\App\Http\Controllers\Student\StudentCourseController::class, 'show'])->name('courses.show');
            Route::get('/classes', [\App\Http\Controllers\Student\StudentClassController::class, 'index'])->name('classes');
            Route::get('/attendance', [\App\Http\Controllers\Student\StudentAttendanceController::class, 'index'])->name('attendance');
            
            // Assignments
            Route::get('/assignments', [\App\Http\Controllers\Student\StudentAssignmentController::class, 'index'])->name('assignments');
            Route::get('/assignments/{id}', [\App\Http\Controllers\Student\StudentAssignmentController::class, 'show'])->name('assignments.show');
            Route::post('/assignments/{id}/submit', [\App\Http\Controllers\Student\StudentAssignmentController::class, 'submit'])->name('assignments.submit');
            
            // Hifz logs
            Route::get('/hifz', [\App\Http\Controllers\Student\StudentHifzController::class, 'index'])->name('hifz');

            // Exams & Results
            Route::get('/exams', [\App\Http\Controllers\Student\StudentExamController::class, 'index'])->name('exams');
            Route::get('/results', [\App\Http\Controllers\Student\StudentExamController::class, 'index'])->name('results');

            // Certificates
            Route::get('/certificates', [\App\Http\Controllers\Student\StudentCertificateController::class, 'index'])->name('certificates');
            Route::get('/certificates/{certificate}/download', [\App\Http\Controllers\Student\StudentCertificateController::class, 'download'])->name('certificates.download');

            // Invoices / Fee Management
            Route::get('/invoices', [\App\Http\Controllers\Student\StudentInvoiceController::class, 'index'])->name('invoices');
            Route::post('/invoices/{id}/receipt', [\App\Http\Controllers\Student\StudentInvoiceController::class, 'uploadReceipt'])->name('invoices.receipt');
            Route::get('/invoices/{id}/download', [\App\Http\Controllers\Student\StudentInvoiceController::class, 'downloadPdf'])->name('invoices.download');
        });
    });
});

// ── Public Certificate Verification (Phase 4 — not yet implemented) ────────
// Route::get('/verify/{code}', [CertificateVerifyController::class, 'show'])
//     ->name('certificate.verify');
