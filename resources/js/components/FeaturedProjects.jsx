import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import {
    ContactShadows,
    Environment,
    Html,
    RoundedBox,
    PerspectiveCamera,
    Float,
    Text
} from '@react-three/drei';
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { navigateWithCleanup } from '../lib/pageTransitionCleanup';

// --------------- HELPER COMPONENTS ---------------

const CanvasLoader = () => {
    return (
        <Html as='div' center className="flex flex-col items-center justify-center z-50">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-pink-500 rounded-full animate-spin shadow-lg"></div>
            <p className="mt-4 text-xs font-black text-slate-600 uppercase tracking-[0.2em] animate-pulse">Initializing 3D...</p>
        </Html>
    );
};

const SceneTicker = ({ fps = 30, enabled = true }) => {
    const invalidate = useThree((state) => state.invalidate);

    useEffect(() => {
        if (!enabled) {
            return undefined;
        }

        const interval = setInterval(() => invalidate(), 1000 / fps);
        return () => clearInterval(interval);
    }, [enabled, fps, invalidate]);

    return null;
};

const StaggeredText = ({ text, color, delay = 0, className = "" }) => {
    const prefersReducedMotion = useReducedMotion();
    const letters = text.split("");

    return (
        <span className={`inline-flex ${className}`}>
            {letters.map((letter, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 22, scale: 0.82, rotate: -4, filter: 'blur(6px)' }}
                    animate={{
                        opacity: 1,
                        y: prefersReducedMotion ? 0 : [0, -7, 0, -3, 0],
                        scale: prefersReducedMotion ? 1 : [1, 1.06, 0.97, 1.03, 1],
                        rotate: prefersReducedMotion ? 0 : [0, -1.5, 1.3, -0.6, 0],
                        filter: 'blur(0px)'
                    }}
                    transition={{
                        opacity: { duration: 0.28, delay: delay + i * 0.055, ease: 'easeOut' },
                        y: prefersReducedMotion
                            ? { type: 'spring', stiffness: 220, damping: 16, delay: delay + i * 0.055 }
                            : [
                                { type: 'spring', stiffness: 220, damping: 16, delay: delay + i * 0.055 },
                                { duration: 3.6 + i * 0.15, repeat: Infinity, ease: 'easeInOut', delay: 0.95 + delay + i * 0.04 }
                            ],
                        scale: prefersReducedMotion
                            ? { type: 'spring', stiffness: 220, damping: 16, delay: delay + i * 0.055 }
                            : [
                                { type: 'spring', stiffness: 220, damping: 16, delay: delay + i * 0.055 },
                                { duration: 3.2 + i * 0.12, repeat: Infinity, ease: 'easeInOut', delay: 1 + delay + i * 0.04 }
                            ],
                        rotate: prefersReducedMotion ? undefined : { duration: 4 + i * 0.18, repeat: Infinity, ease: 'easeInOut', delay: 1.05 + delay + i * 0.04 },
                    }}
                    style={{ display: 'inline-block', transformOrigin: '50% 100%' }}
                >
                    <motion.span
                        animate={prefersReducedMotion ? undefined : { x: [0, 1.5, -1, 0] }}
                        transition={prefersReducedMotion ? undefined : {
                            duration: 4.4 + i * 0.15,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 1.1 + delay + i * 0.05
                        }}
                        style={{ display: 'inline-block' }}
                    >
                        {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                </motion.span>
            ))}
        </span>
    );
};

// --------------- 3D COMPONENTS ---------------

const LedBulb = ({ color, position, segments = 8 }) => (
    <mesh position={position}>
        <sphereGeometry args={[0.06, segments, segments]} />
        <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={3}
            roughness={0.1}
            clearcoat={1}
        />
        <pointLight color={color} intensity={0.5} distance={1} decay={2} />
    </mesh>
);

const SideRibs = ({ color }) => {
    return (
        <group position={[0, 0.6, 0.05]}>
            {[-1.02, 1.02].map((x, i) => (
                <group key={i} position={[x, 0, 0]}>
                    {[-0.2, 0, 0.2].map((y, j) => (
                        <RoundedBox key={j} args={[0.2, 0.06, 0.06]} radius={0.02} smoothness={1} position={[0, y, 0]}>
                            <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={0.3} />
                        </RoundedBox>
                    ))}
                </group>
            ))}
        </group>
    );
};

const CartridgeMesh = ({ project, position, ledSegments = 8 }) => {
    // 4 distinct LED colors (Red, Yellow, Green, Blue)
    const ledColors = ['#ef4444', '#facc15', '#22c55e', '#3b82f6'];

    return (
        <group position={position}>
            {/* Top Bar where LEDs sit */}
            <group position={[0, 1.05, 0.05]}>
                <RoundedBox args={[1.7, 0.35, 0.3]} radius={0.05} smoothness={2} position={[0, 0, 0]}>
                    <meshPhysicalMaterial color={project.color} roughness={0.3} clearcoat={0.3} />
                </RoundedBox>
                {/* 4 LEDs */}
                {ledColors.map((color, i) => (
                    <group key={i} position={[(i - 1.5) * 0.35, 0.15, 0.1]}>
                        {/* LED Base */}
                        <mesh position={[0, -0.05, 0]}>
                            <cylinderGeometry args={[0.08, 0.08, 0.05, 8]} />
                            <meshStandardMaterial color={project.color} />
                        </mesh>
                        {/* LED Bulb */}
                        <LedBulb color={color} position={[0, 0.02, 0]} segments={ledSegments} />
                    </group>
                ))}
            </group>

            {/* Main Body */}
            <RoundedBox
                args={[2.1, 2.0, 0.4]}
                radius={0.08}
                smoothness={2}
                position={[0, -0.15, 0]}
            >
                <meshPhysicalMaterial
                    color={project.color}
                    roughness={0.25}
                    metalness={0.1}
                    clearcoat={0.3}
                />
            </RoundedBox>

            {/* Side Ribs */}
            <SideRibs color={project.color} />

            {/* Bottom indentations */}
            <group position={[0, -1.0, 0.15]}>
                <RoundedBox args={[0.5, 0.15, 0.2]} radius={0.02} smoothness={1} position={[-0.55, 0, 0]}>
                    <meshPhysicalMaterial color={project.color} roughness={0.3} />
                </RoundedBox>
                <RoundedBox args={[0.5, 0.15, 0.2]} radius={0.02} smoothness={1} position={[0.55, 0, 0]}>
                    <meshPhysicalMaterial color={project.color} roughness={0.3} />
                </RoundedBox>
            </group>

            {/* Label Panel Base */}
            <mesh position={[0, -0.15, 0.21]}>
                <planeGeometry args={[1.7, 1.2]} />
                <meshStandardMaterial color="#ffffff" roughness={0.1} />
            </mesh>
            <Text
                position={[0, -0.15, 0.235]}
                fontSize={0.18}
                color={project.textColor || '#111827'}
                maxWidth={1.4}
                lineHeight={1.1}
                textAlign="center"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.02}
                fontWeight={900}
            >
                {project.title}
            </Text>
        </group>
    );
};

const ConsoleCable = ({ color, startY, points, segments = 30, radialSegments = 5 }) => {
    // Generate CatmullRomCurve3 for tangled cables
    const curve = useMemo(() => {
        const vecs = points.map(p => new THREE.Vector3(...p));
        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(5.6, startY, 0),
            new THREE.Vector3(5.0, startY - 0.2, 0.4),
            ...vecs
        ]);
    }, [startY, points]);

    return (
        <group>
            {/* The plug connector attached to wall */}
            <mesh position={[5.6, startY, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.15, 0.15, 0.3, 8]} />
                <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[5.8, startY, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.08, 0.08, 0.2, 8]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* The cable */}
            <mesh>
                <tubeGeometry args={[curve, segments, 0.06, radialSegments, false]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.6}
                    clearcoat={0.1}
                />
            </mesh>
        </group>
    );
};

// --------------- MAIN COMPONENT ---------------

export default function FeaturedProjects({ repos = [] }) {
    const prefersReducedMotion = useReducedMotion();
    const [isLowPower, setIsLowPower] = useState(false);

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

    const renderSettings = useMemo(() => {
        const lowPower = isLowPower;
        return {
            dpr: lowPower ? [0.75, 1] : [0.9, 1.35],
            targetFps: lowPower ? 0 : 24,
            shadowMapSize: lowPower ? 512 : 768,
            multisampling: lowPower ? 0 : 2,
            ssaoSamples: lowPower ? 0 : 16,
            contactShadowResolution: lowPower ? 256 : 512,
            contactShadowFrames: lowPower ? 1 : Infinity,
            cableSegments: lowPower ? 18 : 30,
            cableRadialSegments: lowPower ? 3 : 5,
            ledSegments: lowPower ? 6 : 8,
            enablePostprocessing: !lowPower,
            enableTicker: !lowPower,
            floatSpeed: lowPower ? 0 : 2,
            floatRotation: lowPower ? 0 : 0.05,
            floatIntensity: lowPower ? 0 : 0.15
        };
    }, [isLowPower]);

    const projects = useMemo(() => {
        // Fallback data if no repos provided
        let data = repos && repos.length > 0 ? repos : [
            { title: 'ALIAS PARIATUR QUAM.', name: 'Project 1' },
            { title: 'EUM EOS UT.', name: 'Project 2' },
            { title: 'EST VOLUPTATEM VOLUPTATEM QUIA.', name: 'Project 3' }
        ];

        // Ensure we only have 3 projects (newest 3)
        data = data.slice(0, 3);

        const palettes = [
            { color: '#3b82f6', text: '#1e40af' }, // Blue
            { color: '#ec4899', text: '#9d174d' }, // Pink
            { color: '#22c55e', text: '#166534' }  // Green
        ];

        return data.map((repo, i) => {
            const p = palettes[i % palettes.length];
            const rawTitle = (repo?.title ?? repo?.name ?? '').toString().trim();
            return {
                title: rawTitle.length > 0 ? rawTitle : 'Untitled Project',
                color: p.color,
                textColor: p.text,
                link: repo.link
            };
        });
    }, [repos]);

    // Set up intersection observer for lazy-loading the Canvas
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { margin: '200px 0px' });

    return (
        <section ref={containerRef} className="relative w-full py-12 mb-16 z-10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-4 md:mb-8 gap-4 px-4 overflow-visible relative">
                    <div className="flex flex-col gap-2 z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7, y: 18, rotate: -4 }}
                            animate={prefersReducedMotion ? { opacity: 1, scale: 1, y: 0, rotate: 0 } : {
                                opacity: 1,
                                scale: 1,
                                y: [0, -4, 0],
                                rotate: [0, -1.2, 0.8, 0],
                            }}
                            transition={prefersReducedMotion
                                ? { type: 'spring', stiffness: 260, damping: 18 }
                                : {
                                    opacity: { duration: 0.3 },
                                    scale: { type: 'spring', stiffness: 260, damping: 18 },
                                    y: [
                                        { type: 'spring', stiffness: 260, damping: 18 },
                                        { duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }
                                    ],
                                    rotate: { duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }
                                }}
                            className="bg-[#fbbf24] text-[#78350f] text-[10px] md:text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg border border-white/60 self-start"
                        >
                            COLLECTORS EDITION
                        </motion.div>
                        <h2 className="text-[3.5rem] md:text-7xl lg:text-8xl font-black text-slate-800 leading-[0.85] tracking-tighter flex flex-col items-start drop-shadow-sm">
                            <StaggeredText text="FEATURED" color="text-slate-800" delay={0.2} />
                            <StaggeredText text="PROJECTS" className="text-pink-500" delay={0.4} />
                        </h2>
                    </div>

                    {/* Retro Button */}
                    <div className="bg-[#cbd5e1] p-[3px] rounded-xl shadow-inner border border-slate-300 mt-4 md:mt-0 z-10">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigateWithCleanup('/projects')}
                            className="bg-slate-600 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),_0_3px_6px_rgba(0,0,0,0.3)] border border-slate-700 uppercase tracking-wide text-xs md:text-sm"
                        >
                            See Collection <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" className="mb-[2px] opacity-90"><path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"></path></svg>
                        </motion.button>
                    </div>
                </div>

                {/* 3D Scene Container */}
                <style>{`
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>
                <div className="-mx-4 md:mx-0 w-[calc(100%+2rem)] md:w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex hide-scrollbar relative">
                    {/* Active Canvas layer */}
                    <div className="absolute top-0 left-0 w-[225vw] sm:w-[150vw] md:w-full h-full z-0 group">
                        {isInView && (
                            <Canvas
                                shadows={!isLowPower}
                                dpr={renderSettings.dpr}
                                frameloop="demand"
                                gl={{
                                    powerPreference: isLowPower ? 'low-power' : 'high-performance',
                                    antialias: !isLowPower
                                }}
                                className="!overflow-visible"
                            >
                                <SceneTicker fps={renderSettings.targetFps} enabled={renderSettings.enableTicker && isInView} />
                                <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={35} />
                                <ambientLight intensity={0.7} />
                                <directionalLight
                                    position={[5, 10, 5]}
                                    intensity={1.5}
                                    castShadow={!isLowPower}
                                    shadow-mapSize={[renderSettings.shadowMapSize, renderSettings.shadowMapSize]}
                                />
                                <pointLight position={[0, -2, 5]} intensity={0.5} />

                                <Suspense fallback={<CanvasLoader />}>
                                    <Environment preset="city" />

                                    <group position={[0, 0.5, 0]}>
                                        {/* Console Shelf Base */}
                                        <group position={[0, -0.5, -1]}>
                                            {/* Inner Back Wall (Dark Grey) */}
                                            <RoundedBox args={[11.4, 4.0, 0.2]} radius={0.05} position={[0, 0.3, -0.8]}>
                                                <meshStandardMaterial color="#334155" roughness={0.8} />
                                            </RoundedBox>

                                            {/* Inner Floor (extends back to front) */}
                                            <RoundedBox args={[11.4, 0.2, 2.0]} radius={0.05} position={[0, -1.6, 0.1]}>
                                                <meshStandardMaterial color="#475569" roughness={0.8} />
                                            </RoundedBox>

                                            {/* Inner Ceiling */}
                                            <RoundedBox args={[11.4, 0.2, 2.0]} radius={0.05} position={[0, 2.2, 0.1]}>
                                                <meshStandardMaterial color="#475569" roughness={0.8} />
                                            </RoundedBox>

                                            {/* Inner Left Wall */}
                                            <RoundedBox args={[0.2, 4.0, 2.0]} radius={0.05} position={[-5.6, 0.3, 0.1]}>
                                                <meshStandardMaterial color="#475569" roughness={0.8} />
                                            </RoundedBox>

                                            {/* Inner Right Wall */}
                                            <RoundedBox args={[0.2, 4.0, 2.0]} radius={0.05} position={[5.6, 0.3, 0.1]}>
                                                <meshStandardMaterial color="#475569" roughness={0.8} />
                                            </RoundedBox>

                                            {/* Outer Frame (Top, Left, Right) */}
                                            <RoundedBox args={[12.2, 0.4, 2.4]} radius={0.1} smoothness={2} position={[0, 2.5, 0.2]}>
                                                <meshPhysicalMaterial color="#cbd5e1" roughness={0.4} metalness={0.1} clearcoat={0.1} />
                                            </RoundedBox>
                                            <RoundedBox args={[0.6, 5.0, 2.4]} radius={0.1} smoothness={2} position={[-6.0, 0.2, 0.2]}>
                                                <meshPhysicalMaterial color="#cbd5e1" roughness={0.4} metalness={0.1} clearcoat={0.1} />
                                            </RoundedBox>
                                            <RoundedBox args={[0.6, 5.0, 2.4]} radius={0.1} smoothness={2} position={[6.0, 0.2, 0.2]}>
                                                <meshPhysicalMaterial color="#cbd5e1" roughness={0.4} metalness={0.1} clearcoat={0.1} />
                                            </RoundedBox>

                                            {/* Base Lip extending forward/down */}
                                            <RoundedBox args={[12.2, 0.8, 2.6]} radius={0.1} smoothness={2} position={[0, -1.9, 0.3]}>
                                                <meshPhysicalMaterial color="#94a3b8" roughness={0.4} metalness={0.1} clearcoat={0.1} />
                                            </RoundedBox>

                                            {/* Three bottom slots */}
                                            {[-3.5, 0, 3.5].map((xPos, idx) => (
                                                <group key={idx} position={[xPos, -1.5, 1.1]}>
                                                    {/* Indentation Cavity */}
                                                    <RoundedBox args={[2.5, 0.2, 0.5]} radius={0.05} position={[0, 0.2, 0]}>
                                                        <meshStandardMaterial color="#64748b" roughness={0.7} />
                                                    </RoundedBox>

                                                    {/* Text Label Background Badge */}
                                                    <RoundedBox args={[1.6, 0.2, 0.05]} radius={0.05} position={[0, -0.15, 0.25]}>
                                                        <meshStandardMaterial color="#64748b" roughness={0.5} />
                                                    </RoundedBox>

                                                    <Text
                                                        position={[0, -0.15, 0.28]}
                                                        fontSize={0.08}
                                                        color="#cbd5e1"
                                                        anchorX="center"
                                                        anchorY="middle"
                                                        letterSpacing={0.1}
                                                        fontWeight={900}
                                                    >
                                                        COLLECTION SERIES 1
                                                    </Text>
                                                </group>
                                            ))}

                                            {/* Tangled Cables hooking into Cartridges */}
                                            <ConsoleCable
                                                color="#ef4444"
                                                startY={1.4}
                                                points={[
                                                    [5.2, 0.5, -0.2],
                                                    [4.8, -1.3, 0.1],
                                                    [3.5, -1.45, 0.6],
                                                    [2.0, -1.3, 0.8],
                                                    [1.0, -1.45, 0.4],
                                                    [0.55, -1.4, 0.2],
                                                    [0.55, -1.175, -0.05]
                                                ]}
                                                segments={renderSettings.cableSegments}
                                                radialSegments={renderSettings.cableRadialSegments}
                                            />
                                            <ConsoleCable
                                                color="#facc15"
                                                startY={0.6}
                                                points={[
                                                    [5.2, -0.5, -0.1],
                                                    [4.5, -1.4, 0.5],
                                                    [3.0, -1.3, 0.9],
                                                    [1.5, -1.45, 0.6],
                                                    [0.0, -1.3, 1.0],
                                                    [-1.5, -1.45, 0.6],
                                                    [-2.5, -1.35, 0.4],
                                                    [-2.95, -1.4, 0.2],
                                                    [-2.95, -1.175, -0.05]
                                                ]}
                                                segments={renderSettings.cableSegments}
                                                radialSegments={renderSettings.cableRadialSegments}
                                            />
                                            <ConsoleCable
                                                color="#22c55e"
                                                startY={-0.2}
                                                points={[
                                                    [5.0, -1.3, 0.4],
                                                    [4.4, -1.45, 0.6],
                                                    [4.05, -1.4, 0.2],
                                                    [4.05, -1.175, -0.05]
                                                ]}
                                                segments={renderSettings.cableSegments}
                                                radialSegments={renderSettings.cableRadialSegments}
                                            />
                                            <ConsoleCable
                                                color="#3b82f6"
                                                startY={-1.0}
                                                points={[
                                                    [4.8, -1.2, 0.8],
                                                    [2.5, -1.45, 0.4],
                                                    [0.5, -1.2, 0.9],
                                                    [-1.0, -1.45, 0.7],
                                                    [-2.5, -1.2, 1.0],
                                                    [-3.5, -1.45, 0.5],
                                                    [-4.05, -1.4, 0.2],
                                                    [-4.05, -1.175, -0.05]
                                                ]}
                                                segments={renderSettings.cableSegments}
                                                radialSegments={renderSettings.cableRadialSegments}
                                            />
                                        </group>

                                        {/* Cartridges */}
                                        {projects.map((project, i) => {
                                            const xPos = (i - 1) * 3.5;
                                            return (
                                                <Float
                                                    key={i}
                                                    speed={renderSettings.floatSpeed}
                                                    rotationIntensity={renderSettings.floatRotation}
                                                    floatIntensity={renderSettings.floatIntensity}
                                                    position={[xPos, -0.1, -0.2]}
                                                >
                                                    <CartridgeMesh
                                                        project={project}
                                                        position={[0, 0, 0]}
                                                        ledSegments={renderSettings.ledSegments}
                                                    />
                                                </Float>
                                            );
                                        })}

                                    </group>

                                    <ContactShadows
                                        position={[0, -2.5, 0]}
                                        opacity={0.5}
                                        scale={20}
                                        blur={2}
                                        far={4}
                                        frames={renderSettings.contactShadowFrames}
                                        resolution={renderSettings.contactShadowResolution}
                                    />

                                    {renderSettings.enablePostprocessing && (
                                        <EffectComposer enableNormalPass multisampling={renderSettings.multisampling}>
                                            <SSAO
                                                radius={0.35}
                                                intensity={20}
                                                luminanceWeight={0.7}
                                                samples={renderSettings.ssaoSamples}
                                            />
                                            <Bloom luminanceThreshold={0.85} intensity={0.9} radius={0.2} />
                                        </EffectComposer>
                                    )}
                                </Suspense>
                            </Canvas>
                        )}
                    </div>

                    {/* Static scroll-width layer with snap points */}
                    <div className="w-[225vw] sm:w-[150vw] md:w-full aspect-[21/10] flex-none flex pointer-events-none z-10">
                        <div className="flex-1 snap-center" />
                        <div className="flex-1 snap-center" />
                        <div className="flex-1 snap-center" />
                    </div>
                </div>
            </div>
        </section>
    );
}
