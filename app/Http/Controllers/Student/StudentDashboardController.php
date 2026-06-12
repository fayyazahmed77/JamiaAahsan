<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\IslamicContent;
use App\Models\AssignmentSubmission;
use App\Models\AttendanceRecord;
use App\Models\Assignment;
use App\Models\Exam;
use App\Models\Announcement;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentDashboardController extends Controller
{
    public function index(): Response
    {
        /** @var \App\Models\Student $student */
        $student = Auth::guard('student')->user();
        $student->load([
            'program',
            'batch',
            'profile',
            'digitalId',
            'unreadNotifications',
            'hifzEnrollment',
        ]);

        $courseIds = $student->courses()->pluck('courses.id');

        // 1. Today's Classes
        $dayOfWeek = now()->format('l'); // e.g. "Monday"
        $todayClasses = $student->courses()->with(['schedules' => function ($q) use ($dayOfWeek) {
            $q->where('day_of_week', $this->dayToNumber($dayOfWeek))->where('is_active', true);
        }, 'teacher'])->get()->flatMap(function ($course) {
            return $course->schedules->map(fn($s) => [
                'subject' => $course->name,
                'code'    => $course->code,
                'teacher' => $course->teacher?->name ?? 'Mufti / Teacher',
                'time'    => $s->start_time . ' - ' . $s->end_time,
                'room'    => $s->room ? $s->room->name : 'TBA',
            ]);
        })->sortBy('time')->values()->toArray();

        // 2. Pending Assignments
        $submittedIds = AssignmentSubmission::where('student_id', $student->id)->pluck('assignment_id');
        $pendingAssignments = Assignment::whereIn('course_id', $courseIds)
            ->whereNotIn('id', $submittedIds)
            ->where('due_date', '>=', now()->subDays(7))
            ->with('course')
            ->orderBy('due_date')
            ->limit(5)
            ->get()
            ->map(fn($a) => [
                'id'     => $a->id,
                'title'  => $a->title,
                'course' => $a->course?->name ?? '—',
                'due'    => $a->due_date->format('d M'),
                'status' => $a->due_date->isPast() ? 'late' : 'pending',
            ])->toArray();

        // 3. Attendance Rate
        $records = AttendanceRecord::where('student_id', $student->id)->get();
        $attTotal = $records->count();
        $attPresent = $records->whereIn('status', ['present', 'late', 'excused'])->count();
        $attendance = [
            'total'   => $attTotal,
            'present' => $attPresent,
            'absent'  => $records->where('status', 'absent')->count(),
            'leave'   => $records->where('status', 'leave')->count(),
            'rate'    => $attTotal > 0 ? round(($attPresent / $attTotal) * 100, 1) : 100.0,
        ];

        // 4. Upcoming Exams
        $upcomingExams = Exam::whereIn('course_id', $courseIds)
            ->where('exam_date', '>=', now())
            ->with('course')
            ->orderBy('exam_date')
            ->limit(5)
            ->get()
            ->map(fn($e) => [
                'id'       => $e->id,
                'subject'  => $e->title,
                'date'     => $e->exam_date->format('d M Y') . ' (' . ($e->start_time ?? 'TBA') . ')',
                'venue'    => $e->venue ?? 'Exam Hall',
            ])->toArray();

        // 5. Islamic Content Rotation
        $islamicContent = [
            'verse'    => IslamicContent::todayVerse() ? [
                'arabic_text'    => IslamicContent::todayVerse()->arabic_text,
                'translation_en' => IslamicContent::todayVerse()->translation_en,
                'translation_ur' => IslamicContent::todayVerse()->translation_ur,
                'reference'      => IslamicContent::todayVerse()->reference,
            ] : null,
            'hadith'   => IslamicContent::todayHadith() ? [
                'text_en' => IslamicContent::todayHadith()->hadith_text_en,
                'text_ur' => IslamicContent::todayHadith()->hadith_text_ur,
                'source'  => IslamicContent::todayHadith()->hadith_source,
                'grade'   => IslamicContent::todayHadith()->hadith_grade,
            ] : null,
            'reminder' => IslamicContent::todayReminder() ? IslamicContent::todayReminder()->translation_en : null,
        ];

        // 6. Notifications and Announcements
        $unreadCount = $student->unreadNotifications->count();
        $announcements = Announcement::published()
            ->forAudience('students')
            ->orderBy('is_pinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        return Inertia::render('Student/Dashboard/Index', [
            'student' => [
                'id' => $student->id,
                'student_id_number' => $student->student_id_number,
                'name' => $student->name,
                'email' => $student->email,
                'profile_photo_url' => $student->profile_photo_url,
                'current_year' => $student->current_year,
                'current_semester' => $student->current_semester,
                'student_type' => $student->student_type,
                'program_id' => $student->program_id,
                'current_semester_id' => $student->current_semester_id,
            ],
            'journey_stats' => [
                'program'             => $student->program?->name,
                'current_year'        => $student->current_year,
                'current_semester'    => $student->current_semester,
                'total_semesters'     => $student->program?->total_semesters ?? 16,
                'progress_percentage' => $student->progress_percentage,
                'expected_graduation' => $student->expected_graduation,
            ],
            'today_classes'   => $todayClasses,
            'assignments'     => $pendingAssignments,
            'attendance'      => $attendance,
            'upcoming_exams'  => $upcomingExams,
            'hifz'            => $student->hifzEnrollment ? [
                'juz_completed'    => $student->hifzEnrollment->juz_completed,
                'total_juz_target' => $student->hifzEnrollment->total_juz_target,
                'status'           => $student->hifzEnrollment->status,
            ] : null,
            'islamic_content' => $islamicContent,
            'announcements'   => $announcements,
            'unread_count'    => $unreadCount,
            'alerts'          => $this->buildAlerts($student, $attendance),
        ]);
    }

    private function buildAlerts(\App\Models\Student $student, array $attendance): array
    {
        $alerts = [];
        if (empty($student->program_id) || empty($student->current_semester_id)) {
            $alerts[] = [
                'type'    => 'error',
                'message' => 'Your academic enrollment is pending. Please contact the admissions office to assign your Program and Semester.',
            ];
        }
        if ($student->status === 'pending') {
            $alerts[] = [
                'type'    => 'info',
                'message' => 'Your student account is pending activation. Please wait for administration confirmation.',
            ];
        }
        if ($attendance['rate'] < 80 && $attendance['total'] > 0) {
            $alerts[] = [
                'type'    => 'warning',
                'message' => "Your attendance rate of {$attendance['rate']}% is below the 80% threshold. Regular attendance is required.",
            ];
        }
        return $alerts;
    }

    private function dayToNumber(string $day): int
    {
        $days = ['Sunday' => 0, 'Monday' => 1, 'Tuesday' => 2, 'Wednesday' => 3, 'Thursday' => 4, 'Friday' => 5, 'Saturday' => 6];
        return $days[$day] ?? 1;
    }
}
