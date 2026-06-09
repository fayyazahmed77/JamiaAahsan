<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HifzSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'teacher_id',
        'session_date',
        'sabqi_from',
        'sabqi_to',
        'sabqi_pages',
        'sabqi_quality',
        'manzil_from',
        'manzil_to',
        'manzil_quality',
        'new_lesson_from',
        'new_lesson_to',
        'new_lesson_pages',
        'teacher_notes',
        'mistakes_count',
    ];

    protected $casts = [
        'session_date' => 'date',
        'sabqi_pages' => 'integer',
        'new_lesson_pages' => 'integer',
        'mistakes_count' => 'integer',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
