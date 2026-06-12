<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\StudentCourseEnrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StudentAssignmentController extends Controller
{
    public function index(): Response
    {
        $student = Auth::guard('student')->user();

        $courseIds = StudentCourseEnrollment::where('student_id', $student->id)
            ->where('status', 'active')
            ->pluck('course_id');

        $assignments = Assignment::whereIn('course_id', $courseIds)
            ->published()
            ->with(['course', 'teacher'])
            ->latest('due_date')
            ->get();

        $submissions = AssignmentSubmission::where('student_id', $student->id)
            ->get()
            ->keyBy('assignment_id');

        $formatted = $assignments->map(function ($a) use ($submissions) {
            $sub = $submissions->get($a->id);
            return [
                'id' => $a->id,
                'title' => $a->title,
                'title_ur' => $a->title_ur,
                'due_date' => $a->due_date->format('Y-m-d H:i:s'),
                'max_marks' => (float) $a->max_marks,
                'course' => [
                    'id' => $a->course->id,
                    'name' => $a->course->name,
                    'name_ur' => $a->course->name_ur,
                ],
                'teacher_name' => $a->teacher?->name ?? 'Mufti / Teacher',
                'submission' => $sub ? [
                    'id' => $sub->id,
                    'status' => $sub->status,
                    'submitted_at' => $sub->submitted_at->format('Y-m-d H:i:s'),
                    'marks_obtained' => $sub->marks_obtained !== null ? (float) $sub->marks_obtained : null,
                    'feedback' => $sub->feedback,
                    'file_name' => $sub->file_name,
                    'file_url' => $sub->file_path ? asset('storage/' . $sub->file_path) : null,
                ] : null,
            ];
        });

        return Inertia::render('Student/Assignments/Index', [
            'assignments' => $formatted,
        ]);
    }

    public function show(int $id): Response
    {
        $student = Auth::guard('student')->user();

        $assignment = Assignment::published()
            ->with(['course', 'teacher'])
            ->findOrFail($id);

        $enrolled = StudentCourseEnrollment::where('student_id', $student->id)
            ->where('course_id', $assignment->course_id)
            ->exists();

        if (!$enrolled) {
            abort(403, 'You are not enrolled in this course.');
        }

        $submission = AssignmentSubmission::where('student_id', $student->id)
            ->where('assignment_id', $assignment->id)
            ->first();

        return Inertia::render('Student/Assignments/Show', [
            'assignment' => [
                'id' => $assignment->id,
                'title' => $assignment->title,
                'title_ur' => $assignment->title_ur,
                'description' => $assignment->description,
                'description_ur' => $assignment->description_ur,
                'due_date' => $assignment->due_date->format('Y-m-d H:i:s'),
                'max_marks' => (float) $assignment->max_marks,
                'allow_late_submission' => $assignment->allow_late_submission,
                'course' => [
                    'id' => $assignment->course->id,
                    'name' => $assignment->course->name,
                    'name_ur' => $assignment->course->name_ur,
                ],
                'teacher' => $assignment->teacher ? [
                    'name' => $assignment->teacher->name,
                ] : null,
            ],
            'submission' => $submission ? [
                'id' => $submission->id,
                'status' => $submission->status,
                'submitted_at' => $submission->submitted_at->format('Y-m-d H:i:s'),
                'marks_obtained' => $submission->marks_obtained !== null ? (float) $submission->marks_obtained : null,
                'feedback' => $submission->feedback,
                'file_name' => $submission->file_name,
                'file_url' => $submission->file_path ? asset('storage/' . $submission->file_path) : null,
                'notes' => $submission->notes,
            ] : null,
        ]);
    }

    public function submit(Request $request, int $id)
    {
        $student = Auth::guard('student')->user();

        $assignment = Assignment::published()->findOrFail($id);

        $enrolled = StudentCourseEnrollment::where('student_id', $student->id)
            ->where('course_id', $assignment->course_id)
            ->exists();

        if (!$enrolled) {
            abort(403, 'You are not enrolled in this course.');
        }

        $isLate = now()->gt($assignment->due_date);

        if ($isLate && !$assignment->allow_late_submission) {
            return back()->withErrors(['file' => 'Late submissions are not allowed for this assignment.']);
        }

        $request->validate([
            'file' => ['required', 'file', 'max:10240', 'mimes:pdf,docx,jpg,png,zip'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        $file = $request->file('file');

        // Scan binary file signatures to confirm file type matches extension
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $realMime = $finfo->file($file->getPathname());
        $allowedMimes = [
            'application/pdf',
            'application/zip',
            'application/x-zip-compressed',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'image/webp',
        ];
        if (!in_array($realMime, $allowedMimes)) {
            return back()->withErrors(['file' => 'The uploaded file signature header is invalid or insecure. Only PDFs, DOCX, ZIPs, and images are permitted.']);
        }

        $fileName = $file->getClientOriginalName();
        $fileExt = strtolower($file->getClientOriginalExtension());
        
        $fileType = 'other';
        if ($fileExt === 'pdf') $fileType = 'pdf';
        elseif ($fileExt === 'docx') $fileType = 'docx';
        elseif (in_array($fileExt, ['jpg', 'jpeg', 'png', 'webp'])) $fileType = 'image';
        elseif ($fileExt === 'zip') $fileType = 'zip';

        $submission = AssignmentSubmission::where('student_id', $student->id)
            ->where('assignment_id', $assignment->id)
            ->first();

        if ($submission && $submission->file_path) {
            Storage::disk('public')->delete($submission->file_path);
        }

        $path = $file->store('assignment-submissions', 'public');

        AssignmentSubmission::updateOrCreate(
            [
                'assignment_id' => $assignment->id,
                'student_id' => $student->id,
            ],
            [
                'submitted_at' => now(),
                'file_path' => $path,
                'file_name' => $fileName,
                'file_type' => $fileType,
                'notes' => $request->notes,
                'status' => $isLate ? 'late' : 'submitted',
            ]
        );

        return back()->with('success', 'Assignment submitted successfully.');
    }
}
