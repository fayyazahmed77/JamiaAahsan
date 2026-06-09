import React, { useState } from 'react';
import SEOHead from '@/Components/Public/SEOHead';
import { usePage, useForm, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import type { SharedData } from '@/types/inertia';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Filter, HelpCircle, ChevronDown, 
    Send, BookOpen, Clock, Tag, MessageSquare, HelpCircle as QuestionIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Input } from '@/Components/ui/Input';
import { Button } from '@/Components/ui/Button';
import { Select } from '@/Components/ui/Select';
import { Modal } from '@/Components/ui/Modal';
import { cn } from '@/lib/utils';

interface QA {
    id: number;
    topic_id: number;
    title: string;
    question: string;
    answer: string;
    status: boolean;
    created_at: string;
    topic?: {
        id: number;
        title: string;
    };
}

interface Topic {
    id: number;
    title: string;
    status: boolean;
    question_answers_count?: number;
}

interface Props {
    fatwas: {
        data: QA[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        links: { url: string | null; label: string; active: boolean }[];
    };
    topics: Topic[];
    filters: {
        search?: string;
        topic_id?: string;
    };
}

export default function FatwaIndex({ fatwas, topics, filters }: Props) {
    const { locale, dir } = usePage<SharedData>().props;
    const isUrdu = locale === 'ur';

    const [search, setSearch] = useState(filters.search ?? '');
    const [selectedTopicId, setSelectedTopicId] = useState(filters.topic_id ?? '');
    const [askModalOpen, setAskModalOpen] = useState(false);
    const [expandedQaId, setExpandedQaId] = useState<number | null>(null);

    // Ask a Question Form Hook
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        topic_id: topics[0]?.id ? String(topics[0].id) : '',
        title: '',
        question: '',
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const applyFilters = (searchText: string, topicVal: string) => {
        router.get(
            '/fatwa',
            { 
                search: searchText || undefined, 
                topic_id: topicVal || undefined 
            },
            { preserveState: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(search, selectedTopicId);
    };

    const handleTopicSelect = (topicId: string) => {
        const newVal = selectedTopicId === topicId ? '' : topicId;
        setSelectedTopicId(newVal);
        applyFilters(search, newVal);
    };

    const handleAskSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/fatwa', {
            onSuccess: () => {
                setAskModalOpen(false);
                reset();
                toast.success(
                    isUrdu 
                        ? 'آپ کا سوال کامیابی سے موصول ہو گیا ہے۔ توثیق کے بعد جواب اپلوڈ کیا جائے گا۔' 
                        : 'Your question has been submitted successfully. The answer will be posted after verification.'
                );
            },
            onError: () => {
                toast.error(isUrdu ? 'براہ کرم فارم کی غلطیاں درست کریں۔' : 'Please resolve the form errors.');
            }
        });
    };

    const toggleAccordion = (id: number) => {
        setExpandedQaId(expandedQaId === id ? null : id);
    };

    return (
        <div className="bg-background min-h-screen text-foreground pb-20">
            <SEOHead 
                title={isUrdu ? 'دارالافتاء / سوال و جواب' : 'Q&A / Fatwa Bank'} 
                description={isUrdu ? 'مستند علمائے کرام اور مفتیانِ عظام کی روشنی میں اپنے روزمرہ کے مسائل کے شرعی جوابات تلاش کریں یا نیا سوال ارسال کریں۔' : 'Explore verified religious verdicts on daily life matters answered by certified scholars, or submit your own question.'}
            />

            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": fatwas.data.slice(0, 10).map((qa) => ({
                        "@type": "Question",
                        "name": qa.title,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": qa.answer.replace(/<[^>]*>/g, '')
                        }
                    }))
                })}
            </script>

            {/* Banner Header */}
            <div className="relative bg-sapphire-950 py-16 md:py-20 text-white overflow-hidden shadow-md">
                <div className="absolute inset-0 pointer-events-none">
                    <img 
                        src="/images/video-page-bg.png" 
                        alt="" 
                        loading="lazy"
                        className="w-full h-full object-cover opacity-90" 
                    />
                    <div className="absolute inset-0 bg-black/25" />
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                    <span className="text-[10px] uppercase tracking-widest font-black text-gold-400 bg-gold-400/10 border border-gold-400/20 px-3 py-1 rounded-full mb-3">
                        {isUrdu ? 'دارالافتاء اور فقہی رہنمائی' : 'Islamic Jurisprudence & Q&A'}
                    </span>
                    <h1 className={cn(
                        "text-3xl md:text-5xl font-black tracking-tight mb-4 text-white",
                        isUrdu ? "font-urdu leading-normal" : "font-heading"
                    )}>
                        {isUrdu ? 'سوال و جواب / فتاویٰ بینک' : 'Question & Answer Bank'}
                    </h1>
                    <p className={cn(
                        "text-sm md:text-base text-stone-300 max-w-2xl font-medium",
                        isUrdu ? "font-urdu leading-relaxed" : "font-sans"
                    )}>
                        {isUrdu 
                            ? 'مستند علمائے کرام اور مفتیانِ عظام کی روشنی میں اپنے روزمرہ کے مسائل کے شرعی جوابات تلاش کریں یا نیا سوال ارسال کریں۔' 
                            : 'Explore verified religious verdicts on daily life matters answered by certified scholars, or submit your own question.'
                        }
                    </p>
                </div>
            </div>

            {/* Filter Toolbar & Ask Button */}
            <div className="max-w-7xl mx-auto px-6 mt-8">
                <div className="bg-card border border-stone-200/60 dark:border-stone-800/80 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Search and Filters */}
                    <form onSubmit={handleSearchSubmit} className="flex flex-1 flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <Input
                                placeholder={isUrdu ? 'مطلوبہ موضوع یا لفظ تلاش کریں...' : 'Search questions, subjects, keywords...'}
                                value={search}
                                onChange={handleSearchChange}
                                className={cn(
                                    "pl-10 h-10.5 rounded-xl border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-sapphire-950/40 font-medium",
                                    isUrdu && "font-urdu rtl:text-right"
                                )}
                            />
                        </div>
                        <Button 
                            type="submit" 
                            variant="primary"
                            className="h-10.5 px-6 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all"
                        >
                            <Filter className="w-4 h-4" />
                            <span>{isUrdu ? 'تلاش کریں' : 'Search'}</span>
                        </Button>
                    </form>

                    {/* Ask a Question Button */}
                    <div className="shrink-0 flex justify-end">
                        <Button
                            onClick={() => {
                                clearErrors();
                                setAskModalOpen(true);
                            }}
                            className="h-10.5 bg-gold-500 hover:bg-gold-600 text-stone-950 font-black px-6 rounded-xl flex items-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                        >
                            <HelpCircle className="w-4.5 h-4.5" />
                            <span className={cn(isUrdu && "font-urdu")}>{isUrdu ? 'سوال پوچھیں' : 'Ask a Scholar'}</span>
                        </Button>
                    </div>

                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Q&A Accordion (md:col-span-8 or 9) */}
                    <div className={cn(
                        "grid grid-cols-1 gap-4",
                        isUrdu ? "md:col-span-8 lg:col-span-9 order-2 md:order-1" : "md:col-span-8 lg:col-span-9"
                    )}>
                        
                        {fatwas.data.length === 0 ? (
                            <div className="bg-card border border-stone-200/50 dark:border-stone-850 p-12 rounded-2xl text-center space-y-4 shadow-sm">
                                <QuestionIcon className="w-12 h-12 text-stone-300 mx-auto" />
                                <h3 className={cn("text-base font-bold text-stone-600 dark:text-stone-400", isUrdu && "font-urdu")}>
                                    {isUrdu ? 'کوئی سوال نہیں ملا' : 'No Questions Found'}
                                </h3>
                                <p className={cn("text-xs text-stone-400 max-w-sm mx-auto", isUrdu && "font-urdu leading-6")}>
                                    {isUrdu 
                                        ? 'آپ کے تلاش کردہ الفاظ کے مطابق کوئی سوال دستیاب نہیں ہے۔ براہ کرم دوسرے الفاظ آزمائیں یا علمائے کرام سے پوچھیں۔' 
                                        : 'No questions match your current query or category filter. Try widening your search term.'
                                    }
                                </p>
                            </div>
                        ) : (
                            fatwas.data.map((qa) => {
                                const isExpanded = expandedQaId === qa.id;
                                return (
                                    <motion.div
                                        key={qa.id}
                                        layout="position"
                                        className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl shadow-sm overflow-hidden hover:border-sapphire-500/20 transition-colors"
                                    >
                                        {/* Card Header (Question Title) */}
                                        <button
                                            onClick={() => toggleAccordion(qa.id)}
                                            className="w-full p-5 flex items-start justify-between gap-4 text-right cursor-pointer bg-transparent border-none focus:outline-none"
                                        >
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                <div className="w-2.5 h-2.5 rounded-full bg-gold-400 shrink-0 mt-2 rotate-45" />
                                                <div className="text-right flex-1 min-w-0">
                                                    <span className={cn(
                                                        "text-stone-400 text-[10px] tracking-wide font-black uppercase mb-1 block",
                                                        isUrdu && "font-urdu"
                                                    )}>
                                                        {qa.topic?.title}
                                                    </span>
                                                    <h3 className={cn(
                                                        "text-base font-black text-stone-900 dark:text-white leading-relaxed text-right",
                                                        isUrdu ? "font-urdu" : "font-heading"
                                                    )}>
                                                        {qa.title}
                                                    </h3>
                                                </div>
                                            </div>
                                            <ChevronDown className={cn(
                                                "w-5 h-5 text-stone-400 shrink-0 mt-1.5 transition-transform duration-200",
                                                isExpanded && "rotate-180 text-sapphire-500"
                                            )} />
                                        </button>

                                        {/* Expandable Panel */}
                                        <AnimatePresence initial={false}>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                                >
                                                    <div className="px-5 pb-6 border-t border-stone-100 dark:border-stone-800/60 pt-5 space-y-4">
                                                        
                                                        {/* Full Question */}
                                                        <div className="bg-stone-50 dark:bg-sapphire-950/20 p-4 rounded-xl border border-stone-200/40 dark:border-stone-800/40 text-right">
                                                            <span className={cn("text-[9px] uppercase tracking-wider font-black text-stone-400 block mb-2", isUrdu && "font-urdu")}>
                                                                {isUrdu ? 'سوال (تفصیل):' : 'Full Question:'}
                                                            </span>
                                                            <p className={cn("text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-urdu text-right", isUrdu && "leading-7")}>
                                                                {qa.question}
                                                            </p>
                                                        </div>

                                                        {/* Verified Answer */}
                                                        <div className="text-right">
                                                            <span className={cn("text-[9px] uppercase tracking-wider font-black text-stone-400 block mb-2", isUrdu && "font-urdu")}>
                                                                {isUrdu ? 'شرعی جواب:' : 'Scholar Answer:'}
                                                            </span>
                                                            <div 
                                                                className={cn(
                                                                    "text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-urdu text-right prose dark:prose-invert max-w-none prose-sm",
                                                                    isUrdu && "leading-8"
                                                                )}
                                                                dangerouslySetInnerHTML={{ __html: qa.answer }}
                                                            />
                                                        </div>

                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })
                        )}

                        {/* Pagination Links */}
                        {fatwas.last_page > 1 && (
                            <div className="flex justify-center gap-1.5 mt-8 select-none">
                                {fatwas.links.map((link, idx) => {
                                    if (link.label.includes('Previous')) {
                                        return (
                                            <Button
                                                key={idx}
                                                variant="secondary"
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                                className="px-3"
                                            >
                                                &larr;
                                            </Button>
                                        );
                                    }
                                    if (link.label.includes('Next')) {
                                        return (
                                            <Button
                                                key={idx}
                                                variant="secondary"
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                                className="px-3"
                                            >
                                                &rarr;
                                            </Button>
                                        );
                                    }
                                    return (
                                        <Button
                                            key={idx}
                                            variant={link.active ? 'primary' : 'secondary'}
                                            size="sm"
                                            onClick={() => link.url && router.get(link.url)}
                                            className={cn("min-w-[36px]", isUrdu && "font-urdu")}
                                        >
                                            {link.label}
                                        </Button>
                                    );
                                })}
                            </div>
                        )}

                    </div>

                    {/* Topics Sidebar (md:col-span-4 or 3) */}
                    <div className={cn(
                        "space-y-4",
                        isUrdu ? "md:col-span-4 lg:col-span-3 order-1 md:order-2" : "md:col-span-4 lg:col-span-3"
                    )}>
                        <div className="bg-card border border-stone-200/60 dark:border-stone-800/80 rounded-2xl p-5 shadow-sm">
                            
                            {/* Title with accent */}
                            <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-stone-100 dark:border-stone-800">
                                <div className="w-1 h-5 bg-sapphire-500 rounded-full" />
                                <h3 className={cn("text-sm font-black uppercase text-stone-800 dark:text-white tracking-wider", isUrdu && "font-urdu text-[13px] tracking-normal")}>
                                    {isUrdu ? 'موضوعات' : 'Topics'}
                                </h3>
                            </div>

                            {/* Topics List */}
                            <div className="flex flex-col gap-1">
                                {topics.map((topic) => {
                                    const isSelected = selectedTopicId === String(topic.id);
                                    return (
                                        <button
                                            key={topic.id}
                                            onClick={() => handleTopicSelect(String(topic.id))}
                                            className={cn(
                                                "w-full text-right px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer border-none bg-transparent outline-none",
                                                isSelected 
                                                    ? "bg-sapphire-500 text-white font-bold" 
                                                    : "text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-sapphire-950/20"
                                            )}
                                        >
                                            <span className={cn(
                                                "text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0",
                                                isSelected 
                                                    ? "bg-sapphire-600/50 border-sapphire-400 text-white" 
                                                    : "bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-500"
                                            )}>
                                                {topic.question_answers_count ?? 0}
                                            </span>
                                            <span className={cn("font-urdu text-right text-[13px]", isSelected && "font-black")}>
                                                {topic.title}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* Ask a Scholar Modal Form */}
            <Modal
                open={askModalOpen}
                onClose={() => setAskModalOpen(false)}
                title={isUrdu ? 'علمائے کرام سے سوال پوچھیں' : 'Submit Question to Scholars'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setAskModalOpen(false)}>
                            {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={handleAskSubmit} 
                            disabled={processing}
                            className="bg-sapphire-500 hover:bg-sapphire-400 text-white font-bold flex items-center gap-2"
                        >
                            {processing ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-3.5 h-3.5" />
                                    <span>{isUrdu ? 'سوال ارسال کریں' : 'Send Question'}</span>
                                </>
                            )}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleAskSubmit} className="space-y-5">
                    
                    <div className="space-y-1.5">
                        <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                            <Tag className="w-3.5 h-3.5 text-stone-400" />
                            {isUrdu ? 'موضوع کا انتخاب کریں *' : 'Select Topic *'}
                        </label>
                        <Select
                            value={data.topic_id}
                            onChange={(e) => setData('topic_id', e.target.value)}
                            options={topics.map(t => ({ value: String(t.id), label: t.title }))}
                            className={cn(
                                "h-10.5 rounded-xl border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-sapphire-950/40",
                                isUrdu && "font-urdu"
                            )}
                        />
                        {errors.topic_id && (
                            <p className="text-[11px] font-bold text-red-500">{errors.topic_id}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                            <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                            {isUrdu ? 'سوال کا عنوان (مختصر) *' : 'Question Title *'}
                        </label>
                        <Input
                            placeholder={isUrdu ? 'مثال: اعتکاف کا شرعی حکم' : 'e.g. Ruling on I\'tikaaf in a basement'}
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className={cn(
                                "h-10.5 rounded-xl border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-sapphire-950/40",
                                isUrdu && "font-urdu rtl:text-right text-right"
                            )}
                            required
                        />
                        {errors.title && (
                            <p className="text-[11px] font-bold text-red-500">{errors.title}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className={cn("text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1", isUrdu && "font-urdu text-[9px]")}>
                            <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                            {isUrdu ? 'تفصیلی سوال لکھیں *' : 'Detailed Question *'}
                        </label>
                        <textarea
                            rows={5}
                            placeholder={isUrdu ? 'اپنا سوال یہاں تفصیل سے لکھیں...' : 'Write your detailed question here...'}
                            value={data.question}
                            onChange={(e) => setData('question', e.target.value)}
                            className={cn(
                                "w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-850 bg-stone-50 dark:bg-sapphire-950/40 text-stone-900 dark:text-white placeholder-stone-400 text-sm outline-none resize-none focus:border-sapphire-500 focus:ring-1 focus:ring-sapphire-500",
                                isUrdu ? "font-urdu rtl:text-right text-right leading-7" : "font-sans leading-relaxed"
                            )}
                            required
                        />
                        {errors.question && (
                            <p className="text-[11px] font-bold text-red-500">{errors.question}</p>
                        )}
                    </div>

                </form>
            </Modal>

        </div>
    );
}

FatwaIndex.layout = (page: React.ReactNode) => <PublicLayout children={page} />;
