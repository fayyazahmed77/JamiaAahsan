<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\AssignmentSubmission;
use App\Models\AttendanceRecord;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * D2 — Student dashboard with real academic data.
     */
    public function index(): Response
    {
        /** @var \App\Models\Student $student */
        $student = Auth::guard('student')->user();

        // ── Eager-load everything in one query pass ──────────────────────────
        $student->load([
            'program',
            'klass',
            'courses.teacher',
            'courses.schedules',
            'unreadNotifications' => fn($q) => $q->latest()->limit(10),
        ]);

        $courseIds = $student->courses->pluck('id');

        // ── Today's classes ──────────────────────────────────────────────────
        $dayOfWeek   = now()->format('l'); // e.g. 'Monday'
        $todayClasses = $student->courses->flatMap(function ($course) use ($dayOfWeek) {
            return $course->schedules
                ->where('day_of_week', $dayOfWeek)
                ->map(fn($s) => [
                    'subject' => $course->name,
                    'code'    => $course->code,
                    'teacher' => $course->teacher?->name ?? 'TBA',
                    'time'    => $s->start_time . ' – ' . $s->end_time,
                    'room'    => $s->room ?? 'TBA',
                ]);
        })->sortBy('time')->values();

        // ── Pending assignments (not yet submitted) ──────────────────────────
        $submittedIds = AssignmentSubmission::where('student_id', $student->id)
            ->pluck('assignment_id');

        $pendingAssignments = \App\Models\Assignment::whereIn('course_id', $courseIds)
            ->whereNotIn('id', $submittedIds)
            ->where('due_date', '>=', now()->subDays(7)) // show recent + upcoming
            ->with('course')
            ->orderBy('due_date')
            ->limit(8)
            ->get()
            ->map(fn($a) => [
                'title'  => $a->title,
                'course' => $a->course?->name ?? '—',
                'due'    => $a->due_date?->format('d M'),
                'status' => $a->due_date?->isPast() ? 'late' : 'pending',
            ]);

        // ── Attendance summary (all time, all courses) ───────────────────────
        $attendanceCounts = AttendanceRecord::where('student_id', $student->id)
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $attPresent = ($attendanceCounts['present'] ?? 0) + ($attendanceCounts['late'] ?? 0);
        $attAbsent  = $attendanceCounts['absent']  ?? 0;
        $attLeave   = $attendanceCounts['excused'] ?? 0;
        $attTotal   = $attPresent + $attAbsent + $attLeave;

        $attendance = [
            'present' => $attPresent,
            'absent'  => $attAbsent,
            'leave'   => $attLeave,
            'total'   => $attTotal,
            'rate'    => $attTotal > 0 ? round(($attPresent / $attTotal) * 100, 1) : 0,
        ];

        // ── Alerts ───────────────────────────────────────────────────────────
        $alerts = [];
        if ($attendance['rate'] > 0 && $attendance['rate'] < 80) {
            $alerts[] = [
                'type'    => 'warning',
                'message' => "Your attendance is {$attendance['rate']}% — below the 80% requirement. Please attend classes regularly.",
            ];
        }
        if ($pendingAssignments->where('status', 'late')->count() > 0) {
            $alerts[] = [
                'type'    => 'error',
                'message' => "You have {$pendingAssignments->where('status', 'late')->count()} overdue assignment(s). Please submit them immediately.",
            ];
        }

        // ── Islamic Journey stats ────────────────────────────────────────────
        $journeyStats = [
            'program'              => $student->program?->name,
            'current_year'         => $student->current_year,
            'current_semester'     => $student->current_semester,
            'total_semesters'      => $student->program?->total_semesters ?? 16,
            'progress_percentage'  => $student->progress_percentage ?? 0,
            'expected_graduation'  => $student->expected_graduation,
        ];

        // ── Islamic content (rotates daily by day-of-year) ───────────────────
        $islamicContent = $this->dailyIslamicContent();

        // ── Hifz summary (if enrolled) ───────────────────────────────────────
        $hifz = $student->hifzEnrollment?->load('sessions');

        return Inertia::render('Student/Dashboard/Index', [
            'student'         => $student->only([
                'id', 'name', 'student_id_number', 'profile_photo', 'current_year',
                'current_semester', 'student_type',
            ]) + ['profile_photo_url' => $student->profile_photo_url],
            'islamic_content' => $islamicContent,
            'journey_stats'   => $journeyStats,
            'alerts'          => $alerts,
            'unread_count'    => $student->unreadNotifications->count(),
            'today_classes'   => $todayClasses,
            'courses'         => $student->courses->map(fn($c) => [
                'id' => $c->id, 'name' => $c->name, 'code' => $c->code,
                'teacher' => $c->teacher?->name,
            ]),
            'assignments'    => $pendingAssignments,
            'attendance'     => $attendance,
            'upcoming_exams' => [], // D4 will populate this
            'hifz'           => $hifz,
        ]);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Returns an Islamic verse + hadith that rotates daily.
     * Content is static to avoid external API calls.
     */
    private function dailyIslamicContent(): array
    {
        $day = (int) now()->format('z'); // 0-365

        $verses = [
            [
                'arabic_text'    => 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ',
                'translation_en' => 'When My servants ask you about Me, I am indeed near.',
                'reference'      => 'Surah Al-Baqarah 2:186',
            ],
            [
                'arabic_text'    => 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
                'translation_en' => 'Indeed, with hardship comes ease.',
                'reference'      => 'Surah Ash-Sharh 94:6',
            ],
            [
                'arabic_text'    => 'رَبِّ زِدْنِي عِلْمًا',
                'translation_en' => 'My Lord, increase me in knowledge.',
                'reference'      => 'Surah Taha 20:114',
            ],
            [
                'arabic_text'    => 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ',
                'translation_en' => 'Seek help through patience and prayer.',
                'reference'      => 'Surah Al-Baqarah 2:45',
            ],
        ];

        $hadiths = [
            [
                'text_en' => 'Seek knowledge from the cradle to the grave.',
                'source'  => 'Attributed tradition',
                'grade'   => null,
            ],
            [
                'text_en' => 'The best among you are those who learn the Quran and teach it.',
                'source'  => 'Sahih al-Bukhari 5027',
                'grade'   => 'Sahih',
            ],
            [
                'text_en' => 'Whoever follows a path seeking knowledge, Allah will make his path to Paradise easy.',
                'source'  => 'Sahih Muslim 2699',
                'grade'   => 'Sahih',
            ],
            [
                'text_en' => 'Actions are judged by intentions.',
                'source'  => 'Sahih al-Bukhari 1',
                'grade'   => 'Sahih',
            ],
        ];

        $reminders = [
            'Begin every task with Bismillah.',
            'Remember Allah in all your efforts.',
            'Be consistent — small deeds done regularly are beloved to Allah.',
            'Ask Allah for tawfiq before you open your books.',
        ];

        return [
            'verse'    => $verses[$day % count($verses)],
            'hadith'   => $hadiths[$day % count($hadiths)],
            'reminder' => $reminders[$day % count($reminders)],
        ];
    }
}
