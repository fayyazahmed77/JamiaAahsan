<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\HifzEnrollment;
use App\Models\HifzSession;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentHifzController extends Controller
{
    public function index(): Response
    {
        $student = Auth::guard('student')->user();

        $enrollment = HifzEnrollment::where('student_id', $student->id)
            ->with('teacher')
            ->first();

        $sessions = HifzSession::where('student_id', $student->id)
            ->with('teacher')
            ->latest('session_date')
            ->paginate(15);

        return Inertia::render('Student/Hifz/Index', [
            'enrollment' => $enrollment ? [
                'id' => $enrollment->id,
                'start_date' => $enrollment->start_date->format('Y-m-d'),
                'target_completion_date' => $enrollment->target_completion_date?->format('Y-m-d'),
                'total_juz_target' => $enrollment->total_juz_target,
                'juz_completed' => $enrollment->juz_completed,
                'current_surah' => $enrollment->current_surah,
                'current_ayah' => $enrollment->current_ayah,
                'status' => $enrollment->status,
                'notes' => $enrollment->notes,
                'teacher_name' => $enrollment->teacher?->name ?? 'Hifz Teacher',
            ] : null,
            'sessions' => $sessions,
        ]);
    }
}
