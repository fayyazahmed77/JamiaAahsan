<?php

namespace App\Exports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class StudentExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Student::with('program')->get();
    }

    public function headings(): array
    {
        return [
            'Student ID',
            'Name',
            'Urdu Name',
            'Email',
            'Phone',
            'Gender',
            'Student Type',
            'Current Year',
            'Current Semester',
            'Program',
            'Status',
            'Enrollment Date',
        ];
    }

    /**
     * @param Student $student
     */
    public function map($student): array
    {
        return [
            $student->student_id_number,
            $student->name,
            $student->urdu_name,
            $student->email,
            $student->phone,
            ucfirst($student->gender),
            ucfirst($student->student_type),
            $student->current_year,
            $student->current_semester,
            $student->program?->name ?? 'N/A',
            ucfirst($student->status),
            $student->enrollment_date ? $student->enrollment_date->format('Y-m-d') : 'N/A',
        ];
    }
}
