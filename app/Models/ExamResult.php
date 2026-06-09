<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * D5: ExamResult — per-student marks for a scheduled exam.
 */
class ExamResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'student_id',
        'marks_obtained',
        'grade',
        'remarks',
        'entered_by',
    ];

    protected $casts = [
        'marks_obtained' => 'decimal:2',
    ];

    // ── Relationships ──────────────────────────────────────────────────────

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function enteredBy()
    {
        return $this->belongsTo(User::class, 'entered_by');
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    /**
     * Auto-calculate letter grade from marks and exam passing_marks.
     * Called before save so grade is always consistent.
     */
    public static function calcGrade(float $marks, float $total): string
    {
        $pct = $total > 0 ? ($marks / $total) * 100 : 0;
        return match (true) {
            $pct >= 90 => 'A+',
            $pct >= 80 => 'A',
            $pct >= 70 => 'B',
            $pct >= 60 => 'C',
            $pct >= 50 => 'D',
            default    => 'F',
        };
    }
}
