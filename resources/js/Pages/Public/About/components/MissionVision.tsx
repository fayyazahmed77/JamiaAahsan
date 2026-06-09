import React from 'react';
import { motion, Variants } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';
import { ShieldCheck, Lightbulb, HeartHandshake } from 'lucide-react';

export function MissionVision() {
    const { locale } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    const cards = [
        {
            icon: ShieldCheck,
            title: isUrdu ? 'مستند دینی علوم' : 'Authentic Scholarship',
            description: isUrdu
                ? 'علمِ دین کے روایتی سلسلوں اور اسناد کا تحفظ کرنا اور ایسی نسل تیار کرنا جو قدیم فقہی بنیادوں پر گہری نظر رکھتی ہو۔'
                : 'Preserving the traditional chains (Sanad) of text, logic, and law to build a generation of deeply-rooted theological scholars.',
            borderClass: 'border-t-sapphire-500'
        },
        {
            icon: Lightbulb,
            title: isUrdu ? 'جدید ذرائع اور جدت' : 'Modern Innovation',
            description: isUrdu
                ? 'جدید تعلیمی ذرائع اور ٹیکنالوجی کا استعمال کرتے ہوئے آن لائن طالب علموں کے لیے آسان اور معیاری تعلیم فراہم کرنا۔'
                : 'Harnessing modern software architectures and online learning management platforms to optimize access for virtual learners.',
            borderClass: 'border-t-gold-400'
        },
        {
            icon: HeartHandshake,
            title: isUrdu ? 'خدمتِ خلق' : 'Community Impact',
            description: isUrdu
                ? 'معاشرتی بہبود، خاندانی کونسلنگ، اور قیدیوں کی فکری اصلاح جیسے سماجی فلاح کے کاموں کے ذریعے معاشرے کی رہنمائی کرنا۔'
                : 'Fostering societal correction, family counseling, and prisoner outreach to actively serve and reform local communities.',
            borderClass: 'border-t-gold-600'
        }
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 35 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100, damping: 20 }
        }
    };

    return (
        <section className="py-24 px-6 bg-stone-100 dark:bg-stone-900/40 relative">
            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-sm font-semibold tracking-wider text-gold-400 uppercase mb-3 block">
                        {isUrdu ? 'ہمارا مشن اور نظریہ' : 'Our Foundations'}
                    </span>
                    <h2 className={`text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-white ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? 'بنیادی مقاصد اور اقدار' : 'Mission, Vision & Values'}
                    </h2>
                </div>

                {/* Cards Container */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {cards.map((card, idx) => {
                        const IconComponent = card.icon;
                        return (
                            <motion.div
                                key={idx}
                                variants={cardVariants}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className={`bg-white dark:bg-stone-900 p-8 rounded-2xl border-t-4 ${card.borderClass} border-r border-l border-b border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
                            >
                                {/* Decorative circle watermark */}
                                <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-stone-50 dark:bg-stone-800/40 group-hover:scale-150 transition-all duration-500 pointer-events-none" />

                                {/* Icon box */}
                                <div className="w-12 h-12 rounded-xl bg-gold-400/10 dark:bg-gold-400/5 flex items-center justify-center text-gold-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <IconComponent className="w-6 h-6" />
                                </div>

                                <h3 className={`text-xl font-bold text-stone-950 dark:text-white mb-4 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                                    {card.title}
                                </h3>

                                <p className={`text-stone-600 dark:text-stone-400 text-sm leading-relaxed relative z-10 ${isUrdu ? 'font-urdu leading-[2.1]' : 'font-sans'}`}>
                                    {card.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
