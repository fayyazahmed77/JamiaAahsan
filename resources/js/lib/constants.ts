/**
 * Site-wide constants driven by Vite env variables.
 * Add values to .env as VITE_* so they are bundled at build time.
 *
 * Usage: import { SITE_URL, CONTACT_PHONE } from '@/lib/constants';
 */

export const SITE_URL: string =
    (import.meta.env.VITE_APP_URL as string) ?? 'https://jamiaahsan.edu.pk';

export const SITE_NAME: string =
    (import.meta.env.VITE_APP_NAME as string) ?? 'Jamia Arabia Ahsan Ul Uloom';

export const CONTACT_PHONE: string =
    (import.meta.env.VITE_CONTACT_PHONE as string) ?? '+92-21-34981234';

export const CONTACT_EMAIL: string =
    (import.meta.env.VITE_CONTACT_EMAIL as string) ?? 'info@jamiaahsan.edu.pk';

export const FACEBOOK_URL: string =
    (import.meta.env.VITE_FACEBOOK_URL as string) ?? 'https://facebook.com/jamiaahsan';

export const YOUTUBE_URL: string =
    (import.meta.env.VITE_YOUTUBE_URL as string) ?? 'https://youtube.com/jamiaahsan';
