<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
    @include('partials.head')
</head>
<body data-scroll-container>

    @include('partials.ui')
    @include('partials.navbar')

    <main class="pt-32 px-4 md:px-6 relative z-10 w-full max-w-7xl mx-auto" data-scroll-section>

        <header class="mb-24 text-center">
             <h1 class="text-6xl md:text-9xl font-display font-bold uppercase tracking-tighter mb-6">
                CORE<br><span class="text-stroke-white text-transparent">FEATURES</span>
            </h1>
            <p class="max-w-xl mx-auto font-mono text-xs md:text-sm text-gray-400 uppercase tracking-widest leading-loose">
                Advanced weaponry for your arsenal. Maximize productivity.
            </p>
        </header>

        <div class="flex flex-wrap justify-center gap-4 mb-20 font-mono text-xs uppercase tracking-widest">
            <button class="px-6 py-2 border border-white bg-white text-black hover:bg-gray-200 transition">All Systems</button>
            <button class="px-6 py-2 border border-gray-800 text-gray-500 hover:border-white hover:text-white transition">Productivity</button>
            <button class="px-6 py-2 border border-gray-800 text-gray-500 hover:border-white hover:text-white transition">Analytics</button>
            <button class="px-6 py-2 border border-gray-800 text-gray-500 hover:border-white hover:text-white transition">Collab</button>
        </div>

        <div class="grid md:grid-cols-3 gap-8 mb-20">
            <!-- Feature 1 -->
            <div class="p-8 border border-white/10 bg-[#080808] hover:border-white transition group relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                </div>
                <h3 class="text-xl font-display font-bold text-white mb-4 uppercase mt-2">Analytics</h3>
                <p class="text-xs font-mono text-gray-500 mb-6 leading-relaxed">Real-time data visualization with zero latency.</p>
                <ul class="text-xs font-mono text-gray-400 space-y-2 uppercase tracking-wide">
                    <li class="flex items-center gap-2"><span class="text-white">>></span> Custom widgets</li>
                    <li class="flex items-center gap-2"><span class="text-white">>></span> Data export</li>
                </ul>
            </div>

            <!-- Feature 2 -->
            <div class="p-8 border border-white/10 bg-[#080808] hover:border-white transition group relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg>
                </div>
                <h3 class="text-xl font-display font-bold text-white mb-4 uppercase mt-2">Tracking</h3>
                <p class="text-xs font-mono text-gray-500 mb-6 leading-relaxed">Lock onto targets and track milestones relentlessly.</p>
                <ul class="text-xs font-mono text-gray-400 space-y-2 uppercase tracking-wide">
                    <li class="flex items-center gap-2"><span class="text-white">>></span> Milestone tracking</li>
                    <li class="flex items-center gap-2"><span class="text-white">>></span> Reminders</li>
                </ul>
            </div>

            <!-- Feature 3 -->
            <div class="p-8 border border-white/10 bg-[#080808] hover:border-white transition group relative overflow-hidden">
                 <div class="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                </div>
                <h3 class="text-xl font-display font-bold text-white mb-4 uppercase mt-2">Schedule</h3>
                <p class="text-xs font-mono text-gray-500 mb-6 leading-relaxed">Automated chrono-management for maximum efficiency.</p>
                <ul class="text-xs font-mono text-gray-400 space-y-2 uppercase tracking-wide">
                    <li class="flex items-center gap-2"><span class="text-white">>></span> Auto scheduling</li>
                    <li class="flex items-center gap-2"><span class="text-white">>></span> Conflict detection</li>
                </ul>
            </div>

             <!-- Feature 4 -->
             <div class="p-8 border border-white/10 bg-[#080808] hover:border-white transition group relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
               </div>
               <h3 class="text-xl font-display font-bold text-white mb-4 uppercase mt-2">Collab</h3>
               <p class="text-xs font-mono text-gray-500 mb-6 leading-relaxed">Seamless neural link for team operations.</p>
           </div>

            <!-- Feature 5 -->
            <div class="p-8 border border-white/10 bg-[#080808] hover:border-white transition group relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
               </div>
               <h3 class="text-xl font-display font-bold text-white mb-4 uppercase mt-2">Security</h3>
               <p class="text-xs font-mono text-gray-500 mb-6 leading-relaxed">Military-grade 256-bit encryption.</p>
           </div>

           <!-- Feature 6 -->
           <div class="p-8 border border-white/10 bg-[#080808] hover:border-white transition group relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>
               </div>
               <h3 class="text-xl font-display font-bold text-white mb-4 uppercase mt-2">Auto</h3>
               <p class="text-xs font-mono text-gray-500 mb-6 leading-relaxed">Automate repetitive protocols.</p>
           </div>

        </div>

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

    @include('partials.scripts')
</body>
</html>
