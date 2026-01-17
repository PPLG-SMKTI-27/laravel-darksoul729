<nav class="fixed top-0 left-0 w-full z-50 px-6 py-6 mix-blend-difference text-white flex justify-between items-center select-none">
    
    <a href="{{ url('/') }}" class="text-3xl font-graffiti hoverable relative group" data-hover-text="HOME">
        <span class="inline-block transform group-hover:-rotate-3 transition duration-300">PNZK</span>
    </a>
    
    <div class="hidden md:flex gap-12 text-xs font-mono font-bold uppercase tracking-widest items-center">
        <a href="{{ url('/') }}" class="hoverable relative overflow-hidden group">
            <span class="inline-block transition-transform duration-300 group-hover:-translate-y-full">Home</span>
            <span class="absolute top-0 left-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-gray-400 font-graffiti">Home</span>
        </a>
        <a href="{{ url('/about') }}" class="hoverable relative overflow-hidden group">
            <span class="inline-block transition-transform duration-300 group-hover:-translate-y-full">About</span>
            <span class="absolute top-0 left-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-gray-400 font-graffiti">About</span>
        </a>
        <a href="{{ url('/feature') }}" class="hoverable relative overflow-hidden group">
            <span class="inline-block transition-transform duration-300 group-hover:-translate-y-full">Feature</span>
            <span class="absolute top-0 left-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-gray-400 font-graffiti">Feature</span>
        </a>
        <a href="{{ url('/project') }}" class="hoverable relative overflow-hidden group">
            <span class="inline-block transition-transform duration-300 group-hover:-translate-y-full">Project</span>
            <span class="absolute top-0 left-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-gray-400 font-graffiti">Project</span>
        </a>
        <a href="{{ url('/test-image') }}" class="hoverable relative overflow-hidden group">
            <span class="inline-block transition-transform duration-300 group-hover:-translate-y-full">Test Img</span>
            <span class="absolute top-0 left-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-gray-400 font-graffiti">Test Img</span>
        </a>
        <a href="{{ url('/contact') }}" class="hoverable relative overflow-hidden group">
            <span class="inline-block transition-transform duration-300 group-hover:-translate-y-full">Contact</span>
            <span class="absolute top-0 left-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-gray-400 font-graffiti">Contact</span>
        </a>
    </div>

    <div class="flex items-center gap-4">
        <div class="hoverable hidden md:block">
            <a href="{{ url('/login') }}" class="font-graffiti border-2 border-white px-5 py-2 hover:bg-white hover:text-black transition duration-300 transform hover:rotate-2 inline-block text-sm">
                LOGIN
            </a>
        </div>
        
        <button id="menu-toggle" class="md:hidden hoverable z-50 flex flex-col gap-1.5 w-8">
            <span class="w-full h-[2px] bg-white block transition-all"></span>
            <span class="w-full h-[2px] bg-white block transition-all"></span>
            <span class="w-full h-[2px] bg-white block transition-all"></span>
        </button>
    </div>
</nav>

<div class="mobile-menu" id="mobile-menu">
    <a href="{{ url('/') }}" class="text-4xl font-graffiti text-white hover:text-gray-400 transition mobile-link">HOME</a>
    <a href="{{ url('/about') }}" class="text-4xl font-graffiti text-white hover:text-gray-400 transition mobile-link">ABOUT</a>
    <a href="{{ url('/feature') }}" class="text-4xl font-graffiti text-white hover:text-gray-400 transition mobile-link">FEATURE</a>
    <a href="{{ url('/project') }}" class="text-4xl font-graffiti text-white hover:text-gray-400 transition mobile-link">PROJECT</a>
    <a href="{{ url('/test-image') }}" class="text-4xl font-graffiti text-white hover:text-gray-400 transition mobile-link">TEST IMG</a>
    <a href="{{ url('/contact') }}" class="text-4xl font-graffiti text-white hover:text-gray-400 transition mobile-link">CONTACT</a>
    <div class="mt-8">
            <a href="{{ url('/login') }}" class="font-display font-bold text-xl border border-white px-8 py-4 uppercase hover:bg-white hover:text-black transition">LOGIN SYSTEM</a>
    </div>
</div>
