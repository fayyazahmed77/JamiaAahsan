<?php

namespace App\Exports;

use App\Models\AssignmentSubmission;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class AssignmentSubmissionExport implements FromCollection, WithHeadings, WithMapping
{
    protected $assignmentId;

    public function __construct($assignmentId = null)
    {
        $this->assignmentId = $assignmentId;
    }

    public function collection()
    {
        $query = AssignmentSubmission::with(['student', 'assignment.course']);

        if ($this->assignmentId) {
            $query->where('assignment_id', $this->assignmentId);
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'Student ID',
            'Student Name',
            'Assignment Title',
            'Course',
            'Submitted At',
            'Marks Obtained',
            'Max Marks',
            'Grade',
            'Status',
        ];
    }

    /**
     * @param AssignmentSubmission $submission
     */
    public function map($submission): array
    {
        $maxMarks = $submission->assignment?->max_marks ?? 0;
        $marksObtained = $submission->marks_obtained;
        
        $grade = 'N/A';
        if ($marksObtained !== null && $maxMarks > 0) {
            $pct = ($marksObtained / $maxMarks) * 100;
            $grade = match (true) {
                $pct >= 90 => 'A+',
                $pct >= 80 => 'A',
                $pct >= 70 => 'B',
                $pct >= 60 => 'C',
                $pct >= 50 => 'D',
                default    => 'F',
            };
        }

        return [
            $submission->student?->student_id_number ?? 'N/A',
            $submission->student?->name ?? 'N/A',
            $submission->assignment?->title ?? 'N/A',
            $submission->assignment?->course?->name ?? 'N/A',
            $submission->submitted_at ? $submission->submitted_at->format('Y-m-d H:i') : 'N/A',
            $marksObtained !== null ? number_format($marksObtained, 2) : 'N/A',
            $maxMarks > 0 ? number_format($maxMarks, 2) : 'N/A',
            $grade,
            ucfirst(str_replace('_', ' ', $submission->status)),
        ];
    }
}
