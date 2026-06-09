import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types/inertia';

type AlertVariant = 'success' | 'danger' | 'warning' | 'info';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: AlertVariant;
    title?: string;
    children: React.ReactNode;
    dismissible?: boolean;
    onDismiss?: () => void;
    className?: string;
}

const icons: Record<AlertVariant, React.ReactNode> = {
    success: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    ),
    danger: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    ),
    warning: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" /><path d="M12 17h.01" />
        </svg>
    ),
    info: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
        </svg>
    ),
};

export function Alert({ variant = 'info', title, children, dismissible, onDismiss, className = '', style, ...props }: AlertProps) {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    const handleDismiss = () => {
        setVisible(false);
        onDismiss?.();
    };

    return (
        <div
            role="alert"
            className={`fade-in ${className}`}
            style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                padding: '12px 14px',
                borderRadius: 'var(--radius)',
                border: `1px solid var(--${variant === 'danger' ? 'danger' : variant})`,
                background: `var(--${variant}-bg)`,
                color: `var(--${variant})`,
                fontSize: '0.8125rem',
                lineHeight: 1.5,
                ...style,
            }}
            {...props}
        >
            <span style={{ flexShrink: 0, marginTop: 1 }}>{icons[variant]}</span>
            <div style={{ flex: 1 }}>
                {title && <div style={{ fontWeight: 600, marginBottom: 2 }}>{title}</div>}
                <div style={{ color: 'var(--text-secondary)' }}>{children}</div>
            </div>
            {dismissible && (
                <button
                    onClick={handleDismiss}
                    aria-label="Dismiss"
                    style={{
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: 'currentColor', opacity: 0.6, padding: 2, flexShrink: 0,
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            )}
        </div>
    );
}

/** Auto-displays Inertia flash messages from HandleInertiaRequests */
export function FlashMessages() {
    const { flash } = usePage<SharedData>().props;

    if (!flash?.success && !flash?.error) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {flash.success && (
                <Alert variant="success" dismissible>{flash.success}</Alert>
            )}
            {flash.error && (
                <Alert variant="danger" dismissible>{flash.error}</Alert>
            )}
        </div>
    );
}
