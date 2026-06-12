import * as React from "react"
import { Check, ChevronDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectOption {
    value: string | number;
    label: string;
}

interface SearchableSelectProps {
    label?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    options: SelectOption[];
    value: string | number;
    onChange: (e: { target: { value: string } }) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function SearchableSelect({
    label,
    error,
    hint,
    required,
    options,
    value,
    onChange,
    placeholder = "Select an option",
    className,
    disabled = false,
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const allOptions = React.useMemo(() => {
        if (placeholder) {
            return [{ value: "", label: placeholder }, ...options];
        }
        return options;
    }, [options, placeholder]);

    const selectedOption = allOptions.find((opt) => opt.value?.toString() === value?.toString());

    const filteredOptions = allOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (val: string) => {
        // Construct simulated event to maintain compatibility with standard onChange handlers
        onChange({ target: { value: val } });
        setIsOpen(false);
        setSearchQuery("");
    };

    return (
        <div ref={containerRef} className={cn("form-group flex flex-col gap-1.5 w-full relative", className)}>
            {label && (
                <label className={cn("form-label text-sm font-medium text-stone-700 dark:text-stone-300", required && "required")}>
                    {label}
                </label>
            )}
            
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    "flex h-9 w-full items-center justify-between rounded-lg border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 px-3 py-1.5 text-sm transition-colors outline-none text-left text-stone-800 dark:text-stone-250 cursor-pointer shadow-sm hover:bg-stone-50 dark:hover:bg-stone-850/50",
                    error && "border-destructive ring-destructive/20",
                    isOpen && "border-primary-500 ring-3 ring-primary-500/15",
                    disabled && "opacity-60 cursor-not-allowed bg-stone-100 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800"
                )}
            >
                <span className={cn(!selectedOption && "text-muted-foreground")}>
                    {selectedOption && value !== "" ? selectedOption.label : placeholder}
                </span>
                <div className="flex items-center gap-1.5">
                    {value !== "" && value !== undefined && value !== null && (
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelect("");
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.stopPropagation();
                                    handleSelect("");
                                }
                            }}
                            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5 rounded hover:bg-stone-100 dark:hover:bg-stone-850 cursor-pointer bg-transparent border-none flex items-center justify-center"
                            title="Clear selection"
                        >
                            <X className="h-3.5 w-3.5" />
                        </span>
                    )}
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground opacity-50" />
                </div>
            </button>

            {isOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-full rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-lg outline-none overflow-hidden fade-in max-h-72 flex flex-col">
                    {/* Search Input */}
                    <div className="flex items-center gap-2 border-b border-stone-150 dark:border-stone-800/80 px-3 py-2 shrink-0">
                        <Search className="h-4 w-4 shrink-0 text-muted-foreground opacity-50" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground text-stone-800 dark:text-stone-200 border-none p-0 focus:ring-0 focus:outline-none"
                            autoFocus
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery("")}
                                className="text-muted-foreground hover:text-foreground cursor-pointer bg-transparent border-none"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Options List */}
                    <div className="overflow-y-auto p-1.5 space-y-0.5 flex-grow">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => {
                                const isSelected = opt.value.toString() === value?.toString();
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleSelect(opt.value.toString())}
                                        className={cn(
                                            "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-left hover:bg-stone-100 dark:hover:bg-stone-850/80 transition-colors border-none cursor-pointer",
                                            isSelected ? "bg-sapphire-500/10 text-sapphire-600 dark:text-sapphire-400 font-semibold" : "text-stone-700 dark:text-stone-300"
                                        )}
                                    >
                                        <span>{opt.label}</span>
                                        {isSelected && <Check className="h-4 w-4 text-sapphire-600 dark:text-sapphire-400" />}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                                No options found.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && <p className="form-error text-xs text-destructive mt-1" role="alert">{error}</p>}
            {hint && !error && <p className="form-hint text-xs text-muted-foreground mt-1">{hint}</p>}
        </div>
    );
}
