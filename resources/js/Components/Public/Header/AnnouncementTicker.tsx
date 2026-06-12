import React from 'react';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';
import { useTranslation } from '@/hooks/useTranslation';

export default function AnnouncementTicker() {
    const { site_settings } = usePage<SharedData>().props;
    const { locale } = useTranslation();

    const tickerText = locale === 'ur'
        ? (site_settings?.announcement_ticker_ur || '🕌 داخلے جاری ہیں — درسِ نظامی تعلیمی سال 2026')
        : (site_settings?.announcement_ticker_en || '🕌 Admissions Open — Dars-e-Nizami 2026');

    return (
        <div style={{
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            height: 28,
            paddingLeft: 12,
            paddingRight: 12,
            width: '100%'
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
                {[0, 1].map(rep => (
                    <span key={rep} style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ color: 'var(--accent-400)', fontSize: '0.7rem' }}>✦</span>
                        <span style={{
                            fontFamily: locale === 'ur' ? "'Noto Nastaliq Urdu', serif" : 'inherit',
                            fontSize: locale === 'ur' ? '0.875rem' : '0.75rem',
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: locale === 'ur' ? 'normal' : 600
                        }}>
                            {tickerText}
                        </span>
                        <span style={{ color: 'var(--accent-400)', fontSize: '0.7rem' }}>✦</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
