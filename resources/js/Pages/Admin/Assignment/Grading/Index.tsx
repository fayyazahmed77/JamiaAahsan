import { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

interface Course { id: number; name: string; code: string }
interface AssignmentRow {
    id: number;
    title: string;
    due_date: string;
    max_marks: number;
    is_published: boolean;
    submissions_count: number;
    graded_count: number;
}
interface Props {
    courses:     Course[];
    course?:     Course | null;
    assignments: AssignmentRow[];
    filters:     { course_id?: number | string };
}

export default function GradingIndex({ courses, course, assignments, filters }: Props) {
    const [courseId, setCourseId] = useState<string | number>(filters.course_id ?? '');

    function apply(e: FormEvent) {
        e.preventDefault();
        router.get('/admin/assignments/grading', { course_id: courseId }, { preserveState: false });
    }

    function pctGraded(row: AssignmentRow) {
        if (!row.submissions_count) return 0;
        return Math.round((row.graded_count / row.submissions_count) * 100);
    }

    return (
        <AdminLayout>
            <Head title="Assignment Grading" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Assignment Grading</h1>
                    <p className="text-sm text-gray-500 mt-1">Select a course to view its assignments for grading</p>
                </div>
            </div>

            {/* Course filter */}
            <form onSubmit={apply}
                className="mb-6 flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex-1 min-w-[220px]">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Course</label>
                    <select
                        id="grading_course_id"
                        value={courseId}
                        onChange={e => setCourseId(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none">
                        <option value="">— Select course —</option>
                        {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.code} · {c.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-end">
                    <button type="submit"
                        className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition">
                        Load
                    </button>
                </div>
            </form>

            {/* Assignment list */}
            {course ? (
                <div>
                    <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                        <p className="font-semibold text-indigo-800">{course.code} · {course.name}</p>
                        <p className="text-xs text-indigo-500 mt-0.5">{assignments.length} assignment{assignments.length !== 1 ? 's' : ''}</p>
                    </div>

                    {assignments.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                            <p className="text-gray-400">No published assignments for this course yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Assignment</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">Due Date</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">Max Marks</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">Submissions</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">Graded</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {assignments.map((a, idx) => (
                                        <tr key={a.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-gray-900 text-sm">{a.title}</p>
                                                {!a.is_published && (
                                                    <span className="inline-block rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs font-medium mt-0.5">
                                                        Draft
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center text-sm text-gray-600">{a.due_date}</td>
                                            <td className="px-4 py-3 text-center text-sm text-gray-600">{a.max_marks}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="inline-block rounded-full bg-indigo-50 text-indigo-700 px-3 py-0.5 text-xs font-semibold">
                                                    {a.submissions_count}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                                                    pctGraded(a) === 100
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : pctGraded(a) > 0
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    {a.graded_count} / {a.submissions_count}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Link
                                                    href={`/admin/assignments/${a.id}/grade`}
                                                    className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition">
                                                    Grade →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                    <p className="text-gray-400 text-lg mb-1">Select a course to view assignments.</p>
                    <p className="text-gray-300 text-sm">Choose from the dropdown above.</p>
                </div>
            )}
        </AdminLayout>
    );
}
