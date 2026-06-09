import React from 'react';
import { motion } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';
import type { Scholar } from '../Index';
import { ArrowRight, Star } from 'lucide-react';

interface FacultyPreviewProps {
    faculty_preview: Scholar[];
}

export function FacultyPreview({ faculty_preview }: FacultyPreviewProps) {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Content Panel (Col 5) */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                    <span className="text-sm font-semibold tracking-wider text-gold-400 uppercase mb-3 block">
                        {isUrdu ? 'اساتذہ اور شیوخِ حدیث' : 'Academic Core'}
                    </span>
                    <h2 className={`text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-white mb-6 leading-tight ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? 'ہمارا مستند تعلیمی عملہ' : 'Our Faculty & Scholars'}
                    </h2>
                    
                    <p className={`text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-8 ${isUrdu ? 'font-urdu leading-[2.1] text-stone-200' : 'font-sans'}`}>
                        {isUrdu 
                            ? 'جامعہ احسن میں تدریس کے فرائض انجام دینے والے شیوخ اور مفتیانِ کرام نہ صرف روایتی دینی اسناد کے حامل ہیں، بلکہ جدید فقہی چیلنجز پر بھی گہری دسترس رکھتے ہیں۔'
                            : 'The teaching staff at Jamia Ahsan comprises licensed Muftis and traditional lecturers holding continuous scholarly chains (Sanad) of narration, actively translating theory into practical community service.'
                        }
                    </p>

                    <div className="flex">
                        <a
                            href="/about/faculty"
                            className="inline-flex items-center gap-2 font-semibold text-gold-400 hover:text-gold-500 group transition-all"
                        >
                            <span>{isUrdu ? 'تمام اساتذہ کی ڈائریکٹری' : 'Explore Faculty Directory'}</span>
                            <ArrowRight className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                        </a>
                    </div>
                </div>

                {/* Faculty Avatars Grid (Col 7) */}
                <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {faculty_preview.map((scholar, idx) => (
                        <motion.div
                            key={scholar.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.08 }}
                            className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl text-center flex flex-col items-center hover:bg-white dark:hover:bg-stone-900 hover:shadow-md transition-all duration-300 group"
                        >
                            {/* Avatar placeholder with initials */}
                            <div className="w-16 h-16 rounded-full bg-sapphire-950 border border-gold-400/20 flex items-center justify-center text-gold-400 mb-4 group-hover:scale-105 transition-transform duration-300">
                                <Star className="w-5 h-5 opacity-40 absolute" />
                                <span className="text-base font-bold font-arabic z-10">
                                    {scholar.name.split(' ').slice(-1)[0][0]}
                                </span>
                            </div>

                            <h4 className={`text-base font-bold text-stone-950 dark:text-white mb-1 group-hover:text-gold-400 transition-colors ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                                {isUrdu ? scholar.urdu_name : scholar.name}
                            </h4>
                            
                            <p className="text-stone-500 dark:text-stone-400 text-xs font-medium">
                                {isUrdu ? scholar.designation_urdu : scholar.designation}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
