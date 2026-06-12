<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudyResource extends Model
{
    use HasFactory;

    protected $table = 'study_resources';

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'file_path',
        'file_type',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
