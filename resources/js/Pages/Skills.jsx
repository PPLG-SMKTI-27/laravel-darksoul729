import React, { Suspense } from 'react';

const SkillsGame = React.lazy(() => import('../components/Skills/SkillsGame'));

const SkillsFallback = () => (
    <div className="flex min-h-screen items-center justify-center bg-[#060c17] px-6 text-[#fefae0]">
        <div className="w-full max-w-md rounded-[28px] border-[8px] border-[#1a140f] bg-[#4b3628] px-8 py-10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.4),inset_0_0_40px_rgba(0,0,0,0.28)]">
            <div className="text-[10px] font-black uppercase tracking-[0.32em] text-[#d4a373]">
                Loading Voyage
            </div>
            <div className="mt-4 text-2xl font-black uppercase tracking-[0.08em]">
                Menyiapkan Lautan...
            </div>
            <div className="mt-4 text-sm font-semibold text-[#fefae0]/70">
                Engine 3D sedang dipasang.
            </div>
        </div>
    </div>
);

export default function Skills() {
    return (
        <Suspense fallback={<SkillsFallback />}>
            <SkillsGame />
        </Suspense>
    );
}
