import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const IntroOverlay = () => {
    const sectionRef = useRef(null);
    const prefersReducedMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    const sheetY = useTransform(scrollYProgress, [0, 0.72, 1], ['0vh', '-14vh', '-112vh']);
    const sheetScale = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.995, 0.985]);
    const contentY = useTransform(scrollYProgress, [0, 0.78], [0, -72]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.62, 0.88], [1, 0.72, 0]);
    const edgeGlowOpacity = useTransform(scrollYProgress, [0, 0.8], [0.62, 0.1]);
    const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

    useEffect(() => {
        const emitState = (value) => {
            window.dispatchEvent(new CustomEvent('intro-sheet-state', {
                detail: {
                    active: value < 0.995,
                },
            }));
        };

        emitState(scrollYProgress.get());

        const unsubscribe = scrollYProgress.on('change', (value) => {
            emitState(value);
        });

        return () => {
            unsubscribe();
            window.dispatchEvent(new CustomEvent('intro-sheet-state', {
                detail: {
                    active: false,
                },
            }));
        };
    }, [scrollYProgress]);

    const handleSkip = () => {
        if (!sectionRef.current || typeof window === 'undefined') {
            return;
        }

        const sectionTop = sectionRef.current.offsetTop;
        const sectionHeight = sectionRef.current.offsetHeight;

        window.scrollTo({
            top: sectionTop + sectionHeight,
            behavior: 'smooth',
        });
    };

    return (
        <section ref={sectionRef} className="relative z-[120] h-[155vh] md:h-[182vh]">
            <div className="sticky top-0 z-[120] h-screen overflow-hidden">
                <motion.div
                    style={prefersReducedMotion ? undefined : { y: sheetY, scale: sheetScale }}
                    className="absolute inset-x-0 top-0 h-[112vh] overflow-hidden border-b border-white/55 bg-[linear-gradient(180deg,#6aafe9_0%,#7bb8eb_48%,#d4eaf9_100%)] shadow-[0_30px_80px_rgba(15,23,42,0.12)]"
                >
                    <div className="absolute inset-0">
                        <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.24)_0%,rgba(255,255,255,0)_100%)]" />
                        <div className="absolute -left-[16%] top-[-10%] h-[42vw] w-[42vw] rounded-full bg-yellow-100/22 blur-[100px]" />
                        <div className="absolute right-[-8%] top-[14%] h-[22vw] w-[22vw] rounded-full bg-sky-100/18 blur-[85px]" />
                        <motion.div
                            style={prefersReducedMotion ? undefined : { opacity: edgeGlowOpacity }}
                            className="absolute inset-x-[12%] bottom-[10%] h-24 rounded-full bg-white/24 blur-[30px]"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-[26vh] bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.56)_100%)]" />
                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/55 shadow-[0_0_24px_rgba(255,255,255,0.5)]" />
                    </div>

                    <div className="relative z-10 flex h-screen flex-col px-5 pb-16 pt-5 text-center md:px-8 md:pb-20 md:pt-6">
                        <div className="flex items-start justify-end">
                            <button
                                type="button"
                                onClick={handleSkip}
                                className="rounded-full border border-white/45 bg-white/14 px-4 py-2 text-[10px] font-black uppercase tracking-[0.26em] text-white/90 backdrop-blur-[8px] transition-colors hover:bg-white/18"
                            >
                                Skip
                            </button>
                        </div>

                        <motion.div
                            style={prefersReducedMotion ? undefined : { y: contentY, opacity: contentOpacity }}
                            className="flex flex-1 flex-col items-center justify-center"
                        >
                            <div className="rounded-full border border-white/42 bg-white/12 px-5 py-2 text-[10px] font-black uppercase tracking-[0.34em] text-white/92 backdrop-blur-[8px]">
                                Scroll Down To Open
                            </div>

                            <div className="mt-8 max-w-[720px] md:mt-10">
                                <div className="mx-auto w-fit rounded-full border border-white/40 bg-white/12 px-4 py-2 text-[10px] font-black uppercase tracking-[0.32em] text-sky-50/95 backdrop-blur-[8px]">
                                    Intro Sheet
                                </div>
                                <h1 className="mt-5 text-[2.45rem] font-black uppercase leading-[0.88] tracking-[-0.06em] text-white drop-shadow-[0_10px_20px_rgba(15,23,42,0.16)] md:text-[5.6rem]">
                                    Peel Into
                                    <span className="block text-[#0f172a]">The Main Page</span>
                                </h1>
                                <p className="mx-auto mt-3 max-w-[560px] text-sm font-bold text-white/88 md:text-base">
                                    Ini lembar intro di atas landing utama. Saat Anda scroll, lembar ini naik dan halaman utama langsung menyambung di bawahnya.
                                </p>
                            </div>

                            <div className="mt-10 h-2 w-[min(320px,78vw)] overflow-hidden rounded-full bg-white/18 backdrop-blur-sm md:mt-12">
                                <motion.div
                                    style={prefersReducedMotion ? undefined : { scaleX: progressScale }}
                                    className="h-full origin-left rounded-full bg-[linear-gradient(90deg,#f8fafc_0%,#dbeafe_38%,#7dd3fc_100%)] shadow-[0_0_18px_rgba(125,211,252,0.28)]"
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default IntroOverlay;
