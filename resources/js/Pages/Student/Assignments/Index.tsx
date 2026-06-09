import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import StudentLayout from '@/Layouts/StudentLayout';

interface Assignment {
    id: number;
    title: string;
    title_ur?: string;
    due_date: string;
    max_marks: number;
    course: {
        id: number;
        name: string;
        name_ur?: string;
    };
    teacher_name: string;
    submission?: {
        id: number;
        status: string;
        submitted_at: string;
        marks_obtained: number | null;
        feedback?: string;
        file_name?: string;
        file_url?: string;
    } | null;
}

interface Props {
    assignments: Assignment[];
}

export default function AssignmentsIndex({ assignments }: Props) {
    const [filter, setFilter] = useState<'pending' | 'submitted' | 'graded'>('pending');

    const getFilteredAssignments = () => {
        return assignments.filter(item => {
            const hasSub = !!item.submission;
            if (filter === 'pending') {
                return !hasSub || item.submission?.status === 'pending';
            }
            if (filter === 'graded') {
                return hasSub && item.submission?.status === 'graded';
            }
            // submitted tab includes 'submitted' and 'late' statuses
            return hasSub && (item.submission?.status === 'submitted' || item.submission?.status === 'late');
        });
    };

    const currentList = getFilteredAssignments();

    const isOverdue = (dueDateStr: string) => {
        return new Date() > new Date(dueDateStr);
    };

    const tabStyle = (tab: typeof filter) => ({
        padding: '12px 20px',
        fontSize: '0.875rem',
        fontWeight: 600,
        color: filter === tab ? '#1e6b3e' : 'var(--text-muted)',
        background: filter === tab ? 'var(--surface-3)' : 'transparent',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    });

    return (
        <StudentLayout title="My Assignments">
            <Head title="Assignments — Student Portal" />

            <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Academic Assignments
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        Manage and submit your home assignments and research papers.
                    </p>
                </div>

                {/* Status Switcher Tabs */}
                <div style={{
                    display: 'flex', gap: 6,
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    padding: 6, borderRadius: 10
                }}>
                    <button onClick={() => setFilter('pending')} style={tabStyle('pending')}>
                        Todo / Pending ({assignments.filter(a => !a.submission || a.submission.status === 'pending').length})
                    </button>
                    <button onClick={() => setFilter('submitted')} style={tabStyle('submitted')}>
                        Submitted ({assignments.filter(a => a.submission && (a.submission.status === 'submitted' || a.submission.status === 'late')).length})
                    </button>
                    <button onClick={() => setFilter('graded')} style={tabStyle('graded')}>
                        Graded ({assignments.filter(a => a.submission && a.submission.status === 'graded').length})
                    </button>
                </div>

                {/* Assignments List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <AnimatePresence mode="wait">
                        {currentList.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    textAlign: 'center', padding: '48px 20px', background: 'var(--surface-2)',
                                    border: '1px dashed var(--border)', borderRadius: 14, color: 'var(--text-muted)'
                                }}
                            >
                                <div style={{ fontSize: 40, marginBottom: 8 }}>🎯</div>
                                <div style={{ fontWeight: 600 }}>No Assignments Found</div>
                                <div style={{ fontSize: '0.8125rem', marginTop: 4 }}>
                                    {filter === 'pending' ? 'Hooray! You have completed all assignments.' : 'No items match this category.'}
                                </div>
                            </motion.div>
                        ) : (
                            currentList.map((item, idx) => {
                                const overdue = !item.submission && isOverdue(item.due_date);
                                const isGraded = item.submission?.status === 'graded';
                                
                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: idx * 0.04 }}
                                        style={{
                                            background: 'var(--surface-2)', border: '1px solid var(--border)',
                                            borderRadius: 14, padding: '18px 20px', display: 'flex',
                                            justifyContent: 'space-between', alignItems: 'center', gap: 16,
                                            flexWrap: 'wrap', boxShadow: 'var(--shadow-sm)'
                                        }}
                                    >
                                        <div>
                                            <span style={{ fontSize: '0.75rem', background: 'var(--surface-3)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: 4, color: 'var(--text-secondary)' }}>
                                                {item.course.name}
                                            </span>

                                            <h3 style={{ margin: '8px 0 4px', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                {item.title}
                                            </h3>

                                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', gap: 12 }}>
                                                <span>Teacher: {item.teacher_name}</span>
                                                <span>•</span>
                                                <span style={{ color: overdue ? '#ef4444' : 'inherit', fontWeight: overdue ? 600 : 400 }}>
                                                    {overdue ? '⚠️ LATE (Overdue)' : `Due: ${new Date(item.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            {/* Score display (for Graded) */}
                                            {isGraded && (
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e6b3e' }}>
                                                        {item.submission?.marks_obtained} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {item.max_marks}</span>
                                                    </div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Mark Received</div>
                                                </div>
                                            )}

                                            <Link
                                                href={`/student/assignments/${item.id}`}
                                                style={{
                                                    background: overdue ? '#ef4444' : '#1e6b3e', color: 'white', textDecoration: 'none',
                                                    padding: '8px 18px', borderRadius: 8, fontSize: '0.8125rem', fontWeight: 700,
                                                    boxShadow: 'var(--shadow-sm)'
                                                }}
                                            >
                                                {filter === 'pending' ? (overdue ? 'Submit Late' : 'Open / Submit') : 'View Details'}
                                            </Link>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </StudentLayout>
    );
}
