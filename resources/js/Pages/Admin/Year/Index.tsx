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
import type { Year, PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';

interface Props {
    years: {
        data: Year[];
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

export default function YearIndex({ years, filters }: Props) {
    const { hasPermission } = usePermission();
    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingYear, setEditingYear] = useState<Year | null>(null);
    const [deleteYear, setDeleteYear] = useState<Year | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
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
            '/admin/years',
            { search: searchText || undefined, status: statusText || undefined },
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
        setEditingYear(null);
        setModalOpen(true);
    };

    const openEditModal = (year: Year) => {
        clearErrors();
        setEditingYear(year);
        setData({
            name: year.name.toString(),
            status: year.status,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingYear) {
            put(`/admin/years/${editingYear.id}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/years', {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteYear) return;
        router.delete(`/admin/years/${deleteYear.id}`, {
            onSuccess: () => setDeleteYear(null),
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/years',
            { page, search: search || undefined, status: statusFilter || undefined },
            { preserveState: true }
        );
    };

    const columns: ColumnDef<Year>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 60,
        },
        {
            accessorKey: 'name',
            header: 'Academic Year',
            cell: ({ row }) => (
                <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                    {row.original.name}
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
                <div style={{ display: 'flex', gap: 8 }}>
                    {hasPermission('edit years') && (
                        <Button variant="secondary" size="sm" onClick={() => openEditModal(row.original)}>
                            Edit
                        </Button>
                    )}
                    {hasPermission('delete years') && (
                        <Button variant="destructive" size="sm" onClick={() => setDeleteYear(row.original)}>
                            Delete
                        </Button>
                    )}
                </div>
            ),
            size: 140,
        },
    ];

    const meta: PageMeta = {
        current_page: years.current_page,
        last_page: years.last_page,
        per_page: years.per_page,
        total: years.total,
        from: years.from,
        to: years.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', width: '100%' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
                <Input
                    placeholder="Search years (e.g. 2024)..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full"
                />
            </div>
            <div style={{ width: 150 }}>
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
                router.get('/admin/years');
            }}>
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout
            title="Academic Years"
            action={
                hasPermission('create years') ? (
                    <Button variant="primary" onClick={openAddModal}>
                        Add Academic Year
                    </Button>
                ) : null
            }
        >
            <Head title="Academic Years" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={years.data}
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
                title={editingYear ? 'Edit Academic Year' : 'Add Academic Year'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={processing}>
                            {editingYear ? 'Update' : 'Create'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Input
                        label="Year (e.g. 2026)"
                        required
                        type="number"
                        min="1900"
                        max="2100"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
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
                open={!!deleteYear}
                onClose={() => setDeleteYear(null)}
                onConfirm={handleDelete}
                title="Delete Academic Year"
                message={`Are you sure you want to delete academic year "${deleteYear?.name}"? This action cannot be undone.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
