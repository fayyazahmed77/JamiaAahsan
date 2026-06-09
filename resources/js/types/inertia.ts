import type { User, PrayerTiming, LatestNews } from './models';

/**
 * Inertia shared data — available on every page via usePage()
 */
export interface SharedData {
    [key: string]: any;
    auth: {
        user: User | null;
        permissions: string[];
        roles: string[];
    };
    flash: {
        success?: string;
        error?: string;
        timestamp?: number | string;
    };
    prayer_timings: PrayerTiming[];
    latest_news: LatestNews[];
    locale: 'en' | 'ur';
    dir: 'ltr' | 'rtl';
}

/**
 * Helper to type usePage() with shared data
 * Usage: const { auth, flash } = usePage<SharedData>().props;
 */
export type InertiaPage<T = Record<string, unknown>> = T & SharedData;
