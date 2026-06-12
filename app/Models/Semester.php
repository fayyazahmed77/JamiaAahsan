<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Semester extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'program_id',
        'name',
        'code',
        'start_date',
        'end_date',
        'duration_months',
        'status',
        'academic_year',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'duration_months' => 'integer',
    ];

    /**
     * Get the program that owns the semester.
     */
    public function program(): BelongsTo
    {
        return $this->belongsTo(Program::class);
    }

    /**
     * Get the courses mapped to this semester.
     */
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    /**
     * Get the student semester records.
     */
    public function studentSemesters(): HasMany
    {
        return $this->hasMany(StudentSemester::class);
    }

    /**
     * Get the students currently in this semester.
     */
    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'current_semester_id');
    }

    /**
     * Scope a query to only include active semesters.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
