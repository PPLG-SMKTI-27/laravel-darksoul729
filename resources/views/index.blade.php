@extends('layouts.app')

@section('content')

    <main>
        
        <section id="hero" class="relative min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden pt-20" data-scroll-section>
            
            <div class="absolute inset-0 pointer-events-none z-0 select-none">
                <div class="parallax-layer absolute top-[15%] left-[-5%] font-graffiti text-[15vw] opacity-[0.04] text-white whitespace-nowrap" data-speed="0.1">DESTROY</div>
                <div class="parallax-layer absolute bottom-[15%] right-[-5%] font-graffiti text-[15vw] opacity-[0.04] text-white whitespace-nowrap" data-speed="-0.1">CREATE</div>
                <div class="parallax-layer absolute top-1/2 left-1/2 font-display text-[25vw] opacity-[0.02] -translate-x-1/2 -translate-y-1/2 font-bold" data-speed="0.05">VANDAL</div>
            </div>

            <div class="z-10 relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
                
                <div id="hero-logo" class="logo-wrapper mb-8 md:mb-12 scale-0">
                    <img src="{{ asset('img/logo.png') }}" alt="Hero Logo" class="w-full h-full object-contain">
                </div>

                <div class="text-center mix-blend-difference">
                    <div class="overflow-hidden">
                        <h2 class="hero-reveal text-xs md:text-xl font-mono uppercase tracking-[0.3em] md:tracking-[0.5em] text-gray-400 mb-4 inline-block border border-gray-700 px-4 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                            Kevin Hermansyah
                        </h2>
                    </div>
                    
                    <h1 class="hero-title clamp-xl font-display font-bold uppercase leading-[0.85] tracking-tight mt-4">
                        <div class="overflow-hidden">
                            <span class="hero-reveal inline-block">Digital</span> 
                            <span class="hero-reveal inline-block font-graffiti text-white relative text-shadow-glow">
                                VANDAL
                                <span class="drip-line" style="left: 20%; animation-delay: 0.2s;"></span>
                                <span class="drip-line" style="left: 50%; animation-delay: 1.5s;"></span>
                                <span class="drip-line" style="left: 80%; animation-delay: 0.8s;"></span>
                            </span>
                        </div>
                        <div class="overflow-hidden mt-2 md:mt-4">
                            <span class="hero-reveal inline-block text-stroke-white text-transparent hover:text-white transition duration-500">Architect</span>
                            <span class="hero-reveal inline-block text-gray-500 text-6xl align-middle font-graffiti">&</span>
                            <span class="hero-reveal inline-block hover:text-stroke-white transition duration-500">Creator</span>
                        </div>
                    </h1>
                </div>

                <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 mix-blend-difference opacity-0 hero-fade-in">
                    <span class="text-[10px] font-mono uppercase tracking-widest animate-pulse">Infiltrate</span>
                    <div class="w-[1px] h-16 bg-white/20 overflow-hidden">
                        <div class="w-full h-full bg-white animate-drip"></div>
                    </div>
                </div>
            </div>
        </section>

        <div class="marquee-container" data-scroll data-scroll-speed="2">
            <div class="marquee-track">
                <div class="marquee-content flex gap-12 text-6xl md:text-9xl font-graffiti tracking-tighter items-center liquid-text text-black">
                    <span>PANZEKK</span><span class="text-3xl font-mono opacity-50">///</span>
                    <span>BREAK_THE_LOOP</span><span class="text-3xl font-mono opacity-50">///</span>
                    <span>FULL_STACK</span><span class="text-3xl font-mono opacity-50">///</span>
                    <span>CREATIVE_DEV</span><span class="text-3xl font-mono opacity-50">///</span>
                    <span>NO_SLEEP</span><span class="text-3xl font-mono opacity-50">///</span>
                    <span>PANZEKK</span><span class="text-3xl font-mono opacity-50">///</span>
                    <span>BREAK_THE_LOOP</span><span class="text-3xl font-mono opacity-50">///</span>
                </div>
                <div class="marquee-content flex gap-12 text-6xl md:text-9xl font-graffiti tracking-tighter items-center liquid-text text-black ml-12">
                    <span>PANZEKK</span><span class="text-3xl font-mono opacity-50">///</span>
                    <span>BREAK_THE_LOOP</span><span class="text-3xl font-mono opacity-50">///</span>
                    <span>FULL_STACK</span><span class="text-3xl font-mono opacity-50">///</span>
                    <span>CREATIVE_DEV</span><span class="text-3xl font-mono opacity-50">///</span>
                    <span>NO_SLEEP</span><span class="text-3xl font-mono opacity-50">///</span>
                    <span>PANZEKK</span><span class="text-3xl font-mono opacity-50">///</span>
                    <span>BREAK_THE_LOOP</span><span class="text-3xl font-mono opacity-50">///</span>
                </div>
            </div>
            <div class="absolute inset-0 w-full h-full pointer-events-none opacity-30 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]"></div>
        </div>

        <section id="manifesto" class="py-24 md:py-40 px-4 md:px-6 relative z-10" data-scroll-section>
            <div class="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] opacity-20 -z-10"></div>
            <!-- Vertical Line - Hidden on mobile, visible on MD -->
            <div class="absolute left-4 md:left-10 top-20 w-[1px] h-full bg-white/10 hidden md:block"></div>

            <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-start">
                
                <!-- Left Column: Sticky Title -->
                <div class="md:col-span-5 md:sticky md:top-32 relative">
                    <h2 class="text-5xl sm:text-7xl md:text-9xl font-display font-bold leading-[0.9] mb-8 text-white break-words">
                        THE<br>
                        <span class="text-transparent text-stroke-white">CODE</span><br>
                        <span class="font-graffiti text-white liquid-text text-shadow-glow">ETHOS</span>
                    </h2>
                    <div class="w-16 md:w-24 h-2 bg-white mb-8"></div>
                    <div class="font-mono text-[10px] md:text-xs uppercase tracking-widest text-gray-500 border-l-2 border-gray-800 pl-4">
                        <p class="mb-2">// Identity: Kevin Hermansyah</p>
                        <p class="mb-2">// Alias: Panzekk</p>
                        <p class="mb-2">// Loc: Banjarmasin, ID</p>
                        <p>// Status: <span class="text-green-500 animate-pulse">Connected</span></p>
                    </div>
                </div>

                <!-- Right Column: Manifesto Points -->
                <div class="md:col-span-7 space-y-12 md:space-y-24 md:pt-10">
                    <div class="manifesto-block hoverable group relative pl-6 border-l border-gray-800 md:border-none md:pl-0">
                        <!-- Mobile number decoration -->
                        <span class="absolute left-0 top-0 -translate-x-[50%] bg-black text-gray-600 font-mono text-xs px-1 md:hidden">01</span>
                        
                        <span class="hidden md:block font-graffiti text-4xl text-gray-600 mb-4 group-hover:text-white transition transform group-hover:-translate-y-2 duration-300">01.</span>
                        <p class="text-lg md:text-4xl leading-relaxed md:leading-tight font-light text-gray-300 split-text-reveal">
                            I don't just write code; I <strong class="text-white font-graffiti font-normal text-2xl md:text-5xl mx-1 md:mx-2">BOMB</strong> the digital landscape. I specialize in turning boring, static interfaces into chaotic, immersive experiences.
                        </p>
                    </div>

                    <div class="manifesto-block hoverable group relative pl-6 border-l border-gray-800 md:border-none md:pl-0">
                        <span class="absolute left-0 top-0 -translate-x-[50%] bg-black text-gray-600 font-mono text-xs px-1 md:hidden">02</span>

                        <span class="hidden md:block font-graffiti text-4xl text-gray-600 mb-4 group-hover:text-white transition transform group-hover:-translate-y-2 duration-300">02.</span>
                        <p class="text-lg md:text-4xl leading-relaxed md:leading-tight font-light text-gray-300 split-text-reveal">
                            My philosophy is simple: <span class="font-mono bg-white text-black px-2 inline-block -rotate-1">Design is anarchy</span> controlled by logic. Every pixel is a calculated riot.
                        </p>
                    </div>

                    <div class="manifesto-block hoverable group relative pl-6 border-l border-gray-800 md:border-none md:pl-0">
                        <span class="absolute left-0 top-0 -translate-x-[50%] bg-black text-gray-600 font-mono text-xs px-1 md:hidden">03</span>

                        <span class="hidden md:block font-graffiti text-4xl text-gray-600 mb-4 group-hover:text-white transition transform group-hover:-translate-y-2 duration-300">03.</span>
                        <p class="text-lg md:text-4xl leading-relaxed md:leading-tight font-light text-gray-300 split-text-reveal">
                            Currently available for select freelance commissions or full-time roles that dare to break the rules. If you want safe, go elsewhere.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section id="stack" class="py-24 bg-[#050505] border-t border-gray-900 relative overflow-hidden" data-scroll-section>
            
            <div class="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                <svg width="200" height="200" viewBox="0 0 100 100" class="animate-[spin_10s_linear_infinite]">
                    <path d="M50 0 L100 50 L50 100 L0 50 Z" stroke="white" stroke-width="1" fill="none"/>
                    <circle cx="50" cy="50" r="30" stroke="white" stroke-width="1" fill="none"/>
                </svg>
            </div>

            <div class="max-w-7xl mx-auto px-6 relative z-10">
                 <div class="flex items-center gap-4 mb-16">
                     <span class="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                     <h3 class="font-mono text-sm text-gray-500 uppercase tracking-[0.2em]">// Weapons of Choice</h3>
                 </div>
                 
                 <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    
                    <div class="group/category">
                        <h4 class="font-graffiti text-3xl text-white mb-8 border-l-4 border-white pl-4 group-hover/category:text-stroke-white group-hover/category:text-transparent transition-all duration-300">
                            FRONTEND
                        </h4>
                        <div class="space-y-4">
                            <div class="flex items-center gap-4 p-3 border border-gray-800 bg-gray-900/50 hover:border-white hover:bg-white hover:text-black transition-all duration-300 cursor-none group/item">
                                <div class="w-10 h-10 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-8 h-8 group-hover/item:animate-[spin_4s_linear_infinite]">
                                        <circle cx="12" cy="12" r="2"/>
                                        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)"/>
                                        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/>
                                        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>
                                    </svg>
                                </div>
                                <span class="font-mono text-sm uppercase tracking-widest">React / Next.js</span>
                            </div>
                            <div class="flex items-center gap-4 p-3 border border-gray-800 bg-gray-900/50 hover:border-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-300 cursor-none group/item">
                                <div class="w-10 h-10 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-8 h-8">
                                        <path d="M3.5 12C3.5 12 5 7 9.5 7C14 7 12 12 12 12C12 12 13.5 17 18 17C22.5 17 20.5 12 20.5 12"/>
                                        <path d="M2.5 16C2.5 16 4 11 8.5 11C13 11 11 16 11 16C11 16 12.5 21 17 21C21.5 21 19.5 16 19.5 16"/>
                                    </svg>
                                </div>
                                <span class="font-mono text-sm uppercase tracking-widest">Tailwind CSS</span>
                            </div>
                            <div class="flex items-center gap-4 p-3 border border-gray-800 bg-gray-900/50 hover:border-purple-500 hover:bg-purple-500 hover:text-white transition-all duration-300 cursor-none group/item">
                                <div class="w-10 h-10 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-8 h-8 group-hover/item:scale-110 transition">
                                        <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                                        <path d="M2 17L12 22L22 17"/>
                                        <path d="M2 7V17"/>
                                        <path d="M22 7V17"/>
                                        <path d="M12 12V22"/>
                                    </svg>
                                </div>
                                <span class="font-mono text-sm uppercase tracking-widest">Three.js / WebGL</span>
                            </div>
                        </div>
                    </div>

                    <div class="group/category">
                        <h4 class="font-graffiti text-3xl text-white mb-8 border-l-4 border-white pl-4 group-hover/category:text-stroke-white group-hover/category:text-transparent transition-all duration-300">
                            BACKEND
                        </h4>
                        <div class="space-y-4">
                            <div class="flex items-center gap-4 p-3 border border-gray-800 bg-gray-900/50 hover:border-green-500 hover:bg-green-500 hover:text-black transition-all duration-300 cursor-none group/item">
                                <div class="w-10 h-10 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-8 h-8">
                                        <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z"/>
                                        <path d="M12 22V12"/>
                                        <path d="M20 7L12 12L4 7"/>
                                    </svg>
                                </div>
                                <span class="font-mono text-sm uppercase tracking-widest">Node.js</span>
                            </div>
                            <div class="flex items-center gap-4 p-3 border border-gray-800 bg-gray-900/50 hover:border-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 cursor-none group/item">
                                <div class="w-10 h-10 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-8 h-8">
                                        <path d="M12 2C6 2 6 5 6 5V8H14V11H5C2 11 2 14 2 14V17C2 20 5 20 5 20H9"/>
                                        <path d="M15 22C18 22 21 22 21 19V16H10V13H19C22 13 22 10 22 10V7C22 4 19 4 19 4H15"/>
                                        <path d="M9 5V5.01"/>
                                        <path d="M15 19V19.01"/>
                                    </svg>
                                </div>
                                <span class="font-mono text-sm uppercase tracking-widest">Python</span>
                            </div>
                            <div class="flex items-center gap-4 p-3 border border-gray-800 bg-gray-900/50 hover:border-white hover:bg-white hover:text-black transition-all duration-300 cursor-none group/item">
                                <div class="w-10 h-10 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-8 h-8">
                                        <ellipse cx="12" cy="5" rx="9" ry="3"/>
                                        <path d="M21 12C21 13.6569 16.9706 15 12 15C7.02944 15 3 13.6569 3 12"/>
                                        <path d="M3 5V19C3 20.6569 7.02944 22 12 22C16.9706 22 21 20.6569 21 19V5"/>
                                        <path d="M21 12V5"/>
                                        <path d="M3 12V5"/>
                                    </svg>
                                </div>
                                <span class="font-mono text-sm uppercase tracking-widest">PostgreSQL</span>
                            </div>
                        </div>
                    </div>

                    <div class="group/category">
                        <h4 class="font-graffiti text-3xl text-white mb-8 border-l-4 border-white pl-4 group-hover/category:text-stroke-white group-hover/category:text-transparent transition-all duration-300">
                            CREATIVE
                        </h4>
                        <div class="space-y-4">
                            <div class="flex items-center gap-4 p-3 border border-gray-800 bg-gray-900/50 hover:border-pink-500 hover:bg-pink-500 hover:text-white transition-all duration-300 cursor-none group/item">
                                <div class="w-10 h-10 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-8 h-8">
                                        <path d="M12 12H16C18.2091 12 20 10.2091 20 8C20 5.79086 18.2091 4 16 4H8C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12"/>
                                        <path d="M12 12H8C5.79086 12 4 13.7909 4 16C4 18.2091 5.79086 20 8 20C10.2091 20 12 18.2091 12 16V12Z"/>
                                        <circle cx="16" cy="16" r="4"/>
                                    </svg>
                                </div>
                                <span class="font-mono text-sm uppercase tracking-widest">Figma</span>
                            </div>
                            <div class="flex items-center gap-4 p-3 border border-gray-800 bg-gray-900/50 hover:border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-none group/item">
                                <div class="w-10 h-10 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-8 h-8">
                                        <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8Z"/>
                                        <path d="M17 7L21 3"/>
                                        <path d="M19.5 14.5C21 13 21.5 10 20.5 8.5C19.5 7 16.5 7 14.5 8"/>
                                        <path d="M4 12C4 7.58172 7.58172 4 12 4"/>
                                        <path d="M4 12C4 16.4183 7.58172 20 12 20"/>
                                    </svg>
                                </div>
                                <span class="font-mono text-sm uppercase tracking-widest">Blender</span>
                            </div>
                        </div>
                    </div>

                    <div class="group/category">
                        <h4 class="font-graffiti text-3xl text-white mb-8 border-l-4 border-white pl-4 group-hover/category:text-stroke-white group-hover/category:text-transparent transition-all duration-300">
                            CHAOS
                        </h4>
                        <div class="space-y-4">
                            <div class="flex items-center gap-4 p-3 border border-gray-800 bg-gray-900/50 hover:border-[#88ce02] hover:bg-[#88ce02] hover:text-black transition-all duration-300 cursor-none group/item">
                                <div class="w-10 h-10 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-8 h-8 group-hover/item:animate-bounce">
                                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/>
                                    </svg>
                                </div>
                                <span class="font-mono text-sm uppercase tracking-widest">GSAP / Lenis</span>
                            </div>
                            <div class="flex items-center gap-4 p-3 border border-gray-800 bg-gray-900/50 hover:border-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 cursor-none group/item">
                                <div class="w-10 h-10 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-8 h-8 liquid-text">
                                        <path d="M2 12C2 12 6 8 12 8C18 8 22 12 22 12"/>
                                        <path d="M2 12C2 12 6 16 12 16C18 16 22 12 22 12"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                </div>
                                <span class="font-mono text-sm uppercase tracking-widest">GLSL Shaders</span>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        </section>

        <section id="lab" class="py-32 px-4 md:px-6 border-t-2 border-white/20 bg-[#050505] relative" data-scroll-section>
            <div class="max-w-7xl mx-auto">
                
                <div class="flex flex-col md:flex-row justify-between items-end mb-24">
                    <div>
                        <div class="flex items-center gap-2 mb-2">
                            <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#00ff00]"></span>
                            <span class="font-mono text-xs text-green-500">API STATUS: ONLINE</span>
                        </div>
                        <h2 class="text-5xl md:text-8xl font-display font-bold leading-none">
                            THE <span class="font-graffiti text-white glitch" data-text="LAB">LAB</span>
                        </h2>
                    </div>
                    <div class="text-left md:text-right mt-8 md:mt-0">
                        <p class="font-mono text-sm text-gray-400">Fetching live repository data<br>from user: <span class="text-white border-b border-white">darksoul729</span></p>
                    </div>
                </div>

                <div id="projects-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 perspective-1000">
                    <div class="col-span-full h-64 flex items-center justify-center border border-dashed border-gray-700">
                        <span class="font-graffiti text-2xl animate-pulse">SEARCHING DATABASE...</span>
                    </div>
                </div>

                <div class="mt-24 text-center">
                    <a href="https://github.com/darksoul729?tab=repositories" target="_blank" class="group relative inline-block px-8 py-4 md:px-12 md:py-6 bg-transparent overflow-hidden border-2 border-white hoverable">
                        <span class="absolute inset-0 w-full h-full bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 mix-blend-difference"></span>
                        <span class="relative font-display font-bold text-lg md:text-xl uppercase tracking-widest group-hover:text-black transition-colors duration-300">Browse Archives</span>
                    </a>
                </div>
            </div>
        </section>

        <footer id="contact" class="pt-40 pb-12 bg-black border-t border-white/10 relative overflow-hidden" data-scroll-section>
            
            <div class="absolute bottom-0 left-0 w-full text-center pointer-events-none">
                <h1 class="font-display font-bold text-[22vw] leading-none text-white opacity-[0.05] select-none liquid-text">PANZEKK</h1>
            </div>

            <div class="container mx-auto px-6 relative z-10">
                <div class="grid md:grid-cols-2 gap-20 mb-32">
                    <div>
                        <h3 class="font-graffiti text-3xl md:text-4xl text-gray-400 mb-8 transform -rotate-2">READY TO RIOT?</h3>
                        <a href="mailto:kevin@panzekk.com" class="hoverable block text-5xl md:text-7xl font-display font-bold leading-tight hover:text-transparent hover:text-stroke-white transition duration-300 break-words">
                            KEVIN<br>@PANZEKK.COM
                        </a>
                    </div>
                    
                    <div class="flex flex-col justify-end items-start md:items-end gap-6">
                        <a href="#" class="group flex items-center gap-4 text-xl md:text-2xl font-display uppercase hoverable">
                            <span class="w-0 group-hover:w-10 h-[2px] bg-white transition-all duration-300"></span>
                            Instagram
                        </a>
                        <a href="https://github.com/darksoul729" class="group flex items-center gap-4 text-xl md:text-2xl font-display uppercase hoverable">
                            <span class="w-0 group-hover:w-10 h-[2px] bg-white transition-all duration-300"></span>
                            GitHub
                        </a>
                        <a href="#" class="group flex items-center gap-4 text-xl md:text-2xl font-display uppercase hoverable">
                            <span class="w-0 group-hover:w-10 h-[2px] bg-white transition-all duration-300"></span>
                            LinkedIn
                        </a>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row justify-between items-center border-t border-white/20 pt-8 text-[10px] md:text-xs font-mono text-gray-500 uppercase tracking-widest gap-4">
                    <div>© 2026 Kevin Hermansyah // V2.0 ULTIMATE</div>
                    <div id="local-time" class="bg-gray-900 px-3 py-1 rounded">LOCAL TIME: 00:00:00</div>
                    <div>MADE IN THE DARK</div>
                </div>
            </div>
        </footer>

    </main>

@endsection

@push('scripts')
    <script>
        /**
         * =============================================================================
         * LOADER ANIMATION SEQUENCE
         * =============================================================================
         */


        /**
         * =============================================================================
         * HERO & SCROLL ANIMATIONS
         * =============================================================================
         */
        function initHeroAnimations() {
            // Logo Scale Up
            gsap.to("#hero-logo", {
                scale: 1,
                duration: 1.5,
                ease: "elastic.out(1, 0.5)"
            });

            // Text Reveal Stagger
            gsap.from(".hero-reveal", {
                yPercent: 120,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power4.out",
                delay: 0.2
            });

            // Scroll Indicator
            gsap.to(".hero-fade-in", {
                opacity: 1,
                duration: 1,
                delay: 1.5
            });
        }

        function initScrollAnimations() {
            // Parallax Elements
            gsap.utils.toArray(".parallax-layer").forEach(layer => {
                const speed = layer.getAttribute('data-speed');
                gsap.to(layer, {
                    y: (i, target) => ScrollTrigger.maxScroll(window) * speed,
                    ease: "none",
                    scrollTrigger: {
                        trigger: "body",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0
                    }
                });
            });

            // Marquee Animation
            gsap.to(".marquee-content", {
                xPercent: -50,
                repeat: -1,
                duration: 20,
                ease: "linear"
            });

            // Manifesto Split Text Reveal
            const splitElements = document.querySelectorAll('.split-text-reveal');
            splitElements.forEach(el => {
                const text = el.innerText;
                el.innerHTML = text.split(" ").map(word => `<span class="inline-block opacity-20 transition-opacity duration-500 hover:opacity-100 font-display">${word}&nbsp;</span>`).join("");
                
                gsap.to(el.children, {
                    opacity: 1,
                    stagger: 0.05,
                    scrollTrigger: {
                        trigger: el,
                        start: "top 80%",
                        end: "bottom 50%",
                        scrub: 1
                    }
                });
            });
        }

        /**
         * =============================================================================
         * DATA FETCHING (GITHUB)
         * =============================================================================
         */
        async function fetchGitHub() {
            const username = 'darksoul729';
            const grid = document.getElementById('projects-grid');
            if(!grid) return;
            
            try {
                // Fetching user repositories
                const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
                
                if (!res.ok) throw new Error("API Limit or Network Error");
                
                const data = await res.json();
                
                // Clear loader
                grid.innerHTML = '';
                
                // Staggered animation index
                let delay = 0;

                data.forEach((repo, i) => {
                    const card = document.createElement('div');
                    card.className = "repo-card group hoverable opacity-0 translate-y-10"; // Init hidden for anim
                    
                    // Random rotation for "sticker" effect
                    const rotate = (Math.random() * 4) - 2;
                    card.style.transform = `rotate(${rotate}deg)`;
                    
                    // Determine language color
                    let langColor = '#fff';
                    if (repo.language === 'JavaScript') langColor = '#f7df1e';
                    if (repo.language === 'TypeScript') langColor = '#3178c6';
                    if (repo.language === 'HTML') langColor = '#e34c26';
                    if (repo.language === 'CSS') langColor = '#563d7c';

                    card.innerHTML = `
                        <div class="absolute -top-4 -right-4 w-12 h-12 bg-white text-black font-graffiti flex items-center justify-center text-xl rounded-full border-2 border-black z-10 transform group-hover:scale-110 transition shadow-[4px_4px_0_rgba(0,0,0,1)]">
                            ${i + 1}
                        </div>
                        <div class="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                            <span class="w-3 h-3 rounded-full" style="background-color: ${langColor}; box-shadow: 0 0 10px ${langColor}"></span>
                            <span class="font-mono text-xs text-gray-400 uppercase tracking-widest">${repo.language || 'UNDEFINED'}</span>
                            <span class="ml-auto font-mono text-[10px] text-gray-600">${new Date(repo.updated_at).toLocaleDateString()}</span>
                        </div>
                        <h3 class="text-2xl md:text-3xl font-display font-bold mb-3 uppercase leading-none group-hover:text-stroke-white transition break-words">
                            <a href="${repo.html_url}" target="_blank" class="hover:underline decoration-2 underline-offset-4">${repo.name}</a>
                        </h3>
                        <p class="font-mono text-xs text-gray-500 mb-6 h-16 overflow-hidden leading-relaxed">
                            ${repo.description || 'No description provided. Contains raw experimental code.'}
                        </p>
                        <div class="flex justify-between items-center mt-auto">
                            <span class="font-mono text-xs text-white bg-gray-900 px-2 py-1 rounded">★ ${repo.stargazers_count}</span>
                            <span class="font-mono text-xs text-white bg-gray-900 px-2 py-1 rounded">⑂ ${repo.forks_count}</span>
                            <a href="${repo.html_url}" target="_blank" class="w-10 h-10 border border-white flex items-center justify-center rounded-full hover:bg-white hover:text-black transition">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                                </svg>
                            </a>
                        </div>
                    `;
                    grid.appendChild(card);
                    
                    // Animate entry
                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        delay: i * 0.1,
                        ease: "power2.out"
                    });
                });
                
                // Refresh ScrollTrigger to account for new height
                ScrollTrigger.refresh();
                
            } catch (err) {
                console.error(err);
                grid.innerHTML = `
                    <div class="col-span-full text-center border border-red-900 p-10 bg-red-900/10">
                        <p class="font-mono text-red-500 text-lg mb-4">CONNECTION FAILURE</p>
                        <p class="text-gray-400 text-sm mb-6">Unable to retrieve classified data from GitHub API.</p>
                        <a href="https://github.com/${username}" target="_blank" class="inline-block border border-red-500 text-red-500 px-6 py-2 hover:bg-red-500 hover:text-white transition font-mono uppercase text-xs">Manual Override</a>
                    </div>
                `;
            }
        }

        /**
         * =============================================================================
         * UTILS: CLOCK
         * =============================================================================
         */
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { hour12: false });
            const el = document.getElementById('local-time');
            if(el) el.innerText = `LOCAL TIME: ${timeString}`;
        }
        setInterval(updateTime, 1000);
        updateTime();

        /**
         * =============================================================================
         * MASTER INITIALIZATION
         * =============================================================================
         */
        window.addEventListener('load', () => {
            // initWebGL is handled in partial
            initHeroAnimations();
            fetchGitHub();
            initScrollAnimations();
            
            // Log for Vandal Identity
            console.log(
                "%c PANZEKK V2 INITIALIZED ", 
                "background: #000; color: #fff; font-size: 20px; padding: 10px; border: 2px solid white;"
            );
        });

    </script>
@endpush
