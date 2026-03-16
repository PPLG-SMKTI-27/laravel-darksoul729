import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { BadgeInfo, BriefcaseBusiness, House, LogIn, LogOut, Mail, Menu, Sparkles, X } from 'lucide-react';
import Footer from '../components/Footer';
import SoilFooter from '../components/SoilFooter';
import IntroOverlay from '../components/IntroOverlay';
import PlasticToast from '../UI/PlasticToast';
import PlasticModal from '../UI/PlasticModal';
import { cleanupPageRuntime, navigateWithCleanup } from '../lib/pageTransitionCleanup';

gsap.registerPlugin(ScrollTrigger);

const NAV_THEMES = {
    default: {
        logo: 'bg-white text-[#7c3aed] border-slate-200',
        navShell: 'border-transparent bg-transparent shadow-none',
        navItem: 'text-white hover:text-white/85',
        navItemActive: 'bg-transparent text-white border-transparent',
        action: 'bg-white text-[#16213d] border-slate-200 hover:bg-slate-50',
        mobileButton: 'border-slate-200 bg-white text-[#16213d]',
        sidebar: 'border-slate-200 bg-white',
        sidebarItem: 'text-[#16213d] hover:bg-slate-50',
        sidebarItemActive: 'bg-white text-[#16213d] border-slate-200',
        sidebarAction: 'bg-white text-[#16213d] border-slate-200 hover:bg-slate-50',
        backdrop: 'bg-[#0f172a]/26',
        footer: 'text-[#23345f]/50',
        heading: 'text-[#16213d]',
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
        chip: 'border-indigo-200/70 bg-indigo-100/90 text-indigo-700',
        activeText: 'text-indigo-700',
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

    const lenisRef = useRef(null);

    // Initialize Lenis for Smooth Scrolling
    useLayoutEffect(() => {
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

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Connect Lenis to GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        // Global scroll lock listeners
        const lockScroll = () => {
            lenis.stop();
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        };
        const unlockScroll = () => {
            lenis.start();
            document.body.style.overflow = 'unset';
            document.documentElement.style.overflow = 'unset';
        };

        window.addEventListener('lock-scroll', lockScroll);
        window.addEventListener('unlock-scroll', unlockScroll);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf);
            window.removeEventListener('lock-scroll', lockScroll);
            window.removeEventListener('unlock-scroll', unlockScroll);
        };
    }, []);

    // Initial Checks (Intro & Flash Messages)
    useEffect(() => {
        // Intro
        const lastShown = localStorage.getItem('intro_last_shown');
        const now = new Date().getTime();
        const fiveMinutes = 5 * 60 * 1000;

        if (!lastShown || (now - parseInt(lastShown) > fiveMinutes)) {
            setShowIntro(true);
            localStorage.setItem('intro_last_shown', now.toString());
        }

        // Flash Message Check
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
    const navFontStyle = { fontFamily: '"Space Grotesk", sans-serif' };
    const getNavAccent = (itemName) => {
        return NAV_ITEM_ACCENTS[itemName] || NAV_ITEM_ACCENTS.Home;
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
                {showIntro && <IntroOverlay onComplete={() => setShowIntro(false)} />}
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

                        {/* Volumetric Light rays / Penchoayaan (Lighting) */}
                        <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[#fca5a5] blur-[100px] opacity-[0.1] mix-blend-screen scale-150 z-10 pointer-events-none"></div>
                        <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#ca8a04] blur-[150px] opacity-[0.2] mix-blend-color-dodge z-10 pointer-events-none"></div>
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
                        {/* Simple Noise Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                    </div>
                    <div className="fixed inset-0 pointer-events-none -z-30 bg-[#f8fafc]"></div>
                </>
            )}

            {/* Navbar Section */}
            {!hideNavigation && (
                <nav className="relative z-50 flex h-24 items-center justify-between px-6 md:h-28 md:px-12" style={navFontStyle}>
                    <div className="flex items-center h-full flex-shrink-0 z-10">
                        <button
                            type="button"
                            onClick={() => handleNavigate('/')}
                            className={`flex h-12 w-12 items-center justify-center rounded-[1.15rem] border text-base font-bold tracking-[0.08em] transition-colors md:h-14 md:w-14 ${currentTheme.logo}`}
                        >
                            KH
                        </button>
                    </div>

                    <div className={`absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 px-1 py-2 lg:flex ${currentTheme.navShell}`}>
                        {primaryNavItems.map((item) => {
                            const isActive = isItemActive(item);
                            const Icon = item.icon;

                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    onClick={(event) => handleNavItemClick(event, item)}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`flex items-center gap-2.5 px-0 py-2 text-[12px] font-semibold uppercase tracking-[0.24em] transition-colors duration-150 ${
                                        isActive
                                            ? currentTheme.navItemActive
                                            : currentTheme.navItem
                                    }`}
                                >
                                    <Icon className="h-[16px] w-[16px] text-white" strokeWidth={2.15} />
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
                                        className={`flex items-center gap-2.5 rounded-full border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.24em] transition-colors duration-150 ${currentTheme.action} ${accent.activeText}`}
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
                            className="flex items-center rounded-full border border-amber-200/70 bg-[linear-gradient(135deg,rgba(255,245,204,0.9),rgba(255,214,102,0.88))] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.24em] text-amber-900 shadow-[0_8px_22px_rgba(245,158,11,0.14)] transition-colors duration-150 hover:bg-[linear-gradient(135deg,rgba(255,250,224,0.94),rgba(255,221,128,0.92))]"
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
                        className={`flex h-12 w-12 items-center justify-center rounded-[1.2rem] border shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-colors duration-150 ${currentTheme.mobileButton}`}
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
                    className={`fixed inset-0 z-[54] transition-opacity duration-150 ${currentTheme.backdrop} ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                />
            )}

            {/* Mobile Sidebar */}
            {!hideNavigation && (
                <div
                    className={`fixed inset-y-0 right-0 z-[55] flex w-72 max-w-[85vw] flex-col border-l px-5 py-6 shadow-[0_18px_60px_rgba(15,23,42,0.12)] transition-transform duration-200 ease-out ${currentTheme.sidebar} ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    style={navFontStyle}
                >
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${currentTheme.footer}`}>Navigation</p>
                            <p className={`mt-1 text-[1.05rem] font-semibold ${currentTheme.heading}`}>Quick Links</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex h-11 w-11 items-center justify-center rounded-[1rem] border transition-colors duration-150 ${currentTheme.mobileButton}`}
                            aria-label="Close navigation"
                        >
                            <X className="h-4.5 w-4.5" strokeWidth={2.15} />
                        </button>
                    </div>

                    <div className="flex w-full flex-col gap-3">
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
                                    className={`flex w-full items-center gap-3 rounded-[1.35rem] border px-4 py-3.5 text-left text-[13px] font-semibold uppercase tracking-[0.24em] transition-colors duration-150 ${
                                        isActive
                                            ? `${currentTheme.sidebarItemActive} ${accent.activeText}`
                                            : item.isAction
                                                ? `${currentTheme.sidebarAction} ${accent.activeText}`
                                                : `border-transparent ${currentTheme.sidebarItem}`
                                    }`}
                                >
                                    <span className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                                        isActive || item.isAction ? accent.chip : `${accent.chip} bg-white/34`
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
                <motion.div
                    key={page}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {children}
                </motion.div>
            </main>

            {/* Footer */}
            {!standalone && !hideFooter && (page === 'Projects' ? <SoilFooter /> : <Footer page={page} />)}
        </div>
    );
};

export default MainLayout;
