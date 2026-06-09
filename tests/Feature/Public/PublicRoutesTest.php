<?php

namespace Tests\Feature\Public;

use Tests\TestCase;
use App\Models\Klass;
use App\Models\LatestNews;
use App\Models\Year;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PublicRoutesTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test all basic public GET routes return 200.
     */
    public function test_all_public_get_routes_render_successfully(): void
    {
        // 1. Setup necessary models for detail pages
        $year = Year::firstOrCreate(['name' => 2026], ['status' => true]);
        
        $klass = Klass::firstOrCreate(
            ['slug' => 'test-class'],
            [
                'name' => 'Test Class',
                'description' => 'Test description',
                'status' => true
            ]
        );

        $news = LatestNews::firstOrCreate(
            ['text' => 'Test News Text'],
            [
                'excerpt' => 'Test news excerpt',
                'content' => 'Test news content text',
                'link' => null,
                'status' => true
            ]
        );

        // 2. Define all public routes
        $routes = [
            '/',
            '/about',
            '/about/history',
            '/about/leadership',
            '/about/faculty',
            '/education',
            "/education/{$klass->slug}",
            '/media/audio',
            '/media/video',
            '/media/live',
            '/admissions',
            '/admissions/apply',
            '/fatwa',
            '/donate',
            '/news',
            "/news/{$news->slug}",
            '/downloads',
            '/contact'
        ];

        // 3. Assert each route returns 200 OK
        foreach ($routes as $route) {
            $response = $this->get($route);
            $response->assertStatus(200);
        }
    }
}
