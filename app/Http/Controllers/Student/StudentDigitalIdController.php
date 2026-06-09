<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentDigitalIdController extends Controller
{
    public function show(): Response
    {
        $student = Auth::guard('student')->user()->load(['program', 'digitalId']);

        return Inertia::render('Student/DigitalId/Show', [
            'student' => [
                'id'                => $student->id,
                'student_id_number' => $student->student_id_number,
                'name'              => $student->name,
                'email'             => $student->email,
                'gender'            => $student->gender,
                'student_type'      => $student->student_type,
                'student_type_label'=> $student->student_type_label,
                'status'            => $student->status,
                'current_year'      => $student->current_year,
                'current_semester'  => $student->current_semester,
                'profile_photo_url' => $student->profile_photo_url,
                'enrollment_date'   => $student->enrollment_date?->format('M Y'),
                'program'           => $student->program?->name,
                'program_ur'        => $student->program?->name_ur,
            ],
            'digital_id' => $student->digitalId ? [
                'card_number' => $student->digitalId->card_number,
                'qr_code_url' => $student->digitalId->qr_code_url,
                'pdf_url'     => $student->digitalId->pdf_url,
                'issued_at'   => $student->digitalId->issued_at?->format('M d, Y'),
                'valid_until' => $student->digitalId->valid_until?->format('M Y'),
                'is_active'   => $student->digitalId->is_active,
            ] : null,
        ]);
    }

    public function download()
    {
        // Phase 4: Generate PDF using DomPDF or Spatie/Browsershot
        abort(404, 'PDF download will be available in Phase 4.');
    }
}
