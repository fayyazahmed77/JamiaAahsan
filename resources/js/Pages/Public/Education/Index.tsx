import React, { useState, useMemo } from 'react';
import SEOHead from '@/Components/Public/SEOHead';
import { usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedData } from '@/types/inertia';
import type { Klass } from '@/types/models';
import CourseCard from './components/CourseCard';
import { cn } from '@/lib/utils';
import { Search, BookOpen, GraduationCap, Grid, SlidersHorizontal } from 'lucide-react';

interface EducationIndexProps {
    courses: Klass[];
}

export default function Index({ courses }: EducationIndexProps) {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'dars' | 'quran'>('all');

    // Filter courses based on category and search query
    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const matchesSearch = 
                course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()));

            const slug = course.slug.toLowerCase();
            const matchesCategory = 
                selectedCategory === 'all' ||
                (selectedCategory === 'dars' && (slug.includes('dars') || slug.includes('alim'))) ||
                (selectedCategory === 'quran' && (slug.includes('hifz') || slug.includes('nazira') || slug.includes('tajweed')));

            return matchesSearch && matchesCategory;
        });
    }, [courses, searchQuery, selectedCategory]);

    return (
        <div className="bg-background min-h-screen text-foreground transition-colors pb-16">
            <SEOHead 
                title={isUrdu ? 'تعلیمی شعبہ جات اور کورسز' : 'Academic Programs & Courses'} 
                description={isUrdu ? 'جامعہ احسن کے تعلیمی پروگرامز بشمول درسِ نظامی، حفظ القرآن، ناظرہ اور تجوید کورسز۔' : 'Explore the academic courses at Jamia Ahsan, including Dars-e-Nizami, Quran Memorization, and Tajweed.'}
            />

            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    "itemListElement": courses.map((course, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                            "@type": "Course",
                            "name": course.name,
                            "description": course.description || course.name,
                            "provider": {
                                "@type": "Organization",
                                "name": "Jamia Arabia Ahsan Ul Uloom",
                                "sameAs": "https://jamiaahsan.edu.pk"
                            },
                            "url": `https://jamiaahsan.edu.pk/education/${course.slug}`
                        }
                    }))
                })}
            </script>

            {/* Sub-Header Banner */}
            <div className="relative bg-sapphire-950 py-16 md:py-20 text-white overflow-hidden shadow-md">
                <div className="absolute inset-0 pointer-events-none">
                    <img 
                        src="/images/video-page-bg.png" 
                        alt="" 
                        loading="lazy"
                        className="w-full h-full object-cover opacity-90" 
                    />
                    <div className="absolute inset-0 bg-black/25" />
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                    <span className="text-[10px] uppercase tracking-widest font-black text-gold-400 bg-gold-400/10 border border-gold-400/20 px-3 py-1 rounded-full mb-3">
                        {isUrdu ? 'تعلیمی پروگرامز' : 'Our Academics'}
                    </span>
                    <h1 className={cn(
                        "text-3xl md:text-5xl font-black tracking-tight mb-4 text-white",
                        isUrdu ? "font-urdu leading-normal" : "font-heading"
                    )}>
                        {isUrdu ? 'شعبہ جات اور تعلیمی کورسز' : 'Academic Programs'}
                    </h1>
                    <p className={cn(
                        "text-sm md:text-base text-stone-300 max-w-2xl font-medium",
                        isUrdu ? "font-urdu leading-relaxed" : "font-sans"
                    )}>
                        {isUrdu 
                            ? 'جامعہ احسن میں معیاری تعلیمی خدمات فراہم کی جاتی ہیں۔ نیچے ہمارے فعال تعلیمی شعبہ جات اور کورسز کی فہرست دیکھیں۔' 
                            : 'Jamia Ahsan offers structured, traditional Islamic education spanning scriptural studies, jurisprudence, Arabic, and theological sciences.'
                        }
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Search & Filter Bar */}
                <div className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-4 md:p-6 shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
                    
                    {/* Search Field */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                        <input 
                            type="text"
                            placeholder={isUrdu ? 'کورس تلاش کریں...' : 'Search courses...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cn(
                                "w-full pl-10 pr-4 py-2 border rounded-xl bg-stone-50 dark:bg-sapphire-950/40 border-stone-200 dark:border-stone-800 text-sm focus:outline-none focus:ring-1 focus:ring-sapphire-500",
                                isUrdu && "text-right pr-10 pl-4 font-urdu"
                            )}
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
                        <span className={cn(
                            "text-xs font-black uppercase text-stone-400 tracking-wider flex items-center gap-1.5 mr-2",
                            isUrdu && "font-urdu text-[11px]"
                        )}>
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            {isUrdu ? 'فلٹر کریں:' : 'Filter:'}
                        </span>

                        <button 
                            onClick={() => setSelectedCategory('all')}
                            className={cn(
                                "px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all",
                                selectedCategory === 'all'
                                    ? "bg-sapphire-600 text-white border-sapphire-600 dark:bg-sapphire-500 dark:border-sapphire-500"
                                    : "bg-transparent text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-sapphire-500/30",
                                isUrdu && "font-urdu text-sm"
                            )}
                        >
                            {isUrdu ? 'تمام کورسز' : 'All Courses'}
                        </button>

                        <button 
                            onClick={() => setSelectedCategory('dars')}
                            className={cn(
                                "px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all",
                                selectedCategory === 'dars'
                                    ? "bg-sapphire-600 text-white border-sapphire-600 dark:bg-sapphire-500 dark:border-sapphire-500"
                                    : "bg-transparent text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-sapphire-500/30",
                                isUrdu && "font-urdu text-sm"
                            )}
                        >
                            {isUrdu ? 'درسِ نظامی' : 'Dars-e-Nizami'}
                        </button>

                        <button 
                            onClick={() => setSelectedCategory('quran')}
                            className={cn(
                                "px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all",
                                selectedCategory === 'quran'
                                    ? "bg-sapphire-600 text-white border-sapphire-600 dark:bg-sapphire-500 dark:border-sapphire-500"
                                    : "bg-transparent text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-sapphire-500/30",
                                isUrdu && "font-urdu text-sm"
                            )}
                        >
                            {isUrdu ? 'حفظ و ناظرہ' : 'Hifz & Recitation'}
                        </button>
                    </div>
                </div>

                {/* Courses Grid */}
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredCourses.map((course) => (
                            <CourseCard 
                                key={course.id} 
                                course={course} 
                                isUrdu={isUrdu} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-stone-200 dark:border-stone-800 rounded-3xl">
                        <BookOpen className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
                        <h3 className={cn("text-lg font-black text-stone-900 dark:text-white mb-2", isUrdu ? "font-urdu" : "font-heading")}>
                            {isUrdu ? 'کوئی کورس نہیں ملا' : 'No Courses Found'}
                        </h3>
                        <p className={cn("text-stone-500 dark:text-stone-400 text-sm max-w-sm mx-auto", isUrdu && "font-urdu")}>
                            {isUrdu 
                                ? 'آپ کے تلاش کردہ معیار کے مطابق کوئی کورس نہیں ملا۔ براہ مہربانی کوئی اور نام تلاش کریں۔' 
                                : 'Try adjusting your search query or filter settings to find what you are looking for.'
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
