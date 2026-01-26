<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Admin Dashboard') - PANZEKK CMS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <style>
        .font-display { font-family: 'Courier New', Courier, monospace; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #333; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
    </style>
</head>
<body class="bg-black text-gray-300 font-mono antialiased" x-data="{ sidebarOpen: true }">

    <!-- Mobile Header -->
    <div class="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-black">
        <span class="font-bold text-white tracking-widest">PANZEKK</span>
        <button @click="sidebarOpen = !sidebarOpen" class="text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
    </div>

    <div class="flex h-screen overflow-hidden">
        
        <!-- Sidebar -->
        <aside :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'" class="absolute md:relative z-20 w-64 h-full bg-black border-r border-white/10 transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col justify-between">
            <div>
                <div class="p-6 border-b border-white/10">
                    <h1 class="text-xl font-bold text-white tracking-[0.2em]">PANZEKK<br><span class="text-xs text-gray-500 font-normal">CONTENT SYSTEM</span></h1>
                </div>

                <nav class="p-4 space-y-1">
                    <a href="{{ route('dashboard') }}" class="block px-4 py-3 text-sm hover:bg-white hover:text-black transition-colors {{ request()->routeIs('dashboard') ? 'bg-white text-black font-bold' : '' }}">
                        // DASHBOARD
                    </a>
                    <a href="{{ route('admin.projects.index') }}" class="block px-4 py-3 text-sm hover:bg-white hover:text-black transition-colors {{ request()->routeIs('admin.projects.*') ? 'bg-white text-black font-bold' : '' }}">
                        // PROJECTS
                    </a>
                    <a href="{{ route('admin.messages.index') }}" class="block px-4 py-3 text-sm hover:bg-white hover:text-black transition-colors {{ request()->routeIs('admin.messages.*') ? 'bg-white text-black font-bold' : '' }}">
                        // MESSAGES
                    </a>
                    <a href="#" class="block px-4 py-3 text-sm hover:bg-white hover:text-black transition-colors">
                        // SETTINGS
                    </a>
                </nav>
            </div>

            <div class="p-4 border-t border-white/10">
                <div class="flex items-center gap-3 px-4 py-3 mb-2">
                    <div class="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {{ substr(auth()->user()->name ?? 'A', 0, 1) }}
                    </div>
                    <div class="text-xs">
                        <div class="text-white">{{ auth()->user()->name ?? 'Admin' }}</div>
                        <div class="text-gray-600">operator</div>
                    </div>
                </div>
                
                <form action="{{ route('logout') }}" method="POST">
                    @csrf
                    <button type="submit" class="w-full text-left px-4 py-2 text-xs text-red-500 hover:text-red-400 hover:bg-red-900/10 transition">
                        [ DISCONNECT ]
                    </button>
                </form>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto relative bg-[#050505]">
            <!-- Notification -->
            @if (session('success'))
                <div x-data="{ show: true }" x-init="setTimeout(() => show = false, 3000)" x-show="show" x-transition.opacity.duration.500ms class="absolute top-6 right-6 z-50 bg-white text-black px-4 py-2 text-xs font-bold border border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                    <span class="mr-2">✓</span> {{ session('success') }}
                </div>
            @endif

            <div class="p-8 md:p-12">
                @yield('content')
            </div>
        </main>

        <!-- Overlay for mobile -->
        <div x-show="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 bg-black/80 z-10 md:hidden" x-transition.opacity></div>
    </div>

</body>
</html>
