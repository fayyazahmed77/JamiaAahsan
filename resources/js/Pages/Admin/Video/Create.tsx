import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { VideoHeader } from './components/VideoHeader';
import { VideoInformationCard } from './components/VideoInformationCard';
import { VideoSourceSelector } from './components/VideoSourceSelector';
import { ThumbnailManager } from './components/ThumbnailManager';
import { SeoAccordion } from './components/SeoAccordion';
import { PublishPanel } from './components/PublishPanel';
import { ClassificationCard } from './components/ClassificationCard';
import { LiveCardSimulator } from './components/LiveCardSimulator';
import type { Speaker, Category, Year } from '@/types/models';
import { Alert } from '@/Components/ui/Alert';
import { RotateCcw } from 'lucide-react';

interface Props {
    speakers: Speaker[];
    categories: Category[];
    years: Year[];
}

export default function VideoCreate({ speakers, categories, years }: Props) {
    const { data, setData, post, transform, processing, errors } = useForm({
        title: '',
        slug: '',
        urdu_title: '',
        video_file: null as File | null,
        uri: '',
        youtube_url: '',
        description: '',
        thumbnail: null as File | null,
        thumbnail_uri: '',
        status: false, // Default to Draft for security/draft workflow
        speaker_id: '',
        category_id: '',
        year_id: '',
        tags: [] as string[],
        duration: null as number | null,
        width: null as number | null,
        height: null as number | null,
        file_size: null as number | null,
        mime_type: '',
        meta_title: '',
        meta_description: '',
    });

    const [sourceType, setSourceType] = useState<'youtube' | 'upload' | 'external'>('youtube');
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [hasLocalDraft, setHasLocalDraft] = useState(false);

    // Auto-populate detected video metadata
    const handleMetadataDetected = (meta: {
        duration?: number;
        width?: number;
        height?: number;
        file_size?: number;
        mime_type?: string;
        thumbnail_url?: string;
        title?: string;
    }) => {
        if (meta.duration !== undefined) setData('duration', meta.duration);
        if (meta.width !== undefined) setData('width', meta.width);
        if (meta.height !== undefined) setData('height', meta.height);
        if (meta.file_size !== undefined) setData('file_size', meta.file_size);
        if (meta.mime_type !== undefined) setData('mime_type', meta.mime_type);
        
        // Auto-fetch YouTube items
        if (meta.title && !data.title) setData('title', meta.title);
        if (meta.thumbnail_url && !data.thumbnail_uri) setData('thumbnail_uri', meta.thumbnail_url);
    };

    // Auto-save strategy: debounced local storage sync
    useEffect(() => {
        const localDraft = localStorage.getItem('jamia_ahsan_video_draft');
        if (localDraft) {
            setHasLocalDraft(true);
        }
    }, []);

    useEffect(() => {
        // Only trigger auto-save if we have at least entered a title to prevent saving empty fields
        if (!data.title) return;

        const timer = setTimeout(() => {
            setIsSavingDraft(true);
            const draftData = {
                title: data.title,
                slug: data.slug,
                urdu_title: data.urdu_title,
                uri: data.uri,
                youtube_url: data.youtube_url,
                description: data.description,
                thumbnail_uri: data.thumbnail_uri,
                status: data.status,
                speaker_id: data.speaker_id,
                category_id: data.category_id,
                year_id: data.year_id,
                tags: data.tags,
                meta_title: data.meta_title,
                meta_description: data.meta_description,
            };
            localStorage.setItem('jamia_ahsan_video_draft', JSON.stringify(draftData));
            setLastSaved(new Date());
            setIsSavingDraft(false);
        }, 15000); // 15 seconds debounce

        return () => clearTimeout(timer);
    }, [data]);

    const handleRestoreDraft = () => {
        const saved = localStorage.getItem('jamia_ahsan_video_draft');
        if (saved) {
            const parsed = JSON.parse(saved);
            setData(prev => ({
                ...prev,
                ...parsed
            }));
            setHasLocalDraft(false);
        }
    };

    const handleDiscardDraft = () => {
        localStorage.removeItem('jamia_ahsan_video_draft');
        setHasLocalDraft(false);
    };

    const handleSubmit = () => {
        transform((data) => ({
            ...data,
            video_file: sourceType === 'upload' ? data.video_file : null,
            youtube_url: sourceType === 'youtube' ? data.youtube_url : '',
            uri: sourceType === 'external' ? data.uri : (sourceType === 'youtube' ? '' : data.uri),
        }));
        post('/admin/videos', {
            onSuccess: () => {
                localStorage.removeItem('jamia_ahsan_video_draft'); // Clean draft upon successful publish
            }
        });
    };

    // Setup Checklist parameters
    const checklist = {
        titleAdded: !!data.title,
        descriptionAdded: !!data.description && data.description.length >= 10,
        videoSelected: sourceType === 'youtube' ? !!data.youtube_url : (sourceType === 'upload' ? (!!data.video_file || !!data.uri) : !!data.uri),
        thumbnailSelected: !!data.thumbnail || !!data.thumbnail_uri,
        speakerSelected: !!data.speaker_id,
        categorySelected: !!data.category_id,
        yearSelected: !!data.year_id,
    };

    const selectedSpeaker = speakers.find(s => s.id.toString() === data.speaker_id.toString());
    const selectedCategory = categories.find(c => c.id.toString() === data.category_id.toString());

    return (
        <AdminLayout
            title="Video Studio — Upload Video"
            breadcrumbs={[
                { label: 'Video Library', href: '/admin/videos' },
                { label: 'Studio Upload' },
            ]}
        >
            <Head title="Video Studio — Upload Video" />

            {/* Local Draft Restorer alert */}
            {hasLocalDraft && (
                <div className="mb-6">
                    <Alert
                        variant="warning"
                        title="Unfinished Draft Found"
                        className="rounded-2xl border-gold-400/20 bg-gold-400/5 text-gold-600 p-4"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                            <span className="text-xs text-stone-500 dark:text-stone-400">
                                You have an auto-saved draft of a video upload. Would you like to restore it?
                            </span>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={handleRestoreDraft}
                                    className="px-4 py-2 rounded-full bg-gold-400 text-[#1E1500] text-xs font-bold hover:bg-gold-500 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Restore Draft</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDiscardDraft}
                                    className="px-4 py-2 rounded-full border border-stone-200 dark:border-stone-850 text-xs font-bold text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-900 transition-all cursor-pointer"
                                >
                                    Discard
                                </button>
                            </div>
                        </div>
                    </Alert>
                </div>
            )}

            {/* Video Header Panel */}
            <VideoHeader
                title="Upload & Publish Video"
                isSaving={isSavingDraft}
                lastSaved={lastSaved}
                onPublish={handleSubmit}
                processing={processing}
            />

            {/* Main Dual-column Studio layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Metadata details (70%) */}
                <div className="lg:col-span-8 space-y-6">
                    <VideoInformationCard
                        title={data.title}
                        setTitle={(val) => setData('title', val)}
                        titleError={errors.title}
                        urduTitle={data.urdu_title}
                        setUrduTitle={(val) => setData('urdu_title', val)}
                        urduTitleError={errors.urdu_title}
                        description={data.description}
                        setDescription={(val) => setData('description', val)}
                        descriptionError={errors.description}
                    />

                    <VideoSourceSelector
                        sourceType={sourceType}
                        setSourceType={setSourceType}
                        youtubeUrl={data.youtube_url}
                        setYoutubeUrl={(val) => setData('youtube_url', val)}
                        youtubeError={errors.youtube_url}
                        uri={data.uri}
                        setUri={(val) => setData('uri', val)}
                        uriError={errors.uri}
                        videoFile={data.video_file}
                        setVideoFile={(file) => setData('video_file', file)}
                        videoFileError={errors.video_file}
                        onMetadataDetected={handleMetadataDetected}
                    />

                    <ThumbnailManager
                        thumbnail={data.thumbnail}
                        setThumbnail={(file) => setData('thumbnail', file)}
                        thumbnailUri={data.thumbnail_uri}
                        setThumbnailUri={(val) => setData('thumbnail_uri', val)}
                        thumbnailError={errors.thumbnail}
                        youtubeThumbnailUrl={data.youtube_url && data.youtube_url.includes('v=') 
                            ? `https://img.youtube.com/vi/${data.youtube_url.split('v=')[1]?.split('&')[0]}/maxresdefault.jpg` 
                            : undefined
                        }
                    />

                    <SeoAccordion
                        title={data.title}
                        slug={data.slug}
                        setSlug={(val) => setData('slug', val)}
                        metaTitle={data.meta_title}
                        setMetaTitle={(val) => setData('meta_title', val)}
                        metaDescription={data.meta_description}
                        setMetaDescription={(val) => setData('meta_description', val)}
                    />
                </div>

                {/* Right Column: Publishing, Organisation & preview checks (30%) */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
                    <PublishPanel
                        status={data.status}
                        setStatus={(val) => setData('status', val)}
                        onSubmit={handleSubmit}
                        processing={processing}
                        checklist={checklist}
                    />

                    <ClassificationCard
                        speakers={speakers}
                        categories={categories}
                        years={years}
                        speakerId={data.speaker_id}
                        setSpeakerId={(val) => setData('speaker_id', val)}
                        speakerError={errors.speaker_id}
                        categoryId={data.category_id}
                        setCategoryId={(val) => setData('category_id', val)}
                        categoryError={errors.category_id}
                        yearId={data.year_id}
                        setYearId={(val) => setData('year_id', val)}
                        yearError={errors.year_id}
                        tags={data.tags}
                        setTags={(val) => setData('tags', val)}
                        tagsError={errors.tags as string}
                    />

                    <LiveCardSimulator
                        title={data.title}
                        urduTitle={data.urdu_title}
                        speakerName={selectedSpeaker ? selectedSpeaker.name : ''}
                        categoryName={selectedCategory ? selectedCategory.name : ''}
                        thumbnailUrl={data.thumbnail ? URL.createObjectURL(data.thumbnail) : data.thumbnail_uri}
                        status={data.status}
                    />
                </div>

            </div>
        </AdminLayout>
    );
}
