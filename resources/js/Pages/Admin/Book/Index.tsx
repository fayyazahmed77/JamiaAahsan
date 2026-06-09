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
import type { Book, PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';

interface Props {
    books: {
        data: Book[];
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

export default function BookIndex({ books, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [deleteBook, setDeleteBook] = useState<Book | null>(null);
    const { hasPermission } = usePermission();

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        urdu_name: '',
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
            '/admin/books',
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
        setEditingBook(null);
        setModalOpen(true);
    };

    const openEditModal = (book: Book) => {
        clearErrors();
        setEditingBook(book);
        setData({
            name: book.name,
            urdu_name: book.urdu_name,
            status: book.status,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBook) {
            put(`/admin/books/${editingBook.id}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/books', {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteBook) return;
        router.delete(`/admin/books/${deleteBook.id}`, {
            onSuccess: () => setDeleteBook(null),
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/books',
            { page, search: search || undefined, status: statusFilter || undefined },
            { preserveState: true }
        );
    };

    const columns: ColumnDef<Book>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 60,
        },
        {
            accessorKey: 'name',
            header: 'English Name',
            cell: ({ row }) => (
                <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                    {row.original.name}
                </div>
            ),
        },
        {
            accessorKey: 'urdu_name',
            header: 'Urdu Name',
            cell: ({ row }) => (
                <div style={{ fontSize: '1.1rem', fontFamily: "'Noto Nastaliq Urdu', serif", color: 'var(--text)', direction: 'rtl', textAlign: 'right' }}>
                    {row.original.urdu_name}
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
                    {hasPermission('edit books') && (
                        <Button variant="secondary" size="sm" onClick={() => openEditModal(row.original)}>
                            Edit
                        </Button>
                    )}
                    {hasPermission('delete books') && (
                        <Button variant="destructive" size="sm" onClick={() => setDeleteBook(row.original)}>
                            Delete
                        </Button>
                    )}
                </div>
            ),
            size: 140,
        },
    ];

    const meta: PageMeta = {
        current_page: books.current_page,
        last_page: books.last_page,
        per_page: books.per_page,
        total: books.total,
        from: books.from,
        to: books.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end', width: '100%' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
                <Input
                    placeholder="Search books..."
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
                router.get('/admin/books');
            }}>
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout
            title="Books"
            action={
                hasPermission('create books') ? (
                    <Button variant="primary" onClick={openAddModal}>
                        Add Book
                    </Button>
                ) : undefined
            }
        >
            <Head title="Books" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={books.data}
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
                title={editingBook ? 'Edit Book' : 'Add Book'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} disabled={processing}>
                            {editingBook ? 'Update' : 'Create'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Input
                        label="English Name"
                        required
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                    />
                    <Input
                        label="Urdu Name"
                        required
                        value={data.urdu_name}
                        onChange={(e) => setData('urdu_name', e.target.value)}
                        error={errors.urdu_name}
                        placeholder="مثلاً: صحیح البخاری"
                        style={{ textAlign: 'right', direction: 'rtl' }}
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
                open={!!deleteBook}
                onClose={() => setDeleteBook(null)}
                onConfirm={handleDelete}
                title="Delete Book"
                message={`Are you sure you want to delete book "${deleteBook?.name}"? This action cannot be undone.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
