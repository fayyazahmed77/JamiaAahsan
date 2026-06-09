import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { usePermission } from '@/hooks/usePermission';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { SearchableSelect } from '@/Components/ui/SearchableSelect';
import { Badge } from '@/Components/ui/Badge';
import { DataTable } from '@/Components/ui/DataTable';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';
import type { Audio, Speaker, Category, Year, PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';

interface Props {
    audio: {
        data: Audio[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    speakers: Speaker[];
    categories: Category[];
    years: Year[];
    filters: {
        search?: string;
        category_id?: string;
        speaker_id?: string;
        year_id?: string;
        status?: string;
    };
}

export default function AudioIndex({ audio, speakers, categories, years, filters }: Props) {
    const { hasPermission } = usePermission();
    const [search, setSearch] = useState(filters.search ?? '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category_id ?? '');
    const [speakerFilter, setSpeakerFilter] = useState(filters.speaker_id ?? '');
    const [yearFilter, setYearFilter] = useState(filters.year_id ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [selectedRows, setSelectedRows] = useState<Audio[]>([]);
    const [deleteAudio, setDeleteAudio] = useState<Audio | null>(null);
    const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (field: string) => (e: { target: { value: string } }) => {
        const val = e.target.value;
        const query: Record<string, string | undefined> = {
            search: search || undefined,
            category_id: categoryFilter || undefined,
            speaker_id: speakerFilter || undefined,
            year_id: yearFilter || undefined,
            status: statusFilter || undefined,
        };

        if (field === 'category_id') {
            setCategoryFilter(val);
            query.category_id = val || undefined;
        } else if (field === 'speaker_id') {
            setSpeakerFilter(val);
            query.speaker_id = val || undefined;
        } else if (field === 'year_id') {
            setYearFilter(val);
            query.year_id = val || undefined;
        } else if (field === 'status') {
            setStatusFilter(val);
            query.status = val || undefined;
        }

        router.get('/admin/audio', query, { preserveState: true, replace: true });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/audio',
            {
                search: search || undefined,
                category_id: categoryFilter || undefined,
                speaker_id: speakerFilter || undefined,
                year_id: yearFilter || undefined,
                status: statusFilter || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = () => {
        if (!deleteAudio) return;
        router.delete(`/admin/audio/${deleteAudio.id}`, {
            onSuccess: () => setDeleteAudio(null),
        });
    };

    const handleBulkDelete = () => {
        const ids = selectedRows.map((r) => r.id);
        router.post(
            '/admin/audio/bulk-destroy',
            { ids },
            {
                onSuccess: () => {
                    setBulkDeleteConfirm(false);
                    setSelectedRows([]);
                },
            }
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/audio',
            {
                page,
                search: search || undefined,
                category_id: categoryFilter || undefined,
                speaker_id: speakerFilter || undefined,
                year_id: yearFilter || undefined,
                status: statusFilter || undefined,
            },
            { preserveState: true }
        );
    };

    const getThumbnailUrl = (path: string | null) => {
        if (!path) return '/storage/default_thumbnail.png';
        if (path.startsWith('http')) return path;
        return `/storage/thumbnails/${path}`;
    };

    const columns: ColumnDef<Audio>[] = [
        {
            accessorKey: 'thumbnail',
            header: 'Thumbnail',
            cell: ({ row }) => (
                <img
                    src={getThumbnailUrl(row.original.thumbnail_uri)}
                    alt=""
                    style={{ width: 64, height: 36, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                />
            ),
            size: 80,
            enableSorting: false,
        },
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => (
                <div style={{ maxWidth: 300 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {row.original.title}
                    </div>
                    {row.original.user_title && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {row.original.user_title}
                        </div>
                    )}
                </div>
            ),
        },
        {
            id: 'speaker',
            header: 'Speaker',
            cell: ({ row }) => row.original.media?.speaker?.name || <span style={{ color: 'var(--text-subtle)' }}>None</span>,
        },
        {
            id: 'category',
            header: 'Category',
            cell: ({ row }) => row.original.media?.category?.name || <span style={{ color: 'var(--text-subtle)' }}>None</span>,
        },
        {
            id: 'year',
            header: 'Year',
            cell: ({ row }) => row.original.media?.year?.name || <span style={{ color: 'var(--text-subtle)' }}>None</span>,
            size: 80,
        },
        {
            accessorKey: 'views',
            header: 'Views',
            cell: ({ row }) => row.original.views.toLocaleString(),
            size: 80,
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
                <div style={{ display: 'flex', gap: 8 }}>
                    <Link href={`/admin/audio/${row.original.id}`}>
                        <Button variant="secondary" size="sm">
                            View
                        </Button>
                    </Link>
                    {hasPermission('edit audio') && (
                        <Link href={`/admin/audio/${row.original.id}/edit`}>
                            <Button variant="secondary" size="sm">
                                Edit
                            </Button>
                        </Link>
                    )}
                    {hasPermission('delete audio') && (
                        <Button variant="destructive" size="sm" onClick={() => setDeleteAudio(row.original)}>
                            Delete
                        </Button>
                    )}
                </div>
            ),
            size: 190,
        },
    ];

    const meta: PageMeta = {
        current_page: audio.current_page,
        last_page: audio.last_page,
        per_page: audio.per_page,
        total: audio.total,
        from: audio.from,
        to: audio.to,
    };

    const toolbar = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                    <Input
                        placeholder="Search audio titles..."
                        value={search}
                        onChange={handleSearchChange}
                        className="w-full"
                    />
                </div>
                <div style={{ width: 170 }}>
                    <SearchableSelect
                        value={speakerFilter}
                        onChange={handleFilterChange('speaker_id')}
                        options={speakers.map(s => ({ value: s.id, label: s.name }))}
                        placeholder="All Speakers"
                    />
                </div>
                <div style={{ width: 170 }}>
                    <SearchableSelect
                        value={categoryFilter}
                        onChange={handleFilterChange('category_id')}
                        options={categories.map(c => ({ value: c.id, label: c.name }))}
                        placeholder="All Categories"
                    />
                </div>
                <div style={{ width: 130 }}>
                    <SearchableSelect
                        value={yearFilter}
                        onChange={handleFilterChange('year_id')}
                        options={years.map(y => ({ value: y.id, label: y.name.toString() }))}
                        placeholder="All Years"
                    />
                </div>
                <div style={{ width: 130 }}>
                    <SearchableSelect
                        value={statusFilter}
                        onChange={handleFilterChange('status')}
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
                <Button type="button" variant="secondary" onClick={() => {
                    setSearch('');
                    setSpeakerFilter('');
                    setCategoryFilter('');
                    setYearFilter('');
                    setStatusFilter('');
                    router.get('/admin/audio');
                }}>
                    Reset
                </Button>
            </form>
            
            {selectedRows.length > 0 && (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 12px', background: 'hsl(0 70% 50% / 0.1)', borderRadius: 'var(--radius)', border: '1px solid var(--danger)' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--danger)' }}>
                        {selectedRows.length} items selected
                    </span>
                    <Button variant="destructive" size="sm" onClick={() => setBulkDeleteConfirm(true)}>
                        Bulk Delete Selected
                    </Button>
                </div>
            )}
        </div>
    );

    return (
        <AdminLayout
            title="Audio Library"
            action={
                <div style={{ display: 'flex', gap: 10 }}>
                    {hasPermission('create audio') && (
                        <Link href="/admin/audio-import">
                            <Button variant="secondary">
                                Import Excel/CSV
                            </Button>
                        </Link>
                    )}
                    {hasPermission('create audio') && (
                        <Link href="/admin/audio/create">
                            <Button variant="primary">
                                Upload Audio
                            </Button>
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Audio Library" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={audio.data}
                        meta={meta}
                        onPageChange={handlePageChange}
                        selectable
                        onSelectionChange={setSelectedRows}
                        toolbar={toolbar}
                    />
                </CardBody>
            </Card>

            {/* Delete Single Confirmation */}
            <ConfirmDialog
                open={!!deleteAudio}
                onClose={() => setDeleteAudio(null)}
                onConfirm={handleDelete}
                title="Delete Audio"
                message={`Are you sure you want to delete audio "${deleteAudio?.title}"? This action cannot be undone.`}
                variant="danger"
            />

            {/* Delete Bulk Confirmation */}
            <ConfirmDialog
                open={bulkDeleteConfirm}
                onClose={() => setBulkDeleteConfirm(false)}
                onConfirm={handleBulkDelete}
                title="Bulk Delete Audio"
                message={`Are you sure you want to delete the ${selectedRows.length} selected audio records? This action cannot be undone.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
