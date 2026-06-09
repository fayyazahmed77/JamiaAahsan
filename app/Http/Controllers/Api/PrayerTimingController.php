<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrayerTiming;
use App\Http\Resources\PrayerTimingResource;
use Illuminate\Support\Facades\Cache;

class PrayerTimingController extends Controller
{
    public function index()
    {
        $timings = Cache::remember('prayer_timings', now()->addDay(), fn() => PrayerTiming::all());
        return PrayerTimingResource::collection($timings);
    }
}
