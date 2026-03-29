import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { motion, useReducedMotion } from 'framer-motion';
import { navigateWithCleanup } from '../lib/pageTransitionCleanup';

const StaggeredText = ({ text, delay = 0, className = '', letterStyle }) => {
    const prefersReducedMotion = useReducedMotion();
    const letters = text.split('');

    return (
        <span className={`inline-flex ${className}`}>
            {letters.map((letter, index) => (
                <motion.span
                    key={`${letter}-${index}`}
                    initial={{ opacity: 0, y: 20, scale: 0.84, rotate: -3, filter: 'blur(5px)' }}
                    animate={{
                        opacity: 1,
                        y: prefersReducedMotion ? 0 : [0, -4, 0],
                        scale: prefersReducedMotion ? 1 : [1, 1.02, 1],
                        rotate: prefersReducedMotion ? 0 : [0, -0.8, 0.6, 0],
                        filter: 'blur(0px)',
                    }}
                    transition={{
                        opacity: { duration: 0.24, delay: delay + index * 0.045, ease: 'easeOut' },
                        y: prefersReducedMotion
                            ? { type: 'spring', stiffness: 220, damping: 18, delay: delay + index * 0.045 }
                            : [
                                { type: 'spring', stiffness: 220, damping: 18, delay: delay + index * 0.045 },
                                { duration: 3.1 + index * 0.08, repeat: Infinity, ease: 'easeInOut', delay: 0.8 + delay + index * 0.03 },
                            ],
                        scale: prefersReducedMotion ? undefined : { duration: 3.6 + index * 0.08, repeat: Infinity, ease: 'easeInOut', delay: 1 + delay + index * 0.03 },
                        rotate: prefersReducedMotion ? undefined : { duration: 4.2 + index * 0.08, repeat: Infinity, ease: 'easeInOut', delay: 1.05 + delay + index * 0.03 },
                    }}
                    style={{ display: 'inline-block', transformOrigin: '50% 100%' }}
                >
                    <span style={letterStyle}>{letter === ' ' ? '\u00A0' : letter}</span>
                </motion.span>
            ))}
        </span>
    );
};

const FauxProjectCard = ({ project, index }) => {
    const ledColors = ['#ef4444', '#facc15', '#22c55e', '#3b82f6'];
    const isCenterCard = index === 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 26, rotate: index === 0 ? -3 : index === 2 ? 3 : 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: index === 0 ? -2 : index === 2 ? 2 : 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.45, delay: 0.08 * index, ease: 'easeOut' }}
            className={`relative flex h-full min-h-[260px] flex-col justify-between rounded-[1.8rem] border border-white/80 bg-[linear-gradient(160deg,#eef5ff_0%,#d8e5f8_52%,#b7c7e3_100%)] p-4 shadow-[inset_0_3px_0_rgba(255,255,255,0.95),inset_0_-7px_12px_rgba(71,85,105,0.16),0_18px_40px_rgba(15,23,42,0.14)] ${isCenterCard ? 'md:-translate-y-4' : ''}`}
        >
            <div className="pointer-events-none absolute inset-x-5 top-2 h-6 rounded-full bg-white/45 blur-md" />
            <div className="pointer-events-none absolute inset-x-4 bottom-[-14px] h-6 rounded-full bg-slate-900/18 blur-xl" />

            <div className="absolute left-3 top-3 flex gap-2">
                {ledColors.map((ledColor) => (
                    <span
                        key={ledColor}
                        className="h-2.5 w-2.5 rounded-full border border-white/70 shadow-[0_0_8px_rgba(255,255,255,0.35)]"
                        style={{ background: ledColor, boxShadow: `0 0 10px ${ledColor}` }}
                    />
                ))}
            </div>

            <div className="absolute right-3 top-3 flex flex-col gap-1">
                {[0, 1, 2].map((rib) => (
                    <span key={rib} className="h-2 w-1 rounded-full bg-slate-500/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)]" />
                ))}
            </div>

            <div className="mt-7 rounded-[1.2rem] border border-slate-300/90 bg-[linear-gradient(180deg,#ffffff_0%,#f4f7fb_100%)] p-4 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),0_5px_0_rgba(148,163,184,0.8)]">
                <div className="flex aspect-[4/3] items-center justify-center rounded-[0.9rem] border border-slate-200 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.75)_28%,rgba(248,250,252,0.95)_100%)] px-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                    <p
                        className="text-lg font-black uppercase tracking-[0.06em] sm:text-xl"
                        style={{
                            color: project.textColor,
                            textShadow: '0 1px 0 rgba(255,255,255,0.75)',
                        }}
                    >
                        {project.title}
                    </p>
                </div>
            </div>

            <div className="mt-5 flex items-end justify-between">
                <div className="flex gap-2">
                    <span className="h-4 w-12 rounded-[0.35rem] bg-slate-400/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]" />
                    <span className="h-4 w-12 rounded-[0.35rem] bg-slate-400/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]" />
                </div>
                <div
                    className="h-2.5 w-16 rounded-full"
                    style={{
                        background: `linear-gradient(90deg, ${project.color}, ${project.textColor})`,
                        boxShadow: `0 0 12px ${project.color}55`,
                    }}
                />
            </div>
        </motion.div>
    );
};

const ChainModel = ({ mirrored = false }) => {
    const chainData = useMemo(() => {
        return [
            { position: new THREE.Vector3(2.36, 0, 0), rotation: [0, 0, 0], scale: [2.7, 0.72, 1] },
            { position: new THREE.Vector3(1.98, 0.02, 0), rotation: [Math.PI / 2, 0, 0.16], scale: [2.55, 0.72, 1] },
            { position: new THREE.Vector3(1.56, 0, 0), rotation: [0, 0, 0], scale: [2.7, 0.72, 1] },
            { position: new THREE.Vector3(1.16, 0.02, 0), rotation: [Math.PI / 2, 0, 0.14], scale: [2.55, 0.72, 1] },
            { position: new THREE.Vector3(0.72, 0, 0), rotation: [0, 0, 0], scale: [2.7, 0.72, 1] },
            { position: new THREE.Vector3(0.32, 0.02, 0), rotation: [Math.PI / 2, 0, 0.12], scale: [2.55, 0.72, 1] },
            { position: new THREE.Vector3(-0.1, 0, 0), rotation: [0, 0, 0], scale: [2.7, 0.72, 1] },
            { position: new THREE.Vector3(-0.5, 0.02, 0), rotation: [Math.PI / 2, 0, 0.1], scale: [2.55, 0.72, 1] },
            { position: new THREE.Vector3(-0.94, 0, 0), rotation: [0, 0, 0], scale: [2.7, 0.72, 1] },
            { position: new THREE.Vector3(-1.34, 0.02, 0), rotation: [Math.PI / 2, 0, 0.08], scale: [2.55, 0.72, 1] },
            { position: new THREE.Vector3(-1.78, 0, 0), rotation: [0, 0, 0], scale: [2.7, 0.72, 1] },
        ];
    }, []);

    return (
        <group scale={mirrored ? [-1, 1, 1] : [1, 1, 1]}>
            {chainData.map((link, index) => (
                <group
                    key={index}
                    position={link.position}
                    rotation={link.rotation}
                >
                    <mesh scale={link.scale} castShadow receiveShadow>
                        <torusGeometry args={[0.128, 0.034, 16, 40]} />
                        <meshPhysicalMaterial
                            color="#dce2eb"
                            metalness={0.62}
                            roughness={0.24}
                            clearcoat={0.88}
                            reflectivity={0.92}
                        />
                    </mesh>
                </group>
            ))}

            <mesh position={[2.9, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.05, 0.05, 0.18, 20]} />
                <meshPhysicalMaterial color="#cfd7e3" metalness={0.42} roughness={0.26} clearcoat={0.74} />
            </mesh>
            <mesh position={[2.68, 0, 0]} rotation={[0, 0, 0]} castShadow receiveShadow scale={[1.4, 0.95, 1]}>
                <torusGeometry args={[0.082, 0.022, 14, 28]} />
                <meshPhysicalMaterial color="#e2e8f0" metalness={0.5} roughness={0.25} clearcoat={0.78} />
            </mesh>
        </group>
    );
};

const ChainDecoration3D = ({ side = 'left' }) => {
    const isLeft = side === 'left';

    return (
        <div className={`pointer-events-none absolute top-1/2 hidden h-[150px] w-[360px] -translate-y-1/2 lg:block ${isLeft ? 'right-full -mr-4' : 'left-full -ml-4'}`}>
            <Canvas
                camera={{ position: [0.14, 2.1, 1.42], fov: 20 }}
                dpr={[1, 1.5]}
                frameloop="demand"
                shadows
                gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
            >
                <ambientLight intensity={1.15} />
                <directionalLight position={[4, 4, 5]} intensity={1.5} castShadow shadow-mapSize={[512, 512]} />
                <directionalLight position={[-3, -2, 2]} intensity={0.38} color="#94a3b8" />
                <group rotation={[-0.58, 0, 0]}>
                    <ChainModel mirrored={!isLeft} />
                </group>
            </Canvas>
        </div>
    );
};

const FauxShelf = ({ projects }) => {
    const primaryProject = projects[0];

    return (
        <div className="relative overflow-visible rounded-[2.4rem] border-[4px] border-[#eef2f8] bg-[linear-gradient(180deg,#d8dde6_0%,#c3cad5_42%,#b1bccb_100%)] p-4 shadow-[inset_0_3px_0_rgba(255,255,255,0.96),inset_0_-8px_14px_rgba(100,116,139,0.24),12px_12px_0_rgba(148,163,184,0.5),0_22px_44px_rgba(15,23,42,0.14)] md:p-6">
            <ChainDecoration3D side="left" />
            <ChainDecoration3D side="right" />
            <div className="absolute left-18 top-[-14px] h-3.5 w-20 rounded-full border border-slate-300 bg-[linear-gradient(180deg,#eef2f7_0%,#c7cfda_100%)] shadow-[0_2px_0_rgba(255,255,255,0.6)]" />
            <div className="absolute inset-x-5 top-2 h-6 rounded-full bg-white/60 blur-md" />
            <div className="absolute inset-y-5 left-[-10px] w-2 rounded-l-full bg-[linear-gradient(180deg,#94a3b8_0%,#64748b_100%)] opacity-80" />
            <div className="absolute inset-y-5 right-[-10px] w-2 rounded-r-full bg-[linear-gradient(180deg,#94a3b8_0%,#64748b_100%)] opacity-80" />
            <div className="absolute bottom-[-10px] left-[8%] right-[8%] h-5 rounded-full bg-slate-900/18 blur-2xl" />

            <div className="rounded-[2rem] border-[2px] border-[#4b5563]/45 bg-[linear-gradient(180deg,#566274_0%,#3c4758_16%,#202938_100%)] p-5 shadow-[inset_0_14px_24px_rgba(255,255,255,0.08),inset_0_-22px_34px_rgba(0,0,0,0.42)] md:min-h-[390px] md:p-7">
                <div className="pointer-events-none absolute inset-x-10 top-[18%] h-[52%] rounded-full bg-sky-300/8 blur-3xl" />
                <div className="pointer-events-none absolute inset-7 rounded-[1.6rem] border border-white/6 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.25)]" />

                <div className="relative flex min-h-[280px] flex-col gap-5 md:min-h-[320px] md:flex-row md:items-stretch">
                    <div className="relative w-full md:w-[340px] md:min-w-[340px] lg:w-[360px] lg:min-w-[360px]">
                        <div className="absolute left-[14%] right-[14%] bottom-[-20px] h-6 rounded-full bg-black/35 blur-xl" />
                        <div className="absolute left-[6%] right-[6%] bottom-[-8px] h-4 rounded-[0.8rem] border border-slate-400/80 bg-[linear-gradient(180deg,#95a4bc_0%,#7b8aa4_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]" />
                        <FauxProjectCard project={primaryProject} index={0} />
                    </div>

                    <div className="relative hidden min-w-0 flex-1 overflow-hidden rounded-[1.5rem] border border-white/5 bg-[linear-gradient(180deg,rgba(148,163,184,0.06)_0%,rgba(15,23,42,0.06)_100%)] md:block">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_42%)]" />
                        <div className="absolute inset-y-8 left-8 w-px bg-white/10" />
                        <div className="absolute inset-y-8 right-8 w-px bg-white/8" />
                        <div className="absolute inset-x-8 top-10 h-px bg-white/8" />
                        <div className="absolute inset-x-8 bottom-10 h-px bg-white/8" />
                    </div>
                </div>
            </div>

            <div className="mt-5 h-7 rounded-[1rem] border border-[#e2e8f0] bg-[linear-gradient(180deg,#dbe4ef_0%,#a9b6c8_100%)] shadow-[inset_0_2px_0_rgba(255,255,255,0.92),inset_0_-2px_3px_rgba(71,85,105,0.18)]" />
        </div>
    );
};

export default function FeaturedProjects({ repos = [] }) {
    const prefersReducedMotion = useReducedMotion();

    const projects = useMemo(() => {
        const data = repos && repos.length > 0
            ? repos.slice(0, 3)
            : [
                { title: 'Alias Pariatur Quam.' },
                { title: 'Eum Eos Ut.' },
                { title: 'Est Voluptatem Quia.' },
            ];

        const palettes = [
            { color: '#3b82f6', textColor: '#1d4ed8' },
            { color: '#ec4899', textColor: '#be185d' },
            { color: '#22c55e', textColor: '#15803d' },
        ];

        return data.map((repo, index) => {
            const palette = palettes[index % palettes.length];
            const rawTitle = (repo?.title ?? repo?.name ?? '').toString().trim();

            return {
                title: rawTitle.length > 0 ? rawTitle : 'Untitled Project',
                color: palette.color,
                textColor: palette.textColor,
                link: repo?.link,
            };
        });
    }, [repos]);

    return (
        <section className="relative z-10 mb-16 w-full overflow-visible py-12">
            <div className="mx-auto max-w-7xl px-4 md:px-12">
                <div className="relative mb-4 flex flex-col items-end justify-between gap-4 overflow-visible px-4 md:mb-8 md:flex-row">
                    <div className="z-10 flex flex-col gap-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7, y: 18, rotate: -4 }}
                            animate={prefersReducedMotion ? { opacity: 1, scale: 1, y: 0, rotate: 0 } : { opacity: 1, scale: 1, y: [0, -4, 0], rotate: [0, -1.2, 0.8, 0] }}
                            transition={prefersReducedMotion
                                ? { type: 'spring', stiffness: 260, damping: 18 }
                                : {
                                    opacity: { duration: 0.3 },
                                    scale: { type: 'spring', stiffness: 260, damping: 18 },
                                    y: [{ type: 'spring', stiffness: 260, damping: 18 }, { duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }],
                                    rotate: { duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.1 },
                                }}
                            className="self-start rounded-full border border-white/60 bg-[#fbbf24] px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#78350f] shadow-lg md:text-[11px]"
                        >
                            Collectors Edition
                        </motion.div>

                        <h2 className="flex flex-col items-start text-[3.5rem] font-black leading-[0.85] tracking-tighter md:text-7xl lg:text-8xl">
                            <StaggeredText
                                text="FEATURED"
                                delay={0.2}
                                className="text-slate-800"
                                letterStyle={{
                                    textShadow: '0 2px 0 #0f172a, 0 5px 0 #334155, 0 10px 16px rgba(15,23,42,0.18)',
                                }}
                            />
                            <StaggeredText
                                text="PROJECTS"
                                delay={0.4}
                                className="text-pink-500"
                                letterStyle={{
                                    textShadow: '0 2px 0 #db2777, 0 5px 0 #be185d, 0 10px 16px rgba(157,23,77,0.2)',
                                }}
                            />
                        </h2>
                    </div>

                    <div className="z-10 mt-4 rounded-xl border border-slate-300 bg-[#cbd5e1] p-[3px] shadow-inner md:mt-0">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigateWithCleanup('/projects')}
                            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),_0_3px_6px_rgba(0,0,0,0.3)] md:text-sm"
                        >
                            See Collection
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" className="mb-[2px] opacity-90">
                                <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"></path>
                            </svg>
                        </motion.button>
                    </div>
                </div>

                <FauxShelf projects={projects} />
            </div>
        </section>
    );
}
