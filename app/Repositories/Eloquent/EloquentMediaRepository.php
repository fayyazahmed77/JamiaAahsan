<?php

namespace App\Repositories\Eloquent;

use App\Models\Audio;
use App\Models\Video;
use App\Repositories\Contracts\MediaRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EloquentMediaRepository implements MediaRepositoryInterface
{
    /**
     * Find an audio record by ID.
     */
    public function findAudio(int $id): ?Audio
    {
        return Audio::with(['media.speaker', 'media.category', 'media.year'])->find($id);
    }

    /**
     * Find a video record by ID.
     */
    public function findVideo(int $id): ?Video
    {
        return Video::with(['media.speaker', 'media.category', 'media.year'])->find($id);
    }

    /**
     * Search and paginate audio records.
     */
    public function paginateAudio(array $filters, int $perPage = 12): LengthAwarePaginator
    {
        $query = Audio::with(['media.speaker', 'media.category', 'media.year'])
            ->where('status', true);

        if (!empty($filters['search'])) {
            $searchTerm = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', $searchTerm)
                  ->orWhere('description', 'like', $searchTerm);
            });
        }

        if (!empty($filters['speaker_id'])) {
            $query->whereHas('media', function ($q) use ($filters) {
                $q->where('speaker_id', $filters['speaker_id']);
            });
        }

        if (!empty($filters['category_id'])) {
            $query->whereHas('media', function ($q) use ($filters) {
                $q->where('category_id', $filters['category_id']);
            });
        }

        if (!empty($filters['year_id'])) {
            $query->whereHas('media', function ($q) use ($filters) {
                $q->where('year_id', $filters['year_id']);
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Search and paginate video records.
     */
    public function paginateVideo(array $filters, int $perPage = 12): LengthAwarePaginator
    {
        $query = Video::with(['media.speaker', 'media.category', 'media.year'])
            ->where('status', true);

        if (!empty($filters['search'])) {
            $searchTerm = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', $searchTerm)
                  ->orWhere('description', 'like', $searchTerm);
            });
        }

        if (!empty($filters['speaker_id'])) {
            $query->whereHas('media', function ($q) use ($filters) {
                $q->where('speaker_id', $filters['speaker_id']);
            });
        }

        if (!empty($filters['category_id'])) {
            $query->whereHas('media', function ($q) use ($filters) {
                $q->where('category_id', $filters['category_id']);
            });
        }

        if (!empty($filters['year_id'])) {
            $query->whereHas('media', function ($q) use ($filters) {
                $q->where('year_id', $filters['year_id']);
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get popular audio items.
     */
    public function getPopularAudio(int $excludeId, int $limit = 5): Collection
    {
        return Audio::with(['media.speaker', 'media.category', 'media.year'])
            ->where('status', true)
            ->where('id', '!=', $excludeId)
            ->orderBy('views', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get popular video items.
     */
    public function getPopularVideos(int $excludeId, int $limit = 5): Collection
    {
        return Video::with(['media.speaker', 'media.category', 'media.year'])
            ->where('status', true)
            ->where('id', '!=', $excludeId)
            ->orderBy('views', 'desc')
            ->limit($limit)
            ->get();
    }
}
