<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'teacher_id',
        'day_of_week',
        'start_time',
        'end_time',
        'room_id',
        'type',
        'meeting_url',
        'is_recurring',
        'is_active',
    ];

    protected $casts = [
        'day_of_week' => 'integer',
        'is_recurring' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function room()
    {
        return $this->belongsTo(ClassRoom::class, 'room_id');
    }

    public function attendanceRecords()
    {
        return $this->hasMany(AttendanceRecord::class);
    }
}
