import { usePage } from '@inertiajs/react';

export function useTranslation() {
    const { props } = usePage();
    const translations = (props.translations || {}) as Record<string, any>;
    const locale = (props.locale || 'en') as string;
    const dir = (props.dir || 'ltr') as 'ltr' | 'rtl';

    /**
     * Translates a given key path. E.g. t('common.nav.home')
     */
    const t = (key: string, replacements?: Record<string, string>): string => {
        const parts = key.split('.');
        let current: any = translations;

        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                return key; // Fallback: return the key itself
            }
        }

        if (typeof current !== 'string') {
            return key;
        }

        let result = current;
        if (replacements) {
            Object.entries(replacements).forEach(([k, v]) => {
                result = result.replace(`:${k}`, v);
            });
        }

        return result;
    };

    return { t, locale, dir };
}
