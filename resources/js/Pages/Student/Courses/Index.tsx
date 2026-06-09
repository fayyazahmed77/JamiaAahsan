import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import StudentLayout from '@/Layouts/StudentLayout';

interface Course {
    id: number;
    name: string;
    name_ur?: string;
    code: string;
    credit_hours: number;
    description?: string;
    teacher_name: string;
}

interface Enrollment {
    id: number;
    status: 'active' | 'dropped' | 'completed';
    progress_percentage: number;
    grade?: string;
    marks_obtained?: number;
    course: Course;
}

interface Props {
    enrollments: Enrollment[];
}

export default function CoursesIndex({ enrollments }: Props) {
    const cardVariants = {
        hidden: { opacity: 0, y: 12 },
        visible: (idx: number) => ({
            opacity: 1, y: 0,
            transition: { delay: idx * 0.05, duration: 0.3 }
        })
    };

    return (
        <StudentLayout title="My Courses">
            <Head title="My Courses — Student Portal" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Registered Courses
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        Here are the classes and programs you are currently enrolled in for this semester.
                    </p>
                </div>

                {enrollments.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '48px 20px', background: 'var(--surface-2)',
                        border: '1px dashed var(--border)', borderRadius: 14, color: 'var(--text-muted)'
                    }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>📖</div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No Courses Found</div>
                        <div style={{ fontSize: '0.8125rem', marginTop: 4 }}>You are not registered in any course this semester. Please contact academic office.</div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                        {enrollments.map((item, idx) => {
                            const pct = Math.min(100, Math.max(0, item.progress_percentage || 0));
                            return (
                                <motion.div
                                    key={item.id}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={idx}
                                    style={{
                                        background: 'var(--surface-2)', border: '1px solid var(--border)',
                                        borderRadius: 14, padding: '20px', display: 'flex', flexDirection: 'column',
                                        justifyContent: 'space-between', minHeight: 200, boxShadow: 'var(--shadow-sm)',
                                        position: 'relative', overflow: 'hidden'
                                    }}
                                >
                                    <div>
                                        {/* Header */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                                            <span style={{
                                                fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                                                background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-secondary)'
                                            }}>
                                                {item.course.code}
                                            </span>
                                            <span style={{
                                                fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 12,
                                                background: item.status === 'completed' ? '#d1fae5' : '#dbeafe',
                                                color: item.status === 'completed' ? '#065f46' : '#1e3a8a',
                                                textTransform: 'capitalize'
                                            }}>
                                                {item.status}
                                            </span>
                                        </div>

                                        {/* Course Names */}
                                        <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                            {item.course.name}
                                        </h3>
                                        {item.course.name_ur && (
                                            <p style={{ margin: '0 0 10px', fontSize: '1rem', color: '#1e6b3e', textAlign: 'right', direction: 'rtl', fontWeight: 600 }}>
                                                {item.course.name_ur}
                                            </p>
                                        )}

                                        {/* Teacher */}
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                                            <span>👨‍🏫</span>
                                            <span>{item.course.teacher_name}</span>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                                            <span>Course Progress</span>
                                            <strong>{pct}%</strong>
                                        </div>
                                        <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden', marginBottom: 16 }}>
                                            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #1e6b3e, #2ea05c)', borderRadius: 99 }} />
                                        </div>

                                        {/* Action */}
                                        <Link
                                            href={`/student/courses/${item.course.id}`}
                                            style={{
                                                display: 'block', textAlign: 'center', background: '#1e6b3e', color: 'white',
                                                padding: '8px 12px', borderRadius: 8, fontSize: '0.8125rem', fontWeight: 700,
                                                textDecoration: 'none', transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#1a5c33'}
                                            onMouseLeave={e => e.currentTarget.style.background = '#1e6b3e'}
                                        >
                                            View Course Class
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </StudentLayout>
    );
}
