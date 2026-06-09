import React, { useState } from 'react';
import SEOHead from '@/Components/Public/SEOHead';
import { Link, usePage, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedData } from '@/types/inertia';
import type { Paginated, DownloadLink, Category, Year } from '@/types/models';
import { cn } from '@/lib/utils';
import { Download, FileText, Search, Filter, RefreshCw } from 'lucide-react';

interface DownloadsIndexProps {
    downloads: Paginated<DownloadLink>;
    categories: Category[];
    years: Year[];
    filters: {
        category_id?: string;
        year_id?: string;
    };
}

export default function Index({ downloads, categories, years, filters }: DownloadsIndexProps) {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    const [selectedCategory, setSelectedCategory] = useState(filters.category_id || '');
    const [selectedYear, setSelectedYear] = useState(filters.year_id || '');
    const [searchQuery, setSearchQuery] = useState('');

    const applyFilters = (catId: string, yrId: string) => {
        router.get('/downloads', {
            category_id: catId || undefined,
            year_id: yrId || undefined
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedCategory(value);
        applyFilters(value, selectedYear);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedYear(value);
        applyFilters(selectedCategory, value);
    };

    const handleReset = () => {
        setSelectedCategory('');
        setSelectedYear('');
        router.get('/downloads', {}, { replace: true });
    };

    // Client-side search filtering on the current page's records
    const filteredDownloads = downloads.data.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Only show categories that are relevant to downloads
    const downloadCategories = categories.filter(c => c.type === 'download' || c.type === 'audio');

    return (
        <div className="bg-background min-h-screen text-foreground transition-colors pb-16">
            <SEOHead 
                title={isUrdu ? 'کتب و دستاویزات لائبریری' : 'Downloads & Publications Library'} 
                description={isUrdu ? 'جامعہ احسن کے درسی نصاب، کتب، مجلات اور سالانہ کیلنڈر ڈاؤن لوڈ کرنے کا مرکز۔' : 'Download textbooks, academic calendars, syllabi, and monthly publications from Jamia Ahsan.'}
            />

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
                        {isUrdu ? 'لائبریری سینٹر' : 'Downloads Library'}
                    </span>
                    <h1 className={cn(
                        "text-3xl md:text-5xl font-black tracking-tight mb-4 text-white",
                        isUrdu ? "font-urdu leading-normal" : "font-heading"
                    )}>
                        {isUrdu ? 'کتب اور تعلیمی دستاویزات' : 'Publications & Downloads'}
                    </h1>
                    <p className={cn(
                        "text-sm md:text-base text-stone-300 max-w-2xl font-medium",
                        isUrdu ? "font-urdu leading-relaxed" : "font-sans"
                    )}>
                        {isUrdu 
                            ? 'نصابی کتابیں، معلوماتی بروشرز، سالانہ کیلنڈر اور دیگر اشاعتیں یہاں سے پی ڈی ایف فارمیٹ میں ڈاؤن لوڈ کریں۔' 
                            : 'Access academic textbooks, class syllabi, monthly magazines, and administrative guidelines in digital PDF formats.'
                        }
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                
                {/* Search & Filter Toolbar */}
                <div className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-5 md:p-6 shadow-sm mb-10 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        
                        {/* Search Input */}
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                            <input 
                                type="text"
                                placeholder={isUrdu ? 'عنوان سے تلاش کریں...' : 'Search by title...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={cn(
                                    "w-full pl-10 pr-4 py-2 border rounded-xl bg-stone-50 dark:bg-sapphire-950/40 border-stone-200 dark:border-stone-800 text-sm focus:outline-none focus:ring-1 focus:ring-sapphire-500",
                                    isUrdu && "text-right pr-10 pl-4 font-urdu"
                                )}
                            />
                        </div>

                        {/* Category Select */}
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className={cn(
                                    "w-full h-10 px-3 border rounded-xl bg-stone-50 dark:bg-sapphire-950/40 border-stone-200 dark:border-stone-800 text-sm focus:outline-none focus:ring-1 focus:ring-sapphire-500",
                                    isUrdu && "text-right font-urdu"
                                )}
                            >
                                <option value="">{isUrdu ? 'تمام زمرہ جات' : 'All Categories'}</option>
                                {downloadCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Year Select */}
                        <div className="relative">
                            <select
                                value={selectedYear}
                                onChange={handleYearChange}
                                className={cn(
                                    "w-full h-10 px-3 border rounded-xl bg-stone-50 dark:bg-sapphire-950/40 border-stone-200 dark:border-stone-800 text-sm focus:outline-none focus:ring-1 focus:ring-sapphire-500",
                                    isUrdu && "text-right font-urdu"
                                )}
                            >
                                <option value="">{isUrdu ? 'تمام سال' : 'All Years'}</option>
                                {years.map(yr => (
                                    <option key={yr.id} value={yr.id}>{yr.name}</option>
                                ))}
                            </select>
                        </div>

                    </div>

                    {/* Reset Filters Option */}
                    {(selectedCategory || selectedYear || searchQuery) && (
                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleReset}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-sapphire-600 transition-colors"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>{isUrdu ? 'فلٹر صاف کریں' : 'Reset Filters'}</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Downloads List */}
                {filteredDownloads.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredDownloads.map((item) => (
                            <div 
                                key={item.id}
                                className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 hover:border-sapphire-500/20"
                            >
                                <div className="w-10 h-10 rounded-xl bg-sapphire-500/10 text-sapphire-500 flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-gold-550 bg-gold-500/5 px-2 py-0.5 rounded border border-gold-500/10 w-fit block mb-1">
                                        {item.category?.name || 'Publication'}
                                    </span>
                                    <h3 className={cn("text-base font-black text-stone-900 dark:text-white truncate", isUrdu && "font-urdu")}>
                                        {item.title}
                                    </h3>
                                    <p className={cn("text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed pb-3", isUrdu && "font-urdu text-[13px] leading-6")}>
                                        {item.description || (isUrdu ? 'اس فائل کا تعارف دستیاب نہیں ہے۔' : 'No description provided for this download link.')}
                                    </p>
                                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-900">
                                        <span className="text-[10px] text-stone-400 font-bold uppercase">
                                            {isUrdu ? `سائز: ${item.file_size || 'نامعلوم'}` : `Size: ${item.file_size || 'Unknown'}`}
                                        </span>
                                        <a 
                                            href={item.url}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 bg-sapphire-600 hover:bg-sapphire-700 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-xl transition-colors"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            <span>{isUrdu ? 'ڈاؤن لوڈ' : 'Download'}</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-stone-200 dark:border-stone-800 rounded-3xl">
                        <FileText className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
                        <h3 className={cn("text-lg font-black text-stone-900 dark:text-white mb-2", isUrdu ? "font-urdu" : "font-heading")}>
                            {isUrdu ? 'کوئی دستاویز نہیں ملی' : 'No Files Found'}
                        </h3>
                        <p className={cn("text-stone-500 dark:text-stone-400 text-sm max-w-sm mx-auto", isUrdu && "font-urdu")}>
                            {isUrdu 
                                ? 'آپ کے تلاش کردہ معیار کے مطابق کوئی فائل دستیاب نہیں ہے۔' 
                                : 'No publications match your selected category or search filters.'
                            }
                        </p>
                    </div>
                )}

                {/* Pagination Controls */}
                {downloads.meta && downloads.meta.last_page > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-12">
                        {downloads.links.prev ? (
                            <Link 
                                href={downloads.links.prev}
                                className="px-4 py-2 border border-stone-250 dark:border-stone-800 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-stone-50 dark:hover:bg-stone-900 transition-all"
                            >
                                {isUrdu ? 'پچھلا' : 'Previous'}
                            </Link>
                        ) : (
                            <span className="px-4 py-2 border border-stone-200 dark:border-stone-850 text-stone-350 dark:text-stone-650 rounded-xl text-xs font-black uppercase tracking-wider cursor-not-allowed">
                                {isUrdu ? 'پچھلا' : 'Previous'}
                            </span>
                        )}

                        <span className="text-xs font-bold text-stone-500">
                            {isUrdu 
                                ? `صفحہ ${downloads.meta.current_page} از ${downloads.meta.last_page}`
                                : `Page ${downloads.meta.current_page} of ${downloads.meta.last_page}`
                            }
                        </span>

                        {downloads.links.next ? (
                            <Link 
                                href={downloads.links.next}
                                className="px-4 py-2 border border-stone-250 dark:border-stone-800 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-stone-50 dark:hover:bg-stone-900 transition-all"
                            >
                                {isUrdu ? 'اگلا' : 'Next'}
                            </Link>
                        ) : (
                            <span className="px-4 py-2 border border-stone-200 dark:border-stone-850 text-stone-350 dark:text-stone-650 rounded-xl text-xs font-black uppercase tracking-wider cursor-not-allowed">
                                {isUrdu ? 'اگلا' : 'Next'}
                            </span>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
