import React from 'react';
import { Link } from '@inertiajs/react';
import { DataTable } from '@/Components/ui/DataTable';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { Shield, Lock, Edit, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { Role } from '@/types/models';

interface RolesTabProps {
    roles: Role[];
    confirmDelete: (type: 'role', id: number, name: string) => void;
}

export default function RolesTab({ roles, confirmDelete }: RolesTabProps) {
    const rolesColumns: ColumnDef<Role>[] = [
        {
            accessorKey: 'name',
            header: 'Role Name',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Shield size={16} className="text-primary" />
                    <span className="font-semibold text-foreground">{row.original.name}</span>
                </div>
            ),
        },
        {
            id: 'permissions_count',
            header: 'Permissions Count',
            cell: ({ row }) => {
                const isSuperAdmin = row.original.name === 'Super Admin';
                const count = isSuperAdmin ? 'All' : (row.original.permissions?.length || 0);
                return (
                    <Badge variant={isSuperAdmin ? 'success' : 'secondary'}>
                        {count} Permissions
                    </Badge>
                );
            },
        },
        {
            accessorKey: 'created_at',
            header: 'Created At',
            cell: ({ row }) => {
                const date = row.original.created_at ? new Date(row.original.created_at) : null;
                return date ? date.toLocaleDateString() : 'N/A';
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => {
                const isSystemRole = ['Super Admin', 'Admin', 'Student'].includes(row.original.name);
                return row.original.name === 'Super Admin' ? (
                    <span className="text-xs text-muted-foreground italic flex items-center gap-1 justify-end">
                        <Lock size={12} /> Protected
                    </span>
                ) : (
                    <div className="flex gap-2 justify-end">
                        <Link href={`/admin/roles/${row.original.id}/edit`}>
                            <Button variant="secondary" size="sm">
                                <Edit size={14} />
                            </Button>
                        </Link>
                        {!isSystemRole && (
                            <Button variant="destructive" size="sm" onClick={() => confirmDelete('role', row.original.id, row.original.name)}>
                                <Trash2 size={14} />
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <DataTable
            columns={rolesColumns}
            data={roles}
            emptyMessage="No roles created yet."
        />
    );
}
