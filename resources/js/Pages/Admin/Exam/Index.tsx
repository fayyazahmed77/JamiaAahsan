import { FormEvent, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

interface Course { id: number; name: string; code: string }
interface Exam {
    id: number; title: string; type: string; exam_date: string;
    start_time?: string; end_time?: string; venue?: string;
    total_marks: number; passing_marks: number;
    is_published: boolean; results_count: number;
    course: { name: string; code: string };
}
interface PaginationLink { url: string | null; label: string; active: boolean }
interface Props {
    courses: Course[];
    exams:   { data: Exam[]; links: PaginationLink[] };
    filters: { course_id?: number };
}

const TYPE_COLORS: Record<string, string> = {
    midterm: 'bg-indigo-100 text-indigo-700',
    final:   'bg-rose-100 text-rose-700',
    quiz:    'bg-amber-100 text-amber-700',
    other:   'bg-gray-100 text-gray-600',
};

export default function ExamIndex({ courses, exams, filters }: Props) {
    const [courseFilter, setCourseFilter] = useState(filters.course_id ?? '');
    const [showForm, setShowForm]         = useState(false);

    // ── Filter ───────────────────────────────────────────────────────────────
    function applyFilter(e: FormEvent) {
        e.preventDefault();
        router.get('/admin/exams', { course_id: courseFilter }, { preserveState: false });
    }

    // ── Create form ──────────────────────────────────────────────────────────
    const { data, setData, post, processing, errors, reset } = useForm({
        course_id: '',
        title: '',
        type: 'midterm',
        exam_date: '',
        start_time: '',
        end_time: '',
        venue: '',
        total_marks: 100,
        passing_marks: 50,
        instructions: '',
        is_published: false,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/admin/exams', {
            onSuccess: () => { reset(); setShowForm(false); },
        });
    }

    function togglePublish(exam: Exam) {
        router.put(`/admin/exams/${exam.id}`, {
            title:        exam.title,
            type:         exam.type,
            exam_date:    exam.exam_date,
            start_time:   exam.start_time ?? '',
            end_time:     exam.end_time ?? '',
            venue:        exam.venue ?? '',
            total_marks:  exam.total_marks,
            passing_marks: exam.passing_marks,
            is_published: !exam.is_published,
        }, { preserveScroll: true });
    }

    function destroy(exam: Exam) {
        if (!confirm(`Delete "${exam.title}"? This cannot be undone.`)) return;
        router.delete(`/admin/exams/${exam.id}`);
    }

    return (
        <AdminLayout>
            <Head title="Exam Schedule" />

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Exam Schedule</h1>
                    <p className="text-sm text-gray-500 mt-1">Schedule and manage exams for all courses</p>
                </div>
                <button onClick={() => setShowForm(s => !s)}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition">
                    {showForm ? '✕ Cancel' : '+ Schedule Exam'}
                </button>
            </div>

            {/* Create form */}
            {showForm && (
                <form onSubmit={submit}
                    className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-indigo-800 mb-4">New Exam</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Course */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Course *</label>
                            <select id="exam_course_id" value={data.course_id}
                                onChange={e => setData('course_id', e.target.value)} required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none">
                                <option value="">— Select —</option>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.code} · {c.name}</option>)}
                            </select>
                            {errors.course_id && <p className="text-xs text-red-500 mt-1">{errors.course_id}</p>}
                        </div>
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
                            <input type="text" value={data.title}
                                onChange={e => setData('title', e.target.value)} required
                                placeholder="e.g. Midterm – June 2026"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" />
                        </div>
                        {/* Type */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Type *</label>
                            <select value={data.type} onChange={e => setData('type', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none">
                                <option value="midterm">Midterm</option>
                                <option value="final">Final</option>
                                <option value="quiz">Quiz</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        {/* Date */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Date *</label>
                            <input type="date" value={data.exam_date}
                                onChange={e => setData('exam_date', e.target.value)} required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" />
                        </div>
                        {/* Time */}
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Start</label>
                                <input type="time" value={data.start_time} onChange={e => setData('start_time', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 outline-none" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-600 mb-1">End</label>
                                <input type="time" value={data.end_time} onChange={e => setData('end_time', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 outline-none" />
                            </div>
                        </div>
                        {/* Venue */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Venue</label>
                            <input type="text" value={data.venue} onChange={e => setData('venue', e.target.value)}
                                placeholder="Room / Hall"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 outline-none" />
                        </div>
                        {/* Marks */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Total Marks *</label>
                            <input type="number" value={data.total_marks} min={1}
                                onChange={e => setData('total_marks', +e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Passing Marks *</label>
                            <input type="number" value={data.passing_marks} min={0}
                                onChange={e => setData('passing_marks', +e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 outline-none" />
                        </div>
                        {/* Publish toggle */}
                        <div className="flex items-center gap-2 pt-5">
                            <input id="is_published" type="checkbox" checked={data.is_published}
                                onChange={e => setData('is_published', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                            <label htmlFor="is_published" className="text-sm text-gray-700">Publish to students</label>
                        </div>
                    </div>
                    {/* Instructions */}
                    <div className="mt-4">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Instructions</label>
                        <textarea value={data.instructions} rows={2}
                            onChange={e => setData('instructions', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 outline-none" />
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button type="submit" disabled={processing}
                            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-60">
                            {processing ? 'Saving…' : 'Schedule Exam'}
                        </button>
                    </div>
                </form>
            )}

            {/* Filter */}
            <form onSubmit={applyFilter}
                className="mb-5 flex gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex-1 min-w-[200px]">
                    <select value={courseFilter} onChange={e => setCourseFilter(e.target.value as any)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 outline-none">
                        <option value="">All courses</option>
                        {courses.map(c => <option key={c.id} value={c.id}>{c.code} · {c.name}</option>)}
                    </select>
                </div>
                <button type="submit"
                    className="rounded-lg bg-gray-700 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 transition">
                    Filter
                </button>
            </form>

            {/* Exam list */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Exam</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Course</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Date & Time</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Marks</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">Results</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">Status</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {exams.data.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                                    No exams scheduled yet.
                                </td>
                            </tr>
                        ) : exams.data.map((exam, idx) => (
                            <tr key={exam.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-gray-900 text-sm">{exam.title}</p>
                                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium mt-0.5 ${TYPE_COLORS[exam.type] ?? TYPE_COLORS.other}`}>
                                        {exam.type}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                    {exam.course.code} · {exam.course.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                    <p>{exam.exam_date}</p>
                                    {exam.start_time && <p className="text-xs text-gray-400">{exam.start_time}{exam.end_time ? ` – ${exam.end_time}` : ''}{exam.venue ? ` · ${exam.venue}` : ''}</p>}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                    {exam.total_marks} (pass: {exam.passing_marks})
                                </td>
                                <td className="px-4 py-3 text-center text-sm">
                                    <Link href={`/admin/exams/${exam.id}/results`}
                                        className="inline-flex items-center gap-1 rounded-lg bg-sky-50 border border-sky-200 px-3 py-1 text-xs font-medium text-sky-700 hover:bg-sky-100 transition">
                                        📝 {exam.results_count} entered
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button onClick={() => togglePublish(exam)}
                                        className={`rounded-full px-3 py-1 text-xs font-semibold border transition ${exam.is_published ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100'}`}>
                                        {exam.is_published ? '✓ Published' : 'Draft'}
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button onClick={() => destroy(exam)}
                                        className="rounded-md px-3 py-1 text-xs font-medium text-red-500 border border-red-200 hover:bg-red-50 transition">
                                        Delete
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
