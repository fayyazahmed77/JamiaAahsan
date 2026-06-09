<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentAdmissionController extends Controller
{
    public function track(): Response
    {
        $student = Auth::guard('student')->user();

        // Phase 1: Show basic status — Phase 2 will link to admissions table
        return Inertia::render('Student/Admission/Track', [
            'student' => [
                'id'                => $student->id,
                'student_id_number' => $student->student_id_number,
                'name'              => $student->name,
                'status'            => $student->status,
                'student_type'      => $student->student_type,
                'enrollment_date'   => $student->enrollment_date?->format('M d, Y'),
            ],
            // Phase 2: pull from admissions + admission_timeline_events tables
            'admission'      => null,
            'timeline_events' => [],
            'documents'      => [],
        ]);
    }
}
