import React, { useRef, useState, useCallback } from 'react';

interface FileUploadProps {
    label?: string;
    accept?: string;
    onChange?: (file: File) => void;
    error?: string;
    hint?: string;
    preview?: string;    // current file URL for preview
    required?: boolean;
}

export function FileUpload({
    label,
    accept = 'image/*,audio/*,video/*',
    onChange,
    error,
    hint,
    preview,
    required,
}: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFile = useCallback((file: File) => {
        setFileName(file.name);
        onChange?.(file);

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setLocalPreview(e.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setLocalPreview(null);
        }
    }, [onChange]);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const displayPreview = localPreview ?? preview;

    return (
        <div className="form-group">
            {label && (
                <label className={`form-label ${required ? 'required' : ''}`}>{label}</label>
            )}

            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                style={{
                    border: `2px dashed ${error ? 'var(--danger)' : dragging ? 'var(--primary-500)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'border-color var(--transition), background var(--transition)',
                    background: dragging ? 'hsl(155 65% 24% / 0.08)' : 'var(--surface-2)',
                    textAlign: 'center',
                }}
            >
                {displayPreview ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <img
                            src={displayPreview}
                            alt="Preview"
                            style={{ maxHeight: 120, maxWidth: '100%', borderRadius: 'var(--radius-sm)', objectFit: 'contain' }}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {fileName ?? 'Click to change'}
                        </span>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <div>
                            <span style={{ color: 'var(--primary-400)', fontWeight: 600, fontSize: '0.875rem' }}>
                                {fileName ?? 'Click to upload'}
                            </span>
                            {!fileName && (
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                    or drag and drop
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                    }}
                />
            </div>

            {hint && !error && <p className="form-hint">{hint}</p>}
            {error && <p className="form-error" role="alert">{error}</p>}
        </div>
    );
}
