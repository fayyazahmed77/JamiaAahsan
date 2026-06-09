import React from 'react';
import { Link } from '@inertiajs/react';
import { Volume2, Video, BookOpen, MessageSquare, ArrowUpRight } from 'lucide-react';

export default function CollectionSection() {
    const items = [
        {
            title: 'Audio Library',
            desc: 'Listen to weekly bayanaat, Friday sermons, and series of Tazkiyah & Aqeedah.',
            icon: <Volume2 size={24} />,
            path: '/media/audio',
            color: 'hsl(195, 85%, 45%)',
            bgColor: 'hsl(195, 85%, 96%)'
        },
        {
            title: 'Video Library',
            desc: 'Watch high-quality recording of sermons, short clips, and standard scholarly lectures.',
            icon: <Video size={24} />,
            path: '/media/video',
            color: 'hsl(215, 60%, 45%)',
            bgColor: 'hsl(215, 60%, 96%)'
        },
        {
            title: 'Digital Books',
            desc: 'Read and download PDF publications, fatwa manuals, and educational textbooks.',
            icon: <BookOpen size={24} />,
            path: '/downloads',
            color: 'hsl(43, 85%, 45%)',
            bgColor: 'hsl(43, 85%, 96%)'
        },
        {
            title: 'Fatwa Bank Q&A',
            desc: 'Submit your queries to our Dar-ul-Ifta and search thousands of verified fatwa records.',
            icon: <MessageSquare size={24} />,
            path: '/fatwa',
            color: 'hsl(210, 80%, 45%)',
            bgColor: 'hsl(210, 80%, 96%)'
        }
    ];

    return (
        <section style={{
            padding: '80px 24px',
            background: 'linear-gradient(180deg, var(--surface-1) 0%, var(--surface-2) 100%)',
            borderBottom: '1px solid var(--border)'
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <h3 style={{ 
                        fontSize: '1.75rem', 
                        fontWeight: 800, 
                        color: 'var(--text-primary)',
                        marginBottom: 12
                    }}>
                        Explore Our Collections
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
                        Access rich traditional resources curated across media, digital publications, and direct theological counseling.
                    </p>
                </div>

                {/* 4-Column Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: 32
                }}>
                    {items.map((item, index) => (
                        <Link 
                            key={index}
                            href={item.path}
                            style={{
                                background: 'var(--surface-1)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-xl)',
                                padding: '36px 24px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                gap: 20,
                                textDecoration: 'none',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: 'var(--shadow-sm)'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.borderColor = item.color;
                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.06)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'var(--border)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                            }}
                        >
                            {/* Circular Icon */}
                            <div style={{
                                width: 72,
                                height: 72,
                                borderRadius: '50%',
                                background: item.bgColor,
                                color: item.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'transform 0.3s'
                            }}
                            className="icon-container"
                            >
                                {item.icon}
                            </div>

                            {/* Title & Desc */}
                            <div>
                                <h4 style={{ 
                                    fontSize: '1.0625rem', 
                                    fontWeight: 800, 
                                    color: 'var(--text-primary)', 
                                    marginBottom: 8,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 6
                                }}>
                                    {item.title}
                                    <ArrowUpRight size={14} style={{ opacity: 0.5 }} />
                                </h4>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                                    {item.desc}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
