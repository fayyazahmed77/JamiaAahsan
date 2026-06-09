import React from 'react';
import { usePage } from '@inertiajs/react';
import SEOHead from '@/Components/Public/SEOHead';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedData } from '@/types/inertia';
import { cn } from '@/lib/utils';
import { Video, Calendar, Clock, Bell, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const YoutubeIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.003 3.003 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
);

interface LiveStreamProps {
    youtube_live_url: string;
    is_live: boolean;
}

export default function Live({ youtube_live_url, is_live }: LiveStreamProps) {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    // Static schedule details
    const schedule = [
        {
            day: isUrdu ? 'پیر' : 'Monday',
            time: isUrdu ? 'بعد نمازِ عصر' : 'After Asr Prayers',
            subject: isUrdu ? 'درسِ حدیث (مشکوٰۃ شریف)' : 'Hadith Lecture (Mishkat)',
            teacher: isUrdu ? 'Mufti Ahsan Sahib' : 'Mufti Ahsan Sahib'
        },
        {
            day: isUrdu ? 'بدھ' : 'Wednesday',
            time: isUrdu ? 'بعد نمازِ مغرب' : 'After Maghrib Prayers',
            subject: isUrdu ? 'تفسیر القرآن' : 'Tafseer-ul-Quran (Exegesis)',
            teacher: isUrdu ? 'Mufti Ahsan Sahib' : 'Mufti Ahsan Sahib'
        },
        {
            day: isUrdu ? 'جمعہ' : 'Friday',
            time: isUrdu ? 'دوپہر ۱:۳۰' : '1:30 PM (Jummah)',
            subject: isUrdu ? 'خطبہ جمعہ و اہم خطاب' : 'Jummah Khutbah & Address',
            teacher: isUrdu ? 'Mufti Ahsan Sahib' : 'Mufti Ahsan Sahib'
        }
    ];

    const copyShareLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success(isUrdu ? 'لنک کاپی کر لیا گیا ہے!' : 'Share link copied to clipboard!');
    };

    return (
        <div className="bg-background min-h-screen text-foreground transition-colors pb-16">
            <SEOHead 
                title={isUrdu ? 'براہِ راست نشریات' : 'Live Broadcasts'} 
                description={isUrdu ? 'جامعہ احسن کی براہِ راست نشریات اور دروسِ قرآن و حدیث کا لائیو سٹریمنگ صفحہ۔' : 'Watch live lectures, sermons, and Quranic exegesis streaming direct from Jamia Ahsan.'}
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
                        {isUrdu ? 'لائیو سٹریمنگ' : 'Live Channel'}
                    </span>
                    <h1 className={cn(
                        "text-3xl md:text-5xl font-black tracking-tight mb-4 text-white",
                        isUrdu ? "font-urdu leading-normal" : "font-heading"
                    )}>
                        {isUrdu ? 'براہِ راست نشریات' : 'Live Broadcasts'}
                    </h1>
                    <p className={cn(
                        "text-sm md:text-base text-stone-300 max-w-2xl font-medium",
                        isUrdu ? "font-urdu leading-relaxed" : "font-sans"
                    )}>
                        {isUrdu 
                            ? 'جامعہ احسن کے بیانات اور تعلیمی اسباق کو براہِ راست سنیں۔ نیچے دی گئی لائیو شیڈول کی تفصیلات دیکھیں۔' 
                            : 'Watch our live streams, weekly lectures, and sermons broadcasting live from Jamia Arabia Ahsan Ul Uloom.'
                        }
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Player & Banner (lg:col-span-8) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Live Player Section */}
                        <div className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-3xl p-4 md:p-6 shadow-sm space-y-4">
                            
                            {/* Live Badge header */}
                            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-850">
                                <div className="flex items-center gap-2">
                                    {is_live ? (
                                        <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-red-500 text-xs font-black uppercase">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                            </span>
                                            <span>{isUrdu ? 'براہِ راست جاری ہے' : 'Live Now'}</span>
                                        </div>
                                    ) : (
                                        <div className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-750 px-3 py-1 rounded-full text-stone-500 dark:text-stone-400 text-xs font-black uppercase">
                                            <span>{isUrdu ? 'آف لائن' : 'Offline'}</span>
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={copyShareLink}
                                    className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl text-stone-500 transition-colors"
                                >
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Responsive Player Embed */}
                            {is_live ? (
                                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-sm">
                                    <iframe 
                                        src={youtube_live_url}
                                        title="Jamia Ahsan Live Stream"
                                        width="100%"
                                        height="100%"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="border-0"
                                    />
                                </div>
                            ) : (
                                <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-900 flex flex-col items-center justify-center text-center p-6 border border-stone-850">
                                    <Video className="w-14 h-14 text-stone-700 mb-4 animate-pulse" />
                                    <h3 className={cn("text-lg font-black text-white mb-2", isUrdu ? "font-urdu" : "font-heading")}>
                                        {isUrdu ? 'نشریات اس وقت آف لائن ہیں' : 'Live Stream is Currently Offline'}
                                    </h3>
                                    <p className={cn("text-xs text-stone-400 max-w-sm leading-relaxed", isUrdu && "font-urdu text-[13px] leading-6")}>
                                        {isUrdu 
                                            ? 'ہم اس وقت براہِ راست نشر نہیں کر رہے ہیں۔ براہِ کرم نیچے دیئے گئے اوقات کے مطابق دوبارہ چیک کریں۔' 
                                            : 'No active broadcasts are running. Please check the weekly schedules below for upcoming programs.'
                                        }
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column: Weekly Schedule (lg:col-span-4) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Weekly Schedule Card */}
                        <div className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-6 shadow-sm space-y-5">
                            <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                                <Calendar className="w-4 h-4 text-sapphire-500" />
                                <h3 className={cn("text-sm font-black uppercase text-stone-800 dark:text-white tracking-wider", isUrdu && "font-urdu text-sm")}>
                                    {isUrdu ? 'ہفتہ وار شیڈول' : 'Weekly Live Schedule'}
                                </h3>
                            </div>
                            
                            <div className="space-y-4">
                                {schedule.map((item, idx) => (
                                    <div 
                                        key={idx}
                                        className="border-b border-stone-100 dark:border-stone-900 last:border-b-0 pb-3 last:pb-0"
                                    >
                                        <div className="flex items-center justify-between text-xs font-bold text-stone-400 mb-1.5">
                                            <span className={cn(isUrdu && "font-urdu")}>{item.day}</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span className={cn(isUrdu && "font-urdu")}>{item.time}</span>
                                            </span>
                                        </div>
                                        <h4 className={cn("text-sm font-black text-stone-800 dark:text-stone-200 mb-0.5", isUrdu && "font-urdu")}>
                                            {item.subject}
                                        </h4>
                                        <span className={cn("text-[10px] text-stone-400 block", isUrdu && "font-urdu")}>
                                            {item.teacher}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* YouTube Subscription Prompt Card */}
                        <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-2xl p-6 shadow-sm flex items-start gap-4">
                            <YoutubeIcon className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className={cn("font-bold text-red-600 dark:text-red-400 text-sm mb-1", isUrdu && "font-urdu")}>
                                    {isUrdu ? 'یوٹیوب چینل سبسکرائب کریں' : 'Subscribe on YouTube'}
                                </h4>
                                <p className={cn("text-xs text-stone-500 dark:text-stone-400 mb-3 leading-relaxed", isUrdu && "font-urdu text-[13px] leading-5")}>
                                    {isUrdu 
                                        ? 'نشریات شروع ہونے کی فوری اطلاع حاصل کرنے کے لیے ہمارے آفیشل چینل کو سبسکرائب کریں۔' 
                                        : 'Get instant notifications whenever we go live by subscribing and turning on the bell icon.'
                                    }
                                </p>
                                <a 
                                    href="https://www.youtube.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-xl transition-colors"
                                >
                                    <Bell className="w-3.5 h-3.5" />
                                    <span>{isUrdu ? 'سبسکرائب کریں' : 'Subscribe Channel'}</span>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

Live.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
