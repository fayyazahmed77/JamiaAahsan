import React from 'react';
import { Link } from '@inertiajs/react';

interface Article {
    id: number;
    title: string;
    description: string;
    date: string;
    image: string;
    slug: string;
}

export default function ArticlesBlog() {
    const articles: Article[] = [
        {
            id: 1,
            title: 'Ethics of the World and the Hereafter',
            description: 'Ethics of the World and the Hereafter According to Hazrat Abdullah...',
            date: 'August 21, 2024',
            image: '/images/blog/ethics_world.png',
            slug: 'ethics-of-the-world-and-the-hereafter'
        },
        {
            id: 2,
            title: 'The importance of Teaching the Holy Quran to children',
            description: 'The importance of Teaching the Holy Quran to children The person...',
            date: 'July 26, 2024',
            image: '/images/blog/teaching_quran.png',
            slug: 'importance-of-teaching-holy-quran-to-children'
        },
        {
            id: 3,
            title: 'SIGNIFICANCE OF THE MONTH OF MUHARRAM',
            description: 'Significance of the month of Muharram Islam is a comprehensive religion...',
            date: 'July 18, 2024',
            image: '/images/blog/muharram_month.png',
            slug: 'significance-of-the-month-of-muharram'
        }
    ];

    return (
        <section style={{
            background: 'var(--surface-1)',
            padding: '70px 24px',
            borderBottom: '1px solid var(--border)'
        }}>
            <div style={{
                maxWidth: 1200,
                margin: '0 auto'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <span style={{
                        color: 'var(--primary-600)',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        display: 'block'
                    }}>
                        BLOG & NEWS
                    </span>
                    <h2 style={{
                        fontSize: '2.25rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        marginTop: 8,
                        marginBottom: 0,
                        fontFamily: "'Inter', sans-serif"
                    }}>
                        Articles and Blog
                    </h2>
                </div>

                {/* Grid */}
                <div className="blog-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: 30
                }}>
                    {articles.map((article) => (
                        <div 
                            key={article.id}
                            style={{
                                background: 'var(--neutral-50)',
                                borderRadius: 24,
                                padding: 24,
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.3s ease',
                                border: '1px solid var(--border)'
                            }}
                            className="blog-card"
                        >
                            {/* Card Image */}
                            <div style={{
                                width: '100%',
                                height: 190,
                                borderRadius: 16,
                                overflow: 'hidden',
                                background: 'var(--neutral-200)'
                            }}>
                                <img 
                                    src={article.image} 
                                    alt={article.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>

                            {/* Date */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                marginTop: 20,
                                color: 'var(--text-muted)',
                                fontSize: '0.8rem',
                                fontWeight: 700
                            }}>
                                <span style={{ color: 'var(--primary-500)', fontSize: '1rem', lineHeight: 1 }}>••</span>
                                <span>{article.date}</span>
                            </div>

                            {/* Title */}
                            <h3 style={{
                                fontSize: '1.15rem',
                                fontWeight: 800,
                                color: 'var(--text-primary)',
                                marginTop: 12,
                                marginBottom: 8,
                                lineHeight: 1.4,
                                minHeight: 48,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>
                                {article.title}
                            </h3>

                            {/* Description */}
                            <p style={{
                                fontSize: '0.875rem',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.5,
                                marginBottom: 24,
                                flexGrow: 1,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>
                                {article.description}
                            </p>

                            {/* Button */}
                            <Link 
                                href={`/blog/${article.slug}`}
                                className="blog-btn"
                                style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    background: 'var(--primary-600)',
                                    color: '#ffffff',
                                    padding: '12px 24px',
                                    borderRadius: 100,
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            >
                                Read More
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .blog-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 30px rgba(0,0,0,0.06);
                    background: 'var(--neutral-100)' !important;
                }
                .blog-btn:hover {
                    background: 'var(--primary-700)' !important;
                    transform: scale(1.02);
                }
                @media (max-width: 640px) {
                    .blog-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </section>
    );
}
