import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Globe } from 'lucide-react';
import type { SharedData } from '@/types/inertia';
import { useTranslation } from '@/hooks/useTranslation';
import AnnouncementTicker from '@/Components/Public/Header/AnnouncementTicker';
import SearchBar from '@/Components/Public/Header/SearchBar';

export default function TopBar() {
    const { locale } = useTranslation();
    const { site_settings } = usePage<SharedData>().props;

    const fbUrl = site_settings?.social_facebook || 'https://facebook.com';
    const twitterUrl = site_settings?.social_twitter || 'https://twitter.com';
    const instagramUrl = site_settings?.social_instagram || 'https://instagram.com';

    return (
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
                    <a href={fbUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#3b5998'} onMouseLeave={e => e.currentTarget.style.color = 'inherit'}>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                    <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#1da1f2'} onMouseLeave={e => e.currentTarget.style.color = 'inherit'}>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    </a>
                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#e1306c'} onMouseLeave={e => e.currentTarget.style.color = 'inherit'}>
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

                {/* Center: Running announcements ticker */}
                <AnnouncementTicker />

                {/* Right: Search bar */}
                <div className="desktop-only" style={{ alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    <SearchBar />
                </div>
            </div>
        </div>
    );
}
