import React from 'react';
import { motion } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';
import type { Scholar } from '../Index';
import { ArrowRight } from 'lucide-react';

interface LeadershipProps {
    leadership: Scholar[];
}

export function LeadershipPreview({ leadership }: LeadershipProps) {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    // Layout configuration: takes up to 3 for summary
    const displayScholars = leadership.slice(0, 3);

    return (
        <section className="py-24 px-6 bg-stone-100 dark:bg-stone-900/40">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <span className="text-sm font-semibold tracking-wider text-gold-400 uppercase mb-3 block">
                            {isUrdu ? 'قیادت اور سرپرستِ اعلیٰ' : 'Institutional Leadership'}
                        </span>
                        <h2 className={`text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-white ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                            {isUrdu ? 'علمی رہنمائی اور شیوخ' : 'Scholarly Leadership'}
                        </h2>
                    </div>
                    <a
                        href="/about/leadership"
                        className="inline-flex items-center gap-2 font-semibold text-gold-400 hover:text-gold-300 group transition-all shrink-0"
                    >
                        <span>{isUrdu ? 'شیوخ کی تفصیلی سوانح' : 'View Full Leadership'}</span>
                        <ArrowRight className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                    </a>
                </div>

                {/* Leadership Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayScholars.map((scholar, idx) => (
                        <motion.div
                            key={scholar.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                        >
                            {/* Photo Placeholder / Image wrapper */}
                            <div className="relative aspect-[4/3] bg-stone-950 overflow-hidden flex items-center justify-center">
                                {/* SVG/Geometric background watermark */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                <div className="absolute top-4 left-4 z-20 bg-gold-400/10 backdrop-blur-md border border-gold-400/30 text-gold-400 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                                    {isUrdu ? scholar.designation_urdu : scholar.designation}
                                </div>
                                
                                {/* Placeholder Visual representation */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-sapphire-900 to-sapphire-950">
                                    <div className="w-16 h-16 rounded-full border border-gold-400/30 flex items-center justify-center text-gold-400 mb-4 bg-sapphire-950">
                                        <span className="text-xl font-bold font-arabic">AH</span>
                                    </div>
                                    <h4 className="text-white font-bold">{scholar.name}</h4>
                                    <p className="text-stone-400 text-xs mt-1">{isUrdu ? scholar.designation_urdu : scholar.designation}</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                                <div className="mb-6">
                                    <h3 className={`text-xl font-bold text-stone-950 dark:text-white mb-2 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                                        {isUrdu ? scholar.urdu_name : scholar.name}
                                    </h3>
                                    <p className={`text-stone-500 dark:text-stone-400 text-xs font-semibold uppercase tracking-wider mb-4`}>
                                        {isUrdu ? scholar.designation_urdu : scholar.designation}
                                    </p>
                                    <p className={`text-stone-600 dark:text-stone-400 text-sm leading-relaxed line-clamp-3 ${isUrdu ? 'font-urdu leading-[2] text-stone-300' : 'font-sans'}`}>
                                        {isUrdu ? scholar.bio_urdu : scholar.bio}
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                                    <a
                                        href="/about/leadership"
                                        className="text-xs font-bold uppercase tracking-wider text-gold-400 hover:text-gold-500 inline-flex items-center gap-1.5"
                                    >
                                        <span>{isUrdu ? 'سوانح حیات دیکھیں' : 'Read Full Biography'}</span>
                                        <ArrowRight className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
