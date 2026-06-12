import React from 'react';
import { Link } from '@inertiajs/react';
import { Globe, Heart } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
    const { t, locale } = useTranslation();

    return (
        <footer style={{ 
            background: 'var(--primary-950)', 
            color: 'rgba(255, 255, 255, 0.75)', 
            borderTop: '3px solid var(--primary-500)', 
            padding: '80px 24px 40px',
            fontSize: '0.875rem'
        }}>
            <div style={{ 
                maxWidth: 1200, 
                margin: '0 auto', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                gap: 48 
            }}>
                {/* Column 1: Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src="/images/logo.png" alt="Jamia Ahsan Logo" style={{ width: 44, height: 44 }} />
                        <div>
                            <span style={{ fontWeight: 800, color: 'white', fontSize: '1.125rem', letterSpacing: '-0.01em' }}>Jamia Arabia</span>
                            <span style={{ fontSize: '0.6875rem', color: 'var(--accent-400)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Ahsan Ul Uloom</span>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}>
                        {t('common.footer.description')}
                    </p>
                    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook Page" style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-500)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter Page" style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-500)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram Page" style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-500)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                        </a>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}>
                        {t('common.footer.quick_links')}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { label: t('common.nav.history'), path: '/about/history' },
                            { label: t('common.nav.audio'), path: '/media/audio' },
                            { label: t('common.nav.video'), path: '/media/video' },
                            { label: t('common.nav.fatwa'), path: '/fatwa' },
                               { label: locale === 'ur' ? 'گیلری' : 'Gallery', path: '/gallery' },
        { label: t('common.nav.news'), path: '/news' },
                        ].map((link, idx) => (
                            <Link 
                                key={idx} 
                                href={link.path} 
                                style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.8125rem', transition: 'color 0.2s', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Column 3: Departments */}
                <div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}>
                        {t('common.nav.education')}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { label: t('education.levels.dars_e_nizami'), path: '/education' },
                            { label: t('education.levels.hifz'), path: '/education' },
                            { label: t('education.levels.short_courses'), path: '/education' },
                            { label: t('common.nav.apply'), path: '/admissions/apply' }
                        ].map((link, idx) => (
                            <Link 
                                key={idx} 
                                href={link.path} 
                                style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.8125rem', transition: 'color 0.2s', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Column 4: Donate */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}>
                        {t('common.nav.donation')}
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}>
                        {t('common.footer.description')}
                    </p>
                    <Link 
                        href="/donate" 
                        className="btn btn-accent text-center w-full" 
                        style={{ 
                            borderRadius: 100, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: 8,
                            padding: '10px 16px',
                            fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit'
                        }}
                    >
                        <Heart size={14} fill="currentColor" />
                        {t('common.nav.donation')}
                    </Link>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={{ 
                maxWidth: 1200, 
                margin: '64px auto 0', 
                paddingTop: 24, 
                borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                gap: 16 
            }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}>
                    {t('common.footer.copyright')}
                </span>
                <Link 
                    href="/login" 
                    style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s', fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-400)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >
                    {t('common.nav.login')}
                </Link>
            </div>
        </footer>
    );
}
