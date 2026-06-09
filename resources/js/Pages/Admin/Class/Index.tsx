import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { SearchableSelect } from '@/Components/ui/SearchableSelect';
import { Badge } from '@/Components/ui/Badge';
import { DataTable } from '@/Components/ui/DataTable';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';
import type { Klass, PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';
import { GraduationCap, Calendar, Edit, Trash, Plus } from 'lucide-react';

interface Props {
    classes: {
        data: Klass[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function ClassIndex({ classes, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [deleteClass, setDeleteClass] = useState<Klass | null>(null);
    const { hasPermission } = usePermission();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (val: string) => {
        setStatusFilter(val);
        applyFilters(search, val);
    };

    const applyFilters = (searchText: string, statusText: string) => {
        router.get(
            '/admin/classes',
            {
                search: searchText || undefined,
                status: statusText || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(search, statusFilter);
    };

    const handleDelete = () => {
        if (!deleteClass) return;
        router.delete(`/admin/classes/${deleteClass.id}`, {
            onSuccess: () => setDeleteClass(null),
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/classes',
            {
                page,
                search: search || undefined,
                status: statusFilter || undefined,
            },
            { preserveState: true }
        );
    };

    const columns: ColumnDef<Klass>[] = [
        {
            accessorKey: 'sort',
            header: 'Sort',
            size: 60,
            cell: ({ row }) => <span className="font-mono text-muted-foreground">{row.original.sort ?? '-'}</span>,
        },
        {
            accessorKey: 'name',
            header: 'Class Name',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{row.original.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">{row.original.slug}</span>
                </div>
            ),
        },
        {
            accessorKey: 'live_link',
            header: 'Live Status',
            cell: ({ row }) => {
                const isLive = !!(row.original.live_link || row.original.youtube_live_link);
                return (
                    <Badge variant={isLive ? 'success' : 'muted'}>
                        {isLive ? '🔴 Stream Connected' : 'Offline'}
                    </Badge>
                );
            },
            size: 150,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={row.original.status ? 'success' : 'muted'}>
                    {row.original.status ? 'Active' : 'Inactive'}
                </Badge>
            ),
            size: 100,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Link href={`/admin/classes/${row.original.id}/sessions`}>
                        <Button variant="secondary" size="sm" className="flex items-center gap-1">
                            <Calendar size={14} /> Sessions
                        </Button>
                    </Link>
                    {hasPermission('edit classes') && (
                        <Link href={`/admin/classes/${row.original.id}/edit`}>
                            <Button variant="secondary" size="sm" className="flex items-center gap-1">
                                <Edit size={14} /> Edit
                            </Button>
                        </Link>
                    )}
                    {hasPermission('delete classes') && (
                        <Button variant="destructive" size="sm" onClick={() => setDeleteClass(row.original)} className="flex items-center gap-1">
                            <Trash size={14} /> Delete
                        </Button>
                    )}
                </div>
            ),
            size: 250,
        },
    ];

    const meta: PageMeta = {
        current_page: classes.current_page,
        last_page: classes.last_page,
        per_page: classes.per_page,
        total: classes.total,
        from: classes.from,
        to: classes.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-end w-full">
            <div className="flex-1 min-w-[200px]">
                <Input
                    placeholder="Search classes..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full"
                />
            </div>
            <div className="w-[150px]">
                <SearchableSelect
                    value={statusFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    options={[
                        { value: '1', label: 'Active' },
                        { value: '0', label: 'Inactive' },
                    ]}
                    placeholder="All Status"
                />
            </div>
            <Button type="submit" variant="primary">
                Search
            </Button>
            <Button
                type="button"
                variant="secondary"
                onClick={() => {
                    setSearch('');
                    setStatusFilter('');
                    router.get('/admin/classes');
                }}
            >
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout
            title="Dars-e-Nizami Classes"
            action={
                hasPermission('create classes') ? (
                    <Link href="/admin/classes/create">
                        <Button variant="primary" className="flex items-center gap-1.5">
                            <Plus size={16} /> Add Class
                        </Button>
                    </Link>
                ) : undefined
            }
        >
            <Head title="Classes" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={classes.data}
                        meta={meta}
                        onPageChange={handlePageChange}
                        toolbar={toolbar}
                    />
                </CardBody>
            </Card>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteClass}
                onClose={() => setDeleteClass(null)}
                onConfirm={handleDelete}
                title="Delete Class"
                message={`Are you sure you want to delete class "${deleteClass?.name}"? You cannot delete a class if student admissions or sessions are attached to it.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
