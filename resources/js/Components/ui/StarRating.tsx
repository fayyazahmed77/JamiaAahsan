import React from 'react';

interface StarRatingProps {
    value: number;      // 1-5
    max?: number;
    size?: number;
    showNumber?: boolean;
}

export function StarRating({ value, max = 5, size = 14, showNumber = false }: StarRatingProps) {
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            {Array.from({ length: max }, (_, i) => {
                const filled = i + 1 <= Math.floor(value);
                const partial = !filled && i < value;

                return (
                    <svg
                        key={i}
                        width={size}
                        height={size}
                        viewBox="0 0 24 24"
                        fill={filled ? 'var(--accent-500)' : partial ? 'url(#half)' : 'none'}
                        stroke={filled || partial ? 'var(--accent-500)' : 'var(--border)'}
                        strokeWidth="1.5"
                        aria-hidden="true"
                    >
                        <defs>
                            <linearGradient id="half">
                                <stop offset="50%" stopColor="var(--accent-500)" />
                                <stop offset="50%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                );
            })}
            {showNumber && (
                <span style={{ fontSize: size * 0.85, color: 'var(--text-secondary)', marginLeft: 2 }}>
                    {value.toFixed(1)}
                </span>
            )}
        </span>
    );
}
