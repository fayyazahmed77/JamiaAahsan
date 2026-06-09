import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
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
import { MoreHorizontal, Edit, Trash2, Eye, Plus } from 'lucide-react';

interface QA {
    id: number;
    topic_id: number;
    title: string;
    question: string;
    answer: string;
    status: boolean;
    created_at: string;
    topic?: {
        id: number;
        title: string;
    };
}

interface Props {
    questions: {
        data: QA[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    topics: { id: number; title: string }[];
    filters: {
        search?: string;
        topic_id?: string;
        status?: string;
    };
}

export default function QAIndex({ questions, topics, filters }: Props) {
    const { hasPermission } = usePermission();
    const [search, setSearch] = useState(filters.search ?? '');
    const [topicFilter, setTopicFilter] = useState(filters.topic_id ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [deleteQuestion, setDeleteQuestion] = useState<QA | null>(null);
    const [viewingQuestion, setViewingQuestion] = useState<QA | null>(null);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleTopicFilterChange = (e: { target: { value: string } }) => {
        const val = e.target.value;
        setTopicFilter(val);
        applyFilters(search, val, statusFilter);
    };

    const handleStatusFilterChange = (e: { target: { value: string } }) => {
        const val = e.target.value;
        setStatusFilter(val);
        applyFilters(search, topicFilter, val);
    };

    const applyFilters = (searchText: string, topicVal: string, statusVal: string) => {
        router.get(
            '/admin/qa/questions',
            { 
                search: searchText || undefined, 
                topic_id: topicVal || undefined, 
                status: statusVal || undefined 
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(search, topicFilter, statusFilter);
    };

    const handleDelete = () => {
        if (!deleteQuestion) return;
        router.delete(`/admin/qa/questions/${deleteQuestion.id}`, {
            onSuccess: () => setDeleteQuestion(null),
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/qa/questions',
            { 
                page, 
                search: search || undefined, 
                topic_id: topicFilter || undefined, 
                status: statusFilter || undefined 
            },
            { preserveState: true }
        );
    };

    const handleToggleStatus = (qa: QA) => {
        router.put(`/admin/qa/questions/${qa.id}`, {
            topic_id: qa.topic_id,
            title: qa.title,
            question: qa.question,
            answer: qa.answer,
            status: !qa.status,
        }, {
            preserveScroll: true,
        });
    };

    const columns: ColumnDef<QA>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            size: 60,
        },
        {
            accessorKey: 'title',
            header: 'Title / Subject',
            cell: ({ row }) => (
                <div className="font-semibold text-stone-900 dark:text-stone-100 font-urdu leading-normal text-right md:text-left pr-4 md:pr-0">
                    {row.original.title}
                </div>
            ),
        },
        {
            accessorKey: 'topic',
            header: 'Topic',
            cell: ({ row }) => (
                <span className="font-urdu font-medium text-xs px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded-full border border-stone-200 dark:border-stone-700">
                    {row.original.topic?.title || '-'}
                </span>
            ),
        },
        {
            accessorKey: 'created_at',
            header: 'Created Date',
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
                        <DropdownMenuItem onClick={() => setViewingQuestion(row.original)} className="hover:bg-stone-55 dark:hover:bg-stone-850 cursor-pointer flex items-center gap-2 text-stone-700 dark:text-stone-300">
                            <Eye className="h-4 w-4 text-stone-400" />
                            <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                                {hasPermission('edit qa') ? (
                                    <Link href={`/admin/qa/questions/${row.original.id}/edit`} className="hover:bg-stone-55 dark:hover:bg-stone-850 cursor-pointer flex items-center gap-2 text-stone-700 dark:text-stone-300">
                                        <Edit className="h-4 w-4 text-stone-400" />
                                        <span>Edit</span>
                                    </Link>
                                ) : <span />}
                        </DropdownMenuItem>
                        {hasPermission('delete qa') && (
                            <DropdownMenuItem onClick={() => setDeleteQuestion(row.original)} className="hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer flex items-center gap-2 text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20">
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
        current_page: questions.current_page,
        last_page: questions.last_page,
        per_page: questions.per_page,
        total: questions.total,
        from: questions.from,
        to: questions.to,
    };

    const toolbar = (
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-end w-full">
            <div className="flex-1 min-w-[200px]">
                <Input
                    placeholder="Search title, question, or answer..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full"
                />
            </div>
            <div className="w-[180px]">
                <SearchableSelect
                    value={topicFilter}
                    onChange={handleTopicFilterChange}
                    options={topics.map(t => ({ value: String(t.id), label: t.title }))}
                    placeholder="All Topics"
                />
            </div>
            <div className="w-[130px]">
                <SearchableSelect
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
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
                setTopicFilter('');
                setStatusFilter('');
                router.get('/admin/qa/questions');
            }}>
                Reset
            </Button>
        </form>
    );

    return (
        <AdminLayout
            title="Questions & Answers"
            action={
                hasPermission('create qa') ? (
                    <Button variant="primary" asChild>
                        <Link href="/admin/qa/questions/create" className="flex items-center gap-1.5 font-bold">
                            <Plus className="w-4 h-4" />
                            <span>Add Question</span>
                        </Link>
                    </Button>
                ) : null
            }
        >
            <Head title="Questions & Answers - Admin" />

            <Card>
                <CardBody>
                    <DataTable
                        columns={columns}
                        data={questions.data}
                        meta={meta}
                        onPageChange={handlePageChange}
                        toolbar={toolbar}
                    />
                </CardBody>
            </Card>

            {/* View Details Modal */}
            <Modal
                open={!!viewingQuestion}
                onClose={() => setViewingQuestion(null)}
                title="Question & Answer Details"
                footer={
                    <Button variant="secondary" onClick={() => setViewingQuestion(null)}>
                        Close
                    </Button>
                }
            >
                {viewingQuestion && (
                    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
                        <div className="space-y-2 border-b border-stone-200 dark:border-stone-800 pb-4">
                            <span className="text-[10px] uppercase font-black tracking-widest text-stone-400">Title / Subject</span>
                            <h3 className="font-urdu text-lg text-stone-900 dark:text-white leading-normal">{viewingQuestion.title}</h3>
                            <div className="flex gap-4 items-center mt-2 text-xs text-stone-500">
                                <span>Topic: <strong className="font-urdu text-stone-700 dark:text-stone-300">{viewingQuestion.topic?.title}</strong></span>
                                <span>Status: <strong className={viewingQuestion.status ? "text-emerald-500" : "text-stone-500"}>{viewingQuestion.status ? "Active" : "Inactive"}</strong></span>
                            </div>
                        </div>

                        <div className="space-y-2 bg-stone-50 dark:bg-stone-900/40 p-4 rounded-xl border border-stone-200/50 dark:border-stone-800/80">
                            <span className="text-[10px] uppercase font-black tracking-widest text-stone-400">Question (سوال)</span>
                            <p className="font-urdu text-sm text-stone-800 dark:text-stone-200 whitespace-pre-line leading-7 text-right">{viewingQuestion.question}</p>
                        </div>

                        <div className="space-y-2">
                            <span className="text-[10px] uppercase font-black tracking-widest text-stone-400">Answer (جواب)</span>
                            <div 
                                className="font-urdu text-sm text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 rounded-xl p-4 bg-white dark:bg-stone-950/40 leading-8 text-right prose dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: viewingQuestion.answer }}
                            />
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteQuestion}
                onClose={() => setDeleteQuestion(null)}
                onConfirm={handleDelete}
                title="Delete Question & Answer"
                message={`Are you sure you want to delete "${deleteQuestion?.title}"? This action cannot be undone.`}
                variant="danger"
            />
        </AdminLayout>
    );
}

