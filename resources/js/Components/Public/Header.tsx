import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X, Search, Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { SharedData } from '@/types/inertia';

export default function Header() {
    const { t, locale } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;
    const isAdmin = auth?.roles?.includes('Admin') || auth?.roles?.includes('Super Admin');

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
            {/* Top Utility Strip (Deep Navy) */}
            <div style={{
                background: 'var(--primary-400)',
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.75rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '8px 24px',
                transition: 'all 0.3s ease'
            }}>
                <div 
                    className="top-utility-grid"
                    style={{
                        maxWidth: 1200,
                        margin: '0 auto',
                        alignItems: 'center',
                        gap: 16,
                        width: '100%'
                    }}
                >
                    {/* Left: Socials + Language */}
                    <div className="desktop-only" style={{ alignItems: 'center', gap: 16, flexShrink: 0 }}>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#3b5998'} onMouseLeave={e => e.currentTarget.style.color = 'inherit'}>
                            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#1da1f2'} onMouseLeave={e => e.currentTarget.style.color = 'inherit'}>
                            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#e1306c'} onMouseLeave={e => e.currentTarget.style.color = 'inherit'}>
                            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                        </a>
                        <span style={{ height: 12, width: 1, background: 'rgba(255, 255, 255, 0.59)' }}></span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Globe size={12} />
                            <Link href="/lang/en" style={{ color: locale === 'en' ? 'var(--accent-400)' : 'inherit', textDecoration: 'none', fontWeight: locale === 'en' ? 'bold' : 'normal' }}>EN</Link>
                            <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>/</span>
                            <Link href="/lang/ur" style={{ color: locale === 'ur' ? 'var(--accent-400)' : 'inherit', textDecoration: 'none', fontWeight: locale === 'ur' ? 'bold' : 'normal', fontFamily: "'Noto Nastaliq Urdu', serif" }}>اردو</Link>
                        </div>
                    </div>

                    {/* Center: Smooth scrolling Arabic/Urdu event & Azaan ticker */}
                    <div style={{
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        height: 28,
                        borderLeft: '1px solid rgba(255, 255, 255, 0)',
                        borderRight: '1px solid rgba(255,255,255,0)',
                        paddingLeft: 12,
                        paddingRight: 12
                    }}>
                        {/* Fade edges */}
                        <div style={{
                            position: 'absolute', left: 0, top: 0, bottom: 0,
                            width: 32, zIndex: 2,
                            background: 'linear-gradient(to right, var(--primary-400), transparent)',
                            pointerEvents: 'none'
                        }} />
                        <div style={{
                            position: 'absolute', right: 0, top: 0, bottom: 0,
                            width: 32, zIndex: 2,
                            background: 'linear-gradient(to left, var(--primary-400), transparent)',
                            pointerEvents: 'none'
                        }} />

                        <div className="arabic-ticker-track" style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', willChange: 'transform' }}>
                            {/* Duplicated for seamless loop */}
                            {[0, 1].map(rep => (
                                <span key={rep} style={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
                                    <span style={{ color: 'var(--accent-400)', marginLeft: 8, marginRight: 4, fontSize: '0.7rem' }}>✦</span>
                                    <span style={{ fontFamily: "'Noto Nastaliq Urdu', serif", fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', letterSpacing: '0.02em', direction: 'rtl' }}>
                                        اللہ اکبر اللہ اکبر، اشہد ان لا الہ الا اللہ، اشہد ان محمداً رسول اللہ
                                    </span>
                                    <span style={{ color: 'var(--accent-400)', marginLeft: 8, marginRight: 4, fontSize: '0.7rem' }}>✦</span>
                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginLeft: 8 }}>
                                        🕌 Upcoming Event: Annual Ijtema — 15 Muharram 1446
                                    </span>
                                    <span style={{ color: 'var(--accent-400)', marginLeft: 8, marginRight: 4, fontSize: '0.7rem' }}>✦</span>
                                    <span style={{ fontFamily: "'Noto Nastaliq Urdu', serif", fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', direction: 'rtl' }}>
                                        حی علی الصلاۃ، حی علی الفلاح، الصلاۃ خیر من النوم
                                    </span>
                                    <span style={{ color: 'var(--accent-400)', marginLeft: 8, marginRight: 4, fontSize: '0.7rem' }}>✦</span>
                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginLeft: 8 }}>
                                        📚 Admissions Open — Dars-e-Nizami 2026
                                    </span>
                                    <span style={{ color: 'var(--accent-400)', marginLeft: 24, fontSize: '0.7rem' }}>✦</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right: Search bar */}
                    <div className="desktop-only" style={{ alignItems: 'center', gap: 12, flexShrink: 0 }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: searchFocused ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.07)',
                            border: searchFocused ? '1px solid var(--accent-400)' : '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: 100,
                            padding: '4px 12px',
                            transition: 'all 0.3s ease',
                            width: searchFocused ? 180 : 130
                        }}>
                            <Search size={12} style={{ color: 'rgba(255, 255, 255, 0.6)', marginRight: 6 }} />
                            <input
                                type="text"
                                placeholder="Search..."
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    width: '100%'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Marquee animation */}
                <style>{`
                    .arabic-ticker-track {
                        animation: arabicTickerScroll 55s linear infinite;
                    }
                    .arabic-ticker-track:hover {
                        animation-play-state: paused;
                    }
                    @keyframes arabicTickerScroll {
                        0%   { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .desktop-only {
                        display: flex !important;
                    }
                    .top-utility-grid {
                        display: grid !important;
                        grid-template-columns: auto 1fr auto !important;
                    }
                    .mobile-menu-btn {
                        display: flex !important;
                    }
                    @media (max-width: 1023px) {
                        .desktop-only {
                            display: none !important;
                        }
                        .top-utility-grid {
                            grid-template-columns: 1fr !important;
                            gap: 0 !important;
                        }
                    }
                    @media (min-width: 1024px) {
                        .mobile-menu-btn {
                            display: none !important;
                        }
                    }
                `}</style>
            </div>

            {/* Main Navigation Bar (Navy Blue with subtle tint) */}
            <div style={{
                background: 'var(--neutral-50)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '0 24px',
                height: 80,
                display: 'flex',
                alignItems: 'center'
            }}>
                <div style={{
                    maxWidth: 1200,
                    margin: '0 auto',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    {/* Logo & Calligraphy Call */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                        <img 
                            src="/images/logo.png" 
                            alt="Jamia Ahsan Logo" 
                            style={{ 
                                width: 50, 
                                height: 50, 
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' 
                            }} 
                        />
                       
                    </Link>

                    {/* Navigation Links - Desktop */}
                    <nav className="hidden lg:flex text-uppercase items-center gap-4 xl:gap-5" aria-label="Main Public Navigation">
                        {[
                            { label: t('common.nav.home'), path: '/' },
                            { label: t('common.nav.audio'), path: '/media/audio' },
                            { label: t('common.nav.video'), path: '/media/video' },
                            { label: t('common.nav.live'), path: '/media/live' },
                            { label: t('common.nav.education'), path: '/education' },
                            { label: t('common.nav.fatwa'), path: '/fatwa' },
                            { label: t('common.nav.downloads'), path: '/downloads' },
                            { label: t('common.nav.news'), path: '/news' },
                            { label: t('common.nav.about'), path: '/about' },
                            { label: t('common.nav.contact'), path: '/contact' }
                        ].map((link, idx) => (
                            <Link 
                                key={idx}
                                href={link.path} 
                                style={{ 
                                    fontSize: '0.8125rem', 
                                    fontWeight: 700, 
                                    color: 'rgba(27, 27, 27, 0.85)', 
                                    letterSpacing: '0.04em',
                                    transition: 'color 0.2s',
                                    padding: '6px 0',
                                    position: 'relative',
                                     textTransform: 'uppercase',
                                    fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = 'var(--accent-400)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = 'rgba(27, 27, 27, 0.85)';
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        
                        {user ? (
                            <>
                                <Link 
                                    href={isAdmin ? '/admin' : '/student/dashboard'} 
                                    className="btn btn-primary hidden md:inline-flex" 
                                    style={{ borderRadius: 100, padding: '10px 20px', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}
                                >
                                    {t('common.nav.dashboard')}
                                </Link>
                                {/* <Link 
                                    href="/logout" 
                                    method="post" 
                                    as="button" 
                                    className="btn btn-outline hidden md:inline-flex" 
                                    style={{ borderRadius: 100, padding: '10px 20px', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', background: 'transparent', color: 'inherit' }}
                                >
                                    {t('common.nav.logout')}
                                </Link> */}
                            </>
                        ) : (
                            <>
                               
                                <Link href="/admissions/apply" className="btn btn-primary hidden md:inline-flex" style={{ borderRadius: 100, padding: '10px 20px', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}>
                                    {t('common.buttons.apply_now')}
                                </Link>
                            </>
                        )}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="mobile-menu-btn" 
                            style={{ 
                                background: 'rgba(255, 255, 255, 0.08)', 
                                border: '1px solid rgba(255,255,255,0.15)', 
                                color: 'black', 
                                cursor: 'pointer',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Backdrop */}
            <div 
                onClick={() => setMobileMenuOpen(false)}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(3, 16, 31, 0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 99,
                    opacity: mobileMenuOpen ? 1 : 0,
                    pointerEvents: mobileMenuOpen ? 'auto' : 'none',
                    transition: 'opacity 0.4s ease'
                }}
                className="lg:hidden"
            />

            {/* Mobile Navigation Drawer (Slides Left to Right) */}
            <div style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: '320px',
                maxWidth: '85vw',
                background: 'var(--primary-950)', 
                borderRight: '1px solid rgba(255,255,255,0.1)', 
                padding: '24px 20px',
                boxShadow: '4px 0 30px rgba(0,0,0,0.4)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                overflowY: 'auto'
            }} className="lg:hidden">
                {/* Header Section inside Drawer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img 
                            src="/images/logo.png" 
                            alt="Jamia Ahsan Logo" 
                            style={{ 
                                width: 38, 
                                height: 38, 
                                objectFit: 'contain'
                            }} 
                        />
                        <div>
                            <h2 style={{ 
                                fontSize: '1rem', 
                                fontWeight: 800, 
                                color: 'white', 
                                margin: 0,
                                letterSpacing: '-0.02em'
                            }}>
                                Jamia Ahsan
                            </h2>
                            <span style={{ fontSize: '0.6rem', color: 'var(--accent-400)', display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Islamic Institute
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: 'white',
                            cursor: 'pointer',
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Mobile Search input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '10px 14px',
                    }}>
                        <Search size={16} style={{ color: 'rgba(255, 255, 255, 0.5)', marginRight: 10 }} />
                        <input
                            type="text"
                            placeholder="Search..."
                            style={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: 'white',
                                fontSize: '0.875rem',
                                width: '100%'
                            }}
                        />
                    </div>
                </div>

                {/* Mobile Language selector */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.04)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(255,255,255,0.06)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                        <Globe size={16} style={{ color: 'var(--accent-400)' }} />
                        <span>{t('common.language')}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, fontSize: '0.85rem', fontWeight: 700 }}>
                        <Link href="/lang/en" style={{ color: locale === 'en' ? 'var(--accent-400)' : 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>EN</Link>
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
                        <Link href="/lang/ur" style={{ color: locale === 'ur' ? 'var(--accent-400)' : 'rgba(255,255,255,0.6)', textDecoration: 'none', fontFamily: "'Noto Nastaliq Urdu', serif" }}>اردو</Link>
                    </div>
                </div>

                {/* Mobile Navigation Links */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }} aria-label="Mobile Navigation Drawer">
                    {[
                        { label: t('common.nav.home'), path: '/' },
                        { label: t('common.nav.audio'), path: '/media/audio' },
                        { label: t('common.nav.video'), path: '/media/video' },
                        { label: t('common.nav.live'), path: '/media/live' },
                        { label: t('common.nav.education'), path: '/education' },
                        { label: t('common.nav.fatwa'), path: '/fatwa' },
                        { label: t('common.nav.downloads'), path: '/downloads' },
                        { label: t('common.nav.news'), path: '/news' },
                        { label: t('common.nav.about'), path: '/about' },
                        { label: t('common.nav.contact'), path: '/contact' }
                    ].map((link, idx) => (
                        <Link 
                            key={idx}
                            href={link.path} 
                            onClick={() => setMobileMenuOpen(false)} 
                            style={{ 
                                fontSize: '0.9375rem', 
                                fontWeight: 600, 
                                color: 'rgba(255, 255, 255, 0.9)',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                padding: '12px 4px',
                                display: 'block',
                                transition: 'color 0.2s',
                                fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit'
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-400)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                    <Link href="/donate" onClick={() => setMobileMenuOpen(false)} className="btn btn-accent text-center w-full" style={{ borderRadius: 100, padding: '12px', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}>
                        {t('common.nav.donation')}
                    </Link>
                    {user ? (
                        <>
                            <Link 
                                href={isAdmin ? '/admin' : '/student/dashboard'} 
                                onClick={() => setMobileMenuOpen(false)} 
                                className="btn btn-primary text-center w-full" 
                                style={{ borderRadius: 100, padding: '12px', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}
                            >
                                {t('common.nav.dashboard')}
                            </Link>
                            <Link 
                                href="/logout" 
                                method="post" 
                                as="button" 
                                onClick={() => setMobileMenuOpen(false)} 
                                className="btn btn-outline text-center w-full" 
                                style={{ borderRadius: 100, padding: '12px', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit', border: '1px solid rgba(255,255,255,0.15)', color: 'white', background: 'transparent' }}
                            >
                                {t('common.nav.logout')}
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link 
                                href="/login" 
                                onClick={() => setMobileMenuOpen(false)} 
                                className="btn btn-outline text-center w-full" 
                                style={{ borderRadius: 100, padding: '12px', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit', border: '1px solid rgba(255,255,255,0.15)', color: 'white', background: 'transparent' }}
                            >
                                {t('common.nav.login')}
                            </Link>
                            <Link 
                                href="/admissions/apply" 
                                onClick={() => setMobileMenuOpen(false)} 
                                className="btn btn-primary text-center w-full" 
                                style={{ borderRadius: 100, padding: '12px', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}
                            >
                                {t('common.buttons.apply_now')}
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Info details */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 100,
                    padding: '8px 16px',
                    marginTop: 8
                }}>
                    <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        background: 'var(--primary-500)',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: 100,
                        letterSpacing: '0.05em'
                    }}>FOR DETAILS</span>
                    <a href="tel:03343969964" style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'white',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                    }}>
                        <svg width={12} height={12} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.1-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        0334 3969964
                    </a>
                </div>

                {/* Mobile Social media links */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 12 }}>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#3b5998'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#1da1f2'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#e1306c'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    </a>
                </div>
            </div>
        </header>
    );
}
