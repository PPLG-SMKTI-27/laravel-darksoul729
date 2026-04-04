import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { navigateWithCleanup } from '../lib/pageTransitionCleanup';

const Animated3DTitle = ({ text }) => {
    const palette3D = [
        { front: '#ff5a6e', drop: '#d33b4e' }, // Pink
        { front: '#ff9c3a', drop: '#d17215' }, // Orange
        { front: '#ffdb4b', drop: '#cca816' }, // Yellow
        { front: '#5dd462', drop: '#34a83b' }, // Green
        { front: '#5ea3ff', drop: '#2e75d6' }, // Blue
        { front: '#b77aff', drop: '#8f46e4' }, // Purple
        { front: '#ff66c4', drop: '#d03893' }, // Magenta
    ];

    const generate3DShadow = (dropColor) => `
        0 1px 0 ${dropColor},
        0 2px 0 ${dropColor},
        0 3px 0 ${dropColor},
        0 4px 0 ${dropColor},
        0 5px 0 ${dropColor},
        0 6px 0 ${dropColor},
        0 7px 0 ${dropColor},
        0 8px 0 ${dropColor},
        0 15px 15px rgba(0,0,0,0.2)
    `;

    const words = text.split(' ');
    let globalIndex = 0;

    return (
        <h2 className="flex flex-wrap gap-4 md:gap-7 items-center justify-center md:justify-start">
            {words.map((word, wIdx) => (
                <div key={wIdx} className="flex pb-4">
                    {word.split('').map((char, cIdx) => {
                        const idx = globalIndex++;
                        const colorSet = palette3D[idx % palette3D.length];
                        
                        return (
                            <motion.span
                                key={idx}
                                className="block text-5xl md:text-6xl lg:text-[4.5rem] font-black uppercase"
                                style={{
                                    color: colorSet.front,
                                    textShadow: generate3DShadow(colorSet.drop),
                                    marginLeft: char === 'I' ? '0.2rem' : '0.1rem',
                                    marginRight: char === 'I' ? '0.2rem' : '0.1rem'
                                }}
                                animate={{ y: [0, -12, 0] }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: idx * 0.1,
                                }}
                            >
                                {char}
                            </motion.span>
                        );
                    })}
                </div>
            ))}
        </h2>
    );
};

const BlockLetters = ({ text }) => {
    // Colors matching the tactile colorful letters in the user's reference
    const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6']; 
    const words = text.split(' ');
    
    return (
        <div className="flex flex-col gap-2 mb-4">
            {words.map((word, wordIdx) => (
                <div key={wordIdx} className="flex flex-wrap items-center">
                    {word.split('').map((char, i) => (
                        <span 
                            key={i} 
                            className="text-[2rem] leading-none md:text-[2.5rem] font-black uppercase tracking-wide"
                            style={{ 
                                color: colors[i % colors.length], 
                                textShadow: `
                                    0 1px 0 #ffffff, 
                                    0 2px 0 #cbd5e1, 
                                    0 3px 0 #94a3b8, 
                                    0 4px 5px rgba(0,0,0,0.3),
                                    0 10px 15px rgba(0,0,0,0.1)
                                `,
                                marginRight: '1px',
                            }}
                        >
                            {char}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default function FeaturedProjects({ repos = [] }) {
    const prefersReducedMotion = useReducedMotion();
    const [activeIndex, setActiveIndex] = useState(0);

    const projects = useMemo(() => {
        const data = repos && repos.length > 0
            ? repos.slice(0, 3)
            : [
                { title: 'Cyber Interface', description: 'Advanced interface for tactical datastreams with high-fidelity visual feedback.', tech: 'React & WebGL' },
                { title: 'Neural Core', description: 'Deep learning visualization dashboard powered by quantum logic engines.', tech: 'Python & Vue' },
                { title: 'Dark Soul', description: 'Decentralized vault systems with sub-millisecond market telemetry.', tech: 'Solidity & NextJS' },
            ];

        // Cable color palettes matching the colorful cables
        const palettes = [
            { cableColor: '#ef4444', glow: 'from-red-500/20 to-transparent' }, // Red
            { cableColor: '#facc15', glow: 'from-yellow-500/20 to-transparent' }, // Yellow
            { cableColor: '#22c55e', glow: 'from-green-500/20 to-transparent' }, // Green
        ];

        const defaultImages = [
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80', // Cyber security
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', // Hardware
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80', // Code matrix
        ];

        return data.map((repo, index) => {
            const palette = palettes[index % palettes.length];
            const rawTitle = (repo?.title ?? repo?.name ?? '').toString().trim();
            const rawImageUrl = repo?.image_url 
                ? (repo.image_url.startsWith('http') ? repo.image_url : `/storage/${repo.image_url}`)
                : defaultImages[index % defaultImages.length];

            return {
                title: rawTitle.length > 0 ? rawTitle : `Project ${index + 1}`,
                description: repo?.description,
                cableColor: palette.cableColor,
                glow: palette.glow,
                tech: repo?.tech || 'Web Technologies',
                link: repo?.link,
                image: rawImageUrl,
            };
        });
    }, [repos]);

    return (
        <section className="relative z-10 w-full overflow-visible py-16 mb-20 px-4 md:px-8">
            <div className="mx-auto max-w-[1400px]">
                
                {/* Header Title - 3D Hovering Letters */}
                <div className="mb-6 md:mb-10 flex justify-center md:justify-start md:ml-6 mt-4 md:mt-0">
                    <Animated3DTitle text="FEATURED PROJECTS" />
                </div>

                {/* THE MASSIVE ANALOGUE HARDWARE CONSOLE */}
                <div className="relative w-full rounded-[2.5rem] border-[4px] border-[#eef2f8] bg-[#c3cad5] p-5 shadow-[inset_0_4px_0_rgba(255,255,255,0.95),inset_0_-8px_16px_rgba(100,116,139,0.3),0_20px_40px_rgba(15,23,42,0.15)] flex flex-col xl:flex-row gap-6 md:gap-8 overflow-visible">
                    
                    {/* LEFT: Massive Inset Output Monitor */}
                    <div className="relative flex-1 min-h-[450px] xl:min-h-[550px] rounded-[2rem] border-[4px] border-[#334155] bg-[linear-gradient(180deg,#20242b_0%,#16191f_50%,#0e1014_100%)] p-4 shadow-[inset_0_12px_24px_rgba(255,255,255,0.06),inset_0_-12px_24px_rgba(0,0,0,0.6)]">
                         
                         {/* Power LED */}
                         <div className="absolute top-5 left-5 h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444]" />

                         {/* Console Vents */}
                         <div className="absolute left-4 top-[50%] flex flex-col gap-2 -mt-6">
                             <div className="h-6 w-2 rounded-r bg-slate-900 shadow-inner" />
                             <div className="h-6 w-2 rounded-r bg-slate-900 shadow-inner" />
                             <div className="h-6 w-2 rounded-r bg-slate-900 shadow-inner" />
                         </div>

                         {/* The Glass Screen */}
                         <div className="relative ml-6 mt-6 h-[calc(100%-1.5rem)] md:h-[calc(100%-2rem)] w-[calc(100%-1.5rem)] md:w-[calc(100%-2rem)] overflow-hidden rounded-xl border-2 border-slate-900/80 bg-[#0d1117] shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
                              
                              {/* Scanlines overlay */}
                              <div className="pointer-events-none absolute inset-0 z-20 opacity-20" style={{ background: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '100% 4px' }} />
                              <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08)_0%,transparent_60%)]" />

                              <AnimatePresence mode="wait">
                                  <motion.div
                                      key={activeIndex}
                                      initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }}
                                      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                                      exit={{ opacity: 0, filter: 'blur(8px)', scale: 1.05 }}
                                      transition={{ duration: 0.3 }}
                                      className="relative z-10 flex h-full w-full flex-col justify-end p-8 md:p-14 group"
                                  >
                                      {/* Full Screen Background Image */}
                                      {projects[activeIndex].image && (
                                          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden rounded-lg">
                                              <img 
                                                  src={projects[activeIndex].image} 
                                                  alt={projects[activeIndex].title}
                                                  className="w-full h-full object-cover opacity-60 saturate-[0.8] group-hover:opacity-100 group-hover:saturate-100 transition-all duration-700 ease-out"
                                              />
                                              {/* Dark overlays to ensure text remains highly readable */}
                                              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/70 to-transparent z-10 transition-all duration-500 opacity-90 group-hover:opacity-80" />
                                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all duration-500 z-10" />

                                              {/* Animated Scanline over the full image */}
                                              <motion.div 
                                                  animate={{ top: ['-10%', '110%'] }}
                                                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                                  className="absolute left-0 w-full h-[2px] bg-[#4ade80]/30 shadow-[0_0_10px_#4ade80] z-20 pointer-events-none"
                                              />
                                          </div>
                                      )}

                                      {/* Project Glow */}
                                      <div className={`absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-bl ${projects[activeIndex].glow} blur-3xl opacity-40 rounded-full z-0 pointer-events-none`} />
                                      
                                      <div className="relative z-20 flex flex-col justify-end h-full w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                          <div className="mb-4 inline-flex flex-col gap-1 items-start">
                                              <span className="font-mono text-[10px] text-slate-300 uppercase tracking-widest drop-shadow-md">
                                                  [SYSTEM.OK] // MODULE_DATA_STREAM
                                              </span>
                                              <div className="inline-block rounded border border-[#4ade80]/40 bg-black/50 backdrop-blur-md px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#4ade80] shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                                                  {projects[activeIndex].tech}
                                              </div>
                                          </div>

                                          <h3 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-white tracking-tighter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" style={{ textShadow: `0 2px 4px rgba(0,0,0,0.8), 0 0 40px ${projects[activeIndex].cableColor}70` }}>
                                              {projects[activeIndex].title}
                                          </h3>
                                          
                                          <p className="mt-4 md:mt-6 font-mono text-base md:text-lg leading-relaxed text-slate-200 max-w-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                                              &gt; {projects[activeIndex].description || "NO DATA GIVEN. RUNNING DEFAULT SEQUENCE."}
                                          </p>

                                          <div className="mt-8 md:mt-10">
                                              <button 
                                                  onClick={() => navigateWithCleanup(projects[activeIndex].link || '/projects')}
                                                  className="group/btn flex items-center gap-3 font-mono text-lg md:text-xl font-bold uppercase tracking-widest text-white transition-all hover:text-[#4ade80] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                                              >
                                                  <span className="h-1 w-8 bg-white transition-all group-hover/btn:w-12 group-hover/btn:bg-[#4ade80]" />
                                                  Execute Output
                                              </button>
                                          </div>
                                      </div>

                                      {/* Status Indicators at the top right */}
                                      <div className="absolute top-6 right-6 z-20 flex gap-4 opacity-80 backdrop-blur-md bg-black/30 px-3 py-1.5 rounded border border-white/10 hidden md:flex">
                                          <span className="font-mono text-[10px] text-[#4ade80] tracking-widest uppercase flex items-center gap-1.5 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                                              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse shadow-[0_0_8px_#4ade80]" />
                                              IMG_STREAM_ACTIVE
                                          </span>
                                          <span className="font-mono text-[10px] text-slate-300 tracking-widest uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                                              V.0{activeIndex + 1}
                                          </span>
                                      </div>
                                  </motion.div>
                              </AnimatePresence>

                              {/* Persistent NO SIGNAL shadow text hidden closely behind */}
                              <div className="absolute inset-0 z-0 flex items-center justify-center opacity-5 pointer-events-none">
                                  <h1 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-[0.2em] text-white">NO SIGNAL</h1>
                              </div>
                         </div>
                    </div>

                    {/* RIGHT: Embossed Input Cartridges */}
                    <div className="relative flex w-full flex-col gap-5 xl:w-[420px] shrink-0 justify-center">
                        {projects.map((project, i) => {
                            const isActive = activeIndex === i;
                            return (
                                <div key={i} className="relative flex w-full items-center">
                                    
                                    {/* The Right Thick Cable Snaking Out! */}
                                    <div className="hidden xl:block absolute right-[-60px] top-1/2 -mt-4 h-8 w-[80px]" style={{ zIndex: 0 }}>
                                        <div 
                                            className="h-full w-full rounded-r-full border-y border-r border-black/20"
                                            style={{
                                                backgroundColor: project.cableColor,
                                                boxShadow: `inset 0 4px 6px rgba(255,255,255,0.6), inset 0 -4px 6px rgba(0,0,0,0.3), 0 10px 15px rgba(0,0,0,0.2)`,
                                                transform: isActive ? 'scaleX(1.3) skewY(5deg)' : 'scaleX(0.8)',
                                                transformOrigin: 'left center',
                                                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                            }}
                                        />
                                    </div>

                                    {/* The Embossed White Module Box */}
                                    <motion.button
                                        onClick={() => setActiveIndex(i)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group relative z-10 w-full overflow-hidden rounded-[1.8rem] border-[3px] border-white/90 p-6 md:p-8 transition-colors text-left"
                                        style={{
                                            background: isActive ? 'linear-gradient(160deg, #ffffff 0%, #f4f7fb 100%)' : 'linear-gradient(160deg, #f1f4f9 0%, #e2e8f0 100%)',
                                            boxShadow: isActive 
                                                ? 'inset 0 4px 0 rgba(255,255,255,1), inset 0 -6px 12px rgba(100,116,139,0.1), 0 15px 30px rgba(15,23,42,0.1)'
                                                : 'inset 0 4px 0 rgba(255,255,255,0.7), inset 0 -4px 8px rgba(100,116,139,0.1), 0 8px 16px rgba(15,23,42,0.05)',
                                        }}
                                    >
                                        <div className="mb-4 flex items-center gap-3 border-b border-slate-200 pb-3">
                                            {/* Status LED */}
                                            <div 
                                                className="h-4 w-4 rounded-full border border-white/50"
                                                style={{
                                                    backgroundColor: isActive ? project.cableColor : '#94a3b8',
                                                    boxShadow: isActive ? `0 0 16px ${project.cableColor}, inset 0 2px 4px rgba(255,255,255,0.6)` : 'inset 0 2px 4px rgba(0,0,0,0.2)'
                                                }}
                                            />
                                            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                                PORT 0{i + 1} // {isActive ? 'ACTIVE_SYNC' : 'IDLE'}
                                            </span>
                                        </div>

                                        {/* Multicolored 3D Typography exactly like reference */}
                                        <div className="my-6">
                                            <BlockLetters text={project.title} />
                                        </div>

                                        <div className="mt-8 flex items-center justify-between">
                                            <div className="h-2 flex-1 max-w-[120px] rounded-full bg-slate-200 shadow-inner overflow-hidden">
                                                <div 
                                                    className="h-full w-full rounded-full transition-transform duration-700 ease-out"
                                                    style={{ 
                                                        backgroundColor: project.cableColor,
                                                        transform: isActive ? 'translateX(0%)' : 'translateX(-100%)'
                                                    }}
                                                />
                                            </div>
                                            <div className="flex gap-1.5 opacity-40">
                                                <div className="h-1 w-4 rounded-full bg-slate-500" />
                                                <div className="h-1 w-4 rounded-full bg-slate-500" />
                                            </div>
                                        </div>
                                    </motion.button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer Button below console */}
                <div className="mt-10 flex justify-end">
                    <button 
                        onClick={() => navigateWithCleanup('/projects')}
                        className="inline-flex items-center gap-2 rounded-full border-[3px] border-white bg-[#cbd3df] px-8 py-3 text-sm font-black uppercase tracking-widest text-slate-700 shadow-[inset_0_2px_0_rgba(255,255,255,0.8),0_6px_10px_rgba(0,0,0,0.1)] hover:bg-white hover:-translate-y-1 transition-all"
                    >
                        See Collection
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" className="ml-2">
                            <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
