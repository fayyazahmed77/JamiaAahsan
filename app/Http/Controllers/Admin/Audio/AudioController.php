<?php

namespace App\Http\Controllers\Admin\Audio;

use App\Http\Controllers\Controller;
use App\Models\Audio;
use App\Models\Media;
use App\Models\Speaker;
use App\Models\Category;
use App\Models\Year;
use App\Services\MediaUploadService;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\Audio\StoreAudioRequest;
use App\Http\Requests\Admin\Audio\UpdateAudioRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AudioController extends Controller
{
    protected $uploadService;

    public function __construct(MediaUploadService $uploadService)
    {
        $this->uploadService = $uploadService;
    }

    public function index(Request $request): Response
    {
        $query = Audio::query();

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
                  ->orWhere('user_title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $audio = $query->with(['media.speaker', 'media.category', 'media.year', 'tags'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Audio/Index', [
            'audio'      => $audio,
            'speakers'   => Speaker::where('status', true)->orderBy('name')->get(['id', 'name']),
            'categories' => Category::where('status', true)->where('type', 'audio')->orderBy('name')->get(['id', 'name']),
            'years'      => Year::where('status', true)->orderBy('name', 'desc')->get(['id', 'name']),
            'filters'    => $request->only(['search', 'category_id', 'speaker_id', 'year_id', 'status']),
        ]);
    }

    public function show(Audio $audio): Response
    {
        $audio->load(['media.speaker', 'media.category', 'media.year', 'tags']);

        return Inertia::render('Admin/Audio/Show', [
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
                'publish_date'  => $audio->publish_date?->format('Y-m-d H:i:s'),
                'status'        => $audio->status,
                'tags'          => $audio->tags->pluck('name')->toArray(),
                'speaker'       => $audio->media?->speaker,
                'category'      => $audio->media?->category,
                'year'          => $audio->media?->year,
                'created_at'    => $audio->created_at,
                'updated_at'    => $audio->updated_at,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Audio/Create', [
            'speakers'   => Speaker::where('status', true)->orderBy('name')->get(['id', 'name']),
            'categories' => Category::where('status', true)->where('type', 'audio')->orderBy('name')->get(['id', 'name']),
            'years'      => Year::where('status', true)->orderBy('name', 'desc')->get(['id', 'name']),
        ]);
    }

    public function store(StoreAudioRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $request) {
            // Handle audio file upload or use external link
            $uri = $validated['uri'] ?? '';
            if ($request->hasFile('audio_file')) {
                $uri = $this->uploadService->uploadAudio($request->file('audio_file'));
            }

            // Handle thumbnail upload or use external link
            $thumbnailUri = $validated['thumbnail_uri'] ?? null;
            if ($request->hasFile('thumbnail')) {
                $thumbnailUri = $this->uploadService->uploadThumbnail($request->file('thumbnail'));
            }

            $audio = Audio::create([
                'title'         => $validated['title'],
                'user_title'    => $validated['user_title'] ?? null,
                'uri'           => $uri,
                'youtube_url'   => $validated['youtube_url'] ?? null,
                'description'   => $validated['description'] ?? null,
                'thumbnail_uri' => $thumbnailUri,
                'publish_date'  => ($validated['publish_date'] ?? null) ? now()->parse($validated['publish_date']) : null,
                'status'        => $validated['status'],
                'views'         => 0,
            ]);

            // Create Media record
            Media::create([
                'audio_id'    => $audio->id,
                'speaker_id'  => $validated['speaker_id'],
                'category_id' => $validated['category_id'],
                'year_id'     => $validated['year_id'],
                'type'        => 'audio',
                'status'      => $validated['status'],
                'user_id'     => auth()->id(),
                'uri'         => $uri,
            ]);

            // Handle tags
            if (!empty($validated['tags'])) {
                $audio->attachTags($validated['tags']);
            }
        });

        return redirect()->route('admin.audio.index')->with('success', 'Audio uploaded successfully.');
    }

    public function edit(Audio $audio): Response
    {
        $audio->load(['media', 'tags']);
        
        return Inertia::render('Admin/Audio/Edit', [
            'audio' => [
                'id'            => $audio->id,
                'title'         => $audio->title,
                'user_title'    => $audio->user_title,
                'uri'           => $audio->uri,
                'youtube_url'   => $audio->youtube_url,
                'description'   => $audio->description,
                'thumbnail_uri' => $audio->thumbnail_uri,
                'publish_date'  => $audio->publish_date ? $audio->publish_date->format('Y-m-d\TH:i') : null,
                'status'        => $audio->status,
                'speaker_id'    => $audio->media?->speaker_id,
                'category_id'   => $audio->media?->category_id,
                'year_id'       => $audio->media?->year_id,
                'tags'          => $audio->tags->pluck('name')->toArray(),
            ],
            'speakers'   => Speaker::where('status', true)->orderBy('name')->get(['id', 'name']),
            'categories' => Category::where('status', true)->where('type', 'audio')->orderBy('name')->get(['id', 'name']),
            'years'      => Year::where('status', true)->orderBy('name', 'desc')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateAudioRequest $request, Audio $audio): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $request, $audio) {
            $uri = $validated['uri'] ?? $audio->uri;
            if ($request->hasFile('audio_file')) {
                // Delete old file if existed
                if ($audio->uri && !str_starts_with($audio->uri, 'http')) {
                    $this->uploadService->deleteFile('media', $audio->uri);
                }
                $uri = $this->uploadService->uploadAudio($request->file('audio_file'));
            }

            $thumbnailUri = $validated['thumbnail_uri'] ?? $audio->thumbnail_uri;
            if ($request->hasFile('thumbnail')) {
                // Delete old thumbnail if existed
                if ($audio->thumbnail_uri && !str_starts_with($audio->thumbnail_uri, 'http')) {
                    $this->uploadService->deleteFile('thumbnails', $audio->thumbnail_uri);
                }
                $thumbnailUri = $this->uploadService->uploadThumbnail($request->file('thumbnail'));
            }

            $audio->update([
                'title'         => $validated['title'],
                'user_title'    => $validated['user_title'] ?? null,
                'uri'           => $uri,
                'youtube_url'   => $validated['youtube_url'] ?? null,
                'description'   => $validated['description'] ?? null,
                'thumbnail_uri' => $thumbnailUri,
                'publish_date'  => ($validated['publish_date'] ?? null) ? now()->parse($validated['publish_date']) : null,
                'status'        => $validated['status'],
            ]);

            // Update or create associated Media
            Media::updateOrCreate(
                ['audio_id' => $audio->id],
                [
                    'speaker_id'  => $validated['speaker_id'],
                    'category_id' => $validated['category_id'],
                    'year_id'     => $validated['year_id'],
                    'type'        => 'audio',
                    'status'      => $validated['status'],
                    'uri'         => $uri,
                ]
            );

            // Sync tags
            if (isset($validated['tags'])) {
                $audio->syncTags($validated['tags']);
            }
        });

        return redirect()->route('admin.audio.index')->with('success', 'Audio updated successfully.');
    }

    public function destroy(Audio $audio): RedirectResponse
    {
        DB::transaction(function () use ($audio) {
            // Delete actual files if locally hosted
            if ($audio->uri && !str_starts_with($audio->uri, 'http')) {
                $this->uploadService->deleteFile('media', $audio->uri);
            }
            if ($audio->thumbnail_uri && !str_starts_with($audio->thumbnail_uri, 'http')) {
                $this->uploadService->deleteFile('thumbnails', $audio->thumbnail_uri);
            }

            // Delete associated media
            Media::where('audio_id', $audio->id)->delete();
            $audio->delete();
        });

        return redirect()->back()->with('success', 'Audio deleted successfully.');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'exists:audio,id',
        ]);

        $ids = $request->input('ids');

        DB::transaction(function () use ($ids) {
            foreach ($ids as $id) {
                $audio = Audio::find($id);
                if ($audio) {
                    if ($audio->uri && !str_starts_with($audio->uri, 'http')) {
                        $this->uploadService->deleteFile('media', $audio->uri);
                    }
                    if ($audio->thumbnail_uri && !str_starts_with($audio->thumbnail_uri, 'http')) {
                        $this->uploadService->deleteFile('thumbnails', $audio->thumbnail_uri);
                    }
                    Media::where('audio_id', $audio->id)->delete();
                    $audio->delete();
                }
            }
        });

        return redirect()->back()->with('success', 'Selected audio records deleted successfully.');
    }

    public function importForm(): Response
    {
        return Inertia::render('Admin/Audio/Import');
    }

    public function import(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:10240', // max 10MB CSV
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();

        $handle = fopen($path, 'r');
        $header = fgetcsv($handle);

        // Required headers: title, speaker_id, category_id, year_id
        // Optional headers: user_title, uri, youtube_url, description, thumbnail_uri, status, tags
        $expectedHeaders = ['title', 'speaker_id', 'category_id', 'year_id'];
        foreach ($expectedHeaders as $req) {
            if (!in_array($req, $header)) {
                fclose($handle);
                return redirect()->back()->with('error', "CSV must contain the following columns: " . implode(', ', $expectedHeaders));
            }
        }

        $imported = 0;
        $errors = [];

        DB::transaction(function () use ($handle, $header, &$imported, &$errors) {
            $rowNumber = 1;
            while (($row = fgetcsv($handle)) !== false) {
                $rowNumber++;
                $data = array_combine($header, $row);

                // Quick validation
                if (empty($data['title']) || empty($data['speaker_id']) || empty($data['category_id']) || empty($data['year_id'])) {
                    $errors[] = "Row {$rowNumber}: Missing required fields.";
                    continue;
                }

                if (!Speaker::where('id', $data['speaker_id'])->exists()) {
                    $errors[] = "Row {$rowNumber}: Speaker ID {$data['speaker_id']} does not exist.";
                    continue;
                }

                if (!Category::where('id', $data['category_id'])->where('type', 'audio')->exists()) {
                    $errors[] = "Row {$rowNumber}: Audio Category ID {$data['category_id']} does not exist.";
                    continue;
                }

                if (!Year::where('id', $data['year_id'])->exists()) {
                    $errors[] = "Row {$rowNumber}: Year ID {$data['year_id']} does not exist.";
                    continue;
                }

                $audio = Audio::create([
                    'title'         => $data['title'],
                    'user_title'    => $data['user_title'] ?? null,
                    'uri'           => $data['uri'] ?? '',
                    'youtube_url'   => $data['youtube_url'] ?? null,
                    'description'   => $data['description'] ?? null,
                    'thumbnail_uri' => $data['thumbnail_uri'] ?? null,
                    'publish_date'  => isset($data['publish_date']) ? now()->parse($data['publish_date']) : null,
                    'status'        => filter_var($data['status'] ?? true, FILTER_VALIDATE_BOOLEAN),
                    'views'         => 0,
                ]);

                Media::create([
                    'audio_id'    => $audio->id,
                    'speaker_id'  => $data['speaker_id'],
                    'category_id' => $data['category_id'],
                    'year_id'     => $data['year_id'],
                    'type'        => 'audio',
                    'status'      => $audio->status,
                    'user_id'     => auth()->id(),
                    'uri'         => $audio->uri,
                ]);

                if (!empty($data['tags'])) {
                    $tags = array_map('trim', explode(',', $data['tags']));
                    $audio->attachTags($tags);
                }

                $imported++;
            }
        });

        fclose($handle);

        if (!empty($errors)) {
            $msg = "Imported {$imported} records. Errors: " . implode(' | ', array_slice($errors, 0, 5));
            if (count($errors) > 5) $msg .= " (and " . (count($errors) - 5) . " more)";
            return redirect()->route('admin.audio.index')->with('warning', $msg);
        }

        return redirect()->route('admin.audio.index')->with('success', "Successfully imported {$imported} audio records.");
    }
}
