import React from 'react';
import { useAudio } from '@/Layouts/PublicLayout';
import { Play, Pause, Headphones, Calendar } from 'lucide-react';
import type { Audio as AudioType } from '@/types/models';

// Local audio item interface compatible with both mock data and real AudioType
interface AudioItem {
    id: number;
    title: string;
    url?: string;
    description?: string | null;
    publish_date?: string | null;
    views?: number;
    thumbnail_uri?: string | null;
    speaker?: { id: number; name: string; [key: string]: any } | null;
    category?: { id: number; name: string; [key: string]: any } | null;
}

interface RecentBayanatProps {
    featured_audio?: AudioItem[];
}

export default function RecentBayanat({ featured_audio = [] }: RecentBayanatProps) {
    const { playTrack, currentTrack, isPlaying, togglePlay } = useAudio();

    const defaultTracks: AudioItem[] = [
        {
            id: 101,
            title: 'خطاب جمعہ',
            description: 'Friday Sermon Series — Tazkiyah & Islamic Ethics in Modern Times.',
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            publish_date: '2024-10-04',
            speaker: { id: 1, name: 'Molana Muhammad Anwar Shah Sahab' },
            category: { id: 1, name: 'Friday Sermon' }
        },
        {
            id: 102,
            title: 'شب جمعہ',
            description: 'Thursday Night Tazkiyah — Purifying the Soul for the Eternal Journey.',
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            publish_date: '2025-07-26',
            speaker: { id: 1, name: 'Molana Muhammad Anwar Shah Sahab' },
            category: { id: 2, name: 'Thursday Lecture' }
        }
    ];

    const activeTracks = featured_audio.length >= 2 ? featured_audio.slice(0, 2) : defaultTracks;

    const handlePlayPause = (track: AudioItem) => {
        if (currentTrack?.id === track.id) {
            togglePlay();
        } else {
            playTrack(track as AudioType, activeTracks as AudioType[]);
        }
    };

    const formatDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true });
        } catch {
            return dateStr;
        }
    };

    return (
        <section style={{
            position: 'relative',
            padding: '60px 24px 56px',
            /* The photo as a very light watermark */
            backgroundImage: 'url("/images/1920x670.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundAttachment: 'local',
            overflow: 'hidden',
            borderBottom: '1px solid var(--border)'
        }}>
            {/* White semi-transparent overlay — keeps it LIGHT like the image */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'var(--neutral-100)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 10 }}>

                {/* Section Title */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h3 style={{
                        fontSize: '1.875rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        margin: 0,
                        letterSpacing: '-0.01em'
                    }}>
                        Recent Bayanat
                    </h3>
                </div>

                {/* Two-column card grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 32
                }}>
                    {activeTracks.map((track, idx) => {
                        const isCurrent = currentTrack?.id === track.id;
                        const isCurrentPlaying = isCurrent && isPlaying;

                        return (
                            <div
                                key={track.id}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.78)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 8,
                                    padding: '20px 22px 18px',
                                    boxShadow: 'var(--shadow-sm)',
                                    transition: 'box-shadow 0.2s, transform 0.2s'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.10)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {/* Urdu title — large, right-aligned like the image */}
                                <div style={{
                                    fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif",
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: 'var(--text-primary)',
                                    textAlign: 'right',
                                    direction: 'rtl',
                                    marginBottom: 6,
                                    lineHeight: 1.6
                                }}>
                                    {track.title}
                                </div>

                                {/* Speaker name — Sapphire blue, branding matched */}
                                <div style={{
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    color: 'var(--primary-600)',
                                    marginBottom: 14
                                }}>
                                    {track.speaker?.name || 'Molana Muhammad Anwar Shah Sahab'}
                                </div>

                                {/* Native HTML audio player — exactly matches the image */}
                                <audio
                                    controls
                                    src={track.url}
                                    style={{ width: '100%', height: 36, accentColor: 'var(--primary-600)' }}
                                    onPlay={() => {
                                        if (currentTrack?.id !== track.id) {
                                            playTrack(track as AudioType, activeTracks as AudioType[]);
                                        }
                                    }}
                                />

                                {/* Date row */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    marginTop: 12,
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                                    {formatDate(track.publish_date || '')}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
