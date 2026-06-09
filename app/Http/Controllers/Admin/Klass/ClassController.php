<?php

namespace App\Http\Controllers\Admin\Klass;

use App\Http\Controllers\Controller;
use App\Models\Klass;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;

class ClassController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Klass::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $classes = $query->orderBy('sort', 'asc')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Class/Index', [
            'classes' => $classes,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Class/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'              => 'required|string|max:255',
            'slug'              => 'nullable|string|max:255|unique:classes,slug',
            'description'       => 'nullable|string',
            'live_link'         => 'nullable|url|max:255',
            'youtube_live_link' => 'nullable|url|max:255',
            'sort'              => 'nullable|integer',
            'status'            => 'required|boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        Klass::create($validated);

        return redirect()->route('admin.classes.index')->with('success', 'Class created successfully.');
    }

    public function edit(Klass $class): Response
    {
        return Inertia::render('Admin/Class/Form', [
            'klass' => $class
        ]);
    }

    public function update(Request $request, Klass $class): RedirectResponse
    {
        $validated = $request->validate([
            'name'              => 'required|string|max:255',
            'slug'              => 'nullable|string|max:255|unique:classes,slug,' . $class->id,
            'description'       => 'nullable|string',
            'live_link'         => 'nullable|url|max:255',
            'youtube_live_link' => 'nullable|url|max:255',
            'sort'              => 'nullable|integer',
            'status'            => 'required|boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $class->update($validated);

        return redirect()->route('admin.classes.index')->with('success', 'Class updated successfully.');
    }

    public function destroy(Klass $class): RedirectResponse
    {
        if ($class->classSessions()->exists() || $class->userDetails()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete class with associated sessions or student registrations.');
        }

        $class->delete();

        return redirect()->route('admin.classes.index')->with('success', 'Class deleted successfully.');
    }
}
