import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import StudentLayout from '@/Layouts/StudentLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { FileText, Download, Upload, CreditCard, Clock, CheckCircle2, AlertCircle, Eye, ShieldAlert } from 'lucide-react';

interface Invoice {
    id: number;
    invoice_number: string;
    title: string;
    title_ur: string | null;
    amount: number;
    due_date: string;
    paid_at: string | null;
    payment_method: string | null;
    status: 'unpaid' | 'paid' | 'pending' | 'overdue';
    receipt_url: string | null;
    admin_notes: string | null;
}

interface Props {
    invoices: Invoice[];
}

export default function InvoicesIndex({ invoices }: Props) {
    const { props } = usePage();
    const isUrdu = props.locale === 'ur';
    const [selectedTab, setSelectedTab] = useState<'all' | 'unpaid' | 'pending' | 'paid'>('all');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const form = useForm({
        receipt: null as File | null,
        payment_method: 'bank_transfer',
    });

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInvoice) return;

        form.post(route('student.invoices.receipt', selectedInvoice.id), {
            onSuccess: () => {
                form.reset();
                setSelectedInvoice(null);
            }
        });
    };

    const getStatusLabel = (status: Invoice['status']) => {
        const labels: Record<string, string> = {
            unpaid: isUrdu ? 'غیر ادا شدہ' : 'Unpaid',
            paid: isUrdu ? 'ادا شدہ' : 'Paid',
            pending: isUrdu ? 'تصدیق کے عمل میں' : 'Pending Approval',
            overdue: isUrdu ? 'تاخیر شدہ' : 'Overdue',
        };
        return labels[status] || status;
    };

    const getStatusColor = (status: Invoice['status']) => {
        switch (status) {
            case 'paid': return '#10b981';
            case 'pending': return '#f59e0b';
            case 'unpaid': return '#3b82f6';
            case 'overdue': return '#ef4444';
        }
    };

    const filteredInvoices = invoices.filter(inv => {
        if (selectedTab === 'all') return true;
        if (selectedTab === 'unpaid') return inv.status === 'unpaid' || inv.status === 'overdue';
        return inv.status === selectedTab;
    });

    const getPaymentMethodLabel = (method: string | null) => {
        if (!method) return '—';
        const methods: Record<string, string> = {
            bank_transfer: isUrdu ? 'بینک ٹرانسفر' : 'Bank Transfer',
            easy_paisa: isUrdu ? 'ایزی پیسہ' : 'EasyPaisa',
            jazz_cash: isUrdu ? 'جاز کیش' : 'JazzCash',
            other: isUrdu ? 'دیگر' : 'Other',
        };
        return methods[method] || method;
    };

    return (
        <StudentLayout title={isUrdu ? 'فیس اور ادائیگیوں کا ریکارڈ' : 'Fee Invoices & Payments'}>
            <Head title={isUrdu ? 'فیس پورٹل — طالب علم پورٹل' : 'Fee Invoices — Student Portal'} />

            <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* Hero Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #113969 0%, #1e6b3e 100%)',
                    borderRadius: 16,
                    padding: '24px 28px',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 20,
                    border: '2px solid #d4af37'
                }}>
                    <div>
                        <span style={{ fontSize: 24 }}>💳</span>
                        <h1 style={{ margin: '4px 0 2px', fontSize: '1.625rem', fontWeight: 800 }}>
                            {isUrdu ? 'فیسوں اور مالیات کا ریکارڈ' : 'Academic Fee Ledgers'}
                        </h1>
                        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>
                            {isUrdu 
                                ? 'اپنے تعلیمی اخراجات کی تفصیلات دیکھیں، فیس سلپ ڈاؤن لوڈ کریں اور رسید اپ لوڈ کریں۔' 
                                : 'Track invoices, submit proof of payments, and download official receipts.'
                            }
                        </p>
                    </div>

                    <div style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: 12,
                        padding: '12px 20px',
                        textAlign: 'center',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.04em' }}>
                            {isUrdu ? 'کل غیر ادا شدہ رقم' : 'Outstanding Balance'}
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#d4af37' }}>
                            PKR {invoices.reduce((acc, inv) => inv.status === 'unpaid' || inv.status === 'overdue' ? acc + inv.amount : acc, 0).toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                    {(['all', 'unpaid', 'pending', 'paid'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setSelectedTab(tab)}
                            style={{
                                padding: '10px 18px',
                                borderRadius: 8,
                                border: 'none',
                                background: selectedTab === tab ? '#113969' : 'transparent',
                                color: selectedTab === tab ? 'white' : 'var(--text-secondary)',
                                fontWeight: selectedTab === tab ? 700 : 500,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: selectedTab === tab ? '0 4px 12px rgba(17,57,105,0.2)' : 'none'
                            }}
                        >
                            {tab === 'all' && (isUrdu ? 'تمام سلپس' : 'All Invoices')}
                            {tab === 'unpaid' && (isUrdu ? 'غیر ادا شدہ' : 'Unpaid')}
                            {tab === 'pending' && (isUrdu ? 'تصدیق طلب' : 'Pending')}
                            {tab === 'paid' && (isUrdu ? 'ادا شدہ' : 'Paid')}
                        </button>
                    ))}
                </div>

                {/* Invoices List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {filteredInvoices.length === 0 ? (
                        <Card style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                            <CardBody style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                                <FileText size={48} style={{ opacity: 0.4, margin: '0 auto 12px' }} />
                                <div>{isUrdu ? 'اس زمرے میں کوئی فیس سلپ نہیں پائی گئی۔' : 'No invoices found in this category.'}</div>
                            </CardBody>
                        </Card>
                    ) : (
                        filteredInvoices.map(inv => (
                            <Card key={inv.id} style={{
                                background: 'var(--surface-2)',
                                border: '1px solid var(--border)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {/* Top status line indicator */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: 4,
                                    background: getStatusColor(inv.status)
                                }} />

                                <CardBody style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                            <span style={{
                                                fontSize: '0.65rem',
                                                padding: '2px 8px',
                                                borderRadius: 6,
                                                fontWeight: 700,
                                                background: 'var(--surface-3)',
                                                color: 'var(--text-secondary)'
                                            }}>
                                                {inv.invoice_number}
                                            </span>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                padding: '2px 8px',
                                                borderRadius: 20,
                                                fontWeight: 700,
                                                background: getStatusColor(inv.status) + '15',
                                                color: getStatusColor(inv.status),
                                                textTransform: 'uppercase'
                                            }}>
                                                {getStatusLabel(inv.status)}
                                            </span>
                                        </div>

                                        <h3 style={{ margin: '8px 0 4px', fontSize: '1.05rem', fontWeight: 700 }}>
                                            {isUrdu && inv.title_ur ? inv.title_ur : inv.title}
                                        </h3>
                                        
                                        <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                                            <span>📅 {isUrdu ? 'آخری تاریخ:' : 'Due:'} {inv.due_date}</span>
                                            {inv.paid_at && <span>✅ {isUrdu ? 'ادائیگی:' : 'Paid:'} {inv.paid_at.split(' ')[0]} via {getPaymentMethodLabel(inv.payment_method)}</span>}
                                        </div>

                                        {inv.admin_notes && (
                                            <p style={{ margin: '8px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                                📝 {inv.admin_notes}
                                            </p>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        {/* Amount Block */}
                                        <div style={{ textAlign: 'right', minWidth: 100 }}>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                                PKR {inv.amount.toLocaleString()}
                                            </div>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                                {isUrdu ? 'کل واجب الادا رقم' : 'Amount Billed'}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <a 
                                                href={route('student.invoices.download', inv.id)} 
                                                className="inline-flex items-center justify-center p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                                                title={isUrdu ? 'سلپ ڈاؤن لوڈ کریں' : 'Download Invoice'}
                                                style={{ border: '1px solid var(--border)', padding: 8, borderRadius: 8, color: 'var(--text-primary)', background: 'var(--surface-3)' }}
                                            >
                                                <Download size={16} />
                                            </a>

                                            {(inv.status === 'unpaid' || inv.status === 'overdue') && (
                                                <button
                                                    onClick={() => setSelectedInvoice(inv)}
                                                    style={{
                                                        background: '#1e6b3e',
                                                        border: 'none',
                                                        color: 'white',
                                                        padding: '8px 14px',
                                                        borderRadius: 8,
                                                        fontSize: '0.8rem',
                                                        fontWeight: 700,
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 6
                                                    }}
                                                >
                                                    <Upload size={14} />
                                                    {isUrdu ? 'رسید اپ لوڈ کریں' : 'Upload Receipt'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))
                    )}
                </div>

                {/* Upload Receipt Modal */}
                <AnimatePresence>
                    {selectedInvoice && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 100,
                            padding: 16
                        }}>
                            <motion.div 
                                initial={{ scale: 0.95, opacity: 0 }} 
                                animate={{ scale: 1, opacity: 1 }} 
                                exit={{ scale: 0.95, opacity: 0 }}
                                style={{
                                    background: 'var(--surface-2)',
                                    border: '2px solid #d4af37',
                                    borderRadius: 16,
                                    maxWidth: 500,
                                    width: '100%',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{ background: '#113969', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem' }}>
                                        {isUrdu ? 'ادائیگی کی رسید جمع کریں' : 'Submit Payment Proof'}
                                    </h3>
                                    <button 
                                        onClick={() => setSelectedInvoice(null)} 
                                        style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.25rem', cursor: 'pointer' }}
                                    >
                                        &times;
                                    </button>
                                </div>

                                <form onSubmit={handleUploadSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: 10 }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isUrdu ? 'سلپ نمبر اور رقم' : 'Invoice & Amount'}</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                                            {selectedInvoice.invoice_number} · PKR {selectedInvoice.amount.toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                                            {isUrdu && selectedInvoice.title_ur ? selectedInvoice.title_ur : selectedInvoice.title}
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                                            {isUrdu ? 'ادائیگی کا ذریعہ' : 'Payment Method'}
                                        </label>
                                        <select 
                                            value={form.data.payment_method} 
                                            onChange={e => form.setData('payment_method', e.target.value)}
                                            style={{
                                                padding: '8px 12px',
                                                background: 'var(--surface-1)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 6,
                                                color: 'var(--text-primary)',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <option value="bank_transfer">{isUrdu ? 'بینک ٹرانسفر (حبیب بینک / الائیڈ بینک)' : 'Bank Transfer'}</option>
                                            <option value="easy_paisa">{isUrdu ? 'ایزی پیسہ (EasyPaisa)' : 'EasyPaisa'}</option>
                                            <option value="jazz_cash">{isUrdu ? 'جاز کیش (JazzCash)' : 'JazzCash'}</option>
                                            <option value="other">{isUrdu ? 'دیگر طریقے' : 'Other'}</option>
                                        </select>
                                    </div>

                                    {/* File Input */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                                            {isUrdu ? 'رسید فائل (تصویر یا PDF)' : 'Receipt File (Image or PDF)'}
                                        </label>
                                        <input 
                                            type="file" 
                                            accept="image/*,.pdf"
                                            onChange={e => form.setData('receipt', e.target.files?.[0] || null)}
                                            style={{
                                                padding: '8px 12px',
                                                background: 'var(--surface-1)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 6,
                                                color: 'var(--text-primary)',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                            {isUrdu ? 'زیادہ سے زیادہ سائز: 5MB۔ صرف تصاویر اور پی ڈی ایف فائلز قبول ہیں۔' : 'Max size: 5MB. Formats: JPEG, PNG, PDF'}
                                        </span>
                                        {form.errors.receipt && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{form.errors.receipt}</span>}
                                    </div>

                                    {/* Info/Warning note */}
                                    <div style={{
                                        display: 'flex',
                                        gap: 8,
                                        background: '#fffbeb',
                                        border: '1px solid #fde68a',
                                        padding: '10px 14px',
                                        borderRadius: 8,
                                        fontSize: '0.75rem',
                                        color: '#78350f'
                                    }}>
                                        <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                                        <div>
                                            <strong>{isUrdu ? 'اہم نوٹ:' : 'Notice:'}</strong>
                                            <p style={{ margin: '2px 0 0', lineHeight: 1.4 }}>
                                                {isUrdu 
                                                    ? 'رسید اپ لوڈ کرنے کے بعد، محاسب (Accountant) آپ کی ادائیگی کی تصدیق کرے گا جس میں 24 سے 48 گھنٹے لگ سکتے ہیں۔' 
                                                    : 'Upon submission, the accounts officer will verify the transaction. Status will update once approved.'
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                                        <Button type="button" variant="outline" onClick={() => setSelectedInvoice(null)}>
                                            {isUrdu ? 'منسوخ' : 'Cancel'}
                                        </Button>
                                        <Button type="submit" disabled={form.processing} style={{ background: '#1e6b3e', color: 'white' }}>
                                            {form.processing ? '...' : (isUrdu ? 'رسید جمع کریں' : 'Submit Receipt')}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </StudentLayout>
    );
}
