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
import type { Feedback, PageMeta } from '@/types/models';
import type { ColumnDef } from '@tanstack/react-table';
import { Mail, Phone, MessageSquare, Star, Trash, Eye, Reply } from 'lucide-react';

interface Props {
    feedbacks: {
        data: Feedback[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    filters: {
        search?: string;
        rating?: string;
        status?: string;
    };
}

export default function FeedbackIndex({ feedbacks, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [ratingFilter, setRatingFilter] = useState(filters.rating ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [viewFeedback, setViewFeedback] = useState<Feedback | null>(null);
    const [deleteFeedback, setDeleteFeedback] = useState<Feedback | null>(null);
    const { hasPermission } = usePermission();

    const { data: replyData, setData: setReplyData, put: putReply, processing: processingReply, reset: resetReply } = useForm({
        reply: '',
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (field: 'rating' | 'status') => (e: { target: { value: string } }) => {
        const val = e.target.value;
        let nextSearch = search;
        let nextRating = ratingFilter;
        let nextStatus = statusFilter;

        if (field === 'rating') {
            nextRating = val;
            setRatingFilter(val);
        } else {
            nextStatus = val;
            setStatusFilter(val);
        }

        applyFilters(nextSearch, nextRating, nextStatus);
    };

    const applyFilters = (searchText: string, ratingText: string, statusText: string) => {
        router.get(
            '/admin/feedback',
            {
                search: searchText || undefined,
                rating: ratingText || undefined,
                status: statusText || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(search, ratingFilter, statusFilter);
    };

    const handleDelete = () => {
        if (!deleteFeedback) return;
        router.delete(`/admin/feedback/${deleteFeedback.id}`, {
            onSuccess: () => setDeleteFeedback(null),
        });
    };

    const handleMarkRead = (fb: Feedback) => {
        router.put(`/admin/feedback/${fb.id}`, {
            is_read: true
        }, {
            preserveScroll: true
        });
    };

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!viewFeedback) return;

        putReply(`/admin/feedback/${viewFeedback.id}`, {
            onSuccess: () => {
                setViewFeedback(null);
                resetReply();
            }
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/feedback',
            {
                page,
                search: search || undefined,
                rating: ratingFilter || undefined,
                status: statusFilter || undefined,
            },
            { preserveState: true }
        );
    };

    const columns: ColumnDef<Feedback>[] = [
        {
            accessorKey: 'is_read',
            header: 'Status',
            cell: ({ row }) => (
                <Badge variant={(row.original as any).is_read ? 'muted' : 'success'}>
                    {(row.original as any).is_read ? 'Read' : 'New'}
                </Badge>
            ),
            size: 80,
        },
        {
            accessorKey: 'name',
            header: 'Sender',
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{row.original.name}</span>
                    <span className="text-xs text-muted-foreground">{row.original.email}</span>
                </div>
            ),
        },
        {
            accessorKey: 'rating',
            header: 'Rating',
            cell: ({ row }) => (
                <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <span>{row.original.rating}</span>
                    <Star size={14} fill="currentColor" />
                </div>
            ),
            size: 100,
        },
        {
            accessorKey: 'comment',
            header: 'Message Snippet',
            cell: ({ row }) => (
                <p className="text-sm line-clamp-1 max-w-[300px] text-muted-foreground">
                    {row.original.comment || <span className="italic">No text comment</span>}
                </p>
            ),
        },
        {
            accessorKey: 'created_at',
            header: 'Received At',
            cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
            size: 120,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                            setViewFeedback(row.original);
                            if (!(row.original as any).is_read) {
                                handleMarkRead(row.original);
                            }
                        }}
                        className="flex items-center gap-1"
                    >
                        <Eye size={14} /> Open
                    </Button>
                    {hasPermission('delete feedback') && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteFeedback(row.original)}
                            className="flex items-center gap-1"
                        >
                            <Trash size={14} /> Delete
                        </Button>
                    )}
                </div>
            ),
            size: 160,
        },
    ];

    const meta: PageMeta = {
        current_page: feedbacks.current_page,
        last_page: feedbacks.last_page,
        per_page: feedbacks.per_page,
        total: feedbacks.total,
        from: feedbacks.from,
        to: feedbacks.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-end w-full">
            <div className="flex-1 min-w-[200px]">
                <Input
                    placeholder="Search by sender name, email, comment..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full"
                />
            </div>
            <div className="w-[140px]">
                <SearchableSelect
                    value={ratingFilter}
                    onChange={handleFilterChange('rating')}
                    options={[
                        { value: '5', label: '5 Stars' },
                        { value: '4', label: '4 Stars' },
                        { value: '3', label: '3 Stars' },
                        { value: '2', label: '2 Stars' },
                        { value: '1', label: '1 Star' },
                    ]}
                    placeholder="All Ratings"
                />
            </div>
            <div className="w-[140px]">
                <SearchableSelect
                    value={statusFilter}
                    onChange={handleFilterChange('status')}
                    options={[
                        { value: 'read', label: 'Read' },
                        { value: 'unread', label: 'Unread' },
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
                    setRatingFilter('');
                    setStatusFilter('');
                    router.get('/admin/feedback');
                }}
            >
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout title="User Feedback Inbox">
            <Head title="Feedback Inbox" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={feedbacks.data}
                        meta={meta}
                        onPageChange={handlePageChange}
                        toolbar={toolbar}
                    />
                </CardBody>
            </Card>

            {/* Read & Reply Modal */}
            <Modal
                open={!!viewFeedback}
                onClose={() => setViewFeedback(null)}
                title={`Feedback Details: ${viewFeedback?.name}`}
                footer={
                    <Button variant="secondary" onClick={() => setViewFeedback(null)}>
                        Close
                    </Button>
                }
            >
                <div className="flex flex-col gap-4">
                    {/* Details grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm bg-stone-50/5 p-3 rounded-lg border border-border">
                        <div>
                            <span className="text-xs text-muted-foreground uppercase font-bold">Email</span>
                            <p className="font-semibold">{viewFeedback?.email}</p>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground uppercase font-bold">Phone</span>
                            <p className="font-semibold">{viewFeedback?.phone || '-'}</p>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground uppercase font-bold">Rating Given</span>
                            <p className="font-semibold text-amber-500 flex items-center gap-1">
                                {viewFeedback?.rating} <Star size={14} fill="currentColor" />
                            </p>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground uppercase font-bold">Country</span>
                            <p className="font-semibold">{viewFeedback?.country}</p>
                        </div>
                    </div>

                    {/* Message body */}
                    <div className="flex flex-col gap-1 mt-2">
                        <span className="text-xs text-muted-foreground uppercase font-bold">Message Comment</span>
                        <p className="text-sm p-3 bg-stone-100/5 rounded-md border border-border whitespace-pre-wrap">
                            {viewFeedback?.comment || <span className="italic text-muted-foreground">No comment text left.</span>}
                        </p>
                    </div>

                    {/* Reply Form */}
                    {hasPermission('edit feedback') && (
                        <form onSubmit={handleReplySubmit} className="flex flex-col gap-3 border-t pt-4 mt-2 border-border">
                            <span className="text-xs text-muted-foreground uppercase font-bold flex items-center gap-1">
                                <Reply size={14} /> Record Reply Notes
                            </span>
                            <textarea
                                value={replyData.reply}
                                onChange={(e) => setReplyData('reply', e.target.value)}
                                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="Type a response or actions taken note..."
                                required
                            />
                            <Button type="submit" variant="primary" disabled={processingReply} className="w-full">
                                Record Reply
                            </Button>
                        </form>
                    )}
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteFeedback}
                onClose={() => setDeleteFeedback(null)}
                onConfirm={handleDelete}
                title="Delete Feedback"
                message={`Are you sure you want to delete this feedback message? This action is permanent.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
