<?php

namespace App\Repositories\Eloquent;

use App\Models\UserDetail;
use App\Models\LogAdmissionClass;
use App\Repositories\Contracts\AdmissionRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class EloquentAdmissionRepository implements AdmissionRepositoryInterface
{
    /**
     * Search and paginate admission applications.
     */
    public function paginateAdmissions(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = UserDetail::with(['user', 'class']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('registration_no', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('id_card_no', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if (!empty($filters['gender'])) {
            $query->where('gender', $filters['gender']);
        }

        if (!empty($filters['class_id'])) {
            $query->where('class_id', $filters['class_id']);
        }

        if (isset($filters['status'])) {
            if ($filters['status'] === 'approved') {
                $query->where('is_approved', true);
            } elseif ($filters['status'] === 'pending') {
                $query->where('is_approved', false);
            }
        }

        return $query->latest()->paginate($perPage);
    }

    /**
     * Find an admission record by ID.
     */
    public function find(int $id): ?UserDetail
    {
        return UserDetail::with(['user', 'class'])->find($id);
    }

    /**
     * Get admission logs for a specific student user.
     */
    public function getAdmissionLogs(int $studentUserId): Collection
    {
        return LogAdmissionClass::where('student_id', $studentUserId)
            ->with(['admin', 'class'])
            ->latest()
            ->get();
    }
}
