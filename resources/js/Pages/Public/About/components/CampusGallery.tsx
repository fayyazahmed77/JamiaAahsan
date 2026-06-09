import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';
import { X, ZoomIn } from 'lucide-react';

interface ImageItem {
    id: number;
    title: string;
    titleUrdu: string;
    description: string;
    descriptionUrdu: string;
    aspectClass: string;
}

export function CampusGallery() {
    const { locale } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';
    const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

    const images: ImageItem[] = [
        {
            id: 1,
            title: 'Grand Mosque Minaret',
            titleUrdu: 'جامع مسجد کا مینار',
            description: 'The iconic minaret silhouette overlooking our primary campus complex.',
            descriptionUrdu: 'مرکزی کیمپس کا خوبصورت مینار اور دیدہ زیب تعمیرات۔',
            aspectClass: 'aspect-[3/4] md:row-span-2'
        },
        {
            id: 2,
            title: 'The Central Library',
            titleUrdu: 'مرکزی کتب خانہ',
            description: 'Housing over 10,000 theological manuscripts and modern digital academic databases.',
            descriptionUrdu: '۱۰ ہزار سے زائد روایتی قلمی نسخوں اور جدید آن لائن علمی ڈیٹا بیس پر مشتمل لائبریری۔',
            aspectClass: 'aspect-[4/3] md:col-span-2'
        },
        {
            id: 3,
            title: 'Study Circle (Halqa)',
            titleUrdu: 'حلقہ درس',
            description: 'Traditional circle layout where scholars debate classical commentaries of text.',
            descriptionUrdu: 'شیوخ کے حلقہ درس میں فقہ اور حدیث کی تدریسی بحث و مباحثہ کا منظر۔',
            aspectClass: 'aspect-[1/1]'
        },
        {
            id: 4,
            title: 'Digital Smart Classroom',
            titleUrdu: 'جدید سمارٹ کلاس روم',
            description: 'Hybrid classrooms integrated with webcams and screens for online streaming.',
            descriptionUrdu: 'آن لائن نشریات کے لیے جدید کیمروں اور ڈیجیٹل بورڈز سے لیس کلاس روم۔',
            aspectClass: 'aspect-[4/3]'
        }
    ];

    return (
        <section className="py-24 px-6 bg-stone-100 dark:bg-stone-900/40">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-sm font-semibold tracking-wider text-gold-400 uppercase mb-3 block">
                        {isUrdu ? 'کیمپس اور ماحول' : 'Campus Environments'}
                    </span>
                    <h2 className={`text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-white mb-4 ${isUrdu ? 'font-urdu' : 'font-sans'}`}>
                        {isUrdu ? 'ہمارا علمی ماحول' : 'Campus & Environment'}
                    </h2>
                    <p className={`text-stone-500 dark:text-stone-400 text-sm ${isUrdu ? 'font-urdu text-stone-300' : 'font-sans'}`}>
                        {isUrdu 
                            ? 'جامعہ احسن کا کیمپس روایتی اسلامی خطوط اور جدید تعلیمی سہولیات کا حسین امتزاج پیش کرتا ہے۔' 
                            : 'An aesthetic overview of the spaces where traditional lineage meets contemporary digital facilities.'
                        }
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
                    {images.map((img) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            onClick={() => setSelectedImage(img)}
                            className={`relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl cursor-pointer group bg-gradient-to-br from-sapphire-900 to-sapphire-950 ${img.aspectClass}`}
                        >
                            {/* Hover overlay effects */}
                            <div className="absolute inset-0 bg-black/60 opacity-20 group-hover:opacity-60 transition-opacity duration-300 z-10" />
                            
                            {/* Hover Scale Placeholder content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center group-hover:scale-105 transition-transform duration-500">
                                <ZoomIn className="w-10 h-10 text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-3" />
                                <h4 className="text-white font-bold text-lg">{isUrdu ? img.titleUrdu : img.title}</h4>
                                <p className="text-stone-300 text-xs mt-1 max-w-xs">{isUrdu ? img.descriptionUrdu : img.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Full-screen Lightbox Modal */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6"
                            onClick={() => setSelectedImage(null)}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-6 right-6 p-3 rounded-full bg-stone-900 text-white hover:bg-stone-800 transition-all border border-stone-800"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Center Panel Container */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-4xl w-full bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Media Box */}
                                <div className="h-[450px] bg-gradient-to-br from-sapphire-900 to-sapphire-950 flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-20 h-28 border border-dashed border-gold-400/30 rounded-t-full flex items-center justify-center mb-6">
                                        <span className="text-gold-400 font-arabic text-sm opacity-40">Jamia Arabia Ahsan</span>
                                    </div>
                                    <h3 className="text-gold-400 font-extrabold text-2xl mb-2">
                                        {isUrdu ? selectedImage.titleUrdu : selectedImage.title}
                                    </h3>
                                    <p className="text-stone-400 text-xs max-w-sm">Premium dynamic campus architecture imagery matches are loaded dynamically from the repository.</p>
                                </div>

                                {/* Details Panel */}
                                <div className="p-8 bg-stone-950 border-t border-stone-850">
                                    <h4 className="text-white font-bold text-lg mb-2">
                                        {isUrdu ? selectedImage.titleUrdu : selectedImage.title}
                                    </h4>
                                    <p className={`text-stone-400 text-sm leading-relaxed ${isUrdu ? 'font-urdu leading-[2.1] text-stone-300' : 'font-sans'}`}>
                                        {isUrdu ? selectedImage.descriptionUrdu : selectedImage.description}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
}
