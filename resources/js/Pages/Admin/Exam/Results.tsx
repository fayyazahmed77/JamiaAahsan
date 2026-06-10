import { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

interface ExamInfo {
    id: number; title: string; type_label: string; exam_date: string;
    total_marks: number; passing_marks: number;
    course_name: string; course_code: string;
}
interface SheetRow {
    student_id:     number;
    student_name:   string;
    student_id_num: string;
    marks_obtained?: number | null;
    grade?:          string | null;
    remarks?:        string | null;
}
interface Props { exam: ExamInfo; sheet: SheetRow[] }

const GRADE_COLORS: Record<string, string> = {
    'A+': 'bg-emerald-100 text-emerald-800',
    'A':  'bg-emerald-50  text-emerald-700',
    'B':  'bg-sky-50      text-sky-700',
    'C':  'bg-amber-50    text-amber-700',
    'D':  'bg-orange-50   text-orange-700',
    'F':  'bg-red-100     text-red-700',
};

export default function ExamResults({ exam, sheet }: Props) {
    type Edits = Record<number, { marks: string; remarks: string }>;

    const init: Edits = {};
    sheet.forEach(r => {
        init[r.student_id] = {
            marks:   r.marks_obtained != null ? String(r.marks_obtained) : '',
            remarks: r.remarks ?? '',
        };
    });

    const [edits, setEdits]   = useState<Edits>(init);
    const [saving, setSaving] = useState(false);
    const [flash, setFlash]   = useState('');

    function set(sid: number, field: 'marks' | 'remarks', val: string) {
        setEdits(p => ({ ...p, [sid]: { ...p[sid], [field]: val } }));
    }

    function calcGrade(marks: string): string {
        const pct = (parseFloat(marks) / exam.total_marks) * 100;
        if (pct >= 90) return 'A+';
        if (pct >= 80) return 'A';
        if (pct >= 70) return 'B';
        if (pct >= 60) return 'C';
        if (pct >= 50) return 'D';
        return 'F';
    }

    function saveAll(e: FormEvent) {
        e.preventDefault();
        setSaving(true);
        const results = sheet.map(r => ({
            student_id:     r.student_id,
            marks_obtained: edits[r.student_id]?.marks || null,
            remarks:        edits[r.student_id]?.remarks || null,
        }));

        router.post(`/admin/exams/${exam.id}/results`, { results }, {
            onSuccess: () => { setFlash('Results saved!'); setTimeout(() => setFlash(''), 3000); },
            onFinish:  () => setSaving(false),
            preserveScroll: true,
        });
    }

    const entered = sheet.filter(r => edits[r.student_id]?.marks !== '').length;
    const passing = sheet.filter(r => {
        const m = parseFloat(edits[r.student_id]?.marks || '0');
        return m >= exam.passing_marks;
    }).length;

    return (
        <AdminLayout>
            <Head title={`Results: ${exam.title}`} />

            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <Link href="/admin/exams"
                        className="text-sm text-gray-400 hover:text-gray-700 transition mb-1 inline-block">
                        ← Exam Schedule
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {exam.course_code} · {exam.course_name} · {exam.type_label} · {exam.exam_date}
                        · Total: {exam.total_marks} · Pass: {exam.passing_marks}
                    </p>
                </div>
                {flash && (
                    <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
                        ✓ {flash}
                    </span>
                )}
            </div>

            {/* Stats */}
            <div className="mb-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total Students', value: sheet.length,         color: 'text-indigo-700 bg-indigo-50' },
                    { label: 'Entered',         value: entered,             color: 'text-emerald-700 bg-emerald-50' },
                    { label: 'Passing',          value: passing,            color: 'text-sky-700 bg-sky-50' },
                    { label: 'Failing',          value: entered - passing,  color: 'text-red-700 bg-red-50' },
                ].map(s => (
                    <div key={s.label} className={`rounded-xl border px-4 py-3 text-center ${s.color}`}>
                        <div className="text-xl font-bold">{s.value}</div>
                        <div className="text-xs font-medium mt-0.5 opacity-70">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Results sheet */}
            <form onSubmit={saveAll}>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 w-8">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Student</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500 w-36">
                                    Marks / {exam.total_marks}
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500 w-20">Grade</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sheet.map((row, idx) => {
                                const m     = edits[row.student_id]?.marks;
                                const grade = m ? calcGrade(m) : null;
                                const isPassing = m ? parseFloat(m) >= exam.passing_marks : null;

                                return (
                                    <tr key={row.student_id}
                                        className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'} ${isPassing === false ? 'border-l-2 border-red-300' : isPassing === true ? 'border-l-2 border-emerald-300' : ''}`}>
                                        <td className="px-4 py-3 text-sm text-gray-400">{idx + 1}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-900 text-sm">{row.student_name}</p>
                                            <p className="text-xs text-gray-400 font-mono">{row.student_id_num}</p>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                max={exam.total_marks}
                                                step="0.5"
                                                value={edits[row.student_id]?.marks ?? ''}
                                                onChange={e => set(row.student_id, 'marks', e.target.value)}
                                                placeholder="—"
                                                className="w-24 rounded-md border border-gray-200 px-2 py-1.5 text-sm text-center font-semibold focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 outline-none mx-auto block" />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {grade ? (
                                                <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold ${GRADE_COLORS[grade] ?? ''}`}>
                                                    {grade}
                                                </span>
                                            ) : <span className="text-gray-300 text-xs">—</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={edits[row.student_id]?.remarks ?? ''}
                                                onChange={e => set(row.student_id, 'remarks', e.target.value)}
                                                placeholder="Optional remark…"
                                                className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 outline-none" />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="mt-5 flex justify-end">
                    <button type="submit" disabled={saving}
                        className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition disabled:opacity-60">
                        {saving ? 'Saving…' : `Save All Results (${sheet.length} students)`}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
