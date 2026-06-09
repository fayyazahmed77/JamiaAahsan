<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Audio;
use App\Models\Video;
use App\Models\PrayerTiming;
use App\Models\LatestNews;
use App\Models\Klass;
use App\Models\Teacher;
use App\Models\Image;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;

class HomeController extends Controller
{
    /**
     * Display the public homepage.
     */
    public function index(): Response
    {
        return Inertia::render('Public/Home', [
            'banners' => Image::where('status', true)
                ->orderBy('weight', 'asc')
                ->get(),
            'prayer_timings' => Cache::remember('prayer_timings', now()->addDay(), fn() => PrayerTiming::all()),
            'latest_news' => LatestNews::where('status', true)
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get(),
            'featured_audio' => Audio::with(['media.speaker', 'media.category', 'media.year'])
                ->where('status', true)
                ->orderBy('created_at', 'desc')
                ->take(6)
                ->get(),
            'featured_video' => Video::with(['media.speaker', 'media.category', 'media.year'])
                ->where('status', true)
                ->orderBy('created_at', 'desc')
                ->take(6)
                ->get(),
            'classes' => Klass::where('status', true)
                ->orderBy('sort', 'asc')
                ->get(),
            'stats' => [
                'audio_count' => Audio::where('status', true)->count(),
                'video_count' => Video::where('status', true)->count(),
                'teacher_count' => Teacher::where('status', true)->count(),
                'class_count' => Klass::where('status', true)->count(),
            ]
        ]);
    }
}
