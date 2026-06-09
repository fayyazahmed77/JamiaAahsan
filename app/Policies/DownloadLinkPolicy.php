<?php

namespace App\Policies;

use App\Models\User;
use App\Models\DownloadLink;

class DownloadLinkPolicy
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
        return $user->hasPermissionTo('view downloads');
    }

    public function view(User $user, DownloadLink $downloadLink): bool
    {
        return $user->hasPermissionTo('view downloads');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create downloads');
    }

    public function update(User $user, DownloadLink $downloadLink): bool
    {
        return $user->hasPermissionTo('edit downloads');
    }

    public function delete(User $user, DownloadLink $downloadLink): bool
    {
        return $user->hasPermissionTo('delete downloads');
    }
}
