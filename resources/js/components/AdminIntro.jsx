import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

const ToyBoxIntro = ({ onComplete }) => {
    const containerRef = useRef(null);
    const topFlapRef = useRef(null);
    const bottomFlapRef = useRef(null);
    const tapeRef = useRef(null);
    const labelRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: onComplete,
                delay: 0.5
            });

            // Initial State
            gsap.set(containerRef.current, { zIndex: 100 });

            // 1. Box Shake (Sesuatu di dalam ingin keluar!)
            tl.to(labelRef.current, {
                x: -5,
                rotation: 2,
                duration: 0.08,
                repeat: 12,
                yoyo: true,
                ease: "sine.inOut"
            })
            .to(labelRef.current, { x: 0, rotation: -2, duration: 0.2 })

            // 2. Tape Peel (Selotip lepas)
            .to(tapeRef.current, {
                width: 0,
                opacity: 0,
                duration: 0.8,
                ease: "power2.inOut"
            }, "+=0.1")

            // 3. Label Pop & Fade (Logo mainan terbang ke arah kamera)
            .to(labelRef.current, {
                scale: 1.5,
                opacity: 0,
                duration: 0.6,
                ease: "back.in(1.7)"
            }, "-=0.2")

            // 4. Box Flaps Opening (Membuka ke atas dan bawah)
            .to(topFlapRef.current, {
                yPercent: -100,
                rotateX: 20, // Sedikit efek 3D
                duration: 1.5,
                ease: "power4.in"
            }, "-=0.2")
            .to(bottomFlapRef.current, {
                yPercent: 100,
                rotateX: -20,
                duration: 1.5,
                ease: "power4.in"
            }, "<")

            .to(containerRef.current, {
                display: 'none'
            });

        }, containerRef);

        return () => ctx.revert();
    }, [onComplete]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex flex-col pointer-events-none overflow-hidden"
            style={{ perspective: '1000px' }}
        >
            {/* --- TOP FLAP (Kardus Atas) --- */}
            <div
                ref={topFlapRef}
                className="absolute top-0 left-0 right-0 h-1/2 bg-[#d4a373] z-20 flex items-end justify-center border-b-2 border-[#bc8a5f]"
                style={{
                    backgroundImage: `radial-gradient(#bc8a5f 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                }}
            >
                {/* Tekstur Kardus Serat */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]"></div>
                
                {/* Branding/Icons */}
                <div className="absolute inset-0 flex items-center justify-around opacity-30 select-none">
                    <span className="text-6xl font-black text-[#8b5e34] -rotate-12 italic">FRAGILE</span>
                    <div className="border-4 border-[#8b5e34] p-2 rotate-12">
                        <span className="text-4xl font-bold text-[#8b5e34]">AGES 3+</span>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM FLAP (Kardus Bawah) --- */}
            <div
                ref={bottomFlapRef}
                className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#e6ccb2] z-20 flex items-start justify-center border-t-2 border-[#bc8a5f]"
            >
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]"></div>
                
                {/* Barcode & Handling Icons */}
                <div className="absolute bottom-10 left-10 opacity-40">
                    <div className="w-24 h-12 bg-[#8b5e34] mb-2"></div> {/* Mock Barcode */}
                    <p className="text-[#8b5e34] font-mono text-xs">MODEL: DASH-2024-X</p>
                </div>
                
                <div className="absolute top-10 right-10 flex gap-4 opacity-40">
                    <span className="text-4xl">☂️</span>
                    <span className="text-4xl">📦</span>
                    <span className="text-4xl">♻️</span>
                </div>
            </div>

            {/* --- CENTER ELEMENTS --- */}
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto">

                {/* PACKING TAPE (Selotip) */}
                <div
                    ref={tapeRef}
                    className="absolute w-full h-20 bg-yellow-600/30 backdrop-blur-[2px] border-y border-white/20 flex items-center justify-center overflow-hidden shadow-inner"
                    style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                >
                    <div className="w-full h-full flex items-center justify-around opacity-20 font-bold text-xl text-white tracking-[1em]">
                        <span>SUPER-TOY</span>
                        <span>SUPER-TOY</span>
                        <span>SUPER-TOY</span>
                    </div>
                </div>

                {/* TOY LABEL (Logo Mainan) */}
                <div
                    ref={labelRef}
                    className="relative bg-[#ef233c] p-8 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-8 border-white transform rotate-3"
                >
                    {/* Glossy Effect */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-sm"></div>

                    <div className="text-center">
                        <h2 className="font-black text-white text-5xl italic tracking-tighter drop-shadow-lg">
                            DASH<span className="text-yellow-400">BOARD</span>
                        </h2>
                        <div className="mt-2 inline-block bg-yellow-400 px-4 py-1 rounded-full">
                            <p className="text-[12px] font-black text-[#ef233c] uppercase tracking-widest">
                                Premium Action Set
                            </p>
                        </div>
                    </div>

                    {/* Corner Badge */}
                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center rotate-12 shadow-lg">
                        <span className="text-white font-black text-xs text-center">NEW<br/>2024</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToyBoxIntro;