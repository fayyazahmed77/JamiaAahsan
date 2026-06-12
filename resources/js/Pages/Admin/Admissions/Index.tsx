import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { SearchableSelect } from '@/Components/ui/SearchableSelect';
import { Badge } from '@/Components/ui/Badge';
import { DataTable } from '@/Components/ui/DataTable';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';
import type { UserDetail, PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Check, X, FileText, Search } from 'lucide-react';
import { usePermission } from '@/hooks/usePermission';

interface Props {
    admissions: {
        data: UserDetail[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    classes: { id: number; name: string }[];
    filters: {
        search?: string;
        gender?: string;
        class_id?: string;
        status?: string;
    };
}

export default function AdmissionsIndex({ admissions, classes, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [genderFilter, setGenderFilter] = useState(filters.gender ?? '');
    const [classFilter, setClassFilter] = useState(filters.class_id ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [approveItem, setApproveItem] = useState<UserDetail | null>(null);
    const { hasPermission } = usePermission();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (field: 'gender' | 'class_id' | 'status') => (e: { target: { value: string } }) => {
        const val = e.target.value;
        let nextSearch = search;
        let nextGender = genderFilter;
        let nextClass = classFilter;
        let nextStatus = statusFilter;

        if (field === 'gender') {
            nextGender = val;
            setGenderFilter(val);
        } else if (field === 'class_id') {
            nextClass = val;
            setClassFilter(val);
        } else {
            nextStatus = val;
            setStatusFilter(val);
        }

        applyFilters(nextSearch, nextGender, nextClass, nextStatus);
    };

    const applyFilters = (searchText: string, genderText: string, classText: string, statusText: string) => {
        router.get(
            '/admin/admissions',
            {
                search: searchText || undefined,
                gender: genderText || undefined,
                class_id: classText || undefined,
                status: statusText || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(search, genderFilter, classFilter, statusFilter);
    };

    const handleApprove = () => {
        if (!approveItem) return;
        router.post(`/admin/admissions/${approveItem.id}/approve`, {}, {
            onSuccess: () => setApproveItem(null),
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/admissions',
            {
                page,
                search: search || undefined,
                gender: genderFilter || undefined,
                class_id: classFilter || undefined,
                status: statusFilter || undefined,
            },
            { preserveState: true }
        );
    };

    const columns: ColumnDef<UserDetail>[] = [
        {
            accessorKey: 'registration_no',
            header: 'Reg No.',
            cell: ({ row }) => (
                <span className="font-mono font-medium">
                    {row.original.registration_no || (
                        <Badge variant="warning">Pending</Badge>
                    )}
                </span>
            ),
            size: 150,
        },
        {
            accessorKey: 'user.name',
            header: 'Applicant',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{row.original.user?.name}</span>
                    <span className="text-xs text-muted-foreground">{row.original.user?.email}</span>
                </div>
            ),
        },
        {
            accessorKey: 'guardian_name',
            header: 'Father Name',
            cell: ({ row }) => row.original.guardian_name,
        },
        {
            accessorKey: 'class.name',
            header: 'Class',
            cell: ({ row }) => row.original.class?.name ?? '-',
        },
        {
            accessorKey: 'phone',
            header: 'Phone / Mobile',
            cell: ({ row }) => row.original.phone,
        },
        {
            accessorKey: 'is_approved',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={row.original.is_approved ? 'success' : 'warning'}>
                    {row.original.is_approved ? 'Approved' : 'Pending Review'}
                </Badge>
            ),
            size: 120,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Link href={`/admin/admissions/${row.original.id}`}>
                        <Button variant="secondary" size="sm" className="flex items-center gap-1">
                            <Eye size={14} /> Details
                        </Button>
                    </Link>
                    {hasPermission('edit admissions') && !row.original.is_approved && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setApproveItem(row.original)}
                            className="flex items-center gap-1"
                        >
                            <Check size={14} /> Approve
                        </Button>
                    )}
                </div>
            ),
            size: 180,
        },
    ];

    const meta: PageMeta = {
        current_page: admissions.current_page,
        last_page: admissions.last_page,
        per_page: admissions.per_page,
        total: admissions.total,
        from: admissions.from,
        to: admissions.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-end w-full">
            <div className="flex-1 min-w-[200px]">
                <Input
                    placeholder="Search by name, reg, cnic, phone..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full"
                />
            </div>
            <div className="w-[140px]">
                <SearchableSelect
                    value={classFilter}
                    onChange={handleFilterChange('class_id')}
                    options={classes.map(cl => ({ value: cl.id.toString(), label: cl.name }))}
                    placeholder="All Classes"
                />
            </div>
            <div className="w-[140px]">
                <SearchableSelect
                    value={genderFilter}
                    onChange={handleFilterChange('gender')}
                    options={[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                    ]}
                    placeholder="All Genders"
                />
            </div>
            <div className="w-[140px]">
                <SearchableSelect
                    value={statusFilter}
                    onChange={handleFilterChange('status')}
                    options={[
                        { value: 'approved', label: 'Approved' },
                        { value: 'pending', label: 'Pending' },
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
                    setGenderFilter('');
                    setClassFilter('');
                    setStatusFilter('');
                    router.get('/admin/admissions');
                }}
            >
                Reset
            </Button>
            <a
                href="/admin/exports/admissions"
                className="inline-flex items-center justify-center gap-1.5 h-10 rounded-lg bg-[#1e6b3e] px-4 text-sm font-semibold text-white hover:bg-[#154c2b] transition shadow-sm ml-auto"
            >
                <FileText size={16} /> Export (Excel)
            </a>
        </form>
    );

    return (
        <AdminLayout title="Student Admissions">
            <Head title="Admissions" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={admissions.data}
                        meta={meta}
                        onPageChange={handlePageChange}
                        toolbar={toolbar}
                    />
                </CardBody>
            </Card>

            {/* Approval Confirmation */}
            <ConfirmDialog
                open={!!approveItem}
                onClose={() => setApproveItem(null)}
                onConfirm={handleApprove}
                title="Approve Admission"
                message={`Are you sure you want to approve the admission request for "${approveItem?.user?.name}"? An active registration number will be generated immediately.`}
                variant="primary"
            />
        </AdminLayout>
    );
}
