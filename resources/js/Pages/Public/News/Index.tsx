import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import SEOHead from '@/Components/Public/SEOHead';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedData } from '@/types/inertia';
import type { Paginated, LatestNews } from '@/types/models';
import { cn } from '@/lib/utils';
import { Calendar, Search, ArrowRight, ArrowLeft, Newspaper } from 'lucide-react';

interface NewsIndexProps {
    news: Paginated<LatestNews>;
}

export default function Index({ news }: NewsIndexProps) {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    const [searchQuery, setSearchQuery] = useState('');

    // Filter items client-side if the user searches, fallback to paginated list
    const filteredNews = news.data.filter(item => 
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="bg-background min-h-screen text-foreground transition-colors pb-16">
            <SEOHead 
                title={isUrdu ? 'خبریں اور اعلانات' : 'News & Announcements'} 
                description={isUrdu ? 'جامعہ احسن کی تازہ ترین خبریں، تعلیمی اعلانات اور تعلیمی سرگرمیوں کی تفصیلات۔' : 'Stay updated with the latest news, updates, and announcements from Jamia Ahsan.'}
            />

            {/* Sub-Header Banner */}
            <div className="relative bg-sapphire-950 py-16 md:py-20 text-white overflow-hidden shadow-md">
                <div className="absolute inset-0 pointer-events-none">
                    <img 
                        src="/images/video-page-bg.png" 
                        alt="" 
                        className="w-full h-full object-cover opacity-90" 
                    />
                    <div className="absolute inset-0 bg-black/25" />
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                    <span className="text-[10px] uppercase tracking-widest font-black text-gold-400 bg-gold-400/10 border border-gold-400/20 px-3 py-1 rounded-full mb-3">
                        {isUrdu ? 'تازہ ترین اپڈیٹس' : 'Latest Updates'}
                    </span>
                    <h1 className={cn(
                        "text-3xl md:text-5xl font-black tracking-tight mb-4 text-white",
                        isUrdu ? "font-urdu leading-normal" : "font-heading"
                    )}>
                        {isUrdu ? 'خبریں اور اعلانات' : 'News & Announcements'}
                    </h1>
                    <p className={cn(
                        "text-sm md:text-base text-stone-300 max-w-2xl font-medium",
                        isUrdu ? "font-urdu leading-relaxed" : "font-sans"
                    )}>
                        {isUrdu 
                            ? 'جامعہ احسن کی تعلیمی اور تنظیمی سرگرمیوں، اہم تاریخوں اور تعلیمی اعلانات سے باخبر رہیں۔' 
                            : 'Stay up to date with the latest occurrences, events, and administrative decisions at Jamia Ahsan.'
                        }
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Search Bar */}
                <div className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-4 md:p-6 shadow-sm mb-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                        <input 
                            type="text"
                            placeholder={isUrdu ? 'خبریں تلاش کریں...' : 'Search news...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cn(
                                "w-full pl-10 pr-4 py-2 border rounded-xl bg-stone-50 dark:bg-sapphire-950/40 border-stone-200 dark:border-stone-800 text-sm focus:outline-none focus:ring-1 focus:ring-sapphire-500",
                                isUrdu && "text-right pr-10 pl-4 font-urdu"
                            )}
                        />
                    </div>
                </div>

                {/* News Grid */}
                {filteredNews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredNews.map((item) => (
                            <div 
                                key={item.id} 
                                className="group relative bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full hover:border-sapphire-500/30"
                            >
                                <div>
                                    {/* Date Header */}
                                    <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold mb-3">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{new Date(item.created_at).toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</span>
                                    </div>

                                    {/* News Title */}
                                    <h3 className={cn(
                                        "text-base md:text-lg font-black text-stone-900 dark:text-white mb-2 leading-snug group-hover:text-sapphire-500 dark:group-hover:text-sapphire-400 transition-colors",
                                        isUrdu ? "font-urdu" : "font-heading"
                                    )}>
                                        {item.text}
                                    </h3>

                                    {/* News Excerpt */}
                                    <p className={cn(
                                        "text-stone-600 dark:text-stone-400 text-sm mb-6 line-clamp-3 leading-relaxed",
                                        isUrdu ? "font-urdu text-[13.5px] leading-6" : "font-sans"
                                    )}>
                                        {item.excerpt || (isUrdu ? 'اس خبر کی تفصیلات جاننے کے لیے نیچے دیے گئے بٹن پر کلک کریں۔' : 'Click the details button below to read the complete announcement details.')}
                                    </p>
                                </div>

                                {/* Link to details */}
                                <Link 
                                    href={`/news/${item.slug}`}
                                    className={cn(
                                        "inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sapphire-600 dark:text-sapphire-400 hover:text-gold-500 dark:hover:text-gold-400 transition-colors w-fit",
                                        isUrdu && "font-urdu text-sm"
                                    )}
                                >
                                    <span>{isUrdu ? 'تفصیل سے پڑھیں' : 'Read Full Article'}</span>
                                    {isUrdu ? (
                                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    ) : (
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    )}
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-stone-200 dark:border-stone-800 rounded-3xl">
                        <Newspaper className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
                        <h3 className={cn("text-lg font-black text-stone-900 dark:text-white mb-2", isUrdu ? "font-urdu" : "font-heading")}>
                            {isUrdu ? 'کوئی خبر نہیں ملی' : 'No News Found'}
                        </h3>
                        <p className={cn("text-stone-500 dark:text-stone-400 text-sm max-w-sm mx-auto", isUrdu && "font-urdu")}>
                            {isUrdu 
                                ? 'آپ کی تلاش کے مطابق کوئی خبر یا اعلان دستیاب نہیں ہے۔' 
                                : 'Try searching for another query to find articles.'
                            }
                        </p>
                    </div>
                )}

                {/* Pagination Controls */}
                {news.meta && news.meta.last_page > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-12">
                        {news.links.prev ? (
                            <Link 
                                href={news.links.prev}
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
                                ? `صفحہ ${news.meta.current_page} از ${news.meta.last_page}`
                                : `Page ${news.meta.current_page} of ${news.meta.last_page}`
                            }
                        </span>

                        {news.links.next ? (
                            <Link 
                                href={news.links.next}
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
