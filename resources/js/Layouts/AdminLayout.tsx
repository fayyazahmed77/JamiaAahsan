import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { AppToaster } from '@/Components/ui/Toaster';

interface AdminLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: { label: string; href?: string }[];
    title?: string;
    headerAction?: React.ReactNode;
    action?: React.ReactNode;
}

export default function AdminLayout({
    children,
    breadcrumbs = [],
    title,
    headerAction,
    action,
}: AdminLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    React.useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            setSidebarCollapsed(mobile); // Auto-collapse on mobile, keep expanded on desktop
        };
        
        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="admin-shell">
            {/* Mobile Backdrop Overlay */}
            {isMobile && !sidebarCollapsed && (
                <div 
                    className="fixed inset-0 z-30 bg-stone-950/40 backdrop-blur-xs transition-opacity duration-300"
                    onClick={() => setSidebarCollapsed(true)}
                />
            )}

            {/* Sidebar */}
            <Sidebar collapsed={sidebarCollapsed} isMobile={isMobile} />

            {/* Main content */}
            <div
                className="admin-main"
                style={{
                    marginLeft: isMobile ? 0 : (sidebarCollapsed ? '64px' : 'var(--sidebar-width)'),
                    transition: 'margin-left var(--transition-slow)',
                }}
            >
                {/* Topbar */}
                <Topbar
                    onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
                    sidebarCollapsed={sidebarCollapsed}
                    isMobile={isMobile}
                />

                {/* Page content */}
                <div>
                    {/* Breadcrumbs inside page */}
                    {breadcrumbs.length > 0 && (
                        <div style={{ padding: '24px 28px 0 28px' }}>
                            <nav aria-label="Breadcrumb" className="mb-2">
                                <ol style={{ display: 'flex', alignItems: 'center', gap: 6, listStyle: 'none', margin: 0, padding: 0, flexWrap: 'wrap' }}>
                                    <li>
                                        <Link
                                            href="/admin"
                                            style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', textDecoration: 'none' }}
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                    {breadcrumbs.map((crumb, i) => (
                                        <React.Fragment key={i}>
                                            <li style={{ color: 'var(--text-muted)', fontSize: '0.75rem', userSelect: 'none' }}>›</li>
                                            <li>
                                                {crumb.href && i < breadcrumbs.length - 1 ? (
                                                    <Link
                                                        href={crumb.href}
                                                        style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', textDecoration: 'none' }}
                                                    >
                                                        {crumb.label}
                                                    </Link>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 400 }}>
                                                        {crumb.label}
                                                    </span>
                                                )}
                                            </li>
                                        </React.Fragment>
                                    ))}
                                </ol>
                            </nav>
                        </div>
                    )}

                    {/* Page header */}
                    {title && (
                        <div className="page-header">
                            <div>
                                <h1 className="page-title">{title}</h1>
                            </div>
                            {(headerAction || action) && <div>{headerAction || action}</div>}
                        </div>
                    )}

                    {/* Flash messages */}
                    <AppToaster />

                    {/* Page body */}
                    <div className="fade-in">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
