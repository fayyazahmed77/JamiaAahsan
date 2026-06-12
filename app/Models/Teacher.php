<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Teacher extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'urdu_name',
        'is_leadership',
        'designation',
        'designation_urdu',
        'bio',
        'bio_urdu',
        'photo_uri',
        'sort_order',
        'status'
    ];

    protected $casts = [
        'status' => 'boolean',
        'is_leadership' => 'boolean',
    ];

    public function classSessions(): HasMany
    {
        return $this->hasMany(ClassSession::class);
    }

    /** D7: Courses this teacher is assigned to. */
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    public function timetableSlots(): HasMany
    {
        return $this->hasMany(TimetableSlot::class);
    }

    /** D7: Assignments created by this teacher. */
    public function assignments(): HasMany
    {
        return $this->hasMany(Assignment::class);
    }

    /**
     * Scope a query to only include active teachers.
     */
    public function scopeActive($query)
    {
        return $query->where('status', true);
    }
}
