import React, { useRef, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import StudentLayout from '@/Layouts/StudentLayout';

interface AssignmentData {
    id: number;
    title: string;
    title_ur?: string;
    description?: string;
    description_ur?: string;
    due_date: string;
    max_marks: number;
    allow_late_submission: boolean;
    course: { id: number; name: string; name_ur?: string };
    teacher: { name: string } | null;
}

interface Submission {
    id: number;
    status: string;
    submitted_at: string;
    marks_obtained: number | null;
    feedback?: string;
    file_name?: string;
    file_url?: string;
    notes?: string;
}

interface Props {
    assignment: AssignmentData;
    submission: Submission | null;
}

const statusColor: Record<string, string> = {
    pending:   '#f59e0b',
    submitted: '#3b82f6',
    late:      '#ef4444',
    reviewed:  '#8b5cf6',
    graded:    '#10b981',
};

export default function AssignmentShow({ assignment, submission }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [previewFile, setPreviewFile] = useState<File | null>(null);

    const isOverdue = new Date() > new Date(assignment.due_date);
    const canSubmit = !isOverdue || assignment.allow_late_submission;
    const alreadySubmitted = !!submission && ['submitted', 'late', 'reviewed', 'graded'].includes(submission.status);

    const { data, setData, post, processing, errors, progress } = useForm<{
        file: File | null;
        notes: string;
    }>({
        file: null,
        notes: '',
    });

    const handleFile = (file: File | null) => {
        if (!file) return;
        setPreviewFile(file);
        setData('file', file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/student/assignments/${assignment.id}/submit`, {
            forceFormData: true,
        });
    };

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    const timeLeft = () => {
        const diff = new Date(assignment.due_date).getTime() - Date.now();
        if (diff <= 0) return null;
        const hours = Math.floor(diff / 3_600_000);
        const days = Math.floor(hours / 24);
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
        return `${hours} hour${hours !== 1 ? 's' : ''} remaining`;
    };

    return (
        <StudentLayout title={assignment.title}>
            <Head title={`${assignment.title} — Assignment`} />

            <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Back */}
                <Link href="/student/assignments" style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    ← Back to Assignments
                </Link>

                {/* Assignment Header */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'linear-gradient(135deg, #1e6b3e 0%, #145c32 100%)',
                        borderRadius: 18, padding: '28px 32px', color: 'white',
                        boxShadow: '0 8px 32px rgba(30,107,62,0.3)',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: 20, marginBottom: 10, display: 'inline-block' }}>
                                📖 {assignment.course.name}
                            </span>
                            <h1 style={{ margin: '8px 0 6px', fontSize: '1.5rem', fontWeight: 800 }}>{assignment.title}</h1>
                            {assignment.title_ur && (
                                <p style={{ margin: 0, fontSize: '1rem', opacity: 0.85, fontFamily: 'serif', direction: 'rtl' }}>{assignment.title_ur}</p>
                            )}
                            {assignment.teacher && (
                                <p style={{ margin: '8px 0 0', fontSize: '0.8125rem', opacity: 0.8 }}>
                                    👤 {assignment.teacher.name}
                                </p>
                            )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{assignment.max_marks}</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>Total Marks</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 20, marginTop: 18, flexWrap: 'wrap', fontSize: '0.8125rem', opacity: 0.9 }}>
                        <span>📅 Due: {formatDate(assignment.due_date)}</span>
                        {timeLeft() && <span style={{ color: '#fde68a', fontWeight: 600 }}>⏰ {timeLeft()}</span>}
                        {isOverdue && <span style={{ color: '#fca5a5', fontWeight: 600 }}>⚠️ Overdue</span>}
                        {assignment.allow_late_submission && <span style={{ color: '#6ee7b7' }}>✅ Late submission allowed</span>}
                    </div>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'start' }}>

                    {/* Left: Description + Submission Status */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Description */}
                        {assignment.description && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px' }}
                            >
                                <h3 style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Assignment Instructions
                                </h3>
                                <div style={{ color: 'var(--text-primary)', fontSize: '0.9375rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                    {assignment.description}
                                </div>
                                {assignment.description_ur && (
                                    <div style={{ marginTop: 16, padding: '14px 16px', background: 'var(--surface-3)', borderRadius: 10, direction: 'rtl', fontFamily: 'serif', color: 'var(--text-primary)', lineHeight: 1.8 }}>
                                        {assignment.description_ur}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Submission Result (if graded) */}
                        {submission && submission.status === 'graded' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                                style={{ background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', border: '1px solid #6ee7b7', borderRadius: 16, padding: '20px 24px' }}
                            >
                                <h3 style={{ margin: '0 0 12px', color: '#065f46', fontWeight: 700 }}>🎓 Assignment Graded</h3>
                                <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                                    <div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#059669' }}>
                                            {submission.marks_obtained}
                                            <span style={{ fontSize: '1rem', color: '#065f46' }}> / {assignment.max_marks}</span>
                                        </div>
                                        <div style={{ fontSize: '0.8125rem', color: '#065f46' }}>Marks Obtained</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#059669' }}>
                                            {Math.round(((submission.marks_obtained ?? 0) / assignment.max_marks) * 100)}%
                                        </div>
                                        <div style={{ fontSize: '0.8125rem', color: '#065f46' }}>Score</div>
                                    </div>
                                </div>
                                {submission.feedback && (
                                    <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(255,255,255,0.7)', borderRadius: 10 }}>
                                        <strong style={{ fontSize: '0.8rem', color: '#065f46' }}>📝 Teacher Feedback:</strong>
                                        <p style={{ margin: '6px 0 0', color: '#064e3b', fontSize: '0.875rem', lineHeight: 1.6 }}>{submission.feedback}</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Right: Submission Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Current Submission Status */}
                        {submission && (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}
                                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 16, padding: '18px 20px' }}
                            >
                                <h3 style={{ margin: '0 0 14px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Submission Status
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                    <span style={{
                                        padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
                                        background: statusColor[submission.status] + '20',
                                        color: statusColor[submission.status],
                                        border: `1px solid ${statusColor[submission.status]}40`,
                                        textTransform: 'uppercase'
                                    }}>
                                        {submission.status}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <span>📅 Submitted: {formatDate(submission.submitted_at)}</span>
                                    {submission.file_name && (
                                        <span>
                                            📎 File:&nbsp;
                                            {submission.file_url ? (
                                                <a href={submission.file_url} target="_blank" style={{ color: '#1e6b3e', fontWeight: 600 }}>
                                                    {submission.file_name}
                                                </a>
                                            ) : (
                                                submission.file_name
                                            )}
                                        </span>
                                    )}
                                    {submission.notes && <span>📋 Note: {submission.notes}</span>}
                                </div>
                            </motion.div>
                        )}

                        {/* File Upload Form */}
                        {canSubmit && (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 }}
                                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 16, padding: '18px 20px' }}
                            >
                                <h3 style={{ margin: '0 0 14px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {alreadySubmitted ? '🔄 Re-Submit Assignment' : '📤 Submit Assignment'}
                                </h3>

                                {alreadySubmitted && (
                                    <p style={{ fontSize: '0.8rem', color: '#f59e0b', background: '#fef3c720', border: '1px solid #fde68a', borderRadius: 8, padding: '8px 12px', marginBottom: 14 }}>
                                        ⚠️ Uploading a new file will replace your previous submission.
                                    </p>
                                )}

                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {/* Drag & Drop Zone */}
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{
                                            border: `2px dashed ${dragOver ? '#1e6b3e' : previewFile ? '#10b981' : 'var(--border)'}`,
                                            borderRadius: 12, padding: '24px 16px',
                                            textAlign: 'center', cursor: 'pointer',
                                            background: dragOver ? '#f0fdf4' : previewFile ? '#ecfdf5' : 'var(--surface-3)',
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        <div style={{ fontSize: 32, marginBottom: 8 }}>{previewFile ? '✅' : '📂'}</div>
                                        {previewFile ? (
                                            <>
                                                <div style={{ fontWeight: 700, color: '#059669', fontSize: '0.875rem' }}>{previewFile.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                                    {(previewFile.size / 1024).toFixed(1)} KB
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                                    Click or drag file here
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                                    PDF, DOCX, JPG, PNG, ZIP — max 10 MB
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef} type="file" accept=".pdf,.docx,.jpg,.jpeg,.png,.zip"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                                    />
                                    {errors.file && (
                                        <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: 0 }}>{errors.file}</p>
                                    )}

                                    {/* Notes */}
                                    <div>
                                        <label style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 6, display: 'block' }}>
                                            Note to Teacher (optional)
                                        </label>
                                        <textarea
                                            rows={3}
                                            placeholder="Any message for your teacher..."
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            style={{
                                                width: '100%', boxSizing: 'border-box', padding: '10px 14px',
                                                border: '1px solid var(--border)', borderRadius: 10, resize: 'vertical',
                                                background: 'var(--surface-1)', color: 'var(--text-primary)', fontSize: '0.875rem',
                                                fontFamily: 'inherit',
                                            }}
                                        />
                                    </div>

                                    {/* Upload progress */}
                                    {processing && progress && (
                                        <div style={{ background: 'var(--surface-3)', borderRadius: 6, height: 6, overflow: 'hidden' }}>
                                            <div style={{ width: `${progress.percentage}%`, height: '100%', background: '#1e6b3e', transition: 'width 0.3s ease' }} />
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={processing || !data.file}
                                        style={{
                                            background: processing || !data.file ? 'var(--surface-3)' : isOverdue ? '#ef4444' : '#1e6b3e',
                                            color: processing || !data.file ? 'var(--text-muted)' : 'white',
                                            border: 'none', borderRadius: 10, padding: '12px 20px',
                                            fontWeight: 700, fontSize: '0.9375rem', cursor: processing || !data.file ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.2s ease', width: '100%',
                                        }}
                                    >
                                        {processing ? '⏳ Uploading...' : isOverdue ? '⚠️ Submit Late' : '📤 Submit Assignment'}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* Cannot submit notice */}
                        {!canSubmit && !alreadySubmitted && (
                            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 14, padding: '18px 20px', color: '#991b1b', fontSize: '0.875rem' }}>
                                <strong>⛔ Submission Closed</strong>
                                <p style={{ margin: '6px 0 0' }}>This assignment is overdue and late submissions are not permitted.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
