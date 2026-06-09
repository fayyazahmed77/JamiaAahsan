import React from 'react';
import { Card, CardHeader, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface PublishProps {
    status: boolean; // false = Draft, true = Published
    setStatus: (val: boolean) => void;
    onSubmit: () => void;
    processing: boolean;
    // Checklist parameters
    checklist: {
        titleAdded: boolean;
        descriptionAdded: boolean;
        videoSelected: boolean;
        thumbnailSelected: boolean;
        speakerSelected: boolean;
        categorySelected: boolean;
        yearSelected: boolean;
    };
}

export function PublishPanel({
    status,
    setStatus,
    onSubmit,
    processing,
    checklist,
}: PublishProps) {

    // Evaluate completeness percentage
    const checklistItems = [
        { label: 'English Title', checked: checklist.titleAdded },
        { label: 'Description added', checked: checklist.descriptionAdded },
        { label: 'Video Source selected', checked: checklist.videoSelected },
        { label: 'Thumbnail uploaded', checked: checklist.thumbnailSelected },
        { label: 'Speaker selected', checked: checklist.speakerSelected },
        { label: 'Category selected', checked: checklist.categorySelected },
        { label: 'Year selected', checked: checklist.yearSelected },
    ];

    const completedCount = checklistItems.filter(item => item.checked).length;
    const completenessPct = Math.round((completedCount / checklistItems.length) * 100);

    return (
        <Card className="rounded-3xl border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 shadow-sm overflow-hidden mb-6">
            <CardHeader className="border-b border-stone-100 dark:border-stone-850 px-8 py-5 text-sm font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Publish Status
            </CardHeader>
            <CardBody className="p-8 space-y-6">
                
                {/* Status selector options */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700 dark:text-stone-300">Visibility Status</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setStatus(false)}
                            className={`py-2 px-4 rounded-xl border text-xs font-bold transition-all ${!status ? 'bg-gold-400/10 border-gold-400 text-gold-600 dark:text-gold-400' : 'bg-transparent border-stone-200 dark:border-stone-800 text-stone-500'}`}
                        >
                            Draft / Hidden
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatus(true)}
                            className={`py-2 px-4 rounded-xl border text-xs font-bold transition-all ${status ? 'bg-sapphire-500/10 border-sapphire-500 text-sapphire-600 dark:text-sapphire-500' : 'bg-transparent border-stone-200 dark:border-stone-800 text-stone-500'}`}
                        >
                            Active / Published
                        </button>
                    </div>
                </div>

                {/* Completeness Checklist widget */}
                <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-stone-850">
                    <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-stone-500 uppercase tracking-wider">Studio Checklist</span>
                        <span className={completenessPct === 100 ? 'text-sapphire-500' : 'text-gold-400'}>
                            {completenessPct}% Ready
                        </span>
                    </div>

                    {/* Progress slider bar */}
                    <div className="h-1.5 w-full bg-stone-100 dark:bg-stone-950 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${completenessPct === 100 ? 'bg-sapphire-500' : 'bg-gold-400'}`}
                            style={{ width: `${completenessPct}%` }}
                        />
                    </div>

                    {/* Bullet checklist checks */}
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                        {checklistItems.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                                <span className={item.checked ? 'text-stone-600 dark:text-stone-300' : 'text-stone-400'}>
                                    {item.label}
                                </span>
                                {item.checked ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-sapphire-500 shrink-0" />
                                ) : (
                                    <Circle className="w-3.5 h-3.5 text-stone-300 dark:text-stone-700 shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submitting publish button action */}
                <div className="pt-6 border-t border-stone-100 dark:border-stone-850 space-y-3">
                    <Button
                        onClick={onSubmit}
                        disabled={processing}
                        type="button"
                        className={`w-full py-3 rounded-xl font-bold transition-all text-center flex justify-center items-center ${completenessPct === 100 ? 'bg-sapphire-500 hover:bg-sapphire-400 text-white' : 'bg-stone-800 hover:bg-stone-750 text-stone-200 dark:bg-stone-950 border border-stone-800'}`}
                    >
                        {processing ? 'Processing...' : status ? 'Publish Video' : 'Save Draft'}
                    </Button>
                    
                    {completenessPct < 100 && (
                        <div className="flex gap-2 p-3 bg-gold-400/5 border border-gold-400/10 rounded-xl text-[10px] text-gold-400 leading-relaxed text-left">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>Some fields are incomplete. You can still save as a Draft and update later.</span>
                        </div>
                    )}
                </div>

            </CardBody>
        </Card>
    );
}
