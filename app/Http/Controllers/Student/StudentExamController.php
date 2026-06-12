<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ExamResult;
use App\Models\Exam;
use App\Models\StudentCourseEnrollment;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StudentExamController extends Controller
{
    /**
     * Display student exams schedule and results marksheet.
     */
    public function index(): Response
    {
        $student = Auth::guard('student')->user();
        
        $courseIds = StudentCourseEnrollment::where('student_id', $student->id)
            ->where('status', 'active')
            ->pluck('course_id');

        // Fetch published exams scheduled
        $exams = Exam::whereIn('course_id', $courseIds)
            ->where('is_published', true)
            ->with('course')
            ->orderBy('exam_date')
            ->get()
            ->map(fn($e) => [
                'id' => $e->id,
                'title' => $e->title,
                'type' => $e->type,
                'exam_date' => $e->exam_date->format('Y-m-d'),
                'start_time' => $e->start_time,
                'end_time' => $e->end_time,
                'venue' => $e->venue,
                'total_marks' => (float)$e->total_marks,
                'passing_marks' => (float)$e->passing_marks,
                'instructions' => $e->instructions,
                'course' => [
                    'id' => $e->course->id,
                    'name' => $e->course->name,
                    'code' => $e->course->code,
                ]
            ]);

        // Fetch exam results
        $results = ExamResult::where('student_id', $student->id)
            ->whereHas('exam', fn($q) => $q->where('status', 'published'))
            ->with(['exam.course'])
            ->latest()
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'marks_obtained' => $r->marks_obtained !== null ? (float)$r->marks_obtained : null,
                'grade' => $r->grade,
                'remarks' => $r->remarks,
                'exam' => [
                    'id' => $r->exam->id,
                    'title' => $r->exam->title,
                    'type' => $r->exam->type,
                    'total_marks' => (float)$r->exam->total_marks,
                    'passing_marks' => (float)$r->exam->passing_marks,
                    'course' => [
                        'id' => $r->exam->course->id,
                        'name' => $r->exam->course->name,
                        'code' => $r->exam->course->code,
                    ]
                ]
            ]);

        // Calculate GPA
        $gpa = $this->calculateGpa($results);

        return Inertia::render('Student/Exams/Index', [
            'exams' => $exams,
            'results' => $results,
            'gpa' => $gpa
        ]);
    }

    private function calculateGpa($results): float
    {
        if ($results->isEmpty()) return 0.0;
        $totalPoints = 0;
        $count = 0;
        foreach ($results as $r) {
            if ($r['grade'] !== null) {
                $totalPoints += $this->gradeToPoints($r['grade']);
                $count++;
            }
        }
        return $count > 0 ? round($totalPoints / $count, 2) : 0.0;
    }

    private function gradeToPoints(?string $grade): float
    {
        $grades = [
            'A+' => 4.0,
            'A'  => 4.0,
            'B'  => 3.0,
            'C'  => 2.0,
            'D'  => 1.0,
            'F'  => 0.0
        ];
        return $grades[strtoupper($grade)] ?? 0.0;
    }
}
