<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;
use Spatie\Tags\HasTags;

class Audio extends Model
{
    use HasFactory, SoftDeletes, HasTags;

    protected $table = 'audio';

    protected $fillable = [
        'title',
        'user_title',
        'slug',
        'uri',
        'youtube_url',
        'description',
        'views',
        'thumbnail_uri',
        'publish_date',
        'status',
    ];

    protected $casts = [
        'views'        => 'integer',
        'publish_date' => 'datetime',
        'status'       => 'boolean',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Audio $audio) {
            if (empty($audio->slug)) {
                $audio->slug = static::generateUniqueSlug($audio->title);
            }
        });
    }

    protected static function generateUniqueSlug(string $title): string
    {
        $base  = Str::slug($title);
        $slug  = $base;
        $count = 1;

        while (static::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $base . '-' . $count++;
        }

        return $slug;
    }

    public function media(): HasOne
    {
        return $this->hasOne(Media::class);
    }
}
