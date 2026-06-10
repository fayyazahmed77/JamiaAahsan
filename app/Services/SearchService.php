<?php

namespace App\Services;

use App\Models\Audio;
use App\Models\Video;
use App\Models\QuestionAnswer;

class SearchService
{
    /**
     * Search across Audio, Video, and QuestionAnswer models.
     */
    public function search(string $query, int $limit = 5): array
    {
        if (empty(trim($query))) {
            return [
                'audio' => [],
                'video' => [],
                'fatwa' => [],
            ];
        }

        return [
            'audio' => Audio::where('status', true)
                ->where(function ($q) use ($query) {
                    $q->where('title', 'LIKE', "%{$query}%")
                      ->orWhere('user_title', 'LIKE', "%{$query}%")
                      ->orWhere('description', 'LIKE', "%{$query}%");
                })
                ->take($limit)
                ->get(),
            'video' => Video::where('status', true)
                ->where(function ($q) use ($query) {
                    $q->where('title', 'LIKE', "%{$query}%")
                      ->orWhere('urdu_title', 'LIKE', "%{$query}%")
                      ->orWhere('description', 'LIKE', "%{$query}%");
                })
                ->take($limit)
                ->get(),
            'fatwa' => QuestionAnswer::where('status', true)
                ->where(function ($q) use ($query) {
                    $q->where('title', 'LIKE', "%{$query}%")
                      ->orWhere('question', 'LIKE', "%{$query}%")
                      ->orWhere('answer', 'LIKE', "%{$query}%");
                })
                ->take($limit)
                ->get(),
        ];
    }
}
