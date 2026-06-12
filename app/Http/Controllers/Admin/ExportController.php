<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ExportService;
use Illuminate\Http\Request;

class ExportController extends Controller
{
    public function __construct(private readonly ExportService $exportService) {}

    public function exportStudents(Request $request)
    {
        return $this->exportService->exportStudents();
    }

    public function exportAdmissions(Request $request)
    {
        return $this->exportService->exportAdmissions();
    }

    public function exportAttendance(Request $request)
    {
        $courseId = $request->query('course_id');
        return $this->exportService->exportAttendance($courseId);
    }

    public function exportAssignments(Request $request)
    {
        $assignmentId = $request->query('assignment_id');
        return $this->exportService->exportAssignmentSubmissions($assignmentId);
    }

    public function exportHifzExcel(Request $request)
    {
        return $this->exportService->exportHifzProgressExcel();
    }

    public function exportHifzPdf(Request $request, int $studentId)
    {
        return $this->exportService->exportHifzProgressPdf($studentId);
    }
}
