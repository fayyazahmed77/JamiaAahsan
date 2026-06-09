import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { SearchableSelect } from '@/Components/ui/SearchableSelect';
import { Badge } from '@/Components/ui/Badge';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';
import type { Image as ImageModel } from '@/types/models';
import { ArrowUp, ArrowDown, Edit, Trash, Plus } from 'lucide-react';

interface Props {
    images: {
        data: ImageModel[];
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

export default function ImageIndex({ images, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [deleteImage, setDeleteImage] = useState<ImageModel | null>(null);
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
            '/admin/images',
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
        if (!deleteImage) return;
        router.delete(`/admin/images/${deleteImage.id}`, {
            onSuccess: () => setDeleteImage(null),
        });
    };

    const moveImage = (index: number, direction: 'up' | 'down') => {
        const list = [...images.data];
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === list.length - 1) return;

        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const temp = list[index];
        list[index] = list[targetIndex];
        list[targetIndex] = temp;

        const ids = list.map(item => item.id);
        router.post('/admin/images/reorder', { ids }, {
            preserveScroll: true
        });
    };

    return (
        <AdminLayout
            title="Banners & Galleries"
            action={
                hasPermission('create home.main.banner') ? (
                    <Link href="/admin/images/create">
                        <Button variant="primary" className="flex items-center gap-1.5">
                            <Plus size={16} /> Upload Image
                        </Button>
                    </Link>
                ) : undefined
            }
        >
            <Head title="Banners & Galleries" />

            {/* Filter Toolbar */}
            <Card className="mb-6">
                <CardBody>
                    <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-[240px]">
                            <Input
                                placeholder="Search by title..."
                                value={search}
                                onChange={handleSearchChange}
                                className="w-full"
                            />
                        </div>
                        <div className="w-[180px]">
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
                                router.get('/admin/images');
                            }}
                        >
                            Reset
                        </Button>
                    </form>
                </CardBody>
            </Card>

            {/* Images Grid */}
            {images.data.length === 0 ? (
                <Card>
                    <CardBody className="text-center py-12 text-muted-foreground">
                        No banners or gallery images found. Upload your first image above.
                    </CardBody>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.data.map((img, index) => (
                        <Card key={img.id} className="overflow-hidden flex flex-col">
                            {/* Thumbnail */}
                            <div className="relative aspect-video bg-stone-900 overflow-hidden">
                                <img
                                    src={img.uri.startsWith('http') ? img.uri : `/storage/media/${img.uri}`}
                                    alt={img.title ?? 'Banner'}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    <Badge variant={img.status ? 'success' : 'muted'}>
                                        {img.status ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-xs text-white font-medium">
                                    Weight: {img.weight ?? 0}
                                </div>
                            </div>

                            {/* Content */}
                            <CardBody className="flex-1 flex flex-col justify-between p-4">
                                <div className="mb-4">
                                    <h3 className="font-semibold text-lg line-clamp-1 mb-1" style={{ color: 'var(--text-primary)' }}>
                                        {img.title || 'Untitled Banner'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {img.description || 'No description provided.'}
                                    </p>
                                    {img.btn_title && (
                                        <div className="mt-3">
                                            <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-full">
                                                Btn: {img.btn_title}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between border-t pt-3 border-border">
                                    {/* Reordering */}
                                    {hasPermission('edit home.main.banner') ? (
                                        <div className="flex items-center gap-1.5">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                disabled={index === 0}
                                                onClick={() => moveImage(index, 'up')}
                                                className="px-1.5"
                                            >
                                                <ArrowUp size={14} />
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                disabled={index === images.data.length - 1}
                                                onClick={() => moveImage(index, 'down')}
                                                className="px-1.5"
                                            >
                                                <ArrowDown size={14} />
                                            </Button>
                                        </div>
                                    ) : <div />}

                                    {/* Edit / Delete */}
                                    <div className="flex gap-2">
                                        {hasPermission('edit home.main.banner') && (
                                            <Link href={`/admin/images/${img.id}/edit`}>
                                                <Button variant="secondary" size="sm" className="flex items-center gap-1">
                                                    <Edit size={14} /> Edit
                                                </Button>
                                            </Link>
                                        )}
                                        {hasPermission('delete home.main.banner') && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => setDeleteImage(img)}
                                                className="flex items-center gap-1"
                                            >
                                                <Trash size={14} /> Delete
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteImage}
                onClose={() => setDeleteImage(null)}
                onConfirm={handleDelete}
                title="Delete Image"
                message={`Are you sure you want to delete image "${deleteImage?.title || 'Untitled'}"? This will permanently delete the file from storage.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
