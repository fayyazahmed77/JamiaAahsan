import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Save, Settings, Phone, Globe, Shield } from 'lucide-react';

interface Props {
    settings: Record<string, string>;
}

export default function SettingsIndex({ settings }: Props) {
    const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social' | 'seo'>('general');
    const { hasPermission } = usePermission();

    const { data, setData, post, processing, errors } = useForm({
        site_name: settings.site_name ?? '',
        site_name_urdu: settings.site_name_urdu ?? '',
        contact_email: settings.contact_email ?? '',
        contact_phone: settings.contact_phone ?? '',
        contact_address: settings.contact_address ?? '',
        social_facebook: settings.social_facebook ?? '',
        social_youtube: settings.social_youtube ?? '',
        social_twitter: settings.social_twitter ?? '',
        seo_title: settings.seo_title ?? '',
        seo_description: settings.seo_description ?? '',
        seo_keywords: settings.seo_keywords ?? '',
        logo: null as File | null,
        favicon: null as File | null,
        _method: 'PUT', // Route is PUT but we use multipart POST with method spoofing for uploads
    });

    const handleFileChange = (field: 'logo' | 'favicon') => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData(field, file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/cms/settings', {
            forceFormData: true,
        });
    };

    const tabClass = (tab: typeof activeTab) =>
        `flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold transition-colors border-none cursor-pointer outline-none ${
            activeTab === tab
                ? 'bg-primary text-white'
                : 'bg-stone-50/5 text-muted-foreground hover:bg-stone-50/10'
        }`;

    return (
        <AdminLayout title="Global Platform Settings">
            <Head title="CMS Settings" />

            <div className="flex flex-col md:flex-row gap-6">
                {/* Tabs Sidebar */}
                <div className="flex flex-col gap-2 w-full md:w-[240px] shrink-0">
                    <button type="button" onClick={() => setActiveTab('general')} className={tabClass('general')}>
                        <Settings size={16} /> General Branding
                    </button>
                    <button type="button" onClick={() => setActiveTab('contact')} className={tabClass('contact')}>
                        <Phone size={16} /> Contact Details
                    </button>
                    <button type="button" onClick={() => setActiveTab('social')} className={tabClass('social')}>
                        <Globe size={16} /> Social Handles
                    </button>
                    <button type="button" onClick={() => setActiveTab('seo')} className={tabClass('seo')}>
                        <Shield size={16} /> SEO & Optimization
                    </button>
                </div>

                {/* Settings Panel */}
                <div className="flex-1 max-w-3xl">
                    <Card>
                        <CardBody>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                {/* TAB 1: GENERAL BRANDING */}
                                {activeTab === 'general' && (
                                    <div className="flex flex-col gap-6">
                                        <h3 className="font-semibold text-lg border-b pb-2 border-border" style={{ color: 'var(--text-primary)' }}>
                                            General Branding
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                label="Site Name (English)"
                                                value={data.site_name}
                                                onChange={(e) => setData('site_name', e.target.value)}
                                                error={errors.site_name}
                                            />
                                            <Input
                                                label="Site Name (Urdu)"
                                                value={data.site_name_urdu}
                                                onChange={(e) => setData('site_name_urdu', e.target.value)}
                                                error={errors.site_name_urdu}
                                                className="font-urdu text-right"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end mt-2">
                                            {/* Logo Upload */}
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Upload Institution Logo</label>
                                                <input
                                                    type="file"
                                                    onChange={handleFileChange('logo')}
                                                    accept="image/*"
                                                    className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white file:cursor-pointer"
                                                />
                                                {settings.logo_uri && (
                                                    <div className="h-12 w-auto object-contain flex mt-2 bg-stone-900 p-1.5 rounded border">
                                                        <img src={`/storage/media/${settings.logo_uri}`} alt="Logo" className="h-full object-contain" />
                                                    </div>
                                                )}
                                                {errors.logo && <span className="text-xs text-destructive">{errors.logo}</span>}
                                            </div>

                                            {/* Favicon Upload */}
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Upload Favicon Icon</label>
                                                <input
                                                    type="file"
                                                    onChange={handleFileChange('favicon')}
                                                    accept="image/*"
                                                    className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white file:cursor-pointer"
                                                />
                                                {settings.favicon_uri && (
                                                    <div className="h-8 w-8 object-contain flex mt-2 bg-stone-900 p-1 rounded border">
                                                        <img src={`/storage/media/${settings.favicon_uri}`} alt="Favicon" className="h-full w-full object-contain" />
                                                    </div>
                                                )}
                                                {errors.favicon && <span className="text-xs text-destructive">{errors.favicon}</span>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 2: CONTACT DETAILS */}
                                {activeTab === 'contact' && (
                                    <div className="flex flex-col gap-6">
                                        <h3 className="font-semibold text-lg border-b pb-2 border-border" style={{ color: 'var(--text-primary)' }}>
                                            Contact Details
                                        </h3>
                                        <Input
                                            type="email"
                                            label="Public Inquiries Email Address"
                                            value={data.contact_email}
                                            onChange={(e) => setData('contact_email', e.target.value)}
                                            error={errors.contact_email}
                                        />
                                        <Input
                                            label="Public Contact Phone / Mobile"
                                            value={data.contact_phone}
                                            onChange={(e) => setData('contact_phone', e.target.value)}
                                            error={errors.contact_phone}
                                        />
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Address</label>
                                            <textarea
                                                value={data.contact_address}
                                                onChange={(e) => setData('contact_address', e.target.value)}
                                                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                                            />
                                            {errors.contact_address && <span className="text-sm text-destructive">{errors.contact_address}</span>}
                                        </div>
                                    </div>
                                )}

                                {/* TAB 3: SOCIAL HANDLES */}
                                {activeTab === 'social' && (
                                    <div className="flex flex-col gap-6">
                                        <h3 className="font-semibold text-lg border-b pb-2 border-border" style={{ color: 'var(--text-primary)' }}>
                                            Social Handles
                                        </h3>
                                        <Input
                                            label="Facebook Page URL"
                                            value={data.social_facebook}
                                            onChange={(e) => setData('social_facebook', e.target.value)}
                                            error={errors.social_facebook}
                                        />
                                        <Input
                                            label="YouTube Channel URL"
                                            value={data.social_youtube}
                                            onChange={(e) => setData('social_youtube', e.target.value)}
                                            error={errors.social_youtube}
                                        />
                                        <Input
                                            label="Twitter / X Page URL"
                                            value={data.social_twitter}
                                            onChange={(e) => setData('social_twitter', e.target.value)}
                                            error={errors.social_twitter}
                                        />
                                    </div>
                                )}

                                {/* TAB 4: SEO METADATA */}
                                {activeTab === 'seo' && (
                                    <div className="flex flex-col gap-6">
                                        <h3 className="font-semibold text-lg border-b pb-2 border-border" style={{ color: 'var(--text-primary)' }}>
                                            SEO & Metadata Configuration
                                        </h3>
                                        <Input
                                            label="Default Meta Title Tag"
                                            value={data.seo_title}
                                            onChange={(e) => setData('seo_title', e.target.value)}
                                            error={errors.seo_title}
                                        />
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Default Meta Description Tag</label>
                                            <textarea
                                                value={data.seo_description}
                                                onChange={(e) => setData('seo_description', e.target.value)}
                                                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                                            />
                                            {errors.seo_description && <span className="text-sm text-destructive">{errors.seo_description}</span>}
                                        </div>
                                        <Input
                                            label="Meta Keywords (Comma separated)"
                                            value={data.seo_keywords}
                                            onChange={(e) => setData('seo_keywords', e.target.value)}
                                            error={errors.seo_keywords}
                                            placeholder="islam, jamia, lectures, bayanaat"
                                        />
                                    </div>
                                )}

                                {/* Submit button */}
                                {hasPermission('edit settings') && (
                                    <div className="flex justify-end border-t pt-4 border-border">
                                        <Button type="submit" variant="primary" disabled={processing} className="flex items-center gap-1.5">
                                            <Save size={16} /> Save Settings
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
