import React from 'react';
import { motion } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';
import { Cpu, Globe, Database, Milestone } from 'lucide-react';

export function FutureVision() {
    const { locale } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    const items = [
        {
            icon: Cpu,
            title: isUrdu ? 'آرٹیفیشل انٹیلیجنس اور افتاء' : 'AI & Jurisprudence Models',
            desc: isUrdu
                ? 'مستند اور تاریخی فتاویٰ کے ریکارڈز کو تلاش کرنے کے لیے ایک جدید سرچ ماڈل کی تیاری۔'
                : 'Developing high-fidelity indexed LLMs to search and cross-reference verified Fatwa archives.'
        },
        {
            icon: Database,
            title: isUrdu ? 'قدیم مسودات کی ڈیجیٹلائزیشن' : 'Digital Manuscript Archive',
            desc: isUrdu
                ? 'صدیوں پرانے قلمی اسلامی مسودات اور کتابوں کے اعلیٰ معیار کے ڈیجیٹل ریکارڈز کا تحفظ۔'
                : 'Archiving and high-definition scanning of centuries-old classical Islamic manuscripts and texts.'
        },
        {
            icon: Globe,
            title: isUrdu ? 'عالمی فاصلاتی تعلیمی رسائی' : 'Global Outreach Network',
            desc: isUrdu
                ? 'غیر مسلم دنیا اور مغرب میں مقیم مسلمانوں کے لیے انگریزی زبان میں کورسز کا انعقاد۔'
                : 'Expanding comprehensive English-language theological tracks targeting Western audiences.'
        },
        {
            icon: Milestone,
            title: isUrdu ? 'جدید ریسرچ جرنلز' : 'Academic Journals Publication',
            desc: isUrdu
                ? 'جدید سماجی اور معاشی چیلنجز پر اسلامک اسکالرشپ جرنلز کی اشاعت۔'
                : 'Publishing peer-reviewed journals addressing modern socio-economic challenges under Islamic law.'
        }
    ];

    return (
        <section className="py-24 px-6 bg-sapphire-950 text-white overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="octagon-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                            <rect width="60" height="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            <circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#octagon-pattern)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-sm font-semibold tracking-wider text-gold-400 uppercase mb-3 block">
                        {isUrdu ? 'مستقبل کے نظریات' : 'Future Horizons'}
                    </span>
                    <h2 className={`text-3xl md:text-4xl font-extrabold text-stone-100 mb-4 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? 'مستقبل کا وژن اور عزائم' : 'Our Future Vision'}
                    </h2>
                    <p className="text-stone-400 text-sm">
                        {isUrdu 
                            ? 'روایتی علوم کی اساس کو قائم رکھتے ہوئے جدید سائنسی ایجادات کا موثر استعمال۔' 
                            : 'Pioneering projects designed to bring ancient academic scholarship structures into the digital future.'
                        }
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.map((item, idx) => {
                        const IconComponent = item.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="bg-sapphire-900/30 border border-sapphire-700/80 hover:border-gold-400/20 rounded-2xl p-6 transition-all duration-300 relative group"
                            >
                                {/* Glow circle inside */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gold-400/[0.01] rounded-bl-full group-hover:bg-gold-400/[0.03] transition-colors duration-300 pointer-events-none" />

                                <div className="w-12 h-12 rounded-xl bg-gold-400/10 text-gold-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <IconComponent className="w-6 h-6" />
                                </div>

                                <h3 className={`text-lg font-bold text-stone-100 mb-3 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                                    {item.title}
                                </h3>

                                <p className={`text-stone-400 text-xs md:text-sm leading-relaxed ${isUrdu ? 'font-urdu leading-[2]' : 'font-sans'}`}>
                                    {item.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
