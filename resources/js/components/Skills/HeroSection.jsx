import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';

const floatingPlanets = [
    {
        className: 'left-[-8rem] top-24 h-56 w-56 md:left-[-4rem] md:top-28 md:h-72 md:w-72',
        glowClassName: 'from-orange-300/80 via-rose-400/65 to-fuchsia-500/40',
        speed: '-1.8',
    },
    {
        className: 'right-[-7rem] top-28 h-64 w-64 md:right-[-2rem] md:top-20 md:h-80 md:w-80',
        glowClassName: 'from-indigo-200/80 via-blue-400/55 to-violet-500/30',
        speed: '2.1',
    },
    {
        className: 'left-[9%] top-[58%] hidden h-20 w-20 md:block',
        glowClassName: 'from-pink-200/80 via-fuchsia-400/55 to-violet-500/20',
        speed: '1.4',
    },
    {
        className: 'right-[14%] top-[24%] hidden h-10 w-10 md:block',
        glowClassName: 'from-cyan-100/80 via-sky-300/55 to-blue-500/15',
        speed: '-1.1',
    },
];

const constellationDots = [
    'left-[18%] top-[28%]',
    'left-[27%] top-[61%]',
    'left-[39%] top-[20%]',
    'right-[28%] top-[33%]',
    'right-[22%] top-[58%]',
    'right-[36%] top-[70%]',
];

const focusItems = [
    { label: 'Primary Stack', value: 'HTML / CSS / JS / React' },
    { label: 'Motion Feel', value: 'Smooth, atmospheric, premium' },
    { label: 'Design Tone', value: 'Cinematic cosmic interface' },
];

const HeroSection = () => {
    return (
        <section
            data-scroll-section
            className="relative flex min-h-[88svh] items-center justify-center overflow-hidden px-5 pb-14 pt-28 sm:px-8 lg:px-10"
        >
            <div className="absolute inset-0 pointer-events-none">
                {floatingPlanets.map((planet) => (
                    <div
                        key={planet.className}
                        className={`absolute ${planet.className}`}
                    >
                        <motion.div
                            animate={{
                                y: [0, -16, 0],
                                rotate: [0, 4, 0],
                            }}
                            transition={{
                                duration: 9,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="relative h-full w-full rounded-full border border-white/10"
                        >
                            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.85),rgba(255,255,255,0.08)_28%,rgba(15,23,42,0)_55%)]" />
                            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${planet.glowClassName}`} />
                            <div className="absolute inset-[10%] rounded-full border border-white/10 bg-slate-950/25" />
                        </motion.div>
                    </div>
                ))}

                <div
                    className="absolute left-1/2 top-[18%] h-56 w-56 -translate-x-1/2 rounded-full bg-sky-400/25 blur-[120px]"
                />
                <div
                    className="absolute left-1/2 top-[32%] h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-[160px]"
                />
                <div className="absolute left-1/2 top-[18%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full border border-white/6 opacity-40" />
                <div className="absolute left-1/2 top-[24%] h-[24rem] w-[24rem] -translate-x-1/2 rounded-full border border-white/5 opacity-30" />
                <div className="absolute left-[13%] top-[46%] hidden h-px w-40 bg-gradient-to-r from-transparent via-white/20 to-transparent md:block" />
                <div className="absolute right-[14%] top-[54%] hidden h-px w-52 bg-gradient-to-r from-transparent via-white/20 to-transparent md:block" />
                <div className="absolute right-[23%] top-[42%] hidden h-16 w-16 rotate-[18deg] rounded-[1.6rem] border border-white/10 bg-white/[0.03] backdrop-blur-sm md:block" />
                <div className="absolute left-[21%] top-[67%] hidden h-10 w-10 rounded-full border border-sky-200/15 bg-sky-300/10 md:block" />
                <div className="absolute right-[31%] top-[30%] hidden h-4 w-24 rounded-full border-[5px] border-indigo-200/14 opacity-55 md:block" />

                {constellationDots.map((position, index) => (
                    <motion.span
                        key={position}
                        animate={{
                            opacity: [0.18, 0.9, 0.18],
                            scale: [0.9, 1.15, 0.95],
                        }}
                        transition={{
                            duration: 4 + index,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className={`absolute h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] ${position}`}
                    />
                ))}
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.35em] text-sky-100/80 backdrop-blur-xl"
                >
                    Tech Constellation
                    <ArrowDownRight className="h-3.5 w-3.5 text-sky-300" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                >
                    <div className="absolute inset-x-10 top-8 h-20 rounded-full bg-sky-300/20 blur-[70px]" />
                    <div className="absolute -bottom-10 left-1/2 h-28 w-[22rem] -translate-x-1/2 rounded-full bg-violet-500/20 blur-[100px]" />

                    <h1 className="relative text-6xl font-semibold tracking-[-0.06em] text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.22)] sm:text-7xl md:text-8xl lg:text-[7rem]">
                        Skills
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-6 max-w-3xl text-balance text-lg leading-8 text-slate-200/88 sm:text-xl md:mt-8 md:text-[1.55rem]"
                >
                    Here are the technologies and tools I specialize in.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-12 flex w-full max-w-3xl items-center justify-center"
                >
                    <div className="relative h-px w-full max-w-xl bg-gradient-to-r from-transparent via-white/25 to-transparent">
                        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-200/30 bg-sky-300 shadow-[0_0_25px_rgba(125,211,252,0.8)]" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3"
                >
                    {focusItems.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-[1.4rem] border border-white/10 bg-white/[0.035] px-5 py-4 text-left shadow-[0_14px_40px_rgba(8,15,40,0.22)] backdrop-blur-md"
                        >
                            <p className="text-[0.62rem] uppercase tracking-[0.35em] text-sky-100/45">
                                {item.label}
                            </p>
                            <p className="mt-3 text-sm font-medium leading-6 text-white/82">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
