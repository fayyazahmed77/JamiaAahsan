<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Image;

class ImagePolicy
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
        return $user->hasPermissionTo('view home.main.banner');
    }

    public function view(User $user, Image $image): bool
    {
        return $user->hasPermissionTo('view home.main.banner');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create home.main.banner');
    }

    public function update(User $user, Image $image): bool
    {
        return $user->hasPermissionTo('edit home.main.banner');
    }

    public function delete(User $user, Image $image): bool
    {
        return $user->hasPermissionTo('delete home.main.banner');
    }
}
