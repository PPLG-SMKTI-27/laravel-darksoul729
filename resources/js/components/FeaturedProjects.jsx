import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { navigateWithCleanup } from '../lib/pageTransitionCleanup';

const Animated3DTitle = ({ text, isCompact = false, prefersReducedMotion = false }) => {
    const palette3D = [
        { front: '#ff5a6e', drop: '#d33b4e' }, // Pink
        { front: '#ff9c3a', drop: '#d17215' }, // Orange
        { front: '#ffdb4b', drop: '#cca816' }, // Yellow
        { front: '#5dd462', drop: '#34a83b' }, // Green
        { front: '#5ea3ff', drop: '#2e75d6' }, // Blue
        { front: '#b77aff', drop: '#8f46e4' }, // Purple
        { front: '#ff66c4', drop: '#d03893' }, // Magenta
    ];

    const generate3DShadow = (dropColor) => `
        0 1px 0 ${dropColor},
        0 2px 0 ${dropColor},
        0 3px 0 ${dropColor},
        0 4px 0 ${dropColor},
        0 5px 0 ${dropColor},
        0 6px 0 ${dropColor},
        0 7px 0 ${dropColor},
        0 8px 0 ${dropColor},
        0 15px 15px rgba(0,0,0,0.2)
    `;

    const words = text.split(' ');
    let globalIndex = 0;

    return (
        <h2 className="flex flex-wrap items-center justify-center gap-2.5 max-[420px]:gap-2 md:justify-start md:gap-7">
            {words.map((word, wIdx) => (
                <div key={wIdx} className="flex pb-3 max-[420px]:pb-2 md:pb-4">
                    {word.split('').map((char, cIdx) => {
                        const idx = globalIndex++;
                        const colorSet = palette3D[idx % palette3D.length];

                        return (
                            <motion.span
                                key={idx}
                                className={`block font-black uppercase leading-none ${isCompact ? 'text-[clamp(1.7rem,8.2vw,2.2rem)] sm:text-[2.45rem]' : 'text-[2.55rem] md:text-6xl lg:text-[4.5rem]'}`}
                                style={{
                                    color: colorSet.front,
                                    textShadow: generate3DShadow(colorSet.drop),
                                    marginLeft: char === 'I' ? '0.12rem' : '0.04rem',
                                    marginRight: char === 'I' ? '0.12rem' : '0.04rem'
                                }}
                                animate={prefersReducedMotion ? undefined : { y: [0, isCompact ? -7 : -12, 0] }}
                                transition={prefersReducedMotion ? undefined : {
                                    duration: isCompact ? 3.4 : 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: idx * (isCompact ? 0.06 : 0.1),
                                }}
                            >
                                {char}
                            </motion.span>
                        );
                    })}
                </div>
            ))}
        </h2>
    );
};

const BlockLetters = ({ text, isCompact = false }) => {
    // Colors matching the tactile colorful letters in the user's reference
    const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6'];
    const words = text.split(' ');

    return (
        <div className="mb-4 flex flex-col gap-2 max-[420px]:mb-3">
            {words.map((word, wordIdx) => (
                <div key={wordIdx} className="flex max-w-full flex-wrap items-center gap-y-1">
                    {word.split('').map((char, i) => (
                        <span
                            key={i}
                            className={`font-black uppercase leading-none ${isCompact ? 'text-[clamp(0.92rem,4.8vw,1.05rem)] tracking-[0.05em]' : 'text-[1.45rem] md:text-[2.5rem] tracking-[0.08em] md:tracking-wide'}`}
                            style={{
                                color: colors[i % colors.length],
                                textShadow: `
                                    0 1px 0 #ffffff, 
                                    0 2px 0 #cbd5e1, 
                                    0 3px 0 #94a3b8, 
                                    0 4px 5px rgba(0,0,0,0.3),
                                    0 10px 15px rgba(0,0,0,0.1)
                                `,
                                marginRight: '0.08rem',
                            }}
                        >
                            {char}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
};

const getCompactDescription = (description) => {
    const fallback = 'NO DATA GIVEN. RUNNING DEFAULT SEQUENCE.';
    const normalizedDescription = (description ?? fallback).toString().trim();

    if (normalizedDescription.length <= 88) {
        return normalizedDescription;
    }

    return `${normalizedDescription.slice(0, 88).trimEnd()}...`;
};

const optimizeProjectImageUrl = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
        return imageUrl;
    }

    try {
        const url = new URL(imageUrl);

        if (url.hostname.includes('images.unsplash.com')) {
            url.searchParams.set('auto', 'format');
            url.searchParams.set('fit', 'crop');
            url.searchParams.set('q', '80');
            url.searchParams.set('w', '1400');
        }

        return url.toString();
    } catch {
        return imageUrl;
    }
};

export default function FeaturedProjects({ repos = [] }) {
    const prefersReducedMotion = useReducedMotion();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isCompactScreen, setIsCompactScreen] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const mediaQuery = window.matchMedia('(max-width: 767px)');
        const updateCompactScreen = () => {
            setIsCompactScreen(mediaQuery.matches);
        };

        updateCompactScreen();
        mediaQuery.addEventListener('change', updateCompactScreen);

        return () => {
            mediaQuery.removeEventListener('change', updateCompactScreen);
        };
    }, []);

    const projects = useMemo(() => {
        const data = repos && repos.length > 0
            ? repos.slice(0, 3)
            : [
                { title: 'Cyber Interface', description: 'Advanced interface for tactical datastreams with high-fidelity visual feedback.', tech: 'React & WebGL' },
                { title: 'Neural Core', description: 'Deep learning visualization dashboard powered by quantum logic engines.', tech: 'Python & Vue' },
                { title: 'Dark Soul', description: 'Decentralized vault systems with sub-millisecond market telemetry.', tech: 'Solidity & NextJS' },
            ];

        // Cable color palettes matching the colorful cables
        const palettes = [
            { cableColor: '#ef4444', glow: 'from-red-500/20 to-transparent' }, // Red
            { cableColor: '#facc15', glow: 'from-yellow-500/20 to-transparent' }, // Yellow
            { cableColor: '#22c55e', glow: 'from-green-500/20 to-transparent' }, // Green
        ];

        const defaultImages = [
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80', // Cyber security
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', // Hardware
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80', // Code matrix
        ];

        return data.map((repo, index) => {
            const palette = palettes[index % palettes.length];
            const rawTitle = (repo?.title ?? repo?.name ?? '').toString().trim();
            const rawImageUrl = repo?.image_url
                ? (repo.image_url.startsWith('http') ? repo.image_url : `/storage/${repo.image_url}`)
                : defaultImages[index % defaultImages.length];

            return {
                title: rawTitle.length > 0 ? rawTitle : `Project ${index + 1}`,
                description: repo?.description,
                cableColor: palette.cableColor,
                glow: palette.glow,
                tech: repo?.tech || 'Web Technologies',
                link: repo?.link,
                image: optimizeProjectImageUrl(rawImageUrl),
            };
        });
    }, [repos]);

    useEffect(() => {
        if (typeof window === 'undefined' || typeof Image === 'undefined') {
            return;
        }

        const preloaders = projects
            .map((project) => project.image)
            .filter(Boolean)
            .map((imageSource) => {
                const image = new Image();
                image.decoding = 'async';
                image.loading = 'eager';
                image.src = imageSource;

                if (typeof image.decode === 'function') {
                    image.decode().catch(() => {});
                }

                return image;
            });

        return () => {
            preloaders.forEach((image) => {
                image.src = '';
            });
        };
    }, [projects]);

    return (
        <section className="featured-projects-shell relative z-10 mb-20 w-full overflow-visible px-2 py-10 max-[420px]:px-1.5 md:px-8 md:py-16">
            <div className="mx-auto max-w-[1400px]">

                {/* Header Title - 3D Hovering Letters */}
                <div className="mt-1 mb-4 flex justify-center max-[420px]:mb-3 md:mt-0 md:mb-10 md:ml-6 md:justify-start">
                    <Animated3DTitle text="FEATURED PROJECTS" isCompact={isCompactScreen} prefersReducedMotion={prefersReducedMotion} />
                </div>

                {/* THE MASSIVE ANALOGUE HARDWARE CONSOLE */}
                <div className="relative flex w-full flex-col gap-4 overflow-visible rounded-[1.6rem] border-[4px] border-[#eef2f8] bg-[#c3cad5] p-2.5 shadow-[inset_0_4px_0_rgba(255,255,255,0.95),inset_0_-8px_16px_rgba(100,116,139,0.3),0_20px_40px_rgba(15,23,42,0.15)] max-[420px]:gap-3 max-[420px]:rounded-[1.35rem] max-[420px]:p-2 md:gap-8 md:rounded-[2.5rem] md:p-5 xl:flex-row">

                    {/* LEFT: Massive Inset Output Monitor */}
                    <div className="relative aspect-[11/15] min-h-[340px] flex-1 rounded-[1.35rem] border-[4px] border-[#334155] bg-[linear-gradient(180deg,#20242b_0%,#16191f_50%,#0e1014_100%)] p-2.5 shadow-[inset_0_12px_24px_rgba(255,255,255,0.06),inset_0_-12px_24px_rgba(0,0,0,0.6)] max-[420px]:min-h-[315px] max-[420px]:rounded-[1.1rem] max-[420px]:p-2 md:min-h-[450px] md:aspect-[3/4] md:rounded-[2rem] md:p-4 xl:min-h-[550px] xl:aspect-auto">

                        {/* Power LED */}
                        <div className="absolute left-4 top-4 h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444] max-[420px]:left-3.5 max-[420px]:top-3.5" />

                        {/* Console Vents */}
                        <div className="absolute left-3 top-[50%] -mt-6 flex flex-col gap-2 max-[420px]:left-2.5 max-[420px]:gap-1.5">
                            <div className="h-6 w-2 rounded-r bg-slate-900 shadow-inner" />
                            <div className="h-6 w-2 rounded-r bg-slate-900 shadow-inner" />
                            <div className="h-6 w-2 rounded-r bg-slate-900 shadow-inner" />
                        </div>

                        {/* The Glass Screen */}
                        <div className="relative ml-3.5 mt-4 h-[calc(100%-1rem)] w-[calc(100%-0.8rem)] overflow-hidden rounded-xl border-2 border-slate-900/80 bg-[#0d1117] shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] max-[420px]:ml-3 max-[420px]:mt-3.5 max-[420px]:h-[calc(100%-0.7rem)] max-[420px]:w-[calc(100%-0.55rem)] md:ml-6 md:mt-6 md:h-[calc(100%-2rem)] md:w-[calc(100%-2rem)]">

                            {/* Scanlines overlay */}
                            <div className={`pointer-events-none absolute inset-0 z-20 ${isCompactScreen ? 'opacity-12' : 'opacity-20'}`} style={{ background: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: isCompactScreen ? '100% 5px' : '100% 4px' }} />
                            <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08)_0%,transparent_60%)]" />

                            {projects.map((project, index) => {
                                const isActiveProject = index === activeIndex;

                                return (
                                    <motion.div
                                        key={`${project.title}-${index}`}
                                        initial={false}
                                        animate={isActiveProject
                                            ? { opacity: 1, y: 0, scale: 1 }
                                            : { opacity: 0, y: 6, scale: 0.995 }}
                                        transition={{ duration: isCompactScreen ? 0.16 : 0.2, ease: 'easeOut' }}
                                        className={`group absolute inset-0 z-10 flex h-full w-full transform-gpu flex-col justify-end will-change-[transform,opacity] ${isCompactScreen ? 'p-3.5 max-[420px]:p-3' : 'p-5 md:p-14'} ${isActiveProject ? 'pointer-events-auto' : 'pointer-events-none'}`}
                                        aria-hidden={!isActiveProject}
                                    >
                                        {project.image && (
                                            <div className="absolute inset-0 z-0 overflow-hidden rounded-lg">
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className={`absolute inset-0 h-full w-full transform-gpu object-cover object-center will-change-[transform,opacity] ${isCompactScreen ? 'opacity-52 saturate-[0.72]' : 'opacity-60 saturate-[0.8] group-hover:opacity-100 group-hover:saturate-100'} transition-all duration-500 ease-out`}
                                                    loading="eager"
                                                    decoding="async"
                                                    fetchPriority={isActiveProject ? 'high' : 'low'}
                                                    sizes="(max-width: 767px) 88vw, (max-width: 1279px) 70vw, 820px"
                                                />
                                                <div className={`absolute inset-0 z-10 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/70 to-transparent transition-all duration-500 ${isCompactScreen ? 'opacity-94' : 'opacity-90 group-hover:opacity-80'}`} />
                                                <div className={`absolute inset-0 z-10 transition-all duration-500 ${isCompactScreen ? 'bg-black/50' : 'bg-black/40 group-hover:bg-black/10'}`} />

                                                {!isCompactScreen && !prefersReducedMotion && isActiveProject && (
                                                    <motion.div
                                                        animate={{ top: ['-10%', '110%'] }}
                                                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                                        className="absolute left-0 z-20 h-[2px] w-full pointer-events-none bg-[#4ade80]/30 shadow-[0_0_8px_#4ade80]"
                                                    />
                                                )}
                                            </div>
                                        )}

                                        <div className={`pointer-events-none absolute rounded-full bg-gradient-to-bl ${project.glow} z-0 ${isCompactScreen ? '-top-12 -right-12 h-52 w-52 opacity-20 blur-xl' : '-top-20 -right-20 h-96 w-96 opacity-28 blur-2xl'}`} />

                                        <div className="relative z-20 flex h-full w-full flex-col justify-end transition-transform duration-500 group-hover:translate-y-0 md:translate-y-2">
                                            <div className={`inline-flex flex-col items-start gap-1 ${isCompactScreen ? 'mb-2' : 'mb-3 md:mb-4'}`}>
                                                <span className={`font-mono uppercase tracking-widest text-slate-300 drop-shadow-md ${isCompactScreen ? 'text-[8px]' : 'text-[10px]'}`}>
                                                    [SYSTEM.OK] // MODULE_DATA_STREAM
                                                </span>
                                                <div className={`inline-block rounded border border-[#4ade80]/40 bg-black/55 px-3 py-1 font-mono uppercase tracking-widest text-[#4ade80] shadow-[0_0_12px_rgba(74,222,128,0.16)] ${isCompactScreen ? 'text-[10px]' : 'text-xs'}`}>
                                                    {project.tech}
                                                </div>
                                            </div>

                                            <h3 className={`font-black uppercase text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] ${isCompactScreen ? 'max-w-[10ch] text-[clamp(1.55rem,8vw,1.95rem)] leading-[0.92] tracking-[-0.03em] [text-wrap:balance]' : 'text-[2.15rem] leading-[0.95] md:text-6xl lg:text-7xl xl:text-8xl tracking-[-0.04em] md:tracking-tighter'}`} style={{ textShadow: `0 2px 4px rgba(0,0,0,0.8), 0 0 ${isCompactScreen ? '24px' : '40px'} ${project.cableColor}70` }}>
                                                {project.title}
                                            </h3>

                                            <p className={`font-mono leading-relaxed text-slate-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${isCompactScreen ? 'mt-2.5 max-w-[26ch] text-[0.9rem] [text-wrap:pretty]' : 'mt-3 max-w-xl text-sm md:mt-6 md:max-w-2xl md:text-lg'}`}>
                                                &gt; {isCompactScreen ? getCompactDescription(project.description) : (project.description || 'NO DATA GIVEN. RUNNING DEFAULT SEQUENCE.')}
                                            </p>

                                            {isCompactScreen && isActiveProject && (
                                                <button
                                                    onClick={() => navigateWithCleanup('/projects')}
                                                    className="mt-3 inline-flex w-fit items-center font-mono text-[0.78rem] font-bold uppercase tracking-[0.18em] text-white/90 underline decoration-white/50 underline-offset-4 transition hover:text-[#4ade80] hover:decoration-[#4ade80]"
                                                >
                                                    See All
                                                </button>
                                            )}

                                            <div className={`${isCompactScreen ? 'mt-4 hidden' : 'mt-6 md:mt-10'}`}>
                                                <button
                                                    onClick={() => navigateWithCleanup(project.link || '/projects')}
                                                    className={`group/btn flex items-center font-mono font-bold uppercase text-white transition-all hover:text-[#4ade80] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${isCompactScreen ? 'gap-2 text-[0.82rem] tracking-[0.14em]' : 'gap-3 text-sm tracking-[0.3em] md:text-xl md:tracking-widest'}`}
                                                >
                                                    <span className={`h-1 bg-white transition-all group-hover/btn:bg-[#4ade80] ${isCompactScreen ? 'w-5 group-hover/btn:w-8' : 'w-6 group-hover/btn:w-12 md:w-8'}`} />
                                                    Execute Output
                                                </button>
                                            </div>
                                        </div>

                                        <div className="absolute top-6 right-6 z-20 hidden gap-4 rounded border border-white/10 bg-black/38 px-3 py-1.5 opacity-80 md:flex">
                                            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#4ade80] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                                                <span className={`h-1.5 w-1.5 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80] ${isActiveProject ? 'animate-pulse' : ''}`} />
                                                IMG_STREAM_ACTIVE
                                            </span>
                                            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                                                V.0{index + 1}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Persistent NO SIGNAL shadow text hidden closely behind */}
                            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-5 pointer-events-none">
                                <h1 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-[0.2em] text-white">NO SIGNAL</h1>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Embossed Input Cartridges */}
                    <div className="relative flex w-full shrink-0 flex-col justify-center gap-3.5 max-[420px]:gap-3 md:gap-5 xl:w-[420px]">
                        {projects.map((project, i) => {
                            const isActive = activeIndex === i;
                            return (
                                <div key={i} className="relative flex w-full items-center">

                                    {/* The Right Thick Cable Snaking Out! */}
                                    <div className="hidden xl:block absolute top-1/2 left-full -mt-4 h-8 w-[calc(100vw-((100vw-1400px)/2)-420px)] min-w-[120px]" style={{ zIndex: 0 }}>
                                        <div
                                            className="h-full w-full rounded-r-full border-y border-r border-black/20"
                                            style={{
                                                backgroundColor: project.cableColor,
                                                boxShadow: `inset 0 4px 6px rgba(255,255,255,0.6), inset 0 -4px 6px rgba(0,0,0,0.3), 0 10px 15px rgba(0,0,0,0.2)`,
                                                transform: isActive ? 'scaleX(1.3) skewY(5deg)' : 'scaleX(0.8)',
                                                transformOrigin: 'left center',
                                                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                            }}
                                        />
                                    </div>

                                    {/* The Embossed White Module Box */}
                                    <motion.button
                                        onClick={() => setActiveIndex(i)}
                                        whileHover={isCompactScreen ? undefined : { scale: 1.01 }}
                                        whileTap={{ scale: 0.985 }}
                                        className="group relative z-10 w-full overflow-hidden rounded-[1.25rem] border-[3px] border-white/90 p-3.5 text-left transition-colors max-[420px]:rounded-[1.1rem] max-[420px]:p-3 md:rounded-[1.8rem] md:p-8"
                                        style={{
                                            background: isActive ? 'linear-gradient(160deg, #ffffff 0%, #f4f7fb 100%)' : 'linear-gradient(160deg, #f1f4f9 0%, #e2e8f0 100%)',
                                            boxShadow: isActive
                                                ? 'inset 0 4px 0 rgba(255,255,255,1), inset 0 -6px 12px rgba(100,116,139,0.1), 0 15px 30px rgba(15,23,42,0.1)'
                                                : 'inset 0 4px 0 rgba(255,255,255,0.7), inset 0 -4px 8px rgba(100,116,139,0.1), 0 8px 16px rgba(15,23,42,0.05)',
                                        }}
                                    >
                                        <div className="mb-3 flex items-center gap-2.5 border-b border-slate-200 pb-3 md:mb-4 md:gap-3">
                                            {/* Status LED */}
                                            <div
                                                className="h-4 w-4 rounded-full border border-white/50"
                                                style={{
                                                    backgroundColor: isActive ? project.cableColor : '#94a3b8',
                                                    boxShadow: isActive ? `0 0 16px ${project.cableColor}, inset 0 2px 4px rgba(255,255,255,0.6)` : 'inset 0 2px 4px rgba(0,0,0,0.2)'
                                                }}
                                            />
                                            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 max-[420px]:text-[8px] md:text-[11px] md:tracking-widest">
                                                PORT 0{i + 1} // {isActive ? 'ACTIVE_SYNC' : 'IDLE'}
                                            </span>
                                        </div>

                                        {/* Multicolored 3D Typography exactly like reference */}
                                        <div className="my-3.5 max-w-full overflow-hidden md:my-6">
                                            <BlockLetters text={project.title} isCompact={isCompactScreen} />
                                        </div>

                                        <div className="mt-4 flex items-center justify-between md:mt-8">
                                            <div className="h-2 flex-1 max-w-[120px] rounded-full bg-slate-200 shadow-inner overflow-hidden">
                                                <div
                                                    className="h-full w-full rounded-full transition-transform duration-700 ease-out"
                                                    style={{
                                                        backgroundColor: project.cableColor,
                                                        transform: isActive ? 'translateX(0%)' : 'translateX(-100%)'
                                                    }}
                                                />
                                            </div>
                                            <div className="flex gap-1.5 opacity-40">
                                                <div className="h-1 w-4 rounded-full bg-slate-500" />
                                                <div className="h-1 w-4 rounded-full bg-slate-500" />
                                            </div>
                                        </div>
                                    </motion.button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Button below console */}
                <div className="mt-8 flex justify-center md:mt-10 md:justify-end">
                    <button
                        onClick={() => navigateWithCleanup('/projects')}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border-[3px] border-white bg-[#cbd3df] px-6 py-3 text-[0.78rem] font-black uppercase tracking-[0.22em] text-slate-700 shadow-[inset_0_2px_0_rgba(255,255,255,0.8),0_6px_10px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-1 hover:bg-white max-[420px]:px-4 md:w-auto md:px-8 md:text-sm md:tracking-widest"
                    >
                        See All Projects
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" className="ml-2">
                            <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
