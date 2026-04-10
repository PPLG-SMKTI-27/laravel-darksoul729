import React from 'react';

const PlasticButton = ({ children, onClick, color = 'blue', className = '', disabled = false, type = 'button', style, ...props }) => {
    const colorClasses = {
        blue: { main: 'bg-[#4dabf7] text-white border-[#1864ab] shadow-[0_6px_0_#1864ab,_0_10px_20px_rgba(0,0,0,0.2)]', inset: 'shadow-[inset_0_-4px_6px_rgba(0,0,0,0.2),_inset_0_4px_6px_rgba(255,255,255,0.3)]' },
        red: { main: 'bg-[#ff8787] text-white border-[#c92a2a] shadow-[0_6px_0_#c92a2a,_0_10px_20px_rgba(0,0,0,0.2)]', inset: 'shadow-[inset_0_-4px_6px_rgba(0,0,0,0.2),_inset_0_4px_6px_rgba(255,255,255,0.3)]' },
        yellow: { main: 'bg-[#ffe066] text-[#854d0e] border-[#e67700] shadow-[0_6px_0_#e67700,_0_10px_20px_rgba(0,0,0,0.2)]', inset: 'shadow-[inset_0_-4px_6px_rgba(133,77,14,0.15),_inset_0_4px_6px_rgba(255,255,255,0.5)]' },
        green: { main: 'bg-[#69db7c] text-white border-[#2b8a3e] shadow-[0_6px_0_#2b8a3e,_0_10px_20px_rgba(0,0,0,0.2)]', inset: 'shadow-[inset_0_-4px_6px_rgba(0,0,0,0.2),_inset_0_4px_6px_rgba(255,255,255,0.3)]' },
        pink: { main: 'bg-[#faa2c1] text-white border-[#a61e4d] shadow-[0_6px_0_#a61e4d,_0_10px_20px_rgba(0,0,0,0.2)]', inset: 'shadow-[inset_0_-4px_6px_rgba(0,0,0,0.2),_inset_0_4px_6px_rgba(255,255,255,0.3)]' },
    };

    const activeColor = colorClasses[color] || colorClasses.blue;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            type={type}
            style={style}
            className={`
                relative
                py-3 px-8
                rounded-2xl
                border-2
                font-black uppercase tracking-wider text-sm md:text-base
                transition-[transform,filter] duration-150 ease-out
                will-change-transform
                hover:-translate-y-0.5 hover:scale-[1.02]
                active:translate-y-[6px] active:scale-[0.98]
                disabled:cursor-not-allowed disabled:opacity-70 disabled:grayscale-[0.12]
                disabled:hover:translate-y-0 disabled:hover:scale-100
                disabled:active:translate-y-0 disabled:active:scale-100
                ${activeColor.main}
                ${className}
            `}
            {...props}
        >
            {/* Inner Clay Edge Shadow Layer */}
            <div className={`absolute inset-0 rounded-2xl pointer-events-none ${activeColor.inset}`}></div>

            <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-sm">
                {children}
            </span>
        </button>
    );
};

export default PlasticButton;
