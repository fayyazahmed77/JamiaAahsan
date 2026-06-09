import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { ConfirmDialog } from '@/Components/ui/ConfirmDialog';
import { toast } from 'react-hot-toast';
import {
    Play, Pause, Volume2, VolumeX, Edit3, Trash2, Eye, Clock,
    Calendar, User, FolderOpen, Tag, ArrowLeft, Copy, Check,
    Headphones, ExternalLink, Share2, ChevronDown, AlertTriangle
} from 'lucide-react';

interface AudioData {
    id: number;
    title: string;
    slug: string;
    user_title: string | null;
    uri: string | null;
    youtube_url: string | null;
    description: string | null;
    views: number;
    thumbnail_uri: string | null;
    publish_date: string | null;
    status: boolean;
    tags: string[];
    speaker?: { id: number; name: string } | null;
    category?: { id: number; name: string } | null;
    year?: { id: number; name: number } | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    audio: AudioData;
}

export default function AudioShow({ audio }: Props) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [descExpanded, setDescExpanded] = useState(false);

    // Audio URL resolution
    const resolvedAudioUrl = audio.uri
        ? (audio.uri.startsWith('http') ? audio.uri : `/storage/media/${audio.uri}`)
        : '';

    const getThumbnailUrl = (path: string | null) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `/storage/thumbnails/${path}`;
    };

    const thumbnailUrl = getThumbnailUrl(audio.thumbnail_uri);

    // Audio element events
    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;
        const onTime   = () => setCurrentTime(el.currentTime);
        const onDur    = () => setDuration(el.duration);
        const onPlay   = () => setIsPlaying(true);
        const onPause  = () => setIsPlaying(false);
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

    const formatTime = (s: number) => {
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
        const url = `${window.location.origin}/media/audio/${audio.slug}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopiedUrl(true);
            setTimeout(() => setCopiedUrl(false), 2000);
        });
    };

    const handleDelete = () => {
        router.delete(`/admin/audio/${audio.id}`, {
            onSuccess: () => toast.success('Audio deleted successfully.'),
            onError: () => toast.error('Failed to delete audio.'),
        });
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <AdminLayout
            title={audio.title}
            breadcrumbs={[
                { label: 'Audio Library', href: '/admin/audio' },
                { label: audio.title },
            ]}
        >
            <Head title={`Audio — ${audio.title}`} />

            {/* Top action bar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <Link href="/admin/audio">
                    <Button variant="secondary" size="sm" className="gap-2">
                        <ArrowLeft size={14} /> Back to Library
                    </Button>
                </Link>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="gap-2"
                        onClick={handleCopyUrl}
                    >
                        {copiedUrl ? <Check size={14} /> : <Copy size={14} />}
                        {copiedUrl ? 'Copied!' : 'Copy Public URL'}
                    </Button>
                    <Link href={`/admin/audio/${audio.id}/edit`}>
                        <Button variant="primary" size="sm" className="gap-2">
                            <Edit3 size={14} /> Edit Audio
                        </Button>
                    </Link>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                        onClick={() => setDeleteConfirm(true)}
                    >
                        <Trash2 size={14} /> Delete
                    </Button>
                </div>
            </div>

            {/* Main two-column layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* ── LEFT COLUMN (70%) ──────────────────────────────────────────── */}
                <div className="xl:col-span-8 flex flex-col gap-6">

                    {/* Audio Player Card */}
                    <Card>
                        <CardBody style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
                            {/* Album art / thumbnail header */}
                            <div style={{
                                position: 'relative',
                                height: 220,
                                background: thumbnailUrl
                                    ? `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url(${thumbnailUrl}) center/cover no-repeat`
                                    : 'linear-gradient(135deg, hsl(215,60%,12%), hsl(215,50%,8%))',
                                display: 'flex',
                                alignItems: 'flex-end',
                                padding: '20px 24px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    {/* Big headphone icon */}
                                    <div style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: '50%',
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Headphones size={28} color="white" />
                                    </div>
                                    <div>
                                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', marginBottom: 4 }}>
                                            {audio.category?.name || 'Audio Lecture'}
                                        </div>
                                        <div style={{ color: 'white', fontWeight: 700, fontSize: '1rem', lineHeight: 1.3, maxWidth: 460 }}>
                                            {audio.title}
                                        </div>
                                        {audio.user_title && (
                                            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', direction: 'rtl', marginTop: 2 }}>
                                                {audio.user_title}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Status badge */}
                                <div style={{ position: 'absolute', top: 16, right: 16 }}>
                                    <Badge variant={audio.status ? 'success' : 'muted'}>
                                        {audio.status ? 'Published' : 'Draft'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Player controls */}
                            <div style={{ padding: '20px 24px', background: 'var(--card)', borderTop: '1px solid var(--border)' }}>
                                {/* Hidden audio element */}
                                <audio ref={audioRef} src={resolvedAudioUrl} preload="metadata" />

                                {/* Progress bar */}
                                <div style={{ marginBottom: 12 }}>
                                    <input
                                        type="range"
                                        min={0}
                                        max={duration || 100}
                                        value={currentTime}
                                        onChange={handleSeek}
                                        style={{ width: '100%', accentColor: 'var(--primary-500)', height: 4, cursor: 'pointer' }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>
                                </div>

                                {/* Controls row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                    {/* Play/Pause */}
                                    <button
                                        onClick={togglePlay}
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: '50%',
                                            background: 'var(--primary-500)',
                                            border: 'none',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                        }}
                                        disabled={!resolvedAudioUrl}
                                    >
                                        {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" style={{ marginLeft: 2 }} />}
                                    </button>

                                    {/* Volume */}
                                    <button onClick={toggleMute} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                    </button>
                                    <input
                                        type="range" min={0} max={1} step={0.05}
                                        value={isMuted ? 0 : volume}
                                        onChange={handleVolume}
                                        style={{ width: 80, accentColor: 'var(--primary-500)', cursor: 'pointer' }}
                                    />

                                    {/* Speed selector */}
                                    <div style={{ position: 'relative', marginLeft: 'auto' }}>
                                        <button
                                            onClick={() => setShowSpeedDropdown(!showSpeedDropdown)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 4,
                                                padding: '4px 10px', borderRadius: 'var(--radius)',
                                                background: 'var(--surface-2)', border: '1px solid var(--border)',
                                                fontSize: '0.8125rem', cursor: 'pointer', color: 'var(--text)',
                                            }}
                                        >
                                            {playbackRate}x <ChevronDown size={12} />
                                        </button>
                                        {showSpeedDropdown && (
                                            <div style={{
                                                position: 'absolute', bottom: '110%', right: 0,
                                                background: 'var(--card)', border: '1px solid var(--border)',
                                                borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
                                                padding: '4px 0', zIndex: 50, minWidth: 80,
                                            }}>
                                                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(r => (
                                                    <button key={r} onClick={() => handleSpeedChange(r)}
                                                        style={{
                                                            width: '100%', padding: '6px 12px', background: 'none',
                                                            border: 'none', cursor: 'pointer', textAlign: 'left',
                                                            color: r === playbackRate ? 'var(--primary-500)' : 'var(--text)',
                                                            fontWeight: r === playbackRate ? 700 : 400,
                                                            fontSize: '0.8125rem',
                                                        }}
                                                    >
                                                        {r}x
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* External link if YouTube */}
                                    {audio.youtube_url && (
                                        <a href={audio.youtube_url} target="_blank" rel="noopener noreferrer"
                                            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8125rem', color: 'var(--primary-500)', textDecoration: 'none' }}>
                                            <ExternalLink size={14} /> YouTube
                                        </a>
                                    )}
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Description Card */}
                    <Card>
                        <CardHeader>About This Lecture</CardHeader>
                        <CardBody>
                            {audio.description ? (
                                <div>
                                    <p style={{
                                        color: 'var(--text)',
                                        lineHeight: 1.75,
                                        fontSize: '0.9375rem',
                                        whiteSpace: 'pre-wrap',
                                        display: '-webkit-box',
                                        WebkitLineClamp: descExpanded ? 'unset' : 4,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: descExpanded ? 'visible' : 'hidden',
                                    }}>
                                        {audio.description}
                                    </p>
                                    {audio.description.length > 400 && (
                                        <button
                                            onClick={() => setDescExpanded(!descExpanded)}
                                            style={{ marginTop: 8, color: 'var(--primary-500)', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
                                        >
                                            {descExpanded ? 'Show less' : 'Show more'}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No description provided.</p>
                            )}

                            {/* Tags */}
                            {audio.tags.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
                                    {audio.tags.map(tag => (
                                        <span key={tag} style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 4,
                                            padding: '3px 10px', borderRadius: 999,
                                            background: 'var(--primary-50)', color: 'var(--primary-700)',
                                            fontSize: '0.75rem', fontWeight: 600,
                                            border: '1px solid var(--primary-200)',
                                        }}>
                                            <Tag size={10} />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>

                {/* ── RIGHT COLUMN (30%) ─────────────────────────────────────────── */}
                <div className="xl:col-span-4 flex flex-col gap-6">
                    {/* Audio Performance Card */}
                    <Card className="rounded-3xl border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 shadow-md dark:shadow-xl overflow-hidden transition-all duration-300">
                        <CardHeader className="border-b border-stone-200 dark:border-stone-850 p-6">
                            <span className="font-black text-stone-850 dark:text-stone-300 text-xs uppercase tracking-wider">Audio Performance</span>
                        </CardHeader>
                        <CardBody className="p-6">
                            <div className="bg-stone-50 dark:bg-stone-950 p-5 rounded-2xl border border-stone-200/60 dark:border-stone-850/50 flex flex-col items-center justify-center text-center">
                                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">Total Audio Views</span>
                                <span className="text-3xl font-black text-stone-800 dark:text-white">
                                    {audio.views.toLocaleString()}
                                </span>
                            </div>
                        </CardBody>
                    </Card>
                              

                    {/* Categorization Card */}
                    <Card>
                        <CardHeader style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FolderOpen size={16} /> Categorization
                        </CardHeader>
                        <CardBody style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {[
                                { icon: <User size={14} />, label: 'Speaker', value: audio.speaker?.name },
                                { icon: <FolderOpen size={14} />, label: 'Category', value: audio.category?.name },
                                { icon: <Calendar size={14} />, label: 'Year', value: audio.year?.name?.toString() },
                                { icon: <Calendar size={14} />, label: 'Published', value: audio.publish_date ? new Date(audio.publish_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not set' },
                                { icon: <Clock size={14} />, label: 'Uploaded', value: new Date(audio.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
                            ].map(({ icon, label, value }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 'var(--radius)',
                                        background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--primary-500)', flexShrink: 0,
                                    }}>
                                        {icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                                            {label}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: 600, marginTop: 1 }}>
                                            {value || <span style={{ color: 'var(--text-subtle)', fontWeight: 400 }}>Not assigned</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardBody>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>Quick Actions</CardHeader>
                        <CardBody style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <Link href={`/admin/audio/${audio.id}/edit`} style={{ display: 'block' }}>
                                <Button variant="secondary" className="w-full gap-2">
                                    <Edit3 size={14} /> Edit Audio Details
                                </Button>
                            </Link>
                            <a href={`/media/audio/${audio.slug}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                                <Button variant="secondary" className="w-full gap-2">
                                    <ExternalLink size={14} /> View Public Page
                                </Button>
                            </a>
                            <Button variant="secondary" className="w-full gap-2" onClick={handleCopyUrl}>
                                {copiedUrl ? <Check size={14} /> : <Share2 size={14} />}
                                {copiedUrl ? 'Link Copied!' : 'Copy Share Link'}
                            </Button>
                            <Button variant="destructive" className="w-full gap-2" onClick={() => setDeleteConfirm(true)}>
                                <Trash2 size={14} /> Delete Audio
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Delete Confirm Dialog */}
            <ConfirmDialog
                open={deleteConfirm}
                onClose={() => setDeleteConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Audio"
                message={`Are you sure you want to permanently delete "${audio.title}"? This cannot be undone.`}
                variant="danger"
            />
        </AdminLayout>
    );
}
