import React from 'react';
import { Play, Video, Clock, Eye, Sparkles } from 'lucide-react';

// Local interface for this component's video items (used by mock data & homepage featured videos)
interface VideoItem {
    id: number;
    title: string;
    url?: string;
    youtube_id?: string;
    duration?: string | number | null;
    publish_date?: string;
    views?: number;
    thumbnail_uri?: string | null;
    speaker?: { id: number; name: string; [key: string]: any } | null;
    category?: { id: number; name: string; [key: string]: any } | null;
}

interface LatestVideosProps {
    featured_video?: VideoItem[];
}

export default function LatestVideos({ featured_video = [] }: LatestVideosProps) {
    // Beautiful mock video items matching visual list
    const defaultVideos: VideoItem[] = [
        {
            id: 201,
            title: 'Tazkiyah & Soul Cleansing - Key Steps to Jannah',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            youtube_id: 'qmeuyAGvCF8',
            duration: '45:12',
            publish_date: '2026-05-30',
            speaker: { id: 1, name: 'Maulana Dr. Muhammad Anas Adil' },
            category: { id: 1, name: 'Tazkiyah' }
        },
        {
            id: 202,
            title: 'Jurisprudence of Business Transactions in Islam',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            youtube_id: 's2mvrTBkrpk',
            duration: '58:40',
            publish_date: '2026-05-28',
            speaker: { id: 2, name: 'Mufti Ahmad Ashraf' },
            category: { id: 2, name: 'Fiqh' }
        },
        {
            id: 203,
            title: 'Why Dars-e-Nizami is Essential for Scholars',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            youtube_id: '7U3IDTREZ4E',
            duration: '32:15',
            publish_date: '2026-05-25',
            speaker: { id: 1, name: 'Maulana Dr. Muhammad Anas Adil' },
            category: { id: 3, name: 'Academics' }
        }
    ];

    const activeVideos = featured_video.length >= 2 ? featured_video : defaultVideos;

    return (
        <section style={{
            padding: '80px 24px',
            background: 'hsl(215, 60%, 12%)',
            color: 'white',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Visual background textures */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 0)',
                backgroundSize: '32px 32px',
                pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 10 }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: 48,
                    alignItems: 'center'
                }}>
                    {/* Left: Dome art visuals */}
                    <div style={{
                        position: 'relative',
                        borderRadius: 'var(--radius-xl)',
                        overflow: 'hidden',
                        aspectRatio: '1/1',
                        maxHeight: 460,
                        margin: '0 auto',
                        width: '100%',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        {/* Premium Dome Ceil Graphic Overlay */}
                        <div style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            background: 'radial-gradient(circle, rgba(155, 65, 32, 0.4) 0%, rgba(21, 35, 59, 0.95) 75%)',
                            zIndex: 1
                        }} />
                        
                        {/* Dome art — pure CSS, no image file */}
                        <div style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            background: 'radial-gradient(ellipse at 50% 50%, hsl(215,50%,18%) 0%, hsl(215,60%,8%) 65%, hsl(215,65%,5%) 100%)'
                        }}>
                            <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.18 }} viewBox="0 0 460 460" xmlns="http://www.w3.org/2000/svg">
                                {/* Concentric rings like a dome */}
                                {[40, 80, 120, 160, 200].map((r, i) => (
                                    <circle key={i} cx="230" cy="230" r={r}
                                        fill="none" stroke="hsl(38,90%,60%)" strokeWidth="0.6"
                                        strokeDasharray={i % 2 === 0 ? '6 10' : 'none'}
                                    />
                                ))}
                                {/* Radiating spokes */}
                                {Array.from({ length: 16 }, (_, i) => {
                                    const angle = (i * 360) / 16;
                                    const rad = (angle * Math.PI) / 180;
                                    return (
                                        <line key={i}
                                            x1="230" y1="230"
                                            x2={230 + 200 * Math.cos(rad)}
                                            y2={230 + 200 * Math.sin(rad)}
                                            stroke="hsl(38,90%,60%)" strokeWidth="0.4" opacity="0.7"
                                        />
                                    );
                                })}
                            </svg>
                        </div>

                        {/* Dome Calligraphy Accent overlay */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 5,
                            textAlign: 'center',
                            width: '80%'
                        }}>
                            <h4 style={{
                                fontFamily: "'Noto Nastaliq Urdu', serif",
                                fontSize: '1.75rem',
                                color: 'var(--accent-400)',
                                textShadow: '0 4px 10px rgba(0,0,0,0.5)',
                                lineHeight: 2
                            }}>
                                ان الحکم الا للہ
                            </h4>
                            <p style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.7)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 12 }}>
                                Jamia Ahsan Digital Broadcast
                            </p>
                        </div>
                    </div>

                    {/* Right: Latest Videos List */}
                    <div>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            marginBottom: 32 
                        }}>
                            <h3 style={{ 
                                fontSize: '1.75rem', 
                                fontWeight: 800, 
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12
                            }}>
                                <Video size={24} style={{ color: 'var(--accent-500)' }} />
                                Latest Videos
                            </h3>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--accent-400)', fontWeight: 600 }}>
                                View All &rarr;
                            </span>
                        </div>

                        {/* Scrollable list of video listings */}
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 20,
                            maxHeight: 400,
                            overflowY: 'auto',
                            paddingRight: 10
                        }} className="video-scroll-list">
                            {activeVideos.map(video => (
                                <a 
                                    key={video.id}
                                    href={`https://youtube.com/watch?v=${video.youtube_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        gap: 16,
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.07)',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: 12,
                                        textDecoration: 'none',
                                        color: 'white',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
                                        e.currentTarget.style.borderColor = 'var(--accent-500)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                                    }}
                                >
                                    {/* Thumbnail box */}
                                    <div style={{
                                        width: 110,
                                        height: 70,
                                        borderRadius: 'var(--radius)',
                                        background: 'rgba(0,0,0,0.3)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {/* Play Overlay */}
                                        <div style={{
                                            position: 'absolute',
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            background: 'var(--accent-500)',
                                            color: 'black',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 5
                                        }}>
                                            <Play size={12} fill="currentColor" style={{ marginLeft: 2 }} />
                                        </div>
                                        {/* Thumbnail: try YouTube, fallback to gradient */}
                                        <div style={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(135deg, hsl(215,60%,12%) 0%, hsl(215,50%,8%) 100%)'
                                        }} />
                                        {video.youtube_id && !video.youtube_id.startsWith('mock') && (
                                            <img
                                                src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                                                alt={video.title}
                                                style={{
                                                    position: 'absolute',
                                                    width: '100%', height: '100%',
                                                    objectFit: 'cover',
                                                    opacity: 0.7
                                                }}
                                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                        )}
                                    </div>

                                    {/* Info Block */}
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1, minWidth: 0 }}>
                                        <h4 style={{ 
                                            fontSize: '0.875rem', 
                                            fontWeight: 700, 
                                            margin: 0,
                                            lineHeight: 1.4,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {video.title}
                                        </h4>
                                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                                            {video.speaker?.name || 'Maulana Dr. Anas Adil'}
                                        </span>
                                        <div style={{ display: 'flex', gap: 16, fontSize: '0.6875rem', color: 'var(--accent-400)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Clock size={10} />
                                                {video.duration || '40 mins'}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Eye size={10} />
                                                Watch Free
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom scroll list styles */}
            <style>{`
                .video-scroll-list::-webkit-scrollbar {
                    width: 4px;
                }
                .video-scroll-list::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                }
                .video-scroll-list::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 2px;
                }
            `}</style>
        </section>
    );
}
