import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';

export function usePermission() {
    const { auth } = usePage<SharedData>().props;

    const hasPermission = (permission: string) => {
        if (!auth?.user) return false;
        return auth.permissions.includes(permission) || auth.roles.includes('Super Admin');
    };

    const hasAnyPermission = (permissions: string[]) => {
        if (!auth?.user) return false;
        return permissions.some(p => auth.permissions.includes(p)) || auth.roles.includes('Super Admin');
    };

    const hasRole = (role: string) => {
        if (!auth?.user) return false;
        return auth.roles.includes(role);
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasRole,
        isSuperAdmin: hasRole('Super Admin'),
    };
}
