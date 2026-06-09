import React from 'react';
import { motion } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';
import { CheckCircle2 } from 'lucide-react';

export default function AppPromotion() {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    const bullets = isUrdu ? [
        'درست اوقاتِ نماز اور خودکار اذان الرٹس',
        'جامعہ احسن کی آڈیو اور ویڈیو لائبریریوں تک مکمل رسائی',
        'مستند مفتیانِ کرام سے بلا واسطہ آن لائن فتویٰ جوابات حاصل کریں',
        'روزانہ منتخب آیات، احادیث اور دعائیں'
    ] : [
        'Accurately calculated prayer times & Adhan alerts',
        'Full access to Jamia Ahsan\'s audio & video libraries',
        'Submit Fatwa queries directly to qualified scholars',
        'Daily Quranic verses, Hadith, and Islamic reminders'
    ];

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-sapphire-900 via-sapphire-950 to-sapphire-900 border-t border-b border-gold-400/10">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[35rem] h-[35rem] rounded-full bg-gold-400/5 blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[30rem] h-[30rem] rounded-full bg-sapphire-500/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left: App Screen Mockup Showcase (Col 5) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-5 flex justify-center order-2 lg:order-1"
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="relative max-w-[400px] w-full"
                        >
                            {/* Calligraphy Watermark behind Phone */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,165,32,0.08)_0%,transparent_70%)] rounded-full -scale-105 pointer-events-none" />
                            
                            <img 
                                src="/images/app.webp" 
                                alt="Jamia Ahsan Mobile App" 
                                className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(30,95,168,0.3)]" 
                            />
                        </motion.div>
                    </motion.div>

                    {/* Right: Promotion Details & Badges (Col 7) */}
                    <motion.div
                        initial={{ opacity: 0, x: dir === 'rtl' ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className={`lg:col-span-7 flex flex-col justify-center text-white order-1 lg:order-2 ${isUrdu ? 'text-right' : 'text-left'}`}
                    >
                        {/* Label tag */}
                        <span className="text-xs font-black tracking-widest text-gold-400 uppercase mb-4 block">
                            {isUrdu ? 'جامعہ عربیہ احسن العلوم' : 'JAMIA ARABIA AHSAN UL ULOOM'}
                        </span>

                        {/* Heading */}
                        <h2 className={`text-3xl md:text-5xl font-black mb-6 leading-tight ${isUrdu ? 'font-urdu leading-[1.3]' : 'font-sans'}`}>
                            {isUrdu ? 'روزانہ اسلامی یاد دہانی، اذان اور نماز کے اوقات' : 'Get daily Islamic reminders, Adhan and Prayer notifications'}
                        </h2>

                        {/* Description */}
                        <p className={`text-stone-300 text-sm md:text-base leading-relaxed mb-8 max-w-2xl ${isUrdu ? 'font-urdu leading-[1.9]' : 'font-sans'}`}>
                            {isUrdu 
                                ? 'ہماری پیشکش: ایک مکمل اسلامی طرزِ زندگی ایپ، مستند علمائے کرام سے جڑیں اور اپنے دن کو اسلامی دانشمندی سے منور کریں۔' 
                                : 'Our perspective of a Muslim lifestyle app, connect with trusted scholars and enrich your day with Islamic wisdom.'
                            }
                        </p>

                        {/* Bullet list */}
                        <div className="space-y-4 mb-10 max-w-xl">
                            {bullets.map((bullet, idx) => (
                                <div key={idx} className={`flex gap-3 items-start ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className="p-1 rounded-full bg-gold-400/10 text-gold-400 shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <span className={`text-stone-200 text-xs md:text-sm ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                                        {bullet}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Download App Store Badges */}
                        <div className={`flex flex-wrap gap-4 items-center ${isUrdu ? 'justify-start md:justify-end flex-row-reverse' : 'justify-start'}`}>
                            {/* Google Play Store Button */}
                            <a 
                                href="https://play.google.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-stone-950 hover:bg-stone-900 border border-stone-850 hover:border-gold-400/35 transition-all text-white shadow-xl cursor-pointer group"
                            >
                                <svg className="w-6 h-6 fill-current text-white group-hover:text-gold-400 transition-colors" viewBox="0 0 24 24">
                                    <path d="M5 3.00005C4.6 3.00005 4.3 3.10005 4 3.40005L13.7 13.1L18.4 8.40005L5 3.00005ZM3.1 4.70005V19.3001C3.1 19.6001 3.2 19.8001 3.4 20.0001L12.9 10.5L3.1 4.70005ZM18.7 9.80005L14.4 14.1L19.4 19.1C20.1 18.3 20.5 17.1 20.5 15.6C20.5 13.2 19.8 11.2 18.7 9.80005ZM4 20.6001L13.7 10.9L18.4 15.6L4 20.6001Z" />
                                </svg>
                                <div className="text-left">
                                    <span className="block text-[9px] uppercase tracking-wider text-stone-400 font-bold">GET IT ON</span>
                                    <span className="block text-xs font-black text-white">Google Play</span>
                                </div>
                            </a>

                            {/* Apple App Store Button */}
                            <a 
                                href="https://apple.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-stone-950 hover:bg-stone-900 border border-stone-850 hover:border-gold-400/35 transition-all text-white shadow-xl cursor-pointer group"
                            >
                                <svg className="w-6 h-6 fill-current text-white group-hover:text-gold-400 transition-colors" viewBox="0 0 24 24">
                                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C3.8 16.37 3.88 11.08 7.32 10.8c1.16.1 1.95.66 2.68.66.72 0 1.62-.64 3.03-.5 1.5.15 2.52.88 3.12 1.95-3.04 1.76-2.24 5.76.62 6.96-.6 1.48-1.34 2.89-2.32 3.41zM14.52 7.76c.72-.92.6-2.48-.38-3.28-1-.8-2.48-.52-3.1 0-.68.64-.64 2.36.36 3.14.9.7 2.4.68 3.12.14z" />
                                </svg>
                                <div className="text-left">
                                    <span className="block text-[9px] uppercase tracking-wider text-stone-400 font-bold">Download on the</span>
                                    <span className="block text-xs font-black text-white">App Store</span>
                                </div>
                            </a>
                        </div>
                    </motion.div>
                    
                </div>
            </div>
        </section>
    );
}
