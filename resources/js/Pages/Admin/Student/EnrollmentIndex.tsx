import { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

interface StudentRow {
    id: number; name: string; student_id_number: string;
    current_year: number; current_semester: number; enrolled_count: number;
}
interface PaginationLink { url: string | null; label: string; active: boolean }
interface Props {
    students: { data: StudentRow[]; links: PaginationLink[] };
    filters:  { search: string };
}

export default function EnrollmentIndex({ students, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    function applySearch(e: FormEvent) {
        e.preventDefault();
        router.get('/admin/enrollments', { search }, { preserveState: false });
    }

    return (
        <AdminLayout>
            <Head title="Student Enrollment" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Course Enrollment</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage which courses each student is enrolled in</p>
                </div>
            </div>

            {/* Search */}
            <form onSubmit={applySearch}
                className="mb-5 flex gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <input
                    type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or student ID…"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none" />
                <button type="submit"
                    className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition">
                    Search
                </button>
            </form>

            {/* Student list */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Student</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">Year / Sem</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">Courses Enrolled</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">Manage</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {students.data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                                    No students found.
                                </td>
                            </tr>
                        ) : students.data.map((s, idx) => (
                            <tr key={s.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                                <td className="px-4 py-3 text-sm text-gray-400">{idx + 1}</td>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-900 text-sm">{s.name}</p>
                                    <p className="text-xs text-gray-400 font-mono">{s.student_id_number}</p>
                                </td>
                                <td className="px-4 py-3 text-center text-sm text-gray-600">
                                    Y{s.current_year} · S{s.current_semester}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold ${
                                        s.enrolled_count === 0 ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-700'
                                    }`}>
                                        {s.enrolled_count} course{s.enrolled_count !== 1 ? 's' : ''}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Link href={`/admin/enrollments/${s.id}`}
                                        className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition">
                                        Manage →
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
