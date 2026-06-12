import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import StudentLayout from '@/Layouts/StudentLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Calendar, Award, ShieldAlert, FileText, CheckCircle, FileSpreadsheet, Hourglass } from 'lucide-react';

interface Exam {
    id: number;
    title: string;
    type: 'midterm' | 'final' | 'quiz' | 'other';
    exam_date: string;
    start_time: string | null;
    end_time: string | null;
    venue: string | null;
    total_marks: number;
    passing_marks: number;
    instructions: string | null;
    course: {
        id: number;
        name: string;
        code: string;
    };
}

interface ExamResult {
    id: number;
    marks_obtained: number | null;
    grade: string | null;
    remarks: string | null;
    exam: {
        id: number;
        title: string;
        type: string;
        total_marks: number;
        passing_marks: number;
        course: {
            id: number;
            name: string;
            code: string;
        };
    };
}

interface Props {
    exams: Exam[];
    results: ExamResult[];
    gpa: number;
}

export default function ExamsIndex({ exams, results, gpa }: Props) {
    const { props } = usePage();
    const isUrdu = props.locale === 'ur';
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const [activeTab, setActiveTab] = useState<'schedule' | 'results'>(
        currentPath.includes('/results') ? 'results' : 'schedule'
    );

    const tabStyle = (tab: typeof activeTab) => ({
        padding: '10px 20px',
        borderRadius: 8,
        border: 'none',
        background: activeTab === tab ? '#1e6b3e' : 'transparent',
        color: activeTab === tab ? 'white' : 'var(--text-secondary)',
        fontWeight: activeTab === tab ? 700 : 500,
        fontSize: '0.85rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: activeTab === tab ? '0 4px 12px rgba(30,107,62,0.2)' : 'none'
    });

    const getExamTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            midterm: isUrdu ? 'وسط مدتی امتحان' : 'Midterm Exam',
            final: isUrdu ? 'سالانہ امتحانات' : 'Final Exam',
            quiz: isUrdu ? 'کوئز ٹیسٹ' : 'Quiz Test',
            other: isUrdu ? 'دیگر ٹیسٹ' : 'Other Test',
        };
        return labels[type] || type;
    };

    return (
        <StudentLayout title={isUrdu ? 'امتحانات اور نتائج' : 'Exams & Results'}>
            <Head title={isUrdu ? 'امتحانی پورٹل — طالب علم پورٹل' : 'Exams & Results — Student Portal'} />

            <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* Hero Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #113969 0%, #1e6b3e 100%)',
                    borderRadius: 16,
                    padding: '24px 28px',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 20
                }}>
                    <div>
                        <span style={{ fontSize: 24 }}>🎓</span>
                        <h1 style={{ margin: '4px 0 2px', fontSize: '1.625rem', fontWeight: 800 }}>
                            {isUrdu ? 'امتحانات اور نتائج کا ریکارڈ' : 'Academic Exams & Results'}
                        </h1>
                        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>
                            {isUrdu ? 'اپنے شیڈول کردہ امتحانات دیکھیں اور سالانہ نتائج کی تفصیلات چیک کریں۔' : 'View datesheets, venues, rules, and marks log.'}
                        </p>
                    </div>

                    {/* GPA display card */}
                    <div style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: 12,
                        padding: '12px 20px',
                        textAlign: 'center',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.04em' }}>
                            {isUrdu ? 'کل جی پی اے' : 'Cumulative GPA'}
                        </div>
                        <div style={{ fontSize: '2.125rem', fontWeight: 900, color: '#d4af37' }}>{gpa.toFixed(2)}</div>
                    </div>
                </div>

                {/* Tab selector */}
                <div style={{ display: 'flex', gap: 10, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                    <button style={tabStyle('schedule')} onClick={() => setActiveTab('schedule')}>
                        <Calendar size={16} />
                        {isUrdu ? 'امتحانی ڈیٹ شیٹ' : 'Exam Schedule'}
                    </button>
                    <button style={tabStyle('results')} onClick={() => setActiveTab('results')}>
                        <Award size={16} />
                        {isUrdu ? 'امتحانی مارک شیٹ' : 'Academic Transcripts'}
                    </button>
                </div>

                {/* Tab Contents */}
                <AnimatePresence mode="wait">
                    {activeTab === 'schedule' ? (
                        <motion.div key="sched" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            {exams.length === 0 ? (
                                <Card style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                                    <CardBody style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                                        <Hourglass size={48} style={{ opacity: 0.4, margin: '0 auto 12px' }} />
                                        <div>{isUrdu ? 'فی الحال کوئی شیڈول شدہ امتحانات نہیں ہیں۔' : 'No upcoming exams scheduled.'}</div>
                                    </CardBody>
                                </Card>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {exams.map(e => (
                                        <Card key={e.id} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                                            <CardBody style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                                                <div>
                                                    <span style={{
                                                        padding: '2px 8px',
                                                        borderRadius: 6,
                                                        fontSize: '0.65rem',
                                                        fontWeight: 700,
                                                        background: 'rgba(30,107,62,0.1)',
                                                        color: '#1e6b3e'
                                                    }}>
                                                        {getExamTypeLabel(e.type)}
                                                    </span>
                                                    <h3 style={{ margin: '8px 0 4px', fontSize: '1.05rem', fontWeight: 700 }}>{e.title}</h3>
                                                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                                                        📚 {e.course.name} ({e.course.code})
                                                    </div>
                                                    <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                        <span>📅 {e.exam_date}</span>
                                                        {e.start_time && <span>⏰ {e.start_time} - {e.end_time || 'TBA'}</span>}
                                                        {e.venue && <span>📍 {e.venue}</span>}
                                                    </div>
                                                </div>
                                                {/* Instructions warning */}
                                                {e.instructions && (
                                                    <div style={{
                                                        maxWidth: 300,
                                                        background: 'var(--surface-3)',
                                                        border: '1px solid var(--border)',
                                                        padding: '10px 14px',
                                                        borderRadius: 10,
                                                        fontSize: '0.75rem',
                                                        color: 'var(--text-secondary)'
                                                    }}>
                                                        <strong style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                            <ShieldAlert size={14} style={{ color: '#d4af37' }} />
                                                            {isUrdu ? 'امتحانی ہدایات' : 'Guidelines:'}
                                                        </strong>
                                                        <p style={{ margin: '4px 0 0', lineHeight: 1.4 }}>{e.instructions}</p>
                                                    </div>
                                                )}
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="res" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            {results.length === 0 ? (
                                <Card style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                                    <CardBody style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                                        <Award size={48} style={{ opacity: 0.4, margin: '0 auto 12px' }} />
                                        <div>{isUrdu ? 'کوئی امتحانی نتائج دستیاب نہیں ہیں۔' : 'No transcripts available.'}</div>
                                    </CardBody>
                                </Card>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {results.map(r => {
                                        const isPassed = r.grade !== 'F' && r.grade !== 'D';
                                        return (
                                            <Card key={r.id} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                                                <CardBody style={{ padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                                                    <div>
                                                        <h3 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700 }}>{r.exam.title}</h3>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                            {r.exam.course.name} ({r.exam.course.code})
                                                        </div>
                                                        {r.remarks && (
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: 4 }}>
                                                                💬 {r.remarks}
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Score blocks */}
                                                    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                                                {r.marks_obtained !== null ? r.marks_obtained : '—'} / {r.exam.total_marks}
                                                            </div>
                                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Obtained Marks</div>
                                                        </div>

                                                        {/* Grade stamp */}
                                                        <div style={{
                                                            width: 48,
                                                            height: 48,
                                                            borderRadius: '50%',
                                                            border: `2px solid ${isPassed ? '#1e6b3e' : '#ef4444'}`,
                                                            color: isPassed ? '#1e6b3e' : '#ef4444',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 900,
                                                            fontSize: '1.25rem',
                                                            background: isPassed ? '#1e6b3e10' : '#ef444410'
                                                        }}>
                                                            {r.grade || '—'}
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </StudentLayout>
    );
}
