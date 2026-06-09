import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Select } from '@/Components/ui/Select';
import type { Klass, ClassSession } from '@/types/models';
import { ArrowLeft } from 'lucide-react';

interface Props {
    klass: Klass;
    session?: ClassSession;
    teachers: { id: number; name: string; urdu_name: string }[];
    books: { id: number; name: string; urdu_name: string }[];
    years: { id: number; name: number }[];
}

export default function SessionForm({ klass, session, teachers, books, years }: Props) {
    const isEdit = !!session;

    const { data, setData, post, put, processing, errors } = useForm({
        teacher_id: session?.teacher_id ?? '',
        book_id: session?.book_id ?? '',
        year_id: session?.year_id ?? '',
        lecture_link: session?.lecture_link ?? '',
        status: session?.status ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/classes/${klass.id}/sessions/${session.id}`);
        } else {
            post(`/admin/classes/${klass.id}/sessions`);
        }
    };

    return (
        <AdminLayout
            title={isEdit ? 'Edit Session' : 'Schedule Session'}
            breadcrumbs={[
                { label: 'Classes', href: '/admin/classes' },
                { label: `Sessions: ${klass.name}`, href: `/admin/classes/${klass.id}/sessions` },
                { label: isEdit ? 'Edit' : 'Create' }
            ]}
            action={
                <Link href={`/admin/classes/${klass.id}/sessions`}>
                    <Button variant="secondary" className="flex items-center gap-1.5">
                        <ArrowLeft size={16} /> Back to Sessions
                    </Button>
                </Link>
            }
        >
            <Head title={isEdit ? 'Edit Session' : 'Schedule Session'} />

            <div className="max-w-xl">
                <Card>
                    <CardBody>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            {/* Class Info */}
                            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                                <span className="text-xs uppercase font-bold text-primary tracking-wider">Class Target</span>
                                <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{klass.name}</h3>
                                {klass.description && <p className="text-xs text-muted-foreground mt-1">{klass.description}</p>}
                            </div>

                            {/* Book Select */}
                            <Select
                                label="Select Book"
                                required
                                value={data.book_id.toString()}
                                onChange={(e) => setData('book_id', e.target.value ? parseInt(e.target.value) : '')}
                                options={[
                                    { value: '', label: 'Select a book...' },
                                    ...books.map(bk => ({
                                        value: bk.id.toString(),
                                        label: `${bk.urdu_name} (${bk.name})`
                                    }))
                                ]}
                                error={errors.book_id}
                            />

                            {/* Teacher Select */}
                            <Select
                                label="Select Teacher"
                                required
                                value={data.teacher_id.toString()}
                                onChange={(e) => setData('teacher_id', e.target.value ? parseInt(e.target.value) : '')}
                                options={[
                                    { value: '', label: 'Select an instructor...' },
                                    ...teachers.map(tr => ({
                                        value: tr.id.toString(),
                                        label: `${tr.urdu_name} (${tr.name})`
                                    }))
                                ]}
                                error={errors.teacher_id}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Year Select */}
                                <Select
                                    label="Academic Year"
                                    required
                                    value={data.year_id.toString()}
                                    onChange={(e) => setData('year_id', e.target.value ? parseInt(e.target.value) : '')}
                                    options={[
                                        { value: '', label: 'Select year...' },
                                        ...years.map(yr => ({
                                            value: yr.id.toString(),
                                            label: yr.name.toString()
                                        }))
                                    ]}
                                    error={errors.year_id}
                                />

                                {/* Status */}
                                <Select
                                    label="Status"
                                    value={data.status ? '1' : '0'}
                                    onChange={(e) => setData('status', e.target.value === '1')}
                                    options={[
                                        { value: '1', label: 'Active' },
                                        { value: '0', label: 'Inactive' },
                                    ]}
                                />
                            </div>

                            {/* Lecture Link */}
                            <Input
                                label="External Lecture/Resource Link (Optional)"
                                value={data.lecture_link}
                                onChange={(e) => setData('lecture_link', e.target.value)}
                                error={errors.lecture_link}
                                placeholder="E.g., Google Drive folder or YouTube URL"
                            />

                            {/* Actions */}
                            <div className="flex gap-4 justify-end border-t pt-4 border-border">
                                <Link href={`/admin/classes/${klass.id}/sessions`}>
                                    <Button type="button" variant="secondary">Cancel</Button>
                                </Link>
                                <Button type="submit" variant="primary" disabled={processing}>
                                    {isEdit ? 'Save Changes' : 'Schedule Session'}
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </AdminLayout>
    );
}
