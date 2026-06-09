import React from 'react';
import SEOHead from '@/Components/Public/SEOHead';
import { Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedData } from '@/types/inertia';
import type { LatestNews } from '@/types/models';
import { cn } from '@/lib/utils';
import { Calendar, ArrowLeft, ArrowRight, Share2, Award, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface NewsShowProps {
    item: LatestNews;
    recentNews: LatestNews[];
}

export default function Show({ item, recentNews }: NewsShowProps) {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success(isUrdu ? 'لنک کاپی کر لیا گیا ہے!' : 'Link copied to clipboard!');
    };

    return (
        <div className="bg-background min-h-screen text-foreground transition-colors pb-16">
            <SEOHead 
                title={`${item.text}`} 
                description={item.excerpt || `Read the latest announcement from Jamia Arabia Ahsan Ul Uloom regarding ${item.text}`}
            />

            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "NewsArticle",
                    "headline": item.text,
                    "datePublished": item.created_at,
                    "dateModified": item.updated_at || item.created_at,
                    "author": {
                        "@type": "Organization",
                        "name": "Jamia Arabia Ahsan Ul Uloom",
                        "url": "https://jamiaahsan.edu.pk"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "Jamia Arabia Ahsan Ul Uloom",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://jamiaahsan.edu.pk/images/logo.png"
                        }
                    },
                    "description": item.excerpt || item.text
                })}
            </script>

            {/* Sub-Header Banner */}
            <div className="relative bg-sapphire-950 py-12 text-white overflow-hidden shadow-md">
                <div className="absolute inset-0 pointer-events-none">
                    <img 
                        src="/images/video-page-bg.png" 
                        alt="" 
                        loading="lazy"
                        className="w-full h-full object-cover opacity-90" 
                    />
                    <div className="absolute inset-0 bg-black/25" />
                </div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <Link 
                        href="/news"
                        className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-black uppercase text-gold-400 bg-gold-400/10 border border-gold-400/20 px-3 py-1 rounded-full mb-6 hover:bg-gold-400/20 transition-all",
                            isUrdu && "font-urdu text-[11px]"
                        )}
                    >
                        {isUrdu ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                        <span>{isUrdu ? 'تمام خبروں پر واپس جائیں' : 'Back to News'}</span>
                    </Link>
                    <div className="flex items-center gap-2 text-stone-300 text-xs font-semibold mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(item.created_at).toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                    <h1 className={cn(
                        "text-xl md:text-3xl font-black text-white leading-snug",
                        isUrdu ? "font-urdu" : "font-heading"
                    )}>
                        {item.text}
                    </h1>
                </div>
            </div>

            {/* Main Content Grid Layout */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Article content (lg:col-span-8) */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-6 md:p-8 shadow-sm">
                            {/* Detailed content */}
                            <div className={cn(
                                "text-stone-700 dark:text-stone-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap",
                                isUrdu ? "font-urdu text-[15.5px] leading-8" : "font-sans"
                            )}>
                                {item.content || item.text}
                            </div>
                            
                            {/* Share button bottom bar */}
                            <div className="flex items-center justify-end border-t border-stone-100 dark:border-stone-800 pt-6 mt-10">
                                <button 
                                    onClick={handleShare}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-stone-200 dark:border-stone-800 rounded-xl text-xs font-black uppercase text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
                                >
                                    <Share2 className="w-4 h-4" />
                                    <span>{isUrdu ? 'شیئر کریں' : 'Copy Article Link'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Recent News list (lg:col-span-4) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Recent News sidebar card */}
                        <div className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-6 shadow-sm space-y-4">
                            <h3 className={cn("text-xs font-black uppercase text-stone-400 tracking-wider border-b border-stone-100 dark:border-stone-800 pb-2", isUrdu && "font-urdu text-[11px]")}>
                                {isUrdu ? 'تازہ ترین خبریں' : 'Recent News'}
                            </h3>
                            
                            {recentNews.length > 0 ? (
                                <div className="space-y-4">
                                    {recentNews.map((recent) => (
                                        <Link 
                                            key={recent.id}
                                            href={`/news/${recent.slug}`}
                                            className="group block border-b border-stone-100 dark:border-stone-900 pb-3 last:border-b-0 last:pb-0"
                                        >
                                            <span className="text-[10px] text-stone-400 block font-semibold mb-1">
                                                {new Date(recent.created_at).toLocaleDateString(isUrdu ? 'ur' : 'en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <span className={cn(
                                                "text-xs font-bold text-stone-800 dark:text-stone-200 group-hover:text-sapphire-500 transition-colors line-clamp-2 leading-snug",
                                                isUrdu && "font-urdu"
                                            )}>
                                                {recent.text}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className={cn("text-xs text-stone-450 italic", isUrdu && "font-urdu")}>
                                    {isUrdu ? 'کوئی اور خبر دستیاب نہیں' : 'No other news articles.'}
                                </p>
                            )}
                        </div>

                        {/* Optional action banner (apply for admissions) */}
                        {item.link && (
                            <div className="bg-sapphire-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10 pointer-events-none">
                                    <img src="/images/video-page-bg.png" alt="" loading="lazy" className="w-full h-full object-cover" />
                                </div>
                                <div className="relative z-10 space-y-3">
                                    <h4 className={cn("text-sm font-black text-white", isUrdu ? "font-urdu" : "font-heading")}>
                                        {isUrdu ? 'مزید کارروائی شروع کریں' : 'Related Actions'}
                                    </h4>
                                    <p className={cn("text-[11px] text-stone-300 leading-relaxed", isUrdu ? "font-urdu text-[13px] leading-6" : "font-sans")}>
                                        {isUrdu 
                                            ? 'اس اعلان سے متعلقہ صفحہ دیکھنے کے لیے نیچے دیے گئے بٹن پر کلک کریں۔' 
                                            : 'Navigate directly to the page associated with this announcement.'
                                        }
                                    </p>
                                    <Link 
                                        href={item.link}
                                        className={cn(
                                            "w-full inline-flex items-center justify-center bg-gold-400 hover:bg-gold-500 text-sapphire-950 font-black uppercase text-xs tracking-wider py-2 rounded-xl transition-colors",
                                            isUrdu && "font-urdu text-sm"
                                        )}
                                    >
                                        <span>{isUrdu ? 'تفصیلات دیکھیں' : 'Navigate Page'}</span>
                                    </Link>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

Show.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
