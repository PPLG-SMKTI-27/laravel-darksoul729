import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Html, Line, OrbitControls, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

const CAREER_SPOT = 0.35;
const PROFILE_SPOT = 0.75;
const WIDE_P0 = new THREE.Vector3(-67.3956, 48.8496, 98.0423);
const WIDE_LOOK = new THREE.Vector3(10.1721, 1.6291, -11.5245);
const CAREER_P0 = new THREE.Vector3(1.9085, 25.4901, 31.1023);
const CAREER_LOOK = new THREE.Vector3(-0.3969, 18.1208, -31.9780);
const PROFILE_P0 = new THREE.Vector3(-24.9697, 22.9384, 15.9114);
const PROFILE_LOOK = new THREE.Vector3(-0.6329, 20.0025, 15.2956);
const SKY_OFFSET = new THREE.Vector3(0, 60, 0);
const CLOUD_BREAK_OFFSET = new THREE.Vector3(0, 24, 0);
const CAMERA_PRESETS = {
    wide: { position: WIDE_P0, look: WIDE_LOOK, progress: 0 },
    career: { position: CAREER_P0, look: CAREER_LOOK, progress: CAREER_SPOT },
    profile: { position: PROFILE_P0, look: PROFILE_LOOK, progress: PROFILE_SPOT },
};
const DEFAULT_MANUAL_ANCHORS = {
    career: [30.2, 20.3, -13.4],
    profile: [33.1, 20.6, -10.9],
};
const ALWAYS_HIDDEN_TRANSITION_MESHES = new Set(['Plane']);
const TRANSITION_PLANE_PATTERN = /(^plane($|\.))|(_plane\.)|haze|mask|cover|helper|debug/i;

const clamp01 = (value) => {
    if (!Number.isFinite(value)) {
        return 0;
    }

    return Math.max(0, Math.min(1, value));
};

const getHorizontalDistance = (pointA, pointB) => {
    return Math.hypot(pointA.x - pointB.x, pointA.z - pointB.z);
};

const getPresetKeyFromSpot = (activeSpot) => {
    if (activeSpot === 'career') {
        return 'career';
    }

    if (activeSpot === 'profile') {
        return 'profile';
    }

    return 'wide';
};

const getTransition = (fromSpot, toSpot) => {
    const key = `${fromSpot}->${toSpot}`;
    const transitions = {
        'wide->career': { duration: 1.8, ease: 'power3.inOut' },
        'wide->profile': { duration: 1.8, ease: 'power3.inOut' },
        'career->profile': { duration: 1.2, ease: 'power2.inOut' },
        'profile->career': { duration: 1.2, ease: 'power2.inOut' },
        'career->wide': { duration: 1.4, ease: 'power2.inOut' },
        'profile->wide': { duration: 1.4, ease: 'power2.inOut' },
    };

    return transitions[key] ?? { duration: 1.4, ease: 'power2.inOut' };
};

const RoomTour = ({
    phase,
    targetProgress,
    transitionProgress,
    transitionShake = 0,
    fogFactor,
    worldLoadT = 0,
    isWorldLoading = false,
    debug,
    calibrationMode = false,
    careerItems = [],
    showCareerCard,
    showProfileCard,
    onCloseCareerCard,
    onCloseProfileCard,
    onRoomReady,
    onSmoothedProgress,
    onConfigReady,
    requestedSpot = 'wide',
    onSpotChange,
    onNavAnimatingChange,
}) => {
    const { scene: loadedScene } = useGLTF('/3d/Room.glb');
    const roomScene = useMemo(() => {
        const nextScene = loadedScene.clone(true);

        nextScene.traverse((node) => {
            if (!node?.isMesh || !node.name) {
                return;
            }

            if (TRANSITION_PLANE_PATTERN.test(node.name)) {
                node.userData.isTransitionPlane = true;
            }

            if (ALWAYS_HIDDEN_TRANSITION_MESHES.has(node.name)) {
                node.visible = false;
                node.frustumCulled = false;
                node.userData.forceHidden = true;
            }
        });

        return nextScene;
    }, [loadedScene]);

    const { camera, scene } = useThree();
    const orbitControlsRef = useRef(null);
    const raycasterRef = useRef(new THREE.Raycaster());
    const calibrationInitializedRef = useRef(false);
    const calibrationDirectionRef = useRef(new THREE.Vector3());
    const crosshairFeedbackTimerRef = useRef(null);
    const fogRef = useRef(new THREE.FogExp2('#dcecff', 0.01));
    const roomMetricsRef = useRef(null);
    const cameraPathRef = useRef(null);
    const lookPathRef = useRef(null);
    const lookTargetRef = useRef(WIDE_LOOK.clone());
    const shakeOffsetRef = useRef(new THREE.Vector3());
    const currentSpotRef = useRef('wide');
    const navTweenRef = useRef(null);
    const navAnimatingRef = useRef(false);
    const smoothedProgressRef = useRef(0);
    const lastReportedRef = useRef(-1);

    const [debugData, setDebugData] = useState(null);
    const [anchorPositions, setAnchorPositions] = useState({
        career: null,
        profile: null,
    });
    const [manualAnchors, setManualAnchors] = useState(DEFAULT_MANUAL_ANCHORS);
    const [selectedAnchor, setSelectedAnchor] = useState('career');
    const [calibrationLookAt, setCalibrationLookAt] = useState(WIDE_LOOK.toArray());
    const [crosshairFeedbackPoint, setCrosshairFeedbackPoint] = useState(null);
    const calibrationLookAtRef = useRef(WIDE_LOOK.toArray());
    const debugBoxHelper = useMemo(() => {
        if (!debugData?.boundingMin || !debugData?.boundingMax) {
            return null;
        }

        const helperBox = new THREE.Box3(
            new THREE.Vector3(...debugData.boundingMin),
            new THREE.Vector3(...debugData.boundingMax),
        );

        return new THREE.Box3Helper(helperBox, '#22d3ee');
    }, [debugData]);

    useEffect(() => {
        return () => {
            if (!debugBoxHelper) {
                return;
            }

            debugBoxHelper.geometry.dispose();
            debugBoxHelper.material.dispose();
        };
    }, [debugBoxHelper]);

    useEffect(() => {
        return () => {
            if (crosshairFeedbackTimerRef.current) {
                window.clearTimeout(crosshairFeedbackTimerRef.current);
                crosshairFeedbackTimerRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        return () => {
            navTweenRef.current?.kill();
            navAnimatingRef.current = false;
            if (onNavAnimatingChange) {
                onNavAnimatingChange(false);
            }
        };
    }, [onNavAnimatingChange]);

    useEffect(() => {
        if (!calibrationMode) {
            calibrationInitializedRef.current = false;
            return;
        }

        navTweenRef.current?.kill();
        navAnimatingRef.current = false;
        if (onNavAnimatingChange) {
            onNavAnimatingChange(false);
        }
        calibrationInitializedRef.current = false;
    }, [calibrationMode, onNavAnimatingChange]);

    useEffect(() => {
        if (!calibrationMode) {
            return undefined;
        }

        const nudge = 0.08;
        const printAnchors = (anchors) => {
            console.info('[RoomTour] MANUAL_ANCHORS =', JSON.stringify(anchors, null, 2));
        };

        const updateAnchor = (axis, delta) => {
            setManualAnchors((previousAnchors) => {
                const nextAnchors = {
                    ...previousAnchors,
                    [selectedAnchor]: [...previousAnchors[selectedAnchor]],
                };
                const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
                nextAnchors[selectedAnchor][axisIndex] = Number((nextAnchors[selectedAnchor][axisIndex] + delta).toFixed(4));
                printAnchors(nextAnchors);
                return nextAnchors;
            });
        };

        const onKeyDown = (event) => {
            if (event.key === '1') {
                setSelectedAnchor('career');
                return;
            }

            if (event.key === '2') {
                setSelectedAnchor('profile');
                return;
            }

            if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                return;
            }

            event.preventDefault();
            if (event.shiftKey) {
                if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
                    updateAnchor('y', nudge);
                } else {
                    updateAnchor('y', -nudge);
                }
                return;
            }

            if (event.key === 'ArrowUp') {
                updateAnchor('z', -nudge);
            } else if (event.key === 'ArrowDown') {
                updateAnchor('z', nudge);
            } else if (event.key === 'ArrowLeft') {
                updateAnchor('x', -nudge);
            } else if (event.key === 'ArrowRight') {
                updateAnchor('x', nudge);
            }
        };

        window.addEventListener('keydown', onKeyDown, { passive: false });
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [calibrationMode, selectedAnchor]);

    const toCodeVector = (vector) => {
        return `new THREE.Vector3(${vector.x.toFixed(4)}, ${vector.y.toFixed(4)}, ${vector.z.toFixed(4)})`;
    };

    const copyText = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            console.info('[RoomTour] clipboard write failed, copy manually:\n' + text, error);
        }
        console.info('[RoomTour] calibration copy:\n' + text);
    };

    const setCalibrationLookAtSafe = (nextTarget) => {
        const nextArray = [nextTarget.x, nextTarget.y, nextTarget.z];
        const previous = calibrationLookAtRef.current;
        const changed = Math.abs(nextArray[0] - previous[0]) > 0.0005
            || Math.abs(nextArray[1] - previous[1]) > 0.0005
            || Math.abs(nextArray[2] - previous[2]) > 0.0005;

        if (!changed) {
            return;
        }

        calibrationLookAtRef.current = nextArray;
        setCalibrationLookAt(nextArray);
    };

    const handleCopyBoth = async () => {
        const target = orbitControlsRef.current?.target ?? new THREE.Vector3(...calibrationLookAt);
        await copyText(
            `MANUAL_P0 = ${toCodeVector(camera.position)}\nMANUAL_LOOK = ${toCodeVector(target)}`,
        );
    };

    const handleSetLookAtToCrosshair = () => {
        const raycaster = raycasterRef.current;
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        const intersections = raycaster.intersectObject(roomScene, true);
        if (intersections.length === 0 || !orbitControlsRef.current) {
            return;
        }

        const hitPoint = intersections[0].point.clone();
        orbitControlsRef.current.target.copy(hitPoint);
        setCalibrationLookAtSafe(hitPoint);
        orbitControlsRef.current.update();
        setCrosshairFeedbackPoint(hitPoint.toArray());
        if (crosshairFeedbackTimerRef.current) {
            window.clearTimeout(crosshairFeedbackTimerRef.current);
        }
        crosshairFeedbackTimerRef.current = window.setTimeout(() => {
            setCrosshairFeedbackPoint(null);
            crosshairFeedbackTimerRef.current = null;
        }, 700);
    };

    const handleExitCalibration = () => {
        if (typeof window === 'undefined') {
            return;
        }

        const url = new URL(window.location.href);
        url.searchParams.delete('calibrate');
        window.location.href = url.toString();
    };

    useEffect(() => {
        roomScene.traverse((node) => {
            if (!node?.isMesh || !node.userData.isTransitionPlane || node.userData.forceHidden) {
                return;
            }

            node.visible = phase !== 'transition';
        });
    }, [phase, roomScene]);

    useEffect(() => {
        roomScene.updateWorldMatrix(true, true);
        const anchorCareer = new THREE.Vector3(...manualAnchors.career);
        const anchorProfile = new THREE.Vector3(...manualAnchors.profile);
        const anchorMid = anchorCareer.clone().add(anchorProfile).multiplyScalar(0.5);
        const anchorsDistance = getHorizontalDistance(anchorCareer, anchorProfile);
        const maxDim = Math.max(anchorsDistance * 2.8, 8);
        const size = new THREE.Vector3(maxDim, Math.max(4.5, maxDim * 0.46), maxDim);
        const center = anchorMid.clone().add(new THREE.Vector3(0, -size.y * 0.28, 0));
        const diag = maxDim;
        const clipNear = 0.1;
        const clipFar = 1200;

        const debugBounding = new THREE.Box3(
            center.clone().sub(size.clone().multiplyScalar(0.5)),
            center.clone().add(size.clone().multiplyScalar(0.5)),
        );

        console.info('[RoomTour] manual anchors active:', {
            career: manualAnchors.career,
            profile: manualAnchors.profile,
            selected: selectedAnchor,
            WIDE_P0: WIDE_P0.toArray(),
            WIDE_LOOK: WIDE_LOOK.toArray(),
            CAREER_P0: CAREER_P0.toArray(),
            CAREER_LOOK: CAREER_LOOK.toArray(),
            PROFILE_P0: PROFILE_P0.toArray(),
            PROFILE_LOOK: PROFILE_LOOK.toArray(),
        });
        console.info('[RoomTour] stable room metrics:', {
            center: center.toArray(),
            size: size.toArray(),
            maxDim,
        });

        const p0 = WIDE_P0.clone();
        const p1 = CAREER_P0.clone();
        const p2 = PROFILE_P0.clone();
        const l0 = WIDE_LOOK.clone();
        const l1 = CAREER_LOOK.clone();
        const l2 = PROFILE_LOOK.clone();
        const introPosition = p0.clone().add(SKY_OFFSET);
        const preCloudPosition = p0.clone().add(CLOUD_BREAK_OFFSET);
        const introLook = l0.clone();

        camera.near = clipNear;
        camera.far = clipFar;
        if (!calibrationMode) {
            lookTargetRef.current.copy(introLook);
            camera.position.copy(introPosition);
            camera.lookAt(lookTargetRef.current);
            camera.updateProjectionMatrix();
        }

        cameraPathRef.current = new THREE.CatmullRomCurve3([p0, p1, p2], false, 'catmullrom', 0.35);
        lookPathRef.current = new THREE.CatmullRomCurve3([l0, l1, l2], false, 'catmullrom', 0.2);

        roomMetricsRef.current = {
            center,
            size,
            diag,
            p0,
            l0,
            anchorCareer,
            anchorProfile,
            introPosition,
            preCloudPosition,
            introLook,
        };
        setAnchorPositions({
            career: anchorCareer.toArray(),
            profile: anchorProfile.toArray(),
        });

        if (debug) {
            setDebugData({
                pathPoints: [p0.toArray(), p1.toArray(), p2.toArray()],
                markerPoints: [p0.toArray(), p1.toArray(), p2.toArray()],
                markerRadius: Math.max(diag * 0.012, 0.05),
                boundingMin: debugBounding.min.toArray(),
                boundingMax: debugBounding.max.toArray(),
            });
        } else {
            setDebugData(null);
        }

        if (onConfigReady) {
            onConfigReady({
                center: center.toArray(),
                size: size.toArray(),
                diag,
                maxDim,
                clipNear,
                clipFar,
                careerSpot: CAREER_SPOT,
                profileSpot: PROFILE_SPOT,
                anchors: {
                    profile: anchorProfile.toArray(),
                    career: anchorCareer.toArray(),
                },
                points: {
                    p0: p0.toArray(),
                    p1: p1.toArray(),
                    p2: p2.toArray(),
                    l0: l0.toArray(),
                    l1: l1.toArray(),
                    l2: l2.toArray(),
                },
            });
        }

        if (onRoomReady) {
            onRoomReady(true);
        }
    }, [calibrationMode, camera, debug, manualAnchors, onConfigReady, onRoomReady, roomScene, selectedAnchor]);

    useEffect(() => {
        return () => {
            scene.fog = null;
        };
    }, [scene]);

    useEffect(() => {
        if (calibrationMode || phase !== 'tour' || !roomMetricsRef.current) {
            return;
        }

        const metrics = roomMetricsRef.current;
        currentSpotRef.current = 'wide';
        smoothedProgressRef.current = CAMERA_PRESETS.wide.progress;
        lookTargetRef.current.copy(CAMERA_PRESETS.wide.look);
        camera.position.copy(metrics.p0);
        camera.lookAt(lookTargetRef.current);
        camera.updateProjectionMatrix();
        if (onSmoothedProgress) {
            onSmoothedProgress(CAMERA_PRESETS.wide.progress);
        }
        if (onSpotChange) {
            onSpotChange('wide');
        }
    }, [calibrationMode, camera, onSmoothedProgress, onSpotChange, phase]);

    useEffect(() => {
        if (calibrationMode || phase !== 'tour' || !requestedSpot) {
            return;
        }

        const presetKey = getPresetKeyFromSpot(requestedSpot);
        const preset = CAMERA_PRESETS[presetKey];
        const fromSpot = currentSpotRef.current;
        const destinationPosition = preset.position;
        const destinationLook = preset.look;
        const positionDelta = camera.position.distanceTo(destinationPosition);
        const lookDelta = lookTargetRef.current.distanceTo(destinationLook);
        const isSameSpot = fromSpot === presetKey;

        if (isSameSpot || (positionDelta < 0.001 && lookDelta < 0.001)) {
            currentSpotRef.current = presetKey;
            navAnimatingRef.current = false;
            if (onNavAnimatingChange) {
                onNavAnimatingChange(false);
            }
            if (onSpotChange) {
                onSpotChange(presetKey);
            }
            return;
        }

        const transition = getTransition(fromSpot, presetKey);
        navTweenRef.current?.kill();
        navAnimatingRef.current = true;
        if (onNavAnimatingChange) {
            onNavAnimatingChange(true);
        }

        const tweenTimeline = gsap.timeline({
            defaults: { duration: transition.duration, ease: transition.ease },
            onComplete: () => {
                currentSpotRef.current = presetKey;
                navAnimatingRef.current = false;
                smoothedProgressRef.current = preset.progress;
                lookTargetRef.current.copy(destinationLook);
                camera.lookAt(lookTargetRef.current);
                if (onSmoothedProgress) {
                    lastReportedRef.current = preset.progress;
                    onSmoothedProgress(preset.progress);
                }
                if (onNavAnimatingChange) {
                    onNavAnimatingChange(false);
                }
                if (onSpotChange) {
                    onSpotChange(presetKey);
                }
            },
        });

        tweenTimeline.to(camera.position, {
            x: destinationPosition.x,
            y: destinationPosition.y,
            z: destinationPosition.z,
        }, 0);
        tweenTimeline.to(lookTargetRef.current, {
            x: destinationLook.x,
            y: destinationLook.y,
            z: destinationLook.z,
            onUpdate: () => {
                camera.lookAt(lookTargetRef.current);
            },
        }, 0);
        navTweenRef.current = tweenTimeline;

        return () => {
            navTweenRef.current?.kill();
            navAnimatingRef.current = false;
            if (onNavAnimatingChange) {
                onNavAnimatingChange(false);
            }
        };
    }, [requestedSpot, calibrationMode, camera, onNavAnimatingChange, onSmoothedProgress, onSpotChange, phase]);

    useFrame((state, delta) => {
        const metrics = roomMetricsRef.current;
        if (!metrics || !cameraPathRef.current || !lookPathRef.current) {
            return;
        }

        const syncSceneFog = () => {
            if (phase === 'tour') {
                const worldLoadFog = clamp01(isWorldLoading ? Math.max(worldLoadT, 0.0001) : worldLoadT);
                if (worldLoadFog <= 0.0001) {
                    if (scene.fog) {
                        scene.fog = null;
                        scene.background.set('#8ec5ff');
                    }
                    return;
                }

                const fog = fogRef.current;
                fog.color.set('#cbe1ff');
                fog.density = THREE.MathUtils.lerp(0.012, 0, 1 - worldLoadFog);
                scene.fog = fog;

                const baseSky = new THREE.Color('#8ec5ff');
                const fogSky = new THREE.Color('#cbe1ff');
                scene.background.lerpColors(baseSky, fogSky, worldLoadFog);

                return;
            }

            const fog = fogRef.current;
            fog.color.set('#dcecff');
            fog.density = THREE.MathUtils.lerp(0.003, 0.042, clamp01(fogFactor));
            scene.fog = fog;
            scene.background.set('#8ec5ff');
        };

        if (calibrationMode) {
            if (orbitControlsRef.current) {
                if (!calibrationInitializedRef.current) {
                    camera.getWorldDirection(calibrationDirectionRef.current);
                    const neutralTarget = camera.position.clone().add(calibrationDirectionRef.current.clone().multiplyScalar(5));
                    orbitControlsRef.current.target.copy(neutralTarget);
                    setCalibrationLookAtSafe(neutralTarget);
                    calibrationInitializedRef.current = true;
                }

                orbitControlsRef.current.update();
                setCalibrationLookAtSafe(orbitControlsRef.current.target);
            }

            if (scene.fog) {
                scene.fog = null;
            }
            return;
        }

        if (navAnimatingRef.current) {
            camera.lookAt(lookTargetRef.current);
            syncSceneFog();
            return;
        }

        const allowScrollDrive = phase === 'tour' && currentSpotRef.current === 'wide';
        const rawTarget = allowScrollDrive
            ? clamp01(targetProgress)
            : CAMERA_PRESETS[currentSpotRef.current].progress;

        if (phase === 'tour') {
            smoothedProgressRef.current = THREE.MathUtils.lerp(smoothedProgressRef.current, rawTarget, 0.18);
        } else {
            smoothedProgressRef.current = THREE.MathUtils.lerp(smoothedProgressRef.current, 0, 0.22);
        }
        smoothedProgressRef.current = clamp01(smoothedProgressRef.current);

        const pathPos = cameraPathRef.current.getPointAt(smoothedProgressRef.current);
        const lookPos = lookPathRef.current.getPointAt(smoothedProgressRef.current);

        const safeTransitionProgress = clamp01(transitionProgress);
        const transitionBlend = THREE.MathUtils.smoothstep(safeTransitionProgress, 0, 1);

        let desiredPosition = pathPos;
        let desiredLook = lookPos;

        if (phase === 'intro') {
            desiredPosition = metrics.introPosition;
            desiredLook = metrics.introLook;
        }

        if (phase === 'transition') {
            const fallCutoff = 0.62;
            if (safeTransitionProgress < fallCutoff) {
                const firstStageProgress = clamp01(safeTransitionProgress / fallCutoff);
                desiredPosition = metrics.introPosition.clone().lerp(
                    metrics.preCloudPosition,
                    THREE.MathUtils.smoothstep(firstStageProgress, 0, 1),
                );
                desiredLook = metrics.introLook.clone().lerp(metrics.l0, firstStageProgress * 0.65);
            } else {
                const secondStageProgress = clamp01((safeTransitionProgress - fallCutoff) / (1 - fallCutoff));
                desiredPosition = metrics.preCloudPosition.clone().lerp(
                    metrics.p0,
                    THREE.MathUtils.smoothstep(secondStageProgress, 0, 1),
                );
                desiredLook = metrics.introLook.clone().lerp(metrics.l0, transitionBlend);
            }

            if (transitionShake > 0.0001) {
                const elapsed = state.clock.elapsedTime;
                shakeOffsetRef.current.set(
                    Math.sin(elapsed * 39.7) * 0.08 * transitionShake,
                    Math.cos(elapsed * 47.3) * 0.05 * transitionShake,
                    Math.sin(elapsed * 43.5 + 1.6) * 0.08 * transitionShake,
                );
                desiredPosition.add(shakeOffsetRef.current);
            }

            if (safeTransitionProgress >= 0.999) {
                desiredPosition = metrics.p0.clone();
                desiredLook = metrics.l0.clone();
                shakeOffsetRef.current.set(0, 0, 0);
            }
        }

        camera.position.lerp(desiredPosition, 1 - Math.exp(-delta * 7));
        lookTargetRef.current.lerp(desiredLook, 1 - Math.exp(-delta * 7));

        camera.lookAt(lookTargetRef.current);

        syncSceneFog();

        if (onSmoothedProgress && Math.abs(smoothedProgressRef.current - lastReportedRef.current) > 0.002) {
            lastReportedRef.current = smoothedProgressRef.current;
            onSmoothedProgress(smoothedProgressRef.current);
        }
    });

    return (
        <>
            {calibrationMode && (
                <OrbitControls
                    ref={orbitControlsRef}
                    makeDefault
                    enabled={phase === 'tour'}
                    enablePan
                    enableRotate
                    enableZoom
                    screenSpacePanning
                    minDistance={1}
                    maxDistance={200}
                    enableDamping
                    dampingFactor={0.08}
                    rotateSpeed={0.7}
                    panSpeed={0.9}
                />
            )}

            <primitive object={roomScene} />

            {debug && debugData && (
                <>
                    <Line points={debugData.pathPoints} color="#fb923c" lineWidth={2} />
                    {debugBoxHelper && <primitive object={debugBoxHelper} />}
                    {debugData.markerPoints.map((point, index) => {
                        const colors = ['#22d3ee', '#4ade80', '#f472b6'];

                        return (
                            <mesh key={`marker-${index}`} position={point}>
                                <sphereGeometry args={[debugData.markerRadius, 20, 20]} />
                                <meshBasicMaterial color={colors[index]} />
                            </mesh>
                        );
                    })}
                </>
            )}

            {debug && anchorPositions.career && (
                <>
                    <mesh position={anchorPositions.career}>
                        <sphereGeometry args={[0.09, 18, 18]} />
                        <meshBasicMaterial color="#22d3ee" />
                    </mesh>
                    <Html transform position={anchorPositions.career} distanceFactor={9} style={{ pointerEvents: 'none' }}>
                        <div className="rounded bg-cyan-500/90 px-1.5 py-0.5 text-[10px] font-black text-white">TV</div>
                    </Html>
                </>
            )}

            {debug && anchorPositions.profile && (
                <>
                    <mesh position={anchorPositions.profile}>
                        <sphereGeometry args={[0.09, 18, 18]} />
                        <meshBasicMaterial color="#f472b6" />
                    </mesh>
                    <Html transform position={anchorPositions.profile} distanceFactor={9} style={{ pointerEvents: 'none' }}>
                        <div className="rounded bg-pink-500/90 px-1.5 py-0.5 text-[10px] font-black text-white">BOARD</div>
                    </Html>
                </>
            )}

            {debug && (
                <Html fullscreen style={{ pointerEvents: 'none' }}>
                    <div
                        style={{
                            position: 'absolute',
                            left: 12,
                            bottom: 12,
                            zIndex: 1000,
                            borderRadius: 10,
                            border: '1px solid rgba(148,163,184,0.7)',
                            background: 'rgba(15,23,42,0.82)',
                            padding: '8px 10px',
                            color: '#e2e8f0',
                            fontFamily: 'monospace',
                            fontSize: 11,
                            lineHeight: 1.45,
                        }}
                    >
                        <div>Anchor Edit: `1` TV, `2` BOARD</div>
                        <div>Nudge: `Arrow` X/Z, `Shift+Arrow` Y</div>
                        <div>Selected: {selectedAnchor === 'career' ? 'TV' : 'BOARD'}</div>
                        <div>TV: [{manualAnchors.career.map((value) => value.toFixed(3)).join(', ')}]</div>
                        <div>BOARD: [{manualAnchors.profile.map((value) => value.toFixed(3)).join(', ')}]</div>
                    </div>
                </Html>
            )}

            {calibrationMode && (
                <Html fullscreen style={{ pointerEvents: 'none' }}>
                    <div
                        style={{
                            position: 'absolute',
                            right: 12,
                            top: 12,
                            zIndex: 1001,
                            width: 280,
                            borderRadius: 10,
                            border: '1px solid rgba(148,163,184,0.7)',
                            background: 'rgba(15,23,42,0.84)',
                            padding: '10px 10px',
                            color: '#e2e8f0',
                            fontFamily: 'monospace',
                            fontSize: 11,
                            lineHeight: 1.45,
                            pointerEvents: 'auto',
                        }}
                    >
                        <div style={{ marginBottom: 6, fontWeight: 700 }}>Calibration Mode</div>
                        <div style={{ marginBottom: 8 }}>
                            cam: [{camera.position.x.toFixed(4)}, {camera.position.y.toFixed(4)}, {camera.position.z.toFixed(4)}]
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            look: [{calibrationLookAt.map((value) => value.toFixed(4)).join(', ')}]
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            <button type="button" onClick={handleSetLookAtToCrosshair} className="rounded bg-slate-700 px-2 py-1 text-[10px] font-semibold text-white">Set target from crosshair</button>
                            <button type="button" onClick={handleCopyBoth} className="rounded bg-cyan-400 px-2 py-1 text-[10px] font-semibold text-slate-900">Copy Both</button>
                            <button type="button" onClick={handleExitCalibration} className="rounded bg-rose-500 px-2 py-1 text-[10px] font-semibold text-white">Exit calibrate</button>
                        </div>
                    </div>
                </Html>
            )}

            {crosshairFeedbackPoint && (
                <mesh position={crosshairFeedbackPoint}>
                    <sphereGeometry args={[0.07, 16, 16]} />
                    <meshBasicMaterial color="#38bdf8" transparent opacity={0.95} />
                </mesh>
            )}

            {anchorPositions.profile && showProfileCard && (
                <Html
                    transform
                    position={anchorPositions.profile}
                    distanceFactor={8}
                    occlude
                    style={{ pointerEvents: 'auto' }}
                >
                    <article className="w-64 rounded-xl border border-white/50 bg-white/90 p-3 shadow-2xl backdrop-blur">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-900">Profilee sayaa</h3>
                            <button
                                type="button"
                                onClick={onCloseProfileCard}
                                className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-200"
                            >
                                Close
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <img
                                src="https://picsum.photos/seed/about-profile-anchor/160/160"
                                alt="Profile placeholder"
                                className="h-14 w-14 rounded-xl border border-slate-200 object-cover"
                                loading="lazy"
                            />
                            <p className="text-[11px] leading-relaxed text-slate-700">
                                Full-stack engineer with focus on interactive 3D UI, clean architecture, and performance.
                            </p>
                        </div>
                    </article>
                </Html>
            )}

            {anchorPositions.career && showCareerCard && (
                <Html
                    transform
                    position={anchorPositions.career}
                    distanceFactor={8.5}
                    occlude
                    style={{ pointerEvents: 'auto' }}
                >
                    <article className="w-72 rounded-xl border border-white/45 bg-slate-950/88 p-3 text-white shadow-2xl backdrop-blur">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-sm font-black text-cyan-300">Career Journery saya</h3>
                            <button
                                type="button"
                                onClick={onCloseCareerCard}
                                className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white/90 hover:bg-white/25"
                            >
                                Close
                            </button>
                        </div>
                        <div className="flex max-h-40 flex-col gap-2 overflow-y-auto pr-1">
                            {careerItems.map((item) => {
                                return (
                                    <div key={`${item.year}-${item.title}`} className="rounded-lg border border-cyan-400/25 bg-white/5 p-2">
                                        <p className="text-[10px] font-bold uppercase tracking-wide text-cyan-300">{item.year}</p>
                                        <p className="mt-0.5 text-xs font-semibold text-white">{item.title}</p>
                                        <p className="mt-0.5 text-[11px] leading-relaxed text-slate-200">{item.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </article>
                </Html>
            )}
        </>
    );
};

useGLTF.preload('/3d/Room.glb');

export default RoomTour;
