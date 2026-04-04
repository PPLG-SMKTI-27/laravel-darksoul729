import React, { Suspense } from 'react';

const AboutPage = React.lazy(() => import('../../../src/pages/About'));

const AboutFallback = () => (
    <div className="flex min-h-screen items-center justify-center bg-[#081221] px-6 text-[#dbeafe]">
        <div className="w-full max-w-md rounded-[28px] border border-cyan-200/15 bg-slate-950/70 px-8 py-10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-md">
            <div className="text-[10px] font-black uppercase tracking-[0.32em] text-cyan-300/80">
                Loading Archive
            </div>
            <div className="mt-4 text-2xl font-black uppercase tracking-[0.08em] text-white">
                Menyiapkan Ruang 3D...
            </div>
            <div className="mt-4 text-sm font-semibold text-slate-300">
                Tur interaktif sedang dimuat.
            </div>
        </div>
    </div>
);

export default function About() {
    return (
        <Suspense fallback={<AboutFallback />}>
            <AboutPage />
        </Suspense>
    );
}
