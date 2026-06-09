import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';
import { useTheme } from 'next-themes';
import { Sun, Moon, User, CreditCard, Bell, LogOut } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from '@/Components/ui/dropdown-menu';

interface TopbarProps {
    onToggleSidebar: () => void;
    sidebarCollapsed?: boolean;
    isMobile?: boolean;
}

export function Topbar({ onToggleSidebar, sidebarCollapsed = false, isMobile = false }: TopbarProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user ? ((auth.user as any).data || auth.user) : null;
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header
            className="admin-topbar"
            style={{
                left: isMobile ? 0 : (sidebarCollapsed ? '64px' : 'var(--sidebar-width)'),
                transition: 'left var(--transition-slow)',
            }}
        >
            {/* Left: Hamburger Menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                    style={{
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)', padding: 6, borderRadius: 'var(--radius-sm)',
                        display: 'flex', alignItems: 'center', transition: 'color var(--transition)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
            </div>

            {/* Right: User menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Notification Bell Icon */}
                <button
                    onClick={() => router.get('/admin/notifications')}
                    title="Notifications"
                    aria-label="View notifications"
                    style={{
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)', padding: 8,
                        borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center',
                        transition: 'color var(--transition), background var(--transition)',
                        position: 'relative'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.color = 'var(--text-primary)';
                        e.currentTarget.style.background = 'var(--surface-3)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.color = 'var(--text-muted)';
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <Bell size={18} />
                    <span style={{
                        position: 'absolute', top: 6, right: 6,
                        width: 6, height: 6, borderRadius: '50%',
                        background: 'var(--danger)',
                    }} />
                </button>

                {/* Theme Dropdown Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            title="Select Theme"
                            aria-label="Select theme"
                            style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: 'var(--text-muted)', padding: 8,
                                borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center',
                                transition: 'color var(--transition), background var(--transition)',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = 'var(--text-primary)';
                                e.currentTarget.style.background = 'var(--surface-3)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = 'var(--text-muted)';
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            {mounted && theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={8}>
                        <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center gap-2">
                            <Sun size={14} />
                            <span>Light</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center gap-2">
                            <Moon size={14} />
                            <span>Dark</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center gap-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 2 }}>
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                <line x1="8" y1="21" x2="16" y2="21" />
                                <line x1="12" y1="17" x2="12" y2="21" />
                            </svg>
                            <span>System</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile Dropdown */}
                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '4px 8px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    color: 'inherit',
                                    outline: 'none',
                                    transition: 'background var(--transition)',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-3)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                                <div style={{
                                    width: 28, height: 28,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--primary-600), var(--primary-400))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', fontWeight: 700, fontSize: 12,
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
                                <span className="hidden lg:inline" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                    {user.name}
                                </span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
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
                )}
            </div>
        </header>
    );
}
