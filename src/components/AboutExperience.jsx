import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useReducedMotion } from 'framer-motion';
import OverlayUI from './OverlayUI';
import RoomTour from './RoomTour';
import PlasticButton from '../../resources/js/UI/PlasticButton';
import { navigateWithCleanup } from '../../resources/js/lib/pageTransitionCleanup';

const CAREER_SPOT = 0.35;
const PROFILE_SPOT = 0.75;
const ARRIVAL_PROGRESS = -0.18;
const CAMERA_STEP = 0.16;
const SPOT_PROGRESS = {
    wide: 0,
    career: CAREER_SPOT,
    profile: PROFILE_SPOT,
};


const clamp01 = (value) => {
    if (!Number.isFinite(value)) {
        return 0;
    }

    return Math.max(0, Math.min(1, value));
};

const clampTourProgress = (value) => {
    if (!Number.isFinite(value)) {
        return ARRIVAL_PROGRESS;
    }

    return Math.max(ARRIVAL_PROGRESS, Math.min(1, value));
};

const INTRO_FALL_CUTOFF = 0.65;
const INTRO_FALL_DURATION = 1.6;
const INTRO_LAND_DURATION = 1.0;

const CloudGateOverlay = ({ phase, cloudOpacity, hazeOpacity, transitionProgress, roomReady, onStart, startDisabled, isTouchOptimized }) => {
    const inIntro = phase === 'intro';
    const inTransition = phase === 'transition';

    if (!inIntro && !inTransition) {
        return null;
    }

    const cloudLayerOpacity = inIntro ? 1 : clamp01(cloudOpacity);
    const hazeLayerOpacity = inIntro ? 0.18 : clamp01(hazeOpacity);
    const fallProgress = inTransition ? clamp01(transitionProgress) : 0;
    const noiseOpacity = inIntro ? 0.3 : (0.22 + fallProgress * 0.62) * cloudLayerOpacity;
    const windOpacity = inTransition ? clamp01(fallProgress * 1.35) * 0.4 : 0;
    const bridgeGlowOpacity = inTransition
        ? clamp01(Math.sin(clamp01((fallProgress - 0.18) / 0.64) * Math.PI)) * 0.75
        : 0;
    const revealWindowOpacity = inTransition ? clamp01((fallProgress - 0.52) / 0.36) * 0.42 : 0;
    const cloudLayers = isTouchOptimized
        ? [{
            key: 'left',
            className: 'top-[10%] left-[-10%] h-[24rem] w-[24rem]',
            color: 'rgba(255,255,255,0.34)',
            speed: 14,
            drift: -7,
            blur: 12,
        }, {
            key: 'right',
            className: 'top-[18%] right-[-8%] h-[20rem] w-[20rem]',
            color: 'rgba(239,246,255,0.38)',
            speed: 11,
            drift: 6,
            blur: 10,
        }]
        : [{
            key: 'left',
            className: 'top-[8%] left-[-12%] h-[38rem] w-[38rem]',
            color: 'rgba(255,255,255,0.52)',
            speed: 24,
            drift: -12,
            blur: 22,
        }, {
            key: 'right',
            className: 'top-[14%] right-[-10%] h-[30rem] w-[30rem]',
            color: 'rgba(239,246,255,0.62)',
            speed: 18,
            drift: 10,
            blur: 18,
        }, {
            key: 'bottom',
            className: 'bottom-[-22%] left-[16%] h-[28rem] w-[42rem]',
            color: 'rgba(224,242,254,0.48)',
            speed: 30,
            drift: -18,
            blur: 24,
        }];
    const effectiveNoiseOpacity = isTouchOptimized ? noiseOpacity * 0.45 : noiseOpacity;
    const effectiveWindOpacity = isTouchOptimized ? windOpacity * 0.42 : windOpacity;
    const effectiveHazeOpacity = isTouchOptimized ? hazeLayerOpacity * 0.72 : hazeLayerOpacity;
    const effectiveBridgeGlowOpacity = isTouchOptimized ? bridgeGlowOpacity * 0.5 : bridgeGlowOpacity;
    const effectiveRevealWindowOpacity = isTouchOptimized ? revealWindowOpacity * 0.65 : revealWindowOpacity;

    return (
        <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden bg-[#8ec5ff]">
            {/* Sky Background */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(180deg, #4da4f7 0%, #8ec5ff 40%, #c4e1ff 100%)',
                }}
            />

            {/* Sun/Glow */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at 20% 10%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0) 60%)',
                }}
            />

            <div
                className="absolute inset-0"
                style={{
                    opacity: effectiveBridgeGlowOpacity,
                    background: 'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.78) 22%, rgba(229,240,252,0.28) 55%, rgba(229,240,252,0) 100%)',
                }}
            />

            <div
                className="absolute inset-0"
                style={{
                    opacity: inTransition ? clamp01(fallProgress * 0.6) : 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, rgba(120,168,206,0.2) 60%, rgba(66,110,152,0.4) 100%)',
                }}
            />

            {cloudLayers.map((layer) => (
                <div
                    key={layer.key}
                    className={`absolute rounded-full ${layer.className}`}
                    style={{
                        opacity: clamp01((inIntro ? 0.58 : 0.4 + fallProgress * 0.28) * cloudLayerOpacity),
                        background: `radial-gradient(circle at 50% 50%, ${layer.color} 0%, rgba(255,255,255,0.18) 42%, rgba(255,255,255,0) 76%)`,
                        filter: `blur(${layer.blur}px)`,
                        transform: `translate3d(${inTransition ? layer.drift * fallProgress : 0}%, ${inTransition ? -layer.speed * fallProgress : 0}%, 0) scale(${1 + (inTransition ? fallProgress * 0.35 : 0)})`,
                    }}
                />
            ))}

            {/* SVG Base Definitions solely for fractalNoise mist */}
            <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
                <defs>
                    <filter id="vapor-noise-front" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="4" seed="1" />
                        <feColorMatrix type="matrix" values="1 0 0 0 1  0 1 0 0 1  0 0 1 0 1  0 0 0 3 -1.2" />
                    </filter>
                    <filter id="vapor-noise-back" x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="2" />
                        <feColorMatrix type="matrix" values="1 0 0 0 1  0 1 0 0 1  0 0 1 0 1  0 0 0 2 -0.8" />
                    </filter>
                </defs>
            </svg>

            {/* Back Vapor Layer - Moves slowly up */}
            <div
                className="absolute inset-0 mix-blend-overlay"
                style={{
                    opacity: cloudLayerOpacity * (inTransition ? Math.min(1, 0.6 + fallProgress * 0.4) : 0.8),
                    filter: 'url(#vapor-noise-back)',
                    transform: `translate3d(0, ${inTransition ? -fallProgress * (isTouchOptimized ? 30 : 60) : 0}%, 0) scale(${1 + fallProgress * (isTouchOptimized ? 0.24 : 0.5)})`,
                    transformOrigin: '50% 50%',
                    height: isTouchOptimized ? '180%' : '240%',
                    top: isTouchOptimized ? '-8%' : '-20%',
                }}
            />

            {/* Front Vapor Layer - Rushes past the camera heavily */}
            <div
                className="absolute inset-0 mix-blend-screen"
                style={{
                    opacity: cloudLayerOpacity * (inTransition ? clamp01(fallProgress * (isTouchOptimized ? 1.15 : 2.0)) : 0),
                    filter: 'url(#vapor-noise-front)',
                    transform: `translate3d(0, ${inTransition ? -fallProgress * (isTouchOptimized ? 74 : 150) : 0}%, 0) scale(${1 + fallProgress * (isTouchOptimized ? 0.58 : 1.5)})`,
                    transformOrigin: '50% 50%',
                    height: isTouchOptimized ? '230%' : '350%',
                    top: isTouchOptimized ? '-35%' : '-50%',
                }}
            />

            {/* Rush Blur Layer - Replaces the discrete lines with uniform vertical motion blur */}
            <div
                className="absolute inset-0 mix-blend-screen"
                style={{
                    opacity: effectiveWindOpacity * 0.8 * cloudLayerOpacity,
                    filter: `url(#vapor-noise-back) blur(${isTouchOptimized ? 7 : 12}px)`,
                    transform: `translate3d(0, ${inTransition ? -fallProgress * (isTouchOptimized ? 120 : 300) : 0}%, 0) scaleY(${isTouchOptimized ? 2.4 : 4.0}) scaleX(${isTouchOptimized ? 1.15 : 1.5})`,
                    transformOrigin: '50% 50%',
                    height: isTouchOptimized ? '260%' : '500%',
                    top: isTouchOptimized ? '-70%' : '-150%',
                }}
            />

            <div
                className="absolute inset-0"
                style={{
                    opacity: effectiveHazeOpacity,
                    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(235,245,255,0.9) 50%, rgba(190,215,240,0.8) 100%)',
                }}
            />

            <div
                className="absolute inset-0"
                style={{
                    opacity: effectiveRevealWindowOpacity,
                    background: 'radial-gradient(circle at 52% 62%, rgba(146,168,196,0) 0%, rgba(146,168,196,0) 18%, rgba(177,198,221,0.18) 34%, rgba(225,237,249,0.55) 100%)',
                }}
            />

            <div
                className="absolute inset-0"
                style={{
                    opacity: effectiveNoiseOpacity,
                    backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.7) 0 1px, transparent 1.5px), radial-gradient(circle at 70% 38%, rgba(255,255,255,0.45) 0 1px, transparent 1.5px), radial-gradient(circle at 42% 72%, rgba(255,255,255,0.35) 0 1px, transparent 1.5px)',
                    backgroundSize: isTouchOptimized ? '240px 240px, 280px 280px, 320px 320px' : '180px 180px, 220px 220px, 260px 260px',
                    transform: `translate3d(0, ${inTransition ? -fallProgress * (isTouchOptimized ? 16 : 40) : 0}%, 0)`,
                }}
            />

            {inIntro && (
                <div className="pointer-events-none absolute inset-x-0 top-[18%] z-50 flex justify-center px-6">
                    <div className="w-full max-w-md rounded-[30px] border border-white/40 bg-white/14 px-5 py-5 text-center text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-md">
                        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/55 bg-white/40 px-3 py-1 text-[10px] font-black uppercase tracking-[0.34em] text-slate-900/70">
                            Workspace Gate
                            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.55)]" />
                        </div>
                        <p className="mt-4 text-2xl font-black uppercase tracking-[0.18em] text-slate-950 sm:text-[2rem]">
                            Sky Route
                        </p>
                        <p className="mt-2 text-sm font-medium leading-relaxed text-slate-900/78 sm:text-[15px]">
                            Jalur masuk ke workspace dengan transisi descent yang ringan dan tetap imersif.
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.28em] text-slate-900/55 sm:text-[11px]">
                            <span>Cloud</span>
                            <span className="h-px w-8 bg-slate-900/20" />
                            <span>Gate</span>
                            <span className="h-px w-8 bg-slate-900/20" />
                            <span>Workspace</span>
                        </div>
                    </div>
                </div>
            )}

            {inIntro && (
                <div className="pointer-events-auto absolute inset-x-0 bottom-8 z-50 flex justify-center px-6">
                    <div className="flex w-full max-w-xl flex-col items-stretch justify-between gap-4 rounded-[32px] border border-white/35 bg-white/14 px-5 py-4 text-black shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl sm:flex-row sm:items-center">
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.38em] text-black/70">About descent</p>
                            <p className="mt-1 text-sm font-medium leading-snug text-black">
                                Turun dari langit, menembus kabut, lalu masuk ke workspace.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-3">
                            <PlasticButton
                                color="blue"
                                onClick={() => {
                                    navigateWithCleanup('/');
                                }}
                                className="px-6 py-3"
                            >
                                Home
                            </PlasticButton>
                            <PlasticButton
                                color="red"
                                onClick={onStart}
                                disabled={startDisabled}
                                className="px-6 py-3"
                            >
                                Start
                            </PlasticButton>
                        </div>
                    </div>
                </div>
            )}

            {inTransition && (
                <div className="absolute bottom-12 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-3 transition-opacity duration-500">
                    <div className="relative w-10 h-10 flex items-center justify-center drop-shadow-md">
                        <div className="absolute inset-0 border-[3px] border-white/30 rounded-full"></div>
                        <div className="absolute inset-0 border-[3px] border-transparent border-t-white rounded-full animate-spin"></div>
                    </div>
                    <div className="rounded-full border border-white/20 bg-black/20 px-4 py-1.5 text-[11px] font-bold tracking-widest text-white backdrop-blur shadow-xl uppercase">
                        {roomReady ? 'Crossing the cloud gate' : 'Loading room'}
                    </div>
                </div>
            )}
        </div>
    );
};



const AboutExperience = ({ careerItems, debug = false }) => {
    const prefersReducedMotion = useReducedMotion();
    const calibrationMode = useMemo(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get('calibrate') === '1';
    }, []);

    const [phase, setPhase] = useState(calibrationMode ? 'tour' : 'intro');
    const [targetProgress, setTargetProgress] = useState(0);
    const [smoothedProgress, setSmoothedProgress] = useState(0);
    const [transitionProgress, setTransitionProgress] = useState(0);
    const [roomRevealOpacity, setRoomRevealOpacity] = useState(calibrationMode ? 1 : 0);
    const [transitionShake, setTransitionShake] = useState(0);
    const [depthCueProgress, setDepthCueProgress] = useState(0);
    const [cloudOpacity, setCloudOpacity] = useState(calibrationMode ? 0 : 1);
    const [hazeOpacity, setHazeOpacity] = useState(calibrationMode ? 0 : 0.18);
    const [roomReady, setRoomReady] = useState(false);
    const [waitingForRoom, setWaitingForRoom] = useState(false);
    const [worldLoadT, setWorldLoadT] = useState(0);
    const [isWorldLoading, setIsWorldLoading] = useState(false);
    const [careerDismissed, setCareerDismissed] = useState(false);
    const [profileDismissed, setProfileDismissed] = useState(false);
    const [cameraConfig, setCameraConfig] = useState(null);
    const [currentSpot, setCurrentSpot] = useState('wide');
    const [requestedSpot, setRequestedSpot] = useState('wide');
    const [isAnimating, setIsAnimating] = useState(false);
    const [wideControlsEnabled, setWideControlsEnabled] = useState(calibrationMode);
    const [isTouchOptimized, setIsTouchOptimized] = useState(false);
    const [isLowPowerMode, setIsLowPowerMode] = useState(false);

    const smoothedRef = useRef(0);
    const transitionTimelineRef = useRef(null);
    const fadeTimelineRef = useRef(null);
    const worldLoadTimelineRef = useRef(null);
    const arrivalTimelineRef = useRef(null);
    const firstPrerenderRafRef = useRef(null);
    const secondPrerenderRafRef = useRef(null);
    const landingSequenceRef = useRef(0);
    const roomReadyRef = useRef(false);
    const targetProgressRef = useRef(0);
    const transitionProgressRef = useRef(calibrationMode ? 1 : 0);
    const roomRevealOpacityRef = useRef(calibrationMode ? 1 : 0);
    const transitionShakeRef = useRef(0);
    const depthCueProgressRef = useRef(0);
    const cloudOpacityRef = useRef(calibrationMode ? 0 : 1);
    const hazeOpacityRef = useRef(calibrationMode ? 0 : 0.18);
    const worldLoadTRef = useRef(0);

    const cancelPrerenderWait = useCallback(() => {
        if (firstPrerenderRafRef.current) {
            window.cancelAnimationFrame(firstPrerenderRafRef.current);
            firstPrerenderRafRef.current = null;
        }

        if (secondPrerenderRafRef.current) {
            window.cancelAnimationFrame(secondPrerenderRafRef.current);
            secondPrerenderRafRef.current = null;
        }
    }, []);

    const waitForTwoPrerenderFrames = useCallback((sequenceId, onDone) => {
        cancelPrerenderWait();
        firstPrerenderRafRef.current = window.requestAnimationFrame(() => {
            firstPrerenderRafRef.current = null;
            secondPrerenderRafRef.current = window.requestAnimationFrame(() => {
                secondPrerenderRafRef.current = null;
                if (landingSequenceRef.current !== sequenceId) {
                    return;
                }
                onDone();
            });
        });
    }, [cancelPrerenderWait]);

    const setTargetProgressSafe = useCallback((nextValue) => {
        const clamped = clampTourProgress(nextValue);
        setTargetProgress(clamped);
    }, []);

    const setAnimatedState = useCallback((stateRef, setter, nextValue, threshold = 0.01) => {
        if (Math.abs(nextValue - stateRef.current) <= threshold) {
            return;
        }

        stateRef.current = nextValue;
        setter(nextValue);
    }, []);

    const setTransitionProgressSafe = useCallback((nextValue) => {
        setAnimatedState(transitionProgressRef, setTransitionProgress, nextValue, 0.003);
    }, [setAnimatedState]);

    const setRoomRevealOpacitySafe = useCallback((nextValue) => {
        setAnimatedState(roomRevealOpacityRef, setRoomRevealOpacity, nextValue, 0.01);
    }, [setAnimatedState]);

    const setTransitionShakeSafe = useCallback((nextValue) => {
        setAnimatedState(transitionShakeRef, setTransitionShake, nextValue, 0.015);
    }, [setAnimatedState]);

    const setDepthCueProgressSafe = useCallback((nextValue) => {
        setAnimatedState(depthCueProgressRef, setDepthCueProgress, nextValue, 0.01);
    }, [setAnimatedState]);

    const setCloudOpacitySafe = useCallback((nextValue) => {
        setAnimatedState(cloudOpacityRef, setCloudOpacity, nextValue, 0.01);
    }, [setAnimatedState]);

    const setHazeOpacitySafe = useCallback((nextValue) => {
        setAnimatedState(hazeOpacityRef, setHazeOpacity, nextValue, 0.01);
    }, [setAnimatedState]);

    const setWorldLoadTSafe = useCallback((nextValue) => {
        setAnimatedState(worldLoadTRef, setWorldLoadT, nextValue, 0.01);
    }, [setAnimatedState]);

    useEffect(() => {
        const updateTouchOptimization = () => {
            const isMobileViewport = window.innerWidth < 768;
            const isCoarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
            const saveData = navigator.connection?.saveData ?? false;
            const cores = navigator.hardwareConcurrency ?? 4;
            const memory = navigator.deviceMemory ?? 4;
            const touchOptimized = prefersReducedMotion || isMobileViewport || isCoarsePointer || saveData;
            const lowPowerMode = touchOptimized || cores <= 6 || memory <= 6;

            setIsTouchOptimized(touchOptimized);
            setIsLowPowerMode(lowPowerMode);
        };

        updateTouchOptimization();
        window.addEventListener('resize', updateTouchOptimization);

        return () => {
            window.removeEventListener('resize', updateTouchOptimization);
        };
    }, [prefersReducedMotion]);

    const renderProfile = useMemo(() => {
        return {
            dpr: isLowPowerMode ? [0.85, 1.2] : [1, 1.75],
            directionalLightIntensity: isLowPowerMode ? 1.35 : 1.55,
            ambientLightIntensity: isLowPowerMode ? 0.95 : 1.05,
            hemisphereLightIntensity: isLowPowerMode ? 0.38 : 0.45,
            environmentIntensity: isLowPowerMode ? 0 : 0.55,
        };
    }, [isLowPowerMode]);

    useEffect(() => {
        roomReadyRef.current = roomReady;
    }, [roomReady]);

    useEffect(() => {
        targetProgressRef.current = targetProgress;
    }, [targetProgress]);

    useEffect(() => {
        const htmlElement = document.documentElement;
        const previousHtmlOverflow = htmlElement.style.overflow;
        const previousHtmlHeight = htmlElement.style.height;
        const previousBodyOverflow = document.body.style.overflow;
        const previousBodyHeight = document.body.style.height;

        htmlElement.style.height = '100%';
        htmlElement.style.overflow = 'hidden';
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';

        return () => {
            htmlElement.style.overflow = previousHtmlOverflow;
            htmlElement.style.height = previousHtmlHeight;
            document.body.style.overflow = previousBodyOverflow;
            document.body.style.height = previousBodyHeight;
        };
    }, []);

    const completeTransitionToTour = useCallback(() => {
        arrivalTimelineRef.current?.kill();
        worldLoadTimelineRef.current?.kill();

        setPhase('tour');
        setWaitingForRoom(false);
        setIsAnimating(false);
        setWideControlsEnabled(false);
        transitionProgressRef.current = 1;
        setTransitionProgress(1);
        roomRevealOpacityRef.current = 1;
        setRoomRevealOpacity(1);
        transitionShakeRef.current = 0;
        setTransitionShake(0);
        hazeOpacityRef.current = 0;
        setHazeOpacity(0);
        cloudOpacityRef.current = 0;
        setCloudOpacity(0);
        depthCueProgressRef.current = 1;
        setDepthCueProgress(1);
        setTargetProgressSafe(ARRIVAL_PROGRESS);
        setRequestedSpot('wide');
        setCurrentSpot('wide');

        setIsWorldLoading(true);
        worldLoadTRef.current = 1;
        setWorldLoadT(1);
        const worldLoadState = { value: 1 };
        worldLoadTimelineRef.current = gsap.to(worldLoadState, {
            value: 0,
            duration: 7.0,
            ease: 'power2.out',
            onUpdate: () => {
                setWorldLoadTSafe(worldLoadState.value);
            },
            onComplete: () => {
                worldLoadTRef.current = 0;
                setWorldLoadT(0);
                setIsWorldLoading(false);
                worldLoadTimelineRef.current = null;
            },
        });
    }, [setTargetProgressSafe, setWorldLoadTSafe]);

    const continueLanding = useCallback(() => {
        fadeTimelineRef.current?.kill();
        setWaitingForRoom(false);

        const sequenceId = landingSequenceRef.current;
        roomRevealOpacityRef.current = 0.22;
        setRoomRevealOpacity(0.22);
        cloudOpacityRef.current = 1;
        setCloudOpacity(1);
        hazeOpacityRef.current = 1;
        setHazeOpacity(1);

        const state = {
            transition: transitionTimelineRef.current?.progress() > 0 ? transitionTimelineRef.current.progress() * INTRO_FALL_CUTOFF : INTRO_FALL_CUTOFF,
            shake: 0,
            depthCue: 0,
            room: 0.22,
        };

        const landingTimeline = gsap.timeline({
            onComplete: () => {
                if (landingSequenceRef.current !== sequenceId) {
                    return;
                }

                roomRevealOpacityRef.current = 1;
                setRoomRevealOpacity(1);
                cloudOpacityRef.current = 1;
                setCloudOpacity(1);
                hazeOpacityRef.current = 1;
                setHazeOpacity(1);

                waitForTwoPrerenderFrames(sequenceId, () => {
                    const revealState = {
                        haze: 1,
                        clouds: 1,
                        room: 0.72,
                    };

                    const revealTimeline = gsap.timeline({
                        onComplete: () => {
                            if (landingSequenceRef.current !== sequenceId) {
                                return;
                            }
                            completeTransitionToTour();
                        },
                    });

                    revealTimeline.to(revealState, {
                        haze: 0,
                        clouds: 0,
                        room: 1,
                        duration: 0.7,
                        ease: 'power2.out',
                        onUpdate: () => {
                            setHazeOpacitySafe(revealState.haze);
                            setCloudOpacitySafe(revealState.clouds);
                            setRoomRevealOpacitySafe(revealState.room);
                        },
                    });

                    fadeTimelineRef.current = revealTimeline;
                });
            },
        });

        landingTimeline.to(state, {
            transition: 1,
            duration: INTRO_LAND_DURATION * 0.9,
            ease: 'power3.out',
            onUpdate: () => setTransitionProgressSafe(state.transition),
        }, 0);

        landingTimeline.to(state, {
            depthCue: 1,
            duration: 0.55,
            ease: 'power2.out',
            onUpdate: () => setDepthCueProgressSafe(state.depthCue),
        }, 0.2);

        landingTimeline.to(state, {
            shake: 1,
            duration: 0.16,
            ease: 'power2.out',
            onUpdate: () => setTransitionShakeSafe(state.shake),
        }, 0.26);

        landingTimeline.to(state, {
            shake: 0,
            duration: 0.35,
            ease: 'power2.inOut',
            onUpdate: () => setTransitionShakeSafe(state.shake),
        }, 0.42);

        landingTimeline.to(state, {
            room: 0.72,
            duration: INTRO_LAND_DURATION * 0.72,
            ease: 'power2.out',
            onUpdate: () => setRoomRevealOpacitySafe(state.room),
        }, 0.1);

        fadeTimelineRef.current = landingTimeline;
    }, [completeTransitionToTour, setCloudOpacitySafe, setDepthCueProgressSafe, setHazeOpacitySafe, setRoomRevealOpacitySafe, setTransitionProgressSafe, setTransitionShakeSafe, waitForTwoPrerenderFrames]);

    useEffect(() => {
        if (!calibrationMode) {
            return;
        }

        worldLoadTimelineRef.current?.kill();
        arrivalTimelineRef.current?.kill();
        cancelPrerenderWait();
        landingSequenceRef.current += 1;
        setPhase('tour');
        setTargetProgressSafe(SPOT_PROGRESS.wide);
        transitionProgressRef.current = 1;
        setTransitionProgress(1);
        roomRevealOpacityRef.current = 1;
        setRoomRevealOpacity(1);
        transitionShakeRef.current = 0;
        setTransitionShake(0);
        cloudOpacityRef.current = 0;
        setCloudOpacity(0);
        hazeOpacityRef.current = 0;
        setHazeOpacity(0);
        worldLoadTRef.current = 0;
        setWorldLoadT(0);
        setIsWorldLoading(false);
        setCurrentSpot('wide');
        setRequestedSpot('wide');
        setWaitingForRoom(false);
        setIsAnimating(false);
        setWideControlsEnabled(true);
    }, [calibrationMode, cancelPrerenderWait, setTargetProgressSafe]);

    useEffect(() => {
        if (!waitingForRoom || !roomReady) {
            return;
        }

        continueLanding();
    }, [continueLanding, roomReady, waitingForRoom]);

    useEffect(() => {
        return () => {
            transitionTimelineRef.current?.kill();
            fadeTimelineRef.current?.kill();
            worldLoadTimelineRef.current?.kill();
            arrivalTimelineRef.current?.kill();
            cancelPrerenderWait();
        };
    }, [cancelPrerenderWait]);

    const handleStart = useCallback(() => {
        if (calibrationMode || phase !== 'intro') {
            return;
        }

        transitionTimelineRef.current?.kill();
        fadeTimelineRef.current?.kill();
        worldLoadTimelineRef.current?.kill();
        arrivalTimelineRef.current?.kill();
        cancelPrerenderWait();
        landingSequenceRef.current += 1;

        setPhase('transition');
        setIsAnimating(true);
        setWideControlsEnabled(false);
        setWaitingForRoom(false);
        setRequestedSpot('wide');
        setCurrentSpot('wide');
        setTargetProgressSafe(SPOT_PROGRESS.wide);
        roomRevealOpacityRef.current = 0;
        setRoomRevealOpacity(0);
        transitionShakeRef.current = 0;
        setTransitionShake(0);
        depthCueProgressRef.current = 0;
        setDepthCueProgress(0);
        worldLoadTRef.current = 0;
        setWorldLoadT(0);
        setIsWorldLoading(false);

        const state = {
            transition: 0,
            haze: 0.18,
            clouds: 1,
            room: 0,
        };

        transitionProgressRef.current = state.transition;
        setTransitionProgress(state.transition);
        hazeOpacityRef.current = state.haze;
        setHazeOpacity(state.haze);
        cloudOpacityRef.current = state.clouds;
        setCloudOpacity(state.clouds);
        roomRevealOpacityRef.current = state.room;
        setRoomRevealOpacity(state.room);

        const timeline = gsap.timeline({
            onComplete: () => {
                if (!roomReadyRef.current) {
                    setWaitingForRoom(true);
                    return;
                }
                continueLanding();
            },
        });

        timeline.to(state, {
            transition: INTRO_FALL_CUTOFF,
            duration: INTRO_FALL_DURATION * 0.78,
            ease: 'power4.in',
            onUpdate: () => {
                setTransitionProgressSafe(state.transition);
            },
        });

        timeline.to(state, {
            haze: 1.0,
            clouds: 1.0,
            duration: INTRO_FALL_DURATION * 0.78,
            ease: 'power4.in',
            onUpdate: () => {
                setHazeOpacitySafe(state.haze);
                setCloudOpacitySafe(state.clouds);
            },
        }, 0);

        timeline.to(state, {
            room: 0.18,
            duration: INTRO_FALL_DURATION * 0.55,
            ease: 'power2.in',
            onUpdate: () => {
                setRoomRevealOpacitySafe(state.room);
            },
        }, INTRO_FALL_DURATION * 0.28);

        transitionTimelineRef.current = timeline;
    }, [calibrationMode, cancelPrerenderWait, continueLanding, phase, setCloudOpacitySafe, setHazeOpacitySafe, setRoomRevealOpacitySafe, setTargetProgressSafe, setTransitionProgressSafe]);

    const goToSpot = useCallback((nextSpot) => {
        if (calibrationMode || phase !== 'tour' || isAnimating || !nextSpot) {
            return;
        }

        if (nextSpot === currentSpot) {
            return;
        }

        if (nextSpot === 'career') {
            setCareerDismissed(false);
        }

        if (nextSpot === 'profile') {
            setProfileDismissed(false);
        }

        setRequestedSpot(nextSpot);
        setIsAnimating(true);
        const progressValue = SPOT_PROGRESS[nextSpot] ?? 0;
        setTargetProgressSafe(progressValue);
    }, [calibrationMode, currentSpot, isAnimating, phase, setTargetProgressSafe]);

    useEffect(() => {
        if (calibrationMode || phase !== 'tour' || currentSpot !== 'wide') {
            return;
        }

        if (targetProgressRef.current >= SPOT_PROGRESS.wide) {
            setWideControlsEnabled(true);
            arrivalTimelineRef.current?.kill();
            arrivalTimelineRef.current = null;
            return;
        }

        if (wideControlsEnabled || arrivalTimelineRef.current) {
            return;
        }

        const arrivalState = { progress: targetProgressRef.current };
        arrivalTimelineRef.current = gsap.to(arrivalState, {
            progress: SPOT_PROGRESS.wide,
            duration: 1.9,
            delay: 0.18,
            ease: 'power2.out',
            onUpdate: () => {
                setTargetProgressSafe(arrivalState.progress);
            },
            onComplete: () => {
                setTargetProgressSafe(SPOT_PROGRESS.wide);
                setWideControlsEnabled(true);
                arrivalTimelineRef.current = null;
            },
        });

        return () => {
            arrivalTimelineRef.current?.kill();
            arrivalTimelineRef.current = null;
        };
    }, [calibrationMode, currentSpot, phase, setTargetProgressSafe, wideControlsEnabled]);

    const stepCameraProgress = useCallback((direction) => {
        if (calibrationMode || phase !== 'tour' || isAnimating || currentSpot !== 'wide' || !wideControlsEnabled) {
            return;
        }

        let nextProgress = targetProgress;
        if (direction < 0) {
            if (targetProgress <= 0.02) {
                nextProgress = ARRIVAL_PROGRESS;
            } else if (targetProgress <= CAMERA_STEP + 0.02) {
                nextProgress = 0;
            } else {
                nextProgress = targetProgress - CAMERA_STEP;
            }
        } else if (targetProgress < 0) {
            nextProgress = 0;
        } else {
            nextProgress = targetProgress + CAMERA_STEP;
        }

        setTargetProgressSafe(nextProgress);
    }, [calibrationMode, currentSpot, isAnimating, phase, setTargetProgressSafe, targetProgress, wideControlsEnabled]);

    const handleSmoothedProgress = useCallback((nextProgress) => {
        if (Math.abs(nextProgress - smoothedRef.current) <= 0.0015) {
            return;
        }

        smoothedRef.current = nextProgress;
        setSmoothedProgress(nextProgress);
    }, []);

    useEffect(() => {
        if (currentSpot !== 'career') {
            setCareerDismissed(false);
        }
    }, [currentSpot]);

    useEffect(() => {
        if (currentSpot !== 'profile') {
            setProfileDismissed(false);
        }
    }, [currentSpot]);

    const showCareerCard = phase === 'tour' && currentSpot === 'career' && !careerDismissed;
    const showProfileCard = phase === 'tour' && currentSpot === 'profile' && !profileDismissed;

    const handleRoomReady = useCallback((ready) => {
        roomReadyRef.current = ready;
        setRoomReady(ready);
    }, []);

    const canvasOpacity = calibrationMode
        ? 1
        : phase === 'intro'
            ? 0
            : phase === 'transition'
                ? (roomReady ? clamp01(Math.max(roomRevealOpacity, (transitionProgress - 0.52) * 1.65)) : 0)
                : 1;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100%',
                margin: 0,
                padding: 0,
                overflow: 'hidden',
                background: '#8ec5ff',
            }}
        >
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                <Canvas
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 0,
                        opacity: canvasOpacity,
                        filter: `brightness(${phase === 'transition' ? 0.9 + 0.1 * depthCueProgress : 1})`,
                    }}
                    dpr={renderProfile.dpr}
                    camera={{ position: [0, 1.8, 7], fov: 46 }}
                    gl={{ powerPreference: isLowPowerMode ? 'low-power' : 'high-performance', antialias: !isLowPowerMode }}
                    onCreated={({ gl, scene }) => {
                        gl.toneMappingExposure = 1.3;
                        scene.background = new THREE.Color('#8ec5ff');
                    }}
                >
                    <ambientLight intensity={renderProfile.ambientLightIntensity} />
                    <directionalLight intensity={renderProfile.directionalLightIntensity} position={[5, 8, 5]} />
                    <hemisphereLight intensity={renderProfile.hemisphereLightIntensity} color="#eaf5ff" groundColor="#9ec7ff" />
                    {renderProfile.environmentIntensity > 0 && <Environment preset="city" intensity={renderProfile.environmentIntensity} />}

                    <Suspense fallback={null}>
                        <RoomTour
                            phase={phase}
                            targetProgress={targetProgress}
                            transitionProgress={transitionProgress}
                            transitionShake={transitionShake}
                            fogFactor={hazeOpacity}
                            worldLoadT={worldLoadT}
                            isWorldLoading={isWorldLoading}
                            debug={debug}
                            calibrationMode={calibrationMode}
                            careerItems={careerItems}
                            showCareerCard={showCareerCard}
                            showProfileCard={showProfileCard}
                            onCloseCareerCard={() => setCareerDismissed(true)}
                            onCloseProfileCard={() => setProfileDismissed(true)}
                            onRoomReady={handleRoomReady}
                            onSmoothedProgress={handleSmoothedProgress}
                            onConfigReady={setCameraConfig}
                            requestedSpot={requestedSpot}
                            onSpotChange={setCurrentSpot}
                            onNavAnimatingChange={setIsAnimating}
                            isLowPowerMode={isLowPowerMode}
                        />
                    </Suspense>
                </Canvas>

                <CloudGateOverlay
                    phase={phase}
                    cloudOpacity={cloudOpacity}
                    hazeOpacity={hazeOpacity}
                    transitionProgress={transitionProgress}
                    roomReady={roomReady}
                    onStart={handleStart}
                    startDisabled={phase !== 'intro'}
                    isTouchOptimized={isTouchOptimized}
                />



                <OverlayUI
                    phase={phase}
                    debug={debug}
                    onJumpWide={() => goToSpot('wide')}
                    onStepUp={() => stepCameraProgress(-1)}
                    onStepDown={() => stepCameraProgress(1)}
                    navLocked={isAnimating}
                    wideControlsEnabled={wideControlsEnabled}
                    canStepUp={wideControlsEnabled && currentSpot === 'wide' && targetProgress > ARRIVAL_PROGRESS + 0.02}
                    canStepDown={wideControlsEnabled && currentSpot === 'wide' && targetProgress < 0.98}
                    smoothedProgress={smoothedProgress}
                    targetProgress={targetProgress}
                />


            </div>
        </div>
    );
};

export default AboutExperience;
