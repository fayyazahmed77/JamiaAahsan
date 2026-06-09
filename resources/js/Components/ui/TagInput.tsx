import React, { useState, KeyboardEvent } from 'react';
import { Badge } from './Badge';

interface TagInputProps {
    label?: string;
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    error?: string;
    hint?: string;
}

export function TagInput({ label, value = [], onChange, placeholder = 'Add tag...', error, hint }: TagInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = inputValue.trim().toLowerCase();
            if (tag && !value.includes(tag)) {
                onChange([...value, tag]);
            }
            setInputValue('');
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            onChange(value.slice(0, -1));
        }
    };

    const removeTag = (indexToRemove: number) => {
        onChange(value.filter((_, i) => i !== indexToRemove));
    };

    return (
        <div className="form-group">
            {label && (
                <label className="form-label">
                    {label}
                </label>
            )}
            <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
                padding: '6px 12px', background: 'var(--surface-1)',
                border: error ? '1px solid var(--danger)' : '1px solid var(--border)',
                borderRadius: 'var(--radius)', minHeight: '42px',
                transition: 'border var(--transition)',
            }}
            onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--primary-500)'}
            onBlurCapture={e => e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--border)'}
            >
                {value.map((tag, idx) => (
                    <Badge key={idx} variant="gold" className="flex items-center gap-1">
                        <span>{tag}</span>
                        <button
                            type="button"
                            onClick={() => removeTag(idx)}
                            style={{
                                background: 'none', border: 'none', color: 'currentColor',
                                display: 'inline-flex', alignItems: 'center', cursor: 'pointer',
                                padding: '0 2px', marginLeft: 2, fontSize: 10, opacity: 0.8,
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
                        >
                            ×
                        </button>
                    </Badge>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={value.length === 0 ? placeholder : ''}
                    style={{
                        background: 'transparent', border: 'none', outline: 'none',
                        color: 'var(--text)', fontSize: '0.875rem', flex: 1, minWidth: '80px',
                        padding: '4px 0',
                    }}
                />
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            {hint && !error && <p className="form-hint">{hint}</p>}
        </div>
    );
}
