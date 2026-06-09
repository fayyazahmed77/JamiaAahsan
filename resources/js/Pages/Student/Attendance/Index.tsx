import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import StudentLayout from '@/Layouts/StudentLayout';

interface Course {
    id: number;
    name: string;
    name_ur?: string;
    code: string;
}

interface Record {
    id: number;
    date: string;
    status: 'present' | 'absent' | 'leave' | 'late' | 'excused';
    notes?: string;
    course: Course;
}

interface Summary {
    total: number;
    present: number;
    absent: number;
    leave: number;
    late: number;
    excused: number;
    rate: number;
}

interface Props {
    summary: Summary;
    records: Record[];
}

export default function AttendanceIndex({ summary, records }: Props) {
    const rateColor = summary.rate >= 85 ? '#1e6b3e' : summary.rate >= 75 ? '#d97706' : '#ef4444';
    
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

    return (
        <StudentLayout title="My Attendance">
            <Head title="Attendance — Student Portal" />

            <div style={{ maxWidth: 850, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Attendance Records
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        Monitor your daily class attendance rate. Keep in mind that a minimum of 80% is required.
                    </p>
                </div>

                {/* Dashboard Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                    {/* Circle Gauge Card */}
                    <div style={{
                        gridColumn: 'span 2', background: 'var(--surface-2)', border: '1px solid var(--border)',
                        borderRadius: 14, padding: '20px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap'
                    }}>
                        <div>
                            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: rateColor }}>
                                {summary.rate}%
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                Attendance Average
                            </div>
                        </div>
                        <div style={{ flex: 1, minWidth: 160 }}>
                            <div style={{ height: 8, background: 'var(--surface-3)', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                                <div style={{ height: '100%', width: `${summary.rate}%`, backgroundColor: rateColor, borderRadius: 99 }} />
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {summary.rate >= 80 ? '✓ Your attendance meets the requirements.' : '⚠️ Attendance is below the required 80% limit.'}
                            </div>
                        </div>
                    </div>

                    {/* Numeric Cards */}
                    {[
                        { label: 'Total Classes', value: summary.total, color: 'var(--text-primary)' },
                        { label: 'Present Sessions', value: summary.present + summary.late, color: '#1e6b3e' },
                        { label: 'Absent Sessions', value: summary.absent, color: '#ef4444' },
                        { label: 'Excused / Leave', value: summary.leave + summary.excused, color: '#d97706' },
                    ].map(card => (
                        <div key={card.label} style={{
                            background: 'var(--surface-2)', border: '1px solid var(--border)',
                            borderRadius: 14, padding: '16px', textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: card.color }}>{card.value}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>{card.label}</div>
                        </div>
                    ))}
                </div>

                {/* Logs List Table */}
                <div style={{
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    borderRadius: 14, padding: '24px'
                }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        All Attendance Logs
                    </h3>

                    {records.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)' }}>
                            No attendance history logs found.
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
                                        <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Date</th>
                                        <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Course Code</th>
                                        <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Subject</th>
                                        <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Status</th>
                                        <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((rec, i) => {
                                        const badge = getStatusStyle(rec.status);
                                        return (
                                            <tr key={rec.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                                <td style={{ padding: '12px', fontWeight: 600 }}>{rec.date}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={{ fontSize: '0.75rem', background: 'var(--surface-3)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: 4, color: 'var(--text-secondary)' }}>
                                                        {rec.course.code}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px' }}>
                                                    <Link href={`/student/courses/${rec.course.id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>
                                                        {rec.course.name}
                                                    </Link>
                                                </td>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={{
                                                        fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px',
                                                        borderRadius: 6, background: badge.bg, color: badge.color
                                                    }}>{badge.label}</span>
                                                </td>
                                                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{rec.notes || '—'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}
