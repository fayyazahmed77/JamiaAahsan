import { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

interface GradeRow {
    student_id:     number;
    student_name:   string;
    student_id_num: string;
    submission_id?: number;
    submitted_at?:  string;
    is_late:        boolean;
    file_path?:     string;
    file_name?:     string;
    status:         string;
    marks_obtained?: number | null;
    feedback?:       string | null;
    graded_by_name?: string;
    graded_at?:      string;
}

interface Assignment {
    id:          number;
    title:       string;
    max_marks:   number;
    due_date:    string;
    course_name: string;
    course_code: string;
}

interface Props {
    assignment:  Assignment;
    grade_sheet: GradeRow[];
}

type EditState = Record<number, { marks: string; feedback: string }>;

export default function GradingShow({ assignment, grade_sheet }: Props) {
    // Local edit state per student
    const initEdit: EditState = {};
    grade_sheet.forEach(r => {
        initEdit[r.student_id] = {
            marks:    r.marks_obtained != null ? String(r.marks_obtained) : '',
            feedback: r.feedback ?? '',
        };
    });
    const [edits, setEdits]       = useState<EditState>(initEdit);
    const [saving, setSaving]     = useState<number | null>(null);
    const [flash, setFlash]       = useState('');

    function setEdit(studentId: number, field: 'marks' | 'feedback', value: string) {
        setEdits(prev => ({ ...prev, [studentId]: { ...prev[studentId], [field]: value } }));
    }

    function save(e: FormEvent, studentId: number) {
        e.preventDefault();
        setSaving(studentId);
        router.post(`/admin/assignments/${assignment.id}/grade`, {
            student_id:     studentId,
            marks_obtained: edits[studentId]?.marks,
            feedback:       edits[studentId]?.feedback,
        }, {
            onSuccess: () => { setFlash('Grade saved!'); setTimeout(() => setFlash(''), 3000); },
            onFinish:  () => setSaving(null),
            preserveScroll: true,
        });
    }

    const submitted   = grade_sheet.filter(r => r.status !== 'not_submitted').length;
    const graded      = grade_sheet.filter(r => r.marks_obtained != null).length;
    const avgMarks    = graded > 0
        ? (grade_sheet.filter(r => r.marks_obtained != null)
            .reduce((s, r) => s + Number(r.marks_obtained), 0) / graded).toFixed(1)
        : '—';

    return (
        <AdminLayout>
            <Head title={`Grade: ${assignment.title}`} />

            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link href="/admin/assignments/grading"
                            className="text-sm text-gray-400 hover:text-gray-700 transition">
                            ← Assignments
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {assignment.course_code} · {assignment.course_name} · Due {assignment.due_date} · Max: {assignment.max_marks} marks
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {flash && (
                        <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 shrink-0">
                            ✓ {flash}
                        </span>
                    )}
                    <a
                        href={`/admin/exports/assignments?assignment_id=${assignment.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#1e6b3e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#154c2b] transition shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export Grades (Excel)
                    </a>
                </div>
            </div>

            {/* Stats bar */}
            <div className="mb-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Enrolled',  value: grade_sheet.length, color: 'text-indigo-700 bg-indigo-50' },
                    { label: 'Submitted', value: submitted,           color: 'text-emerald-700 bg-emerald-50' },
                    { label: 'Graded',    value: graded,              color: 'text-sky-700 bg-sky-50' },
                    { label: 'Avg Marks', value: `${avgMarks} / ${assignment.max_marks}`, color: 'text-amber-700 bg-amber-50' },
                ].map(s => (
                    <div key={s.label} className={`rounded-xl border px-4 py-3 text-center ${s.color} border-current/20`}>
                        <div className="text-xl font-bold">{s.value}</div>
                        <div className="text-xs font-medium mt-0.5 opacity-70">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Grade sheet */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 w-8">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Student</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Submission</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 w-32">Marks / {assignment.max_marks}</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Feedback</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 w-20">Save</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {grade_sheet.map((row, idx) => (
                            <tr key={row.student_id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                                <td className="px-4 py-3 text-sm text-gray-400">{idx + 1}</td>

                                {/* Student */}
                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-900 text-sm">{row.student_name}</p>
                                    <p className="text-xs text-gray-400 font-mono">{row.student_id_num}</p>
                                </td>

                                {/* Submission status */}
                                <td className="px-4 py-3">
                                    {row.status === 'not_submitted' ? (
                                        <span className="text-xs text-gray-400 italic">Not submitted</span>
                                    ) : (
                                        <div>
                                            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                                                row.is_late
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                                {row.is_late ? 'Late' : 'On time'} · {row.submitted_at}
                                            </span>
                                            {row.file_name && (
                                                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">
                                                    📎 {row.file_name}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </td>

                                {/* Marks input */}
                                <td className="px-4 py-3">
                                    <form id={`grade-form-${row.student_id}`} onSubmit={e => save(e, row.student_id)}>
                                        <input
                                            type="number"
                                            min="0"
                                            max={assignment.max_marks}
                                            step="0.5"
                                            value={edits[row.student_id]?.marks ?? ''}
                                            onChange={e => setEdit(row.student_id, 'marks', e.target.value)}
                                            placeholder="—"
                                            className="w-20 rounded-md border border-gray-200 px-2 py-1.5 text-sm text-center font-semibold focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 outline-none" />
                                    </form>
                                </td>

                                {/* Feedback */}
                                <td className="px-4 py-3">
                                    <input
                                        type="text"
                                        value={edits[row.student_id]?.feedback ?? ''}
                                        onChange={e => setEdit(row.student_id, 'feedback', e.target.value)}
                                        placeholder="Optional feedback…"
                                        form={`grade-form-${row.student_id}`}
                                        className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs text-gray-700 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 outline-none" />
                                </td>

                                {/* Save button */}
                                <td className="px-4 py-3 text-center">
                                    <button
                                        type="submit"
                                        form={`grade-form-${row.student_id}`}
                                        disabled={saving === row.student_id}
                                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-50">
                                        {saving === row.student_id ? '…' : 'Save'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
