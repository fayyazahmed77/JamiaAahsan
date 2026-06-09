import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Check, CloudLightning } from 'lucide-react';
import { Button } from '@/Components/ui/Button';

interface VideoHeaderProps {
    title: string;
    isSaving: boolean;
    lastSaved: Date | null;
    onPublish: () => void;
    processing: boolean;
}

export function VideoHeader({ title, isSaving, lastSaved, onPublish, processing }: VideoHeaderProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800 mb-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/videos"
                    className="p-2 rounded-full border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-400 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">{title}</h1>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-stone-500">
                        {isSaving ? (
                            <>
                                <CloudLightning className="w-3.5 h-3.5 animate-pulse text-gold-400" />
                                <span>Saving draft...</span>
                            </>
                        ) : lastSaved ? (
                            <>
                                <Check className="w-3.5 h-3.5 text-sapphire-500" />
                                <span>Draft saved locally at {formatTime(lastSaved)}</span>
                            </>
                        ) : (
                            <span>Draft ready</span>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <Link href="/admin/videos">
                    <Button variant="secondary" type="button" className="rounded-full px-6">
                        Cancel
                    </Button>
                </Link>
                <Button
                    onClick={onPublish}
                    disabled={processing}
                    type="button"
                    className="bg-sapphire-500 hover:bg-sapphire-400 text-white rounded-full px-6 font-semibold"
                >
                    {processing ? 'Publishing...' : 'Publish Video'}
                </Button>
            </div>
        </div>
    );
}
