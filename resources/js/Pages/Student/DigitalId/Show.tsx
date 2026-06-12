import React, { useState } from 'react';
import { Head, usePage, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import StudentLayout from '@/Layouts/StudentLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { ShieldCheck, Download, Printer, User, QrCode } from 'lucide-react';

interface DigitalId {
    card_number: string;
    qr_code_url: string | null;
    pdf_url: string | null;
    issued_at: string | null;
    valid_until: string | null;
    is_active: boolean;
}

interface Student {
    id: number;
    student_id_number: string;
    name: string;
    email: string;
    gender: 'male' | 'female';
    student_type: 'online' | 'onsite';
    student_type_label: string;
    status: string;
    current_year: number;
    current_semester: number;
    profile_photo_url: string | null;
    pending_profile_photo_url: string | null;
    photo_status: string;
    enrollment_date: string | null;
    program: string | null;
    program_ur: string | null;
}

interface Props {
    student: Student;
    digital_id: DigitalId | null;
}

export default function DigitalIdShow({ student, digital_id }: Props) {
    const { props } = usePage();
    const isUrdu = props.locale === 'ur';
    const [flipped, setFlipped] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        photo: null as File | null,
    });

    const handlePhotoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.photo) return;
        post('/student/profile/photo', {
            forceFormData: true,
            onSuccess: () => {
                setData('photo', null);
            }
        });
    };

    return (
        <StudentLayout title={isUrdu ? 'ڈیجیٹل شناختی کارڈ' : 'Digital ID Card'}>
            <Head title={isUrdu ? 'شناختی کارڈ — طالب علم پورٹل' : 'Digital ID — Student Portal'} />

            <div style={{ maxWidth: 650, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
                
                {/* Header overview */}
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ margin: '0 0 6px', fontSize: '1.625rem', fontWeight: 800 }}>
                        {isUrdu ? 'ڈیجیٹل اسٹوڈنٹ کارڈ' : 'Digital Student ID Card'}
                    </h1>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {isUrdu 
                            ? 'آن لائن تصدیقی کوڈ اور مہر کے ساتھ آپ کا سرکاری شناختی کارڈ۔' 
                            : 'Click card to flip. Use this card for campus entry and exam verifications.'
                        }
                    </p>
                </div>

                {/* ID Card Wrapper */}
                {digital_id ? (
                    <div 
                        onClick={() => setFlipped(!flipped)}
                        style={{
                            perspective: 1000,
                            cursor: 'pointer',
                            width: '100%',
                            maxWidth: 360,
                            height: 220,
                            position: 'relative'
                        }}
                    >
                        <motion.div
                            animate={{ rotateY: flipped ? 180 : 0 }}
                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                            style={{
                                width: '100%',
                                height: '100%',
                                transformStyle: 'preserve-3d',
                                position: 'relative'
                            }}
                        >
                            {/* FRONT SIDE */}
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backfaceVisibility: 'hidden',
                                background: 'linear-gradient(135deg, #1e6b3e 0%, #113969 100%)',
                                border: '4px solid #d4af37',
                                borderRadius: 16,
                                padding: 16,
                                color: 'white',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                                boxSizing: 'border-box'
                            }}>
                                {/* Top Header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 6 }}>
                                    <span style={{ fontSize: 20 }}>🕌</span>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em' }}>JAMIA ARABIA AHSAN UL ULOOM</div>
                                        <div style={{ fontSize: '0.55rem', opacity: 0.8, letterSpacing: '0.04em' }}>KARACHI, PAKISTAN</div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div style={{ display: 'flex', gap: 14, margin: '10px 0', alignItems: 'center' }}>
                                    {/* Photo */}
                                    <div style={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                        border: '2px solid rgba(255,255,255,0.5)',
                                        background: 'rgba(255,255,255,0.1)',
                                        flexShrink: 0
                                    }}>
                                        {student.profile_photo_url ? (
                                            <img src={student.profile_photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <User style={{ width: '100%', height: '100%', padding: 12, boxSizing: 'border-box', opacity: 0.6 }} />
                                        )}
                                    </div>

                                    {/* Student Info */}
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                            {student.name}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>
                                            ID: <strong style={{ color: '#d4af37' }}>{student.student_id_number}</strong>
                                        </div>
                                        <div style={{ fontSize: '0.65rem', opacity: 0.85, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                            {isUrdu && student.program_ur ? student.program_ur : student.program}
                                        </div>
                                        <div style={{ fontSize: '0.6rem', opacity: 0.8 }}>
                                            {student.student_type_label}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer bar */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.55rem', opacity: 0.75 }}>
                                    <span>CARD NO: {digital_id.card_number}</span>
                                    <span>VALID THRU: {digital_id.valid_until || '—'}</span>
                                </div>
                            </div>

                            {/* BACK SIDE */}
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                                background: '#113969',
                                border: '4px solid #d4af37',
                                borderRadius: 16,
                                padding: 16,
                                color: 'white',
                                display: 'flex',
                                boxSizing: 'border-box',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                            }}>
                                {/* QR Code & Terms */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#d4af37', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 4 }}>
                                        RULES & REGULATIONS
                                    </div>
                                    <ol style={{ fontSize: '0.5rem', opacity: 0.8, paddingLeft: 12, margin: 0, lineHeight: 1.4 }}>
                                        <li>This card is non-transferable and remains property of the Jamia.</li>
                                        <li>Loss must be reported immediately to the office.</li>
                                        <li>Always display card inside the campus premises.</li>
                                    </ol>
                                </div>

                                {/* QR code section */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                                    {/* Verification QR Generator */}
                                    @php
                                    @endphp
                                    <div style={{
                                        width: 80,
                                        height: 80,
                                        background: 'white',
                                        borderRadius: 6,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 4
                                    }}>
                                        {/* Fallback to online visual chart QR */}
                                        <img 
                                            src={`https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=${encodeURIComponent(window.location.origin + '/verify/' + student.student_id_number)}&choe=UTF-8`} 
                                            alt="QR" 
                                            style={{ width: '100%', height: '100%' }}
                                        />
                                    </div>
                                    <div style={{ fontSize: '0.5rem', opacity: 0.8, fontFamily: 'monospace' }}>SCAN TO VERIFY</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', width: '100%' }}>
                        <Card style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', width: '100%', maxWidth: 360 }}>
                            <CardBody style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
                                <QrCode size={48} style={{ opacity: 0.4, margin: '0 auto 12px' }} />
                                <div>{isUrdu ? 'شناختی کارڈ فی الحال جاری نہیں کیا گیا ہے۔' : 'ID Card records not found.'}</div>
                            </CardBody>
                        </Card>

                        <PhotoUploadSection 
                            student={student}
                            isUrdu={isUrdu}
                            handlePhotoSubmit={handlePhotoSubmit}
                            data={data}
                            setData={setData}
                            processing={processing}
                            errors={errors}
                        />
                    </div>
                )}

                {/* ID Actions */}
                {digital_id && (
                    <div style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 360 }}>
                        <a 
                            href="/student/my-id/download"
                            style={{
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: 8,
                                background: '#1e6b3e',
                                color: 'white',
                                fontWeight: 700,
                                textDecoration: 'none',
                                textAlign: 'center',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8
                            }}
                        >
                            <Download size={14} />
                            {isUrdu ? 'کارڈ ڈاؤن لوڈ کریں' : 'Download PDF Card'}
                        </a>
                        <button 
                            onClick={() => window.print()}
                            style={{
                                padding: '10px 14px',
                                borderRadius: 8,
                                background: 'transparent',
                                border: '1px solid var(--border)',
                                color: 'var(--text-primary)',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6
                            }}
                        >
                            <Printer size={14} />
                            {isUrdu ? 'پرنٹ' : 'Print'}
                        </button>
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}

function PhotoUploadSection({ student, isUrdu, handlePhotoSubmit, data, setData, processing, errors }: {
    student: Student;
    isUrdu: boolean;
    handlePhotoSubmit: (e: React.FormEvent) => void;
    data: any;
    setData: any;
    processing: boolean;
    errors: any;
}) {
    if (student.photo_status === 'pending') {
        return (
            <Card style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', width: '100%', maxWidth: 360 }}>
                <CardBody style={{ padding: 24, textAlign: 'center' }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>⏳</div>
                    <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {isUrdu ? 'تصویر منظوری کے لیے زیر التواء ہے' : 'Photo Pending Approval'}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {isUrdu 
                            ? 'آپ کی پاسپورٹ سائز تصویر ایڈمنسٹریشن کی منظوری کے لیے بھیج دی گئی ہے۔ منظوری کے بعد کارڈ جاری ہو جائے گا۔'
                            : 'Your passport photo is under review by the administration. Your ID card will be issued once approved.'}
                    </p>
                    {student.pending_profile_photo_url && (
                        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center' }}>
                            <img 
                                src={student.pending_profile_photo_url} 
                                alt="Pending" 
                                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} 
                            />
                        </div>
                    )}
                </CardBody>
            </Card>
        );
    }

    if (student.photo_status === 'approved' && student.profile_photo_url) {
        return null;
    }

    return (
        <Card style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', width: '100%', maxWidth: 360 }}>
            <CardBody style={{ padding: 24 }}>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center' }}>
                    {isUrdu ? 'پاسپورٹ سائز تصویر اپ لوڈ کریں' : 'Upload Passport Size Photo'}
                </h4>
                <p style={{ margin: '0 0 16px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
                    {isUrdu 
                        ? 'شناختی کارڈ کے حصول کے لیے اپنی حالیہ پاسپورٹ سائز تصویر (JPG/PNG، زیادہ سے زیادہ 2MB) اپ لوڈ کریں۔'
                        : 'Upload a recent professional passport-size photo to generate your Student ID card (Max 2MB, JPG/PNG).'}
                </p>

                {student.photo_status === 'rejected' && (
                    <div style={{
                        background: '#fee2e2', border: '1px solid #f87171', borderRadius: 8,
                        padding: '10px 12px', marginBottom: 14, fontSize: '0.75rem', color: '#b91c1c'
                    }}>
                        {isUrdu 
                            ? '❌ آپ کی سابقہ تصویر مسترد کر دی گئی تھی۔ براہ کرم ایک واضح اور درست تصویر دوبارہ اپ لوڈ کریں۔'
                            : '❌ Your previous photo was rejected. Please upload a clear passport-size photo.'}
                    </div>
                )}

                <form onSubmit={handlePhotoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => setData('photo', e.target.files?.[0] || null)}
                        style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                            background: 'var(--surface-3)',
                            border: '1px solid var(--border)',
                            borderRadius: 6,
                            padding: '8px 10px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    />
                    {errors.photo && (
                        <div style={{ fontSize: '0.7rem', color: '#ef4444' }}>{errors.photo}</div>
                    )}
                    <button 
                        type="submit" 
                        disabled={processing || !data.photo}
                        style={{
                            background: '#1e6b3e',
                            color: 'white',
                            border: 'none',
                            padding: '10px 14px',
                            borderRadius: 8,
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            opacity: (processing || !data.photo) ? 0.6 : 1,
                            transition: 'opacity 0.15s'
                        }}
                    >
                        {processing ? (isUrdu ? 'اپ لوڈ ہو رہا ہے...' : 'Uploading...') : (isUrdu ? 'تصویر جمع کرائیں' : 'Submit Photo')}
                    </button>
                </form>
            </CardBody>
        </Card>
    );
}
