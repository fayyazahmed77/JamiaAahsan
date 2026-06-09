import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';
import { Calendar, ChevronRight, ChevronLeft } from 'lucide-react';

interface Milestone {
    year: string;
    title: string;
    titleUrdu: string;
    description: string;
    descriptionUrdu: string;
}

export function InteractiveTimeline() {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';
    const [activeIndex, setActiveIndex] = useState(0);

    const milestones: Milestone[] = [
        {
            year: '1998',
            title: 'Foundation of Jamia',
            titleUrdu: 'جامعہ کی بنیاد',
            description: 'Established in a small community prayer hall in Karachi with a class of 25 students, focusing on classical text studies.',
            descriptionUrdu: 'صرف ۲۵ طلباء کے ساتھ کراچی میں ایک چھوٹی مسجد سے روایتی درسِ نظامی کے آغاز کے ساتھ جامعہ کا سفر شروع ہوا۔'
        },
        {
            year: '2005',
            title: 'Primary Campus Construction',
            titleUrdu: 'مرکزی کیمپس کی تعمیر',
            description: 'Inauguration of the grand mosque and resident blocks, allowing on-campus boarding facilities for out-of-city scholars.',
            descriptionUrdu: 'مرکزی جامع مسجد اور ہاسٹل بلاکس کی افتتاحی تقریب، جس سے بیرونِ شہر سے آنے والے طلباء کے لیے رہائشی سہولیات فراہم ہوئیں۔'
        },
        {
            year: '2012',
            title: 'Fatwa Department Launch',
            titleUrdu: 'دارالافتاء کا قیام',
            description: 'Organizing the dynamic legal research division to formulate authentic answers to contemporary theological and finance matters.',
            descriptionUrdu: 'جدید معاشرتی و مالیاتی مسائل کے مستند حل فراہم کرنے کے لیے دارالافتاء اور فقہی ریسرچ ونگ کا باقاعدہ آغاز۔'
        },
        {
            year: '2017',
            title: 'Media & Production Department',
            titleUrdu: 'شعبہ نشر و اشاعت کا آغاز',
            description: 'Building a state-of-the-art audio and video broadcasting suite to preserve recordings and deliver lectures globally.',
            descriptionUrdu: 'اعلیٰ معیار کی آڈیو اور ویڈیو لیکچرز کی ریکارڈنگ اور براہِ راست نشریات کے لیے جدید ترین میڈیا اسٹوڈیو کا قیام۔'
        },
        {
            year: '2021',
            title: 'Online Jamia Platform',
            titleUrdu: 'آن لائن تعلیمی نیٹ ورک',
            description: 'Standardizing our entire Dars-e-Nizami curriculum as interactive virtual classes, reaching remote students.',
            descriptionUrdu: 'آن لائن لرننگ پلیٹ فارم کا آغاز جس کے ذریعے دنیا بھر کے طلباء کے لیے فاصلاتی نظامِ تعلیم (آن لائن کلاسز) نافذ کی گئیں۔'
        },
        {
            year: 'Present',
            title: 'Global Cohorts & 15k+ Students',
            titleUrdu: 'عالمی نیٹ ورک اور ۱۵ ہزار طلباء',
            description: 'Instructing students in over 50 countries and continuing the preservation of classical scholarship paths.',
            descriptionUrdu: 'دنیا کے ۵۰ سے زائد ممالک میں دینی علوم کی رسائی اور ۱۵،۰۰۰ سے زائد فارغ التحصیل طلباء کی خدمت۔'
        }
    ];

    const handleNext = () => {
        if (activeIndex < milestones.length - 1) setActiveIndex(activeIndex + 1);
    };

    const handlePrev = () => {
        if (activeIndex > 0) setActiveIndex(activeIndex - 1);
    };

    return (
        <section className="py-24 px-6 bg-stone-50 dark:bg-stone-950 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-sm font-semibold tracking-wider text-gold-400 uppercase mb-3 block">
                        {isUrdu ? 'ہمارا ارتقائی سفر' : 'Historical Timeline'}
                    </span>
                    <h2 className={`text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-white mb-4 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? 'ترقی کے اہم سنگِ میل' : 'Our Institutional Journey'}
                    </h2>
                    <p className={`text-stone-500 dark:text-stone-400 text-sm ${isUrdu ? 'font-urdu text-stone-300' : 'font-sans'}`}>
                        {isUrdu ? '۱۹۹۸ سے شروع ہونے والے سفر کے تاریخی موڑ اور کامیابیاں۔' : 'Key steps and milestones that shaped Jamia Ahsan over the decades.'}
                    </p>
                </div>

                {/* DESKTOP TIMELINE DISPLAY (Hidden on Mobile) */}
                <div className="hidden lg:block relative py-12 mb-12">
                    {/* Track Line */}
                    <div className="absolute top-[50%] left-0 right-0 h-0.5 bg-stone-200 dark:bg-stone-800" />
                    
                    {/* Dynamic Active Progress Line */}
                    <motion.div
                        className="absolute top-[50%] left-0 h-0.5 bg-gold-400 origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: activeIndex / (milestones.length - 1) }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        style={{ right: dir === 'rtl' ? 'auto' : 0, left: dir === 'rtl' ? 0 : 'auto', width: '100%' }}
                    />

                    {/* Timeline Nodes */}
                    <div className="relative flex justify-between">
                        {milestones.map((milestone, idx) => {
                            const isActive = idx === activeIndex;
                            const isPast = idx < activeIndex;
                            return (
                                <div key={idx} className="flex flex-col items-center select-none cursor-pointer" onClick={() => setActiveIndex(idx)}>
                                    {/* Year Label */}
                                    <motion.span
                                        className={`text-sm font-bold mb-4 block ${isActive ? 'text-gold-400 font-extrabold' : isPast ? 'text-sapphire-500' : 'text-stone-400 dark:text-stone-600'}`}
                                        animate={{ scale: isActive ? 1.15 : 1 }}
                                    >
                                        {milestone.year}
                                    </motion.span>
                                    
                                    {/* Dot Node */}
                                    <motion.div
                                        className={`w-6 h-6 rounded-full border-2 bg-white dark:bg-stone-950 flex items-center justify-center relative z-10 transition-colors duration-300 ${isActive ? 'border-gold-400 text-gold-400 ring-4 ring-gold-400/10' : isPast ? 'border-sapphire-500 bg-sapphire-500 text-white' : 'border-stone-300 dark:border-stone-800 text-stone-400'}`}
                                        whileHover={{ scale: 1.25 }}
                                    >
                                        <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-gold-400' : isPast ? 'bg-white' : 'bg-transparent'}`} />
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* MOBILE TIMELINE NODES SCROLLER (Horizontal Carousel for Mobile/Tablet) */}
                <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-6 mb-6 snap-x snap-mandatory">
                    {milestones.map((milestone, idx) => {
                        const isActive = idx === activeIndex;
                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`px-5 py-2.5 rounded-full border text-sm font-semibold whitespace-nowrap snap-center transition-all ${isActive ? 'bg-gold-400 border-gold-400 text-stone-950 font-bold' : 'bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'}`}
                            >
                                {milestone.year}
                            </button>
                        );
                    })}
                </div>

                {/* Interactive Card Details Area */}
                <div className="max-w-3xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden"
                        >
                            {/* Decorative Arch Watermark */}
                            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gold-400/[0.02] dark:bg-gold-400/[0.01] pointer-events-none rounded-r-3xl" style={{ clipPath: 'path("M0 0 H128 V200 H0 Z")' }} />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 border-b border-stone-100 dark:border-stone-800 pb-6">
                                <div>
                                    <div className="flex items-center gap-2 text-gold-400 mb-2">
                                        <Calendar className="w-4 h-4" />
                                        <span className="font-semibold text-xs uppercase tracking-wider">{isUrdu ? 'تاریخی سال' : 'Milestone Year'}</span>
                                    </div>
                                    <h3 className={`text-2xl md:text-3xl font-extrabold text-stone-950 dark:text-white ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                                        {isUrdu ? milestones[activeIndex].titleUrdu : milestones[activeIndex].title}
                                    </h3>
                                </div>
                                <span className="text-4xl md:text-5xl font-extrabold text-stone-200 dark:text-stone-800 select-none">
                                    {milestones[activeIndex].year}
                                </span>
                            </div>

                            <p className={`text-stone-600 dark:text-stone-300 text-base md:text-lg leading-relaxed ${isUrdu ? 'font-urdu leading-[2.2] text-stone-200' : 'font-sans'}`}>
                                {isUrdu ? milestones[activeIndex].descriptionUrdu : milestones[activeIndex].description}
                            </p>

                            {/* Nav buttons inside card */}
                            <div className="flex justify-between items-center mt-8 pt-6 border-t border-stone-100 dark:border-stone-800">
                                <button
                                    onClick={handlePrev}
                                    disabled={activeIndex === 0}
                                    className="p-2 rounded-full border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none"
                                >
                                    {dir === 'rtl' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                                </button>
                                <span className="text-xs text-stone-400">
                                    {activeIndex + 1} / {milestones.length}
                                </span>
                                <button
                                    onClick={handleNext}
                                    disabled={activeIndex === milestones.length - 1}
                                    className="p-2 rounded-full border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none"
                                >
                                    {dir === 'rtl' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
}
