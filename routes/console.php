<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ── Scheduled Jobs ────────────────────────────────────────────────────────────

// Regenerate sitemap.xml every 6 hours so crawlers get a static file
// instead of triggering live DB table scans on every hit.
Schedule::command('sitemap:generate')->everySixHours();
