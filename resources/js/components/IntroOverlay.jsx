import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

const IntroOverlay = ({ onComplete }) => {
    const containerRef = useRef(null);
    const textGroupRef = useRef(null);
    const nameRef = useRef(null);
    const surnameRef = useRef(null);
    const greetingRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: onComplete
            });

            // Initial Setup
            gsap.set([nameRef.current, surnameRef.current], { y: 150, opacity: 0, rotate: 5 });
            gsap.set(greetingRef.current, { opacity: 0, scale: 0.8 });
            gsap.set(containerRef.current, { transformOrigin: 'top center' });

            // Sequence
            // 1. Greeting
            tl.to(greetingRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "back.out(1.7)"
            })
                .to(greetingRef.current, {
                    opacity: 0,
                    y: -50,
                    filter: "blur(10px)",
                    duration: 0.5,
                    delay: 0.8,
                    ease: "power2.in"
                })

                // 2. Name Reveal (Staggered & Heavy)
                .to([nameRef.current], {
                    y: 0,
                    rotate: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power4.out"
                }, "-=0.2")
                .to([surnameRef.current], {
                    y: 0,
                    rotate: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power4.out"
                }, "-=0.8")

                // 3. Hold for reading
                .to({}, { duration: 1.2 })

                // 4. Exit - Slide Up Curtain
                .to(textGroupRef.current, {
                    y: -100,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.in"
                })
                .to(containerRef.current, {
                    yPercent: -100,
                    duration: 1,
                    ease: "power4.inOut" // Smooth curtain up effect
                }, "-=0.3");

        }, containerRef);

        return () => ctx.revert();
    }, [onComplete]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 overflow-hidden"
        >
            {/* Background Texture (Subtle) */}
            <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>

            <div className="relative z-10 text-center w-full px-4" ref={textGroupRef}>

                {/* Greeting Text - Absolute Buffered */}
                <div className="relative h-[20vh] flex items-center justify-center mb-4">
                    <div ref={greetingRef} className="absolute">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-300 tracking-[0.2em] uppercase">
                            Hello World.
                        </h2>
                    </div>
                </div>

                {/* Name Reveal - Masked Containers for reveal effect */}
                <div className="flex flex-col items-center justify-center space-y-2 md:space-y-4">
                    <div className="overflow-hidden py-2">
                        <h1
                            ref={nameRef}
                            className="text-5xl md:text-8xl lg:text-9xl font-black text-slate-800 tracking-tighter leading-[0.9]"
                            style={{ textShadow: '4px 4px 0px #cbd5e1' }}
                        >
                            KEVIN
                        </h1>
                    </div>
                    <div className="overflow-hidden py-2">
                        <h1
                            ref={surnameRef}
                            className="text-5xl md:text-8xl lg:text-9xl font-black text-blue-600 tracking-tighter leading-[0.9]"
                            style={{ textShadow: '4px 4px 0px #1e40af' }}
                        >
                            HERMANSYAH
                        </h1>
                    </div>
                </div>

                <div className="mt-12 flex justify-center gap-4 opacity-30">
                    <div className="w-3 h-3 bg-slate-900 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-slate-900 rounded-full animate-bounce delay-100"></div>
                    <div className="w-3 h-3 bg-slate-900 rounded-full animate-bounce delay-200"></div>
                </div>
            </div>
        </div>
    );
};

export default IntroOverlay;
