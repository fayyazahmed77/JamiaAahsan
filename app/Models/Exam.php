<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * D4: Exam model — one scheduled exam per course.
 */
class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'type',
        'exam_date',
        'start_time',
        'end_time',
        'venue',
        'total_marks',
        'passing_marks',
        'instructions',
        'is_published',
    ];

    protected $casts = [
        'exam_date'     => 'date',
        'total_marks'   => 'decimal:2',
        'passing_marks' => 'decimal:2',
        'is_published'  => 'boolean',
    ];

    // ── Relationships ──────────────────────────────────────────────────────

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function results()
    {
        return $this->hasMany(ExamResult::class);
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    /** Human-readable type label. */
    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            'midterm' => 'Midterm',
            'final'   => 'Final',
            'quiz'    => 'Quiz',
            default   => ucfirst($this->type),
        };
    }

    /** Scopes */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('exam_date', '>=', now()->toDateString());
    }
}
