import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardHeader, CardBody } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { toast } from 'react-hot-toast';
import { 
    Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Minimize2, Maximize2, 
    ChevronDown, Edit3, Trash2, ShieldAlert, Copy, Eye, User, FolderOpen, Calendar, Tag
} from 'lucide-react';
import type { Video } from '@/types/models';

interface Props {
    video: Video & {
        speaker?: { id: number; name: string } | null;
        category?: { id: number; name: string } | null;
        year?: { id: number; name: number } | null;
        duration?: number | null;
        width?: number | null;
        height?: number | null;
        file_size?: number | null;
        mime_type?: string | null;
        created_at?: string | null;
    };
}

export default function VideoShow({ video }: Props) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    
    // UI state
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(video.duration || 0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [quality, setQuality] = useState('1080p');
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
    const [showQualityDropdown, setShowQualityDropdown] = useState(false);
    const [descExpanded, setDescExpanded] = useState(false);

    const handleDelete = () => {
        if (confirm('Are you sure you want to permanently delete this video?')) {
            router.delete(`/admin/videos/${video.id}`, {
                onSuccess: () => toast.success('Video deleted successfully'),
                onError: () => toast.error('Failed to delete video')
            });
        }
    };
    
    // Copy states
    const [copiedUrl, setCopiedUrl] = useState(false);
    const [copiedEmbed, setCopiedEmbed] = useState(false);

    // YouTube extractor
    const getYoutubeId = (url: string | null) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = getYoutubeId(video.youtube_url);
    const resolvedVideoUrl = video.url || video.uri ? (
        (video.url || video.uri)?.startsWith('http') ? (video.url || video.uri) : `/storage/media/${video.url || video.uri}`
    ) : '';

    // Handle HTML5 video events
    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;

        const updateTime = () => setCurrentTime(el.currentTime);
        const updateDur = () => setDuration(el.duration);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        el.addEventListener('timeupdate', updateTime);
        el.addEventListener('durationchange', updateDur);
        el.addEventListener('play', handlePlay);
        el.addEventListener('pause', handlePause);

        return () => {
            el.removeEventListener('timeupdate', updateTime);
            el.removeEventListener('durationchange', updateDur);
            el.removeEventListener('play', handlePlay);
            el.removeEventListener('pause', handlePause);
        };
    }, [resolvedVideoUrl]);

    // Player Actions
    const handlePlayPause = () => {
        const el = videoRef.current;
        if (!el) return;
        if (isPlaying) {
            el.pause();
        } else {
            el.play().catch(() => {});
        }
    };

    const handleRewind = () => {
        if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    };

    const handleForward = () => {
        if (videoRef.current) videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setCurrentTime(val);
        if (videoRef.current) videoRef.current.currentTime = val;
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        setIsMuted(val === 0);
        if (videoRef.current) {
            videoRef.current.volume = val;
            videoRef.current.muted = val === 0;
        }
    };

    const handleToggleMute = () => {
        const next = !isMuted;
        setIsMuted(next);
        if (videoRef.current) videoRef.current.muted = next;
    };

    const handleSpeedChange = (rate: number) => {
        setPlaybackRate(rate);
        setShowSpeedDropdown(false);
        if (videoRef.current) videoRef.current.playbackRate = rate;
    };

    const handleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            }
        }
    };

    const formatTime = (secs: number) => {
        if (isNaN(secs)) return '0:00';
        const mins = Math.floor(secs / 60);
        const remainingSecs = Math.floor(secs % 60);
        return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
    };

    const formatWatchTime = (seconds: number = 0) => {
        if (seconds === 0) return '0s';
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const parts = [];
        if (hrs > 0) parts.push(`${hrs}h`);
        if (mins > 0) parts.push(`${mins}m`);
        if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
        return parts.join(' ');
    };

    // Copies functions
    const handleCopyUrl = () => {
        const url = `${window.location.origin}/videos/${video.slug}`;
        navigator.clipboard.writeText(url);
        setCopiedUrl(true);
        toast.success("Public Video URL copied!");
        setTimeout(() => setCopiedUrl(false), 2000);
    };

    const handleCopyEmbed = () => {
        const embed = `<iframe src="${window.location.origin}/embed/${video.slug}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`;
        navigator.clipboard.writeText(embed);
        setCopiedEmbed(true);
        toast.success("Embed Code copied!");
        setTimeout(() => setCopiedEmbed(false), 2000);
    };

    return (
        <AdminLayout
            title="Video Studio Workspace"
            breadcrumbs={[
                { label: 'Video Library', href: '/admin/videos' },
                { label: video.title },
            ]}
        >
            <Head title={`View Video - ${video.title} Studio`} />

            {/* Global Studio Wrapper with dynamic Light/Dark support */}
            <div className=" dark:bg-stone-950 text-stone-900 dark:text-stone-100 min-h-screen p-1 md:p-4 rounded-3xl overflow-hidden select-none space-y-8 font-sans transition-colors duration-300">
                
                {/* 1. Video Header Info Banner */}
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md dark:shadow-xl relative overflow-hidden transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-sapphire-500/5 to-transparent pointer-events-none" />
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                        {/* Thumbnail View */}
                        <div className="relative w-40 aspect-video rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 shrink-0">
                            <img 
                                src={video.thumbnail_uri ? (video.thumbnail_uri.startsWith('http') ? video.thumbnail_uri : `/storage/thumbnails/${video.thumbnail_uri}`) : '/storage/default_thumbnail.png'} 
                                alt="" 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-1 right-1 bg-black/75 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">
                                {formatTime(duration)}
                            </div>
                        </div>

                        {/* Title & Metadata */}
                        <div className="text-center sm:text-left min-w-0">
                            <h1 className="text-xl md:text-2xl font-black tracking-tight text-stone-900 dark:text-white mb-2 truncate">
                                {video.title}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-stone-500 dark:text-stone-400">
                                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-sapphire-500" /> {video.speaker?.name || 'Unknown Scholar'}</span>
                                <span className="text-stone-300 dark:text-stone-700">•</span>
                                <span className="flex items-center gap-1"><FolderOpen className="w-3.5 h-3.5 text-gold-400" /> {video.category?.name || 'No Category'}</span>
                                <span className="text-stone-300 dark:text-stone-700">•</span>
                                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-500" /> Year {video.year?.name || 'N/A'}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                                <Badge variant={video.status ? 'success' : 'muted'} className="text-[10px] px-2 py-0.5 rounded-md font-extrabold uppercase">
                                    {video.status ? 'Active' : 'Inactive'}
                                </Badge>
                                <Badge className="text-[10px] px-2 py-0.5 rounded-md font-extrabold uppercase bg-sapphire-500/10 text-sapphire-500 dark:text-sapphire-400 border border-sapphire-500/20">
                                    Published
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="flex flex-wrap justify-center gap-2 shrink-0">
                        <Link href={`/admin/videos/${video.id}/edit`}>
                            <Button className="h-10 bg-sapphire-500 hover:bg-sapphire-400 text-white border-transparent cursor-pointer font-bold px-4 rounded-xl flex items-center gap-2">
                                <Edit3 className="w-4 h-4" />
                                Edit Video
                            </Button>
                        </Link>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                            className="h-10 cursor-pointer rounded-xl flex items-center justify-center p-2.5"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* 2. Main 12-Column Responsive Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Section (Player & Description - 8 Columns) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* PREMIUM CUSTOM VIDEO PLAYER */}
                        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800/80 rounded-3xl overflow-hidden shadow-md dark:shadow-2xl relative group transition-all duration-300">
                            
                            {/* Video Screen Container */}
                            <div className="relative aspect-video w-full bg-stone-950 flex items-center justify-center overflow-hidden">
                                {youtubeId ? (
                                    <iframe
                                        className="w-full h-full absolute inset-0 z-10"
                                        src={`https://www.youtube.com/embed/${youtubeId}?rel=0&showinfo=0`}
                                        title={video.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : resolvedVideoUrl ? (
                                    <video
                                        ref={videoRef}
                                        className="w-full h-full relative z-10"
                                        src={resolvedVideoUrl}
                                        preload="metadata"
                                    />
                                ) : (
                                    <div className="text-stone-500 text-sm font-semibold p-8 text-center relative z-20">
                                        No playback media source available for this video record.
                                    </div>
                                )}

                                {/* Top Video Overlay Header Info (simulated, vanishes on hover when playing) */}
                                {!youtubeId && resolvedVideoUrl && (
                                    <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-6 opacity-100 group-hover:opacity-100 transition-opacity duration-300 flex items-start justify-between pointer-events-none">
                                        <div>
                                            <h3 className="text-white font-black text-base shadow-sm">{video.title}</h3>
                                            <span className="text-xs text-stone-300 font-bold block mt-0.5">{video.speaker?.name || 'Unknown scholar'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-sapphire-500/90 text-white font-black text-[9px] px-2 py-0.5 rounded uppercase border-none">
                                                {video.category?.name || 'Study'}
                                            </Badge>
                                        </div>
                                    </div>
                                )}

                                {/* Center Play Button Overlay */}
                                {!youtubeId && resolvedVideoUrl && !isPlaying && (
                                    <button 
                                        onClick={handlePlayPause}
                                        className="absolute z-20 w-16 h-16 rounded-full bg-gold-400 hover:bg-gold-450 hover:scale-110 text-stone-950 flex items-center justify-center shadow-2xl transition-all cursor-pointer border-none"
                                    >
                                        <Play className="w-8 h-8 fill-current ml-1" />
                                    </button>
                                )}
                            </div>

                            {/* Custom Playback Control Bar (HTML5 native video binder) */}
                            {!youtubeId && resolvedVideoUrl && (
                                <div className="bg-white dark:bg-stone-900 border-t border-border p-5 space-y-4 transition-colors duration-300">
                                    
                                    {/* Timeline Slider Progress */}
                                    <div className="flex items-center gap-4">
                                        <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 w-10 text-right">{formatTime(currentTime)}</span>
                                        <input 
                                            type="range" 
                                            min={0} 
                                            max={duration || 100} 
                                            value={currentTime} 
                                            onChange={handleSeek}
                                            className="flex-grow accent-gold-400 h-1 bg-stone-200 dark:bg-stone-850 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 w-10">{formatTime(duration)}</span>
                                    </div>

                                    {/* Player Controls Panel */}
                                    <div className="flex items-center justify-between gap-4 flex-wrap">
                                        
                                        {/* Playback action items */}
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={handlePlayPause}
                                                className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-850 text-stone-900 dark:text-white flex items-center justify-center transition-colors cursor-pointer border border-border"
                                            >
                                                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                                            </button>
                                            
                                            <button 
                                                onClick={handleRewind}
                                                className="w-9 h-9 rounded-xl bg-stone-50 dark:bg-stone-900/50 hover:bg-stone-100 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300 flex items-center justify-center transition-colors cursor-pointer border border-border"
                                                title="Rewind 10s"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" />
                                            </button>
                                            
                                            <button 
                                                onClick={handleForward}
                                                className="w-9 h-9 rounded-xl bg-stone-50 dark:bg-stone-900/50 hover:bg-stone-100 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300 flex items-center justify-center transition-colors cursor-pointer border border-border"
                                                title="Forward 10s"
                                            >
                                                <RotateCw className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Volume Controls */}
                                            <div className="flex items-center gap-2 ml-2">
                                                <button 
                                                    onClick={handleToggleMute}
                                                    className="w-9 h-9 rounded-xl bg-stone-50 dark:bg-stone-900/40 hover:bg-stone-100 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300 flex items-center justify-center transition-colors cursor-pointer border border-border"
                                                >
                                                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                                </button>
                                                <input 
                                                    type="range" 
                                                    min={0} 
                                                    max={1} 
                                                    step={0.05} 
                                                    value={isMuted ? 0 : volume} 
                                                    onChange={handleVolumeChange}
                                                    className="w-16 accent-gold-400 h-1 bg-stone-200 dark:bg-stone-850 rounded-lg appearance-none cursor-pointer hidden sm:block"
                                                />
                                            </div>
                                        </div>

                                        {/* Playback options & Settings selectors */}
                                        <div className="flex items-center gap-2">
                                            {/* Speed Option Selector */}
                                            <div className="relative">
                                                <button 
                                                    onClick={() => { setShowSpeedDropdown(!showSpeedDropdown); setShowQualityDropdown(false); }}
                                                    className="h-9 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-900/60 dark:hover:bg-stone-850 text-stone-800 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-border"
                                                >
                                                    <span>{playbackRate === 1 ? 'Normal' : `${playbackRate}x`}</span>
                                                    <ChevronDown className="w-3 h-3" />
                                                </button>
                                                {showSpeedDropdown && (
                                                    <div className="absolute bottom-11 right-0 bg-white dark:bg-stone-900 border border-border rounded-xl p-1.5 shadow-2xl z-40 w-24 space-y-0.5">
                                                        {[0.5, 1, 1.25, 1.5, 2].map((r) => (
                                                            <button 
                                                                key={r}
                                                                onClick={() => handleSpeedChange(r)}
                                                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold hover:bg-stone-100 dark:hover:bg-stone-850 cursor-pointer border-none ${playbackRate === r ? 'text-gold-500 dark:text-gold-400 bg-gold-400/5' : 'text-stone-700 dark:text-stone-300'}`}
                                                            >
                                                                {r === 1 ? 'Normal' : `${r}x`}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Quality Option Selector */}
                                            <div className="relative">
                                                <button 
                                                    onClick={() => { setShowQualityDropdown(!showQualityDropdown); setShowSpeedDropdown(false); }}
                                                    className="h-9 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-900/60 dark:hover:bg-stone-850 text-stone-800 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-border"
                                                >
                                                    <span>{quality}</span>
                                                    <ChevronDown className="w-3 h-3" />
                                                </button>
                                                {showQualityDropdown && (
                                                    <div className="absolute bottom-11 right-0 bg-white dark:bg-stone-900 border border-border rounded-xl p-1.5 shadow-2xl z-40 w-24 space-y-0.5">
                                                        {['1080p', '720p', '360p', 'Auto'].map((q) => (
                                                            <button 
                                                                key={q}
                                                                onClick={() => { setQuality(q); setShowQualityDropdown(false); }}
                                                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold hover:bg-stone-100 dark:hover:bg-stone-850 cursor-pointer border-none ${quality === q ? 'text-gold-500 dark:text-gold-400 bg-gold-400/5' : 'text-stone-700 dark:text-stone-300'}`}
                                                            >
                                                                {q}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Window Size Modes & Options */}
                                            <button 
                                                onClick={() => setIsTheaterMode(!isTheaterMode)}
                                                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer border border-border ${isTheaterMode ? 'bg-gold-400/10 text-gold-500 dark:text-gold-400' : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-900/40 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300'}`}
                                                title="Theater Mode"
                                            >
                                                <Minimize2 className="w-4 h-4" />
                                            </button>

                                            <button 
                                                onClick={handleFullscreen}
                                                className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-900/40 dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300 flex items-center justify-center transition-colors cursor-pointer border border-border"
                                                title="Fullscreen"
                                            >
                                                <Maximize2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Advanced Admin Controls Panel */}
                            <div className="bg-stone-50 dark:bg-stone-950/45 border-t border-border px-8 py-5 flex flex-wrap items-center justify-between gap-4 transition-colors duration-300">
                                <div className="flex items-center gap-1.5">
                                    <ShieldAlert className="w-4 h-4 text-sapphire-500" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Studio Share Options</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button 
                                        onClick={handleCopyUrl}
                                        className="h-8 bg-white dark:bg-stone-900/80 hover:bg-stone-100 dark:hover:bg-stone-850 text-[10px] text-stone-900 dark:text-stone-300 border border-stone-200 dark:border-stone-800 font-extrabold uppercase rounded-lg tracking-wider px-3 cursor-pointer flex items-center gap-1"
                                    >
                                        <Copy className="w-3 h-3 text-sapphire-500" />
                                        Copy URL
                                    </Button>
                                    <Button 
                                        onClick={handleCopyEmbed}
                                        className="h-8 bg-white dark:bg-stone-900/80 hover:bg-stone-100 dark:hover:bg-stone-850 text-[10px] text-stone-900 dark:text-stone-300 border border-stone-200 dark:border-stone-800 font-extrabold uppercase rounded-lg tracking-wider px-3 cursor-pointer flex items-center gap-1"
                                    >
                                        <Copy className="w-3 h-3 text-gold-450" />
                                        Copy Embed
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* ABOUT VIDEO / DESCRIPTION */}
                        <Card className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-md dark:shadow-xl overflow-hidden transition-all duration-300">
                            <CardHeader className="border-b border-stone-200 dark:border-stone-850 p-6">
                                <span className="font-black text-stone-850 dark:text-stone-300 text-xs uppercase tracking-wider">Content Summary</span>
                            </CardHeader>
                            <CardBody className="p-6 space-y-5">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Video Description</span>
                                        <button 
                                            onClick={() => {
                                                navigator.clipboard.writeText(video.description || '');
                                                toast.success('Description copied!');
                                            }}
                                            className="text-[10px] font-black uppercase text-gold-500 hover:text-gold-400 flex items-center gap-1 cursor-pointer bg-transparent border-none"
                                        >
                                            <Copy className="w-3 h-3" /> Copy
                                        </button>
                                    </div>

                                    {/* RTL / LTR text block */}
                                    <div className={`text-sm leading-relaxed text-stone-750 dark:text-stone-300 ${descExpanded ? '' : 'line-clamp-4'}`}>
                                        {video.urdu_title && (
                                            <p className="text-lg text-stone-900 dark:text-stone-100 font-bold mb-3 font-urdu text-right" dir="rtl">
                                                {video.urdu_title}
                                            </p>
                                        )}
                                        {video.description || <span className="text-stone-505 italic">No description provided.</span>}
                                    </div>

                                    {video.description && video.description.length > 150 && (
                                        <button 
                                            onClick={() => setDescExpanded(!descExpanded)}
                                            className="text-xs font-bold text-gold-500 hover:text-gold-400 block mt-2 cursor-pointer bg-transparent border-none"
                                        >
                                            {descExpanded ? 'Read Less' : 'Read More'}
                                        </button>
                                    )}
                                </div>

                                {/* Tags section */}
                                <div className="border-t border-stone-200 dark:border-stone-850 pt-5 space-y-3">
                                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Tags / Keywords</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {video.tags && video.tags.length > 0 ? (
                                            video.tags.map((tag, i) => (
                                                <Badge key={i} className="bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200/50 dark:border-stone-800/50 text-[10px] px-2.5 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                                                    <Tag className="w-2.5 h-2.5 text-sapphire-500" />
                                                    {tag}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs text-stone-500 italic">No tags associated.</span>
                                        )}
                                    </div>
                                </div>

                                {/* SEO Metadata section */}
                                <div className="border-t border-stone-200 dark:border-stone-850 pt-5 space-y-3">
                                    <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-500">SEO Settings</span>
                                    <div className="space-y-3 text-xs">
                                        <div>
                                            <span className="font-bold text-stone-500 block">Meta Title</span>
                                            <span className="text-stone-800 dark:text-stone-300 mt-1 block font-semibold">{video.meta_title || <span className="italic font-normal text-stone-500">Not configured</span>}</span>
                                        </div>
                                        <div>
                                            <span className="font-bold text-stone-500 block">Meta Description</span>
                                            <span className="text-stone-800 dark:text-stone-300 mt-1 block font-normal leading-relaxed">{video.meta_description || <span className="italic text-stone-500">Not configured</span>}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                    </div>

                    {/* Right Section (30% - 4 Columns) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* VIDEO PERFORMANCE CARD */}
                        <Card className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-md dark:shadow-xl overflow-hidden transition-all duration-300">
                            <CardHeader className="border-b border-stone-200 dark:border-stone-850 p-6">
                                <span className="font-black text-stone-850 dark:text-stone-300 text-xs uppercase tracking-wider">Video Performance</span>
                            </CardHeader>
                            <CardBody className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-200/60 dark:border-stone-850/50">
                                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">Total Views</span>
                                        <span className="text-xl font-extrabold text-stone-800 dark:text-white">
                                            {video.views.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-2xl border border-stone-200/60 dark:border-stone-850/50">
                                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">Watch Time</span>
                                        <span className="text-xl font-extrabold text-stone-800 dark:text-white">
                                            {video.watch_time ? formatWatchTime(video.watch_time) : '0s'}
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* VIDEO INFORMATION PANEL */}
                        <Card className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-md dark:shadow-xl overflow-hidden transition-all duration-300">
                            <CardHeader className="border-b border-stone-200 dark:border-stone-850 p-6">
                                <span className="font-black text-stone-850 dark:text-stone-300 text-xs uppercase tracking-wider">Video Profiling</span>
                            </CardHeader>
                            <CardBody className="p-6 space-y-6">
                                
                                {/* Scholar/Speaker details */}
                                <div className="border-b border-stone-200 dark:border-stone-850 pb-5">
                                    <span className="block text-[9px] font-extrabold uppercase tracking-wider text-stone-500 mb-3">Speaker Information</span>
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sapphire-500 to-gold-400 flex items-center justify-center text-white font-black text-base shadow-lg">
                                            {(video.speaker?.name?.[0] || 'S').toUpperCase()}
                                        </div>
                                        <div>
                                            <span className="block font-black text-sm text-stone-900 dark:text-white">{video.speaker?.name || 'Unspecified'}</span>
                                            <span className="block text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">Scholar Profile • Active</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Category details */}
                                <div className="border-b border-stone-200 dark:border-stone-850 pb-5">
                                    <span className="block text-[9px] font-extrabold uppercase tracking-wider text-stone-500 mb-3">Classification</span>
                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <span className="block text-stone-550 text-[10px] font-bold uppercase tracking-wider">Category</span>
                                            <span className="font-black text-stone-800 dark:text-stone-250 mt-1 block">{video.category?.name || 'None'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-stone-555 text-[10px] font-bold uppercase tracking-wider">Academic Year</span>
                                            <span className="font-black text-stone-850 dark:text-stone-250 mt-1 block">{video.year?.name || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Video Tech Metadata */}
                                <div>
                                    <span className="block text-[9px] font-extrabold uppercase tracking-wider text-stone-500 mb-3">Technical Metadata</span>
                                    <div className="space-y-3.5 text-xs">
                                        <div className="flex justify-between items-center py-1.5 border-b border-stone-100 dark:border-stone-850/50">
                                            <span className="text-stone-500 dark:text-stone-400 font-bold">Resolution</span>
                                            <span className="font-black text-stone-800 dark:text-stone-200">
                                                {video.width && video.height ? `${video.width} x ${video.height}` : '1920 x 1080 (1080p)'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-1.5 border-b border-stone-100 dark:border-stone-850/50">
                                            <span className="text-stone-500 dark:text-stone-400 font-bold">Duration</span>
                                            <span className="font-black text-stone-800 dark:text-stone-200">
                                                {video.duration ? formatTime(video.duration) : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-1.5 border-b border-stone-100 dark:border-stone-850/50">
                                            <span className="text-stone-500 dark:text-stone-400 font-bold">File Size</span>
                                            <span className="font-black text-stone-800 dark:text-stone-200">
                                                {video.file_size ? `${(video.file_size / (1024 * 1024)).toFixed(1)} MB` : 'YouTube Stream'}
                                            </span>
                                        </div>
                                        {video.mime_type && (
                                            <div className="flex justify-between items-center py-1.5 border-b border-stone-100 dark:border-stone-850/50">
                                                <span className="text-stone-500 dark:text-stone-400 font-bold">Mime Type</span>
                                                <span className="font-black text-stone-800 dark:text-stone-200">{video.mime_type}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center py-1.5">
                                            <span className="text-stone-500 dark:text-stone-400 font-bold">Upload Date</span>
                                            <span className="font-black text-stone-800 dark:text-stone-200">
                                                {video.created_at ? new Date(video.created_at).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </CardBody>
                        </Card>

                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
