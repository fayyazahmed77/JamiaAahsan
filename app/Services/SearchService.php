<?php

namespace App\Services;

use App\Models\Audio;
use App\Models\Video;
use App\Models\QuestionAnswer;
use App\Models\LatestNews;

class SearchService
{
    public function search(string $query, int $limit = 10): array
    {
        if (empty(trim($query))) {
            return [
                'audio' => [],
                'video' => [],
                'fatwa' => [],
                'news' => [],
            ];
        }

        // Search Audio bayanaat
        $audio = Audio::where('status', true)
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('urdu_title', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%");
            })
            ->with(['media.speaker', 'media.category'])
            ->take($limit)
            ->get();

        // Search Videos
        $video = Video::where('status', true)
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%");
            })
            ->take($limit)
            ->get();

        // Search Questions & Answers (Fatwa)
        $fatwa = QuestionAnswer::where('status', true)
            ->where(function ($q) use ($query) {
                $q->where('question', 'like', "%{$query}%")
                  ->orWhere('answer', 'like', "%{$query}%")
                  ->orWhere('question_no', 'like', "%{$query}%");
            })
            ->with('topic')
            ->take($limit)
            ->get();

        // Search News
        $news = LatestNews::where('status', true)
            ->where(function ($q) use ($query) {
                $q->where('text', 'like', "%{$query}%")
                  ->orWhere('content', 'like', "%{$query}%")
                  ->orWhere('excerpt', 'like', "%{$query}%");
            })
            ->take($limit)
            ->get();

        return [
            'audio' => $audio,
            'video' => $video,
            'fatwa' => $fatwa,
            'news' => $news,
        ];
    }
}
