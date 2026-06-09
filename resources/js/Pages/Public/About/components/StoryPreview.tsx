import React from 'react';
import { motion } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';
import { ArrowRight } from 'lucide-react';

export function StoryPreview() {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                {/* Images Layer (Col 5) */}
                <motion.div
                    initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="lg:col-span-5 relative flex items-center justify-center min-h-[380px]"
                >
                    {/* Background Islamic Arch Silhouette framing the photo */}
                    <div className="absolute inset-0 bg-sapphire-900 rounded-[2rem] transform -rotate-3 scale-[0.97]" />
                    <div className="absolute inset-0 border border-gold-400/20 rounded-[2rem] transform rotate-2 pointer-events-none" />

                    {/* Actual Image Block */}
                    <div className="relative z-10 w-full h-[400px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-stone-900 bg-stone-950">
                        {/* Placeholder architecture using styled CSS pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-sapphire-900 to-sapphire-950 flex flex-col items-center justify-center p-6 text-center">
                            {/* Decorative Arch */}
                            <div className="w-24 h-36 border-2 border-dashed border-gold-400/30 rounded-t-full flex items-center justify-center mb-6">
                                <span className="text-gold-400 font-arabic text-sm opacity-55">1419 AH</span>
                            </div>
                            <h4 className="text-stone-100 font-semibold mb-2">Jamia Ahsan Campus</h4>
                            <p className="text-stone-400 text-xs max-w-xs">Dynamic high-resolution architectural campus and historical photographs display here.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Content Block (Col 7) */}
                <motion.div
                    initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="lg:col-span-7 flex flex-col justify-center"
                >
                    <span className="text-sm font-semibold tracking-wider text-gold-400 uppercase mb-3 block">
                        {isUrdu ? 'ہماری تاریخ اور آغاز' : 'Our Legacy & Origin'}
                    </span>
                    <h2 className={`text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-white mb-6 leading-tight ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? 'تاسیس: ۱۴۱۹ھ (۱۹۹۸ء)' : 'Established in 1419 AH (1998 CE)'}
                    </h2>
                    
                    <div className={`text-stone-600 dark:text-stone-300 space-y-4 mb-8 leading-relaxed ${isUrdu ? 'font-urdu leading-[2.1] text-stone-200' : 'font-sans'}`}>
                        <p>
                            {isUrdu 
                                ? 'جامعہ احسن کا سفر پاکستان میں روایتی اور مستند اسلامی علوم کے ایک اعلیٰ مرکز کے قیام کے خواب کے ساتھ شروع ہوا۔ ہم نے دینی ورثے، قدیم زبانوں اور فقہی اصولوں کے تحفظ کو اپنا نصب العین بنایا۔'
                                : 'Jamia Ahsan was established with a singular vision: to create a premium center for classical theological studies in Pakistan. By preserving classical texts, logic studies, and structural verification methods of traditional universities, we strive to build a community of authentic scholars.'
                            }
                        </p>
                        <p>
                            {isUrdu
                                ? 'ایک چھوٹی سی مسجد سے شروع ہونے والا یہ تعلیمی سفر آج ایک عالمی نیٹ ورک کی شکل اختیار کر چکا ہے جس میں ہزاروں طالب علم آن لائن اور آف لائن درسِ نظامی اور دیگر علوم سے مستفید ہو رہے ہیں۔'
                                : 'What began in a small prayer community hall has now expanded into a global network. Today, hundreds of on-campus residents and thousands of international digital learners enroll in our extensive Dars-e-Nizami, Hifz, and theological programs.'
                            }
                        </p>
                    </div>

                    <div className="flex">
                        <a
                            href="/about/history"
                            className="inline-flex items-center gap-2 font-semibold text-gold-400 hover:text-gold-300 group transition-all"
                        >
                            <span>{isUrdu ? 'ہماری مکمل تاریخ پڑھیں' : 'Read Our Full History'}</span>
                            <ArrowRight className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
