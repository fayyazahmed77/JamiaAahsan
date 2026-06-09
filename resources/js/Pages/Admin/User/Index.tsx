import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { usePermission } from '@/hooks/usePermission';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { SearchableSelect } from '@/Components/ui/SearchableSelect';
import { Badge } from '@/Components/ui/Badge';
import { DataTable } from '@/Components/ui/DataTable';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import type { User, PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';
import { Shield, Edit, Trash, Plus, Eye, MoreVertical } from 'lucide-react';

interface Props {
    users: {
        data: User[];
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

function StatusSwitch({ user }: { user: User }) {
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(!!user.status);

    const handleToggle = () => {
        setLoading(true);
        const next = !checked;
        setChecked(next);
        router.put(
            `/admin/users/${user.id}`,
            {
                name: user.name,
                email: user.email,
                status: next,
                roles: user.roles?.map((r: any) => r.name || r) ?? [],
                password: '',
                password_confirmation: '',
            },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setLoading(false),
                onError: () => {
                    // revert on failure
                    setChecked(!next);
                    setLoading(false);
                },
            }
        );
    };

    return (
        <label className="relative inline-flex items-center cursor-pointer select-none" title={checked ? 'Active – click to disable' : 'Disabled – click to activate'}>
            <input
                type="checkbox"
                checked={checked}
                onChange={handleToggle}
                disabled={loading}
                className="sr-only peer"
            />
            <div className="w-9 h-5 bg-stone-300 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600 peer-disabled:opacity-50" />
            <span className={`ms-2 text-xs font-semibold ${checked ? 'text-emerald-600' : 'text-[var(--text-muted)]'}`}>
                {checked ? 'Active' : 'Inactive'}
            </span>
        </label>
    );
}

export default function UserIndex({ users, filters }: Props) {
    const { hasPermission } = usePermission();
    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [deleteUser, setDeleteUser] = useState<User | null>(null);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (val: string) => {
        setStatusFilter(val);
        applyFilters(search, val);
    };

    const applyFilters = (searchText: string, statusText: string) => {
        router.get(
            '/admin/users',
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
        if (!deleteUser) return;
        router.delete(`/admin/users/${deleteUser.id}`, {
            onSuccess: () => setDeleteUser(null),
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/users',
            {
                page,
                search: search || undefined,
                status: statusFilter || undefined,
            },
            { preserveState: true }
        );
    };

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 50,
        },
        {
            accessorKey: 'name',
            header: 'User Account Details',
            cell: ({ row }) => {
                const u = row.original as any;
                const avatarUrl = u.profile_image_url;
                const initials = (u.name?.[0] || 'U').toUpperCase();
                return (
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, var(--primary-600), var(--primary-400))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 700, fontSize: 14,
                            boxShadow: 'var(--shadow-sm)',
                        }}>
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : initials}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{u.name}</span>
                            <span className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{u.email}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'roles',
            header: 'Assigned Roles',
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1.5">
                    {row.original.roles && row.original.roles.length > 0 ? (
                        row.original.roles.map((role: any) => (
                            <Badge key={role.name || role} variant="info" className="flex items-center gap-1">
                                <Shield size={11} /> {role.name || role}
                            </Badge>
                        ))
                    ) : (
                        <span className="text-xs text-muted-foreground italic">No Roles</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Account Status',
            cell: ({ row }) => <StatusSwitch user={row.original} />,
            size: 130,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const u = row.original;
                return (
                    <div className="flex items-center gap-1.5">
                        {/* View */}
                        <Link href={`/admin/users/${u.id}/edit`}>
                            <Button variant="secondary" size="sm" className="flex items-center gap-1 h-7 px-2 text-xs">
                                <Eye size={12} /> View
                            </Button>
                        </Link>

                        {/* Edit */}
                        {hasPermission('edit users') && (
                            <Link href={`/admin/users/${u.id}/edit`}>
                                <Button variant="secondary" size="sm" className="flex items-center gap-1 h-7 px-2 text-xs text-blue-600 hover:text-blue-700">
                                    <Edit size={12} /> Edit
                                </Button>
                            </Link>
                        )}

                        {/* Delete */}
                        {hasPermission('delete users') && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeleteUser(u)}
                                className="flex items-center gap-1 h-7 px-2 text-xs"
                            >
                                <Trash size={12} /> Delete
                            </Button>
                        )}
                    </div>
                );
            },
            size: 220,
        },
    ];

    const meta: PageMeta = {
        current_page: users.current_page,
        last_page: users.last_page,
        per_page: users.per_page,
        total: users.total,
        from: users.from,
        to: users.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-end w-full">
            <div className="flex-1 min-w-[200px]">
                <Input
                    placeholder="Search by name, email..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full"
                />
            </div>
            <div className="w-[150px]">
                <SearchableSelect
                    value={statusFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    options={[
                        { value: '1', label: 'Active' },
                        { value: '0', label: 'Disabled' },
                    ]}
                    placeholder="All Status"
                />
            </div>
            <Button type="submit" variant="primary">Search</Button>
            <Button
                type="button"
                variant="secondary"
                onClick={() => {
                    setSearch('');
                    setStatusFilter('');
                    router.get('/admin/users');
                }}
            >
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout
            title="System User Management"
            action={
                hasPermission('create users') ? (
                    <Link href="/admin/users/create">
                        <Button variant="primary" className="flex items-center gap-1.5">
                            <Plus size={16} /> Add User Account
                        </Button>
                    </Link>
                ) : null
            }
        >
            <Head title="System Users" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={users.data}
                        meta={meta}
                        onPageChange={handlePageChange}
                        toolbar={toolbar}
                    />
                </CardBody>
            </Card>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteUser}
                onClose={() => setDeleteUser(null)}
                onConfirm={handleDelete}
                title="Delete User Account"
                message={`Are you sure you want to permanently delete user account "${deleteUser?.name}"? This action cannot be undone.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
