import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

const PlasticButton = ({ children, onClick, color = 'blue', className = '' }) => {
    const buttonRef = useRef(null);
    const contentRef = useRef(null);

    const colorClasses = {
        blue: { main: 'bg-[#4dabf7] text-white border-[#1864ab] shadow-[0_6px_0_#1864ab,_0_10px_20px_rgba(0,0,0,0.2)]', inset: 'shadow-[inset_0_-4px_6px_rgba(0,0,0,0.2),_inset_0_4px_6px_rgba(255,255,255,0.3)]' },
        red: { main: 'bg-[#ff8787] text-white border-[#c92a2a] shadow-[0_6px_0_#c92a2a,_0_10px_20px_rgba(0,0,0,0.2)]', inset: 'shadow-[inset_0_-4px_6px_rgba(0,0,0,0.2),_inset_0_4px_6px_rgba(255,255,255,0.3)]' },
        yellow: { main: 'bg-[#ffe066] text-[#854d0e] border-[#e67700] shadow-[0_6px_0_#e67700,_0_10px_20px_rgba(0,0,0,0.2)]', inset: 'shadow-[inset_0_-4px_6px_rgba(133,77,14,0.15),_inset_0_4px_6px_rgba(255,255,255,0.5)]' },
        green: { main: 'bg-[#69db7c] text-white border-[#2b8a3e] shadow-[0_6px_0_#2b8a3e,_0_10px_20px_rgba(0,0,0,0.2)]', inset: 'shadow-[inset_0_-4px_6px_rgba(0,0,0,0.2),_inset_0_4px_6px_rgba(255,255,255,0.3)]' },
        pink: { main: 'bg-[#faa2c1] text-white border-[#a61e4d] shadow-[0_6px_0_#a61e4d,_0_10px_20px_rgba(0,0,0,0.2)]', inset: 'shadow-[inset_0_-4px_6px_rgba(0,0,0,0.2),_inset_0_4px_6px_rgba(255,255,255,0.3)]' },
    };

    const activeColor = colorClasses[color] || colorClasses.blue;

    useLayoutEffect(() => {
        const button = buttonRef.current;

        let ctx = gsap.context(() => {
            button.addEventListener('mouseenter', () => {
                gsap.to(button, { y: -2, scale: 1.02, duration: 0.2, ease: "power1.out" });
            });

            button.addEventListener('mouseleave', () => {
                gsap.to(button, { y: 0, scale: 1, duration: 0.2, ease: "power1.out" });
            });

            button.addEventListener('mousedown', () => {
                gsap.to(button, { y: 6, scale: 0.98, boxShadow: '0 0px 0 0 rgba(0,0,0,0)', duration: 0.1 });
            });

            button.addEventListener('mouseup', () => {
                gsap.to(button, { y: -2, scale: 1.02, clearProps: 'boxShadow', duration: 0.1 });
            });
        }, buttonRef);

        return () => ctx.revert();
    }, []);

    return (
        <button
            ref={buttonRef}
            onClick={onClick}
            className={`
                relative
                py-3 px-8
                rounded-2xl
                border-2
                font-black uppercase tracking-wider text-sm md:text-base
                transition-all duration-100 ease-out
                will-change-transform
                ${activeColor.main}
                ${className}
            `}
        >
            {/* Inner Clay Edge Shadow Layer */}
            <div className={`absolute inset-0 rounded-2xl pointer-events-none ${activeColor.inset}`}></div>

            <span ref={contentRef} className="relative z-10 drop-shadow-sm flex items-center justify-center gap-2">
                {children}
            </span>
        </button>
    );
};

export default PlasticButton;
