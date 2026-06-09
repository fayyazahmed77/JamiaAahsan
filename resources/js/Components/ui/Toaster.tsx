import React, { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { Toaster, toast } from 'react-hot-toast';
import { useTheme } from 'next-themes';
import type { SharedData } from '@/types/inertia';

export function AppToaster() {
    const { flash } = usePage<SharedData>().props;
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const lastTimestampRef = useRef<string | number | null | undefined>(null);

    useEffect(() => {
        if ((flash?.success || flash?.error) && flash.timestamp !== lastTimestampRef.current) {
            if (flash.success) {
                toast.success(flash.success);
            }
            if (flash.error) {
                toast.error(flash.error);
            }
            lastTimestampRef.current = flash.timestamp;
        }
    }, [flash]);

    return (
        <Toaster
            position="top-right"
            toastOptions={{
                style: isDark ? {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                } : {
                    borderRadius: '10px',
                    background: '#fff',
                    color: '#333',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                },
                duration: 4000,
            }}
        />
    );
}
