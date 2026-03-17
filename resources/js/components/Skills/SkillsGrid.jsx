import React from 'react';
import { motion } from 'framer-motion';

import SkillCard from './SkillCard';

const SkillsGrid = ({ skills }) => {
    return (
        <section
            id="featured-skills"
            data-scroll-section
            className="relative px-5 pb-28 pt-4 sm:px-8 lg:px-10"
        >
            <div
                className="absolute left-[6%] top-12 hidden h-24 w-24 rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.75),rgba(255,255,255,0.08)_32%,rgba(37,99,235,0.22)_100%)] md:block"
            />
            <div
                className="absolute bottom-12 right-[8%] hidden h-40 w-40 rounded-full border border-white/10 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.78),rgba(255,255,255,0.1)_28%,rgba(168,85,247,0.26)_100%)] blur-[1px] md:block"
            />

            <div className="relative z-10 mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.45 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="mx-auto mb-14 max-w-2xl text-center"
                >
                    <p className="text-xs uppercase tracking-[0.4em] text-sky-100/60">Featured Stack</p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
                        Floating capability cards crafted for a cinematic portfolio feel.
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
                    {skills.map((skill, index) => (
                        <SkillCard
                            key={skill.name}
                            skill={skill}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SkillsGrid;
