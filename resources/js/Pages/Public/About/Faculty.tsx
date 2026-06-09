import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import SEOHead from '@/Components/Public/SEOHead';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedData } from '@/types/inertia';
import type { Scholar } from './Index';
import { motion } from 'framer-motion';
import { Search, GraduationCap } from 'lucide-react';

interface PaginatedFaculty {
    data: Scholar[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface FacultyProps {
    faculty: PaginatedFaculty;
}

export default function Faculty({ faculty }: FacultyProps) {
    const { locale } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';
    const [searchQuery, setSearchQuery] = useState('');

    // Local Search Filter
    const filteredFaculty = faculty.data.filter(member => {
        const query = searchQuery.toLowerCase();
        return (
            member.name.toLowerCase().includes(query) ||
            member.urdu_name.includes(query) ||
            (member.designation && member.designation.toLowerCase().includes(query)) ||
            (member.designation_urdu && member.designation_urdu.includes(query))
        );
    });

    return (
        <>
            <SEOHead 
                title={isUrdu ? 'اساتذہ ڈائریکٹری' : 'Academic Faculty'} 
                description={isUrdu 
                    ? 'جامعہ احسن کے قابلِ فخر اساتذہ اور معلمین کی ڈائریکٹری۔ شعبہ درسِ نظامی، حفظ و ناظرہ کے ممتاز علماء۔' 
                    : 'Browse the directory of academic faculty and instructors at Jamia Arabia Ahsan Ul Uloom, Karachi.'
                }
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
                        {isUrdu ? 'دینی مدرسین' : 'Academic Core'}
                    </span>
                    <h1 className={`text-4xl md:text-5xl font-extrabold mb-6 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? 'اساتذہ اور معلمین' : 'Faculty & Instructors'}
                    </h1>
                    <p className={`text-stone-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${isUrdu ? 'font-urdu leading-[2.1]' : 'font-sans'}`}>
                        {isUrdu 
                            ? 'جامعہ احسن کے قابلِ فخر مدرسین جو روزانہ طلباء کے فکری اور دینی ارتقاء کے لیے کوشاں ہیں۔' 
                            : 'Browse the directory of instructors conducting Dars-e-Nizami, Hifz, Tajweed, and research classes.'
                        }
                    </p>
                </div>
            </div>

            {/* Directory Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                
                {/* Search Bar filter */}
                <div className="max-w-md mx-auto mb-16 relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-stone-400">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder={isUrdu ? 'نام یا شعبہ سے تلاش کریں...' : 'Search faculty by name or role...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-3.5 rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-400/20 focus:border-gold-400 transition-all shadow-sm"
                    />
                </div>

                {/* Faculty Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
                    {filteredFaculty.map((member, idx) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: (idx % 4) * 0.05 }}
                            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 text-center flex flex-col items-center hover:shadow-lg transition-all duration-300 group"
                        >
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-full bg-sapphire-950/40 border border-gold-400/20 flex items-center justify-center text-gold-400 mb-6 group-hover:scale-105 transition-transform duration-300">
                                <GraduationCap className="w-8 h-8 opacity-45" />
                            </div>

                            <h3 className={`text-lg font-bold text-stone-950 dark:text-white mb-2 group-hover:text-gold-400 transition-colors ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                                {isUrdu ? member.urdu_name : member.name}
                            </h3>

                            <p className="text-stone-500 dark:text-stone-400 text-xs font-semibold uppercase tracking-wider mb-4">
                                {isUrdu ? member.designation_urdu : member.designation}
                            </p>

                            <p className={`text-stone-600 dark:text-stone-400 text-xs leading-relaxed ${isUrdu ? 'font-urdu leading-[1.8] text-stone-300' : 'font-sans'}`}>
                                {isUrdu ? member.bio_urdu : member.bio}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination links */}
                {faculty.links.length > 3 && searchQuery === '' && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        {faculty.links.map((link, idx) => {
                            if (!link.url) return null;
                            return (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all ${link.active ? 'bg-gold-400 border-gold-400 text-stone-950 font-bold' : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </div>
                )}

            </section>
        </>
    );
}

Faculty.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
