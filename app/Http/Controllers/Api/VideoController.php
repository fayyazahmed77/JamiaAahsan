<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use App\Http\Resources\VideoResource;
use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function index(Request $request)
    {
        $query = Video::query()->where('status', true);

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
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return VideoResource::collection($records);
    }

    public function show($id)
    {
        $video = Video::with(['media.speaker', 'media.category', 'media.year', 'tags'])->findOrFail($id);
        return new VideoResource($video);
    }

    public function markView($id)
    {
        $video = Video::findOrFail($id);
        $video->increment('views');

        return response()->json([
            'error' => false,
            'views' => $video->views,
            'message' => 'View marked successfully',
        ]);
    }
}
