<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Feedback extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'feedback';

    protected $fillable = [
        'name',
        'email',
        'country',
        'comment',
        'rating',
        'phone',
        'is_read',
        'replied_at',
        'replied_by',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_read' => 'boolean',
        'replied_at' => 'datetime',
    ];
}
