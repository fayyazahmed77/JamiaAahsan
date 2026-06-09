import React from 'react';
import { Play, Tv, Calendar, Clock, MapPin, User, Rss, Info } from 'lucide-react';

interface BayanatEvent {
    id: number;
    day: string;
    month: string;
    title: string;
    time: string;
    speaker: string;
    location: string;
    type: 'live' | 'recorded' | 'scheduled';
}

export default function BayanatSection() {
    // Exact events matching the image dates & schedules
    const latestEvents: BayanatEvent[] = [
        {
            id: 1,
            day: '26',
            month: 'Jun',
            title: 'Shab-e-Juma Lecture & Tazkiyah Session',
            time: '08:30 PM (After Isha)',
            speaker: 'Maulana Dr. Muhammad Anas Adil',
            location: 'Jamia Ahsan Main Auditorium',
            type: 'scheduled'
        },
        {
            id: 2,
            day: '26',
            month: 'Jun',
            title: 'Weekly Friday Sermon (Khutbah Juma)',
            time: '01:15 PM',
            speaker: 'Maulana Dr. Muhammad Anas Adil',
            location: 'Jamia Ahsan Grand Mosque',
            type: 'scheduled'
        },
        {
            id: 3,
            day: '04',
            month: 'Jul',
            title: 'Dars-e-Hadith (Mishkat al-Masabih Series)',
            time: '05:00 PM (After Asr)',
            speaker: 'Mufti Ahmad Ashraf',
            location: 'Online / Main Prayer Hall',
            type: 'scheduled'
        }
    ];

    return (
        <section style={{ 
            padding: '80px 24px', 
            background: 'var(--bg)',
            borderBottom: '1px solid var(--border)'
        }}>
            <div style={{ 
                maxWidth: 1200, 
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 48
            }}>
                {/* Left side: Live Bayanat */}
                <div>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginBottom: 24 
                    }}>
                        <h3 style={{ 
                            fontSize: '1.5rem', 
                            fontWeight: 800, 
                            color: 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10
                        }}>
                            <span style={{ 
                                width: 12, 
                                height: 12, 
                                borderRadius: '50%', 
                                background: 'var(--danger)', 
                                display: 'inline-block',
                                animation: 'pulse-glow-danger 1.5s infinite'
                            }} className="live-badge-pulse"></span>
                            Live Bayanat
                        </h3>
                        <span style={{ 
                            background: 'var(--danger-bg)', 
                            color: 'var(--danger)', 
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: 100,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em'
                        }}>
                            Live Now
                        </span>
                    </div>

                    {/* Premium Live Video Mock Player */}
                    <div style={{
                        background: 'var(--primary-950)',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        position: 'relative',
                        aspectRatio: '16/9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.3s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.01)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {/* Stream Overlay Background — pure CSS, no image file needed */}
                        <div style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(160deg, hsl(215,60%,10%) 0%, hsl(215,50%,6%) 40%, hsl(215,50%,5%) 100%)',
                            opacity: 1
                        }}>
                            {/* Decorative arch pattern */}
                            <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.12 }} viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                                <path d="M200 180 Q200 100 130 100 Q60 100 60 180" fill="none" stroke="hsl(38,90%,60%)" strokeWidth="2"/>
                                <path d="M200 180 Q200 100 270 100 Q340 100 340 180" fill="none" stroke="hsl(38,90%,60%)" strokeWidth="2"/>
                                <path d="M200 100 Q200 40 200 40" fill="none" stroke="hsl(38,90%,60%)" strokeWidth="1.5"/>
                                <circle cx="200" cy="38" r="6" fill="hsl(38,90%,60%)" opacity="0.6"/>
                                <line x1="60" y1="180" x2="340" y2="180" stroke="hsl(38,90%,60%)" strokeWidth="1"/>
                                <line x1="0" y1="225" x2="400" y2="225" stroke="hsl(38,90%,60%)" strokeWidth="0.5"/>
                            </svg>
                        </div>

                        {/* Pulsing play overlay */}
                        <div style={{
                            position: 'relative',
                            zIndex: 10,
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: 'var(--danger)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 25px rgba(239, 68, 68, 0.6)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <Play size={24} fill="white" style={{ color: 'white', marginLeft: 4 }} />
                        </div>

                        {/* Title Overlays */}
                        <div style={{
                            position: 'absolute',
                            bottom: 16,
                            left: 16,
                            right: 16,
                            zIndex: 10,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end'
                        }}>
                            <div>
                                <span style={{
                                    fontSize: '0.6875rem',
                                    fontWeight: 700,
                                    color: 'var(--accent-400)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    Weekly Friday Khutbah
                                </span>
                                <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, margin: '4px 0 0' }}>
                                    Maulana Dr. Muhammad Anas Adil
                                </h4>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Tv size={12} />
                                1080p
                            </span>
                        </div>
                    </div>

                    {/* Broadcaster announcement marquee alert block */}
                    <div style={{
                        background: 'hsl(0, 60%, 8%)',
                        border: '1px solid hsl(0, 70%, 25%)',
                        borderRadius: 'var(--radius)',
                        padding: '12px 16px',
                        marginTop: 16,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12
                    }}>
                        <Info size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.85)' }}>
                            <div style={{
                                display: 'inline-block',
                                animation: 'marquee 15s linear infinite',
                                paddingLeft: '100%'
                            }}>
                                The live video stream will broadcast automatically at the scheduled Juma and Shab-e-Juma timings. Please refresh if player is idle.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side: Latest Bayanat */}
                <div>
                    <h3 style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 800, 
                        color: 'var(--text-primary)',
                        marginBottom: 24,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10
                    }}>
                        <Calendar size={22} style={{ color: 'var(--primary-500)' }} />
                        Latest Bayanat & Schedules
                    </h3>

                    {/* Scrollable list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {latestEvents.map(event => (
                            <div 
                                key={event.id}
                                style={{
                                    background: 'var(--surface-1)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '16px 20px',
                                    display: 'flex',
                                    gap: 20,
                                    alignItems: 'center',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = 'var(--primary-400)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {/* Calendar Date Badge */}
                                <div style={{
                                    border: '2px solid var(--primary-500)',
                                    borderRadius: 'var(--radius)',
                                    width: 60,
                                    height: 60,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'var(--bg)',
                                    flexShrink: 0
                                }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary-600)', lineHeight: 1 }}>
                                        {event.day}
                                    </span>
                                    <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginTop: 2 }}>
                                        {event.month}
                                    </span>
                                </div>

                                {/* Event Info */}
                                <div style={{ flexGrow: 1, minWidth: 0 }}>
                                    <h4 style={{ 
                                        fontSize: '0.9375rem', 
                                        fontWeight: 700, 
                                        color: 'var(--text-primary)',
                                        marginBottom: 6,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {event.title}
                                    </h4>
                                    
                                    {/* Meta Items Row */}
                                    <div style={{ 
                                        display: 'flex', 
                                        flexWrap: 'wrap', 
                                        gap: '12px 16px',
                                        fontSize: '0.75rem',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <User size={12} style={{ color: 'var(--accent-500)' }} />
                                            {event.speaker}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Clock size={12} style={{ color: 'var(--primary-400)' }} />
                                            {event.time}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <MapPin size={12} style={{ color: 'var(--info)' }} />
                                            {event.location}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Embed animations directly */}
            <style>{`
                @keyframes pulse-glow-danger {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                    50%       { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
                }
                @keyframes marquee {
                    0%   { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-100%, 0, 0); }
                }
            `}</style>
        </section>
    );
}
