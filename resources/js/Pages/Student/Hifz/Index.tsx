import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import StudentLayout from '@/Layouts/StudentLayout';

interface HifzEnrollment {
    id: number;
    start_date: string;
    target_completion_date: string | null;
    total_juz_target: number;
    juz_completed: number;
    current_surah: string | null;
    current_ayah: number | null;
    status: string;
    notes: string | null;
    teacher_name: string;
}

interface HifzSession {
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

interface Props {
    enrollment: HifzEnrollment | null;
    sessions: {
        data: HifzSession[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

// All 30 Juz names
const JUZ_NAMES = [
    'Alif Lam Meem', 'Sayaqool', 'Tilkal Rusul', 'Lan Tanaloo', 'Wal Mohsanaat',
    'La Yuhibbullah', 'Wa Iza Samiu', 'Wa Law Annana', 'Qalal Malao', 'Wa Alamu',
    'Yatazeroon', 'Wa Mamin Dabbatin', 'Wa Ma Ubarrio', 'Rubama', 'Subhanallazi',
    'Qal Alam', 'Iqtaraba', 'Qad Aflaha', 'Wa Qalallazina', 'Amman Khalaq',
    'Utlu Ma Oohi', 'Wa Man Yaqnut', 'Wa Mali', 'Faman Azlam', 'Ilayhi Yuraddu',
    'Ha Meem', 'Qala Fama Khatbukum', 'Qad Sami Allah', 'Tabarakallazi', 'Amma',
];

const qualityColors: Record<string, string> = {
    excellent: '#10b981',
    good: '#3b82f6',
    average: '#f59e0b',
    needs_revision: '#ef4444',
};
const qualityLabels: Record<string, string> = {
    excellent: '⭐ Excellent',
    good: '✅ Good',
    average: '⚠️ Average',
    needs_revision: '🔄 Needs Revision',
};

export default function HifzIndex({ enrollment, sessions }: Props) {
    const [activeTab, setActiveTab] = useState<'progress' | 'sessions'>('progress');

    const progressPct = enrollment
        ? Math.round((enrollment.juz_completed / enrollment.total_juz_target) * 100)
        : 0;

    const tabStyle = (tab: typeof activeTab) => ({
        padding: '10px 24px',
        fontSize: '0.875rem',
        fontWeight: 600,
        color: activeTab === tab ? 'white' : 'var(--text-muted)',
        background: activeTab === tab ? '#1e6b3e' : 'transparent',
        border: activeTab === tab ? 'none' : '1px solid var(--border)',
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    });

    return (
        <StudentLayout title="Hifz Progress">
            <Head title="Hifz Progress — Student Portal" />

            <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Hero Header */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'linear-gradient(135deg, #1e3a5f 0%, #1e6b3e 100%)',
                        borderRadius: 20, padding: '28px 32px', color: 'white',
                        boxShadow: '0 8px 32px rgba(30,58,95,0.35)',
                        position: 'relative', overflow: 'hidden',
                    }}
                >
                    {/* Decorative Arabic pattern overlay */}
                    <div style={{
                        position: 'absolute', inset: 0, opacity: 0.06,
                        backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 2px, transparent 0, transparent 50%)',
                        backgroundSize: '20px 20px',
                    }} />
                    <div style={{ position: 'relative' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>🕌 Hifz al-Quran</div>
                        <h1 style={{ margin: '0 0 4px', fontSize: '1.75rem', fontWeight: 900 }}>Quran Memorization Progress</h1>
                        <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
                            «اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ» — Iqra bismi rabbika allathee khalaq
                        </p>

                        {enrollment ? (
                            <div style={{ display: 'flex', gap: 32, marginTop: 22, flexWrap: 'wrap' }}>
                                <div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{enrollment.juz_completed}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>Juz Completed</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{enrollment.total_juz_target - enrollment.juz_completed}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>Juz Remaining</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{progressPct}%</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>Complete</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{enrollment.current_surah ?? '—'}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>Current Surah</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '1rem', fontWeight: 600 }}>{enrollment.teacher_name}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>Hifz Teacher</div>
                                </div>
                            </div>
                        ) : (
                            <p style={{ marginTop: 16, opacity: 0.85, fontSize: '0.9375rem' }}>
                                You are not yet enrolled in the Hifz programme. Contact administration to register.
                            </p>
                        )}

                        {/* Progress Bar */}
                        {enrollment && (
                            <div style={{ marginTop: 18 }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 100, height: 10, overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPct}%` }}
                                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                                        style={{ height: '100%', background: 'linear-gradient(90deg, #6ee7b7, #34d399)', borderRadius: 100 }}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.75rem', opacity: 0.75 }}>
                                    <span>0 Juz</span>
                                    <span>{enrollment.total_juz_target} Juz</span>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 10 }}>
                    <button style={tabStyle('progress')} onClick={() => setActiveTab('progress')}>
                        📊 Juz Grid
                    </button>
                    <button style={tabStyle('sessions')} onClick={() => setActiveTab('sessions')}>
                        📋 Session History ({sessions.total})
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'progress' ? (
                        <motion.div key="grid" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            {enrollment ? (
                                <>
                                    {/* 30-Juz Visual Grid */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                        gap: 12,
                                    }}>
                                        {JUZ_NAMES.map((name, idx) => {
                                            const juzNum = idx + 1;
                                            const isCompleted = juzNum <= enrollment.juz_completed;
                                            const isCurrent = juzNum === enrollment.juz_completed + 1;

                                            return (
                                                <motion.div
                                                    key={juzNum}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: idx * 0.02 }}
                                                    style={{
                                                        background: isCompleted
                                                            ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)'
                                                            : isCurrent
                                                                ? 'linear-gradient(135deg, #fef3c7, #fde68a)'
                                                                : 'var(--surface-2)',
                                                        border: `2px solid ${isCompleted ? '#34d399' : isCurrent ? '#f59e0b' : 'var(--border)'}`,
                                                        borderRadius: 14,
                                                        padding: '14px 12px',
                                                        textAlign: 'center',
                                                        position: 'relative',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    <div style={{
                                                        fontSize: '1.5rem', fontWeight: 900,
                                                        color: isCompleted ? '#059669' : isCurrent ? '#d97706' : 'var(--text-muted)',
                                                        marginBottom: 4,
                                                    }}>
                                                        {isCompleted ? '✅' : isCurrent ? '📖' : juzNum}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isCompleted ? '#065f46' : isCurrent ? '#92400e' : 'var(--text-secondary)' }}>
                                                        Juz {juzNum}
                                                    </div>
                                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                                        {name}
                                                    </div>
                                                    {isCurrent && (
                                                        <div style={{
                                                            position: 'absolute', top: 6, right: 6,
                                                            background: '#f59e0b', color: 'white', borderRadius: 20,
                                                            fontSize: '0.6rem', fontWeight: 800, padding: '2px 6px',
                                                        }}>
                                                            NOW
                                                        </div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Info / Notes */}
                                    {enrollment.notes && (
                                        <div style={{ marginTop: 16, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px' }}>
                                            <strong style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>📝 Teacher Notes:</strong>
                                            <p style={{ margin: '6px 0 0', color: 'var(--text-primary)', lineHeight: 1.6, fontSize: '0.875rem' }}>{enrollment.notes}</p>
                                        </div>
                                    )}

                                    {/* Target Date */}
                                    {enrollment.target_completion_date && (
                                        <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 18px' }}>
                                            <span style={{ fontSize: '1.25rem' }}>🎯</span>
                                            <div>
                                                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Target Completion</div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                                                    {new Date(enrollment.target_completion_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div style={{
                                    textAlign: 'center', padding: '64px 20px',
                                    background: 'var(--surface-2)', border: '1px dashed var(--border)',
                                    borderRadius: 18, color: 'var(--text-muted)'
                                }}>
                                    <div style={{ fontSize: 64, marginBottom: 16 }}>🕌</div>
                                    <h3 style={{ color: 'var(--text-primary)' }}>Not Enrolled in Hifz</h3>
                                    <p style={{ maxWidth: 340, margin: '0 auto' }}>
                                        You have not yet been registered for the Hifz al-Quran programme.
                                        Please contact your administration to get enrolled.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="sessions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            {sessions.data.length === 0 ? (
                                <div style={{
                                    textAlign: 'center', padding: '48px 20px',
                                    background: 'var(--surface-2)', border: '1px dashed var(--border)',
                                    borderRadius: 14, color: 'var(--text-muted)'
                                }}>
                                    <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
                                    <div style={{ fontWeight: 600 }}>No Sessions Recorded Yet</div>
                                    <div style={{ fontSize: '0.8125rem', marginTop: 4 }}>Sessions will appear here after your teacher records them.</div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {sessions.data.map((session, idx) => (
                                        <motion.div
                                            key={session.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.04 }}
                                            style={{
                                                background: 'var(--surface-2)', border: '1px solid var(--border)',
                                                borderRadius: 16, padding: '18px 22px',
                                                boxShadow: 'var(--shadow-sm)',
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                                                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
                                                    📅 {new Date(session.session_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </div>
                                                {session.mistakes_count !== null && session.mistakes_count !== undefined && (
                                                    <span style={{
                                                        padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
                                                        background: session.mistakes_count === 0 ? '#d1fae5' : session.mistakes_count < 5 ? '#fef3c7' : '#fee2e2',
                                                        color: session.mistakes_count === 0 ? '#065f46' : session.mistakes_count < 5 ? '#92400e' : '#991b1b',
                                                    }}>
                                                        {session.mistakes_count === 0 ? '✨ No Mistakes' : `${session.mistakes_count} Mistakes`}
                                                    </span>
                                                )}
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                                                {/* Sabqi */}
                                                {session.sabqi_from && (
                                                    <div style={{ background: 'var(--surface-3)', borderRadius: 10, padding: '12px 14px' }}>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                            📖 Sabqi (Today's Lesson)
                                                        </div>
                                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                                                            {session.sabqi_from} → {session.sabqi_to}
                                                        </div>
                                                        {session.sabqi_pages && (
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                                                {session.sabqi_pages} page{session.sabqi_pages !== 1 ? 's' : ''}
                                                            </div>
                                                        )}
                                                        {session.sabqi_quality && (
                                                            <div style={{
                                                                marginTop: 6, fontSize: '0.7rem', fontWeight: 700,
                                                                color: qualityColors[session.sabqi_quality],
                                                            }}>
                                                                {qualityLabels[session.sabqi_quality]}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Manzil */}
                                                {session.manzil_from && (
                                                    <div style={{ background: 'var(--surface-3)', borderRadius: 10, padding: '12px 14px' }}>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                            🔄 Manzil (Revision)
                                                        </div>
                                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                                                            {session.manzil_from} → {session.manzil_to}
                                                        </div>
                                                        {session.manzil_quality && (
                                                            <div style={{
                                                                marginTop: 6, fontSize: '0.7rem', fontWeight: 700,
                                                                color: qualityColors[session.manzil_quality],
                                                            }}>
                                                                {qualityLabels[session.manzil_quality]}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* New Lesson */}
                                                {session.new_lesson_from && (
                                                    <div style={{ background: 'var(--surface-3)', borderRadius: 10, padding: '12px 14px' }}>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                            🆕 New Lesson
                                                        </div>
                                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                                                            {session.new_lesson_from} → {session.new_lesson_to}
                                                        </div>
                                                        {session.new_lesson_pages && (
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                                                {session.new_lesson_pages} page{session.new_lesson_pages !== 1 ? 's' : ''}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {session.teacher_notes && (
                                                <div style={{ marginTop: 12, padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8 }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: 700 }}>📝 Teacher Notes:</span>
                                                    <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: '#047857', lineHeight: 1.5 }}>{session.teacher_notes}</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </StudentLayout>
    );
}
