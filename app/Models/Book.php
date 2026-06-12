<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'urdu_name', 'status'];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function classSessions(): HasMany
    {
        return $this->hasMany(ClassSession::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_book');
    }
}
