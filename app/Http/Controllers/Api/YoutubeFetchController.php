<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class YoutubeFetchController extends Controller
{
    /**
     * Fetch YouTube metadata from a given URL.
     */
    public function fetch(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
        ]);

        $url = $request->input('url');

        // Regex to check if it's a valid YouTube link
        if (!preg_match('/(youtube\.com|youtu\.be)/i', $url)) {
            return response()->json([
                'success' => false,
                'message' => 'Please provide a valid YouTube URL.',
            ], 422);
        }

        try {
            $response = Http::get('https://www.youtube.com/oembed', [
                'url' => $url,
                'format' => 'json',
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'success' => true,
                    'data' => [
                        'title' => $data['title'] ?? '',
                        'thumbnail_url' => $data['thumbnail_url'] ?? '',
                        'duration' => null, // oEmbed doesn't provide duration; detected client-side
                    ],
                ]);
            }
        } catch (\Exception $e) {
            // Log or ignore
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to retrieve metadata from YouTube. Please enter details manually.',
        ], 400);
    }
}
