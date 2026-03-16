import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import OverlayUI from './OverlayUI';
import RoomTour from './RoomTour';
import PlasticButton from '../../resources/js/UI/PlasticButton';

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

const CloudGateOverlay = ({ phase, cloudOpacity, hazeOpacity, transitionProgress, roomReady, onStart, startDisabled }) => {
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
                    opacity: bridgeGlowOpacity,
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

            {[{
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
            }].map((layer) => (
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
                    transform: `translate3d(0, ${inTransition ? -fallProgress * 60 : 0}%, 0) scale(${1 + fallProgress * 0.5})`,
                    transformOrigin: '50% 50%',
                    height: '240%',
                    top: '-20%',
                }}
            />

            {/* Front Vapor Layer - Rushes past the camera heavily */}
            <div
                className="absolute inset-0 mix-blend-screen"
                style={{
                    opacity: cloudLayerOpacity * (inTransition ? clamp01(fallProgress * 2.0) : 0),
                    filter: 'url(#vapor-noise-front)',
                    transform: `translate3d(0, ${inTransition ? -fallProgress * 150 : 0}%, 0) scale(${1 + fallProgress * 1.5})`,
                    transformOrigin: '50% 50%',
                    height: '350%',
                    top: '-50%',
                }}
            />

            {/* Rush Blur Layer - Replaces the discrete lines with uniform vertical motion blur */}
            <div
                className="absolute inset-0 mix-blend-screen"
                style={{
                    opacity: windOpacity * 0.8 * cloudLayerOpacity,
                    filter: 'url(#vapor-noise-back) blur(12px)',
                    transform: `translate3d(0, ${inTransition ? -fallProgress * 300 : 0}%, 0) scaleY(4.0) scaleX(1.5)`,
                    transformOrigin: '50% 50%',
                    height: '500%',
                    top: '-150%',
                }}
            />

            <div
                className="absolute inset-0"
                style={{
                    opacity: hazeLayerOpacity,
                    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95) 0%, rgba(235,245,255,0.9) 50%, rgba(190,215,240,0.8) 100%)',
                }}
            />

            <div
                className="absolute inset-0"
                style={{
                    opacity: revealWindowOpacity,
                    background: 'radial-gradient(circle at 52% 62%, rgba(146,168,196,0) 0%, rgba(146,168,196,0) 18%, rgba(177,198,221,0.18) 34%, rgba(225,237,249,0.55) 100%)',
                }}
            />

            <div
                className="absolute inset-0"
                style={{
                    opacity: noiseOpacity,
                    backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.7) 0 1px, transparent 1.5px), radial-gradient(circle at 70% 38%, rgba(255,255,255,0.45) 0 1px, transparent 1.5px), radial-gradient(circle at 42% 72%, rgba(255,255,255,0.35) 0 1px, transparent 1.5px)',
                    backgroundSize: '180px 180px, 220px 220px, 260px 260px',
                    transform: `translate3d(0, ${inTransition ? -fallProgress * 40 : 0}%, 0)`,
                }}
            />

            {inIntro && (
                <div className="pointer-events-auto absolute inset-x-0 bottom-8 z-50 flex justify-center px-6">
                    <div className="flex w-full max-w-lg items-center justify-between gap-4 rounded-full border border-white/35 bg-white/14 px-5 py-3 text-black shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl">
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.38em] text-black/70">About descent</p>
                            <p className="mt-1 text-sm font-medium leading-snug text-black">
                                Turun dari langit, menembus kabut, lalu masuk ke workspace.
                            </p>
                        </div>
                        <PlasticButton
                            color="red"
                            onClick={onStart}
                            disabled={startDisabled}
                        >
                            Start
                        </PlasticButton>
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
        setTransitionProgress(1);
        setRoomRevealOpacity(1);
        setTransitionShake(0);
        setHazeOpacity(0);
        setCloudOpacity(0);
        setDepthCueProgress(1);
        setTargetProgressSafe(ARRIVAL_PROGRESS);
        setRequestedSpot('wide');
        setCurrentSpot('wide');

        setIsWorldLoading(true);
        setWorldLoadT(1);
        const worldLoadState = { value: 1 };
        worldLoadTimelineRef.current = gsap.to(worldLoadState, {
            value: 0,
            duration: 7.0,
            ease: 'power2.out',
            onUpdate: () => {
                setWorldLoadT(worldLoadState.value);
            },
            onComplete: () => {
                setWorldLoadT(0);
                setIsWorldLoading(false);
                worldLoadTimelineRef.current = null;
            },
        });
    }, [setTargetProgressSafe]);

    const continueLanding = useCallback(() => {
        fadeTimelineRef.current?.kill();
        setWaitingForRoom(false);

        const sequenceId = landingSequenceRef.current;
        setRoomRevealOpacity(0.22);
        setCloudOpacity(1);
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

                setRoomRevealOpacity(1);
                setCloudOpacity(1);
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
                            setHazeOpacity(revealState.haze);
                            setCloudOpacity(revealState.clouds);
                            setRoomRevealOpacity(revealState.room);
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
            onUpdate: () => setTransitionProgress(state.transition),
        }, 0);

        landingTimeline.to(state, {
            depthCue: 1,
            duration: 0.55,
            ease: 'power2.out',
            onUpdate: () => setDepthCueProgress(state.depthCue),
        }, 0.2);

        landingTimeline.to(state, {
            shake: 1,
            duration: 0.16,
            ease: 'power2.out',
            onUpdate: () => setTransitionShake(state.shake),
        }, 0.26);

        landingTimeline.to(state, {
            shake: 0,
            duration: 0.35,
            ease: 'power2.inOut',
            onUpdate: () => setTransitionShake(state.shake),
        }, 0.42);

        landingTimeline.to(state, {
            room: 0.72,
            duration: INTRO_LAND_DURATION * 0.72,
            ease: 'power2.out',
            onUpdate: () => setRoomRevealOpacity(state.room),
        }, 0.1);

        fadeTimelineRef.current = landingTimeline;
    }, [completeTransitionToTour, waitForTwoPrerenderFrames]);

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
        setTransitionProgress(1);
        setRoomRevealOpacity(1);
        setTransitionShake(0);
        setCloudOpacity(0);
        setHazeOpacity(0);
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
        setRoomRevealOpacity(0);
        setTransitionShake(0);
        setDepthCueProgress(0);
        setWorldLoadT(0);
        setIsWorldLoading(false);

        const state = {
            transition: 0,
            haze: 0.18,
            clouds: 1,
            room: 0,
        };

        setTransitionProgress(state.transition);
        setHazeOpacity(state.haze);
        setCloudOpacity(state.clouds);
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
                setTransitionProgress(state.transition);
            },
        });

        timeline.to(state, {
            haze: 1.0,
            clouds: 1.0,
            duration: INTRO_FALL_DURATION * 0.78,
            ease: 'power4.in',
            onUpdate: () => {
                setHazeOpacity(state.haze);
                setCloudOpacity(state.clouds);
            },
        }, 0);

        timeline.to(state, {
            room: 0.18,
            duration: INTRO_FALL_DURATION * 0.55,
            ease: 'power2.in',
            onUpdate: () => {
                setRoomRevealOpacity(state.room);
            },
        }, INTRO_FALL_DURATION * 0.28);

        transitionTimelineRef.current = timeline;
    }, [calibrationMode, cancelPrerenderWait, continueLanding, phase, setTargetProgressSafe]);

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
                    dpr={[1, 1.75]}
                    camera={{ position: [0, 1.8, 7], fov: 46 }}
                    onCreated={({ gl, scene }) => {
                        gl.toneMappingExposure = 1.3;
                        scene.background = new THREE.Color('#8ec5ff');
                    }}
                >
                    <ambientLight intensity={1.05} />
                    <directionalLight intensity={1.55} position={[5, 8, 5]} />
                    <hemisphereLight intensity={0.45} color="#eaf5ff" groundColor="#9ec7ff" />
                    <Environment preset="city" intensity={0.55} />

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
