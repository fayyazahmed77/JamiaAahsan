<?php

namespace App\Http\Controllers\Admin\Video;

use App\Http\Controllers\Controller;
use App\Models\Video;
use App\Models\Media;
use App\Models\Speaker;
use App\Models\Category;
use App\Models\Year;
use App\Services\MediaUploadService;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\Video\StoreVideoRequest;
use App\Http\Requests\Admin\Video\UpdateVideoRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Str;

class VideoController extends Controller
{
    protected $uploadService;

    public function __construct(MediaUploadService $uploadService)
    {
        $this->uploadService = $uploadService;
    }

    public function index(Request $request): Response
    {
        $query = Video::query();

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
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('urdu_title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $videos = $query->with(['media.speaker', 'media.category', 'media.year', 'tags'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Video/Index', [
            'videos'     => $videos,
            'speakers'   => Speaker::where('status', true)->orderBy('name')->get(['id', 'name']),
            'categories' => Category::where('status', true)->where('type', 'video')->orderBy('name')->get(['id', 'name']),
            'years'      => Year::where('status', true)->orderBy('name', 'desc')->get(['id', 'name']),
            'filters'    => $request->only(['search', 'category_id', 'speaker_id', 'year_id', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Video/Create', [
            'speakers'   => Speaker::where('status', true)->orderBy('name')->get(['id', 'name']),
            'categories' => Category::where('status', true)->where('type', 'video')->orderBy('name')->get(['id', 'name']),
            'years'      => Year::where('status', true)->orderBy('name', 'desc')->get(['id', 'name']),
        ]);
    }

    public function show(Video $video): Response
    {
        $video->load(['media.speaker', 'media.category', 'media.year', 'tags']);

        return Inertia::render('Admin/Video/Show', [
            'video' => [
                'id'               => $video->id,
                'title'            => $video->title,
                'slug'             => $video->slug,
                'urdu_title'       => $video->urdu_title,
                'uri'              => $video->uri,
                'youtube_url'      => $video->youtube_url,
                'description'      => $video->description,
                'views'            => $video->views,
                'watch_time'       => $video->watch_time,
                'thumbnail_uri'    => $video->thumbnail_uri,
                'status'           => $video->status,
                'duration'         => $video->duration,
                'width'            => $video->width,
                'height'           => $video->height,
                'file_size'        => $video->file_size,
                'mime_type'        => $video->mime_type,
                'created_at'       => $video->created_at,
                'speaker'          => $video->media?->speaker,
                'category'         => $video->media?->category,
                'year'             => $video->media?->year,
                'tags'             => $video->tags->pluck('name')->toArray(),
            ],
        ]);
    }

    public function store(StoreVideoRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $request) {
            $uri = $validated['uri'] ?? '';
            $fileSize = $validated['file_size'] ?? null;
            $mimeType = $validated['mime_type'] ?? null;

            if ($request->hasFile('video_file')) {
                $file = $request->file('video_file');
                $uri = $this->uploadService->uploadVideo($file);
                $fileSize = $file->getSize();
                $mimeType = $file->getMimeType();
            }

            $thumbnailUri = $validated['thumbnail_uri'] ?? null;
            if ($request->hasFile('thumbnail')) {
                $thumbnailUri = $this->uploadService->uploadThumbnail($request->file('thumbnail'));
            }

            $slug = ($validated['slug'] ?? null) ?: Str::slug($validated['title']);
            // Ensure unique slug
            $originalSlug = $slug;
            $count = 1;
            while (Video::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }

            $video = Video::create([
                'title'            => $validated['title'],
                'slug'             => $slug,
                'urdu_title'       => $validated['urdu_title'] ?? null,
                'uri'              => $uri,
                'duration'         => $validated['duration'] ?? null,
                'width'            => $validated['width'] ?? null,
                'height'           => $validated['height'] ?? null,
                'file_size'        => $fileSize,
                'mime_type'        => $mimeType,
                'youtube_url'      => $validated['youtube_url'] ?? null,
                'description'      => $validated['description'] ?? null,
                'meta_title'       => $validated['meta_title'] ?? null,
                'meta_description' => $validated['meta_description'] ?? null,
                'thumbnail_uri'    => $thumbnailUri,
                'status'           => $validated['status'],
                'views'            => 0,
            ]);

            Media::create([
                'video_id'    => $video->id,
                'speaker_id'  => $validated['speaker_id'],
                'category_id' => $validated['category_id'],
                'year_id'     => $validated['year_id'],
                'type'        => 'video',
                'status'      => $validated['status'],
                'user_id'     => Auth::id(),
                'uri'         => $uri,
            ]);

            if (!empty($validated['tags'])) {
                $video->attachTags($validated['tags']);
            }
        });

        return redirect()->route('admin.videos.index')->with('success', 'Video uploaded successfully.');
    }

    public function edit(Video $video): Response
    {
        $video->load(['media', 'tags']);

        return Inertia::render('Admin/Video/Edit', [
            'video' => [
                'id'               => $video->id,
                'title'            => $video->title,
                'slug'             => $video->slug,
                'urdu_title'       => $video->urdu_title,
                'uri'              => $video->uri,
                'duration'         => $video->duration,
                'width'            => $video->width,
                'height'           => $video->height,
                'file_size'        => $video->file_size,
                'mime_type'        => $video->mime_type,
                'youtube_url'      => $video->youtube_url,
                'description'      => $video->description,
                'meta_title'       => $video->meta_title,
                'meta_description' => $video->meta_description,
                'thumbnail_uri'    => $video->thumbnail_uri,
                'status'           => $video->status,
                'views'            => $video->views,
                'speaker_id'       => $video->media?->speaker_id,
                'category_id'      => $video->media?->category_id,
                'year_id'          => $video->media?->year_id,
                'tags'             => $video->tags->pluck('name')->toArray(),
            ],
            'speakers'   => Speaker::where('status', true)->orderBy('name')->get(['id', 'name']),
            'categories' => Category::where('status', true)->where('type', 'video')->orderBy('name')->get(['id', 'name']),
            'years'      => Year::where('status', true)->orderBy('name', 'desc')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateVideoRequest $request, Video $video): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $request, $video) {
            $uri = $validated['uri'] ?? $video->uri;
            $fileSize = $validated['file_size'] ?? $video->file_size;
            $mimeType = $validated['mime_type'] ?? $video->mime_type;

            if ($request->hasFile('video_file')) {
                if ($video->uri && !str_starts_with($video->uri, 'http')) {
                    $this->uploadService->deleteFile('media', $video->uri);
                }
                $file = $request->file('video_file');
                $uri = $this->uploadService->uploadVideo($file);
                $fileSize = $file->getSize();
                $mimeType = $file->getMimeType();
            }

            $thumbnailUri = $validated['thumbnail_uri'] ?? $video->thumbnail_uri;
            if ($request->hasFile('thumbnail')) {
                if ($video->thumbnail_uri && !str_starts_with($video->thumbnail_uri, 'http')) {
                    $this->uploadService->deleteFile('thumbnails', $video->thumbnail_uri);
                }
                $thumbnailUri = $this->uploadService->uploadThumbnail($request->file('thumbnail'));
            }

            $slug = ($validated['slug'] ?? null) ?: Str::slug($validated['title']);
            $originalSlug = $slug;
            $count = 1;
            while (Video::where('slug', $slug)->where('id', '!=', $video->id)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }

            $video->update([
                'title'            => $validated['title'],
                'slug'             => $slug,
                'urdu_title'       => $validated['urdu_title'] ?? null,
                'uri'              => $uri,
                'duration'         => $validated['duration'] ?? null,
                'width'            => $validated['width'] ?? null,
                'height'           => $validated['height'] ?? null,
                'file_size'        => $fileSize,
                'mime_type'        => $mimeType,
                'youtube_url'      => $validated['youtube_url'] ?? null,
                'description'      => $validated['description'] ?? null,
                'meta_title'       => $validated['meta_title'] ?? null,
                'meta_description' => $validated['meta_description'] ?? null,
                'thumbnail_uri'    => $thumbnailUri,
                'status'           => $validated['status'],
            ]);

            Media::updateOrCreate(
                ['video_id' => $video->id],
                [
                    'speaker_id'  => $validated['speaker_id'],
                    'category_id' => $validated['category_id'],
                    'year_id'     => $validated['year_id'],
                    'type'        => 'video',
                    'status'      => $validated['status'],
                    'uri'         => $uri,
                ]
            );

            if (isset($validated['tags'])) {
                $video->syncTags($validated['tags']);
            }
        });

        return redirect()->route('admin.videos.index')->with('success', 'Video updated successfully.');
    }

    public function destroy(Video $video): RedirectResponse
    {
        DB::transaction(function () use ($video) {
            if ($video->uri && !str_starts_with($video->uri, 'http')) {
                $this->uploadService->deleteFile('media', $video->uri);
            }
            if ($video->thumbnail_uri && !str_starts_with($video->thumbnail_uri, 'http')) {
                $this->uploadService->deleteFile('thumbnails', $video->thumbnail_uri);
            }
            Media::where('video_id', $video->id)->delete();
            $video->delete();
        });

        return redirect()->back()->with('success', 'Video deleted successfully.');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'exists:videos,id',
        ]);

        $ids = $request->input('ids');

        DB::transaction(function () use ($ids) {
            foreach ($ids as $id) {
                $video = Video::find($id);
                if ($video) {
                    if ($video->uri && !str_starts_with($video->uri, 'http')) {
                        $this->uploadService->deleteFile('media', $video->uri);
                    }
                    if ($video->thumbnail_uri && !str_starts_with($video->thumbnail_uri, 'http')) {
                        $this->uploadService->deleteFile('thumbnails', $video->thumbnail_uri);
                    }
                    Media::where('video_id', $video->id)->delete();
                    $video->delete();
                }
            }
        });

        return redirect()->back()->with('success', 'Selected videos deleted successfully.');
    }
}
