import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

// ─── Sub-components defined OUTSIDE HeroSlider to keep stable identity ─────
// (Defining components inside another component causes React to unmount/remount
//  on every render, which triggers the "removeChild" crash in the reconciler.)

interface PatternProps { accentColor: string }

function ArabicPatternSVG({ accentColor }: PatternProps) {
    return (
        <svg
            style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                opacity: 0.07,
                pointerEvents: 'none',
                zIndex: 1
            }}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <pattern id={`ap-${accentColor.replace(/[^a-z0-9]/gi, '')}`} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                    {/* 8-pointed star */}
                    <polygon
                        points="40,5 47,28 70,28 52,43 59,66 40,52 21,66 28,43 10,28 33,28"
                        fill="none" stroke={accentColor} strokeWidth="0.8"
                    />
                    {/* Inner octagon */}
                    <polygon
                        points="40,18 50,25 54,36 50,47 40,54 30,47 26,36 30,25"
                        fill="none" stroke={accentColor} strokeWidth="0.5"
                    />
                    {/* Corner diamonds */}
                    <polygon points="0,0 8,0 0,8"   fill="none" stroke={accentColor} strokeWidth="0.5" />
                    <polygon points="80,0 72,0 80,8"  fill="none" stroke={accentColor} strokeWidth="0.5" />
                    <polygon points="0,80 8,80 0,72"  fill="none" stroke={accentColor} strokeWidth="0.5" />
                    <polygon points="80,80 72,80 80,72" fill="none" stroke={accentColor} strokeWidth="0.5" />
                    {/* Lattice connections */}
                    <line x1="0"  y1="40" x2="10" y2="28" stroke={accentColor} strokeWidth="0.4" />
                    <line x1="0"  y1="40" x2="10" y2="52" stroke={accentColor} strokeWidth="0.4" />
                    <line x1="80" y1="40" x2="70" y2="28" stroke={accentColor} strokeWidth="0.4" />
                    <line x1="80" y1="40" x2="70" y2="52" stroke={accentColor} strokeWidth="0.4" />
                    <line x1="40" y1="0"  x2="28" y2="10" stroke={accentColor} strokeWidth="0.4" />
                    <line x1="40" y1="0"  x2="52" y2="10" stroke={accentColor} strokeWidth="0.4" />
                    <line x1="40" y1="80" x2="28" y2="70" stroke={accentColor} strokeWidth="0.4" />
                    <line x1="40" y1="80" x2="52" y2="70" stroke={accentColor} strokeWidth="0.4" />
                    {/* Centre dot */}
                    <circle cx="40" cy="36" r="2" fill={accentColor} opacity="0.6" />
                </pattern>

                <pattern id={`alp-${accentColor.replace(/[^a-z0-9]/gi, '')}`} x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
                    <polygon
                        points="80,10 95,56 140,56 104,84 118,130 80,103 42,130 56,84 20,56 65,56"
                        fill="none" stroke={accentColor} strokeWidth="0.6"
                    />
                    <circle cx="80" cy="80" r="30" fill="none" stroke={accentColor} strokeWidth="0.4" />
                    <circle cx="80" cy="80" r="50" fill="none" stroke={accentColor} strokeWidth="0.3" strokeDasharray="4 8" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#ap-${accentColor.replace(/[^a-z0-9]/gi, '')})`} />
            <rect width="100%" height="100%" fill={`url(#alp-${accentColor.replace(/[^a-z0-9]/gi, '')})`} opacity="0.5" />
        </svg>
    );
}

function GlowOverlay({ accentColor }: PatternProps) {
    return (
        <div style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 2,
            background: `radial-gradient(ellipse 60% 60% at 15% 85%, ${accentColor}18 0%, transparent 60%),
                         radial-gradient(ellipse 50% 50% at 85% 20%, ${accentColor}12 0%, transparent 55%)`
        }} />
    );
}
// ────────────────────────────────────────────────────────────────────────────

export default function HeroSlider() {
    const { t, locale } = useTranslation();
    const [activeSlide, setActiveSlide] = useState(0);

    const slides = [
        {
            tag: locale === 'ur' ? 'داخلہ جات جاری ہیں • تعلیمی سال 2026' : 'ADMISSIONS OPEN • ACADEMIC YEAR 2026',
            title: locale === 'ur' ? 'درس نظامی کے داخلے جاری ہیں' : 'Admissions Open',
            subTitle: locale === 'ur' ? 'تمام مقامی اور بین الاقوامی درجات کے لیے رجسٹریشن فارم دستیاب ہے' : 'OPEN REGISTRATION FOR ALL LOCAL & INTERNATIONAL DEPARTMENTS',
            ctaText: t('admissions.apply_button'),
            ctaPath: '/admissions/apply',
            phone: '0334 3969964',
            bgImage: '/images/hero-bg-admissions.png',
            accentColor: 'hsl(38, 90%, 55%)'
        },
        {
            tag: locale === 'ur' ? 'روایت کی پاسداری، ذہنوں کی آبیاری' : 'PRESERVING TRADITION, EMPOWERING MINDS',
            title: locale === 'ur' ? 'جامعہ عربیہ احسن العلوم' : 'Jamia Arabia Ahsan Ul Uloom',
            subTitle: locale === 'ur' ? 'جدید علمی آن لائن پلیٹ فارمز کے لیے تیار کردہ روایتی علوم' : 'CLASSICAL SCIENCES ADAPTED FOR ADVANCED ONLINE LEARNING PLATFORMS',
            ctaText: locale === 'ur' ? 'میڈیا لائبریری دیکھیں' : 'Explore Media Library',
            ctaPath: '/media/video',
            phone: '0334 3969964',
            bgImage: '/images/hero-bg-tradition.png',
            accentColor: 'hsl(43, 85%, 52%)'
        },
        {
            tag: locale === 'ur' ? 'علماء سے پوچھیں • دارالافتاء' : 'ASK THE SCHOLARS • FATWA BANK',
            title: locale === 'ur' ? 'شرعی مسائل کے حل کے لیے دارالافتاء' : 'Fatwa & Juristic Solutions',
            subTitle: locale === 'ur' ? 'اپنے سوالات بھیجیں اور مفتیانِ کرام سے مستند شرعی جوابات حاصل کریں' : 'SUBMIT YOUR QUESTIONS & BROWSE AUTHENTIC JURISPRUDENCE ANSWERS FROM OUR MUFTIS',
            ctaText: locale === 'ur' ? 'دارالافتاء دیکھیں' : 'Visit Fatwa Bank',
            ctaPath: '/fatwa',
            phone: '0334 3969964',
            bgImage: '/images/hero-bg-fatwa.png',
            accentColor: 'hsl(38, 90%, 55%)'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setActiveSlide(prev => (prev + 1) % slides.length);
    const prevSlide = () => setActiveSlide(prev => (prev - 1 + slides.length) % slides.length);

    return (
        <section style={{
            position: 'relative',
           
            overflow: 'hidden',
            background: '#0a0f18',
            color: 'white'
        }} className="hero-section">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%', height: '100%',
                        background: '#0a0f18',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '0 24px',
                        opacity: activeSlide === index ? 1 : 0,
                        visibility: activeSlide === index ? 'visible' : 'hidden',
                        transition: 'opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: activeSlide === index ? 1 : 0
                    }}
                >
                    {/* Slide Background Image & Overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%', height: '100%',
                        zIndex: 0,
                        pointerEvents: 'none'
                    }}>
                        <img 
                            src={slide.bgImage} 
                            alt="" 
                            fetchPriority={index === 0 ? "high" : "low"}
                            loading={index === 0 ? "eager" : "lazy"}
                            style={{
                                width: '100%',
                                height: '100%',
                                opacity: 0.85
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: 0, left: 0,
                            width: '100%', height: '100%',
                            background: 'linear-gradient(to right, rgba(7, 27, 53, 0.9) 0%, rgba(7, 27, 53, 0.5) 50%, rgba(7, 27, 53, 0.9) 100%)'
                        }} />
                    </div>
                    {/* Arabic Geometric SVG Pattern Background */}
                    <ArabicPatternSVG accentColor={slide.accentColor} />

                    {/* Radial glow corners */}
                    <GlowOverlay accentColor={slide.accentColor} />

                    {/* Subtle dot grid */}
                    <div style={{
                        position: 'absolute',
                        width: '100%', height: '100%',
                        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 0)',
                        backgroundSize: '28px 28px',
                        top: 0, left: 0,
                        pointerEvents: 'none',
                        zIndex: 3
                    }} />

                    {/* Content */}
                    <div style={{ maxWidth: 900, zIndex: 10, position: 'relative' }}>
                        <div style={{
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            color: slide.accentColor,
                            marginBottom: 20,
                            textTransform: 'uppercase',
                            animation: activeSlide === index ? 'fadeInUp 0.6s ease both 0.1s' : 'none',
                            fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit'
                        }}>
                            {slide.tag}
                        </div>

                        <div style={{
                            marginBottom: 24,
                            animation: activeSlide === index ? 'fadeInUp 0.6s ease both 0.2s' : 'none'
                        }}>
                            <h2 style={{
                                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                                fontWeight: 900,
                                fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit',
                                lineHeight: 1.8,
                                background: `linear-gradient(to right, #ffffff, ${slide.accentColor}, #ffffff)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                display: 'inline-block',
                                padding: '10px 28px',
                                borderRadius: 14,
                                border: `1px solid ${slide.accentColor}30`,
                                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                                backdropFilter: 'blur(6px)',
                                boxShadow: `0 0 40px ${slide.accentColor}10`
                            }}>
                                {slide.title}
                            </h2>
                        </div>

                        <p style={{
                            fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            color: 'rgba(255, 255, 255, 0.85)',
                            maxWidth: 700,
                            margin: '0 auto 40px',
                            lineHeight: 1.6,
                            animation: activeSlide === index ? 'fadeInUp 0.6s ease both 0.3s' : 'none'
                        }}>
                            {slide.subTitle}
                        </p>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 16,
                            flexWrap: 'wrap',
                            animation: activeSlide === index ? 'fadeInUp 0.6s ease both 0.4s' : 'none'
                        }}>
                            <Link href={slide.ctaPath} className="btn btn-primary btn-lg" style={{ borderRadius: 100, boxShadow: `0 4px 24px ${slide.accentColor}40` }}>
                                {slide.ctaText}
                            </Link>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                background: 'rgba(0, 0, 0, 0.45)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                padding: '8px 20px',
                                borderRadius: 100,
                                backdropFilter: 'blur(8px)'
                            }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    background: slide.accentColor,
                                    color: 'black',
                                    padding: '4px 10px',
                                    borderRadius: 100,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em'
                                }}>
                                    For Details
                                </span>
                                <a href={`tel:${slide.phone}`} style={{
                                    fontSize: '0.9375rem',
                                    fontWeight: 700,
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6
                                }}>
                                    <Phone size={14} style={{ color: slide.accentColor }} />
                                    {slide.phone}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Prev Arrow */}
            <button
                onClick={prevSlide}
                aria-label="Previous slide"
                style={{
                    position: 'absolute', left: 20, top: '50%',
                    transform: 'translateY(-50%)',
                    width: 46, height: 46, borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'white', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer',
                    zIndex: 20, transition: 'all 0.25s', backdropFilter: 'blur(8px)'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-500)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
            >
                <ChevronLeft size={22} />
            </button>

            {/* Next Arrow */}
            <button
                onClick={nextSlide}
                aria-label="Next slide"
                style={{
                    position: 'absolute', right: 20, top: '50%',
                    transform: 'translateY(-50%)',
                    width: 46, height: 46, borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'white', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer',
                    zIndex: 20, transition: 'all 0.25s', backdropFilter: 'blur(8px)'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-500)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
            >
                <ChevronRight size={22} />
            </button>

            {/* Pagination Dots — centered */}
            <div style={{
                position: 'absolute', bottom: 28,
                left: '50%', transform: 'translateX(-50%)',
                display: 'flex', gap: 10, zIndex: 20, alignItems: 'center'
            }}>
                {slides.map((slide, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        style={{
                            width: activeSlide === idx ? 28 : 9,
                            height: 9,
                            borderRadius: 100,
                            background: activeSlide === idx ? slide.accentColor : 'rgba(255, 255, 255, 0.3)',
                            border: 'none', cursor: 'pointer',
                            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: activeSlide === idx ? `0 0 10px ${slide.accentColor}80` : 'none'
                        }}
                    />
                ))}
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
}
