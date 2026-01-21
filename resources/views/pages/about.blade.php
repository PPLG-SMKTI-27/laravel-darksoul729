@extends('layouts.app')

@section('content')

    <main class="pt-32 px-4 md:px-6 relative z-10 w-full max-w-7xl mx-auto" data-scroll-section>
        
        <header class="mb-24 text-center">
            <h1 class="text-6xl md:text-9xl font-display font-bold uppercase tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600">
                ABOUT<br><span class="text-stroke-white text-transparent">US</span>
            </h1>
            <p class="max-w-2xl mx-auto font-mono text-xs md:text-sm text-gray-400 uppercase tracking-widest leading-loose border-l-2 border-white pl-6 text-left md:text-center md:border-l-0 md:border-t-2 md:pt-6">
                Redefining the digital landscape since 2019. We are the glitch in the system.
            </p>
        </header>

        <section class="grid md:grid-cols-2 gap-16 mb-32 items-center">
            <div>
                <span class="font-graffiti text-3xl text-gray-600 block mb-4">WHO WE ARE</span>
                <h2 class="text-3xl font-bold text-white mb-8 border-l-4 border-white pl-6">
                     PLATFORM VOID
                </h2>
                <div class="text-gray-400 space-y-6 leading-relaxed text-justify font-mono text-xs md:text-sm">
                    <p>
                        "Menuju Sukses" is an anomaly. A platform designed to empower individuals by breaking the status quo. With over 5 years of chaotic innovation, we've helped 10,000+ units achieve their prime directive.
                    </p>
                    <p>
                        We are not just a platform; we are your co-pilots in this digital wasteland. Through code, community, and relentless drive, we ensure you never walk the path alone.
                    </p>
                </div>
            </div>
            <div class="relative group">
                <div class="absolute inset-0 bg-white opacity-5 group-hover:opacity-10 transition duration-500 transform translate-x-4 translate-y-4"></div>
                <div class="border border-white/20 p-10 bg-[#050505] relative z-10">
                    <div class="w-16 h-1 bg-white mb-8"></div>
                    <p class="font-display text-4xl uppercase leading-none">
                        "Design is anarchy <br> controlled by logic."
                    </p>
                </div>
            </div>
        </section>

        <section class="mb-32">
            <div class="grid md:grid-cols-2 gap-8">
                <div class="group bg-[#080808] border border-gray-800 p-10 hover:border-white transition duration-300">
                    <div class="mb-6 text-white text-4xl font-graffiti group-hover:scale-110 transition duration-300 origin-left">01</div>
                    <h3 class="text-2xl font-display font-bold text-white mb-4 uppercase">Mission Protocol</h3>
                    <p class="text-gray-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
                        To provide a comprehensive platform that empowers every individual to breach their limits through innovative tech and resistance networks.
                    </p>
                </div>

                <div class="group bg-[#080808] border border-gray-800 p-10 hover:border-white transition duration-300">
                    <div class="mb-6 text-white text-4xl font-graffiti group-hover:scale-110 transition duration-300 origin-left">02</div>
                    <h3 class="text-2xl font-display font-bold text-white mb-4 uppercase">Vision Check</h3>
                    <p class="text-gray-500 font-mono text-xs uppercase tracking-widest leading-relaxed">
                        To become the catalyst of positive chaos in SEA, creating an ecosystem where everyone has equal opportunity to dominate.
                    </p>
                </div>
            </div>
        </section>

        <section class="mb-32">
            <h2 class="text-4xl md:text-6xl font-display font-bold text-center text-white mb-16 uppercase">Core Values</h2>
            <div class="grid md:grid-cols-3 gap-1">
                <div class="p-8 border border-white/10 hover:bg-white hover:text-black transition duration-300 group">
                    <h4 class="font-graffiti text-2xl mb-4 group-hover:text-black">Power</h4>
                    <p class="font-mono text-xs uppercase tracking-widest opacity-60">Tools to reach full potential.</p>
                </div>
                <div class="p-8 border border-white/10 hover:bg-white hover:text-black transition duration-300 group">
                    <h4 class="font-graffiti text-2xl mb-4 group-hover:text-black">Collab</h4>
                    <p class="font-mono text-xs uppercase tracking-widest opacity-60">Stronger together.</p>
                </div>
                <div class="p-8 border border-white/10 hover:bg-white hover:text-black transition duration-300 group">
                    <h4 class="font-graffiti text-2xl mb-4 group-hover:text-black">Truth</h4>
                    <p class="font-mono text-xs uppercase tracking-widest opacity-60">Transparency in every byte.</p>
                </div>
                <div class="p-8 border border-white/10 hover:bg-white hover:text-black transition duration-300 group">
                    <h4 class="font-graffiti text-2xl mb-4 group-hover:text-black">Elite</h4>
                    <p class="font-mono text-xs uppercase tracking-widest opacity-60">Constant innovation.</p>
                </div>
                <div class="p-8 border border-white/10 hover:bg-white hover:text-black transition duration-300 group">
                    <h4 class="font-graffiti text-2xl mb-4 group-hover:text-black">Novelty</h4>
                    <p class="font-mono text-xs uppercase tracking-widest opacity-60">Finding new ways.</p>
                </div>
                <div class="p-8 border border-white/10 hover:bg-white hover:text-black transition duration-300 group">
                    <h4 class="font-graffiti text-2xl mb-4 group-hover:text-black">Sustain</h4>
                    <p class="font-mono text-xs uppercase tracking-widest opacity-60">Long term impact.</p>
                </div>
            </div>
        </section>

        <section class="py-16 border-y border-white/20 mb-20">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
                <div>
                    <h3 class="text-4xl font-display font-bold text-white mb-1">10K+</h3>
                    <p class="font-mono text-xs text-gray-500 uppercase">Users</p>
                </div>
                <div>
                    <h3 class="text-4xl font-display font-bold text-white mb-1">95%</h3>
                    <p class="font-mono text-xs text-gray-500 uppercase">Satisfaction</p>
                </div>
                <div>
                    <h3 class="text-4xl font-display font-bold text-white mb-1">120+</h3>
                    <p class="font-mono text-xs text-gray-500 uppercase">Agents</p>
                </div>
                <div>
                    <h3 class="text-4xl font-display font-bold text-white mb-1">5</h3>
                    <p class="font-mono text-xs text-gray-500 uppercase">Regions</p>
                </div>
            </div>
        </section>

    </main>

    <footer class="py-8 text-center text-xs font-mono text-gray-600 uppercase tracking-widest border-t border-white/10">
        <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <span>© 2026 PANZEKK SYSTEM</span>
            <div class="flex gap-4">
                <a href="#" class="hover:text-white transition">Team</a>
                <a href="#" class="hover:text-white transition">Privacy</a>
            </div>
        </div>
    </footer>

@endsection
