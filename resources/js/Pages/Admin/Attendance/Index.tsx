import { FormEvent, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

// ── Types ─────────────────────────────────────────────────────────────────────
type Status = 'present' | 'absent' | 'late' | 'excused';

interface Course { id: number; name: string; code: string; teacher?: { name: string } }
interface Student { id: number; name: string; student_id_number: string }
interface AttendanceRecord { student_id: number; status: Status; notes?: string }

interface Props {
    courses:    Course[];
    course?:    Course;
    students:   Student[];
    attendance: AttendanceRecord[];
    date:       string;
    filters:    { course_id?: number; date?: string };
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
    present: { label: 'Present',  color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-300 ring-emerald-400' },
    absent:  { label: 'Absent',   color: 'text-red-700',     bg: 'bg-red-50   border-red-300   ring-red-400'   },
    late:    { label: 'Late',     color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-300 ring-amber-400'  },
    excused: { label: 'Excused',  color: 'text-sky-700',     bg: 'bg-sky-50   border-sky-300   ring-sky-400'    },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function AttendanceIndex({ courses, course, students, attendance, date, filters }: Props) {

    // Seed the attendance state from existing records
    const initialRecords: Record<number, { status: Status; notes: string }> = {};
    students.forEach(s => {
        const existing = attendance.find(a => a.student_id === s.id);
        initialRecords[s.id] = { status: existing?.status ?? 'present', notes: existing?.notes ?? '' };
    });

    const [records, setRecords] = useState(initialRecords);
    const [saving, setSaving]   = useState(false);
    const [flash, setFlash]     = useState('');

    // ── Filter form (course + date) ───────────────────────────────────────────
    const [filterCourse, setFilterCourse] = useState(filters.course_id ?? '');
    const [filterDate,   setFilterDate]   = useState(filters.date ?? date);

    function applyFilter(e: FormEvent) {
        e.preventDefault();
        router.get(route('admin.attendance.index'), { course_id: filterCourse, date: filterDate }, { preserveState: false });
    }

    // ── Quick-set all ─────────────────────────────────────────────────────────
    function setAll(status: Status) {
        setRecords(prev => {
            const next = { ...prev };
            students.forEach(s => { next[s.id] = { ...next[s.id], status }; });
            return next;
        });
    }

    function setRecord(studentId: number, field: 'status' | 'notes', value: string) {
        setRecords(prev => ({ ...prev, [studentId]: { ...prev[studentId], [field]: value } }));
    }

    // ── Save ─────────────────────────────────────────────────────────────────
    function save(e: FormEvent) {
        e.preventDefault();
        setSaving(true);
        router.post(route('admin.attendance.store'), {
            course_id: course!.id,
            date: filterDate,
            records: students.map(s => ({
                student_id: s.id,
                status:     records[s.id]?.status ?? 'present',
                notes:      records[s.id]?.notes  ?? '',
            })),
        }, {
            onSuccess: () => { setFlash('Attendance saved!'); setTimeout(() => setFlash(''), 3000); },
            onFinish:  () => setSaving(false),
        });
    }

    // ── Summary counts ────────────────────────────────────────────────────────
    const counts = (Object.keys(STATUS_CONFIG) as Status[]).reduce((acc, s) => {
        acc[s] = students.filter(st => records[st.id]?.status === s).length;
        return acc;
    }, {} as Record<Status, number>);

    return (
        <AdminLayout>
            <Head title="Attendance" />

            {/* ── Page header ─────────────────────────────────────────── */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
                    <p className="text-sm text-gray-500 mt-1">Mark daily student attendance by course</p>
                </div>
                <Link href={route('admin.attendance.report')}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition">
                    📊 View Report
                </Link>
            </div>

            {/* ── Filter bar ──────────────────────────────────────────── */}
            <form onSubmit={applyFilter}
                className="mb-6 flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Course</label>
                    <select id="course_id"
                        value={filterCourse}
                        onChange={e => setFilterCourse(e.target.value as any)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none">
                        <option value="">— Select course —</option>
                        {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.code} · {c.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                    <input id="attendance_date"
                        type="date"
                        value={filterDate}
                        onChange={e => setFilterDate(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" />
                </div>

                <div className="flex items-end">
                    <button type="submit"
                        className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition">
                        Load
                    </button>
                </div>
            </form>

            {/* ── Attendance sheet ─────────────────────────────────────── */}
            {course && students.length > 0 ? (
                <form onSubmit={save}>
                    {/* Course info + quick-set bar */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                        <div>
                            <p className="font-semibold text-indigo-800">{course.code} · {course.name}</p>
                            {course.teacher && <p className="text-xs text-indigo-600">Teacher: {course.teacher.name}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 mr-1">Mark all:</span>
                            {(Object.keys(STATUS_CONFIG) as Status[]).map(s => (
                                <button key={s} type="button"
                                    onClick={() => setAll(s)}
                                    className={`rounded-full px-3 py-1 text-xs font-medium border transition ${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].color}`}>
                                    {STATUS_CONFIG[s].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Summary chips */}
                    <div className="mb-4 flex flex-wrap gap-3">
                        {(Object.keys(STATUS_CONFIG) as Status[]).map(s => (
                            <span key={s}
                                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].color}`}>
                                {STATUS_CONFIG[s].label}: {counts[s]}
                            </span>
                        ))}
                    </div>

                    {/* Student roster table */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Student</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {students.map((student, idx) => {
                                    const rec    = records[student.id] ?? { status: 'present', notes: '' };
                                    const config = STATUS_CONFIG[rec.status];
                                    return (
                                        <tr key={student.id} className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                                            <td className="px-4 py-3 text-sm text-gray-400">{idx + 1}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500 font-mono">{student.student_id_number}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {(Object.keys(STATUS_CONFIG) as Status[]).map(s => (
                                                        <button key={s} type="button"
                                                            onClick={() => setRecord(student.id, 'status', s)}
                                                            className={`rounded-full border px-3 py-0.5 text-xs font-medium transition-all duration-100
                                                                ${rec.status === s
                                                                    ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].color} ring-1 ${STATUS_CONFIG[s].bg}`
                                                                    : 'border-gray-200 text-gray-400 hover:border-gray-400'}`}>
                                                            {STATUS_CONFIG[s].label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={rec.notes}
                                                    onChange={e => setRecord(student.id, 'notes', e.target.value)}
                                                    placeholder="Optional note…"
                                                    className="w-full rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700 placeholder-gray-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 outline-none" />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Save bar */}
                    <div className="mt-5 flex items-center justify-between">
                        {flash && (
                            <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700">
                                ✓ {flash}
                            </span>
                        )}
                        <div className="ml-auto">
                            <button type="submit" disabled={saving}
                                className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition disabled:opacity-60">
                                {saving ? 'Saving…' : `Save Attendance (${students.length} students)`}
                            </button>
                        </div>
                    </div>
                </form>
            ) : course && students.length === 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
                    <p className="text-amber-800 font-medium">No students are enrolled in this course yet.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                    <p className="text-gray-400 text-lg mb-1">Select a course and date to begin.</p>
                    <p className="text-gray-300 text-sm">Choose from the filter bar above.</p>
                </div>
            )}
        </AdminLayout>
    );
}
