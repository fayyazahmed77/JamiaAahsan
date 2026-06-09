import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/Layouts/AdminLayout';

interface Student {
    id: number;
    name: string;
    student_id_number: string;
}

interface HifzEnrollmentData {
    id: number;
    teacher_id: number | null;
    teacher_name: string | null;
    start_date: string;
    target_completion_date: string | null;
    total_juz_target: number;
    juz_completed: number;
    current_surah: string | null;
    current_ayah: number | null;
    status: string;
    notes: string | null;
}

interface HifzSessionData {
    id: number;
    session_date: string;
    sabqi_from: string | null;
    sabqi_to: string | null;
    sabqi_pages: number | null;
    sabqi_quality: string | null;
    manzil_from: string | null;
    manzil_to: string | null;
    manzil_quality: string | null;
    new_lesson_from: string | null;
    new_lesson_to: string | null;
    new_lesson_pages: number | null;
    teacher_notes: string | null;
    mistakes_count: number | null;
}

interface Teacher {
    id: number;
    name: string;
}

interface Props {
    student: Student;
    enrollment: HifzEnrollmentData | null;
    sessions: { data: HifzSessionData[]; total: number; last_page: number; current_page: number };
    teachers: Teacher[];
}

const qualityColors: Record<string, string> = {
    excellent: '#10b981', good: '#3b82f6', average: '#f59e0b', needs_revision: '#ef4444',
};
const qualityLabels: Record<string, string> = {
    excellent: '⭐ Excellent', good: '✅ Good', average: '⚠️ Average', needs_revision: '🔄 Needs Revision',
};

const QualitySelect = ({ name, value, onChange }: { name: string; value: string; onChange: (v: string) => void }) => (
    <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface-1)', color: 'var(--text-primary)', fontSize: '0.8125rem' }}
    >
        <option value="">Select quality</option>
        <option value="excellent">⭐ Excellent</option>
        <option value="good">✅ Good</option>
        <option value="average">⚠️ Average</option>
        <option value="needs_revision">🔄 Needs Revision</option>
    </select>
);

const InputField = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>{label}</label>
        <input
            {...props}
            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface-1)', color: 'var(--text-primary)', fontSize: '0.8125rem' }}
        />
    </div>
);

export default function HifzShow({ student, enrollment, sessions, teachers }: Props) {
    const [activeTab, setActiveTab] = useState<'sessions' | 'enrollment'>('sessions');
    const [showSessionForm, setShowSessionForm] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    // Session form
    const sessionForm = useForm({
        session_date:      today,
        teacher_id:        enrollment?.teacher_id?.toString() ?? '',
        sabqi_from:        '',
        sabqi_to:          '',
        sabqi_pages:       '',
        sabqi_quality:     '',
        manzil_from:       '',
        manzil_to:         '',
        manzil_quality:    '',
        new_lesson_from:   '',
        new_lesson_to:     '',
        new_lesson_pages:  '',
        teacher_notes:     '',
        mistakes_count:    '',
    });

    // Enrollment form
    const enrollForm = useForm({
        teacher_id:             enrollment?.teacher_id?.toString() ?? '',
        juz_completed:          enrollment?.juz_completed?.toString() ?? '0',
        current_surah:          enrollment?.current_surah ?? '',
        current_ayah:           enrollment?.current_ayah?.toString() ?? '',
        total_juz_target:       enrollment?.total_juz_target?.toString() ?? '30',
        target_completion_date: enrollment?.target_completion_date ?? '',
        status:                 enrollment?.status ?? 'active',
        notes:                  enrollment?.notes ?? '',
    });

    const submitSession = (e: React.FormEvent) => {
        e.preventDefault();
        sessionForm.post(`/admin/hifz/${student.id}/sessions`, {
            onSuccess: () => {
                sessionForm.reset();
                setShowSessionForm(false);
            },
        });
    };

    const submitEnrollment = (e: React.FormEvent) => {
        e.preventDefault();
        enrollForm.put(`/admin/hifz/${student.id}/enrollment`);
    };

    const tabStyle = (t: typeof activeTab): React.CSSProperties => ({
        padding: '10px 22px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', border: 'none', borderRadius: 8,
        background: activeTab === t ? '#1e6b3e' : 'var(--surface-3)',
        color: activeTab === t ? 'white' : 'var(--text-secondary)',
        transition: 'all 0.2s',
    });

    const progressPct = enrollment ? Math.round((enrollment.juz_completed / enrollment.total_juz_target) * 100) : 0;

    return (
        <AdminLayout>
            <Head title={`Hifz — ${student.name}`} />

            <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Back */}
                <Link href="/admin/hifz" style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    ← Back to Hifz List
                </Link>

                {/* Student Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'linear-gradient(135deg, #1e3a5f 0%, #1e6b3e 100%)',
                        borderRadius: 16, padding: '24px 28px', color: 'white',
                        boxShadow: '0 8px 24px rgba(30,58,95,0.3)',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: 4 }}>🕌 Hifz al-Quran</div>
                            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>{student.name}</h1>
                            <div style={{ marginTop: 4, opacity: 0.8, fontSize: '0.875rem' }}>
                                ID: {student.student_id_number}
                                {enrollment && <> · Teacher: {enrollment.teacher_name ?? '—'}</>}
                            </div>
                        </div>

                        {enrollment && (
                            <div style={{ display: 'flex', gap: 20 }}>
                                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 16px' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 900 }}>{enrollment.juz_completed}</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.75 }}>Juz Done</div>
                                </div>
                                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 16px' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 900 }}>{progressPct}%</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.75 }}>Complete</div>
                                </div>
                                <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 16px' }}>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{enrollment.current_surah ?? '—'}</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.75 }}>Current</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {enrollment && (
                        <div style={{ marginTop: 16 }}>
                            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 100, height: 8, overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }} animate={{ width: `${progressPct}%` }}
                                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                                    style={{ height: '100%', background: 'linear-gradient(90deg, #6ee7b7, #34d399)', borderRadius: 100 }}
                                />
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button style={tabStyle('sessions')} onClick={() => setActiveTab('sessions')}>
                            📋 Sessions ({sessions.total})
                        </button>
                        <button style={tabStyle('enrollment')} onClick={() => setActiveTab('enrollment')}>
                            ✏️ Edit Enrollment
                        </button>
                    </div>
                    {activeTab === 'sessions' && (
                        <button
                            onClick={() => setShowSessionForm(v => !v)}
                            style={{
                                padding: '10px 20px', background: showSessionForm ? 'var(--surface-3)' : '#1e6b3e',
                                color: showSessionForm ? 'var(--text-secondary)' : 'white', border: 'none', borderRadius: 8,
                                fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem',
                            }}
                        >
                            {showSessionForm ? '✕ Cancel' : '+ Record Session'}
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'sessions' && (
                        <motion.div key="sessions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                            {/* Session Recording Form */}
                            <AnimatePresence>
                                {showSessionForm && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                        style={{ background: 'var(--surface-2)', border: '2px solid #1e6b3e40', borderRadius: 16, overflow: 'hidden' }}
                                    >
                                        <div style={{ padding: '20px 24px' }}>
                                            <h3 style={{ margin: '0 0 20px', color: '#1e6b3e', fontWeight: 800 }}>📝 Record New Hifz Session</h3>
                                            <form onSubmit={submitSession} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                                {/* Row 1: Date + Teacher */}
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                                    <InputField
                                                        label="Session Date *"
                                                        type="date"
                                                        value={sessionForm.data.session_date}
                                                        onChange={e => sessionForm.setData('session_date', e.target.value)}
                                                        required
                                                    />
                                                    <div>
                                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Teacher *</label>
                                                        <select
                                                            value={sessionForm.data.teacher_id}
                                                            onChange={e => sessionForm.setData('teacher_id', e.target.value)}
                                                            required
                                                            style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface-1)', color: 'var(--text-primary)', fontSize: '0.8125rem' }}
                                                        >
                                                            <option value="">Select teacher...</option>
                                                            {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                                        </select>
                                                        {sessionForm.errors.teacher_id && <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '4px 0 0' }}>{sessionForm.errors.teacher_id}</p>}
                                                    </div>
                                                </div>

                                                {/* Sabqi */}
                                                <div style={{ background: 'var(--surface-3)', borderRadius: 12, padding: '14px 16px' }}>
                                                    <div style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        📖 Sabqi — Today's Lesson
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 1fr', gap: 12 }}>
                                                        <InputField label="From" placeholder="e.g. Al-Baqarah 1" value={sessionForm.data.sabqi_from} onChange={e => sessionForm.setData('sabqi_from', e.target.value)} />
                                                        <InputField label="To" placeholder="e.g. Al-Baqarah 15" value={sessionForm.data.sabqi_to} onChange={e => sessionForm.setData('sabqi_to', e.target.value)} />
                                                        <InputField label="Pages" type="number" min="0" placeholder="2" value={sessionForm.data.sabqi_pages} onChange={e => sessionForm.setData('sabqi_pages', e.target.value)} />
                                                        <div>
                                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Quality</label>
                                                            <QualitySelect name="sabqi_quality" value={sessionForm.data.sabqi_quality} onChange={v => sessionForm.setData('sabqi_quality', v)} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Manzil */}
                                                <div style={{ background: 'var(--surface-3)', borderRadius: 12, padding: '14px 16px' }}>
                                                    <div style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        🔄 Manzil — Revision
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                                                        <InputField label="From" placeholder="e.g. Al-Fatiha 1" value={sessionForm.data.manzil_from} onChange={e => sessionForm.setData('manzil_from', e.target.value)} />
                                                        <InputField label="To" placeholder="e.g. Al-Baqarah 50" value={sessionForm.data.manzil_to} onChange={e => sessionForm.setData('manzil_to', e.target.value)} />
                                                        <div>
                                                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Quality</label>
                                                            <QualitySelect name="manzil_quality" value={sessionForm.data.manzil_quality} onChange={v => sessionForm.setData('manzil_quality', v)} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* New Lesson */}
                                                <div style={{ background: 'var(--surface-3)', borderRadius: 12, padding: '14px 16px' }}>
                                                    <div style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        🆕 New Lesson (Dhor)
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 12 }}>
                                                        <InputField label="From" placeholder="e.g. Aal-Imran 1" value={sessionForm.data.new_lesson_from} onChange={e => sessionForm.setData('new_lesson_from', e.target.value)} />
                                                        <InputField label="To" placeholder="e.g. Aal-Imran 10" value={sessionForm.data.new_lesson_to} onChange={e => sessionForm.setData('new_lesson_to', e.target.value)} />
                                                        <InputField label="Pages" type="number" min="0" placeholder="1" value={sessionForm.data.new_lesson_pages} onChange={e => sessionForm.setData('new_lesson_pages', e.target.value)} />
                                                    </div>
                                                </div>

                                                {/* Notes + Mistakes */}
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 16 }}>
                                                    <div>
                                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Teacher Notes</label>
                                                        <textarea
                                                            rows={3}
                                                            placeholder="Any observations or instructions..."
                                                            value={sessionForm.data.teacher_notes}
                                                            onChange={e => sessionForm.setData('teacher_notes', e.target.value)}
                                                            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface-1)', color: 'var(--text-primary)', fontSize: '0.8125rem', resize: 'vertical', fontFamily: 'inherit' }}
                                                        />
                                                    </div>
                                                    <InputField
                                                        label="Mistakes Count"
                                                        type="number"
                                                        min="0"
                                                        placeholder="0"
                                                        value={sessionForm.data.mistakes_count}
                                                        onChange={e => sessionForm.setData('mistakes_count', e.target.value)}
                                                    />
                                                </div>

                                                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                                                    <button type="button" onClick={() => setShowSessionForm(false)}
                                                        style={{ padding: '10px 20px', background: 'var(--surface-3)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                                                        Cancel
                                                    </button>
                                                    <button type="submit" disabled={sessionForm.processing}
                                                        style={{ padding: '10px 24px', background: '#1e6b3e', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>
                                                        {sessionForm.processing ? '⏳ Saving...' : '✅ Save Session'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Session History */}
                            {sessions.data.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '48px 20px', background: 'var(--surface-2)', border: '1px dashed var(--border)', borderRadius: 14, color: 'var(--text-muted)' }}>
                                    <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
                                    <div style={{ fontWeight: 600 }}>No Sessions Recorded</div>
                                    <p style={{ margin: '6px 0 0', fontSize: '0.875rem' }}>Click "Record Session" to add the first session.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {sessions.data.map((s, idx) => (
                                        <motion.div
                                            key={s.id}
                                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                                            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', boxShadow: 'var(--shadow-sm)' }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                                                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
                                                    📅 {new Date(s.session_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </div>
                                                {s.mistakes_count !== null && (
                                                    <span style={{
                                                        padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
                                                        background: s.mistakes_count === 0 ? '#d1fae5' : s.mistakes_count < 5 ? '#fef3c7' : '#fee2e2',
                                                        color: s.mistakes_count === 0 ? '#065f46' : s.mistakes_count < 5 ? '#92400e' : '#991b1b',
                                                    }}>
                                                        {s.mistakes_count === 0 ? '✨ No Mistakes' : `${s.mistakes_count} Mistakes`}
                                                    </span>
                                                )}
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                                {s.sabqi_from && (
                                                    <div style={{ background: 'var(--surface-3)', borderRadius: 10, padding: '10px 12px' }}>
                                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' }}>📖 Sabqi</div>
                                                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.sabqi_from} → {s.sabqi_to}</div>
                                                        {s.sabqi_pages && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.sabqi_pages} pages</div>}
                                                        {s.sabqi_quality && <div style={{ fontSize: '0.7rem', fontWeight: 700, color: qualityColors[s.sabqi_quality], marginTop: 4 }}>{qualityLabels[s.sabqi_quality]}</div>}
                                                    </div>
                                                )}
                                                {s.manzil_from && (
                                                    <div style={{ background: 'var(--surface-3)', borderRadius: 10, padding: '10px 12px' }}>
                                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' }}>🔄 Manzil</div>
                                                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.manzil_from} → {s.manzil_to}</div>
                                                        {s.manzil_quality && <div style={{ fontSize: '0.7rem', fontWeight: 700, color: qualityColors[s.manzil_quality], marginTop: 4 }}>{qualityLabels[s.manzil_quality]}</div>}
                                                    </div>
                                                )}
                                                {s.new_lesson_from && (
                                                    <div style={{ background: 'var(--surface-3)', borderRadius: 10, padding: '10px 12px' }}>
                                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' }}>🆕 New Lesson</div>
                                                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.new_lesson_from} → {s.new_lesson_to}</div>
                                                        {s.new_lesson_pages && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.new_lesson_pages} pages</div>}
                                                    </div>
                                                )}
                                            </div>

                                            {s.teacher_notes && (
                                                <div style={{ marginTop: 10, padding: '8px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8 }}>
                                                    <span style={{ fontSize: '0.7rem', color: '#065f46', fontWeight: 700 }}>📝 Notes:</span>
                                                    <p style={{ margin: '3px 0 0', fontSize: '0.8125rem', color: '#047857', lineHeight: 1.5 }}>{s.teacher_notes}</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'enrollment' && (
                        <motion.div key="enrollment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <form onSubmit={submitEnrollment} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                                <h3 style={{ margin: 0, fontWeight: 800, color: 'var(--text-primary)' }}>✏️ Update Hifz Enrollment</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Hifz Teacher *</label>
                                        <select
                                            value={enrollForm.data.teacher_id}
                                            onChange={e => enrollForm.setData('teacher_id', e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface-1)', color: 'var(--text-primary)', fontSize: '0.875rem' }}
                                        >
                                            <option value="">Select teacher...</option>
                                            {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Status</label>
                                        <select
                                            value={enrollForm.data.status}
                                            onChange={e => enrollForm.setData('status', e.target.value)}
                                            style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface-1)', color: 'var(--text-primary)', fontSize: '0.875rem' }}
                                        >
                                            <option value="active">Active</option>
                                            <option value="paused">Paused</option>
                                            <option value="completed">Completed ✅</option>
                                            <option value="withdrawn">Withdrawn</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Juz Completed</label>
                                        <input type="number" min="0" max="30" value={enrollForm.data.juz_completed} onChange={e => enrollForm.setData('juz_completed', e.target.value)}
                                            style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface-1)', color: 'var(--text-primary)', fontSize: '0.875rem' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Total Juz Target</label>
                                        <input type="number" min="1" max="30" value={enrollForm.data.total_juz_target} onChange={e => enrollForm.setData('total_juz_target', e.target.value)}
                                            style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface-1)', color: 'var(--text-primary)', fontSize: '0.875rem' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Target Date</label>
                                        <input type="date" value={enrollForm.data.target_completion_date} onChange={e => enrollForm.setData('target_completion_date', e.target.value)}
                                            style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface-1)', color: 'var(--text-primary)', fontSize: '0.875rem' }} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 16 }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Current Surah</label>
                                        <input type="text" placeholder="e.g. Surah Yusuf" value={enrollForm.data.current_surah} onChange={e => enrollForm.setData('current_surah', e.target.value)}
                                            style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface-1)', color: 'var(--text-primary)', fontSize: '0.875rem' }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Ayah</label>
                                        <input type="number" min="1" placeholder="1" value={enrollForm.data.current_ayah} onChange={e => enrollForm.setData('current_ayah', e.target.value)}
                                            style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface-1)', color: 'var(--text-primary)', fontSize: '0.875rem' }} />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Teacher Notes</label>
                                    <textarea rows={3} placeholder="General notes about this student's Hifz..." value={enrollForm.data.notes} onChange={e => enrollForm.setData('notes', e.target.value)}
                                        style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface-1)', color: 'var(--text-primary)', fontSize: '0.875rem', resize: 'vertical', fontFamily: 'inherit' }} />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button type="submit" disabled={enrollForm.processing}
                                        style={{ padding: '11px 28px', background: '#1e6b3e', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: enrollForm.processing ? 'not-allowed' : 'pointer', fontSize: '0.9375rem' }}>
                                        {enrollForm.processing ? '⏳ Saving...' : '💾 Update Enrollment'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AdminLayout>
    );
}
