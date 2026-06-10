<?php

namespace App\Services;

use App\Models\HifzSession;
use App\Models\HifzEnrollment;

class HifzService
{
    /**
     * Record a new Hifz session for a student.
     */
    public function recordSession(int $studentId, array $sessionData): HifzSession
    {
        return HifzSession::create(array_merge($sessionData, [
            'student_id' => $studentId,
        ]));
    }

    /**
     * Create or update Hifz enrollment for a student.
     */
    public function updateEnrollment(int $studentId, array $enrollmentData): HifzEnrollment
    {
        return HifzEnrollment::updateOrCreate(
            ['student_id' => $studentId],
            array_merge($enrollmentData, [
                'start_date' => $enrollmentData['start_date'] ?? now()->toDateString(),
            ])
        );
    }
}
