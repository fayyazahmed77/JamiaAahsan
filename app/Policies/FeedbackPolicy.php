<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Feedback;

class FeedbackPolicy
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
        return $user->hasPermissionTo('view feedback');
    }

    public function view(User $user, Feedback $feedback): bool
    {
        return $user->hasPermissionTo('view feedback');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create feedback');
    }

    public function update(User $user, Feedback $feedback): bool
    {
        return $user->hasPermissionTo('edit feedback');
    }

    public function delete(User $user, Feedback $feedback): bool
    {
        return $user->hasPermissionTo('delete feedback');
    }
}
