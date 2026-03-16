import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../Layout/MainLayout';
import PlasticButton from '../UI/PlasticButton';

/* ─── Contact channel data ─── */
const contactChannels = [
    { accent: 'bg-amber-400', label: 'Ember Frequency', symbol: 'AT', value: 'hello@darksoul.dev' },
    { accent: 'bg-stone-300', label: 'Ashen Coordinates', symbol: 'ID', value: 'Jakarta, Indonesia' },
    { accent: 'bg-rose-400', label: 'Gate Window', symbol: '48', value: 'Reply within 1-2 days' },
];

/* ─── Lazy external-script loader (de-duped) ─── */
const scriptCache = new Map();
const loadExternalScript = (key, src, checkReady) => {
    if (typeof window === 'undefined') return Promise.reject(new Error('SSR'));
    if (checkReady()) return Promise.resolve();
    if (scriptCache.has(key)) return scriptCache.get(key);
    const p = new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => (checkReady() ? res() : rej(new Error(`${key} not ready after load`)));
        s.onerror = () => rej(new Error(`Failed to load ${src}`));
        document.body.appendChild(s);
    });
    scriptCache.set(key, p);
    return p;
};

/* ─── Vanta Waves Background ─── */
const VantaWavesBackground = () => {
    const bgRef = useRef(null);

    useEffect(() => {
        let effect;
        let alive = true;

        (async () => {
            try {
                await loadExternalScript('three-r134', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js', () => Boolean(window.THREE));
                await loadExternalScript('vanta-waves', 'https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.waves.min.js', () => Boolean(window.VANTA?.WAVES));
                if (!alive || !bgRef.current || !window.VANTA?.WAVES) return;
                effect = window.VANTA.WAVES({
                    el: bgRef.current,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200,
                    minWidth: 200,
                    scale: 1,
                    scaleMobile: 1,
                    color: 0x880020,
                    shininess: 150,
                    waveHeight: 40,
                    waveSpeed: 2,
                    zoom: 0.65,
                });
            } catch (err) {
                console.error('Vanta init failed', err);
            }
        })();

        return () => {
            alive = false;
            effect?.destroy?.();
        };
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <div ref={bgRef} className="absolute inset-0" />
            {/* Subtle vignette only — keep waves visible */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,transparent_40%,rgba(4,0,2,0.35)_100%)]" />
        </div>
    );
};

/* ─── 3D Input field class ─── */
/*
   Design intent:
   - Dark translucent base so Vanta shows through subtly
   - inset shadow gives the "pressed into obsidian" feel
   - top highlight line simulates a beveled edge (3D)
   - outer glow on focus pulls from the background color story
*/
const inputCls = [
    'w-full rounded-2xl',
    'border border-white/10',
    'bg-black/40 backdrop-blur-md',
    // Volumetric 3-D shadow stack
    'shadow-[inset_0_2px_1px_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(0,0,0,0.6),inset_0_4px_24px_rgba(0,0,0,0.55),0_1px_0_rgba(255,255,255,0.04)]',
    'px-4 pb-3 pt-8',
    'text-sm font-semibold text-stone-100 placeholder:text-stone-500',
    'outline-none transition-all duration-250',
    // Focus — ember glow replaces default ring
    'focus:border-orange-500/50 focus:bg-black/50',
    'focus:shadow-[inset_0_2px_1px_rgba(255,255,255,0.07),inset_0_-1px_0_rgba(0,0,0,0.7),inset_0_4px_24px_rgba(0,0,0,0.6),0_0_0_2px_rgba(234,88,12,0.22),0_4px_24px_rgba(220,38,38,0.18)]',
].join(' ');

const labelCls = 'absolute left-4 top-2.5 text-[9px] font-black uppercase tracking-[0.32em] transition-colors duration-200 pointer-events-none z-10';

/* ─── Main component ─── */
const Contact = ({ page }) => {
    const [focused, setFocused] = useState(null);
    const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';

    return (
        <MainLayout page={page} fullBleed>
            <div className="relative isolate min-h-screen overflow-x-hidden">
                <VantaWavesBackground />

                {/* ── Page wrapper – vertically centered, 100dvh ── */}
                <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-16 sm:py-20">

                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-5xl"
                    >
                        {/*
                            OUTER CARD
                            Semi-transparent so Vanta waves bleed through.
                            Border = single pixel light seam (3D bevel).
                        */}
                        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]">

                            {/* Top highlight seam */}
                            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-200/40 to-transparent" />
                            {/* Bottom ambient shadow */}
                            <div className="pointer-events-none absolute inset-x-10 -bottom-1 h-12 rounded-full bg-red-900/30 blur-2xl" />

                            {/*
                                GRID: left info panel + right form panel
                                On mobile: single column, info collapses to compact header
                            */}
                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr]">

                                {/* ── LEFT INFO PANEL ── */}
                                <div className="relative overflow-hidden border-b border-white/8 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">

                                    {/* Subtle ember glow in corner */}
                                    <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-red-600/15 blur-3xl" />
                                    <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 rounded-full bg-orange-500/8 blur-2xl" />

                                    <div className="relative flex flex-col gap-6 lg:min-h-full lg:justify-between">

                                        {/* Badge */}
                                        <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-orange-100/14 bg-black/25 px-4 py-2 backdrop-blur-sm">
                                            <span className="h-2 w-2 rounded-full bg-orange-300 shadow-[0_0_10px_rgba(253,186,116,0.9)]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.34em] text-orange-50/85">
                                                Infernal Contact Gate
                                            </span>
                                        </div>

                                        {/* Heading */}
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black uppercase tracking-[0.44em] text-orange-100/55">
                                                Abyssal Transmission Chamber
                                            </p>
                                            <h1
                                                className="text-4xl font-black uppercase leading-[0.9] text-orange-50 sm:text-5xl lg:text-[3.8rem]"
                                                style={{ textShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                                            >
                                                Summon A
                                                <span className="mt-1.5 block bg-gradient-to-b from-amber-200 via-orange-400 to-red-500 bg-clip-text text-transparent">
                                                    Response
                                                </span>
                                            </h1>
                                            {/* Description — hidden on mobile to save space */}
                                            <p className="hidden max-w-xs text-sm font-medium leading-6 text-stone-300/80 sm:block">
                                                Contact saya ubah jadi altar obsidian berukir. Ada bara, kedalaman, dan cahaya merah supaya rasanya seperti gerbang komunikasi dari neraka.
                                            </p>
                                        </div>

                                        {/* Contact channels — compact on mobile */}
                                        <div className="flex flex-col gap-3 sm:gap-4">
                                            {contactChannels.map((ch) => (
                                                <div
                                                    key={ch.label}
                                                    className="group flex items-center gap-3 rounded-xl border border-white/8 bg-black/20 px-3 py-3 backdrop-blur-sm transition-colors duration-200 hover:border-orange-500/20 hover:bg-black/30 sm:rounded-2xl sm:px-4 sm:py-4"
                                                >
                                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-100/20 ${ch.accent} text-[11px] font-black tracking-[0.2em] text-stone-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_6px_16px_rgba(0,0,0,0.25)] sm:h-12 sm:w-12`}>
                                                        {ch.symbol}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-orange-100/50 sm:text-[10px]">{ch.label}</p>
                                                        <p className="mt-0.5 truncate text-sm font-black text-orange-50 sm:text-base">{ch.value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Seal */}
                                        <div className="relative rounded-xl border border-amber-200/14 bg-black/20 p-3.5 sm:rounded-2xl sm:p-4">
                                            <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-amber-100/40 to-transparent" />
                                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-200/80 sm:text-[10px]">Engraved Seal</p>
                                            <p className="mt-1.5 text-sm font-medium leading-5 text-orange-50/80">
                                                Open for collaborations, product builds, and dramatic visual interfaces.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ── RIGHT FORM PANEL ── */}
                                <div className="relative overflow-hidden p-5 sm:p-7 lg:p-9">

                                    {/* Very subtle ember ambient — purely aesthetic, cheap to render */}
                                    <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-red-700/10 blur-3xl" />

                                    <div className="relative">
                                        {/* Section label */}
                                        <p className="mb-1 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.35em] text-orange-400">
                                            <span className="h-px w-6 bg-orange-500/60" />
                                            Interface Console
                                        </p>
                                        <h2
                                            className="mb-6 text-2xl font-black leading-tight text-stone-100 sm:mb-8 sm:text-3xl"
                                            style={{ textShadow: '0 4px 16px rgba(0,0,0,0.7)' }}
                                        >
                                            Kirim pesan ke{' '}
                                            <span className="bg-gradient-to-b from-amber-200 via-orange-400 to-red-600 bg-clip-text text-transparent">
                                                gerbang bara
                                            </span>
                                        </h2>

                                        <form action="/contact" method="POST" className="flex flex-col gap-4 sm:gap-5">
                                            <input type="hidden" name="_token" value={csrf} />

                                            {/* Name */}
                                            <div className="relative">
                                                <label className={`${labelCls} ${focused === 'name' ? 'text-orange-400' : 'text-red-400/50'}`}>
                                                    Your Name / Alias
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="Captain Code"
                                                    onFocus={() => setFocused('name')}
                                                    onBlur={() => setFocused(null)}
                                                    className={inputCls}
                                                />
                                            </div>

                                            {/* Email */}
                                            <div className="relative">
                                                <label className={`${labelCls} ${focused === 'email' ? 'text-orange-400' : 'text-red-400/50'}`}>
                                                    Secure Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="captain@example.com"
                                                    onFocus={() => setFocused('email')}
                                                    onBlur={() => setFocused(null)}
                                                    className={inputCls}
                                                />
                                            </div>

                                            {/* Message */}
                                            <div className="relative">
                                                <label className={`${labelCls} ${focused === 'message' ? 'text-orange-400' : 'text-red-400/50'}`}>
                                                    Message Content
                                                </label>
                                                <textarea
                                                    name="message"
                                                    rows={5}
                                                    placeholder="Describe your mission..."
                                                    onFocus={() => setFocused('message')}
                                                    onBlur={() => setFocused(null)}
                                                    className={`${inputCls} resize-none pt-9 sm:rows-6`}
                                                    style={{ minHeight: '140px' }}
                                                />
                                            </div>

                                            {/* CTA */}
                                            <div className="pt-2">
                                                <PlasticButton
                                                    color="red"
                                                    className="
                                                        group relative w-full overflow-hidden
                                                        !rounded-2xl py-3.5
                                                        !border-t-[#ff8a66] !border-x-[#c2410c] !border-b-[#7c2d12]
                                                        !bg-gradient-to-b !from-orange-500 !via-red-600 !to-red-800
                                                        !shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_6px_0_#450a0a,0_12px_28px_rgba(185,28,28,0.45)]
                                                        transition-all duration-200
                                                        hover:!shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_6px_0_#450a0a,0_14px_30px_rgba(234,88,12,0.55)]
                                                        active:!translate-y-1 active:!shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_0_#450a0a,0_4px_12px_rgba(234,88,12,0.3)]
                                                    "
                                                >
                                                    {/* Molten sheen sweep */}
                                                    <div className="absolute inset-0 -translate-x-[150%] skew-x-[30deg] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.22),transparent)] transition-transform duration-700 group-hover:translate-x-[150%]" />
                                                    <span className="relative z-10 flex items-center justify-center gap-2.5 text-sm font-black tracking-[0.15em] text-white sm:text-base">
                                                        SUMMON RESPONSE
                                                        <svg className="h-4 w-4 text-orange-200 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                        </svg>
                                                    </span>
                                                </PlasticButton>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                {/* ── END FORM PANEL ── */}

                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </MainLayout>
    );
};

export default Contact;
