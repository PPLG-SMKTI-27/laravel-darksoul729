import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import MainLayout from '../Layout/MainLayout';
import PlasticButton from '../UI/PlasticButton';
import { navigateWithCleanup } from '../lib/pageTransitionCleanup';

gsap.registerPlugin(ScrollTrigger);


const Projects = ({ page, props }) => {
    const { repos = [], project = null } = props;
    const comp = useRef();
    const gridRef = useRef();
    const prefersReducedMotion = useReducedMotion();

    const ITEMS_PER_PAGE = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isTouchOptimized, setIsTouchOptimized] = useState(false);
    const totalPages = Math.ceil(repos.length / ITEMS_PER_PAGE);
    const currentRepos = repos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => {
        const updateTouchOptimization = () => {
            const isMobileViewport = window.innerWidth < 768;
            const isCoarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
            const saveData = navigator.connection?.saveData ?? false;

            setIsTouchOptimized(prefersReducedMotion || isMobileViewport || isCoarsePointer || saveData);
        };

        updateTouchOptimization();
        window.addEventListener('resize', updateTouchOptimization);

        return () => {
            window.removeEventListener('resize', updateTouchOptimization);
        };
    }, [prefersReducedMotion]);

    const modalCardLayoutId = selectedProject && !isTouchOptimized ? `card-${selectedProject.id}` : undefined;
    const modalImageLayoutId = selectedProject && !isTouchOptimized ? `image-${selectedProject.id}` : undefined;
    const modalContentAnimation = isTouchOptimized
        ? {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 12 },
            transition: { duration: 0.18, ease: 'easeOut' },
        }
        : {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.24, ease: 'easeOut' },
        };

    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
        // Subtle move to grid top only if user is below it, keeps "camera" stable
        const gridTop = gridRef.current?.getBoundingClientRect().top + window.scrollY - 100;
        if (window.scrollY > gridTop) {
            window.scrollTo({ top: gridTop, behavior: 'smooth' });
        }
    };

    // Prevent background scroll when modal is open
    useEffect(() => {
        if (selectedProject) {
            window.dispatchEvent(new CustomEvent('lock-scroll'));
        } else {
            window.dispatchEvent(new CustomEvent('unlock-scroll'));
        }
        return () => {
            window.dispatchEvent(new CustomEvent('unlock-scroll'));
        };
    }, [selectedProject]);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Grid cards stagger reveal
            gsap.utils.toArray('.project-card').forEach((card, i) => {
                gsap.fromTo(card,
                    { y: 60, opacity: 0, scale: 0.95 },
                    {
                        scrollTrigger: {
                            trigger: card,
                            start: "top 90%",
                            toggleActions: "play none none reverse"
                        },
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        ease: "power3.out"
                    }
                );
            });

            // Allow ScrollTrigger to recalculate after layout finishes painting
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 1000);

        }, comp);
        return () => ctx.revert();
    }, [currentPage]);

    // Framer Motion Variants for Staggered Title Reveal
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const wordContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const letterVariants = {
        hidden: { y: 100, opacity: 0, rotateX: -90, scale: 0.8 },
        visible: {
            y: 0,
            opacity: 1,
            rotateX: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 150,
                damping: 20,
                mass: 1
            }
        }
    };

    const fadeInVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "tween", duration: 0.8, ease: "easeOut" }
        }
    };

    // Pagination Grid Transition Variants
    const gridTransitionVariants = {
        initial: { opacity: 0, x: 30, filter: "blur(10px)" },
        enter: {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.6,
                ease: [0.19, 1, 0.22, 1],
                staggerChildren: 0.05
            }
        },
        exit: {
            opacity: 0,
            x: -30,
            filter: "blur(10px)",
            transition: { duration: 0.4, ease: "easeIn" }
        }
    };

    const titleText1 = "RECOVERED";
    const titleText2 = "ARTIFACTS";

    return (
        <MainLayout page={page}>
            <div ref={comp} className="relative min-h-screen text-stone-300 font-sans selection:bg-orange-500/30">
                {/* Hero Section */}
                <section className={`relative flex w-full flex-col items-center justify-center overflow-hidden px-4 z-10 ${isTouchOptimized ? 'min-h-[76vh] pt-10 pb-6' : 'min-h-[90vh] pt-20 pb-10'}`}>

                    {/* Decorative Background Elements (Underground Theme) */}
                    <div className={`absolute inset-0 pointer-events-none overflow-hidden flex flex-col justify-between ${isTouchOptimized ? 'p-3' : 'p-4 md:p-8'}`}>
                        {/* Top HUD elements to fill empty mobile space */}
                        <div className={`flex justify-between items-start w-full max-w-7xl mx-auto ${isTouchOptimized ? 'pt-16 opacity-26' : 'pt-24 md:pt-28 opacity-40'}`}>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] md:text-xs font-mono text-orange-500/80 tracking-[0.2em]">SYS.LOC // SEC-07</span>
                                <div className="w-8 md:w-16 h-[1px] bg-orange-500/50"></div>
                                <div className="w-4 md:w-8 h-[1px] bg-orange-500/30 mt-0.5"></div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[10px] md:text-xs font-mono text-stone-500 tracking-[0.2em]">STATUS: DEEP_SLEEP</span>
                                <div className="flex gap-1.5 mt-1">
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full border border-stone-600"></div>
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-orange-500/60 shadow-[0_0_5px_#f97316]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Subtle Grid Lines for Texture */}
                        <div className={`absolute inset-0 flex items-center justify-center ${isTouchOptimized ? 'opacity-12' : 'opacity-20'}`}>
                            <div className="w-[120%] h-[1px] bg-stone-800 rotate-[15deg]"></div>
                            <div className="w-[1px] h-[120%] bg-stone-800 rotate-[15deg] absolute"></div>
                        </div>
                    </div>

                    {/* Hero Content Overlay using Framer Motion */}
                    <motion.div
                        className={`relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center text-center ${isTouchOptimized ? 'mt-10 gap-5 pb-2' : 'mt-32 md:mt-0'}`}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={fadeInVariants}>
                            <h2 className={`text-orange-500 font-mono tracking-[0.3em] uppercase font-bold bg-orange-500/10 rounded-full border border-orange-500/20 backdrop-blur-sm shadow-[0_0_15px_rgba(249,115,22,0.2)] ${isTouchOptimized ? 'mb-3 px-4 py-2 text-[11px]' : 'mb-6 px-4 py-2 text-xs md:text-sm'}`}>
                                Vault 07
                            </h2>
                        </motion.div>

                        <h1
                            className={`font-black tracking-tighter flex flex-col items-center gap-1.5 text-[#e7e5e4] drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] leading-[0.85] ${isTouchOptimized ? 'mb-1 max-w-[320px] py-1 text-[3.35rem]' : 'mb-4 py-4 text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] gap-2'}`}
                            style={{
                                textShadow: `
                                    0px 2px 0px #a8a29e,
                                    0px 4px 0px #78716c,
                                    0px 8px 10px rgba(0,0,0,0.5)
                                `
                            }}
                        >
                            <motion.span variants={wordContainerVariants} className={`flex overflow-visible ${isTouchOptimized ? 'pb-1' : 'pb-2'}`} style={{ perspective: '1000px' }} initial="hidden" animate="visible">
                                {titleText1.split('').map((char, index) => (
                                    <motion.span key={`char1-${index}`} variants={letterVariants} className="inline-block origin-bottom">
                                        {char}
                                    </motion.span>
                                ))}
                            </motion.span>
                            <motion.span variants={wordContainerVariants} className={`flex overflow-visible ${isTouchOptimized ? 'pb-1' : 'pb-2'}`} style={{ perspective: '1000px' }} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
                                {titleText2.split('').map((char, index) => (
                                    <motion.span key={`char2-${index}`} variants={letterVariants} className="inline-block origin-bottom">
                                        {char}
                                    </motion.span>
                                ))}
                            </motion.span>
                        </h1>

                        <motion.p variants={fadeInVariants} className={`text-stone-400 font-light leading-relaxed shadow-xl bg-stone-900/60 rounded-3xl border border-stone-700/30 mx-4 ${isTouchOptimized ? 'mb-4 max-w-[292px] px-5 py-4 text-[0.97rem]' : 'mb-8 max-w-2xl p-6 text-base sm:mb-12 sm:text-lg md:text-xl'}`}>
                            A curated collection of digital remnants, experimental prototypes, and polished formations excavated from the depths.
                        </motion.p>

                        <motion.div variants={fadeInVariants} className={`mx-auto group z-20 flex ${isTouchOptimized ? 'w-full max-w-[292px] flex-col gap-3' : 'w-[90%] flex-col gap-4 sm:w-auto sm:flex-row'}`}>
                            <PlasticButton
                                color="yellow"
                                className={`w-full transition-all hover:scale-105 !bg-[#b45309] !text-orange-50 !border-[#78350f] !shadow-[0_6px_0_#451a03,0_10px_20px_rgba(0,0,0,0.5)] shadow-[0_0_30px_rgba(180,83,9,0.2)] hover:!bg-[#92400e] ${isTouchOptimized ? 'px-5 py-3.5 text-[0.98rem]' : 'px-6 py-4 text-base sm:w-auto sm:px-10 sm:py-5 sm:text-lg'}`}
                                onClick={() => document.getElementById('grid-section').scrollIntoView({ behavior: 'smooth' })}
                            >
                                Explore Vault
                            </PlasticButton>
                            <PlasticButton
                                color="yellow"
                                className={`w-full transition-all hover:scale-105 !bg-[#1c1917] !text-stone-300 !border-[#0c0a09] !shadow-[0_6px_0_#000000,0_10px_20px_rgba(0,0,0,0.6)] shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:!bg-[#0c0a09] ${isTouchOptimized ? 'px-5 py-3.5 text-[0.98rem]' : 'px-6 py-4 text-base sm:w-auto sm:px-10 sm:py-5 sm:text-lg'}`}
                                onClick={() => navigateWithCleanup('/about')}
                            >
                                View Archives
                            </PlasticButton>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Vault Grid Section */}
                <section id="grid-section" ref={gridRef} className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 scroll-mt-10 sm:scroll-mt-24 w-full overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 sm:mb-16 border-b border-stone-800/80 pb-6 gap-4">
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-200 tracking-tight flex items-center gap-4 group">
                            <span className="w-10 sm:w-16 h-1 sm:h-2 bg-gradient-to-r from-orange-500 to-amber-300 rounded-full inline-block group-hover:w-20 transition-all duration-500"></span>
                            Excavation Log
                        </h3>
                        <div className="flex items-center gap-2 bg-stone-900/80 px-4 py-2 rounded-xl border border-stone-800 backdrop-blur-sm self-start sm:self-auto">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-stone-400 font-mono text-xs sm:text-sm tracking-widest">TOTAL FILES: {repos.length}</span>
                        </div>
                    </div>

                    {/* Modern Pagination Grid Container */}
                    <div className="relative w-full">
                        {/* Decorative background grid effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(28,25,23,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(28,25,23,0.1)_1px,transparent_1px)] bg-[size:3rem_3rem] -z-10 pointer-events-none opacity-50"></div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPage}
                                variants={gridTransitionVariants}
                                initial="initial"
                                animate="enter"
                                exit="exit"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12"
                            >
                                {currentRepos.map((repo, index) => {
                                    const isFeatured = index === 0 && currentPage === 1;
                                    return (
                                        <motion.div
                                            key={repo.id || index}
                                            layoutId={isTouchOptimized ? undefined : `card-${repo.id}`}
                                            onClick={() => setSelectedProject(repo)}
                                            className={`
                                                project-card group relative block cursor-pointer
                                                rounded-[2rem] overflow-hidden
                                                bg-[#1c1917] border border-[#292524]
                                                hover:bg-[#262626]
                                                transition-colors duration-300
                                                shadow-[0_6px_0_#0c0a09,0_10px_15px_rgba(0,0,0,0.5)]
                                                active:translate-y-1 active:shadow-[0_2px_0_#0c0a09]
                                                w-full transform-gpu will-change-transform
                                                aspect-square sm:aspect-[4/5]
                                                hover:-translate-y-1 hover:shadow-[0_8px_0_#0c0a09,0_15px_20px_rgba(0,0,0,0.6)]
                                            `}
                                        >
                                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-[#0a0a09]/80 to-transparent z-10 transition-all duration-500 group-hover:h-3/4"></div>

                                            {/* Image Container with Lazy Loading */}
                                            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                                                {repo.image_url ? (
                                                    <motion.img
                                                        layoutId={isTouchOptimized ? undefined : `image-${repo.id}`}
                                                        src={repo.image_url.startsWith('http') ? repo.image_url : `/storage/${repo.image_url}`}
                                                        alt={repo.title || 'Project image'}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="w-full h-full object-cover transform-gpu scale-100 group-hover:scale-105 opacity-90 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-[#0d0c0a] relative overflow-hidden">
                                                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent"></div>
                                                        <span className="text-7xl sm:text-8xl group-hover:scale-125 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] inline-block drop-shadow-[0_0_25px_rgba(249,115,22,0.3)] opacity-80 group-hover:opacity-100 z-10">
                                                            {['🔮', '💠', '☄️', '💎'][index % 4]}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0JyBoZWlnaHQ9JzQnPjxwYXRoIGQ9J00xIDBIMnYxSDF6TTIgMmgxdjFIMnomIGZpbGw9JyNmZmYnIGZpbGwtb3BhY2l0eT0nMS4wJy8+PC9zdmc+')] pointer-events-none z-0"></div>
                                            </div>

                                            {/* Content inside Card */}
                                            <div className="absolute inset-0 z-20 p-6 sm:p-8 lg:p-10 flex flex-col justify-end">
                                                <div className="transform translate-y-2 sm:translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] flex flex-col items-start">
                                                    {/* Tag */}
                                                    <div className="mb-3 sm:mb-4 flex items-center gap-2">
                                                        <span className="px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-mono font-bold tracking-widest rounded-[0.5rem] bg-stone-900/90 text-orange-500 border border-stone-800 shadow-md inline-flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-[pulse_3s_ease-in-out_infinite]"></span>
                                                            {isFeatured ? 'PRIME FIND' : `ID:${String(repo.id || index).padStart(3, '0')}`}
                                                        </span>
                                                    </div>

                                                    {/* Title */}
                                                    <motion.h4 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#e7e5e4] mb-2 sm:mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:text-orange-400 transition-colors duration-300 w-full line-clamp-1 sm:line-clamp-2">
                                                        {repo.title || `Anomaly ${index + 1}`}
                                                    </motion.h4>

                                                    {/* Subtitle/Description line */}
                                                    <p className="text-stone-400 font-light text-xs sm:text-sm lg:text-base line-clamp-2 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 max-w-xl drop-shadow-md">
                                                        {repo.description || "Unidentified data structure detected in sector 7G. Recommended for deeper analysis."}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-3 sm:gap-4 mt-20 sm:mt-28 pt-10 sm:pt-12 border-t border-stone-800/40 relative">
                            {/* Decorative line center block */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a09] px-4">
                                <div className="w-2 h-2 rounded-full bg-stone-700"></div>
                            </div>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`
                                        w-12 h-12 sm:w-16 sm:h-16 rounded-[1rem] sm:rounded-[1.25rem] flex items-center justify-center font-mono text-sm sm:text-base font-bold transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]
                                        ${currentPage === i + 1
                                            ? 'bg-orange-500 text-stone-900 shadow-[0_0_40px_rgba(249,115,22,0.4)] scale-110 sm:scale-125 ring-2 sm:ring-4 ring-orange-500/50 ring-offset-4 ring-offset-[#0a0a09] z-10'
                                            : 'bg-stone-900/80 text-stone-500 border border-stone-800/80 hover:border-orange-500/40 hover:text-orange-300 hover:bg-stone-800 hover:-translate-y-1'
                                        }
                                        relative overflow-hidden group backdrop-blur-xl
                                    `}
                                >
                                    <span className="relative z-10 flex items-center justify-center w-full h-full">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    {currentPage === i + 1 && (
                                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </section>

                {/* Framer Motion Shared Layout Modal */}
                {typeof document !== 'undefined' && createPortal(
                    <AnimatePresence initial={false}>
                        {selectedProject && (
                            <>
                                {/* Backdrop overlay */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setSelectedProject(null)}
                                    className="fixed inset-0 z-[200] bg-[#0c0a09]/90"
                                    style={{ transform: 'translateZ(0)' }}
                                />

                                {/* Modal Content */}
                                <div className="fixed inset-0 z-[201] flex items-center justify-center pointer-events-none p-4 sm:p-8">
                                    <motion.div
                                        layoutId={modalCardLayoutId}
                                        initial={modalContentAnimation.initial}
                                        animate={modalContentAnimation.animate}
                                        exit={modalContentAnimation.exit}
                                        transition={modalContentAnimation.transition}
                                        className="relative pointer-events-auto flex max-h-[90vh] w-full max-w-4xl flex-col overflow-y-auto rounded-3xl border border-stone-800 bg-[#1c1917] shadow-2xl custom-scrollbar"
                                    >
                                        {/* Close Button Inside */}
                                        <button
                                            onClick={() => setSelectedProject(null)}
                                            className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-stone-700/50 bg-black/50 text-stone-300 backdrop-blur-md transition-colors hover:border-orange-500 hover:bg-orange-500 hover:text-black"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>

                                        {/* Modal Image Hero */}
                                        <div className="relative h-[40vh] w-full shrink-0 border-b border-stone-800 sm:h-[50vh]">
                                            {selectedProject.image_url ? (
                                                isTouchOptimized ? (
                                                    <img
                                                        src={selectedProject.image_url.startsWith('http') ? selectedProject.image_url : `/storage/${selectedProject.image_url}`}
                                                        alt={selectedProject.title}
                                                        className="h-full w-full object-cover filter saturate-[0.9]"
                                                    />
                                                ) : (
                                                    <motion.img
                                                        layoutId={modalImageLayoutId}
                                                        src={selectedProject.image_url.startsWith('http') ? selectedProject.image_url : `/storage/${selectedProject.image_url}`}
                                                        alt={selectedProject.title}
                                                        className="h-full w-full object-cover filter saturate-[0.9]"
                                                    />
                                                )
                                            ) : (
                                                <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#0d0c0a]">
                                                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent"></div>
                                                    <span className="z-10 inline-block text-8xl opacity-100 drop-shadow-[0_0_25px_rgba(249,115,22,0.3)]">
                                                        🔮
                                                    </span>
                                                </div>
                                            )}
                                            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-[#1c1917] to-transparent"></div>
                                        </div>

                                        {/* Modal Details Section */}
                                        <div className="relative z-20 -mt-20 flex flex-col gap-6 p-6 sm:p-10">
                                            <motion.h2
                                                className="text-3xl font-black text-[#e7e5e4] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] sm:text-5xl"
                                            >
                                                {selectedProject.title || 'Anomaly Details'}
                                            </motion.h2>

                                            <div className="flex gap-4">
                                                <span className="rounded-md border border-stone-800 bg-stone-900 px-3 py-1 text-xs font-mono font-bold tracking-widest text-stone-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                                                    ID: {String(selectedProject.id).padStart(3, '0')}
                                                </span>
                                                <span className="rounded-md border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-orange-400">
                                                    RECOVERED DATA
                                                </span>
                                            </div>

                                            <div className="prose prose-invert prose-stone mt-4 max-w-none font-light text-stone-400">
                                                <p className="text-lg leading-relaxed">{selectedProject.description || 'Analysis of this sector reveals complex structural layering. Data extraction complete.'}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
            </div>
        </MainLayout>
    );
};

export default Projects;
