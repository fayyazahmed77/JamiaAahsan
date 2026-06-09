import React from 'react';
import { Link } from '@inertiajs/react';
import { Flag, Globe } from 'lucide-react';

export default function DonateSection() {
    return (
        <section 
            className="donate-section"
            style={{
                background: 'var(--primary-600)',
                padding: '80px 24px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Soft decorative background patterns */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                right: '-10%',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                left: '-10%',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            <div 
                className="donate-container"
                style={{
                    maxWidth: 1200,
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 48,
                    position: 'relative',
                    zIndex: 2
                }}
            >
                {/* Left Side: Building Image */}
                <div 
                    className="donate-image-wrapper"
                    style={{
                        flex: 1,
                        borderRadius: 24,
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    <img 
                        src="/images/jamia_building.png" 
                        alt="Jamia Ahsan Building" 
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: 450,
                            objectFit: 'cover',
                            display: 'block'
                        }}
                    />
                </div>

                {/* Right Side: Content */}
                <div 
                    className="donate-content-wrapper"
                    style={{
                        flex: 1,
                        color: '#ffffff'
                    }}
                >
                    <span 
                        style={{
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            color: 'var(--accent-300)',
                            display: 'block',
                            marginBottom: 12
                        }}
                    >
                        RECENT CAMPAIGN
                    </span>
                    <h2 
                        style={{
                            fontSize: '3rem',
                            fontWeight: 800,
                            lineHeight: 1.2,
                            marginBottom: 32,
                            fontFamily: "'Inter', sans-serif"
                        }}
                    >
                        Donate Now at <br />
                        Jamia Ahsan
                    </h2>

                    {/* Buttons Row */}
                    <div 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            flexWrap: 'wrap'
                        }}
                    >
                        <Link 
                            href="/donate/local"
                            className="donate-pill-btn"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 10,
                                background: '#ffffff',
                                color: 'var(--primary-600)',
                                padding: '14px 28px',
                                borderRadius: 100,
                                fontSize: '0.9375rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                            }}
                        >
                            <Flag size={18} style={{ color: 'var(--primary-600)' }} />
                            <span>Local</span>
                        </Link>

                        <Link 
                            href="/donate/international"
                            className="donate-pill-btn"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 10,
                                background: '#ffffff',
                                color: 'var(--primary-600)',
                                padding: '14px 28px',
                                borderRadius: 100,
                                fontSize: '0.9375rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                            }}
                        >
                            <Globe size={18} style={{ color: 'var(--primary-600)' }} />
                            <span>International</span>
                        </Link>
                    </div>
                </div>
            </div>

            <style>{`
                .donate-pill-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.15) !important;
                    background: #f8fafc !important;
                }
                @media (max-width: 991px) {
                    .donate-container {
                        flex-direction: column !important;
                        gap: 36px !important;
                        text-align: center !important;
                    }
                    .donate-image-wrapper {
                        width: 100% !important;
                        max-width: 500px !important;
                    }
                    .donate-content-wrapper {
                        width: 100% !important;
                    }
                    .donate-content-wrapper h2 {
                        font-size: 2.25rem !important;
                    }
                    .donate-content-wrapper div {
                        justify-content: center !important;
                    }
                }
            `}</style>
        </section>
    );
}
