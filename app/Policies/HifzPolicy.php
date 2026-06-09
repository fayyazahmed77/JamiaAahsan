<?php

namespace App\Policies;

use App\Models\HifzEnrollment;
use App\Models\User;

/**
 * C3: HifzPolicy — gates admin operations on Hifz enrollments.
 */
class HifzPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }
        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view hifz');
    }

    public function view(User $user, HifzEnrollment $enrollment): bool
    {
        return $user->hasPermissionTo('view hifz');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage hifz');
    }

    public function update(User $user, HifzEnrollment $enrollment): bool
    {
        return $user->hasPermissionTo('manage hifz');
    }

    public function delete(User $user, HifzEnrollment $enrollment): bool
    {
        return $user->hasPermissionTo('manage hifz');
    }

    /** Controls who can record a Hifz session (teacher-level operation). */
    public function recordSession(User $user, HifzEnrollment $enrollment): bool
    {
        return $user->hasPermissionTo('manage hifz');
    }
}
