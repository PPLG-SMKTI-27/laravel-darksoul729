<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
    @include('partials.head')
</head>
<body data-scroll-container>
    @include('partials.ui')
    @include('partials.navbar')

    <main class="pt-32 pb-20 px-6 max-w-7xl mx-auto flex-grow w-full relative z-10">
        <div class="max-w-3xl mx-auto">
            
            <div class="text-center mb-10">
                <h1 class="text-4xl font-display font-bold text-white mb-2 uppercase">IMAGE PROTOCOL</h1>
                <p class="font-mono text-xs text-gray-500 uppercase tracking-widest">Static asset verification module.</p>
            </div>

            <div class="bg-[#080808] p-4 border border-gray-800 hover:border-white transition group">
                <div class="relative overflow-hidden bg-[#111] aspect-video flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition duration-500">
                    
                    <img src="{{ asset('img/cat.jpg') }}" alt="Test Image" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500 scale-100 group-hover:scale-110">
                    
                    <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-6">
                        <span class="font-mono text-xs text-white bg-black px-2 py-1">ASSET: img/cat.jpg</span>
                    </div>

                    <!-- Scanline overlay -->
                    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>

                </div>
                <div class="mt-4 flex justify-between items-center px-2">
                    <span class="font-mono text-[10px] text-gray-500 uppercase tracking-widest border border-gray-800 px-2 py-1 rounded">Path: img/cat.jpg</span>
                    <a href="/" class="font-mono text-[10px] font-bold text-white hover:underline uppercase tracking-widest">Return to Base -></a>
                </div>
            </div>

        </div>
    </main>

    <footer class="py-8 text-center text-xs font-mono text-gray-600 uppercase tracking-widest border-t border-white/10 mt-auto">
        © 2026 PANZEKK SYSTEM
    </footer>

    @include('partials.scripts')

</body>
</html>
