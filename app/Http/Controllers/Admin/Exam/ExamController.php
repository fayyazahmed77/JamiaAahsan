<?php

namespace App\Http\Controllers\Admin\Exam;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Exam;
use App\Models\ExamResult;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * D4 + D5: Exam scheduling AND results entry in one controller.
 */
class ExamController extends Controller
{
    // ── D4: Scheduling ────────────────────────────────────────────────────────

    public function index(Request $request): Response
    {
        $courseId = $request->input('course_id');

        $courses = Course::where('is_active', true)->orderBy('name')->get(['id', 'name', 'code']);

        $exams = Exam::when($courseId, fn($q) => $q->where('course_id', $courseId))
            ->with('course')
            ->withCount('results')
            ->orderByDesc('exam_date')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Exam/Index', [
            'courses' => $courses,
            'exams'   => $exams,
            'filters' => ['course_id' => $courseId],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'course_id'     => ['required', 'exists:courses,id'],
            'title'         => ['required', 'string', 'max:255'],
            'type'          => ['required', 'in:midterm,final,quiz,other'],
            'exam_date'     => ['required', 'date'],
            'start_time'    => ['nullable', 'date_format:H:i'],
            'end_time'      => ['nullable', 'date_format:H:i', 'after:start_time'],
            'venue'         => ['nullable', 'string', 'max:255'],
            'total_marks'   => ['required', 'numeric', 'min:1'],
            'passing_marks' => ['required', 'numeric', 'min:0', 'lte:total_marks'],
            'instructions'  => ['nullable', 'string'],
            'is_published'  => ['boolean'],
        ]);

        $exam = Exam::create($data);

        \App\Models\AuditLog::recordSystem('exam.created', [
            'exam_id'   => $exam->id,
            'course_id' => $exam->course_id,
            'type'      => $exam->type,
        ]);

        return redirect()->route('admin.exams.index')
            ->with('success', 'Exam scheduled successfully.');
    }

    public function update(Request $request, Exam $exam): RedirectResponse
    {
        $data = $request->validate([
            'title'         => ['required', 'string', 'max:255'],
            'type'          => ['required', 'in:midterm,final,quiz,other'],
            'exam_date'     => ['required', 'date'],
            'start_time'    => ['nullable', 'date_format:H:i'],
            'end_time'      => ['nullable', 'date_format:H:i'],
            'venue'         => ['nullable', 'string', 'max:255'],
            'total_marks'   => ['required', 'numeric', 'min:1'],
            'passing_marks' => ['required', 'numeric', 'min:0', 'lte:total_marks'],
            'instructions'  => ['nullable', 'string'],
            'is_published'  => ['boolean'],
        ]);

        $exam->update($data);

        return redirect()->back()->with('success', 'Exam updated.');
    }

    public function destroy(Exam $exam): RedirectResponse
    {
        $exam->delete();
        return redirect()->route('admin.exams.index')->with('success', 'Exam deleted.');
    }

    // ── D5: Results entry ─────────────────────────────────────────────────────

    /**
     * Show the result-entry sheet for one exam.
     */
    public function results(Exam $exam): Response
    {
        $exam->load('course');

        $students = $exam->course->students()
            ->orderBy('name')
            ->get(['students.id', 'students.name', 'students.student_id_number']);

        $existing = ExamResult::where('exam_id', $exam->id)
            ->get()
            ->keyBy('student_id');

        $sheet = $students->map(fn($s) => [
            'student_id'     => $s->id,
            'student_name'   => $s->name,
            'student_id_num' => $s->student_id_number,
            'marks_obtained' => $existing->get($s->id)?->marks_obtained,
            'grade'          => $existing->get($s->id)?->grade,
            'remarks'        => $existing->get($s->id)?->remarks,
        ]);

        return Inertia::render('Admin/Exam/Results', [
            'exam'  => [
                'id'            => $exam->id,
                'title'         => $exam->title,
                'type_label'    => $exam->type_label,
                'exam_date'     => $exam->exam_date->format('d M Y'),
                'total_marks'   => $exam->total_marks,
                'passing_marks' => $exam->passing_marks,
                'course_name'   => $exam->course->name,
                'course_code'   => $exam->course->code,
                'status'        => $exam->status,
            ],
            'sheet' => $sheet,
        ]);
    }

    /**
     * Bulk-save results for an exam.
     */
    public function saveResults(Request $request, Exam $exam): RedirectResponse
    {
        $request->validate([
            'results'                  => ['required', 'array'],
            'results.*.student_id'     => ['required', 'exists:students,id'],
            'results.*.marks_obtained' => ['nullable', 'numeric', 'min:0', 'max:' . $exam->total_marks],
            'results.*.remarks'        => ['nullable', 'string', 'max:255'],
        ]);

        foreach ($request->results as $row) {
            if ($row['marks_obtained'] === null || $row['marks_obtained'] === '') {
                continue;
            }

            $grade = ExamResult::calcGrade((float) $row['marks_obtained'], (float) $exam->total_marks);

            ExamResult::updateOrCreate(
                ['exam_id' => $exam->id, 'student_id' => $row['student_id']],
                [
                    'marks_obtained' => $row['marks_obtained'],
                    'grade'          => $grade,
                    'remarks'        => $row['remarks'] ?? null,
                    'entered_by'     => Auth::id(),
                ]
            );
        }

        return redirect()->back()->with('success', 'Results saved successfully.');
    }

    /**
     * Update the status of the exam (results publishing status).
     */
    public function updateStatus(Request $request, Exam $exam): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:draft,review,published'],
        ]);

        $exam->update($data);

        return redirect()->back()->with('success', 'Exam status updated to: ' . ucfirst($exam->status));
    }
}
