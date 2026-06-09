import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { FileUpload } from '@/Components/ui/FileUpload';

export default function AudioImport() {
    const { data, setData, post, processing, errors } = useForm({
        file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/audio-import');
    };

    return (
        <AdminLayout
            title="Import Audio via CSV"
            breadcrumbs={[
                { label: 'Audio Library', href: '/admin/audio' },
                { label: 'Import' },
            ]}
        >
            <Head title="Import Audio" />

            <div style={{ maxWidth: 600 }}>
                <Card>
                    <CardHeader>CSV Upload</CardHeader>
                    <CardBody>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                Upload a CSV file to bulk import audio records. The CSV file must contain the following headers:
                            </p>
                            
                            <div style={{ background: 'var(--surface-2)', padding: '12px 16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                <code style={{ fontSize: '0.8125rem', color: 'var(--primary-400)', wordBreak: 'break-all' }}>
                                    title,speaker_id,category_id,year_id,user_title,uri,youtube_url,description,thumbnail_uri,status,tags
                                </code>
                            </div>

                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                <h4 style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Field Guidance:</h4>
                                <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <li><strong>title</strong> (Required): Name of the audio track.</li>
                                    <li><strong>speaker_id, category_id, year_id</strong> (Required): Integer IDs from their respective modules.</li>
                                    <li><strong>tags</strong> (Optional): Comma-separated list of tags (e.g. <code>dars,ramadan</code>).</li>
                                    <li><strong>status</strong> (Optional): <code>1</code> for active, <code>0</code> for inactive.</li>
                                </ul>
                            </div>

                            <FileUpload
                                label="Choose CSV File"
                                accept=".csv,text/csv"
                                onChange={(file) => setData('file', file)}
                                error={errors.file}
                                hint="Maximum file size: 10MB"
                            />

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                <Link href="/admin/audio">
                                    <Button type="button" variant="secondary">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" variant="primary" disabled={processing || !data.file}>
                                    Import Records
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </AdminLayout>
    );
}
