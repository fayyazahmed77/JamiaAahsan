<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrayerTiming extends Model
{
    use HasFactory;

    protected $table = 'prayer_timings';

    protected $fillable = ['name', 'urdu_name', 'time'];
}
