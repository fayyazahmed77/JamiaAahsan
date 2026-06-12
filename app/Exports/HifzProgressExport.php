<?php

namespace App\Exports;

use App\Models\HifzEnrollment;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class HifzProgressExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return HifzEnrollment::with(['student', 'teacher'])->get();
    }

    public function headings(): array
    {
        return [
            'Student ID',
            'Student Name',
            'Hifz Status',
            'Teacher Name',
            'Juz Completed',
            'Target Juz',
            'Progress Rate',
            'Current Surah',
            'Current Ayah',
            'Start Date',
            'Target Completion Date',
        ];
    }

    /**
     * @param HifzEnrollment $enrollment
     */
    public function map($enrollment): array
    {
        $target = $enrollment->total_juz_target ?: 30;
        $completed = $enrollment->juz_completed ?: 0;
        $rate = $target > 0 ? round(($completed / $target) * 100, 1) . '%' : '0%';

        return [
            $enrollment->student?->student_id_number ?? 'N/A',
            $enrollment->student?->name ?? 'N/A',
            ucfirst($enrollment->status),
            $enrollment->teacher?->name ?? 'N/A',
            $completed,
            $target,
            $rate,
            $enrollment->current_surah ?? 'N/A',
            $enrollment->current_ayah ?? 'N/A',
            $enrollment->start_date ? $enrollment->start_date->format('Y-m-d') : 'N/A',
            $enrollment->target_completion_date ? $enrollment->target_completion_date->format('Y-m-d') : 'N/A',
        ];
    }
}
