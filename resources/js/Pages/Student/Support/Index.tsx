import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import StudentLayout from '@/Layouts/StudentLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { HelpCircle, MessageSquarePlus, LifeBuoy, FileText, CheckCircle, Clock } from 'lucide-react';

interface Ticket {
    id: number;
    subject: string;
    category: 'academic' | 'financial' | 'technical' | 'other';
    message: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    admin_response: string | null;
    created_at: string;
    resolved_at: string | null;
}

interface Props {
    tickets: Ticket[];
}

export default function SupportIndex({ tickets }: Props) {
    const { props } = usePage();
    const isUrdu = props.locale === 'ur';
    const [showCreateForm, setShowCreateForm] = useState(false);

    const form = useForm({
        subject: '',
        category: 'academic' as Ticket['category'],
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('student.support.store'), {
            onSuccess: () => {
                form.reset();
                setShowCreateForm(false);
            }
        });
    };

    const getStatusLabel = (status: Ticket['status']) => {
        const labels: Record<string, string> = {
            open: isUrdu ? 'کھلا ہے' : 'Open',
            in_progress: isUrdu ? 'جاری ہے' : 'In Progress',
            resolved: isUrdu ? 'حل شدہ' : 'Resolved',
            closed: isUrdu ? 'بند ہے' : 'Closed',
        };
        return labels[status] || status;
    };

    const getStatusColor = (status: Ticket['status']) => {
        switch (status) {
            case 'open': return '#3b82f6';
            case 'in_progress': return '#f59e0b';
            case 'resolved': return '#10b981';
            case 'closed': return 'var(--text-muted)';
        }
    };

    const getCategoryLabel = (category: Ticket['category']) => {
        const labels: Record<string, string> = {
            academic: isUrdu ? 'تعلیمی امور' : 'Academic',
            financial: isUrdu ? 'مالیاتی امور' : 'Financial',
            technical: isUrdu ? 'تکنیکی مسائل' : 'Technical Support',
            other: isUrdu ? 'دیگر امور' : 'Other Support',
        };
        return labels[category] || category;
    };

    return (
        <StudentLayout title={isUrdu ? 'سپورٹ سینٹر' : 'Support Center'}>
            <Head title={isUrdu ? 'مدد و سپورٹ — طالب علم پورٹل' : 'Support Center — Student Portal'} />

            <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
                    <div>
                        <h1 style={{ margin: '0 0 4px', fontSize: '1.625rem', fontWeight: 800 }}>
                            {isUrdu ? 'مدد و سپورٹ سینٹر' : 'Student Support Center'}
                        </h1>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {isUrdu 
                                ? 'اپنے تعلیمی، مالی یا تکنیکی مسائل کے لیے نیا ٹکٹ بنائیں اور ان کا حل دیکھیں۔' 
                                : 'Submit support requests, ask questions, and track answers.'
                            }
                        </p>
                    </div>

                    <button 
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        style={{
                            background: '#1e6b3e',
                            border: 'none',
                            color: 'white',
                            padding: '10px 16px',
                            borderRadius: 8,
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        }}
                    >
                        <MessageSquarePlus size={16} />
                        {isUrdu ? 'نیا ٹکٹ بنائیں' : 'Create Support Ticket'}
                    </button>
                </div>

                {/* Create Ticket Form */}
                <AnimatePresence>
                    {showCreateForm && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                            <Card style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                                <CardBody style={{ padding: 24 }}>
                                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 16px', color: '#1e6b3e' }}>
                                        {isUrdu ? 'نیا سپورٹ ٹکٹ درج کریں' : 'New Support Request'}
                                    </h2>

                                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <label style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{isUrdu ? 'ٹکٹ کا عنوان' : 'Ticket Subject'}</label>
                                            <input 
                                                type="text" 
                                                value={form.data.subject} 
                                                onChange={e => form.setData('subject', e.target.value)}
                                                placeholder={isUrdu ? 'ٹکٹ کا عنوان لکھیں...' : 'e.g. Need correction in father name spelling'}
                                                style={{
                                                    padding: '8px 12px',
                                                    background: 'var(--surface-1)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: 6,
                                                    color: 'var(--text-primary)',
                                                    fontSize: '0.875rem'
                                                }}
                                            />
                                            {form.errors.subject && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{form.errors.subject}</span>}
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <label style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{isUrdu ? 'مسئلہ کا زمرہ' : 'Category'}</label>
                                            <select 
                                                value={form.data.category} 
                                                onChange={e => form.setData('category', e.target.value as any)}
                                                style={{
                                                    padding: '8px 12px',
                                                    background: 'var(--surface-1)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: 6,
                                                    color: 'var(--text-primary)',
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                <option value="academic">{isUrdu ? 'تعلیمی مسائل' : 'Academic Issues'}</option>
                                                <option value="financial">{isUrdu ? 'مالیاتی مسائل' : 'Financial / Fee Issues'}</option>
                                                <option value="technical">{isUrdu ? 'تکنیکی مسائل' : 'Technical / Login Issues'}</option>
                                                <option value="other">{isUrdu ? 'دیگر مسائل' : 'Other General Issues'}</option>
                                            </select>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <label style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{isUrdu ? 'تفصیلی پیغام' : 'Detailed Message'}</label>
                                            <textarea 
                                                rows={4}
                                                value={form.data.message} 
                                                onChange={e => form.setData('message', e.target.value)}
                                                placeholder={isUrdu ? 'اپنا مسئلہ تفصیل سے لکھیں...' : 'Explain your issue or question in detail...'}
                                                style={{
                                                    padding: '8px 12px',
                                                    background: 'var(--surface-1)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: 6,
                                                    color: 'var(--text-primary)',
                                                    fontSize: '0.875rem',
                                                    fontFamily: 'inherit',
                                                    resize: 'vertical'
                                                }}
                                            />
                                            {form.errors.message && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{form.errors.message}</span>}
                                        </div>

                                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
                                            <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                                                {isUrdu ? 'منسوخ' : 'Cancel'}
                                            </Button>
                                            <Button type="submit" disabled={form.processing} style={{ background: '#1e6b3e', color: 'white' }}>
                                                {form.processing ? '...' : (isUrdu ? 'ٹکٹ جمع کریں' : 'Submit Ticket')}
                                            </Button>
                                        </div>
                                    </form>
                                </CardBody>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tickets History List */}
                {tickets.length === 0 ? (
                    <Card style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                        <CardBody style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                            <LifeBuoy size={48} style={{ opacity: 0.4, margin: '0 auto 12px' }} />
                            <div>{isUrdu ? 'آپ کے پاس فی الحال کوئی سپورٹ ٹکٹ نہیں ہے۔' : 'No support requests submitted.'}</div>
                        </CardBody>
                    </Card>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {tickets.map(ticket => (
                            <Card key={ticket.id} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                                <CardBody style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{
                                                fontSize: '0.65rem',
                                                padding: '2px 8px',
                                                borderRadius: 6,
                                                fontWeight: 700,
                                                background: 'var(--surface-3)',
                                                color: 'var(--text-secondary)'
                                            }}>
                                                {getCategoryLabel(ticket.category)}
                                            </span>
                                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{ticket.subject}</h3>
                                        </div>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            padding: '3px 10px',
                                            borderRadius: 20,
                                            fontWeight: 700,
                                            background: getStatusColor(ticket.status) + '18',
                                            color: getStatusColor(ticket.status),
                                            textTransform: 'uppercase'
                                        }}>
                                            {getStatusLabel(ticket.status)}
                                        </span>
                                    </div>

                                    {/* Student message */}
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                                        {ticket.message}
                                    </p>

                                    {/* Admin Response section */}
                                    {ticket.admin_response ? (
                                        <div style={{
                                            padding: '12px 16px',
                                            background: '#f0fdf4',
                                            border: '1px solid #bbf7d0',
                                            borderRadius: 10,
                                            fontSize: '0.8rem',
                                            marginTop: 6
                                        }}>
                                            <strong style={{ color: '#065f46', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <CheckCircle size={14} />
                                                {isUrdu ? 'انتظامیہ کا جواب:' : 'Admin Response:'}
                                            </strong>
                                            <p style={{ margin: '4px 0 0', color: '#047857', lineHeight: 1.5 }}>
                                                {ticket.admin_response}
                                            </p>
                                            <div style={{ fontSize: '0.65rem', color: '#059669', marginTop: 6, textAlign: 'right' }}>
                                                Resolved on: {new Date(ticket.resolved_at!).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{
                                            padding: '10px 14px',
                                            background: 'var(--surface-3)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 10,
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            marginTop: 4
                                        }}>
                                            <Clock size={12} />
                                            {isUrdu ? 'انتظامیہ کے جواب کا انتظار ہے۔' : 'Awaiting administrator response.'}
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                        Submitted on: {new Date(ticket.created_at).toLocaleDateString()}
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}
