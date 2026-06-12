<?php

namespace App\Services;

use App\Exports\StudentExport;
use App\Exports\AdmissionExport;
use App\Exports\AttendanceExport;
use App\Exports\AssignmentSubmissionExport;
use App\Exports\HifzProgressExport;
use App\Models\Student;
use App\Models\HifzEnrollment;
use App\Models\HifzSession;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

class ExportService
{
    public function exportStudents()
    {
        return Excel::download(new StudentExport, 'students.xlsx');
    }

    public function exportAdmissions()
    {
        return Excel::download(new AdmissionExport, 'admissions.xlsx');
    }

    public function exportAttendance($courseId = null)
    {
        $filename = $courseId ? 'attendance_course_' . $courseId . '.xlsx' : 'attendance_report.xlsx';
        return Excel::download(new AttendanceExport($courseId), $filename);
    }

    public function exportAssignmentSubmissions($assignmentId = null)
    {
        $filename = $assignmentId ? 'assignment_submissions_' . $assignmentId . '.xlsx' : 'assignment_submissions.xlsx';
        return Excel::download(new AssignmentSubmissionExport($assignmentId), $filename);
    }

    public function exportHifzProgressExcel()
    {
        return Excel::download(new HifzProgressExport, 'hifz_progress.xlsx');
    }

    public function exportHifzProgressPdf(int $studentId)
    {
        $student = Student::findOrFail($studentId);
        $enrollment = HifzEnrollment::where('student_id', $studentId)->with('teacher')->first();
        
        $sessions = HifzSession::where('student_id', $studentId)
            ->with('teacher')
            ->orderBy('session_date', 'desc')
            ->take(15) // Recent 15 sessions for the report card
            ->get();

        $completionRate = 0;
        if ($enrollment && $enrollment->total_juz_target > 0) {
            $completionRate = round(($enrollment->juz_completed / $enrollment->total_juz_target) * 100, 1);
        }

        if (class_exists(\Barryvdh\DomPDF\Facade\Pdf::class)) {
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.hifz_progress', compact('student', 'enrollment', 'sessions', 'completionRate'))
                ->setPaper('a4', 'portrait');
            return $pdf->download('hifz_progress_' . $student->student_id_number . '.pdf');
        }

        abort(500, 'PDF generation library is not loaded. Please try again later.');
    }
}
