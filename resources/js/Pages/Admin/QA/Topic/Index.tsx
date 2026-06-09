import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { SearchableSelect } from '@/Components/ui/SearchableSelect';
import { DataTable } from '@/Components/ui/DataTable';
import { Modal } from '@/Components/ui/Modal';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';
import { Switch } from '@/Components/ui/switch';
import type { ColumnDef } from '@tanstack/react-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';

interface Topic {
    id: number;
    title: string;
    status: boolean;
    created_at: string;
}

interface Props {
    topics: {
        data: Topic[];
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

export default function TopicIndex({ topics, filters }: Props) {
    const { hasPermission } = usePermission();
    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
    const [deleteTopic, setDeleteTopic] = useState<Topic | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        title: '',
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
            '/admin/qa/topics',
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
        setEditingTopic(null);
        setModalOpen(true);
    };

    const openEditModal = (topic: Topic) => {
        clearErrors();
        setEditingTopic(topic);
        setData({
            title: topic.title,
            status: topic.status,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTopic) {
            put(`/admin/qa/topics/${editingTopic.id}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/qa/topics', {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteTopic) return;
        router.delete(`/admin/qa/topics/${deleteTopic.id}`, {
            onSuccess: () => setDeleteTopic(null),
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/qa/topics',
            { page, search: search || undefined, status: statusFilter || undefined },
            { preserveState: true }
        );
    };

    const handleToggleStatus = (topic: Topic) => {
        router.put(`/admin/qa/topics/${topic.id}`, {
            title: topic.title,
            status: !topic.status,
        }, {
            preserveScroll: true,
        });
    };

    const columns: ColumnDef<Topic>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 60,
        },
        {
            accessorKey: 'title',
            header: 'Topic Title',
            cell: ({ row }) => (
                <div className="font-semibold text-stone-900 dark:text-stone-100 font-urdu leading-normal text-right md:text-left pr-4 md:pr-0">
                    {row.original.title}
                </div>
            ),
        },
        {
            accessorKey: 'created_at',
            header: 'Created Date',
            cell: ({ row }) => {
                const date = row.original.created_at ? new Date(row.original.created_at) : null;
                return date ? date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-';
            },
            size: 150,
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
                        {hasPermission('edit topics') && (
                            <DropdownMenuItem onClick={() => openEditModal(row.original)} className="hover:bg-stone-55 dark:hover:bg-stone-850 cursor-pointer flex items-center gap-2 text-stone-700 dark:text-stone-300">
                                <Edit className="h-4 w-4 text-stone-400" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                        )}
                        {hasPermission('delete topics') && (
                            <DropdownMenuItem onClick={() => setDeleteTopic(row.original)} className="hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer flex items-center gap-2 text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20">
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

    const meta = {
        current_page: topics.current_page,
        last_page: topics.last_page,
        per_page: topics.per_page,
        total: topics.total,
        from: topics.from,
        to: topics.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-end w-full">
            <div className="flex-1 min-w-[200px]">
                <Input
                    placeholder="Search topics..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full"
                />
            </div>
            <div className="w-[150px]">
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
                router.get('/admin/qa/topics');
            }}>
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout
            title="Q&A Topics"
            action={
                hasPermission('create topics') ? (
                    <Button variant="primary" onClick={openAddModal}>
                        Add Topic
                    </Button>
                ) : null
            }
        >
            <Head title="Q&A Topics - Admin" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={topics.data}
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
                title={editingTopic ? 'Edit Topic' : 'Add Topic'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={processing}>
                            {editingTopic ? 'Update' : 'Create'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Topic Title"
                        required
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        error={errors.title}
                        className="rounded-xl border-stone-200 dark:border-stone-800 font-urdu rtl:text-right"
                        placeholder="موضوع کا نام درج کریں..."
                    />

                    {/* Status switch */}
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800/80">
                        <div className="space-y-0.5">
                            <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">Active Status</span>
                            <p className="text-xs text-stone-500 dark:text-stone-400">Enable or disable this topic</p>
                        </div>
                        <Switch
                            checked={data.status}
                            onCheckedChange={(val) => setData('status', val)}
                        />
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteTopic}
                onClose={() => setDeleteTopic(null)}
                onConfirm={handleDelete}
                title="Delete Topic"
                message={`Are you sure you want to delete topic "${deleteTopic?.title}"? This action cannot be undone.`}
                variant="danger"
            />
        </AdminLayout>
    );
}

