<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\IslamicContent;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentDashboardController extends Controller
{
    public function index(): Response
    {
        /** @var \App\Models\Student $student */
        $student = Auth::guard('student')->user()->load([
            'program',
            'batch',
            'profile',
            'digitalId',
            'unreadNotifications',
        ]);

        // Islamic daily content
        $islamicContent = [
            'verse'    => IslamicContent::todayVerse(),
            'hadith'   => IslamicContent::todayHadith(),
            'reminder' => IslamicContent::todayReminder(),
        ];

        // Academic alerts — warnings that need immediate attention
        $alerts = $this->buildAlerts($student);

        // Islamic Journey stats
        $journeyStats = [
            'program'             => $student->program?->name,
            'program_ur'          => $student->program?->name_ur,
            'current_year'        => $student->current_year,
            'current_semester'    => $student->current_semester,
            'total_semesters'     => $student->program?->total_semesters ?? 16,
            'progress_percentage' => $student->progress_percentage,
            'expected_graduation' => $student->expected_graduation,
            'student_type_label'  => $student->student_type_label,
            'enrollment_date'     => $student->enrollment_date?->format('M Y'),
        ];

        // Unread notification count
        $unreadCount = $student->unreadNotifications->count();

        return Inertia::render('Student/Dashboard/Index', [
            'student'       => [
                'id'                  => $student->id,
                'student_id_number'   => $student->student_id_number,
                'name'                => $student->name,
                'email'               => $student->email,
                'phone'               => $student->phone,
                'gender'              => $student->gender,
                'student_type'        => $student->student_type,
                'status'              => $student->status,
                'profile_photo_url'   => $student->profile_photo_url,
                'current_year'        => $student->current_year,
                'current_semester'    => $student->current_semester,
                'enrollment_date'     => $student->enrollment_date?->format('M d, Y'),
                'digital_id'          => $student->digitalId ? [
                    'card_number'    => $student->digitalId->card_number,
                    'qr_code_url'    => $student->digitalId->qr_code_url,
                    'valid_until'    => $student->digitalId->valid_until?->format('M Y'),
                ] : null,
            ],
            'islamic_content' => [
                'verse'    => $islamicContent['verse'] ? [
                    'arabic_text'    => $islamicContent['verse']->arabic_text,
                    'translation_en' => $islamicContent['verse']->translation_en,
                    'translation_ur' => $islamicContent['verse']->translation_ur,
                    'reference'      => $islamicContent['verse']->reference,
                ] : null,
                'hadith'   => $islamicContent['hadith'] ? [
                    'text_en' => $islamicContent['hadith']->hadith_text_en,
                    'text_ur' => $islamicContent['hadith']->hadith_text_ur,
                    'source'  => $islamicContent['hadith']->hadith_source,
                    'grade'   => $islamicContent['hadith']->hadith_grade,
                ] : null,
                'reminder' => $islamicContent['reminder']?->translation_en,
            ],
            'journey_stats'   => $journeyStats,
            'alerts'          => $alerts,
            'unread_count'    => $unreadCount,

            // Phase 2 placeholders — will be populated with real data
            'today_classes'   => [],
            'courses'         => [],
            'assignments'     => [],
            'attendance'      => [
                'total'   => 0,
                'present' => 0,
                'absent'  => 0,
                'leave'   => 0,
                'rate'    => 0,
            ],
            'upcoming_exams'  => [],
            'hifz'            => null,
        ]);
    }

    private function buildAlerts(\App\Models\Student $student): array
    {
        $alerts = [];

        // Pending status alert
        if ($student->status === 'pending') {
            $alerts[] = [
                'type'    => 'info',
                'icon'    => 'clock',
                'message' => 'Your student account is pending activation. Please wait for administration confirmation.',
            ];
        }

        return $alerts;
    }
}
