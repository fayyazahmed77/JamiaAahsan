<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Video;

class VideoPolicy
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
        return $user->hasPermissionTo('view videos');
    }

    public function view(User $user, Video $video): bool
    {
        return $user->hasPermissionTo('view videos');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create videos');
    }

    public function update(User $user, Video $video): bool
    {
        return $user->hasPermissionTo('edit videos');
    }

    public function delete(User $user, Video $video): bool
    {
        return $user->hasPermissionTo('delete videos');
    }
}
