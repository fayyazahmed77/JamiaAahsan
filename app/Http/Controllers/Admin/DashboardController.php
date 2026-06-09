<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Audio;
use App\Models\Feedback;
use App\Models\Image;
use App\Models\UserDetail;
use App\Models\Video;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // ── Aggregate stats cached for 15 minutes ────────────────────────────
        // Uses CACHE_STORE=database driver — no Redis required.
        // Cache is invalidated by model observers in AppServiceProvider.
        $stats = Cache::remember('admin_dashboard_stats', now()->addMinutes(15), function () {
            return [
                'audio_count'          => Audio::count(),
                'video_count'          => Video::count(),
                'image_count'          => Image::count(),
                'audio_views'          => Audio::sum('views'),
                'video_views'          => Video::sum('views'),
                'admissions_total'     => UserDetail::count(),
                'admissions_pending'   => UserDetail::where('is_approved', false)->count(),
                'admissions_approved'  => UserDetail::where('is_approved', true)->count(),
                'feedback_count'       => Feedback::count(),
                'feedback_avg_rating'  => round(Feedback::avg('rating') ?? 0, 1),
                'rating_breakdown'     => Feedback::selectRaw('rating, COUNT(*) as count')
                    ->groupBy('rating')
                    ->orderBy('rating', 'desc')
                    ->pluck('count', 'rating')
                    ->toArray(),
            ];
        });

        // ── Recent items (not cached — always fresh) ─────────────────────────
        $recentFeedback = Feedback::latest()
            ->take(5)
            ->get(['id', 'name', 'rating', 'comment', 'country', 'created_at']);

        $latestAudio = Audio::with(['media.speaker', 'media.category'])
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'views', 'status', 'created_at']);

        return Inertia::render('Admin/Dashboard/Index', [
            'stats'           => $stats,
            'recent_feedback' => $recentFeedback,
            'latest_audio'    => $latestAudio,
        ]);
    }
}
