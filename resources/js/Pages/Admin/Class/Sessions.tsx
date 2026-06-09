import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Badge } from '@/Components/ui/Badge';
import { DataTable } from '@/Components/ui/DataTable';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';
import type { Klass, ClassSession, PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowLeft, BookOpen, User, Calendar, Link as LinkIcon, Edit, Trash, Plus } from 'lucide-react';

interface Props {
    klass: Klass;
    sessions: {
        data: ClassSession[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    filters: {
        search?: string;
    };
}

export default function SessionsIndex({ klass, sessions, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [deleteSession, setDeleteSession] = useState<ClassSession | null>(null);
    const { hasPermission } = usePermission();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const applyFilters = (searchText: string) => {
        router.get(
            `/admin/classes/${klass.id}/sessions`,
            { search: searchText || undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(search);
    };

    const handleDelete = () => {
        if (!deleteSession) return;
        router.delete(`/admin/classes/${klass.id}/sessions/${deleteSession.id}`, {
            onSuccess: () => setDeleteSession(null),
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            `/admin/classes/${klass.id}/sessions`,
            { page, search: search || undefined },
            { preserveState: true }
        );
    };

    const columns: ColumnDef<ClassSession>[] = [
        {
            accessorKey: 'book',
            header: 'Book / Lecture',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-primary" />
                    <div className="flex flex-col">
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{row.original.book?.urdu_name}</span>
                        <span className="text-xs text-muted-foreground">{row.original.book?.name}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'teacher',
            header: 'Teacher / Instructor',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <User size={16} className="text-info" />
                    <div className="flex flex-col">
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{row.original.teacher?.urdu_name}</span>
                        <span className="text-xs text-muted-foreground">{row.original.teacher?.name}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'year',
            header: 'Academic Year',
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 text-sm">
                    <Calendar size={14} className="text-muted-foreground" />
                    <span>{row.original.year?.name}</span>
                </div>
            ),
            size: 140,
        },
        {
            accessorKey: 'lecture_link',
            header: 'Resource Link',
            cell: ({ row }) => (
                row.original.lecture_link ? (
                    <a
                        href={row.original.lecture_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 text-sm font-medium"
                    >
                        <LinkIcon size={14} /> View Link
                    </a>
                ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                )
            ),
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
                    {hasPermission('edit classes') && (
                        <Link href={`/admin/classes/${klass.id}/sessions/${row.original.id}/edit`}>
                            <Button variant="secondary" size="sm" className="flex items-center gap-1">
                                <Edit size={14} /> Edit
                            </Button>
                        </Link>
                    )}
                    {hasPermission('delete classes') && (
                        <Button variant="destructive" size="sm" onClick={() => setDeleteSession(row.original)} className="flex items-center gap-1">
                            <Trash size={14} /> Delete
                        </Button>
                    )}
                </div>
            ),
            size: 160,
        },
    ];

    const meta: PageMeta = {
        current_page: sessions.current_page,
        last_page: sessions.last_page,
        per_page: sessions.per_page,
        total: sessions.total,
        from: sessions.from,
        to: sessions.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-end w-full">
            <div className="flex-1 min-w-[200px]">
                <Input
                    placeholder="Search by book or teacher..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full"
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
                    router.get(`/admin/classes/${klass.id}/sessions`);
                }}
            >
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout
            title={`Sessions: ${klass.name}`}
            breadcrumbs={[
                { label: 'Classes', href: '/admin/classes' },
                { label: 'Sessions' }
            ]}
            action={
                <div className="flex gap-2">
                    <Link href="/admin/classes">
                        <Button variant="secondary" className="flex items-center gap-1.5">
                            <ArrowLeft size={16} /> Back to Classes
                        </Button>
                    </Link>
                    {hasPermission('create classes') && (
                        <Link href={`/admin/classes/${klass.id}/sessions/create`}>
                            <Button variant="primary" className="flex items-center gap-1.5">
                                <Plus size={16} /> Schedule Session
                            </Button>
                        </Link>
                    )}
                </div>
            }
        >
            <Head title={`Sessions - ${klass.name}`} />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={sessions.data}
                        meta={meta}
                        onPageChange={handlePageChange}
                        toolbar={toolbar}
                    />
                </CardBody>
            </Card>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteSession}
                onClose={() => setDeleteSession(null)}
                onConfirm={handleDelete}
                title="Delete Session"
                message={`Are you sure you want to delete this scheduled session? This action cannot be undone.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
