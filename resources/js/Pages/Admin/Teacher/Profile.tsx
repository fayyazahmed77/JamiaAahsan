import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

interface CourseRow {
    id: number; name: string; code: string;
    credit_hours: number; students_count: number; assignments_count: number;
}
interface Stats {
    total_courses: number; total_students: number;
    total_assignments: number; total_sessions: number;
}
interface Teacher {
    id: number; name: string; urdu_name?: string; designation?: string;
    designation_urdu?: string; bio?: string; photo_uri?: string;
    is_leadership: boolean; status: boolean;
}
interface Props { teacher: Teacher; stats: Stats; courses: CourseRow[] }

export default function TeacherProfile({ teacher, stats, courses }: Props) {
    return (
        <AdminLayout>
            <Head title={`Profile — ${teacher.name}`} />

            {/* Back */}
            <div className="mb-4">
                <Link href="/admin/teachers"
                    className="text-sm text-gray-400 hover:text-gray-700 transition">
                    ← Teachers
                </Link>
            </div>

            {/* Profile card */}
            <div className="mb-6 flex flex-wrap items-start gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center overflow-hidden shrink-0">
                    {teacher.photo_uri
                        ? <img src={`/storage/${teacher.photo_uri}`} alt={teacher.name} className="w-full h-full object-cover" />
                        : <span className="text-indigo-700 text-2xl font-bold">{teacher.name[0]}</span>
                    }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl font-bold text-gray-900">{teacher.name}</h1>
                        {teacher.urdu_name && (
                            <span className="text-lg text-gray-500 font-medium" dir="rtl">{teacher.urdu_name}</span>
                        )}
                        {teacher.is_leadership && (
                            <span className="rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-xs font-semibold text-amber-700">
                                Leadership
                            </span>
                        )}
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${teacher.status ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                            {teacher.status ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    {teacher.designation && (
                        <p className="text-gray-500 text-sm mt-1">
                            {teacher.designation}
                            {teacher.designation_urdu && <span className="ml-2 text-gray-400" dir="rtl">{teacher.designation_urdu}</span>}
                        </p>
                    )}
                    {teacher.bio && (
                        <p className="mt-2 text-sm text-gray-600 max-w-2xl leading-relaxed">{teacher.bio}</p>
                    )}
                </div>
            </div>

            {/* Stats grid */}
            <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Active Courses',    value: stats.total_courses,     icon: '📚', color: 'text-indigo-700 bg-indigo-50 border-indigo-100' },
                    { label: 'Students',           value: stats.total_students,    icon: '👨‍🎓', color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
                    { label: 'Assignments Created',value: stats.total_assignments, icon: '📝', color: 'text-amber-700 bg-amber-50 border-amber-100' },
                    { label: 'Class Sessions',     value: stats.total_sessions,    icon: '🏫', color: 'text-sky-700 bg-sky-50 border-sky-100' },
                ].map(s => (
                    <div key={s.label} className={`rounded-xl border px-5 py-4 ${s.color}`}>
                        <div className="text-2xl mb-1">{s.icon}</div>
                        <div className="text-2xl font-bold">{s.value}</div>
                        <div className="text-xs font-medium opacity-70 mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Assigned courses */}
            <div>
                <h2 className="text-sm font-bold text-gray-700 mb-3">Assigned Courses</h2>

                {courses.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
                        <p className="text-gray-400">No active courses assigned to this teacher.</p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Course</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">Credits</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">Students</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">Assignments</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">Grade Sheet</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {courses.map((c, idx) => (
                                    <tr key={c.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-gray-900 text-sm">{c.code} · {c.name}</p>
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm text-gray-600">{c.credit_hours}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-0.5 text-xs font-semibold">
                                                {c.students_count}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="rounded-full bg-amber-50 text-amber-700 px-3 py-0.5 text-xs font-semibold">
                                                {c.assignments_count}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Link href={`/admin/assignments/grading?course_id=${c.id}`}
                                                className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition">
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
        </AdminLayout>
    );
}
