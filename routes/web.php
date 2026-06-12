<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;

// Import Public Controllers
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\AboutController;
use App\Http\Controllers\Public\CourseController;
use App\Http\Controllers\Public\MediaController;
use App\Http\Controllers\Public\AdmissionsController;
use App\Http\Controllers\Public\FatwaController;
use App\Http\Controllers\Public\DonationController;
use App\Http\Controllers\Public\NewsController;
use App\Http\Controllers\Public\DownloadsController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\SearchController;
use App\Http\Controllers\Public\GalleryController;
use App\Http\Controllers\Public\CertificateVerifyController;

// Import all Controllers
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\Audio\AudioController;
use App\Http\Controllers\Admin\Video\VideoController;
use App\Http\Controllers\Admin\Image\ImageController;
use App\Http\Controllers\Admin\Speaker\SpeakerController;
use App\Http\Controllers\Admin\Category\CategoryController;
use App\Http\Controllers\Admin\Year\YearController;
use App\Http\Controllers\Admin\Klass\ClassController;
use App\Http\Controllers\Admin\Klass\ClassSessionController;
use App\Http\Controllers\Admin\Teacher\TeacherController;
use App\Http\Controllers\Admin\Book\BookController;
use App\Http\Controllers\Admin\Admission\AdmissionController;
use App\Http\Controllers\Admin\QA\TopicController;
use App\Http\Controllers\Admin\QA\QuestionAnswerController;
use App\Http\Controllers\Admin\Cms\SettingController;
use App\Http\Controllers\Admin\Cms\PrayerTimingController;
use App\Http\Controllers\Admin\Cms\LatestNewsController;
use App\Http\Controllers\Admin\Download\DownloadController;
use App\Http\Controllers\Admin\Feedback\FeedbackController;
use App\Http\Controllers\Admin\Subscription\SubscriptionController;
use App\Http\Controllers\Admin\User\UserController;
use App\Http\Controllers\Admin\Role\RoleController;
use App\Http\Controllers\Admin\Notification\NotificationController;
use App\Http\Controllers\Admin\Hifz\AdminHifzController;
use App\Http\Controllers\Admin\Attendance\AttendanceController;
use App\Http\Controllers\Admin\Assignment\AssignmentGradingController;
use App\Http\Controllers\Admin\Exam\ExamController;
use App\Http\Controllers\Admin\Student\StudentEnrollmentController;
use App\Http\Controllers\Admin\ExportController;

// ── Public Routes ─────────────────────────────────────────────────────────────
Route::get('/', [HomeController::class, 'index'])->name('public.home');

Route::get('/about', [AboutController::class, 'index'])->name('public.about.index');
Route::get('/about/history', [AboutController::class, 'history'])->name('public.about.history');
Route::get('/about/leadership', [AboutController::class, 'leadership'])->name('public.about.leadership');
Route::get('/about/faculty', [AboutController::class, 'faculty'])->name('public.about.faculty');

Route::get('/education', [CourseController::class, 'index'])->name('public.education.index');
Route::get('/education/{slug}', [CourseController::class, 'show'])->name('public.education.show');

Route::get('/media/audio', [MediaController::class, 'audio'])->name('public.media.audio');
Route::get('/media/audio/{audio:slug}', [MediaController::class, 'showAudio'])->name('public.media.audio.show');
Route::get('/media/video', [MediaController::class, 'video'])->name('public.media.video');
Route::get('/media/video/{video:slug}', [MediaController::class, 'showVideo'])->name('public.media.video.show');
Route::get('/media/live', [MediaController::class, 'live'])->name('public.media.live');

Route::get('/admissions', [AdmissionsController::class, 'index'])->name('public.admissions.index');
Route::get('/admissions/apply', [AdmissionsController::class, 'apply'])->name('public.admissions.apply');
Route::post('/admissions/apply', [AdmissionsController::class, 'store'])
    ->middleware('throttle:public-forms')
    ->name('public.admissions.store');

Route::get('/fatwa', [FatwaController::class, 'index'])->name('public.fatwa.index');
Route::post('/fatwa', [FatwaController::class, 'store'])
    ->middleware('throttle:public-forms')
    ->name('public.fatwa.store');

Route::get('/donate', [DonationController::class, 'index'])->name('public.donation.index');

Route::get('/news', [NewsController::class, 'index'])->name('public.news.index');
Route::get('/news/{slug}', [NewsController::class, 'show'])->name('public.news.show');

Route::get('/downloads', [DownloadsController::class, 'index'])->name('public.downloads.index');

Route::get('/contact', [ContactController::class, 'index'])->name('public.contact.index');
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:public-forms')
    ->name('public.contact.store');

Route::get('/search', [SearchController::class, 'index'])->name('public.search');
Route::get('/api/search', [SearchController::class, 'instant'])->name('public.search.api');
Route::get('/gallery', [GalleryController::class, 'index'])->name('public.gallery');
Route::get('/verify/{code}', [CertificateVerifyController::class, 'show'])->name('certificate.verify');

Route::get('/lang/{locale}', function (string $locale) {
    if (in_array($locale, ['en', 'ur'])) {
        session(['locale' => $locale]);
    }
    return redirect()->back();
})->name('public.lang');

// ── Sitemap — served from pre-generated static file (no live DB queries) ──────
// File is regenerated every 6 hours by: php artisan sitemap:generate (see routes/console.php)
// On first request (or if file missing), generate it on-the-fly once.
Route::get('/sitemap.xml', function () {
    $path = Storage::disk('public')->path('sitemap.xml');

    if (!file_exists($path)) {
        Artisan::call('sitemap:generate');
    }

    return response()->file($path, [
        'Content-Type'  => 'application/xml',
        'Cache-Control' => 'public, max-age=21600', // 6 hours browser cache
    ]);
})->name('public.sitemap');

// ── Admin Auth Routes (Loaded from auth.php) ──────────────────────────────────
require __DIR__.'/auth.php';

// ── Admin authenticated Panel ──────────────────────────────────────────────────
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth'])
    ->group(function () {

        // Dashboard (Gated with Super Admin / Admin role check)
        Route::get('/', [DashboardController::class, 'index'])
            ->name('dashboard')
            ->middleware('role:Super Admin|Admin');

        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->middleware('role:Super Admin|Admin');

        // Profile Edit & Update
        Route::get('profile', [\App\Http\Controllers\Admin\ProfileController::class, 'edit'])->name('profile.edit');
        Route::post('profile', [\App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('profile.update');

        // ── Audio Module (view/create/edit/delete audio permissions) ─────────
        Route::middleware('permission:view audio')->group(function () {
            Route::get('audio', [AudioController::class, 'index'])->name('audio.index');
            Route::get('audio/create', [AudioController::class, 'create'])->name('audio.create')->middleware('permission:create audio');
            Route::post('audio', [AudioController::class, 'store'])->name('audio.store')->middleware('permission:create audio');
            Route::get('audio/{audio}', [AudioController::class, 'show'])->name('audio.show');
            Route::get('audio/{audio}/edit', [AudioController::class, 'edit'])->name('audio.edit')->middleware('permission:edit audio');
            Route::put('audio/{audio}', [AudioController::class, 'update'])->name('audio.update')->middleware('permission:edit audio');
            Route::delete('audio/{audio}', [AudioController::class, 'destroy'])->name('audio.destroy')->middleware('permission:delete audio');
            
            Route::post('audio/bulk-destroy', [AudioController::class, 'bulkDestroy'])->name('audio.bulk-destroy')->middleware('permission:delete audio');
            Route::get('audio-import', [AudioController::class, 'importForm'])->name('audio.import')->middleware('permission:create audio');
            Route::post('audio-import', [AudioController::class, 'import'])->name('audio.import.store')->middleware('permission:create audio');
        });

        // ── Video Module (view/create/edit/delete videos permissions) ────────
        Route::middleware('permission:view videos')->group(function () {
            Route::get('videos', [VideoController::class, 'index'])->name('videos.index');
            Route::get('videos/create', [VideoController::class, 'create'])->name('videos.create')->middleware('permission:create videos');
            Route::post('videos', [VideoController::class, 'store'])->name('videos.store')->middleware('permission:create videos');
            Route::get('videos/{video}', [VideoController::class, 'show'])->name('videos.show');
            Route::get('videos/{video}/edit', [VideoController::class, 'edit'])->name('videos.edit')->middleware('permission:edit videos');
            Route::put('videos/{video}', [VideoController::class, 'update'])->name('videos.update')->middleware('permission:edit videos');
            Route::delete('videos/{video}', [VideoController::class, 'destroy'])->name('videos.destroy')->middleware('permission:delete videos');
            
            Route::post('videos/bulk-destroy', [VideoController::class, 'bulkDestroy'])->name('videos.bulk-destroy')->middleware('permission:delete videos');
        });

        // ── Images & Banners Module (view/create/edit/delete banner permissions)
        Route::middleware('permission:view home.main.banner')->group(function () {
            Route::get('images', [ImageController::class, 'index'])->name('images.index');
            Route::get('images/create', [ImageController::class, 'create'])->name('images.create')->middleware('permission:create home.main.banner');
            Route::post('images', [ImageController::class, 'store'])->name('images.store')->middleware('permission:create home.main.banner');
            Route::get('images/{image}/edit', [ImageController::class, 'edit'])->name('images.edit')->middleware('permission:edit home.main.banner');
            Route::put('images/{image}', [ImageController::class, 'update'])->name('images.update')->middleware('permission:edit home.main.banner');
            Route::delete('images/{image}', [ImageController::class, 'destroy'])->name('images.destroy')->middleware('permission:delete home.main.banner');
            
            Route::post('images/reorder', [ImageController::class, 'reorder'])->name('images.reorder')->middleware('permission:edit home.main.banner');
        });

        // ── Classification (view/create/edit/delete speakers/categories/years) 
        Route::middleware('permission:view speakers')->group(function () {
            Route::get('speakers', [SpeakerController::class, 'index'])->name('speakers.index');
            Route::post('speakers', [SpeakerController::class, 'store'])->name('speakers.store')->middleware('permission:create speakers');
            Route::get('speakers/{speaker}/edit', [SpeakerController::class, 'edit'])->name('speakers.edit')->middleware('permission:edit speakers');
            Route::put('speakers/{speaker}', [SpeakerController::class, 'update'])->name('speakers.update')->middleware('permission:edit speakers');
            Route::delete('speakers/{speaker}', [SpeakerController::class, 'destroy'])->name('speakers.destroy')->middleware('permission:delete speakers');
        });

        Route::middleware('permission:view categories')->group(function () {
            Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
            Route::post('categories', [CategoryController::class, 'store'])->name('categories.store')->middleware('permission:create categories');
            Route::get('categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit')->middleware('permission:edit categories');
            Route::put('categories/{category}', [CategoryController::class, 'update'])->name('categories.update')->middleware('permission:edit categories');
            Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy')->middleware('permission:delete categories');
        });

        Route::middleware('permission:view years')->group(function () {
            Route::get('years', [YearController::class, 'index'])->name('years.index');
            Route::post('years', [YearController::class, 'store'])->name('years.store')->middleware('permission:create years');
            Route::get('years/{year}/edit', [YearController::class, 'edit'])->name('years.edit')->middleware('permission:edit years');
            Route::put('years/{year}', [YearController::class, 'update'])->name('years.update')->middleware('permission:edit years');
            Route::delete('years/{year}', [YearController::class, 'destroy'])->name('years.destroy')->middleware('permission:delete years');
        });

        // ── Dars-e-Nizami (classes/sessions/teachers/books) ──────────────────
        Route::middleware('permission:view classes')->group(function () {
            Route::get('classes', [ClassController::class, 'index'])->name('classes.index');
            Route::get('classes/create', [ClassController::class, 'create'])->name('classes.create')->middleware('permission:create classes');
            Route::post('classes', [ClassController::class, 'store'])->name('classes.store')->middleware('permission:create classes');
            Route::get('classes/{class}/edit', [ClassController::class, 'edit'])->name('classes.edit')->middleware('permission:edit classes');
            Route::put('classes/{class}', [ClassController::class, 'update'])->name('classes.update')->middleware('permission:edit classes');
            Route::delete('classes/{class}', [ClassController::class, 'destroy'])->name('classes.destroy')->middleware('permission:delete classes');

            Route::get('classes/{class}/sessions', [ClassSessionController::class, 'index'])->name('classes.sessions.index');
            Route::get('classes/{class}/sessions/create', [ClassSessionController::class, 'create'])->name('classes.sessions.create')->middleware('permission:create classes');
            Route::post('classes/{class}/sessions', [ClassSessionController::class, 'store'])->name('classes.sessions.store')->middleware('permission:create classes');
            Route::get('classes/{class}/sessions/{session}/edit', [ClassSessionController::class, 'edit'])->name('classes.sessions.edit')->middleware('permission:edit classes');
            Route::put('classes/{class}/sessions/{session}', [ClassSessionController::class, 'update'])->name('classes.sessions.update')->middleware('permission:edit classes');
            Route::delete('classes/{class}/sessions/{session}', [ClassSessionController::class, 'destroy'])->name('classes.sessions.destroy')->middleware('permission:delete classes');

            // Semesters CRUD Routes
            Route::get('semesters', [\App\Http\Controllers\Admin\Semester\SemesterController::class, 'index'])->name('semesters.index');
            Route::post('semesters', [\App\Http\Controllers\Admin\Semester\SemesterController::class, 'store'])->name('semesters.store')->middleware('permission:create classes');
            Route::put('semesters/{semester}', [\App\Http\Controllers\Admin\Semester\SemesterController::class, 'update'])->name('semesters.update')->middleware('permission:edit classes');
            Route::delete('semesters/{semester}', [\App\Http\Controllers\Admin\Semester\SemesterController::class, 'destroy'])->name('semesters.destroy')->middleware('permission:delete classes');

            // Courses CRUD Routes
            Route::get('courses', [\App\Http\Controllers\Admin\Course\CourseController::class, 'index'])->name('courses.index');
            Route::post('courses', [\App\Http\Controllers\Admin\Course\CourseController::class, 'store'])->name('courses.store')->middleware('permission:create classes');
            Route::put('courses/{course}', [\App\Http\Controllers\Admin\Course\CourseController::class, 'update'])->name('courses.update')->middleware('permission:edit classes');
            Route::delete('courses/{course}', [\App\Http\Controllers\Admin\Course\CourseController::class, 'destroy'])->name('courses.destroy')->middleware('permission:delete classes');

            // Timetable Scheduler Routes
            Route::get('timetable', [\App\Http\Controllers\Admin\Timetable\TimetableController::class, 'index'])->name('timetable.index');
            Route::post('timetable', [\App\Http\Controllers\Admin\Timetable\TimetableController::class, 'store'])->name('timetable.store')->middleware('permission:create classes');
            Route::put('timetable/{slot}', [\App\Http\Controllers\Admin\Timetable\TimetableController::class, 'update'])->name('timetable.update')->middleware('permission:edit classes');
            Route::delete('timetable/{slot}', [\App\Http\Controllers\Admin\Timetable\TimetableController::class, 'destroy'])->name('timetable.destroy')->middleware('permission:delete classes');

            // Course Content / Study Resource Routes
            Route::post('courses/{course}/resources', [\App\Http\Controllers\Admin\Course\CourseContentController::class, 'storeResource'])->name('courses.resources.store')->middleware('permission:edit classes');
            Route::delete('courses/resources/{resource}', [\App\Http\Controllers\Admin\Course\CourseContentController::class, 'destroyResource'])->name('courses.resources.destroy')->middleware('permission:edit classes');

            // Course Assignment Routes
            Route::post('courses/{course}/assignments', [\App\Http\Controllers\Admin\Course\CourseContentController::class, 'storeAssignment'])->name('courses.assignments.store')->middleware('permission:edit classes');
            Route::delete('courses/assignments/{assignment}', [\App\Http\Controllers\Admin\Course\CourseContentController::class, 'destroyAssignment'])->name('courses.assignments.destroy')->middleware('permission:edit classes');

            // Class Rooms CRUD
            Route::resource('classrooms', \App\Http\Controllers\Admin\Klass\ClassRoomController::class)->only(['index', 'store', 'update', 'destroy']);
        });

        Route::middleware('permission:view teachers')->group(function () {
            Route::get('teachers',              [TeacherController::class, 'index'])->name('teachers.index');
            Route::get('teachers/{teacher}',    [TeacherController::class, 'show'])->name('teachers.show');  // D7
            Route::post('teachers',             [TeacherController::class, 'store'])->name('teachers.store')->middleware('permission:create teachers');
            Route::get('teachers/{teacher}/edit', [TeacherController::class, 'edit'] ?? null)->name('teachers.edit')->middleware('permission:edit teachers');
            Route::put('teachers/{teacher}',    [TeacherController::class, 'update'])->name('teachers.update')->middleware('permission:edit teachers');
            Route::delete('teachers/{teacher}', [TeacherController::class, 'destroy'])->name('teachers.destroy')->middleware('permission:delete teachers');
        });

        Route::middleware('permission:view books')->group(function () {
            Route::get('books', [BookController::class, 'index'])->name('books.index');
            Route::post('books', [BookController::class, 'store'])->name('books.store')->middleware('permission:create books');
            Route::get('books/{book}/edit', [BookController::class, 'edit'])->name('books.edit')->middleware('permission:edit books');
            Route::put('books/{book}', [BookController::class, 'update'])->name('books.update')->middleware('permission:edit books');
            Route::delete('books/{book}', [BookController::class, 'destroy'])->name('books.destroy')->middleware('permission:delete books');
        });

        // ── Admissions & Subscriptions ──────────────────────────────────────
        Route::middleware('permission:view admissions')->group(function () {
            Route::get('admissions', [AdmissionController::class, 'index'])->name('admissions.index');
            Route::get('admissions/{user}', [AdmissionController::class, 'show'])->name('admissions.show');
            Route::post('admissions/{user}/approve', [AdmissionController::class, 'approve'])->name('admissions.approve')->middleware('permission:edit admissions');
            Route::post('admissions/{user}/reject', [AdmissionController::class, 'reject'])->name('admissions.reject')->middleware('permission:edit admissions');
            Route::post('admissions/{user}/transfer', [AdmissionController::class, 'transfer'])->name('admissions.transfer')->middleware('permission:edit admissions');
        });

        Route::middleware('permission:view subscriptions')->group(function () {
            Route::get('subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions.index');
            Route::delete('subscriptions/{subscription}', [SubscriptionController::class, 'destroy'])->name('subscriptions.destroy')->middleware('permission:delete subscriptions');
        });

        // ── Q&A Module (view/create/edit/delete topics and qa permissions) ───
        Route::middleware('permission:view topics')->group(function () {
            Route::get('qa/topics', [TopicController::class, 'index'])->name('topics.index');
            Route::post('qa/topics', [TopicController::class, 'store'])->name('topics.store')->middleware('permission:create topics');
            Route::get('qa/topics/{topic}/edit', [TopicController::class, 'edit'])->name('topics.edit')->middleware('permission:edit topics');
            Route::put('qa/topics/{topic}', [TopicController::class, 'update'])->name('topics.update')->middleware('permission:edit topics');
            Route::delete('qa/topics/{topic}', [TopicController::class, 'destroy'])->name('topics.destroy')->middleware('permission:delete topics');
        });

        Route::middleware('permission:view qa')->group(function () {
            Route::get('qa/questions', [QuestionAnswerController::class, 'index'])->name('questions.index');
            Route::get('qa/questions/create', [QuestionAnswerController::class, 'create'])->name('questions.create')->middleware('permission:create qa');
            Route::post('qa/questions', [QuestionAnswerController::class, 'store'])->name('questions.store')->middleware('permission:create qa');
            Route::get('qa/questions/{question}/edit', [QuestionAnswerController::class, 'edit'])->name('questions.edit')->middleware('permission:edit qa');
            Route::put('qa/questions/{question}', [QuestionAnswerController::class, 'update'])->name('questions.update')->middleware('permission:edit qa');
            Route::delete('qa/questions/{question}', [QuestionAnswerController::class, 'destroy'])->name('questions.destroy')->middleware('permission:delete qa');
        });

        // ── Notice Board & Announcements ───────────────
        Route::get('announcements', [\App\Http\Controllers\Admin\Announcement\AnnouncementController::class, 'index'])->name('announcements.index');
        Route::post('announcements', [\App\Http\Controllers\Admin\Announcement\AnnouncementController::class, 'store'])->name('announcements.store');
        Route::put('announcements/{announcement}', [\App\Http\Controllers\Admin\Announcement\AnnouncementController::class, 'update'])->name('announcements.update');
        Route::delete('announcements/{announcement}', [\App\Http\Controllers\Admin\Announcement\AnnouncementController::class, 'destroy'])->name('announcements.destroy');

        // ── Certificates Module ───────────────────────
        Route::get('certificates', [\App\Http\Controllers\Admin\Certificate\AdminCertificateController::class, 'index'])->name('certificates.index');
        Route::post('certificates', [\App\Http\Controllers\Admin\Certificate\AdminCertificateController::class, 'store'])->name('certificates.store');
        Route::delete('certificates/{certificate}', [\App\Http\Controllers\Admin\Certificate\AdminCertificateController::class, 'destroy'])->name('certificates.destroy');
        Route::get('certificates/{certificate}/download', [\App\Http\Controllers\Admin\Certificate\AdminCertificateController::class, 'download'])->name('certificates.download');

        // ── Export Service Routes ────────────────────
        Route::middleware('permission:view students')->group(function () {
            Route::get('exports/students', [ExportController::class, 'exportStudents'])->name('exports.students');
            Route::get('exports/attendance', [ExportController::class, 'exportAttendance'])->name('exports.attendance');
        });

        Route::middleware('permission:view admissions')->group(function () {
            Route::get('exports/admissions', [ExportController::class, 'exportAdmissions'])->name('exports.admissions');
        });

        Route::middleware('permission:view assignments')->group(function () {
            Route::get('exports/assignments', [ExportController::class, 'exportAssignments'])->name('exports.assignments');
        });

        Route::middleware('role:Super Admin')->group(function () {
            Route::get('exports/hifz/excel', [ExportController::class, 'exportHifzExcel'])->name('exports.hifz.excel');
            Route::get('exports/hifz/{studentId}', [ExportController::class, 'exportHifzPdf'])->name('exports.hifz.pdf');
        });

        // ── CMS Settings & Downloads ──────────────────
        Route::middleware('permission:view settings')->group(function () {
            Route::get('cms/settings', [SettingController::class, 'index'])->name('settings.index');
            Route::put('cms/settings', [SettingController::class, 'update'])->name('settings.update')->middleware('permission:edit settings');

            // Departments CRUD
            Route::get('departments', [\App\Http\Controllers\Admin\Department\DepartmentController::class, 'index'])->name('departments.index');
            Route::post('departments', [\App\Http\Controllers\Admin\Department\DepartmentController::class, 'store'])->name('departments.store')->middleware('permission:create settings');
            Route::put('departments/{department}', [\App\Http\Controllers\Admin\Department\DepartmentController::class, 'update'])->name('departments.update')->middleware('permission:edit settings');
            Route::delete('departments/{department}', [\App\Http\Controllers\Admin\Department\DepartmentController::class, 'destroy'])->name('departments.destroy')->middleware('permission:delete settings');

            // Programs CRUD (replacing / upgrading departments)
            Route::get('programs', [\App\Http\Controllers\Admin\Program\ProgramController::class, 'index'])->name('programs.index');
            Route::post('programs', [\App\Http\Controllers\Admin\Program\ProgramController::class, 'store'])->name('programs.store')->middleware('permission:create settings');
            Route::put('programs/{program}', [\App\Http\Controllers\Admin\Program\ProgramController::class, 'update'])->name('programs.update')->middleware('permission:edit settings');
            Route::delete('programs/{program}', [\App\Http\Controllers\Admin\Program\ProgramController::class, 'destroy'])->name('programs.destroy')->middleware('permission:delete settings');
        });


        Route::middleware('permission:view prayer-timings')->group(function () {
            Route::get('cms/prayer-timings', [PrayerTimingController::class, 'index'])->name('prayer-timings.index');
            Route::put('cms/prayer-timings/{prayer_timing}', [PrayerTimingController::class, 'update'])->name('prayer-timings.update')->middleware('permission:edit prayer-timings');
        });

        Route::middleware('permission:view latest-news')->group(function () {
            Route::get('cms/latest-news', [LatestNewsController::class, 'index'])->name('latest-news.index');
            Route::get('cms/latest-news/create', [LatestNewsController::class, 'create'])->name('latest-news.create')->middleware('permission:create latest-news');
            Route::post('cms/latest-news', [LatestNewsController::class, 'store'])->name('latest-news.store')->middleware('permission:create latest-news');
            Route::get('cms/latest-news/{latest_news}/edit', [LatestNewsController::class, 'edit'])->name('latest-news.edit')->middleware('permission:edit latest-news');
            Route::put('cms/latest-news/{latest_news}', [LatestNewsController::class, 'update'])->name('latest-news.update')->middleware('permission:edit latest-news');
            Route::delete('cms/latest-news/{latest_news}', [LatestNewsController::class, 'destroy'])->name('latest-news.destroy')->middleware('permission:delete latest-news');
        });

        Route::middleware('permission:view downloads')->group(function () {
            Route::get('downloads', [DownloadController::class, 'index'])->name('downloads.index');
            Route::get('downloads/create', [DownloadController::class, 'create'])->name('downloads.create')->middleware('permission:create downloads');
            Route::post('downloads', [DownloadController::class, 'store'])->name('downloads.store')->middleware('permission:create downloads');
            Route::get('downloads/{download}/edit', [DownloadController::class, 'edit'])->name('downloads.edit')->middleware('permission:edit downloads');
            Route::put('downloads/{download}', [DownloadController::class, 'update'])->name('downloads.update')->middleware('permission:edit downloads');
            Route::delete('downloads/{download}', [DownloadController::class, 'destroy'])->name('downloads.destroy')->middleware('permission:delete downloads');
        });

        // ── Feedback Module (view/delete feedback) ───────────────────────────
        Route::middleware('permission:view feedback')->group(function () {
            Route::get('feedback', [FeedbackController::class, 'index'])->name('feedback.index');
            Route::put('feedback/{feedback}', [FeedbackController::class, 'update'])->name('feedback.update')->middleware('permission:edit feedback');
            Route::delete('feedback/{feedback}', [FeedbackController::class, 'destroy'])->name('feedback.destroy')->middleware('permission:delete feedback');
        });

        // ── System Management (Super Admin Exclusive) ────────────────────────
        Route::middleware('role:Super Admin')->group(function () {
            Route::get('users', [UserController::class, 'index'])->name('users.index');
            Route::get('users/create', [UserController::class, 'create'])->name('users.create');
            Route::post('users', [UserController::class, 'store'])->name('users.store');
            Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
            Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
            Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

            Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
            Route::post('roles', [RoleController::class, 'store'])->name('roles.store');
            Route::get('roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
            Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update');
            Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

            // Permission Categories CRUD
            Route::post('permission-categories', [RoleController::class, 'storeCategory'])->name('permission-categories.store');
            Route::put('permission-categories/{category}', [RoleController::class, 'updateCategory'])->name('permission-categories.update');
            Route::delete('permission-categories/{category}', [RoleController::class, 'destroyCategory'])->name('permission-categories.destroy');

            // Permissions CRUD
            Route::post('permissions', [RoleController::class, 'storePermission'])->name('permissions.store');
            Route::put('permissions/{permission}', [RoleController::class, 'updatePermission'])->name('permissions.update');
            Route::delete('permissions/{permission}', [RoleController::class, 'destroyPermission'])->name('permissions.destroy');

            Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
            Route::post('notifications/broadcast', [NotificationController::class, 'broadcast'])->name('notifications.broadcast');

            // ── Hifz Management ──────────────────────────────────────────
            Route::get('hifz', [AdminHifzController::class, 'index'])->name('hifz.index');
            Route::get('hifz/{studentId}', [AdminHifzController::class, 'show'])->name('hifz.show');
            Route::post('hifz/{studentId}/sessions', [AdminHifzController::class, 'storeSession'])->name('hifz.sessions.store');
            Route::put('hifz/{studentId}/enrollment', [AdminHifzController::class, 'updateEnrollment'])->name('hifz.enrollment.update');
        });

        // ── D1: Attendance ────────────────────────────────────────────────────
        Route::middleware('permission:view students')->group(function () {
            Route::get('attendance',        [AttendanceController::class, 'index'])->name('attendance.index');
            Route::get('attendance/report', [AttendanceController::class, 'report'])->name('attendance.report');
            Route::post('attendance',       [AttendanceController::class, 'store'])->name('attendance.store')->middleware('permission:edit students');
        });

        // ── D3: Assignment Grading ─────────────────────────────────────────────
        Route::middleware('permission:view assignments')->group(function () {
            Route::get('assignments/grading',                    [AssignmentGradingController::class, 'index'])->name('assignments.grading');
            Route::get('assignments/{assignment}/grade',         [AssignmentGradingController::class, 'show'])->name('assignments.grade.show')->middleware('permission:grade assignments');
            Route::post('assignments/{assignment}/grade',        [AssignmentGradingController::class, 'grade'])->name('assignments.grade')->middleware('permission:grade assignments');
        });

        // ── D4+D5: Exam Scheduling & Results ───────────────────────────────────
        Route::middleware('permission:view students')->group(function () {
            Route::get('exams',                       [ExamController::class, 'index'])->name('exams.index');
            Route::get('exams/{exam}/results',        [ExamController::class, 'results'])->name('exams.results');
            Route::post('exams',                      [ExamController::class, 'store'])->name('exams.store')->middleware('permission:edit students');
            Route::put('exams/{exam}',                [ExamController::class, 'update'])->name('exams.update')->middleware('permission:edit students');
            Route::patch('exams/{exam}/status',       [ExamController::class, 'updateStatus'])->name('exams.update-status')->middleware('permission:edit students');
            Route::delete('exams/{exam}',             [ExamController::class, 'destroy'])->name('exams.destroy')->middleware('permission:edit students');
            Route::post('exams/{exam}/results',       [ExamController::class, 'saveResults'])->name('exams.results.save')->middleware('permission:edit students');
        });

        // ── D6: Student Course Enrollment ─────────────────────────────────────
        Route::middleware('permission:view students')->group(function () {
            Route::get('enrollments',                              [StudentEnrollmentController::class, 'index'])->name('enrollments.index');
            Route::get('enrollments/{student}',                   [StudentEnrollmentController::class, 'show'])->name('enrollments.show');
            Route::post('enrollments/{student}/enroll',           [StudentEnrollmentController::class, 'enroll'])->name('enrollments.enroll')->middleware('permission:edit students');
            Route::delete('enrollments/{enrollment}/drop',        [StudentEnrollmentController::class, 'drop'])->name('enrollments.drop')->middleware('permission:edit students');

            // ID Card & Photo Approval Desk Routes
            Route::get('id-cards', [\App\Http\Controllers\Admin\Student\AdminIdCardController::class, 'index'])->name('id-cards.index');
            Route::post('id-cards/{student}/approve-photo', [\App\Http\Controllers\Admin\Student\AdminIdCardController::class, 'approvePhoto'])->name('id-cards.approve-photo');
            Route::post('id-cards/{student}/reject-photo', [\App\Http\Controllers\Admin\Student\AdminIdCardController::class, 'rejectPhoto'])->name('id-cards.reject-photo');
            Route::post('id-cards/{student}/issue', [\App\Http\Controllers\Admin\Student\AdminIdCardController::class, 'issueCard'])->name('id-cards.issue');
        });

        // ── Support Tickets Resolver ──────────────────────────────────────────
        Route::middleware('permission:view students')->group(function () {
            Route::get('support-tickets', [\App\Http\Controllers\Admin\Support\AdminSupportController::class, 'index'])->name('support-tickets.index');
            Route::post('support-tickets/{id}/resolve', [\App\Http\Controllers\Admin\Support\AdminSupportController::class, 'resolve'])->name('support-tickets.resolve');
        });

        // ── Fee Invoices Management ────────────────────────────────────────────
        Route::middleware('permission:view students')->group(function () {
            Route::get('invoices', [\App\Http\Controllers\Admin\Finance\AdminInvoiceController::class, 'index'])->name('invoices.index');
            Route::post('invoices', [\App\Http\Controllers\Admin\Finance\AdminInvoiceController::class, 'store'])->name('invoices.store');
            Route::post('invoices/{id}/approve', [\App\Http\Controllers\Admin\Finance\AdminInvoiceController::class, 'approvePayment'])->name('invoices.approve');
            Route::post('invoices/{id}/reject', [\App\Http\Controllers\Admin\Finance\AdminInvoiceController::class, 'rejectPayment'])->name('invoices.reject');
        });
    });
