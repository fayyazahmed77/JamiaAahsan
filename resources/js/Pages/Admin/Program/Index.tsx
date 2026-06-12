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
import type { PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';

interface Program {
    id: number;
    name: string;
    name_ur?: string;
    slug: string;
    type: 'dars_nizami' | 'hifz' | 'tajweed' | 'arabic' | 'ifta' | 'other';
    duration_years: number;
    total_semesters: number;
    description?: string;
    description_ur?: string;
    is_active: boolean;
    sort_order: number;
}

interface Props {
    programs: {
        data: Program[];
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

export default function ProgramIndex({ programs, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);
    const [deleteProgram, setDeleteProgram] = useState<Program | null>(null);
    const { hasPermission } = usePermission();

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        name_ur: '',
        slug: '',
        type: 'dars_nizami',
        duration_years: 8,
        total_semesters: 16,
        description: '',
        description_ur: '',
        is_active: true,
        sort_order: 0,
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
            '/admin/programs',
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
        setEditingProgram(null);
        setModalOpen(true);
    };

    const openEditModal = (program: Program) => {
        clearErrors();
        setEditingProgram(program);
        setData({
            name: program.name,
            name_ur: program.name_ur ?? '',
            slug: program.slug ?? '',
            type: program.type,
            duration_years: program.duration_years,
            total_semesters: program.total_semesters,
            description: program.description ?? '',
            description_ur: program.description_ur ?? '',
            is_active: program.is_active,
            sort_order: program.sort_order ?? 0,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProgram) {
            put(`/admin/programs/${editingProgram.id}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/programs', {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteProgram) return;
        router.delete(`/admin/programs/${deleteProgram.id}`, {
            onSuccess: () => setDeleteProgram(null),
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/programs',
            {
                page,
                search: search || undefined,
                status: statusFilter || undefined,
            },
            { preserveState: true }
        );
    };

    const columns: ColumnDef<Program>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 60,
        },
        {
            accessorKey: 'name',
            header: 'Program Name',
            cell: ({ row }) => (
                <div>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                        {row.original.name}
                    </div>
                    {row.original.name_ur && (
                        <div style={{ fontSize: '0.85em', color: 'var(--text-subtle)', fontFamily: 'Noto Nastaliq Urdu, system-ui' }}>
                            {row.original.name_ur}
                        </div>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'type',
            header: 'Type',
            cell: ({ row }) => {
                const labels = {
                    dars_nizami: 'Dars-e-Nizami',
                    hifz: 'Hifz ul Quran',
                    tajweed: 'Tajweed',
                    arabic: 'Arabic Language',
                    ifta: 'Ifta',
                    other: 'Other',
                };
                return labels[row.original.type] || row.original.type;
            },
        },
        {
            accessorKey: 'duration_years',
            header: 'Duration (Years)',
            size: 140,
        },
        {
            accessorKey: 'total_semesters',
            header: 'Semesters',
            size: 100,
        },
        {
            accessorKey: 'is_active',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={row.original.is_active ? 'success' : 'muted'}>
                    {row.original.is_active ? 'Active' : 'Inactive'}
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
                        <Button variant="destructive" size="sm" onClick={() => setDeleteProgram(row.original)}>
                            Delete
                        </Button>
                    )}
                </div>
            ),
            size: 140,
        },
    ];

    const meta: PageMeta = {
        current_page: programs.current_page,
        last_page: programs.last_page,
        per_page: programs.per_page,
        total: programs.total,
        from: programs.from,
        to: programs.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', width: '100%' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
                <Input
                    placeholder="Search programs..."
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
                router.get('/admin/programs');
            }}>
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout
            title="Programs"
            action={
                hasPermission('create settings') ? (
                    <Button variant="primary" onClick={openAddModal}>
                        Add Program
                    </Button>
                ) : undefined
            }
        >
            <Head title="Programs" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={programs.data}
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
                title={editingProgram ? 'Edit Program' : 'Add Program'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={processing}>
                            {editingProgram ? 'Update' : 'Create'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Input
                        label="Program Name (English)"
                        required
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                    />
                    <Input
                        label="Program Name (Urdu)"
                        value={data.name_ur}
                        onChange={(e) => setData('name_ur', e.target.value)}
                        error={errors.name_ur}
                        placeholder="e.g. درسِ نظامی"
                    />
                    <Input
                        label="Slug (Optional)"
                        value={data.slug}
                        onChange={(e) => setData('slug', e.target.value)}
                        error={errors.slug}
                        placeholder="auto-generated-if-blank"
                    />
                    <SearchableSelect
                        label="Type"
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value as any)}
                        options={[
                            { value: 'dars_nizami', label: 'Dars-e-Nizami' },
                            { value: 'hifz', label: 'Hifz ul Quran' },
                            { value: 'tajweed', label: 'Tajweed' },
                            { value: 'arabic', label: 'Arabic Language' },
                            { value: 'ifta', label: 'Ifta' },
                            { value: 'other', label: 'Other' },
                        ]}
                    />
                    <div style={{ display: 'flex', gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <Input
                                label="Duration (Years)"
                                type="number"
                                required
                                value={data.duration_years}
                                onChange={(e) => setData('duration_years', parseInt(e.target.value) || 0)}
                                error={errors.duration_years}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Input
                                label="Total Semesters"
                                type="number"
                                required
                                value={data.total_semesters}
                                onChange={(e) => setData('total_semesters', parseInt(e.target.value) || 0)}
                                error={errors.total_semesters}
                            />
                        </div>
                    </div>
                    <Input
                        label="Description (English)"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        error={errors.description}
                    />
                    <Input
                        label="Description (Urdu)"
                        value={data.description_ur}
                        onChange={(e) => setData('description_ur', e.target.value)}
                        error={errors.description_ur}
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
                        value={data.is_active ? '1' : '0'}
                        onChange={(e) => setData('is_active', e.target.value === '1')}
                        options={[
                            { value: '1', label: 'Active' },
                            { value: '0', label: 'Inactive' },
                        ]}
                    />
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteProgram}
                onClose={() => setDeleteProgram(null)}
                onConfirm={handleDelete}
                title="Delete Program"
                message={`Are you sure you want to delete program "${deleteProgram?.name}"? All associated semesters will be impacted. This action cannot be undone.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
