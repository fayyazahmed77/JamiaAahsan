<?php

namespace App\Repositories\Contracts;

use App\Models\UserDetail;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface AdmissionRepositoryInterface
{
    /**
     * Search and paginate admission applications.
     */
    public function paginateAdmissions(array $filters, int $perPage = 15): LengthAwarePaginator;

    /**
     * Find an admission record by ID.
     */
    public function find(int $id): ?UserDetail;

    /**
     * Get admission logs for a specific student user.
     */
    public function getAdmissionLogs(int $studentUserId): Collection;
}
