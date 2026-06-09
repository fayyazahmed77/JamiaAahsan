import React from 'react';
import SEOHead from '@/Components/Public/SEOHead';
import { Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedData } from '@/types/inertia';
import type { Klass, ClassSession } from '@/types/models';
import SessionTable from './components/SessionTable';
import { cn } from '@/lib/utils';
import { 
    BookOpen, GraduationCap, Video, ArrowLeft, 
    ArrowRight, CheckCircle2, AlertCircle 
} from 'lucide-react';

interface EducationShowProps {
    klass: Klass;
    sessions: ClassSession[];
}

export default function Show({ klass, sessions }: EducationShowProps) {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    // Static details matching the course
    const getCourseMetadata = () => {
        const slug = klass.slug.toLowerCase();
        if (slug.includes('hifz')) {
            return {
                duration: isUrdu ? '۳ سال' : '3 Years',
                eligibility: isUrdu ? 'ناظرہ قرآن مکمل ہونا ضروری ہے' : 'Completion of Nazira Quran',
                gender: isUrdu ? 'صرف طلباء' : 'Male Only',
                schedule: isUrdu ? 'پیر تا ہفتہ: صبح ۸:۰۰ سے دوپہر ۴:۰۰' : 'Mon – Sat: 8:00 AM – 4:00 PM',
            };
        } else if (slug.includes('dars') || slug.includes('alim')) {
            return {
                duration: isUrdu ? '۸ سال' : '8 Years',
                eligibility: isUrdu ? 'میٹرک یا مساوی تعلیمی قابلیت' : 'Matriculation or equivalent',
                gender: isUrdu ? 'صرف طلباء' : 'Male Only',
                schedule: isUrdu ? 'پیر تا ہفتہ: صبح ۸:۰۰ سے دوپہر ۲:۰۰' : 'Mon – Sat: 8:00 AM – 2:00 PM',
            };
        } else if (slug.includes('nazira')) {
            return {
                duration: isUrdu ? '۱ سے ۲ سال' : '1 to 2 Years',
                eligibility: isUrdu ? 'عمر ۵ سال سے زائد ہو' : 'Age 5 years or older',
                gender: isUrdu ? 'طلباء و طالبات (الگ شفٹ)' : 'Co-education (separate shifts)',
                schedule: isUrdu ? 'پیر تا ہفتہ: شام ۴:۰۰ سے ۶:۰۰' : 'Mon – Sat: 4:00 PM – 6:00 PM',
            };
        }
        return {
            duration: isUrdu ? 'مختلف تعلیمی دورانیہ' : 'Flexible Duration',
            eligibility: isUrdu ? 'کوئی خاص تعلیمی قید نہیں' : 'Open Eligibility',
            gender: isUrdu ? 'تمام افراد کے لیے' : 'Open to All',
            schedule: isUrdu ? 'کورس کے مطابق' : 'As per schedule',
        };
    };

    const metadata = getCourseMetadata();

    return (
        <div className="bg-background min-h-screen text-foreground transition-colors pb-16">
            <SEOHead 
                title={`${klass.name}`} 
                description={klass.description || `Read about the ${klass.name} academic program details, curriculum, and class timings at Jamia Arabia Ahsan Ul Uloom.`}
            />

            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Course",
                    "name": klass.name,
                    "description": klass.description || klass.name,
                    "provider": {
                        "@type": "Organization",
                        "name": "Jamia Arabia Ahsan Ul Uloom",
                        "sameAs": "https://jamiaahsan.edu.pk"
                    },
                    "url": `https://jamiaahsan.edu.pk/education/${klass.slug}`
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
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <Link 
                        href="/education"
                        className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-black uppercase text-gold-400 bg-gold-400/10 border border-gold-400/20 px-3 py-1 rounded-full mb-6 hover:bg-gold-400/20 transition-all",
                            isUrdu && "font-urdu text-[11px]"
                        )}
                    >
                        {isUrdu ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                        <span>{isUrdu ? 'تمام کورسز پر واپس جائیں' : 'Back to Courses'}</span>
                    </Link>
                    <h1 className={cn(
                        "text-2xl md:text-4xl font-black text-white mb-3",
                        isUrdu ? "font-urdu leading-normal" : "font-heading"
                    )}>
                        {klass.name}
                    </h1>
                </div>
            </div>

            {/* Main Content Layout Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Details & Sessions (lg:col-span-8) */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Course Overview */}
                        <div className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-6 md:p-8 shadow-sm">
                            <h2 className={cn("text-xl font-black text-stone-900 dark:text-white mb-4", isUrdu ? "font-urdu" : "font-heading")}>
                                {isUrdu ? 'کورس کا تعارف' : 'Program Overview'}
                            </h2>
                            <p className={cn("text-stone-700 dark:text-stone-300 text-sm leading-relaxed whitespace-pre-line", isUrdu ? "font-urdu text-[15px] leading-8" : "font-sans")}>
                                {klass.description || (isUrdu ? 'اس تعلیمی پروگرام کی تفصیلات جلد فراہم کی جائیں گی۔' : 'No description has been added for this program yet.')}
                            </p>
                        </div>

                        {/* Sessions Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className={cn("text-xl font-black text-stone-900 dark:text-white", isUrdu ? "font-urdu" : "font-heading")}>
                                    {isUrdu ? 'فعال تعلیمی کلاسز' : 'Active Classes & Book Syllabus'}
                                </h2>
                            </div>
                            <SessionTable sessions={sessions} isUrdu={isUrdu} />
                        </div>
                    </div>

                    {/* Right Column: Sidebar Actions & Details (lg:col-span-4) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Program Quick Specs Card */}
                        <div className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-6 shadow-sm space-y-5">
                            <h3 className={cn("text-sm font-black uppercase text-stone-400 tracking-wider border-b border-stone-100 dark:border-stone-800 pb-3", isUrdu && "font-urdu text-[11px]")}>
                                {isUrdu ? 'پروگرام کی معلومات' : 'Quick Details'}
                            </h3>
                            
                            <div className="space-y-4 text-sm font-semibold">
                                {/* Duration */}
                                <div>
                                    <span className="text-stone-400 text-xs block">{isUrdu ? 'دورانیہ' : 'Duration'}</span>
                                    <span className="text-stone-800 dark:text-stone-200">{metadata.duration}</span>
                                </div>
                                {/* Eligibility */}
                                <div>
                                    <span className="text-stone-400 text-xs block">{isUrdu ? 'اہلیت' : 'Eligibility'}</span>
                                    <span className="text-stone-800 dark:text-stone-200">{metadata.eligibility}</span>
                                </div>
                                {/* Gender */}
                                <div>
                                    <span className="text-stone-400 text-xs block">{isUrdu ? 'جنس' : 'Gender'}</span>
                                    <span className="text-stone-800 dark:text-stone-200">{metadata.gender}</span>
                                </div>
                                {/* Schedule */}
                                <div>
                                    <span className="text-stone-400 text-xs block">{isUrdu ? 'اوقات' : 'Schedule'}</span>
                                    <span className="text-stone-800 dark:text-stone-200">{metadata.schedule}</span>
                                </div>
                            </div>
                        </div>

                        {/* Live Stream link if available */}
                        {klass.youtube_live_link && (
                            <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-2xl p-6 shadow-sm flex items-start gap-4">
                                <Video className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className={cn("font-bold text-red-600 dark:text-red-400 text-sm mb-1", isUrdu && "font-urdu")}>
                                        {isUrdu ? 'آن لائن کلاسز براہِ راست' : 'Live Online Classes'}
                                    </h4>
                                    <p className={cn("text-xs text-stone-500 dark:text-stone-400 mb-3", isUrdu && "font-urdu")}>
                                        {isUrdu ? 'یوٹیوب پر اس کلاس کی لائیو سٹریمنگ سے جوائن کریں۔' : 'Join the live streaming for this class directly on YouTube.'}
                                    </p>
                                    <a 
                                        href={klass.youtube_live_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-xl transition-colors"
                                    >
                                        <span>{isUrdu ? 'براہِ راست جوائن کریں' : 'Watch Live'}</span>
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Admissions Application Callout */}
                        <div className="bg-sapphire-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <img src="/images/video-page-bg.png" alt="" loading="lazy" className="w-full h-full object-cover" />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="w-10 h-10 rounded-xl bg-gold-400/20 text-gold-400 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={cn("text-lg font-black text-white leading-tight", isUrdu ? "font-urdu text-xl" : "font-heading")}>
                                        {isUrdu ? 'کیا آپ داخلہ لینا چاہتے ہیں؟' : 'Admissions Open'}
                                    </h3>
                                    <p className={cn("text-xs text-stone-300 mt-2 leading-relaxed", isUrdu ? "font-urdu text-[13px] leading-6" : "font-sans")}>
                                        {isUrdu 
                                            ? 'تعلیمی سال ۲۰۲۶ کے داخلے جاری ہیں۔ ابھی آن لائن درخواست جمع کرائیں۔' 
                                            : 'Enrollment for the academic session 2026 is currently open. Apply online today.'
                                        }
                                    </p>
                                </div>
                                <Link 
                                    href="/admissions/apply"
                                    className={cn(
                                        "w-full inline-flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-500 text-sapphire-950 font-black uppercase text-xs tracking-wider py-2.5 rounded-xl transition-colors",
                                        isUrdu && "font-urdu text-sm"
                                    )}
                                >
                                    <span>{isUrdu ? 'داخلہ فارم پُر کریں' : 'Apply Now'}</span>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

Show.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
