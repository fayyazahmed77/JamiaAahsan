import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

interface StudentHeaderProps {
    onMenuClick: () => void;
    isMobile: boolean;
    isRTL?: boolean;
}

function BellIcon() {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
}
function MenuIcon() {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
}
function MoonIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
}
function SunIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
}
function ChevronDown() {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>;
}

export function StudentHeader({ onMenuClick, isMobile, isRTL = false }: StudentHeaderProps) {
    const page = usePage() as any;
    const student = page.props.student_auth ?? page.props.student ?? null;
    const unreadCount = page.props.unread_count ?? 0;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [darkMode, setDarkMode] = React.useState(() => document.documentElement.classList.contains('dark'));

    const toggleTheme = () => {
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            html.setAttribute('data-theme', 'light');
            setDarkMode(false);
        } else {
            html.classList.add('dark');
            html.setAttribute('data-theme', 'dark');
            setDarkMode(true);
        }
    };

    const handleLogout = () => {
        setDropdownOpen(false);
        router.post('/student/logout');
    };

    return (
        <header style={{
            position: 'sticky', top: 0, zIndex: 30,
            background: 'var(--surface-2)',
            borderBottom: '1px solid var(--border)',
            padding: '0 20px',
            height: 60,
            display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: 'var(--shadow-sm)',
        }}>
            {/* Mobile menu toggle */}
            {isMobile && (
                <button
                    onClick={onMenuClick}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4 }}
                >
                    <MenuIcon />
                </button>
            )}

            {/* Institute name (desktop only) */}
            {!isMobile && (
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    🕌 Jamia Arabia Ahsan Ul Uloom
                </div>
            )}

            <div style={{ flex: 1 }} />

            {/* Language toggle */}
            <button
                onClick={() => router.put('/student/settings', { language: isRTL ? 'en' : 'ur' } as any)}
                style={{
                    background: 'none', border: '1px solid var(--border)',
                    borderRadius: 8, cursor: 'pointer', padding: '5px 10px',
                    color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700,
                    minWidth: 40,
                }}
                title={isRTL ? 'Switch to English' : 'اردو میں تبدیل کریں'}
            >
                {isRTL ? 'EN' : 'UR'}
            </button>

            {/* Theme toggle */}
            <button
                onClick={toggleTheme}
                style={{
                    background: 'none', border: '1px solid var(--border)',
                    borderRadius: 8, cursor: 'pointer', padding: '6px 8px',
                    color: 'var(--text-secondary)', display: 'flex', alignItems: 'center',
                }}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Notification bell */}
            <Link
                href="/student/notifications"
                style={{
                    position: 'relative', display: 'flex', alignItems: 'center',
                    padding: '6px 8px', borderRadius: 8, color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                }}
            >
                <BellIcon />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute', top: 2, right: 2,
                        background: '#ef4444', color: 'white',
                        fontSize: '0.625rem', fontWeight: 700,
                        width: 16, height: 16, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </Link>

            {/* Student avatar dropdown */}
            {student && (
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setDropdownOpen(o => !o)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            background: 'none', border: '1px solid var(--border)',
                            borderRadius: 8, cursor: 'pointer', padding: '4px 10px 4px 4px',
                            color: 'var(--text-primary)',
                        }}
                    >
                        <div style={{
                            width: 30, height: 30, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #1e6b3e, #2d9160)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden', color: 'white', fontWeight: 700, fontSize: 13,
                        }}>
                            {student.profile_photo_url
                                ? <img src={student.profile_photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : (student.name?.[0] || 'S').toUpperCase()}
                        </div>
                        {!isMobile && (
                            <span style={{ fontSize: '0.8125rem', fontWeight: 500, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {student.name}
                            </span>
                        )}
                        <ChevronDown />
                    </button>

                    {dropdownOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setDropdownOpen(false)}
                            />
                            <div style={{
                                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                                width: 220, background: 'var(--surface-2)',
                                border: '1px solid var(--border)',
                                borderRadius: 10, boxShadow: 'var(--shadow-md)',
                                zIndex: 50, overflow: 'hidden',
                            }}>
                                {/* Header */}
                                <div style={{
                                    padding: '12px 14px', borderBottom: '1px solid var(--border)',
                                    background: 'linear-gradient(135deg, #1e6b3e15, transparent)',
                                }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{student.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#1e6b3e', fontWeight: 500 }}>{student.student_id_number}</div>
                                </div>
                                {/* Links */}
                                {[
                                    { href: '/student/profile', label: '👤 My Profile' },
                                    { href: '/student/my-id', label: '🪪 Student ID' },
                                    { href: '/student/settings', label: '⚙️ Settings' },
                                ].map(item => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setDropdownOpen(false)}
                                        style={{
                                            display: 'block', padding: '9px 14px',
                                            fontSize: '0.875rem', color: 'var(--text-secondary)',
                                            textDecoration: 'none',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-3)')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                <div style={{ borderTop: '1px solid var(--border)', padding: '4px 0' }}>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            width: '100%', textAlign: 'left',
                                            display: 'block', padding: '9px 14px',
                                            fontSize: '0.875rem', color: '#ef4444',
                                            background: 'none', border: 'none', cursor: 'pointer',
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.background = '#ef44441a')}
                                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        🚪 Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
