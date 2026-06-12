import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Pin, Calendar, User } from 'lucide-react';

interface Announcement {
    id: number;
    title: string;
    title_ur: string | null;
    content: string | null;
    content_ur: string | null;
    audience: 'all' | 'students' | 'teachers';
    is_pinned: boolean;
    created_at: string;
}

interface Props {
    announcements: {
        data: Announcement[];
        current_page: number;
        last_page: number;
    };
}

export default function StudentNoticeBoard({ announcements }: Props) {
    const { props } = usePage();
    const isUrdu = props.locale === 'ur';

    return (
        <StudentLayout title={isUrdu ? 'اطلاعات و اعلانات' : 'Notice Board'}>
            <Head title={isUrdu ? 'نوٹس بورڈ — طالب علم پورٹل' : 'Notice Board — Student Portal'} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Header */}
                <div>
                    <h1 style={{ margin: '0 0 6px', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {isUrdu ? 'نوٹس بورڈ اور اعلانات' : 'Notice Board & Announcements'}
                    </h1>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {isUrdu 
                            ? 'جامعہ کی طرف سے طلباء کے لیے اہم اطلاعات اور تعلیمی اعلانات۔' 
                            : 'Stay updated with the latest instructions and updates from the administration.'
                        }
                    </p>
                </div>

                {/* Notices Grid */}
                {announcements.data.length === 0 ? (
                    <Card>
                        <CardBody className="py-12 text-center text-muted-foreground">
                            {isUrdu ? 'فی الحال کوئی نیا اعلان نہیں ہے۔' : 'No announcements currently posted.'}
                        </CardBody>
                    </Card>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {announcements.data.map((item) => (
                            <Card 
                                key={item.id}
                                style={{
                                    border: item.is_pinned ? '1px solid rgba(30,107,62,0.4)' : '1px solid var(--border)',
                                    background: item.is_pinned ? 'linear-gradient(135deg, var(--surface-2) 0%, rgba(30,107,62,0.03) 100%)' : 'var(--surface-2)',
                                    boxShadow: item.is_pinned ? '0 4px 20px rgba(30,107,62,0.06)' : 'none'
                                }}
                            >
                                <CardBody style={{ padding: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {item.is_pinned && (
                                                <span style={{
                                                    background: '#1e6b3e',
                                                    color: 'white',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 700,
                                                    padding: '3px 8px',
                                                    borderRadius: 6,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 4
                                                }}>
                                                    <Pin size={10} className="fill-white" />
                                                    {isUrdu ? 'پن شدہ' : 'PINNED'}
                                                </span>
                                            )}
                                            <h2 style={{
                                                margin: 0,
                                                fontSize: '1.125rem',
                                                fontWeight: 700,
                                                color: 'var(--text-primary)',
                                                fontFamily: isUrdu && item.title_ur ? "'Noto Nastaliq Urdu', serif" : 'inherit',
                                                textAlign: isUrdu && item.title_ur ? 'right' : 'left',
                                                direction: isUrdu && item.title_ur ? 'rtl' : 'ltr'
                                            }}>
                                                {isUrdu && item.title_ur ? item.title_ur : item.title}
                                            </h2>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Calendar size={12} />
                                                {new Date(item.created_at).toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US')}
                                            </span>
                                        </div>
                                    </div>

                                    <p style={{
                                        margin: 0,
                                        fontSize: '0.9rem',
                                        color: 'var(--text-secondary)',
                                        lineHeight: 1.6,
                                        whiteSpace: 'pre-line',
                                        fontFamily: isUrdu && item.content_ur ? "'Noto Nastaliq Urdu', serif" : 'inherit',
                                        textAlign: isUrdu && item.content_ur ? 'right' : 'left',
                                        direction: isUrdu && item.content_ur ? 'rtl' : 'ltr'
                                    }}>
                                        {isUrdu && item.content_ur ? item.content_ur : item.content}
                                    </p>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}
