import { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

interface Course { id: number; name: string; code: string }
interface StudentReport {
    id: number;
    name: string;
    student_id_number: string;
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendance_pct: number;
}

interface Props {
    courses:  Course[];
    course?:  Course;
    report:   StudentReport[];
    filters:  { course_id?: number };
}

export default function AttendanceReport({ courses, course, report, filters }: Props) {
    const [courseId, setCourseId] = useState<string | number>(filters.course_id ?? '');

    function apply(e: FormEvent) {
        e.preventDefault();
        router.get('/admin/attendance/report', { course_id: courseId }, { preserveState: false });
    }

    function pctColor(pct: number) {
        if (pct >= 80) return 'text-emerald-700 bg-emerald-50';
        if (pct >= 60) return 'text-amber-700 bg-amber-50';
        return 'text-red-700 bg-red-50';
    }

    return (
        <AdminLayout>
            <Head title="Attendance Report" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Attendance Report</h1>
                    <p className="text-sm text-gray-500 mt-1">Per-student attendance summary by course</p>
                </div>
                <Link href="/admin/attendance"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition">
                    ← Mark Attendance
                </Link>
            </div>

            {/* Filter */}
            <form onSubmit={apply}
                className="mb-6 flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Course</label>
                    <select id="report_course_id"
                        value={courseId}
                        onChange={e => setCourseId(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none">
                        <option value="">— Select course —</option>
                        {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.code} · {c.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-end">
                    <button type="submit"
                        className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition">
                        Generate
                    </button>
                </div>
            </form>

            {/* Report table */}
            {course && report.length > 0 ? (
                <>
                    {/* Course header */}
                    <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                        <p className="font-semibold text-indigo-800">{course.code} · {course.name}</p>
                        <p className="text-xs text-indigo-500 mt-0.5">
                            {report.length} students · Average attendance:{' '}
                            <strong>
                                {report.length > 0
                                    ? (report.reduce((s, r) => s + r.attendance_pct, 0) / report.length).toFixed(1)
                                    : 0}%
                            </strong>
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">#</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Student</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">Total</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-emerald-600">Present</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-red-500">Absent</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-amber-500">Late</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-sky-500">Excused</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">Attendance %</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {report.map((s, idx) => (
                                    <tr key={s.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                                        <td className="px-4 py-3 text-sm text-gray-400">{idx + 1}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-gray-900 text-sm">{s.name}</p>
                                            <p className="text-xs text-gray-400 font-mono">{s.student_id_number}</p>
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm font-medium text-gray-700">{s.total}</td>
                                        <td className="px-4 py-3 text-center text-sm font-semibold text-emerald-600">{s.present}</td>
                                        <td className="px-4 py-3 text-center text-sm font-semibold text-red-500">{s.absent}</td>
                                        <td className="px-4 py-3 text-center text-sm font-semibold text-amber-500">{s.late}</td>
                                        <td className="px-4 py-3 text-center text-sm font-semibold text-sky-500">{s.excused}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold ${pctColor(s.attendance_pct)}`}>
                                                {s.attendance_pct}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : course ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
                    <p className="text-amber-800 font-medium">No attendance records found for this course.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                    <p className="text-gray-400 text-lg">Select a course to generate a report.</p>
                </div>
            )}
        </AdminLayout>
    );
}
