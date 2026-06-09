import React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, ShieldCheck, PhoneCall, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300">
            {/* LEFT SIDE: ISLAMIC BRANDING PANEL (50% width on md+, hidden on mobile) */}
            <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-[#062c16] via-[#0d4d29] to-[#041c0e] overflow-hidden flex-col justify-between p-12 text-white">
                {/* Intricate Islamic Geometric Background Pattern Overlay */}
                <div 
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '24px 24px',
                    }}
                />
                
                {/* SVG Decorative Geometric Arch/Mandala in center background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-15 pointer-events-none">
                    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full text-emerald-100 animate-[spin_120s_linear_infinite]">
                        <circle cx="50" cy="50" r="45" />
                        <circle cx="50" cy="50" r="35" />
                        <path d="M 50 5 L 50 95 M 5 50 L 95 50 M 18.2 18.2 L 81.8 81.8 M 18.2 81.8 L 81.8 18.2" />
                        <polygon points="50,10 90,50 50,90 10,50" />
                        <polygon points="50,15 85,50 50,85 15,50" />
                        <polygon points="25,25 75,25 75,75 25,75" />
                        <polygon points="50,5 65,35 95,50 65,65 50,95 35,65 5,50 35,35" />
                    </svg>
                </div>

                {/* Animated Gradient Glow Orbs */}
                <div aria-hidden="true" className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
                <div aria-hidden="true" className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />

                {/* Left Panel Header: Logo & Institution Name */}
                <div className="relative z-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-emerald-950 text-2xl font-bold shadow-lg shadow-amber-500/20">
                        🕌
                    </div>
                    <div>
                        <h2 className="font-extrabold text-lg tracking-tight leading-tight uppercase font-sans">
                            Jamia Arabia
                        </h2>
                        <p className="text-xs text-amber-400 font-semibold tracking-wider uppercase font-mono">
                            Ahsan Ul Uloom
                        </p>
                    </div>
                </div>

                {/* Left Panel Center Content: Slogans & Beautiful Mosque Vector Silhouette */}
                <div className="relative z-10 my-auto flex flex-col items-start max-w-lg">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="px-3 py-1 bg-emerald-900/50 border border-emerald-500/30 rounded-full text-xs text-amber-400 font-semibold mb-4 backdrop-blur-sm tracking-wide"
                    >
                        Administration Portal
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4"
                        style={{ fontFamily: 'var(--font-heading), serif' }}
                    >
                        Empowering Islamic Education <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">Through Technology</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-emerald-100/80 text-sm leading-relaxed mb-8"
                    >
                        A secure, unified authentication system safeguarding scholarly records, student admissions, and administration databases for Jamia Arabia Ahsan Ul Uloom.
                    </motion.p>

                    {/* Mosque Silhouette SVG aligned at the bottom of center text */}
                    <div className="w-full h-32 opacity-25 mt-2">
                        <svg viewBox="0 0 300 100" className="w-full h-full fill-current text-emerald-100" preserveAspectRatio="none">
                            {/* Mosque domes & minarets */}
                            <rect x="0" y="90" width="300" height="10" />
                            <path d="M10,90 L10,30 L15,20 L20,30 L20,90 Z" />
                            <path d="M13,30 L17,30 L15,10 Z" />
                            <path d="M30,90 L30,40 C30,20 50,20 50,40 L50,90 Z" />
                            <path d="M40,22 L40,15 L38,15 L40,5 L42,15 L40,15 Z" />
                            
                            <path d="M130,90 L130,10 L135,0 L140,10 L140,90 Z" />
                            <path d="M132,15 L138,15 L135,5 Z" />
                            
                            <path d="M150,90 L150,30 C150,5 190,5 190,30 L190,90 Z" />
                            <path d="M170,8 L170,0 L168,0 L170,-10 L172,0 L170,0 Z" />
                            
                            <path d="M200,90 L200,10 L205,0 L210,10 L210,90 Z" />
                            <path d="M202,15 L208,15 L205,5 Z" />
                            
                            <path d="M250,90 L250,40 C250,20 270,20 270,40 L270,90 Z" />
                            <path d="M260,22 L260,15 L258,15 L260,5 L262,15 L260,15 Z" />
                            <path d="M280,90 L280,30 L285,20 L290,30 L290,90 Z" />
                            <path d="M283,30 L287,30 L285,10 Z" />
                        </svg>
                    </div>
                </div>

                {/* Left Panel Footer: Language Selector & Support Contacts */}
                <div className="relative z-10 flex flex-wrap justify-between items-center gap-4 text-xs text-emerald-100/60 border-t border-emerald-500/20 pt-6">
                    <div className="flex items-center gap-2">
                        <PhoneCall size={12} className="text-amber-400" />
                        <span>Support Line: 0334 3969964</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Globe size={12} className="text-amber-400" />
                        <span className="cursor-pointer hover:text-white transition-colors">English</span>
                        <span>•</span>
                        <span className="cursor-pointer hover:text-white transition-colors" style={{ fontFamily: 'var(--font-urdu)' }}>اردو</span>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: GLASSMORPHISM AUTH CARD PANEL (50% on desktop, 100% on mobile) */}
            <div className="w-full md:w-1/2 flex flex-col justify-between min-h-screen relative p-6 sm:p-12 md:p-16">
                
                {/* Header Actions (Theme Toggle for desktop) */}
                <div className="flex justify-between items-center mb-8">
                    {/* Mobile Logo (only visible on mobile) */}
                    <div className="flex md:hidden items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#0d4d29] to-emerald-800 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                            🕌
                        </div>
                        <h2 className="font-extrabold text-sm text-[var(--text-primary)] leading-tight uppercase font-sans">
                            Jamia Ahsan
                        </h2>
                    </div>

                    {/* Theme Toggle Switcher */}
                    <div className="ml-auto">
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--border)] hover:bg-[var(--surface-3)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 cursor-pointer"
                                aria-label="Toggle theme"
                                title="Toggle Theme"
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Glassmorphic Authentication Card Container */}
                <div className="my-auto w-full max-w-[440px] mx-auto">
                    <div className="rounded-2xl border border-white/20 dark:border-white/5 bg-white/70 dark:bg-[#0c2a50]/40 backdrop-blur-xl shadow-xl p-8 relative overflow-hidden transition-all duration-300">
                        {/* Shadow accent glows under the card */}
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                        {/* Title and Subtitle dynamically injected inside layout */}
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)] mb-1">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-xs text-[var(--text-muted)] font-medium">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        {/* Form contents */}
                        <div className="relative z-10">
                            {children}
                        </div>
                    </div>
                </div>

                {/* Footer details: Session indicator and Copyright */}
                <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[var(--text-muted)] border-t border-[var(--border)] pt-6">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <ShieldCheck size={14} />
                        <span>AES-256 Session Encryption Active</span>
                    </div>
                    <div className="text-center sm:text-right">
                        <span>© {new Date().getFullYear()} Jamia Arabia Ahsan Ul Uloom</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
