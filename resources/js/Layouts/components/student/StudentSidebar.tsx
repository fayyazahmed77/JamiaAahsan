import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';

interface SidebarProps {
    open: boolean;
    isMobile: boolean;
    onClose: () => void;
    isRTL?: boolean;
}

const NavSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 4 }}>
        <div style={{
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
            color: 'var(--text-muted)', textTransform: 'uppercase',
            padding: '12px 16px 4px',
        }}>
            {title}
        </div>
        {children}
    </div>
);

const NavLink = ({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) => (
    <Link
        href={href}
        style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 14px', margin: '1px 8px', borderRadius: 8,
            color: active ? 'var(--primary-600)' : 'var(--text-secondary)',
            background: active ? 'var(--primary-50)' : 'transparent',
            fontWeight: active ? 600 : 400,
            fontSize: '0.875rem',
            textDecoration: 'none',
            transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--surface-3)'; }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
        <span style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }}>{icon}</span>
        <span>{label}</span>
    </Link>
);

// SVG Icons
const Icons = {
    Dashboard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    Courses:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    Classes:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    Attendance:() => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="20 6 9 17 4 12"/></svg>,
    Assignment:() => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    Exams:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    Results:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    Hifz:      () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
    Quran:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    Materials: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    Notices:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    Profile:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    IdCard:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 9h4M14 13h4"/></svg>,
    Admission: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
    Certificate:()=> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
    Settings:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    Support:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    Logout:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

export function StudentSidebar({ open, isMobile, onClose, isRTL = false }: SidebarProps) {
    const page = usePage() as any;
    const student = page.props.student_auth ?? page.props.student ?? null;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');

    const handleLogout = () => {
        router.post('/student/logout');
    };

    const sidebarStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        ...(isRTL ? { right: 0 } : { left: 0 }),
        height: '100vh',
        width: 260,
        background: 'var(--surface-2)',
        borderRight: isRTL ? 'none' : '1px solid var(--border)',
        borderLeft: isRTL ? '1px solid var(--border)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        overflowY: 'auto',
        transition: 'transform 0.3s ease',
        transform: isMobile
            ? open
                ? 'translateX(0)'
                : isRTL ? 'translateX(100%)' : 'translateX(-100%)'
            : 'translateX(0)',
    };

    return (
        <aside style={sidebarStyle}>
            {/* Logo */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '18px 16px', borderBottom: '1px solid var(--border)',
                flexShrink: 0,
            }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                    background: 'linear-gradient(135deg, #1e6b3e, #2d9160)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: 18, fontWeight: 700,
                }}>
                    🕌
                </div>
                <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>Jamia Arabia</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Student Portal</div>
                </div>
            </div>

            {/* Student mini card */}
            {student && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px', margin: '8px', borderRadius: 10,
                    background: 'linear-gradient(135deg, #1e6b3e15, #2d916015)',
                    border: '1px solid #1e6b3e30',
                }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #1e6b3e, #2d9160)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', color: 'white', fontWeight: 700, fontSize: 14,
                    }}>
                        {student.profile_photo_url
                            ? <img src={student.profile_photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : (student.name?.[0] || 'S').toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {student.name}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: '#1e6b3e', fontWeight: 500 }}>
                            {student.student_id_number}
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav style={{ flex: 1, paddingBottom: 16 }}>
                <NavLink href="/student/dashboard" icon={<Icons.Dashboard />} label="Dashboard" active={currentPath === '/student/dashboard'} />

                <NavSection title="🎓 Academic Center">
                    <NavLink href="/student/courses"    icon={<Icons.Courses />}    label="My Courses"    active={isActive('/student/courses')} />
                    <NavLink href="/student/classes"    icon={<Icons.Classes />}    label="My Classes"    active={isActive('/student/classes')} />
                    <NavLink href="/student/attendance" icon={<Icons.Attendance />} label="Attendance"    active={isActive('/student/attendance')} />
                    <NavLink href="/student/assignments"icon={<Icons.Assignment />} label="Assignments"   active={isActive('/student/assignments')} />
                    <NavLink href="/student/exams"      icon={<Icons.Exams />}      label="Exams"         active={isActive('/student/exams')} />
                    <NavLink href="/student/results"    icon={<Icons.Results />}    label="Results"       active={isActive('/student/results')} />
                </NavSection>

                <NavSection title="🕌 Islamic Learning">
                    <NavLink href="/student/hifz"       icon={<Icons.Hifz />}      label="Hifz Progress" active={isActive('/student/hifz')} />
                    <NavLink href="/student/materials?category=book" icon={<Icons.Quran />} label="Quran Studies" active={false} />
                    <NavLink href="/student/materials"  icon={<Icons.Materials />}  label="Islamic Resources" active={isActive('/student/materials')} />
                </NavSection>

                <NavSection title="📚 Resources">
                    <NavLink href="/student/notices"    icon={<Icons.Notices />}   label="Notices"        active={isActive('/student/notices')} />
                </NavSection>

                <NavSection title="👤 My Account">
                    <NavLink href="/student/profile"    icon={<Icons.Profile />}    label="My Profile"    active={isActive('/student/profile')} />
                    <NavLink href="/student/my-id"      icon={<Icons.IdCard />}     label="Student ID"    active={isActive('/student/my-id')} />
                    <NavLink href="/student/admission"  icon={<Icons.Admission />}  label="Admission"     active={isActive('/student/admission')} />
                    <NavLink href="/student/certificates" icon={<Icons.Certificate />} label="Certificates" active={isActive('/student/certificates')} />
                    <NavLink href="/student/settings"   icon={<Icons.Settings />}   label="Settings"      active={isActive('/student/settings')} />
                </NavSection>

                <NavSection title="🎫 Help">
                    <NavLink href="/student/support"    icon={<Icons.Support />}   label="Support Center" active={isActive('/student/support')} />
                </NavSection>
            </nav>

            {/* Logout */}
            <div style={{ padding: '8px 8px 12px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '8px 14px', borderRadius: 8, border: 'none',
                        background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)',
                        fontSize: '0.875rem', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#ef44441a')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                    <Icons.Logout />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
