import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import SEOHead from '@/Components/Public/SEOHead';
import { ShieldCheck, Calendar, Award, User, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface Student {
    name: string;
    student_id_number: string;
}

interface Certificate {
    code: string;
    type: string;
    title: string;
    title_ur: string | null;
    issued_date: string;
    valid_until: string | null;
    student: Student;
}

interface Props {
    certificate: Certificate;
}

export default function CertificateVerify({ certificate }: Props) {
    const { locale } = useTranslation();
    const isUrdu = locale === 'ur';

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getCertTypeLabel = (type: string) => {
        if (!isUrdu) return type.toUpperCase() + ' CERTIFICATE';
        const types: Record<string, string> = {
            completion: 'تعلیمی تکمیل کی سند',
            hifz: 'حفظِ قرآن کریم کی سند',
            participation: 'شرکت کی سند'
        };
        return types[type] || 'سرٹیفکیٹ';
    };

    return (
        <>
            <SEOHead 
                title={`Verify Certificate — ${certificate.code}`} 
                description={`Verification status for certificate ${certificate.code} issued to ${certificate.student.name}.`}
            />

            <div style={{ maxWidth: 650, margin: '60px auto', padding: '0 24px' }}>
                <div style={{
                    background: 'var(--surface-2, #182232)',
                    border: '1px solid var(--border, rgba(255,255,255,0.06))',
                    borderRadius: 16,
                    padding: '40px 32px',
                    textAlign: 'center',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }}>
                    {/* Success Verification Shield */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        marginBottom: 24
                    }}>
                        <ShieldCheck size={48} />
                    </div>

                    <h1 style={{ margin: '0 0 6px', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {isUrdu ? 'تصدیق شدہ سرٹیفکیٹ' : 'Credential Verified'}
                    </h1>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10b981',
                        padding: '4px 12px',
                        borderRadius: 100,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        marginBottom: 32,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        <CheckCircle size={12} />
                        {isUrdu ? 'فعال اور درست' : 'Active & Verified'}
                    </div>

                    {/* Metadata Grid */}
                    <div style={{
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 18,
                        borderTop: '1px solid var(--border, rgba(255,255,255,0.06))',
                        borderBottom: '1px solid var(--border, rgba(255,255,255,0.06))',
                        padding: '24px 0',
                        marginBottom: 32
                    }}>
                        {/* Student Name */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #7c8ba1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <User size={14} /> {isUrdu ? 'طالب علم کا نام' : 'Student Name'}
                            </span>
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {certificate.student.name}
                            </span>
                        </div>

                        {/* Student ID */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #7c8ba1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Award size={14} /> {isUrdu ? 'رجسٹریشن نمبر' : 'Registration No.'}
                            </span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {certificate.student.student_id_number}
                            </span>
                        </div>

                        {/* Title of Certificate */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #7c8ba1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Award size={14} /> {isUrdu ? 'شعبہ / کورس' : 'Course/Program'}
                            </span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {certificate.title}
                            </span>
                        </div>

                        {/* Certificate Type */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #7c8ba1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Award size={14} /> {isUrdu ? 'سند کی قسم' : 'Certificate Type'}
                            </span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e6b3e' }}>
                                {getCertTypeLabel(certificate.type)}
                            </span>
                        </div>

                        {/* Issued Date */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #7c8ba1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Calendar size={14} /> {isUrdu ? 'تاریخِ جاریہ' : 'Issued Date'}
                            </span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {formatDate(certificate.issued_date)}
                            </span>
                        </div>

                        {/* Certificate Unique Code */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted, #7c8ba1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <ShieldCheck size={14} /> {isUrdu ? 'سند کا کوڈ' : 'Certificate Code'}
                            </span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                                {certificate.code}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                        <Link 
                            href="/"
                            style={{
                                padding: '10px 24px',
                                borderRadius: 100,
                                background: '#1e6b3e',
                                color: 'white',
                                fontWeight: 700,
                                textDecoration: 'none',
                                fontSize: '0.875rem'
                            }}
                        >
                            {isUrdu ? 'ہوم پیج پر جائیں' : 'Back to Home'}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

CertificateVerify.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
