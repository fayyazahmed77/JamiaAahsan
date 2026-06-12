import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import StudentLayout from '@/Layouts/StudentLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { User, Phone, Mail, Calendar, MapPin, Briefcase, Award, Shield, FileText, Upload, CheckCircle } from 'lucide-react';

interface Guardian {
    id: number;
    name: string;
    relation: 'father' | 'mother' | 'brother' | 'uncle' | 'grandfather' | 'other';
    phone: string | null;
    email: string | null;
    cnic: string | null;
    address: string | null;
    occupation: string | null;
    is_primary: boolean;
}

interface StudentProfile {
    father_name: string | null;
    mother_name: string | null;
    nationality: string;
    mother_tongue: string | null;
    national_id: string | null;
    address: string | null;
    city: string | null;
    province: string | null;
    country: string;
    previous_madrasa: string | null;
    previous_qualification: string | null;
    hifz_status: 'non_hafiz' | 'in_progress' | 'hafiz';
    maslak: string | null;
    specialization_interests: string[] | null;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
    emergency_contact_relation: string | null;
}

interface Student {
    id: number;
    student_id_number: string;
    name: string;
    email: string;
    phone: string | null;
    date_of_birth: string | null;
    gender: 'male' | 'female';
    student_type: 'online' | 'onsite';
    status: string;
    profile_photo_url: string | null;
    current_year: number;
    current_semester: number;
    enrollment_date: string | null;
    program: string | null;
    batch: string | null;
    profile: StudentProfile | null;
}

interface Props {
    student: Student;
    guardians: Guardian[];
}

export default function ProfileShow({ student, guardians }: Props) {
    const { props } = usePage();
    const isUrdu = props.locale === 'ur';
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const profileForm = useForm({
        phone: student.phone || '',
    });

    const photoForm = useForm({
        photo: null as File | null,
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.put(route('student.profile.update'), {
            onSuccess: () => setIsEditingPhone(false),
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            photoForm.setData('photo', file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handlePhotoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!photoForm.data.photo) return;
        photoForm.post(route('student.profile.photo'), {
            onSuccess: () => {
                photoForm.reset();
                setPhotoPreview(null);
            },
        });
    };

    const relationLabels: Record<string, string> = {
        father: isUrdu ? 'والد' : 'Father',
        mother: isUrdu ? 'والدہ' : 'Mother',
        brother: isUrdu ? 'بھائی' : 'Brother',
        uncle: isUrdu ? 'چچا / ماموں' : 'Uncle',
        grandfather: isUrdu ? 'دادا / نانا' : 'Grandfather',
        other: isUrdu ? 'دیگر' : 'Other',
    };

    return (
        <StudentLayout title={isUrdu ? 'میرا پروفائل' : 'My Profile'}>
            <Head title={isUrdu ? 'میرا پروفائل — طالب علم پورٹل' : 'My Profile — Student Portal'} />

            <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Header Banner */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                    padding: 28,
                    borderRadius: 16,
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    flexWrap: 'wrap'
                }}>
                    {/* Profile Photo Upload Section */}
                    <form onSubmit={handlePhotoSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 110,
                            height: 110,
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '3px solid #1e6b3e',
                            background: 'var(--surface-3)',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {photoPreview ? (
                                <img src={photoPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : student.profile_photo_url ? (
                                <img src={student.profile_photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={48} style={{ color: 'var(--text-muted)' }} />
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <label style={{
                                padding: '6px 12px',
                                background: 'var(--surface-3)',
                                border: '1px solid var(--border)',
                                borderRadius: 6,
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4
                            }}>
                                <Upload size={12} />
                                {isUrdu ? 'تصویر منتخب کریں' : 'Select Photo'}
                                <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                            </label>
                            {photoPreview && (
                                <Button type="submit" disabled={photoForm.processing} size="sm" style={{ background: '#1e6b3e', color: '#fff' }}>
                                    {photoForm.processing ? '...' : (isUrdu ? 'اپ لوڈ' : 'Upload')}
                                </Button>
                            )}
                        </div>
                    </form>

                    {/* Student Identity overview */}
                    <div style={{ flex: 1, minWidth: 250 }}>
                        <h1 style={{ margin: '0 0 6px', fontSize: '1.625rem', fontWeight: 800 }}>{student.name}</h1>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                            <span>🆔 {student.student_id_number}</span>
                            <span>🏫 {student.program || 'N/A'}</span>
                            <span>📅 Year {student.current_year}, Sem {student.current_semester}</span>
                        </div>
                        <span style={{
                            padding: '3px 8px',
                            borderRadius: 12,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background: student.status === 'active' ? '#d1fae5' : '#fee2e2',
                            color: student.status === 'active' ? '#065f46' : '#991b1b',
                        }}>
                            {student.status}
                        </span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                    {/* Personal & Contact details */}
                    <Card style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                        <CardBody style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e6b3e', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <User size={18} />
                                {isUrdu ? 'ذاتی اور رابطہ کی معلومات' : 'Personal & Contact Info'}
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isUrdu ? 'ای میل ایڈریس' : 'Email Address'}</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Mail size={14} style={{ opacity: 0.6 }} />
                                        {student.email}
                                    </div>
                                </div>

                                <form onSubmit={handleProfileSubmit}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isUrdu ? 'فون نمبر' : 'Phone Number'}</div>
                                    {isEditingPhone ? (
                                        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                            <input 
                                                type="text" 
                                                value={profileForm.data.phone} 
                                                onChange={e => profileForm.setData('phone', e.target.value)}
                                                style={{
                                                    flex: 1,
                                                    padding: '6px 10px',
                                                    background: 'var(--surface-1)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: 6,
                                                    color: 'var(--text-primary)',
                                                    fontSize: '0.85rem'
                                                }}
                                            />
                                            <Button type="submit" size="sm" style={{ background: '#1e6b3e', color: '#fff' }}>
                                                {isUrdu ? 'محفوظ کریں' : 'Save'}
                                            </Button>
                                            <Button type="button" size="sm" variant="outline" onClick={() => setIsEditingPhone(false)}>
                                                {isUrdu ? 'منسوخ' : 'Cancel'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Phone size={14} style={{ opacity: 0.6 }} />
                                                {student.phone || '—'}
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => setIsEditingPhone(true)}
                                                style={{ background: 'none', border: 'none', color: '#1e6b3e', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                                            >
                                                {isUrdu ? 'ترمیم کریں' : 'Edit'}
                                            </button>
                                        </div>
                                    )}
                                </form>

                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isUrdu ? 'تاریخِ پیدائش' : 'Date of Birth'}</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Calendar size={14} style={{ opacity: 0.6 }} />
                                        {student.date_of_birth || '—'}
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isUrdu ? 'صنف' : 'Gender'}</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'capitalize' }}>
                                        {isUrdu ? (student.gender === 'male' ? 'مرد' : 'خواتین') : student.gender}
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Academic details */}
                    <Card style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                        <CardBody style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e6b3e', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Award size={18} />
                                {isUrdu ? 'تعلیمی معلومات' : 'Academic Profile'}
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isUrdu ? 'شعبہ / تعلیمی پروگرام' : 'Program'}</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{student.program || '—'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isUrdu ? 'بیچ' : 'Batch'}</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{student.batch || '—'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isUrdu ? 'طرزِ تعلیم' : 'Enrollment Type'}</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                        {student.student_type === 'online' ? '🌐 Online' : '🏫 Onsite'}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isUrdu ? 'تاریخِ شمولیت' : 'Enrollment Date'}</div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{student.enrollment_date || '—'}</div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Guardians details */}
                <Card style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                    <CardBody style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e6b3e', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Shield size={18} />
                            {isUrdu ? 'سرپرست کی معلومات' : 'Guardian Details'}
                        </h2>

                        {guardians.length === 0 ? (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                {isUrdu ? 'کوئی معلومات درج نہیں ہے۔' : 'No guardian details recorded.'}
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                                {guardians.map(g => (
                                    <div key={g.id} style={{
                                        background: 'var(--surface-3)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 10,
                                        padding: 16,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 8
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{g.name}</strong>
                                            <span style={{
                                                fontSize: '0.65rem',
                                                padding: '2px 8px',
                                                borderRadius: 20,
                                                background: '#1e6b3e20',
                                                color: '#1e6b3e',
                                                fontWeight: 700
                                            }}>
                                                {relationLabels[g.relation] || g.relation}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            {g.phone && <span>📞 {g.phone}</span>}
                                            {g.cnic && <span>🪪 CNIC: {g.cnic}</span>}
                                            {g.address && <span>📍 {g.address}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>
        </StudentLayout>
    );
}
