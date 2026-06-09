<?php

namespace App\Http\Controllers\Admin\Speaker;

use App\Http\Controllers\Controller;
use App\Models\Speaker;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

use App\Services\MediaUploadService;

use App\Http\Requests\Admin\Speaker\StoreSpeakerRequest;
use Illuminate\Support\Facades\Cache;

class SpeakerController extends Controller
{
    protected $uploadService;

    public function __construct(MediaUploadService $uploadService)
    {
        $this->uploadService = $uploadService;
    }

    public function index(Request $request): Response
    {
        $query = Speaker::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('short_name', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $speakers = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Speaker/Index', [
            'speakers' => $speakers,
            'filters'  => $request->only(['search', 'status']),
        ]);
    }

    public function store(StoreSpeakerRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $validated['image'] = $this->uploadService->uploadThumbnail($request->file('image'));
        }

        Speaker::create($validated);

        Cache::forget('speakers_active');

        return redirect()->back()->with('success', 'Speaker created successfully.');
    }

    public function update(StoreSpeakerRequest $request, Speaker $speaker): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            if ($speaker->image && !str_starts_with($speaker->image, 'http')) {
                $this->uploadService->deleteFile('thumbnails', $speaker->image);
            }
            $validated['image'] = $this->uploadService->uploadThumbnail($request->file('image'));
        }

        $speaker->update($validated);

        Cache::forget('speakers_active');

        return redirect()->back()->with('success', 'Speaker updated successfully.');
    }

    public function destroy(Speaker $speaker): RedirectResponse
    {
        // Prevent deletion if speaker has media
        if ($speaker->media()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete speaker with associated media.');
        }

        if ($speaker->image && !str_starts_with($speaker->image, 'http')) {
            $this->uploadService->deleteFile('thumbnails', $speaker->image);
        }

        $speaker->delete();

        Cache::forget('speakers_active');

        return redirect()->back()->with('success', 'Speaker deleted successfully.');
    }
}
