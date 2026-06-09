<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class YoutubeFetchTest extends TestCase
{
    public function test_youtube_fetch_requires_valid_url(): void
    {
        $response = $this->getJson('/api/v1/youtube/fetch?url=not-a-url');
        $response->assertStatus(422);
    }

    public function test_youtube_fetch_requires_youtube_url(): void
    {
        $response = $this->getJson('/api/v1/youtube/fetch?url=https://google.com');
        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Please provide a valid YouTube URL.');
    }

    public function test_youtube_fetch_returns_metadata_successfully(): void
    {
        Http::fake([
            'youtube.com/oembed*' => Http::response([
                'title' => 'Islamic Lecture on Patience',
                'thumbnail_url' => 'https://i.ytimg.com/vi/123/hqdefault.jpg'
            ], 200)
        ]);

        $response = $this->getJson('/api/v1/youtube/fetch?url=https://www.youtube.com/watch?v=123');
        
        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'Islamic Lecture on Patience')
            ->assertJsonPath('data.thumbnail_url', 'https://i.ytimg.com/vi/123/hqdefault.jpg');
    }

    public function test_youtube_fetch_handles_oembed_failure(): void
    {
        Http::fake([
            'youtube.com/oembed*' => Http::response(null, 500)
        ]);

        $response = $this->getJson('/api/v1/youtube/fetch?url=https://www.youtube.com/watch?v=123');
        
        $response->assertStatus(400)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Failed to retrieve metadata from YouTube. Please enter details manually.');
    }
}
