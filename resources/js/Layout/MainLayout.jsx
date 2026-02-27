import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import PlasticButton from '../UI/PlasticButton';
import Footer from '../components/Footer';
import IntroOverlay from '../components/IntroOverlay';
import PlasticToast from '../UI/PlasticToast';
import PlasticModal from '../UI/PlasticModal';
import FloatingShapesBackground from '../components/UI/FloatingShapesBackground';

gsap.registerPlugin(ScrollTrigger);

const MainLayout = ({ children, page, standalone = false }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showIntro, setShowIntro] = useState(false);

    // Notification & Modal State
    const [toast, setToast] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const menuRef = useRef(null);
    const linkRefs = useRef([]);
    const backdropRef = useRef(null);

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

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf);
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

    // Menu Animation
    useEffect(() => {
        const menu = menuRef.current;
        const links = linkRefs.current;
        const backdrop = backdropRef.current;

        gsap.set(menu, { x: '100%' });

        if (isMenuOpen) {
            gsap.to(backdrop, { opacity: 1, pointerEvents: 'auto', duration: 0.3 });
            gsap.to(menu, { x: '0%', opacity: 1, pointerEvents: 'auto', duration: 0.6, ease: 'back.out(1.2)' });
            gsap.to(links, { x: 0, opacity: 1, stagger: 0.1, duration: 0.4, delay: 0.2, ease: 'power2.out' });
        } else {
            gsap.to(backdrop, { opacity: 0, pointerEvents: 'none', duration: 0.3, delay: 0.1 });
            gsap.to(menu, { x: '100%', pointerEvents: 'none', duration: 0.5, ease: 'power3.in' });
            gsap.to(links, { x: 50, opacity: 0, duration: 0.2 });
        }
    }, [isMenuOpen]);

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
                window.location.href = '/';
            } else {
                setToast({ message: "Logout failed. Try again.", type: "error" });
                setShowLogoutModal(false);
            }
        } catch (error) {
            setToast({ message: "Network error.", type: "error" });
            setShowLogoutModal(false);
        }
    };

    const navItems = [
        { name: 'Home', href: '/', colorClass: 'text-pink-500 bg-white/90 shadow-[inset_0_-4px_0_1px_rgba(219,39,119,0.3),_0_10px_20px_rgba(219,39,119,0.2)]', dotColor: 'bg-pink-400 border-pink-200', themeColor: 'pink' },
        { name: 'Projects', href: '/projects', colorClass: 'text-blue-500 bg-white/90 shadow-[inset_0_-4px_0_1px_rgba(59,130,246,0.3),_0_10px_20px_rgba(59,130,246,0.2)]', dotColor: 'bg-blue-400 border-blue-200', themeColor: 'blue' },
        { name: 'Skills', href: '/skills', colorClass: 'text-green-500 bg-white/90 shadow-[inset_0_-4px_0_1px_rgba(34,197,94,0.3),_0_10px_20px_rgba(34,197,94,0.2)]', dotColor: 'bg-green-400 border-green-200', themeColor: 'green' },
        { name: 'Contact', href: '/contact', colorClass: 'text-orange-500 bg-white/90 shadow-[inset_0_-4px_0_1px_rgba(249,115,22,0.3),_0_10px_20px_rgba(249,115,22,0.2)]', dotColor: 'bg-orange-400 border-orange-200', themeColor: 'orange' },
        { name: 'About', href: '/about', colorClass: 'text-purple-500 bg-white/90 shadow-[inset_0_-4px_0_1px_rgba(168,85,247,0.3),_0_10px_20px_rgba(168,85,247,0.2)]', dotColor: 'bg-purple-400 border-purple-200', themeColor: 'purple' },
        // Conditional Logout/Login
        isLoggedIn
            ? { name: 'Logout', href: '#', onClick: handleLogoutClick, isAction: true, colorClass: 'text-red-500 bg-white/90 shadow-[inset_0_-4px_0_1px_rgba(239,68,68,0.3),_0_10px_20px_rgba(239,68,68,0.2)]', dotColor: 'bg-red-400 border-red-200', themeColor: 'red' }
            : { name: 'Login', href: '/login', colorClass: 'text-yellow-500 bg-white/90 shadow-[inset_0_-4px_0_1px_rgba(234,179,8,0.3),_0_10px_20px_rgba(234,179,8,0.2)]', dotColor: 'bg-yellow-400 border-yellow-200', themeColor: 'yellow' },
    ];

    const activeRouteMap = {
        pink: { borderClass: 'border-pink-400', shadowColor: 'rgba(244,114,182,0.7)', indicator: 'bg-pink-400 shadow-[0_0_15px_rgba(244,114,182,1)]' },
        blue: { borderClass: 'border-blue-400', shadowColor: 'rgba(96,165,250,0.7)', indicator: 'bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)]' },
        green: { borderClass: 'border-green-400', shadowColor: 'rgba(74,222,128,0.7)', indicator: 'bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1)]' },
        orange: { borderClass: 'border-orange-400', shadowColor: 'rgba(251,146,60,0.7)', indicator: 'bg-orange-400 shadow-[0_0_15px_rgba(251,146,60,1)]' },
        purple: { borderClass: 'border-purple-400', shadowColor: 'rgba(192,132,252,0.7)', indicator: 'bg-purple-400 shadow-[0_0_15px_rgba(192,132,252,1)]' },
        red: { borderClass: 'border-red-400', shadowColor: 'rgba(248,113,113,0.7)', indicator: 'bg-red-400 shadow-[0_0_15px_rgba(248,113,113,1)]' },
        yellow: { borderClass: 'border-yellow-400', shadowColor: 'rgba(250,204,21,0.7)', indicator: 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,1)]' },
        default: { borderClass: 'border-blue-300', shadowColor: 'rgba(0,0,0,0.3)', indicator: 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]' }
    };

    const activeItemProp = navItems.find((item) => page === item.name || (window.location.pathname === item.href && !item.isAction));
    const activeTheme = activeItemProp ? activeRouteMap[activeItemProp.themeColor] : activeRouteMap.default;

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

            {/* OPTIMIZED BACKGROUND: Simple Static Gradient */}
            <div className="fixed inset-0 pointer-events-none -z-20 bg-gradient-to-br from-blue-50 via-white to-pink-50">
                {/* Simple Noise Overlay */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            </div>

            {/* Global Floating Shapes Background */}
            <FloatingShapesBackground />

            {/* Navbar Section */}
            <nav className="relative z-50 pt-8 px-6 md:px-12 flex items-center justify-between h-20">

                {/* Left: Pink Logo Icon */}
                <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 z-10">
                    <div className="relative w-full h-full bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl shadow-[0_6px_0_#db2777,0_10px_20px_rgba(236,72,153,0.3)] border-2 border-pink-300 flex items-center justify-center transform hover:scale-105 transition-transform cursor-pointer overflow-hidden" onClick={() => window.location.href = '/'}>
                        <div className="absolute top-1 left-2 right-2 h-1/3 bg-gradient-to-b from-white/40 to-transparent rounded-t-xl z-20 pointer-events-none"></div>
                        <span className="font-black text-white text-xl md:text-2xl tracking-tighter drop-shadow-[0_2px_0_rgba(0,0,0,0.2)] z-10 select-none pt-1">KH</span>
                    </div>
                </div>

                {/* Center: Blue Pill Navbar - ABSOLUTE CENTERED */}
                <div className="hidden md:flex absolute left-1/2 top-8 -translate-x-1/2 bg-gradient-to-b from-[#60a5fa] to-[#3b82f6] p-2 rounded-full shadow-[0_8px_0_#1d4ed8,0_15px_30px_rgba(37,99,235,0.3)] border-[3px] border-blue-300 items-center justify-center gap-1 z-10">
                    <div className="absolute top-1.5 left-4 right-4 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-full pointer-events-none"></div>

                    {navItems.map((item) => {
                        const isActive = page === item.name || (window.location.pathname === item.href && !item.isAction);
                        const isAction = item.isAction;

                        return (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={item.onClick}
                                className={`
                                    relative px-5 py-2 rounded-full font-black text-xs md:text-sm tracking-wide transition-all duration-300 cursor-pointer overflow-hidden group
                                    ${isActive
                                        ? 'bg-[#ec4899] text-white shadow-[0_3px_0_#be185d] border-b-2 border-[#be185d]'
                                        : isAction
                                            ? 'text-yellow-200 hover:text-white hover:bg-white/10' // Action style (Logout)
                                            : 'text-white backdrop-blur-md bg-white/20 border-t-2 border-l-2 border-r border-b border-white/80 shadow-[inset_0_-4px_8px_rgba(255,255,255,0.4),_inset_0_4px_8px_rgba(255,255,255,0.8),_0_4px_10px_rgba(0,0,0,0.15)] hover:bg-white/30 hover:shadow-[inset_0_-6px_10px_rgba(255,255,255,0.6),_inset_0_6px_10px_rgba(255,255,255,1),_0_6px_12px_rgba(0,0,0,0.2)]'
                                    }
                                `}
                            >
                                {/* Glass reflection effect for inactive items (Top curved highlight) */}
                                {!isActive && !isAction && (
                                    <div className="absolute top-1 left-2 right-2 h-1/2 bg-gradient-to-b from-white to-transparent opacity-90 rounded-t-full pointer-events-none"></div>
                                )}
                                <span className="relative z-10" style={(!isActive && !isAction) ? { textShadow: '0 1px 2px rgba(0,0,0,0.2)' } : {}}>
                                    {item.name}
                                </span>
                            </a>
                        );
                    })}
                </div>

                {/* Right: HIRE ME Button */}
                <div className="hidden md:block flex-shrink-0 z-10">
                    <PlasticButton
                        color="yellow"
                        onClick={() => window.location.href = '/contact'}
                        className="text-xs md:text-sm px-6 py-3 shadow-[0_6px_0_#e67700,0_10px_20px_rgba(255,193,7,0.4)]"
                    >
                        HIRE ME
                    </PlasticButton>
                </div>
            </nav>

            {/* Mobile Nav Button (Hamburger Toy) */}
            <div className="md:hidden absolute top-8 right-6 z-[60]">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="
                        group w-14 h-14 bg-yellow-400 rounded-2xl shadow-[0_6px_0_#ca8a04,0_10px_10px_rgba(0,0,0,0.2)] border-b-[4px] border-r-[4px] border-yellow-300 flex flex-col items-center justify-center gap-1.5 relative overflow-hidden active:shadow-none active:translate-y-[6px] transition-all duration-150
                    "
                >
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white/30 rounded-t-xl pointer-events-none"></div>
                    <div className={`w-8 h-1.5 bg-yellow-900 rounded-full transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-[6px]' : ''}`}></div>
                    <div className={`w-8 h-1.5 bg-yellow-900 rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 translate-x-10' : ''}`}></div>
                    <div className={`w-8 h-1.5 bg-yellow-900 rounded-full transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`}></div>
                </button>
            </div>

            {/* Backdrop */}
            <div
                ref={backdropRef}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 z-[54] bg-black/40 backdrop-blur-[2px] opacity-0 pointer-events-none"
            />

            {/* GSAP Mobile Sidebar Drawer */}
            <div
                ref={menuRef}
                className="fixed top-0 right-0 bottom-0 w-72 max-w-[85vw] z-[55] bg-gradient-to-b from-[#60a5fa] to-[#3b82f6] flex flex-col items-center justify-center pointer-events-none rounded-l-[30px] border-l-4 border-blue-300 shadow-[-10px_0_40px_rgba(0,0,0,0.3)]"
                style={{ transform: 'translateX(100%)' }}
            >
                <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-gradient-to-l from-black/5 to-transparent pointer-events-none"></div>
                <div className="absolute top-4 left-4 w-2 h-[90%] bg-white/20 rounded-full blur-[1px]"></div>
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

                <div className="flex flex-col gap-6 text-center relative z-10 w-full px-6">
                    {navItems.map((item, index) => {
                        const isActive = page === item.name || (window.location.pathname === item.href && !item.isAction);
                        const isAction = item.isAction;

                        return (
                            <a
                                key={item.name}
                                ref={el => linkRefs.current[index] = el}
                                href={item.href}
                                onClick={(e) => {
                                    if (item.onClick) {
                                        item.onClick(e);
                                    } else {
                                        setIsMenuOpen(false);
                                    }
                                }}
                                className={`
                                    relative w-full py-4 rounded-3xl text-3xl font-black tracking-tighter uppercase transform transition-all duration-300 active:scale-95 opacity-0 translate-x-10 overflow-hidden group
                                    ${isActive
                                        ? `scale-105 border-b-4 border-r-4 border-slate-200/50 ${item.colorClass}`
                                        : 'text-white backdrop-blur-xl bg-white/20 border-t-2 border-l-2 border-r border-b border-white/60 shadow-[inset_0_-8px_15px_rgba(255,255,255,0.4),_inset_0_4px_10px_rgba(255,255,255,0.8),_0_5px_15px_rgba(0,0,0,0.2)] hover:bg-white/30 hover:shadow-[inset_0_-10px_20px_rgba(255,255,255,0.6),_inset_0_8px_20px_rgba(255,255,255,1),_0_8px_20px_rgba(0,0,0,0.25)] hover:scale-105'
                                    }
                                `}
                                style={isActive ? { textShadow: 'none' } : { textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                            >
                                {/* Glass reflection effect for inactive items (Top curved highlight) */}
                                {!isActive && !isAction && (
                                    <div className="absolute top-1 left-3 right-3 h-1/3 bg-gradient-to-b from-white to-transparent opacity-90 rounded-t-3xl pointer-events-none"></div>
                                )}
                                <span className="relative z-10">{item.name}</span>
                                {/* Glowing Line Indicator for Active Page */}
                                {isActive && (
                                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[6px] h-2/3 max-h-[40px] rounded-r-lg z-20 ${activeRouteMap[item.themeColor].indicator}`}></div>
                                )}
                            </a>
                        );
                    })}
                </div>

                <div className="absolute bottom-12 text-white/50 text-sm font-bold tracking-widest uppercase">
                    © 2026 Kevin Hermansyah
                </div>
            </div>

            {/* Main Content Area */}
            <main className={`${standalone ? 'relative z-10 w-full' : 'flex-grow container mx-auto px-4 py-8 relative z-10 w-full'}`}>
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
            {!standalone && <Footer />}
        </div>
    );
};

export default MainLayout;
