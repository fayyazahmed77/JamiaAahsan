<?php

namespace App\Http\Controllers\Admin\Department;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Gate;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('view settings');

        $query = Department::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('name_urdu', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $departments = $query->orderBy('sort_order', 'asc')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Department/Index', [
            'departments' => $departments,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create settings');

        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'name_urdu'        => 'nullable|string|max:255',
            'slug'             => 'nullable|string|max:255|unique:departments,slug',
            'description'      => 'nullable|string',
            'description_urdu' => 'nullable|string',
            'icon_name'        => 'nullable|string|max:255',
            'sort_order'       => 'nullable|integer',
            'status'           => 'required|boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        Department::create($validated);

        return redirect()->back()->with('success', 'Department created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Department $department): RedirectResponse
    {
        Gate::authorize('edit settings');

        $validated = $request->validate([
            'name'             => 'required|string|max:255',
            'name_urdu'        => 'nullable|string|max:255',
            'slug'             => 'nullable|string|max:255|unique:departments,slug,' . $department->id,
            'description'      => 'nullable|string',
            'description_urdu' => 'nullable|string',
            'icon_name'        => 'nullable|string|max:255',
            'sort_order'       => 'nullable|integer',
            'status'           => 'required|boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $department->update($validated);

        return redirect()->back()->with('success', 'Department updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Department $department): RedirectResponse
    {
        Gate::authorize('delete settings');

        $department->delete();

        return redirect()->back()->with('success', 'Department deleted successfully.');
    }
}
