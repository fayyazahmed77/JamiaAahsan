import React, { useRef, useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import { UploadCloud, Link as LinkIcon, FileVideo, AlertCircle, Play } from 'lucide-react';
import axios from 'axios';

const Youtube = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.495 20.455 12 20.455 12 20.455s7.505 0 9.388-.511a3.003 3.003 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
);

interface SourceProps {
    sourceType: 'youtube' | 'upload' | 'external';
    setSourceType: (type: 'youtube' | 'upload' | 'external') => void;
    youtubeUrl: string;
    setYoutubeUrl: (val: string) => void;
    youtubeError?: string;
    uri: string;
    setUri: (val: string) => void;
    uriError?: string;
    videoFile: File | null;
    setVideoFile: (file: File | null) => void;
    videoFileError?: string;
    onMetadataDetected: (meta: {
        duration?: number;
        width?: number;
        height?: number;
        file_size?: number;
        mime_type?: string;
        thumbnail_url?: string;
        title?: string;
    }) => void;
}

export function VideoSourceSelector({
    sourceType,
    setSourceType,
    youtubeUrl,
    setYoutubeUrl,
    youtubeError,
    uri,
    setUri,
    uriError,
    videoFile,
    setVideoFile,
    videoFileError,
    onMetadataDetected,
}: SourceProps) {

    const [isFetchingYoutube, setIsFetchingYoutube] = useState(false);
    const [youtubeFetchError, setYoutubeFetchError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [detectedMetadata, setDetectedMetadata] = useState<{
        duration?: number;
        resolution?: string;
        format?: string;
        size?: string;
    } | null>(null);

    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Clean up local video preview URLs to prevent memory leaks
    useEffect(() => {
        if (videoFile) {
            const url = URL.createObjectURL(videoFile);
            setVideoPreviewUrl(url);
            return () => {
                URL.revokeObjectURL(url);
            };
        } else {
            setVideoPreviewUrl(null);
        }
    }, [videoFile]);

    // Robust YouTube ID extractor
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Dynamic Youtube oEmbed Fetcher
    const handleFetchYoutubeMetadata = async () => {
        if (!youtubeUrl) return;
        setIsFetchingYoutube(true);
        setYoutubeFetchError(null);

        try {
            const response = await axios.get('/api/v1/youtube/fetch', {
                params: { url: youtubeUrl }
            });

            if (response.data.success) {
                const meta = response.data.data;
                onMetadataDetected({
                    title: meta.title,
                    thumbnail_url: meta.thumbnail_url,
                });
            }
        } catch (err: any) {
            setYoutubeFetchError(err.response?.data?.message || 'Failed to fetch YouTube details.');
        } finally {
            setIsFetchingYoutube(false);
        }
    };

    // Client-side video metadata detection using hidden HTML5 video element
    const detectClientMetadata = (file: File) => {
        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';
        videoElement.src = URL.createObjectURL(file);

        videoElement.onloadedmetadata = () => {
            URL.revokeObjectURL(videoElement.src);
            const duration = Math.round(videoElement.duration);
            const width = videoElement.videoWidth;
            const height = videoElement.videoHeight;
            const resolution = `${width}x${height} (${height >= 1080 ? '1080p HD' : height >= 720 ? '720p HD' : 'SD'})`;
            const format = file.type;
            const size = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

            setDetectedMetadata({
                duration,
                resolution,
                format,
                size
            });

            onMetadataDetected({
                duration,
                width,
                height,
                file_size: file.size,
                mime_type: file.type
            });
        };
    };

    const handleExternalMetadataLoaded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const video = e.currentTarget;
        if (!video.duration) return;
        
        onMetadataDetected({
            duration: Math.round(video.duration),
            width: video.videoWidth,
            height: video.videoHeight,
        });
    };

    // File inputs & Drag handlers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setVideoFile(file);
            detectClientMetadata(file);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('video/')) {
                setVideoFile(file);
                detectClientMetadata(file);
            }
        }
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const youtubeId = getYoutubeId(youtubeUrl);

    return (
        <Card className="rounded-3xl border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 shadow-sm overflow-hidden mb-8">
            <CardHeader className="border-b border-stone-100 dark:border-stone-850 px-8 py-5 text-lg font-bold text-stone-900 dark:text-white">
                Video Source
            </CardHeader>
            <CardBody className="p-8">
                
                {/* Stripe-like responsive segmented controls */}
                <div className="grid grid-cols-3 gap-1 bg-stone-100 dark:bg-stone-950 p-1.5 rounded-2xl mb-8 max-w-lg border border-stone-200/50 dark:border-stone-850/50">
                    <button
                        type="button"
                        onClick={() => setSourceType('youtube')}
                        className={`py-2.5 px-3 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${sourceType === 'youtube' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm border border-stone-200/40 dark:border-stone-700/40' : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-200/40 dark:hover:bg-stone-900/30'}`}
                    >
                        <Youtube className={`w-4 h-4 transition-colors ${sourceType === 'youtube' ? 'text-red-500' : 'text-stone-400'}`} />
                        <span className="hidden sm:inline">YouTube</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setSourceType('upload')}
                        className={`py-2.5 px-3 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${sourceType === 'upload' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm border border-stone-200/40 dark:border-stone-700/40' : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-200/40 dark:hover:bg-stone-900/30'}`}
                    >
                        <UploadCloud className={`w-4 h-4 transition-colors ${sourceType === 'upload' ? 'text-sapphire-500' : 'text-stone-400'}`} />
                        <span className="hidden sm:inline">Upload File</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setSourceType('external')}
                        className={`py-2.5 px-3 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${sourceType === 'external' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm border border-stone-200/40 dark:border-stone-700/40' : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-200/40 dark:hover:bg-stone-900/30'}`}
                    >
                        <LinkIcon className={`w-4 h-4 transition-colors ${sourceType === 'external' ? 'text-gold-400' : 'text-stone-400'}`} />
                        <span className="hidden sm:inline">External URL</span>
                    </button>
                </div>

                {/* YOUTUBE INPUT PANEL */}
                {sourceType === 'youtube' && (
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                            <div className="flex-grow w-full">
                                <Input
                                    label="YouTube Video Link"
                                    value={youtubeUrl}
                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                    error={youtubeError}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="rounded-xl border-stone-200 dark:border-stone-800 w-full"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleFetchYoutubeMetadata}
                                disabled={isFetchingYoutube || !youtubeUrl}
                                className="w-full sm:w-auto h-[44px] px-6 rounded-xl text-xs md:text-sm font-bold bg-[#021f18] hover:bg-[#033227] dark:bg-gold-400 dark:hover:bg-gold-300 text-white dark:text-stone-950 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 border border-transparent cursor-pointer shrink-0"
                            >
                                {isFetchingYoutube ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        <span>Fetching...</span>
                                    </>
                                ) : (
                                    <span>Fetch Metadata</span>
                                )}
                            </button>
                        </div>
                        {youtubeFetchError && (
                            <div className="flex items-center gap-2 text-xs text-red-500 mt-1">
                                <AlertCircle className="w-4 h-4" />
                                <span>{youtubeFetchError}</span>
                            </div>
                        )}

                        {/* YouTube embedded simulator preview */}
                        {youtubeId && (
                            <div className="relative aspect-video rounded-2xl overflow-hidden mt-6 bg-stone-950 border border-stone-200 dark:border-stone-800 flex items-center justify-center">
                                <iframe
                                    className="w-full h-full relative z-20"
                                    src={`https://www.youtube.com/embed/${youtubeId}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* FILE UPLOAD PANEL */}
                {sourceType === 'upload' && (
                    <div className="space-y-6">
                        {videoFile ? (
                            <div className="border border-stone-200 dark:border-stone-800 rounded-3xl p-6 bg-stone-50 dark:bg-stone-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded-2xl bg-sapphire-500/10 text-sapphire-500 flex items-center justify-center shrink-0">
                                        <FileVideo className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-stone-850 dark:text-white text-sm truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                                            {videoFile.name}
                                        </h4>
                                        <p className="text-xs text-stone-400 mt-1">
                                            {(videoFile.size / (1024 * 1024)).toFixed(1)} MB • Ready to upload
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setVideoFile(null)}
                                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold border border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                                >
                                    Remove File
                                </button>
                            </div>
                        ) : (
                            <div
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${dragActive ? 'border-gold-400 bg-gold-400/5' : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/30 hover:bg-stone-100 dark:hover:bg-stone-900/55'}`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <div className="w-16 h-16 rounded-2xl bg-gold-400/10 text-gold-400 flex items-center justify-center mb-4">
                                    <UploadCloud className="w-8 h-8" />
                                </div>
                                <h4 className="font-bold text-stone-800 dark:text-white mb-1 text-sm">
                                    Select or Drop Video file
                                </h4>
                                <p className="text-xs text-stone-400 text-center max-w-xs leading-relaxed">
                                    Supports MP4, MOV, MKV, or WebM formats. Max file size: 500MB
                                </p>
                            </div>
                        )}
                        {videoFileError && <p className="text-xs text-red-500 mt-1">{videoFileError}</p>}

                        {/* Local video playback simulator */}
                        {videoFile && videoPreviewUrl && (
                            <div className="relative aspect-video rounded-2xl overflow-hidden mt-6 bg-stone-950 border border-stone-200 dark:border-stone-800 flex items-center justify-center">
                                <video
                                    className="w-full h-full relative z-20"
                                    src={videoPreviewUrl}
                                    controls
                                    preload="metadata"
                                />
                            </div>
                        )}

                        {/* Client-side Metadata Diagnostics panel */}
                        {videoFile && detectedMetadata && (
                            <div className="bg-stone-50 dark:bg-stone-950/30 border border-stone-250/60 dark:border-stone-850 p-6 rounded-2xl">
                                <h5 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-4 flex items-center gap-2">
                                    <FileVideo className="w-4 h-4" />
                                    Detected Video Metadata (Pre-upload)
                                </h5>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-stone-600 dark:text-stone-400">
                                    <div>
                                        <span className="block text-stone-400 mb-0.5">Duration</span>
                                        <span className="font-semibold text-stone-800 dark:text-stone-200">{formatDuration(detectedMetadata.duration)}</span>
                                    </div>
                                    <div>
                                        <span className="block text-stone-400 mb-0.5">Resolution</span>
                                        <span className="font-semibold text-stone-800 dark:text-stone-200">{detectedMetadata.resolution}</span>
                                    </div>
                                    <div>
                                        <span className="block text-stone-400 mb-0.5">File Format</span>
                                        <span className="font-semibold text-stone-800 dark:text-stone-200">{detectedMetadata.format}</span>
                                    </div>
                                    <div>
                                        <span className="block text-stone-400 mb-0.5">File Size</span>
                                        <span className="font-semibold text-stone-800 dark:text-stone-200">{detectedMetadata.size}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* EXTERNAL LINK INPUT */}
                {sourceType === 'external' && (
                    <div className="space-y-4">
                        <Input
                            label="External Video Stream URL"
                            value={uri}
                            onChange={(e) => setUri(e.target.value)}
                            error={uriError}
                            placeholder="https://example.com/stream/lectures.mp4"
                            className="rounded-xl border-stone-200 dark:border-stone-800"
                        />

                        {/* External URL video playback simulator */}
                        {uri && (uri.startsWith('http://') || uri.startsWith('https://')) && (
                            <div className="relative aspect-video rounded-2xl overflow-hidden mt-6 bg-stone-950 border border-stone-200 dark:border-stone-800 flex items-center justify-center">
                                <video
                                    className="w-full h-full relative z-20"
                                    src={uri}
                                    controls
                                    preload="metadata"
                                    onLoadedMetadata={handleExternalMetadataLoaded}
                                />
                            </div>
                        )}
                    </div>
                )}

            </CardBody>
        </Card>
    );
}
