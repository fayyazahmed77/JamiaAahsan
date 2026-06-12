<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'title_ur',
        'content',
        'content_ur',
        'audience',
        'is_pinned',
        'published_at',
        'created_by',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopePublished($query)
    {
        return $query->where('published_at', '<=', now())
            ->orWhereNull('published_at');
    }

    public function scopeForAudience($query, string $audience)
    {
        return $query->whereIn('audience', ['all', $audience]);
    }
}
