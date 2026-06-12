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
}

interface Semester {
    id: number;
    program_id: number;
    program?: Program;
    name: string;
    code: string;
    start_date: string;
    end_date: string;
    duration_months: number;
    status: 'active' | 'inactive' | 'completed';
    academic_year: string;
}

interface Props {
    semesters: {
        data: Semester[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    programs: Program[];
    filters: {
        search?: string;
        program_id?: string;
        status?: string;
    };
}

export default function SemesterIndex({ semesters, programs, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [programFilter, setProgramFilter] = useState(filters.program_id ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
    const [deleteSemester, setDeleteSemester] = useState<Semester | null>(null);
    const { hasPermission } = usePermission();

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        program_id: '',
        name: '',
        code: '',
        start_date: '',
        end_date: '',
        duration_months: 6,
        status: 'inactive',
        academic_year: new Date().getFullYear().toString(),
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleProgramFilterChange = (e: { target: { value: string } }) => {
        const val = e.target.value;
        setProgramFilter(val);
        applyFilters(search, val, statusFilter);
    };

    const handleStatusFilterChange = (e: { target: { value: string } }) => {
        const val = e.target.value;
        setStatusFilter(val);
        applyFilters(search, programFilter, val);
    };

    const applyFilters = (searchText: string, progId: string, statusText: string) => {
        router.get(
            '/admin/semesters',
            {
                search: searchText || undefined,
                program_id: progId || undefined,
                status: statusText || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(search, programFilter, statusFilter);
    };

    const openAddModal = () => {
        reset();
        clearErrors();
        setEditingSemester(null);
        setModalOpen(true);
    };

    const openEditModal = (semester: Semester) => {
        clearErrors();
        setEditingSemester(semester);
        
        // Format dates as YYYY-MM-DD for input fields
        const formattedStart = semester.start_date ? new Date(semester.start_date).toISOString().split('T')[0] : '';
        const formattedEnd = semester.end_date ? new Date(semester.end_date).toISOString().split('T')[0] : '';
        
        setData({
            program_id: semester.program_id.toString(),
            name: semester.name,
            code: semester.code,
            start_date: formattedStart,
            end_date: formattedEnd,
            duration_months: semester.duration_months,
            status: semester.status,
            academic_year: semester.academic_year,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSemester) {
            put(`/admin/semesters/${editingSemester.id}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/semesters', {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteSemester) return;
        router.delete(`/admin/semesters/${deleteSemester.id}`, {
            onSuccess: () => setDeleteSemester(null),
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/semesters',
            {
                page,
                search: search || undefined,
                program_id: programFilter || undefined,
                status: statusFilter || undefined,
            },
            { preserveState: true }
        );
    };

    const columns: ColumnDef<Semester>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 60,
        },
        {
            accessorKey: 'name',
            header: 'Semester Name',
            cell: ({ row }) => (
                <div>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                        {row.original.name}
                    </div>
                    <div style={{ fontSize: '0.85em', color: 'var(--text-subtle)' }}>
                        {row.original.code}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'program.name',
            header: 'Program',
            cell: ({ row }) => row.original.program?.name ?? 'Unknown Program',
        },
        {
            accessorKey: 'academic_year',
            header: 'Academic Year',
            size: 130,
        },
        {
            accessorKey: 'start_date',
            header: 'Start Date',
            cell: ({ row }) => new Date(row.original.start_date).toLocaleDateString(),
            size: 120,
        },
        {
            accessorKey: 'end_date',
            header: 'End Date',
            cell: ({ row }) => new Date(row.original.end_date).toLocaleDateString(),
            size: 120,
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const variants: Record<string, 'success' | 'warning' | 'muted'> = {
                    active: 'success',
                    completed: 'muted',
                    inactive: 'warning',
                };
                return (
                    <Badge variant={variants[row.original.status] || 'muted'}>
                        {row.original.status.toUpperCase()}
                    </Badge>
                );
            },
            size: 100,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div style={{ display: 'flex', gap: 8 }}>
                    {hasPermission('edit classes') && (
                        <Button variant="secondary" size="sm" onClick={() => openEditModal(row.original)}>
                            Edit
                        </Button>
                    )}
                    {hasPermission('delete classes') && (
                        <Button variant="destructive" size="sm" onClick={() => setDeleteSemester(row.original)}>
                            Delete
                        </Button>
                    )}
                </div>
            ),
            size: 140,
        },
    ];

    const meta: PageMeta = {
        current_page: semesters.current_page,
        last_page: semesters.last_page,
        per_page: semesters.per_page,
        total: semesters.total,
        from: semesters.from,
        to: semesters.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', width: '100%' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
                <Input
                    placeholder="Search semesters..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full"
                />
            </div>
            <div style={{ width: 200 }}>
                <SearchableSelect
                    value={programFilter}
                    onChange={handleProgramFilterChange}
                    options={programs.map(p => ({ value: p.id.toString(), label: p.name }))}
                    placeholder="All Programs"
                />
            </div>
            <div style={{ width: 150 }}>
                <SearchableSelect
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    options={[
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                        { value: 'completed', label: 'Completed' },
                    ]}
                    placeholder="All Status"
                />
            </div>
            <Button type="submit" variant="primary">
                Search
            </Button>
            <Button type="button" variant="secondary" onClick={() => {
                setSearch('');
                setProgramFilter('');
                setStatusFilter('');
                router.get('/admin/semesters');
            }}>
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout
            title="Semesters"
            action={
                hasPermission('create classes') ? (
                    <Button variant="primary" onClick={openAddModal}>
                        Add Semester
                    </Button>
                ) : undefined
            }
        >
            <Head title="Semesters" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={semesters.data}
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
                title={editingSemester ? 'Edit Semester' : 'Add Semester'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={processing}>
                            {editingSemester ? 'Update' : 'Create'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <SearchableSelect
                        label="Program"
                        required
                        value={data.program_id}
                        onChange={(e) => setData('program_id', e.target.value)}
                        options={programs.map(p => ({ value: p.id.toString(), label: p.name }))}
                        error={errors.program_id}
                    />
                    <Input
                        label="Semester Name"
                        required
                        placeholder="e.g. Semester 1"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                    />
                    <Input
                        label="Semester Code"
                        required
                        placeholder="e.g. DN-S1-2026"
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value)}
                        error={errors.code}
                    />
                    <div style={{ display: 'flex', gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <Input
                                label="Start Date"
                                type="date"
                                required
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                error={errors.start_date}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Input
                                label="End Date"
                                type="date"
                                required
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                error={errors.end_date}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <Input
                                label="Duration (Months)"
                                type="number"
                                required
                                value={data.duration_months}
                                onChange={(e) => setData('duration_months', parseInt(e.target.value) || 6)}
                                error={errors.duration_months}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Input
                                label="Academic Year"
                                required
                                value={data.academic_year}
                                onChange={(e) => setData('academic_year', e.target.value)}
                                error={errors.academic_year}
                            />
                        </div>
                    </div>
                    <SearchableSelect
                        label="Status"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value as any)}
                        options={[
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' },
                            { value: 'completed', label: 'Completed' },
                        ]}
                    />
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteSemester}
                onClose={() => setDeleteSemester(null)}
                onConfirm={handleDelete}
                title="Delete Semester"
                message={`Are you sure you want to delete semester "${deleteSemester?.name}"? All associated student records and course offerings will be affected. This action cannot be undone.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
