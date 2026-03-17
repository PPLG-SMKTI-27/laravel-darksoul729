import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const menuVariants = {
    hidden: {
        opacity: 0,
        y: -16,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
            staggerChildren: 0.06,
            delayChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: -10,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const SkillsNavbar = ({ links }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <motion.header
                initial="hidden"
                animate="visible"
                variants={menuVariants}
                className="pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8"
            >
                <motion.nav
                    variants={itemVariants}
                    className="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-slate-950/40 px-4 py-3 shadow-[0_20px_80px_rgba(4,8,25,0.55)] backdrop-blur-2xl sm:px-6 lg:px-8"
                >
                    <a href="/" className="flex items-center gap-3">
                        <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 shadow-[0_0_30px_rgba(96,165,250,0.18)]">
                            <div className="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.7),rgba(255,255,255,0.08)_35%,rgba(37,99,235,0.45)_100%)]" />
                            <span className="relative text-sm font-semibold tracking-[0.35em] text-white">KH</span>
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-xs uppercase tracking-[0.45em] text-sky-200/70">Portfolio</p>
                            <p className="text-sm font-medium text-white/90">Creative Orbit</p>
                        </div>
                    </a>

                    <div className="hidden items-center gap-7 lg:flex">
                        {links.map((link) => (
                            <motion.a
                                key={link.label}
                                variants={itemVariants}
                                href={link.href}
                                className={`relative text-sm font-medium transition-colors ${
                                    link.active ? 'text-white' : 'text-white/68 hover:text-white'
                                }`}
                            >
                                {link.label}
                                {link.active ? (
                                    <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-sky-300 shadow-[0_0_16px_rgba(125,211,252,0.9)]" />
                                ) : null}
                            </motion.a>
                        ))}
                    </div>

                    <div className="hidden items-center gap-4 lg:flex">
                        <a href="/login" className="text-sm font-medium text-white/80 transition-colors hover:text-white">
                            Login
                        </a>
                        <a
                            href="/contact"
                            className="rounded-full border border-amber-300/40 bg-[linear-gradient(135deg,#ffd44d,#ffb703)] px-6 py-3 text-sm font-semibold tracking-[0.18em] text-slate-950 shadow-[0_8px_35px_rgba(255,183,3,0.35)] transition-transform hover:-translate-y-0.5"
                        >
                            HIRE ME
                        </a>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((value) => !value)}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white lg:hidden"
                        aria-label="Toggle navigation"
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </motion.nav>
            </motion.header>

            <AnimatePresence>
                {isMenuOpen ? (
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="fixed inset-x-4 top-20 z-50 rounded-[2rem] border border-white/10 bg-slate-950/92 p-6 shadow-[0_20px_80px_rgba(4,8,25,0.6)] backdrop-blur-2xl lg:hidden"
                    >
                        <div className="flex flex-col gap-4">
                            {links.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`rounded-2xl border px-4 py-3 text-base font-medium ${
                                        link.active
                                            ? 'border-sky-300/30 bg-sky-300/10 text-white'
                                            : 'border-white/8 bg-white/5 text-white/80'
                                    }`}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="flex items-center justify-between gap-3 pt-3">
                                <a href="/login" className="text-sm font-medium text-white/80">
                                    Login
                                </a>
                                <a
                                    href="/contact"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="rounded-full border border-amber-300/30 bg-[linear-gradient(135deg,#ffd44d,#ffb703)] px-5 py-2.5 text-sm font-semibold tracking-[0.16em] text-slate-950"
                                >
                                    HIRE ME
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </>
    );
};

export default SkillsNavbar;
