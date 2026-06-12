import React, { useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import StudentLayout from '@/Layouts/StudentLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Settings, Bell, Shield, Key, Globe, Eye, Monitor, Clock, Laptop } from 'lucide-react';

interface Settings {
    language: 'en' | 'ur';
    theme: 'light' | 'dark' | 'system';
    notify_assignment: boolean;
    notify_exam: boolean;
    notify_result: boolean;
    notify_attendance: boolean;
    notify_notice: boolean;
    notify_hifz: boolean;
    notify_support: boolean;
    notify_certificate: boolean;
    notify_teacher: boolean;
    login_notifications: boolean;
}

interface LoginHistory {
    ip_address: string | null;
    device_type: 'mobile' | 'tablet' | 'desktop' | 'unknown';
    browser: string | null;
    os: string | null;
    status: string;
    logged_in_at: string;
}

interface Props {
    settings: Settings;
    loginHistory: LoginHistory[];
}

export default function SettingsIndex({ settings, loginHistory }: Props) {
    const { props } = usePage();
    const isUrdu = props.locale === 'ur';
    const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'password' | 'sessions'>('general');

    const generalForm = useForm({
        language: settings.language,
        theme: settings.theme,
        notify_assignment: settings.notify_assignment,
        notify_exam: settings.notify_exam,
        notify_result: settings.notify_result,
        notify_attendance: settings.notify_attendance,
        notify_notice: settings.notify_notice,
        notify_hifz: settings.notify_hifz,
        notify_support: settings.notify_support,
        notify_certificate: settings.notify_certificate,
        notify_teacher: settings.notify_teacher,
        login_notifications: settings.login_notifications,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleGeneralSave = (e: React.FormEvent) => {
        e.preventDefault();
        generalForm.put(route('student.settings.update'), {
            onSuccess: () => {
                // Trigger page refresh to apply locale changes
                if (generalForm.data.language !== settings.language) {
                    router.visit(window.location.pathname);
                }
            }
        });
    };

    const handlePasswordSave = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put(route('student.settings.password'), {
            onSuccess: () => passwordForm.reset(),
        });
    };

    const tabStyle = (tab: typeof activeTab) => ({
        padding: '10px 16px',
        borderRadius: 8,
        border: 'none',
        background: activeTab === tab ? 'rgba(30,107,62,0.1)' : 'transparent',
        color: activeTab === tab ? '#1e6b3e' : 'var(--text-secondary)',
        fontWeight: activeTab === tab ? 700 : 500,
        fontSize: '0.85rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        transition: 'all 0.15s'
    });

    return (
        <StudentLayout title={isUrdu ? 'ترتیبات' : 'Settings'}>
            <Head title={isUrdu ? 'ترتیبات — طالب علم پورٹل' : 'Settings — Student Portal'} />

            <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {/* Sidebar Navigation */}
                <div style={{ width: '100%', maxWidth: 220, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button style={tabStyle('general')} onClick={() => setActiveTab('general')}>
                        <Globe size={16} />
                        {isUrdu ? 'عمومی ترتیبات' : 'General & Language'}
                    </button>
                    <button style={tabStyle('notifications')} onClick={() => setActiveTab('notifications')}>
                        <Bell size={16} />
                        {isUrdu ? 'نوٹیفکیشن الرٹس' : 'Notifications'}
                    </button>
                    <button style={tabStyle('password')} onClick={() => setActiveTab('password')}>
                        <Key size={16} />
                        {isUrdu ? 'پاس ورڈ تبدیل کریں' : 'Change Password'}
                    </button>
                    <button style={tabStyle('sessions')} onClick={() => setActiveTab('sessions')}>
                        <Clock size={16} />
                        {isUrdu ? 'لاگ ان سیشنز' : 'Login History'}
                    </button>
                </div>

                {/* Settings Tab Contents */}
                <div style={{ flex: 1, minWidth: 320 }}>
                    {activeTab === 'general' && (
                        <Card style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                            <CardBody style={{ padding: 24 }}>
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 20px', color: '#1e6b3e', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Globe size={18} />
                                    {isUrdu ? 'زبان اور بصری تھیم' : 'Portal Theme & Language'}
                                </h2>

                                <form onSubmit={handleGeneralSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    {/* Language */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{isUrdu ? 'پورٹل کی زبان' : 'Portal Language'}</label>
                                        <select 
                                            value={generalForm.data.language} 
                                            onChange={e => generalForm.setData('language', e.target.value as any)}
                                            style={{
                                                padding: '8px 12px',
                                                background: 'var(--surface-1)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 6,
                                                color: 'var(--text-primary)',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <option value="en">English</option>
                                            <option value="ur">اردو (Urdu)</option>
                                        </select>
                                    </div>

                                    {/* Theme */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{isUrdu ? 'بصری تھیم' : 'Visual Theme'}</label>
                                        <select 
                                            value={generalForm.data.theme} 
                                            onChange={e => generalForm.setData('theme', e.target.value as any)}
                                            style={{
                                                padding: '8px 12px',
                                                background: 'var(--surface-1)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 6,
                                                color: 'var(--text-primary)',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <option value="light">Light Mode</option>
                                            <option value="dark">Dark Mode</option>
                                            <option value="system">System Default</option>
                                        </select>
                                    </div>

                                    <Button type="submit" disabled={generalForm.processing} style={{ alignSelf: 'flex-start', background: '#1e6b3e', color: 'white' }}>
                                        {generalForm.processing ? '...' : (isUrdu ? 'محفوظ کریں' : 'Save Changes')}
                                    </Button>
                                </form>
                            </CardBody>
                        </Card>
                    )}

                    {activeTab === 'notifications' && (
                        <Card style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                            <CardBody style={{ padding: 24 }}>
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 20px', color: '#1e6b3e', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Bell size={18} />
                                    {isUrdu ? 'نوٹیفکیشن الرٹ کی ترتیبات' : 'Notification Preferences'}
                                </h2>

                                <form onSubmit={handleGeneralSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {[
                                        { key: 'notify_assignment', label: isUrdu ? 'اسائنمنٹ کی معلومات' : 'New Assignment Alerts' },
                                        { key: 'notify_exam', label: isUrdu ? 'امتحانات کا ٹائم ٹیبل' : 'Exam Schedule Updates' },
                                        { key: 'notify_result', label: isUrdu ? 'امتحانی نتائج کی اشاعت' : 'Exam Results Publishing' },
                                        { key: 'notify_attendance', label: isUrdu ? 'حاضری کے انتباہات' : 'Low Attendance Warnings' },
                                        { key: 'notify_notice', label: isUrdu ? 'اہم اعلانات' : 'General Notice Alerts' },
                                        { key: 'notify_hifz', label: isUrdu ? 'حفظ کی کارکردگی' : 'Hifz Session Notes' },
                                        { key: 'login_notifications', label: isUrdu ? 'سیکیورٹی لاگ ان الرٹ' : 'Login Notifications' },
                                    ].map(item => (
                                        <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', cursor: 'pointer' }}>
                                            <input 
                                                type="checkbox" 
                                                checked={generalForm.data[item.key as keyof typeof generalForm.data] as boolean}
                                                onChange={e => generalForm.setData(item.key as any, e.target.checked)}
                                                style={{ width: 16, height: 16, accentColor: '#1e6b3e' }}
                                            />
                                            {item.label}
                                        </label>
                                    ))}

                                    <Button type="submit" disabled={generalForm.processing} style={{ alignSelf: 'flex-start', background: '#1e6b3e', color: 'white', marginTop: 10 }}>
                                        {generalForm.processing ? '...' : (isUrdu ? 'ترتیبات محفوظ کریں' : 'Save Preferences')}
                                    </Button>
                                </form>
                            </CardBody>
                        </Card>
                    )}

                    {activeTab === 'password' && (
                        <Card style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                            <CardBody style={{ padding: 24 }}>
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 20px', color: '#1e6b3e', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Key size={18} />
                                    {isUrdu ? 'سیکیورٹی لاگ ان پاس ورڈ' : 'Change Password'}
                                </h2>

                                <form onSubmit={handlePasswordSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{isUrdu ? 'موجودہ پاس ورڈ' : 'Current Password'}</label>
                                        <input 
                                            type="password" 
                                            value={passwordForm.data.current_password} 
                                            onChange={e => passwordForm.setData('current_password', e.target.value)}
                                            style={{
                                                padding: '8px 12px',
                                                background: 'var(--surface-1)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 6,
                                                color: 'var(--text-primary)',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                        {passwordForm.errors.current_password && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{passwordForm.errors.current_password}</span>}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{isUrdu ? 'نیا پاس ورڈ' : 'New Password'}</label>
                                        <input 
                                            type="password" 
                                            value={passwordForm.data.password} 
                                            onChange={e => passwordForm.setData('password', e.target.value)}
                                            style={{
                                                padding: '8px 12px',
                                                background: 'var(--surface-1)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 6,
                                                color: 'var(--text-primary)',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                        {passwordForm.errors.password && <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{passwordForm.errors.password}</span>}
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{isUrdu ? 'نئے پاس ورڈ کی تصدیق' : 'Confirm New Password'}</label>
                                        <input 
                                            type="password" 
                                            value={passwordForm.data.password_confirmation} 
                                            onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                                            style={{
                                                padding: '8px 12px',
                                                background: 'var(--surface-1)',
                                                border: '1px solid var(--border)',
                                                borderRadius: 6,
                                                color: 'var(--text-primary)',
                                                fontSize: '0.875rem'
                                            }}
                                        />
                                    </div>

                                    <Button type="submit" disabled={passwordForm.processing} style={{ alignSelf: 'flex-start', background: '#1e6b3e', color: 'white' }}>
                                        {passwordForm.processing ? '...' : (isUrdu ? 'پاس ورڈ تبدیل کریں' : 'Update Password')}
                                    </Button>
                                </form>
                            </CardBody>
                        </Card>
                    )}

                    {activeTab === 'sessions' && (
                        <Card style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                            <CardBody style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#1e6b3e', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Laptop size={18} />
                                    {isUrdu ? 'سیکیورٹی سیشن لاگ ہسٹری' : 'Login Session History'}
                                </h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {loginHistory.map((h, i) => (
                                        <div key={i} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '10px 14px',
                                            background: 'var(--surface-3)',
                                            borderRadius: 8,
                                            border: '1px solid var(--border)',
                                            fontSize: '0.8125rem'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>IP: {h.ip_address}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    {h.os} · {h.browser} · <span style={{ textTransform: 'capitalize' }}>{h.device_type}</span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{
                                                    fontSize: '0.65rem',
                                                    padding: '2px 8px',
                                                    borderRadius: 20,
                                                    fontWeight: 700,
                                                    background: h.status === 'success' ? '#d1fae5' : '#fee2e2',
                                                    color: h.status === 'success' ? '#065f46' : '#991b1b',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {h.status}
                                                </span>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{h.logged_in_at}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}
