import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import StudentLayout from '@/Layouts/StudentLayout';

interface Schedule {
    id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
    type: 'onsite' | 'online';
    meeting_url?: string;
    room: string;
    course: {
        id: number;
        name: string;
        name_ur?: string;
        code: string;
        teacher_name: string;
    };
}

interface Props {
    schedules: Schedule[];
}

export default function ClassesIndex({ schedules }: Props) {
    const days = [
        { num: 1, label: 'Monday' },
        { num: 2, label: 'Tuesday' },
        { num: 3, label: 'Wednesday' },
        { num: 4, label: 'Thursday' },
        { num: 5, label: 'Friday' },
        { num: 6, label: 'Saturday' },
        { num: 0, label: 'Sunday' },
    ];

    const [activeDay, setActiveDay] = useState<number>(new Date().getDay());

    // Group schedules by day of week
    const getSchedulesForDay = (dayNum: number) => {
        return schedules
            .filter(s => s.day_of_week === dayNum)
            .sort((a, b) => a.start_time.localeCompare(b.start_time));
    };

    const currentDaySchedules = getSchedulesForDay(activeDay);

    return (
        <StudentLayout title="My Timetable">
            <Head title="Timetable — Student Portal" />

            <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Weekly Timetable
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        Select a day to view your academic class schedule.
                    </p>
                </div>

                {/* Day selector tabs */}
                <div style={{
                    display: 'flex', gap: 6, overflowX: 'auto',
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    padding: 6, borderRadius: 10
                }}>
                    {days.map(day => {
                        const active = activeDay === day.num;
                        return (
                            <button
                                key={day.num}
                                onClick={() => setActiveDay(day.num)}
                                style={{
                                    padding: '10px 16px', fontSize: '0.8125rem', fontWeight: 600,
                                    color: active ? '#1e6b3e' : 'var(--text-muted)',
                                    background: active ? 'var(--surface-3)' : 'transparent',
                                    border: 'none', borderRadius: 8, cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {day.label}
                            </button>
                        );
                    })}
                </div>

                {/* Schedule list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {currentDaySchedules.length === 0 ? (
                        <div style={{
                            textAlign: 'center', padding: '48px 20px', background: 'var(--surface-2)',
                            border: '1px solid var(--border)', borderRadius: 14, color: 'var(--text-muted)'
                        }}>
                            <div style={{ fontSize: 40, marginBottom: 8 }}>☕</div>
                            <div style={{ fontWeight: 600 }}>No Classes Scheduled</div>
                            <div style={{ fontSize: '0.8125rem', marginTop: 4 }}>You have no classes scheduled on this day.</div>
                        </div>
                    ) : (
                        currentDaySchedules.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                style={{
                                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                                    borderRadius: 14, padding: '18px 20px', display: 'flex',
                                    alignItems: 'center', gap: 16, justifyContent: 'space-between',
                                    flexWrap: 'wrap', boxShadow: 'var(--shadow-sm)'
                                }}
                            >
                                {/* Left: Timing block */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{
                                        background: 'rgba(30,107,62,0.1)', color: '#1e6b3e',
                                        padding: '12px', borderRadius: 10, textAlign: 'center',
                                        minWidth: 100
                                    }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>START TIME</div>
                                        <div style={{ fontSize: '1.125rem', fontWeight: 800 }}>
                                            {item.start_time.substring(0, 5)}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)}
                                        </div>
                                        <h3 style={{ margin: '2px 0 4px', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                            {item.course.name}
                                        </h3>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                            Teacher: {item.course.teacher_name}
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Class location / action */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{
                                            fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: 8,
                                            background: item.type === 'online' ? '#e0f2fe' : '#f3f4f6',
                                            color: item.type === 'online' ? '#0369a1' : '#4b5563',
                                            textTransform: 'uppercase'
                                        }}>
                                            {item.type}
                                        </span>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                            {item.type === 'online' ? 'Zoom/Meet Link' : `Room: ${item.room}`}
                                        </div>
                                    </div>

                                    <div>
                                        {item.type === 'online' && item.meeting_url ? (
                                            <a
                                                href={item.meeting_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{
                                                    background: '#1e6b3e', color: 'white', display: 'inline-block',
                                                    padding: '8px 16px', borderRadius: 8, fontSize: '0.8125rem',
                                                    fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 10px rgba(30,107,62,0.2)'
                                                }}
                                            >
                                                Join Live
                                            </a>
                                        ) : (
                                            <Link
                                                href={`/student/courses/${item.course.id}`}
                                                style={{
                                                    background: 'var(--surface-3)', border: '1px solid var(--border)',
                                                    color: 'var(--text-secondary)', display: 'inline-block',
                                                    padding: '8px 16px', borderRadius: 8, fontSize: '0.8125rem',
                                                    fontWeight: 700, textDecoration: 'none'
                                                }}
                                            >
                                                Course Info
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}
