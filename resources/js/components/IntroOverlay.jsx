import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Configuration ---
const STORAGE_KEY = 'home_cinematic_intro_last_seen';
// DEBUG MODE: 1000ms (1 detik). 
// PRODUCTION JADI: 60 * 60 * 1000 (1 jam)
export const INTRO_COOLDOWN_MS = 60 * 60 * 1000;

function shouldShowIntro() {
    try {
        const last = localStorage.getItem(STORAGE_KEY);
        if (!last) return true;
        return Date.now() - Number(last) >= INTRO_COOLDOWN_MS;
    } catch {
        return true;
    }
}

function markIntroSeen() {
    try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
        // silently fail
    }
}

// --- Cinematic Masked Typography ---
const MaskText = ({ children, delay = 0, duration = 0.8, className = "" }) => (
    <span className={`inline-flex overflow-hidden align-bottom pb-4 ${className}`}>
        <motion.span
            initial={{ y: '110%', rotate: 4 }}
            animate={{ y: '0%', rotate: 0 }}
            exit={{ y: '-110%', opacity: 0, rotate: -4 }}
            transition={{ duration, ease: [0.76, 0, 0.24, 1], delay }}
            className="inline-block origin-bottom-left"
        >
            {children}
        </motion.span>
    </span>
);

// --- Aesthetic Cartoon Mascot SVG ---
// Clean, editorial, modern vector art approach
const MascotSVG = () => (
    <motion.svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
    >
        {/* Soft floating shadow */}
        <motion.ellipse
            cx="100" cy="185" rx="35" ry="6" fill="#e2e8f0"
            animate={{ scale: [1, 0.8, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating character group */}
        <motion.g
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Sparkles / Details */}
            <motion.path
                d="M 160 50 L 165 40 L 170 50 L 180 55 L 170 60 L 165 70 L 160 60 L 150 55 Z"
                fill="#fcd34d"
                animate={{ rotate: 360, scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "165px 55px" }}
            />
            <motion.path
                d="M 30 110 L 33 102 L 36 110 L 44 113 L 36 116 L 33 124 L 30 116 L 22 113 Z"
                fill="#60a5fa"
                animate={{ rotate: -360, scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "33px 113px" }}
            />

            {/* Main Rounded Box Head */}
            <rect x="45" y="45" width="110" height="90" rx="35" fill="#ffffff" stroke="#0f172a" strokeWidth="8" />

            {/* Display Screen */}
            <rect x="57" y="57" width="86" height="66" rx="20" fill="#f8fafc" stroke="#0f172a" strokeWidth="6" />

            {/* Eye Left (arch) */}
            <motion.path
                d="M 70 85 Q 80 75 90 85"
                stroke="#0f172a" strokeWidth="6" strokeLinecap="round" fill="none"
                animate={{ d: ["M 70 85 Q 80 75 90 85", "M 70 85 Q 80 85 90 85", "M 70 85 Q 80 75 90 85"] }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1] }}
            />
            {/* Eye Right (arch) */}
            <motion.path
                d="M 110 85 Q 120 75 130 85"
                stroke="#0f172a" strokeWidth="6" strokeLinecap="round" fill="none"
                animate={{ d: ["M 110 85 Q 120 75 130 85", "M 110 85 Q 120 85 130 85", "M 110 85 Q 120 75 130 85"] }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1] }}
            />

            {/* Blush */}
            <circle cx="70" cy="98" r="6" fill="#fca5a5" opacity="0.8" />
            <circle cx="130" cy="98" r="6" fill="#fca5a5" opacity="0.8" />

            {/* Little Mouth */}
            <path d="M 96 102 Q 100 108 104 102" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Floating Disconnected Hands */}
            <motion.rect
                x="25" y="115" width="20" height="20" rx="10" fill="#ffffff" stroke="#0f172a" strokeWidth="6"
                animate={{ rotate: [15, -15, 15], y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "35px 125px" }}
            />
            <motion.rect
                x="155" y="105" width="20" height="20" rx="10" fill="#ffffff" stroke="#0f172a" strokeWidth="6"
                animate={{ rotate: [-20, 20, -20], y: [0, -6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                style={{ transformOrigin: "165px 115px" }}
            />
        </motion.g>
    </motion.svg>
);

// --- The Portal Background Layer ---
const CinematicPortal = ({ state }) => {
    // state: 'solid' | 'opening' | 'flying'

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-10">
            {/* The white background that covers everything initially */}
            <motion.div
                className="absolute inset-0 bg-white"
                animate={{ opacity: state === 'solid' ? 1 : 0 }}
                transition={{ duration: 0.1 }}
            />

            <motion.div
                initial={false}
                animate={{
                    width: state === 'solid' ? '0px' : '250px',
                    height: state === 'solid' ? '0px' : '250px',
                    scale: state === 'flying' ? 80 : 1,
                    opacity: state === 'solid' ? 0 : 1,
                }}
                transition={{
                    width: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] },
                    height: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] },
                    scale: { duration: 2.2, ease: [0.65, 0, 0.35, 1] },
                    opacity: { duration: 0.1 }
                }}
                style={{
                    borderRadius: '50%',
                    boxShadow: '0 0 0 200vmax #ffffff', // The solid white mask around the hole
                    background: 'transparent',
                    willChange: 'transform, width, height',
                    transformOrigin: 'center center'
                }}
            />

            {/* Inner lens ring for extra cinematic depth */}
            <motion.div
                className="absolute border-[1.5px] border-slate-200"
                animate={{
                    width: state === 'solid' ? '0px' : '250px',
                    height: state === 'solid' ? '0px' : '250px',
                    scale: state === 'flying' ? 80 : 1,
                    opacity: state === 'solid' ? 0 : state === 'opening' ? 1 : 0,
                }}
                transition={{
                    width: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] },
                    height: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] },
                    scale: { duration: 2.2, ease: [0.65, 0, 0.35, 1] },
                    opacity: { duration: state === 'flying' ? 1.0 : 0.3 }
                }}
                style={{
                    borderRadius: '50%',
                    willChange: 'transform, width, height',
                    transformOrigin: 'center center'
                }}
            />
        </div>
    );
};

// --- Main Component ---
const IntroOverlay = ({ onComplete }) => {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [phase, setPhase] = useState(0); // 1 = HELLO, 2 = I'M KEVIN, 3 = Mascot + EXPLORE
    const [portalState, setPortalState] = useState('solid'); // 'solid' -> 'opening' -> 'flying'

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (shouldShowIntro()) {
            setVisible(true);
            let isCancelled = false;

            const runSequence = async () => {
                // Intro text sequence
                setPhase(1);
                await new Promise(r => setTimeout(r, 1600));
                if (isCancelled) return;

                setPhase(2);
                await new Promise(r => setTimeout(r, 1600));
                if (isCancelled) return;

                setPhase(3);
                await new Promise(r => setTimeout(r, 2400));
                if (isCancelled) return;

                // Trigger exit
                handleExit();
            };

            runSequence();

            return () => { isCancelled = true; };
        }
    }, [mounted]);

    const handleExit = useCallback(() => {
        if (portalState !== 'solid') return;

        // 1. Text & Mascot scales up to create the "push" depth illusion
        setPhase(4);

        // 2. Open the portal slowly
        setTimeout(() => setPortalState('opening'), 200);

        // 3. Initiate the deep camera dive (much slower and smoother)
        setTimeout(() => setPortalState('flying'), 1500);

        // 4. Wait for the long 2.5s scale animation to finish before removing
        setTimeout(() => {
            markIntroSeen();
            setVisible(false);
            onComplete?.();
        }, 4000); // 1500ms delay + 2500ms flying duration
    }, [portalState, onComplete]);

    if (!mounted || !visible) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none" style={{ width: '100vw', height: '100vh' }}>

            {/* Cinematic Camera Depth Background */}
            <CinematicPortal state={portalState} />

            {/* Skip Button Layer */}
            {phase < 4 && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    onClick={handleExit}
                    className="absolute top-6 right-6 md:top-10 md:right-10 text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-slate-400 hover:text-slate-900 transition-colors z-50 pointer-events-auto p-4"
                >
                    Skip Intro
                </motion.button>
            )}

            {/* Foreground Content Layer (Text & Mascot) */}
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none perspective-[1000px]">
                <motion.div
                    className="w-full max-w-6xl px-6 relative flex items-center justify-center origin-center"
                    animate={{
                        scale: phase === 4 ? 4 : 1, // Push extremely hard into the camera
                        opacity: phase === 4 ? 0 : 1,
                        filter: phase === 4 ? 'blur(20px)' : 'blur(0px)'
                    }}
                    transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
                    style={{ willChange: 'transform, opacity, filter', transformStyle: 'preserve-3d' }}
                >
                    <AnimatePresence mode="wait">
                        {/* PHASE 1 */}
                        {phase === 1 && (
                            <motion.div
                                key="p1"
                                className="absolute flex items-center justify-center"
                                exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
                                transition={{ duration: 0.4 }}
                            >
                                <h1 className="text-[12vw] md:text-[9rem] font-black tracking-tighter uppercase text-slate-900 leading-none">
                                    <MaskText>READY.</MaskText>
                                </h1>
                            </motion.div>
                        )}

                        {/* PHASE 2 */}
                        {phase === 2 && (
                            <motion.div
                                key="p2"
                                className="absolute flex items-center justify-center"
                                exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
                                transition={{ duration: 0.4 }}
                            >
                                <h1 className="text-[12vw] md:text-[9rem] font-black tracking-tighter uppercase text-slate-900 leading-none flex items-center gap-2 md:gap-6">
                                    <MaskText delay={0}>LET'S</MaskText>
                                    <MaskText delay={0.1} className="text-blue-600">DIVE</MaskText>
                                </h1>
                            </motion.div>
                        )}

                        {/* PHASE 3 */}
                        {phase >= 3 && phase < 4 && (
                            <motion.div
                                key="p3"
                                className="absolute flex flex-col items-center justify-center w-full"
                                exit={{ opacity: 1 }} // handled by parent scale effect
                            >
                                {/* Cute Mascot Arrival */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -20 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', duration: 1.2, bounce: 0.5 }}
                                    className="w-32 h-32 md:w-48 md:h-48 mb-6"
                                >
                                    <MascotSVG />
                                </motion.div>

                                <div className="text-center flex flex-col items-center">
                                    <h1 className="text-[10vw] md:text-[7rem] font-black tracking-tighter uppercase text-slate-900 leading-[0.9]">
                                        <MaskText delay={0.2}>INTO THE UNIVERSE.</MaskText>
                                    </h1>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

        </div>
    );
};

export default IntroOverlay;