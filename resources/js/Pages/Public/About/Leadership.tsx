import React from 'react';
import { usePage } from '@inertiajs/react';
import SEOHead from '@/Components/Public/SEOHead';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedData } from '@/types/inertia';
import type { Scholar } from './Index';
import { motion } from 'framer-motion';
import { Mail, MapPin } from 'lucide-react';

interface LeadershipProps {
    leadership: Scholar[];
}

export default function Leadership({ leadership }: LeadershipProps) {
    const { locale } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    return (
        <>
            <SEOHead 
                title={isUrdu ? 'انتظامیہ اور شیوخ' : 'Scholarly Leadership'} 
                description={isUrdu ? 'جامعہ احسن کے رہبر اور مفتیانِ کرام جو تدریسی و تنظیمی امور کو احسن طریقے سے چلا رہے ہیں۔' : 'Meet the executive council and senior Aalim scholars guiding the educational journey of Jamia Ahsan.'}
            />

            {/* Banner */}
            <div className="relative py-24 bg-gradient-to-br from-[#071B35] to-[#03101F] text-white overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 50 0 L 100 50 L 50 100 L 0 50 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </svg>
                </div>
                
                <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
                    <span className="text-sm font-semibold tracking-wider text-gold-400 uppercase mb-3 block">
                        {isUrdu ? 'رہنما اساتذہ' : 'Elite Scholars'}
                    </span>
                    <h1 className={`text-4xl md:text-5xl font-extrabold mb-6 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? 'علمی قیادت اور شیوخ' : 'Leadership & Scholars'}
                    </h1>
                    <p className={`text-stone-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${isUrdu ? 'font-urdu leading-[2.1]' : 'font-sans'}`}>
                        {isUrdu 
                            ? 'جامعہ احسن کے رہبر اور مفتیانِ کرام جو تدریسی و تنظیمی امور کو احسن طریقے سے چلا رہے ہیں۔' 
                            : 'Meet the executive council and senior Aalim scholars guiding the educational journey of Jamia Ahsan.'
                        }
                    </p>
                </div>
            </div>

            {/* Main Content List */}
            <section className="py-24 px-6 max-w-5xl mx-auto">
                <div className="space-y-16">
                    {leadership.map((scholar, idx) => (
                        <motion.div
                            key={scholar.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-[2rem] p-8 md:p-12 shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
                        >
                            {/* Visual Column (Col 4) */}
                            <div className="md:col-span-4 flex justify-center">
                                <div className="w-48 h-64 rounded-2xl overflow-hidden shadow-md bg-gradient-to-br from-[#0C2A50] to-stone-950 flex flex-col items-center justify-center p-6 text-center border-2 border-stone-200 dark:border-stone-800">
                                    <div className="w-14 h-14 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 mb-4">
                                        <span className="text-lg font-bold font-arabic">AH</span>
                                    </div>
                                    <h4 className="text-white text-sm font-bold">{scholar.name}</h4>
                                    <p className="text-stone-400 text-[10px] mt-1 uppercase tracking-widest">{isUrdu ? scholar.designation_urdu : scholar.designation}</p>
                                </div>
                            </div>

                            {/* Details Column (Col 8) */}
                            <div className="md:col-span-8 flex flex-col justify-center">
                                <span className="text-gold-400 font-semibold text-xs tracking-wider uppercase mb-2 block">
                                    {isUrdu ? scholar.designation_urdu : scholar.designation}
                                </span>
                                
                                <h2 className={`text-2xl md:text-3xl font-extrabold text-stone-950 dark:text-white mb-4 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                                    {isUrdu ? scholar.urdu_name : scholar.name}
                                </h2>

                                <p className={`text-stone-600 dark:text-stone-400 text-sm md:text-base leading-relaxed mb-6 ${isUrdu ? 'font-urdu leading-[2.1] text-stone-200' : 'font-sans'}`}>
                                    {isUrdu ? scholar.bio_urdu : scholar.bio}
                                </p>

                                <div className="flex flex-wrap gap-6 pt-6 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-sapphire-500" />
                                        <span>Jamia Ahsan, Karachi</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Mail className="w-4 h-4 text-sapphire-500" />
                                        <span>info@jamiaahsan.edu.pk</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </>
    );
}

Leadership.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
