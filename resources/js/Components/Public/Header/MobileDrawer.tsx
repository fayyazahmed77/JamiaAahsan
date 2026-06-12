import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { X, Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { SharedData } from '@/types/inertia';
import SearchBar from './SearchBar';

interface MobileDrawerProps {
    open: boolean;
    onClose: () => void;
}

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
    const { t, locale } = useTranslation();
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;
    const isAdmin = auth?.roles?.includes('Admin') || auth?.roles?.includes('Super Admin');

    const navLinks = [
        { label: t('common.nav.home'), path: '/' },
        { label: t('common.nav.audio'), path: '/media/audio' },
        { label: t('common.nav.video'), path: '/media/video' },
        { label: t('common.nav.live'), path: '/media/live' },
        { label: t('common.nav.education'), path: '/education' },
        { label: t('common.nav.fatwa'), path: '/fatwa' },
        { label: t('common.nav.downloads'), path: '/downloads' },
        { label: locale === 'ur' ? 'گیلری' : 'Gallery', path: '/gallery' },
        { label: t('common.nav.news'), path: '/news' },
        { label: t('common.nav.about'), path: '/about' },
        { label: t('common.nav.contact'), path: '/contact' }
    ];

    return (
        <>
            {/* Mobile Menu Backdrop */}
            <div 
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(3, 16, 31, 0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 99,
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? 'auto' : 'none',
                    transition: 'opacity 0.4s ease'
                }}
                className="lg:hidden"
            />

            {/* Mobile Navigation Drawer (Slides Left to Right or Right to Left based on RTL) */}
            <div style={{ 
                position: 'fixed',
                top: 0,
                left: locale === 'ur' ? undefined : 0,
                right: locale === 'ur' ? 0 : undefined,
                bottom: 0,
                width: '320px',
                maxWidth: '85vw',
                background: 'var(--primary-950)', 
                borderRight: locale === 'ur' ? 'none' : '1px solid rgba(255,255,255,0.1)', 
                borderLeft: locale === 'ur' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                padding: '24px 20px',
                boxShadow: locale === 'ur' ? '-4px 0 30px rgba(0,0,0,0.4)' : '4px 0 30px rgba(0,0,0,0.4)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                transform: open 
                    ? 'translateX(0)' 
                    : (locale === 'ur' ? 'translateX(100%)' : 'translateX(-100%)'),
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
                        onClick={onClose}
                        aria-label="Close menu"
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
                    <SearchBar mobile={true} />
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
                    {navLinks.map((link, idx) => (
                        <Link 
                            key={idx}
                            href={link.path} 
                            onClick={onClose} 
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
                    <Link href="/donate" onClick={onClose} className="btn btn-accent text-center w-full" style={{ borderRadius: 100, padding: '12px', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}>
                        {t('common.nav.donation')}
                    </Link>
                    {user ? (
                        <>
                            <Link 
                                href={isAdmin ? '/admin' : '/student/dashboard'} 
                                onClick={onClose} 
                                className="btn btn-primary text-center w-full" 
                                style={{ borderRadius: 100, padding: '12px', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}
                            >
                                {t('common.nav.dashboard')}
                            </Link>
                            <Link 
                                href="/logout" 
                                method="post" 
                                as="button" 
                                onClick={onClose} 
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
                                onClick={onClose} 
                                className="btn btn-outline text-center w-full" 
                                style={{ borderRadius: 100, padding: '12px', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit', border: '1px solid rgba(255,255,255,0.15)', color: 'white', background: 'transparent' }}
                            >
                                {t('common.nav.login')}
                            </Link>
                            <Link 
                                href="/admissions/apply" 
                                onClick={onClose} 
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
        </>
    );
}
