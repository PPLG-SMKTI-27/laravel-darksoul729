<nav class="fixed w-full z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200">
    <div class="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
        <div class="flex items-center gap-2 font-bold text-slate-900 text-xl">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-brand-primary">
                <path fill-rule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436-.067.052-.142.107-.223.165a5.987 5.987 0 00-3.376.844.75.75 0 01-.894-1.203 4.492 4.492 0 012.593-.65c-1.353-.61-2.45-1.707-3.06-3.06a4.492 4.492 0 01-.65 2.593.75.75 0 01-1.204-.894 5.987 5.987 0 00.844-3.376c.058-.081.113-.156.165-.223z" clip-rule="evenodd" />
                <path d="M2.25 15a6.75 6.75 0 000 13.5h.75a.75.75 0 00.75-.75V21a3 3 0 013-3 3 3 0 013 3v6.75a.75.75 0 00.75.75h.75a6.75 6.75 0 000-13.5H2.25z" />
            </svg>
            MenujuSukses
        </div>
        
        <div class="hidden md:flex gap-8 text-sm font-medium">
            <a href="/" class="{{ request()->path() === '' || request()->path() === '/' ? 'text-brand-primary font-semibold' : 'hover:text-brand-primary transition' }}">Beranda</a>
            <a href="/about" class="{{ request()->is('about') ? 'text-brand-primary font-semibold' : 'hover:text-brand-primary transition' }}">Tentang</a>
            <a href="/feature" class="{{ request()->is('feature') ? 'text-brand-primary font-semibold' : 'hover:text-brand-primary transition' }}">Fitur</a>
            <a href="/contact" class="{{ request()->is('contact') ? 'text-brand-primary font-semibold' : 'hover:text-brand-primary transition' }}">Kontak</a>
            <a href="/project" class="{{ request()->is('project') ? 'text-brand-primary font-semibold' : 'hover:text-brand-primary transition' }}">Project</a>
            <a href="/test-image" class="{{ request()->is('test-image') ? 'text-brand-primary font-semibold' : 'hover:text-brand-primary transition' }}">Test Image</a>
        </div>

        <a href="/login" class="px-5 py-2 text-sm font-semibold text-white bg-brand-dark rounded-lg hover:bg-slate-800 transition">Masuk</a>
    </div>
</nav>
