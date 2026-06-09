<?php

namespace App\Console\Commands;

use App\Models\Audio;
use App\Models\Klass;
use App\Models\LatestNews;
use App\Models\Video;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

/**
 * B4: GenerateSitemap — builds sitemap.xml once and saves to public storage.
 *
 * Replaces the live-query sitemap route that ran 4+ DB table scans
 * on every crawler request.
 *
 * Schedule: every 6 hours via routes/console.php
 * Run manually: php artisan sitemap:generate
 */
class GenerateSitemap extends Command
{
    protected $signature   = 'sitemap:generate';
    protected $description = 'Generate sitemap.xml and save to public storage';

    public function handle(): int
    {
        $this->info('Generating sitemap.xml...');

        $urls = $this->getStaticUrls();

        // ── Dynamic: Education classes ────────────────────────────────────────
        Klass::where('status', true)->select(['slug', 'updated_at'])->each(function ($class) use (&$urls) {
            $urls[] = [
                'loc'        => url("/education/{$class->slug}"),
                'lastmod'    => $class->updated_at->toAtomString(),
                'changefreq' => 'weekly',
                'priority'   => '0.8',
            ];
        });

        // ── Dynamic: Audio (Bayanat) ──────────────────────────────────────────
        Audio::where('status', true)->select(['slug', 'updated_at'])->each(function ($audio) use (&$urls) {
            $urls[] = [
                'loc'        => url("/media/audio/{$audio->slug}"),
                'lastmod'    => $audio->updated_at->toAtomString(),
                'changefreq' => 'monthly',
                'priority'   => '0.7',
            ];
        });

        // ── Dynamic: Videos ───────────────────────────────────────────────────
        Video::where('status', true)->select(['slug', 'updated_at'])->each(function ($video) use (&$urls) {
            $urls[] = [
                'loc'        => url("/media/video/{$video->slug}"),
                'lastmod'    => $video->updated_at->toAtomString(),
                'changefreq' => 'monthly',
                'priority'   => '0.7',
            ];
        });

        // ── Dynamic: News ─────────────────────────────────────────────────────
        LatestNews::where('status', true)->select(['slug', 'updated_at'])->each(function ($news) use (&$urls) {
            $urls[] = [
                'loc'        => url("/news/{$news->slug}"),
                'lastmod'    => $news->updated_at->toAtomString(),
                'changefreq' => 'weekly',
                'priority'   => '0.8',
            ];
        });

        $xml = $this->buildXml($urls);

        Storage::disk('public')->put('sitemap.xml', $xml);

        $count = count($urls);
        $this->info("Sitemap generated with {$count} URLs → storage/app/public/sitemap.xml");

        return Command::SUCCESS;
    }

    private function getStaticUrls(): array
    {
        $now = now()->toAtomString();

        return [
            ['loc' => url('/'),                  'lastmod' => $now, 'changefreq' => 'daily',   'priority' => '1.0'],
            ['loc' => url('/about'),              'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => url('/about/history'),      'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.7'],
            ['loc' => url('/about/leadership'),   'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.7'],
            ['loc' => url('/about/faculty'),      'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.7'],
            ['loc' => url('/education'),          'lastmod' => $now, 'changefreq' => 'weekly',  'priority' => '0.9'],
            ['loc' => url('/media/audio'),        'lastmod' => $now, 'changefreq' => 'daily',   'priority' => '0.9'],
            ['loc' => url('/media/video'),        'lastmod' => $now, 'changefreq' => 'daily',   'priority' => '0.9'],
            ['loc' => url('/media/live'),         'lastmod' => $now, 'changefreq' => 'daily',   'priority' => '0.8'],
            ['loc' => url('/admissions'),         'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => url('/fatwa'),              'lastmod' => $now, 'changefreq' => 'daily',   'priority' => '0.8'],
            ['loc' => url('/donate'),             'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.7'],
            ['loc' => url('/news'),               'lastmod' => $now, 'changefreq' => 'daily',   'priority' => '0.8'],
            ['loc' => url('/downloads'),          'lastmod' => $now, 'changefreq' => 'weekly',  'priority' => '0.8'],
            ['loc' => url('/contact'),            'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.6'],
        ];
    }

    private function buildXml(array $urls): string
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        foreach ($urls as $url) {
            $xml .= '<url>';
            $xml .= '<loc>' . htmlspecialchars($url['loc']) . '</loc>';
            $xml .= '<lastmod>' . $url['lastmod'] . '</lastmod>';
            $xml .= '<changefreq>' . $url['changefreq'] . '</changefreq>';
            $xml .= '<priority>' . $url['priority'] . '</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return $xml;
    }
}
