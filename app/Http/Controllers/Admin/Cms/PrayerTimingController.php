<?php

namespace App\Http\Controllers\Admin\Cms;

use App\Http\Controllers\Controller;
use App\Models\PrayerTiming;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;

class PrayerTimingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Cms/PrayerTimings', [
            'timings' => PrayerTiming::all(),
        ]);
    }

    public function update(Request $request, PrayerTiming $prayerTiming): RedirectResponse
    {
        $validated = $request->validate([
            'time'      => 'required|date_format:H:i:s,H:i',
            'urdu_name' => 'nullable|string|max:255',
        ]);

        $prayerTiming->update($validated);

        Cache::forget('prayer_timings');

        return redirect()->route('admin.prayer-timings.index')->with('success', 'Prayer timing updated successfully.');
    }
}
