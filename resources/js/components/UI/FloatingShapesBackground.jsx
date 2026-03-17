import React from 'react';

// Cartoon kids theme background with clouds, balloons, and a rainbow.
const FloatingShapesBackground = () => {
    return (
        <div
            className="fixed inset-0 pointer-events-none overflow-hidden"
            style={{
                zIndex: -10,
                background: 'linear-gradient(180deg, #8fd0ff 0%, #bfe7ff 45%, #fff1cc 100%)'
            }}
            aria-hidden="true"
        >
            {/* Sun */}
            <div className="absolute top-[4%] right-[8%] w-24 h-24 bg-[#fde047] rounded-full shadow-[0_0_50px_rgba(253,224,71,0.6)] animate-[sunPulse_10s_ease-in-out_infinite]" />
            <div className="absolute top-[2%] right-[5%] w-36 h-36 bg-[#fde68a] rounded-full opacity-[0.5] blur-[14px] animate-[sunGlow_14s_ease-in-out_infinite]" />

            {/* Rainbow arcs */}
            <div className="absolute bottom-[-20%] left-[8%] w-[62vw] h-[32vw] border-[18px] border-red-400 rounded-t-[999px] border-b-0 opacity-[0.5] animate-[rainbowFloat_18s_ease-in-out_infinite]" />
            <div className="absolute bottom-[-18%] left-[10%] w-[58vw] h-[30vw] border-[18px] border-orange-400 rounded-t-[999px] border-b-0 opacity-[0.45] animate-[rainbowFloat_20s_ease-in-out_infinite_reverse]" />
            <div className="absolute bottom-[-16%] left-[12%] w-[54vw] h-[28vw] border-[18px] border-yellow-300 rounded-t-[999px] border-b-0 opacity-[0.4] animate-[rainbowFloat_22s_ease-in-out_infinite]" />

            {/* Clouds */}
            <div className="absolute top-[12%] left-[6%] w-40 h-16 animate-[cloudDrift_30s_ease-in-out_infinite]">
                <div className="absolute bottom-0 left-0 w-16 h-10 bg-white/90 rounded-full shadow-[0_8px_20px_rgba(255,255,255,0.6)]" />
                <div className="absolute bottom-0 left-6 w-20 h-12 bg-white/90 rounded-full" />
                <div className="absolute bottom-0 left-14 w-16 h-10 bg-white/90 rounded-full" />
                <div className="absolute bottom-0 left-4 w-28 h-10 bg-white/90 rounded-full" />
            </div>
            <div className="absolute top-[22%] right-[10%] w-48 h-18 animate-[cloudDrift_36s_ease-in-out_infinite_reverse]">
                <div className="absolute bottom-0 left-0 w-20 h-12 bg-white/85 rounded-full shadow-[0_8px_20px_rgba(255,255,255,0.5)]" />
                <div className="absolute bottom-0 left-8 w-24 h-14 bg-white/85 rounded-full" />
                <div className="absolute bottom-0 left-20 w-18 h-12 bg-white/85 rounded-full" />
                <div className="absolute bottom-0 left-6 w-32 h-10 bg-white/85 rounded-full" />
            </div>
            <div className="absolute top-[38%] left-[28%] w-44 h-16 animate-[cloudDrift_28s_ease-in-out_infinite]">
                <div className="absolute bottom-0 left-0 w-18 h-11 bg-white/85 rounded-full shadow-[0_8px_20px_rgba(255,255,255,0.5)]" />
                <div className="absolute bottom-0 left-8 w-22 h-13 bg-white/85 rounded-full" />
                <div className="absolute bottom-0 left-22 w-18 h-11 bg-white/85 rounded-full" />
                <div className="absolute bottom-0 left-6 w-30 h-10 bg-white/85 rounded-full" />
            </div>

            {/* Balloons */}
            <div className="absolute bottom-[22%] right-[12%] animate-[balloonBob_9s_ease-in-out_infinite]">
                <div className="relative w-12 h-14 rounded-full bg-[#f472b6] shadow-[inset_0_-6px_0_rgba(0,0,0,0.08),_0_10px_20px_rgba(0,0,0,0.15)]">
                    <div className="absolute top-3 right-3 w-3 h-3 bg-white/60 rounded-full" />
                    <div className="absolute -bottom-2 left-1/2 w-3 h-3 bg-[#f472b6] rotate-45 -translate-x-1/2" />
                    <div className="absolute -bottom-12 left-1/2 w-[2px] h-12 bg-[#f9a8d4] -translate-x-1/2" />
                </div>
            </div>
            <div className="absolute bottom-[28%] right-[22%] animate-[balloonBob_11s_ease-in-out_infinite_reverse]">
                <div className="relative w-10 h-12 rounded-full bg-[#60a5fa] shadow-[inset_0_-6px_0_rgba(0,0,0,0.08),_0_10px_20px_rgba(0,0,0,0.12)]">
                    <div className="absolute top-3 right-2 w-3 h-3 bg-white/60 rounded-full" />
                    <div className="absolute -bottom-2 left-1/2 w-3 h-3 bg-[#60a5fa] rotate-45 -translate-x-1/2" />
                    <div className="absolute -bottom-10 left-1/2 w-[2px] h-10 bg-[#93c5fd] -translate-x-1/2" />
                </div>
            </div>

            {/* Confetti dots */}
            <div className="absolute top-[14%] left-[22%] w-3 h-3 bg-[#fb7185] rounded-sm animate-[confettiSpin_8s_linear_infinite]" />
            <div className="absolute top-[30%] left-[16%] w-2 h-2 bg-[#facc15] rounded-sm animate-[confettiSpin_10s_linear_infinite_reverse]" />
            <div className="absolute top-[18%] right-[26%] w-3 h-3 bg-[#38bdf8] rounded-sm animate-[confettiSpin_9s_linear_infinite]" />
            <div className="absolute bottom-[26%] right-[28%] w-4 h-4 bg-[#4ade80] rounded-sm animate-[confettiSpin_12s_linear_infinite_reverse]" />
            <div className="absolute bottom-[20%] left-[46%] w-3 h-3 bg-[#f97316] rounded-sm animate-[confettiSpin_11s_linear_infinite]" />

            <style>{`
                @keyframes sunPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.08); }
                }
                @keyframes sunGlow {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.12); opacity: 0.75; }
                }
                @keyframes cloudDrift {
                    0%, 100% { transform: translateX(-10px); }
                    50% { transform: translateX(25px); }
                }
                @keyframes balloonBob {
                    0%, 100% { transform: translateY(0) rotate(-1deg); }
                    50% { transform: translateY(-16px) rotate(2deg); }
                }
                @keyframes rainbowFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(10px); }
                }
                @keyframes confettiSpin {
                    0% { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(180deg) scale(1.2); }
                    100% { transform: rotate(360deg) scale(1); }
                }
            `}</style>
        </div>
    );
};

export default React.memo(FloatingShapesBackground);
