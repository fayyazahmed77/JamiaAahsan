<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_id',
        'name',
        'name_ur',
        'code',
        'year',
        'semester',
        'credit_hours',
        'teacher_id',
        'description',
        'description_ur',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'year' => 'integer',
        'semester' => 'integer',
        'credit_hours' => 'integer',
        'sort_order' => 'integer',
    ];

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function enrollments()
    {
        return $this->hasMany(StudentCourseEnrollment::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_course_enrollments');
    }

    public function schedules()
    {
        return $this->hasMany(ClassSchedule::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    public function attendanceRecords()
    {
        return $this->hasMany(AttendanceRecord::class);
    }
}
