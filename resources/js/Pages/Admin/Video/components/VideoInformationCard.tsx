import React from 'react';
import { Card, CardHeader, CardBody } from '@/Components/ui/Card';
import { Input } from '@/Components/ui/Input';
import { Bold, Italic, List, ListOrdered, Link, Quote, AlignRight, AlignLeft } from 'lucide-react';

interface InfoCardProps {
    title: string;
    setTitle: (val: string) => void;
    titleError?: string;
    urduTitle: string;
    setUrduTitle: (val: string) => void;
    urduTitleError?: string;
    description: string;
    setDescription: (val: string) => void;
    descriptionError?: string;
}

export function VideoInformationCard({
    title,
    setTitle,
    titleError,
    urduTitle,
    setUrduTitle,
    urduTitleError,
    description,
    setDescription,
    descriptionError,
}: InfoCardProps) {

    const [isRtl, setIsRtl] = React.useState(false);

    // Simple markdown formatting helper for custom editor
    const insertFormat = (formatType: string) => {
        const textarea = document.getElementById('video-description-editor') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);
        let replacement = '';

        switch (formatType) {
            case 'bold':
                replacement = `**${selectedText || 'bold text'}**`;
                break;
            case 'italic':
                replacement = `*${selectedText || 'italic text'}*`;
                break;
            case 'bullet':
                replacement = `\n- ${selectedText || 'list item'}`;
                break;
            case 'number':
                replacement = `\n1. ${selectedText || 'list item'}`;
                break;
            case 'link':
                replacement = `[${selectedText || 'link text'}](url)`;
                break;
            case 'quote':
                replacement = `\n> ${selectedText || 'quote text'}`;
                break;
            default:
                replacement = selectedText;
        }

        const newValue = text.substring(0, start) + replacement + text.substring(end);
        setDescription(newValue);
        
        // Refocus and select
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + replacement.length, start + replacement.length);
        }, 50);
    };

    return (
        <Card className="rounded-3xl border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 shadow-sm overflow-hidden mb-8">
            <CardHeader className="border-b border-stone-100 dark:border-stone-850 px-8 py-5 text-lg font-bold text-stone-900 dark:text-white">
                Video Information
            </CardHeader>
            <CardBody className="p-8 space-y-6">
                
                {/* English / Transliterated Title */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold text-stone-700 dark:text-stone-300">
                        <label>English / Transliterated Title</label>
                        <span className="text-xs text-stone-400 font-normal">{title.length} / 255</span>
                    </div>
                    <Input
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        error={titleError}
                        placeholder="e.g. The Path of Knowledge"
                        className="rounded-xl border-stone-200 dark:border-stone-800"
                    />
                </div>

                {/* Urdu Title (RTL) */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold text-stone-700 dark:text-stone-300">
                        <label>Urdu Title (Optional)</label>
                        <span className="text-xs text-stone-400 font-normal font-arabic">{urduTitle.length} / 255</span>
                    </div>
                    <input
                        type="text"
                        value={urduTitle}
                        onChange={(e) => setUrduTitle(e.target.value)}
                        placeholder="مثال: علم دین کی فضیلت"
                        dir="rtl"
                        className={`w-full px-4 py-2.5 rounded-xl border ${urduTitleError ? 'border-red-500' : 'border-stone-200 dark:border-stone-800'} bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-right font-urdu placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20 focus:border-gold-400 transition-all`}
                    />
                    {urduTitleError && <p className="text-xs text-red-500 mt-1">{urduTitleError}</p>}
                </div>

                {/* Description Area (With Custom Editor Toolbar) */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-semibold text-stone-700 dark:text-stone-300">
                        <label>Description & Notes</label>
                        <span className="text-xs text-stone-400 font-normal">{description.length} chars</span>
                    </div>

                    {/* Toolbar Box */}
                    <div className="border border-stone-200 dark:border-stone-800 rounded-t-xl bg-stone-50 dark:bg-stone-950 p-2 flex items-center justify-between border-b-0">
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => insertFormat('bold')}
                                className="p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400"
                                title="Bold"
                            >
                                <Bold className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => insertFormat('italic')}
                                className="p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400"
                                title="Italic"
                            >
                                <Italic className="w-4 h-4" />
                            </button>
                            <span className="h-4 w-px bg-stone-300 dark:bg-stone-800 mx-1" />
                            <button
                                type="button"
                                onClick={() => insertFormat('bullet')}
                                className="p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400"
                                title="Bulleted List"
                            >
                                <List className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => insertFormat('number')}
                                className="p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400"
                                title="Numbered List"
                            >
                                <ListOrdered className="w-4 h-4" />
                            </button>
                            <span className="h-4 w-px bg-stone-300 dark:bg-stone-800 mx-1" />
                            <button
                                type="button"
                                onClick={() => insertFormat('link')}
                                className="p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400"
                                title="Link"
                            >
                                <Link className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => insertFormat('quote')}
                                className="p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400"
                                title="Quote"
                            >
                                <Quote className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Alignment (LTR vs RTL) switch */}
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setIsRtl(false)}
                                className={`p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 ${!isRtl ? 'text-gold-400 bg-gold-400/10' : 'text-stone-400'}`}
                                title="English LTR Mode"
                            >
                                <AlignLeft className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsRtl(true)}
                                className={`p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 ${isRtl ? 'text-gold-400 bg-gold-400/10' : 'text-stone-400'}`}
                                title="Urdu RTL Mode"
                            >
                                <AlignRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Textarea Input area */}
                    <textarea
                        id="video-description-editor"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={isRtl ? 'یہاں تفصیل درج کریں...' : 'Enter video description or notes...'}
                        dir={isRtl ? 'rtl' : 'ltr'}
                        rows={6}
                        className={`w-full px-4 py-3 border ${descriptionError ? 'border-red-500' : 'border-stone-200 dark:border-stone-800'} rounded-b-xl bg-white dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-400/20 focus:border-gold-400 transition-all ${isRtl ? 'font-urdu text-right text-base leading-[2]' : 'font-sans text-sm leading-relaxed'}`}
                    />
                    {descriptionError && <p className="text-xs text-red-500 mt-1">{descriptionError}</p>}
                </div>

            </CardBody>
        </Card>
    );
}
