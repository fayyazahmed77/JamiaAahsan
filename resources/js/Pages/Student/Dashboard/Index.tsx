import React from 'react';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import StudentLayout from '@/Layouts/StudentLayout';
import type {
    StudentUser, IslamicContent, JourneyStats,
    DashboardAlert, AttendanceSummary, StudentNotification
} from '@/types/student';

interface Props {
    student: StudentUser;
    islamic_content: IslamicContent;
    journey_stats: JourneyStats;
    alerts: DashboardAlert[];
    unread_count: number;
    today_classes: any[];
    courses: any[];
    assignments: any[];
    attendance: AttendanceSummary;
    upcoming_exams: any[];
    hifz: any | null;
}

// ─── Widget: Welcome Banner ────────────────────────────────────────────────
function WelcomeBanner({ student, journey_stats }: { student: StudentUser; journey_stats: JourneyStats }) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

    return (
        <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
                background: 'linear-gradient(135deg, #1e6b3e 0%, #2ea05c 60%, #1a5c33 100%)',
                borderRadius: 16, padding: '24px 28px', color: 'white',
                display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
                boxShadow: '0 8px 32px rgba(30,107,62,0.35)',
            }}
        >
            {/* Avatar */}
            <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                border: '3px solid rgba(255,255,255,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', flexShrink: 0,
                fontSize: 28, fontWeight: 700,
            }}>
                {student.profile_photo_url
                    ? <img src={student.profile_photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (student.name?.[0] || 'S').toUpperCase()}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ margin: '0 0 2px', fontSize: '0.875rem', opacity: 0.8 }}>
                    🕌 Assalamu Alaikum — {greeting}
                </p>
                <h1 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 800 }}>
                    {student.name}
                </h1>
                <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.75 }}>
                    Welcome back to Jamia Arabia Ahsan Ul Uloom
                </p>
            </div>

            {/* Stats pills */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Student ID', value: student.student_id_number },
                    { label: 'Program', value: journey_stats.program || 'N/A' },
                    { label: 'Year', value: `Year ${student.current_year}` },
                    { label: 'Type', value: student.student_type === 'online' ? '🌐 Online' : '🏫 Onsite' },
                ].map(pill => (
                    <div key={pill.label} style={{
                        background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                        borderRadius: 10, padding: '8px 14px', textAlign: 'center',
                        border: '1px solid rgba(255,255,255,0.2)',
                    }}>
                        <div style={{ fontSize: '0.65rem', opacity: 0.75, marginBottom: 2 }}>{pill.label}</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{pill.value}</div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// ─── Widget: Islamic Inspiration ──────────────────────────────────────────
function IslamicInspiration({ islamic_content }: { islamic_content: IslamicContent }) {
    if (!islamic_content.verse && !islamic_content.hadith) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
                background: 'linear-gradient(135deg, rgba(30,107,62,0.06), rgba(46,160,92,0.03))',
                border: '1px solid rgba(30,107,62,0.2)',
                borderRadius: 14, padding: '20px 24px',
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16,
            }}
        >
            {/* Quran Verse */}
            {islamic_content.verse && (
                <div style={{ borderRight: '1px solid rgba(30,107,62,0.15)', paddingRight: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <span style={{ fontSize: 20 }}>📖</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e6b3e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Quran Verse of the Day
                        </span>
                    </div>
                    {islamic_content.verse.arabic_text && (
                        <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'var(--text-primary)', textAlign: 'right', direction: 'rtl', marginBottom: 8 }}>
                            {islamic_content.verse.arabic_text}
                        </p>
                    )}
                    {islamic_content.verse.translation_en && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: '0 0 4px' }}>
                            "{islamic_content.verse.translation_en}"
                        </p>
                    )}
                    {islamic_content.verse.reference && (
                        <p style={{ fontSize: '0.75rem', color: '#1e6b3e', fontWeight: 600, margin: 0 }}>
                            — {islamic_content.verse.reference}
                        </p>
                    )}
                </div>
            )}

            {/* Hadith */}
            {islamic_content.hadith && (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <span style={{ fontSize: 20 }}>📜</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e6b3e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Hadith of the Day
                        </span>
                    </div>
                    {islamic_content.hadith.text_en && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: '0 0 4px' }}>
                            {islamic_content.hadith.text_en}
                        </p>
                    )}
                    {islamic_content.hadith.source && (
                        <p style={{ fontSize: '0.75rem', color: '#1e6b3e', fontWeight: 600, margin: '4px 0 0' }}>
                            — {islamic_content.hadith.source}
                            {islamic_content.hadith.grade && <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}> ({islamic_content.hadith.grade})</span>}
                        </p>
                    )}
                    {islamic_content.reminder && (
                        <div style={{
                            marginTop: 12, padding: '8px 12px',
                            background: 'rgba(30,107,62,0.1)', borderRadius: 8,
                            fontSize: '0.8125rem', color: '#1e6b3e',
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                            🌸 <em>{islamic_content.reminder}</em>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
}

// ─── Widget: Academic Alerts ───────────────────────────────────────────────
function AcademicAlerts({ alerts }: { alerts: DashboardAlert[] }) {
    if (alerts.length === 0) return null;

    const colors: Record<string, { bg: string; border: string; text: string }> = {
        warning: { bg: '#fef9c3', border: '#fbbf24', text: '#92400e' },
        error:   { bg: '#fee2e2', border: '#f87171', text: '#7f1d1d' },
        info:    { bg: '#dbeafe', border: '#60a5fa', text: '#1e3a5f' },
        success: { bg: '#d1fae5', border: '#34d399', text: '#065f46' },
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alerts.map((alert, i) => {
                const c = colors[alert.type] || colors.info;
                return (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 16px', borderRadius: 10,
                            background: c.bg, border: `1px solid ${c.border}`,
                            color: c.text, fontSize: '0.875rem',
                        }}
                    >
                        <span style={{ fontSize: 18 }}>⚠️</span>
                        <span>{alert.message}</span>
                    </motion.div>
                );
            })}
        </div>
    );
}

// ─── Widget: My Islamic Journey ────────────────────────────────────────────
function IslamicJourneyCard({ stats }: { stats: JourneyStats }) {
    const pct = Math.min(100, Math.max(0, stats.progress_percentage || 0));

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '20px 22px',
            }}
        >
            <h3 style={{ margin: '0 0 16px', fontSize: '0.875rem', fontWeight: 700, color: '#1e6b3e', display: 'flex', alignItems: 'center', gap: 6 }}>
                🎓 My Islamic Journey
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                {[
                    { label: 'Current Program', value: stats.program || 'N/A' },
                    { label: 'Year / Semester', value: `Year ${stats.current_year}, Sem ${stats.current_semester}` },
                    { label: 'Total Semesters', value: `${stats.current_semester} of ${stats.total_semesters}` },
                    { label: 'Expected Grad.', value: stats.expected_graduation || 'N/A' },
                ].map(item => (
                    <div key={item.label} style={{
                        background: 'var(--surface-3)', borderRadius: 10, padding: '12px 14px',
                    }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 3, fontWeight: 600 }}>{item.label}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</div>
                    </div>
                ))}
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    <span>Academic Progress</span>
                    <span style={{ fontWeight: 700, color: '#1e6b3e' }}>{pct}%</span>
                </div>
                <div style={{ height: 10, background: 'var(--surface-3)', borderRadius: 999, overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
                        style={{ height: '100%', background: 'linear-gradient(90deg, #1e6b3e, #2ea05c)', borderRadius: 999 }}
                    />
                </div>
            </div>
        </motion.div>
    );
}

// ─── Widget: Today's Classes ───────────────────────────────────────────────
function TodayClasses({ classes }: { classes: any[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px' }}
        >
            <h3 style={{ margin: '0 0 14px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                📅 Today's Classes
            </h3>
            {classes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
                    No classes scheduled today — enjoy your free time!
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {classes.map((cls, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '10px 14px', borderRadius: 10,
                            background: 'var(--surface-3)', border: '1px solid var(--border)',
                        }}>
                            <div style={{ width: 4, height: 36, borderRadius: 2, background: '#1e6b3e', flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{cls.subject}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cls.teacher} · {cls.time}</div>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cls.room}</span>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}

// ─── Widget: Attendance Summary ────────────────────────────────────────────
function AttendanceWidget({ attendance }: { attendance: AttendanceSummary }) {
    const rate = attendance.rate || 0;
    const isWarning = rate < 80 && rate > 0;
    const rateColor = rate >= 85 ? '#1e6b3e' : rate >= 75 ? '#f59e0b' : '#ef4444';

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px' }}
        >
            <h3 style={{ margin: '0 0 14px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                ✅ Attendance
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Rate circle */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: rateColor }}>{rate}%</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Attendance Rate</div>
                </div>
                {/* Stats */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                        { label: 'Present', value: attendance.present, color: '#1e6b3e' },
                        { label: 'Absent', value: attendance.absent, color: '#ef4444' },
                        { label: 'Leave', value: attendance.leave, color: '#f59e0b' },
                        { label: 'Total', value: attendance.total, color: 'var(--text-secondary)' },
                    ].map(s => (
                        <div key={s.label} style={{
                            padding: '8px 10px', borderRadius: 8,
                            background: 'var(--surface-3)', textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '1rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
            {isWarning && (
                <div style={{
                    marginTop: 12, padding: '8px 12px', borderRadius: 8,
                    background: '#fef3c7', border: '1px solid #fbbf24',
                    fontSize: '0.8125rem', color: '#92400e',
                }}>
                    ⚠️ Attendance below 80% — please attend classes regularly.
                </div>
            )}
        </motion.div>
    );
}

// ─── Widget: Pending Assignments ───────────────────────────────────────────
function AssignmentAlerts({ assignments }: { assignments: any[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px' }}
        >
            <h3 style={{ margin: '0 0 14px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                📝 Assignments
            </h3>
            {assignments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <div style={{ fontSize: 32, marginBottom: 6 }}>🎯</div>
                    No pending assignments. Great work!
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {assignments.map((a, i) => (
                        <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '10px 14px', borderRadius: 10,
                            background: 'var(--surface-3)', border: '1px solid var(--border)',
                        }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{a.title}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.course}</div>
                            </div>
                            <span style={{
                                fontSize: '0.7rem', fontWeight: 700,
                                padding: '3px 8px', borderRadius: 6,
                                background: a.status === 'late' ? '#fee2e2' : '#fef9c3',
                                color: a.status === 'late' ? '#b91c1c' : '#92400e',
                            }}>
                                {a.due}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}

// ─── Widget: Upcoming Exams ────────────────────────────────────────────────
function UpcomingExams({ exams }: { exams: any[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px' }}
        >
            <h3 style={{ margin: '0 0 14px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                📋 Upcoming Exams
            </h3>
            {exams.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <div style={{ fontSize: 32, marginBottom: 6 }}>📅</div>
                    No upcoming exams scheduled.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {exams.map((e, i) => (
                        <div key={i} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '10px 14px', borderRadius: 10, background: 'var(--surface-3)',
                        }}>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{e.subject}</div>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{e.date}</span>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────
export default function StudentDashboard({
    student, islamic_content, journey_stats, alerts,
    today_classes, courses, assignments, attendance, upcoming_exams, hifz
}: Props) {
    return (
        <StudentLayout title="Dashboard">
            <Head title="Dashboard — Student Portal" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* 1. Welcome Banner */}
                <WelcomeBanner student={student} journey_stats={journey_stats} />

                {/* 2. Islamic Inspiration */}
                <IslamicInspiration islamic_content={islamic_content} />

                {/* 3. Academic Alerts */}
                <AcademicAlerts alerts={alerts} />

                {/* 4. Islamic Journey Card */}
                <IslamicJourneyCard stats={journey_stats} />

                {/* 5 & 6. Classes + Attendance side by side */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                    <TodayClasses classes={today_classes} />
                    <AttendanceWidget attendance={attendance} />
                </div>

                {/* 7 & 8. Assignments + Upcoming Exams side by side */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                    <AssignmentAlerts assignments={assignments} />
                    <UpcomingExams exams={upcoming_exams} />
                </div>

            </div>
        </StudentLayout>
    );
}
