import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import MainLayout from './Layout/MainLayout.jsx';
import './../css/app.css';

// This is a minimal React entry for injecting ONLY the layout (Navbar, Sidebar, Background)
// on top of traditional Blade Views (like Login).

const bladeContainer = document.getElementById('react-layout-root');

if (bladeContainer) {
    try {
        const page = bladeContainer.getAttribute('data-page') || 'Unknown';

        // We render MainLayout in a new div attached to body, 
        // to avoid wiping out the Blade content inside #react-layout-root
        const reactRootLayout = document.createElement('div');
        reactRootLayout.id = 'react-layout-overlay';
        document.body.appendChild(reactRootLayout);

        const root = createRoot(reactRootLayout);

        // We use dangerouslySetInnerHTML to put the original raw Blade HTML back inside MainLayout
        // This ensures the layout is wrapping the content perfectly.

        const BladeContent = () => {
            const [content] = useState(bladeContainer.innerHTML);

            // Clean up the original container so we don't have duplicate IDs or content
            useEffect(() => {
                bladeContainer.innerHTML = '';
            }, []);

            return <div dangerouslySetInnerHTML={{ __html: content }} className="w-full h-full flex justify-center items-center" />;
        };

        root.render(
            <React.StrictMode>
                <MainLayout page={page} standalone={true}>
                    <BladeContent />
                </MainLayout>
            </React.StrictMode>
        );
    } catch (error) {
        console.error('React Standalone Mount Error:', error);
    }
}
