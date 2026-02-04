import React from 'react';
import { motion } from 'framer-motion';

const PlasticButton = ({ children, onClick, color = 'blue', className = '' }) => {
    const colorClasses = {
        blue: 'bg-gradient-to-b from-[#4dabf7] to-[#1971c2] shadow-[0_6px_0_#1864ab] border-[#1864ab]',
        red: 'bg-gradient-to-b from-[#ff8787] to-[#e03131] shadow-[0_6px_0_#c92a2a] border-[#c92a2a]',
        yellow: 'bg-gradient-to-b from-[#ffe066] to-[#fcc419] shadow-[0_6px_0_#e67700] border-[#e67700] text-amber-900',
        green: 'bg-gradient-to-b from-[#69db7c] to-[#2f9e44] shadow-[0_6px_0_#2b8a3e] border-[#2b8a3e]',
        pink: 'bg-gradient-to-b from-[#faa2c1] to-[#d6336c] shadow-[0_6px_0_#a61e4d] border-[#a61e4d]',
    };

    const activeColor = colorClasses[color] || colorClasses.blue;

    return (
        <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 4, boxShadow: '0 0px 0 0 rgba(0,0,0,0)' }}
            onClick={onClick}
            className={`
                relative
                py-3 px-8
                rounded-full
                font-black uppercase tracking-wider text-sm md:text-base
                text-white
                border-2
                transition-all duration-100 ease-out
                ${activeColor}
                ${className}
            `}
        >
            {/* Top Shine/Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[40%] bg-gradient-to-b from-white/40 to-transparent rounded-full opacity-80 pointer-events-none"></div>

            <span className="relative z-10 drop-shadow-sm flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
};

export default PlasticButton;
