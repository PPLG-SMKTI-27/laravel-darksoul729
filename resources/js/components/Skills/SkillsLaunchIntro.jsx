import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Cone, RoundedBox } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';

const LAUNCH_DURATION_MS = 7600;
const APPROACH_START_PROGRESS = 0.76;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const overlayVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.9,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};

const controlsVariants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
        },
    },
    exit: {
        opacity: 0,
        y: 14,
        transition: {
            duration: 0.28,
            ease: 'easeInOut',
        },
    },
};

const statusVariants = {
    hidden: {
        opacity: 0,
        y: -14,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const engineOffsets = [
    [0, -1.18, 0],
    [-0.16, -1.14, 0],
    [0.16, -1.14, 0],
];

const getRocketFlightState = (progress, elapsedTime) => {
    const ascentProgress = clamp(progress / APPROACH_START_PROGRESS, 0, 1);
    const approachProgress = clamp((progress - APPROACH_START_PROGRESS) / (1 - APPROACH_START_PROGRESS), 0, 1);
    const ascentEase = ascentProgress * ascentProgress * (3 - 2 * ascentProgress);
    const approachEase = approachProgress * approachProgress * (3 - 2 * approachProgress);
    const touchdownProgress = clamp((approachProgress - 0.82) / 0.18, 0, 1);
    const touchdownEase = touchdownProgress * touchdownProgress * (3 - 2 * touchdownProgress);

    return {
        ascentProgress,
        approachProgress,
        ascentEase,
        approachEase,
        touchdownProgress,
        touchdownEase,
        x: Math.sin(elapsedTime * 0.52) * 0.12 * (1 - approachEase),
        y: ascentEase * 6.1 - approachEase * 7.6 - touchdownEase * 0.6,
        z: -approachEase * 5.6,
    };
};

const ExhaustFlame = ({ launchProgress, offset }) => {
    const flameRef = useRef(null);
    const coreRef = useRef(null);
    const glowRef = useRef(null);

    useFrame((state) => {
        const elapsedTime = state.clock.getElapsedTime();
        const activeProgress = clamp(launchProgress, 0, 1);
        const { touchdownProgress } = getRocketFlightState(activeProgress, elapsedTime);
        const power = 1 - touchdownProgress * 0.34;
        const flicker = 0.9 + Math.sin(elapsedTime * 18) * 0.14;
        const width = 0.22 + activeProgress * 0.12;
        const height = (0.9 + activeProgress * 1.1) * power;

        if (flameRef.current) {
            flameRef.current.scale.set(width, height * flicker, width);
            flameRef.current.material.opacity = 0.6 + activeProgress * 0.28 - touchdownProgress * 0.1;
        }

        if (coreRef.current) {
            coreRef.current.scale.set(width * 0.56, height * 0.66 * flicker, width * 0.56);
            coreRef.current.material.opacity = 0.84 + activeProgress * 0.14 - touchdownProgress * 0.08;
        }

        if (glowRef.current) {
            glowRef.current.scale.setScalar(0.6 + activeProgress * 0.4 - touchdownProgress * 0.08);
            glowRef.current.material.opacity = 0.08 + activeProgress * 0.18 - touchdownProgress * 0.06;
        }
    });

    return (
        <group position={offset}>
            <mesh ref={glowRef} position={[0, -0.32, 0]}>
                <sphereGeometry args={[0.36, 14, 14]} />
                <meshBasicMaterial color="#fb923c" transparent opacity={0.2} depthWrite={false} />
            </mesh>

            <mesh ref={flameRef} position={[0, -0.26, 0]}>
                <coneGeometry args={[0.22, 1.05, 14]} />
                <meshBasicMaterial color="#f97316" transparent opacity={0.86} depthWrite={false} />
            </mesh>

            <mesh ref={coreRef} position={[0, -0.16, 0]}>
                <coneGeometry args={[0.12, 0.76, 14]} />
                <meshBasicMaterial color="#fde68a" transparent opacity={0.95} depthWrite={false} />
            </mesh>
        </group>
    );
};

const SmokePlume = ({ launchProgress }) => {
    const particles = useMemo(() => {
        return Array.from({ length: 76 }, (_, index) => ({
            id: index,
            x: (Math.random() - 0.5) * 2.2,
            y: -1.2 - Math.random() * 5.4,
            z: (Math.random() - 0.5) * 1.4,
            scale: 0.38 + Math.random() * 0.74,
            speed: 0.12 + Math.random() * 0.22,
            drift: (Math.random() - 0.5) * 0.4,
            delay: Math.random(),
        }));
    }, []);

    const particleRefs = useRef([]);
    const emitterRef = useRef(null);

    useFrame((state) => {
        const elapsedTime = state.clock.getElapsedTime();
        const activeProgress = clamp(launchProgress, 0, 1);
        const { approachProgress, touchdownProgress, x, y, z } = getRocketFlightState(activeProgress, elapsedTime);

        if (emitterRef.current) {
            emitterRef.current.position.set(x, y - 1.22, z);
        }

        particleRefs.current.forEach((particleRef, index) => {
            if (!particleRef) {
                return;
            }

            const particle = particles[index];
            const cycle = ((elapsedTime * particle.speed) + particle.delay) % 1;
            const travel = cycle * (3.6 + activeProgress * 5.2 - approachProgress * 1.8);
            const scale = particle.scale + cycle * (0.72 + activeProgress * 1.05 - approachProgress * 0.22 + touchdownProgress * 0.3);

            particleRef.position.x = particle.x + Math.sin(elapsedTime * 1.2 + index) * particle.drift;
            particleRef.position.y = particle.y - travel;
            particleRef.position.z = particle.z;
            particleRef.scale.setScalar(scale);
            particleRef.material.opacity = Math.max(0, 0.24 + activeProgress * 0.22 + touchdownProgress * 0.1 - cycle * (0.18 + approachProgress * 0.03));
        });
    });

    return (
        <group ref={emitterRef}>
            {particles.map((particle, index) => (
                <mesh
                    key={particle.id}
                    ref={(element) => {
                        particleRefs.current[index] = element;
                    }}
                    position={[particle.x, particle.y, particle.z]}
                >
                    <sphereGeometry args={[0.48, 14, 14]} />
                    <meshBasicMaterial color="#e5edf7" transparent opacity={0.32} depthWrite={false} />
                </mesh>
            ))}
        </group>
    );
};

const RocketModel = ({ launchProgress }) => {
    const rocketRef = useRef(null);
    const bodyRef = useRef(null);

    useFrame((state) => {
        const elapsedTime = state.clock.getElapsedTime();
        const { approachEase, touchdownEase, x, y, z } = getRocketFlightState(launchProgress, elapsedTime);

        if (bodyRef.current) {
            bodyRef.current.rotation.z = Math.sin(elapsedTime * 1.4) * 0.012 * (1 - approachEase);
            bodyRef.current.rotation.x = -0.02 + clamp(launchProgress / APPROACH_START_PROGRESS, 0, 1) * 0.03 - approachEase * 0.04 + touchdownEase * 0.02;
        }

        if (rocketRef.current) {
            rocketRef.current.position.set(x, y, z);
            rocketRef.current.scale.setScalar(0.5 - approachEase * 0.18 + touchdownEase * 0.008);
        }
    });

    return (
        <group ref={rocketRef}>
            <group ref={bodyRef}>
                <mesh>
                    <cylinderGeometry args={[0.32, 0.38, 1.95, 24]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.22} metalness={0.24} />
                </mesh>

                <Cone args={[0.34, 0.82, 24]} position={[0, 1.36, 0]}>
                    <meshStandardMaterial color="#fb7185" roughness={0.2} metalness={0.16} />
                </Cone>

                <mesh position={[0, 0.54, 0.31]}>
                    <circleGeometry args={[0.16, 24]} />
                    <meshStandardMaterial color="#0f172a" emissive="#60a5fa" emissiveIntensity={0.45} />
                </mesh>

                <RoundedBox args={[0.42, 0.14, 0.44]} radius={0.06} position={[0, -0.02, 0]}>
                    <meshStandardMaterial color="#2563eb" roughness={0.26} metalness={0.22} />
                </RoundedBox>

                {[
                    [-0.28, -0.68, 0, 0.42],
                    [0.28, -0.68, 0, -0.42],
                    [0, -0.68, -0.28, 0],
                ].map(([x, y, z, rotationY], index) => (
                    <group key={index} position={[x, y, z]} rotation={[0, rotationY, 0]}>
                        <mesh>
                            <boxGeometry args={[0.08, 0.56, 0.3]} />
                            <meshStandardMaterial color="#1d4ed8" roughness={0.3} metalness={0.2} />
                        </mesh>
                    </group>
                ))}

                {engineOffsets.map((offset, index) => (
                    <group key={index}>
                        <mesh position={[offset[0], offset[1] + 0.1, offset[2]]}>
                            <cylinderGeometry args={[0.07, 0.09, 0.2, 12]} />
                            <meshStandardMaterial color="#94a3b8" roughness={0.24} metalness={0.4} />
                        </mesh>
                        <ExhaustFlame launchProgress={launchProgress} offset={offset} />
                    </group>
                ))}
            </group>
        </group>
    );
};

const StarField = ({ launchProgress }) => {
    const starRefs = useRef([]);
    const stars = useMemo(() => {
        return Array.from({ length: 360 }, (_, index) => ({
            id: index,
            x: (Math.random() - 0.5) * 20,
            y: (Math.random() - 0.25) * 15,
            z: -2 - Math.random() * 28,
            scale: 0.012 + Math.random() * 0.035,
            delay: Math.random() * 10,
            color: ['#ffffff', '#bfdbfe', '#fde047', '#fbcfe8', '#a7f3d0', '#c4b5fd'][Math.floor(Math.random() * 6)],
        }));
    }, []);

    useFrame((state) => {
        const elapsedTime = state.clock.getElapsedTime();
        const { ascentProgress, approachProgress } = getRocketFlightState(launchProgress, elapsedTime);

        starRefs.current.forEach((starRef, index) => {
            if (!starRef) {
                return;
            }

            const star = stars[index];

            if (launchProgress > 0) {
                const streamSpeed = (1.4 + ascentProgress * 9.2 + (index % 4) * 0.4) * (1 - approachProgress * 0.6);
                const stream = (elapsedTime * streamSpeed + star.delay) % 26;

                starRef.position.x = star.x * (1 + ascentProgress * 0.18);
                starRef.position.y = 10 - stream;
                starRef.position.z = star.z + ascentProgress * 2.2;
                starRef.scale.x = star.scale * (1 + ascentProgress * 0.18);
                starRef.scale.y = star.scale * (1.2 + ascentProgress * (8.2 - approachProgress * 6.2));
                starRef.scale.z = star.scale;
                starRef.material.opacity = (0.58 + ascentProgress * 0.34) * (1 - approachProgress * 0.72);
            } else {
                starRef.position.x = star.x;
                starRef.position.y = star.y + Math.sin(elapsedTime * 0.5 + index) * 0.04;
                starRef.position.z = star.z;
                starRef.scale.set(star.scale, star.scale, star.scale);
                starRef.material.opacity = 0.82 + Math.sin(elapsedTime * 1.8 + index) * 0.18;
            }
        });
    });

    return stars.map((star, index) => (
        <mesh
            key={star.id}
            ref={(element) => {
                starRefs.current[index] = element;
            }}
            position={[star.x, star.y, star.z]}
        >
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color={star.color} transparent opacity={0.9} />
        </mesh>
    ));
};

const LandingBay = ({ launchProgress }) => {
    const coreRef = useRef(null);
    const haloRef = useRef(null);
    const lightsRef = useRef([]);
    const approachProgress = clamp((launchProgress - APPROACH_START_PROGRESS) / (1 - APPROACH_START_PROGRESS), 0, 1);

    useFrame((state) => {
        const elapsedTime = state.clock.getElapsedTime();

        if (coreRef.current) {
            coreRef.current.visible = approachProgress > 0.06;
            coreRef.current.scale.setScalar(0.56 + approachProgress * 0.22);
            coreRef.current.material.opacity = 0.06 + approachProgress * 0.14;
        }

        if (haloRef.current) {
            haloRef.current.visible = approachProgress > 0.1;
            haloRef.current.scale.setScalar(0.8 + approachProgress * 0.36);
            haloRef.current.material.opacity = 0.04 + approachProgress * 0.12;
        }

        lightsRef.current.forEach((light, index) => {
            if (!light) {
                return;
            }

            light.visible = approachProgress > 0.16;
            light.material.opacity = 0.08 + approachProgress * 0.22 - Math.abs(2 - index) * 0.03 + Math.sin(elapsedTime * 4 + index) * 0.02;
        });
    });

    return (
        <group position={[0, -1.55, -5.65]}>
            <mesh ref={coreRef} position={[0, 0, -0.06]}>
                <circleGeometry args={[0.58, 48]} />
                <meshBasicMaterial color="#7dd3fc" transparent opacity={0.12} />
            </mesh>

            <mesh ref={haloRef} position={[0, 0, -0.08]}>
                <circleGeometry args={[0.92, 48]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.08} />
            </mesh>

            {Array.from({ length: 5 }).map((_, index) => (
                <mesh
                    key={`landing-light-${index}`}
                    ref={(element) => {
                        lightsRef.current[index] = element;
                    }}
                    position={[-0.68 + index * 0.34, -0.42, 0.02]}
                >
                    <sphereGeometry args={[0.035 + (2 - Math.abs(2 - index)) * 0.008, 10, 10]} />
                    <meshBasicMaterial color="#7dd3fc" transparent opacity={0.12} />
                </mesh>
            ))}
        </group>
    );
};

const CameraRig = ({ launchProgress }) => {
    const { camera } = useThree();

    useFrame((state) => {
        const elapsedTime = state.clock.getElapsedTime();
        const { ascentEase, approachProgress, approachEase, touchdownEase, y: rocketY, z: rocketZ } = getRocketFlightState(launchProgress, elapsedTime);

        let nextX = Math.sin(elapsedTime * 0.32) * 0.08 * (1 - approachEase);
        let nextY = 0.16 + ascentEase * 4.8 - approachEase * 2.2;
        let nextZ = 6.1 - ascentEase * 0.8 - approachEase * 0.6;
        let lookAtX = 0;
        let lookAtY = rocketY + 0.35;
        let lookAtZ = rocketZ;
        let nextFov = 32 + ascentEase * 5 - approachEase * 3;

        if (approachProgress > 0) {
            nextX = Math.sin(elapsedTime * 0.18) * 0.02;
            nextY = 3.2 - approachEase * 4.6;
            nextZ = 5.58 - approachEase * 1.42;
            lookAtY = 0.05 - approachEase * 2.05;
            lookAtZ = -5.65;
            nextFov = 33 - approachEase * 1.6;
        }

        camera.position.x += (nextX - camera.position.x) * 0.06;
        camera.position.y += (nextY - camera.position.y) * 0.06;
        camera.position.z += (nextZ - camera.position.z) * 0.06;
        camera.fov += (nextFov - camera.fov) * 0.08;
        camera.updateProjectionMatrix();
        camera.lookAt(lookAtX, lookAtY, lookAtZ);
    });

    return null;
};

const LaunchScene = ({ launchProgress }) => {
    return (
        <Canvas
            dpr={[1, 1.25]}
            camera={{ position: [0, 0.16, 6.1], fov: 32 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
            <fog attach="fog" args={['#050816', 6, 16]} />
            <ambientLight intensity={1} />
            <directionalLight position={[2, 3, 3]} intensity={1.8} color="#bfdbfe" />
            <pointLight position={[0, -1.2, 2.2]} intensity={launchProgress > 0 ? 12 : 6} color="#fb923c" />
            <pointLight position={[-1.5, 0.2, 2.6]} intensity={3.4} color="#60a5fa" />

            <CameraRig launchProgress={launchProgress} />
            <StarField launchProgress={launchProgress} />
            <LandingBay launchProgress={launchProgress} />
            <SmokePlume launchProgress={launchProgress} />
            <RocketModel launchProgress={launchProgress} />
        </Canvas>
    );
};

const LandingApproachOverlay = ({ progress }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute inset-0 z-[5]"
        >
            <div
                className="absolute left-1/2 bottom-[8%] h-24 w-[18rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.18)_0%,rgba(34,211,238,0.08)_36%,transparent_72%)] blur-[18px]"
                style={{
                    opacity: 0.05 + progress * 0.1,
                }}
            />

            <div
                className="absolute left-1/2 bottom-[8.7%] h-px w-40 -translate-x-1/2 bg-[linear-gradient(90deg,transparent_0%,rgba(125,211,252,0.16)_16%,rgba(125,211,252,0.35)_50%,rgba(125,211,252,0.16)_84%,transparent_100%)]"
                style={{ opacity: 0.08 + progress * 0.12 }}
            />

            <div className="absolute inset-x-0 bottom-[6.8%] flex justify-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                    <span
                        key={`guide-${index}`}
                        className="h-1 rounded-full bg-cyan-300 blur-[1px]"
                        style={{
                            width: `${10 - Math.abs(2 - index) * 2}px`,
                            opacity: 0.05 + progress * 0.12 - Math.abs(2 - index) * 0.025,
                        }}
                    />
                ))}
            </div>

            <div
                className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,rgba(34,211,238,0)_0%,rgba(34,211,238,0.03)_52%,rgba(2,6,23,0)_100%)]"
                style={{ opacity: progress * 0.16 }}
            />
        </motion.div>
    );
};

const SkillsLaunchIntro = ({ onSkip, onLaunchStart, onApproachStart, onLaunchComplete }) => {
    const [isLaunching, setIsLaunching] = useState(false);
    const [launchProgress, setLaunchProgress] = useState(0);
    const [launchStartedAt, setLaunchStartedAt] = useState(null);
    const hasTriggeredApproachRef = useRef(false);

    useEffect(() => {
        if (!isLaunching || launchStartedAt === null) {
            return undefined;
        }

        let animationFrameId = 0;

        const updateProgress = () => {
            const elapsed = performance.now() - launchStartedAt;
            const nextProgress = clamp(elapsed / LAUNCH_DURATION_MS, 0, 1);
            setLaunchProgress(nextProgress);

            if (nextProgress < 1) {
                animationFrameId = window.requestAnimationFrame(updateProgress);
            }
        };

        animationFrameId = window.requestAnimationFrame(updateProgress);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [isLaunching, launchStartedAt]);

    useEffect(() => {
        if (!isLaunching) {
            return undefined;
        }

        const timerId = window.setTimeout(() => {
            onLaunchComplete();
        }, LAUNCH_DURATION_MS);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [isLaunching, onLaunchComplete]);

    useEffect(() => {
        if (!isLaunching || hasTriggeredApproachRef.current || launchProgress < APPROACH_START_PROGRESS) {
            return;
        }

        hasTriggeredApproachRef.current = true;
        onApproachStart();
    }, [isLaunching, launchProgress, onApproachStart]);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    const handleLaunch = () => {
        if (isLaunching) {
            return;
        }

        const startedAt = performance.now();

        hasTriggeredApproachRef.current = false;
        setLaunchProgress(0);
        setLaunchStartedAt(startedAt);
        setIsLaunching(true);
        onLaunchStart();
    };

    const approachProgress = clamp((launchProgress - APPROACH_START_PROGRESS) / (1 - APPROACH_START_PROGRESS), 0, 1);
    const sceneInsetTop = `${approachProgress * 58}%`;
    const sceneOpacity = 1 - clamp((approachProgress - 0.88) / 0.12, 0, 1) * 0.55;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            className="fixed inset-0 z-[80] overflow-hidden"
        >
            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(59,130,246,0.16),transparent_22%),radial-gradient(circle_at_50%_75%,rgba(244,114,182,0.08),transparent_30%),linear-gradient(180deg,#030712_0%,#050816_50%,#040814_100%)]"
                style={{ opacity: 1 - approachProgress * 0.92 }}
            />

            <div
                className="absolute inset-0"
                style={{
                    clipPath: `inset(${sceneInsetTop} 0 0 0)`,
                    opacity: sceneOpacity,
                }}
            >
                <LaunchScene launchProgress={launchProgress} />
            </div>

            <AnimatePresence>
                {approachProgress > 0 ? <LandingApproachOverlay progress={approachProgress} /> : null}
            </AnimatePresence>

            <div
                className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,rgba(2,6,23,0.7),rgba(2,6,23,0))]"
                style={{ opacity: 1 - approachProgress * 0.75 }}
            />
            <div
                className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,rgba(2,6,23,0),rgba(2,6,23,0.82))]"
                style={{ opacity: 1 - approachProgress * 0.72 }}
            />

            <AnimatePresence mode="wait">
                {!isLaunching ? (
                    <motion.div
                        key="controls"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={controlsVariants}
                        className="absolute inset-x-0 bottom-0 z-10 px-5 pb-8 sm:px-8 sm:pb-10"
                    >
                        <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-full border border-white/10 bg-slate-950/22 px-4 py-3 backdrop-blur-xl sm:flex-row sm:justify-center">
                            <button
                                type="button"
                                onClick={onSkip}
                                className="w-full rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-medium tracking-[0.24em] text-white/82 transition-colors hover:bg-white/[0.08] sm:w-auto"
                            >
                                ENTER DIRECT
                            </button>
                            <button
                                type="button"
                                onClick={handleLaunch}
                                className="w-full rounded-full border border-amber-300/35 bg-[linear-gradient(135deg,#ffd44d,#ffb703)] px-6 py-3 text-xs font-semibold tracking-[0.24em] text-slate-950 shadow-[0_14px_35px_rgba(255,183,3,0.24)] transition-transform hover:-translate-y-0.5 sm:w-auto"
                            >
                                LAUNCH
                            </button>
                        </div>
                    </motion.div>
                ) : approachProgress === 0 ? (
                    <motion.div
                        key="status"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={statusVariants}
                        className="absolute inset-x-0 top-7 z-10 flex justify-center px-5"
                    >
                        <div className="rounded-full border border-white/10 bg-slate-950/20 px-4 py-2 backdrop-blur-lg">
                            <p className="text-[0.65rem] uppercase tracking-[0.34em] text-sky-100/62">
                                Launch Sequence Active
                            </p>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </motion.div>
    );
};

export default SkillsLaunchIntro;
