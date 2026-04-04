import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/js/react-app.jsx',
                'resources/js/react-layout.jsx',
            ],
            refresh: true,
        }),
        react(),
    ],
    build: {
        modulePreload: false,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    const normalizedId = id.replaceAll('\\', '/');

                    if (normalizedId.includes('vite/preload-helper')) {
                        return 'preload-helper';
                    }

                    if (!normalizedId.includes('node_modules')) {
                        return undefined;
                    }

                    if (normalizedId.includes('/three/')) {
                        return 'three-core';
                    }

                    if (normalizedId.includes('/@react-three/fiber/')) {
                        return 'r3f-vendor';
                    }

                    if (normalizedId.includes('/@react-three/drei/') || normalizedId.includes('/three-stdlib/') || normalizedId.includes('/camera-controls/')) {
                        return 'drei-vendor';
                    }

                    if (normalizedId.includes('/@react-three/postprocessing/') || normalizedId.includes('/postprocessing/')) {
                        return 'postprocessing-vendor';
                    }

                    if (normalizedId.includes('/react/') || normalizedId.includes('/react-dom/') || normalizedId.includes('/scheduler/')) {
                        return 'react-vendor';
                    }

                    if (normalizedId.includes('/framer-motion/')) {
                        return 'motion-vendor';
                    }

                    if (normalizedId.includes('/gsap/') || normalizedId.includes('/lenis/')) {
                        return 'animation-vendor';
                    }

                    return undefined;
                },
            },
        },
    },
});
