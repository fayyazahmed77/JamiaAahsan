<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DigitalStudentId extends Model
{
    protected $table = 'digital_student_ids';

    protected $fillable = [
        'student_id', 'card_number',
        'qr_code_data', 'qr_code_path', 'pdf_path',
        'issued_at', 'valid_until', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'issued_at'   => 'date',
            'valid_until' => 'date',
            'is_active'   => 'boolean',
        ];
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function getQrCodeUrlAttribute(): ?string
    {
        return $this->qr_code_path ? asset('storage/' . $this->qr_code_path) : null;
    }

    public function getPdfUrlAttribute(): ?string
    {
        return $this->pdf_path ? asset('storage/' . $this->pdf_path) : null;
    }
}
