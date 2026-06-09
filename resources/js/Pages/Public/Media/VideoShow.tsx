import React, { useEffect, useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import SEOHead from '@/Components/Public/SEOHead';
import PublicLayout from '@/Layouts/PublicLayout';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { 
    Calendar, Folder, User, Eye, Play, Share2,
    ArrowLeft, ChevronRight, BookOpen, Clock, AlertTriangle 
} from 'lucide-react';
import type { Video } from '@/types/models';

const YoutubeIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.495 20.455 12 20.455 12 20.455s7.505 0 9.388-.511a3.003 3.003 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
);

interface Props {
    video: Video;
    popularVideos: Video[];
}

export default function VideoShow({ video, popularVideos }: Props) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [viewCount, setViewCount] = useState(video.views || 0);

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

    // Register view count when user lands on page
    useEffect(() => {
        const markView = async () => {
            try {
                const response = await axios.post(`/api/v1/videos/${video.id}/mark-view`);
                if (response.data && typeof response.data.views === 'number') {
                    setViewCount(response.data.views);
                }
            } catch (err) {
                console.error("Error marking public video view count:", err);
            }
        };
        markView();
    }, [video.id]);

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success('Bayan link copied to clipboard!');
    };

    return (
        <div className="bg-background min-h-screen text-foreground transition-colors pb-12">
            <SEOHead 
                title={video.title} 
                description={video.description || `${video.title} video lecture by ${video.speaker?.name || 'scholars of Jamia Ahsan'}.`}
            />

            {/* Sub-Header Banner with Gold and Sapphire Accents */}
            <div className="relative bg-sapphire-950 py-12 md:py-20 text-white overflow-hidden shadow-md">
                {/* Background Image with Overlays */}
                <div className="absolute inset-0 pointer-events-none">
                    <img 
                        src="/images/video-page-bg.png" 
                        alt="" 
                        className="w-full h-full object-cover opacity-25" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sapphire-950 via-sapphire-900/40 to-sapphire-950" />
                </div>
                
                <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
                    {video.category?.name && (
                        <span className="text-[10px] uppercase tracking-widest font-black text-gold-400 bg-gold-400/10 border border-gold-400/20 px-3 py-1.5 rounded-full mb-4">
                            {video.category.name}
                        </span>
                    )}
                    <h1 className="text-2xl md:text-4xl font-black tracking-tight font-heading mb-4 max-w-4xl leading-tight text-white drop-shadow-sm">
                        {video.title}
                    </h1>
                    {video.urdu_title && (
                        <p className="text-2xl md:text-3xl text-gold-200 font-bold font-urdu mt-2 leading-relaxed" dir="rtl">
                            {video.urdu_title}
                        </p>
                    )}
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs font-semibold text-stone-300">
                        <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-gold-400" />
                            <span>{video.speaker?.name || 'Unknown Scholar'}</span>
                        </span>
                        {video.year?.name && (
                            <>
                                <span className="text-stone-600">•</span>
                                <span className="flex items-center gap-1.5">
                                    <Folder className="w-3.5 h-3.5 text-sapphire-400" />
                                    <span>Year {video.year.name}</span>
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Breadcrumbs / Navigation Strip */}
            <div className="border-b border-stone-200/80 dark:border-stone-800/40 bg-stone-50/50 dark:bg-sapphire-950/10 py-3.5 mb-8">
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-semibold min-w-0">
                        <Link href="/" className="hover:text-sapphire-500 transition-colors shrink-0">Home</Link>
                        <span className="text-stone-300 dark:text-stone-700 shrink-0">/</span>
                        <Link href="/media/video" className="hover:text-sapphire-500 transition-colors shrink-0">Video Library</Link>
                        <span className="text-stone-300 dark:text-stone-700 shrink-0">/</span>
                        <span className="text-stone-900 dark:text-white font-bold truncate max-w-[150px] sm:max-w-xs md:max-w-sm">
                            {video.title}
                        </span>
                    </div>
                    <Link 
                        href="/media/video"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-sapphire-500 dark:text-stone-350 dark:hover:text-sapphire-300 transition-colors shrink-0"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Video Library</span>
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6">
                
                {/* Main 12-Column Responsive Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Section (Video Player & Info - 8 Columns) */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* Video Screen card */}
                        <div className="bg-card border border-stone-200/80 dark:border-stone-800/50 rounded-3xl overflow-hidden shadow-md dark:shadow-none">
                            
                            {/* Aspect Ratio Screen */}
                            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                                {youtubeId ? (
                                    <iframe
                                        className="w-full h-full absolute inset-0 z-10"
                                        src={`https://www.youtube.com/embed/${youtubeId}?rel=0&autoplay=0`}
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
                                        controls
                                        preload="metadata"
                                        poster={video.thumbnail_uri ? (video.thumbnail_uri.startsWith('http') ? video.thumbnail_uri : `/storage/thumbnails/${video.thumbnail_uri}`) : undefined}
                                    />
                                ) : (
                                    <div className="text-stone-500 text-sm font-semibold p-8 text-center">
                                        No playback media source available for this lecture.
                                    </div>
                                )}
                            </div>

                            {/* Actions under the player */}
                            <div className="border-t border-stone-200/60 dark:border-stone-800/40 bg-stone-50/30 dark:bg-sapphire-950/10 p-4 px-6 flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-2">
                                    {video.youtube_url && (
                                        <a 
                                            href={video.youtube_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="h-9 px-4 rounded-xl bg-red-650 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                                            title="Watch on YouTube"
                                        >
                                            <YoutubeIcon className="w-4 h-4" />
                                            <span>Watch on YouTube</span>
                                        </a>
                                    )}
                                    <button 
                                        onClick={handleShare}
                                        className="h-9 px-3.5 rounded-xl bg-card border border-stone-200 dark:border-stone-800/60 text-stone-600 dark:text-stone-300 flex items-center justify-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors cursor-pointer text-xs font-semibold"
                                        title="Share lecture Link"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        <span>Share</span>
                                    </button>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-semibold bg-stone-100/50 dark:bg-sapphire-950/40 px-2.5 py-1.5 rounded-lg border border-stone-200/60 dark:border-stone-800/40">
                                    <Eye className="w-4 h-4 text-sapphire-500" />
                                    <span>{viewCount.toLocaleString()} Views</span>
                                </div>
                            </div>

                        </div>

                        {/* Title and Metadata details */}
                        <div className="bg-card border border-stone-200/80 dark:border-stone-800/50 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                            
                            {/* Author scholar details strip */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200/65 dark:border-stone-800/40">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sapphire-600 to-gold-400 text-white font-black flex items-center justify-center text-base shadow-md shadow-sapphire-500/10">
                                        {(video.speaker?.name?.[0] || 'S').toUpperCase()}
                                    </div>
                                    <div>
                                        <span className="block text-stone-900 dark:text-white font-black text-sm">{video.speaker?.name || 'Unknown Scholar'}</span>
                                        <span className="block text-[10px] text-stone-450 mt-0.5">Scholar Profile Lecture</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold text-stone-500 dark:text-stone-400">
                                    <span className="flex items-center gap-1.5 bg-stone-50 dark:bg-sapphire-950/20 px-3 py-1.5 rounded-xl border border-stone-200/60 dark:border-stone-800/40">
                                        <Calendar className="w-3.5 h-3.5 text-gold-450" />
                                        <span>{video.created_at ? new Date(video.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Video Description block */}
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
                                    <BookOpen className="w-4 h-4 text-sapphire-500" />
                                    <span>About this Bayan</span>
                                </h3>
                                <div className="text-sm leading-relaxed text-stone-600 dark:text-stone-300 font-medium whitespace-pre-line">
                                    {video.description || <span className="text-stone-450 italic">No description provided.</span>}
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Right Section (Popular Bayanat - 4 Columns) */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        <div className="bg-card border border-stone-200/80 dark:border-stone-800/50 rounded-3xl p-6 shadow-sm">
                            
                            <h3 className="text-xs font-black uppercase tracking-wider text-stone-800 dark:text-stone-200 mb-5 pb-3 border-b border-stone-200/60 dark:border-stone-800/40 flex items-center gap-2">
                                <Play className="w-4 h-4 text-sapphire-500 dark:text-sapphire-300 fill-current" />
                                Popular Bayanat
                            </h3>

                            <div className="space-y-3">
                                {popularVideos.map((pVideo) => (
                                    <Link 
                                        key={pVideo.id} 
                                        href={`/media/video/${pVideo.slug}`}
                                        className="block group"
                                    >
                                        <div className="flex gap-3 hover:bg-stone-50 dark:hover:bg-stone-900/60 p-2.5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5">
                                            
                                            {/* Small Thumbnail with Play Icon Overlay on Hover */}
                                            <div className="w-24 aspect-video rounded-xl overflow-hidden bg-stone-900 shrink-0 border border-stone-200/60 dark:border-stone-800/40 relative group-hover:shadow-sm">
                                                <img 
                                                    src={pVideo.thumbnail_uri ? (pVideo.thumbnail_uri.startsWith('http') ? pVideo.thumbnail_uri : `/storage/thumbnails/${pVideo.thumbnail_uri}`) : '/storage/default_thumbnail.png'} 
                                                    alt="" 
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                                    <Play className="w-4 h-4 text-white fill-current animate-scaleIn" />
                                                </div>
                                            </div>

                                            {/* Title & Metadata details */}
                                            <div className="min-w-0 flex flex-col justify-center">
                                                <h4 className="text-xs font-black text-stone-850 dark:text-stone-200 group-hover:text-sapphire-600 dark:group-hover:text-sapphire-300 transition-colors line-clamp-2 leading-tight mb-1.5">
                                                    {pVideo.title}
                                                </h4>
                                                <div className="flex items-center gap-1.5 text-[10px] text-stone-500 dark:text-stone-400 font-bold">
                                                    <span className="truncate max-w-[80px]">{pVideo.speaker?.name || 'Scholar'}</span>
                                                    <span>•</span>
                                                    <span>{(pVideo.views || 0).toLocaleString()} views</span>
                                                </div>
                                            </div>

                                        </div>
                                    </Link>
                                ))}
                                
                                {popularVideos.length === 0 && (
                                    <p className="text-stone-450 italic text-xs text-center py-4">No other videos available.</p>
                                )}
                            </div>

                            {/* View All Button CTA */}
                            <div className="mt-5 pt-4 border-t border-stone-200/60 dark:border-stone-800/40 text-center">
                                <Link 
                                    href="/media/video"
                                    className="inline-flex items-center gap-1 text-xs font-bold text-sapphire-600 hover:text-sapphire-700 dark:text-sapphire-400 dark:hover:text-sapphire-300 transition-colors"
                                >
                                    <span>View All Video Bayanat</span>
                                    <span>→</span>
                                </Link>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

// Assign layout context to preserve persistent player states
VideoShow.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
