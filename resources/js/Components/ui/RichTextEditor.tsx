import React, { useRef, useEffect, useState } from 'react';
import { 
    Bold, Italic, Underline, Strikethrough, 
    Superscript, Subscript, List, ListOrdered, 
    AlignLeft, AlignCenter, AlignRight, AlignJustify, 
    Eraser, Highlighter, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    value: string;
    onChange: (val: string) => void;
    error?: string;
    label?: string;
    required?: boolean;
    placeholder?: string;
}

export function RichTextEditor({
    value,
    onChange,
    error,
    label,
    required = false,
    placeholder = 'اردو یا انگریزی میں جواب لکھیں...'
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [activeFormats, setActiveFormats] = useState<string[]>([]);
    const [selectedFontSize, setSelectedFontSize] = useState<string>('16');
    const [selectedFontFamily, setSelectedFontFamily] = useState<string>('Source Sans Pro');

    // Sync input from parent
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
            updateActiveFormats();
        }
    };

    const execCommand = (command: string, val: string = '') => {
        document.execCommand(command, false, val);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
        updateActiveFormats();
    };

    const updateActiveFormats = () => {
        const formats: string[] = [];
        if (document.queryCommandState('bold')) formats.push('bold');
        if (document.queryCommandState('italic')) formats.push('italic');
        if (document.queryCommandState('underline')) formats.push('underline');
        if (document.queryCommandState('strikeThrough')) formats.push('strikeThrough');
        if (document.queryCommandState('superscript')) formats.push('superscript');
        if (document.queryCommandState('subscript')) formats.push('subscript');
        if (document.queryCommandState('insertUnorderedList')) formats.push('list');
        if (document.queryCommandState('insertOrderedList')) formats.push('orderedList');
        
        setActiveFormats(formats);
    };

    const fontSizes = [
        { label: '12', value: '1' },
        { label: '14', value: '2' },
        { label: '16', value: '3' },
        { label: '18', value: '4' },
        { label: '20', value: '5' },
        { label: '24', value: '6' },
        { label: '32', value: '7' }
    ];

    const fontFamilies = [
        { label: 'Source Sans Pro', value: 'Source Sans Pro' },
        { label: 'Noto Nastaliq Urdu', value: 'Noto Nastaliq Urdu' },
        { label: 'Jameel Noori', value: 'Jameel Noori Nastaleeq' },
        { label: 'Cairo', value: 'Cairo' },
        { label: 'Amiri', value: 'Amiri' },
        { label: 'Inter', value: 'Inter' }
    ];

    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label className={cn(
                    "text-xs font-semibold text-stone-700 dark:text-stone-300",
                    required && "after:content-['_*'] after:text-red-500"
                )}>
                    {label}
                </label>
            )}

            <div className={cn(
                "border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-sm bg-stone-50 dark:bg-stone-900/40 focus-within:border-sapphire-500 focus-within:ring-2 focus-within:ring-sapphire-500/20 transition-all",
                error && "border-red-500 dark:border-red-500"
            )}>
                {/* Editor Toolbar */}
                <div className="flex flex-wrap items-center gap-0.5 p-2 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 select-none">
                    
                    {/* Basic Formatting */}
                    <button
                        type="button"
                        onClick={() => execCommand('bold')}
                        className={cn(
                            "p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 cursor-pointer",
                            activeFormats.includes('bold') && "bg-sapphire-50 dark:bg-sapphire-950 text-sapphire-600 dark:text-sapphire-400 font-bold"
                        )}
                        title="Bold (Ctrl+B)"
                    >
                        <Bold className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => execCommand('italic')}
                        className={cn(
                            "p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 cursor-pointer",
                            activeFormats.includes('italic') && "bg-sapphire-50 dark:bg-sapphire-950 text-sapphire-600 dark:text-sapphire-400"
                        )}
                        title="Italic (Ctrl+I)"
                    >
                        <Italic className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => execCommand('underline')}
                        className={cn(
                            "p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 cursor-pointer",
                            activeFormats.includes('underline') && "bg-sapphire-50 dark:bg-sapphire-950 text-sapphire-600 dark:text-sapphire-400"
                        )}
                        title="Underline (Ctrl+U)"
                    >
                        <Underline className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => execCommand('strikeThrough')}
                        className={cn(
                            "p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 cursor-pointer",
                            activeFormats.includes('strikeThrough') && "bg-sapphire-50 dark:bg-sapphire-950 text-sapphire-600 dark:text-sapphire-400"
                        )}
                        title="Strikethrough"
                    >
                        <Strikethrough className="w-4 h-4" />
                    </button>

                    <div className="w-px h-5 bg-stone-200 dark:bg-stone-800 mx-1" />

                    {/* Sub/Superscript */}
                    <button
                        type="button"
                        onClick={() => execCommand('superscript')}
                        className={cn(
                            "p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 cursor-pointer",
                            activeFormats.includes('superscript') && "bg-sapphire-50 dark:bg-sapphire-950 text-sapphire-600 dark:text-sapphire-400"
                        )}
                        title="Superscript"
                    >
                        <Superscript className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => execCommand('subscript')}
                        className={cn(
                            "p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 cursor-pointer",
                            activeFormats.includes('subscript') && "bg-sapphire-50 dark:bg-sapphire-950 text-sapphire-600 dark:text-sapphire-400"
                        )}
                        title="Subscript"
                    >
                        <Subscript className="w-4 h-4" />
                    </button>

                    <div className="w-px h-5 bg-stone-200 dark:bg-stone-800 mx-1" />

                    {/* Font Size Select */}
                    <div className="relative flex items-center bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg px-2 py-0.5 text-xs">
                        <select
                            value={selectedFontSize}
                            onChange={(e) => {
                                const size = e.target.value;
                                const sizeObj = fontSizes.find(f => f.value === size);
                                if (sizeObj) {
                                    setSelectedFontSize(sizeObj.label);
                                    execCommand('fontSize', size);
                                }
                            }}
                            className="bg-transparent border-none py-0.5 pr-4 text-stone-700 dark:text-stone-300 font-semibold appearance-none outline-none cursor-pointer"
                        >
                            {fontSizes.map((f) => (
                                <option key={f.value} value={f.value}>{f.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="w-3 h-3 text-stone-400 absolute right-1.5 pointer-events-none" />
                    </div>

                    {/* Font Family Select */}
                    <div className="relative flex items-center bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg px-2 py-0.5 text-xs ml-1">
                        <select
                            value={selectedFontFamily}
                            onChange={(e) => {
                                const font = e.target.value;
                                setSelectedFontFamily(font);
                                execCommand('fontName', font);
                            }}
                            className="bg-transparent border-none py-0.5 pr-4 text-stone-700 dark:text-stone-300 font-semibold appearance-none outline-none cursor-pointer"
                        >
                            {fontFamilies.map((f) => (
                                <option key={f.value} value={f.value}>{f.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="w-3 h-3 text-stone-400 absolute right-1.5 pointer-events-none" />
                    </div>

                    <div className="w-px h-5 bg-stone-200 dark:bg-stone-800 mx-1" />

                    {/* Highlight */}
                    <button
                        type="button"
                        onClick={() => execCommand('hiliteColor', '#FAF0CC')}
                        className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 cursor-pointer flex flex-col items-center justify-center relative"
                        title="Highlight Text"
                    >
                        <Highlighter className="w-4 h-4" />
                        <span className="absolute bottom-0.5 left-1.5 right-1.5 h-0.5 bg-yellow-400 rounded-full" />
                    </button>

                    {/* Lists */}
                    <button
                        type="button"
                        onClick={() => execCommand('insertUnorderedList')}
                        className={cn(
                            "p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 cursor-pointer",
                            activeFormats.includes('list') && "bg-sapphire-50 dark:bg-sapphire-950 text-sapphire-600"
                        )}
                        title="Bullet List"
                    >
                        <List className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => execCommand('insertOrderedList')}
                        className={cn(
                            "p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 cursor-pointer",
                            activeFormats.includes('orderedList') && "bg-sapphire-50 dark:bg-sapphire-950 text-sapphire-600"
                        )}
                        title="Numbered List"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </button>

                    {/* Alignments */}
                    <button
                        type="button"
                        onClick={() => execCommand('justifyLeft')}
                        className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 cursor-pointer"
                        title="Align Left"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => execCommand('justifyCenter')}
                        className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 cursor-pointer"
                        title="Align Center"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => execCommand('justifyRight')}
                        className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 cursor-pointer"
                        title="Align Right"
                    >
                        <AlignRight className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => execCommand('justifyFull')}
                        className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 cursor-pointer"
                        title="Justify"
                    >
                        <AlignJustify className="w-4 h-4" />
                    </button>

                    <div className="w-px h-5 bg-stone-200 dark:bg-stone-800 mx-1" />

                    {/* Clear Formatting */}
                    <button
                        type="button"
                        onClick={() => execCommand('removeFormat')}
                        className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400 cursor-pointer"
                        title="Clear Formatting"
                    >
                        <Eraser className="w-4 h-4" />
                    </button>

                </div>

                {/* Content Editable Area */}
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    onBlur={updateActiveFormats}
                    onMouseUp={updateActiveFormats}
                    onKeyUp={updateActiveFormats}
                    className={cn(
                        "p-4 min-h-[220px] max-h-[500px] overflow-y-auto text-stone-800 dark:text-stone-100 text-sm focus:outline-none bg-stone-50 dark:bg-sapphire-950/30 leading-relaxed font-sans rtl:font-urdu rtl:text-right text-left",
                        "prose dark:prose-invert max-w-none prose-sm"
                    )}
                    {...{ placeholder }}
                    dir="auto"
                />
            </div>

            {error && (
                <p className="text-[11px] font-bold text-red-500">{error}</p>
            )}
        </div>
    );
}
