<?php

namespace App\Repositories\Eloquent;

use App\Models\Student;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\AttendanceRecord;
use App\Repositories\Contracts\StudentRepositoryInterface;
use Illuminate\Support\Collection;

class EloquentStudentRepository implements StudentRepositoryInterface
{
    /**
     * Find a student by ID.
     */
    public function find(int $id): ?Student
    {
        return Student::find($id);
    }

    /**
     * Find a student by ID with dashboard relations loaded.
     */
    public function findWithDashboardRelations(int $id): ?Student
    {
        return Student::with([
            'program',
            'klass',
            'courses.teacher',
            'courses.schedules',
            'unreadNotifications' => fn($q) => $q->latest()->limit(10),
            'hifzEnrollment.sessions',
        ])->find($id);
    }

    /**
     * Get pending assignments for a student.
     */
    public function getPendingAssignments(int $studentId, Collection $courseIds, int $limit = 8): Collection
    {
        $submittedIds = AssignmentSubmission::where('student_id', $studentId)
            ->pluck('assignment_id');

        return Assignment::whereIn('course_id', $courseIds)
            ->whereNotIn('id', $submittedIds)
            ->where('due_date', '>=', now()->subDays(7))
            ->with('course')
            ->orderBy('due_date')
            ->limit($limit)
            ->get();
    }

    /**
     * Get attendance summary count.
     */
    public function getAttendanceCounts(int $studentId): array
    {
        $attendanceCounts = AttendanceRecord::where('student_id', $studentId)
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $attPresent = ($attendanceCounts['present'] ?? 0) + ($attendanceCounts['late'] ?? 0);
        $attAbsent  = $attendanceCounts['absent']  ?? 0;
        $attLeave   = $attendanceCounts['excused'] ?? 0;
        $attTotal   = $attPresent + $attAbsent + $attLeave;

        return [
            'present' => $attPresent,
            'absent'  => $attAbsent,
            'leave'   => $attLeave,
            'total'   => $attTotal,
            'rate'    => $attTotal > 0 ? round(($attPresent / $attTotal) * 100, 1) : 0,
        ];
    }

    /**
     * Get student course enrollments.
     */
    public function getEnrollments(int $studentId): Collection
    {
        $student = Student::find($studentId);
        if (!$student) {
            return collect();
        }
        return $student->courses;
    }
}
