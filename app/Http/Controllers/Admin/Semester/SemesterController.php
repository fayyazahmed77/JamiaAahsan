<?php

namespace App\Http\Controllers\Admin\Semester;

use App\Http\Controllers\Controller;
use App\Models\Semester;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class SemesterController extends Controller
{
    /**
     * Display a listing of the semesters.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('view classes');

        $query = Semester::with('program');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->filled('program_id')) {
            $query->where('program_id', $request->input('program_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $semesters = $query->latest()->paginate(15)->withQueryString();
        $programs = Program::active()->get(['id', 'name']);

        return Inertia::render('Admin/Semester/Index', [
            'semesters' => $semesters,
            'programs' => $programs,
            'filters' => $request->only(['search', 'program_id', 'status']),
        ]);
    }

    /**
     * Store a newly created semester in database.
     */
    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create classes');

        $validated = $request->validate([
            'program_id' => 'required|exists:programs,id',
            'name' => 'required|string|max:150',
            'code' => 'required|string|max:50|unique:semesters,code',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'duration_months' => 'required|integer|min:1|max:12',
            'status' => 'required|in:active,inactive,completed',
            'academic_year' => 'required|string|max:20',
        ]);

        Semester::create($validated);

        return redirect()->back()->with('success', 'Semester created successfully.');
    }

    /**
     * Update the specified semester.
     */
    public function update(Request $request, Semester $semester): RedirectResponse
    {
        Gate::authorize('edit classes');

        $validated = $request->validate([
            'program_id' => 'required|exists:programs,id',
            'name' => 'required|string|max:150',
            'code' => 'required|string|max:50|unique:semesters,code,' . $semester->id,
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'duration_months' => 'required|integer|min:1|max:12',
            'status' => 'required|in:active,inactive,completed',
            'academic_year' => 'required|string|max:20',
        ]);

        $semester->update($validated);

        return redirect()->back()->with('success', 'Semester updated successfully.');
    }

    /**
     * Remove the specified semester.
     */
    public function destroy(Semester $semester): RedirectResponse
    {
        Gate::authorize('delete classes');

        if ($semester->students()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete semester with active enrolled students.');
        }

        if ($semester->courses()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete semester containing active courses.');
        }

        $semester->delete();

        return redirect()->back()->with('success', 'Semester deleted successfully.');
    }
}
