<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StudentProfileController extends Controller
{
    public function show(): Response
    {
        $student = Auth::guard('student')->user()->load(['profile', 'guardians', 'program', 'batch']);

        return Inertia::render('Student/Profile/Show', [
            'student'   => $this->formatStudent($student),
            'guardians' => $student->guardians,
        ]);
    }

    public function update(Request $request)
    {
        $student = Auth::guard('student')->user();

        $validated = $request->validate([
            'phone' => ['nullable', 'string', 'max:25'],
        ]);

        $student->update($validated);

        // Update extended profile
        $profileData = $request->validate([
            'father_name'               => ['nullable', 'string', 'max:100'],
            'mother_name'               => ['nullable', 'string', 'max:100'],
            'nationality'               => ['nullable', 'string', 'max:80'],
            'mother_tongue'             => ['nullable', 'string', 'max:80'],
            'national_id'               => ['nullable', 'string', 'max:40'],
            'address'                   => ['nullable', 'string'],
            'city'                      => ['nullable', 'string', 'max:80'],
            'province'                  => ['nullable', 'string', 'max:80'],
            'country'                   => ['nullable', 'string', 'max:80'],
            'previous_madrasa'          => ['nullable', 'string', 'max:200'],
            'previous_qualification'    => ['nullable', 'string', 'max:200'],
            'hifz_status'               => ['nullable', 'in:non_hafiz,in_progress,hafiz'],
            'maslak'                    => ['nullable', 'string', 'max:80'],
            'specialization_interests'  => ['nullable', 'array'],
            'emergency_contact_name'    => ['nullable', 'string', 'max:100'],
            'emergency_contact_phone'   => ['nullable', 'string', 'max:25'],
            'emergency_contact_relation'=> ['nullable', 'string', 'max:60'],
        ]);

        $student->profile()->updateOrCreate(
            ['student_id' => $student->id],
            $profileData
        );

        return back()->with('success', 'Profile updated successfully.');
    }

    public function updatePhoto(Request $request)
    {
        $request->validate([
            'photo' => ['required', 'image', 'max:2048', 'mimes:jpg,jpeg,png,webp'],
        ]);

        $student = Auth::guard('student')->user();

        // Delete old photo
        if ($student->profile_photo) {
            Storage::disk('public')->delete($student->profile_photo);
        }

        $path = $request->file('photo')->store('student-photos', 'public');
        $student->update(['profile_photo' => $path]);

        return back()->with('success', 'Profile photo updated successfully.');
    }

    private function formatStudent($student): array
    {
        return [
            'id'                  => $student->id,
            'student_id_number'   => $student->student_id_number,
            'name'                => $student->name,
            'email'               => $student->email,
            'phone'               => $student->phone,
            'date_of_birth'       => $student->date_of_birth?->format('Y-m-d'),
            'gender'              => $student->gender,
            'student_type'        => $student->student_type,
            'status'              => $student->status,
            'profile_photo_url'   => $student->profile_photo_url,
            'current_year'        => $student->current_year,
            'current_semester'    => $student->current_semester,
            'enrollment_date'     => $student->enrollment_date?->format('M d, Y'),
            'program'             => $student->program?->name,
            'batch'               => $student->batch?->name,
            'profile'             => $student->profile,
            'progress_percentage' => $student->progress_percentage,
            'expected_graduation' => $student->expected_graduation,
        ];
    }
}
