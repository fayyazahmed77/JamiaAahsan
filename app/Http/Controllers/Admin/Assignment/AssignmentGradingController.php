<?php

namespace App\Http\Controllers\Admin\Assignment;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Course;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AssignmentGradingController extends Controller
{
    /**
     * D3 — List assignments for a chosen course (to pick one for grading).
     */
    public function index(Request $request): Response
    {
        $courses = Course::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        $courseId    = $request->input('course_id');
        $assignments = collect();
        $course      = null;

        if ($courseId) {
            $course = Course::findOrFail($courseId);

            $assignments = Assignment::where('course_id', $courseId)
                ->withCount([
                    'submissions',
                    'submissions as graded_count' => fn($q) => $q->whereNotNull('marks_obtained'),
                ])
                ->orderByDesc('due_date')
                ->get(['id', 'title', 'due_date', 'max_marks', 'is_published']);
        }

        return Inertia::render('Admin/Assignment/Grading/Index', [
            'courses'     => $courses,
            'course'      => $course,
            'assignments' => $assignments,
            'filters'     => ['course_id' => $courseId],
        ]);
    }

    /**
     * D3 — Grade sheet: all student submissions for one assignment.
     */
    public function show(Assignment $assignment): Response
    {
        $assignment->load('course');

        // Students enrolled in the course
        $enrolledStudents = $assignment->course->students()
            ->orderBy('name')
            ->get(['students.id', 'students.name', 'students.student_id_number']);

        // Existing submissions keyed by student_id
        $submissions = AssignmentSubmission::where('assignment_id', $assignment->id)
            ->with('grader')
            ->get()
            ->keyBy('student_id');

        // Build a unified grade-sheet row per enrolled student
        $gradeSheet = $enrolledStudents->map(function ($student) use ($submissions, $assignment) {
            $sub = $submissions->get($student->id);
            return [
                'student_id'       => $student->id,
                'student_name'     => $student->name,
                'student_id_num'   => $student->student_id_number,
                'submission_id'    => $sub?->id,
                'submitted_at'     => $sub?->submitted_at?->format('d M Y H:i'),
                'is_late'          => $sub && $sub->submitted_at > $assignment->due_date,
                'file_path'        => $sub?->file_path,
                'file_name'        => $sub?->file_name,
                'status'           => $sub?->status ?? 'not_submitted',
                'marks_obtained'   => $sub?->marks_obtained,
                'feedback'         => $sub?->feedback,
                'graded_by_name'   => $sub?->grader?->name,
                'graded_at'        => $sub?->graded_at?->format('d M Y'),
            ];
        });

        return Inertia::render('Admin/Assignment/Grading/Show', [
            'assignment' => [
                'id'          => $assignment->id,
                'title'       => $assignment->title,
                'max_marks'   => $assignment->max_marks,
                'due_date'    => $assignment->due_date?->format('d M Y'),
                'course_name' => $assignment->course->name,
                'course_code' => $assignment->course->code,
            ],
            'grade_sheet' => $gradeSheet,
        ]);
    }

    /**
     * D3 — Grade (or update) a single submission.
     * Creates a placeholder submission record if student never submitted.
     */
    public function grade(Request $request, Assignment $assignment): RedirectResponse
    {
        $request->validate([
            'student_id'     => ['required', 'exists:students,id'],
            'marks_obtained' => ['required', 'numeric', 'min:0', 'max:' . $assignment->max_marks],
            'feedback'       => ['nullable', 'string', 'max:1000'],
        ]);

        AssignmentSubmission::updateOrCreate(
            [
                'assignment_id' => $assignment->id,
                'student_id'    => $request->student_id,
            ],
            [
                'marks_obtained' => $request->marks_obtained,
                'feedback'       => $request->feedback,
                'graded_by'      => Auth::id(),
                'graded_at'      => now(),
                'status'         => 'graded',
                'submitted_at'   => now(), // mark as admin-graded if no prior submission
            ]
        );

        \App\Models\AuditLog::recordSystem('assignment.graded', [
            'assignment_id' => $assignment->id,
            'student_id'    => $request->student_id,
            'marks'         => $request->marks_obtained,
            'graded_by'     => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Grade saved.');
    }
}
