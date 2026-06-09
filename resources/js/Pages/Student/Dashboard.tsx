import React from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedData } from '@/types/inertia';
import { 
    User, Mail, Phone, MapPin, Calendar, Globe, CreditCard, 
    GraduationCap, Award, CheckCircle2, Clock, FileText, 
    LogOut, HelpCircle, BookOpen, Video, ExternalLink
} from 'lucide-react';

interface StudentDashboardProps {
    detail?: {
        id: number;
        user_id: number;
        class_id: number;
        registration_no: string | null;
        guardian_name: string;
        gender: string;
        dob: string;
        address: string;
        id_card_no: string;
        qualification: string;
        phone: string;
        country: string;
        admission_type: string;
        birth_certificate_path: string | null;
        education_degree_path: string | null;
        is_approved: boolean;
        class?: {
            id: number;
            name: string;
            description?: string;
        };
    } | null;
}

export default function Dashboard({ detail }: StudentDashboardProps) {
    const { auth, locale } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';
    const user = auth.user;

    if (!user) return null;

    const isApproved = detail ? detail.is_approved : false;

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="bg-background min-h-screen text-foreground transition-colors pb-16">
            {/* Top Header Banner with Premium Gradient */}
            <div className="relative bg-gradient-to-r from-sapphire-950 via-slate-900 to-indigo-950 py-16 md:py-20 text-white overflow-hidden shadow-md">
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute inset-0 bg-radial-gradient from-sapphire-500/10 to-transparent" />
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <span className="text-[10px] uppercase tracking-widest font-black text-gold-400 bg-gold-400/10 border border-gold-400/20 px-3 py-1 rounded-full mb-3 inline-block">
                            {isUrdu ? 'طالب علم پورٹل' : 'Student Portal Dashboard'}
                        </span>
                        <h1 className={`text-3xl md:text-5xl font-black tracking-tight mb-2 text-white ${isUrdu ? 'font-urdu leading-normal' : 'font-heading'}`}>
                            {isUrdu ? `خوش آمدید، ${user.name}` : `Welcome back, ${user.name}`}
                        </h1>
                        <p className={`text-sm text-stone-300 max-w-xl font-medium ${isUrdu ? 'font-urdu leading-relaxed' : 'font-sans'}`}>
                            {isUrdu 
                                ? 'اپنے تعلیمی پروفائل، داخلے کی حیثیت اور پورٹل کے اعلانات کا انتظام یہاں کریں۔'
                                : 'Manage your academic profile, enrollment status, and portal notifications from here.'
                            }
                        </p>
                    </div>

                    {/* Status Badge Top-Right */}
                    <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                            {isUrdu ? 'داخلہ اسٹیٹس' : 'Application Status'}
                        </div>
                        {isApproved ? (
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 font-extrabold text-sm">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{isUrdu ? 'سرگرم / منظور شدہ' : 'Active / Approved'}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 font-extrabold text-sm">
                                <Clock className="w-4 h-4" />
                                <span>{isUrdu ? 'زیرِ غور / پینڈنگ' : 'Under Review'}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Status Notice Callout */}
                <div className="mb-10">
                    {isApproved ? (
                        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/40 rounded-2xl p-5 md:p-6 flex gap-4 shadow-sm items-start">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className={`text-base font-bold text-emerald-900 dark:text-emerald-300 mb-1 ${isUrdu ? 'font-urdu' : ''}`}>
                                    {isUrdu ? 'مبارک ہو! آپ کا داخلہ منظور ہو چکا ہے' : 'Congratulations! Your Admission is Confirmed'}
                                </h4>
                                <p className={`text-xs text-emerald-700 dark:text-emerald-400/90 leading-relaxed font-semibold ${isUrdu ? 'font-urdu' : ''}`}>
                                    {isUrdu 
                                        ? `آپ کا داخلہ کلاس "${detail?.class?.name}" میں کامیابی سے منظور کر لیا گیا ہے۔ آپ کا رجسٹریشن نمبر ${detail?.registration_no || 'جاری نہیں کیا گیا'} ہے۔ نیچے دیے گئے تعلیمی اعلانات کی فہرست چیک کریں اور اپنے کورس کے آغاز کی تیاری کریں۔`
                                        : `Your admission for "${detail?.class?.name}" has been approved. Your official Registration Number is "${detail?.registration_no || 'N/A'}". Please check the announcements board below for updates on class schedules, syllabus guidelines, and course materials.`
                                    }
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/40 rounded-2xl p-5 md:p-6 flex gap-4 shadow-sm items-start">
                            <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className={`text-base font-bold text-amber-900 dark:text-amber-300 mb-1 ${isUrdu ? 'font-urdu' : ''}`}>
                                    {isUrdu ? 'درخواست کا جائزہ لیا جا رہا ہے' : 'Admission Application Under Review'}
                                </h4>
                                <p className={`text-xs text-amber-700 dark:text-amber-400/90 leading-relaxed font-semibold ${isUrdu ? 'font-urdu' : ''}`}>
                                    {isUrdu 
                                        ? 'جامعہ کی انتظامیہ آپ کی جمع کردہ معلومات اور دستاویزات کا جائزہ لے رہی ہے۔ داخلہ منظور ہوتے ہی آپ کو ای میل کے ذریعے مطلع کر دیا جائے گا اور رجسٹریشن نمبر الاٹ ہو جائے گا۔ کسی بھی مدد کے لیے آپ رابطہ فارم استعمال کر سکتے ہیں۔'
                                        : 'The academic administration is currently auditing your application details and uploaded documents (B-Form, degrees). You will receive an official email confirmation once approved, and your registration number will be activated. You can explore public media recordings in the meantime.'
                                    }
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left 2 Columns: Profile & Academic Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Student Profile details Card */}
                        <div className="bg-card border border-stone-200/60 dark:border-stone-850 rounded-2xl p-6 md:p-8 shadow-sm">
                            <div className="flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-4 mb-6">
                                <User className="w-5 h-5 text-sapphire-500" />
                                <h3 className={`text-lg font-black text-stone-900 dark:text-white ${isUrdu ? 'font-urdu' : 'font-heading'}`}>
                                    {isUrdu ? 'ذاتی و تعلیمی پروفائل' : 'Personal & Academic Profile'}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <span className="text-[10px] text-stone-400 font-extrabold uppercase block mb-1">{isUrdu ? 'مکمل نام' : 'Full Name'}</span>
                                    <span className="text-sm font-bold text-stone-900 dark:text-white block">{user.name}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-stone-400 font-extrabold uppercase block mb-1">{isUrdu ? 'ای میل ایڈریس' : 'Email Address'}</span>
                                    <span className="text-sm font-bold text-stone-900 dark:text-white block">{user.email}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-stone-400 font-extrabold uppercase block mb-1">{isUrdu ? 'سرپرست کا نام' : 'Guardian Name'}</span>
                                    <span className="text-sm font-bold text-stone-900 dark:text-white block">{detail?.guardian_name || '—'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-stone-400 font-extrabold uppercase block mb-1">{isUrdu ? 'فون / رابطہ نمبر' : 'Phone Number'}</span>
                                    <span className="text-sm font-bold text-stone-900 dark:text-white block">{detail?.phone || '—'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-stone-400 font-extrabold uppercase block mb-1">{isUrdu ? 'شناختی کارڈ / ب-فارم نمبر' : 'ID Card / B-Form'}</span>
                                    <span className="text-sm font-bold text-stone-900 dark:text-white block">{detail?.id_card_no || '—'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-stone-400 font-extrabold uppercase block mb-1">{isUrdu ? 'تاریخِ پیدائش' : 'Date of Birth'}</span>
                                    <span className="text-sm font-bold text-stone-900 dark:text-white block">{detail?.dob || '—'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-stone-400 font-extrabold uppercase block mb-1">{isUrdu ? 'مطلوبہ کورس / کلاس' : 'Selected Course / Program'}</span>
                                    <span className="text-sm font-bold text-sapphire-600 dark:text-sapphire-400 block">{detail?.class?.name || '—'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-stone-400 font-extrabold uppercase block mb-1">{isUrdu ? 'داخلہ کی نوعیت' : 'Admission Type'}</span>
                                    <span className="text-sm font-bold text-stone-900 dark:text-white block">
                                        {detail?.admission_type === 'regular' && (isUrdu ? 'باقاعدہ (ریگولر)' : 'Regular (On-site)')}
                                        {detail?.admission_type === 'distance' && (isUrdu ? 'آن لائن (فاصلاتی)' : 'Distance Learning (Online)')}
                                        {detail?.admission_type === 'part-time' && (isUrdu ? 'جز وقتی (پارٹ ٹائم)' : 'Part-time')}
                                        {!detail?.admission_type && '—'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-stone-400 font-extrabold uppercase block mb-1">{isUrdu ? 'سابقہ تعلیمی قابلیت' : 'Last Qualification'}</span>
                                    <span className="text-sm font-bold text-stone-900 dark:text-white block">{detail?.qualification || '—'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-stone-400 font-extrabold uppercase block mb-1">{isUrdu ? 'ملک' : 'Country'}</span>
                                    <span className="text-sm font-bold text-stone-900 dark:text-white block">{detail?.country || '—'}</span>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="text-[10px] text-stone-400 font-extrabold uppercase block mb-1">{isUrdu ? 'رہائشی پتہ' : 'Home Address'}</span>
                                    <span className="text-sm font-bold text-stone-900 dark:text-white block leading-relaxed">{detail?.address || '—'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Document details Card */}
                        <div className="bg-card border border-stone-200/60 dark:border-stone-850 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 border-b border-stone-200 dark:border-stone-800 pb-4 mb-5">
                                <FileText className="w-5 h-5 text-sapphire-500" />
                                <h3 className={`text-lg font-black text-stone-900 dark:text-white ${isUrdu ? 'font-urdu' : 'font-heading'}`}>
                                    {isUrdu ? 'منسلکہ دستاویزات' : 'Attached Scanned Documents'}
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Birth Certificate */}
                                <div className="border border-stone-200 dark:border-stone-800 p-4 rounded-xl flex items-center justify-between bg-stone-50 dark:bg-sapphire-950/20">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <FileText className="w-8 h-8 text-stone-400 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                                                {isUrdu ? 'پیدائشی سرٹیفکیٹ / ب-فارم' : 'Birth Certificate / B-Form'}
                                            </p>
                                            <p className="text-[10px] text-stone-400 font-bold">
                                                {detail?.birth_certificate_path ? (isUrdu ? 'اپلوڈ شدہ' : 'Uploaded') : (isUrdu ? 'شامل نہیں' : 'Not attached')}
                                            </p>
                                        </div>
                                    </div>
                                    {detail?.birth_certificate_path && (
                                        <a 
                                            href={`/storage/${detail.birth_certificate_path}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-xs font-extrabold text-sapphire-600 dark:text-sapphire-400 flex items-center gap-1 hover:underline"
                                        >
                                            {isUrdu ? 'دیکھیں' : 'View'}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>

                                {/* Degree */}
                                <div className="border border-stone-200 dark:border-stone-800 p-4 rounded-xl flex items-center justify-between bg-stone-50 dark:bg-sapphire-950/20">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <FileText className="w-8 h-8 text-stone-400 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-stone-900 dark:text-white truncate">
                                                {isUrdu ? 'سابقہ تعلیمی سرٹیفکیٹ / ڈگری' : 'Educational Degree'}
                                            </p>
                                            <p className="text-[10px] text-stone-400 font-bold">
                                                {detail?.education_degree_path ? (isUrdu ? 'اپلوڈ شدہ' : 'Uploaded') : (isUrdu ? 'شامل نہیں' : 'Not attached')}
                                            </p>
                                        </div>
                                    </div>
                                    {detail?.education_degree_path && (
                                        <a 
                                            href={`/storage/${detail.education_degree_path}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-xs font-extrabold text-sapphire-600 dark:text-sapphire-400 flex items-center gap-1 hover:underline"
                                        >
                                            {isUrdu ? 'دیکھیں' : 'View'}
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Notices & Quick Links */}
                    <div className="space-y-8">
                        {/* Announcements card */}
                        <div className="bg-card border border-stone-200/60 dark:border-stone-850 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-4 mb-4">
                                <BookOpen className="w-5 h-5 text-gold-500" />
                                <h3 className={`text-lg font-black text-stone-900 dark:text-white ${isUrdu ? 'font-urdu' : 'font-heading'}`}>
                                    {isUrdu ? 'تعلیمی اعلانات' : 'Academic Notices'}
                                </h3>
                            </div>

                            {isApproved ? (
                                <div className="space-y-4">
                                    <div className="border-l-2 border-sapphire-500 pl-3 py-1">
                                        <h4 className="text-xs font-bold text-stone-900 dark:text-white">Orientation Program & Syllabus</h4>
                                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                                            Academic orientation details and class timetables will be posted here. Please collect your textbooks from the administrative block.
                                        </p>
                                        <span className="text-[9px] text-stone-400 font-bold block mt-1">June 05, 2026</span>
                                    </div>

                                    <div className="border-l-2 border-sapphire-500 pl-3 py-1">
                                        <h4 className="text-xs font-bold text-stone-900 dark:text-white">LMS Portal & Login Credentials</h4>
                                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                                            Online/distance learning coordinates will be distributed via email next week. Keep tracking your student portal.
                                        </p>
                                        <span className="text-[9px] text-stone-400 font-bold block mt-1">June 03, 2026</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="border-l-2 border-amber-500 pl-3 py-1">
                                        <h4 className="text-xs font-bold text-stone-900 dark:text-white">{isUrdu ? 'دستاویزات کی تصدیق جاری ہے' : 'Document Verification Pending'}</h4>
                                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                                            {isUrdu 
                                                ? 'ہم فی الحال آپ کے اپلوڈ کردہ تعلیمی اسناد اور فارم کی جانچ پڑتال کر رہے ہیں۔ اس عمل میں ۱ سے ۲ دن لگ سکتے ہیں۔'
                                                : 'Verification of academic prerequisites and scanned certificates is in progress. The approval decision is updated within 48 business hours.'
                                            }
                                        </p>
                                        <span className="text-[9px] text-stone-400 font-bold block mt-1">June 06, 2026</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick links & Logout Card */}
                        <div className="bg-card border border-stone-200/60 dark:border-stone-850 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-4 mb-4">
                                <HelpCircle className="w-5 h-5 text-sapphire-500" />
                                <h3 className={`text-lg font-black text-stone-900 dark:text-white ${isUrdu ? 'font-urdu' : 'font-heading'}`}>
                                    {isUrdu ? 'فوری روابط' : 'Quick Portal Actions'}
                                </h3>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Link 
                                    href="/fatwa" 
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-sapphire-950/30 border border-stone-100 dark:border-stone-800 transition-colors text-sm font-bold"
                                >
                                    <span>{isUrdu ? 'دارالافتاء (سوال پوچھیں)' : 'Submit a Fatwa Inquiry'}</span>
                                    <ExternalLink className="w-4 h-4 text-stone-400" />
                                </Link>

                                <Link 
                                    href="/media/audio" 
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-sapphire-950/30 border border-stone-100 dark:border-stone-800 transition-colors text-sm font-bold"
                                >
                                    <span>{isUrdu ? 'آڈیو لیکچرز سنیں' : 'Browse Audio Bayans'}</span>
                                    <BookOpen className="w-4 h-4 text-stone-400" />
                                </Link>

                                <Link 
                                    href="/media/video" 
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-sapphire-950/30 border border-stone-100 dark:border-stone-800 transition-colors text-sm font-bold"
                                >
                                    <span>{isUrdu ? 'ویڈیو لیکچرز دیکھیں' : 'Watch Video Bayans'}</span>
                                    <Video className="w-4 h-4 text-stone-400" />
                                </Link>

                                <Link 
                                    href="/contact" 
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-sapphire-950/30 border border-stone-100 dark:border-stone-800 transition-colors text-sm font-bold"
                                >
                                    <span>{isUrdu ? 'رابطہ برائے مدد' : 'Contact Support Desk'}</span>
                                    <HelpCircle className="w-4 h-4 text-stone-400" />
                                </Link>

                                <form onSubmit={handleLogout} className="mt-4">
                                    <button 
                                        type="submit" 
                                        className="w-full flex items-center justify-center gap-2 p-3 bg-red-650 hover:bg-red-700 text-white font-black rounded-xl text-sm transition-all"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>{isUrdu ? 'لاگ آؤٹ کریں' : 'Logout of Account'}</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
