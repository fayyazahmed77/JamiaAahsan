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
import type { DownloadLink, Category, Year, PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';
import { Download, ExternalLink, Edit, Trash, Plus } from 'lucide-react';

interface Props {
    downloads: {
        data: DownloadLink[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    categories: Category[];
    years: Year[];
    filters: {
        search?: string;
        category_id?: string;
        year_id?: string;
    };
}

export default function DownloadsIndex({ downloads, categories, years, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category_id ?? '');
    const [yearFilter, setYearFilter] = useState(filters.year_id ?? '');
    const [deleteDownload, setDeleteDownload] = useState<DownloadLink | null>(null);
    const { hasPermission } = usePermission();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (field: 'category' | 'year') => (e: { target: { value: string } }) => {
        const val = e.target.value;
        let nextSearch = search;
        let nextCategory = categoryFilter;
        let nextYear = yearFilter;

        if (field === 'category') {
            nextCategory = val;
            setCategoryFilter(val);
        } else {
            nextYear = val;
            setYearFilter(val);
        }

        applyFilters(nextSearch, nextCategory, nextYear);
    };

    const applyFilters = (searchText: string, categoryText: string, yearText: string) => {
        router.get(
            '/admin/downloads',
            {
                search: searchText || undefined,
                category_id: categoryText || undefined,
                year_id: yearText || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(search, categoryFilter, yearFilter);
    };

    const handleDelete = () => {
        if (!deleteDownload) return;
        router.delete(`/admin/downloads/${deleteDownload.id}`, {
            onSuccess: () => setDeleteDownload(null),
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/downloads',
            {
                page,
                search: search || undefined,
                category_id: categoryFilter || undefined,
                year_id: yearFilter || undefined,
            },
            { preserveState: true }
        );
    };

    const columns: ColumnDef<DownloadLink>[] = [
        {
            accessorKey: 'sort_order',
            header: 'Order',
            size: 60,
            cell: ({ row }) => <span className="font-mono text-muted-foreground">{(row.original as any).sort_order ?? 0}</span>,
        },
        {
            accessorKey: 'title',
            header: 'Resource Title',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{(row.original as any).title || 'Untitled file'}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{(row.original as any).description || 'No description'}</span>
                </div>
            ),
        },
        {
            accessorKey: 'category.name',
            header: 'Category',
            cell: ({ row }) => row.original.category?.name ?? '-',
        },
        {
            accessorKey: 'year.name',
            header: 'Year',
            cell: ({ row }) => row.original.year?.name ?? '-',
            size: 100,
        },
        {
            accessorKey: 'url',
            header: 'Download Link',
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 text-sm">
                    <a
                        href={row.original.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                    >
                        <ExternalLink size={14} /> Link
                    </a>
                    {(row.original as any).file_size && (
                        <span className="text-xs text-muted-foreground">({(row.original as any).file_size})</span>
                    )}
                </div>
            ),
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
                    {hasPermission('edit downloads') && (
                        <Link href={`/admin/downloads/${row.original.id}/edit`}>
                            <Button variant="secondary" size="sm" className="flex items-center gap-1">
                                <Edit size={14} /> Edit
                            </Button>
                        </Link>
                    )}
                    {hasPermission('delete downloads') && (
                        <Button variant="destructive" size="sm" onClick={() => setDeleteDownload(row.original)} className="flex items-center gap-1">
                            <Trash size={14} /> Delete
                        </Button>
                    )}
                </div>
            ),
            size: 160,
        },
    ];

    const meta: PageMeta = {
        current_page: downloads.current_page,
        last_page: downloads.last_page,
        per_page: downloads.per_page,
        total: downloads.total,
        from: downloads.from,
        to: downloads.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-end w-full">
            <div className="flex-1 min-w-[200px]">
                <Input
                    placeholder="Search by title, description..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full"
                />
            </div>
            <div className="w-[140px]">
                <SearchableSelect
                    value={categoryFilter}
                    onChange={handleFilterChange('category')}
                    options={categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))}
                    placeholder="All Categories"
                />
            </div>
            <div className="w-[140px]">
                <SearchableSelect
                    value={yearFilter}
                    onChange={handleFilterChange('year')}
                    options={years.map(yr => ({ value: yr.id.toString(), label: yr.name.toString() }))}
                    placeholder="All Years"
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
                    setCategoryFilter('');
                    setYearFilter('');
                    router.get('/admin/downloads');
                }}
            >
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout
            title="Download Links Manager"
            action={
                hasPermission('create downloads') ? (
                    <Link href="/admin/downloads/create">
                        <Button variant="primary" className="flex items-center gap-1.5">
                            <Plus size={16} /> Add Download
                        </Button>
                    </Link>
                ) : undefined
            }
        >
            <Head title="Downloads" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={downloads.data}
                        meta={meta}
                        onPageChange={handlePageChange}
                        toolbar={toolbar}
                    />
                </CardBody>
            </Card>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteDownload}
                onClose={() => setDeleteDownload(null)}
                onConfirm={handleDelete}
                title="Delete Download Link"
                message={`Are you sure you want to delete download link "${(deleteDownload as any)?.title}"? This will immediately remove it from the public downloads listing.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
