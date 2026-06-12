<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassRoom extends Model
{
    use HasFactory;

    protected $table = 'class_rooms';

    protected $fillable = [
        'name',
        'room_number',
        'building_name',
        'floor_name',
        'capacity',
        'room_type',
        'features',
        'location',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'capacity' => 'integer',
        'features' => 'array',
    ];

    public function schedules()
    {
        return $this->hasMany(ClassSchedule::class, 'room_id');
    }
}
