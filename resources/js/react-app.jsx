import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './../css/app.css';

const container = document.getElementById('app');

if (container) {
    try {
        const page = container.getAttribute('data-page');
        const rawProps = container.getAttribute('data-props');
        console.log('Mounting React Page:', page);

        const props = JSON.parse(rawProps || '{}');
        console.log('Props:', props);

        const root = createRoot(container);
        root.render(
            <React.StrictMode>
                <App initialPage={page} initialProps={props} />
            </React.StrictMode>
        );
    } catch (error) {
        console.error('React Mount Error:', error);
        container.innerHTML = `<div class="p-8 text-red-600">
            <h1 class="text-3xl font-bold">Plastic Toy Broken 🧸</h1>
            <p class="font-mono mt-4">${error.message}</p>
        </div>`;
    }
}
