import React from 'react';

interface StatsCardProps {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    iconBg?: string;
    iconColor?: string;
    change?: { value: number; label: string };
    href?: string;
    className?: string;
}

export function StatsCard({
    label,
    value,
    icon,
    iconBg = 'hsl(155 65% 24% / 0.3)',
    iconColor = 'var(--primary-400)',
    change,
    href,
    className = '',
}: StatsCardProps) {
    const Wrapper = href ? 'a' : 'div';

    return (
        <Wrapper
            href={href}
            className={`stats-card ${className}`}
            style={href ? { textDecoration: 'none', cursor: 'pointer' } : undefined}
        >
            <div>
                <p className="stats-card__label">{label}</p>
                <p className="stats-card__value">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
                {change !== undefined && (
                    <p style={{
                        fontSize: '0.75rem',
                        color: change.value >= 0 ? 'var(--success)' : 'var(--danger)',
                        marginTop: 4,
                        display: 'flex', alignItems: 'center', gap: 3,
                    }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            {change.value >= 0
                                ? <polyline points="18 15 12 9 6 15" />
                                : <polyline points="6 9 12 15 18 9" />}
                        </svg>
                        {Math.abs(change.value)}% {change.label}
                    </p>
                )}
            </div>
            <div
                className="stats-card__icon"
                style={{ background: iconBg, color: iconColor }}
            >
                {icon}
            </div>
        </Wrapper>
    );
}
