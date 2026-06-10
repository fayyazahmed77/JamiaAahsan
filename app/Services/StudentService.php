<?php

namespace App\Services;

use App\Models\Student;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class StudentService
{
    /**
     * Update student profile.
     */
    public function updateProfile(Student $student, array $studentData, array $profileData): void
    {
        $student->update($studentData);

        $student->profile()->updateOrCreate(
            ['student_id' => $student->id],
            $profileData
        );
    }

    /**
     * Update student profile photo.
     */
    public function updatePhoto(Student $student, $photoFile): string
    {
        // Delete old photo
        if ($student->profile_photo) {
            Storage::disk('public')->delete($student->profile_photo);
        }

        $path = $photoFile->store('student-photos', 'public');
        $student->update(['profile_photo' => $path]);

        return $path;
    }

    /**
     * Update student settings.
     */
    public function updateSettings(Student $student, array $settingsData): void
    {
        $student->settings()->updateOrCreate(
            ['student_id' => $student->id],
            $settingsData
        );
    }

    /**
     * Update student password.
     */
    public function updatePassword(Student $student, string $newPassword): void
    {
        $student->update([
            'password' => Hash::make($newPassword),
        ]);
    }
}
