import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Select } from '@/Components/ui/Select';
import type { DownloadLink, Category, Year } from '@/types/models';
import { ArrowLeft } from 'lucide-react';

interface Props {
    download?: DownloadLink;
    categories: Category[];
    years: Year[];
}

export default function DownloadForm({ download, categories, years }: Props) {
    const isEdit = !!download;

    const { data, setData, post, put, processing, errors } = useForm({
        title: (download as any)?.title ?? '',
        description: (download as any)?.description ?? '',
        category_id: download?.category_id ?? '',
        year_id: download?.year_id ?? '',
        url: download?.url ?? '',
        file_size: (download as any)?.file_size ?? '',
        status: download?.status ?? true,
        sort_order: (download as any)?.sort_order ?? 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/downloads/${download.id}`);
        } else {
            post('/admin/downloads');
        }
    };

    return (
        <AdminLayout
            title={isEdit ? 'Edit Download Link' : 'Add Download Link'}
            breadcrumbs={[
                { label: 'Downloads', href: '/admin/downloads' },
                { label: isEdit ? 'Edit' : 'Create' }
            ]}
            action={
                <Link href="/admin/downloads">
                    <Button variant="secondary" className="flex items-center gap-1.5">
                        <ArrowLeft size={16} /> Back to List
                    </Button>
                </Link>
            }
        >
            <Head title={isEdit ? 'Edit Download' : 'Create Download'} />

            <div className="max-w-2xl">
                <Card>
                    <CardBody>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            {/* Title */}
                            <Input
                                label="Download Resource Title"
                                required
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={errors.title}
                                placeholder="E.g., Dora-e-Hadith Complete Lecture Notes"
                            />

                            {/* Description */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Enter file size, contents overview, or language notes..."
                                />
                                {errors.description && <span className="text-sm text-destructive">{errors.description}</span>}
                            </div>

                            {/* Category & Year */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select
                                    label="Classification Category"
                                    required
                                    value={data.category_id.toString()}
                                    onChange={(e) => setData('category_id', e.target.value ? parseInt(e.target.value) : '')}
                                    options={[
                                        { value: '', label: 'Select category...' },
                                        ...categories.map(cat => ({
                                            value: cat.id.toString(),
                                            label: `${cat.name} (${cat.type})`
                                        }))
                                    ]}
                                    error={errors.category_id}
                                />

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
                            </div>

                            {/* URL Resource */}
                            <Input
                                label="Download URL / File Link"
                                required
                                value={data.url}
                                onChange={(e) => setData('url', e.target.value)}
                                error={errors.url}
                                placeholder="E.g., Google Drive URL or direct file download address"
                            />

                            {/* File Size, Status, Sort Order */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input
                                    label="File Size (E.g., 14 MB)"
                                    value={data.file_size}
                                    onChange={(e) => setData('file_size', e.target.value)}
                                    error={errors.file_size}
                                />

                                <Input
                                    type="number"
                                    label="Sort Order"
                                    value={data.sort_order.toString()}
                                    onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                    error={errors.sort_order}
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
                                <Link href="/admin/downloads">
                                    <Button type="button" variant="secondary">Cancel</Button>
                                </Link>
                                <Button type="submit" variant="primary" disabled={processing}>
                                    {isEdit ? 'Save Changes' : 'Create Link'}
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </AdminLayout>
    );
}
