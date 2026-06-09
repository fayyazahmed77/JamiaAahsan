<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\StudentCourseEnrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentCourseController extends Controller
{
    public function index(): Response
    {
        $student = Auth::guard('student')->user();

        $enrollments = StudentCourseEnrollment::where('student_id', $student->id)
            ->with(['course.teacher', 'course.program'])
            ->get();

        return Inertia::render('Student/Courses/Index', [
            'enrollments' => $enrollments->map(fn ($e) => [
                'id' => $e->id,
                'status' => $e->status,
                'progress_percentage' => (float) $e->progress_percentage,
                'grade' => $e->grade,
                'marks_obtained' => (float) $e->marks_obtained,
                'course' => [
                    'id' => $e->course->id,
                    'name' => $e->course->name,
                    'name_ur' => $e->course->name_ur,
                    'code' => $e->course->code,
                    'credit_hours' => $e->course->credit_hours,
                    'description' => $e->course->description,
                    'teacher_name' => $e->course->teacher?->name ?? 'Mufti / Teacher',
                ]
            ]),
        ]);
    }

    public function show(int $id): Response
    {
        $student = Auth::guard('student')->user();

        $enrollment = StudentCourseEnrollment::where('student_id', $student->id)
            ->where('course_id', $id)
            ->with(['course.teacher', 'course.schedules.room'])
            ->firstOrFail();

        $course = $enrollment->course;

        // Fetch course assignments
        $assignments = \App\Models\Assignment::where('course_id', $course->id)
            ->published()
            ->latest()
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'title_ur' => $a->title_ur,
                'description' => $a->description,
                'due_date' => $a->due_date->format('Y-m-d H:i:s'),
                'max_marks' => (float) $a->max_marks,
                'submission' => $a->submissions()->where('student_id', $student->id)->first() ? [
                    'id' => $a->submissions()->where('student_id', $student->id)->first()->id,
                    'status' => $a->submissions()->where('student_id', $student->id)->first()->status,
                    'marks_obtained' => (float) $a->submissions()->where('student_id', $student->id)->first()->marks_obtained,
                    'submitted_at' => $a->submissions()->where('student_id', $student->id)->first()->submitted_at->format('Y-m-d H:i:s'),
                ] : null,
            ]);

        // Fetch attendance record summary for this course
        $attendanceRecords = \App\Models\AttendanceRecord::where('student_id', $student->id)
            ->where('course_id', $course->id)
            ->get();

        $total = $attendanceRecords->count();
        $present = $attendanceRecords->where('status', 'present')->count();
        $absent = $attendanceRecords->where('status', 'absent')->count();
        $leave = $attendanceRecords->where('status', 'leave')->count();
        $rate = $total > 0 ? round(($present / $total) * 100, 1) : 100.0;

        // Phase 3 placeholders
        $materials = [];

        return Inertia::render('Student/Courses/Show', [
            'enrollment' => [
                'id' => $enrollment->id,
                'status' => $enrollment->status,
                'progress_percentage' => (float) $enrollment->progress_percentage,
                'grade' => $enrollment->grade,
                'marks_obtained' => (float) $enrollment->marks_obtained,
            ],
            'course' => [
                'id' => $course->id,
                'name' => $course->name,
                'name_ur' => $course->name_ur,
                'code' => $course->code,
                'credit_hours' => $course->credit_hours,
                'description' => $course->description,
                'teacher' => $course->teacher ? [
                    'name' => $course->teacher->name,
                    'urdu_name' => $course->teacher->urdu_name,
                ] : null,
                'schedules' => $course->schedules->map(fn ($s) => [
                    'day_of_week' => $s->day_of_week,
                    'start_time' => $s->start_time,
                    'end_time' => $s->end_time,
                    'type' => $s->type,
                    'meeting_url' => $s->meeting_url,
                    'room' => $s->room?->name,
                ]),
            ],
            'assignments' => $assignments,
            'attendance' => [
                'total' => $total,
                'present' => $present,
                'absent' => $absent,
                'leave' => $leave,
                'rate' => $rate,
                'records' => $attendanceRecords->map(fn ($r) => [
                    'date' => $r->date->format('Y-m-d'),
                    'status' => $r->status,
                    'notes' => $r->notes,
                ]),
            ],
            'materials' => $materials,
        ]);
    }
}
