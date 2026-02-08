import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

const IntroOverlay = ({ onComplete }) => {
    const containerRef = useRef(null);
    const topFlapRef = useRef(null);
    const bottomFlapRef = useRef(null);
    const tapeRef = useRef(null);
    const labelRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: onComplete,
                delay: 0.5 // Slight start delay
            });

            // Initial State
            gsap.set(containerRef.current, { zIndex: 100 });

            // Sequence (~5s total)

            // 1. Suspense: Box Shake (1s)
            tl.to(labelRef.current, {
                x: -3,
                rotation: 1, // Slight wobble
                duration: 0.1,
                repeat: 10,
                yoyo: true,
                ease: "sine.inOut"
            })
                .to(labelRef.current, {
                    x: 0,
                    rotation: 2, // Reset to original tilt
                    duration: 0.2
                })

                // 2. Tape Peel (1.5s)
                .to(tapeRef.current, {
                    scaleX: 0,
                    opacity: 0,
                    duration: 1.5,
                    ease: "power2.inOut"
                }, "+=0.2")

                // 3. Label Blow Away (Overlap)
                .to(labelRef.current, {
                    scale: 3,
                    opacity: 0,
                    duration: 1.0,
                    ease: "power2.in"
                }, "-=1.0")

                // 4. Flaps Open (2.5s)
                .to(topFlapRef.current, {
                    yPercent: -100,
                    duration: 2.5,
                    ease: "power3.inOut"
                }, "-=0.3")
                .to(bottomFlapRef.current, {
                    yPercent: 100,
                    duration: 2.5,
                    ease: "power3.inOut"
                }, "<") // Sync with top flap

                .to(containerRef.current, {
                    display: 'none'
                });

        }, containerRef);

        return () => ctx.revert();
    }, [onComplete]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex flex-col pointer-events-none"
        >
            {/* --- TOP FLAP --- */}
            <div
                ref={topFlapRef}
                className="absolute top-0 left-0 right-0 h-1/2 bg-[#d4a373] shadow-md z-20 flex items-end justify-center overflow-hidden"
                style={{
                    backgroundImage: `url("https://www.transparenttextures.com/patterns/cardboard-flat.png")`,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
            >
                {/* Math Doodles (Top) */}
                <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex flex-wrap content-center justify-center gap-20 overflow-hidden">
                    <span className="text-6xl font-script rotate-12">∫ e^x dx</span>
                    <span className="text-8xl font-serif -rotate-12">π</span>
                    <span className="text-5xl font-mono rotate-45">∑</span>
                    <span className="text-7xl font-sans -rotate-6">√-1</span>
                </div>

                {/* Flap Shade/Crease */}
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* --- BOTTOM FLAP --- */}
            <div
                ref={bottomFlapRef}
                className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#d4a373] shadow-inner-lg z-20 flex items-start justify-center overflow-hidden"
                style={{
                    backgroundImage: `url("https://www.transparenttextures.com/patterns/cardboard-flat.png")`
                }}
            >
                {/* Math Doodles (Bottom) */}
                <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex flex-wrap content-center justify-center gap-32 overflow-hidden">
                    <span className="text-7xl font-mono -rotate-12">E=mc²</span>
                    <span className="text-6xl font-serif rotate-6">∞</span>
                    <span className="text-9xl font-sans rotate-12">λ</span>
                    <span className="text-5xl font-script -rotate-45">f(x)</span>
                </div>

                {/* Flap Shade/Crease */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/20 to-transparent"></div>
            </div>

            {/* --- CENTER ELEMENTS (Tape & Label) --- */}
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto">

                {/* PACKING TAPE */}
                <div
                    ref={tapeRef}
                    className="absolute w-full h-24 bg-[#e5e5e5]/90 backdrop-blur-sm shadow-sm border-y border-white/40 transform -rotate-1"
                ></div>

                {/* SHIPPING LABEL */}
                <div
                    ref={labelRef}
                    className="relative bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-sm md:max-w-md w-11/12 transform rotate-2 border border-slate-200"
                >
                    {/* Barcode Strip */}
                    <div className="h-8 bg-black mb-4 w-full opacity-80"
                        style={{ maskImage: 'repeating-linear-gradient(90deg, black, black 2px, transparent 2px, transparent 4px)' }}>
                    </div>

                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">FROM</p>
                            <h2 className="font-black text-slate-800 text-lg">KEVIN HERMANSYAH</h2>
                            <p className="text-xs text-slate-500 font-medium">BOGOR, ID</p>
                        </div>
                        <div className="border-2 border-slate-800 p-1 px-2 rounded transform rotate-3">
                            <span className="font-black text-xs block text-slate-800">PRIORITY</span>
                        </div>
                    </div>

                    <div className="border-t-2 border-dashed border-slate-300 pt-4 relative">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">CONTENTS</p>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight tracking-tight">
                            MATH + CODE <br />
                            <span className="text-blue-600">& TOYS</span>
                        </h1>

                        {/* Toy Badge: Ages 3-99 */}
                        <div className="absolute top-2 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded-full border-2 border-white shadow-md transform -rotate-12">
                            AGES 3-99
                        </div>
                    </div>

                    {/* Stamps */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full border-4 border-red-600/50 flex items-center justify-center transform -rotate-12 opacity-80 pointer-events-none">
                        <span className="text-red-600/50 font-black text-xs text-center leading-tight">LOGIC<br />INSIDE</span>
                    </div>

                    {/* Math Badge */}
                    <div className="absolute -top-4 -left-4 bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white transform rotate-6">
                        <span className="font-serif italic font-bold text-xl">∑</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroOverlay;
