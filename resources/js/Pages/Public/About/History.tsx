import React from 'react';
import { usePage } from '@inertiajs/react';
import SEOHead from '@/Components/Public/SEOHead';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedData } from '@/types/inertia';
import { motion } from 'framer-motion';
import { Award, Compass, Heart } from 'lucide-react';

export default function History() {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    const principles = [
        {
            icon: Award,
            title: isUrdu ? 'قدیم علوم کا تحفظ' : 'Preservation of Lineage',
            desc: isUrdu
                ? 'علمِ دین کے روایتی سلسلوں اور تحریری ورثے کا تحفظ کرنا۔'
                : 'Safeguarding the traditional narrative and verified chains of classical Islamic learning.'
        },
        {
            icon: Compass,
            title: isUrdu ? 'علمی گہرائی' : 'Intellectual Depth',
            desc: isUrdu
                ? 'طلباء میں کلاسیکی زبانوں، منطق، اور متن کی تفہیم کی گہری مہارت پیدا کرنا۔'
                : 'Instilling logic, Arabic language structure, and text validation in future jurists.'
        },
        {
            icon: Heart,
            title: isUrdu ? 'دورِ حاضر میں رسائی' : 'Modern Accessibility',
            desc: isUrdu
                ? 'جدید ترین ٹیکنالوجی اور ڈیجیٹل ذرائع کا استعمال کر کے علم کو عام کرنا۔'
                : 'Utilizing modern web applications and cloud structures to make authentic archives globally reachable.'
        }
    ];

    return (
        <>
            <SEOHead 
                title={isUrdu ? 'ہمارا علمی ورثہ اور تاریخ' : 'Our Legacy & History'} 
                description={isUrdu ? '۱۹۹۸ سے شروع ہونے والے اس تعلیمی سفر کی تفصیلات جو روایتی دینی اسناد کے فروغ کا باعث بنی۔' : 'Tracing the historical journey of Jamia Ahsan, preserving authentic lineages since 1998.'}
            />
            
            {/* Top Banner Header */}
            <div className="relative py-24 bg-gradient-to-br from-[#071B35] to-[#03101F] text-white overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 50 0 L 100 50 L 50 100 L 0 50 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </svg>
                </div>
                
                <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
                    <span className="text-sm font-semibold tracking-wider text-gold-400 uppercase mb-3 block">
                        {isUrdu ? 'ہمارا ورثہ' : 'Our Roots'}
                    </span>
                    <h1 className={`text-4xl md:text-5xl font-extrabold mb-6 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? 'تاریخ اور علمی ورثہ' : 'Heritage & Legacy'}
                    </h1>
                    <p className={`text-stone-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${isUrdu ? 'font-urdu leading-[2.1]' : 'font-sans'}`}>
                        {isUrdu 
                            ? '۱۹۹۸ سے شروع ہونے والے اس تعلیمی سفر کی تفصیلات جو روایتی دینی اسناد کے فروغ کا باعث بنی۔' 
                            : 'Tracing the historical journey of Jamia Ahsan, preserving authentic lineages since 1998.'
                        }
                    </p>
                </div>
            </div>

            {/* Core Content */}
            <section className="py-24 px-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={`text-stone-700 dark:text-stone-300 space-y-8 mb-16 text-base md:text-lg leading-relaxed ${isUrdu ? 'font-urdu leading-[2.2] text-stone-200' : 'font-sans'}`}
                >
                    <p>
                        {isUrdu
                            ? 'جامعہ احسن کا قیام پاکستان میں روایتی اور مستند اسلامی علوم کے ایک اعلیٰ معیار کے مرکز کے قیام کے خواب کے ساتھ شروع ہوا۔ ہمارا مقصد ایسی درسگاہ قائم کرنا تھا جہاں علومِ اسلامیہ کے قدیم سلسلوں کا تحفظ کیا جا سکے۔'
                            : 'Jamia Ahsan was founded with the vision of establishing a standard, high-quality center for traditional theological study in Pakistan. By preserving the classical texts, languages, and scholarship methods of classical Islamic universities, we strive to build a community of authentic scholars.'
                        }
                    </p>
                    <p>
                        {isUrdu
                            ? 'جامعہ نے ابتدائی طور پر صرف ۲۵ طلباء سے کام شروع کیا لیکن خلوص، محنت اور معیاری تدریس کی بدولت یہ ادارہ دیکھتے ہی دیکھتے ایک عظیم الشان تعلیمی مرکز بن گیا۔ آج یہاں سینکڑوں رہائشی طلباء کے علاوہ ہزاروں بین الاقوامی طلباء آن لائن تعلیم حاصل کر رہے ہیں۔'
                            : 'Over the past decades, Jamia Ahsan has grown from a humble local seminary into a major educational center. Hundreds of students from across Pakistan and international locations enroll in our programs, including Dars-e-Nizami, Hifz, and online short courses.'
                        }
                    </p>
                </motion.div>

                {/* Core Principles */}
                <div className="border-t border-stone-200 dark:border-stone-850 pt-16">
                    <h3 className={`text-2xl font-bold text-stone-950 dark:text-white mb-10 text-center ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? 'ہمارے بنیادی اصول' : 'Our Guiding Principles'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {principles.map((pr, idx) => {
                            const IconComp = pr.icon;
                            return (
                                <div key={idx} className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 rounded-2xl flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-xl bg-gold-400/10 text-gold-400 flex items-center justify-center mb-6">
                                        <IconComp className="w-6 h-6" />
                                    </div>
                                    <h4 className={`text-lg font-bold text-stone-950 dark:text-white mb-3 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                                        {pr.title}
                                    </h4>
                                    <p className={`text-stone-600 dark:text-stone-400 text-xs md:text-sm leading-relaxed ${isUrdu ? 'font-urdu leading-[1.8]' : 'font-sans'}`}>
                                        {pr.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}

History.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
