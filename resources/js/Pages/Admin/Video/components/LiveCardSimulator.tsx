import React from 'react';
import { Card, CardHeader, CardBody } from '@/Components/ui/Card';
import { Play, Eye, Calendar, Sparkles } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';

interface SimulatorProps {
    title: string;
    urduTitle: string;
    speakerName: string;
    categoryName: string;
    thumbnailUrl: string | null;
    status: boolean;
}

export function LiveCardSimulator({
    title,
    urduTitle,
    speakerName,
    categoryName,
    thumbnailUrl,
    status,
}: SimulatorProps) {

    const { locale } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    return (
        <Card className="rounded-3xl border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 shadow-sm overflow-hidden mb-6">
            <CardHeader className="border-b border-stone-100 dark:border-stone-850 px-8 py-5 text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>Live Card Simulator</span>
            </CardHeader>
            <CardBody className="p-8">
                <p className="text-xs text-stone-400 mb-4 text-left leading-relaxed">
                    This is a real-time simulator showing how this video card is formatted and rendered on the public website interface:
                </p>

                {/* Simulated Public Video Card */}
                <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden bg-white dark:bg-stone-950 shadow-md group max-w-sm mx-auto">
                    {/* Simulated 16:9 Thumbnail preview box */}
                    <div className="relative aspect-video bg-gradient-to-br from-sapphire-700 to-sapphire-900 overflow-hidden flex items-center justify-center">
                        {thumbnailUrl ? (
                            <img
                                src={thumbnailUrl}
                                alt="Simulator Thumbnail"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <Play className="w-12 h-12 text-stone-400 group-hover:scale-110 transition-transform duration-300" />
                        )}

                        {/* Category Badge overlay */}
                        <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-gold-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {categoryName || 'Category'}
                        </div>
                    </div>

                    {/* Card details */}
                    <div className="p-5 space-y-3">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                            {speakerName || 'Speaker Name'}
                        </span>
                        
                        {/* Urdu / Arabic Title display (aligns right if present) */}
                        {urduTitle && (
                            <h4 className="text-right text-base font-bold text-stone-950 dark:text-white font-urdu leading-[1.8] line-clamp-1 border-b border-stone-100 dark:border-stone-900 pb-2">
                                {urduTitle}
                            </h4>
                        )}

                        {/* English Title */}
                        <h3 className="text-sm font-bold text-stone-900 dark:text-white line-clamp-1 text-left">
                            {title || 'Untitled Video Title'}
                        </h3>

                        {/* Views & Date mock */}
                        <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                            <div className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                <span>0 views</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Just Now</span>
                            </div>
                        </div>
                    </div>
                </div>

            </CardBody>
        </Card>
    );
}
