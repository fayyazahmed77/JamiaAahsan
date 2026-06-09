<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentProfile extends Model
{
    protected $fillable = [
        'student_id',
        'father_name', 'mother_name',
        'nationality', 'mother_tongue', 'national_id',
        'address', 'city', 'province', 'country',
        'previous_madrasa', 'previous_qualification',
        'hifz_status', 'maslak', 'specialization_interests',
        'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relation',
    ];

    protected function casts(): array
    {
        return [
            'specialization_interests' => 'array',
        ];
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
