<?php

namespace App\Services;

use App\Models\Student;
use App\Models\Semester;
use App\Models\StudentSemester;

class AcademicProgressionService
{
    /**
     * Convert percentage score to standard grade point.
     */
    public function convertScoreToPoint(float $percentage): float
    {
        if ($percentage >= 90) return 4.00;
        if ($percentage >= 85) return 3.75;
        if ($percentage >= 80) return 3.50;
        if ($percentage >= 75) return 3.00;
        if ($percentage >= 70) return 2.50;
        if ($percentage >= 60) return 2.00;
        if ($percentage >= 50) return 1.00;
        return 0.00;
    }

    /**
     * Convert percentage score to letter grade.
     */
    public function convertScoreToGrade(float $percentage): string
    {
        if ($percentage >= 90) return 'A+';
        if ($percentage >= 85) return 'A';
        if ($percentage >= 80) return 'B+';
        if ($percentage >= 75) return 'B';
        if ($percentage >= 70) return 'C+';
        if ($percentage >= 60) return 'C';
        if ($percentage >= 50) return 'D';
        return 'F';
    }

    /**
     * Calculate Semester GPA (SGPA) for a student in a specific semester.
     */
    public function calculateSGPA(Student $student, Semester $semester): float
    {
        $enrollments = $student->courseEnrollments()
            ->whereHas('course', function ($q) use ($semester) {
                $q->where('semester_id', $semester->id);
            })->get();

        $totalPoints = 0;
        $totalCredits = 0;

        foreach ($enrollments as $enrollment) {
            $grade = $enrollment->grade;
            if ($grade) {
                $gp = $this->convertGradeToPoint($grade);
                $credit = $enrollment->course->credit_hours ?? 3;
                $totalPoints += ($gp * $credit);
                $totalCredits += $credit;
            }
        }

        return $totalCredits > 0 ? round($totalPoints / $totalCredits, 2) : 0.00;
    }

    /**
     * Calculate Cumulative GPA (CGPA) for a student.
     */
    public function calculateCGPA(Student $student): float
    {
        $completedSemesters = $student->enrolledSemesters()
            ->where('status', 'completed')
            ->get();

        $totalPoints = 0;
        $totalCredits = 0;

        foreach ($completedSemesters as $stdSem) {
            $semester = $stdSem->semester;
            if ($semester) {
                $enrollments = $student->courseEnrollments()
                    ->whereHas('course', function ($q) use ($semester) {
                        $q->where('semester_id', $semester->id);
                    })->get();

                foreach ($enrollments as $enrollment) {
                    $grade = $enrollment->grade;
                    if ($grade) {
                        $gp = $this->convertGradeToPoint($grade);
                        $credit = $enrollment->course->credit_hours ?? 3;
                        $totalPoints += ($gp * $credit);
                        $totalCredits += $credit;
                    }
                }
            }
        }

        return $totalCredits > 0 ? round($totalPoints / $totalCredits, 2) : 0.00;
    }

    /**
     * Promote a student to their next semester if they pass eligibility.
     */
    public function promoteStudent(Student $student, Semester $targetSemester): array
    {
        $currentSemester = $student->currentSemester;
        if (!$currentSemester) {
            return ['success' => false, 'message' => 'Student is not currently enrolled in any active semester.'];
        }

        // Calculate SGPA for current semester
        $sgpa = $this->calculateSGPA($student, $currentSemester);

        // Find failed courses in current semester
        $failedCoursesCount = $student->courseEnrollments()
            ->whereHas('course', function ($q) use ($currentSemester) {
                $q->where('semester_id', $currentSemester->id);
            })
            ->where('grade', 'F')
            ->count();

        // Promotion logic
        $status = 'completed';
        $remarks = 'Promoted successfully.';
        $success = true;

        if ($failedCoursesCount >= 3) {
            $status = 'failed';
            $remarks = 'Failed term: 3 or more courses failed. Must repeat semester.';
            $success = false;
        } elseif ($sgpa < 2.00) {
            $remarks = 'Promoted under academic probation (GPA below 2.00).';
        }

        // Update current student-semester status
        StudentSemester::updateOrCreate(
            [
                'student_id' => $student->id,
                'semester_id' => $currentSemester->id,
            ],
            [
                'status' => $status,
                'gpa' => $sgpa,
                'remarks' => $remarks,
            ]
        );

        if ($success) {
            // Update student's current semester references
            $student->update([
                'current_semester_id' => $targetSemester->id,
                'current_semester' => $student->current_semester + 1,
            ]);

            // Enroll in next semester
            StudentSemester::updateOrCreate(
                [
                    'student_id' => $student->id,
                    'semester_id' => $targetSemester->id,
                ],
                [
                    'status' => 'enrolled',
                ]
            );

            return ['success' => true, 'message' => 'Student promoted successfully to ' . $targetSemester->name . '.'];
        }

        return ['success' => false, 'message' => 'Promotion failed. ' . $remarks];
    }

    /**
     * Helper to map letter grade to grade point.
     */
    private function convertGradeToPoint(string $grade): float
    {
        return match (strtoupper($grade)) {
            'A+' => 4.00,
            'A' => 3.75,
            'B+' => 3.50,
            'B' => 3.00,
            'C+' => 2.50,
            'C' => 2.00,
            'D' => 1.00,
            default => 0.00,
        };
    }
}
