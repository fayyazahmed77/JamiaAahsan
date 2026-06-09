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
import { Switch } from '@/Components/ui/switch';
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuItem 
} from '@/Components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Trash2, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Video, Speaker, Category, Year, PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';


interface Props {
    videos: {
        data: Video[];
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

export default function VideoIndex({ videos, speakers, categories, years, filters }: Props) {
    const { hasPermission } = usePermission();
    const [search, setSearch] = useState(filters.search ?? '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category_id ?? '');
    const [speakerFilter, setSpeakerFilter] = useState(filters.speaker_id ?? '');
    const [yearFilter, setYearFilter] = useState(filters.year_id ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [selectedRows, setSelectedRows] = useState<Video[]>([]);
    const [deleteVideo, setDeleteVideo] = useState<Video | null>(null);
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

        router.get('/admin/videos', query, { preserveState: true, replace: true });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/admin/videos',
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
        if (!deleteVideo) return;
        router.delete(`/admin/videos/${deleteVideo.id}`, {
            onSuccess: () => setDeleteVideo(null),
        });
    };

    const handleBulkDelete = () => {
        const ids = selectedRows.map((r) => r.id);
        router.post(
            '/admin/videos/bulk-destroy',
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
            '/admin/videos',
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

    const handleToggleStatus = (video: Video) => {
        router.put(`/admin/videos/${video.id}`, {
            title: video.title,
            slug: video.slug,
            status: !video.status,
            speaker_id: video.media?.speaker?.id,
            category_id: video.media?.category?.id,
            year_id: video.media?.year?.id,
            tags: video.tags ? video.tags.map((t: any) => typeof t === 'string' ? t : t.name) : [],
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Video status updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update video status.');
            }
        });
    };

    const getThumbnailUrl = (path: string | null) => {
        if (!path) return '/storage/default_thumbnail.png';
        if (path.startsWith('http')) return path;
        return `/storage/thumbnails/${path}`;
    };

    const columns: ColumnDef<Video>[] = [
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
                    {row.original.urdu_title && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {row.original.urdu_title}
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
            accessorKey: 'created_at',
            header: 'Create Date',
            cell: ({ row }) => {
                const date = row.original.created_at ? new Date(row.original.created_at) : null;
                return (
                    <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>
                        {date ? date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                    </span>
                );
            },
            size: 130,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
                <Switch
                    checked={row.original.status}
                    onCheckedChange={() => handleToggleStatus(row.original)}
                    disabled={!hasPermission('edit videos')}
                />
            ),
            size: 100,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm" className="h-8 w-8 p-0 flex items-center justify-center rounded-lg border border-stone-200 dark:border-stone-850">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850">
                        <Link href={`/admin/videos/${row.original.id}`} className="w-full">
                            <DropdownMenuItem className="hover:bg-stone-55 dark:hover:bg-stone-850 cursor-pointer flex items-center gap-2 text-stone-700 dark:text-stone-300">
                                <Eye className="h-4 w-4 text-stone-400" />
                                <span>View</span>
                            </DropdownMenuItem>
                        </Link>
                        {hasPermission('edit videos') && (
                            <Link href={`/admin/videos/${row.original.id}/edit`} className="w-full">
                                <DropdownMenuItem className="hover:bg-stone-55 dark:hover:bg-stone-850 cursor-pointer flex items-center gap-2 text-stone-700 dark:text-stone-300">
                                    <Edit className="h-4 w-4 text-stone-400" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                            </Link>
                        )}
                        {hasPermission('delete videos') && (
                            <DropdownMenuItem onClick={() => setDeleteVideo(row.original)} className="hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer flex items-center gap-2 text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20">
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            size: 80,
        },
    ];

    const meta: PageMeta = {
        current_page: videos.current_page,
        last_page: videos.last_page,
        per_page: videos.per_page,
        total: videos.total,
        from: videos.from,
        to: videos.to,
    };

    const toolbar = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                    <Input
                        placeholder="Search video titles..."
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
                    router.get('/admin/videos');
                }}>
                    Reset
                </Button>
            </form>

            {selectedRows.length > 0 && hasPermission('delete videos') && (
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
            title="Video Library"
            action={
                hasPermission('create videos') ? (
                    <Link href="/admin/videos/create">
                        <Button variant="primary">
                            Upload Video
                        </Button>
                    </Link>
                ) : null
            }
        >
            <Head title="Video Library" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={videos.data}
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
                open={!!deleteVideo}
                onClose={() => setDeleteVideo(null)}
                onConfirm={handleDelete}
                title="Delete Video"
                message={`Are you sure you want to delete video "${deleteVideo?.title}"? This action cannot be undone.`}
                variant="danger"
            />

            {/* Delete Bulk Confirmation */}
            <ConfirmDialog
                open={bulkDeleteConfirm}
                onClose={() => setBulkDeleteConfirm(false)}
                onConfirm={handleBulkDelete}
                title="Bulk Delete Videos"
                message={`Are you sure you want to delete the ${selectedRows.length} selected video records? This action cannot be undone.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
