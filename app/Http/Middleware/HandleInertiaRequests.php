<?php

namespace App\Http\Middleware;

use App\Http\Resources\SpeakerResource;
use App\Http\Resources\UserResource;
use App\Models\LatestNews;
use App\Models\PrayerTiming;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Cache;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user'        => $request->user()
                    ? new UserResource($request->user()->load('userDetail.class'))
                    : null,
                'permissions' => $request->user()?->getAllPermissions()->pluck('name') ?? [],
                'roles'       => $request->user()?->getRoleNames() ?? [],
            ],

            // ── Student Portal Guard ────────────────────────────────────
            'student_auth' => function () use ($request) {
                try {
                    $student = \Illuminate\Support\Facades\Auth::guard('student')->user();
                    if (!$student) return null;
                    return [
                        'id'                 => $student->id,
                        'name'               => $student->name,
                        'email'              => $student->email,
                        'student_id_number'  => $student->student_id_number,
                        'profile_photo_url'  => $student->profile_photo
                            ? asset('storage/' . $student->profile_photo)
                            : null,
                        'status'             => $student->status,
                        'student_type'       => $student->student_type,
                        'current_year'       => $student->current_year,
                        'current_semester'   => $student->current_semester,
                    ];
                } catch (\Throwable $e) {
                    return null;
                }
            },

            // ── Student Settings (for RTL, theme, language) ─────────────
            'student_settings' => function () use ($request) {
                try {
                    $student = \Illuminate\Support\Facades\Auth::guard('student')->user();
                    if (!$student) return null;
                    $settings = \App\Models\StudentSetting::where('student_id', $student->id)->first();
                    if (!$settings) return ['language' => 'en', 'theme' => 'system'];
                    return [
                        'language'             => $settings->language,
                        'theme'                => $settings->theme,
                        'notify_assignment'    => $settings->notify_assignment,
                        'notify_exam'          => $settings->notify_exam,
                        'notify_result'        => $settings->notify_result,
                        'notify_attendance'    => $settings->notify_attendance,
                        'notify_notice'        => $settings->notify_notice,
                        'notify_hifz'          => $settings->notify_hifz,
                    ];
                } catch (\Throwable $e) {
                    return null;
                }
            },

            // ── Unread notification count for bell badge ─────────────────
            'unread_count' => function () use ($request) {
                try {
                    $student = \Illuminate\Support\Facades\Auth::guard('student')->user();
                    if (!$student) return 0;
                    return \App\Models\StudentNotification::where('student_id', $student->id)
                        ->where('is_read', false)->count();
                } catch (\Throwable $e) {
                    return 0;
                }
            },

            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
                'timestamp' => microtime(true),
            ],

            'prayer_timings' => fn () => Cache::remember('prayer_timings', now()->addDay(), fn () => PrayerTiming::all()),

            'latest_news'    => fn () => LatestNews::where('status', true)
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get(['id', 'text', 'link']),

            'locale' => session('locale', 'en'),
            'dir'    => session('locale', 'en') === 'ur' ? 'rtl' : 'ltr',
            'translations' => function () {
                $locale = app()->getLocale();
                $path = lang_path($locale);
                if (!is_dir($path)) {
                    $path = base_path('lang/' . $locale); // fallback check for local environment structure
                }
                if (!is_dir($path)) {
                    return [];
                }
                $files = glob($path . '/*.php');
                $translations = [];
                foreach ($files as $file) {
                    $name = pathinfo($file, PATHINFO_FILENAME);
                    $translations[$name] = require $file;
                }
                return $translations;
            },
        ]);
    }
}
