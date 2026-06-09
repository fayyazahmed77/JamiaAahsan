<?php

namespace App\Http\Controllers\Admin\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

use App\Http\Requests\Admin\Teacher\StoreTeacherRequest;

class TeacherController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Teacher::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('urdu_name', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $teachers = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Teacher/Index', [
            'teachers' => $teachers,
            'filters'  => $request->only(['search', 'status']),
        ]);
    }

    public function store(StoreTeacherRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Teacher::create($validated);

        return redirect()->back()->with('success', 'Teacher created successfully.');
    }

    /**
     * D7: Full teacher profile — courses, students, assignment counts.
     */
    public function show(Teacher $teacher): Response
    {
        $teacher->load([
            'courses' => fn($q) => $q->where('is_active', true)
                ->withCount(['students', 'assignments'])
                ->orderBy('name'),
        ]);

        $stats = [
            'total_courses'     => $teacher->courses->count(),
            'total_students'    => $teacher->courses->sum('students_count'),
            'total_assignments' => $teacher->courses->sum('assignments_count'),
            'total_sessions'    => $teacher->classSessions()->count(),
        ];

        return Inertia::render('Admin/Teacher/Profile', [
            'teacher' => $teacher,
            'stats'   => $stats,
            'courses' => $teacher->courses->map(fn($c) => [
                'id'                => $c->id,
                'name'              => $c->name,
                'code'              => $c->code,
                'credit_hours'      => $c->credit_hours,
                'students_count'    => $c->students_count,
                'assignments_count' => $c->assignments_count,
            ]),
        ]);
    }

    public function update(StoreTeacherRequest $request, Teacher $teacher): RedirectResponse
    {
        $validated = $request->validated();

        $teacher->update($validated);

        return redirect()->back()->with('success', 'Teacher updated successfully.');
    }

    public function destroy(Teacher $teacher): RedirectResponse
    {
        // Prevent deletion if teacher has associated class sessions
        if ($teacher->classSessions()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete teacher with associated class sessions.');
        }

        $teacher->delete();

        return redirect()->back()->with('success', 'Teacher deleted successfully.');
    }
}
