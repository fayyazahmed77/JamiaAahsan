import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('recharts') || id.includes('d3-')) {
                            return 'vendor-recharts';
                        }
                        if (id.includes('framer-motion')) {
                            return 'vendor-framer';
                        }
                        if (id.includes('@dnd-kit')) {
                            return 'vendor-dnd';
                        }
                        if (id.includes('lucide-react')) {
                            return 'vendor-lucide';
                        }
                        if (id.includes('@tanstack/react-table') || id.includes('@tanstack/react-query')) {
                            return 'vendor-tanstack';
                        }
                        if (id.includes('@radix-ui') || id.includes('radix-ui') || id.includes('vaul')) {
                            return 'vendor-ui';
                        }
                    }
                },
            },
        },
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
