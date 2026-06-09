<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HifzEnrollment extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'teacher_id',
        'start_date',
        'target_completion_date',
        'total_juz_target',
        'juz_completed',
        'current_surah',
        'current_ayah',
        'status',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'target_completion_date' => 'date',
        'total_juz_target' => 'integer',
        'juz_completed' => 'integer',
        'current_ayah' => 'integer',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    /**
     * Hifz sessions for this enrollment (matched by student_id).
     * Used by withCount('sessions') to avoid N+1 on the index listing.
     */
    public function sessions(): HasMany
    {
        return $this->hasMany(HifzSession::class, 'student_id', 'student_id');
    }
}
