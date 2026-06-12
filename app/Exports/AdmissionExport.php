<?php

namespace App\Exports;

use App\Models\UserDetail;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class AdmissionExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return UserDetail::with(['user', 'class'])->get();
    }

    public function headings(): array
    {
        return [
            'Registration No',
            'Applicant Name',
            'Email',
            'Phone',
            'Applied Class',
            'Guardian Name',
            'Gender',
            'Status',
            'Date Submitted',
        ];
    }

    /**
     * @param UserDetail $detail
     */
    public function map($detail): array
    {
        return [
            $detail->registration_no ?? 'Pending',
            $detail->user?->name ?? 'N/A',
            $detail->user?->email ?? 'N/A',
            $detail->phone,
            $detail->class?->name ?? 'N/A',
            $detail->guardian_name,
            ucfirst($detail->gender),
            $detail->is_approved ? 'Approved' : 'Pending Review',
            $detail->created_at ? $detail->created_at->format('Y-m-d') : 'N/A',
        ];
    }
}
