<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\Tags\HasTags;

class Video extends Model
{
    use HasFactory, SoftDeletes, HasTags;

    protected $fillable = [
        'title',
        'slug',
        'urdu_title',
        'uri',
        'duration',
        'width',
        'height',
        'file_size',
        'mime_type',
        'youtube_url',
        'description',
        'meta_title',
        'meta_description',
        'views',
        'watch_time',
        'thumbnail_uri',
        'status',
    ];

    protected $casts = [
        'views' => 'integer',
        'watch_time' => 'integer',
        'status' => 'boolean',
        'duration' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'file_size' => 'integer',
    ];

    public function media(): HasOne
    {
        return $this->hasOne(Media::class);
    }
}
