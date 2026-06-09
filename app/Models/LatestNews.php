<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LatestNews extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'latest_news';

    protected $fillable = ['text', 'slug', 'image_uri', 'excerpt', 'content', 'link', 'status'];

    protected $casts = [
        'status' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($news) {
            if (empty($news->slug) && !empty($news->text)) {
                $news->slug = static::generateUniqueSlug($news->text);
            }
        });
    }

    protected static function generateUniqueSlug($text)
    {
        // Replace spaces with hyphen, remove special characters
        $slug = preg_replace('/\s+/u', '-', trim($text));
        $slug = preg_replace('/[^\p{L}\p{N}\-]+/u', '', $slug);
        $slug = mb_strtolower($slug);

        if (empty($slug)) {
            $slug = 'news-' . uniqid();
        }

        // Ensure unique
        $originalSlug = $slug;
        $count = 1;
        while (static::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        return $slug;
    }

    public function scopeActive($query)
    {
        return $query->where('status', true);
    }
}
