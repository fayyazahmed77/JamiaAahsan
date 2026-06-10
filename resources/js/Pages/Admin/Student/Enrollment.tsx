import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

interface EnrollmentRow {
    id: number; course_id: number; course_name: string; course_code: string;
    teacher_name?: string; status: string; enrolled_at: string; grade?: string;
}
interface CourseOption {
    id: number; name: string; code: string; credit_hours: number; teacher_name?: string;
}
interface StudentInfo {
    id: number; name: string; student_id_number: string;
    current_year: number; current_semester: number;
}
interface Props {
    student:           StudentInfo;
    enrollments:       EnrollmentRow[];
    available_courses: CourseOption[];
}

const STATUS_COLORS: Record<string, string> = {
    active:    'bg-emerald-100 text-emerald-700',
    completed: 'bg-sky-100 text-sky-700',
    dropped:   'bg-red-100 text-red-600',
};

export default function StudentEnrollment({ student, enrollments, available_courses }: Props) {
    const [selected, setSelected] = useState<number[]>([]);
    const [saving,   setSaving]   = useState(false);
    const [flash,    setFlash]    = useState('');

    function toggleCourse(id: number) {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    }

    function enroll() {
        if (selected.length === 0) return;
        setSaving(true);
        router.post(`/admin/enrollments/${student.id}/enroll`, { course_ids: selected }, {
            onSuccess: () => {
                setSelected([]);
                setFlash(`${selected.length} course(s) enrolled!`);
                setTimeout(() => setFlash(''), 3000);
            },
            onFinish: () => setSaving(false),
            preserveScroll: true,
        });
    }

    function drop(enrollmentId: number, courseName: string) {
        if (!confirm(`Drop "${courseName}" for ${student.name}? This will remove their enrollment.`)) return;
        router.delete(`/admin/enrollments/${enrollmentId}/drop`, { preserveScroll: true });
    }

    return (
        <AdminLayout>
            <Head title={`Enrollment — ${student.name}`} />

            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <Link href="/admin/enrollments"
                        className="text-sm text-gray-400 hover:text-gray-700 transition mb-1 inline-block">
                        ← All Students
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        <span className="font-mono">{student.student_id_number}</span>
                        {' · '} Year {student.current_year} · Semester {student.current_semester}
                    </p>
                </div>
                {flash && (
                    <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 shrink-0">
                        ✓ {flash}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ── Current enrollments ──────────────────────────────── */}
                <div>
                    <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                        Currently Enrolled ({enrollments.length} courses)
                    </h2>

                    {enrollments.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                            <p className="text-gray-400 text-sm">No courses enrolled yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {enrollments.map(e => (
                                <div key={e.id}
                                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm truncate">{e.course_code} · {e.course_name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            {e.teacher_name && (
                                                <span className="text-xs text-gray-400">{e.teacher_name}</span>
                                            )}
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[e.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                                {e.status}
                                            </span>
                                            {e.grade && (
                                                <span className="text-xs font-bold text-indigo-600">Grade: {e.grade}</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-300 mt-0.5">Enrolled: {e.enrolled_at}</p>
                                    </div>
                                    <button
                                        onClick={() => drop(e.id, e.course_name)}
                                        className="shrink-0 rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition">
                                        Drop
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Available courses to enroll ──────────────────────── */}
                <div>
                    <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
                        Available Courses ({available_courses.length})
                    </h2>

                    {available_courses.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                            <p className="text-gray-400 text-sm">All active courses are already enrolled.</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                                {available_courses.map(c => {
                                    const isSelected = selected.includes(c.id);
                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => toggleCourse(c.id)}
                                            className={`w-full text-left flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-100 ${
                                                isSelected
                                                    ? 'border-indigo-400 bg-indigo-50 ring-1 ring-indigo-300'
                                                    : 'border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/30'
                                            }`}>
                                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                                                isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                                            }`}>
                                                {isSelected && <span className="text-white text-[10px] leading-none">✓</span>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 text-sm">{c.code} · {c.name}</p>
                                                <p className="text-xs text-gray-400">
                                                    {c.credit_hours} credit hrs
                                                    {c.teacher_name ? ` · ${c.teacher_name}` : ''}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Enroll button */}
                            <div className="mt-4 flex items-center justify-between">
                                {selected.length > 0 && (
                                    <span className="text-sm text-indigo-700 font-medium">
                                        {selected.length} course{selected.length > 1 ? 's' : ''} selected
                                    </span>
                                )}
                                <button
                                    type="button"
                                    disabled={selected.length === 0 || saving}
                                    onClick={enroll}
                                    className="ml-auto rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition disabled:opacity-40">
                                    {saving ? 'Enrolling…' : `Enroll in ${selected.length || 0} Course${selected.length !== 1 ? 's' : ''}`}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
