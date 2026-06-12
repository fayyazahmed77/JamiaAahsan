import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import StudentLayout from '@/Layouts/StudentLayout';

interface Teacher {
    name: string;
    urdu_name?: string;
}

interface Schedule {
    day_of_week: number;
    start_time: string;
    end_time: string;
    type: 'onsite' | 'online';
    meeting_url?: string;
    room?: string;
}

interface Course {
    id: number;
    name: string;
    name_ur?: string;
    code: string;
    credit_hours: number;
    description?: string;
    teacher?: Teacher | null;
    schedules: Schedule[];
}

interface Assignment {
    id: number;
    title: string;
    title_ur?: string;
    description?: string;
    due_date: string;
    max_marks: number;
    submission?: {
        id: number;
        status: string;
        marks_obtained: number;
        submitted_at: string;
    } | null;
}

interface AttendanceRecord {
    date: string;
    status: 'present' | 'absent' | 'leave' | 'late' | 'excused';
    notes?: string;
}

interface AttendanceSummary {
    total: number;
    present: number;
    absent: number;
    leave: number;
    rate: number;
    records: AttendanceRecord[];
}

interface CourseMaterial {
    id: number;
    title: string;
    type: 'pdf' | 'video' | 'audio' | 'link' | 'document' | string;
    url?: string;
    file_url?: string;
    size?: string;
    created_at?: string;
}

interface Props {
    enrollment: {
        id: number;
        status: string;
        progress_percentage: number;
        grade?: string;
        marks_obtained?: number;
    };
    course: Course;
    assignments: Assignment[];
    attendance: AttendanceSummary;
    materials: CourseMaterial[];
}

export default function CourseShow({ enrollment, course, assignments, attendance, materials }: Props) {
    const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'attendance' | 'schedule' | 'materials'>('overview');

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'present': return { bg: '#d1fae5', color: '#065f46', label: 'Present' };
            case 'absent': return { bg: '#fee2e2', color: '#b91c1c', label: 'Absent' };
            case 'leave': return { bg: '#fef3c7', color: '#d97706', label: 'On Leave' };
            case 'late': return { bg: '#fef3c7', color: '#d97706', label: 'Late' };
            case 'excused': return { bg: '#f3f4f6', color: '#4b5563', label: 'Excused' };
            default: return { bg: '#f3f4f6', color: '#4b5563', label: status };
        }
    };

    const getSubmissionStatusStyle = (sub: any) => {
        if (!sub) return { bg: '#fef9c3', color: '#854d0e', label: 'Pending' };
        if (sub.status === 'graded') return { bg: '#d1fae5', color: '#065f46', label: `Graded (${sub.marks_obtained} marks)` };
        if (sub.status === 'late') return { bg: '#fee2e2', color: '#991b1b', label: 'Late Submission' };
        return { bg: '#e0f2fe', color: '#075985', label: 'Submitted' };
    };

    const tabStyle = (tab: typeof activeTab) => ({
        padding: '12px 20px',
        fontSize: '0.875rem',
        fontWeight: 600,
        color: activeTab === tab ? '#1e6b3e' : 'var(--text-muted)',
        background: activeTab === tab ? 'var(--surface-3)' : 'transparent',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        whiteSpace: 'nowrap' as const,
        transition: 'all 0.2s ease',
    });

    const cardStyle = {
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '24px',
    };

    return (
        <StudentLayout title={course.name}>
            <Head title={`${course.name} — Student Portal`} />

            <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Course Main Banner */}
                <div style={{
                    background: 'linear-gradient(135deg, #164e2d 0%, #1e6b3e 100%)',
                    borderRadius: 16, padding: '32px 28px', color: 'white',
                    boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: 6, fontWeight: 700, letterSpacing: '0.05em' }}>
                            {course.code} · {course.credit_hours} Credits
                        </span>
                        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '10px 0 4px' }}>
                            {course.name}
                        </h1>
                        {course.name_ur && (
                            <h2 style={{ fontSize: '1.75rem', color: '#6ee7b7', margin: '0 0 16px', direction: 'rtl', textAlign: 'right', fontWeight: 600 }}>
                                {course.name_ur}
                            </h2>
                        )}

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: '0.875rem', opacity: 0.9 }}>
                            <div>Teacher: <strong>{course.teacher?.name ?? 'Mufti / Teacher'}</strong></div>
                            <div>Status: <strong style={{ textTransform: 'capitalize' }}>{enrollment.status}</strong></div>
                            <div>Academic Progress: <strong>{enrollment.progress_percentage}%</strong></div>
                        </div>
                    </div>
                    <div style={{ position: 'absolute', bottom: -30, right: -10, fontSize: 160, opacity: 0.06, pointerEvents: 'none' }}>
                        📖
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div style={{
                    display: 'flex', gap: 8, overflowX: 'auto',
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    padding: 6, borderRadius: 10
                }}>
                    <button onClick={() => setActiveTab('overview')} style={tabStyle('overview')}>Overview</button>
                    <button onClick={() => setActiveTab('assignments')} style={tabStyle('assignments')}>Assignments</button>
                    <button onClick={() => setActiveTab('attendance')} style={tabStyle('attendance')}>Attendance</button>
                    <button onClick={() => setActiveTab('schedule')} style={tabStyle('schedule')}>Class Timings</button>
                    <button onClick={() => setActiveTab('materials')} style={tabStyle('materials')}>Study Resources</button>
                </div>

                {/* Tab Content Panels */}
                <div style={{ minHeight: 300 }}>
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                                {/* Course Details Card */}
                                <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e6b3e' }}>Description</h3>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                        {course.description || 'No description uploaded for this course yet.'}
                                    </p>
                                </div>

                                {/* Grade Card */}
                                <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1e6b3e' }}>Grades & Results</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                        <div style={{ background: 'var(--surface-3)', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{enrollment.grade || 'N/A'}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Grade Earned</div>
                                        </div>
                                        <div style={{ background: 'var(--surface-3)', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{enrollment.marks_obtained !== null ? `${enrollment.marks_obtained}%` : 'N/A'}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Total Marks</div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                        Grades are assigned automatically after final exams. Contact mufti if marks require revision.
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'assignments' && (
                            <motion.div key="assignments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Homework Assignments</h3>
                                {assignments.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                                        No homework assigned. Enjoy your studies!
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {assignments.map(item => {
                                            const subStyle = getSubmissionStatusStyle(item.submission);
                                            return (
                                                <div key={item.id} style={{
                                                    background: 'var(--surface-3)', border: '1px solid var(--border)',
                                                    borderRadius: 10, padding: '14px 18px', display: 'flex',
                                                    justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap'
                                                }}>
                                                    <div>
                                                        <h4 style={{ margin: '0 0 4px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</h4>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                            Due: {new Date(item.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} · Max Marks: {item.max_marks}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                         <span style={{
                                                             fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px',
                                                             borderRadius: 12, color: subStyle.color,
                                                             backgroundColor: subStyle.bg // ensure styles apply properly
                                                         }}>
                                                            {subStyle.label}
                                                        </span>
                                                        <Link
                                                            href={`/student/assignments/${item.id}`}
                                                            style={{
                                                                background: '#1e6b3e', color: 'white', textDecoration: 'none',
                                                                padding: '6px 14px', borderRadius: 6, fontSize: '0.8125rem', fontWeight: 700
                                                            }}
                                                        >
                                                            Open
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'attendance' && (
                            <motion.div key="attendance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {/* Stats Cards */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                                    {[
                                        { label: 'Attendance Rate', value: `${attendance.rate}%`, color: attendance.rate >= 80 ? '#1e6b3e' : '#ef4444' },
                                        { label: 'Present', value: attendance.present, color: '#1e6b3e' },
                                        { label: 'Absent', value: attendance.absent, color: '#ef4444' },
                                        { label: 'On Leave', value: attendance.leave, color: '#f59e0b' },
                                    ].map(stat => (
                                        <div key={stat.label} style={{ ...cardStyle, textAlign: 'center', padding: '16px' }}>
                                            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{stat.label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Attendance Log Table */}
                                <div style={cardStyle}>
                                    <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>Attendance Logs</h3>
                                    {attendance.records.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                                            No attendance records registered yet for this course.
                                        </div>
                                    ) : (
                                        <div style={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                                                <thead>
                                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                                        <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Date</th>
                                                        <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Status</th>
                                                        <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Notes</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {attendance.records.map((rec, i) => {
                                                        const badge = getStatusStyle(rec.status);
                                                        return (
                                                            <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                                                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{rec.date}</td>
                                                                <td style={{ padding: '10px 12px' }}>
                                                                    <span style={{
                                                                        fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px',
                                                                        borderRadius: 6, background: badge.bg, color: badge.color
                                                                    }}>{badge.label}</span>
                                                                </td>
                                                                <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{rec.notes || '—'}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'schedule' && (
                            <motion.div key="schedule" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Class Schedules</h3>
                                {course.schedules.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                                        No schedules defined for this course.
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                                        {course.schedules.map((item, i) => (
                                            <div key={i} style={{
                                                background: 'var(--surface-3)', border: '1px solid var(--border)',
                                                borderRadius: 10, padding: '16px', display: 'flex', flexDirection: 'column', gap: 8
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <strong style={{ fontSize: '0.9375rem', color: '#1e6b3e' }}>{days[item.day_of_week]}</strong>
                                                    <span style={{
                                                        fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                                                        background: item.type === 'online' ? '#e0f2fe' : '#f3f4f6',
                                                        color: item.type === 'online' ? '#0369a1' : '#4b5563',
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        {item.type}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                                    🕒 {item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)}
                                                </div>
                                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                                    {item.type === 'online' ? (
                                                        item.meeting_url ? (
                                                            <a href={item.meeting_url} target="_blank" rel="noreferrer" style={{ color: '#1e6b3e', fontWeight: 700 }}>
                                                                🔗 Join Live Class
                                                            </a>
                                                        ) : 'Online Class Link Pending'
                                                    ) : (
                                                        <span>Location: 🏢 <strong>{item.room || 'Classroom'}</strong></span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'materials' && (
                            <motion.div key="materials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Study Resources</h3>
                                <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                                    <div style={{ fontSize: 40, marginBottom: 8 }}>📚</div>
                                    <div style={{ fontWeight: 600 }}>Resources coming soon</div>
                                    <p style={{ fontSize: '0.8125rem', margin: '4px 0 0' }}>Syllabus books and audio archives will be published by teachers here in Phase 3.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </StudentLayout>
    );
}
