import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './../css/app.css';

class AppErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error) {
        console.error('React Runtime Error:', error);
    }

    render() {
        if (this.state.error) {
            return (
                <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
                    <div className="mx-auto max-w-3xl rounded-3xl border border-rose-500/30 bg-rose-950/40 p-6 shadow-2xl">
                        <div className="text-[11px] font-black uppercase tracking-[0.32em] text-rose-300">
                            Runtime Error
                        </div>
                        <h1 className="mt-3 text-2xl font-black text-white">
                            React gagal render halaman ini.
                        </h1>
                        <p className="mt-3 text-sm text-rose-100/80">
                            Buka DevTools Console untuk stack lengkap. Pesan error utama:
                        </p>
                        <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs text-rose-100">
                            {String(this.state.error?.message || this.state.error)}
                        </pre>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const container = document.getElementById('app');

if (container) {
    try {
        const page = container.getAttribute('data-page');
        const rawProps = container.getAttribute('data-props');

        const props = JSON.parse(rawProps || '{}');

        const root = createRoot(container);
        root.render(
            <React.StrictMode>
                <AppErrorBoundary>
                    <App initialPage={page} initialProps={props} />
                </AppErrorBoundary>
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
