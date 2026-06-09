import React, { useEffect, useRef, useState } from 'react';
import SEOHead from '@/Components/Public/SEOHead';
import PublicLayout from '@/Layouts/PublicLayout';
import axios from 'axios';
import {
    Play, Pause, Volume2, VolumeX, ChevronDown, Copy, Check,
    Eye, Calendar, User, FolderOpen, Headphones, ExternalLink,
    Share2, Tag, Clock, ChevronLeft
} from 'lucide-react';

interface AudioItem {
    id: number;
    title: string;
    slug: string;
    user_title?: string | null;
    uri?: string | null;
    youtube_url?: string | null;
    description?: string | null;
    views: number;
    thumbnail_uri?: string | null;
    publish_date?: string | null;
    speaker?: { id: number; name: string } | null;
    category?: { id: number; name: string } | null;
    year?: { id: number; name: number } | null;
    created_at: string;
}

interface Props {
    audio: AudioItem & { tags?: string[] };
    popularAudio: AudioItem[];
}

export default function AudioShowPage({ audio, popularAudio }: Props) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState(false);
    const [descExpanded, setDescExpanded] = useState(false);
    const [viewCount, setViewCount] = useState(audio.views);

    // Resolve URLs
    const resolvedAudioUrl = audio.uri
        ? (audio.uri.startsWith('http') ? audio.uri : `/storage/media/${audio.uri}`)
        : '';

    const getThumbnailUrl = (path: string | null | undefined): string => {
        if (!path) return '/storage/default_thumbnail.png';
        if (path.startsWith('http')) return path;
        return `/storage/thumbnails/${path}`;
    };

    const getYoutubeId = (url: string | null | undefined): string | null => {
        if (!url) return null;
        const match = url.match(/(?:youtu\.be\/|watch\?v=|embed\/)([^#&?]{11})/);
        return match ? match[1] : null;
    };

    const youtubeId = getYoutubeId(audio.youtube_url);

    // Track view on mount (once)
    useEffect(() => {
        axios.post(`/api/v1/audio/${audio.id}/mark-view`)
            .then(res => {
                if (res.data?.views) setViewCount(res.data.views);
            })
            .catch(() => {}); // silently fail
    }, [audio.id]);

    // Audio events
    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;
        const onTime  = () => setCurrentTime(el.currentTime);
        const onDur   = () => setDuration(el.duration);
        const onPlay  = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        el.addEventListener('timeupdate', onTime);
        el.addEventListener('durationchange', onDur);
        el.addEventListener('play', onPlay);
        el.addEventListener('pause', onPause);
        return () => {
            el.removeEventListener('timeupdate', onTime);
            el.removeEventListener('durationchange', onDur);
            el.removeEventListener('play', onPlay);
            el.removeEventListener('pause', onPause);
        };
    }, []);

    const formatTime = (s: number): string => {
        if (!s || isNaN(s)) return '0:00';
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = Math.floor(s % 60);
        return h > 0
            ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
            : `${m}:${sec.toString().padStart(2, '0')}`;
    };

    const togglePlay = () => {
        const el = audioRef.current;
        if (!el) return;
        isPlaying ? el.pause() : el.play();
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const el = audioRef.current;
        if (!el) return;
        const t = parseFloat(e.target.value);
        el.currentTime = t;
        setCurrentTime(t);
    };

    const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const el = audioRef.current;
        if (!el) return;
        const v = parseFloat(e.target.value);
        el.volume = v;
        setVolume(v);
        setIsMuted(v === 0);
    };

    const toggleMute = () => {
        const el = audioRef.current;
        if (!el) return;
        el.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleSpeedChange = (rate: number) => {
        const el = audioRef.current;
        if (el) el.playbackRate = rate;
        setPlaybackRate(rate);
        setShowSpeedDropdown(false);
    };

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopiedUrl(true);
            setTimeout(() => setCopiedUrl(false), 2000);
        });
    };

    const formatDate = (dateStr: string | null | undefined): string => {
        if (!dateStr) return '';
        try {
            return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    return (
        <PublicLayout>
            <SEOHead 
                title={audio.title} 
                description={audio.description || `${audio.title} by ${audio.speaker?.name || 'scholars of Jamia Ahsan'}.`}
            />

            {/* Breadcrumb */}
            <div style={{ background: 'var(--surface-1, #f9fafb)', borderBottom: '1px solid var(--border, #e5e7eb)', padding: '10px 24px' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</a>
                    <span>/</span>
                    <a href="/media/audio" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Audio Library</a>
                    <span>/</span>
                    <span style={{ color: 'var(--text)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>
                        {audio.title}
                    </span>
                </div>
            </div>

            {/* Main layout */}
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}
                className="lg:!grid-cols-[1fr_360px]">

                {/* ── LEFT: Player + Info ─────────────────────────────────── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>

                    {/* Audio Player Card */}
                    <div style={{
                        background: 'var(--card, #fff)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-xl, 16px)',
                        overflow: 'hidden',
                    }}>
                        {/* Thumbnail / album art header */}
                        <div style={{
                            position: 'relative',
                            height: 260,
                            background: getThumbnailUrl(audio.thumbnail_uri) !== '/storage/default_thumbnail.png'
                                ? `linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 100%), url(${getThumbnailUrl(audio.thumbnail_uri)}) center/cover no-repeat`
                                : 'linear-gradient(135deg, var(--primary-900), var(--primary-950))',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            padding: '24px 28px',
                        }}>
                            {/* Category tag */}
                            {audio.category && (
                                <div style={{
                                    position: 'absolute', top: 20, left: 20,
                                    background: 'var(--primary-600)', backdropFilter: 'blur(4px)',
                                    borderRadius: 999, padding: '3px 12px',
                                    color: 'white', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em',
                                }}>
                                    {audio.category.name}
                                </div>
                            )}

                            {/* Views + share actions */}
                            <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 8 }}>
                                <button
                                    onClick={handleCopyUrl}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        padding: '6px 12px', borderRadius: 999,
                                        background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        color: 'white', cursor: 'pointer', fontSize: '0.8125rem',
                                    }}
                                >
                                    {copiedUrl ? <Check size={13} /> : <Share2 size={13} />}
                                    {copiedUrl ? 'Copied!' : 'Share'}
                                </button>
                            </div>

                            {/* Title */}
                            <div>
                                <h1 style={{ color: 'white', fontWeight: 800, fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', lineHeight: 1.3, marginBottom: 8 }}>
                                    {audio.title}
                                </h1>
                                {audio.user_title && (
                                    <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.0625rem', direction: 'rtl', fontFamily: "'Noto Nastaliq Urdu', serif" }}>
                                        {audio.user_title}
                                    </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem' }}>
                                        <Eye size={13} /> {viewCount.toLocaleString()} plays
                                    </span>
                                    {(audio.publish_date || audio.created_at) && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem' }}>
                                            <Calendar size={13} /> {formatDate(audio.publish_date || audio.created_at)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* YouTube embed (if available) */}
                        {youtubeId && (
                            <div style={{ aspectRatio: '16/7', background: 'var(--primary-950)' }}>
                                <iframe
                                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                                    title={audio.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                />
                            </div>
                        )}

                        {/* HTML5 Audio Player */}
                        {!youtubeId && resolvedAudioUrl && (
                            <div style={{ padding: '20px 28px', background: 'var(--card)', borderTop: '1px solid var(--border)' }}>
                                <audio ref={audioRef} src={resolvedAudioUrl} preload="metadata" />

                                {/* Waveform-style progress */}
                                <div style={{ marginBottom: 14 }}>
                                    <input
                                        type="range" min={0} max={duration || 100} value={currentTime}
                                        onChange={handleSeek}
                                        style={{ width: '100%', accentColor: 'var(--primary-600)', height: 4, cursor: 'pointer' }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                    <button
                                        onClick={togglePlay}
                                        style={{
                                            width: 48, height: 48, borderRadius: '50%',
                                            background: 'var(--primary-600)', border: 'none', color: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', boxShadow: '0 4px 12px rgba(23,74,135,0.35)',
                                        }}
                                    >
                                        {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" style={{ marginLeft: 2 }} />}
                                    </button>
                                    <button onClick={toggleMute} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                    </button>
                                    <input
                                        type="range" min={0} max={1} step={0.05}
                                        value={isMuted ? 0 : volume}
                                        onChange={handleVolume}
                                        style={{ width: 80, accentColor: 'var(--primary-600)', cursor: 'pointer' }}
                                    />
                                    <div style={{ position: 'relative', marginLeft: 'auto' }}>
                                        <button
                                            onClick={() => setShowSpeedDropdown(!showSpeedDropdown)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 4,
                                                padding: '4px 10px', borderRadius: 8,
                                                background: 'var(--surface-2, #f3f4f6)', border: '1px solid var(--border)',
                                                fontSize: '0.8125rem', cursor: 'pointer', color: 'var(--text)',
                                            }}
                                        >
                                            {playbackRate}x <ChevronDown size={12} />
                                        </button>
                                        {showSpeedDropdown && (
                                            <div style={{
                                                position: 'absolute', bottom: '110%', right: 0,
                                                background: 'var(--card)', border: '1px solid var(--border)',
                                                borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                                padding: '4px 0', zIndex: 50, minWidth: 80,
                                            }}>
                                                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(r => (
                                                    <button key={r} onClick={() => handleSpeedChange(r)}
                                                        style={{
                                                            width: '100%', padding: '6px 12px', background: 'none',
                                                            border: 'none', cursor: 'pointer', textAlign: 'left',
                                                            color: r === playbackRate ? 'var(--primary-600)' : 'var(--text)',
                                                            fontWeight: r === playbackRate ? 700 : 400,
                                                            fontSize: '0.8125rem',
                                                        }}
                                                    >{r}x</button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {audio.youtube_url && (
                                        <a href={audio.youtube_url} target="_blank" rel="noopener noreferrer"
                                            style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary-600)', fontSize: '0.8125rem', textDecoration: 'none' }}>
                                            <ExternalLink size={13} /> YouTube
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Scholar Info Strip */}
                    {audio.speaker && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '16px 20px',
                            background: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg, 12px)',
                        }}>
                            {/* Avatar initials */}
                            <div style={{
                                width: 44, height: 44, borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontWeight: 700, fontSize: '1rem', flexShrink: 0,
                            }}>
                                {audio.speaker.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                                    Scholar / Speaker
                                </div>
                                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9375rem' }}>
                                    {audio.speaker.name}
                                </div>
                            </div>
                            {audio.category && (
                                <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category</div>
                                    <div style={{
                                        padding: '2px 10px', borderRadius: 999,
                                        background: 'var(--primary-50)', border: '1px solid var(--primary-200)',
                                        color: 'var(--primary-700)', fontSize: '0.8125rem', fontWeight: 600,
                                    }}>
                                        {audio.category.name}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    {audio.description && (
                        <div style={{
                            background: 'var(--card)', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)', padding: '20px 24px',
                        }}>
                            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Headphones size={16} color="var(--accent-500)" />
                                About This Bayan
                            </h3>
                            <p style={{
                                color: 'var(--text)', lineHeight: 1.8, fontSize: '0.9375rem',
                                whiteSpace: 'pre-wrap',
                                display: '-webkit-box',
                                WebkitLineClamp: descExpanded ? 'unset' : 5,
                                WebkitBoxOrient: 'vertical',
                                overflow: descExpanded ? 'visible' : 'hidden',
                             }}>
                                {audio.description}
                            </p>
                            {audio.description.length > 600 && (
                                <button
                                    onClick={() => setDescExpanded(!descExpanded)}
                                    style={{ marginTop: 10, color: 'var(--primary-600)', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 700 }}
                                >
                                    {descExpanded ? 'Show less ↑' : 'Read more ↓'}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Tags */}
                    {audio.tags && audio.tags.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {audio.tags.map(tag => (
                                <span key={tag} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 5,
                                    padding: '4px 12px', borderRadius: 999,
                                    background: 'var(--primary-50)', color: 'var(--primary-700)',
                                    fontSize: '0.8125rem', fontWeight: 600,
                                    border: '1px solid var(--primary-200)',
                                }}>
                                    <Tag size={11} /> {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── RIGHT: Popular Bayanat Sidebar ─────────────────────── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{
                        background: 'var(--card)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-xl)', overflow: 'hidden',
                        position: 'sticky', top: 100,
                    }}>
                        <div style={{
                            padding: '16px 20px', borderBottom: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', gap: 8,
                        }}>
                            <Headphones size={16} color="var(--accent-500)" />
                            <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)', margin: 0 }}>
                                Popular Bayanat
                            </h3>
                        </div>
                        <div>
                            {popularAudio.map((item, idx) => (
                                <a
                                    key={item.id}
                                    href={`/media/audio/${item.slug}`}
                                    style={{
                                        display: 'flex', gap: 12, padding: '14px 20px',
                                        borderBottom: idx < popularAudio.length - 1 ? '1px solid var(--border)' : 'none',
                                        textDecoration: 'none', color: 'var(--text)',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2, #f9fafb)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    {/* Thumbnail */}
                                    <div style={{
                                        width: 72, height: 48, borderRadius: 6, overflow: 'hidden',
                                        background: 'var(--neutral-200)', flexShrink: 0, position: 'relative',
                                    }}>
                                        <img
                                            src={getThumbnailUrl(item.thumbnail_uri)}
                                            alt=""
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={e => { (e.target as HTMLImageElement).src = '/storage/default_thumbnail.png'; }}
                                        />
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'rgba(0,0,0,0.3)',
                                        }}>
                                            <Play size={12} color="white" fill="white" />
                                        </div>
                                    </div>
                                    {/* Info */}
                                    <div style={{ minWidth: 0, flex: 1 }}>
                                        <div style={{
                                            fontSize: '0.8125rem', fontWeight: 600, lineHeight: 1.4,
                                            overflow: 'hidden', textOverflow: 'ellipsis',
                                            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                            marginBottom: 4, color: 'var(--text)',
                                        }}>
                                            {item.title}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {item.speaker?.name || ''}
                                        </div>
                                        <div style={{ display: 'flex', gap: 10, marginTop: 3, fontSize: '0.6875rem', color: 'var(--text-subtle)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                <Eye size={10} /> {item.views.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            ))}

                            {popularAudio.length === 0 && (
                                <div style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    No other recordings available.
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                            <a href="/media/audio" style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>
                                View All Bayanat →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
