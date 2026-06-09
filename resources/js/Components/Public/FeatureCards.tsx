import React from 'react';
import { Link } from '@inertiajs/react';
import { BookOpen, Calendar, HelpCircle, ArrowRight } from 'lucide-react';

export default function FeatureCards() {
    const cards = [
        {
            title: 'Dars-e-Tafseer',
            urduTitle: 'درس تفسیر',
            desc: 'Deep study of the Holy Quran, its translation, historical contexts, and practical contemporary lessons for daily life.',
            icon: <BookOpen size={24} style={{ color: 'var(--accent-500)' }} />,
            path: '/education',
            imageText: '📖 Quranic Tafseer Series',
            bgColor: 'linear-gradient(135deg, hsl(215, 65%, 26%), hsl(215, 65%, 16%))'
        },
        {
            title: 'Shab-e-Juma',
            urduTitle: 'شب جمعہ',
            desc: 'Weekly spiritual gatherings, lecture of tazkiyah, and collective supplications to build a direct connection with Allah.',
            icon: <Calendar size={24} style={{ color: 'var(--primary-300)' }} />,
            path: '/media/audio',
            imageText: '🕌 Weekly Spiritual Gathering',
            bgColor: 'linear-gradient(135deg, hsl(215, 60%, 25%), hsl(215, 60%, 15%))'
        },
        {
            title: 'Khutbah Juma',
            urduTitle: 'خطاب جمعہ',
            desc: 'Authentic Friday sermons explaining modern challenges, jurisprudence rules, and civic responsibilities under Islamic teachings.',
            icon: <HelpCircle size={24} style={{ color: 'var(--accent-500)' }} />,
            path: '/media/video',
            imageText: '🎙️ Congregational Friday Sermons',
            bgColor: 'linear-gradient(135deg, hsl(38, 85%, 25%), hsl(38, 85%, 15%))'
        }
    ];

    return (
        <section style={{
            padding: '80px 24px',
            background: 'var(--bg)',
            borderBottom: '1px solid var(--border)'
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: 32 
                }}>
                    {cards.map((card, index) => (
                        <div 
                            key={index}
                            style={{
                                background: 'var(--surface-1)',
                                borderRadius: 'var(--radius-xl)',
                                border: '1px solid var(--border)',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-sm)',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.borderColor = 'var(--primary-400)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'var(--border)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            }}
                        >
                            {/* Card Top visual image placeholder */}
                            <div style={{
                                height: 160,
                                background: card.bgColor,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                padding: '20px 24px',
                                color: 'white',
                                position: 'relative'
                            }}>
                                {/* Grid backdrop ornament */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    opacity: 0.1,
                                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                    backgroundSize: '16px 16px',
                                    pointerEvents: 'none'
                                }} />

                                {/* Upper row: icon and Urdu title */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 }}>
                                    <div style={{
                                        background: 'rgba(255, 255, 255, 0.15)',
                                        padding: 8,
                                        borderRadius: 'var(--radius-sm)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backdropFilter: 'blur(4px)'
                                    }}>
                                        {card.icon}
                                    </div>
                                    <span style={{ 
                                        fontFamily: "'Noto Nastaliq Urdu', serif", 
                                        fontSize: '1.25rem', 
                                        fontWeight: 700,
                                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                        color: 'var(--accent-400)'
                                    }}>
                                        {card.urduTitle}
                                    </span>
                                </div>

                                {/* Label description of visual */}
                                <div style={{ zIndex: 5, fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0.9 }}>
                                    {card.imageText}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: '28px 24px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                                    {card.title}
                                </h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
                                    {card.desc}
                                </p>

                                {/* Light-blue actions details button */}
                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 8 }}>
                                    <Link 
                                        href={card.path} 
                                        className="btn btn-accent w-full"
                                        style={{
                                            borderRadius: 100,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 8
                                        }}
                                    >
                                        Study Details
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
