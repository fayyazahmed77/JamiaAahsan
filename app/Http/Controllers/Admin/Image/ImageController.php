<?php

namespace App\Http\Controllers\Admin\Image;

use App\Http\Controllers\Controller;
use App\Models\Image;
use App\Services\MediaUploadService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ImageController extends Controller
{
    protected $uploadService;

    public function __construct(MediaUploadService $uploadService)
    {
        $this->uploadService = $uploadService;
    }

    public function index(Request $request): Response
    {
        $query = Image::query()->whereNull('parent_id');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%{$search}%");
        }

        if ($request->has('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $images = $query->orderBy('weight', 'asc')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Image/Index', [
            'images'  => $images,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Image/Form', [
            'parent_images' => Image::whereNull('parent_id')->get(['id', 'title']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'       => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'btn_title'   => 'nullable|string|max:100',
            'btn_link'    => 'nullable|string|max:255',
            'weight'      => 'nullable|integer',
            'parent_id'   => 'nullable|exists:images,id',
            'status'      => 'required|boolean',
            'image'       => 'required|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $validated['uri'] = $this->uploadService->uploadImage($request->file('image'));
        }

        Image::create($validated);

        return redirect()->route('admin.images.index')->with('success', 'Image uploaded successfully.');
    }

    public function edit(Image $image): Response
    {
        return Inertia::render('Admin/Image/Form', [
            'image'         => $image,
            'parent_images' => Image::whereNull('parent_id')->where('id', '!=', $image->id)->get(['id', 'title']),
        ]);
    }

    public function update(Request $request, Image $image): RedirectResponse
    {
        $validated = $request->validate([
            'title'       => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'btn_title'   => 'nullable|string|max:100',
            'btn_link'    => 'nullable|string|max:255',
            'weight'      => 'nullable|integer',
            'parent_id'   => 'nullable|exists:images,id',
            'status'      => 'required|boolean',
            'image'       => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            if ($image->uri && !str_starts_with($image->uri, 'http')) {
                $this->uploadService->deleteFile('media', $image->uri);
            }
            $validated['uri'] = $this->uploadService->uploadImage($request->file('image'));
        }

        $image->update($validated);

        return redirect()->route('admin.images.index')->with('success', 'Image updated successfully.');
    }

    public function destroy(Image $image): RedirectResponse
    {
        if ($image->uri && !str_starts_with($image->uri, 'http')) {
            $this->uploadService->deleteFile('media', $image->uri);
        }
        $image->delete();

        return redirect()->route('admin.images.index')->with('success', 'Image deleted successfully.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|exists:images,id',
        ]);

        foreach ($request->input('ids') as $index => $id) {
            Image::where('id', $id)->update(['weight' => $index]);
        }

        return redirect()->back()->with('success', 'Images reordered successfully.');
    }
}
