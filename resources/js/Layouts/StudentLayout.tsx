import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { StudentSidebar } from './components/student/StudentSidebar';
import { StudentHeader } from './components/student/StudentHeader';
import { StudentMobileBottomNav } from './components/student/StudentMobileBottomNav';
import { AppToaster } from '@/Components/ui/Toaster';
import type { StudentSharedData } from '@/types/student';

interface StudentLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function StudentLayout({ children, title }: StudentLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = React.useState(false);

    // RTL support: detect if student settings language is 'ur'
    const page = usePage() as any;
    const studentSettings = page.props.student_settings ?? null;
    const isRTL = studentSettings?.language === 'ur';

    React.useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Apply RTL direction to the portal root
    useEffect(() => {
        const html = document.documentElement;
        if (isRTL) {
            html.setAttribute('dir', 'rtl');
            html.setAttribute('lang', 'ur');
        } else {
            html.setAttribute('dir', 'ltr');
            html.setAttribute('lang', 'en');
        }
        return () => {
            // Reset on unmount (admin pages use LTR)
            html.setAttribute('dir', 'ltr');
            html.setAttribute('lang', 'en');
        };
    }, [isRTL]);

    const sidebarWidth = 260;

    return (
        <div
            className="student-shell"
            dir={isRTL ? 'rtl' : 'ltr'}
            style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-1)' }}
        >
            {/* Mobile overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <StudentSidebar
                open={sidebarOpen}
                isMobile={isMobile}
                onClose={() => setSidebarOpen(false)}
                isRTL={isRTL}
            />

            {/* Main area */}
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    // RTL: sidebar on right => margin-right; LTR: margin-left
                    marginLeft: isRTL ? 0 : (isMobile ? 0 : `${sidebarWidth}px`),
                    marginRight: isRTL ? (isMobile ? 0 : `${sidebarWidth}px`) : 0,
                    transition: 'margin 0.3s ease',
                    paddingBottom: isMobile ? '72px' : 0,
                }}
            >
                {/* Header */}
                <StudentHeader
                    onMenuClick={() => setSidebarOpen(true)}
                    isMobile={isMobile}
                    isRTL={isRTL}
                />

                {/* Page content */}
                <main style={{ flex: 1, padding: isMobile ? '16px' : '24px 28px' }}>
                    <AppToaster />
                    <div className="fade-in">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            {isMobile && <StudentMobileBottomNav />}
        </div>
    );
}
