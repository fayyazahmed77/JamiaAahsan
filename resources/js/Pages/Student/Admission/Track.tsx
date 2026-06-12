import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import StudentLayout from '@/Layouts/StudentLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Check, ClipboardList, Info, HelpCircle, FileText } from 'lucide-react';

interface Admission {
    id: number;
    registration_no: string | null;
    is_approved: boolean;
    phone: string | null;
    guardian_name: string | null;
    dob: string | null;
    address: string | null;
    id_card_no: string | null;
    qualification: string | null;
    country: string;
    admission_type: 'online' | 'onsite';
}

interface TimelineEvent {
    id: number;
    note: string;
    created_at: string;
}

interface Student {
    id: number;
    student_id_number: string;
    name: string;
    status: string;
    student_type: 'online' | 'onsite';
    enrollment_date: string | null;
}

interface Props {
    student: Student;
    admission: Admission | null;
    timeline_events: TimelineEvent[];
}

export default function AdmissionTrack({ student, admission, timeline_events }: Props) {
    const { props } = usePage();
    const isUrdu = props.locale === 'ur';

    // Timeline progress indicators based on student status/admission
    const steps = [
        { label: isUrdu ? 'درخواست جمع کرائی گئی' : 'Application Submitted', desc: isUrdu ? 'آپ کی درخواست موصول ہوگئی ہے۔' : 'We have received your admission application.', completed: true },
        { label: isUrdu ? 'دستاویزات کا جائزہ' : 'Document Review', desc: isUrdu ? 'انتظامیہ آپ کے تعلیمی دستاویزات کی تصدیق کر رہی ہے۔' : 'The office is verifying your certificates and ID.', completed: true },
        { label: isUrdu ? 'منظوری اور داخلہ' : 'Admission Approved', desc: isUrdu ? 'داخلہ منظور کر لیا گیا ہے اور کارڈ جاری ہو گیا ہے۔' : 'Your admission has been confirmed.', completed: student.status === 'active' || (admission?.is_approved ?? false) }
    ];

    return (
        <StudentLayout title={isUrdu ? 'داخلہ ٹریک کریں' : 'Track Admission'}>
            <Head title={isUrdu ? 'داخلہ ٹریکنگ — طالب علم پورٹل' : 'Track Admission — Student Portal'} />

            <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* Header */}
                <div>
                    <h1 style={{ margin: '0 0 4px', fontSize: '1.625rem', fontWeight: 800 }}>
                        {isUrdu ? 'میرا داخلہ اور رجسٹریشن' : 'Admission Status Tracking'}
                    </h1>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {isUrdu 
                            ? 'آپ کے جامعہ داخلہ کی منظوری کے مراحل کی تازہ ترین صورتحال۔' 
                            : 'Monitor your registration status, class assignments, and timelines.'
                        }
                    </p>
                </div>

                {/* Progress Steps Timeline */}
                <Card style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                    <CardBody style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e6b3e', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ClipboardList size={18} />
                            {isUrdu ? 'داخلہ کے مراحل' : 'Admissions Steps'}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', paddingLeft: 12 }}>
                            {/* Vertical Line divider */}
                            <div style={{
                                position: 'absolute',
                                left: 24,
                                top: 12,
                                bottom: 12,
                                width: 2,
                                background: 'var(--border)'
                            }} />

                            {steps.map((step, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: 16, zIndex: 10 }}>
                                    {/* Icon circle */}
                                    <div style={{
                                        width: 26,
                                        height: 26,
                                        borderRadius: '50%',
                                        background: step.completed ? '#1e6b3e' : 'var(--surface-3)',
                                        border: `2px solid ${step.completed ? '#1e6b3e' : 'var(--border)'}`,
                                        color: step.completed ? 'white' : 'var(--text-muted)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {step.completed ? <Check size={14} /> : idx + 1}
                                    </div>
                                    {/* Descriptions */}
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: step.completed ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                            {step.label}
                                        </div>
                                        <div style={{ fontSize: '0.7875rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                                            {step.desc}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Admission log timeline history */}
                {timeline_events.length > 0 && (
                    <Card style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                        <CardBody style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e6b3e', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Info size={18} />
                                {isUrdu ? 'تاریخی لاگ ریکارڈ' : 'Timeline Audit History'}
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {timeline_events.map(event => (
                                    <div key={event.id} style={{
                                        padding: '12px 14px',
                                        background: 'var(--surface-3)',
                                        borderRadius: 8,
                                        border: '1px solid var(--border)',
                                        fontSize: '0.8125rem'
                                    }}>
                                        <div style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>
                                            {event.note}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                            {new Date(event.created_at).toLocaleString(isUrdu ? 'ur-PK' : 'en-US')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                )}
            </div>
        </StudentLayout>
    );
}
