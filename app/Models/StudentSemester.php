<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentSemester extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'semester_id',
        'status',
        'gpa',
        'remarks',
    ];

    protected $casts = [
        'gpa' => 'decimal:2',
    ];

    /**
     * Get the student.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the semester.
     */
    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }
}
