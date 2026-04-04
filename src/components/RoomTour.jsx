import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Clouds, Cloud, Html, Line, OrbitControls, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

const CAREER_SPOT = 0.35;
const PROFILE_SPOT = 0.75;
const ARRIVAL_PROGRESS = -0.18;
const WIDE_P0 = new THREE.Vector3(-67.3956, 48.8496, 98.0423);
const WIDE_LOOK = new THREE.Vector3(10.1721, 1.6291, -11.5245);
const CAREER_P0 = new THREE.Vector3(1.9085, 25.4901, 31.1023);
const CAREER_LOOK = new THREE.Vector3(-0.3969, 18.1208, -31.9780);
const PROFILE_P0 = new THREE.Vector3(-24.9697, 22.9384, 15.9114);
const PROFILE_LOOK = new THREE.Vector3(-0.6329, 20.0025, 15.2956);
const TV_MESH_NAME = 'Cube_Cube001-Mesh';
const TV_PIXELS_PER_UNIT = 40;
const TV_SCREEN_SCALE = 0.82;
const BOARD_MESH_NAME = 'Plane002_Plane009-Mesh_1';
const BOARD_PIXELS_PER_UNIT = 46;
const BOARD_SCREEN_SCALE = 0.63;
const BOARD_OFFSET_X = -0.005;
const BOARD_OFFSET_Y = -0.005;
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
const HERO_MESH_PATTERN = /(desk|table|monitor|screen|board|chair|lamp|computer|keyboard|mouse|tv)/i;
const SHELL_MESH_PATTERN = /(wall|floor|ceiling|window|frame|room|door)/i;

const clamp01 = (value) => {
    if (!Number.isFinite(value)) {
        return 0;
    }

    return Math.max(0, Math.min(1, value));
};

const clampWideTourProgress = (value) => {
    if (!Number.isFinite(value)) {
        return ARRIVAL_PROGRESS;
    }

    return Math.max(ARRIVAL_PROGRESS, Math.min(1, value));
};

const getMaterialList = (material) => {
    if (!material) {
        return [];
    }

    return Array.isArray(material) ? material : [material];
};

const cloneMeshMaterials = (mesh) => {
    const clonedMaterials = getMaterialList(mesh.material).map((material) => {
        const nextMaterial = material.clone();
        nextMaterial.transparent = true;
        return nextMaterial;
    });

    mesh.material = Array.isArray(mesh.material) ? clonedMaterials : clonedMaterials[0];
    mesh.userData.materialStates = clonedMaterials.map((material) => ({
        material,
        baseOpacity: material.opacity ?? 1,
        baseEmissiveIntensity: typeof material.emissiveIntensity === 'number' ? material.emissiveIntensity : null,
    }));
};

const setMeshRevealState = (mesh, reveal) => {
    const materialStates = mesh.userData.materialStates ?? [];
    const basePosition = mesh.userData.basePosition;
    const baseScale = mesh.userData.baseScale;
    const revealShift = mesh.userData.revealShift;
    const scaleStart = mesh.userData.revealScaleStart ?? 0.95;
    const easedReveal = THREE.MathUtils.smootherstep(clamp01(reveal), 0, 1);

    materialStates.forEach(({ material, baseOpacity, baseEmissiveIntensity }) => {
        material.opacity = THREE.MathUtils.lerp(baseOpacity * 0.02, baseOpacity, easedReveal);

        if (baseEmissiveIntensity !== null) {
            material.emissiveIntensity = THREE.MathUtils.lerp(baseEmissiveIntensity * 0.25, baseEmissiveIntensity, easedReveal);
        }
    });

    if (baseScale) {
        const meshScale = THREE.MathUtils.lerp(scaleStart, 1, easedReveal);
        mesh.scale.set(
            baseScale.x * meshScale,
            baseScale.y * meshScale,
            baseScale.z * meshScale,
        );
    }

    if (basePosition && revealShift) {
        const shiftProgress = 1 - easedReveal;
        mesh.position.set(
            basePosition.x + revealShift.x * shiftProgress,
            basePosition.y + revealShift.y * shiftProgress,
            basePosition.z + revealShift.z * shiftProgress,
        );
    }
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

const getMeshWorldCenter = (scene, meshName) => {
    if (!scene) {
        return null;
    }

    let targetMesh = null;
    scene.traverse((node) => {
        if (node?.isMesh && node.name === meshName) {
            targetMesh = node;
        }
    });

    if (!targetMesh) {
        return null;
    }

    const bounds = new THREE.Box3().setFromObject(targetMesh);
    const center = new THREE.Vector3();
    bounds.getCenter(center);
    return center;
};

const getTvScreenData = (scene, meshName) => {
    if (!scene) {
        return null;
    }

    let targetMesh = null;
    scene.traverse((node) => {
        if (node?.isMesh && node.name === meshName) {
            targetMesh = node;
        }
    });

    if (!targetMesh) {
        return null;
    }

    const bounds = new THREE.Box3().setFromObject(targetMesh);
    const center = new THREE.Vector3();
    bounds.getCenter(center);

    if (targetMesh.geometry && !targetMesh.geometry.boundingBox) {
        targetMesh.geometry.computeBoundingBox();
    }

    const localSize = new THREE.Vector3();
    targetMesh.geometry?.boundingBox?.getSize(localSize);
    const worldScale = new THREE.Vector3();
    targetMesh.getWorldScale(worldScale);

    const axisSizes = {
        x: localSize.x * worldScale.x,
        y: localSize.y * worldScale.y,
        z: localSize.z * worldScale.z,
    };

    const quaternion = new THREE.Quaternion();
    targetMesh.getWorldQuaternion(quaternion);
    const axisX = new THREE.Vector3(1, 0, 0).applyQuaternion(quaternion);
    const axisY = new THREE.Vector3(0, 1, 0).applyQuaternion(quaternion);
    const axisZ = new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion);
    const axes = [
        { key: 'x', size: axisSizes.x, dir: axisX },
        { key: 'y', size: axisSizes.y, dir: axisY },
        { key: 'z', size: axisSizes.z, dir: axisZ },
    ].sort((a, b) => a.size - b.size);

    const thicknessAxis = axes[0];
    const heightAxis = axes[1];
    const widthAxis = axes[2];
    let widthDir = widthAxis.dir.clone().normalize();
    let heightDir = heightAxis.dir.clone().normalize();
    if (widthDir.dot(new THREE.Vector3(1, 0, 0)) < 0) {
        widthDir = widthDir.negate();
    }
    if (heightDir.dot(new THREE.Vector3(0, 1, 0)) < 0) {
        heightDir = heightDir.negate();
    }
    let normalDir = new THREE.Vector3().crossVectors(widthDir, heightDir).normalize();
    if (normalDir.dot(thicknessAxis.dir) < 0) {
        normalDir = normalDir.negate();
    }

    const rotationMatrix = new THREE.Matrix4().makeBasis(widthDir, heightDir, normalDir);
    const rotation = new THREE.Euler().setFromRotationMatrix(rotationMatrix);

    return {
        center: center.toArray(),
        width: widthAxis.size,
        height: heightAxis.size,
        thickness: Math.max(thicknessAxis.size, 0.01),
        rotation: [rotation.x, rotation.y, rotation.z],
        normal: normalDir.toArray(),
        widthDir: widthDir.toArray(),
        heightDir: heightDir.toArray(),
    };
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
    isLowPowerMode = false,
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

            cloneMeshMaterials(node);
            node.userData.basePosition = node.position.clone();
            node.userData.baseScale = node.scale.clone();
            node.renderOrder = 2;
        });

        return nextScene;
    }, [loadedScene]);

    const { camera, scene, gl, size = { width: 1, height: 1 } } = useThree();

    useEffect(() => {
        if (!camera) return;

        const aspect = size.width / Math.max(size.height, 1);

        if (aspect < 1) {
            const fovIncrease = (1 - aspect) * 78; // even wider multiplier for very tall screens
            camera.fov = 46 + fovIncrease;
        } else {
            camera.fov = 46;
        }

        camera.updateProjectionMatrix();
    }, [size.width, size.height, camera]);
    const orbitControlsRef = useRef(null);
    const raycasterRef = useRef(new THREE.Raycaster());
    const calibrationInitializedRef = useRef(false);
    const calibrationDirectionRef = useRef(new THREE.Vector3());
    const crosshairFeedbackTimerRef = useRef(null);
    const fogRef = useRef(new THREE.FogExp2('#dcecff', 0.01));
    const roomMetricsRef = useRef(null);
    const cameraPathRef = useRef(null);
    const lookPathRef = useRef(null);
    const introCameraPathRef = useRef(null);
    const introLookPathRef = useRef(null);
    const lookTargetRef = useRef(WIDE_LOOK.clone());
    const shakeOffsetRef = useRef(new THREE.Vector3());
    const idleDriftOffsetRef = useRef(new THREE.Vector3());
    const currentSpotRef = useRef('wide');
    const navTweenRef = useRef(null);
    const navAnimatingRef = useRef(false);
    const smoothedProgressRef = useRef(0);
    const lastReportedRef = useRef(-1);
    const roomMeshesRef = useRef([]);

    const [debugData, setDebugData] = useState(null);
    const [anchorPositions, setAnchorPositions] = useState({
        career: null,
        profile: null,
    });
    const [tvScreenData, setTvScreenData] = useState(null);
    const [boardScreenData, setBoardScreenData] = useState(null);
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
    const htmlPortalRef = useMemo(() => {
        return { current: gl.domElement.parentNode };
    }, [gl]);
    const tvScreenPlacement = useMemo(() => {
        if (!tvScreenData) {
            return null;
        }

        const center = new THREE.Vector3(...tvScreenData.center);
        const normal = new THREE.Vector3(...tvScreenData.normal);
        const offset = normal.multiplyScalar(tvScreenData.thickness * 0.4 + 0.02);
        center.add(offset);

        return {
            position: center.toArray(),
            rotation: tvScreenData.rotation,
            width: tvScreenData.width * TV_PIXELS_PER_UNIT * TV_SCREEN_SCALE,
            height: tvScreenData.height * TV_PIXELS_PER_UNIT * TV_SCREEN_SCALE,
        };
    }, [tvScreenData]);
    const boardScreenPlacement = useMemo(() => {
        if (!boardScreenData) {
            return null;
        }

        const center = new THREE.Vector3(...boardScreenData.center);
        const normal = new THREE.Vector3(...boardScreenData.normal);
        const widthDir = new THREE.Vector3(...boardScreenData.widthDir);
        const heightDir = new THREE.Vector3(...boardScreenData.heightDir);
        const offset = normal.multiplyScalar(Math.max(boardScreenData.thickness * 0.2, 0.02));
        center.add(offset);
        center.add(widthDir.multiplyScalar(boardScreenData.width * BOARD_OFFSET_X));
        center.add(heightDir.multiplyScalar(boardScreenData.height * BOARD_OFFSET_Y));

        return {
            position: center.toArray(),
            rotation: boardScreenData.rotation,
            width: boardScreenData.width * BOARD_PIXELS_PER_UNIT * BOARD_SCREEN_SCALE,
            height: boardScreenData.height * BOARD_PIXELS_PER_UNIT * BOARD_SCREEN_SCALE,
        };
    }, [boardScreenData]);
    const heroReveal = calibrationMode
        ? 1
        : phase === 'intro'
            ? 0
            : phase === 'transition'
                ? clamp01((transitionProgress - 0.68) / 0.2)
                : 1;
    const detailReveal = calibrationMode
        ? 1
        : phase === 'intro'
            ? 0
            : phase === 'transition'
                ? clamp01((transitionProgress - 0.8) / 0.18)
                : 1;
    const cloudDefinitions = useMemo(() => {
        if (isLowPowerMode) {
            return [
                { seed: 1, scale: 5, volume: 96, color: '#f0f9ff', opacityPhase: [0.12, 0.15], speed: 0.2, position: [0, 20, -350], bounds: [400, 200, 50] },
                { seed: 2, scale: 5, volume: 96, color: '#e0f2fe', opacityPhase: [0.16, 0.2], speed: 0.3, position: [350, 0, -100], bounds: [50, 250, 400] },
                { seed: 3, scale: 5, volume: 96, color: '#bae6fd', opacityPhase: [0.12, 0.15], speed: 0.2, position: [-350, 30, -100], bounds: [50, 250, 400] },
                { seed: 7, scale: 3.8, volume: 14, color: '#ffffff', opacityPhase: [0.06, 0.18], speed: 0.6, position: [-74, 120, 42], bounds: [32, 16, 28] },
            ];
        }

        return [
            { seed: 1, scale: 5, volume: 120, color: '#f0f9ff', opacityPhase: [0.12, 0.15], speed: 0.2, position: [0, 20, -350], bounds: [400, 200, 50] },
            { seed: 2, scale: 5, volume: 120, color: '#e0f2fe', opacityPhase: [0.16, 0.2], speed: 0.3, position: [350, 0, -100], bounds: [50, 250, 400] },
            { seed: 3, scale: 5, volume: 120, color: '#bae6fd', opacityPhase: [0.12, 0.15], speed: 0.2, position: [-350, 30, -100], bounds: [50, 250, 400] },
            { seed: 4, scale: 5, volume: 100, color: '#ffffff', opacityPhase: [0.08, 0.1], speed: 0.2, position: [0, 300, -100], bounds: [400, 50, 400] },
            { seed: 5, scale: 5, volume: 100, color: '#f8fafc', opacityPhase: [0.12, 0.15], speed: 0.3, position: [0, -250, -100], bounds: [400, 50, 400] },
            { seed: 6, scale: 5, volume: 120, color: '#e0f2fe', opacityPhase: [0.08, 0.1], speed: 0.1, position: [0, 0, 400], bounds: [400, 250, 50] },
            { seed: 7, scale: 3.8, volume: 20, color: '#ffffff', opacityPhase: [0.06, 0.34], speed: 0.6, position: [-74, 120, 42], bounds: [32, 16, 28] },
            { seed: 8, scale: 4.4, volume: 24, color: '#f8fbff', opacityPhase: [0.04, 0.3], speed: 0.55, position: [-56, 92, 18], bounds: [28, 22, 24] },
            { seed: 9, scale: 3.6, volume: 18, color: '#eef6ff', opacityPhase: [0.03, 0.24], speed: 0.48, position: [-44, 72, 0], bounds: [24, 16, 18] },
            { seed: 10, scale: 4.1, volume: 20, color: '#ffffff', opacityPhase: [0.02, 0.2], speed: 0.42, position: [-58, 58, -18], bounds: [20, 18, 16] },
        ];
    }, [isLowPowerMode]);

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
        const tvAnchor = getMeshWorldCenter(roomScene, TV_MESH_NAME);
        const anchorCareer = tvAnchor ?? new THREE.Vector3(...manualAnchors.career);
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
        const heroFocus = anchorCareer.clone().lerp(anchorProfile, 0.46).add(new THREE.Vector3(-1.8, -2.8, -1.6));
        const viewDirection = l0.clone().sub(p0).normalize();
        const sideDirection = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), viewDirection).normalize();
        const introPosition = p0.clone()
            .add(viewDirection.clone().multiplyScalar(-68))
            .add(sideDirection.clone().multiplyScalar(24))
            .add(new THREE.Vector3(0, 82, 0));
        const cloudEntryPosition = p0.clone()
            .add(viewDirection.clone().multiplyScalar(-42))
            .add(sideDirection.clone().multiplyScalar(18))
            .add(new THREE.Vector3(0, 48, 0));
        const fogCorePosition = p0.clone()
            .add(viewDirection.clone().multiplyScalar(-16))
            .add(sideDirection.clone().multiplyScalar(10))
            .add(new THREE.Vector3(0, 24, 0));
        const roomRevealPosition = p0.clone()
            .add(viewDirection.clone().multiplyScalar(7))
            .add(sideDirection.clone().multiplyScalar(6))
            .add(new THREE.Vector3(0, 9, 0));
        const arrivalPosition = p0.clone()
            .add(viewDirection.clone().multiplyScalar(-19))
            .add(sideDirection.clone().multiplyScalar(3.8))
            .add(new THREE.Vector3(0, 26, 0));
        const settlePosition = p0.clone()
            .add(viewDirection.clone().multiplyScalar(3))
            .add(sideDirection.clone().multiplyScalar(-2.4))
            .add(new THREE.Vector3(0, 1.1, -1.8));
        const introLook = heroFocus.clone().add(new THREE.Vector3(0, 20, -6));
        const cloudEntryLook = heroFocus.clone().add(new THREE.Vector3(0, 14, -3));
        const fogLook = heroFocus.clone().add(new THREE.Vector3(0, 7, -1.5));
        const revealLook = heroFocus.clone().lerp(l0, 0.2);
        const arrivalLook = l0.clone().add(new THREE.Vector3(0, 11.6, -1.2));
        const settleLook = l0.clone().lerp(heroFocus, 0.14);

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
        introCameraPathRef.current = new THREE.CatmullRomCurve3(
            [introPosition, cloudEntryPosition, fogCorePosition, roomRevealPosition, settlePosition, p0],
            false,
            'catmullrom',
            0.55,
        );
        introLookPathRef.current = new THREE.CatmullRomCurve3(
            [introLook, cloudEntryLook, fogLook, revealLook, settleLook, l0],
            false,
            'catmullrom',
            0.4,
        );

        const roomMeshes = [];
        roomScene.traverse((node) => {
            if (!node?.isMesh || node.userData.forceHidden || node.userData.isTransitionPlane) {
                return;
            }

            const bounds = new THREE.Box3().setFromObject(node);
            const centerPoint = new THREE.Vector3();
            const meshSize = new THREE.Vector3();
            bounds.getCenter(centerPoint);
            bounds.getSize(meshSize);

            const maxAxis = Math.max(meshSize.x, meshSize.y, meshSize.z);
            const footprint = meshSize.x + meshSize.z;
            const heroDistance = centerPoint.distanceTo(heroFocus);
            const horizontalHeroDistance = Math.hypot(centerPoint.x - heroFocus.x, centerPoint.z - heroFocus.z);
            const shellLike = SHELL_MESH_PATTERN.test(node.name)
                || maxAxis > 16
                || footprint > 22
                || centerPoint.y < heroFocus.y - 11;
            const heroLike = !shellLike && (
                HERO_MESH_PATTERN.test(node.name)
                || node.name === TV_MESH_NAME
                || node.name === BOARD_MESH_NAME
                || horizontalHeroDistance < 16
                || heroDistance < 18
            );
            const staggerSeed = clamp01(
                0.5
                + centerPoint.x * 0.009
                - centerPoint.z * 0.008
                + centerPoint.y * 0.004,
            );

            let revealStart = 0.54;
            let revealEnd = 0.78;
            let revealScaleStart = 0.985;
            let revealShift = new THREE.Vector3(0, 0.45, 0);

            if (heroLike) {
                revealStart = 0.68 + staggerSeed * 0.05;
                revealEnd = 0.87 + staggerSeed * 0.06;
                revealScaleStart = 0.95;
                revealShift = new THREE.Vector3(sideDirection.x * 0.26, 0.16, sideDirection.z * 0.26);
            } else if (!shellLike) {
                revealStart = 0.8 + staggerSeed * 0.05;
                revealEnd = 0.96 + staggerSeed * 0.03;
                revealScaleStart = 0.92;
                revealShift = new THREE.Vector3(sideDirection.x * 0.34, 0.24, sideDirection.z * 0.34);
            }

            node.userData.revealStart = revealStart;
            node.userData.revealEnd = Math.max(revealEnd, revealStart + 0.08);
            node.userData.revealScaleStart = revealScaleStart;
            node.userData.revealShift = revealShift;
            roomMeshes.push(node);
        });
        roomMeshesRef.current = roomMeshes;

        roomMetricsRef.current = {
            center,
            size,
            diag,
            p0,
            l0,
            anchorCareer,
            anchorProfile,
            heroFocus,
            introPosition,
            cloudEntryPosition,
            fogCorePosition,
            roomRevealPosition,
            arrivalPosition,
            settlePosition,
            introLook,
            cloudEntryLook,
            fogLook,
            revealLook,
            arrivalLook,
            settleLook,
            viewDirection,
            sideDirection,
        };
        setAnchorPositions({
            career: anchorCareer.toArray(),
            profile: anchorProfile.toArray(),
        });
        setTvScreenData(getTvScreenData(roomScene, TV_MESH_NAME));
        setBoardScreenData(getTvScreenData(roomScene, BOARD_MESH_NAME));

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
        smoothedProgressRef.current = targetProgress < 0 ? ARRIVAL_PROGRESS : CAMERA_PRESETS.wide.progress;
        lookTargetRef.current.copy(targetProgress < 0 ? metrics.arrivalLook : CAMERA_PRESETS.wide.look);
        camera.position.copy(targetProgress < 0 ? metrics.arrivalPosition : metrics.p0);
        camera.lookAt(lookTargetRef.current);
        camera.updateProjectionMatrix();
        if (onSmoothedProgress) {
            onSmoothedProgress(smoothedProgressRef.current);
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
        if (!metrics || !cameraPathRef.current || !lookPathRef.current || !introCameraPathRef.current || !introLookPathRef.current) {
            return;
        }

        const safeTransitionProgress = clamp01(transitionProgress);
        const midFogPulse = Math.sin(clamp01((safeTransitionProgress - 0.18) / 0.64) * Math.PI);

        const syncSceneLighting = () => {
            let targetExposure = 1.18;

            if (phase === 'intro') {
                targetExposure = 1.34;
            } else if (phase === 'transition') {
                targetExposure = THREE.MathUtils.lerp(1.32, 1.08, safeTransitionProgress) + midFogPulse * 0.42;
            } else if (phase === 'tour') {
                targetExposure = 1.08 + clamp01(worldLoadT) * 0.16;
            }

            gl.toneMappingExposure = THREE.MathUtils.lerp(gl.toneMappingExposure, targetExposure, 0.08);
        };

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
            const fogDensity = THREE.MathUtils.lerp(0.006, 0.062, Math.max(clamp01(fogFactor), midFogPulse * 0.9));
            const introFogColor = new THREE.Color('#dcecff');
            const peakFogColor = new THREE.Color('#f6fbff');

            fog.color.lerpColors(introFogColor, peakFogColor, midFogPulse);
            fog.density = fogDensity;
            scene.fog = fog;
            scene.background.lerpColors(new THREE.Color('#8ec5ff'), new THREE.Color('#dff0ff'), clamp01(0.15 + midFogPulse * 0.75));
        };

        const syncRoomReveal = () => {
            const revealProgress = calibrationMode
                ? 1
                : phase === 'intro'
                    ? 0
                    : phase === 'transition'
                        ? safeTransitionProgress
                        : 1;

            roomMeshesRef.current.forEach((mesh) => {
                const revealStart = mesh.userData.revealStart ?? 0.7;
                const revealEnd = mesh.userData.revealEnd ?? 0.92;
                const localReveal = revealProgress <= revealStart
                    ? 0
                    : revealProgress >= revealEnd
                        ? 1
                        : (revealProgress - revealStart) / Math.max(revealEnd - revealStart, 0.0001);

                setMeshRevealState(mesh, localReveal);
            });
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
            gl.toneMappingExposure = THREE.MathUtils.lerp(gl.toneMappingExposure, 1.12, 0.08);
            syncRoomReveal();
            return;
        }

        if (navAnimatingRef.current) {
            camera.lookAt(lookTargetRef.current);
            syncSceneLighting();
            syncSceneFog();
            syncRoomReveal();
            return;
        }

        const allowScrollDrive = phase === 'tour' && currentSpotRef.current === 'wide';
        const rawTarget = allowScrollDrive
            ? clampWideTourProgress(targetProgress)
            : CAMERA_PRESETS[currentSpotRef.current].progress;

        if (phase === 'tour') {
            smoothedProgressRef.current = THREE.MathUtils.lerp(smoothedProgressRef.current, rawTarget, 0.18);
        } else {
            smoothedProgressRef.current = THREE.MathUtils.lerp(smoothedProgressRef.current, 0, 0.22);
        }
        smoothedProgressRef.current = clampWideTourProgress(smoothedProgressRef.current);

        const clampedPathProgress = clamp01(smoothedProgressRef.current);
        const pathPos = cameraPathRef.current.getPointAt(clampedPathProgress);
        const lookPos = lookPathRef.current.getPointAt(clampedPathProgress);

        let desiredPosition = pathPos;
        let desiredLook = lookPos;

        if (phase === 'intro') {
            desiredPosition = metrics.introPosition;
            desiredLook = metrics.introLook;
        }

        if (phase === 'transition') {
            let pathProgress = 0;
            if (safeTransitionProgress < 0.25) {
                pathProgress = THREE.MathUtils.smootherstep(safeTransitionProgress / 0.25, 0, 1) * 0.24;
            } else if (safeTransitionProgress < 0.5) {
                pathProgress = THREE.MathUtils.lerp(
                    0.24,
                    0.5,
                    THREE.MathUtils.smootherstep((safeTransitionProgress - 0.25) / 0.25, 0, 1),
                );
            } else if (safeTransitionProgress < 0.75) {
                pathProgress = THREE.MathUtils.lerp(
                    0.5,
                    0.82,
                    THREE.MathUtils.smootherstep((safeTransitionProgress - 0.5) / 0.25, 0, 1),
                );
            } else {
                pathProgress = THREE.MathUtils.lerp(
                    0.82,
                    1,
                    THREE.MathUtils.smootherstep((safeTransitionProgress - 0.75) / 0.25, 0, 1),
                );
            }

            desiredPosition = introCameraPathRef.current.getPointAt(pathProgress);
            desiredLook = introLookPathRef.current.getPointAt(pathProgress);

            const elapsed = state.clock.elapsedTime;
            const orbitAmount = clamp01(1 - safeTransitionProgress * 0.88);
            idleDriftOffsetRef.current.set(
                Math.sin(elapsed * 0.78 + safeTransitionProgress * 6.4) * metrics.sideDirection.x * 1.2 * orbitAmount,
                Math.sin(elapsed * 1.02 + safeTransitionProgress * 4.6) * 0.45 * orbitAmount,
                Math.sin(elapsed * 0.78 + safeTransitionProgress * 6.4) * metrics.sideDirection.z * 1.2 * orbitAmount,
            );
            desiredPosition.add(idleDriftOffsetRef.current);
            desiredLook.add(metrics.sideDirection.clone().multiplyScalar(Math.sin(elapsed * 0.64 + safeTransitionProgress * 5.3) * 0.75 * orbitAmount));

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
                desiredPosition = metrics.arrivalPosition.clone();
                desiredLook = metrics.arrivalLook.clone();
                shakeOffsetRef.current.set(0, 0, 0);
            }
        } else if (phase === 'tour' && currentSpotRef.current === 'wide') {
            if (smoothedProgressRef.current < 0) {
                const arrivalBlend = clamp01((smoothedProgressRef.current - ARRIVAL_PROGRESS) / (0 - ARRIVAL_PROGRESS));
                const arrivalArc = Math.sin(arrivalBlend * Math.PI);
                const arrivalDrift = Math.sin(arrivalBlend * Math.PI * 0.8 + 0.35);

                desiredPosition = metrics.arrivalPosition.clone().lerp(metrics.p0, arrivalBlend);
                desiredPosition.add(metrics.sideDirection.clone().multiplyScalar((1 - arrivalBlend) * 1.4 + arrivalArc * 2.4));
                desiredPosition.y += arrivalArc * 2.8;
                desiredPosition.add(metrics.viewDirection.clone().multiplyScalar(-arrivalArc * 2.2));

                desiredLook = metrics.arrivalLook.clone().lerp(metrics.l0, arrivalBlend);
                desiredLook.add(metrics.sideDirection.clone().multiplyScalar(arrivalDrift * 1.1));
                desiredLook.y += arrivalArc * 0.8;
            }

            const elapsed = state.clock.elapsedTime;
            const settleStrength = 0.16 + clamp01(worldLoadT) * 0.34;

            idleDriftOffsetRef.current.set(
                Math.sin(elapsed * 0.46) * metrics.sideDirection.x * settleStrength,
                Math.sin(elapsed * 0.71 + 0.6) * 0.16 * settleStrength,
                Math.sin(elapsed * 0.46) * metrics.sideDirection.z * settleStrength,
            );
            desiredPosition = desiredPosition.clone().add(idleDriftOffsetRef.current);
            desiredLook = desiredLook.clone().add(metrics.sideDirection.clone().multiplyScalar(Math.sin(elapsed * 0.38) * 0.12 * settleStrength));
        }

        camera.position.lerp(desiredPosition, 1 - Math.exp(-delta * 7));
        lookTargetRef.current.lerp(desiredLook, 1 - Math.exp(-delta * 7));

        camera.lookAt(lookTargetRef.current);

        syncSceneLighting();
        syncSceneFog();
        syncRoomReveal();

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

            <>
                <group position={[120, 75, -160]}>
                    <mesh>
                        <sphereGeometry args={[18, 32, 32]} />
                        <meshBasicMaterial color="#fde047" />
                    </mesh>
                    <mesh>
                        <sphereGeometry args={[26, 32, 32]} />
                        <meshBasicMaterial color="#fef08a" transparent opacity={0.4} />
                    </mesh>
                    <mesh>
                        <sphereGeometry args={[36, 32, 32]} />
                        <meshBasicMaterial color="#fef08a" transparent opacity={0.15} />
                    </mesh>
                </group>
                <Clouds material={THREE.MeshBasicMaterial}>
                    {cloudDefinitions.map((cloud) => (
                        <Cloud
                            key={cloud.seed}
                            seed={cloud.seed}
                            scale={cloud.scale}
                            volume={cloud.volume}
                            color={cloud.color}
                            opacity={phase === 'transition' ? cloud.opacityPhase[0] : cloud.opacityPhase[1]}
                            speed={cloud.speed}
                            position={cloud.position}
                            bounds={cloud.bounds}
                        />
                    ))}
                </Clouds>
            </>
            {tvScreenPlacement && (
                <Html
                    transform
                    distanceFactor={10}
                    portal={htmlPortalRef}
                    center
                    position={tvScreenPlacement.position}
                    rotation={tvScreenPlacement.rotation}
                    className="select-none"
                    style={{
                        width: `${tvScreenPlacement.width}px`,
                        height: `${tvScreenPlacement.height}px`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#0f172a',
                        border: '2px solid #334155',
                        borderRadius: '12px',
                        boxShadow: 'none',
                        color: '#e2e8f0',
                        fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
                        pointerEvents: 'none',
                        textShadow: 'none',
                        opacity: heroReveal,
                    }}
                >
                    <div style={{ transform: `scale(${0.92 + heroReveal * 0.08})`, transformOrigin: 'center' }}>
                        <div className="text-6xl font-semibold leading-tight text-center">
                            Kevin Hermansyah, B.S.
                        </div>
                        <div className="mt-5 text-3xl font-medium text-slate-300">Pendidikan</div>
                        <div className="mt-8 w-[80%] text-2xl text-slate-200 leading-relaxed">
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-3">
                                    <span className="font-semibold">1.</span>
                                    <span>SMKTI Airlangga Samarinda</span>
                                </div>
                                <div className="flex gap-3">
                                    <span className="font-semibold">2.</span>
                                    <span>
                                        Massachusetts Institute of Technology (MIT) — B.S. in Computer Science and Engineering
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Html>
            )}

            {boardScreenPlacement && (
                <Html
                    transform
                    distanceFactor={10}
                    portal={htmlPortalRef}
                    center
                    position={boardScreenPlacement.position}
                    rotation={boardScreenPlacement.rotation}
                    className="select-none"
                    style={{
                        width: `${boardScreenPlacement.width}px`,
                        height: `${boardScreenPlacement.height}px`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(248, 250, 252, 0.98)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        color: '#0f172a',
                        fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
                        backfaceVisibility: 'hidden',
                        pointerEvents: 'none',
                        opacity: detailReveal,
                    }}
                >
                    <div
                        className="flex h-full w-full flex-col items-start justify-start px-10 py-8 text-left"
                        style={{
                            transform: `scaleX(-1) scale(${0.92 + detailReveal * 0.08})`,
                            transformOrigin: 'center',
                        }}
                    >
                        <div className="text-3xl font-semibold tracking-wide">Profil Umum</div>
                        <div className="mt-2 text-2xl font-medium">Kevin Hermansyah</div>
                        <div className="mt-5 grid w-full grid-cols-[auto,1fr] gap-x-4 gap-y-3 text-xl leading-relaxed text-slate-700">
                            <div className="font-semibold">Domisili</div>
                            <div>Samarinda, Indonesia</div>
                            <div className="font-semibold">Fokus</div>
                            <div>Web Development & 3D Interface</div>
                            <div className="font-semibold">Minat</div>
                            <div>UI/UX, Visualisasi, Interaksi</div>
                        </div>
                    </div>
                </Html>
            )}

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
