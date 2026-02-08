import React from 'react';
import { motion } from 'framer-motion';

const PlasticCard = ({ children, className = '', delay = 0, color = 'pink', title, isNew = false }) => {
    const cardColors = {
        pink: 'bg-gradient-to-br from-pink-400 to-pink-500 border-pink-700',
        yellow: 'bg-gradient-to-br from-yellow-300 to-yellow-400 border-yellow-600',
        green: 'bg-gradient-to-br from-green-400 to-green-500 border-green-700',
        blue: 'bg-gradient-to-br from-blue-400 to-blue-500 border-blue-700',
    };

    const selectedColor = cardColors[color] || cardColors.pink;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay, type: "tween", ease: "backOut", duration: 0.6 }}
            className={`relative group ${className}`}
        >
            {/* The Cardboard Backing */}
            <div
                className={`
                    ${selectedColor} relative 
                    rounded-[2rem] p-3 pb-6
                    shadow-[0_15px_30px_rgba(0,0,0,0.2),0_5px_10px_rgba(0,0,0,0.1)] 
                    border-[4px] border-white/30
                    transition-all duration-300 ease-out 
                    group-hover:-translate-y-4 group-hover:rotate-1 group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.3),0_10px_20px_rgba(0,0,0,0.15)]
                    flex flex-col h-full
                    overflow-visible
                `}
            >
                {/* Cardboard Texture */}
                <div className="absolute inset-0 rounded-[2rem] opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')] pointer-events-none mix-blend-multiply"></div>

                {/* Euro Hanger Hole (Punched out) */}
                <div className="relative flex justify-center -mt-1 mb-2 z-10 opacity-80">
                    <div className="w-16 h-6 bg-slate-900/20 rounded-full flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border-b border-white/20">
                    </div>
                </div>

                {/* Branding / Title on Cardboard */}
                {title && (
                    <div className="text-center mb-3 px-1 relative z-10">
                        <h3 className="
                            font-black text-2xl uppercase tracking-tighter leading-none
                            text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.3)]
                            stroke-black stroke-2
                        " style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)' }}>
                            {title}
                        </h3>
                    </div>
                )}

                {/* The "Blister" Bubble (Plastic Container) */}
                <div className="relative flex-grow">

                    {/* Heat Seal / Flange */}
                    <div className="absolute -inset-1 rounded-[1.8rem] border-[3px] border-dashed border-white/30 opacity-60"></div>

                    {/* The Plastic Bubble */}
                    <div className="
                        relative 
                        bg-white/5 
                        rounded-[1.5rem] 
                        p-2 md:p-3
                        shadow-[inset_0_0_20px_rgba(255,255,255,0.4),0_10px_20px_rgba(0,0,0,0.1)] 
                        backdrop-blur-[1px] 
                        border-[2px] border-white/50
                        h-full flex flex-col
                        overflow-hidden
                    ">
                        {/* Bubble Volume / Curvature Highlight (Top) */}
                        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-[1.5rem] pointer-events-none"></div>

                        {/* Content Inside Bubble */}
                        <div className="
                            relative z-10 
                            bg-gradient-to-b from-slate-50 to-slate-100
                            rounded-xl 
                            border border-white/60
                            shadow-inner
                            p-2
                            h-full flex flex-col
                            group-hover:scale-[1.02] transition-transform duration-300
                        ">
                            {/* Inner Tray Texture */}
                            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:8px_8px] opacity-20 pointer-events-none"></div>

                            {children}
                        </div>

                        {/* STRONG Plastic Reflection / Glare Overlay */}
                        <div className="absolute inset-0 pointer-events-none z-50 rounded-[1.5rem] overflow-hidden">
                            {/* Main Glare */}
                            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-80 transform -rotate-12"></div>
                            {/* Sharp Highlight */}
                            <div className="absolute top-4 right-4 w-24 h-12 bg-white blur-[8px] opacity-60 transform rotate-12 mix-blend-overlay"></div>
                            {/* Surface Imperfections (Scratches) */}
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/scratches.png')] mix-blend-screen"></div>
                        </div>

                    </div>
                </div>

                {/* "New!" Foil Sticker */}
                {isNew && (
                    <div className="
                        absolute -top-4 -right-4 
                        w-20 h-20 
                        z-50 
                        transform rotate-[15deg] group-hover:rotate-[20deg] group-hover:scale-110 transition-transform duration-300
                    ">
                        <div className="
                            w-full h-full 
                            bg-yellow-400 
                            rounded-full 
                            border-[2px] border-white 
                            shadow-xl 
                            flex items-center justify-center 
                            bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-yellow-300 via-yellow-500 to-yellow-300
                        ">
                            <div className="text-center leading-[0.85] text-red-600 drop-shadow-sm transform -rotate-12">
                                <span className="block font-black text-xs uppercase tracking-wider">Fresh</span>
                                <span className="block font-black text-xl uppercase italic">Drop!</span>
                            </div>
                            {/* Sticker Sheen */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/40 to-transparent"></div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default PlasticCard;
