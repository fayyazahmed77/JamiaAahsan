import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
    label?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
    { label, error, hint, required, icon, iconPosition = 'left', className = '', id, type = "text", ...props },
    ref,
) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="form-group flex flex-col gap-1.5 w-full">
            {label && (
                <label htmlFor={inputId} className={`form-label text-sm font-medium text-secondary-foreground ${required ? 'required' : ''}`}>
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </label>
            )}
            <div style={{ position: 'relative', width: '100%' }}>
                {icon && iconPosition === 'left' && (
                    <span style={{
                        position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                        color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none',
                    }}>
                        {icon}
                    </span>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    type={type}
                    data-slot="input"
                    className={cn(
                        "h-9 w-full min-w-0 rounded-lg border border-stone-200 dark:border-stone-850 bg-white dark:bg-stone-900 px-3 py-1.5 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-primary-500 focus-visible:ring-3 focus-visible:ring-primary-500/15 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 shadow-sm",
                        icon && iconPosition === 'left' ? 'pl-9' : '',
                        className
                    )}
                    style={icon && iconPosition === 'left' ? { paddingLeft: '34px' } : undefined}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                    {...props}
                />
                {icon && iconPosition === 'right' && (
                    <span style={{
                        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                        color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none',
                    }}>
                        {icon}
                    </span>
                )}
            </div>
            {error && (
                <p id={`${inputId}-error`} className="form-error text-xs text-destructive flex items-center gap-1 mt-1" role="alert">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </p>
            )}
            {hint && !error && (
                <p id={`${inputId}-hint`} className="form-hint text-xs text-muted-foreground mt-1">{hint}</p>
            )}
        </div>
    );
});

export { Input }
