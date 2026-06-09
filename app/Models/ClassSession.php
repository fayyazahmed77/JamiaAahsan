<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClassSession extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'class_id',
        'teacher_id',
        'book_id',
        'year_id',
        'lecture_link',
        'created_by',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function class(): BelongsTo
    {
        return $this->belongsTo(Klass::class, 'class_id');
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }

    public function year(): BelongsTo
    {
        return $this->belongsTo(Year::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
