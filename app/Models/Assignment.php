<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'teacher_id',
        'title',
        'title_ur',
        'description',
        'description_ur',
        'due_date',
        'max_marks',
        'allow_late_submission',
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'max_marks' => 'decimal:2',
        'allow_late_submission' => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function submissions()
    {
        return $this->hasMany(AssignmentSubmission::class);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
