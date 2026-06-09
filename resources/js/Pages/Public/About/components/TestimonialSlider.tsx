import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';
import { Quote, ChevronRight, ChevronLeft } from 'lucide-react';

interface Testimonial {
    id: number;
    quote: string;
    quoteUrdu: string;
    author: string;
    authorUrdu: string;
    role: string;
    roleUrdu: string;
    location: string;
    locationUrdu: string;
}

export function TestimonialSlider() {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';
    const [currentIndex, setCurrentIndex] = useState(0);

    const reviews: Testimonial[] = [
        {
            id: 1,
            quote: "Attending Jamia Ahsan allowed me to keep my corporate job while pursuing structured Aalimiyyah classes online. The depth of instruction, traditional validations, and contemporary discussions is exceptional.",
            quoteUrdu: "جامعہ احسن نے مجھے اپنے ملازمت کے ساتھ ساتھ آن لائن منظم درسِ نظامی پڑھنے کا موقع فراہم کیا۔ تدریس کی گہرائی، روایتی سند اور جدید مسائل پر بحث واقعی غیر معمولی ہے۔",
            author: "Ahmad Malik",
            authorUrdu: "احمد ملک",
            role: "Corporate Finance Lead & Alim Student",
            roleUrdu: "فنانس منیجر اور طالب علمِ عالم کورس",
            location: "Toronto, Canada",
            locationUrdu: "ٹورنٹو، کینیڈا"
        },
        {
            id: 2,
            quote: "The scholars at Jamia Ahsan are deeply grounded in traditional text preservation. Learning Hanafi legal theory (Usul al-Fiqh) from authorized teachers gave me a solid foundation in understanding script sources.",
            quoteUrdu: "جامعہ احسن کے اساتذہ اور شیوخ روایتی علوم پر غیر معمولی دسترس رکھتے ہیں۔ مستند شیوخ کی زیرِ نگرانی اصولِ فقہ پڑھنے سے مجھے شریعت کے مصادر کو سمجھنے کا مضبوط فہم ملا۔",
            author: "Fatima Patel",
            authorUrdu: "فاطمہ پٹیل",
            role: "Islamic Studies Instructor",
            roleUrdu: "معلمہ اسلامی علوم",
            location: "London, United Kingdom",
            locationUrdu: "لندن، برطانیہ"
        },
        {
            id: 3,
            quote: "My children enrolled in the Hifz and Tajweed online courses. The patience of the teachers, coupled with their mastery of pronunciation, transformed their recitation. It is a world-class program.",
            quoteUrdu: "میرے بچوں نے حفظ و تجوید کے آن لائن کورسز میں داخلہ لیا۔ اساتذہ کا صبر و تحمل اور خوبصورت لہجے میں قرائت سکھانے کا انداز لاجواب ہے۔ یہ ایک بہترین اور عالمی معیار کا پروگرام ہے۔",
            author: "Muhammad Zayd",
            authorUrdu: "محمد زید",
            role: "Parent of Students",
            roleUrdu: "سرپرستِ طلباء",
            location: "Chicago, United States",
            locationUrdu: "شکاگو، امریکہ"
        }
    ];

    const nextReview = () => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const prevReview = () => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    return (
        <section className="py-24 px-6 bg-stone-100 dark:bg-stone-900/40 relative overflow-hidden">
            {/* Glowing gradient backdrops */}
            <div className="absolute top-1/2 left-10 w-[20rem] h-[20rem] bg-sapphire-500/5 blur-[90px] pointer-events-none rounded-full" />
            <div className="absolute top-1/2 right-10 w-[20rem] h-[20rem] bg-gold-400/5 blur-[90px] pointer-events-none rounded-full" />

            <div className="max-w-4xl mx-auto relative z-10">
                
                {/* Quote Icon */}
                <div className="flex justify-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-gold-400/10 flex items-center justify-center text-gold-400">
                        <Quote className="w-8 h-8" />
                    </div>
                </div>

                {/* Animated Slider content */}
                <div className="min-h-[220px] text-center mb-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.4 }}
                        >
                            <p className={`text-xl md:text-2xl font-medium text-stone-900 dark:text-stone-100 leading-relaxed max-w-3xl mx-auto mb-8 italic ${isUrdu ? 'font-urdu leading-[2.1] text-stone-200' : 'font-sans'}`}>
                                "{isUrdu ? reviews[currentIndex].quoteUrdu : reviews[currentIndex].quote}"
                            </p>
                            
                            <h4 className={`text-base font-bold text-stone-950 dark:text-white ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                                {isUrdu ? reviews[currentIndex].authorUrdu : reviews[currentIndex].author}
                            </h4>
                            
                            <p className="text-stone-500 dark:text-stone-400 text-xs mt-1">
                                {isUrdu ? reviews[currentIndex].roleUrdu : reviews[currentIndex].role} — {isUrdu ? reviews[currentIndex].locationUrdu : reviews[currentIndex].location}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation controls */}
                <div className="flex justify-center items-center gap-6">
                    <button
                        onClick={prevReview}
                        className="p-3 rounded-full border border-stone-200 dark:border-stone-850 text-stone-600 dark:text-stone-400 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-850 hover:shadow-md transition-all duration-200"
                    >
                        {dir === 'rtl' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                    
                    <div className="flex gap-2">
                        {reviews.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-gold-400 w-6' : 'bg-stone-300 dark:bg-stone-700'}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={nextReview}
                        className="p-3 rounded-full border border-stone-200 dark:border-stone-850 text-stone-600 dark:text-stone-400 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-850 hover:shadow-md transition-all duration-200"
                    >
                        {dir === 'rtl' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                </div>

            </div>
        </section>
    );
}
