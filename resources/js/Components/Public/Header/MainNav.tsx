import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { SharedData } from '@/types/inertia';

interface MainNavProps {
    mobileMenuOpen: boolean;
    onToggleMobileMenu: () => void;
}

export default function MainNav({ mobileMenuOpen, onToggleMobileMenu }: MainNavProps) {
    const { t, locale } = useTranslation();
    const { url } = usePage();
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;
    const isAdmin = auth?.roles?.includes('Admin') || auth?.roles?.includes('Super Admin');

    const isActive = (path: string) => {
        if (path === '/') {
            return url === '/' || url === '';
        }
        return url.startsWith(path);
    };

    const navLinks = [
        { label: t('common.nav.home'), path: '/' },
        { label: t('common.nav.audio'), path: '/media/audio' },
        { label: t('common.nav.video'), path: '/media/video' },
        { label: t('common.nav.live'), path: '/media/live' },
        { label: t('common.nav.education'), path: '/education' },
        { label: t('common.nav.fatwa'), path: '/fatwa' },
        { label: t('common.nav.downloads'), path: '/downloads' },
     
        { label: t('common.nav.about'), path: '/about' },
        { label: t('common.nav.contact'), path: '/contact' }
    ];

    return (
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
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }} aria-label="Jamia Ahsan Home">
                    <img 
                        src="/images/dark.png" 
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
                    {navLinks.map((link, idx) => {
                        const active = isActive(link.path);
                        return (
                            <Link 
                                key={idx}
                                href={link.path} 
                                aria-current={active ? 'page' : undefined}
                                style={{ 
                                    fontSize: '0.8125rem', 
                                    fontWeight: active ? 800 : 700, 
                                    color: active ? 'var(--primary-600)' : 'rgba(27, 27, 27, 0.85)', 
                                    letterSpacing: '0.04em',
                                    transition: 'color 0.2s',
                                    padding: '6px 0',
                                    position: 'relative',
                                    textTransform: 'uppercase',
                                    fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit'
                                }}
                                onMouseEnter={e => {
                                    if (!active) e.currentTarget.style.color = 'var(--accent-400)';
                                }}
                                onMouseLeave={e => {
                                    if (!active) e.currentTarget.style.color = 'rgba(27, 27, 27, 0.85)';
                                }}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* CTA Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {user ? (
                        <Link 
                            href={isAdmin ? '/admin' : '/student/dashboard'} 
                            className="btn btn-primary hidden md:inline-flex" 
                            style={{ borderRadius: 100, padding: '10px 20px', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}
                        >
                            {t('common.nav.dashboard')}
                        </Link>
                    ) : (
                        <Link href="/admissions/apply" className="btn btn-primary hidden md:inline-flex" style={{ borderRadius: 100, padding: '10px 20px', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}>
                            {t('common.buttons.apply_now')}
                        </Link>
                    )}
                    <button 
                        onClick={onToggleMobileMenu}
                        className="mobile-menu-btn" 
                        aria-expanded={mobileMenuOpen}
                        aria-label="Toggle Navigation Menu"
                        style={{ 
                            background: 'rgba(255, 255, 255, 0.08)', 
                            border: '1px solid rgba(255,255,255,0.15)', 
                            color: 'black', 
                            cursor: 'pointer',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            display: 'flex',
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
    );
}
