import React from 'react';
import { Card, CardHeader, CardBody } from '@/Components/ui/Card';
import { Eye, Heart, Download, Share2, BarChart2 } from 'lucide-react';

interface AnalyticsProps {
    views?: number;
}

export function VideoAnalytics({ views = 0 }: AnalyticsProps) {
    const stats = [
        { label: 'Total Views', value: views.toLocaleString(), icon: Eye, color: 'text-sapphire-500 bg-sapphire-500/10' },
        { label: 'Likes & Hearts', value: Math.round(views * 0.15).toLocaleString(), icon: Heart, color: 'text-red-500 bg-red-500/10' },
        { label: 'Downloads', value: Math.round(views * 0.05).toLocaleString(), icon: Download, color: 'text-blue-500 bg-blue-500/10' },
        { label: 'Social Shares', value: Math.round(views * 0.08).toLocaleString(), icon: Share2, color: 'text-gold-400 bg-gold-400/10' },
    ];

    return (
        <Card className="rounded-3xl border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 shadow-sm overflow-hidden mb-6">
            <CardHeader className="border-b border-stone-100 dark:border-stone-850 px-8 py-5 text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-sapphire-500 animate-pulse" />
                <span>Video Studio Analytics</span>
            </CardHeader>
            <CardBody className="p-8">
                <div className="grid grid-cols-2 gap-4">
                    {stats.map((st, idx) => {
                        const IconComponent = st.icon;
                        return (
                            <div key={idx} className="bg-stone-50 dark:bg-stone-950 p-4 border border-stone-200 dark:border-stone-850 rounded-2xl flex flex-col justify-between">
                                <div className={`w-8 h-8 rounded-lg ${st.color} flex items-center justify-center mb-3`}>
                                    <IconComponent className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block text-2xl font-extrabold text-stone-900 dark:text-white mb-0.5">{st.value}</span>
                                    <span className="block text-[10px] text-stone-400 font-medium uppercase tracking-wider">{st.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardBody>
        </Card>
    );
}
