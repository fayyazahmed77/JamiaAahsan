import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Select } from '@/Components/ui/Select';
import { SearchableSelect } from '@/Components/ui/SearchableSelect';
import { Badge } from '@/Components/ui/Badge';
import { DataTable } from '@/Components/ui/DataTable';
import { Modal } from '@/Components/ui/Modal';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';
import type { Category, PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';

interface Props {
    categories: {
        data: Category[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    filters: {
        search?: string;
        type?: string;
        status?: string;
    };
}

export default function CategoryIndex({ categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [typeFilter, setTypeFilter] = useState(filters.type ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
    const { hasPermission } = usePermission();

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        type: 'audio',
        slug: '',
        status: true,
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (field: 'type' | 'status') => (e: { target: { value: string } }) => {
        const val = e.target.value;
        let nextSearch = search;
        let nextType = typeFilter;
        let nextStatus = statusFilter;

        if (field === 'type') {
            nextType = val;
            setTypeFilter(val);
        } else {
            nextStatus = val;
            setStatusFilter(val);
        }

        applyFilters(nextSearch, nextType, nextStatus);
    };

    const applyFilters = (searchText: string, typeText: string, statusText: string) => {
        router.get(
            '/admin/categories',
            {
                search: searchText || undefined,
                type: typeText || undefined,
                status: statusText || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(search, typeFilter, statusFilter);
    };

    const openAddModal = () => {
        reset();
        clearErrors();
        setEditingCategory(null);
        setModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        clearErrors();
        setEditingCategory(category);
        setData({
            name: category.name,
            type: category.type,
            slug: category.slug ?? '',
            status: category.status,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            put(`/admin/categories/${editingCategory.id}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/categories', {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteCategory) return;
        router.delete(`/admin/categories/${deleteCategory.id}`, {
            onSuccess: () => setDeleteCategory(null),
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/categories',
            {
                page,
                search: search || undefined,
                type: typeFilter || undefined,
                status: statusFilter || undefined,
            },
            { preserveState: true }
        );
    };

    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 60,
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                    {row.original.name}
                </div>
            ),
        },
        {
            accessorKey: 'slug',
            header: 'Slug',
            cell: ({ row }) => row.original.slug || <span style={{ color: 'var(--text-subtle)' }}>-</span>,
        },
        {
            accessorKey: 'type',
            header: 'Type',
            cell: ({ row }) => (
                <Badge variant={row.original.type === 'audio' ? 'info' : 'warning'}>
                    {row.original.type === 'audio' ? 'Audio' : 'Video'}
                </Badge>
            ),
            size: 100,
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
                    {hasPermission('edit categories') && (
                        <Button variant="secondary" size="sm" onClick={() => openEditModal(row.original)}>
                            Edit
                        </Button>
                    )}
                    {hasPermission('delete categories') && (
                        <Button variant="destructive" size="sm" onClick={() => setDeleteCategory(row.original)}>
                            Delete
                        </Button>
                    )}
                </div>
            ),
            size: 140,
        },
    ];

    const meta: PageMeta = {
        current_page: categories.current_page,
        last_page: categories.last_page,
        per_page: categories.per_page,
        total: categories.total,
        from: categories.from,
        to: categories.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', width: '100%' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
                <Input
                    placeholder="Search categories..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full"
                />
            </div>
            <div style={{ width: 140 }}>
                <SearchableSelect
                    value={typeFilter}
                    onChange={handleFilterChange('type')}
                    options={[
                        { value: 'audio', label: 'Audio' },
                        { value: 'video', label: 'Video' },
                    ]}
                    placeholder="All Types"
                />
            </div>
            <div style={{ width: 140 }}>
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
                setTypeFilter('');
                setStatusFilter('');
                router.get('/admin/categories');
            }}>
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout
            title="Categories"
            action={
                hasPermission('create categories') ? (
                    <Button variant="primary" onClick={openAddModal}>
                        Add Category
                    </Button>
                ) : undefined
            }
        >
            <Head title="Categories" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={categories.data}
                        meta={meta}
                        onPageChange={handlePageChange}
                        toolbar={toolbar}
                    />
                </CardBody>
            </Card>

            {/* Add / Edit Modal */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingCategory ? 'Edit Category' : 'Add Category'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={processing}>
                            {editingCategory ? 'Update' : 'Create'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Input
                        label="Category Name"
                        required
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                    />
                    <Select
                        label="Type"
                        required
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value as 'audio' | 'video')}
                        options={[
                            { value: 'audio', label: 'Audio' },
                            { value: 'video', label: 'Video' },
                        ]}
                        error={errors.type}
                    />
                    <Input
                        label="Slug (Optional)"
                        value={data.slug}
                        onChange={(e) => setData('slug', e.target.value)}
                        error={errors.slug}
                        placeholder="auto-generated-if-blank"
                    />
                    <Select
                        label="Status"
                        required
                        value={data.status ? '1' : '0'}
                        onChange={(e) => setData('status', e.target.value === '1')}
                        options={[
                            { value: '1', label: 'Active' },
                            { value: '0', label: 'Inactive' },
                        ]}
                    />
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteCategory}
                onClose={() => setDeleteCategory(null)}
                onConfirm={handleDelete}
                title="Delete Category"
                message={`Are you sure you want to delete category "${deleteCategory?.name}"? This action cannot be undone.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
