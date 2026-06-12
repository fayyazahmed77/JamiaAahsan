<?php

namespace App\Http\Controllers\Admin\Course;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Program;
use App\Models\Semester;
use App\Models\Teacher;
use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class CourseController extends Controller
{
    /**
     * Display a listing of courses.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('view classes');

        $query = Course::with(['program', 'semester', 'teacher', 'books', 'studyResources', 'assignments']);

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

        if ($request->filled('semester_id')) {
            $query->where('semester_id', $request->input('semester_id'));
        }

        $courses = $query->latest()->paginate(15)->withQueryString();
        
        $programs = Program::active()->get(['id', 'name']);
        $semesters = Semester::get(['id', 'name', 'code', 'program_id']);
        $teachers = Teacher::active()->get(['id', 'name', 'urdu_name']);
        $books = Book::where('status', true)->get(['id', 'name', 'urdu_name']);

        return Inertia::render('Admin/Course/Index', [
            'courses' => $courses,
            'programs' => $programs,
            'semesters' => $semesters,
            'teachers' => $teachers,
            'books' => $books,
            'filters' => $request->only(['search', 'program_id', 'semester_id']),
        ]);
    }

    /**
     * Store a newly created course.
     */
    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create classes');

        $validated = $request->validate([
            'program_id' => 'required|exists:programs,id',
            'semester_id' => 'required|exists:semesters,id',
            'name' => 'required|string|max:150',
            'name_ur' => 'nullable|string|max:300',
            'code' => 'required|string|max:25|unique:courses,code',
            'credit_hours' => 'required|integer|min:1|max:10',
            'teacher_id' => 'nullable|exists:teachers,id',
            'description' => 'nullable|string',
            'description_ur' => 'nullable|string',
            'is_active' => 'required|boolean',
            'book_ids' => 'nullable|array',
            'book_ids.*' => 'exists:books,id',
        ]);

        $course = Course::create($validated);

        if (!empty($validated['book_ids'])) {
            $course->books()->sync($validated['book_ids']);
        }

        return redirect()->back()->with('success', 'Course created successfully.');
    }

    /**
     * Update the specified course.
     */
    public function update(Request $request, Course $course): RedirectResponse
    {
        Gate::authorize('edit classes');

        $validated = $request->validate([
            'program_id' => 'required|exists:programs,id',
            'semester_id' => 'required|exists:semesters,id',
            'name' => 'required|string|max:150',
            'name_ur' => 'nullable|string|max:300',
            'code' => 'required|string|max:25|unique:courses,code,' . $course->id,
            'credit_hours' => 'required|integer|min:1|max:10',
            'teacher_id' => 'nullable|exists:teachers,id',
            'description' => 'nullable|string',
            'description_ur' => 'nullable|string',
            'is_active' => 'required|boolean',
            'book_ids' => 'nullable|array',
            'book_ids.*' => 'exists:books,id',
        ]);

        $course->update($validated);
        $course->books()->sync($request->input('book_ids', []));

        return redirect()->back()->with('success', 'Course updated successfully.');
    }

    /**
     * Remove the specified course.
     */
    public function destroy(Course $course): RedirectResponse
    {
        Gate::authorize('delete classes');

        if ($course->enrollments()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete course containing active student enrollments.');
        }

        if ($course->schedules()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete course with active schedules.');
        }

        $course->books()->detach();
        $course->delete();

        return redirect()->back()->with('success', 'Course deleted successfully.');
    }
}
