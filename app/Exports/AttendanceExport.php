<?php

namespace App\Exports;

use App\Models\AttendanceRecord;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class AttendanceExport implements FromCollection, WithHeadings, WithMapping
{
    protected $courseId;

    public function __construct($courseId = null)
    {
        $this->courseId = $courseId;
    }

    public function collection()
    {
        $query = AttendanceRecord::with('course')
            ->select(
                'course_id',
                'date',
                DB::raw('count(*) as total_students'),
                DB::raw('sum(case when status = "present" then 1 else 0 end) as present_count'),
                DB::raw('sum(case when status = "late" then 1 else 0 end) as late_count'),
                DB::raw('sum(case when status = "absent" then 1 else 0 end) as absent_count'),
                DB::raw('sum(case when status = "excused" then 1 else 0 end) as excused_count')
            )
            ->groupBy('course_id', 'date')
            ->orderBy('date', 'desc');

        if ($this->courseId) {
            $query->where('course_id', $this->courseId);
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'Course',
            'Date',
            'Total Students',
            'Present Count',
            'Late Count',
            'Absent Count',
            'Excused Count',
            'Attendance Rate',
        ];
    }

    /**
     * @param AttendanceRecord $row
     */
    public function map($row): array
    {
        $total = $row->total_students;
        $presentAndLate = $row->present_count + $row->late_count;
        $rate = $total > 0 ? round(($presentAndLate / $total) * 100, 1) . '%' : '0%';

        return [
            $row->course?->name ?? 'N/A',
            $row->date ? $row->date->format('Y-m-d') : 'N/A',
            $total,
            $row->present_count,
            $row->late_count,
            $row->absent_count,
            $row->excused_count,
            $rate,
        ];
    }
}
