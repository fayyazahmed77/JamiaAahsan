import React from 'react';
import { motion } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';

export function CallToActionBox() {
    const { locale } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative rounded-[2.5rem] bg-gradient-to-br from-sapphire-900 to-sapphire-950 text-white p-10 md:p-16 text-center border border-gold-400/10 shadow-2xl overflow-hidden"
            >
                {/* Gold Arch Watermark overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                    <svg className="w-full max-w-[650px] aspect-[1/1] text-gold-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 50 10 C 20 10, 10 30, 10 70 C 10 90, 90 90, 90 70 C 90 30, 80 10, 50 10 Z" stroke="currentColor" strokeWidth="1" fill="none" />
                        <path d="M 50 15 C 25 15, 15 35, 15 70" stroke="currentColor" strokeWidth="0.5" fill="none" />
                    </svg>
                </div>

                <div className="relative z-10 max-w-3xl mx-auto">
                    <span className="text-sm font-semibold tracking-wider text-gold-400 uppercase mb-4 block">
                        {isUrdu ? 'تحصیلِ علم کا سفر' : 'Join Our Legacy'}
                    </span>
                    
                    <h2 className={`text-3xl md:text-5xl font-extrabold mb-6 leading-[1.2] ${isUrdu ? 'font-urdu leading-[1.4]' : 'font-sans'}`}>
                        {isUrdu ? 'علم اور عظمت کے سفر کا حصہ بنیں' : 'Join the Journey of Knowledge & Excellence'}
                    </h2>
                    
                    <p className={`text-stone-300 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed ${isUrdu ? 'font-urdu leading-[1.9] text-stone-200' : 'font-sans'}`}>
                        {isUrdu 
                            ? 'جامعہ احسن میں داخلہ لے کر مستند دینی علوم کی تحصیل شروع کریں، یا ہمارے علمی سفر کو آگے بڑھانے میں تعاون فرمائیں۔' 
                            : 'Start your path in dynamic, structured theological studies, support our global outreach mission, or connect directly with our scholars.'
                        }
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <a
                            href="/admissions/apply"
                            className="px-8 py-4 rounded-full font-bold bg-gold-400 hover:bg-gold-500 text-stone-950 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            {isUrdu ? 'داخلہ فارم پُر کریں' : 'Apply for Admission'}
                        </a>
                        <a
                            href="/donate"
                            className="px-8 py-4 rounded-full font-bold border border-white/20 hover:bg-white/10 text-white transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            {isUrdu ? 'علمی تعاون کیجیے' : 'Support Our Mission'}
                        </a>
                        <a
                            href="/contact"
                            className="px-8 py-4 rounded-full font-bold bg-stone-900/40 hover:bg-stone-900 text-stone-100 transition-all duration-300 transform hover:-translate-y-0.5 border border-stone-800"
                        >
                            {isUrdu ? 'رابطہ کریں' : 'Contact Us'}
                        </a>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
