<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ClassSchedule;
use App\Models\StudentCourseEnrollment;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentClassController extends Controller
{
    public function index(): Response
    {
        $student = Auth::guard('student')->user();

        $courseIds = StudentCourseEnrollment::where('student_id', $student->id)
            ->where('status', 'active')
            ->pluck('course_id');

        $schedules = ClassSchedule::whereIn('course_id', $courseIds)
            ->with(['course.teacher', 'room'])
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'day_of_week' => $s->day_of_week,
                'start_time' => $s->start_time,
                'end_time' => $s->end_time,
                'type' => $s->type,
                'meeting_url' => $s->meeting_url,
                'room' => $s->room?->name ?? 'N/A',
                'course' => [
                    'id' => $s->course->id,
                    'name' => $s->course->name,
                    'name_ur' => $s->course->name_ur,
                    'code' => $s->course->code,
                    'teacher_name' => $s->course->teacher?->name ?? 'Mufti / Teacher',
                ],
            ]);

        return Inertia::render('Student/Classes/Index', [
            'schedules' => $schedules,
        ]);
    }
}
