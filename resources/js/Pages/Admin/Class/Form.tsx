import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Select } from '@/Components/ui/Select';
import type { Klass } from '@/types/models';
import { ArrowLeft } from 'lucide-react';

interface Props {
    klass?: Klass;
}

export default function ClassForm({ klass }: Props) {
    const isEdit = !!klass;

    const { data, setData, post, put, processing, errors } = useForm({
        name: klass?.name ?? '',
        slug: klass?.slug ?? '',
        description: klass?.description ?? '',
        live_link: klass?.live_link ?? '',
        youtube_live_link: klass?.youtube_live_link ?? '',
        sort: klass?.sort ?? 0,
        status: klass?.status ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/classes/${klass.id}`);
        } else {
            post('/admin/classes');
        }
    };

    return (
        <AdminLayout
            title={isEdit ? 'Edit Class' : 'Create Class'}
            breadcrumbs={[
                { label: 'Classes', href: '/admin/classes' },
                { label: isEdit ? 'Edit' : 'Create' }
            ]}
            action={
                <Link href="/admin/classes">
                    <Button variant="secondary" className="flex items-center gap-1.5">
                        <ArrowLeft size={16} /> Back to List
                    </Button>
                </Link>
            }
        >
            <Head title={isEdit ? 'Edit Class' : 'Create Class'} />

            <div className="max-w-2xl">
                <Card>
                    <CardBody>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            {/* Class Name */}
                            <Input
                                label="Class Name"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={errors.name}
                                placeholder="E.g., Dora-e-Hadith (Dars-e-Nizami Year 8)"
                            />

                            {/* Slug */}
                            <Input
                                label="Slug (URL Identifier)"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                error={errors.slug}
                                placeholder="auto-generated-if-blank"
                            />

                            {/* Description */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Enter class course descriptions or eligibility notes..."
                                />
                                {errors.description && <span className="text-sm text-destructive">{errors.description}</span>}
                            </div>

                            {/* Live Links */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Direct Live Audio Stream Link"
                                    value={data.live_link}
                                    onChange={(e) => setData('live_link', e.target.value)}
                                    error={errors.live_link}
                                    placeholder="E.g., Icecast HLS link"
                                />

                                <Input
                                    label="YouTube Live Stream Link"
                                    value={data.youtube_live_link}
                                    onChange={(e) => setData('youtube_live_link', e.target.value)}
                                    error={errors.youtube_live_link}
                                    placeholder="E.g., https://youtube.com/live/..."
                                />
                            </div>

                            {/* Sort & Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    type="number"
                                    label="Sort Order Index"
                                    value={data.sort.toString()}
                                    onChange={(e) => setData('sort', parseInt(e.target.value) || 0)}
                                    error={errors.sort}
                                />

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

                            {/* Actions */}
                            <div className="flex gap-4 justify-end border-t pt-4 border-border">
                                <Link href="/admin/classes">
                                    <Button type="button" variant="secondary">Cancel</Button>
                                </Link>
                                <Button type="submit" variant="primary" disabled={processing}>
                                    {isEdit ? 'Save Changes' : 'Create Class'}
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </AdminLayout>
    );
}
