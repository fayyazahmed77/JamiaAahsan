<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        \Illuminate\Support\Facades\Gate::before(function ($user, $ability) {
            return $user->hasRole('Super Admin') ? true : null;
        });

        \Illuminate\Support\Facades\Gate::policy(\Spatie\Permission\Models\Role::class, \App\Policies\RolePolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Audio::class, \App\Policies\AudioPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Video::class, \App\Policies\VideoPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Image::class, \App\Policies\ImagePolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\UserDetail::class, \App\Policies\AdmissionPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Feedback::class, \App\Policies\FeedbackPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\User::class, \App\Policies\UserPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\DownloadLink::class, \App\Policies\DownloadLinkPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\LatestNews::class, \App\Policies\LatestNewsPolicy::class);
        // C3: New policies
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Student::class, \App\Policies\StudentPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\HifzEnrollment::class, \App\Policies\HifzPolicy::class);
        \Illuminate\Support\Facades\Gate::policy(\App\Models\Assignment::class, \App\Policies\AssignmentPolicy::class);

        // Events & Listeners
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\AdmissionSubmitted::class,
            \App\Listeners\SendAdmissionSubmittedEmail::class
        );
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\AdmissionApproved::class,
            \App\Listeners\SendAdmissionApprovedNotification::class
        );
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\AdmissionApproved::class,
            \App\Listeners\CreateStudentAccount::class
        );
        \Illuminate\Support\Facades\Event::listen(
            \App\Events\AdmissionRejected::class,
            \App\Listeners\SendAdmissionRejectedNotification::class
        );

        // ── B1: Dashboard cache invalidation observers ─────────────────────
        // Bust the 15-minute stats cache whenever these records change.
        $bustDashboard = fn() => \Illuminate\Support\Facades\Cache::forget('admin_dashboard_stats');

        \App\Models\Audio::created($bustDashboard);
        \App\Models\Audio::deleted($bustDashboard);
        \App\Models\Video::created($bustDashboard);
        \App\Models\Video::deleted($bustDashboard);
        \App\Models\UserDetail::saved($bustDashboard);
        \App\Models\UserDetail::deleted($bustDashboard);
        \App\Models\Feedback::created($bustDashboard);
        \App\Models\Feedback::deleted($bustDashboard);
        \App\Models\Image::created($bustDashboard);
        \App\Models\Image::deleted($bustDashboard);

        // ── C2: Rate limiters (moved here from bootstrap/app.php — Facades are ──
        //        not available inside withMiddleware() at bootstrap time).
        RateLimiter::for('public-forms', function (Request $request) {
            return Limit::perMinute(5)
                ->by($request->ip())
                ->response(fn() => back()->withErrors([
                    'form' => 'Too many submissions. Please wait a moment and try again.',
                ]));
        });

        RateLimiter::for('student-auth', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });
    }
}

