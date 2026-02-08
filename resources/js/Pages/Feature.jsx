import React from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../Layout/MainLayout';
import PlasticCard from '../UI/PlasticCard';

const Feature = ({ page }) => {
    // Main "Toy Figures" - Programming Languages
    const mainSkills = [
        { name: "JavaScript", type: "Scripting", image: "/images/javascript_toy.png", color: "yellow", level: "Lv. 90", desc: "Dynamic web logic" },
        { name: "PHP", type: "Backend", image: "/images/php_toy.png", color: "pink", level: "Lv. 85", desc: "Server-side power" },
        { name: "Python", type: "Data/AI", image: "/images/python_toy.png", color: "green", level: "Lv. 80", desc: "Automation & Math" },
        { name: "SQL", type: "Database", image: "/images/sql_toy.png", color: "blue", level: "Lv. 75", desc: "Query mastery" },
        { name: "Git", type: "Versioning", image: "/images/git_toy.png", color: "orange", level: "Lv. 88", desc: "Time travel repo" },
    ];

    // "Accessory Packs" - Frameworks & Tools
    const tools = [
        { name: "React", category: "Frontend", color: "blue" },
        { name: "Laravel", category: "Backend", color: "pink" },
        { name: "Tailwind", category: "Styling", color: "green" },
        { name: "Node.js", category: "Runtime", color: "green" },
        { name: "MySQL", category: "Database", color: "blue" },
        { name: "Three.js", category: "3D Web", color: "yellow" },
        { name: "Docker", category: "DevOps", color: "blue" },
        { name: "Figma", category: "Design", color: "pink" },
    ];

    return (
        <MainLayout page={page}>
            <div className="max-w-7xl mx-auto pb-20">

                {/* HEADLINE */}
                <div className="text-center mb-16 pt-8">
                    <span className="inline-block bg-yellow-300 text-yellow-900 px-4 py-1 rounded-full font-black uppercase tracking-widest text-xs md:text-sm mb-4 border-2 border-white shadow-md transform -rotate-2">
                        My Inventory
                    </span>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-800 leading-[0.85] tracking-tighter cursor-default">
                        SKILL <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 to-green-400"
                            style={{
                                textShadow: `
                                    0 1px 0 #22c55e,
                                    0 2px 0 #22c55e,
                                    0 3px 0 #22c55e,
                                    0 4px 0 #16a34a,
                                    0 5px 0 #16a34a,
                                    0 6px 0 #15803d,
                                    0 7px 0 #15803d,
                                    0 8px 15px rgba(0,0,0,0.2)
                                `,
                                WebkitTextStroke: '2px white',
                                paintOrder: 'stroke fill'
                            }}
                        >
                            COLLECTION
                        </span>
                    </h1>
                </div>

                {/* SECTION 1: MAIN FIGURES */}
                <div className="mb-20">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-10 px-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-500 rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-lg border-2 border-white">🚀</div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-700 uppercase tracking-tight">
                            Main Characters <span className="text-slate-400 text-sm md:text-lg font-bold ml-2">(Languages)</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 px-4">
                        {mainSkills.map((skill, i) => (
                            <PlasticCard
                                key={i}
                                color={skill.color}
                                title={skill.name}
                                delay={i * 0.1}
                                className="h-full"
                            >
                                <div className="flex flex-col items-center h-full">
                                    {/* Image Container */}
                                    <div className="
                                        w-full aspect-square bg-white rounded-lg mb-4 
                                        flex items-center justify-center p-4 
                                        shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]
                                        border border-slate-100
                                        group-hover:bg-slate-50 transition-colors
                                    ">
                                        <img
                                            src={skill.image}
                                            alt={skill.name}
                                            className="w-full h-full object-contain filter drop-shadow-md transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                                        />
                                    </div>

                                    {/* Stats Card */}
                                    <div className="w-full bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs flex-grow">
                                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200">
                                            <span className="font-bold text-slate-400 uppercase">Class</span>
                                            <span className="font-black text-slate-700">{skill.type}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-slate-400 uppercase">Power</span>
                                            <span className="font-black text-pink-500">{skill.level}</span>
                                        </div>
                                        <p className="text-slate-500 italic leading-tight mt-2">
                                            "{skill.desc}"
                                        </p>
                                    </div>
                                </div>
                            </PlasticCard>
                        ))}
                    </div>
                </div>

                {/* SECTION 2: ACCESSORY PACKS */}
                <div className="px-4">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-10">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-lg border-2 border-white">⚡</div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-700 uppercase tracking-tight">
                            Expansion Packs <span className="text-slate-400 text-sm md:text-lg font-bold ml-2">(Tools & Libs)</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {tools.map((tool, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: i * 0.05, type: "spring", stiffness: 150 }}
                                className="group cursor-pointer perspective-500"
                            >
                                <div className={`
                                    relative 
                                    bg-gradient-to-b from-slate-100 to-slate-200
                                    rounded-xl p-1
                                    shadow-[0_8px_0_#cbd5e1,0_15px_20px_rgba(0,0,0,0.15)]
                                    border-2 border-white
                                    group-hover:-translate-y-2 group-hover:shadow-[0_15px_0_#cbd5e1,0_25px_30px_rgba(0,0,0,0.2)]
                                    transition-all duration-300 ease-out
                                `}>
                                    {/* Cartridge Grip Texture (Top) */}
                                    <div className="absolute top-0 left-0 right-0 h-6 bg-slate-200 rounded-t-lg mx-4 flex gap-1 justify-center items-end pb-1 opacity-50">
                                        {[...Array(6)].map((_, j) => (
                                            <div key={j} className="w-1 h-3 bg-slate-300 rounded-full"></div>
                                        ))}
                                    </div>

                                    {/* The Sticker Label */}
                                    <div className={`
                                        mt-6 mx-1 mb-1
                                        bg-gradient-to-br from-white to-slate-50
                                        rounded-lg p-3
                                        border border-${tool.color}-200
                                        shadow-inner
                                        relative overflow-hidden
                                        h-28 flex flex-col justify-between
                                    `}>
                                        {/* Label Gloss */}
                                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-white/80 to-transparent transform rotate-45 pointer-events-none"></div>

                                        {/* Top Badge */}
                                        <div className="flex justify-between items-center">
                                            <span className={`text-[9px] font-black uppercase tracking-widest text-white bg-${tool.color}-500 px-2 py-0.5 rounded shadow-sm`}>
                                                DLC
                                            </span>
                                            <div className={`w-2 h-2 rounded-full bg-${tool.color}-400 animate-pulse`}></div>
                                        </div>

                                        {/* Tool Name */}
                                        <div className="text-center z-10 relative">
                                            <h3 className={`text-xl font-black text-slate-800 tracking-tight group-hover:scale-110 transition-transform`}>
                                                {tool.name}
                                            </h3>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mt-1">
                                                {tool.category} Pack
                                            </span>
                                        </div>

                                        {/* Graphic Bottom */}
                                        <div className={`h-1.5 w-full bg-${tool.color}-400 rounded-full mt-2 opacity-50`}></div>
                                    </div>

                                    {/* Plastic Overlay Reflection */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/20 to-transparent pointer-events-none sticky-gloss"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </MainLayout>
    );
};

export default Feature;
