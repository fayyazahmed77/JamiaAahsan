import React, { useState } from 'react';
import TopBar from '@/Components/Public/Header/TopBar';
import MainNav from '@/Components/Public/Header/MainNav';
import MobileDrawer from '@/Components/Public/Header/MobileDrawer';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
            {/* Top Utility Strip (Deep Navy) */}
            <TopBar />

            {/* Main Navigation Bar */}
            <MainNav 
                mobileMenuOpen={mobileMenuOpen} 
                onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} 
            />

            {/* Mobile Navigation Drawer */}
            <MobileDrawer 
                open={mobileMenuOpen} 
                onClose={() => setMobileMenuOpen(false)} 
            />

            {/* Global style overrides for layout */}
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
        </header>
    );
}
