import React from 'react';
import { motion, Variants } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';

export function AboutHero() {
    const { locale } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    // Calligraphy path drawing variants
    const drawCalligraphy: Variants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 0.15,
            transition: { duration: 3, ease: 'easeInOut' }
        }
    };

    const textReveal: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' }
        }
    };

    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 px-6 bg-radial-[at_center_center] from-sapphire-900 via-sapphire-950 to-neutral-950 text-white">
            {/* Elegant Islamic Geometric Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="geometric-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
                            <path d="M 40,0 L 80,40 L 40,80 L 0,40 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                            <circle cx="40" cy="40" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
                            <path d="M 0,0 L 80,80 M 80,0 L 0,80" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#geometric-pattern)" />
                </svg>
            </div>

            {/* Glowing Golden Orbs in the background */}
            <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] rounded-full bg-gold-400/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] rounded-full bg-sapphire-500/10 blur-[120px] pointer-events-none" />

            {/* SVG Calligraphy Overlay (Watermark effect) */}
            <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                <svg className="w-[85%] max-w-[850px] aspect-[2/1] text-gold-400" viewBox="0 0 500 250" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.path
                        d="M 50 125 C 80 50, 150 50, 200 125 C 250 200, 320 200, 350 125 C 380 50, 420 50, 450 125"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        variants={drawCalligraphy}
                        initial="hidden"
                        animate="visible"
                    />
                    <motion.path
                        d="M 120 160 C 150 90, 200 90, 250 160 C 300 230, 350 230, 380 160"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        variants={drawCalligraphy}
                        initial="hidden"
                        animate="visible"
                    />
                </svg>
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Traditional Calligraphy text (Cairo/Arabic) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    className="font-arabic text-gold-400 text-lg md:text-2xl font-semibold tracking-widest mb-6 opacity-90"
                >
                    إِنَّ الْعُلُومَ سَبِيلٌ لِلْجِنَانِ
                </motion.div>

                {/* Heading */}
                <motion.h1
                    variants={textReveal}
                    initial="hidden"
                    animate="visible"
                    className={`text-4xl md:text-6xl font-extrabold tracking-tight mb-8 leading-[1.15] bg-clip-text text-transparent bg-gradient-to-b from-stone-50 via-white to-gold-200 ${isUrdu ? 'font-urdu leading-[1.3]' : 'font-sans'}`}
                >
                    {isUrdu ? 'اسلامی علوم اور عظمت کا ایک عظیم ورثہ' : 'A Legacy of Islamic Knowledge and Excellence'}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.85 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className={`text-base md:text-xl text-stone-300 max-w-2xl mx-auto mb-10 leading-relaxed ${isUrdu ? 'font-urdu leading-[2] text-stone-200' : 'font-sans'}`}
                >
                    {isUrdu 
                        ? 'مستند اسلامی علوم کے تسلسل کے تحفظ کے ساتھ ساتھ ڈیجیٹل رسائی کا فروغ۔ جامعہ احسن صدیوں قدیم دینی ورثے کو دورِ جدید کے تقاضوں کے مطابق طالب علموں تک پہنچا رہا ہے۔'
                        : 'Preserving the lineage of authentic scholarship while paving the path for digital Islamic accessibility. Jamia Ahsan connects centuries-old theological structures to modern global learners.'
                    }
                </motion.p>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-wrap items-center justify-center gap-4"
                >
                    <a
                        href="/education"
                        className="px-8 py-3.5 rounded-full font-bold bg-gold-400 hover:bg-gold-500 text-stone-950 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold-400/20"
                    >
                        {isUrdu ? 'شعبہ جات دیکھیں' : 'Explore Programs'}
                    </a>
                    <a
                        href="/contact"
                        className="px-8 py-3.5 rounded-full font-medium border border-stone-700 bg-stone-900/50 hover:bg-stone-900 text-stone-100 hover:text-white transition-all duration-300 backdrop-blur-md"
                    >
                        {isUrdu ? 'ہم سے رابطہ کریں' : 'Contact Us'}
                    </a>
                </motion.div>
            </div>

            {/* Mosque silhouette divider at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none opacity-20">
                <svg width="100%" height="64" viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 64H1440V48C1380 48 1320 20 1280 20C1240 20 1180 50 1120 50C1060 50 1000 16 960 16C920 16 860 48 800 48C740 48 680 12 640 12C600 12 540 50 480 50C420 50 360 24 320 24C280 24 220 56 160 56C100 56 40 44 0 44V64Z" fill="var(--bg, #fafaf9)" />
                </svg>
            </div>
        </section>
    );
}
