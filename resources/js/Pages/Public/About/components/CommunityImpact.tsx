import React from 'react';
import { motion } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';
import { CheckCircle2 } from 'lucide-react';

export function CommunityImpact() {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    const points = [
        {
            title: isUrdu ? 'مفت طبی و سماجی خدمات' : 'Welfare Services & Assistance',
            desc: isUrdu 
                ? 'مستحق اور نادار خاندانوں کو راشن، مفت طبی امداد اور تعلیمی وظائف کی باقاعدہ فراہمی۔'
                : 'Distributing food rations, emergency medical support, and student scholarships to underprivileged communities.'
        },
        {
            title: isUrdu ? 'قیدیوں کی اصلاحی کلاسز' : 'Prison Rehabilitation Lectures',
            desc: isUrdu
                ? 'جیل خانوں میں باقاعدگی سے اخلاقی و فکری اصلاحی اسباق اور بیانات کا انعقاد۔'
                : 'Conducting weekly ethical counseling circles and educational lectures inside provincial corrections facilities.'
        },
        {
            title: isUrdu ? 'مفت آن لائن علمی رسائی' : 'Free Global Digital Archiving',
            desc: isUrdu
                ? 'دنیا بھر میں بلا معاوضہ ہزاروں آڈیو اسباق اور فتاویٰ کی ڈیجیٹل فراہمی۔'
                : 'Broadcasting over 8,500 lectures and legal verdicts free of charge to students in 50+ countries.'
        }
    ];

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                
                {/* Text and Statistics (Col 7) */}
                <motion.div
                    initial={{ opacity: 0, x: dir === 'rtl' ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1"
                >
                    <span className="text-sm font-semibold tracking-wider text-gold-400 uppercase mb-3 block">
                        {isUrdu ? 'معاشرتی فلاح اور اثرات' : 'Social Welfare'}
                    </span>
                    <h2 className={`text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-white mb-6 leading-tight ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? 'معاشرے کی خدمت اور ہماری ذمہ داری' : 'Our Community Impact'}
                    </h2>
                    <p className={`text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-8 ${isUrdu ? 'font-urdu leading-[2.1] text-stone-300' : 'font-sans'}`}>
                        {isUrdu 
                            ? 'جامعہ احسن محض ایک تعلیمی ادارہ نہیں بلکہ معاشرے کی فکری، اخلاقی اور سماجی اصلاح کا ایک سرگرم مرکز ہے۔ ہم تعلیم کے ساتھ ساتھ عملی فلاح و بہبود پر یقین رکھتے ہیں۔'
                            : 'Jamia Ahsan functions as a central anchor for local community support. We believe that true scholarship translates into active benevolence and social service.'
                        }
                    </p>

                    <div className="space-y-6">
                        {points.map((pt, idx) => (
                            <div key={idx} className="flex gap-4 items-start">
                                <div className="p-1 rounded-full bg-sapphire-500/10 text-sapphire-500 shrink-0">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className={`text-base font-bold text-stone-950 dark:text-white mb-1 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                                        {pt.title}
                                    </h4>
                                    <p className={`text-stone-500 dark:text-stone-400 text-xs md:text-sm leading-relaxed ${isUrdu ? 'font-urdu leading-[1.8]' : 'font-sans'}`}>
                                        {pt.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Circular graphical metrics (Col 5) */}
                <motion.div
                    initial={{ opacity: 0, x: dir === 'rtl' ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="lg:col-span-5 flex items-center justify-center order-1 lg:order-2"
                >
                    <div className="relative w-80 h-80 rounded-full border border-stone-200 dark:border-stone-800 flex items-center justify-center p-8 bg-white dark:bg-stone-900 shadow-xl">
                        {/* Circular Rings representing metric limits */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Sapphire Track */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--primary-600, #174A87)" strokeWidth="8" className="opacity-10" />
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--primary-600, #174A87)" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="62.8" strokeLinecap="round" />
                            
                            {/* Gold Track */}
                            <circle cx="50" cy="50" r="32" fill="transparent" stroke="var(--accent-500, #C08B10)" strokeWidth="6" className="opacity-10" />
                            <circle cx="50" cy="50" r="32" fill="transparent" stroke="var(--accent-500, #C08B10)" strokeWidth="6" strokeDasharray="201" strokeDashoffset="50.2" strokeLinecap="round" />
                        </svg>

                        {/* Circular graphic labels overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                            <span className="text-3xl font-extrabold text-gold-400 tracking-tight">$1.2M+</span>
                            <span className={`text-stone-400 font-semibold tracking-wider uppercase text-[10px] mt-1 ${isUrdu ? 'font-arabic' : 'font-sans'}`}>
                                {isUrdu ? 'سالانہ امداد تقسیم' : 'Annual Welfare Disbursed'}
                            </span>
                            <span className="text-stone-500 text-[10px] mt-3 max-w-[150px] leading-tight">Zakat and Sadaqah funds allocated globally.</span>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
