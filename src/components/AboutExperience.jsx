import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ScrollControls, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import OverlayUI from './OverlayUI';
import RoomTour from './RoomTour';
import PlasticCard from '../../resources/js/UI/PlasticCard';
import PlasticButton from '../../resources/js/UI/PlasticButton';

const CAREER_SPOT = 0.35;
const PROFILE_SPOT = 0.75;
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

const INTRO_FALL_CUTOFF = 0.65;
const INTRO_FALL_DURATION = 1.6;
const INTRO_LAND_DURATION = 1.0;
const INTRO_REVEAL_START = 0.5;

const ScrollProgressDriver = ({ phase, enabled, onProgressUpdate, onRegisterApi }) => {
    const scroll = useScroll();
    const lastOffsetRef = useRef(-1);

    useEffect(() => {
        if (!onRegisterApi) {
            return undefined;
        }

        const setOffset = (nextOffset) => {
            if (!scroll.el) {
                return;
            }

            const clamped = clamp01(nextOffset);
            const maxScrollTop = Math.max(scroll.el.scrollHeight - scroll.el.clientHeight, 0);
            scroll.el.scrollTop = clamped * maxScrollTop;
        };

        onRegisterApi({ setOffset });

        return () => {
            onRegisterApi(null);
        };
    }, [onRegisterApi, scroll]);

    useFrame(() => {
        if (phase !== 'tour' || !enabled) {
            return;
        }

        const nextOffset = clamp01(scroll.offset);
        if (Math.abs(nextOffset - lastOffsetRef.current) <= 0.0006) {
            return;
        }

        lastOffsetRef.current = nextOffset;
        onProgressUpdate(nextOffset);
    });

    return null;
};

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
                    opacity: inTransition ? clamp01(fallProgress * 0.6) : 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, rgba(120,168,206,0.2) 60%, rgba(66,110,152,0.4) 100%)',
                }}
            />

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

            {inIntro && (
                <div className="pointer-events-auto absolute inset-0 flex items-center justify-center px-6">
                    <div className="w-full max-w-sm h-[26rem]">
                        <PlasticCard
                            title="Room Tour"
                            subtitle="About Experience"
                            color="blue"
                            className="text-center"
                        >
                            <div className="flex flex-col items-center justify-center h-full gap-5">
                                <p className="text-sm text-slate-700/90 font-medium px-2 leading-relaxed">
                                    Start Experience untuk jatuh dari langit, menembus awan tebal, lalu masuk ke workspace.
                                </p>
                                <PlasticButton
                                    color="red"
                                    onClick={onStart}
                                    disabled={startDisabled}
                                >
                                    Start Experience
                                </PlasticButton>
                            </div>
                        </PlasticCard>
                    </div>
                </div>
            )}

            {inTransition && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-white/50 bg-white/62 px-5 py-2 text-xs font-semibold text-slate-700 backdrop-blur">
                    {roomReady ? 'Falling through clouds...' : 'Loading room...'}
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

    const smoothedRef = useRef(0);
    const transitionTimelineRef = useRef(null);
    const fadeTimelineRef = useRef(null);
    const worldLoadTimelineRef = useRef(null);
    const firstPrerenderRafRef = useRef(null);
    const secondPrerenderRafRef = useRef(null);
    const landingSequenceRef = useRef(0);
    const isProgrammaticScrollRef = useRef(false);
    const scrollApiRef = useRef(null);
    const roomReadyRef = useRef(false);

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

    const syncScrollOffset = useCallback((nextOffset) => {
        if (!scrollApiRef.current) {
            return;
        }

        isProgrammaticScrollRef.current = true;
        scrollApiRef.current.setOffset(clamp01(nextOffset));
        window.requestAnimationFrame(() => {
            isProgrammaticScrollRef.current = false;
        });
    }, []);

    const setTargetProgressSafe = useCallback((nextValue) => {
        const clamped = clamp01(nextValue);
        setTargetProgress(clamped);
    }, []);

    const handleScrollProgress = useCallback((nextOffset) => {
        if (calibrationMode || phase !== 'tour' || isAnimating || currentSpot !== 'wide' || isProgrammaticScrollRef.current) {
            return;
        }

        setTargetProgressSafe(nextOffset);
    }, [calibrationMode, currentSpot, isAnimating, phase, setTargetProgressSafe]);

    useEffect(() => {
        roomReadyRef.current = roomReady;
    }, [roomReady]);

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
        worldLoadTimelineRef.current?.kill();

        setPhase('tour');
        setWaitingForRoom(false);
        setIsAnimating(false);
        setTransitionProgress(1);
        setRoomRevealOpacity(1);
        setTransitionShake(0);
        setHazeOpacity(0);
        setCloudOpacity(0);
        setDepthCueProgress(1);
        setTargetProgressSafe(SPOT_PROGRESS.wide);
        setRequestedSpot('wide');
        setCurrentSpot('wide');
        syncScrollOffset(SPOT_PROGRESS.wide);

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
    }, [setTargetProgressSafe, syncScrollOffset]);

    const continueLanding = useCallback(() => {
        fadeTimelineRef.current?.kill();
        setWaitingForRoom(false);

        const sequenceId = landingSequenceRef.current;
        setRoomRevealOpacity(1);
        setCloudOpacity(1);
        setHazeOpacity(1);

        const state = {
            transition: transitionTimelineRef.current?.progress() > 0 ? transitionTimelineRef.current.progress() * INTRO_FALL_CUTOFF : INTRO_FALL_CUTOFF,
            shake: 0,
            depthCue: 0,
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
                        duration: 0.6,
                        ease: 'power2.out',
                        onUpdate: () => {
                            setHazeOpacity(revealState.haze);
                            setCloudOpacity(revealState.clouds);
                        },
                    });

                    fadeTimelineRef.current = revealTimeline;
                });
            },
        });

        landingTimeline.to(state, {
            transition: 1,
            duration: INTRO_LAND_DURATION,
            ease: 'power3.out',
            onUpdate: () => setTransitionProgress(state.transition)
        }, 0);

        landingTimeline.to(state, {
            depthCue: 1,
            duration: 0.4,
            ease: 'power2.out',
            onUpdate: () => setDepthCueProgress(state.depthCue)
        }, 0.5);

        landingTimeline.to(state, {
            shake: 1,
            duration: 0.15,
            ease: 'power2.out',
            onUpdate: () => setTransitionShake(state.shake)
        }, 0.5);

        landingTimeline.to(state, {
            shake: 0,
            duration: 0.25,
            ease: 'power2.inOut',
            onUpdate: () => setTransitionShake(state.shake)
        }, 0.65);

        fadeTimelineRef.current = landingTimeline;
    }, [completeTransitionToTour, waitForTwoPrerenderFrames]);

    useEffect(() => {
        if (!calibrationMode) {
            return;
        }

        worldLoadTimelineRef.current?.kill();
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
        cancelPrerenderWait();
        landingSequenceRef.current += 1;

        setPhase('transition');
        setIsAnimating(true);
        setWaitingForRoom(false);
        setRequestedSpot('wide');
        setCurrentSpot('wide');
        setTargetProgressSafe(SPOT_PROGRESS.wide);
        syncScrollOffset(SPOT_PROGRESS.wide);
        setRoomRevealOpacity(0);
        setTransitionShake(0);
        setDepthCueProgress(0);
        setWorldLoadT(0);
        setIsWorldLoading(false);

        const state = {
            transition: 0,
            haze: 0.18,
            clouds: 1,
        };

        setTransitionProgress(state.transition);
        setHazeOpacity(state.haze);
        setCloudOpacity(state.clouds);

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
            duration: INTRO_FALL_DURATION,
            ease: 'power4.in',
            onUpdate: () => {
                setTransitionProgress(state.transition);
            },
        });

        timeline.to(state, {
            haze: 1.0,
            clouds: 1.0,
            duration: INTRO_FALL_DURATION,
            ease: 'power4.in',
            onUpdate: () => {
                setHazeOpacity(state.haze);
                setCloudOpacity(state.clouds);
            },
        }, 0);

        transitionTimelineRef.current = timeline;
    }, [calibrationMode, cancelPrerenderWait, continueLanding, phase, setTargetProgressSafe, syncScrollOffset]);

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
        syncScrollOffset(progressValue);
    }, [calibrationMode, currentSpot, isAnimating, phase, setTargetProgressSafe, syncScrollOffset]);

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

    const handleRegisterScrollApi = useCallback((api) => {
        scrollApiRef.current = api;
    }, []);

    const handleRoomReady = useCallback((ready) => {
        roomReadyRef.current = ready;
        setRoomReady(ready);
    }, []);

    const canvasOpacity = calibrationMode
        ? 1
        : phase === 'intro'
            ? 0
            : phase === 'transition'
                ? (roomReady ? roomRevealOpacity : 0)
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

                    <ScrollControls pages={3} damping={0.1} enabled={!calibrationMode && phase === 'tour' && !isAnimating}>
                        <ScrollProgressDriver
                            phase={phase}
                            enabled={currentSpot === 'wide' && !isAnimating}
                            onProgressUpdate={handleScrollProgress}
                            onRegisterApi={handleRegisterScrollApi}
                        />

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
                    </ScrollControls>
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
                    navLocked={isAnimating}
                    smoothedProgress={smoothedProgress}
                    targetProgress={targetProgress}
                />

                <div
                    style={{
                        position: 'absolute',
                        left: 12,
                        top: 12,
                        zIndex: 30,
                        borderRadius: 10,
                        border: '1px solid rgba(226,232,240,0.95)',
                        background: 'rgba(255,255,255,0.9)',
                        padding: '6px 10px',
                        fontSize: 11,
                        fontFamily: 'monospace',
                        color: '#334155',
                        pointerEvents: 'none',
                    }}
                >
                    <div>phase: {phase}</div>
                    <div>spot: {currentSpot}</div>
                    {cameraConfig && (
                        <>
                            <div>diag: {cameraConfig.diag.toFixed(3)}</div>
                            <div>near: {cameraConfig.clipNear.toFixed(3)}</div>
                            <div>far: {cameraConfig.clipFar.toFixed(3)}</div>
                        </>
                    )}
                    {debug && (
                        <div>roomReady: {roomReady ? 'yes' : 'no'}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AboutExperience;
