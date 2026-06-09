<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Klass extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'classes';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'live_link',
        'youtube_live_link',
        'sort',
        'status',
    ];

    protected $casts = [
        'sort' => 'integer',
        'status' => 'boolean',
    ];

    public function classSessions(): HasMany
    {
        return $this->hasMany(ClassSession::class, 'class_id');
    }

    public function userDetails(): HasMany
    {
        return $this->hasMany(UserDetail::class, 'class_id');
    }
}
