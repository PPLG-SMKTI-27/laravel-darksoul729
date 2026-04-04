import React from 'react';

const InfernalBackground = () => {
    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0a0204]">
            {/* Heat Haze / Smoke Base */}
            <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{ filter: 'url(#infernalHaze)' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-transparent to-transparent" />
            </div>

            {/* Glowing Depths / Magma Pockets */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute -bottom-1/4 left-[10%] h-[60%] w-[80%] rounded-[100%] bg-red-600/10 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"
                />
                <div
                    className="absolute -bottom-[10%] right-[15%] h-[40%] w-[50%] rounded-[100%] bg-orange-600/5 blur-[100px] animate-[pulse_12s_ease-in-out_infinite_reverse]"
                />
            </div>

            {/* Rising Embers (Pure CSS) */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bottom-[-10px] h-1 w-1 rounded-full bg-orange-400 shadow-[0_0_8px_#fb923c]"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animation: `rise ${5 + Math.random() * 5}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`,
                            opacity: 0.3 + Math.random() * 0.7,
                            transform: `scale(${0.5 + Math.random()})`
                        }}
                    />
                ))}
            </div>

            {/* Obsidian Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />

            {/* Vignette for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_30%,rgba(0,0,0,0.8)_100%)]" />

            <svg className="hidden">
                <filter id="infernalHaze">
                    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="1">
                        <animate attributeName="baseFrequency" dur="30s" values="0.015;0.02;0.015" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" scale="40" />
                </filter>
            </svg>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.1); }
                }
                @keyframes rise {
                    0% {
                        transform: translateY(0) translateX(0) scale(1);
                        opacity: 0;
                    }
                    20% {
                        opacity: 0.8;
                    }
                    80% {
                        opacity: 0.6;
                    }
                    100% {
                        transform: translateY(-110vh) translateX(20px) scale(0.5);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default React.memo(InfernalBackground);
