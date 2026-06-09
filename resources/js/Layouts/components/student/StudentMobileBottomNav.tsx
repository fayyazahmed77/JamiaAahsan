import React from 'react';
import { Link } from '@inertiajs/react';

const tabs = [
    { href: '/student/dashboard', label: 'Home',     icon: '🏠' },
    { href: '/student/courses',   label: 'Courses',  icon: '📖' },
    { href: '/student/classes',   label: 'Classes',  icon: '📅' },
    { href: '/student/assignments', label: 'Tasks',  icon: '📝' },
    { href: '/student/profile',   label: 'Profile',  icon: '👤' },
];

export function StudentMobileBottomNav() {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <nav style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            height: 64, background: 'var(--surface-2)',
            borderTop: '1px solid var(--border)',
            display: 'flex', alignItems: 'center',
            zIndex: 40, boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        }}>
            {tabs.map(tab => {
                const active = currentPath === tab.href || currentPath.startsWith(tab.href + '/');
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        style={{
                            flex: 1, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: 2,
                            padding: '6px 4px',
                            color: active ? '#1e6b3e' : 'var(--text-muted)',
                            textDecoration: 'none', fontSize: '0.65rem', fontWeight: active ? 700 : 400,
                            transition: 'color 0.15s',
                        }}
                    >
                        <span style={{ fontSize: 22, lineHeight: 1 }}>{tab.icon}</span>
                        <span>{tab.label}</span>
                        {active && (
                            <span style={{
                                position: 'absolute', top: 0,
                                width: 36, height: 3,
                                background: '#1e6b3e',
                                borderRadius: '0 0 4px 4px',
                            }} />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
