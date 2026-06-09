<?php

namespace App\Http\Controllers\Admin\Attendance;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use App\Models\Course;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    /**
     * D1 — Index: choose course + date, then display the student roster.
     */
    public function index(Request $request): Response
    {
        $courses = Course::where('is_active', true)
            ->with('teacher')
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'teacher_id']);

        $courseId = $request->input('course_id');
        $date     = $request->input('date', now()->toDateString());

        $students   = collect();
        $attendance = collect();
        $course     = null;

        if ($courseId) {
            $course = Course::with('teacher')->findOrFail($courseId);

            // Students enrolled in this course
            $students = Student::whereHas('courseEnrollments', fn($q) => $q->where('course_id', $courseId))
                ->orderBy('name')
                ->get(['id', 'name', 'student_id_number']);

            // Today's existing records (keyed by student_id)
            $attendance = AttendanceRecord::where('course_id', $courseId)
                ->whereDate('date', $date)
                ->get()
                ->keyBy('student_id');
        }

        return Inertia::render('Admin/Attendance/Index', [
            'courses'    => $courses,
            'course'     => $course,
            'students'   => $students,
            'attendance' => $attendance->values(),
            'date'       => $date,
            'filters'    => ['course_id' => $courseId, 'date' => $date],
        ]);
    }

    /**
     * Bulk-mark attendance for a course on a given date.
     * Payload: { course_id, date, records: [{ student_id, status, notes }] }
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'course_id'          => ['required', 'exists:courses,id'],
            'date'               => ['required', 'date'],
            'records'            => ['required', 'array'],
            'records.*.student_id' => ['required', 'exists:students,id'],
            'records.*.status'   => ['required', 'in:present,absent,late,excused'],
            'records.*.notes'    => ['nullable', 'string', 'max:255'],
        ]);

        $courseId = $request->course_id;
        $date     = $request->date;
        $adminId  = Auth::id();

        DB::transaction(function () use ($request, $courseId, $date, $adminId) {
            foreach ($request->records as $rec) {
                AttendanceRecord::updateOrCreate(
                    [
                        'course_id'  => $courseId,
                        'student_id' => $rec['student_id'],
                        'date'       => $date,
                    ],
                    [
                        'status'    => $rec['status'],
                        'notes'     => $rec['notes'] ?? null,
                        'marked_by' => $adminId,
                    ]
                );
            }
        });

        \App\Models\AuditLog::recordSystem('attendance.bulk_marked', [
            'course_id'  => $courseId,
            'date'       => $date,
            'count'      => count($request->records),
            'marked_by'  => $adminId,
        ]);

        return redirect()->back()->with('success', 'Attendance saved successfully.');
    }

    /**
     * D1 — Summary report: per-student attendance stats for a course.
     */
    public function report(Request $request): Response
    {
        $courses = Course::where('is_active', true)->orderBy('name')->get(['id', 'name', 'code']);

        $courseId = $request->input('course_id');
        $course   = null;
        $report   = collect();

        if ($courseId) {
            $course = Course::findOrFail($courseId);

            $report = Student::whereHas('courseEnrollments', fn($q) => $q->where('course_id', $courseId))
                ->withCount([
                    'attendanceRecords as total'    => fn($q) => $q->where('course_id', $courseId),
                    'attendanceRecords as present'  => fn($q) => $q->where('course_id', $courseId)->where('status', 'present'),
                    'attendanceRecords as absent'   => fn($q) => $q->where('course_id', $courseId)->where('status', 'absent'),
                    'attendanceRecords as late'     => fn($q) => $q->where('course_id', $courseId)->where('status', 'late'),
                    'attendanceRecords as excused'  => fn($q) => $q->where('course_id', $courseId)->where('status', 'excused'),
                ])
                ->orderBy('name')
                ->get(['id', 'name', 'student_id_number'])
                ->map(function ($s) {
                    $s->attendance_pct = $s->total > 0
                        ? round((($s->present + $s->late) / $s->total) * 100, 1)
                        : 0;
                    return $s;
                });
        }

        return Inertia::render('Admin/Attendance/Report', [
            'courses'  => $courses,
            'course'   => $course,
            'report'   => $report,
            'filters'  => ['course_id' => $courseId],
        ]);
    }
}
