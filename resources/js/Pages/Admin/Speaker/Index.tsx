import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { SearchableSelect } from '@/Components/ui/SearchableSelect';
import { Badge } from '@/Components/ui/Badge';
import { DataTable } from '@/Components/ui/DataTable';
import { Modal } from '@/Components/ui/Modal';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';
import type { Speaker, PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';
import { FileUpload } from '@/Components/ui/FileUpload';
import { Switch } from '@/Components/ui/switch';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Eye, Trash2 } from 'lucide-react';

interface Props {
    speakers: {
        data: Speaker[];
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

export default function SpeakerIndex({ speakers, filters }: Props) {
    const { hasPermission } = usePermission();
    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [modalOpen, setModalOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
    const [deleteSpeaker, setDeleteSpeaker] = useState<Speaker | null>(null);
    const [viewingSpeaker, setViewingSpeaker] = useState<Speaker | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        short_name: '',
        status: true,
        image: null as File | null,
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
            '/admin/speakers',
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
        setImagePreview(null);
        setEditingSpeaker(null);
        setModalOpen(true);
    };

    const openEditModal = (speaker: Speaker) => {
        clearErrors();
        setEditingSpeaker(speaker);
        setData({
            name: speaker.name,
            short_name: speaker.short_name ?? '',
            status: speaker.status,
            image: null,
        });
        setImagePreview(speaker.image_url ?? null);
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSpeaker) {
            put(`/admin/speakers/${editingSpeaker.id}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/speakers', {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteSpeaker) return;
        router.delete(`/admin/speakers/${deleteSpeaker.id}`, {
            onSuccess: () => setDeleteSpeaker(null),
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/speakers',
            { page, search: search || undefined, status: statusFilter || undefined },
            { preserveState: true }
        );
    };

    const handleToggleStatus = (speaker: Speaker) => {
        router.put(`/admin/speakers/${speaker.id}`, {
            name: speaker.name,
            short_name: speaker.short_name ?? '',
            status: !speaker.status,
        }, {
            preserveScroll: true,
        });
    };

    const columns: ColumnDef<Speaker>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 60,
        },
        {
            accessorKey: 'image',
            header: 'Photo',
            cell: ({ row }) => (
                <div style={{ display: 'flex', alignItems: 'center', width: 40, height: 40 }}>
                    {row.original.image_url ? (
                        <img
                            src={row.original.image_url}
                            alt={row.original.name}
                            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }}
                        />
                    ) : (
                        <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: 'var(--surface-3)',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 600,
                            border: '1px dashed var(--border)'
                        }}>
                            {(row.original.name?.[0] || 'S').toUpperCase()}
                        </div>
                    )}
                </div>
            ),
            size: 80,
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
            accessorKey: 'short_name',
            header: 'Short Name',
            cell: ({ row }) => row.original.short_name || <span style={{ color: 'var(--text-subtle)' }}>-</span>,
        },
        {
            accessorKey: 'created_at',
            header: 'Create Date',
            cell: ({ row }) => {
                const date = row.original.created_at ? new Date(row.original.created_at) : null;
                return date ? date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-';
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
                        <DropdownMenuItem onClick={() => setViewingSpeaker(row.original)} className="hover:bg-stone-55 dark:hover:bg-stone-850 cursor-pointer flex items-center gap-2 text-stone-700 dark:text-stone-300">
                            <Eye className="h-4 w-4 text-stone-400" />
                            <span>View</span>
                        </DropdownMenuItem>
                        {hasPermission('edit speakers') && (
                            <DropdownMenuItem onClick={() => openEditModal(row.original)} className="hover:bg-stone-55 dark:hover:bg-stone-850 cursor-pointer flex items-center gap-2 text-stone-700 dark:text-stone-300">
                                <Edit className="h-4 w-4 text-stone-400" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                        )}
                        {hasPermission('delete speakers') && (
                            <DropdownMenuItem onClick={() => setDeleteSpeaker(row.original)} className="hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer flex items-center gap-2 text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20">
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
        current_page: speakers.current_page,
        last_page: speakers.last_page,
        per_page: speakers.per_page,
        total: speakers.total,
        from: speakers.from,
        to: speakers.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', width: '100%' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
                <Input
                    placeholder="Search speakers..."
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
                router.get('/admin/speakers');
            }}>
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout
            title="Speakers"
            action={
                hasPermission('create speakers') ? (
                    <Button variant="primary" onClick={openAddModal}>
                        Add Speaker
                    </Button>
                ) : null
            }
        >
            <Head title="Speakers" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={speakers.data}
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
                title={editingSpeaker ? 'Edit Speaker' : 'Add Speaker'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={processing}>
                            {editingSpeaker ? 'Update' : 'Create'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Speaker Photo on Top */}
                    <div className="bg-stone-50 dark:bg-stone-900/40 p-4 rounded-2xl border border-stone-200/60 dark:border-stone-800/80">
                        <FileUpload
                            label="Speaker Photo"
                            accept="image/*"
                            onChange={(file) => setData('image', file)}
                            error={errors.image}
                            preview={imagePreview ?? undefined}
                        />
                    </div>

                    {/* Name and Short Name input fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Speaker Name"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            className="rounded-xl border-stone-200 dark:border-stone-800"
                        />
                        <Input
                            label="Short Name (Optional)"
                            value={data.short_name}
                            onChange={(e) => setData('short_name', e.target.value)}
                            error={errors.short_name}
                            className="rounded-xl border-stone-200 dark:border-stone-800"
                            placeholder="e.g. Tariq Jameel"
                        />
                    </div>

                    {/* Status switch for Active/Inactive */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800/80">
                        <div className="space-y-0.5">
                            <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">Active Status</span>
                            <p className="text-xs text-stone-500 dark:text-stone-400">Enable or disable this speaker profile</p>
                        </div>
                        <Switch
                            checked={data.status}
                            onCheckedChange={(val) => setData('status', val)}
                            label={data.status ? "Active" : "Inactive"}
                        />
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteSpeaker}
                onClose={() => setDeleteSpeaker(null)}
                onConfirm={handleDelete}
                title="Delete Speaker"
                message={`Are you sure you want to delete speaker "${deleteSpeaker?.name}"? This action cannot be undone.`}
                variant="danger"
            />

            {/* View Speaker Modal */}
            <Modal
                open={!!viewingSpeaker}
                onClose={() => setViewingSpeaker(null)}
                title="Speaker Details"
                footer={
                    <Button variant="secondary" onClick={() => setViewingSpeaker(null)}>
                        Close
                    </Button>
                }
            >
                {viewingSpeaker && (
                    <div className="space-y-6">
                        {/* Speaker Photo */}
                        <div className="flex justify-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-stone-200 dark:border-stone-850 shadow-sm bg-stone-50 dark:bg-stone-900">
                                {viewingSpeaker.image_url ? (
                                    <img
                                        src={viewingSpeaker.image_url}
                                        alt={viewingSpeaker.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-stone-400 dark:text-stone-600 bg-stone-100 dark:bg-stone-800">
                                        {(viewingSpeaker.name?.[0] || 'S').toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Speaker Information */}
                        <div className="space-y-4 bg-stone-50 dark:bg-stone-900/40 p-5 rounded-2xl border border-stone-100 dark:border-stone-850">
                            <div className="grid grid-cols-2 gap-4 py-2 border-b border-stone-100 dark:border-stone-850/60">
                                <span className="text-stone-500 dark:text-stone-400 font-medium">Name:</span>
                                <span className="text-stone-950 dark:text-white font-semibold">{viewingSpeaker.name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 py-2 border-b border-stone-100 dark:border-stone-850/60">
                                <span className="text-stone-500 dark:text-stone-400 font-medium">Short Name:</span>
                                <span className="text-stone-950 dark:text-white font-medium">{viewingSpeaker.short_name || '-'}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 py-2 border-b border-stone-100 dark:border-stone-850/60">
                                <span className="text-stone-500 dark:text-stone-400 font-medium">Status:</span>
                                <span>
                                    <Badge variant={viewingSpeaker.status ? 'success' : 'muted'}>
                                        {viewingSpeaker.status ? 'Active' : 'Inactive'}
                                    </Badge>
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 py-2">
                                <span className="text-stone-500 dark:text-stone-400 font-medium">Created Date:</span>
                                <span className="text-stone-950 dark:text-white font-medium">
                                    {viewingSpeaker.created_at ? new Date(viewingSpeaker.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}
