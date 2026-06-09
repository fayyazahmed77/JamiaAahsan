import React from 'react';
import SEOHead from '@/Components/Public/SEOHead';
import { Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedData } from '@/types/inertia';
import type { Klass } from '@/types/models';
import { cn } from '@/lib/utils';
import { 
    FileText, Calendar, CheckSquare, GraduationCap, 
    ArrowRight, ClipboardList, HelpCircle, ShieldCheck 
} from 'lucide-react';

interface AdmissionsIndexProps {
    classes: Klass[];
}

export default function Index({ classes }: AdmissionsIndexProps) {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    return (
        <div className="bg-background min-h-screen text-foreground transition-colors pb-16">
            <SEOHead 
                title={isUrdu ? 'داخلہ گائیڈ لائنز اور طریقہ کار' : 'Admissions Guidelines & Process'} 
                description={isUrdu ? 'جامعہ احسن میں آن لائن داخلہ حاصل کرنے کا مکمل طریقہ کار اور مطلوبہ دستاویزات کی تفصیلات۔' : 'Check out the step-by-step admissions process, requirements, and course eligibility at Jamia Ahsan.'}
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
                        {isUrdu ? 'معلوماتِ داخلہ' : 'Admissions Info'}
                    </span>
                    <h1 className={cn(
                        "text-3xl md:text-5xl font-black tracking-tight mb-4 text-white",
                        isUrdu ? "font-urdu leading-normal" : "font-heading"
                    )}>
                        {isUrdu ? 'داخلہ گائیڈ لائنز اور طریقہ کار' : 'Admissions & Guidelines'}
                    </h1>
                    <p className={cn(
                        "text-sm md:text-base text-stone-300 max-w-2xl font-medium",
                        isUrdu ? "font-urdu leading-relaxed" : "font-sans"
                    )}>
                        {isUrdu 
                            ? 'تعلیمی سال ۲۰۲۶ کے آن لائن داخلے اب کھلے ہیں۔ داخلے سے پہلے اہم ہدایات اور شرائط غور سے پڑھیں۔' 
                            : 'Online admissions for the academic year 2026 are now open. Review guidelines, required documents, and start your application today.'
                        }
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                {/* Flow steps container */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Step 1 */}
                    <div className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-6 shadow-sm space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-sapphire-500/10 text-sapphire-500 flex items-center justify-center font-bold">
                            1
                        </div>
                        <h3 className={cn("text-base font-black text-stone-900 dark:text-white", isUrdu ? "font-urdu" : "font-heading")}>
                            {isUrdu ? 'درخواست فارم پُر کریں' : '1. Online Application'}
                        </h3>
                        <p className={cn("text-stone-600 dark:text-stone-400 text-sm leading-relaxed", isUrdu ? "font-urdu text-[13px] leading-6" : "font-sans")}>
                            {isUrdu 
                                ? 'ہمارا آن لائن داخلہ فارم مکمل طور پر پُر کریں، جس میں ذاتی اور تعلیمی معلومات شامل ہیں۔'
                                : 'Complete our step-by-step online application form providing your personal, contact, and academic details.'
                            }
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-6 shadow-sm space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-500 flex items-center justify-center font-bold">
                            2
                        </div>
                        <h3 className={cn("text-base font-black text-stone-900 dark:text-white", isUrdu ? "font-urdu" : "font-heading")}>
                            {isUrdu ? 'دستاویزات اپلوڈ کریں' : '2. Upload Documents'}
                        </h3>
                        <p className={cn("text-stone-600 dark:text-stone-400 text-sm leading-relaxed", isUrdu ? "font-urdu text-[13px] leading-6" : "font-sans")}>
                            {isUrdu 
                                ? 'پیدائشی سرٹیفکیٹ (ب-فارم) اور اپنی سابقہ تعلیمی اسناد کی سکین شدہ کاپی فارم کے ساتھ منسلک کریں۔'
                                : 'Attach high-quality scanned copies of your B-Form/CNIC and previous academic degree or credentials.'
                            }
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-6 shadow-sm space-y-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                            3
                        </div>
                        <h3 className={cn("text-base font-black text-stone-900 dark:text-white", isUrdu ? "font-urdu" : "font-heading")}>
                            {isUrdu ? 'جائزہ اور انٹرویو' : '3. Verification & Interview'}
                        </h3>
                        <p className={cn("text-stone-600 dark:text-stone-400 text-sm leading-relaxed", isUrdu ? "font-urdu text-[13px] leading-6" : "font-sans")}>
                            {isUrdu 
                                ? 'جامعہ کی تعلیمی کمیٹی آپ کی درخواست کا جائزہ لے گی، جس کے بعد آپ کو انٹرویو اور ٹیسٹ کے لیے بلایا جائے گا۔'
                                : 'The admissions committee will review your submission and notify you of the interview schedule and entry test.'
                            }
                        </p>
                    </div>
                </div>

                {/* Requirements Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Criteria Requirements (lg:col-span-7) */}
                    <div className="lg:col-span-7 bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-4">
                            <ClipboardList className="w-5 h-5 text-sapphire-500" />
                            <h2 className={cn("text-lg md:text-xl font-black text-stone-900 dark:text-white", isUrdu ? "font-urdu" : "font-heading")}>
                                {isUrdu ? 'لازمی دستاویزات اور شرائط' : 'Requirements Checklist'}
                            </h2>
                        </div>

                        <ul className="space-y-3.5 text-sm font-semibold text-stone-700 dark:text-stone-300">
                            <li className="flex gap-2 items-start">
                                <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span className={cn(isUrdu && "font-urdu text-[13.5px] leading-relaxed")}>
                                    {isUrdu ? 'طالب علم کا ب-فارم یا شناختی کارڈ کی سکین شدہ نقل' : 'Scanned copy of B-Form or CNIC of the applicant.'}
                                </span>
                            </li>
                            <li className="flex gap-2 items-start">
                                <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span className={cn(isUrdu && "font-urdu text-[13.5px] leading-relaxed")}>
                                    {isUrdu ? 'والد یا سرپرست کا شناختی کارڈ نمبر اور رابطہ نمبر' : 'Father or legal guardian\'s CNIC details and contact phone.'}
                                </span>
                            </li>
                            <li className="flex gap-2 items-start">
                                <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span className={cn(isUrdu && "font-urdu text-[13.5px] leading-relaxed")}>
                                    {isUrdu ? 'سابقہ تعلیمی قابلیت کا سرٹیفکیٹ یا سکول لیونگ سرٹیفکیٹ' : 'Previous certificate/transcript or School Leaving Certificate.'}
                                </span>
                            </li>
                            <li className="flex gap-2 items-start">
                                <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span className={cn(isUrdu && "font-urdu text-[13.5px] leading-relaxed")}>
                                    {isUrdu ? 'حفظ القرآن پروگرام کے لیے ناظرہ مع تجوید کا پاس ہونا لازمی ہے' : 'For Hifz course, student must pass the basic Quranic recitation (Nazira) evaluation.'}
                                </span>
                            </li>
                            <li className="flex gap-2 items-start">
                                <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span className={cn(isUrdu && "font-urdu text-[13.5px] leading-relaxed")}>
                                    {isUrdu ? 'عالم کورس (درسِ نظامی) کے لیے میٹرک یا مساوی تعلیمی ڈگری ضروری ہے' : 'For Alim course (Dars-e-Nizami), Matriculation or equivalent degree is mandatory.'}
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Right Column: CTA card & Eligible Classes list (lg:col-span-5) */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Start application Callout card */}
                        <div className="bg-sapphire-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <img src="/images/video-page-bg.png" alt="" loading="lazy" className="w-full h-full object-cover" />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="w-10 h-10 rounded-xl bg-gold-400/20 text-gold-400 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className={cn("text-lg font-black text-white leading-tight", isUrdu ? "font-urdu text-xl" : "font-heading")}>
                                        {isUrdu ? 'آن لائن داخلہ شروع کریں' : 'Apply Online'}
                                    </h3>
                                    <p className={cn("text-xs text-stone-300 mt-2 leading-relaxed", isUrdu ? "font-urdu text-[13px] leading-6" : "font-sans")}>
                                        {isUrdu 
                                            ? 'اپنے تعلیمی مستقبل کا آغاز کریں۔ داخلہ فارم مکمل طور پر آن لائن دستیاب ہے۔' 
                                            : 'Take the first step towards classical Islamic learning. The online application is simple and takes 10-15 minutes.'
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
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Open Classes Info Card */}
                        <div className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-6 shadow-sm space-y-4">
                            <h3 className={cn("text-sm font-black uppercase text-stone-400 tracking-wider border-b border-stone-100 dark:border-stone-800 pb-2", isUrdu && "font-urdu text-[11px]")}>
                                {isUrdu ? 'دستیاب تعلیمی شعبہ جات' : 'Eligible Programs'}
                            </h3>
                            <div className="space-y-2">
                                {classes.map((cls) => (
                                    <div 
                                        key={cls.id} 
                                        className="flex items-center justify-between text-sm font-bold text-stone-800 dark:text-stone-200 bg-stone-50 dark:bg-stone-900/40 p-2.5 rounded-xl border border-stone-150 dark:border-stone-850"
                                    >
                                        <span>{cls.name}</span>
                                        <Link 
                                            href={`/education/${cls.slug}`}
                                            className="text-xs text-sapphire-500 hover:underline"
                                        >
                                            {isUrdu ? 'معلومات' : 'View'}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
