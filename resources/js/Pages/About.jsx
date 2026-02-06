import React, { useRef } from 'react';
import MainLayout from '../Layout/MainLayout';
import PlasticCard from '../UI/PlasticCard';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const JellyCard = ({ children }) => {
    const cardRef = useRef(null);

    // Motion values for drag position (automatically handled by drag prop, but we observe them)
    // Actually for tilt we often want to map x/y of the drag.

    // We will simple use the `drag` prop's nature and some transforms based on the motion value style
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // SMOOTHER PHYSICS: Lower stiffness, higher damping ratio to prevent jitter, but kept 'loose' for jelly feel
    const springConfig = { stiffness: 200, damping: 15, mass: 0.8 };

    const mouseXSpring = useSpring(x, springConfig); // Bouncy
    const mouseYSpring = useSpring(y, springConfig);

    // Map drag offset to rotation (Tilt) with slightly exaggerated range for visual effect
    const rotateX = useTransform(mouseYSpring, [-100, 100], [20, -20]); // Drag down -> tilt up
    const rotateY = useTransform(mouseXSpring, [-100, 100], [-20, 20]); // Drag right -> tilt right

    // Scale on press
    const scale = useSpring(1, { stiffness: 300, damping: 15 });

    return (
        <div className="perspective-1000 p-4 md:p-8 flex items-center justify-center w-full">
            <motion.div
                ref={cardRef}
                style={{ x, y, rotateX, rotateY, scale, cursor: 'grab' }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.6} // The "Jelly" stretch factor
                whileTap={{ cursor: 'grabbing', scale: 0.95 }}
                onTapStart={() => scale.set(0.9)}
                onTap={() => scale.set(1)}
                className="relative z-10 touch-none select-none w-full max-w-md" // touch-none prevents scrolling while dragging on mobile
            >
                {children}

                {/* Smoother Shine Effect based on positioning could be added here, 
                     but standard plastic card glare is usually enough. 
                     Let's add a dynamic shine that reacts to drag.
                 */}
                <motion.div
                    style={{
                        opacity: useTransform(x, [-150, 0, 150], [0, 0.4, 0]),
                        left: useTransform(x, [-150, 150], ['-20%', '120%'])
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 z-50 pointer-events-none mix-blend-overlay w-1/2 h-full rounded-[2rem]"
                />
            </motion.div>
        </div>
    );
};

const Icons = {
    Robot: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-white drop-shadow-md">
            <path d="M12 2A4 4 0 008 6V7H6A2 2 0 004 9V17A2 2 0 006 19H8V20A2 2 0 0010 22H14A2 2 0 0016 20V19H18A2 2 0 0020 17V9A2 2 0 0018 7H16V6A4 4 0 0012 2M12 4A2 2 0 0114 6V7H10V6A2 2 0 0112 4M9 12A1.5 1.5 0 1110.5 13.5A1.5 1.5 0 019 12M15 12A1.5 1.5 0 1116.5 13.5A1.5 1.5 0 0115 12M10 16H14V17H10V16Z" />
        </svg>
    ),
    Bolt: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10 text-yellow-600 drop-shadow-sm mx-auto mb-1">
            <path d="M11 15H6L13 1V9H18L11 23V15Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    ),
    Diamond: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10 text-blue-600 drop-shadow-sm mx-auto mb-1">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M2 7L12 12L22 7V17L12 22L2 17V7Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    ),
    Rocket: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-10 md:h-10 text-green-600 drop-shadow-sm mx-auto mb-1">
            <path d="M12 2.5C12 2.5 15.5 5 16 9C16.5 13 15 15 15 15L17 17L14.5 18L12 21L9.5 18L7 17L9 15C9 15 7.5 13 8 9C8.5 5 12 2.5 12 2.5Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M12 12C12.5523 12 13 11.5523 13 11C13 10.4477 12.5523 10 12 10C11.4477 10 11 10.4477 11 11C11 11.5523 11.4477 12 12 12Z" fill="white" />
        </svg>
    )
};

const About = ({ page }) => {
    return (
        <MainLayout page={page}>
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 overflow-hidden">

                <h2 className="text-center font-black text-slate-300 md:mb-2 animate-pulse text-xs md:text-sm uppercase tracking-widest hidden md:block">
                    Try Dragging the Card!
                </h2>

                <JellyCard>
                    <div className="w-full">
                        <PlasticCard color="pink" title="DEV PROFILE" className="w-full !m-0 !transform-none !pb-4">
                            <div className="text-center space-y-4 md:space-y-6">
                                {/* Profile Avatar / Toy Icon - Custom SVG */}
                                <div className="w-20 h-20 md:w-28 md:h-28 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-[6px] border-white shadow-xl flex items-center justify-center p-4 transform hover:rotate-12 transition-transform duration-300">
                                    <Icons.Robot />
                                </div>

                                <div>
                                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter transform -rotate-2 leading-none">
                                        Levin<br /><span className="text-pink-500">Hermansyah</span>
                                    </h1>
                                    <div className="inline-block bg-slate-900 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full mt-2 uppercase tracking-widest shadow-md">
                                        Full Stack Dev
                                    </div>
                                </div>

                                {/* Quote Box - Responsive text */}
                                <div className="bg-pink-50 rounded-xl p-4 md:p-5 border-2 border-pink-100 text-left relative overflow-hidden group shadow-inner">
                                    {/* Texture */}
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>

                                    <p className="font-bold text-slate-600 text-xs md:text-sm leading-relaxed relative z-10">
                                        "Software should be <span className="text-pink-500 font-black">FUN</span>. I build web apps that feel like toys but work like machines."
                                    </p>
                                </div>

                                {/* Stickers - Custom SVGs & Responsive sizing */}
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div className="bg-yellow-100 p-2 md:p-3 rounded-xl border-2 border-yellow-200 hover:scale-105 transition-transform">
                                        <Icons.Bolt />
                                        <div className="text-[10px] md:text-xs font-black text-yellow-700 uppercase tracking-wider">Fast</div>
                                    </div>
                                    <div className="bg-blue-100 p-2 md:p-3 rounded-xl border-2 border-blue-200 hover:scale-105 transition-transform">
                                        <Icons.Diamond />
                                        <div className="text-[10px] md:text-xs font-black text-blue-700 uppercase tracking-wider">Clean</div>
                                    </div>
                                    <div className="bg-green-100 p-2 md:p-3 rounded-xl border-2 border-green-200 hover:scale-105 transition-transform">
                                        <Icons.Rocket />
                                        <div className="text-[10px] md:text-xs font-black text-green-700 uppercase tracking-wider">Ship</div>
                                    </div>
                                </div>
                            </div>
                        </PlasticCard>
                    </div>
                </JellyCard>

            </div>
        </MainLayout>
    );
};

export default About;
