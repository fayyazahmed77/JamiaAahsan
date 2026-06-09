<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Image extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'uri',
        'description',
        'btn_title',
        'btn_link',
        'weight',
        'parent_id',
        'status',
    ];

    protected $casts = [
        'weight' => 'integer',
        'status' => 'boolean',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Image::class, 'parent_id')->orderBy('weight', 'asc');
    }

    public function media(): HasOne
    {
        return $this->hasOne(Media::class);
    }
}
