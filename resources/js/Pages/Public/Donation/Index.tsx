import React from 'react';
import SEOHead from '@/Components/Public/SEOHead';
import { usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedData } from '@/types/inertia';
import { cn } from '@/lib/utils';
import { Heart, Building2, Smartphone, ShieldCheck, Mail, Copy, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Index() {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    const copyText = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(isUrdu ? `${label} کاپی ہو گیا!` : `${label} copied!`);
    };

    const bankDetails = {
        bankName: 'Meezan Bank Limited',
        accountTitle: 'Jamia Arabia Ahsan Ul Uloom',
        accountNo: '0210-010394829',
        iban: 'PK89MEZN000210010394829',
        branch: 'Gulshan-e-Iqbal Block 2 Branch, Karachi'
    };

    const walletDetails = [
        { name: 'EasyPaisa', accountTitle: 'Jamia Ahsan Ul Uloom', number: '0334-3969964' },
        { name: 'JazzCash', accountTitle: 'Jamia Ahsan Ul Uloom', number: '0300-1234567' }
    ];

    return (
        <div className="bg-background min-h-screen text-foreground transition-colors pb-16">
            <SEOHead 
                title={isUrdu ? 'تعاون اور عطیات' : 'Support & Donations'} 
                description={isUrdu ? 'جامعہ احسن کے لیے زکوٰۃ، صدقات اور دیگر عطیات جمع کرانے کی تفصیلات اور بینک اکاؤنٹس۔' : 'Support Islamic education. Learn how to send Zakat, Sadaqah, and general donations to Jamia Ahsan.'}
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
                        {isUrdu ? 'صدقہ و جاریہ' : 'Donations'}
                    </span>
                    <h1 className={cn(
                        "text-3xl md:text-5xl font-black tracking-tight mb-4 text-white",
                        isUrdu ? "font-urdu leading-normal" : "font-heading"
                    )}>
                        {isUrdu ? 'امداد و تعاون' : 'Support Jamia Ahsan'}
                    </h1>
                    <p className={cn(
                        "text-sm md:text-base text-stone-300 max-w-2xl font-medium",
                        isUrdu ? "font-urdu leading-relaxed" : "font-sans"
                    )}>
                        {isUrdu 
                            ? 'آپ کا عطیہ اور مالی تعاون ہزاروں طلباء کے لیے دینی تعلیم حاصل کرنے کا ذریعہ بن سکتا ہے۔' 
                            : 'Your Zakat, Sadaqah, and generous contributions directly fund Islamic textbooks, lodging, and scholarships for deserving students.'
                        }
                    </p>
                </div>
            </div>

            {/* Main Content Layout Grid */}
            <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
                
                {/* Guidelines Section */}
                <div className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-3xl p-6 md:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-8 space-y-4">
                        <div className="flex items-center gap-2 text-sapphire-600 dark:text-sapphire-400">
                            <ShieldCheck className="w-5 h-5" />
                            <h2 className={cn("text-lg md:text-xl font-black", isUrdu ? "font-urdu" : "font-heading")}>
                                {isUrdu ? 'شرعی زکوٰۃ اور صدقات کا درست استعمال' : 'Shariah Compliant Utilization'}
                            </h2>
                        </div>
                        <p className={cn("text-stone-600 dark:text-stone-400 text-sm leading-relaxed", isUrdu ? "font-urdu text-[14px] leading-7" : "font-sans")}>
                            {isUrdu 
                                ? 'جامعہ احسن میں موصول ہونے والی زکوٰۃ اور صدقات کی رقوم کو شرعی اصولوں کے مطابق الگ الگ فنڈز میں رکھا جاتا ہے۔ زکوٰۃ کی رقم صرف مستحق اور شرعی مستحق طلباء کے قیام و طعام، کتابوں اور تعلیمی اخراجات پر خرچ کی جاتی ہے۔' 
                                : 'At Jamia Ahsan, all Zakat and Sadaqah funds are maintained in separate bank accounts and audit structures. Zakat contributions are exclusively spent on lodging, meals, and books for eligible, underprivileged students in strict accordance with Islamic Shariah guidelines.'
                            }
                        </p>
                    </div>
                    <div className="md:col-span-4 flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-sapphire-500/10 text-sapphire-500 flex items-center justify-center">
                            <Heart className="w-12 h-12 fill-current" />
                        </div>
                    </div>
                </div>

                {/* Transfer options grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Bank Transfer details (lg:col-span-7) */}
                    <div className="lg:col-span-7 bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-4">
                            <Building2 className="w-5 h-5 text-sapphire-500" />
                            <h3 className={cn("text-base md:text-lg font-black text-stone-900 dark:text-white", isUrdu ? "font-urdu" : "font-heading")}>
                                {isUrdu ? 'بینک ٹرانسفر کی تفصیلات' : 'Bank Transfer Details'}
                            </h3>
                        </div>

                        <div className="space-y-4 text-sm font-semibold">
                            {/* Bank name */}
                            <div className="flex justify-between items-center bg-stone-50 dark:bg-stone-900/40 p-3 rounded-xl border border-stone-150 dark:border-stone-850">
                                <div>
                                    <span className="text-[10px] text-stone-400 block uppercase">{isUrdu ? 'بینک کا نام' : 'Bank Name'}</span>
                                    <span className="text-stone-800 dark:text-stone-200">{bankDetails.bankName}</span>
                                </div>
                            </div>
                            
                            {/* Account title */}
                            <div className="flex justify-between items-center bg-stone-50 dark:bg-stone-900/40 p-3 rounded-xl border border-stone-150 dark:border-stone-850">
                                <div>
                                    <span className="text-[10px] text-stone-400 block uppercase">{isUrdu ? 'اکاؤنٹ ٹائٹل' : 'Account Title'}</span>
                                    <span className="text-stone-800 dark:text-stone-200">{bankDetails.accountTitle}</span>
                                </div>
                                <button 
                                    onClick={() => copyText(bankDetails.accountTitle, isUrdu ? 'اکاؤنٹ ٹائٹل' : 'Account Title')}
                                    className="p-2 hover:bg-stone-200 dark:hover:bg-stone-850 rounded-lg text-stone-450 transition-colors"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Account number */}
                            <div className="flex justify-between items-center bg-stone-50 dark:bg-stone-900/40 p-3 rounded-xl border border-stone-150 dark:border-stone-850">
                                <div>
                                    <span className="text-[10px] text-stone-400 block uppercase">{isUrdu ? 'اکاؤنٹ نمبر' : 'Account Number'}</span>
                                    <span className="text-stone-800 dark:text-stone-200 tracking-wider font-mono">{bankDetails.accountNo}</span>
                                </div>
                                <button 
                                    onClick={() => copyText(bankDetails.accountNo, isUrdu ? 'اکاؤنٹ نمبر' : 'Account Number')}
                                    className="p-2 hover:bg-stone-200 dark:hover:bg-stone-850 rounded-lg text-stone-450 transition-colors"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>

                            {/* IBAN */}
                            <div className="flex justify-between items-center bg-stone-50 dark:bg-stone-900/40 p-3 rounded-xl border border-stone-150 dark:border-stone-850">
                                <div>
                                    <span className="text-[10px] text-stone-400 block uppercase">IBAN</span>
                                    <span className="text-stone-800 dark:text-stone-200 tracking-wider font-mono text-xs">{bankDetails.iban}</span>
                                </div>
                                <button 
                                    onClick={() => copyText(bankDetails.iban, 'IBAN')}
                                    className="p-2 hover:bg-stone-200 dark:hover:bg-stone-850 rounded-lg text-stone-450 transition-colors"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Mobile Wallets (lg:col-span-5) */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Mobile Wallets Card */}
                        <div className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-6 shadow-sm space-y-5">
                            <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                                <Smartphone className="w-4 h-4 text-sapphire-500" />
                                <h3 className={cn("text-sm font-black uppercase text-stone-800 dark:text-white tracking-wider", isUrdu && "font-urdu text-sm")}>
                                    {isUrdu ? 'موبائل والٹس' : 'Mobile Wallets'}
                                </h3>
                            </div>
                            
                            <div className="space-y-4">
                                {walletDetails.map((wallet, idx) => (
                                    <div 
                                        key={idx}
                                        className="bg-stone-50 dark:bg-stone-900/40 p-3.5 rounded-xl border border-stone-150 dark:border-stone-850 flex items-center justify-between"
                                    >
                                        <div>
                                            <span className="text-xs font-black text-sapphire-600 dark:text-sapphire-400 block mb-0.5">
                                                {wallet.name}
                                            </span>
                                            <span className="text-sm font-bold text-stone-800 dark:text-stone-200 block">
                                                {wallet.number}
                                            </span>
                                            <span className={cn("text-[10px] text-stone-400 block", isUrdu && "font-urdu text-[9px]")}>
                                                {wallet.accountTitle}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => copyText(wallet.number, wallet.name)}
                                            className="p-2 hover:bg-stone-200 dark:hover:bg-stone-850 rounded-lg text-stone-450 transition-colors"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Confirmation Callout */}
                        <div className="bg-stone-50 dark:bg-stone-900/20 border border-stone-250 dark:border-stone-850 rounded-2xl p-6 shadow-sm space-y-3">
                            <h4 className={cn("text-sm font-black text-stone-900 dark:text-white", isUrdu ? "font-urdu" : "font-heading")}>
                                {isUrdu ? 'تصدیقِ عطیہ' : 'Confirm Donation'}
                            </h4>
                            <p className={cn("text-xs text-stone-600 dark:text-stone-400 leading-relaxed", isUrdu ? "font-urdu text-[13px] leading-6" : "font-sans")}>
                                {isUrdu 
                                    ? 'بینک یا موبائل والٹ کے ذریعے فنڈز منتقل کرنے کے بعد، برائے مہربانی رسید کا سکرین شاٹ ہمارے ای میل یا واٹس ایپ نمبر پر ارسال کریں تاکہ ہم متعلقہ فنڈ رسید تیار کر سکیں۔' 
                                    : 'After making a transfer, please email your receipt details to info@jamiaahsan.edu.pk so we can record your donation and issue an official receipt.'
                                }
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
