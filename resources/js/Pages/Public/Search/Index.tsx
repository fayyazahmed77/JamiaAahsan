import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import SEOHead from '@/Components/Public/SEOHead';
import { Volume2, Play, HelpCircle, FileText, ArrowRight, Search } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface Speaker {
    id: number;
    name: string;
    urdu_name?: string;
}

interface AudioMedia {
    id: number;
    title: string;
    speaker?: Speaker;
    category?: { name: string };
}

interface SearchAudio {
    id: number;
    title: string;
    urdu_title?: string;
    description?: string;
    slug: string;
    media?: AudioMedia;
}

interface SearchVideo {
    id: number;
    title: string;
    description?: string;
    slug: string;
    youtube_id: string;
}

interface SearchFatwa {
    id: number;
    question: string;
    answer?: string;
    question_no: string;
    topic?: { name: string };
}

interface SearchNews {
    id: number;
    text: string;
    content?: string;
    excerpt?: string;
    slug: string;
}

interface Props {
    query: string;
    results: {
        audio: SearchAudio[];
        video: SearchVideo[];
        fatwa: SearchFatwa[];
        news: SearchNews[];
    };
}

type TabType = 'all' | 'audio' | 'video' | 'fatwa' | 'news';

export default function SearchIndex({ query, results }: Props) {
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const { t, locale } = useTranslation();
    const isUrdu = locale === 'ur';

    const audioCount = results.audio.length;
    const videoCount = results.video.length;
    const fatwaCount = results.fatwa.length;
    const newsCount = results.news.length;
    const totalCount = audioCount + videoCount + fatwaCount + newsCount;

    const renderAudioCard = (item: SearchAudio) => (
        <div 
            key={`audio-${item.id}`}
            style={{
                background: 'var(--surface-2, #182232)',
                border: '1px solid var(--border, rgba(255,255,255,0.05))',
                borderRadius: 12,
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
            className="hover-card"
        >
            <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(30, 107, 62, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1e6b3e',
                flexShrink: 0
            }}>
                <Volume2 size={22} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1e6b3e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {isUrdu ? 'آڈیو بیان' : 'Audio Bayan'}
                </span>
                <h4 style={{ margin: '4px 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {isUrdu && item.urdu_title ? item.urdu_title : item.title}
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted, #7c8ba1)' }}>
                    {item.media?.speaker?.name || 'Speaker'} • {item.media?.category?.name || 'General'}
                </p>
            </div>
            <Link 
                href={route('public.media.audio.show', item.slug)}
                style={{
                    padding: '8px 14px',
                    borderRadius: 100,
                    background: '#1e6b3e',
                    color: 'white',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                }}
            >
                {isUrdu ? 'سنیں' : 'Listen'} <ArrowRight size={14} />
            </Link>
        </div>
    );

    const renderVideoCard = (item: SearchVideo) => (
        <div 
            key={`video-${item.id}`}
            style={{
                background: 'var(--surface-2, #182232)',
                border: '1px solid var(--border, rgba(255,255,255,0.05))',
                borderRadius: 12,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
            className="hover-card"
        >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000' }}>
                <img 
                    src={`https://img.youtube.com/vi/${item.youtube_id}/mqdefault.jpg`} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                />
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'rgba(30, 107, 62, 0.9)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                    <Play size={20} style={{ marginLeft: 2 }} />
                </div>
            </div>
            <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {isUrdu ? 'ویڈیو بیان' : 'Video Bayan'}
                    </span>
                    <h4 style={{ margin: '4px 0 8px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.title}
                    </h4>
                </div>
                <Link 
                    href={route('public.media.video.show', item.slug)}
                    style={{
                        alignSelf: 'flex-start',
                        color: '#1e6b3e',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        marginTop: 10
                    }}
                >
                    {isUrdu ? 'دیکھیں' : 'Watch Video'} <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );

    const renderFatwaCard = (item: SearchFatwa) => (
        <div 
            key={`fatwa-${item.id}`}
            style={{
                background: 'var(--surface-2, #182232)',
                border: '1px solid var(--border, rgba(255,255,255,0.05))',
                borderRadius: 12,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                transition: 'transform 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
            className="hover-card"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <HelpCircle size={18} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {isUrdu ? 'فتاویٰ اور مسائل' : `Fatwa #${item.question_no}`}
                </span>
                {item.topic?.name && (
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                        {item.topic.name}
                    </span>
                )}
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.5, fontFamily: isUrdu ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}>
                {item.question}
            </p>
            {item.answer && (
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted, #7c8ba1)', lineClamp: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6, fontFamily: isUrdu ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}>
                    {item.answer}
                </p>
            )}
            <Link 
                href={route('public.fatwa.index')}
                style={{
                    alignSelf: 'flex-start',
                    color: '#1e6b3e',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                }}
            >
                {isUrdu ? 'مکمل فتویٰ دیکھیں' : 'Read Full Fatwa'} <ArrowRight size={14} />
            </Link>
        </div>
    );

    const renderNewsCard = (item: SearchNews) => (
        <div 
            key={`news-${item.id}`}
            style={{
                background: 'var(--surface-2, #182232)',
                border: '1px solid var(--border, rgba(255,255,255,0.05))',
                borderRadius: 12,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                transition: 'transform 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
            className="hover-card"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={16} style={{ color: '#3b82f6' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {isUrdu ? 'خبریں اور اعلانات' : 'News & Events'}
                </span>
            </div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: isUrdu ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}>
                {item.text}
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted, #7c8ba1)', lineHeight: 1.5, fontFamily: isUrdu ? "'Noto Nastaliq Urdu', serif" : 'inherit' }}>
                {item.excerpt || item.content?.substring(0, 150) + '...'}
            </p>
            <Link 
                href={route('public.news.show', item.slug)}
                style={{
                    alignSelf: 'flex-start',
                    color: '#1e6b3e',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 6
                }}
            >
                {isUrdu ? 'تفصیلات دیکھیں' : 'Read Article'} <ArrowRight size={14} />
            </Link>
        </div>
    );

    const tabBtnStyle = (tab: TabType) => ({
        padding: '10px 20px',
        borderRadius: 100,
        fontSize: '0.875rem',
        fontWeight: 650,
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: activeTab === tab ? '#1e6b3e' : 'var(--surface-2, rgba(255,255,255,0.03))',
        color: activeTab === tab ? 'white' : 'var(--text-secondary, rgba(255,255,255,0.7))',
        boxShadow: activeTab === tab ? '0 4px 14px rgba(30,107,62,0.25)' : 'none'
    });

    return (
        <>
            <SEOHead 
                title={`Search Results for "${query}"`} 
                description={`Browse search results for "${query}" in Jamia Ahsan platform.`}
            />

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
                {/* Header */}
                <div style={{ marginBottom: 32, textAlign: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e6b3e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {isUrdu ? 'تلاش کے نتائج' : 'Search Results'}
                    </span>
                    <h1 style={{ margin: '8px 0', fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {isUrdu ? `"${query}" کے لیے نتائج` : `Results for "${query}"`}
                    </h1>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                        {isUrdu 
                            ? `کل ${totalCount} مماثلتیں ملیں` 
                            : `Found ${totalCount} matching results across the platform.`
                        }
                    </p>
                </div>

                {/* Search Bar Refinement */}
                <div style={{ maxWidth: 600, margin: '0 auto 40px', position: 'relative' }}>
                    <form action="/search" method="GET">
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'var(--surface-2, #182232)',
                            border: '1px solid var(--border, rgba(255,255,255,0.08))',
                            borderRadius: 100,
                            padding: '6px 14px 6px 20px',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
                        }}>
                            <Search size={18} style={{ color: 'var(--text-muted)', marginRight: 10 }} />
                            <input 
                                type="text" 
                                name="q"
                                defaultValue={query}
                                placeholder={isUrdu ? 'کتب، بیانات، فتاویٰ تلاش کریں...' : 'Search bayanaat, fatwas, news...'}
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.95rem',
                                }}
                            />
                            <button 
                                type="submit"
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: 100,
                                    background: '#1e6b3e',
                                    color: 'white',
                                    border: 'none',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(30,107,62,0.2)'
                                }}
                            >
                                {isUrdu ? 'تلاش' : 'Search'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Filter Tabs */}
                {totalCount > 0 && (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
                        <button onClick={() => setActiveTab('all')} style={tabBtnStyle('all')}>
                            {isUrdu ? 'تمام' : 'All'} <span style={{ opacity: 0.6 }}>({totalCount})</span>
                        </button>
                        {audioCount > 0 && (
                            <button onClick={() => setActiveTab('audio')} style={tabBtnStyle('audio')}>
                                {isUrdu ? 'بیانات (آڈیو)' : 'Audios'} <span style={{ opacity: 0.6 }}>({audioCount})</span>
                            </button>
                        )}
                        {videoCount > 0 && (
                            <button onClick={() => setActiveTab('video')} style={tabBtnStyle('video')}>
                                {isUrdu ? 'ویڈیوز' : 'Videos'} <span style={{ opacity: 0.6 }}>({videoCount})</span>
                            </button>
                        )}
                        {fatwaCount > 0 && (
                            <button onClick={() => setActiveTab('fatwa')} style={tabBtnStyle('fatwa')}>
                                {isUrdu ? 'فتاویٰ' : 'Fatwas'} <span style={{ opacity: 0.6 }}>({fatwaCount})</span>
                            </button>
                        )}
                        {newsCount > 0 && (
                            <button onClick={() => setActiveTab('news')} style={tabBtnStyle('news')}>
                                {isUrdu ? 'خبریں' : 'News'} <span style={{ opacity: 0.6 }}>({newsCount})</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Results Container */}
                {totalCount === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', border: '1px dashed var(--border)', borderRadius: 16 }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 8px' }}>
                            {isUrdu ? 'کوئی نتیجہ نہیں ملا' : 'No Results Found'}
                        </h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', maxWidth: 400, marginInline: 'auto' }}>
                            {isUrdu 
                                ? 'براہ کرم دوسرے الفاظ کے ساتھ دوبارہ کوشش کریں، یا الفاظ کا املا چیک کریں۔' 
                                : `We couldn't find anything matching "${query}". Check your spelling or try more general terms.`
                            }
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                        {/* Audio Bayanaat Grid */}
                        {(activeTab === 'all' || activeTab === 'audio') && audioCount > 0 && (
                            <div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 20, color: 'var(--text-primary)' }}>
                                    📢 {isUrdu ? 'آڈیو بیانات' : 'Audio Bayanaat'}
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                                    {results.audio.map(renderAudioCard)}
                                </div>
                            </div>
                        )}

                        {/* Videos Grid */}
                        {(activeTab === 'all' || activeTab === 'video') && videoCount > 0 && (
                            <div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 20, color: 'var(--text-primary)' }}>
                                    🎥 {isUrdu ? 'ویڈیو بیانات' : 'Video Bayanaat'}
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                                    {results.video.map(renderVideoCard)}
                                </div>
                            </div>
                        )}

                        {/* Fatwas Grid */}
                        {(activeTab === 'all' || activeTab === 'fatwa') && fatwaCount > 0 && (
                            <div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 20, color: 'var(--text-primary)' }}>
                                    🕌 {isUrdu ? 'جدید فتاویٰ و مسائل' : 'Questions & Answers (Fatwa)'}
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                                    {results.fatwa.map(renderFatwaCard)}
                                </div>
                            </div>
                        )}

                        {/* News Grid */}
                        {(activeTab === 'all' || activeTab === 'news') && newsCount > 0 && (
                            <div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 20, color: 'var(--text-primary)' }}>
                                    📰 {isUrdu ? 'خبریں اور اہم واقعات' : 'News & Announcements'}
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                                    {results.news.map(renderNewsCard)}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                .hover-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.08);
                    border-color: rgba(30,107,62,0.15) !important;
                }
            `}</style>
        </>
    );
}

SearchIndex.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
