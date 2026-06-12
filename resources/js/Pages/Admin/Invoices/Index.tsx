import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Search, Plus, Check, X, FileText, Download, Eye, DollarSign, Receipt, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Student {
    id: number;
    student_id_number: string;
    name: string;
}

interface Invoice {
    id: number;
    invoice_number: string;
    student_id: number;
    title: string;
    title_ur: string | null;
    amount: number;
    due_date: string;
    paid_at: string | null;
    payment_method: string | null;
    status: 'unpaid' | 'paid' | 'pending' | 'overdue';
    receipt_path: string | null;
    admin_notes: string | null;
    student: {
        id: number;
        student_id_number: string;
        name: string;
    };
}

interface PaginatedInvoices {
    data: Invoice[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    invoices: PaginatedInvoices;
    students: Student[];
    filters: {
        search?: string;
        status?: string;
    };
}

export default function InvoicesIndex({ invoices, students, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(false);

    // Create Invoice Form
    const createForm = useForm({
        student_id: '',
        title: '',
        title_ur: '',
        amount: '',
        due_date: '',
    });

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.invoices.index'), { search, status }, { preserveState: true });
    };

    const handleStatusFilterChange = (newStatus: string) => {
        setStatus(newStatus);
        router.get(route('admin.invoices.index'), { search, status: newStatus }, { preserveState: true });
    };

    const handleCreateInvoice = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('admin.invoices.store'), {
            onSuccess: () => {
                createForm.reset();
                setShowCreateModal(false);
            }
        });
    };

    const handleApprovePayment = (id: number) => {
        router.post(route('admin.invoices.approve', id), {}, {
            onSuccess: () => {
                setSelectedInvoice(null);
            }
        });
    };

    const handleRejectPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInvoice) return;

        router.post(route('admin.invoices.reject', selectedInvoice.id), {
            reason: rejectReason
        }, {
            onSuccess: () => {
                setRejectReason('');
                setShowRejectForm(false);
                setSelectedInvoice(null);
            }
        });
    };

    const getStatusBadgeColor = (status: Invoice['status']) => {
        switch (status) {
            case 'paid': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'unpaid': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
        }
    };

    const getPaymentMethodLabel = (method: string | null) => {
        if (!method) return '—';
        const methods: Record<string, string> = {
            bank_transfer: 'Bank Transfer',
            easy_paisa: 'EasyPaisa',
            jazz_cash: 'JazzCash',
            other: 'Other',
        };
        return methods[method] || method;
    };

    return (
        <AdminLayout
            title="Fee Invoices & Payments"
            breadcrumbs={[{ label: 'Finance' }, { label: 'Invoices' }]}
            headerAction={
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4 flex items-center gap-2"
                >
                    <Plus size={14} />
                    Issue New Invoice
                </Button>
            }
        >
            <Head title="Fee Invoices & Payments — Admin Panel" />

            <div className="px-6 pb-6">
                {/* Search & Filter Options */}
                <Card className="mb-6">
                    <CardBody className="p-4">
                        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-4">
                            <div className="relative flex-1 min-w-[240px]">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-stone-400">
                                    <Search size={16} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by invoice number, fee title, student name or ID..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                                />
                            </div>

                            <select
                                value={status}
                                onChange={(e) => handleStatusFilterChange(e.target.value)}
                                className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-hidden"
                            >
                                <option value="">All Statuses</option>
                                <option value="unpaid">Unpaid</option>
                                <option value="pending">Pending Approval</option>
                                <option value="paid">Paid</option>
                                <option value="overdue">Overdue</option>
                            </select>

                            <Button type="submit" variant="outline" className="px-4 py-2 text-sm">
                                Filter
                            </Button>
                        </form>
                    </CardBody>
                </Card>

                {/* Invoices List Table */}
                <Card>
                    <CardBody className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-stone-600 border-collapse">
                                <thead className="bg-stone-50 text-stone-700 font-semibold text-xs border-b border-stone-200 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Invoice No</th>
                                        <th className="px-6 py-4">Student</th>
                                        <th className="px-6 py-4">Fee Title</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                        <th className="px-6 py-4">Due Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-center">Receipt Proof</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-8 text-center text-stone-400">
                                                No invoice records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        invoices.data.map((inv) => (
                                            <tr key={inv.id} className="border-b border-stone-100 hover:bg-stone-50/50">
                                                <td className="px-6 py-4 font-mono font-bold text-xs text-stone-900">
                                                    {inv.invoice_number}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-stone-900">{inv.student.name}</div>
                                                    <div className="text-xs text-stone-400">{inv.student.student_id_number}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-stone-800">{inv.title}</div>
                                                    {inv.title_ur && <div className="text-xs text-stone-400">{inv.title_ur}</div>}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-stone-900">
                                                    PKR {inv.amount.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-xs font-semibold">
                                                    {inv.due_date}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 border rounded-full text-[0.7rem] uppercase font-bold ${getStatusBadgeColor(inv.status)}`}>
                                                        {inv.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {inv.receipt_path ? (
                                                        <button
                                                            onClick={() => setSelectedInvoice(inv)}
                                                            className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 border border-amber-200 rounded font-semibold transition-colors"
                                                        >
                                                            <Receipt size={12} />
                                                            Review Slip
                                                        </button>
                                                    ) : (
                                                        <span className="text-stone-400 text-xs">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <a
                                                        href={route('student.invoices.download', inv.id)}
                                                        className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 font-semibold transition-colors border border-stone-200 rounded px-2 py-1 bg-white"
                                                        title="Download Invoice PDF"
                                                    >
                                                        <Download size={12} />
                                                        PDF
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Links */}
                        {invoices.last_page > 1 && (
                            <div className="flex gap-1 justify-center py-4 border-t border-stone-100">
                                {invoices.links.map((link, i) => (
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
                    </CardBody>
                </Card>

                {/* Review Receipt Slideout / Modal */}
                {selectedInvoice && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl border border-stone-200 max-w-lg w-full overflow-hidden shadow-xl">
                            <div className="bg-stone-900 text-white px-5 py-4 flex justify-between items-center">
                                <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
                                    <Receipt size={16} className="text-amber-400" />
                                    Review Payment Proof
                                </h3>
                                <button
                                    onClick={() => {
                                        setSelectedInvoice(null);
                                        setShowRejectForm(false);
                                    }}
                                    className="text-white hover:text-stone-300 text-xl font-bold"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="p-5 flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-4 bg-stone-50 border border-stone-100 p-3 rounded-lg text-xs">
                                    <div>
                                        <span className="text-stone-400 block">Student Name</span>
                                        <span className="font-bold text-stone-800">{selectedInvoice.student.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-stone-400 block">Invoice Number</span>
                                        <span className="font-mono font-bold text-stone-800">{selectedInvoice.invoice_number}</span>
                                    </div>
                                    <div>
                                        <span className="text-stone-400 block">Amount</span>
                                        <span className="font-bold text-stone-800">PKR {selectedInvoice.amount.toLocaleString()}</span>
                                    </div>
                                    <div>
                                        <span className="text-stone-400 block">Payment Method</span>
                                        <span className="font-semibold text-stone-800">{getPaymentMethodLabel(selectedInvoice.payment_method)}</span>
                                    </div>
                                </div>

                                {/* Preview uploaded document */}
                                <div className="border border-stone-200 rounded-lg overflow-hidden bg-stone-100 p-2 text-center">
                                    {selectedInvoice.receipt_path?.endsWith('.pdf') ? (
                                        <div className="py-8 text-stone-600 flex flex-col items-center gap-2">
                                            <FileText size={48} className="text-emerald-700" />
                                            <span className="text-sm font-semibold">Uploaded PDF Document</span>
                                            <a
                                                href={`/storage/${selectedInvoice.receipt_path}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-emerald-700 underline font-semibold mt-1"
                                            >
                                                Open PDF in New Window
                                            </a>
                                        </div>
                                    ) : (
                                        <img
                                            src={`/storage/${selectedInvoice.receipt_path}`}
                                            alt="Receipt Proof"
                                            className="max-h-[300px] mx-auto object-contain rounded-md shadow-2xs"
                                        />
                                    )}
                                </div>

                                {showRejectForm ? (
                                    <form onSubmit={handleRejectPayment} className="flex flex-col gap-3 bg-red-50 p-4 border border-red-200 rounded-lg">
                                        <label className="text-xs font-bold text-red-900 flex items-center gap-1">
                                            <AlertTriangle size={14} />
                                            Reason for Rejection
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            placeholder="Explain why this receipt is invalid (e.g. Transaction reference missing, incorrect amount...)"
                                            required
                                            className="w-full p-2 border border-red-200 rounded bg-white text-xs"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowRejectForm(false)}
                                                className="h-8 text-[0.7rem]"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="destructive"
                                                size="sm"
                                                className="h-8 text-[0.7rem] bg-red-700 hover:bg-red-800 text-white font-bold"
                                            >
                                                Confirm Rejection
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex gap-3 justify-end mt-2">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => setShowRejectForm(true)}
                                            className="bg-red-50 border border-red-200 hover:bg-red-100 text-red-800 font-bold px-4 text-xs h-9"
                                        >
                                            Reject Slip
                                        </Button>

                                        <Button
                                            type="button"
                                            onClick={() => handleApprovePayment(selectedInvoice.id)}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 text-xs h-9 flex items-center gap-1.5"
                                        >
                                            <Check size={14} />
                                            Approve Payment
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Issue Invoice Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl border border-stone-200 max-w-md w-full overflow-hidden shadow-xl">
                            <div className="bg-emerald-900 text-white px-5 py-4 flex justify-between items-center border-b border-emerald-800">
                                <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
                                    <DollarSign size={16} className="text-emerald-400" />
                                    Issue Student Invoice
                                </h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-white hover:text-stone-300 text-xl font-bold"
                                >
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleCreateInvoice} className="p-5 flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-stone-700">Select Student</label>
                                    <select
                                        value={createForm.data.student_id}
                                        onChange={(e) => createForm.setData('student_id', e.target.value)}
                                        required
                                        className="w-full p-2 bg-stone-50 border border-stone-200 rounded text-sm focus:outline-hidden"
                                    >
                                        <option value="">-- Choose Active Student --</option>
                                        {students.map((student) => (
                                            <option key={student.id} value={student.id}>
                                                {student.name} ({student.student_id_number})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-stone-700">Fee Title (English)</label>
                                    <input
                                        type="text"
                                        value={createForm.data.title}
                                        onChange={(e) => createForm.setData('title', e.target.value)}
                                        placeholder="e.g. Semester 1 Tuition Fee"
                                        required
                                        className="w-full p-2 border border-stone-200 rounded text-sm bg-stone-50"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-stone-700">Fee Title (Urdu - Optional)</label>
                                    <input
                                        type="text"
                                        value={createForm.data.title_ur}
                                        onChange={(e) => createForm.setData('title_ur', e.target.value)}
                                        placeholder="مثال: تعلیمی فیس سمسٹر اول"
                                        className="w-full p-2 border border-stone-200 rounded text-sm bg-stone-50"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-stone-700">Amount (PKR)</label>
                                    <input
                                        type="number"
                                        value={createForm.data.amount}
                                        onChange={(e) => createForm.setData('amount', e.target.value)}
                                        placeholder="e.g. 5000"
                                        required
                                        min="1"
                                        className="w-full p-2 border border-stone-200 rounded text-sm bg-stone-50"
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-stone-700">Due Date</label>
                                    <input
                                        type="date"
                                        value={createForm.data.due_date}
                                        onChange={(e) => createForm.setData('due_date', e.target.value)}
                                        required
                                        className="w-full p-2 border border-stone-200 rounded text-sm bg-stone-50"
                                    />
                                </div>

                                <div className="flex gap-2 justify-end mt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowCreateModal(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={createForm.processing}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                    >
                                        Issue Invoice
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
