import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Badge } from '@/Components/ui/Badge';
import { DataTable } from '@/Components/ui/DataTable';
import { Modal } from '@/Components/ui/Modal';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';
import { SearchableSelect } from '@/Components/ui/SearchableSelect';
import type { Department, PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';

interface Props {
    departments: {
        data: Department[];
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

export default function DepartmentIndex({ departments, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [deleteDepartment, setDeleteDepartment] = useState<Department | null>(null);
    const { hasPermission } = usePermission();

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        name_urdu: '',
        slug: '',
        description: '',
        description_urdu: '',
        icon_name: '',
        sort_order: 0,
        status: true,
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (e: { target: { value: string } }) => {
        const val = e.target.value;
        setStatusFilter(val);
        applyFilters(search, val);
    };

    const applyFilters = (searchText: string, statusText: string) => {
        router.get(
            '/admin/departments',
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

    const openAddModal = () => {
        reset();
        clearErrors();
        setEditingDepartment(null);
        setModalOpen(true);
    };

    const openEditModal = (department: Department) => {
        clearErrors();
        setEditingDepartment(department);
        setData({
            name: department.name,
            name_urdu: department.name_urdu ?? '',
            slug: department.slug ?? '',
            description: department.description ?? '',
            description_urdu: department.description_urdu ?? '',
            icon_name: department.icon_name ?? '',
            sort_order: department.sort_order ?? 0,
            status: department.status,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingDepartment) {
            put(`/admin/departments/${editingDepartment.id}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/departments', {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteDepartment) return;
        router.delete(`/admin/departments/${deleteDepartment.id}`, {
            onSuccess: () => setDeleteDepartment(null),
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/departments',
            {
                page,
                search: search || undefined,
                status: statusFilter || undefined,
            },
            { preserveState: true }
        );
    };

    const columns: ColumnDef<Department>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 60,
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <div>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                        {row.original.name}
                    </div>
                    {row.original.name_urdu && (
                        <div style={{ fontSize: '0.85em', color: 'var(--text-subtle)', fontFamily: 'Noto Nastaliq Urdu, system-ui' }}>
                            {row.original.name_urdu}
                        </div>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'slug',
            header: 'Slug',
        },
        {
            accessorKey: 'icon_name',
            header: 'Icon',
            cell: ({ row }) => row.original.icon_name || <span style={{ color: 'var(--text-subtle)' }}>-</span>,
            size: 100,
        },
        {
            accessorKey: 'sort_order',
            header: 'Sort Order',
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
                    {hasPermission('edit settings') && (
                        <Button variant="secondary" size="sm" onClick={() => openEditModal(row.original)}>
                            Edit
                        </Button>
                    )}
                    {hasPermission('delete settings') && (
                        <Button variant="destructive" size="sm" onClick={() => setDeleteDepartment(row.original)}>
                            Delete
                        </Button>
                    )}
                </div>
            ),
            size: 140,
        },
    ];

    const meta: PageMeta = {
        current_page: departments.current_page,
        last_page: departments.last_page,
        per_page: departments.per_page,
        total: departments.total,
        from: departments.from,
        to: departments.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', width: '100%' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
                <Input
                    placeholder="Search departments..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full"
                />
            </div>
            <div style={{ width: 160 }}>
                <SearchableSelect
                    value={statusFilter}
                    onChange={handleFilterChange}
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
                setStatusFilter('');
                router.get('/admin/departments');
            }}>
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout
            title="Departments"
            action={
                hasPermission('create settings') ? (
                    <Button variant="primary" onClick={openAddModal}>
                        Add Department
                    </Button>
                ) : undefined
            }
        >
            <Head title="Departments" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={departments.data}
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
                title={editingDepartment ? 'Edit Department' : 'Add Department'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={processing}>
                            {editingDepartment ? 'Update' : 'Create'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Input
                        label="Department Name (English)"
                        required
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                    />
                    <Input
                        label="Department Name (Urdu)"
                        value={data.name_urdu}
                        onChange={(e) => setData('name_urdu', e.target.value)}
                        error={errors.name_urdu}
                        placeholder="e.g. شعبہ افتاء"
                    />
                    <Input
                        label="Slug (Optional)"
                        value={data.slug}
                        onChange={(e) => setData('slug', e.target.value)}
                        error={errors.slug}
                        placeholder="auto-generated-if-blank"
                    />
                    <Input
                        label="Description (English)"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        error={errors.description}
                    />
                    <Input
                        label="Description (Urdu)"
                        value={data.description_urdu}
                        onChange={(e) => setData('description_urdu', e.target.value)}
                        error={errors.description_urdu}
                    />
                    <Input
                        label="Icon Name"
                        value={data.icon_name}
                        onChange={(e) => setData('icon_name', e.target.value)}
                        error={errors.icon_name}
                        placeholder="e.g. Heart, Book, Volume2"
                    />
                    <Input
                        label="Sort Order"
                        type="number"
                        value={data.sort_order}
                        onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                        error={errors.sort_order}
                    />
                    <SearchableSelect
                        label="Status"
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
                open={!!deleteDepartment}
                onClose={() => setDeleteDepartment(null)}
                onConfirm={handleDelete}
                title="Delete Department"
                message={`Are you sure you want to delete department "${deleteDepartment?.name}"? This action cannot be undone.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
