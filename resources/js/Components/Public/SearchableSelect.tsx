import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
    value: string | number;
    label: string;
}

interface SearchableSelectProps {
    value: string | number;
    onChange: (value: string) => void;
    options: Option[];
    placeholder: string;
    className?: string;
}

export default function SearchableSelect({
    value,
    onChange,
    options,
    placeholder,
    className
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset search term when dropdown closes/opens
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
        }
    }, [isOpen]);

    const selectedOption = options.find(opt => opt.value.toString() === value.toString());

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between h-10.5 px-3.5 rounded-xl border border-stone-200 dark:border-stone-800/80 bg-stone-50 dark:bg-sapphire-950/40 hover:bg-stone-100 dark:hover:bg-sapphire-950/60 transition-colors text-left text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sapphire-500/20"
            >
                <span className={cn("truncate", !selectedOption && "text-stone-400 dark:text-stone-500")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {selectedOption && (
                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange('');
                            }}
                            className="p-0.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                        </span>
                    )}
                    <ChevronDown className={cn("w-4 h-4 text-stone-400 transition-transform duration-200", isOpen && "rotate-180")} />
                </div>
            </button>

            {/* Dropdown Options */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1.5 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100 origin-top">
                    {/* Search Bar inside Dropdown */}
                    <div className="p-2 border-b border-stone-100 dark:border-stone-850/60">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg outline-none focus:ring-2 focus:ring-sapphire-500/20 focus:border-sapphire-500 text-stone-800 dark:text-stone-200"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-56 overflow-y-auto py-1 custom-scrollbar">
                        {filteredOptions.length === 0 ? (
                            <div className="px-3.5 py-2.5 text-xs text-stone-400 text-center">
                                No options found
                            </div>
                        ) : (
                            filteredOptions.map((opt) => {
                                const isSelected = opt.value.toString() === value.toString();
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(opt.value.toString());
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer border-none",
                                            isSelected
                                                ? "bg-sapphire-500/10 text-sapphire-500 dark:text-sapphire-300 font-bold"
                                                : "text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-sapphire-950/40 hover:text-stone-900 dark:hover:text-white"
                                        )}
                                    >
                                        <span className="truncate pr-4">{opt.label}</span>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-sapphire-500 shrink-0" />}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
