import React from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import StudentLayout from '@/Layouts/StudentLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Bell, Check, Inbox, Calendar, FileText, CheckCircle, GraduationCap } from 'lucide-react';

interface Notification {
    id: number;
    title: string;
    title_ur: string | null;
    message: string;
    message_ur: string | null;
    type: 'assignment' | 'exam' | 'result' | 'attendance_warning' | 'notice' | 'certificate' | 'hifz' | 'general' | 'support' | 'teacher';
    is_read: boolean;
    created_at: string;
}

interface Props {
    notifications: {
        data: Notification[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function NotificationsIndex({ notifications }: Props) {
    const { props } = usePage();
    const isUrdu = props.locale === 'ur';

    const handleMarkRead = (id: number) => {
        router.post(`/student/notifications/${id}/read`);
    };

    const handleMarkAllRead = () => {
        router.post('/student/notifications/read-all');
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'assignment':
                return <FileText size={18} style={{ color: '#3b82f6' }} />;
            case 'exam':
            case 'result':
                return <GraduationCap size={18} style={{ color: '#c08b10' }} />;
            case 'attendance_warning':
                return <Bell size={18} style={{ color: '#ef4444' }} />;
            case 'hifz':
                return <Inbox size={18} style={{ color: '#1e6b3e' }} />;
            default:
                return <Bell size={18} style={{ color: 'var(--text-muted)' }} />;
        }
    };

    return (
        <StudentLayout title={isUrdu ? 'اطلاعات' : 'Notifications'}>
            <Head title={isUrdu ? 'اطلاعات — طالب علم پورٹل' : 'Notifications — Student Portal'} />

            <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ margin: '0 0 4px', fontSize: '1.625rem', fontWeight: 800 }}>
                            {isUrdu ? 'میری اطلاعات' : 'Notifications & Alerts'}
                        </h1>
                        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                            {isUrdu ? 'آپ کو بھیجے گئے الرٹس اور نوٹسز کی تفصیلات۔' : 'Check new updates, assignments, grades, and notes.'}
                        </p>
                    </div>
                    {notifications.data.some(n => !n.is_read) && (
                        <button 
                            onClick={handleMarkAllRead}
                            style={{
                                background: 'rgba(30,107,62,0.1)',
                                border: 'none',
                                color: '#1e6b3e',
                                padding: '8px 14px',
                                borderRadius: 8,
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6
                            }}
                        >
                            <CheckCircle size={14} />
                            {isUrdu ? 'سب کو پڑھا ہوا نشان زد کریں' : 'Mark All as Read'}
                        </button>
                    )}
                </div>

                {/* Notifications List */}
                {notifications.data.length === 0 ? (
                    <Card style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                        <CardBody style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                            <Inbox size={48} style={{ opacity: 0.4 }} />
                            <span>{isUrdu ? 'آپ کے لیے فی الحال کوئی نئی اطلاع نہیں ہے۔' : 'Your inbox is clear.'}</span>
                        </CardBody>
                    </Card>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {notifications.data.map((item, idx) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                style={{
                                    display: 'flex',
                                    gap: 16,
                                    padding: '16px 20px',
                                    borderRadius: 12,
                                    background: 'var(--surface-2)',
                                    border: item.is_read ? '1px solid var(--border)' : '1px solid rgba(30,107,62,0.35)',
                                    boxShadow: item.is_read ? 'none' : '0 2px 8px rgba(30,107,62,0.06)',
                                    position: 'relative'
                                }}
                            >
                                {/* Left strip indicator for unread */}
                                {!item.is_read && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        bottom: 0,
                                        left: 0,
                                        width: 4,
                                        borderTopLeftRadius: 12,
                                        borderBottomLeftRadius: 12,
                                        background: '#1e6b3e'
                                    }} />
                                )}

                                {/* Icon wrapper */}
                                <div style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 10,
                                    background: 'var(--surface-3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {getIcon(item.type)}
                                </div>

                                {/* Texts */}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        margin: '0 0 4px',
                                        fontSize: '0.9rem',
                                        fontWeight: 700,
                                        color: 'var(--text-primary)',
                                        fontFamily: isUrdu && item.title_ur ? "'Noto Nastaliq Urdu', serif" : 'inherit',
                                        textAlign: isUrdu && item.title_ur ? 'right' : 'left',
                                        direction: isUrdu && item.title_ur ? 'rtl' : 'ltr'
                                    }}>
                                        {isUrdu && item.title_ur ? item.title_ur : item.title}
                                    </h3>
                                    <p style={{
                                        margin: '0 0 8px',
                                        fontSize: '0.8125rem',
                                        color: 'var(--text-secondary)',
                                        lineHeight: 1.5,
                                        fontFamily: isUrdu && item.message_ur ? "'Noto Nastaliq Urdu', serif" : 'inherit',
                                        textAlign: isUrdu && item.message_ur ? 'right' : 'left',
                                        direction: isUrdu && item.message_ur ? 'rtl' : 'ltr'
                                    }}>
                                        {isUrdu && item.message_ur ? item.message_ur : item.message}
                                    </p>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Calendar size={12} />
                                        {new Date(item.created_at).toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US')}
                                    </span>
                                </div>

                                {/* Read trigger */}
                                {!item.is_read && (
                                    <button
                                        onClick={() => handleMarkRead(item.id)}
                                        style={{
                                            border: 'none',
                                            background: 'none',
                                            cursor: 'pointer',
                                            color: '#1e6b3e',
                                            padding: 4,
                                            alignSelf: 'center',
                                            borderRadius: '50%',
                                            width: 28,
                                            height: 28,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(30,107,62,0.1)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                                        title={isUrdu ? 'پڑھا ہوا نشان زد کریں' : 'Mark as Read'}
                                    >
                                        <Check size={16} />
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}
