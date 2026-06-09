import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AdminLayout from '@/Layouts/AdminLayout';

interface Enrollment {
    id: number;
    student_id: number;
    student_name: string;
    student_id_number: string;
    teacher_name: string;
    juz_completed: number;
    total_juz_target: number;
    current_surah: string | null;
    status: string;
    start_date: string;
    target_completion_date: string | null;
    session_count: number;
}

interface Props {
    enrollments: {
        data: Enrollment[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    filters: { search?: string; status?: string };
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    active:    { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
    paused:    { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
    completed: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
    withdrawn: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
};

export default function HifzIndex({ enrollments, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');

    const applyFilter = () => {
        router.get('/admin/hifz', { search, status: statusFilter }, { preserveScroll: true });
    };

    const clearFilter = () => {
        setSearch('');
        setStatusFilter('');
        router.get('/admin/hifz');
    };

    const progressPct = (e: Enrollment) =>
        Math.round((e.juz_completed / e.total_juz_target) * 100);

    return (
        <AdminLayout>
            <Head title="Hifz Management — Admin" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'linear-gradient(135deg, #1e3a5f 0%, #1e6b3e 100%)',
                        borderRadius: 16, padding: '24px 28px', color: 'white',
                        boxShadow: '0 8px 24px rgba(30,58,95,0.3)',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.75, marginBottom: 4 }}>🕌 Islamic Learning Module</div>
                            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Hifz al-Quran Management</h1>
                            <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: '0.875rem' }}>
                                {enrollments.total} student{enrollments.total !== 1 ? 's' : ''} enrolled in Hifz programme
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 18px' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                                    {enrollments.data.filter(e => e.status === 'active').length}
                                </div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.75 }}>Active</div>
                            </div>
                            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 18px' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                                    {enrollments.data.filter(e => e.status === 'completed').length}
                                </div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.75 }}>Completed</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 260px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                            Search Student
                        </label>
                        <input
                            type="text"
                            placeholder="Name or Student ID..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && applyFilter()}
                            style={{
                                width: '100%', boxSizing: 'border-box', padding: '9px 14px',
                                border: '1px solid var(--border)', borderRadius: 8,
                                background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: '0.875rem',
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                            Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            style={{
                                padding: '9px 14px', border: '1px solid var(--border)', borderRadius: 8,
                                background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: '0.875rem',
                            }}
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="completed">Completed</option>
                            <option value="withdrawn">Withdrawn</option>
                        </select>
                    </div>
                    <button
                        onClick={applyFilter}
                        style={{ padding: '9px 20px', background: '#1e6b3e', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}
                    >
                        Search
                    </button>
                    {(filters.search || filters.status) && (
                        <button
                            onClick={clearFilter}
                            style={{ padding: '9px 16px', background: 'var(--surface-3)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Table */}
                <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                    {enrollments.data.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '56px 20px', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>🕌</div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No Hifz Enrollments Found</div>
                            <p style={{ maxWidth: 320, margin: '8px auto 0', fontSize: '0.875rem' }}>
                                No students match your search. Try adjusting your filters.
                            </p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                <thead>
                                    <tr style={{ background: 'var(--surface-3)', borderBottom: '1px solid var(--border)' }}>
                                        {['Student', 'Teacher', 'Progress', 'Current Surah', 'Status', 'Sessions', 'Actions'].map(h => (
                                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {enrollments.data.map((e, idx) => {
                                        const pct = progressPct(e);
                                        const sc = statusColors[e.status] ?? statusColors.active;
                                        return (
                                            <motion.tr
                                                key={e.id}
                                                initial={{ opacity: 0, y: 4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.03 }}
                                                style={{ borderBottom: '1px solid var(--border)' }}
                                                onMouseEnter={ev => (ev.currentTarget.style.background = 'var(--surface-3)')}
                                                onMouseLeave={ev => (ev.currentTarget.style.background = 'transparent')}
                                            >
                                                <td style={{ padding: '14px 16px' }}>
                                                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{e.student_name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#1e6b3e', fontWeight: 500 }}>{e.student_id_number}</div>
                                                </td>
                                                <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{e.teacher_name}</td>
                                                <td style={{ padding: '14px 16px', minWidth: 160 }}>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                                                        {e.juz_completed} / {e.total_juz_target} Juz — <strong>{pct}%</strong>
                                                    </div>
                                                    <div style={{ background: 'var(--surface-3)', borderRadius: 100, height: 6, overflow: 'hidden' }}>
                                                        <div style={{ width: `${pct}%`, height: '100%', background: pct >= 100 ? '#10b981' : '#1e6b3e', borderRadius: 100 }} />
                                                    </div>
                                                </td>
                                                <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                                                    {e.current_surah ?? '—'}
                                                </td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <span style={{
                                                        padding: '3px 10px', borderRadius: 20,
                                                        fontSize: '0.7rem', fontWeight: 700,
                                                        background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                                                        textTransform: 'capitalize',
                                                    }}>
                                                        {e.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                                    {e.session_count}
                                                </td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <Link
                                                        href={`/admin/hifz/${e.student_id}`}
                                                        style={{
                                                            padding: '6px 14px', background: '#1e6b3e', color: 'white',
                                                            borderRadius: 6, textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700,
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        Manage →
                                                    </Link>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {enrollments.last_page > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                        {Array.from({ length: enrollments.last_page }, (_, i) => i + 1).map(pg => (
                            <button
                                key={pg}
                                onClick={() => router.get('/admin/hifz', { ...filters, page: pg })}
                                style={{
                                    width: 36, height: 36, borderRadius: 8, border: '1px solid var(--border)',
                                    background: pg === enrollments.current_page ? '#1e6b3e' : 'var(--surface-2)',
                                    color: pg === enrollments.current_page ? 'white' : 'var(--text-secondary)',
                                    fontWeight: pg === enrollments.current_page ? 700 : 400,
                                    cursor: 'pointer', fontSize: '0.875rem',
                                }}
                            >
                                {pg}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
