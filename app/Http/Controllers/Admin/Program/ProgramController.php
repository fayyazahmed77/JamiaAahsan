<?php

namespace App\Http\Controllers\Admin\Program;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class ProgramController extends Controller
{
    /**
     * Display a listing of the programs.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('view settings');

        $query = Program::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('name_ur', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('is_active', $request->boolean('status'));
        }

        $programs = $query->orderBy('sort_order', 'asc')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Program/Index', [
            'programs' => $programs,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Store a newly created program.
     */
    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create settings');

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'name_ur' => 'nullable|string|max:300',
            'slug' => 'nullable|string|max:120|unique:programs,slug',
            'type' => 'required|in:dars_nizami,hifz,tajweed,arabic,ifta,other',
            'duration_years' => 'required|integer|min:1|max:10',
            'total_semesters' => 'required|integer|min:1|max:20',
            'description' => 'nullable|string',
            'description_ur' => 'nullable|string',
            'is_active' => 'required|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        Program::create($validated);

        return redirect()->back()->with('success', 'Program created successfully.');
    }

    /**
     * Update the specified program.
     */
    public function update(Request $request, Program $program): RedirectResponse
    {
        Gate::authorize('edit settings');

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'name_ur' => 'nullable|string|max:300',
            'slug' => 'nullable|string|max:120|unique:programs,slug,' . $program->id,
            'type' => 'required|in:dars_nizami,hifz,tajweed,arabic,ifta,other',
            'duration_years' => 'required|integer|min:1|max:10',
            'total_semesters' => 'required|integer|min:1|max:20',
            'description' => 'nullable|string',
            'description_ur' => 'nullable|string',
            'is_active' => 'required|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $program->update($validated);

        return redirect()->back()->with('success', 'Program updated successfully.');
    }

    /**
     * Remove the specified program.
     */
    public function destroy(Program $program): RedirectResponse
    {
        Gate::authorize('delete settings');

        if ($program->students()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete program with active students enrolled.');
        }

        if ($program->semesters()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete program containing active semesters.');
        }

        $program->delete();

        return redirect()->back()->with('success', 'Program deleted successfully.');
    }
}
