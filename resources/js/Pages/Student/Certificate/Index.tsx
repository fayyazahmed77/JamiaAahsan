import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Award, Download, ShieldCheck, Calendar, ExternalLink } from 'lucide-react';

interface Certificate {
    id: number;
    code: string;
    type: 'completion' | 'hifz' | 'participation';
    title: string;
    title_ur: string | null;
    issued_date: string;
    pdf_path: string | null;
}

interface Props {
    certificates: Certificate[];
}

export default function StudentCertificates({ certificates }: Props) {
    const { props } = usePage();
    const isUrdu = props.locale === 'ur';

    const getCertTypeLabel = (type: Certificate['type']) => {
        if (!isUrdu) return type.toUpperCase() + ' CERTIFICATE';
        const types: Record<string, string> = {
            completion: 'تکمیلِ نصاب کی سند',
            hifz: 'تکمیلِ حفظِ قرآن کی سند',
            participation: 'شرکت کا سرٹیفکیٹ'
        };
        return types[type] || 'سرٹیفکیٹ';
    };

    const getCertTypeColor = (type: Certificate['type']) => {
        switch (type) {
            case 'hifz':
                return '#d4af37'; // gold
            case 'completion':
                return '#1e6b3e'; // green
            case 'participation':
                return '#3b82f6'; // blue
            default:
                return 'var(--text-muted)';
        }
    };

    return (
        <StudentLayout title={isUrdu ? 'اسناد و سرٹیفکیٹس' : 'My Certificates'}>
            <Head title={isUrdu ? 'میری اسناد — طالب علم پورٹل' : 'My Certificates — Student Portal'} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Header */}
                <div>
                    <h1 style={{ margin: '0 0 6px', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {isUrdu ? 'میری تعلیمی اسناد' : 'My Earned Certificates'}
                    </h1>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {isUrdu 
                            ? 'جامعہ کی طرف سے جاری کردہ تمام اسناد اور سرٹیفکیٹس کی فہرست۔' 
                            : 'View and download official credentials issued to you by the administration.'
                        }
                    </p>
                </div>

                {/* Certificates Grid */}
                {certificates.length === 0 ? (
                    <Card>
                        <CardBody className="py-16 text-center text-muted-foreground flex flex-col items-center gap-3">
                            <Award size={48} style={{ opacity: 0.5 }} />
                            <span>
                                {isUrdu 
                                    ? 'فی الحال آپ کے لیے کوئی تعلیمی سند جاری نہیں کی گئی ہے۔' 
                                    : 'You have not been issued any certificates yet.'
                                }
                            </span>
                        </CardBody>
                    </Card>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: 20
                    }}>
                        {certificates.map((cert) => (
                            <Card 
                                key={cert.id}
                                style={{
                                    border: `1px solid var(--border)`,
                                    background: 'var(--surface-2)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                                }}
                                className="cert-card"
                            >
                                <CardBody style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {/* Icon & Type Badge */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{
                                            width: 42,
                                            height: 42,
                                            borderRadius: 10,
                                            background: 'rgba(30,107,62,0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: getCertTypeColor(cert.type)
                                        }}>
                                            <Award size={22} />
                                        </div>
                                        <span style={{
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                            color: getCertTypeColor(cert.type),
                                            letterSpacing: '0.05em'
                                        }}>
                                            {getCertTypeLabel(cert.type)}
                                        </span>
                                    </div>

                                    {/* Title details */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        <h2 style={{
                                            margin: 0,
                                            fontSize: '1.125rem',
                                            fontWeight: 700,
                                            color: 'var(--text-primary)',
                                            fontFamily: isUrdu && cert.title_ur ? "'Noto Nastaliq Urdu', serif" : 'inherit',
                                            textAlign: isUrdu && cert.title_ur ? 'right' : 'left'
                                        }}>
                                            {isUrdu && cert.title_ur ? cert.title_ur : cert.title}
                                        </h2>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Calendar size={12} />
                                            {isUrdu ? 'تاریخِ جاریہ: ' : 'Issued on '}
                                            {new Date(cert.issued_date).toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US')}
                                        </span>
                                    </div>

                                    {/* Code badge */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        background: 'var(--surface-3)',
                                        padding: '8px 12px',
                                        borderRadius: 8,
                                        fontSize: '0.75rem',
                                        border: '1px solid var(--border)'
                                    }}>
                                        <ShieldCheck size={14} style={{ color: '#10b981' }} />
                                        <span style={{ color: 'var(--text-muted)' }}>{isUrdu ? 'تصدیقی کوڈ:' : 'Verification ID:'}</span>
                                        <strong style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-primary)', marginLeft: 'auto' }}>
                                            {cert.code}
                                        </strong>
                                    </div>

                                    {/* Action buttons */}
                                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                                        <a 
                                            href={`/student/certificates/${cert.id}/download`}
                                            style={{
                                                flex: 1,
                                                padding: '10px 14px',
                                                borderRadius: 8,
                                                background: '#1e6b3e',
                                                color: 'white',
                                                fontWeight: 700,
                                                textDecoration: 'none',
                                                textAlign: 'center',
                                                fontSize: '0.8rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 6
                                            }}
                                        >
                                            <Download size={14} />
                                            {isUrdu ? 'ڈاؤن لوڈ سند' : 'Download PDF'}
                                        </a>
                                        <a 
                                            href={route('certificate.verify', cert.code)}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                                padding: '10px 14px',
                                                borderRadius: 8,
                                                background: 'transparent',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-primary)',
                                                textDecoration: 'none',
                                                fontSize: '0.8rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            title={isUrdu ? 'آن لائن تصدیق' : 'Verify Online'}
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .cert-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.06) !important;
                    border-color: rgba(30,107,62,0.2) !important;
                }
            `}</style>
        </StudentLayout>
    );
}
