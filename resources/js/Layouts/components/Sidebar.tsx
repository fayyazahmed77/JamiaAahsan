import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';
import { User, CreditCard, Bell, LogOut, MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from '@/Components/ui/dropdown-menu';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    permission?: string;
    section?: string;
}

const Icon = {
    Dashboard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    Audio: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>,
    Video: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>,
    Image: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>,
    Speaker: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    Category: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>,
    Year: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    Class: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
    Teacher: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    Book: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
    Admission: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>,
    QA: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    Roles: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
    Feedback: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    News: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8" /><path d="M15 18h-5" /><path d="M10 6h8v4h-8V6Z" /></svg>,
    Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
    Bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
    Subscription: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
    Prayer: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    Hifz: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21c-1.5-1-4-2.5-8-2.5V5c4 0 6.5 1.5 8 2.5 1.5-1 4-2.5 8-2.5v13.5c-4 0-6.5 1.5-8 2.5z" /><path d="M12 7v14" /></svg>,
    Attendance: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,
    Exam: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>,
    Enroll: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>,
    Grade: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>,
};

const navSections = [
    {
        section: 'Content',
        items: [
            { label: 'Audio', href: '/admin/audio', icon: <Icon.Audio />, permission: 'view audio' },
            { label: 'Videos', href: '/admin/videos', icon: <Icon.Video />, permission: 'view videos' },
            { label: 'Images & Banners', href: '/admin/images', icon: <Icon.Image />, permission: 'view home.main.banner' },
            { label: 'Downloads', href: '/admin/downloads', icon: <Icon.Download />, permission: 'view downloads' },
        ],
    },
    {
        section: 'Classification',
        items: [
            { label: 'Speakers', href: '/admin/speakers', icon: <Icon.Speaker />, permission: 'view speakers' },
            { label: 'Categories', href: '/admin/categories', icon: <Icon.Category />, permission: 'view categories' },
            { label: 'Years', href: '/admin/years', icon: <Icon.Year />, permission: 'view years' },
        ],
    },
    {
        section: 'Dars-e-Nizami',
        items: [
            { label: 'Classes', href: '/admin/classes', icon: <Icon.Class />, permission: 'view classes' },
            { label: 'Teachers', href: '/admin/teachers', icon: <Icon.Teacher />, permission: 'view teachers' },
            { label: 'Books', href: '/admin/books', icon: <Icon.Book />, permission: 'view books' },
        ],
    },
    {
        section: 'Academic Portal',
        items: [
            { label: 'Attendance',     href: '/admin/attendance',          icon: <Icon.Attendance />, permission: 'view students' },
            { label: 'Exam Schedule',  href: '/admin/exams',               icon: <Icon.Exam />,       permission: 'view students' },
            { label: 'Enrollments',    href: '/admin/enrollments',         icon: <Icon.Enroll />,     permission: 'view students' },
            { label: 'Assignment Grading', href: '/admin/assignments/grading', icon: <Icon.Grade />,  permission: 'view assignments' },
        ],
    },
    {
        section: 'Islamic Modules',
        items: [
            { label: 'Hifz Management', href: '/admin/hifz', icon: <Icon.Hifz />, permission: 'manage hifz' },
        ],
    },
    {
        section: 'Students',
        items: [
            { label: 'Admissions', href: '/admin/admissions', icon: <Icon.Admission />, permission: 'view admissions' },
            { label: 'Subscriptions', href: '/admin/subscriptions', icon: <Icon.Subscription />, permission: 'view subscriptions' },
        ],
    },
    {
        section: 'Q&A / Fatawa',
        items: [
            { label: 'Question & Answers', href: '/admin/qa/questions', icon: <Icon.QA />, permission: 'view qa' },
            { label: 'Topics', href: '/admin/qa/topics', icon: <Icon.Category />, permission: 'view topics' },
        ],
    },
    {
        section: 'CMS',
        items: [
            { label: 'Settings', href: '/admin/cms/settings', icon: <Icon.Settings />, permission: 'view settings' },
            { label: 'Departments', href: '/admin/departments', icon: <Icon.Settings />, permission: 'view settings' },
            { label: 'Prayer Timings', href: '/admin/cms/prayer-timings', icon: <Icon.Prayer />, permission: 'view prayer-timings' },
            { label: 'Latest News', href: '/admin/cms/latest-news', icon: <Icon.News />, permission: 'view latest-news' },
            { label: 'Feedback', href: '/admin/feedback', icon: <Icon.Feedback />, permission: 'view feedback' },
        ],
    },

    {
        section: 'System',
        items: [
            { label: 'Users', href: '/admin/users', icon: <Icon.Users />, permission: 'view users' },
            { label: 'Roles & Permissions', href: '/admin/roles', icon: <Icon.Roles />, permission: 'view roles' },
            { label: 'Notifications', href: '/admin/notifications', icon: <Icon.Bell />, permission: 'view notifications' },
        ],
    },
];

export function Sidebar({ collapsed, isMobile = false }: { collapsed: boolean; isMobile?: boolean }) {
    const { auth, ziggy } = usePage<SharedData & { ziggy: { location: string } }>().props;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const user = auth.user ? ((auth.user as any).data || auth.user) : null;
    const isDesktopCollapsed = collapsed && !isMobile;

    const hasPermission = (permission?: string) => {
        if (!permission) return true;
        return auth.permissions.includes(permission) || auth.roles.includes('Super Admin');
    };

    return (
        <aside 
            className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : 'desktop'}`}
            style={isMobile && collapsed ? { transform: 'translateX(-100%)' } : undefined}
        >
            {/* Logo */}
            <div className="admin-sidebar__logo">
                <img
                    src="/images/logo.png"
                    alt="Jamia Aahsan Logo"
                    style={{
                        width: 36,
                        height: 36,
                        objectFit: 'contain',
                        borderRadius: 'var(--radius-sm)',
                        flexShrink: 0,
                    }}
                />
                {!isDesktopCollapsed && (
                    <div>
                        <div className="admin-sidebar__logo-text">Jamia Aahsan</div>
                        <div className="admin-sidebar__logo-sub">Admin Dashboard</div>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="admin-sidebar__nav" aria-label="Admin navigation">
                {/* Dashboard — always visible */}
                <Link
                    href="/admin"
                    className={`admin-sidebar__link ${currentPath === '/admin' ? 'active' : ''}`}
                    style={{ margin: '4px 8px' }}
                >
                    <span className="admin-sidebar__link-icon"><Icon.Dashboard /></span>
                    {!isDesktopCollapsed && <span className="admin-sidebar__link-text">Dashboard</span>}
                </Link>

                {navSections.map((section) => {
                    const visibleItems = section.items.filter((item) => hasPermission(item.permission));
                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={section.section}>
                            {!isDesktopCollapsed && <div className="admin-sidebar__section">{section.section}</div>}
                            {visibleItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`admin-sidebar__link ${currentPath.startsWith(item.href) ? 'active' : ''}`}
                                >
                                    <span className="admin-sidebar__link-icon">{item.icon}</span>
                                    {!isDesktopCollapsed && <span className="admin-sidebar__link-text">{item.label}</span>}
                                </Link>
                            ))}
                        </div>
                    );
                })}
            </nav>

            {/* User info at bottom with Popover Dropdown */}
            {user && (
                <div style={{
                    padding: isDesktopCollapsed ? '8px 4px' : '8px 12px',
                    borderTop: '1px solid var(--border)',
                    flexShrink: 0,
                }}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: isDesktopCollapsed ? 'center' : 'flex-start',
                                    gap: isDesktopCollapsed ? 0 : 10,
                                    padding: isDesktopCollapsed ? '8px' : '8px 12px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    color: 'inherit',
                                    outline: 'none',
                                    transition: 'background var(--transition)',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-3)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                                <div style={{
                                    width: 32, height: 32,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary-600), var(--primary-400))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontWeight: 700, fontSize: 13,
                                    flexShrink: 0,
                                    boxShadow: 'var(--shadow-sm)',
                                    overflow: 'hidden',
                                }}>
                                    {user.profile_image_url ? (
                                        <img src={user.profile_image_url} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        (user.name?.[0] || 'U').toUpperCase()
                                    )}
                                </div>
                                {!isDesktopCollapsed && (
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {user.name || 'User'}
                                        </div>
                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {user.email || ''}
                                        </div>
                                    </div>
                                )}
                                {!isDesktopCollapsed && <MoreVertical size={16} className="text-muted-foreground" style={{ flexShrink: 0 }} />}
                             </button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent className="w-56" align="start" side="right" sideOffset={10}>
                             <DropdownMenuLabel className="flex items-center gap-2 p-2">
                                 <div style={{
                                     width: 36, height: 36,
                                     borderRadius: '50%',
                                     background: 'linear-gradient(135deg, var(--primary-600), var(--primary-400))',
                                     display: 'flex', alignItems: 'center', justifyContent: 'center',
                                     color: 'white', fontWeight: 700, fontSize: 14,
                                     flexShrink: 0,
                                     overflow: 'hidden',
                                 }}>
                                     {user.profile_image_url ? (
                                         <img src={user.profile_image_url} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                     ) : (
                                         (user.name?.[0] || 'U').toUpperCase()
                                     )}
                                 </div>
                                 <div className="flex flex-col min-w-0">
                                     <span className="text-sm font-semibold truncate select-none text-primary" style={{ color: 'var(--text-primary)' }}>
                                         {user.name || 'User'}
                                     </span>
                                     <span className="text-xs truncate text-muted-foreground select-none">
                                         {user.email || ''}
                                     </span>
                                 </div>
                             </DropdownMenuLabel>
                             <DropdownMenuSeparator />
                             <DropdownMenuGroup>
                                 <DropdownMenuItem onClick={() => router.get('/admin/profile')}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.get('/admin/subscriptions')}>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.get('/admin/notifications')}>
                                    <Bell className="mr-2 h-4 w-4" />
                                    <span>Notifications</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.post('/logout')}>
                                <LogOut className="mr-2 h-4 w-4 text-destructive" />
                                <span className="text-destructive font-semibold">Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </aside>
    );
}
