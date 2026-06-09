import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { DataTable } from '@/Components/ui/DataTable';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';
import type { UserSubscription, PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';
import { Trash, Mail, Download } from 'lucide-react';

interface Props {
    subscriptions: {
        data: UserSubscription[];
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

export default function SubscriptionsIndex({ subscriptions, filters }: Props) {
    const { hasPermission } = usePermission();
    const [search, setSearch] = useState(filters.search ?? '');
    const [deleteSub, setDeleteSub] = useState<UserSubscription | null>(null);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const applyFilters = (searchText: string) => {
        router.get(
            '/admin/subscriptions',
            { search: searchText || undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(search);
    };

    const handleDelete = () => {
        if (!deleteSub) return;
        router.delete(`/admin/subscriptions/${deleteSub.id}`, {
            onSuccess: () => setDeleteSub(null),
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/subscriptions',
            { page, search: search || undefined },
            { preserveState: true }
        );
    };

    const columns: ColumnDef<UserSubscription>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 60,
        },
        {
            accessorKey: 'user.name',
            header: 'Subscriber Name',
            cell: ({ row }) => row.original.user?.name ?? '-',
        },
        {
            accessorKey: 'user.email',
            header: 'Email Address',
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 font-medium">
                    <Mail size={14} className="text-muted-foreground" />
                    <span>{row.original.user?.email ?? '-'}</span>
                </div>
            ),
        },
        {
            accessorKey: 'phone',
            header: 'Phone Number',
            cell: ({ row }) => row.original.phone || <span className="text-muted-foreground">-</span>,
        },
        {
            accessorKey: 'country',
            header: 'Country',
            cell: ({ row }) => row.original.country,
        },
        {
            accessorKey: 'created_at',
            header: 'Subscribed Date',
            cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
            size: 150,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                hasPermission('delete subscriptions') ? (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteSub(row.original)}
                        className="flex items-center gap-1"
                    >
                        <Trash size={14} /> Remove
                    </Button>
                ) : null
            ),
            size: 120,
        },
    ];

    const meta: PageMeta = {
        current_page: subscriptions.current_page,
        last_page: subscriptions.last_page,
        per_page: subscriptions.per_page,
        total: subscriptions.total,
        from: subscriptions.from,
        to: subscriptions.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-end w-full">
            <div className="flex-1 min-w-[200px]">
                <Input
                    placeholder="Search by name, email, phone, country..."
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
                    router.get('/admin/subscriptions');
                }}
            >
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout title="Newsletter Subscriptions">
            <Head title="Subscriptions" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={subscriptions.data}
                        meta={meta}
                        onPageChange={handlePageChange}
                        toolbar={toolbar}
                    />
                </CardBody>
            </Card>

            {/* Cancel Confirmation */}
            <ConfirmDialog
                open={!!deleteSub}
                onClose={() => setDeleteSub(null)}
                onConfirm={handleDelete}
                title="Cancel Subscription"
                message={`Are you sure you want to remove the subscription for "${deleteSub?.user?.email}"? They will no longer receive automated email announcements.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
