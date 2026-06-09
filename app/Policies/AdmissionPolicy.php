<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserDetail;

class AdmissionPolicy
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
        return $user->hasPermissionTo('view admissions');
    }

    public function view(User $user, UserDetail $userDetail): bool
    {
        return $user->hasPermissionTo('view admissions');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create admissions');
    }

    public function update(User $user, UserDetail $userDetail): bool
    {
        return $user->hasPermissionTo('edit admissions');
    }

    public function delete(User $user, UserDetail $userDetail): bool
    {
        return $user->hasPermissionTo('delete admissions');
    }
}
