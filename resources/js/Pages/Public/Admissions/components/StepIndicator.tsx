import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
    currentStep: number;
    steps: {
        title: string;
        urduTitle: string;
    }[];
    isUrdu: boolean;
}

export default function StepIndicator({ currentStep, steps, isUrdu }: StepIndicatorProps) {
    return (
        <div className="w-full py-4 mb-8">
            <div className="flex items-center justify-between relative max-w-xl mx-auto">
                {/* Connector Line behind circles */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-200 dark:bg-stone-850 -translate-y-1/2 z-0" />
                
                {/* Active progress connector line */}
                <div 
                    className="absolute top-1/2 left-0 h-0.5 bg-sapphire-600 dark:bg-sapphire-500 -translate-y-1/2 transition-all duration-500 z-0" 
                    style={{ 
                        width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                        right: isUrdu ? 'auto' : undefined,
                    }}
                />

                {steps.map((step, idx) => {
                    const stepNumber = idx + 1;
                    const isCompleted = currentStep > stepNumber;
                    const isActive = currentStep === stepNumber;

                    return (
                        <div key={idx} className="flex flex-col items-center relative z-10">
                            {/* Circle */}
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-all duration-300",
                                isCompleted 
                                    ? "bg-sapphire-600 border-sapphire-600 text-white dark:bg-sapphire-500 dark:border-sapphire-500" 
                                    : isActive 
                                        ? "bg-card border-sapphire-600 text-sapphire-600 dark:border-sapphire-500 dark:text-sapphire-300 ring-4 ring-sapphire-500/10"
                                        : "bg-card border-stone-200 text-stone-400 dark:border-stone-800"
                            )}>
                                {isCompleted ? (
                                    <Check className="w-5 h-5 stroke-[3]" />
                                ) : (
                                    <span>{stepNumber}</span>
                                )}
                            </div>
                            
                            {/* Label */}
                            <span className={cn(
                                "text-[11px] font-black uppercase tracking-wider mt-2 bg-background px-1.5",
                                isActive 
                                    ? "text-sapphire-600 dark:text-sapphire-300"
                                    : isCompleted
                                        ? "text-stone-700 dark:text-stone-300"
                                        : "text-stone-400",
                                isUrdu ? "font-urdu text-xs mt-1" : "font-sans"
                            )}>
                                {isUrdu ? step.urduTitle : step.title}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
