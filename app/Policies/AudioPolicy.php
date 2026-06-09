<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Audio;

class AudioPolicy
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
        return $user->hasPermissionTo('view audio');
    }

    public function view(User $user, Audio $audio): bool
    {
        return $user->hasPermissionTo('view audio');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create audio');
    }

    public function update(User $user, Audio $audio): bool
    {
        return $user->hasPermissionTo('edit audio');
    }

    public function delete(User $user, Audio $audio): bool
    {
        return $user->hasPermissionTo('delete audio');
    }
}
