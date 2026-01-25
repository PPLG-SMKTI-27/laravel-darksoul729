@extends('layouts.app')

@section('content')

    <main class="pt-32 px-4 md:px-6 relative z-10 w-full max-w-7xl mx-auto" data-scroll-section>

        <header class="mb-24 text-center">
             <h1 class="text-6xl md:text-9xl font-display font-bold uppercase tracking-tighter mb-6">
                ACTIVE<br><span class="text-stroke-white text-transparent">PROJECT</span>
            </h1>
            <p class="max-w-xl mx-auto font-mono text-xs md:text-sm text-gray-400 uppercase tracking-widest leading-loose">
                Summary of ongoing operations and directives.
            </p>
        </header>

        <div class="grid md:grid-cols-3 gap-6 mb-24">
            <div class="bg-[#080808] p-8 border border-gray-800 hover:border-white transition">
                 <div class="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-3 border-b border-gray-800 pb-2">Operator</div>
                 <h3 class="text-2xl font-display font-bold text-white mb-2">{{ $name }}</h3>
                 <p class="text-xs font-mono text-gray-500">Lead Architect.</p>
            </div>

            <div class="bg-[#080808] p-8 border border-gray-800 hover:border-white transition">
                <div class="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-3 border-b border-gray-800 pb-2">Status</div>
                <h3 class="text-2xl font-display font-bold text-white mb-2 text-green-500 animate-pulse">LIVE</h3>
                <p class="text-xs font-mono text-gray-500">Systems Nominal.</p>
           </div>

           <div class="bg-[#080808] p-8 border border-gray-800 hover:border-white transition">
                <div class="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-3 border-b border-gray-800 pb-2">ETA</div>
                <h3 class="text-2xl font-display font-bold text-white mb-2">Q3 2026</h3>
                <p class="text-xs font-mono text-gray-500">Deadline Approaching.</p>
           </div>
        </div>

        <section class="grid lg:grid-cols-2 gap-16 items-start mb-24">
            <div>
                <span class="font-graffiti text-2xl text-white block mb-4">BRIEFING</span>
                <h2 class="text-4xl font-display font-bold text-white mb-6 uppercase">Primary Objectives</h2>
                <p class="font-mono text-sm text-gray-400 leading-relaxed max-w-md">
                    Execution of high-level directives focusing on quality, stability, and total dominance.
                </p>
                <div class="mt-8 flex flex-wrap gap-4">
                    <span class="px-4 py-2 border border-white text-white text-xs font-mono uppercase tracking-widest">Weekly Updates</span>
                    <span class="px-4 py-2 border border-gray-800 text-gray-500 text-xs font-mono uppercase tracking-widest">KPI Monitor</span>
                </div>
            </div>

            <div class="border border-white/10 bg-[#050505] p-10">
                <ul class="space-y-8">
                    <li class="flex items-start gap-6 group">
                        <span class="font-graffiti text-3xl text-gray-700 group-hover:text-white transition">01</span>
                        <div>
                            <h3 class="font-display font-bold text-white text-xl uppercase mb-2">Recon</h3>
                            <p class="text-xs font-mono text-gray-500">Gathering intel and validating requirements.</p>
                        </div>
                    </li>
                    <li class="flex items-start gap-6 group">
                        <span class="font-graffiti text-3xl text-gray-700 group-hover:text-white transition">02</span>
                        <div>
                            <h3 class="font-display font-bold text-white text-xl uppercase mb-2">Prototype</h3>
                            <p class="text-xs font-mono text-gray-500">Forging the user experience.</p>
                        </div>
                    </li>
                    <li class="flex items-start gap-6 group">
                        <span class="font-graffiti text-3xl text-gray-700 group-hover:text-white transition">03</span>
                        <div>
                            <h3 class="font-display font-bold text-white text-xl uppercase mb-2">Execute</h3>
                            <p class="text-xs font-mono text-gray-500">Core development and feature integration.</p>
                        </div>
                    </li>
                    <li class="flex items-start gap-6 group">
                        <span class="font-graffiti text-3xl text-gray-700 group-hover:text-white transition">04</span>
                        <div>
                            <h3 class="font-display font-bold text-white text-xl uppercase mb-2">Deploy</h3>
                            <p class="text-xs font-mono text-gray-500">Final testing and system launch.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </section>

        <section class="py-16 border-y border-white/20 mb-20">
            <h2 class="text-3xl font-display font-bold text-white mb-12 text-center uppercase">Project Archive</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                @foreach($repos as $index => $repo)
                    @php
                       // Simple inline logic for colors since we didn't duplicate the full logic from HomeController
                       $langColors = [
                           'JavaScript' => '#f7df1e',
                           'TypeScript' => '#3178c6',
                           'HTML' => '#e34c26',
                           'CSS' => '#563d7c',
                           'PHP' => '#777bb4',
                           'Blade' => '#f05340',
                       ];
                       $color = $langColors[$repo['language'] ?? ''] ?? '#ffffff';
                    @endphp
                    <div class="group relative bg-[#0a0a0a] border border-gray-800 p-6 flex flex-col h-full hover:border-white transition-colors duration-300">
                        <div class="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                            <span class="w-2 h-2 rounded-full" style="background-color: {{ $color }}"></span>
                            <span class="font-mono text-[10px] text-gray-500 uppercase tracking-widest">{{ $repo['language'] ?? 'N/A' }}</span>
                            <span class="ml-auto font-mono text-[10px] text-gray-600">
                                {{ \Carbon\Carbon::parse($repo['updated_at'])->format('M Y') }}
                            </span>
                        </div>

                        <h3 class="text-xl font-display font-bold mb-3 uppercase leading-none text-gray-300 group-hover:text-white transition">
                            <a href="{{ $repo['html_url'] }}" class="hover:underline decoration-1 underline-offset-4">{{ $repo['name'] }}</a>
                        </h3>

                        <p class="font-mono text-[10px] text-gray-500 mb-6 leading-relaxed line-clamp-3">
                            {{ $repo['description'] }}
                        </p>

                        <div class="mt-auto flex justify-between items-center border-t border-gray-800 pt-4">
                            <span class="font-mono text-[10px] text-gray-600">★ {{ $repo['stargazers_count'] }}</span>
                            <a href="{{ $repo['html_url'] }}" class="text-xs font-mono uppercase text-white hover:text-gray-400 transition">View -></a>
                        </div>
                    </div>
                @endforeach
            </div>
        </section>

        <section class="py-20 text-center">
             <h2 class="text-3xl font-display font-bold text-white mb-6 uppercase">Ready to Proceed?</h2>
             <div class="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/contact" class="px-8 py-4 border-2 border-white text-white font-display font-bold uppercase tracking-widest hover:bg-white hover:text-black transition">Initiate Contact</a>
                <a href="/feature" class="px-8 py-4 border border-gray-800 text-gray-400 font-display font-bold uppercase tracking-widest hover:border-white hover:text-white transition">Scan Features</a>
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
