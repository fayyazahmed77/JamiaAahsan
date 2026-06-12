<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_id',
        'semester_id',
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
        'semester_id' => 'integer',
        'credit_hours' => 'integer',
        'sort_order' => 'integer',
    ];

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    /** Relationship to the Semester model (renamed to avoid collision with the 'semester' int column). */
    public function semesterModel()
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }

    /** Alias kept for backward compatibility. */
    public function semester()
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function books()
    {
        return $this->belongsToMany(Book::class, 'course_book');
    }

    public function timetableSlots()
    {
        return $this->hasMany(TimetableSlot::class);
    }

    public function studyResources()
    {
        return $this->hasMany(StudyResource::class);
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
