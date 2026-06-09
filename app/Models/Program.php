<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'name_ur', 'slug', 'type',
        'duration_years', 'total_semesters',
        'description', 'description_ur',
        'is_active', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active'       => 'boolean',
            'duration_years'  => 'integer',
            'total_semesters' => 'integer',
        ];
    }

    public function batches()
    {
        return $this->hasMany(Batch::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }
}
