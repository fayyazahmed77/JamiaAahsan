<?php

namespace App\Policies;

use App\Models\Assignment;
use App\Models\User;

/**
 * C3: AssignmentPolicy — gates assignment CRUD and grading operations.
 */
class AssignmentPolicy
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
        return $user->hasPermissionTo('view assignments');
    }

    public function view(User $user, Assignment $assignment): bool
    {
        return $user->hasPermissionTo('view assignments');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create assignments');
    }

    public function update(User $user, Assignment $assignment): bool
    {
        return $user->hasPermissionTo('edit assignments');
    }

    public function delete(User $user, Assignment $assignment): bool
    {
        return $user->hasPermissionTo('delete assignments');
    }

    /**
     * Controls who can grade student submissions.
     * Separate from 'edit assignments' — teachers may grade but not delete.
     */
    public function grade(User $user, Assignment $assignment): bool
    {
        return $user->hasPermissionTo('grade assignments')
            || $user->hasPermissionTo('edit assignments');
    }

    /** Controls who can view all submissions for an assignment. */
    public function viewSubmissions(User $user, Assignment $assignment): bool
    {
        return $user->hasPermissionTo('view assignments');
    }
}
