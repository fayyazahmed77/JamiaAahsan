import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import SEOHead from '@/Components/Public/SEOHead';
import { useTranslation } from '@/hooks/useTranslation';
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react';

interface ImageModel {
    id: number;
    title: string | null;
    description: string | null;
    uri: string;
    category?: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    images: {
        data: ImageModel[];
        current_page: number;
        last_page: number;
        links: PaginationLink[];
    };
    categories: string[];
    selectedCategory: string;
}

export default function GalleryIndex({ images, categories, selectedCategory }: Props) {
    const { locale } = useTranslation();
    const isUrdu = locale === 'ur';
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const handleCategoryChange = (category: string) => {
        router.get(route('public.gallery'), { category }, { preserveState: true });
    };

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
    };

    const navigateLightbox = (direction: 'prev' | 'next') => {
        if (lightboxIndex === null) return;
        let newIndex = direction === 'prev' ? lightboxIndex - 1 : lightboxIndex + 1;
        if (newIndex >= 0 && newIndex < images.data.length) {
            setLightboxIndex(newIndex);
        }
    };

    const getImageUrl = (uri: string) => {
        return uri.startsWith('http') ? uri : `/storage/media/${uri}`;
    };

    // Category button translations
    const getCategoryLabel = (cat: string) => {
        if (!isUrdu) return cat;
        const mapping: Record<string, string> = {
            'All': 'تمام تصاویر',
            'Annual Events': 'سالانہ تقریبات',
            'Classroom Activities': 'تدریسی سرگرمیاں',
            'Campus Life': 'جامعہ کی زندگی',
            'Hifz Program': 'حفظ قرآن پروگرام',
            'Graduations': 'تقسیم اسناد و دستار بندی',
            'Competitions': 'مسابقات و مقابلے',
            'Guest Visits': 'معزز مہمانوں کی آمد',
            'Other': 'متفرق'
        };
        return mapping[cat] || cat;
    };

    return (
        <>
            <SEOHead 
                title={isUrdu ? 'نگار خانہ (تصاویر)' : 'Photo Gallery'} 
                description="View active photos, campus events, and academic highlights from Jamia Arabia Ahsan Ul Uloom."
            />

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
                {/* Title Section */}
                <div style={{ marginBottom: 36, textAlign: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e6b3e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {isUrdu ? 'تصویری جھلکیاں' : 'Moments & Highlights'}
                    </span>
                    <h1 style={{ margin: '8px 0', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {isUrdu ? 'نگار خانہ (گیلری)' : 'Institutional Gallery'}
                    </h1>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                        {isUrdu 
                            ? 'جامعہ احسن کی سرگرمیوں، اہم واقعات اور کیمپس کی تصویری جھلکیاں۔' 
                            : 'Explore campus highlights, student achievements, and academic events at Jamia Ahsan.'
                        }
                    </p>
                </div>

                {/* Categories Tab Strip */}
                <div style={{
                    display: 'flex',
                    gap: 8,
                    overflowX: 'auto',
                    paddingBottom: 12,
                    marginBottom: 32,
                    justifyContent: 'flex-start',
                    borderBottom: '1px solid var(--border, rgba(255,255,255,0.06))',
                    scrollbarWidth: 'none'
                }} className="hide-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            style={{
                                padding: '10px 18px',
                                borderRadius: '100px',
                                fontSize: '0.85rem',
                                fontWeight: selectedCategory === cat ? 700 : 500,
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap',
                                background: selectedCategory === cat ? '#1e6b3e' : 'var(--surface-2, rgba(255,255,255,0.03))',
                                color: selectedCategory === cat ? 'white' : 'var(--text-secondary, rgba(255,255,255,0.7))',
                                boxShadow: selectedCategory === cat ? '0 4px 12px rgba(30,107,62,0.2)' : 'none'
                            }}
                        >
                            {getCategoryLabel(cat)}
                        </button>
                    ))}
                </div>

                {/* Images Masonry Grid */}
                {images.data.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', border: '1px dashed var(--border)', borderRadius: 16 }}>
                        <ImageIcon size={48} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px' }}>
                            {isUrdu ? 'کوئی تصویر دستیاب نہیں' : 'No Images Available'}
                        </h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                            {isUrdu 
                                ? 'اس زمرے میں فی الحال کوئی تصویر اپلوڈ نہیں کی گئی ہے۔' 
                                : 'There are currently no photos uploaded in this category.'
                            }
                        </p>
                    </div>
                ) : (
                    <>
                        <div style={{
                            columnCount: images.data.length > 2 ? 4 : images.data.length,
                            columnGap: '20px',
                            width: '100%',
                        }} className="gallery-masonry">
                            {images.data.map((img, idx) => (
                                <div
                                    key={img.id}
                                    onClick={() => openLightbox(idx)}
                                    style={{
                                        breakInside: 'avoid',
                                        marginBottom: '20px',
                                        background: 'var(--surface-2, #182232)',
                                        border: '1px solid var(--border, rgba(255,255,255,0.05))',
                                        borderRadius: 12,
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                                    }}
                                    className="gallery-item"
                                >
                                    <div style={{ overflow: 'hidden', position: 'relative' }}>
                                        <img 
                                            src={getImageUrl(img.uri)} 
                                            alt={img.title || ''} 
                                            style={{ width: '100%', display: 'block', height: 'auto', transition: 'transform 0.3s ease' }}
                                            className="zoom-img"
                                        />
                                        {img.category && (
                                            <span style={{
                                                position: 'absolute',
                                                top: 10,
                                                left: 10,
                                                background: 'rgba(30,107,62,0.85)',
                                                backdropFilter: 'blur(4px)',
                                                color: 'white',
                                                fontSize: '0.65rem',
                                                fontWeight: 700,
                                                padding: '2px 8px',
                                                borderRadius: 4,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                {getCategoryLabel(img.category)}
                                            </span>
                                        )}
                                    </div>
                                    {(img.title || img.description) && (
                                        <div style={{ padding: '14px 16px' }}>
                                            {img.title && (
                                                <h4 style={{ margin: '0 0 4px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                    {img.title}
                                                </h4>
                                            )}
                                            {img.description && (
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {img.description}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination Links */}
                        {images.last_page > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 40 }}>
                                {images.links.map((link, i) => {
                                    if (link.url === null) return null;
                                    const cleanLabel = link.label
                                        .replace('&laquo; Previous', '‹')
                                        .replace('Next &raquo;', '›');
                                    
                                    return (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: 8,
                                                fontSize: '0.85rem',
                                                fontWeight: link.active ? 700 : 500,
                                                textDecoration: 'none',
                                                background: link.active ? '#1e6b3e' : 'var(--surface-2, rgba(255,255,255,0.03))',
                                                color: link.active ? 'white' : 'var(--text-secondary, rgba(255,255,255,0.7))',
                                                border: '1px solid var(--border, rgba(255,255,255,0.05))',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {cleanLabel}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Custom Lightbox Backdrop & Modal */}
            {lightboxIndex !== null && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(5, 12, 22, 0.95)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px'
                }}>
                    {/* Close Button */}
                    <button 
                        onClick={closeLightbox}
                        style={{
                            position: 'absolute',
                            top: 24,
                            right: 24,
                            background: 'rgba(255,255,255,0.05)',
                            border: 'none',
                            color: 'white',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 102
                        }}
                    >
                        <X size={20} />
                    </button>

                    {/* Left Navigator */}
                    {lightboxIndex > 0 && (
                        <button 
                            onClick={() => navigateLightbox('prev')}
                            style={{
                                position: 'absolute',
                                left: 24,
                                background: 'rgba(255,255,255,0.05)',
                                border: 'none',
                                color: 'white',
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                zIndex: 101
                            }}
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}

                    {/* Main Image Frame */}
                    <div style={{
                        maxWidth: '85vw',
                        maxHeight: '70vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <img 
                            src={getImageUrl(images.data[lightboxIndex].uri)} 
                            alt={images.data[lightboxIndex].title || ''} 
                            style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 8, objectFit: 'contain', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                        />
                    </div>

                    {/* Description Details Card */}
                    <div style={{ marginTop: 20, textAlign: 'center', color: 'white', maxWidth: 600 }}>
                        {images.data[lightboxIndex].category && (
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-400, #f59e0b)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {getCategoryLabel(images.data[lightboxIndex].category!)}
                            </span>
                        )}
                        {images.data[lightboxIndex].title && (
                            <h3 style={{ margin: '6px 0 8px', fontSize: '1.25rem', fontWeight: 700 }}>
                                {images.data[lightboxIndex].title}
                            </h3>
                        )}
                        {images.data[lightboxIndex].description && (
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                                {images.data[lightboxIndex].description}
                            </p>
                        )}
                    </div>

                    {/* Right Navigator */}
                    {lightboxIndex < images.data.length - 1 && (
                        <button 
                            onClick={() => navigateLightbox('next')}
                            style={{
                                position: 'absolute',
                                right: 24,
                                background: 'rgba(255,255,255,0.05)',
                                border: 'none',
                                color: 'white',
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                zIndex: 101
                            }}
                        >
                            <ChevronRight size={24} />
                        </button>
                    )}
                </div>
            )}

            <style>{`
                .gallery-item:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.12) !important;
                    border-color: rgba(30,107,62,0.2) !important;
                }
                .gallery-item:hover .zoom-img {
                    transform: scale(1.03);
                }
                @media (max-width: 1024px) {
                    .gallery-masonry {
                        column-count: 3 !important;
                    }
                }
                @media (max-width: 768px) {
                    .gallery-masonry {
                        column-count: 2 !important;
                    }
                }
                @media (max-width: 480px) {
                    .gallery-masonry {
                        column-count: 1 !important;
                    }
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </>
    );
}

GalleryIndex.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
