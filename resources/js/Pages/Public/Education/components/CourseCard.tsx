import React from 'react';
import { Link } from '@inertiajs/react';
import { BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import type { Klass } from '@/types/models';
import { cn } from '@/lib/utils';

interface CourseCardProps {
    course: Klass;
    isUrdu: boolean;
}

export default function CourseCard({ course, isUrdu }: CourseCardProps) {
    // Determine a dynamic icon or default badge based on course name/slug
    const getBadgeInfo = () => {
        const slug = course.slug.toLowerCase();
        if (slug.includes('hifz')) {
            return {
                label: isUrdu ? 'حفظ و تجوید' : 'Memorization',
                color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            };
        } else if (slug.includes('dars') || slug.includes('alim')) {
            return {
                label: isUrdu ? 'عالم کورس' : 'Islamic Scholarship',
                color: 'bg-sapphire-500/10 text-sapphire-500 border-sapphire-500/20'
            };
        } else if (slug.includes('nazira')) {
            return {
                label: isUrdu ? 'ناظرہ قرآن' : 'Recitation',
                color: 'bg-gold-500/10 text-gold-500 border-gold-500/20'
            };
        }
        return {
            label: isUrdu ? 'اسلامک کورس' : 'Islamic Program',
            color: 'bg-stone-500/10 text-stone-500 border-stone-500/20'
        };
    };

    const badge = getBadgeInfo();

    return (
        <div className="group relative bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full hover:border-sapphire-500/30">
            <div>
                {/* Badge and Icon header */}
                <div className="flex items-center justify-between mb-4">
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border",
                        badge.color,
                        isUrdu && "font-urdu text-[11px]"
                    )}>
                        {badge.label}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800/60 flex items-center justify-center text-stone-500 dark:text-stone-400 group-hover:bg-sapphire-500 group-hover:text-white transition-colors">
                        <BookOpen className="w-4 h-4" />
                    </div>
                </div>

                {/* Course Name */}
                <h3 className={cn(
                    "text-lg font-black text-stone-900 dark:text-white mb-2 leading-tight group-hover:text-sapphire-500 dark:group-hover:text-sapphire-400 transition-colors",
                    isUrdu ? "font-urdu text-xl" : "font-heading"
                )}>
                    {course.name}
                </h3>

                {/* Course Description */}
                <p className={cn(
                    "text-stone-600 dark:text-stone-400 text-sm mb-6 line-clamp-3 leading-relaxed",
                    isUrdu ? "font-urdu text-[14px]" : "font-sans"
                )}>
                    {course.description || (isUrdu ? 'اس کورس کی تفصیلات جلد اپلوڈ کی جائیں گی۔' : 'Details for this course will be uploaded soon.')}
                </p>
            </div>

            {/* Link to Details */}
            <Link 
                href={`/education/${course.slug}`}
                className={cn(
                    "inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sapphire-600 dark:text-sapphire-400 hover:text-gold-500 dark:hover:text-gold-400 transition-colors w-fit",
                    isUrdu && "font-urdu text-sm"
                )}
            >
                <span>{isUrdu ? 'تفصیلات دیکھیں' : 'View Details'}</span>
                {isUrdu ? (
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                ) : (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
            </Link>
        </div>
    );
}
