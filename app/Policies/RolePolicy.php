<?php

namespace App\Policies;

use App\Models\User;
use Spatie\Permission\Models\Role;

class RolePolicy
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
        return $user->hasPermissionTo('view roles');
    }

    public function view(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('view roles');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create roles');
    }

    public function update(User $user, Role $role): bool
    {
        if ($role->name === 'Super Admin') {
            return false;
        }

        return $user->hasPermissionTo('edit roles');
    }

    public function delete(User $user, Role $role): bool
    {
        if (in_array($role->name, ['Super Admin', 'Admin', 'Student'])) {
            return false;
        }

        return $user->hasPermissionTo('delete roles');
    }
}
