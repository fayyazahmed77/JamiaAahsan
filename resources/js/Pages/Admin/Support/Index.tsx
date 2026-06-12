import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Search, LifeBuoy, AlertCircle, Clock, CheckCircle, Mail, Phone, Calendar, User } from 'lucide-react';

interface Student {
    id: number;
    student_id_number: string;
    name: string;
    email: string;
    phone: string | null;
}

interface Ticket {
    id: number;
    student_id: number;
    subject: string;
    category: 'academic' | 'financial' | 'technical' | 'other';
    message: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    admin_response: string | null;
    created_at: string;
    resolved_at: string | null;
    student: Student;
}

interface PaginatedTickets {
    data: Ticket[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    tickets: PaginatedTickets;
    filters: {
        search?: string;
        category?: string;
        status?: string;
    };
}

export default function SupportIndex({ tickets, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [status, setStatus] = useState(filters.status || '');
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(
        tickets.data.length > 0 ? tickets.data[0] : null
    );

    const form = useForm({
        admin_response: '',
    });

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.support-tickets.index'), { search, category, status }, { preserveState: true });
    };

    const handleFilterChange = (newCategory?: string, newStatus?: string) => {
        const cat = newCategory !== undefined ? newCategory : category;
        const stat = newStatus !== undefined ? newStatus : status;
        setCategory(cat);
        setStatus(stat);
        router.get(route('admin.support-tickets.index'), { search, category: cat, status: stat }, { preserveState: true });
    };

    const handleResolve = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket) return;

        form.post(route('admin.support-tickets.resolve', selectedTicket.id), {
            onSuccess: () => {
                form.reset();
                // Update local selected ticket
                const updated = {
                    ...selectedTicket,
                    status: 'resolved' as const,
                    admin_response: form.data.admin_response,
                    resolved_at: new Date().toISOString(),
                };
                setSelectedTicket(updated);
            }
        });
    };

    const getStatusBadgeColor = (status: Ticket['status']) => {
        switch (status) {
            case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'resolved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'closed': return 'bg-stone-100 text-stone-800 border-stone-200';
        }
    };

    const getCategoryLabel = (category: Ticket['category']) => {
        const categories: Record<string, string> = {
            academic: 'Academic',
            financial: 'Financial',
            technical: 'Technical Support',
            other: 'Other Support',
        };
        return categories[category] || category;
    };

    return (
        <AdminLayout
            title="Student Support Resolver"
            breadcrumbs={[{ label: 'Support Center' }]}
        >
            <Head title="Student Support Resolver — Admin Panel" />

            <div className="px-6 pb-6">
                {/* Search & Filters */}
                <Card className="mb-6">
                    <CardBody className="p-4">
                        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-4">
                            <div className="relative flex-1 min-w-[240px]">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400">
                                    <Search size={16} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by subject, message, student name or ID..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                                />
                            </div>

                            <select
                                value={category}
                                onChange={(e) => handleFilterChange(e.target.value, undefined)}
                                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-hidden"
                            >
                                <option value="">All Categories</option>
                                <option value="academic">Academic</option>
                                <option value="financial">Financial</option>
                                <option value="technical">Technical</option>
                                <option value="other">Other</option>
                            </select>

                            <select
                                value={status}
                                onChange={(e) => handleFilterChange(undefined, e.target.value)}
                                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-hidden"
                            >
                                <option value="">All Statuses</option>
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>

                            <Button type="submit" variant="outline" className="px-4 py-2 text-sm">
                                Filter
                            </Button>
                        </form>
                    </CardBody>
                </Card>

                {/* Main Console Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Pane: Ticket List */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        <h2 className="text-stone-700 font-bold text-sm uppercase tracking-wider pl-1">
                            Tickets ({tickets.total})
                        </h2>

                        {tickets.data.length === 0 ? (
                            <Card className="bg-stone-50 border border-dashed border-stone-200">
                                <CardBody className="p-8 text-center text-stone-500">
                                    <LifeBuoy size={40} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No support tickets found matching the filters.</p>
                                </CardBody>
                            </Card>
                        ) : (
                            <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                                {tickets.data.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        onClick={() => setSelectedTicket(ticket)}
                                        className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                                            selectedTicket?.id === ticket.id
                                                ? 'bg-emerald-50/50 border-emerald-500 shadow-xs'
                                                : 'bg-white border-stone-200 hover:border-stone-300'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[0.6875rem] px-2 py-0.5 border rounded-full font-semibold uppercase ${getStatusBadgeColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                            <span className="text-[0.7rem] text-stone-400">
                                                {new Date(ticket.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-stone-800 text-sm mb-1 truncate">
                                            {ticket.subject}
                                        </h3>
                                        <div className="flex items-center justify-between text-xs text-stone-500">
                                            <span>👤 {ticket.student.name}</span>
                                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium text-[0.7rem]">
                                                {getCategoryLabel(ticket.category)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination Links */}
                        {tickets.last_page > 1 && (
                            <div className="flex gap-1 justify-center mt-2">
                                {tickets.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => {
                                            if (link.url) router.get(link.url, {}, { preserveState: true });
                                        }}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className="h-8 text-xs"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Pane: Selected Ticket Workspace */}
                    <div className="lg:col-span-7">
                        {selectedTicket ? (
                            <Card className="border border-stone-200">
                                <CardBody className="p-6">
                                    {/* Student Header details */}
                                    <div className="flex items-center gap-4 pb-4 border-b border-stone-100 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-lg shadow-inner">
                                            {selectedTicket.student.name[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                                                {selectedTicket.student.name}
                                                <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-stone-100 text-stone-600 rounded">
                                                    {selectedTicket.student.student_id_number}
                                                </span>
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Mail size={12} /> {selectedTicket.student.email}
                                                </span>
                                                {selectedTicket.student.phone && (
                                                    <span className="flex items-center gap-1">
                                                        <Phone size={12} /> {selectedTicket.student.phone}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ticket Details */}
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <div className="text-[0.7rem] text-stone-400 uppercase tracking-wider font-bold mb-1">
                                                Subject
                                            </div>
                                            <h4 className="font-bold text-stone-900 text-lg">
                                                {selectedTicket.subject}
                                            </h4>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 bg-stone-50 p-3 rounded-lg border border-stone-100">
                                            <div>
                                                <span className="text-[0.7rem] text-stone-400 block">Category</span>
                                                <span className="text-xs font-semibold text-stone-700">
                                                    {getCategoryLabel(selectedTicket.category)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[0.7rem] text-stone-400 block">Submitted At</span>
                                                <span className="text-xs font-semibold text-stone-700 flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(selectedTicket.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs">
                                            <div className="text-[0.7rem] text-stone-400 uppercase tracking-wider font-bold mb-2">
                                                Student Message
                                            </div>
                                            <p className="text-stone-800 text-sm leading-relaxed whitespace-pre-wrap">
                                                {selectedTicket.message}
                                            </p>
                                        </div>

                                        {/* Administrator Response Section */}
                                        {selectedTicket.admin_response ? (
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-2">
                                                <div className="text-[0.7rem] text-emerald-800 uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
                                                    <CheckCircle size={14} className="text-emerald-600" />
                                                    Administrator Response
                                                </div>
                                                <p className="text-emerald-900 text-sm leading-relaxed whitespace-pre-wrap">
                                                    {selectedTicket.admin_response}
                                                </p>
                                                {selectedTicket.resolved_at && (
                                                    <div className="text-[0.65rem] text-emerald-600 mt-3 text-right">
                                                        Resolved at: {new Date(selectedTicket.resolved_at).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="border border-dashed border-stone-300 rounded-xl p-4 bg-stone-50/50 mt-2">
                                                <div className="text-[0.7rem] text-stone-500 uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
                                                    <Clock size={14} className="text-stone-400" />
                                                    Resolution Form
                                                </div>

                                                <form onSubmit={handleResolve} className="flex flex-col gap-3">
                                                    <textarea
                                                        rows={4}
                                                        value={form.data.admin_response}
                                                        onChange={(e) => form.setData('admin_response', e.target.value)}
                                                        placeholder="Type your official administrative resolution or instructions for the student here..."
                                                        className="w-full p-3 border border-stone-200 rounded-lg text-sm bg-white focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                                                    />
                                                    {form.errors.admin_response && (
                                                        <span className="text-xs text-red-500">{form.errors.admin_response}</span>
                                                    )}

                                                    <div className="flex justify-end gap-2 mt-1">
                                                        <Button
                                                            type="submit"
                                                            disabled={form.processing}
                                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 text-xs h-9"
                                                        >
                                                            {form.processing ? 'Resolving...' : 'Submit Resolution'}
                                                        </Button>
                                                    </div>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        ) : (
                            <Card className="border border-stone-200 bg-stone-50 border-dashed">
                                <CardBody className="p-16 text-center text-stone-500">
                                    <LifeBuoy size={48} className="mx-auto mb-3 opacity-30" />
                                    <h3 className="font-bold text-stone-700 text-lg mb-1">No Ticket Selected</h3>
                                    <p className="text-sm">Click on any ticket in the left list pane to resolve it.</p>
                                </CardBody>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
