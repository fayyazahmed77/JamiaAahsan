import React, { useRef, useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '@/Components/ui/Card';
import { UploadCloud, Image as ImageIcon, RotateCcw } from 'lucide-react';

interface ThumbnailProps {
    thumbnail: File | null;
    setThumbnail: (file: File | null) => void;
    thumbnailUri: string;
    setThumbnailUri: (val: string) => void;
    thumbnailError?: string;
    youtubeThumbnailUrl?: string; // Auto-detected from oEmbed fetcher
}

export function ThumbnailManager({
    thumbnail,
    setThumbnail,
    thumbnailUri,
    setThumbnailUri,
    thumbnailError,
    youtubeThumbnailUrl,
}: ThumbnailProps) {

    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync preview URL when files or URIs update
    useEffect(() => {
        if (thumbnail) {
            const objectUrl = URL.createObjectURL(thumbnail);
            setPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (thumbnailUri) {
            setPreviewUrl(thumbnailUri);
        } else if (youtubeThumbnailUrl) {
            setPreviewUrl(youtubeThumbnailUrl);
            setThumbnailUri(youtubeThumbnailUrl); // sync to uri
        } else {
            setPreviewUrl(null);
        }
    }, [thumbnail, thumbnailUri, youtubeThumbnailUrl]);

    // Drag handlers
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
            if (file.type.startsWith('image/')) {
                setThumbnail(file);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnail(e.target.files[0]);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setThumbnail(null);
        setThumbnailUri('');
        setPreviewUrl(null);
    };

    return (
        <Card className="rounded-3xl border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 shadow-sm overflow-hidden mb-8">
            <CardHeader className="border-b border-stone-100 dark:border-stone-850 px-8 py-5 text-lg font-bold text-stone-900 dark:text-white">
                Thumbnail Management
            </CardHeader>
            <CardBody className="p-8">
                
                {/* Visual Display Container */}
                <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative aspect-video rounded-2xl overflow-hidden cursor-pointer flex flex-col items-center justify-center border-2 border-dashed transition-all ${dragActive ? 'border-gold-400 bg-gold-400/5' : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 hover:bg-stone-100 dark:hover:bg-stone-900'}`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {previewUrl ? (
                        <>
                            {/* Rendered Preview Cover */}
                            <div className="absolute inset-0 bg-stone-950 flex items-center justify-center z-10">
                                <img
                                    src={previewUrl}
                                    alt="Video Thumbnail Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fileInputRef.current?.click();
                                            }}
                                            className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-stone-900 shadow hover:bg-stone-100"
                                        >
                                            Replace
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleRemove}
                                            className="px-4 py-2 rounded-full text-xs font-semibold bg-red-655 text-white hover:bg-red-700 bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Placeholder Display */}
                            <div className="w-12 h-12 rounded-xl bg-gold-400/10 text-gold-400 flex items-center justify-center mb-4">
                                <ImageIcon className="w-6 h-6" />
                            </div>
                            <h4 className="font-bold text-stone-800 dark:text-white text-sm mb-1">Drag & Drop Thumbnail Image</h4>
                            <p className="text-xs text-stone-400 text-center max-w-xs leading-relaxed">
                                Aspect ratio: 16:9. Recommended resolution: 1920x1080. Max 5MB
                            </p>
                        </>
                    )}
                </div>
                {thumbnailError && <p className="text-xs text-red-500 mt-1.5">{thumbnailError}</p>}

                {/* Auto generate helper tip */}
                {youtubeThumbnailUrl && (
                    <div className="mt-4 flex items-center justify-between text-xs text-stone-500 bg-stone-50 dark:bg-stone-950 p-3 rounded-xl border border-stone-200 dark:border-stone-850">
                        <span>YouTube thumbnail automatically detected.</span>
                        <button
                            type="button"
                            onClick={() => {
                                setThumbnail(null);
                                setThumbnailUri(youtubeThumbnailUrl);
                            }}
                            className="text-gold-400 font-semibold flex items-center gap-1 hover:underline"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset to Auto</span>
                        </button>
                    </div>
                )}

            </CardBody>
        </Card>
    );
}
