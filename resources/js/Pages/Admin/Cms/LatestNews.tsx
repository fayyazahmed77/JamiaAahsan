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
import type { LatestNews, PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';
import { Link as LinkIcon, Edit, Trash, Plus } from 'lucide-react';

interface Props {
    news: {
        data: LatestNews[];
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

export default function LatestNewsIndex({ news, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [deleteNews, setDeleteNews] = useState<LatestNews | null>(null);
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
            '/admin/cms/latest-news',
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
        if (!deleteNews) return;
        router.delete(`/admin/cms/latest-news/${deleteNews.id}`, {
            onSuccess: () => setDeleteNews(null),
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/cms/latest-news',
            {
                page,
                search: search || undefined,
                status: statusFilter || undefined,
            },
            { preserveState: true }
        );
    };

    const columns: ColumnDef<LatestNews>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 60,
        },
        {
            accessorKey: 'text',
            header: 'Announcement / News Text',
            cell: ({ row }) => (
                <div className="font-urdu font-medium text-lg leading-relaxed text-right py-2 px-4 bg-stone-50/5 rounded-md border border-border/40" dir="rtl">
                    {row.original.text}
                </div>
            ),
        },
        {
            accessorKey: 'link',
            header: 'Redirect URL',
            cell: ({ row }) => (
                row.original.link ? (
                    <a
                        href={row.original.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 text-sm font-medium"
                    >
                        <LinkIcon size={14} /> View Link
                    </a>
                ) : (
                    <span className="text-muted-foreground">-</span>
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
                    {hasPermission('edit latest-news') && (
                        <Link href={`/admin/cms/latest-news/${row.original.id}/edit`}>
                            <Button variant="secondary" size="sm" className="flex items-center gap-1">
                                <Edit size={14} /> Edit
                            </Button>
                        </Link>
                    )}
                    {hasPermission('delete latest-news') && (
                        <Button variant="destructive" size="sm" onClick={() => setDeleteNews(row.original)} className="flex items-center gap-1">
                            <Trash size={14} /> Delete
                        </Button>
                    )}
                </div>
            ),
            size: 160,
        },
    ];

    const meta: PageMeta = {
        current_page: news.current_page,
        last_page: news.last_page,
        per_page: news.per_page,
        total: news.total,
        from: news.from,
        to: news.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-end w-full">
            <div className="flex-1 min-w-[200px]">
                <Input
                    placeholder="Search news text..."
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
                    router.get('/admin/cms/latest-news');
                }}
            >
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout
            title="Running News Ticker Announcements"
            action={
                hasPermission('create latest-news') ? (
                    <Link href="/admin/cms/latest-news/create">
                        <Button variant="primary" className="flex items-center gap-1.5">
                            <Plus size={16} /> Add News Entry
                        </Button>
                    </Link>
                ) : undefined
            }
        >
            <Head title="Latest News" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={news.data}
                        meta={meta}
                        onPageChange={handlePageChange}
                        toolbar={toolbar}
                    />
                </CardBody>
            </Card>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteNews}
                onClose={() => setDeleteNews(null)}
                onConfirm={handleDelete}
                title="Delete News Item"
                message={`Are you sure you want to delete this news item? It will immediately stop showing on the website ticker.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
