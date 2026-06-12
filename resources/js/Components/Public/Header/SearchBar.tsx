import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { router } from '@inertiajs/react';

interface SearchBarProps {
    placeholder?: string;
    mobile?: boolean;
}

export default function SearchBar({ placeholder = 'Search...', mobile = false }: SearchBarProps) {
    const [focused, setFocused] = useState(false);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const q = formData.get('q') as string;
        if (q && q.trim()) {
            router.get('/search', { q: q.trim() });
        }
    };

    if (mobile) {
        return (
            <form onSubmit={handleSearchSubmit}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 14px',
                }}>
                    <Search size={16} style={{ color: 'rgba(255, 255, 255, 0.5)', marginRight: 10 }} />
                    <input
                        type="text"
                        name="q"
                        placeholder={placeholder}
                        aria-label="Search site content"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: 'white',
                            fontSize: '0.875rem',
                            width: '100%'
                        }}
                    />
                </div>
            </form>
        );
    }

    return (
        <form onSubmit={handleSearchSubmit}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                background: focused ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.07)',
                border: focused ? '1px solid var(--accent-400)' : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 100,
                padding: '4px 12px',
                transition: 'all 0.3s ease',
                width: focused ? 180 : 130
            }}>
                <Search size={12} style={{ color: 'rgba(255, 255, 255, 0.6)', marginRight: 6 }} />
                <input
                    type="text"
                    name="q"
                    placeholder={placeholder}
                    aria-label="Search site content"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'white',
                        fontSize: '0.75rem',
                        width: '100%'
                    }}
                />
            </div>
        </form>
    );
}
