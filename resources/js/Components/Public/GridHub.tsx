import React from 'react';
import { Link } from '@inertiajs/react';
import { Video, Award, Bell, Monitor, Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';

export default function GridHub() {
    return (
        <section style={{
            padding: '80px 24px',
            background: 'var(--bg)',
            borderBottom: '1px solid var(--border)'
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 24
                }}>
                    {/* Grid Left/Center Panel (4 Small Cards) */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: 24,
                        gridColumn: 'span 2'
                    }}>
                        {/* 1. Short Clips Card */}
                        <div style={{
                            background: 'hsl(195, 85%, 96%)',
                            border: '1px solid hsl(195, 80%, 88%)',
                            borderRadius: 'var(--radius-xl)',
                            padding: '28px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'hsl(195, 85%, 88%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(195, 85%, 45%)' }}>
                                <Video size={20} />
                            </div>
                            <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'hsl(195, 85%, 25%)', margin: 0 }}>Short Clips</h4>
                            <p style={{ fontSize: '0.8125rem', color: 'hsl(195, 40%, 35%)', lineHeight: 1.5, margin: 0 }}>
                                Browse short, informative and spiritual clips extracted from weekly sermons & lectures.
                            </p>
                            <Link href="/media/video" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'hsl(195, 85%, 45%)', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                                View Clips <ArrowRight size={12} />
                            </Link>
                        </div>

                        {/* 2. About Us Card */}
                        <div style={{
                            background: 'var(--primary-50)',
                            border: '1px solid var(--primary-100)',
                            borderRadius: 'var(--radius-xl)',
                            padding: '28px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-600)' }}>
                                <Award size={20} />
                            </div>
                            <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--primary-700)', margin: 0 }}>About Us</h4>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                                Learn about the history, vision and authentic scholarly foundation of Jamia Ahsan Islamic Institute.
                            </p>
                            <Link href="/about/history" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-600)', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                                Our History <ArrowRight size={12} />
                            </Link>
                        </div>

                        {/* 3. What's new Card */}
                        <div style={{
                            background: 'hsl(38, 85%, 96%)',
                            border: '1px solid hsl(38, 80%, 88%)',
                            borderRadius: 'var(--radius-xl)',
                            padding: '28px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'hsl(38, 85%, 88%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-600)' }}>
                                <Bell size={20} />
                            </div>
                            <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'hsl(38, 85%, 25%)', margin: 0 }}>What's New</h4>
                            <p style={{ fontSize: '0.8125rem', color: 'hsl(38, 40%, 35%)', lineHeight: 1.5, margin: 0 }}>
                                Read important notifications, monthly announcements, new publications, and holiday schedules.
                            </p>
                            <Link href="/about/history" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-600)', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                                Read Announcements <ArrowRight size={12} />
                            </Link>
                        </div>

                        {/* 4. Online Dars-e-Nizami Card */}
                        <div style={{
                            background: 'hsl(210, 80%, 96%)',
                            border: '1px solid hsl(210, 70%, 88%)',
                            borderRadius: 'var(--radius-xl)',
                            padding: '28px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'hsl(210, 80%, 88%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(210, 80%, 45%)' }}>
                                <Monitor size={20} />
                            </div>
                            <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'hsl(210, 80%, 25%)', margin: 0 }}>Online Dars-e-Nizami</h4>
                            <p style={{ fontSize: '0.8125rem', color: 'hsl(210, 40%, 35%)', lineHeight: 1.5, margin: 0 }}>
                                Enroll in our digital distance-learning theology programs designed for working professionals.
                            </p>
                            <Link href="/education" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'hsl(210, 80%, 45%)', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                                Online Courses <ArrowRight size={12} />
                            </Link>
                        </div>
                    </div>

                    {/* 5. Right Panel: Contact Us Form (Double Height visual card) */}
                    <div style={{
                        background: 'var(--surface-1)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '32px',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 24
                    }}>
                        <div>
                            <h4 style={{ fontSize: '1.1875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Contact Us</h4>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                                Send your suggestions, request admissions support, or ask digital general feedback.
                            </p>
                        </div>

                        {/* Quick Contact Info Strip */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.8125rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <MapPin size={16} style={{ color: 'var(--primary-500)', flexShrink: 0 }} />
                                <span>Jamia Ahsan Campus, Lahore, Pakistan</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Phone size={16} style={{ color: 'var(--primary-500)', flexShrink: 0 }} />
                                <a href="tel:03343969964" style={{ color: 'inherit' }}>0334-3969964</a>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <Mail size={16} style={{ color: 'var(--primary-500)', flexShrink: 0 }} />
                                <a href="mailto:info@jamiaahsan.edu.pk" style={{ color: 'inherit' }}>info@jamiaahsan.edu.pk</a>
                            </div>
                        </div>

                        {/* Simplified Mock Submission Form */}
                        <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }} onSubmit={e => e.preventDefault()}>
                            <input 
                                type="text" 
                                placeholder="Your Name" 
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.8125rem',
                                    background: 'var(--surface-2)'
                                }}
                            />
                            <input 
                                type="email" 
                                placeholder="Your Email" 
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.8125rem',
                                    background: 'var(--surface-2)'
                                }}
                            />
                            <textarea 
                                placeholder="Write message..." 
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.8125rem',
                                    background: 'var(--surface-2)',
                                    resize: 'none'
                                }}
                            />
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                style={{
                                    borderRadius: 100,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    padding: '10px 0'
                                }}
                            >
                                <Send size={14} />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
