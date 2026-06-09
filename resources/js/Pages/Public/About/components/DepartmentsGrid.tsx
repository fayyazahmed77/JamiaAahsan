import React from 'react';
import { motion, Variants } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';
import type { Department } from '../Index';
import { BookOpen, Mic, Volume2, FileText, Search, Video } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    BookOpen,
    Mic,
    Volume2,
    FileText,
    Search,
    Video,
};

interface DepartmentsProps {
    departments: Department[];
}

export function DepartmentsGrid({ departments }: DepartmentsProps) {
    const { locale } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    // Helper to dynamically render Lucide icon by name
    const renderIcon = (iconName: string) => {
        const IconComponent = iconMap[iconName];
        if (IconComponent) {
            return <IconComponent className="w-6 h-6" />;
        }
        return <BookOpen className="w-6 h-6" />;
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100, damping: 20 }
        }
    };

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-sm font-semibold tracking-wider text-gold-400 uppercase mb-3 block">
                    {isUrdu ? 'تعلیمی و تحقیقی شعبہ جات' : 'Academic Organization'}
                </span>
                <h2 className={`text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-white mb-4 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                    {isUrdu ? 'جامعہ احسن کے ذیلی شعبہ جات' : 'Our Departments'}
                </h2>
                <p className={`text-stone-500 dark:text-stone-400 text-sm ${isUrdu ? 'font-urdu text-stone-300' : 'font-sans'}`}>
                    {isUrdu 
                        ? 'مختلف شعبوں میں اسلامی تعلیمات اور جدید ابلاغ کی مہارتوں کی باقاعدہ تدریس۔' 
                        : 'Structured divisions ensuring complete coverage of theological preservation, research, and outreach.'
                    }
                </p>
            </div>

            {/* Department Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {departments.map((dept) => (
                    <motion.div
                        key={dept.id}
                        variants={cardVariants}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 relative group overflow-hidden"
                    >
                        {/* Dynamic Border Glow */}
                        <div className="absolute inset-0 border border-transparent group-hover:border-gold-400/20 rounded-2xl pointer-events-none transition-colors duration-300" />
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sapphire-500 to-gold-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                        {/* Icon Box */}
                        <div className="w-12 h-12 rounded-xl bg-gold-400/10 dark:bg-gold-400/5 text-gold-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 group-hover:bg-gold-400 group-hover:text-stone-950">
                            {renderIcon(dept.icon_name)}
                        </div>

                        {/* Heading */}
                        <h3 className={`text-xl font-bold text-stone-950 dark:text-white mb-3 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                            {isUrdu ? dept.name_urdu : dept.name}
                        </h3>

                        {/* Description */}
                        <p className={`text-stone-600 dark:text-stone-400 text-sm leading-relaxed ${isUrdu ? 'font-urdu leading-[2.1]' : 'font-sans'}`}>
                            {isUrdu ? dept.description_urdu : dept.description}
                        </p>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
