<?php

namespace App\Repositories\Contracts;

use App\Models\Audio;
use App\Models\Video;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface MediaRepositoryInterface
{
    /**
     * Find an audio record by ID.
     */
    public function findAudio(int $id): ?Audio;

    /**
     * Find a video record by ID.
     */
    public function findVideo(int $id): ?Video;

    /**
     * Search and paginate audio records.
     */
    public function paginateAudio(array $filters, int $perPage = 12): LengthAwarePaginator;

    /**
     * Search and paginate video records.
     */
    public function paginateVideo(array $filters, int $perPage = 12): LengthAwarePaginator;

    /**
     * Get popular audio items.
     */
    public function getPopularAudio(int $excludeId, int $limit = 5): Collection;

    /**
     * Get popular video items.
     */
    public function getPopularVideos(int $excludeId, int $limit = 5): Collection;
}
