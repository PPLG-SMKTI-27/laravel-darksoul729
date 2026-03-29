import React, { Suspense, useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { BadgeInfo, BriefcaseBusiness, House, LogIn, LogOut, Mail, Menu, Sparkles, X } from 'lucide-react';
import PlasticToast from '../UI/PlasticToast';
import PlasticModal from '../UI/PlasticModal';
import { cleanupPageRuntime, navigateWithCleanup } from '../lib/pageTransitionCleanup';

const Footer = React.lazy(() => import('../components/Footer'));
const SoilFooter = React.lazy(() => import('../components/SoilFooter'));
const IntroOverlay = React.lazy(() => import('../components/IntroOverlay'));

gsap.registerPlugin(ScrollTrigger);

const NAV_THEMES = {
    default: {
        logo: 'border-[#d6ecff] bg-[linear-gradient(180deg,#ffffff_0%,#edf7ff_100%)] text-[#29507b] shadow-[0_6px_0_#9dc9ec,_0_18px_30px_rgba(37,99,235,0.18)] hover:translate-y-[-1px]',
        navShell: 'rounded-full border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.42)_0%,rgba(191,219,254,0.2)_100%)] px-4 py-3 shadow-[inset_0_2px_0_rgba(255,255,255,0.7),0_18px_40px_rgba(59,130,246,0.18)] backdrop-blur-md',
        navItem: 'rounded-full border border-transparent text-[#f8fbff] hover:border-white/45 hover:bg-white/15 hover:text-white',
        navItemActive: 'rounded-full border border-[#bfdbfe] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(219,234,254,0.94)_100%)] text-[#1d4ed8] shadow-[0_4px_0_#93c5fd,0_12px_22px_rgba(37,99,235,0.2)]',
        action: 'border-[#cfd8e3] bg-[linear-gradient(180deg,#ffffff_0%,#ecf3ff_100%)] text-[#22324a] shadow-[0_5px_0_#b7c9df,_0_14px_25px_rgba(15,23,42,0.12)] hover:translate-y-[-1px]',
        mobileButton: 'border-[#d6ecff] bg-[linear-gradient(180deg,#ffffff_0%,#edf7ff_100%)] text-[#29507b] shadow-[0_6px_0_#9dc9ec,_0_18px_28px_rgba(37,99,235,0.16)]',
        sidebar: 'border-l-[#d6ecff] bg-[linear-gradient(180deg,rgba(248,251,255,0.98)_0%,rgba(231,243,255,0.98)_100%)] backdrop-blur-xl shadow-[inset_0_2px_0_rgba(255,255,255,0.9)]',
        sidebarItem: 'text-[#294567] hover:bg-white/65',
        sidebarItemActive: 'border-[#bfdbfe] bg-[linear-gradient(180deg,#ffffff_0%,#dbeafe_100%)] text-[#1d4ed8] shadow-[0_5px_0_#93c5fd,_0_12px_20px_rgba(37,99,235,0.14)]',
        sidebarAction: 'border-[#d7e6f7] bg-[linear-gradient(180deg,#ffffff_0%,#eef6ff_100%)] text-[#22324a] shadow-[0_4px_0_#c4d7ee,_0_12px_20px_rgba(15,23,42,0.08)] hover:bg-white',
        backdrop: 'bg-[#15304d]/28 backdrop-blur-[2px]',
        footer: 'text-[#5f7393]',
        heading: 'text-[#17314e]',
    },
};

const NAV_ITEM_ACCENTS = {
    Home: {
        chip: 'border-sky-200/70 bg-sky-100/90 text-sky-700',
        activeText: 'text-sky-700',
    },
    Projects: {
        chip: 'border-amber-200/70 bg-amber-100/90 text-amber-700',
        activeText: 'text-amber-700',
    },
    Skills: {
        chip: 'border-violet-200/70 bg-violet-100/90 text-violet-700',
        activeText: 'text-violet-700',
    },
    About: {
        chip: 'border-rose-200/70 bg-rose-100/90 text-rose-700',
        activeText: 'text-rose-700',
    },
    Contact: {
        chip: 'border-teal-200/70 bg-teal-100/90 text-teal-700',
        activeText: 'text-teal-700',
    },
    Login: {
        chip: 'border-[#d7dff1] bg-[#eef3fb] text-[#4b5f87]',
        activeText: 'text-[#32496b]',
    },
    Logout: {
        chip: 'border-fuchsia-200/70 bg-fuchsia-100/90 text-fuchsia-700',
        activeText: 'text-fuchsia-700',
    },
};

const MainLayout = ({ children, page, standalone = false, hideNavigation = false, hideFooter = false, fullBleed = false }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showIntro, setShowIntro] = useState(false);

    // Notification & Modal State
    const [toast, setToast] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isTouchOptimized, setIsTouchOptimized] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    const lenisRef = useRef(null);

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

    // Initialize Lenis for Smooth Scrolling
    useLayoutEffect(() => {
        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
        const isCoarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
        const saveData = navigator.connection?.saveData ?? false;
        const shouldDisableSmoothScroll = prefersReducedMotion || saveData || isCoarsePointer;

        const lockScroll = () => {
            lenisRef.current?.stop?.();
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        };

        const unlockScroll = () => {
            lenisRef.current?.start?.();
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };

        window.addEventListener('lock-scroll', lockScroll);
        window.addEventListener('unlock-scroll', unlockScroll);

        if (shouldDisableSmoothScroll) {
            return () => {
                window.removeEventListener('lock-scroll', lockScroll);
                window.removeEventListener('unlock-scroll', unlockScroll);
            };
        }

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        lenisRef.current = lenis;
        let rafId = 0;

        const raf = (time) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };

        rafId = requestAnimationFrame(raf);

        lenis.on('scroll', ScrollTrigger.update);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            lenisRef.current = null;
            window.removeEventListener('lock-scroll', lockScroll);
            window.removeEventListener('unlock-scroll', unlockScroll);
        };
    }, []);

    // Intro state is only needed on the landing page.
    useEffect(() => {
        if (page !== 'LandingPage') {
            setShowIntro(false);
            return;
        }

        // Intro
        const lastShown = localStorage.getItem('intro_last_shown');
        const now = new Date().getTime();
        const fiveMinutes = 5 * 60 * 1000;

        if (!lastShown || (now - parseInt(lastShown) > fiveMinutes)) {
            setShowIntro(true);
            localStorage.setItem('intro_last_shown', now.toString());
        }
    }, [page]);

    useEffect(() => {
        const flash = localStorage.getItem('plastic_flash');
        if (flash) {
            try {
                const parsed = JSON.parse(flash);
                setToast(parsed);
                localStorage.removeItem('plastic_flash');
            } catch (e) {
                console.error("Flash parse error", e);
            }
        }
    }, []);

    useEffect(() => {
        const handlePageHide = () => {
            cleanupPageRuntime({ lenis: lenisRef.current });
        };

        window.addEventListener('pagehide', handlePageHide);

        return () => {
            window.removeEventListener('pagehide', handlePageHide);
        };
    }, []);

    // Logout Logic
    const isLoggedIn = page === 'Dashboard' || (page && page.startsWith('Admin'));

    const handleLogoutClick = (e) => {
        e.preventDefault();
        setShowLogoutModal(true);
        setIsMenuOpen(false); // Close mobile menu if open
    };

    const confirmLogout = async () => {
        try {
            const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
            const csrfToken = csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : '';

            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            if (response.ok) {
                localStorage.setItem('plastic_flash', JSON.stringify({ message: "Successfully logged out.", type: "info" }));
                navigateWithCleanup('/', { lenis: lenisRef.current });
            } else {
                setToast({ message: "Logout failed. Try again.", type: "error" });
                setShowLogoutModal(false);
            }
        } catch (error) {
            setToast({ message: "Network error.", type: "error" });
            setShowLogoutModal(false);
        }
    };

    const handleNavigate = (href) => {
        if (window.location.pathname === href) {
            setIsMenuOpen(false);
            return;
        }

        if (isTouchOptimized && isMenuOpen) {
            setIsMenuOpen(false);
            window.setTimeout(() => {
                navigateWithCleanup(href, { lenis: lenisRef.current });
            }, 16);
            return;
        }

        setIsMenuOpen(false);
        navigateWithCleanup(href, { lenis: lenisRef.current });
    };

    const navItems = [
        { name: 'Home', href: '/', icon: House },
        { name: 'Projects', href: '/projects', icon: BriefcaseBusiness },
        { name: 'Skills', href: '/skills', icon: Sparkles },
        { name: 'About', href: '/about', icon: BadgeInfo },
        { name: 'Contact', href: '/contact', icon: Mail },
        isLoggedIn
            ? { name: 'Logout', href: '#', onClick: handleLogoutClick, isAction: true, icon: LogOut }
            : { name: 'Login', href: '/login', isAction: true, icon: LogIn },
    ];

    const primaryNavItems = navItems.filter((item) => !item.isAction);
    const authItem = navItems.find((item) => item.isAction);
    const currentTheme = NAV_THEMES.default;
    const mobileBackdropClassName = isTouchOptimized ? 'bg-[#15304d]/12' : currentTheme.backdrop;
    const mobileSidebarClassName = isTouchOptimized
        ? 'border-l-[#dbeafe] bg-[#f8fbff] shadow-none'
        : currentTheme.sidebar;
    const mobileSidebarShellClassName = isTouchOptimized
        ? 'shadow-[0_8px_24px_rgba(15,23,42,0.06)]'
        : 'shadow-[0_22px_65px_rgba(15,23,42,0.12)]';
    const mobileButtonClassName = isTouchOptimized
        ? 'border-[#d6ecff] bg-white text-[#29507b] shadow-[0_2px_8px_rgba(37,99,235,0.06)]'
        : currentTheme.mobileButton;
    const mobileSidebarHeaderClassName = isTouchOptimized
        ? 'mb-5 rounded-[1.25rem] border border-sky-100 bg-white px-4 py-4 shadow-[0_2px_10px_rgba(59,130,246,0.04)]'
        : 'mb-8 rounded-[1.6rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(219,234,254,0.92)_100%)] px-4 py-4 shadow-[inset_0_2px_0_rgba(255,255,255,0.85),0_8px_18px_rgba(59,130,246,0.12)]';
    const mobileSidebarItemBaseClassName = isTouchOptimized
        ? 'rounded-[1.15rem] px-3.5 py-3 text-[12px] tracking-[0.18em] transition-none'
        : 'rounded-[1.35rem] px-4 py-3.5 text-[13px] tracking-[0.22em] transition-colors duration-150';
    const mobileSidebarItemActiveClassName = isTouchOptimized
        ? 'border-sky-200 bg-sky-50 text-[#1d4ed8] shadow-none'
        : currentTheme.sidebarItemActive;
    const mobileSidebarItemClassName = isTouchOptimized
        ? 'border-transparent text-[#294567] bg-transparent'
        : `border-transparent ${currentTheme.sidebarItem}`;
    const mobileSidebarActionClassName = isTouchOptimized
        ? 'border-slate-200 bg-white text-[#22324a] shadow-none'
        : currentTheme.sidebarAction;
    const navFontStyle = { fontFamily: '"Space Grotesk", sans-serif' };
    const getNavAccent = (itemName) => {
        return NAV_ITEM_ACCENTS[itemName] || NAV_ITEM_ACCENTS.Home;
    };
    const pageTransitionProps = isTouchOptimized
        ? {
            initial: false,
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 1, scale: 1 },
            transition: { duration: 0 },
        }
        : {
            initial: { opacity: 0, scale: 0.98 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.98 },
            transition: { duration: 0.3, ease: 'easeOut' },
        };

    const isItemActive = (item) => {
        if (page === item.name) {
            return true;
        }

        if (!item.href || item.href === '#') {
            return false;
        }

        return window.location.pathname === item.href;
    };
    const handleNavItemClick = (event, item) => {
        if (item.onClick) {
            item.onClick(event);
            return;
        }

        event.preventDefault();
        handleNavigate(item.href);
    };

    return (
        <div className={standalone ? "" : "min-h-screen flex flex-col font-sans relative overflow-x-hidden text-slate-800"}>

            {/* OVERLAYS */}
            <AnimatePresence>
                {page === 'LandingPage' && showIntro && (
                    <Suspense fallback={null}>
                        <IntroOverlay onComplete={() => setShowIntro(false)} />
                    </Suspense>
                )}
                {toast && <PlasticToast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                {showLogoutModal && (
                    <PlasticModal
                        isOpen={showLogoutModal}
                        onClose={() => setShowLogoutModal(false)}
                        onConfirm={confirmLogout}
                        title="End Session?"
                        message="Are you sure you want to log out? Your workstation will be saved."
                        type="warning"
                    />
                )}
            </AnimatePresence>

            {/* BACKGROUND THEME SWITCHING */}
            {page === 'Projects' ? (
                <>
                    <div className="absolute inset-0 w-full h-full pointer-events-none -z-20 bg-[#3e2723] overflow-hidden">
                        {/* Deep ambient occlusion & volumetric shadows (less aggressive dark) */}
                        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8),inset_0_50px_150px_rgba(20,10,0,0.6)] z-20 mix-blend-multiply border-[20px] border-[#2d1b11]/80"></div>

                        {/* Cave walls (dark framing, leaving center lighter) */}
                        <div className="absolute inset-0 opacity-70 mix-blend-multiply z-20 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(20,10,0,0.95)_100%)]"></div>
                        <div className="absolute inset-0 opacity-80 mix-blend-multiply z-20 bg-[radial-gradient(circle_at_10%_10%,_transparent_15%,_rgba(20,10,0,0.9)_70%),radial-gradient(circle_at_90%_90%,_transparent_15%,_rgba(20,10,0,0.9)_70%)]"></div>

                        {/* Embedded 3D Gems (Faceted gemstones - Bright & Clear) */}
                        <div className="absolute inset-0 z-30 pointer-events-none">

                            {/* Gold Nugget / Topaz (Amber) */}
                            <div className="absolute top-[15%] left-[8%] w-10 h-10 rotate-45">
                                <div className="absolute inset-0 bg-[#fbbf24] shadow-[0_0_50px_#f59e0b,0_0_100px_#d97706] rounded-sm z-10 overflow-hidden border-2 border-white">
                                    <div className="absolute inset-1 bg-amber-400 border border-white shadow-[inset_0_0_20px_rgba(255,255,255,1)]"></div>
                                    <div className="absolute top-0 left-0 w-[200%] h-[200%] bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.9)_50%,transparent_55%)] -translate-x-1/2 -translate-y-1/2"></div>
                                </div>
                            </div>

                            {/* Sapphire (Cyan) */}
                            <div className="absolute top-[25%] right-[12%] w-8 h-12 -rotate-12">
                                <div className="absolute inset-0 bg-cyan-400 shadow-[0_0_40px_#22d3ee,0_0_80px_#0891b2] z-10" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                                    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,1)_0%,transparent_40%,rgba(0,0,0,0.4)_100%)]"></div>
                                    <div className="absolute top-[10%] bottom-[10%] left-[10%] right-[10%] bg-blue-300 border-2 border-white shadow-[inset_0_0_20px_white]"></div>
                                </div>
                            </div>

                            {/* Emerald (Green) */}
                            <div className="absolute bottom-[20%] left-[15%] w-12 h-10 rotate-[15deg]">
                                <div className="absolute inset-0 bg-emerald-400 shadow-[0_0_50px_#34d399,0_0_100px_#059669] z-10" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)' }}>
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,1)_0%,transparent_50%,rgba(0,0,0,0.5)_100%)]"></div>
                                    <div className="absolute top-1 bottom-1 left-2 right-2 bg-emerald-300 border-2 border-white shadow-[inset_0_0_20px_white]"></div>
                                </div>
                            </div>

                            {/* Ruby (Rose) */}
                            <div className="absolute top-[75%] right-[8%] w-10 h-10 rotate-45">
                                <div className="absolute inset-0 bg-rose-500 shadow-[0_0_45px_#f43f5e,0_0_90px_#e11d48] rounded-sm overflow-hidden z-10">
                                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,transparent_50%,rgba(0,0,0,0.8)_100%)]"></div>
                                    <div className="absolute top-1 bottom-1 left-1 right-1 bg-rose-400 border-2 border-white shadow-[inset_0_0_25px_rgba(255,255,255,1)]">
                                        <div className="absolute inset-1 bg-[linear-gradient(45deg,rgba(255,255,255,0.7),transparent)]"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Amethyst (Purple) */}
                            <div className="absolute top-[45%] left-[5%] w-10 h-10 rotate-[12deg]">
                                <div className="absolute inset-0 bg-purple-500 shadow-[0_0_35px_#a855f7,0_0_70px_#7e22ce] z-10" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
                                    <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.6)_0%,transparent_50%,rgba(255,255,255,1)_100%)]"></div>
                                    <div className="absolute top-[10%] bottom-[10%] left-[10%] right-[10%] bg-purple-300 border-2 border-white shadow-[inset_0_0_15px_white]" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
                                </div>
                            </div>

                            {/* Diamond / Quartz (Yellow/White) */}
                            <div className="absolute top-[60%] right-[5%] w-12 h-10 -rotate-45">
                                <div className="absolute inset-0 bg-yellow-400 shadow-[0_0_40px_#facc15,0_0_100px_#ca8a04] z-10" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 40%, 50% 100%, 0% 40%)' }}>
                                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,transparent_50%,rgba(0,0,0,0.5)_100%)]"></div>
                                    <div className="absolute top-[10%] left-[15%] right-[15%] bottom-[60%] bg-white border-b-2 border-yellow-400 shadow-[inset_0_0_20px_white]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Macro bump map / rough terrain using repeating radial gradients (Volume) */}
                        <div className="absolute inset-0 opacity-80 mix-blend-soft-light z-10" style={{
                            backgroundImage: `
                                radial-gradient(circle at 20% 30%, rgba(255,255,150,0.15) 0%, transparent 20%),
                                radial-gradient(circle at 80% 70%, rgba(255,255,150,0.15) 0%, transparent 25%),
                                radial-gradient(circle at 50% 50%, rgba(0,0,0,0.6) 0%, transparent 40%),
                                radial-gradient(circle at 10% 80%, rgba(0,0,0,0.7) 0%, transparent 30%),
                                radial-gradient(circle at 90% 20%, rgba(0,0,0,0.5) 0%, transparent 20%)
                            `
                        }}></div>

                        {/* Soil Base Texture using SVG Noise filter directly - Stronger and clearly visible */}
                        <div className="absolute inset-0 opacity-[0.35] mix-blend-color-burn z-10" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
                        }}></div>

                        {/* Uneven soil terrain using overlapping dark radial gradients - Earthier tones */}
                        <div className="absolute inset-0 opacity-80 mix-blend-multiply z-10 bg-[radial-gradient(circle_at_10%_20%,_rgba(60,30,10,0.6)_0%,_transparent_40%),radial-gradient(circle_at_80%_80%,_rgba(50,25,10,0.7)_0%,_transparent_50%),radial-gradient(circle_at_50%_50%,_rgba(60,30,15,0.4)_0%,_transparent_60()),radial-gradient(circle_at_90%_20%,_rgba(40,20,5,0.6)_0%,_transparent_30%),radial-gradient(circle_at_20%_90%,_rgba(35,15,5,0.5)_0%,_transparent_50%)]"></div>

                        {/* Extra subtle dirt granular pattern */}
                        <div className="absolute inset-0 opacity-70 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] mix-blend-overlay scale-125 z-10"></div>

                    </div>
                    {/* The solid backing behind the absolute layer should be lighter brown, not pure black, to let blend modes show */}
                    <div className="absolute inset-0 w-full h-full pointer-events-none -z-30 bg-[#3e2723]"></div>
                </>
            ) : page === 'Skills' ? (
                <>
                    <div className="fixed inset-0 w-full h-full pointer-events-none -z-30 bg-white"></div>
                </>
            ) : (
                <>
                    <div className="absolute top-0 left-0 w-full h-[150vh] pointer-events-none -z-20 bg-gradient-to-b from-[#5c9cd4] via-[#5c9cd4] to-[#f8fafc]">
                        {/* Dot Grid Overlay */}
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                        {/* Noise SVG Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                        {/* Simple Noise Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                    </div>
                    <div className="fixed inset-0 pointer-events-none -z-30 bg-[#f8fafc]"></div>
                </>
            )}

            {/* Navbar Section */}
            {!hideNavigation && (
                <nav className="relative z-50 flex h-24 items-center justify-between px-6 md:h-28 md:px-12" style={navFontStyle}>
                    {page === 'LandingPage' && (
                        <div className="absolute top-6 left-1/2 z-[-1] h-[40px] w-[60%] -translate-x-1/2 rounded-full bg-white/40 blur-[30px] pointer-events-none"></div>
                    )}

                    <div className="flex items-center h-full flex-shrink-0 z-10">
                        <button
                            type="button"
                            onClick={() => handleNavigate('/')}
                            className={`flex h-12 w-12 items-center justify-center rounded-[1.2rem] border text-[0.95rem] font-black tracking-[0.06em] transition-all duration-150 md:h-14 md:w-14 ${currentTheme.logo}`}
                        >
                            KH
                        </button>
                    </div>

                    <div className={`absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 lg:flex ${currentTheme.navShell}`}>
                        {primaryNavItems.map((item) => {
                            const isActive = isItemActive(item);
                            const Icon = item.icon;

                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    onClick={(event) => handleNavItemClick(event, item)}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.24em] transition-all duration-150 ${isActive
                                        ? currentTheme.navItemActive
                                        : currentTheme.navItem
                                        }`}
                                >
                                    <Icon className={`h-[16px] w-[16px] ${isActive ? 'text-[#2563eb]' : 'text-white'}`} strokeWidth={2.15} />
                                    <span>{item.name}</span>
                                </a>
                            );
                        })}
                    </div>

                    <div className="hidden lg:flex items-center gap-4 z-10">
                        {authItem && (
                            (() => {
                                const accent = getNavAccent(authItem.name);

                                return (
                                    <a
                                        href={authItem.href}
                                        onClick={(event) => handleNavItemClick(event, authItem)}
                                        aria-current={isItemActive(authItem) ? 'page' : undefined}
                                        className={`flex items-center gap-2.5 rounded-full border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.22em] transition-all duration-150 ${currentTheme.action} ${accent.activeText}`}
                                    >
                                        <span className={`flex h-8 w-8 items-center justify-center rounded-full border ${accent.chip}`}>
                                            {React.createElement(authItem.icon, { className: 'h-[15px] w-[15px]', strokeWidth: 2.1 })}
                                        </span>
                                        <span>{authItem.name}</span>
                                    </a>
                                );
                            })()
                        )}

                        <a
                            href="/contact"
                            onClick={(event) => {
                                event.preventDefault();
                                handleNavigate('/contact');
                            }}
                            className="flex items-center rounded-full border border-[#d97706] bg-[linear-gradient(180deg,#fbbf24_0%,#f59e0b_100%)] px-5 py-2.5 text-[12px] font-black uppercase tracking-[0.22em] text-white shadow-[0_5px_0_#d97706,_0_16px_24px_rgba(245,158,11,0.25)] transition-all duration-150 hover:translate-y-[-1px]"
                        >
                            Hire Me
                        </a>
                    </div>
                </nav>
            )}

            {/* Mobile Nav Button (Hamburger Toy) */}
            {!hideNavigation && !isMenuOpen && (
                <div className="md:hidden absolute top-8 right-6 z-[60]">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`flex h-12 w-12 items-center justify-center rounded-[1.2rem] border transition-all duration-150 ${mobileButtonClassName}`}
                        aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" strokeWidth={2.2} /> : <Menu className="h-5 w-5" strokeWidth={2.2} />}
                    </button>
                </div>
            )}

            {/* Backdrop */}
            {!hideNavigation && (
                <div
                    onClick={() => setIsMenuOpen(false)}
                    className={`fixed inset-0 z-[54] ${isTouchOptimized ? 'transition-none' : 'transition-opacity duration-150'} ${mobileBackdropClassName} ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                />
            )}

            {/* Mobile Sidebar */}
            {!hideNavigation && (
                <div
                    className={`fixed inset-y-0 right-0 z-[55] flex w-[18.5rem] max-w-[82vw] flex-col border-l px-4 py-5 ${isTouchOptimized ? 'transform-gpu transition-none' : 'transition-transform duration-200 ease-out'} ${mobileSidebarShellClassName} ${mobileSidebarClassName} ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    style={{ ...navFontStyle, contain: 'layout paint style' }}
                >
                    <div className={mobileSidebarHeaderClassName}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-[10px] font-bold uppercase tracking-[0.32em] ${currentTheme.footer}`}>Navigation</p>
                                <p className={`mt-1 text-[1.08rem] font-semibold tracking-[-0.01em] ${currentTheme.heading}`}>Quick Links</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex h-11 w-11 items-center justify-center rounded-[1rem] border transition-colors duration-150 ${mobileButtonClassName}`}
                                aria-label="Close navigation"
                            >
                                <X className="h-4.5 w-4.5" strokeWidth={2.15} />
                            </button>
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-2.5">
                        {navItems.map((item) => {
                            const isActive = isItemActive(item);
                            const Icon = item.icon;
                            const accent = getNavAccent(item.name);

                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    onClick={(event) => handleNavItemClick(event, item)}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`flex w-full items-center gap-3 border text-left font-semibold uppercase ${mobileSidebarItemBaseClassName} ${isActive
                                        ? `${mobileSidebarItemActiveClassName} ${accent.activeText}`
                                        : item.isAction
                                            ? `${mobileSidebarActionClassName} ${accent.activeText}`
                                            : mobileSidebarItemClassName
                                        }`}
                                >
                                    <span className={`flex h-9 w-9 items-center justify-center rounded-full border ${isActive || item.isAction ? accent.chip : `${accent.chip} bg-white/60`
                                        }`}>
                                        <Icon className="h-4 w-4" strokeWidth={2.1} />
                                    </span>
                                    <span className="flex-1">{item.name}</span>
                                </a>
                            );
                        })}
                    </div>

                    <div className={`mt-auto pt-6 text-center text-[11px] font-bold tracking-widest uppercase ${currentTheme.footer}`}>
                        © 2026 Kevin Hermansyah
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className={`${standalone ? 'relative z-10 w-full' : fullBleed || page === 'Skills' ? 'flex-grow relative z-10 w-full' : 'flex-grow container mx-auto px-4 py-8 relative z-10 w-full'}`}>
                {isTouchOptimized ? (
                    <div key={page}>
                        {children}
                    </div>
                ) : (
                    <motion.div key={page} {...pageTransitionProps}>
                        {children}
                    </motion.div>
                )}
            </main>

            {/* Footer */}
            {!standalone && !hideFooter && (
                <Suspense fallback={null}>
                    {page === 'Projects' ? <SoilFooter /> : <Footer page={page} />}
                </Suspense>
            )}
        </div>
    );
};

export default MainLayout;
