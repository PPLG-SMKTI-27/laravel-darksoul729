import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { BadgeInfo, BriefcaseBusiness, House, LogIn, LogOut, Mail, Menu, Sparkles, X } from 'lucide-react';
import PlasticToast from '../UI/PlasticToast';
import PlasticModal from '../UI/PlasticModal';
import { cleanupPageRuntime, navigateWithCleanup } from '../lib/pageTransitionCleanup';

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

const LENIS_DISABLED_PAGES = new Set(['LandingPage', 'Projects', 'Contact', 'Skills', 'About']);

const MainLayout = ({ children, page, standalone = false, hideNavigation = false, hideFooter = false, fullBleed = false }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileTrayVisible, setIsMobileTrayVisible] = useState(true);

    // Notification & Modal State
    const [toast, setToast] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isTouchOptimized, setIsTouchOptimized] = useState(false);
    const [shouldMountFooter, setShouldMountFooter] = useState(false);
    const [footerComponent, setFooterComponent] = useState(null);
    const prefersReducedMotion = useReducedMotion();

    const lenisRef = useRef(null);
    const footerSentinelRef = useRef(null);
    const lastScrollYRef = useRef(0);

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
        const shouldDisableSmoothScroll = prefersReducedMotion || saveData || isCoarsePointer || standalone || LENIS_DISABLED_PAGES.has(page);
        let isDisposed = false;
        let rafId = 0;
        let lenisInstance = null;
        let detachScrollTrigger = null;

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

        (async () => {
            const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
                import('gsap'),
                import('gsap/ScrollTrigger'),
                import('lenis'),
            ]);

            if (isDisposed) {
                return;
            }

            gsap.registerPlugin(ScrollTrigger);

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

            lenisInstance = lenis;
            lenisRef.current = lenis;

            const raf = (time) => {
                lenis.raf(time);
                rafId = requestAnimationFrame(raf);
            };

            rafId = requestAnimationFrame(raf);
            lenis.on('scroll', ScrollTrigger.update);
            detachScrollTrigger = () => {
                lenis.off('scroll', ScrollTrigger.update);
            };
        })();

        return () => {
            isDisposed = true;
            cancelAnimationFrame(rafId);
            detachScrollTrigger?.();
            lenisInstance?.destroy();
            lenisRef.current = null;
            window.removeEventListener('lock-scroll', lockScroll);
            window.removeEventListener('unlock-scroll', unlockScroll);
        };
    }, [page, standalone]);

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
        if (!isTouchOptimized) {
            setIsMobileTrayVisible(true);
            return undefined;
        }

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollYRef.current;

            if (currentScrollY <= 24 || isMenuOpen) {
                setIsMobileTrayVisible(true);
                lastScrollYRef.current = currentScrollY;
                return;
            }

            if (Math.abs(delta) < 12) {
                return;
            }

            setIsMobileTrayVisible(delta < 0);
            lastScrollYRef.current = currentScrollY;
        };

        lastScrollYRef.current = window.scrollY;
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isMenuOpen, isTouchOptimized]);

    useEffect(() => {
        const handlePageHide = () => {
            cleanupPageRuntime({ lenis: lenisRef.current });
        };

        window.addEventListener('pagehide', handlePageHide);

        return () => {
            window.removeEventListener('pagehide', handlePageHide);
        };
    }, []);

    useEffect(() => {
        if (standalone || hideFooter) {
            setShouldMountFooter(false);
            setFooterComponent(null);
            return undefined;
        }

        const sentinel = footerSentinelRef.current;
        if (!sentinel) {
            setShouldMountFooter(true);
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    return;
                }

                setShouldMountFooter(true);
                observer.disconnect();
            },
            { rootMargin: '360px 0px' },
        );

        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [hideFooter, page, standalone]);

    useEffect(() => {
        if (standalone || hideFooter || !shouldMountFooter) {
            return undefined;
        }

        let isCancelled = false;

        const loadFooterComponent = async () => {
            const module = page === 'Projects'
                ? await import('../components/SoilFooter')
                : await import('../components/Footer');

            if (!isCancelled) {
                setFooterComponent(() => module.default);
            }
        };

        void loadFooterComponent();

        return () => {
            isCancelled = true;
        };
    }, [hideFooter, page, shouldMountFooter, standalone]);

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
    const navFontStyle = { fontFamily: '"Space Grotesk", "Trebuchet MS", "Segoe UI", sans-serif' };
    const FooterComponent = footerComponent;
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
                            const accent = getNavAccent(item.name);

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
                                    <Icon className={`h-[16px] w-[16px] ${isActive ? accent.activeText : 'text-white'}`} strokeWidth={2.15} />
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

            {/* Mobile Nav Button (Cartridge Concept - Replaces Sidebar & Hamburger) */}
            {/* Backdrop */}
            {!hideNavigation && (
                <div
                    onClick={() => setIsMenuOpen(false)}
                    className={`lg:hidden fixed inset-0 z-[54] ${isTouchOptimized ? 'transition-none' : 'transition-opacity duration-300'} ${currentTheme.backdrop} ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                />
            )}

            {/* Mobile Data Cartridge */}
            {!hideNavigation && (
                <div
                    className={`lg:hidden fixed bottom-0 left-0 w-full z-[60] transform-gpu px-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMenuOpen ? 'translate-y-0' : isMobileTrayVisible ? 'translate-y-[calc(100%-3.5rem)]' : 'translate-y-[calc(100%+1rem)]'}`}
                    style={{ ...navFontStyle, contain: 'layout paint style' }}
                >
                    {(() => {
                        const isDarkTheme = page === 'Projects' || page === 'Contact';
                        return (
                            <div className={`${isDarkTheme ? 'bg-[linear-gradient(180deg,rgba(40,20,10,0.85)_0%,rgba(15,8,4,0.98)_100%)] border-[#d97706]/40 shadow-[inset_0_2px_0_rgba(251,191,36,0.3)]' : 'bg-[linear-gradient(180deg,rgba(248,251,255,0.96)_0%,rgba(231,243,255,0.98)_100%)] border-[#d6ecff] shadow-[inset_0_2px_0_rgba(255,255,255,0.8)]'} backdrop-blur-xl border-t  rounded-t-[2.5rem] overflow-hidden transition-colors duration-500`}>
                                
                                {/* Cartridge Handle / Peek Area */}
                                <div 
                                    className={`h-14 w-full flex flex-col items-center justify-center cursor-pointer relative z-10 ${isDarkTheme ? 'hover:bg-black/20' : 'hover:bg-white/10'} transition-colors`}
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                >
                                    {/* Inner glow on top edge */}
                                    <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${isDarkTheme ? 'via-[#f59e0b]/50' : 'via-[#ffffff]'} to-transparent`}></div>
                                    
                                    {/* Grip lines & Text */}
                                    <div className="flex flex-col gap-1.5 items-center pointer-events-none mt-1">
                                        <div className="flex gap-2">
                                            <div className={`w-10 h-1.5 rounded-full ${isDarkTheme ? 'bg-[#431407] shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)] border border-[#78350f]/50' : 'bg-[#bfdbfe] shadow-[inset_0_1px_1px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.8)] border border-[#93c5fd]/30'}`}></div>
                                            <div className={`w-10 h-1.5 rounded-full ${isDarkTheme ? 'bg-[#431407] shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)] border border-[#78350f]/50' : 'bg-[#bfdbfe] shadow-[inset_0_1px_1px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.8)] border border-[#93c5fd]/30'}`}></div>
                                        </div>
                                        <span className={`text-[9.5px] uppercase tracking-[0.4em] font-black ${isMenuOpen ? (isDarkTheme ? 'text-[#f59e0b]' : 'text-[#2563eb]') : (isDarkTheme ? 'text-[#78350f]' : 'text-[#64748b]')} transition-all duration-300`}>
                                            {isMenuOpen ? 'CLOSE_MENU' : 'SYS_MENU'}
                                        </span>
                                    </div>
                                </div>

                                {/* Cartridge Inner Content */}
                                <div className="px-6 pb-8 flex flex-col gap-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        {navItems.map((item) => {
                                            const isActive = isItemActive(item);
                                            const Icon = item.icon;
                                            
                                            // Plastic Hardware-inspired cards
                                            const baseStyle = "flex flex-col items-center justify-center gap-2.5 rounded-[1.2rem] border p-4 transition-all duration-200 text-center";
                                            
                                            let finalStyle = "";
                                            let iconColor = "";

                                            if (isDarkTheme) {
                                                const activeStyle = "border-[#fbbf24]/50 bg-[linear-gradient(180deg,rgba(217,119,6,0.4)_0%,rgba(120,53,15,0.25)_100%)] text-[#fcd34d] shadow-[0_5px_0_rgba(180,83,9,0.7),_0_12px_20px_rgba(0,0,0,0.6),inset_0_2px_0_rgba(251,191,36,0.6)] scale-[0.98] backdrop-blur-md";
                                                const actionActiveStyle = "border-[#ef4444]/50 bg-[linear-gradient(180deg,rgba(220,38,38,0.4)_0%,rgba(153,27,27,0.25)_100%)] text-[#fca5a5] shadow-[0_5px_0_rgba(185,28,28,0.7),_0_12px_20px_rgba(0,0,0,0.6),inset_0_2px_0_rgba(248,113,113,0.6)] scale-[0.98] backdrop-blur-md";
                                                const actionStyle = "border-[#991b1b]/50 bg-[linear-gradient(180deg,rgba(153,27,27,0.3)_0%,rgba(69,10,10,0.4)_100%)] text-[#ef4444] hover:bg-[linear-gradient(180deg,rgba(220,38,38,0.3)_0%,rgba(153,27,27,0.4)_100%)] hover:translate-y-[-1px] shadow-[0_4px_0_rgba(153,27,27,0.5),_0_8px_15px_rgba(0,0,0,0.4),inset_0_2px_0_rgba(248,113,113,0.3)] backdrop-blur-md";
                                                const inactiveStyle = "border-[#78350f]/60 bg-[linear-gradient(180deg,rgba(161,98,7,0.25)_0%,rgba(67,20,7,0.4)_100%)] text-[#f59e0b] hover:bg-[linear-gradient(180deg,rgba(217,119,6,0.3)_0%,rgba(120,53,15,0.4)_100%)] hover:text-[#fde68a] hover:translate-y-[-1px] shadow-[0_4px_0_rgba(120,53,15,0.6),_0_8px_15px_rgba(0,0,0,0.4),inset_0_2px_0_rgba(251,191,36,0.3)] backdrop-blur-md";
                                                
                                                if (isActive && !item.isAction) { finalStyle = activeStyle; iconColor = "text-[#fcd34d]"; }
                                                else if (isActive && item.isAction) { finalStyle = actionActiveStyle; iconColor = "text-[#fca5a5]"; }
                                                else if (!isActive && item.isAction) { finalStyle = actionStyle; iconColor = "text-[#ef4444]"; }
                                                else { finalStyle = inactiveStyle; iconColor = "text-[#d97706]"; }
                                            } else {
                                                const activeStyle = "border-[#bfdbfe] bg-[linear-gradient(180deg,#ffffff_0%,#dbeafe_100%)] text-[#1d4ed8] shadow-[0_5px_0_#93c5fd,_0_12px_20px_rgba(37,99,235,0.14),inset_0_2px_0_rgba(255,255,255,1)] scale-[0.98]";
                                                const actionActiveStyle = "border-[#fbcfe8] bg-[linear-gradient(180deg,#ffffff_0%,#fce7f3_100%)] text-[#be185d] shadow-[0_5px_0_#f9a8d4,_0_12px_20px_rgba(219,39,119,0.14),inset_0_2px_0_rgba(255,255,255,1)] scale-[0.98]";
                                                const actionStyle = "border-[#d7e6f7] bg-[linear-gradient(180deg,#ffffff_0%,#eef6ff_100%)] text-[#22324a] shadow-[0_4px_0_#c4d7ee,_0_12px_20px_rgba(15,23,42,0.08),inset_0_2px_0_rgba(255,255,255,1)] hover:bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] hover:translate-y-[-1px] hover:shadow-[0_5px_0_#93c5fd,_0_12px_20px_rgba(37,99,235,0.14)]";
                                                const inactiveStyle = "border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0.3)_100%)] text-[#475569] shadow-[0_4px_0_rgba(255,255,255,0.7),_0_8px_15px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,1)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.5)_100%)] hover:text-[#1d4ed8] hover:translate-y-[-1px]";
                                                
                                                if (isActive && !item.isAction) { finalStyle = activeStyle; iconColor = "text-[#1d4ed8]"; }
                                                else if (isActive && item.isAction) { finalStyle = actionActiveStyle; iconColor = "text-[#be185d]"; }
                                                else if (!isActive && item.isAction) { finalStyle = actionStyle; iconColor = "text-[#22324a]"; }
                                                else { finalStyle = inactiveStyle; iconColor = "text-[#64748b]"; }
                                            }
                                            
                                            return (
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    onClick={(event) => handleNavItemClick(event, item)}
                                                    className={`${baseStyle} ${finalStyle} relative overflow-hidden`}
                                                >
                                                    <div className={`absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,${isDarkTheme ? '0.05' : '0.4'})_0%,transparent_50%)] pointer-events-none`}></div>
                                                    
                                                    <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={isActive ? 2.5 : 2} />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.name}</span>
                                                </a>
                                            );
                                        })}
                                    </div>

                                    {/* System Status Line */}
                                    <div className={`mt-2 flex items-center justify-between border-t ${isDarkTheme ? 'border-[#d97706]/20' : 'border-[#bfdbfe]/50'} pt-5 px-1`}>
                                        <div className="flex items-center gap-2.5">
                                            <div className={`h-2.5 w-2.5 rounded-full border ${isDarkTheme ? 'border-[#fef08a] bg-[#10b981] shadow-[0_0_8px_#10b981]' : 'border-white bg-[#10b981] shadow-[0_0_8px_#10b981,inset_0_1px_2px_rgba(255,255,255,0.5)]'} animate-pulse`}></div>
                                            <span className={`text-[9.5px] ${isDarkTheme ? 'text-[#fcd34d]' : 'text-[#475569]'} font-bold tracking-[0.25em] uppercase`}>SYSTEM_ONLINE</span>
                                        </div>
                                        <span className={`text-[9px] ${isDarkTheme ? 'text-[#d97706]' : currentTheme.footer} font-bold tracking-[0.2em] uppercase`}>© 2026 KH_</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* Main Content Area */}
            <main className={`${standalone ? 'relative z-10 w-full' : fullBleed || page === 'Skills' || page === 'LandingPage' ? 'flex-grow relative z-10 w-full' : 'flex-grow container mx-auto px-4 py-8 relative z-10 w-full'}`}>
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

            {!standalone && !hideFooter && <div ref={footerSentinelRef} className="h-px w-full" aria-hidden="true" />}

            {/* Footer */}
            {!standalone && !hideFooter && shouldMountFooter && FooterComponent && (
                page === 'Projects' ? <FooterComponent /> : <FooterComponent page={page} />
            )}
        </div>
    );
};

export default MainLayout;
