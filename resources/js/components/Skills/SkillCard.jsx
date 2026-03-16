import React from 'react';
import { motion } from 'framer-motion';

const SkillCard = ({ skill, index }) => {
    const { Icon } = skill;

    return (
        <div className={`group relative min-h-[28rem] ${skill.offsetClassName}`}>
            <motion.article
                initial={{ opacity: 0, y: 44, scale: 0.94 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                    duration: 0.7,
                    delay: index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{
                    y: -10,
                    scale: 1.015,
                    transition: {
                        duration: 0.18,
                        ease: 'easeOut',
                    },
                }}
                className="relative min-h-[29rem]"
            >
                <div className={`absolute inset-0 rounded-[2rem] bg-white/[0.05] backdrop-blur-xl ${skill.glowClassName}`} />
                <div className="absolute inset-px rounded-[2rem] border border-white/14 bg-[linear-gradient(180deg,rgba(18,25,48,0.9),rgba(11,17,36,0.92))]" />
                <div className={`absolute left-6 right-6 top-5 h-28 rounded-full bg-gradient-to-b ${skill.panelClassName} blur-3xl opacity-80`} />
                <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.02)_26%,rgba(255,255,255,0.03)_100%)]" />
                <div className="absolute right-7 top-[4.5rem] h-24 w-24 rounded-full border border-white/10 opacity-80" />
                <div className="absolute right-11 top-[5.5rem] h-16 w-16 rounded-full border border-white/6 opacity-60" />
                <div className="absolute inset-x-7 bottom-20 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] px-7 pb-7 pt-7">
                    <div className="relative z-10 flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-[1.55rem] border border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06)_34%,rgba(15,23,42,0.3)_100%)] shadow-[0_18px_35px_rgba(15,23,42,0.28)]">
                        <div className="absolute inset-[1px] rounded-[1.45rem] bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.92),rgba(255,255,255,0.16)_35%,rgba(15,23,42,0)_72%)]" />
                        <Icon className="relative h-9 w-9 text-slate-950/88" strokeWidth={2.2} />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="rounded-full border border-white/14 bg-slate-950/72 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-white/88">
                            {skill.badge}
                        </span>
                        <span className="text-[0.68rem] uppercase tracking-[0.32em] text-sky-100/38">
                            Featured Skill
                        </span>
                    </div>

                    <div className="relative mt-7">
                        <h3 className="text-[2.65rem] font-semibold tracking-[-0.06em] text-white">
                            {skill.name}
                        </h3>
                        <div className="mt-4 h-px w-16 bg-gradient-to-r from-sky-300/70 to-transparent" />
                    </div>

                    <p className="relative mt-6 max-w-[22ch] text-[1.04rem] leading-8 text-slate-200/82">
                        {skill.description}
                    </p>

                    <div className="relative mt-auto pt-10">
                        <div className="flex items-center justify-between gap-4 text-sm">
                            <div className="flex flex-col gap-1">
                                <span className="text-[0.62rem] uppercase tracking-[0.3em] text-sky-100/36">
                                    Mode
                                </span>
                                <span className="text-sm font-medium text-slate-300/78">Immersive UI stack</span>
                            </div>
                            <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.28em] text-sky-100/80">
                                Live
                            </span>
                        </div>
                    </div>
                </div>
            </motion.article>
        </div>
    );
};

export default SkillCard;
