import React, { useLayoutEffect, useRef, Suspense, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Html, useProgress } from '@react-three/drei';
import { motion, useAnimation, useMotionValue, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import MainLayout from '../Layout/MainLayout';
import PlasticCard from '../UI/PlasticCard';
import PlasticButton from '../UI/PlasticButton';
import { navigateWithCleanup } from '../lib/pageTransitionCleanup';
import { Github, Linkedin, Twitter, Dribbble } from 'lucide-react';
const FeaturedProjects = React.lazy(() => import('../components/FeaturedProjects'));
const PanzekHome = React.lazy(() => import('../components/UI/PanzekHome'));
// Lazy load Robocop3D
const Robocop3D = React.lazy(() => import('../components/3D/Robocop3D'));

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PROFILE_TITLE_LETTERS = [
    { char: 'P', color: '#ff5b6b', shadow: '0 4px 0 #d94152, 0 8px 0 #b52a3c, 0 12px 14px rgba(0,0,0,0.25)', delay: 0 },
    { char: 'R', color: '#ff8a3c', shadow: '0 4px 0 #db6f2a, 0 8px 0 #b95516, 0 12px 14px rgba(0,0,0,0.25)', delay: 0.04 },
    { char: 'O', color: '#ffd54a', shadow: '0 4px 0 #e2b42f, 0 8px 0 #c19418, 0 12px 14px rgba(0,0,0,0.25)', delay: 0.08 },
    { char: 'F', color: '#5ccf68', shadow: '0 4px 0 #3faf4a, 0 8px 0 #2d8d38, 0 12px 14px rgba(0,0,0,0.25)', delay: 0.12 },
    { char: 'I', color: '#58a9ff', shadow: '0 4px 0 #2d82e6, 0 8px 0 #1c62c0, 0 12px 14px rgba(0,0,0,0.25)', delay: 0.16 },
    { char: 'L', color: '#b784ff', shadow: '0 4px 0 #8e5ee6, 0 8px 0 #6c3ec4, 0 12px 14px rgba(0,0,0,0.25)', delay: 0.2 },
    { char: 'E', color: '#ff6fb4', shadow: '0 4px 0 #d95695, 0 8px 0 #b8407a, 0 12px 14px rgba(0,0,0,0.25)', delay: 0.24 },
];

const CTA_LEFT_CABLES = [
    { id: 'red', color: '#ef4444', shadow: '#b91c1c', highlight: '#fca5a5', path: 'M -48 74 C 8 72, 42 46, 100 30' },
    { id: 'yellow', color: '#facc15', shadow: '#ca8a04', highlight: '#fde68a', path: 'M -48 50 C 10 48, 44 50, 100 50' },
    { id: 'green', color: '#34d399', shadow: '#15803d', highlight: '#a7f3d0', path: 'M -48 30 C 8 30, 42 66, 100 70' },
];

const CTA_RIGHT_CABLES = [
    { id: 'green', color: '#34d399', shadow: '#15803d', highlight: '#a7f3d0', path: 'M 0 30 C 42 34, 82 68, 148 72' },
    { id: 'yellow', color: '#facc15', shadow: '#ca8a04', highlight: '#fde68a', path: 'M 0 50 C 42 50, 82 50, 148 50' },
    { id: 'blue', color: '#60a5fa', shadow: '#2563eb', highlight: '#bfdbfe', path: 'M 0 70 C 42 66, 82 34, 148 30' },
];

// ─── SCREEN 1: PanzekOS Splash (simple, shown during isBooting) ───────────────
const PanzekOSSplash = () => {
    return (
        <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center p-4 z-10">
            <style>{`
                @keyframes pz-scaleX { from{transform:scaleX(0)} to{transform:scaleX(1)} }
                @keyframes pz-fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
                @keyframes pz-blink  { 0%,100%{opacity:1} 50%{opacity:0} }
                .pz-line { animation: pz-fadein 0.3s ease-out both; }
                .pz-line:nth-child(1){animation-delay:0.3s}
                .pz-line:nth-child(2){animation-delay:0.8s}
                .pz-line:nth-child(3){animation-delay:1.3s}
                .pz-line:nth-child(4){animation-delay:1.8s; animation: pz-fadein 0.3s 1.8s both, pz-blink 1s 2.1s ease-in-out infinite;}
            `}</style>

            {/* Logo */}
            <div className="mb-4 text-center">
                <div className="flex items-end justify-center gap-[2px] font-black" style={{ lineHeight: 1 }}>
                    <span style={{ color: '#34d399', fontSize: 28, letterSpacing: '0.02em', textShadow: '0 0 20px #34d399, 0 0 40px #34d39960' }}>Panzek</span>
                    <span style={{ color: '#60a5fa', fontSize: 28, letterSpacing: '0.02em', textShadow: '0 0 20px #60a5fa, 0 0 40px #60a5fa60' }}>OS</span>
                </div>
                <div style={{ color: '#fbbf24', fontSize: 9, letterSpacing: '0.25em', marginTop: 2, opacity: 0.8 }}>VERSION 1.0.0</div>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-[160px] mb-3">
                <div className="w-full h-[4px] bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#34d399] to-[#60a5fa] rounded-full"
                        style={{ animation: 'pz-scaleX 2.4s ease-out forwards', transformOrigin: 'left', transform: 'scaleX(0)' }}
                    />
                </div>
            </div>

            {/* Status lines */}
            <div className="w-full max-w-[180px] font-mono text-left" style={{ fontSize: 7 }}>
                <div className="pz-line" style={{ color: '#34d399' }}>✓ System RAM OK</div>
                <div className="pz-line" style={{ color: '#34d399' }}>✓ Display Initialized</div>
                <div className="pz-line" style={{ color: '#fbbf24' }}>✓ Loading Profile...</div>
                <div className="pz-line" style={{ color: '#60a5fa' }}>Starting PanzekOS_</div>
            </div>
        </div>
    );
};

// ─── SCREEN 2: PanzekCLI Terminal (shown after boot, showImage state) ─────────
const HOLO_FACE = [
    "  \u256d\u2500\u2500\u2500\u2500\u2500\u2500\u256e  ",
    " \u2502 \u25c9  \u25c9 \u2502 ",
    " \u2502  \u25bf\u25bf  \u2502 ",
    " \u2502 \u2570\u2500\u2500\u256f \u2502 ",
    "  \u2570\u2500\u2500\u2500\u2500\u2500\u2500\u256f  ",
    " \u2571\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2572 ",
    "\u2571\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2572",
];

const CLI_LINES = [
    { text: 'Booting PanzekOS v1.0...', delay: 150, color: '#34d399' },
    { text: '[ OK ] Starting kernel...', delay: 420, color: '#34d399' },
    { text: '[ OK ] Mounting filesystems', delay: 680, color: '#34d399' },
    { text: '[ OK ] Starting network', delay: 920, color: '#34d399' },
    { text: '[ .. ] Loading user profile', delay: 1150, color: '#fbbf24' },
    { text: '> user: KEVIN HERMANSYAH', delay: 1450, color: '#60a5fa', typing: true },
    { text: '> role: Frontend Developer', delay: 1780, color: '#60a5fa', typing: true },
    { text: '> loc : Bogor, ID', delay: 2060, color: '#60a5fa', typing: true },
    { text: '[ OK ] PanzekOS ready  \u25cf', delay: 2380, color: '#34d399', blink: true },
];

const TypedText = ({ text, color }) => {
    const [displayed, setDisplayed] = useState('');
    const [done, setDone] = useState(false);
    useEffect(() => {
        let i = 0;
        setDisplayed('');
        setDone(false);
        const iv = setInterval(() => {
            i++;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) { clearInterval(iv); setDone(true); }
        }, 28);
        return () => clearInterval(iv);
    }, [text]);
    return (
        <span style={{ color }}>
            {displayed}
            {!done && <span style={{ color: '#34d399', animation: 'blink 0.7s step-end infinite' }}>\u258c</span>}
        </span>
    );
};

const PanzekCLI = () => {
    const [visibleLines, setVisibleLines] = useState([]);
    const [holoPhase, setHoloPhase] = useState(0);

    useEffect(() => {
        const t1 = setTimeout(() => setHoloPhase(1), 100);
        const t2 = setTimeout(() => setHoloPhase(2), 600);
        const timers = CLI_LINES.map((line, i) =>
            setTimeout(() => {
                setVisibleLines(prev => [...prev, i]);
            }, line.delay)
        );
        return () => { clearTimeout(t1); clearTimeout(t2); timers.forEach(clearTimeout); };
    }, []);

    return (
        <div className="absolute inset-0 bg-[#020c04] flex flex-col p-2 z-10 overflow-hidden font-mono">
            <style>{`
                @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
                @keyframes crt-flicker { 0%,100%{opacity:1} 50%{opacity:0.85} 25%{opacity:0.92} 75%{opacity:0.88} }
                @keyframes holo-flicker { 0%,100%{opacity:0.85;filter:blur(0px)} 20%{opacity:0.3;filter:blur(1px)} 40%{opacity:0.9} 60%{opacity:0.4;filter:blur(0.5px)} 80%{opacity:1} }
                @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
                @keyframes glow-pulse { 0%,100%{text-shadow:0 0 6px #34d399,0 0 12px #34d399} 50%{text-shadow:0 0 2px #34d399} }
                .cli-line { animation: fadein 0.15s ease-out; }
                @keyframes fadein { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
                .holo-stable { animation: crt-flicker 4s ease-in-out infinite; }
                .holo-flicker { animation: holo-flicker 0.4s steps(3, end) infinite; }
                .scanline-bar { animation: scanline 3s linear infinite; }
                .status-blink span { animation: glow-pulse 1.2s ease-in-out infinite; }
            `}</style>

            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden opacity-20">
                <div className="scanline-bar absolute left-0 right-0 h-[2px] bg-[#34d399]/40" style={{ top: 0 }} />
            </div>
            {/* CRT grid overlay */}
            <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.04]"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(52,211,153,0.8) 3px,rgba(52,211,153,0.8) 4px)' }}
            />

            {/* Header */}
            <div className="flex items-center gap-1 mb-1 pb-1 border-b border-[#34d399]/30">
                <span style={{ color: '#34d399', fontSize: 8, letterSpacing: '0.1em', fontWeight: 900 }}>Panzek</span>
                <span style={{ color: '#60a5fa', fontSize: 8, letterSpacing: '0.08em', fontWeight: 900 }}>OS</span>
                <span style={{ color: '#fbbf24', fontSize: 6, letterSpacing: '0.12em', marginLeft: 2 }}>v1.0</span>
                <span className="ml-auto" style={{ color: '#34d399', fontSize: 6, animation: 'blink 1s step-end infinite' }}>▌</span>
            </div>

            {/* Main 2-column layout */}
            <div className="flex gap-1 flex-1 overflow-hidden">
                {/* LEFT: Holographic Face */}
                <div className="flex-shrink-0 flex flex-col items-center justify-start pt-1" style={{ width: 64 }}>
                    <div
                        className={holoPhase === 0 ? 'opacity-0' : holoPhase === 1 ? 'holo-flicker' : 'holo-stable'}
                        style={{ transition: 'opacity 0.2s' }}
                    >
                        {HOLO_FACE.map((row, i) => (
                            <div key={i} style={{
                                fontSize: 5.5, lineHeight: 1.55,
                                color: i === 5 || i === 6 ? '#1a6b45' : '#34d399',
                                textShadow: '0 0 8px #34d399, 0 0 16px #34d39960',
                                letterSpacing: 0, whiteSpace: 'nowrap'
                            }}>{row}</div>
                        ))}
                        <div style={{ color: '#34d399', fontSize: 5.5, textAlign: 'center', marginTop: 2, textShadow: '0 0 6px #34d399', animation: 'blink 1s step-end infinite' }}>
                            ◈ HOLO ◈
                        </div>
                    </div>
                    <div className="mt-1 flex flex-col gap-[2px] items-center">
                        {[40, 70, 55, 90, 30, 65].map((h, i) => (
                            <div key={i} style={{
                                width: 3, height: h * 0.18,
                                background: `rgba(52,211,153,${0.3 + h * 0.005})`,
                                borderRadius: 1, boxShadow: '0 0 3px #34d399'
                            }} />
                        ))}
                    </div>
                </div>

                {/* RIGHT: CLI Output */}
                <div className="flex-1 flex flex-col overflow-hidden" style={{ gap: 0 }}>
                    {CLI_LINES.map((line, i) => (
                        visibleLines.includes(i) && (
                            <div key={i} className={`cli-line ${line.blink ? 'status-blink' : ''}`}
                                style={{ fontSize: 7, lineHeight: 1.7, letterSpacing: '0.03em' }}
                            >
                                {line.typing
                                    ? <TypedText text={line.text} color={line.color} />
                                    : <span style={{ color: line.color }}>{line.text}</span>
                                }
                            </div>
                        )
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-1 pt-1 border-t border-[#34d399]/30">
                <div style={{ color: '#34d399', fontSize: 5.5, opacity: 0.6, letterSpacing: '0.1em' }}>PanzekOS — profile session active</div>
            </div>
        </div>
    );
};

class ModelErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <Html center>
                    <div className="flex flex-col items-center justify-center p-6 bg-white/70 backdrop-blur-md rounded-[2rem] border-[3px] border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.1)] w-56 text-center">
                        <div className="text-slate-700 font-black uppercase tracking-widest text-[10px]">
                            3D Model Error
                        </div>
                        <div className="mt-2 text-xs font-semibold text-slate-600">
                            Model belum bisa dimuat. Cek koneksi atau file 3D.
                        </div>
                    </div>
                </Html>
            );
        }

        return this.props.children;
    }
}

// Helper to pause rendering when offscreen
const PerformanceOptimizer = () => {
    const { gl, setFrameloop } = useThree();
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            // When visible, run animation loop. When hidden, stop it.
            setFrameloop(entry.isIntersecting ? 'demand' : 'never');
        }, { threshold: 0.1 });

        if (gl.domElement.parentElement) {
            observer.observe(gl.domElement.parentElement);
        }

        return () => observer.disconnect();
    }, [gl, setFrameloop]);
    return null;
};



const CanvasLoader = () => {
    const { progress, active } = useProgress();
    const [showSlowNetwork, setShowSlowNetwork] = useState(false);

    useEffect(() => {
        if (!active) {
            setShowSlowNetwork(false);
            return undefined;
        }

        const timer = setTimeout(() => {
            setShowSlowNetwork(true);
        }, 2500);

        return () => clearTimeout(timer);
    }, [active]);

    return (
        <Html center>
            <div className="flex flex-col items-center justify-center p-6 bg-white/60 backdrop-blur-md rounded-[2rem] border-[3px] border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.1)] w-48 transition-all duration-300">
                <div className="relative w-16 h-16 animate-pulse mb-4">
                    {/* Animated Campfire placeholder icon or just circles */}
                    <div className="absolute inset-0 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-4 border-orange-200 border-b-orange-500 rounded-full animate-spin-reverse" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    <span className="absolute inset-0 flex flex-col items-center justify-center text-xs font-black text-orange-600">
                        {Math.floor(progress)}%
                    </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="text-orange-500 font-bold uppercase tracking-widest text-[10px] mt-1 text-center">
                    Setting up Camp...
                </div>
                {showSlowNetwork && (
                    <div className="mt-2 text-[10px] font-semibold text-slate-600 text-center">
                        Koneksi lambat, model 3D masih loading.
                    </div>
                )}
            </div>
        </Html>
    );
};

const EmbeddedScreenFallback = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#020c04]">
        <div className="text-center font-mono">
            <div className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300/90">
                Loading Home
            </div>
            <div className="mt-2 text-[11px] font-semibold text-emerald-100/70">
                Preparing PanzekOS...
            </div>
        </div>
    </div>
);

const FeaturedProjectsFallback = () => (
    <div className="w-full py-12 mb-16">
        <div className="mx-auto max-w-7xl px-4 md:px-12">
            <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/45 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200/90" />
                <div className="mt-5 h-[320px] animate-pulse rounded-[1.75rem] bg-slate-200/70" />
            </div>
        </div>
    </div>
);

const DraggableCable = ({ color, startY, portY, isConnected, onConnect, onDisconnect, portsRef, index }) => {
    const controls = useAnimation();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const [pathD, setPathD] = useState('');
    const [nearPort, setNearPort] = useState(false);
    const snappedRef = useRef(false); // guard to prevent spring-back after snap
    const plugRef = useRef(null);
    const magnetRadius = 240;
    const snapRadius = 200;

    const colorHex = {
        red: '#ef4444',
        yellow: '#eab308',
        green: '#22c55e',
        blue: '#3b82f6'
    }[color];

    const shadowHex = {
        red: '#b91c1c',
        yellow: '#ca8a04',
        green: '#15803d',
        blue: '#1d4ed8'
    }[color];

    const highlightHex = {
        red: '#fca5a5',
        yellow: '#fdf08a',
        green: '#86efac',
        blue: '#93c5fd'
    }[color];

    // Starting x position for the cable off-screen
    const startX = -1000;

    // Fixed disconnected resting positions
    const restingPositions = {
        red: { x: -180, y: 0 },
        yellow: { x: -220, y: 0 },
        green: { x: -200, y: 0 },
        blue: { x: -160, y: 0 }
    };

    // Extreme off-screen start heights and droop/rise offsets to force crossing/tangling
    const leftTangle = {
        red: { startY: 1200, cp1y: 800, cp2y: -600 },
        yellow: { startY: -800, cp1y: 400, cp2y: 900 },
        green: { startY: 600, cp1y: -1200, cp2y: 800 },
        blue: { startY: -1000, cp1y: 200, cp2y: 400 }
    }[color];

    // Calculate dynamic bezier curve path based on motion value state or resting state
    const updatePath = () => {
        const curX = isConnected ? 0 : x.get();
        const curY = isConnected ? 0 : y.get();

        const targetX = 0;
        const targetY = 0;

        // Fixed start position far left relative to world, plus unique vertical offset
        const svgStartX = -1500 - (restingPositions[color].x + curX);
        const svgStartY = -curY + leftTangle.startY;

        // Chaotic overlapping control points
        const cp1x = svgStartX + (targetX - svgStartX) * 0.35;
        const cp1y = svgStartY + leftTangle.cp1y;
        const cp2x = targetX - Math.abs(targetX - svgStartX) * 0.45;
        const cp2y = targetY + leftTangle.cp2y;

        // SVG Path String
        setPathD(`M ${svgStartX} ${svgStartY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetX} ${targetY}`);
    };

    useEffect(() => {
        // Initial path setup
        updatePath();

        // Subscribe to framer-motion values to update SVG real-time during drag
        const unsubscribeX = x.on('change', updatePath);
        const unsubscribeY = y.on('change', updatePath);
        return () => { unsubscribeX(); unsubscribeY(); };
    }, [isConnected, colorHex]); // re-run if connection state changes


    const getPortDistance = (fallbackPoint) => {
        const portEl = portsRef.current[color];
        if (!portEl) {
            return null;
        }

        const portRect = portEl.getBoundingClientRect();
        const portCx = portRect.left + portRect.width / 2;
        const portCy = portRect.top + portRect.height / 2;

        const plugRect = plugRef.current?.getBoundingClientRect();
        const plugCx = plugRect ? plugRect.left + plugRect.width / 2 : fallbackPoint?.x;
        const plugCy = plugRect ? plugRect.top + plugRect.height / 2 : fallbackPoint?.y;

        if (plugCx == null || plugCy == null) {
            return null;
        }

        return Math.hypot(portCx - plugCx, portCy - plugCy);
    };

    const handleDrag = (event, info) => {
        const portEl = portsRef.current[color];
        if (!portEl) {
            return;
        }

        const dist = getPortDistance(info.point);
        if (dist == null) {
            return;
        }

        // Proximity glow feedback when within magnet range
        setNearPort(dist < magnetRadius);

        // Auto snap when within magnetic snap range
        if (dist < snapRadius && !snappedRef.current) {
            snappedRef.current = true; // Mark snapped so dragEnd doesn't spring back
            setNearPort(false);
            controls.stop();
            x.set(0);
            y.set(0);
            onConnect(color);
        }
    };

    const handleDragEnd = (event, info) => {
        const dist = getPortDistance(info.point);
        if (dist != null && dist < snapRadius && !snappedRef.current) {
            snappedRef.current = true;
            setNearPort(false);
            controls.stop();
            x.set(0);
            y.set(0);
            onConnect(color);
            return;
        }

        // Only spring back to resting if we did NOT snap into the port
        if (!snappedRef.current) {
            controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
        }
        snappedRef.current = false;
        setNearPort(false);
    };

    // Shared Plug UI
    const plugHead = (
        <div ref={plugRef} className="w-9 h-7 bg-slate-200 rounded-[8px] border-[2px] border-slate-400 shadow-xl flex items-center justify-end pr-[1px] relative group overflow-visible"
            style={{
                background: 'linear-gradient(to bottom, #f8fafc 0%, #cbd5e1 50%, #94a3b8 100%)',
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.8), -4px 6px 12px rgba(0,0,0,0.3)'
            }}>
            {/* Grip indentations */}
            <div className="flex flex-col gap-[2px] mr-1 opacity-70">
                <div className="w-1 h-[2px] bg-slate-600 rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
                <div className="w-1 h-[2px] bg-slate-600 rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
                <div className="w-1 h-[2px] bg-slate-600 rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]" />
            </div>
            {/* The metal connector pin */}
            <div className="absolute -right-[6px] w-[5px] h-3.5 bg-zinc-300 border border-zinc-500 rounded-r-[2px] pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, #e4e4e7 0%, #a1a1aa 100%)', boxShadow: 'inset -1px 0 2px rgba(255,255,255,0.8)' }} />
        </div>
    );

    // Dynamic Cable Rendering (Layered strokes for 3D effect)
    const renderCable = (containerTop, containerLeft) => (
        <svg className="absolute overflow-visible pointer-events-none" style={{ top: 0, left: 0, width: 1, height: 1, zIndex: -1 }}>
            {/* Drop Shadow */}
            <path d={pathD} fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="18" strokeLinecap="round" transform="translate(0, 10)" filter="blur(6px)" />
            {/* Bottom Dark Stroke (3D shadow) */}
            <path d={pathD} fill="none" stroke={shadowHex} strokeWidth="16" strokeLinecap="round" transform="translate(0, 2)" />
            {/* Base Color Stroke */}
            <path d={pathD} fill="none" stroke={colorHex} strokeWidth="14" strokeLinecap="round" />
            {/* Top Highlight Stroke for Gloss */}
            <path d={pathD} fill="none" stroke={highlightHex} strokeWidth="4" strokeLinecap="round" transform="translate(0, -4)" opacity="0.6" />
        </svg>
    );

    if (isConnected) {
        return (
            <div className="absolute hidden md:flex items-center z-10 cursor-pointer hover:brightness-110 group transition-transform hover:translate-x-1"
                style={{ top: portY, transform: 'translateY(-50%)', left: -42, height: 20 }}
                onClick={() => onDisconnect(color)}
                title="Click to disconnect"
            >
                {/* SVG curves rendered exactly to (0,0) of this connected container */}
                <div className="absolute top-1/2 left-[5px]">{renderCable()}</div>

                {plugHead}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-md pointer-events-none flex items-center gap-1 shadow-lg border border-red-500">
                    <span className="mb-[2px]">&times;</span> UNPLUG
                </div>
            </div>
        );
    }

    const colorHexMap = { red: '#ef4444', yellow: '#eab308', green: '#22c55e', blue: '#3b82f6' };

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragElastic={0.15}
            animate={controls}
            style={{ x, y, top: startY, left: restingPositions[color].x }}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            whileHover={{ scale: 1.05 }}
            whileDrag={{ scale: 1.15, zIndex: 50, cursor: 'grabbing' }}
            className="absolute z-40 hidden md:flex items-center cursor-grab group mt-[-14px]"
        >
            {/* Anchor point for SVGs inside the motion div at the left edge of the plug */}
            <div className="absolute top-1/2 left-[5px]">{renderCable()}</div>

            {/* Plug with proximity glow ring when near port */}
            <div style={nearPort ? { filter: `drop-shadow(0 0 8px ${colorHexMap[color]}) drop-shadow(0 0 16px ${colorHexMap[color]})`, transition: 'filter 0.15s ease' } : { filter: 'none', transition: 'filter 0.2s ease' }}>
                {plugHead}
            </div>

            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] font-black px-3 py-1 rounded-md pointer-events-none whitespace-nowrap shadow-lg">
                {nearPort ? '⚡ AUTO CONNECT' : 'DRAG INTO PORT'}
            </div>
        </motion.div>
    );
};

const RightCable = ({ color, top }) => {
    const colorHex = { red: '#ef4444', yellow: '#eab308', green: '#22c55e', blue: '#3b82f6' }[color];
    const shadowHex = { red: '#b91c1c', yellow: '#ca8a04', green: '#15803d', blue: '#1d4ed8' }[color];
    const highlightHex = { red: '#fca5a5', yellow: '#fdf08a', green: '#86efac', blue: '#93c5fd' }[color];

    const rightTangle = {
        red: { endY: 700, cp1y: -400, cp2y: 900 },
        yellow: { endY: -600, cp1y: 600, cp2y: -300 },
        green: { endY: 300, cp1y: 1000, cp2y: -500 },
        blue: { endY: -900, cp1y: -200, cp2y: 800 }
    }[color];

    const startX = -20;
    const endX = 2500;

    const cp1x = 700;
    const cp1y = rightTangle.cp1y;
    const cp2x = 1500;
    const cp2y = rightTangle.cp2y;

    const pathD = `M ${startX} 0 C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${rightTangle.endY}`;

    return (
        <div className="absolute right-0 hidden md:block pointer-events-none" style={{ top, width: 0, height: 0, zIndex: -1 }}>
            <svg className="absolute overflow-visible" style={{ top: 0, left: 0, width: 1, height: 1 }}>
                <path d={pathD} fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="18" strokeLinecap="round" transform="translate(0, 10)" filter="blur(6px)" />
                <path d={pathD} fill="none" stroke={shadowHex} strokeWidth="16" strokeLinecap="round" transform="translate(0, 2)" />
                <path d={pathD} fill="none" stroke={colorHex} strokeWidth="14" strokeLinecap="round" />
                <path d={pathD} fill="none" stroke={highlightHex} strokeWidth="4" strokeLinecap="round" transform="translate(0, -4)" opacity="0.6" />
            </svg>
        </div>
    );
};

const LandingPage = ({ page, props }) => {
    const { repos = [] } = props;
    const comp = useRef();
    const heroRobotRef = useRef(null);
    const profileHeaderRef = useRef(null);
    const portsRef = useRef({});
    const [isMobile, setIsMobile] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const [isLowPower, setIsLowPower] = useState(false);
    const isHeroRobotInView = useInView(heroRobotRef, { once: true, margin: "200px" });
    const isProfileHeaderInView = useInView(profileHeaderRef, { once: true, margin: '-15% 0px' });
    const [gameboyStatus, setGameboyStatus] = useState('READY');
    const [showMobileGameboyGuide, setShowMobileGameboyGuide] = useState(true);

    // Cables State
    const [connectedCables, setConnectedCables] = useState({ red: false, yellow: false, green: false, blue: false });
    const [isBooting, setIsBooting] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [showHome, setShowHome] = useState(false);

    const allConnected = connectedCables.red && connectedCables.yellow && connectedCables.green && connectedCables.blue;

    const bootTimerRef = useRef(null);
    const homeTimerRef = useRef(null);

    useEffect(() => {
        if (allConnected) {
            setGameboyStatus('POWER ON');
            // Only start boot if not already booting and image not showing
            if (!showImage && !showHome && !isBooting) {
                setIsBooting(true);
                setGameboyStatus('BOOTING');
                bootTimerRef.current = setTimeout(() => {
                    setIsBooting(false);
                    setShowImage(true);
                    setGameboyStatus('CLI');

                    // Wait for CLI animation to finish then go to Home OS
                    homeTimerRef.current = setTimeout(() => {
                        setShowImage(false);
                        setShowHome(true);
                        setGameboyStatus('HOME');
                    }, 3500);
                }, 2800);
            }
        } else {
            // INSTANT OFF: Unplugging kills everything immediately.
            if (bootTimerRef.current) {
                clearTimeout(bootTimerRef.current);
                bootTimerRef.current = null;
            }
            if (homeTimerRef.current) {
                clearTimeout(homeTimerRef.current);
                homeTimerRef.current = null;
            }
            setIsBooting(false);
            setShowImage(false);
            setShowHome(false);
            setGameboyStatus('OFFLINE');
        }
    }, [allConnected]); // ← only depend on allConnected, not isBooting/showImage/showHome


    const handleConnect = (color) => {
        setConnectedCables(prev => ({ ...prev, [color]: true }));
    };

    const handleDisconnect = (color) => {
        setConnectedCables(prev => ({ ...prev, [color]: false }));
    };

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const cores = navigator.hardwareConcurrency ?? 4;
        const memory = navigator.deviceMemory ?? 4;
        const saveData = navigator.connection?.saveData ?? false;
        const isCoarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
        const lowPower = prefersReducedMotion || saveData || isCoarsePointer || cores <= 6 || memory <= 6;

        setIsLowPower(lowPower);
    }, [prefersReducedMotion]);

    const heroRenderSettings = useMemo(() => {
        const lowPower = isLowPower || isMobile;

        return {
            dpr: lowPower ? [0.7, 0.95] : [0.9, 1.25],
            antialias: !lowPower,
            powerPreference: lowPower ? 'low-power' : 'high-performance'
        };
    }, [isLowPower, isMobile]);
    const useLiteMobileScene = isMobile || isLowPower || prefersReducedMotion;

    const { scrollYProgress } = useScroll({
        target: comp,
        offset: ['start start', 'start 70%'],
    });
    const cloudBankY = useTransform(scrollYProgress, [0, 0.18], [220, 0]);
    const cloudBankOpacity = useTransform(scrollYProgress, [0, 0.18], [0.18, 1]);
    const cloudBankScale = useTransform(scrollYProgress, [0, 0.18], [1.08, 1]);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Profile Card Animation
            gsap.from('.profile-card', {
                scrollTrigger: {
                    trigger: '.profile-section',
                    start: 'top 80%',
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out'
            });

            // Projects Animation
            gsap.from('.project-card', {
                scrollTrigger: {
                    trigger: '.projects-section',
                    start: 'top 75%',
                },
                y: 80,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'elastic.out(1, 0.8)'
            });
        }, comp);
        return () => ctx.revert();
    }, []);

    return (
        <MainLayout page={page}>
            <div className="fixed inset-0 pointer-events-none -z-40 bg-gradient-to-b from-[#3b8fd9] via-[#7cbbed] to-[#d8ecf8] overflow-hidden">
                {/* Sun Glow/Source in Top Left */}
                <div className={`absolute -top-[10%] -left-[5%] rounded-full bg-gradient-to-br from-yellow-200/40 via-orange-100/20 to-transparent mix-blend-screen ${useLiteMobileScene ? 'h-[58vw] w-[58vw] blur-[70px]' : 'h-[45vw] w-[45vw] blur-[120px]'}`} />
                <div className={`absolute top-[10%] left-[10%] rounded-full bg-yellow-100/30 ${useLiteMobileScene ? 'h-[22vw] w-[22vw] blur-[46px]' : 'h-[15vw] w-[15vw] blur-[80px]'}`} />
                {/* Soft blended clouds integrated into background gradient */}
                <div className={`absolute top-[45%] left-[5%] rounded-full bg-white/30 ${useLiteMobileScene ? 'h-[120px] w-[52%] blur-[38px]' : 'h-[180px] w-[50%] blur-[60px]'}`}></div>
                <div className={`absolute top-[55%] right-[0%] rounded-full bg-white/35 ${useLiteMobileScene ? 'h-[120px] w-[48%] blur-[34px]' : 'h-[160px] w-[45%] blur-[50px]'}`}></div>
                <div className={`absolute top-[65%] left-[20%] rounded-full bg-white/40 ${useLiteMobileScene ? 'h-[140px] w-[70%] blur-[40px]' : 'h-[200px] w-[70%] blur-[70px]'}`}></div>
                <div className={`absolute top-[75%] left-[0%] w-full rounded-full bg-white/50 ${useLiteMobileScene ? 'h-[220px] blur-[44px]' : 'h-[300px] blur-[80px]'}`}></div>
                {!isMobile && (
                    <>
                        <div className="absolute top-[20%] right-[25%] w-[250px] h-[80px] bg-white/20 rounded-full blur-[40px]"></div>
                        <div className="absolute top-[15%] left-[60%] w-[200px] h-[60px] bg-white/15 rounded-full blur-[35px]"></div>
                        <div className="absolute top-[5%] left-[25%] w-[180px] h-[40px] bg-white/10 rounded-full blur-[25px]"></div>
                        <div className="absolute top-[8%] right-[10%] w-[300px] h-[50px] bg-white/15 rounded-full blur-[45px]"></div>
                    </>
                )}

                {/* SVG Filter for Cloud Texture */}
                {!useLiteMobileScene && (
                    <svg width="0" height="0" className="absolute">
                        <filter id="cloud-texture">
                            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="5" seed="8" result="noise" />
                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="45" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                        <filter id="wispy-cloud">
                            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="12" result="noise" />
                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" />
                            <feGaussianBlur stdDeviation="3" />
                        </filter>
                    </svg>
                )}

                {/* Sky accents - Paper Plane 1 */}
                <motion.div
                    animate={useLiteMobileScene ? undefined : { x: [0, -18, 0], y: [0, 10, 0], rotate: [10, 15, 10] }}
                    transition={useLiteMobileScene ? undefined : { duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute right-[8%] top-[18%] w-24 text-white/92 drop-shadow-[0_14px_16px_rgba(255,255,255,0.14)]"
                >
                    <svg viewBox="0 0 160 120" className="h-auto w-full">
                        <path d="M10 56 146 20 98 104 72 66Z" fill="rgba(255,255,255,0.95)" />
                        <path d="M10 56 72 66 98 104" fill="rgba(219,234,254,0.95)" />
                        <path d="M72 66 94 42 146 20" fill="rgba(255,255,255,0.82)" />
                        <path d="M53 60 94 42" stroke="rgba(147,197,253,0.8)" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                </motion.div>

                {/* Sky accents - Paper Plane 2 (Smaller/Higher) */}
                <motion.div
                    animate={{ x: [0, 12, 0], y: [0, -8, 0], rotate: [-5, -2, -5] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className={`absolute left-[35%] top-[12%] w-14 text-white/60 drop-shadow-[0_8px_10px_rgba(255,255,255,0.1)] ${isMobile ? 'opacity-30 scale-75' : ''}`}
                >
                    <svg viewBox="0 0 160 120" className="h-auto w-full opacity-70">
                        <path d="M10 56 146 20 98 104 72 66Z" fill="white" />
                        <path d="M10 56 72 66 98 104" fill="#f1f5f9" />
                    </svg>
                </motion.div>

                {/* Floating Themed Elements (Portfolio Capsule aesthetic) */}

                {/* Hot Air Balloon */}
                <motion.div
                    animate={{
                        y: [0, -25, 0],
                        x: [0, 15, 0],
                        rotate: [-2, 2, -2]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className={`absolute left-[12%] top-[15%] z-10 ${isMobile ? 'opacity-40 scale-75' : 'hidden sm:block'}`}
                >
                    <svg width="60" height="80" viewBox="0 0 60 80">
                        {/* Balloon */}
                        <path d="M30 5 C15 5, 5 15, 5 30 C5 45, 15 55, 30 55 C45 55, 55 45, 55 30 C55 15, 45 5, 30 5Z" fill="#ff5b6b" />
                        <path d="M30 5 C22 5, 15 15, 15 30 C15 45, 22 55, 30 55" fill="#f87171" opacity="0.6" />
                        <path d="M30 5 C38 5, 45 15, 45 30 C45 45, 38 55, 30 55" fill="#ef4444" opacity="0.4" />
                        {/* Wires */}
                        <path d="M15 48 L18 65 M45 48 L42 65" stroke="#94a3b8" strokeWidth="1.5" />
                        {/* Basket */}
                        <rect x="18" y="65" width="24" height="12" rx="3" fill="#92400e" />
                        <rect x="18" y="65" width="24" height="4" rx="1" fill="#78350f" opacity="0.3" />
                    </svg>
                    <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-150 -z-10" />
                </motion.div>

                {/* Distant Flock of Birds */}
                {!useLiteMobileScene && (
                    <motion.div
                        animate={{
                            x: ['-10vw', '110vw'],
                            y: [0, -20, 10, -5]
                        }}
                        transition={{
                            x: { duration: 60, repeat: Infinity, ease: "linear" },
                            y: { duration: 15, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="absolute top-[8%] opacity-30 flex gap-12 pointer-events-none"
                    >
                        {[0, 1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                                style={{ scale: 0.4 + (i * 0.1) }}
                            >
                                <svg width="24" height="12" viewBox="0 0 24 12">
                                    <path d="M2 10 C6 2, 10 10, 12 10 C14 10, 18 2, 22 10" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                                </svg>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Star Icon (Platformer style) */}
                <motion.div
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className={`absolute right-[18%] top-[25%] opacity-40 mix-blend-overlay ${isMobile ? 'scale-75' : ''}`}
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#ffd54a">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        {/* Gloss effect */}
                        <path d="M12 4 l1.5 3 h3 l-2 2" fill="white" opacity="0.5" />
                    </svg>
                </motion.div>

                {/* Coin Icon */}
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        rotateY: [0, 360]
                    }}
                    transition={{
                        y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 },
                        rotateY: { duration: 3, repeat: Infinity, ease: "linear" }
                    }}
                    className={`absolute left-[28%] top-[35%] opacity-30 ${isMobile ? 'scale-75' : ''}`}
                >
                    <div className="w-6 h-8 rounded-full bg-yellow-400 border-[2px] border-yellow-600 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_8px_rgba(0,0,0,0.2)] flex items-center justify-center font-black text-yellow-800 text-[10px]">
                        $
                    </div>
                </motion.div>

                <motion.div
                    animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute right-[25%] top-[30%] opacity-20 ${isMobile ? 'scale-75 opacity-10' : ''}`}
                >
                    <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M12 20 L28 20 M20 12 L20 28" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className={`absolute left-[15%] top-[40%] opacity-[0.15] ${isMobile ? 'scale-75 opacity-[0.08]' : ''}`}
                >
                    <svg width="30" height="30" viewBox="0 0 30 30">
                        <rect x="5" y="5" width="20" height="20" rx="4" fill="none" stroke="white" strokeWidth="2" />
                        <circle cx="15" cy="15" r="4" fill="white" />
                    </svg>
                </motion.div>

                <motion.div
                    animate={{ x: [0, 26, 0], opacity: [0.45, 0.8, 0.45] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    className={`absolute right-[16%] top-[25%] h-[2px] w-24 bg-gradient-to-r from-transparent via-white/80 to-transparent ${isMobile ? 'scale-x-75' : ''}`}
                />

                <motion.div
                    animate={{ x: [0, 14, 0], y: [0, -6, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className={`absolute left-[10%] top-[22%] flex items-center gap-4 text-white/55 ${isMobile ? 'opacity-30' : ''}`}
                >
                    <svg viewBox="0 0 120 32" className="h-6 w-20">
                        <path d="M10 22c7-9 15-9 22 0M36 20c7-8 14-8 21 0M64 18c7-7 14-7 21 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                    </svg>
                </motion.div>

                <motion.div
                    style={{ y: cloudBankY, opacity: cloudBankOpacity, scale: cloudBankScale }}
                    className="absolute inset-x-[-5%] bottom-[-8%] h-[34vh] min-h-[220px] origin-bottom"
                >
                    <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-white via-white/95 to-transparent z-10" />

                    {/* Primary Cloud Layer with Texture and Drift */}
                    <motion.div
                        animate={useLiteMobileScene ? undefined : {
                            x: [0, 15, -12, 5, 0],
                            y: [0, -8, 6, -4, 0]
                        }}
                        transition={useLiteMobileScene ? undefined : {
                            duration: 25,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-x-0 bottom-0 h-full"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at 4% 72%, rgba(255,255,255,0.98) 0 10%, rgba(255,255,255,0) 11%),
                                radial-gradient(circle at 12% 68%, rgba(255,255,255,0.98) 0 12%, rgba(255,255,255,0) 13%),
                                radial-gradient(circle at 22% 75%, rgba(255,255,255,0.98) 0 11%, rgba(255,255,255,0) 12%),
                                radial-gradient(circle at 31% 69%, rgba(255,255,255,0.98) 0 13%, rgba(255,255,255,0) 14%),
                                radial-gradient(circle at 42% 76%, rgba(255,255,255,0.98) 0 12%, rgba(255,255,255,0) 13%),
                                radial-gradient(circle at 53% 70%, rgba(255,255,255,0.98) 0 14%, rgba(255,255,255,0) 15%),
                                radial-gradient(circle at 64% 77%, rgba(255,255,255,0.98) 0 12%, rgba(255,255,255,0) 13%),
                                radial-gradient(circle at 75% 71%, rgba(255,255,255,0.98) 0 13%, rgba(255,255,255,0) 14%),
                                radial-gradient(circle at 86% 76%, rgba(255,255,255,0.98) 0 11%, rgba(255,255,255,0) 12%),
                                radial-gradient(circle at 95% 69%, rgba(255,255,255,0.98) 0 10%, rgba(255,255,255,0) 11%)
                            `,
                            filter: useLiteMobileScene ? 'drop-shadow(0 -4px 12px rgba(255,255,255,0.22))' : 'url(#cloud-texture) drop-shadow(0 -8px 24px rgba(255,255,255,0.4))',
                        }}
                    />

                    {/* Secondary Soft Layer for Depth */}
                    {!useLiteMobileScene && (
                        <motion.div
                            animate={{
                                x: [0, -20, 15, -5, 0],
                                y: [0, 10, -8, 4, 0]
                            }}
                            transition={{
                                duration: 35,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 2
                            }}
                            className="absolute inset-x-0 bottom-0 h-[80%] opacity-40 blur-[25px]"
                            style={{
                                backgroundImage: `
                                    radial-gradient(circle at 10% 80%, rgba(219,234,254,0.8) 0 15%, transparent 20%),
                                    radial-gradient(circle at 50% 75%, rgba(219,234,254,0.8) 0 20%, transparent 25%),
                                    radial-gradient(circle at 90% 85%, rgba(219,234,254,0.8) 0 15%, transparent 20%)
                                `,
                                filter: 'url(#wispy-cloud)',
                            }}
                        />
                    )}

                    <div className={`absolute inset-x-0 bottom-[4%] h-[24%] bg-[linear-gradient(180deg,rgba(191,219,254,0.22)_0%,rgba(255,255,255,0.8)_100%)] z-0 ${useLiteMobileScene ? 'blur-[12px]' : 'blur-[25px]'}`} />
                </motion.div>
            </div>

            {/* Vertical Social Links */}
            <div className="hidden lg:flex fixed left-5 top-1/2 z-50 -translate-y-1/2 flex-col items-center gap-3">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-[3px] rounded-full bg-gradient-to-b from-transparent via-white/80 to-[#93c5fd]" />
                    <a href="#" target="_blank" rel="noreferrer" aria-label="GitHub" className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] border border-[#fca5a5] bg-[linear-gradient(180deg,#f87171_0%,#ef4444_100%)] text-white shadow-[0_4px_0_#b91c1c,_0_10px_18px_rgba(239,68,68,0.22)] transition-all duration-200 hover:-translate-y-1 hover:scale-105">
                        <Github size={18} strokeWidth={2.4} />
                    </a>
                    <a href="#" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] border border-[#93c5fd] bg-[linear-gradient(180deg,#60a5fa_0%,#2563eb_100%)] text-white shadow-[0_4px_0_#1d4ed8,_0_10px_18px_rgba(37,99,235,0.22)] transition-all duration-200 hover:-translate-y-1 hover:scale-105">
                        <Linkedin size={18} strokeWidth={2.4} />
                    </a>
                    <a href="#" target="_blank" rel="noreferrer" aria-label="Dribbble" className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] border border-[#86efac] bg-[linear-gradient(180deg,#4ade80_0%,#22c55e_100%)] text-white shadow-[0_4px_0_#15803d,_0_10px_18px_rgba(34,197,94,0.22)] transition-all duration-200 hover:-translate-y-1 hover:scale-105">
                        <Dribbble size={18} strokeWidth={2.4} />
                    </a>
                    <a href="#" target="_blank" rel="noreferrer" aria-label="Twitter" className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] border border-[#fdba74] bg-[linear-gradient(180deg,#fb923c_0%,#f97316_100%)] text-white shadow-[0_4px_0_#c2410c,_0_10px_18px_rgba(249,115,22,0.22)] transition-all duration-200 hover:-translate-y-1 hover:scale-105">
                        <Twitter size={18} strokeWidth={2.4} />
                    </a>
                    <div className="h-12 w-[3px] rounded-full bg-gradient-to-b from-[#93c5fd] via-white/80 to-transparent" />
                </div>
            </div>

            <div ref={comp} className="flex flex-col gap-12 md:gap-16 pb-12 relative w-full">
                {/* HERO SECTION: 2-Column Layout */}
                <div className="relative z-20 mb-8 flex flex-col items-center justify-between gap-4 overflow-visible px-4 pt-2 md:mb-0 md:max-w-7xl md:flex-row md:gap-8 md:px-4 md:pt-16 md:mx-auto md:w-full">
                    {/* Left: Text Content */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left z-10 w-full md:w-[45%] md:pl-16">
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.28 }}
                            className="mb-5 flex flex-wrap items-center justify-center gap-2 md:justify-start"
                        >
                            <span className="rounded-full border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(219,234,254,0.92)_100%)] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-sky-700 shadow-[0_4px_0_#93c5fd,0_10px_16px_rgba(59,130,246,0.16)]">
                                Portfolio Capsule
                            </span>
                        </motion.div>

                        <h1 className="hero-text font-black tracking-tighter mb-4 leading-[0.9] select-none flex flex-col gap-2 min-h-[100px] sm:min-h-[140px] md:min-h-[180px] lg:min-h-[220px]">
                            {/* KEVIN - Multi-colored floating text */}
                            <span className="flex justify-center md:justify-start text-[3.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[8.5rem] drop-shadow-xl relative z-10 -space-x-1 md:-space-x-3">
                                {[
                                    { char: 'K', color: '#ef4444', shadow: '#b91c1c', shadow2: '#991b1b', delay: 0 },
                                    { char: 'E', color: '#eab308', shadow: '#ca8a04', shadow2: '#a16207', delay: 0.1 },
                                    { char: 'V', color: '#22c55e', shadow: '#16a34a', shadow2: '#15803d', delay: 0.15 },
                                    { char: 'I', color: '#3b82f6', shadow: '#2563eb', shadow2: '#1d4ed8', delay: 0.25 },
                                    { char: 'N', color: '#f97316', shadow: '#ea580c', shadow2: '#c2410c', delay: 0.2 }
                                ].map((item, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, y: 40, rotateX: 45, scale: 0.5 }}
                                        animate={{
                                            opacity: 1,
                                            y: useLiteMobileScene ? 0 : [0, -16, -6, -14, 0],
                                            x: useLiteMobileScene ? 0 : [0, 2, -2, 1, 0],
                                            rotateX: 0,
                                            rotateZ: useLiteMobileScene ? 0 : [0, -3, 3, -2, 0],
                                            scale: useLiteMobileScene ? 1 : [1, 1.1, 0.95, 1.08, 1],
                                            scaleX: useLiteMobileScene ? 1 : [1, 1.12, 0.92, 1.05, 1],
                                            scaleY: useLiteMobileScene ? 1 : [1, 0.98, 1.08, 0.98, 1],
                                        }}
                                        transition={{
                                            opacity: { duration: 0.4, delay: item.delay },
                                            y: useLiteMobileScene
                                                ? { duration: 0.6, type: 'spring', stiffness: 300, damping: 15, delay: item.delay }
                                                : [
                                                    { duration: 0.6, type: 'spring', stiffness: 300, damping: 15, delay: item.delay },
                                                    { duration: 2.4 + i * 0.25, repeat: Infinity, ease: 'easeInOut', delay: 0.9 + item.delay }
                                                ],
                                            x: useLiteMobileScene ? undefined : { duration: 2.2 + i * 0.2, repeat: Infinity, ease: 'easeInOut', delay: 1 + item.delay },
                                            rotateX: { duration: 0.8, type: 'spring', stiffness: 200, delay: item.delay },
                                            rotateZ: useLiteMobileScene ? undefined : { duration: 2.6 + i * 0.2, repeat: Infinity, ease: 'easeInOut', delay: 1.1 + i * 0.12 },
                                            scale: useLiteMobileScene
                                                ? { duration: 0.6, type: 'spring', stiffness: 300, damping: 15, delay: item.delay }
                                                : [
                                                    { duration: 0.6, type: 'spring', stiffness: 300, damping: 15, delay: item.delay },
                                                    { duration: 2.8 + i * 0.25, repeat: Infinity, ease: 'easeInOut', delay: 1.1 + i * 0.2 }
                                                ],
                                            scaleX: useLiteMobileScene ? undefined : { duration: 2.2 + i * 0.2, repeat: Infinity, ease: 'easeInOut', delay: 1.3 + i * 0.2 },
                                            scaleY: useLiteMobileScene ? undefined : { duration: 2.1 + i * 0.2, repeat: Infinity, ease: 'easeInOut', delay: 1.25 + i * 0.2 }
                                        }}
                                        className="origin-bottom"
                                        style={{
                                            color: item.color,
                                            textShadow: `0 2px 0 ${item.shadow}, 0 4px 0 ${item.shadow2}, 0 8px 10px rgba(0,0,0,0.2)`,
                                            willChange: 'transform'
                                        }}
                                    >
                                        {item.char}
                                    </motion.span>
                                ))}
                            </span>
                            {/* HERMANSYAH - White block text */}
                            <motion.span
                                initial={{ opacity: 0, scaleY: 0, originY: 0 }}
                                animate={{
                                    opacity: 1,
                                    scaleY: useLiteMobileScene ? 1 : [1, 1.06, 0.98, 1.04, 1],
                                    y: useLiteMobileScene ? 0 : [0, -5, -1, -7, 0],
                                    x: useLiteMobileScene ? 0 : [0, 1.5, -1, 1, 0],
                                    rotateZ: useLiteMobileScene ? 0 : [0, -1.5, 1, -1, 0]
                                }}
                                transition={{
                                    opacity: { duration: 0.5, delay: 0.5 },
                                    y: useLiteMobileScene ? undefined : { duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 },
                                    x: useLiteMobileScene ? undefined : { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.1 },
                                    rotateZ: useLiteMobileScene ? undefined : { duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 1.3 },
                                    scaleY: useLiteMobileScene
                                        ? { type: 'spring', stiffness: 200, damping: 12, delay: 0.5 }
                                        : [
                                            { type: 'spring', stiffness: 200, damping: 12, delay: 0.5 },
                                            { duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }
                                        ]
                                }}
                                className="block text-[2.2rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[5.5rem] text-white drop-shadow-2xl origin-top relative z-0 mt-[-8px] md:mt-[-20px] font-black tracking-normal"
                                style={{
                                    textShadow: "0 1px 0 #f1f5f9, 0 2px 0 #e2e8f0, 0 3px 0 #cbd5e1, 0 4px 0 #94a3b8, 0 5px 0 #64748b, 0 6px 0 #475569, 0 10px 15px rgba(0,0,0,0.3)",
                                    willChange: 'transform'
                                }}
                            >
                                HERMANSYAH
                            </motion.span>
                        </h1>

                        {/* First Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="hero-text text-sm sm:text-lg md:text-xl font-bold text-white mb-4 md:mb-8 max-w-lg leading-relaxed tracking-wide"
                            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
                        >
                            3D Designer &bull; Frontend &bull; Illustrator
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="hero-text flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 mb-4 md:mb-10"
                        >
                            {/* exact button styles matching reference */}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <PlasticButton color="blue" onClick={() => navigateWithCleanup('/projects')} className="capitalize !text-[13px] md:!text-[15px] !py-2.5 md:!py-3 !px-6 md:!px-8 !rounded-[1.2rem] !bg-[#1c7ed6] !border-[#1864ab] !shadow-[0_6px_0_#1864ab,_0_10px_20px_rgba(0,0,0,0.2)] hover:!brightness-110 !font-bold">
                                    View Projects
                                </PlasticButton>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <PlasticButton color="yellow" onClick={() => navigateWithCleanup('/contact')} className="capitalize !text-[13px] md:!text-[15px] !py-2.5 md:!py-3 !px-6 md:!px-8 !rounded-[1.2rem] !text-white !bg-[#f59f00] !border-[#e67700] !shadow-[0_6px_0_#d97706,_0_10px_20px_rgba(0,0,0,0.2)] hover:!brightness-110 !font-bold">
                                    Hire Creator
                                </PlasticButton>
                            </motion.div>
                        </motion.div>

                        {/* Second Subtitle */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            className="flex gap-3 md:gap-4 text-white text-xs sm:text-sm font-black tracking-widest drop-shadow-sm"
                        >
                            <span>5+ Years</span>
                            <span className="opacity-60">&bull;</span>
                            <span>20+ Projects</span>
                            <span className="opacity-60">&bull;</span>
                            <span>Fast Delivery</span>
                        </motion.div>
                    </div>

                    {/* Right: 3D Robot Showcase — responsive container */}
                    <div ref={heroRobotRef} className={`hero-robot order-first md:order-none relative w-full h-[450px] sm:h-[600px] md:h-[580px] md:w-[50%] md:aspect-auto flex-shrink-0 z-20 ${isMobile ? 'pointer-events-none' : ''}`}>

                        {isHeroRobotInView && (
                            <Canvas
                                camera={{ position: [0, 0.6, 8.8], fov: isMobile ? 62 : 50 }}
                                dpr={heroRenderSettings.dpr}
                                frameloop="demand"
                                gl={{
                                    powerPreference: heroRenderSettings.powerPreference,
                                    antialias: heroRenderSettings.antialias
                                }}
                            >
                                <PerformanceOptimizer />
                                <Suspense fallback={<CanvasLoader />}>
                                    <ambientLight intensity={1.6} />
                                    <directionalLight position={[5, 10, 5]} intensity={2.8} castShadow />
                                    <pointLight position={[-5, 5, -5]} intensity={1.0} color="#ffffff" />
                                    <pointLight position={[3, 2, 3]} intensity={0.6} color="#ffeedd" />

                                    <group position={isMobile ? [0, -0.18, 0] : [0.6, -0.3, 0]}>
                                        <ModelErrorBoundary>
                                            <Robocop3D
                                                scale={isMobile ? 2.5 : 3.0}
                                                position={[0, 0, 0]}
                                                rotation={[0, Math.PI / 5, 0]}
                                            />
                                        </ModelErrorBoundary>
                                    </group>

                                    <OrbitControls
                                        enableZoom={false}
                                        enablePan={false}
                                        enableRotate={false}
                                    />
                                </Suspense>
                            </Canvas>
                        )}

                    </div>
                </div>

                {/* PROFILE SECTION */}
                <div className="profile-section relative z-10 mx-auto mb-20 mt-12 w-full max-w-6xl px-4 md:mt-16">
                    <div className="flex flex-col gap-6 items-center">

                        {/* Title Header */}
                        <div ref={profileHeaderRef} className="flex flex-col items-center gap-1 z-10 relative px-4">
                            <motion.span
                                initial={{ opacity: 0, y: 12 }}
                                animate={isProfileHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                                transition={{ duration: 0.45, ease: 'easeOut' }}
                                className="text-xs font-black uppercase tracking-[0.25em] text-slate-700/80 drop-shadow-sm"
                            >
                                — SECTION SEPARATOR —
                            </motion.span>
                            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-1">
                                <h2 className="text-5xl md:text-7xl font-black tracking-[0.12em] flex gap-[2px] md:gap-1 relative z-10">
                                    {PROFILE_TITLE_LETTERS.map((letter, index) => (
                                        <motion.span
                                            key={letter.char}
                                            initial={{ opacity: 0, y: 26, rotateX: -26, scale: 0.84 }}
                                            animate={isProfileHeaderInView ? {
                                                opacity: 1,
                                                y: useLiteMobileScene ? 0 : [0, -3, 0, -2, 0],
                                                rotateX: 0,
                                                rotateZ: useLiteMobileScene ? 0 : [0, -1.2, 1.1, -0.6, 0],
                                                scale: useLiteMobileScene ? 1 : [1, 1.03, 1, 1.02, 1],
                                            } : {
                                                opacity: 0,
                                                y: 26,
                                                rotateX: -26,
                                                scale: 0.84,
                                            }}
                                            transition={{
                                                opacity: { duration: 0.34, delay: letter.delay },
                                                y: useLiteMobileScene
                                                    ? { type: 'spring', stiffness: 230, damping: 18, delay: letter.delay }
                                                    : [
                                                        { type: 'spring', stiffness: 230, damping: 18, delay: letter.delay },
                                                        { duration: 3.1 + index * 0.16, repeat: Infinity, ease: 'easeInOut', delay: 0.75 + letter.delay }
                                                    ],
                                                rotateX: { duration: 0.48, ease: 'easeOut', delay: letter.delay },
                                                rotateZ: useLiteMobileScene ? undefined : { duration: 3.5 + index * 0.15, repeat: Infinity, ease: 'easeInOut', delay: 0.9 + letter.delay },
                                                scale: useLiteMobileScene ? undefined : { duration: 3 + index * 0.14, repeat: Infinity, ease: 'easeInOut', delay: 0.82 + letter.delay },
                                            }}
                                            className="inline-block origin-bottom will-change-transform"
                                            style={{ color: letter.color, textShadow: letter.shadow }}
                                        >
                                            {letter.char}
                                        </motion.span>
                                    ))}
                                </h2>
                            </div>
                        </div>

                        {/* Horizontal Gameboy Layout */}
                        <div className="profile-card relative w-full mt-4 md:mt-10 flex flex-col md:flex-row items-center justify-center drop-shadow-2xl">

                            {isMobile && (
                                <div className="mb-4 w-full max-w-[400px] rounded-[24px] border border-white/70 bg-white/78 p-4 text-slate-800 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur-md">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-700/80">Mobile Guide</p>
                                            <p className="mt-1 text-sm font-bold leading-snug">
                                                Tap 4 port warna di kiri untuk menyalakan gameboy.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowMobileGameboyGuide((value) => !value)}
                                            className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-sky-700"
                                        >
                                            {showMobileGameboyGuide ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                    {showMobileGameboyGuide && (
                                        <div className="mt-3 grid grid-cols-1 gap-2 text-[11px] font-semibold leading-relaxed text-slate-700">
                                            <div className="rounded-2xl bg-slate-900/[0.04] px-3 py-2">1. Nyalakan dengan tap port merah, kuning, hijau, dan biru.</div>
                                            <div className="rounded-2xl bg-slate-900/[0.04] px-3 py-2">2. Setelah layar hidup, langsung tap ikon aplikasi di dalam screen.</div>
                                            <div className="rounded-2xl bg-slate-900/[0.04] px-3 py-2">3. Gameboy sekarang full-screen tanpa tombol fisik supaya lebih clean dan stabil.</div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* LEFT: Gameboy Console */}
                            <div className="relative w-full max-w-[400px] md:max-w-none md:w-[420px] flex-shrink-0 z-20"
                                style={{
                                    background: 'linear-gradient(145deg, #e5e7eb 0%, #d1d5db 40%, #c8cdd5 100%)',
                                    borderRadius: '28px',
                                    padding: isMobile ? '18px 18px 14px' : '20px 20px 16px',
                                    border: '2px solid #fff',
                                    borderBottom: '8px solid #9ca3af',
                                    borderRight: '8px solid #9ca3af',
                                    boxShadow: '6px 6px 0 rgba(0,0,0,0.12), inset 0 2px 0 rgba(255,255,255,0.9)'
                                }}
                            >
                                {/* Ports and Cables - rendered on left edge of Gameboy */}
                                {Object.entries({ red: '25%', yellow: '45%', green: '65%', blue: '85%' }).map(([color, top]) => {
                                    const isConn = connectedCables[color];
                                    const hexes = { red: '#ef4444', yellow: '#eab308', green: '#22c55e', blue: '#3b82f6' };
                                    return (
                                        <React.Fragment key={color}>
                                            <div
                                                className={`absolute -left-[14px] w-4 h-6 rounded-l-md border-y-[2px] border-l-[2px] transition-colors cursor-pointer flex items-center justify-center z-10 md:z-10 bg-slate-800 border-slate-700 hover:bg-slate-600 shadow-[-2px_0_5px_rgba(0,0,0,0.5)]`}
                                                style={{ top, transform: 'translateY(-50%)' }}
                                                onClick={() => !isConn && handleConnect(color)}
                                                title={isConn ? "" : "Click to connect (or drag cable on Desktop)"}
                                            >
                                                <div ref={el => portsRef.current[color] = el} className="w-[6px] h-[10px] bg-black rounded-[1px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] relative overflow-hidden flex items-center justify-center">
                                                    {isConn && <div className="w-full h-full opacity-80" style={{ backgroundColor: hexes[color] }}></div>}
                                                    {!isConn && <div className="absolute top-1/2 left-0 w-full h-[1px] bg-zinc-700"></div>}
                                                </div>
                                            </div>

                                            <DraggableCable
                                                color={color}
                                                startY={top}
                                                portY={top}
                                                isConnected={isConn}
                                                onConnect={handleConnect}
                                                onDisconnect={handleDisconnect}
                                                portsRef={portsRef}
                                            />
                                        </React.Fragment>
                                    );
                                })}

                                {/* Top nub */}
                                <div className="absolute -top-3 left-10 h-[14px] w-28 rounded-full hidden md:block"
                                    style={{ background: 'linear-gradient(180deg, #e5e7eb, #c8cdd5)', border: '1px solid #9ca3af', boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.8)' }}
                                ></div>
                                {/* Bottom nub */}
                                <div className="absolute -bottom-3 right-14 h-[14px] w-24 rounded-full hidden md:block"
                                    style={{ background: 'linear-gradient(180deg, #e5e7eb, #c8cdd5)', border: '1px solid #9ca3af', boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.8)' }}
                                ></div>

                                {/* Screen Bezel */}
                                <div className="rounded-[18px] p-3"
                                    style={{
                                        background: '#475569',
                                        boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.55), 0 2px 0 rgba(255,255,255,0.5)'
                                    }}
                                >
                                    {/* Power LED */}
                                    <div className="flex items-center gap-1.5 mb-2 ml-1">
                                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.9)]"></div>
                                    </div>

                                    {/* Screen */}
                                    <div className="relative w-full rounded-lg overflow-hidden flex items-center justify-center p-2"
                                        style={{
                                            aspectRatio: isMobile ? '4 / 4.85' : '4 / 4.45',
                                            background: '#0a0a0a',
                                            border: '4px solid #1e293b',
                                            boxShadow: 'inset 0 0 24px rgba(0,0,0,0.85)'
                                        }}
                                    >
                                        {!isBooting && !showImage && !showHome && (
                                            <div className="flex flex-col items-center justify-center opacity-40">
                                                <div className="text-white/30 font-black text-2xl uppercase tracking-[0.2em] animate-pulse">NO SIGNAL</div>
                                                <div className="text-white/20 text-[8px] font-bold mt-2 uppercase tracking-widest hidden md:block">Connect 4 Cables</div>
                                                <div className="mt-3 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-center text-[8px] font-black uppercase tracking-[0.22em] text-sky-100/80 md:hidden">
                                                    Tap 4 port warna di kiri
                                                </div>
                                            </div>
                                        )}

                                        {isBooting && <PanzekOSSplash />}

                                        {showImage && <PanzekCLI />}

                                        {showHome && (
                                            <Suspense fallback={<EmbeddedScreenFallback />}>
                                                <PanzekHome onNavigate={(path) => navigateWithCleanup(path)} />
                                            </Suspense>
                                        )}

                                        {/* Glare overlay */}
                                        <div className="absolute inset-0 pointer-events-none z-20"
                                            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)' }}
                                        ></div>
                                        {/* HUD labels */}
                                        <div className="absolute bottom-2 left-3 right-3 flex justify-between text-[9px] font-black uppercase tracking-[0.3em] z-20"
                                            style={{ color: (showImage || showHome) ? 'rgba(167, 243, 208, 0.9)' : 'rgba(255,255,255,0.3)' }}
                                        >
                                            <span>{(showImage || showHome) ? 'IMG_01' : 'INPUT'}</span>
                                            <span>{showHome ? 'HOME' : showImage ? 'OK' : gameboyStatus === 'READY' ? 'WAITING' : gameboyStatus}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: Info Card — slides out from Gameboy */}
                            <div className="relative w-full max-w-[400px] md:max-w-none md:w-[480px] flex-shrink-0 z-10 md:-ml-5 mt-6 md:mt-0 md:self-stretch flex flex-col"
                                style={{
                                    background: 'linear-gradient(145deg, #e5e7eb 0%, #d1d5db 40%, #c8cdd5 100%)',
                                    borderRadius: '28px',
                                    borderTopLeftRadius: isMobile ? '28px' : '0',
                                    borderBottomLeftRadius: isMobile ? '28px' : '0',
                                    padding: '20px 20px 20px 28px',
                                    border: '2px solid #fff',
                                    borderBottom: '8px solid #9ca3af',
                                    borderRight: '8px solid #9ca3af',
                                    borderLeft: isMobile ? '2px solid #fff' : '0',
                                    boxShadow: '6px 6px 0 rgba(0,0,0,0.10)'
                                }}
                            >
                                {/* Decorative Right Cables escaping the Info Card */}
                                <RightCable color="red" top="25%" />
                                <RightCable color="yellow" top="45%" />
                                <RightCable color="green" top="65%" />
                                <RightCable color="blue" top="85%" />

                                {/* Inner white info panel */}
                                <div className="flex-1 flex flex-col justify-center rounded-[18px] overflow-hidden p-7 md:p-10"
                                    style={{
                                        background: '#f8fafc',
                                        border: '5px solid #cbd5e1',
                                        boxShadow: 'inset 4px 4px 12px rgba(0,0,0,0.08), 0 2px 0 white'
                                    }}
                                >
                                    {/* Label */}
                                    <p className="text-[10px] font-black uppercase tracking-[0.55em] text-slate-500 mb-4">TENTANG SAYA</p>

                                    {/* Name */}
                                    <div className="mb-6">
                                        {/* KEVIN */}
                                        <div className="flex items-center gap-[2px] mb-1"
                                            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                        >
                                            <span style={{ color: '#ef4444', textShadow: '0 3px 0 #b91c1c, 0 6px 8px rgba(0,0,0,0.2)' }}>K</span>
                                            <span style={{ color: '#eab308', textShadow: '0 3px 0 #a16207, 0 6px 8px rgba(0,0,0,0.2)' }}>E</span>
                                            <span style={{ color: '#22c55e', textShadow: '0 3px 0 #15803d, 0 6px 8px rgba(0,0,0,0.2)' }}>V</span>
                                            <span style={{ color: '#3b82f6', textShadow: '0 3px 0 #1d4ed8, 0 6px 8px rgba(0,0,0,0.2)' }}>I</span>
                                            <span style={{ color: '#f97316', textShadow: '0 3px 0 #c2410c, 0 6px 8px rgba(0,0,0,0.2)' }}>N</span>
                                        </div>
                                        {/* HERMANSYAH */}
                                        <div style={{
                                            fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                                            fontWeight: 900,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em',
                                            color: 'white',
                                            textShadow: '0 2px 0 #7dd3fc, 0 4px 0 #38bdf8, 0 7px 0 #0284c7, 0 10px 12px rgba(0,0,0,0.3)'
                                        }}>
                                            HERMANSYAH
                                        </div>
                                    </div>

                                    {/* Info Items */}
                                    <ul className="flex flex-col gap-4">
                                        <li className="flex items-center gap-4">
                                            <img src="https://img.icons8.com/3d-fluency/94/marker.png" alt="Location" className="w-9 h-9 drop-shadow flex-shrink-0" loading="lazy" />
                                            <span className="font-bold text-slate-700 text-sm leading-snug">Samarinda, Indonesia</span>
                                        </li>
                                        <li className="flex items-center gap-4">
                                            <img src="https://img.icons8.com/3d-fluency/94/goal.png" alt="Focus" className="w-9 h-9 drop-shadow flex-shrink-0" loading="lazy" />
                                            <span className="font-bold text-slate-700 text-sm leading-snug">Web Development &amp; 3D Interaksi</span>
                                        </li>
                                        <li className="flex items-center gap-4">
                                            <img src="https://img.icons8.com/3d-fluency/94/graduation-cap.png" alt="Education" className="w-9 h-9 drop-shadow flex-shrink-0" loading="lazy" />
                                            <span className="font-bold text-slate-700 text-sm leading-snug">SMKTI Airlangga<br />B.S. in Computer Science</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                {/* NEW ARRIVALS PREVIEW (3D Cartridge Shelf) */}
                <Suspense fallback={<FeaturedProjectsFallback />}>
                    <FeaturedProjects repos={repos} />
                </Suspense>

                {/* CALL TO ACTION BANNER */}
                <div className="w-full relative py-32 mt-24 mb-32 flex items-center justify-center pointer-events-none">
                    <style>{`
                        @keyframes toy-float { 0%,100% { transform: translate3d(0,0,0) rotate(0deg); } 50% { transform: translate3d(0,-6px,0) rotate(1.5deg); } }
                        @keyframes toy-bounce { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-8px) rotate(2deg); } }
                        @keyframes toy-pop { 0%,100% { transform: scale(1) rotate(0deg); } 50% { transform: scale(1.06) rotate(-1deg); } }
                    `}</style>

                    <div className="absolute left-1/2 top-1/2 h-[clamp(18rem,34vw,24rem)] w-full -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none">
                        <svg className="absolute top-0 left-1/2 -translate-x-[100%] w-[50vw] h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                            {CTA_LEFT_CABLES.map((cable) => (
                                <g key={cable.id}>
                                    <path d={cable.path} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="3.2" strokeLinecap="round" transform="translate(0,3)" filter="blur(2.5px)" />
                                    <path d={cable.path} fill="none" stroke={cable.shadow} strokeWidth="2.85" strokeLinecap="round" transform="translate(0,1)" />
                                    <path d={cable.path} fill="none" stroke={cable.color} strokeWidth="2.45" strokeLinecap="round" />
                                    <path d={cable.path} fill="none" stroke={cable.highlight} strokeWidth="0.75" strokeLinecap="round" transform="translate(0,-0.55)" opacity="0.72" />
                                </g>
                            ))}
                        </svg>

                        <svg className="absolute top-0 left-1/2 w-[50vw] h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                            {CTA_RIGHT_CABLES.map((cable) => (
                                <g key={cable.id}>
                                    <path d={cable.path} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="3.2" strokeLinecap="round" transform="translate(0,3)" filter="blur(2.5px)" />
                                    <path d={cable.path} fill="none" stroke={cable.shadow} strokeWidth="2.85" strokeLinecap="round" transform="translate(0,1)" />
                                    <path d={cable.path} fill="none" stroke={cable.color} strokeWidth="2.45" strokeLinecap="round" />
                                    <path d={cable.path} fill="none" stroke={cable.highlight} strokeWidth="0.75" strokeLinecap="round" transform="translate(0,-0.55)" opacity="0.72" />
                                </g>
                            ))}
                        </svg>
                    </div>

                    <div className="absolute inset-0 pointer-events-none z-0">
                        <div className="absolute left-[6%] top-[18%] w-3 h-3 rounded-full bg-[#facc15] shadow-[0_3px_6px_rgba(0,0,0,0.2)] motion-safe:animate-[toy-float_5s_ease-in-out_infinite]" />
                        <div className="absolute left-[14%] top-[65%] w-2.5 h-2.5 rounded-[4px] bg-[#34d399] rotate-12 shadow-[0_3px_6px_rgba(0,0,0,0.2)] motion-safe:animate-[toy-float_4.6s_ease-in-out_infinite]" />
                        <div className="absolute right-[10%] top-[22%] w-3.5 h-3.5 rounded-full bg-[#f472b6] shadow-[0_3px_6px_rgba(0,0,0,0.2)] motion-safe:animate-[toy-float_5.4s_ease-in-out_infinite]" />
                        <div className="absolute right-[16%] bottom-[20%] w-2.5 h-2.5 bg-[#60a5fa] rotate-45 shadow-[0_3px_6px_rgba(0,0,0,0.2)] motion-safe:animate-[toy-float_4.2s_ease-in-out_infinite]" />
                        <div className="absolute left-[35%] top-[12%] w-2 h-2 rounded-full bg-[#fb7185] shadow-[0_2px_4px_rgba(0,0,0,0.2)] motion-safe:animate-[toy-float_4.8s_ease-in-out_infinite]" />
                        <div className="absolute right-[32%] bottom-[12%] w-2 h-2 rounded-full bg-[#a78bfa] shadow-[0_2px_4px_rgba(0,0,0,0.2)] motion-safe:animate-[toy-float_4.9s_ease-in-out_infinite]" />
                    </div>

                    <div className="absolute inset-0 pointer-events-none z-20">
                        <div className="absolute left-[4%] top-[16%] hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fef3c7] border-2 border-[#fbbf24] text-[#92400e] text-[10px] font-black tracking-[0.2em] shadow-[0_6px_0_#f59e0b,0_10px_20px_rgba(0,0,0,0.2)] rotate-[-6deg] motion-safe:animate-[toy-pop_3.6s_ease-in-out_infinite]">
                            READY TO PLAY
                        </div>
                        <div className="absolute right-[6%] top-[12%] hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e0f2fe] border-2 border-[#38bdf8] text-[#075985] text-[10px] font-black tracking-[0.2em] shadow-[0_6px_0_#0ea5e9,0_10px_20px_rgba(0,0,0,0.2)] rotate-[5deg] motion-safe:animate-[toy-pop_4s_ease-in-out_infinite]">
                            FAST DELIVERY
                        </div>
                        <div className="absolute left-[10%] bottom-[12%] hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#dcfce7] border-2 border-[#22c55e] text-[#166534] text-[10px] font-black tracking-[0.2em] shadow-[0_6px_0_#16a34a,0_10px_20px_rgba(0,0,0,0.2)] rotate-[4deg] motion-safe:animate-[toy-bounce_3.2s_ease-in-out_infinite]">
                            SLOTS 2 LEFT
                        </div>
                    </div>

                    {/* Main Panel Box - Increased Shadow for Ambient Occlusion */}
                    <div className="relative w-full max-w-[650px] bg-[#f8fafc] rounded-[2rem] md:rounded-[2.5rem] border-[3px] md:border-[4px] border-white z-10 pointer-events-auto mx-6 md:mx-auto"
                        style={{
                            // Deep ambient occlusion and soft inset rim light
                            boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.9), inset 0 -5px 10px rgba(0,0,0,0.05), 0 40px 80px -20px rgba(0,0,0,0.35), 0 20px 40px -10px rgba(0,0,0,0.2)'
                        }}>
                        <div className="absolute left-1/2 top-[-10px] h-[14px] w-26 -translate-x-1/2 rounded-full border border-slate-300 bg-[linear-gradient(180deg,#eef2f7_0%,#cdd6e1_100%)] shadow-[0_2px_0_rgba(255,255,255,0.7)]" />

                        {[
                            'left-4 top-4 rotate-45',
                            'right-4 top-4 rotate-[110deg]',
                            'left-4 bottom-4 rotate-12',
                            'right-4 bottom-4 -rotate-[30deg]',
                        ].map((positionClass) => (
                            <div
                                key={positionClass}
                                className={`absolute h-3 w-3 rounded-full bg-[linear-gradient(180deg,#dbe3ee_0%,#94a3b8_100%)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-2px_3px_rgba(0,0,0,0.3)] ${positionClass}`}
                            >
                                <div className="flex h-full w-full items-center justify-center rounded-full border border-slate-600/70">
                                    <div className="h-[1.5px] w-[60%] bg-slate-700/85 shadow-[0_1px_0_rgba(255,255,255,0.25)]" />
                                </div>
                            </div>
                        ))}

                        {/* Left Cylinder Connectors */}
                        <div className="absolute left-[-16px] md:left-[-18px] top-1/2 -translate-y-1/2 flex flex-col gap-8 md:gap-11">
                            {/* Connector 1 */}
                            <div className="w-[16px] md:w-[18px] h-[14px] bg-slate-200 rounded-l-[4px] border-[1px] border-slate-300 shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),-2px_2px_4px_rgba(0,0,0,0.2)] z-0 relative">
                                <div className="absolute right-[-2px] inset-y-0 w-[4px] bg-slate-300 blur-[1px]"></div>
                            </div>
                            {/* Connector 2 */}
                            <div className="w-[16px] md:w-[18px] h-[14px] bg-slate-200 rounded-l-[4px] border-[1px] border-slate-300 shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),-2px_2px_4px_rgba(0,0,0,0.2)] z-0 relative">
                                <div className="absolute right-[-2px] inset-y-0 w-[4px] bg-slate-300 blur-[1px]"></div>
                            </div>
                            {/* Connector 3 */}
                            <div className="w-[16px] md:w-[18px] h-[14px] bg-slate-200 rounded-l-[4px] border-[1px] border-slate-300 shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),-2px_2px_4px_rgba(0,0,0,0.2)] z-0 relative">
                                <div className="absolute right-[-2px] inset-y-0 w-[4px] bg-slate-300 blur-[1px]"></div>
                            </div>
                        </div>

                        {/* Right Cylinder Connectors */}
                        <div className="absolute right-[-16px] md:right-[-18px] top-1/2 -translate-y-1/2 flex flex-col gap-8 md:gap-11">
                            {/* Connector 1 */}
                            <div className="w-[16px] md:w-[18px] h-[14px] bg-slate-200 rounded-r-[4px] border-[1px] border-slate-300 shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),2px_2px_4px_rgba(0,0,0,0.2)] z-0 relative">
                                <div className="absolute left-[-2px] inset-y-0 w-[4px] bg-slate-300 blur-[1px]"></div>
                            </div>
                            {/* Connector 2 */}
                            <div className="w-[16px] md:w-[18px] h-[14px] bg-slate-200 rounded-r-[4px] border-[1px] border-slate-300 shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),2px_2px_4px_rgba(0,0,0,0.2)] z-0 relative">
                                <div className="absolute left-[-2px] inset-y-0 w-[4px] bg-slate-300 blur-[1px]"></div>
                            </div>
                            {/* Connector 3 */}
                            <div className="w-[16px] md:w-[18px] h-[14px] bg-slate-200 rounded-r-[4px] border-[1px] border-slate-300 shadow-[inset_0_2px_3px_rgba(255,255,255,0.9),2px_2px_4px_rgba(0,0,0,0.2)] z-0 relative">
                                <div className="absolute left-[-2px] inset-y-0 w-[4px] bg-slate-300 blur-[1px]"></div>
                            </div>
                        </div>

                        {/* Top Indicator Bulbs */}
                        <div className="flex gap-3 justify-start ml-10 pt-4 pb-1">
                            {/* Pink/Red Bulb */}
                            <div className="w-3.5 h-3.5 rounded-full bg-rose-400 shadow-[inset_-1px_-2px_4px_rgba(0,0,0,0.3),inset_1px_2px_4px_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.2)]"></div>
                            {/* Yellow Bulb */}
                            <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 shadow-[inset_-1px_-2px_4px_rgba(0,0,0,0.3),inset_1px_2px_4px_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.2)]"></div>
                            {/* Cyan Bulb */}
                            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[inset_-1px_-2px_4px_rgba(0,0,0,0.3),inset_1px_2px_4px_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.2)]"></div>
                        </div>

                        {/* Inner Recessed Screen - Deeper Inset Shadow */}
                        <div className="m-3 mt-1 md:m-4 md:mt-1 bg-[#f1f5f9] rounded-[1.5rem] border-[1px] border-slate-200 relative overflow-hidden"
                            style={{
                                boxShadow: 'inset 0 8px 20px rgba(0,0,0,0.08), inset 0 2px 6px rgba(0,0,0,0.04), 0 2px 0 rgba(255,255,255,0.9)'
                            }}>
                            <div className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/75 px-3 py-1 text-[9px] font-black uppercase tracking-[0.28em] text-slate-500 shadow-[0_4px_10px_rgba(15,23,42,0.06)]">
                                Creator Dock
                            </div>
                            <div className="absolute right-5 top-5 z-20 hidden sm:flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#4ade80]" />
                                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-400">ONLINE</span>
                            </div>

                            {/* Red Liquid Fill Background - Refined for premium look */}
                            <div className="absolute inset-x-0 bottom-0 h-full z-0 pointer-events-none flex flex-col justify-end">
                                <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-red-600 to-red-500 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]" />
                                {/* Wave Background Layer - Darker for depth */}
                                <motion.div
                                    animate={{ x: ['-50%', '0%'] }}
                                    transition={{ repeat: Infinity, ease: 'linear', duration: 4.5 }}
                                    className="absolute bottom-[60%] left-0 w-[200%] h-[35px] pointer-events-none text-red-700/40"
                                >
                                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-[-1px] w-[50%] h-[35px] left-0 fill-current block">
                                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.42,126.8,193.28,116.4Z" />
                                    </svg>
                                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-[-1px] w-[50%] h-[35px] left-[50%] fill-current block">
                                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.42,126.8,193.28,116.4Z" />
                                    </svg>
                                </motion.div>
                                {/* Wave Foreground Layer - Lighter/Vibrant */}
                                <motion.div
                                    animate={{ x: ['0%', '-50%'] }}
                                    transition={{ repeat: Infinity, ease: 'linear', duration: 3.2 }}
                                    className="absolute bottom-[60%] left-0 w-[200%] h-[24px] pointer-events-none text-red-500"
                                >
                                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-[-1px] w-[50%] h-[24px] left-0 fill-current block">
                                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.42,126.8,193.28,116.4Z" />
                                    </svg>
                                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-[-1px] w-[50%] h-[24px] left-[50%] fill-current block">
                                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.42,126.8,193.28,116.4Z" />
                                    </svg>
                                </motion.div>
                                {/* Bubbles - Organic movement */}
                                <motion.div animate={{ y: ['0%', '-500%'], x: [0, 8, -4, 0], opacity: [0, 0.6, 0] }} transition={{ repeat: Infinity, ease: 'linear', duration: 3 }} className="absolute left-[25%] bottom-[10%] w-2.5 h-2.5 bg-white/40 blur-[1px] rounded-full" />
                                <motion.div animate={{ y: ['0%', '-400%'], x: [0, -12, 8, 0], opacity: [0, 0.7, 0] }} transition={{ repeat: Infinity, ease: 'linear', duration: 4.5, delay: 1 }} className="absolute left-[55%] bottom-[15%] w-3.5 h-3.5 bg-white/30 blur-[1px] rounded-full" />
                                <motion.div animate={{ y: ['0%', '-600%'], x: [0, 4, -8, 0], opacity: [0, 0.5, 0] }} transition={{ repeat: Infinity, ease: 'linear', duration: 4, delay: 2.5 }} className="absolute w-1.5 h-1.5 left-[75%] bottom-[5%] bg-white/50 blur-[0.5px] rounded-full" />
                            </div>

                            <div className="p-8 pb-12 md:p-12 md:pb-16 flex flex-col items-center justify-center text-center relative z-10">
                                {/* Title - Adjusted Typography to match reference */}
                                <h3 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight drop-shadow-md flex flex-col items-center gap-1" style={{ lineHeight: 1.1 }}>
                                    <span>Ready to</span>
                                    <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">Collaborate?</span>
                                </h3>
                                {/* Subtitle - Fixed typo and improved readability */}
                                <p className="text-slate-100 font-bold text-sm md:text-base leading-relaxed max-w-sm drop-shadow-md px-2 mt-2">
                                    Available for freelance projects and full-<br />time opportunities. Let's create something<br />extraordinary!
                                </p>

                                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                                    <span className="rounded-full border border-white/60 bg-white/16 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                                        UI Systems
                                    </span>
                                    <span className="rounded-full border border-white/60 bg-white/16 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                                        Frontend
                                    </span>
                                    <span className="rounded-full border border-white/60 bg-white/16 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                                        Illustration
                                    </span>
                                </div>
                            </div>

                            {/* Inner Screen Corner Accent (Top Right) */}
                            <div className="absolute top-4 right-4 w-3 h-2 bg-slate-300 rounded-[1px] shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)] opacity-80 z-10"></div>

                            {/* Inner Screen Dots (Bottom Right) */}
                            <div className="absolute bottom-5 right-5 flex gap-[3px] opacity-70 z-10">
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-[1px] shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)]"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-[1px] shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)]"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-[1px] shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)]"></div>
                                <div className="w-1.5 h-1.5 bg-slate-400 rounded-[1px] shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)]"></div>
                            </div>
                        </div>

                        {/* Floating Button Overlapping Inner and Outer Box - Centered Position */}
                        <div className="absolute bottom-[-18px] md:bottom-[-22px] left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-[190px] h-[20px] bg-[#e2e8f0] rounded-full border border-white shadow-[inset_0_3px_6px_rgba(255,255,255,0.9),0_8px_20px_rgba(0,0,0,0.2)]" />
                                <div className="absolute left-1/2 -translate-x-1/2 top-2 w-[140px] h-[6px] bg-[#cbd5e1] rounded-full shadow-[inset_0_2px_3px_rgba(0,0,0,0.15)]" />
                                <PlasticButton color="yellow" className="relative z-10 text-xs md:text-[13px] px-6 py-2 md:px-8 md:py-2.5 shadow-xl hover:translate-y-[2px] w-max" onClick={() => navigateWithCleanup('/contact')}
                                    style={{
                                        border: '2px solid #eab308',
                                        borderRadius: '10px',
                                        fontWeight: 900,
                                        color: '#78350f',
                                        background: 'linear-gradient(to bottom, #fde047, #facc15)',
                                        boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.8), 0 8px 15px rgba(0,0,0,0.25), 0 5px 0 #ca8a04',
                                        letterSpacing: '0.05em'
                                    }}>
                                    GET IN TOUCH
                                </PlasticButton>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
};

export default LandingPage;
