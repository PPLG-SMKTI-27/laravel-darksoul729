import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

const PlasticCard = ({ children, title, subtitle, color = 'pink', className = '', isNew = false }) => {
    const cardRef = useRef(null);
    const blisterRef = useRef(null);
    const shineRef = useRef(null);

    // Color definitions for the CARDBOARD backing
    const colors = {
        pink: {
            bg: 'bg-gradient-to-br from-pink-400 to-pink-600',
            border: 'border-pink-300',
            shadow: 'shadow-[0_10px_20px_rgba(219,39,119,0.3),inset_0_0_0_1px_rgba(255,255,255,0.2)]',
            text: 'text-white',
            accent: 'bg-pink-700'
        },
        blue: {
            bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
            border: 'border-blue-300',
            shadow: 'shadow-[0_10px_20px_rgba(37,99,235,0.3),inset_0_0_0_1px_rgba(255,255,255,0.2)]',
            text: 'text-white',
            accent: 'bg-blue-700'
        },
        yellow: {
            bg: 'bg-gradient-to-br from-yellow-300 to-yellow-500',
            border: 'border-yellow-200',
            shadow: 'shadow-[0_10px_20px_rgba(202,138,4,0.3),inset_0_0_0_1px_rgba(255,255,255,0.2)]',
            text: 'text-yellow-900',
            accent: 'bg-yellow-600'
        },
        green: {
            bg: 'bg-gradient-to-br from-green-400 to-green-600',
            border: 'border-green-300',
            shadow: 'shadow-[0_10px_20px_rgba(22,163,74,0.3),inset_0_0_0_1px_rgba(255,255,255,0.2)]',
            text: 'text-white',
            accent: 'bg-green-700'
        },
        orange: {
            bg: 'bg-gradient-to-br from-orange-400 to-orange-600',
            border: 'border-orange-300',
            shadow: 'shadow-[0_10px_20px_rgba(234,88,12,0.3),inset_0_0_0_1px_rgba(255,255,255,0.2)]',
            text: 'text-white',
            accent: 'bg-orange-700'
        },
        clear: {
            bg: 'bg-white/10 backdrop-blur-md',
            border: 'border-white/20',
            shadow: 'shadow-[0_10px_30px_rgba(0,0,0,0.15),inset_0_0_0_1px_rgba(255,255,255,0.1)]',
            text: 'text-slate-800',
            accent: 'bg-white/20'
        },
        earth: {
            bg: 'bg-gradient-to-br from-[#714E36] to-[#4A2F1D]',
            border: 'border-[#8B5A2B]',
            shadow: 'shadow-[0_10px_20px_rgba(74,47,29,0.5),inset_0_0_0_2px_rgba(255,160,100,0.1)]',
            text: 'text-[#FDBA74]',
            accent: 'bg-[#3E2723]'
        },
        sand: {
            bg: 'bg-gradient-to-br from-[#D4A373] to-[#A98467]',
            border: 'border-[#E3D5CA]',
            shadow: 'shadow-[0_10px_20px_rgba(169,132,103,0.4),inset_0_0_0_1px_rgba(255,255,255,0.3)]',
            text: 'text-[#4A3000]',
            accent: 'bg-[#8B6E4A]'
        },
        amber: {
            bg: 'bg-gradient-to-br from-[#D97706] to-[#92400E]',
            border: 'border-[#FBBF24]',
            shadow: 'shadow-[0_10px_20px_rgba(146,64,14,0.4),inset_0_0_0_1px_rgba(255,255,255,0.2)]',
            text: 'text-[#FEF3C7]',
            accent: 'bg-[#78350F]'
        },
        stone: {
            bg: 'bg-gradient-to-br from-[#78716C] to-[#44403C]',
            border: 'border-[#A8A29E]',
            shadow: 'shadow-[0_10px_20px_rgba(68,64,60,0.4),inset_0_0_0_1px_rgba(255,255,255,0.1)]',
            text: 'text-[#E7E5E4]',
            accent: 'bg-[#292524]'
        }
    };

    const theme = colors[color] || colors.pink;
    const isEarthyTheme = ['earth', 'sand', 'amber', 'stone'].includes(color);

    useLayoutEffect(() => {
        const card = cardRef.current;

        let ctx = gsap.context(() => {
            // Hover Animation - Floating Effect
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -12,
                    scale: 1.02,
                    rotateX: 5,
                    rotateY: -5,
                    duration: 0.4,
                    ease: "back.out(2)" // More bouncy
                });

                // Animate Shine
                if (shineRef.current) {
                    gsap.fromTo(shineRef.current,
                        { x: '-150%', opacity: 0 },
                        { x: '150%', opacity: 0.5, duration: 0.6, ease: "power1.inOut" }
                    );
                }
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.5)" // Wobble back to place
                });
            });
        }, cardRef);

        return () => ctx.revert();
    }, [color]);

    if (isEarthyTheme) {
        return (
            <div
                ref={cardRef}
                className={`
                    relative 
                    w-full h-full
                    rounded-[16px] 
                    ${theme.bg}
                    border-[6px] border-b-[12px] border-r-[8px] ${theme.border}
                    ${theme.shadow}
                    pb-6 pt-12 px-6
                    flex flex-col
                    will-change-transform
                    group
                    transform-gpu
                    perspective-1000
                    ${className}
                `}
                style={{
                    boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.5), inset 0 -2px 5px rgba(255,255,255,0.1), 0 15px 25px rgba(0,0,0,0.9)'
                }}
            >
                {/* --- STONE TEXTURE OVERLAY --- */}
                <div className="absolute inset-0 rounded-[10px] bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-[0.15] mix-blend-multiply pointer-events-none"></div>
                <div className="absolute inset-0 rounded-[10px] bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.1)_0%,transparent_50%)] pointer-events-none"></div>

                {/* --- CHISELED TITLE GROOVE --- */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-0 w-[80%] h-2 bg-black/40 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),_0_1px_0_rgba(255,255,255,0.1)]"></div>

                <div className="text-center mb-4 z-10 relative">
                    <h3 className={`font-black uppercase tracking-widest text-xl md:text-2xl drop-shadow-xl ${theme.text}`}
                        style={{ textShadow: '0 -2px 2px rgba(0,0,0,0.7), 0 2px 0 rgba(255,255,255,0.1)' }}>
                        {title}
                    </h3>
                    {subtitle && <p className={`text-[10px] font-bold tracking-[0.2em] mt-2 text-stone-400 opacity-80 uppercase`}>{subtitle}</p>}
                </div>

                {/* --- EXCAVATED HOLE DOME --- */}
                <div
                    ref={blisterRef}
                    className="
                        relative 
                        bg-[#0a0502]/80
                        rounded-[10px]
                        border-t-4 border-l-4 border-black/60
                        border-b-[1px] border-r-[1px] border-white/10
                        shadow-[inset_0_15px_30px_rgba(0,0,0,0.9),0_2px_1px_rgba(255,255,255,0.15)]
                        p-2 lg:p-4
                        flex-grow
                        flex flex-col
                        overflow-hidden
                        z-20
                    "
                >
                    {/* Inner glowing gem lighting */}
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#d97706] rounded-full blur-[40px] opacity-20 pointer-events-none mix-blend-screen"></div>

                    {/* --- CONTENT INSIDE THE CAVERN --- */}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center transform transition-transform duration-500 group-hover:scale-[1.03] group-hover:-translate-y-1">
                        <div className={`w-full h-full flex flex-col filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]`}>
                            {children}
                        </div>
                    </div>
                </div>

                {/* --- "NEW" STICKER (Relic Plate) --- */}
                {isNew && (
                    <div className="absolute -top-4 -right-2 rotate-[-10deg] bg-amber-600 text-[#FEF3C7] border-[2px] border-[#92400E] border-t-[#FCD34D] border-l-[#FCD34D] shadow-[0_10px_10px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] font-black text-[10px] tracking-widest px-3 py-1 z-30 flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-black/50 shadow-[0_1px_0_rgba(255,255,255,0.3)]" />
                        RELIC
                        <div className="w-1 h-1 rounded-full bg-black/50 shadow-[0_1px_0_rgba(255,255,255,0.3)]" />
                    </div>
                )}

                {/* --- BOTTOM BRANDING AREA --- */}
                <div className="mt-4 text-center opacity-70">
                    <span className={`text-[8px] uppercase tracking-[0.3em] font-black ${theme.text}`} style={{ textShadow: '0 -1px 1px rgba(0,0,0,0.8)' }}>
                        EXCAVATION SECTOR B
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={cardRef}
            className={`
                relative 
                w-full h-full
                rounded-[24px] 
                ${theme.bg}
                border-2 ${theme.border}
                ${theme.shadow}
                pb-5 pt-14 px-4
                flex flex-col
                will-change-transform
                group
                transform-gpu
                perspective-1000
                ${className}
            `}
        >
            {/* --- CARDBOARD TEXTURE & SHADOW --- */}
            <div className="absolute inset-0 rounded-[22px] bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')] opacity-10 mix-blend-multiply pointer-events-none"></div>

            {/* --- CARDBOARD HANGER HOLE --- */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-0">
                <div className="w-16 h-5 bg-black/20 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] border-b border-white/20"></div>
            </div>

            {/* --- BACKGROUND GRAPHICS (Subtle Pattern on Cardboard) --- */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:10px_10px] rounded-[18px]"></div>

            <div className="text-center mb-3 z-10 relative">
                <h3 className={`font-black uppercase tracking-tighter text-2xl md:text-3xl drop-shadow-lg ${theme.text}`}
                    style={{ textShadow: '0 3px 0 rgba(0,0,0,0.15)' }}>
                    {title}
                </h3>
                {subtitle && <p className={`text-xs font-bold tracking-wide ${color === 'clear' ? 'text-slate-800' : 'text-white/90'}`}>{subtitle}</p>}
            </div>

            {/* --- THE BLISTER PACK (Plastic Bubble) --- */}
            <div
                ref={blisterRef}
                className="
                    relative 
                    bg-white/20
                    backdrop-blur-[2px]
                    rounded-[1.8rem]
                    border-t border-l border-white/80
                    border-b-2 border-r-2 border-white/30
                    shadow-[inset_0_5px_15px_rgba(255,255,255,0.4),0_8px_20px_rgba(0,0,0,0.15)]
                    p-4
                    flex-grow
                    flex flex-col
                    overflow-hidden
                    z-20
                "
            >
                {/* Internal Drop Shadow (Fake depth between plastic and card) */}
                <div className="absolute inset-0 rounded-[1.8rem] shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] pointer-events-none"></div>

                {/* Bubble Highlights */}
                <div className="absolute top-0 inset-x-0 h-1/3 bg-gradient-to-b from-white/50 to-transparent rounded-t-[1.6rem] pointer-events-none"></div>
                <div className="absolute bottom-0 inset-x-0 h-1/4 bg-gradient-to-t from-white/20 to-transparent rounded-b-[1.6rem] pointer-events-none"></div>

                {/* Sharp Glare */}
                <div className="absolute top-6 right-6 w-20 h-10 bg-white blur-[6px] rounded-full rotate-[-25deg] opacity-70 pointer-events-none mix-blend-overlay"></div>

                {/* Moving Shine Effect inside the bubble */}
                <div ref={shineRef} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 pointer-events-none z-30" style={{ transform: 'translateX(-150%)' }}></div>

                {/* --- CONTENT INSIDE THE BUBBLE --- */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
                    {/* Shadow for the content itself to lift it off the backing */}
                    <div className={`w-full h-full flex flex-col ${color === 'clear' ? '' : 'filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)]'}`}>
                        {children}
                    </div>
                </div>
            </div>

            {/* --- "NEW" STICKER --- */}
            {isNew && (
                <div className="absolute -top-3 -right-3 rotate-12 bg-yellow-400 text-yellow-900 border-[3px] border-white shadow-xl font-black text-xs px-3 py-1 rounded-full z-30">
                    NEW!
                </div>
            )}

            {/* --- BOTTOM BRANDING AREA --- */}
            <div className="mt-3 text-center opacity-70">
                <span className={`text-[9px] uppercase tracking-[0.2em] font-black ${theme.text}`}>Collection Series 1</span>
            </div>

        </div>
    );
};

export default PlasticCard;
