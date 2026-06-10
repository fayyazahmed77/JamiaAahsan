<?php

namespace App\Repositories\Contracts;

use App\Models\Student;
use Illuminate\Support\Collection;

interface StudentRepositoryInterface
{
    /**
     * Find a student by ID.
     */
    public function find(int $id): ?Student;

    /**
     * Find a student by ID with all dashboard relationships loaded.
     */
    public function findWithDashboardRelations(int $id): ?Student;

    /**
     * Get pending assignments for the student.
     */
    public function getPendingAssignments(int $studentId, Collection $courseIds, int $limit = 8): Collection;

    /**
     * Get attendance counts grouped by status.
     */
    public function getAttendanceCounts(int $studentId): array;

    /**
     * Get student course enrollments.
     */
    public function getEnrollments(int $studentId): Collection;
}
