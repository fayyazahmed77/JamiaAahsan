<?php

namespace App\Listeners;

use App\Events\AdmissionApproved;
use App\Models\Student;
use App\Models\DigitalStudentId;
use App\Models\StudentSetting;
use App\Models\Program;
use App\Models\Batch;
use App\Mail\StudentWelcomeNotification;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class CreateStudentAccount
{
    /**
     * Handle the event.
     */
    public function handle(AdmissionApproved $event): void
    {
        $detail = $event->userDetail;
        $user = $detail->user;

        if (!$user) {
            Log::warning("CreateStudentAccount: Admission approved but user is missing for detail ID {$detail->id}");
            return;
        }

        // 1. Check if student already exists for this user_id
        $exists = Student::where('user_id', $user->id)->exists();
        if ($exists) {
            Log::info("CreateStudentAccount: Student account already exists for user ID {$user->id}");
            return;
        }

        // 2. Resolve program and batch
        $program = Program::where('is_active', true)->first();
        $batch = null;
        if ($program) {
            $batch = Batch::where('program_id', $program->id)->where('is_active', true)->first();
        }

        // 3. Generate student credentials
        $year = date('Y');
        // Generate student ID number JA-YYYY-XXXX
        $lastStudent = Student::where('student_id_number', 'like', "JA-{$year}-%")->orderBy('id', 'desc')->first();
        $nextNum = 1;
        if ($lastStudent) {
            $parts = explode('-', $lastStudent->student_id_number);
            if (count($parts) === 3) {
                $nextNum = (int)$parts[2] + 1;
            }
        }
        $studentIdNumber = 'JA-' . $year . '-' . Str::padLeft($nextNum, 4, '0');
        $randomPassword = Str::random(10);

        // 4. Create student
        $student = Student::create([
            'student_id_number' => $studentIdNumber,
            'user_id'           => $user->id,
            'program_id'        => $program?->id,
            'batch_id'          => $batch?->id,
            'class_id'          => $detail->class_id,
            'name'              => $user->name,
            'email'             => $user->email,
            'password'          => Hash::make($randomPassword),
            'phone'             => $detail->phone,
            'gender'            => in_array($detail->gender, ['male', 'female']) ? $detail->gender : 'male',
            'current_year'      => 1,
            'current_semester'  => 1,
            'student_type'      => $detail->admission_type === 'online' ? 'online' : 'onsite',
            'status'            => 'active',
            'enrollment_date'   => now(),
        ]);

        // 5. Create student profile
        $student->profile()->create([
            'father_name' => $detail->guardian_name,
            'national_id' => $detail->id_card_no,
            'address'     => $detail->address,
            'nationality' => 'Pakistani',
            'country'     => $detail->country ?? 'Pakistan',
            'previous_qualification' => $detail->qualification,
        ]);

        // 6. Create digital ID card record
        DigitalStudentId::create([
            'student_id'  => $student->id,
            'card_number' => 'JA-CARD-' . $year . '-' . Str::padLeft($student->id, 4, '0'),
            'issued_at'   => now(),
            'valid_until' => now()->addYear(),
            'is_active'   => true,
        ]);

        // 7. Create settings
        StudentSetting::create([
            'student_id' => $student->id,
            'language'   => 'en',
            'theme'      => 'system',
        ]);

        Log::info("CreateStudentAccount: Successfully generated student {$studentIdNumber} for user ID {$user->id}");

        // 8. Dispatch credentials email
        try {
            Mail::to($student->email)->send(new StudentWelcomeNotification($student, $randomPassword));
        } catch (\Throwable $e) {
            Log::error("CreateStudentAccount: Failed to send welcome email to {$student->email}: " . $e->getMessage());
        }
    }
}
