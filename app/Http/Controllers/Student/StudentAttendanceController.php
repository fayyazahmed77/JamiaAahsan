<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRecord;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentAttendanceController extends Controller
{
    public function index(): Response
    {
        $student = Auth::guard('student')->user();

        $records = AttendanceRecord::where('student_id', $student->id)
            ->with('course')
            ->latest('date')
            ->get();

        $total = $records->count();
        $present = $records->where('status', 'present')->count();
        $absent = $records->where('status', 'absent')->count();
        $leave = $records->where('status', 'leave')->count();
        $late = $records->where('status', 'late')->count();
        $excused = $records->where('status', 'excused')->count();

        $attended = $present + $late + $excused;
        $rate = $total > 0 ? round(($attended / $total) * 100, 1) : 100.0;

        return Inertia::render('Student/Attendance/Index', [
            'summary' => [
                'total' => $total,
                'present' => $present,
                'absent' => $absent,
                'leave' => $leave,
                'late' => $late,
                'excused' => $excused,
                'rate' => $rate,
            ],
            'records' => $records->map(fn ($r) => [
                'id' => $r->id,
                'date' => $r->date->format('Y-m-d'),
                'status' => $r->status,
                'notes' => $r->notes,
                'course' => [
                    'id' => $r->course->id,
                    'name' => $r->course->name,
                    'name_ur' => $r->course->name_ur,
                    'code' => $r->course->code,
                ],
            ]),
        ]);
    }
}
