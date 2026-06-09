import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';
import { Award, Users, BookOpenCheck, Volume2, Video, FileText } from 'lucide-react';

interface StatsProps {
    stats: {
        years_of_service: number;
        students_count: number;
        faculty_count: number;
        audio_count: number;
        video_count: number;
        fatwa_count: number;
    };
}

function AnimatedNumber({ value, duration = 1500 }: { value: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    useEffect(() => {
        if (inView) {
            let start = 0;
            const end = value;
            if (start === end) {
                setCount(end);
                return;
            }

            const totalMs = duration;
            // dynamic step speed based on size of number to keep rendering smooth
            const steps = Math.min(end, 60);
            const stepTime = totalMs / steps;
            const increment = Math.ceil(end / steps);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(start);
                }
            }, stepTime);

            return () => clearInterval(timer);
        }
    }, [inView, value, duration]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
}

export function CounterGrid({ stats }: StatsProps) {
    const { locale } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    const statItems = [
        {
            icon: Award,
            title: isUrdu ? 'خدمت کے سال' : 'Years of Service',
            value: stats.years_of_service,
            suffix: isUrdu ? ' سال+' : ' +',
            color: 'text-gold-400'
        },
        {
            icon: Users,
            title: isUrdu ? 'فارغ التحصیل اور موجودہ طلباء' : 'Students Educated',
            value: stats.students_count,
            suffix: ' +',
            color: 'text-sapphire-300'
        },
        {
            icon: BookOpenCheck,
            title: isUrdu ? 'علمی اساتذہ اور شیوخ' : 'Faculty Members',
            value: stats.faculty_count,
            suffix: '',
            color: 'text-gold-400 font-arabic'
        },
        {
            icon: Volume2,
            title: isUrdu ? 'آڈیو بیانات اور اسباق' : 'Audio Lectures',
            value: stats.audio_count,
            suffix: ' +',
            color: 'text-sapphire-300'
        },
        {
            icon: Video,
            title: isUrdu ? 'ویڈیو بیانات اور دروس' : 'Video Lectures',
            value: stats.video_count,
            suffix: ' +',
            color: 'text-gold-400'
        },
        {
            icon: FileText,
            title: isUrdu ? 'مستند اور تحریری فتاویٰ' : 'Authored Fatawa',
            value: stats.fatwa_count,
            suffix: ' +',
            color: 'text-sapphire-300'
        }
    ];

    return (
        <section className="py-20 px-6 bg-radial-[at_center_center] from-sapphire-900 to-sapphire-950 text-white relative overflow-hidden">
            {/* Islamic Star Lattice watermark decoration */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="star-pattern" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 50 0 L 100 50 L 50 100 L 0 50 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            <path d="M 50 10 L 90 50 L 50 90 L 10 50 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#star-pattern)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12">
                    {statItems.map((item, idx) => {
                        const IconComponent = item.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="flex flex-col items-center text-center group"
                            >
                                {/* Floating Icon */}
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gold-400 group-hover:scale-110 group-hover:bg-gold-400/10 group-hover:border-gold-400/20 transition-all duration-300">
                                    <IconComponent className="w-5 h-5" />
                                </div>

                                {/* Counter */}
                                <div className={`text-3xl md:text-4xl font-extrabold mb-2 tracking-tight ${item.color}`}>
                                    <AnimatedNumber value={item.value} />
                                    <span>{item.suffix}</span>
                                </div>

                                {/* Label */}
                                <p className={`text-stone-300 text-xs md:text-sm font-medium tracking-wide ${isUrdu ? 'font-urdu leading-[1.8]' : 'font-sans'}`}>
                                    {item.title}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
