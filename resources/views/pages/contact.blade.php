@extends('layouts.app')

@section('content')

    <main class="pt-32 px-4 md:px-6 relative z-10 w-full max-w-7xl mx-auto" data-scroll-section>

        <header class="mb-24 text-center">
             <h1 class="text-6xl md:text-9xl font-display font-bold uppercase tracking-tighter mb-6">
                SIGNAL<br><span class="text-stroke-white text-transparent">ME</span>
            </h1>
            <p class="max-w-xl mx-auto font-mono text-xs md:text-sm text-gray-400 uppercase tracking-widest leading-loose">
                Our channels are open 24/7. Encrypted transmission supported.
            </p>
        </header>

        <div class="grid md:grid-cols-4 gap-4 mb-24">
            <div class="bg-[#080808] border border-gray-800 p-6 hover:border-white transition group text-center">
                <div class="text-white mb-4 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 group-hover:scale-110 transition"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                </div>
                <h3 class="font-display font-bold text-white uppercase mb-1">Email</h3>
                <a href="mailto:info@menujusukses.com" class="text-xs font-mono text-gray-500 hover:text-white transition">info@panzekk.com</a>
            </div>

            <div class="bg-[#080808] border border-gray-800 p-6 hover:border-white transition group text-center">
                <div class="text-white mb-4 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 group-hover:scale-110 transition"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                </div>
                <h3 class="font-display font-bold text-white uppercase mb-1">Phone</h3>
                <a href="tel:+62812345678" class="text-xs font-mono text-gray-500 hover:text-white transition">+62 812-3456-789</a>
            </div>

            <div class="bg-[#080808] border border-gray-800 p-6 hover:border-white transition group text-center">
                <div class="text-white mb-4 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 group-hover:scale-110 transition"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
                </div>
                <h3 class="font-display font-bold text-white uppercase mb-1">WA</h3>
                <a href="#" class="text-xs font-mono text-gray-500 hover:text-white transition">ENCRYPTED LINE</a>
            </div>

            <div class="bg-[#080808] border border-gray-800 p-6 hover:border-white transition group text-center">
                <div class="text-white mb-4 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 group-hover:scale-110 transition"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                </div>
                <h3 class="font-display font-bold text-white uppercase mb-1">Base</h3>
                <span class="text-xs font-mono text-gray-500">JAKARTA, ID</span>
            </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-12 mb-20">
            <div class="lg:col-span-2 p-10 border border-white/20 bg-[#050505] relative">
                <div class="absolute top-0 right-0 p-4">
                    <div class="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                </div>
                
                <h2 class="text-3xl font-display font-bold text-white mb-8">TRANSMIT DATA</h2>
                <form id="contactForm" class="space-y-6">
                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Identifier</label>
                            <input type="text" class="w-full px-4 py-3 bg-[#111] border border-gray-800 rounded-none text-white focus:border-white focus:outline-none transition font-mono" placeholder="CODENAME" required>
                        </div>
                        <div>
                            <label class="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Frequency</label>
                            <input type="email" class="w-full px-4 py-3 bg-[#111] border border-gray-800 rounded-none text-white focus:border-white focus:outline-none transition font-mono" placeholder="EMAIL@DOMAIN" required>
                        </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Comms Line</label>
                            <input type="tel" class="w-full px-4 py-3 bg-[#111] border border-gray-800 rounded-none text-white focus:border-white focus:outline-none transition font-mono" placeholder="PHONE">
                        </div>
                        <div>
                            <label class="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Directive</label>
                            <select class="w-full px-4 py-3 bg-[#111] border border-gray-800 rounded-none text-white focus:border-white focus:outline-none transition font-mono">
                                <option>General Inquiry</option>
                                <option>Collaboration</option>
                                <option>Technical Support</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Payload</label>
                        <textarea rows="5" class="w-full px-4 py-3 bg-[#111] border border-gray-800 rounded-none text-white focus:border-white focus:outline-none transition font-mono" placeholder="ENTER MESSAGE..."></textarea>
                    </div>

                    <button class="w-full bg-white text-black font-display font-bold uppercase py-4 hover:bg-gray-300 transition tracking-widest border border-white">Send Transmission</button>
                </form>
            </div>

            <div class="space-y-6">
                <div class="p-6 border border-gray-800 bg-[#080808]">
                    <h3 class="font-display font-bold text-white mb-2 uppercase">Ops Hours</h3>
                    <p class="text-xs font-mono text-gray-500">Mon - Fri: 09:00 - 18:00</p>
                    <p class="text-xs font-mono text-gray-500">Sat: 09:00 - 14:00</p>
                </div>
                <div class="p-6 border border-gray-800 bg-[#080808]">
                    <h3 class="font-display font-bold text-white mb-2 uppercase">Coordinates</h3>
                    <p class="text-xs font-mono text-gray-500">Jl. Sudirman No. 123, Jakarta</p>
                </div>
                <div class="p-6 border border-gray-800 bg-[#080808]">
                    <h3 class="font-display font-bold text-white mb-2 uppercase">Support</h3>
                    <p class="text-xs font-mono text-gray-500">Standby for rapid response.</p>
                </div>
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

@endsection
