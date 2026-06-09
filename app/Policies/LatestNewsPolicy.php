<?php

namespace App\Policies;

use App\Models\User;
use App\Models\LatestNews;

class LatestNewsPolicy
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
        return $user->hasPermissionTo('view latest-news');
    }

    public function view(User $user, LatestNews $latestNews): bool
    {
        return $user->hasPermissionTo('view latest-news');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create latest-news');
    }

    public function update(User $user, LatestNews $latestNews): bool
    {
        return $user->hasPermissionTo('edit latest-news');
    }

    public function delete(User $user, LatestNews $latestNews): bool
    {
        return $user->hasPermissionTo('delete latest-news');
    }
}
