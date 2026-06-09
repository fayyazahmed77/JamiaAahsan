<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Audio;
use App\Models\Video;
use App\Models\Speaker;
use App\Models\Category;
use App\Models\Year;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;

class MediaController extends Controller
{
    /**
     * Display the searchable and filterable audio library.
     */
    public function audio(Request $request): Response
    {
        $query = Audio::with(['media.speaker', 'media.category', 'media.year'])
            ->where('status', true);

        if ($request->filled('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'like', $searchTerm)
                  ->orWhere('description', 'like', $searchTerm);
            });
        }

        if ($request->filled('speaker_id')) {
            $query->whereHas('media', function($q) use ($request) {
                $q->where('speaker_id', $request->speaker_id);
            });
        }

        if ($request->filled('category_id')) {
            $query->whereHas('media', function($q) use ($request) {
                $q->where('category_id', $request->category_id);
            });
        }

        if ($request->filled('year_id')) {
            $query->whereHas('media', function($q) use ($request) {
                $q->where('year_id', $request->year_id);
            });
        }

        $paginated = $query->orderBy('created_at', 'desc')->paginate(12)->withQueryString();

        // Flatten media relationships so frontend can access speaker/category/year directly
        $transformed = $paginated->through(function ($audio) {
            return [
                'id'            => $audio->id,
                'title'         => $audio->title,
                'slug'          => $audio->slug,
                'user_title'    => $audio->user_title,
                'uri'           => $audio->uri,
                'youtube_url'   => $audio->youtube_url,
                'description'   => $audio->description,
                'views'         => $audio->views,
                'thumbnail_uri' => $audio->thumbnail_uri,
                'publish_date'  => $audio->publish_date,
                'status'        => $audio->status,
                'speaker'       => $audio->media?->speaker,
                'category'      => $audio->media?->category,
                'year'          => $audio->media?->year,
                'created_at'    => $audio->created_at,
                'updated_at'    => $audio->updated_at,
            ];
        });

        return Inertia::render('Public/Media/Audio', [
            'audios'     => $transformed,
            'speakers'   => Cache::remember('speakers_active', now()->addDay(), fn() => Speaker::where('status', true)->orderBy('name', 'asc')->get()),
            'categories' => Cache::remember('categories_active_audio', now()->addDay(), fn() => Category::where('type', 'audio')->where('status', true)->orderBy('name', 'asc')->get()),
            'years'      => Cache::remember('years_active', now()->addDay(), fn() => Year::where('status', true)->orderBy('name', 'desc')->get()),
            'filters'    => $request->only(['search', 'speaker_id', 'category_id', 'year_id']),
        ]);
    }

    /**
     * Display a specific audio lecture with its player and popular audio sidebar.
     */
    public function showAudio(Audio $audio): Response
    {
        $audio->load(['media.speaker', 'media.category', 'media.year']);

        // Fetch 5 popular audio items sorted by views
        $popularAudio = Audio::with(['media.speaker', 'media.category', 'media.year'])
            ->where('status', true)
            ->where('id', '!=', $audio->id)
            ->orderBy('views', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Public/Media/AudioShow', [
            'audio' => [
                'id'            => $audio->id,
                'title'         => $audio->title,
                'slug'          => $audio->slug,
                'user_title'    => $audio->user_title,
                'uri'           => $audio->uri,
                'youtube_url'   => $audio->youtube_url,
                'description'   => $audio->description,
                'views'         => $audio->views,
                'thumbnail_uri' => $audio->thumbnail_uri,
                'publish_date'  => $audio->publish_date,
                'status'        => $audio->status,
                'speaker'       => $audio->media?->speaker,
                'category'      => $audio->media?->category,
                'year'          => $audio->media?->year,
                'created_at'    => $audio->created_at,
            ],
            'popularAudio' => $popularAudio->map(function ($a) {
                return [
                    'id'            => $a->id,
                    'title'         => $a->title,
                    'slug'          => $a->slug,
                    'user_title'    => $a->user_title,
                    'uri'           => $a->uri,
                    'youtube_url'   => $a->youtube_url,
                    'description'   => $a->description,
                    'views'         => $a->views,
                    'thumbnail_uri' => $a->thumbnail_uri,
                    'publish_date'  => $a->publish_date,
                    'speaker'       => $a->media?->speaker,
                    'category'      => $a->media?->category,
                    'year'          => $a->media?->year,
                    'created_at'    => $a->created_at,
                ];
            }),
        ]);
    }

    /**
     * Display the searchable and filterable video library.
     */
    public function video(Request $request): Response
    {
        $query = Video::with(['media.speaker', 'media.category', 'media.year'])
            ->where('status', true);

        if ($request->filled('search')) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('title', 'like', $searchTerm)
                  ->orWhere('description', 'like', $searchTerm);
            });
        }

        if ($request->filled('speaker_id')) {
            $query->whereHas('media', function($q) use ($request) {
                $q->where('speaker_id', $request->speaker_id);
            });
        }

        if ($request->filled('category_id')) {
            $query->whereHas('media', function($q) use ($request) {
                $q->where('category_id', $request->category_id);
            });
        }

        if ($request->filled('year_id')) {
            $query->whereHas('media', function($q) use ($request) {
                $q->where('year_id', $request->year_id);
            });
        }

        $paginated = $query->orderBy('created_at', 'desc')->paginate(12)->withQueryString();

        // Transform to flatten media relationships so frontend can access speaker/category/year directly
        $transformed = $paginated->through(function ($video) {
            return [
                'id'            => $video->id,
                'title'         => $video->title,
                'slug'          => $video->slug,
                'urdu_title'    => $video->urdu_title,
                'uri'           => $video->uri,
                'youtube_url'   => $video->youtube_url,
                'description'   => $video->description,
                'views'         => $video->views,
                'thumbnail_uri' => $video->thumbnail_uri,
                'status'        => $video->status,
                'speaker'       => $video->media?->speaker,
                'category'      => $video->media?->category,
                'year'          => $video->media?->year,
                'created_at'    => $video->created_at,
                'updated_at'    => $video->updated_at,
            ];
        });

        return Inertia::render('Public/Media/Video', [
            'videos'     => $transformed,
            'speakers'   => Cache::remember('speakers_active', now()->addDay(), fn() => Speaker::where('status', true)->orderBy('name', 'asc')->get()),
            'categories' => Cache::remember('categories_active_video', now()->addDay(), fn() => Category::where('type', 'video')->where('status', true)->orderBy('name', 'asc')->get()),
            'years'      => Cache::remember('years_active', now()->addDay(), fn() => Year::where('status', true)->orderBy('name', 'desc')->get()),
            'filters'    => $request->only(['search', 'speaker_id', 'category_id', 'year_id']),
        ]);
    }

    /**
     * Display a specific video with its player and popular videos.
     */
    public function showVideo(Video $video): Response
    {
        $video->load(['media.speaker', 'media.category', 'media.year']);

        // Fetch popular bayanat/videos (e.g. 5 videos sorted by views)
        $popularVideos = Video::with(['media.speaker', 'media.category', 'media.year'])
            ->where('status', true)
            ->where('id', '!=', $video->id)
            ->orderBy('views', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Public/Media/VideoShow', [
            'video' => [
                'id'               => $video->id,
                'title'            => $video->title,
                'slug'             => $video->slug,
                'urdu_title'       => $video->urdu_title,
                'uri'              => $video->uri,
                'youtube_url'      => $video->youtube_url,
                'description'      => $video->description,
                'views'            => $video->views,
                'thumbnail_uri'    => $video->thumbnail_uri,
                'status'           => $video->status,
                'speaker'          => $video->media?->speaker,
                'category'         => $video->media?->category,
                'year'             => $video->media?->year,
                'created_at'       => $video->created_at,
            ],
            'popularVideos' => $popularVideos->map(function ($v) {
                return [
                    'id'               => $v->id,
                    'title'            => $v->title,
                    'slug'             => $v->slug,
                    'urdu_title'       => $v->urdu_title,
                    'uri'              => $v->uri,
                    'youtube_url'      => $v->youtube_url,
                    'description'      => $v->description,
                    'views'            => $v->views,
                    'thumbnail_uri'    => $v->thumbnail_uri,
                    'speaker'          => $v->media?->speaker,
                    'category'         => $v->media?->category,
                    'year'             => $v->media?->year,
                    'created_at'       => $v->created_at,
                ];
            }),
        ]);
    }

    /**
     * Display the live stream channel.
     */
    public function live(): Response
    {
        $settings = \App\Models\Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Public/Media/Live', [
            'youtube_live_url' => $settings['youtube_live_url'] ?? 'https://www.youtube.com/embed/live_stream',
            'is_live' => filter_var($settings['is_live'] ?? false, FILTER_VALIDATE_BOOLEAN),
        ]);
    }
}
