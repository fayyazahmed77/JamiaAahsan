import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from 'next-themes';
import '../css/app.css';

createInertiaApp({
    title: (title) => title ? `${title} — Jamia Aahsan` : 'Jamia Aahsan Admin',

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob<any>('./Pages/**/*.tsx'),
        ),

    setup({ el, App, props }) {
        createRoot(el).render(
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
                <App {...props} />
            </ThemeProvider>
        );
    },

    progress: {
        color: '#174a87', // Sapphire Blue
        showSpinner: true,
    },
});
