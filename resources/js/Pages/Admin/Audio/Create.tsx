import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Select } from '@/Components/ui/Select';
import { SearchableSelect } from '@/Components/ui/SearchableSelect';
import { Textarea } from '@/Components/ui/Textarea';
import { FileUpload } from '@/Components/ui/FileUpload';
import { TagInput } from '@/Components/ui/TagInput';
import type { Speaker, Category, Year } from '@/types/models';

interface Props {
    speakers: Speaker[];
    categories: Category[];
    years: Year[];
}

export default function AudioCreate({ speakers, categories, years }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        user_title: '',
        audio_file: null as File | null,
        uri: '',
        youtube_url: '',
        description: '',
        thumbnail: null as File | null,
        thumbnail_uri: '',
        publish_date: '',
        status: true,
        speaker_id: '',
        category_id: '',
        year_id: '',
        tags: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/audio');
    };

    return (
        <AdminLayout
            title="Upload Audio"
            breadcrumbs={[
                { label: 'Audio Library', href: '/admin/audio' },
                { label: 'Upload' },
            ]}
        >
            <Head title="Upload Audio" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl w-full">
                <Card className="rounded-3xl border border-stone-200 dark:border-stone-850">
                    <CardHeader className="border-b border-stone-100 dark:border-stone-850 px-6 py-4">Basic Details</CardHeader>
                    <CardBody className="p-6 flex flex-col gap-5">
                        <Input
                            label="Title"
                            required
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            error={errors.title}
                            placeholder="Enter main English/transliterated title"
                        />

                        <Input
                            label="User Title (Optional / Urdu / Arabic)"
                            value={data.user_title}
                            onChange={(e) => setData('user_title', e.target.value)}
                            error={errors.user_title}
                            placeholder="مثلاً: دجال اور علاماتِ قیامت"
                            style={{ textAlign: 'right', direction: 'rtl' }}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SearchableSelect
                                label="Speaker"
                                required
                                value={data.speaker_id}
                                onChange={(e) => setData('speaker_id', e.target.value)}
                                options={speakers.map(s => ({ value: s.id, label: s.name }))}
                                placeholder="Select Speaker"
                                error={errors.speaker_id}
                            />
                            <SearchableSelect
                                label="Category"
                                required
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                options={categories.map(c => ({ value: c.id, label: c.name }))}
                                placeholder="Select Category"
                                error={errors.category_id}
                            />
                            <SearchableSelect
                                label="Academic Year"
                                required
                                value={data.year_id}
                                onChange={(e) => setData('year_id', e.target.value)}
                                options={years.map(y => ({ value: y.id, label: y.name.toString() }))}
                                placeholder="Select Year"
                                error={errors.year_id}
                            />
                        </div>

                        <Textarea
                            label="Description / Lecture Notes"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            error={errors.description}
                            placeholder="Enter audio description, topics discussed, summary, etc."
                            rows={4}
                        />

                        <TagInput
                            label="Tags (Press Enter or Comma to add)"
                            value={data.tags}
                            onChange={(tags) => setData('tags', tags)}
                            placeholder="e.g. ramadan, dars, aqeedah"
                            error={errors.tags as string}
                        />
                    </CardBody>
                </Card>

                <Card className="rounded-3xl border border-stone-200 dark:border-stone-850">
                    <CardHeader className="border-b border-stone-100 dark:border-stone-850 px-6 py-4">Audio File Source</CardHeader>
                    <CardBody className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <FileUpload
                                    label="Upload MP3 File"
                                    accept="audio/*"
                                    onChange={(file) => setData('audio_file', file)}
                                    error={errors.audio_file}
                                    hint="Maximum file size: 100MB"
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <Input
                                    label="OR External Audio URL"
                                    value={data.uri}
                                    onChange={(e) => setData('uri', e.target.value)}
                                    error={errors.uri}
                                    placeholder="https://example.com/audio.mp3"
                                />
                                <Input
                                    label="YouTube Video Link (Optional)"
                                    value={data.youtube_url}
                                    onChange={(e) => setData('youtube_url', e.target.value)}
                                    error={errors.youtube_url}
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card className="rounded-3xl border border-stone-200 dark:border-stone-850">
                    <CardHeader className="border-b border-stone-100 dark:border-stone-850 px-6 py-4">Thumbnail & Publishing</CardHeader>
                    <CardBody className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <FileUpload
                                    label="Upload Thumbnail Image"
                                    accept="image/*"
                                    onChange={(file) => setData('thumbnail', file)}
                                    error={errors.thumbnail}
                                    hint="Recommended aspect ratio 16:9 (e.g. 1280x720). Max 5MB"
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <Input
                                    label="OR External Thumbnail URL"
                                    value={data.thumbnail_uri}
                                    onChange={(e) => setData('thumbnail_uri', e.target.value)}
                                    error={errors.thumbnail_uri}
                                    placeholder="https://example.com/thumbnail.jpg"
                                />

                                <Input
                                    label="Publish Date / Time"
                                    type="datetime-local"
                                    value={data.publish_date}
                                    onChange={(e) => setData('publish_date', e.target.value)}
                                    error={errors.publish_date}
                                    hint="Leave blank to publish immediately"
                                />

                                <Select
                                    label="Status"
                                    required
                                    value={data.status ? '1' : '0'}
                                    onChange={(e: { target: { value: string; }; }) => setData('status', e.target.value === '1')}
                                    options={[
                                        { value: '1', label: 'Active / Published' },
                                        { value: '0', label: 'Draft / Hidden' },
                                    ]}
                                    className="rounded-xl border-stone-200 dark:border-stone-800"
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <div className="flex justify-end gap-3">
                    <Link href="/admin/audio">
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" variant="primary" disabled={processing}>
                        Upload & Publish
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
