import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import SEOHead from '@/Components/Public/SEOHead';
import PublicLayout from '@/Layouts/PublicLayout';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { Badge } from '@/Components/ui/Badge';
import { toast } from 'react-hot-toast';
import { 
    Search, Calendar, Folder, User, Eye, Play, Share2, 
    ChevronRight, Layers, List, LayoutGrid 
} from 'lucide-react';
import type { Video, Speaker, Category, Year, Paginated } from '@/types/models';
import SearchableSelect from '@/Components/Public/SearchableSelect';
import { cn } from '@/lib/utils';

interface Props {
    videos: Paginated<Video>;
    speakers: Speaker[];
    categories: Category[];
    years: Year[];
    filters: {
        search?: string;
        speaker_id?: string;
        category_id?: string;
        year_id?: string;
    };
}

export default function VideoIndex({ videos, speakers, categories, years, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [yearFilter, setYearFilter] = useState(filters.year_id ?? '');
    const [speakerFilter, setSpeakerFilter] = useState(filters.speaker_id ?? '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category_id ?? '');
    const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>('list');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/media/video',
            {
                search: search || undefined,
                year_id: yearFilter || undefined,
                speaker_id: speakerFilter || undefined,
                category_id: categoryFilter || undefined,
            },
            { preserveState: true }
        );
    };

    const handleShare = (e: React.MouseEvent, video: Video) => {
        e.stopPropagation();
        e.preventDefault();
        const url = `${window.location.origin}/media/video/${video.slug}`;
        navigator.clipboard.writeText(url);
        toast.success('Bayan link copied to clipboard!');
    };

    const handleReset = () => {
        setSearch('');
        setYearFilter('');
        setSpeakerFilter('');
        setCategoryFilter('');
        router.get('/media/video');
    };

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url, {}, { preserveState: true });
        }
    };

    const getThumbnailUrl = (path: string | null) => {
        if (!path) return '/storage/default_thumbnail.png';
        if (path.startsWith('http')) return path;
        return `/storage/thumbnails/${path}`;
    };

    return (
        <div className="bg-background min-h-screen text-foreground transition-colors">
            <SEOHead 
                title="Video Library" 
                description="Explore our comprehensive library of scholarly video lectures and series on Quran, Hadith, Fiqh, and contemporary topics."
            />

            {/* Sub-Header Banner */}
            <div className="relative bg-sapphire-950 py-12 md:py-16 text-white overflow-hidden shadow-md">
                {/* Background Image with Overlays */}
                <div className="absolute inset-0 pointer-events-none">
                    <img 
                        src="/images/video-page-bg.png" 
                        alt="" 
                        className="w-full h-full object-cover opacity-90" 
                    />
                    <div className="absolute inset-0 bg-black/25" />
                </div>
                <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center text-center">
                    <span className="text-[10px] uppercase tracking-widest font-black text-gold-400 bg-gold-400/10 border border-gold-400/20 px-3 py-1 rounded-full mb-3">
                        Video Hub
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight font-heading mb-4">
                        Islamic Video Bayanat & Lectures
                    </h1>
                    <p className="text-sm md:text-base text-stone-300 max-w-2xl font-medium">
                        Explore our comprehensive library of scholarly video lectures and series on Quran, Hadith, Fiqh, and contemporary topics.
                    </p>
                </div>
            </div>

            {/* Interactive Search & Filter Toolbar */}
            <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
                <form onSubmit={handleSearchSubmit} className="bg-card border border-stone-200/80 dark:border-stone-800/80 shadow-md shadow-stone-100/30 dark:shadow-none rounded-2xl p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    
                    {/* Search Input */}
                    <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                        <label className="text-[11px] font-black uppercase text-stone-400 tracking-wider">Search Keywords</label>
                        <div className="relative">
                            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                            <Input
                                placeholder="Search titles, description..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 h-10.5 rounded-xl border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40"
                            />
                        </div>
                    </div>

                    {/* Scholar Filter */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase text-stone-400 tracking-wider">Scholar / Speaker</label>
                        <SearchableSelect
                            value={speakerFilter}
                            onChange={(val) => setSpeakerFilter(val)}
                            options={speakers.map(s => ({ value: s.id, label: s.name }))}
                            placeholder="All Speakers"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase text-stone-400 tracking-wider">Category</label>
                        <SearchableSelect
                            value={categoryFilter}
                            onChange={(val) => setCategoryFilter(val)}
                            options={categories.map(c => ({ value: c.id, label: c.name }))}
                            placeholder="All Categories"
                        />
                    </div>

                    {/* Academic Year Filter */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase text-stone-400 tracking-wider">Academic Year</label>
                        <SearchableSelect
                            value={yearFilter}
                            onChange={(val) => setYearFilter(val)}
                            options={years.map(y => ({ value: y.id, label: y.name.toString() }))}
                            placeholder="All Years"
                        />
                    </div>

                    {/* Actions Panel */}
                    <div className="flex gap-2">
                        <Button type="submit" className="flex-1 h-10.5 bg-sapphire-500 hover:bg-sapphire-400 text-white font-bold rounded-xl border-transparent cursor-pointer">
                            Filter
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleReset} className="h-10.5 border-stone-200 dark:border-stone-850 hover:bg-stone-100 dark:hover:bg-stone-850 rounded-xl cursor-pointer">
                            Reset
                        </Button>
                    </div>

                </form>
            </div>

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
                
                {/* Videos List */}
                <div className="space-y-6">
                    
                    {/* Results count & Grid/List View toggle */}
                    {videos.data.length > 0 && (
                        <div className="flex items-center justify-between bg-stone-50/60 dark:bg-sapphire-950/20 border border-stone-200/60 dark:border-stone-800/60 rounded-xl px-4 py-3 shadow-xs">
                            <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                                Showing {videos.data.length} {videos.data.length === 1 ? 'lecture' : 'lectures'}
                            </span>
                            <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-850 p-1 rounded-lg border border-stone-200/40 dark:border-stone-800/40">
                                <button
                                    type="button"
                                    onClick={() => setLayoutMode('list')}
                                    className={`p-1.5 rounded-md transition-colors cursor-pointer border-none flex items-center justify-center ${
                                        layoutMode === 'list'
                                            ? 'bg-white dark:bg-stone-800 text-sapphire-500 dark:text-sapphire-300 shadow-xs'
                                             : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                                    }`}
                                    title="List View"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLayoutMode('grid')}
                                    className={`p-1.5 rounded-md transition-colors cursor-pointer border-none flex items-center justify-center ${
                                        layoutMode === 'grid'
                                            ? 'bg-white dark:bg-stone-800 text-sapphire-500 dark:text-sapphire-300 shadow-xs'
                                            : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                                    }`}
                                    title="Grid View (4 in row)"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {videos.data.length === 0 ? (
                        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-12 text-center shadow-sm">
                            <Layers className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
                            <h3 className="text-lg font-black text-stone-800 dark:text-stone-200 mb-1">No Video Bayanat Found</h3>
                            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                                We couldn't find any video records matching your selected filters. Try broadening your keywords or resetting filters.
                            </p>
                        </div>
                    ) : (
                        <div className={layoutMode === 'list' ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"}>
                            {videos.data.map((video) => (
                                <Link 
                                    key={video.id} 
                                    href={`/media/video/${video.slug}`}
                                    className="block group"
                                >
                                    <div className={cn(
                                        "bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-lg hover:border-sapphire-500/40 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full",
                                        layoutMode === 'list' ? "md:flex-row p-4 md:p-5 gap-5" : "p-0 gap-0"
                                    )}>
                                        
                                        {/* Thumbnail Container */}
                                        <div className={cn(
                                            "relative aspect-video bg-stone-900 overflow-hidden shrink-0",
                                            layoutMode === 'list' 
                                                ? "rounded-xl border border-stone-200/60 dark:border-stone-800/60 w-full md:w-90" 
                                                : "rounded-t-lg rounded-b-none border-b border-stone-200/60 dark:border-stone-800/60 w-full"
                                        )}>
                                            <img
                                                src={getThumbnailUrl(video.thumbnail_uri)}
                                                alt=""
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                            
                                            {/* Share button on top right of thumbnail */}
                                            <button 
                                                onClick={(e) => handleShare(e, video)}
                                                className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white flex items-center justify-center transition-all duration-200 cursor-pointer z-20 border border-white/10 hover:scale-105"
                                                title="Share Bayan"
                                            >
                                                <Share2 className="w-3.5 h-3.5" />
                                            </button>

                                            {/* View Count Overlay at bottom-right of thumbnail */}
                                            <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 z-10 shadow-sm">
                                                <Eye className="w-3 h-3 text-blue-300" />
                                                <span>{(video.views || 0).toLocaleString()}</span>
                                            </div>

                                            {/* Hover play icon wrapper */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                                <div className="w-12 h-12 rounded-full bg-sapphire-500/90 text-white flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                                                    <Play className="w-5 h-5 fill-current ml-1" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Container */}
                                        <div className={cn(
                                            "flex-grow flex flex-col justify-between min-w-0",
                                            layoutMode === 'list' ? "" : "p-4 pt-3.5"
                                        )}>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    {video.category?.name && (
                                                        <Badge variant="outline" className="border-sapphire-500/20 text-sapphire-500 dark:text-sapphire-300 bg-sapphire-500/5 text-[9px] font-black uppercase rounded-lg px-2">
                                                            {video.category.name}
                                                        </Badge>
                                                    )}
                                                    {video.year?.name && (
                                                        <Badge variant="outline" className="border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-950 text-[9px] font-black uppercase rounded-lg px-2">
                                                            {video.year.name}
                                                        </Badge>
                                                    )}
                                                </div>
                                                
                                                <h3 className={cn(
                                                    "font-black text-stone-900 dark:text-stone-150 leading-tight mb-2 group-hover:text-sapphire-500 dark:group-hover:text-sapphire-300 transition-colors truncate",
                                                    layoutMode === 'list' ? "text-base md:text-lg" : "text-sm md:text-base"
                                                )}>
                                                    {video.title}
                                                </h3>
                                                
                                                {video.urdu_title && (
                                                    <p className={cn(
                                                        "text-stone-600 dark:text-stone-300 font-bold mb-3 font-urdu text-right leading-relaxed",
                                                        layoutMode === 'list' ? "text-base" : "text-sm"
                                                    )} dir="rtl">
                                                        {video.urdu_title}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Bayan Meta details */}
                                            <div className="border-t border-stone-100 dark:border-stone-850/60 pt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] font-semibold text-stone-500 dark:text-stone-400 mt-auto">
                                                <div className={cn(
                                                    "flex flex-wrap items-center",
                                                    layoutMode === 'list' ? "gap-4" : "gap-2"
                                                )}>
                                                    <span className="flex items-center gap-1.5">
                                                        {video.speaker?.image_url ? (
                                                            <img
                                                                src={video.speaker.image_url}
                                                                alt={video.speaker.name}
                                                                className="w-5 h-5 rounded-full object-cover border border-stone-200/60 dark:border-stone-800/80"
                                                            />
                                                        ) : (
                                                            <div className="w-5 h-5 rounded-full bg-sapphire-500/10 dark:bg-sapphire-500/20 text-sapphire-600 dark:text-sapphire-300 font-black flex items-center justify-center text-[9px] border border-stone-200/60 dark:border-stone-800/80">
                                                                {(video.speaker?.name?.[0] || 'S').toUpperCase()}
                                                            </div>
                                                        )}
                                                        <span className="truncate max-w-[120px] font-bold text-stone-700 dark:text-stone-300">
                                                            {video.speaker?.name || 'Scholar'}
                                                        </span>
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-gold-400" />
                                                        <span>{video.created_at ? new Date(video.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                                                    </span>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination Strip */}
                    {videos.meta && videos.meta.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-stone-200 dark:border-stone-850/60 pt-6 mt-8">
                            <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                                Page {videos.meta.current_page} of {videos.meta.last_page}
                            </span>
                            <div className="flex gap-1.5">
                                {videos.links.prev && (
                                    <Button 
                                        variant="outline" 
                                        onClick={() => handlePageChange(videos.links.prev)}
                                        className="h-9 px-3 rounded-lg border-stone-200 dark:border-stone-800 cursor-pointer"
                                    >
                                        Previous
                                    </Button>
                                )}
                                {videos.links.next && (
                                    <Button 
                                        variant="outline" 
                                        onClick={() => handlePageChange(videos.links.next)}
                                        className="h-9 px-3 rounded-lg border-stone-200 dark:border-stone-800 cursor-pointer"
                                    >
                                        Next
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

// Assign layout context to preserve persistent player states
VideoIndex.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
