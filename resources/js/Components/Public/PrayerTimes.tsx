import React, { useEffect, useState } from 'react';
import { Clock, Sun, Sunrise, Sunset, Moon } from 'lucide-react';

interface PrayerTiming {
    id: number;
    name: string;
    time: string;
}

interface PrayerTimesProps {
    prayer_timings?: PrayerTiming[];
}

// Calculates the sunset time in minutes since midnight for Karachi (24.92389, 67.08769)
function getSunsetMinutes(): number {
    const now = new Date();
    const latitude = 24.92389;
    const longitude = 67.08769;
    const timezone = 5; // UTC+5

    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const zenith = 90.833;
    const D2R = Math.PI / 180;
    const R2D = 180 / Math.PI;

    const lngHour = longitude / 15;
    const t = dayOfYear + ((18 - lngHour) / 24);

    const M = (0.9856 * t) - 3.289;

    let L = M + (1.916 * Math.sin(M * D2R)) + (0.020 * Math.sin(2 * M * D2R)) + 282.634;
    L = (L + 360) % 360;

    let RA = R2D * Math.atan(0.91764 * Math.tan(L * D2R));
    RA = (RA + 360) % 360;

    const Lquadrant = Math.floor(L / 90) * 90;
    const RAquadrant = Math.floor(RA / 90) * 90;
    RA = RA + (Lquadrant - RAquadrant);
    RA = RA / 15;

    const sinDec = 0.39782 * Math.sin(L * D2R);
    const cosDec = Math.cos(Math.asin(sinDec));

    const cosH = (Math.cos(zenith * D2R) - (sinDec * Math.sin(latitude * D2R))) / (cosDec * Math.cos(latitude * D2R));
    if (cosH < -1 || cosH > 1) {
        return 18 * 60 + 30; // fallback: 6:30 PM
    }

    const H = R2D * Math.acos(cosH) / 15;
    const T = H + RA - (0.06571 * t) - 6.622;

    let UT = T - lngHour;
    UT = (UT + 24) % 24;
    let localT = UT + timezone;
    localT = (localT + 24) % 24;

    return Math.floor(localT * 60);
}

// Formats the calculated sunset time into a 12-hour AM/PM string
function getSunsetFormatted(): string {
    const minutes = getSunsetMinutes();
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hrs >= 12 ? 'PM' : 'AM';
    const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
    const displayMins = mins.toString().padStart(2, '0');
    return `${displayHrs}:${displayMins} ${period}`;
}

// Parse a 12-hour time string like "05:20 AM" or "09:15 PM" into minutes-since-midnight.
// Automatically intercepts and calculates the exact sunset time if "غروب" (sunset) is encountered.
function parseToMinutes(timeStr: string): number | null {
    if (timeStr.includes('غروب') || timeStr.includes('sunset')) {
        return getSunsetMinutes();
    }
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridiem = match[3].toUpperCase();
    if (meridiem === 'AM' && hours === 12) hours = 0;
    if (meridiem === 'PM' && hours !== 12) hours += 12;
    return hours * 60 + minutes;
}

// Returns the index of the currently-active prayer based on local time.
// "Active" = the prayer whose time has most recently passed among parseable entries.
// Jummah (index 5) is only activated on Fridays within its window.
function getActivePrayerIndex(timings: PrayerTiming[]): number {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const isFriday = now.getDay() === 5; // 5 = Friday

    // Build list of { index, minutes } for parseable entries
    const parseable = timings
        .map((p, i) => ({ index: i, minutes: parseToMinutes(p.time) }))
        .filter(p => p.minutes !== null) as { index: number; minutes: number }[];

    // Check if it's Jummah time on a Friday
    const jumaEntry = timings.findIndex(p => p.name.toLowerCase().includes('jum'));
    if (jumaEntry !== -1 && isFriday) {
        const jumaMin = parseToMinutes(timings[jumaEntry].time);
        if (jumaMin !== null) {
            // Jummah active from its time until Asar time
            const asarEntry = parseable.find(p => timings[p.index].name.toLowerCase().includes('asr') || timings[p.index].name.toLowerCase().includes('asa'));
            const asarMin = asarEntry ? asarEntry.minutes : jumaMin + 90;
            if (currentMinutes >= jumaMin && currentMinutes < asarMin) {
                return jumaEntry;
            }
        }
    }

    // Find last prayer whose time has passed (excluding Jummah unless handled above)
    const nonJuma = parseable.filter(p => !timings[p.index].name.toLowerCase().includes('jum'));

    let activeIndex = nonJuma[0].index; // default: first prayer
    for (const entry of nonJuma) {
        if (currentMinutes >= entry.minutes) {
            activeIndex = entry.index;
        }
    }

    return activeIndex;
}

export default function PrayerTimes({ prayer_timings = [] }: PrayerTimesProps) {
    const defaultTimings: PrayerTiming[] = [
        { id: 1, name: 'فجر Fajar',     time: '05:20 AM' },
        { id: 2, name: 'ظهر Zuhar',     time: '02:00 PM' },
        { id: 3, name: 'عصر Asar',      time: '06:00 PM' },
        { id: 4, name: 'مغرب Maghrib',  time: `غروبِ آفتاب ` },
        { id: 5, name: 'عشاء Isha',     time: '09:15 PM' },
        { id: 6, name: 'جمعۃ Jummah',  time: '01:30 PM' }
    ];

    const activeTimings = prayer_timings.length > 0 ? prayer_timings.map(t => {
        const lower = t.name.toLowerCase();
        if (lower.includes('faj'))                                       return { ...t, name: 'فجر Fajar',    time: '05:20 AM' };
        if (lower.includes('dhu') || lower.includes('zoh') || lower.includes('zuh')) return { ...t, name: 'ظهر Zuhar',   time: '02:00 PM' };
        if (lower.includes('asr') || lower.includes('asa'))             return { ...t, name: 'عصر Asar',    time: '06:00 PM' };
        if (lower.includes('mag'))                                       return { ...t, name: 'مغرب Maghrib', time: `غروبِ آفتاب (${getSunsetFormatted()})` };
        if (lower.includes('ish'))                                       return { ...t, name: 'عشاء Isha',   time: '09:15 PM' };
        if (lower.includes('jum'))                                       return { ...t, name: 'جمعۃ Jummah', time: '01:30 PM' };
        return t;
    }) : defaultTimings;

    const [activePrayerIdx, setActivePrayerIdx] = useState<number>(() => getActivePrayerIndex(activeTimings));

    // Re-check every 30 seconds so the active card updates automatically
    useEffect(() => {
        const interval = setInterval(() => {
            setActivePrayerIdx(getActivePrayerIndex(activeTimings));
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const getIcon = (name: string, isActive: boolean) => {
        const lower = name.toLowerCase();
        const color = isActive ? 'white' : undefined;
        if (lower.includes('faj')) return <Sunrise size={18} style={{ color: color ?? 'var(--accent-500)' }} />;
        if (lower.includes('dhu') || lower.includes('zoh') || lower.includes('zuh')) return <Sun size={18} style={{ color: color ?? 'var(--accent-400)' }} />;
        if (lower.includes('asr') || lower.includes('asa')) return <Sun size={18} style={{ color: color ?? 'var(--accent-500)' }} />;
        if (lower.includes('mag')) return <Sunset size={18} style={{ color: color ?? 'var(--accent-600)' }} />;
        if (lower.includes('ish')) return <Moon size={18} style={{ color: color ?? 'var(--primary-300)' }} />;
        return <Clock size={18} style={{ color: color ?? 'var(--primary-400)' }} />;
    };

    return (
        <section 
            className="prayer-section"
            style={{
                background: 'var(--surface-1)',
                borderBottom: '1px solid var(--border)',
                padding: '20px 24px',
                position: 'relative',
                zIndex: 10
            }}
        >
            <div 
                className="prayer-container"
                style={{
                    maxWidth: 1200,
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                    flexWrap: 'wrap'
                }}
            >
                {/* Heading Strip */}
                <div 
                    className="prayer-heading"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        minWidth: 160,
                        flexShrink: 0
                    }}
                >
                    <span style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: 'var(--success)',
                        display: 'inline-block',
                        boxShadow: '0 0 10px var(--success)',
                        animation: 'pulseDot 2s ease-in-out infinite'
                    }}></span>
                    <span style={{
                        fontSize: '0.875rem',
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                        color: 'var(--text-primary)',
                        textTransform: 'uppercase'
                    }}>
                        Prayer Times:
                    </span>
                </div>

                {/* Horizontal scroll prayer cards */}
                <div
                    className="prayer-cards-scroll hide-scrollbar"
                    style={{
                        display: 'flex',
                        gap: 12,
                        overflowX: 'auto',
                        flexGrow: 1,
                        padding: '4px 0',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                >
                    {activeTimings.map((prayer, idx) => {
                        const isActive = idx === activePrayerIdx;
                        const isJuma = prayer.name.toLowerCase().includes('jum');
                        return (
                            <div
                                key={prayer.id}
                                style={{
                                    background: isActive
                                        ? 'linear-gradient(135deg, var(--primary-600), var(--primary-800))'
                                        : 'var(--surface-2)',
                                    color: isActive ? 'white' : 'var(--text-primary)',
                                    border: isActive
                                        ? '1px solid var(--primary-500)'
                                        : '1px solid var(--border)',
                                    borderRadius: 'var(--radius)',
                                    padding: '10px 18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    minWidth: 145,
                                    flexShrink: 0,
                                    boxShadow: isActive ? '0 4px 16px rgba(0, 0, 0, 0.2)' : 'none',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    if (!isActive) {
                                        e.currentTarget.style.borderColor = 'var(--primary-400)';
                                        e.currentTarget.style.background = 'var(--surface-3)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    if (!isActive) {
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                        e.currentTarget.style.background = 'var(--surface-2)';
                                    }
                                }}
                            >
                                {/* Active pulse ring */}
                                {isActive && (
                                    <div style={{
                                        position: 'absolute',
                                        top: 6, right: 8,
                                        width: 8, height: 8,
                                        borderRadius: '50%',
                                        background: 'var(--accent-400)',
                                        boxShadow: '0 0 8px var(--accent-400)',
                                        animation: 'pulseDot 1.5s ease-in-out infinite'
                                    }} />
                                )}

                                <div style={{
                                    background: isActive ? 'rgba(255,255,255,0.12)' : 'var(--surface-1)',
                                    padding: 6,
                                    borderRadius: 'var(--radius-sm)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {getIcon(prayer.name, isActive)}
                                </div>
                                <div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        opacity: isActive ? 0.95 : 0.6,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.04em'
                                    }}>
                                        {prayer.name}
                                        {isJuma && !isActive && (
                                            <span style={{
                                                fontSize: '0.6rem',
                                                background: 'var(--primary-500)',
                                                color: 'white',
                                                borderRadius: 100,
                                                padding: '1px 5px',
                                                marginLeft: 4,
                                                verticalAlign: 'middle',
                                                fontWeight: 700
                                            }}>FRI</span>
                                        )}
                                    </div>
                                    <div style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 800,
                                        color: isActive ? 'var(--accent-400)' : 'var(--primary-600)',
                                        marginTop: 2
                                    }}>
                                        {prayer.time}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                @keyframes pulseDot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: 0.5; transform: scale(1.4); }
                }
                .prayer-section {
                    background: var(--surface-1);
                    border-bottom: 1px solid var(--border);
                    padding: 20px 24px !important;
                    position: relative;
                    z-index: 10;
                }
                .prayer-container {
                    display: flex !important;
                    align-items: center !important;
                    flex-direction: row !important;
                    gap: 24px !important;
                }
                .prayer-heading {
                    display: flex !important;
                    align-items: center !important;
                    gap: 10px !important;
                    min-width: 160px !important;
                    flex-shrink: 0 !important;
                }
                .prayer-cards-scroll {
                    display: flex !important;
                    gap: 12px !important;
                    overflow-x: auto !important;
                    flex-grow: 1 !important;
                    padding: 4px 0 !important;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                    width: auto !important;
                }
                @media (max-width: 767px) {
                    .prayer-section {
                        padding: 16px 16px !important;
                    }
                    .prayer-container {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 12px !important;
                    }
                    .prayer-heading {
                        min-width: 100% !important;
                    }
                    .prayer-cards-scroll {
                        width: 100% !important;
                    }
                }
            `}</style>
        </section>
    );
}
