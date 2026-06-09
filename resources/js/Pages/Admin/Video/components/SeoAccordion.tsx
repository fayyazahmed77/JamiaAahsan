import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import { Textarea } from '@/Components/ui/Textarea';
import { ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';

interface SeoProps {
    title: string;
    slug: string;
    setSlug: (val: string) => void;
    metaTitle: string;
    setMetaTitle: (val: string) => void;
    metaDescription: string;
    setMetaDescription: (val: string) => void;
}

export function SeoAccordion({
    title,
    slug,
    setSlug,
    metaTitle,
    setMetaTitle,
    metaDescription,
    setMetaDescription,
}: SeoProps) {

    const { APP_URL = 'https://jamiaahsan.edu.pk' } = usePage<SharedData>().props as any;
    const [isOpen, setIsOpen] = useState(false);

    // Auto-generate slug when title changes (if user hasn't edited slug manually yet)
    const [userEditedSlug, setUserEditedSlug] = useState(false);

    useEffect(() => {
        if (!userEditedSlug && title) {
            const generated = title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '') // remove spec chars
                .replace(/\s+/g, '-')       // replace spaces with -
                .replace(/-+/g, '-');       // collapse duplicate dashes
            setSlug(generated);
        }
    }, [title, userEditedSlug]);

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserEditedSlug(true);
        const input = e.target.value
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        setSlug(input);
    };

    return (
        <Card className="rounded-3xl border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 shadow-sm overflow-hidden mb-8">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between border-b border-stone-100 dark:border-stone-850 px-8 py-5 text-lg font-bold text-stone-900 dark:text-white text-left focus:outline-none"
            >
                <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-gold-400" />
                    <span>Search Engine Optimization (SEO)</span>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {isOpen && (
                <CardBody className="p-8 space-y-6">
                    {/* Unique Slug editor */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm font-semibold text-stone-700 dark:text-stone-300">
                            <label>URL Slug</label>
                            <span className="text-xs text-stone-400">Unique routing link</span>
                        </div>
                        <div className="flex rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800">
                            <span className="bg-stone-100 dark:bg-stone-950 px-4 py-2.5 text-xs text-stone-500 flex items-center select-none border-r border-stone-200 dark:border-stone-800">
                                {APP_URL}/video/
                            </span>
                            <input
                                type="text"
                                value={slug}
                                onChange={handleSlugChange}
                                placeholder="importance-of-salah"
                                className="flex-grow px-4 py-2.5 bg-white dark:bg-stone-900 text-stone-900 dark:text-white text-sm focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Meta Title */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm font-semibold text-stone-700 dark:text-stone-300">
                            <label>Meta Title</label>
                            <span className="text-xs text-stone-400 font-normal">{metaTitle.length} / 60</span>
                        </div>
                        <Input
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            placeholder="Page search title (e.g. Importance of Salah | Jamia Ahsan)"
                            maxLength={60}
                            className="rounded-xl border-stone-200 dark:border-stone-800"
                        />
                    </div>

                    {/* Meta Description */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm font-semibold text-stone-700 dark:text-stone-300">
                            <label>Meta Description</label>
                            <span className="text-xs text-stone-400 font-normal">{metaDescription.length} / 160</span>
                        </div>
                        <Textarea
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                            placeholder="Short overview shown in search results..."
                            rows={3}
                            maxLength={160}
                            className="rounded-xl border-stone-200 dark:border-stone-800"
                        />
                    </div>
                </CardBody>
            )}
        </Card>
    );
}
