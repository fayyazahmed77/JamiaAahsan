<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Audio;
use App\Http\Resources\AudioResource;
use Illuminate\Http\Request;

class AudioController extends Controller
{
    public function index(Request $request)
    {
        $query = Audio::query()->where('status', true);

        if ($request->has('category_id') || $request->has('speaker_id') || $request->has('year_id')) {
            $query->whereHas('media', function ($q) use ($request) {
                if ($request->filled('category_id')) {
                    $q->where('category_id', $request->category_id);
                }
                if ($request->filled('speaker_id')) {
                    $q->where('speaker_id', $request->speaker_id);
                }
                if ($request->filled('year_id')) {
                    $q->where('year_id', $request->year_id);
                }
            });
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        $records = $query
            ->with(['media.speaker', 'media.category', 'media.year', 'tags'])
            ->orderBy('publish_date', 'desc')
            ->paginate($request->get('per_page', 15));

        return AudioResource::collection($records);
    }

    public function latest()
    {
        $records = Audio::where('status', true)
            ->where(function($q) {
                $q->whereNull('publish_date')->orWhere('publish_date', '<=', now());
            })
            ->with(['media.speaker', 'media.category', 'media.year', 'tags'])
            ->orderBy('publish_date', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'error' => false,
            'data' => [
                'records' => AudioResource::collection($records)
            ]
        ]);
    }

    public function show($id)
    {
        $audio = Audio::with(['media.speaker', 'media.category', 'media.year', 'tags'])->findOrFail($id);
        return new AudioResource($audio);
    }

    public function byCategory($cat, $year)
    {
        $records = Audio::where('status', true)
            ->whereHas('media', function ($q) use ($cat, $year) {
                $q->where('category_id', $cat)->where('year_id', $year);
            })
            ->with(['media.speaker', 'media.category', 'media.year', 'tags'])
            ->orderBy('publish_date', 'desc')
            ->get();

        return AudioResource::collection($records);
    }

    public function markView($id)
    {
        $audio = Audio::findOrFail($id);
        $audio->increment('views');

        return response()->json([
            'error' => false,
            'views' => $audio->views,
            'message' => 'View marked successfully',
        ]);
    }
}
