<?php

namespace App\Http\Controllers\Admin\Category;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Category::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $categories = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Category/Index', [
            'categories' => $categories,
            'filters'    => $request->only(['search', 'type', 'status']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'type'   => 'required|string|in:audio,video',
            'slug'   => 'nullable|string|max:255',
            'status' => 'required|boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        Category::create($validated);

        Cache::forget('categories_active_audio');
        Cache::forget('categories_active_video');
        Cache::forget('categories_active_all');

        return redirect()->back()->with('success', 'Category created successfully.');
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'type'   => 'required|string|in:audio,video',
            'slug'   => 'nullable|string|max:255',
            'status' => 'required|boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category->update($validated);

        Cache::forget('categories_active_audio');
        Cache::forget('categories_active_video');
        Cache::forget('categories_active_all');

        return redirect()->back()->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        // Prevent deletion if category has media
        if ($category->media()->exists() || $category->downloadLinks()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete category with associated media or downloads.');
        }

        $category->delete();

        Cache::forget('categories_active_audio');
        Cache::forget('categories_active_video');
        Cache::forget('categories_active_all');

        return redirect()->back()->with('success', 'Category deleted successfully.');
    }
}
