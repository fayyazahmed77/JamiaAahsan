import React from 'react';

interface SpinnerProps {
    size?: number;
    color?: string;
    className?: string;
}

export function Spinner({ size = 20, color = 'var(--primary-500)', className = '' }: SpinnerProps) {
    return (
        <svg
            className={`animate-spin ${className}`}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            aria-label="Loading"
            role="status"
        >
            <path
                d="M21 12a9 9 0 1 1-6.219-8.56"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function PageSpinner() {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '300px', flexDirection: 'column', gap: 12,
        }}>
            <Spinner size={32} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Loading…</span>
        </div>
    );
}
