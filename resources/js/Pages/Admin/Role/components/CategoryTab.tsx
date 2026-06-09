import React from 'react';
import { DataTable } from '@/Components/ui/DataTable';
import { Button } from '@/Components/ui/Button';
import { Edit, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import type { PermissionCategory } from '../Index';
import { CategoryIcon } from '../Index';

interface CategoryTabProps {
    categories: PermissionCategory[];
    openEditCategory: (cat: PermissionCategory) => void;
    confirmDelete: (type: 'category', id: number, name: string) => void;
}

export default function CategoryTab({ categories, openEditCategory, confirmDelete }: CategoryTabProps) {
    const categoryColumns: ColumnDef<PermissionCategory>[] = [
        {
            accessorKey: 'name',
            header: 'Permission Category',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <CategoryIcon iconName={row.original.icon} className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm text-foreground">
                        {row.original.name}
                    </span>
                </div>
            ),
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => (
                <div className="flex gap-2 justify-end">
                    <Button variant="secondary" size="sm" onClick={() => openEditCategory(row.original)}>
                        <Edit size={14} />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => confirmDelete('category', row.original.id, row.original.name)}>
                        <Trash2 size={14} />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <DataTable
            columns={categoryColumns}
            data={categories}
            emptyMessage="No permission categories created yet."
        />
    );
}
