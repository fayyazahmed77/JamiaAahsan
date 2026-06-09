import React, { useState } from 'react';
import SEOHead from '@/Components/Public/SEOHead';
import { usePage, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedData } from '@/types/inertia';
import { motion } from 'framer-motion';
import { 
    MapPin, Phone, Mail, Clock, Send, Star, 
    Globe, User, MessageSquare 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Input } from '@/Components/ui/Input';
import { Button } from '@/Components/ui/Button';
import { cn } from '@/lib/utils';

export default function Contact() {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    // Inertia form hook
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        country: '',
        phone: '',
        comment: '',
        rating: 5, // Default to 5-star rating
    });

    const [hoveredStar, setHoveredStar] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => {
                reset();
                toast.success(isUrdu ? 'آپ کا پیغام کامیابی سے موصول ہو گیا ہے!' : 'Your message has been sent successfully!');
            },
            onError: () => {
                toast.error(isUrdu ? 'برائے مہربانی فارم کی غلطیاں درست کریں۔' : 'Please resolve the errors in the form.');
            }
        });
    };

    return (
        <div className="bg-background min-h-screen text-foreground transition-colors pb-16">
            <SEOHead 
                title={isUrdu ? 'رابطہ کریں' : 'Contact Us'} 
                description={isUrdu ? 'جامعہ احسن کراچی کے پتے، فون نمبرز، اور لوکیشن کی معلومات یا ہمیں اپنی رائے بھیجیں۔' : 'Contact Jamia Arabia Ahsan Ul Uloom in Karachi for inquiries, admissions help, address and maps.'}
            />

            {/* Sub-Header Banner */}
            <div className="relative bg-sapphire-950 py-16 md:py-20 text-white overflow-hidden shadow-md">
                {/* Background Image with Overlays */}
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
                        {isUrdu ? 'رابطہ کریں' : 'Get In Touch'}
                    </span>
                    <h1 className={cn(
                        "text-3xl md:text-5xl font-black tracking-tight mb-4 text-white",
                        isUrdu ? "font-urdu leading-normal" : "font-heading"
                    )}>
                        {isUrdu ? 'ہم سے رابطہ کریں' : 'Contact Us'}
                    </h1>
                    <p className={cn(
                        "text-sm md:text-base text-stone-300 max-w-2xl font-medium",
                        isUrdu ? "font-urdu leading-relaxed" : "font-sans"
                    )}>
                        {isUrdu 
                            ? 'جامعہ احسن کے بارے میں کسی بھی سوال، معلومات یا رائے کے لیے ہم سے رابطہ کریں۔ ہم آپ کی رہنمائی کے لیے حاضر ہیں۔' 
                            : 'Have questions about admissions, courses, or need support? Reach out to our administration and we will get back to you shortly.'
                        }
                    </p>
                </div>
            </div>

            {/* Main Content Layout Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Contact Cards & Map Info (lg:col-span-5) */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Address Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-5 md:p-6 shadow-sm flex items-start gap-4 hover:border-sapphire-500/20 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-xl bg-sapphire-500/10 dark:bg-sapphire-500/20 text-sapphire-500 dark:text-sapphire-300 flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h3 className={cn("text-sm font-black uppercase text-stone-400 tracking-wider mb-1", isUrdu && "font-urdu text-[11px]")}>
                                    {isUrdu ? 'پتہ / مقام' : 'Location & Address'}
                                </h3>
                                <p className={cn("text-stone-700 dark:text-stone-300 text-sm font-semibold leading-relaxed", isUrdu && "font-urdu text-[13px] leading-7")}>
                                    {isUrdu 
                                        ? 'جامعہ عربیہ احسن العلوم، گلشن اقبال بلاک ۲، کراچی، پاکستان' 
                                        : 'Jamia Arabia Ahsan Ul Uloom, Gulshan-e-Iqbal Block 2, Karachi, Pakistan'
                                    }
                                </p>
                            </div>
                        </motion.div>

                        {/* Phone Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-5 md:p-6 shadow-sm flex items-start gap-4 hover:border-sapphire-500/20 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gold-400/10 text-gold-400 flex items-center justify-center shrink-0">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h3 className={cn("text-sm font-black uppercase text-stone-400 tracking-wider mb-1", isUrdu && "font-urdu text-[11px]")}>
                                    {isUrdu ? 'فون نمبرز' : 'Phone & Support'}
                                </h3>
                                <div className="space-y-1 text-stone-700 dark:text-stone-300 text-sm font-semibold">
                                    <div className="flex items-center gap-2">
                                        <span className="text-stone-400 text-xs font-medium">{isUrdu ? 'دفتر:' : 'Office:'}</span>
                                        <a href="tel:02134982631" className="hover:text-sapphire-500 transition-colors">021-34982631</a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-stone-400 text-xs font-medium">{isUrdu ? 'داخلہ سیل:' : 'Admissions:'}</span>
                                        <a href="tel:03343969964" className="hover:text-sapphire-500 transition-colors">0334-3969964</a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Email Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-5 md:p-6 shadow-sm flex items-start gap-4 hover:border-sapphire-500/20 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h3 className={cn("text-sm font-black uppercase text-stone-400 tracking-wider mb-1", isUrdu && "font-urdu text-[11px]")}>
                                    {isUrdu ? 'ای میل ایڈریس' : 'Email Address'}
                                </h3>
                                <div className="space-y-1 text-stone-700 dark:text-stone-300 text-sm font-semibold">
                                    <div className="flex items-center gap-2">
                                        <span className="text-stone-400 text-xs font-medium">{isUrdu ? 'عمومی معلومات:' : 'General:'}</span>
                                        <a href="mailto:info@jamiaahsan.edu.pk" className="hover:text-sapphire-500 transition-colors">info@jamiaahsan.edu.pk</a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-stone-400 text-xs font-medium">{isUrdu ? 'داخلہ سیل:' : 'Admissions:'}</span>
                                        <a href="mailto:admissions@jamiaahsan.edu.pk" className="hover:text-sapphire-500 transition-colors">admissions@jamiaahsan.edu.pk</a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Operating Hours Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-5 md:p-6 shadow-sm flex items-start gap-4 hover:border-sapphire-500/20 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h3 className={cn("text-sm font-black uppercase text-stone-400 tracking-wider mb-1", isUrdu && "font-urdu text-[11px]")}>
                                    {isUrdu ? 'اوقاتِ کار' : 'Office Hours'}
                                </h3>
                                <p className={cn("text-stone-700 dark:text-stone-300 text-sm font-semibold leading-relaxed", isUrdu && "font-urdu text-[13px] leading-7")}>
                                    {isUrdu 
                                        ? 'پیر تا ہفتہ: صبح ۸:۰۰ بجے سے دوپہر ۴:۰۰ بجے تک (جمعہ کو وقفہ برائے نماز)' 
                                        : 'Monday – Saturday: 8:00 AM – 4:00 PM (Break for Jummah Prayers)'
                                    }
                                </p>
                            </div>
                        </motion.div>

                        {/* Styled Google Map Embed */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="border border-stone-200/60 dark:border-stone-800/80 rounded-2xl overflow-hidden shadow-sm aspect-video bg-stone-100 dark:bg-stone-900"
                        >
                            <iframe 
                                title="Jamia Arabia Ahsan Ul Uloom Location Map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.118949826315!2d67.1118949!3d24.927231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb3388cd26ff1a3%3A0xf6398ddad2fdfc1!2sJamia%20Arabia%20Ahsan%20Ul%20Uloom!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk"
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen={true} 
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </motion.div>

                    </div>

                    {/* Right Column: Premium Form Card (lg:col-span-7) */}
                    <div className="lg:col-span-7">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-6 md:p-8 shadow-md shadow-stone-100/30 dark:shadow-none space-y-6"
                        >
                            <div>
                                <h2 className={cn("text-xl md:text-2xl font-black text-stone-900 dark:text-white mb-2", isUrdu ? "font-urdu" : "font-heading")}>
                                    {isUrdu ? 'ہمیں پیغام بھیجیں' : 'Send us a Message'}
                                </h2>
                                <p className={cn("text-xs md:text-sm text-stone-500 dark:text-stone-400 leading-relaxed", isUrdu ? "font-urdu text-[11px]" : "font-sans")}>
                                    {isUrdu 
                                        ? 'کسی بھی سوال، رائے یا داخلہ معلومت کے لیے نیچے دیا گیا فارم پُر کریں۔ ہمارے نمائندے جلد آپ سے رابطہ کریں گے۔' 
                                        : 'Please fill out the form below to register your queries or submit feedback. Fields marked with * are required.'
                                    }
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name Input */}
                                <div className="space-y-1.5">
                                    <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                                        <User className="w-3.5 h-3.5" />
                                        {isUrdu ? 'مکمل نام *' : 'Full Name *'}
                                    </label>
                                    <Input 
                                        type="text"
                                        placeholder={isUrdu ? 'اپنا نام درج کریں' : 'Enter your name'}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={cn(
                                            "h-10.5 rounded-xl border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40",
                                            errors.name && "border-red-500 dark:border-red-500"
                                        )}
                                    />
                                    {errors.name && (
                                        <p className="text-[11px] font-bold text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Email Input */}
                                    <div className="space-y-1.5">
                                        <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                                            <Mail className="w-3.5 h-3.5" />
                                            {isUrdu ? 'ای میل ایڈریس *' : 'Email Address *'}
                                        </label>
                                        <Input 
                                            type="email"
                                            placeholder={isUrdu ? 'example@gmail.com' : 'example@gmail.com'}
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={cn(
                                                "h-10.5 rounded-xl border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40",
                                                errors.email && "border-red-500 dark:border-red-500"
                                            )}
                                        />
                                        {errors.email && (
                                            <p className="text-[11px] font-bold text-red-500">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Phone Input */}
                                    <div className="space-y-1.5">
                                        <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                                            <Phone className="w-3.5 h-3.5" />
                                            {isUrdu ? 'فون نمبر (اختیاری)' : 'Phone Number (Optional)'}
                                        </label>
                                        <Input 
                                            type="text"
                                            placeholder="e.g. +92 334 3969964"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="h-10.5 rounded-xl border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40"
                                        />
                                        {errors.phone && (
                                            <p className="text-[11px] font-bold text-red-500">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Country Input */}
                                <div className="space-y-1.5">
                                    <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                                        <Globe className="w-3.5 h-3.5" />
                                        {isUrdu ? 'ملک *' : 'Country / Region *'}
                                    </label>
                                    <Input 
                                        type="text"
                                        placeholder={isUrdu ? 'اپنا ملک درج کریں (مثال: پاکستان)' : 'e.g. Pakistan, Saudi Arabia'}
                                        value={data.country}
                                        onChange={(e) => setData('country', e.target.value)}
                                        className={cn(
                                            "h-10.5 rounded-xl border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40",
                                            errors.country && "border-red-500 dark:border-red-500"
                                        )}
                                    />
                                    {errors.country && (
                                        <p className="text-[11px] font-bold text-red-500">{errors.country}</p>
                                    )}
                                </div>

                                {/* Interactive Rating / Feedback stars */}
                                <div className="space-y-1.5 bg-stone-50 dark:bg-sapphire-950/20 p-4 rounded-xl border border-stone-200/60 dark:border-stone-800/80">
                                    <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                                        <Star className="w-3.5 h-3.5 text-gold-400" />
                                        {isUrdu ? 'جامعہ کی ویب سائٹ کو ریٹنگ دیں *' : 'Rate your website experience *'}
                                    </label>
                                    
                                    <div className="flex items-center gap-1.5 mt-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setData('rating', star)}
                                                onMouseEnter={() => setHoveredStar(star)}
                                                onMouseLeave={() => setHoveredStar(null)}
                                                className="p-1 hover:scale-110 transition-transform cursor-pointer border-none bg-transparent"
                                                title={`Rate ${star} Stars`}
                                            >
                                                <Star 
                                                    className={cn(
                                                        "w-7 h-7 transition-colors duration-150",
                                                        (hoveredStar !== null ? star <= hoveredStar : star <= data.rating)
                                                            ? "fill-gold-400 text-gold-400"
                                                            : "text-stone-300 dark:text-stone-700 fill-transparent"
                                                    )}
                                                />
                                            </button>
                                        ))}
                                        <span className="text-xs font-black text-stone-500 dark:text-stone-400 ml-3">
                                            {data.rating} / 5
                                        </span>
                                    </div>
                                    {errors.rating && (
                                        <p className="text-[11px] font-bold text-red-500 mt-1">{errors.rating}</p>
                                    )}
                                </div>

                                {/* Message Input */}
                                <div className="space-y-1.5">
                                    <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        {isUrdu ? 'آپ کا پیغام / سوال *' : 'Your Message / Comment *'}
                                    </label>
                                    <textarea 
                                        rows={4}
                                        placeholder={isUrdu ? 'اپنا پیغام یہاں تفصیل سے لکھیں...' : 'Write your detailed message here...'}
                                        value={data.comment}
                                        onChange={(e) => setData('comment', e.target.value)}
                                        className={cn(
                                            "w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40 text-stone-900 dark:text-white placeholder-stone-400 text-sm outline-none resize-none focus:border-sapphire-500 focus:ring-1 focus:ring-sapphire-500",
                                            errors.comment && "border-red-500 dark:border-red-500"
                                        )}
                                    />
                                    {errors.comment && (
                                        <p className="text-[11px] font-bold text-red-500">{errors.comment}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full h-11.5 bg-sapphire-500 hover:bg-sapphire-400 text-white font-bold rounded-xl border-transparent cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 shadow-md"
                                >
                                    {processing ? (
                                        <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            <span>{isUrdu ? 'پیغام ارسال کریں' : 'Send Message'}</span>
                                        </>
                                    )}
                                </Button>

                            </form>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Assign layout context to preserve persistent player states
Contact.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
