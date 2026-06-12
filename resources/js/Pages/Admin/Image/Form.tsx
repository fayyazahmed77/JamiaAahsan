import React, { useRef, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Select } from '@/Components/ui/Select';
import type { Image as ImageModel } from '@/types/models';
import { ArrowLeft, Upload, FileImage } from 'lucide-react';

interface Props {
    image?: ImageModel;
    parent_images: { id: number; title: string | null }[];
}

export default function ImageForm({ image, parent_images }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        image ? (image.uri.startsWith('http') ? image.uri : `/storage/media/${image.uri}`) : null
    );

    const isEdit = !!image;

    interface ImageFormFields {
        title: string;
        description: string;
        btn_title: string;
        btn_link: string;
        weight: number;
        parent_id: number | '';
        status: boolean;
        category: string;
        image: File | null;
        _method: 'PUT' | 'POST';
    }

    const { data, setData, post, put, processing, errors } = useForm<ImageFormFields>({
        title: image?.title ?? '',
        description: image?.description ?? '',
        btn_title: image?.btn_title ?? '',
        btn_link: image?.btn_link ?? '',
        weight: image?.weight ?? 0,
        parent_id: image?.parent_id ?? '',
        status: image?.status ?? true,
        category: image?.category ?? 'Other',
        image: null,
        _method: isEdit ? 'PUT' : 'POST', // Handle Laravel file upload with PUT via method spoofing
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Inertia file uploads MUST be sent via POST with method spoofing if it is an update
        if (isEdit) {
            post(`/admin/images/${image.id}`, {
                forceFormData: true,
            });
        } else {
            post('/admin/images');
        }
    };

    return (
        <AdminLayout
            title={isEdit ? 'Edit Image/Banner' : 'Upload Image/Banner'}
            breadcrumbs={[
                { label: 'Banners & Galleries', href: '/admin/images' },
                { label: isEdit ? 'Edit' : 'Create' }
            ]}
            action={
                <Link href="/admin/images">
                    <Button variant="secondary" className="flex items-center gap-1.5">
                        <ArrowLeft size={16} /> Back to List
                    </Button>
                </Link>
            }
        >
            <Head title={isEdit ? 'Edit Image' : 'Upload Image'} />

            <div className="max-w-3xl">
                <Card>
                    <CardBody>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            {/* File Upload & Preview */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    Banner/Gallery Image <span className="text-destructive">*</span>
                                </span>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />

                                {previewUrl ? (
                                    <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-stone-900 group">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Button type="button" variant="primary" onClick={triggerFileSelect}>
                                                Change Image
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={triggerFileSelect}
                                        className="aspect-video w-full rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-stone-50/5 hover:border-primary/50 transition-colors"
                                    >
                                        <Upload size={32} />
                                        <span>Click to select image file (max 5MB)</span>
                                    </button>
                                )}
                                {errors.image && <span className="text-sm text-destructive font-medium">{errors.image}</span>}
                            </div>

                            {/* Title */}
                            <Input
                                label="Title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={errors.title}
                                placeholder="E.g., Shab-e-Jummah Banner"
                            />

                            {/* Description */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Enter image caption or description..."
                                />
                                {errors.description && <span className="text-sm text-destructive">{errors.description}</span>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Button Title */}
                                <Input
                                    label="Call to Action: Button Text"
                                    value={data.btn_title}
                                    onChange={(e) => setData('btn_title', e.target.value)}
                                    error={errors.btn_title}
                                    placeholder="E.g., Listen Now"
                                />

                                {/* Button Link */}
                                <Input
                                    label="Call to Action: Button Link"
                                    value={data.btn_link}
                                    onChange={(e) => setData('btn_link', e.target.value)}
                                    error={errors.btn_link}
                                    placeholder="E.g., /media/audio"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Weight */}
                                <Input
                                    type="number"
                                    label="Weight (Display Sort Order)"
                                    value={data.weight.toString()}
                                    onChange={(e) => setData('weight', parseInt(e.target.value) || 0)}
                                    error={errors.weight}
                                />

                                {/* Parent Image */}
                                <Select
                                    label="Parent Image (Optional)"
                                    value={data.parent_id.toString()}
                                    onChange={(e) => setData('parent_id', e.target.value ? parseInt(e.target.value) : '')}
                                    options={[
                                        { value: '', label: 'None (Main Banner/Gallery)' },
                                        ...parent_images.map(img => ({
                                            value: img.id.toString(),
                                            label: img.title || `Image #${img.id}`
                                        }))
                                    ]}
                                    error={errors.parent_id}
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

                                {/* Category */}
                                <Select
                                    label="Gallery Category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    options={[
                                        { value: 'Annual Events', label: 'Annual Events' },
                                        { value: 'Classroom Activities', label: 'Classroom Activities' },
                                        { value: 'Campus Life', label: 'Campus Life' },
                                        { value: 'Hifz Program', label: 'Hifz Program' },
                                        { value: 'Graduations', label: 'Graduations' },
                                        { value: 'Competitions', label: 'Competitions' },
                                        { value: 'Guest Visits', label: 'Guest Visits' },
                                        { value: 'Other', label: 'Other' },
                                    ]}
                                    error={errors.category}
                                />
                            </div>

                            {/* Submit */}
                            <div className="flex gap-4 justify-end border-t pt-4 border-border">
                                <Link href="/admin/images">
                                    <Button type="button" variant="secondary">Cancel</Button>
                                </Link>
                                <Button type="submit" variant="primary" disabled={processing}>
                                    {isEdit ? 'Save Changes' : 'Upload Banner'}
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </AdminLayout>
    );
}
