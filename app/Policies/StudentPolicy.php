<?php

namespace App\Policies;

use App\Models\Student;
use App\Models\User;

/**
 * C3: StudentPolicy — gates all admin operations on Student records
 * via Spatie permission system, consistent with existing policy pattern.
 */
class StudentPolicy
{
    /** Super Admin bypass — checked first for all abilities. */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('Super Admin')) {
            return true;
        }
        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view students');
    }

    public function view(User $user, Student $student): bool
    {
        return $user->hasPermissionTo('view students');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create students');
    }

    public function update(User $user, Student $student): bool
    {
        return $user->hasPermissionTo('edit students');
    }

    public function delete(User $user, Student $student): bool
    {
        return $user->hasPermissionTo('delete students');
    }

    /** Controls who can change a student's active/inactive status. */
    public function toggleStatus(User $user, Student $student): bool
    {
        return $user->hasPermissionTo('edit students');
    }

    /** Controls who can view a student's full academic record. */
    public function viewAcademics(User $user, Student $student): bool
    {
        return $user->hasPermissionTo('view students');
    }
}
