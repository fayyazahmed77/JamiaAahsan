import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Select } from '@/Components/ui/Select';
import type { LatestNews } from '@/types/models';
import { ArrowLeft } from 'lucide-react';

interface Props {
    newsItem?: LatestNews;
}

export default function LatestNewsForm({ newsItem }: Props) {
    const isEdit = !!newsItem;

    const { data, setData, post, put, processing, errors } = useForm({
        text: newsItem?.text ?? '',
        link: newsItem?.link ?? '',
        status: newsItem?.status ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/cms/latest-news/${newsItem.id}`);
        } else {
            post('/admin/cms/latest-news');
        }
    };

    return (
        <AdminLayout
            title={isEdit ? 'Edit News Entry' : 'Create News Entry'}
            breadcrumbs={[
                { label: 'Latest News', href: '/admin/cms/latest-news' },
                { label: isEdit ? 'Edit' : 'Create' }
            ]}
            action={
                <Link href="/admin/cms/latest-news">
                    <Button variant="secondary" className="flex items-center gap-1.5">
                        <ArrowLeft size={16} /> Back to List
                    </Button>
                </Link>
            }
        >
            <Head title={isEdit ? 'Edit News' : 'Create News'} />

            <div className="max-w-2xl">
                <Card>
                    <CardBody>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            {/* News Text */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    News / Announcement Text (Urdu content recommended)
                                </label>
                                <textarea
                                    value={data.text}
                                    onChange={(e) => setData('text', e.target.value)}
                                    className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-lg leading-relaxed focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring font-urdu text-right"
                                    dir="rtl"
                                    placeholder="یہاں اردو میں اہم خبر یا اعلان لکھیں۔۔۔"
                                    required
                                />
                                {errors.text && <span className="text-sm text-destructive font-medium">{errors.text}</span>}
                            </div>

                            {/* Redirect Link */}
                            <Input
                                label="Action Redirect URL (Optional)"
                                value={data.link}
                                onChange={(e) => setData('link', e.target.value)}
                                error={errors.link}
                                placeholder="E.g., https://domain.com/media/audio"
                            />

                            {/* Status */}
                            <Select
                                label="Status"
                                value={data.status ? '1' : '0'}
                                onChange={(e) => setData('status', e.target.value === '1')}
                                options={[
                                    { value: '1', label: 'Active (Displays on ticker)' },
                                    { value: '0', label: 'Inactive (Hidden)' },
                                ]}
                            />

                            {/* Actions */}
                            <div className="flex gap-4 justify-end border-t pt-4 border-border">
                                <Link href="/admin/cms/latest-news">
                                    <Button type="button" variant="secondary">Cancel</Button>
                                </Link>
                                <Button type="submit" variant="primary" disabled={processing}>
                                    {isEdit ? 'Save Changes' : 'Create Entry'}
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </AdminLayout>
    );
}
