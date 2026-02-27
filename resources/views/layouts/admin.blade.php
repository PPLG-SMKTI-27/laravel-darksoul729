<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin Dashboard') - Plastic World</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/react-app.jsx'])
    <link href="https://fonts.googleapis.com/css2?family=Titan+One&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <style>
        /* Suppress CSS transitions during initial GSAP load to prevent conflict/jitter */
        body:not(.gsap-ready) *, body:not(.gsap-ready) *::before, body:not(.gsap-ready) *::after {
            transition: none !important;
        }

        * {
            font-family: 'Nunito', sans-serif;
        }
        .font-plastic {
            font-family: 'Titan One', cursive;
            font-weight: normal;
        }
        
        /* ===== 3D TEXT EFFECTS ===== */
        .text-3d {
            text-shadow: 
                0 1px 0 #7c3aed,
                0 2px 0 #6d28d9,
                0 3px 0 #5b21b6,
                0 4px 0 #4c1d95,
                0 5px 0 #3b0764,
                0 6px 1px rgba(0,0,0,.1),
                0 0 5px rgba(0,0,0,.1),
                0 1px 3px rgba(0,0,0,.3),
                0 3px 5px rgba(0,0,0,.2),
                0 5px 10px rgba(0,0,0,.25),
                0 10px 20px rgba(0,0,0,.15);
        }
        
        .text-3d-blue {
            text-shadow: 
                0 1px 0 #2563eb,
                0 2px 0 #1d4ed8,
                0 3px 0 #1e40af,
                0 4px 0 #1e3a8a,
                0 5px 0 #172554,
                0 6px 1px rgba(0,0,0,.1),
                0 0 5px rgba(0,0,0,.1),
                0 1px 3px rgba(0,0,0,.3),
                0 3px 5px rgba(0,0,0,.2),
                0 5px 10px rgba(0,0,0,.25),
                0 10px 20px rgba(0,0,0,.15);
        }
        
        .text-3d-green {
            text-shadow: 
                0 1px 0 #16a34a,
                0 2px 0 #15803d,
                0 3px 0 #166534,
                0 4px 0 #14532d,
                0 5px 0 #052e16,
                0 6px 1px rgba(0,0,0,.1),
                0 0 5px rgba(0,0,0,.1),
                0 1px 3px rgba(0,0,0,.3),
                0 3px 5px rgba(0,0,0,.2),
                0 5px 10px rgba(0,0,0,.25),
                0 10px 20px rgba(0,0,0,.15);
        }
        
        .text-3d-pink {
            text-shadow: 
                0 1px 0 #db2777,
                0 2px 0 #be185d,
                0 3px 0 #9f1239,
                0 4px 0 #881337,
                0 5px 0 #4c0519,
                0 6px 1px rgba(0,0,0,.1),
                0 0 5px rgba(0,0,0,.1),
                0 1px 3px rgba(0,0,0,.3),
                0 3px 5px rgba(0,0,0,.2),
                0 5px 10px rgba(0,0,0,.25),
                0 10px 20px rgba(0,0,0,.15);
        }
        
        .text-3d-red {
            text-shadow: 
                0 1px 0 #dc2626,
                0 2px 0 #b91c1c,
                0 3px 0 #991b1b,
                0 4px 0 #7f1d1d,
                0 5px 0 #450a0a,
                0 6px 1px rgba(0,0,0,.1),
                0 0 5px rgba(0,0,0,.1),
                0 1px 3px rgba(0,0,0,.3),
                0 3px 5px rgba(0,0,0,.2),
                0 5px 10px rgba(0,0,0,.25),
                0 10px 20px rgba(0,0,0,.15);
        }
        
        /* ===== SIDEBAR 3D STYLES ===== */
        .sidebar {
            background: #3b82f6;
            box-shadow: 
                4px 0 0 #1e3a8a,
                8px 0 20px rgba(30, 58, 138, 0.4),
                inset 2px 0 0 rgba(255,255,255,0.3);
        }
        
        .sidebar-item {
            position: relative;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 900;
            letter-spacing: 0.5px;
        }
        
        .sidebar-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 50%;
            background: rgba(255,255,255,0.15);
            border-radius: inherit;
            pointer-events: none;
        }
        
        .sidebar-item::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 10%;
            right: 10%;
            height: 8px;
            background: rgba(0,0,0,0.2);
            border-radius: 50%;
            filter: blur(4px);
            opacity: 0;
            transition: opacity 0.2s;
        }

        .sidebar-item:not(.active) {
            background: rgba(255,255,255,0.08);
            box-shadow:
                inset 0 2px 0 rgba(255,255,255,0.35),
                inset 0 -2px 0 rgba(0,0,0,0.2),
                0 3px 0 #1e40af,
                0 5px 0 #1e3a8a,
                0 7px 6px rgba(0,0,0,0.25);
        }

        .sidebar-item:not(.active)::after {
            opacity: 0.25;
        }
        
        .sidebar-item:hover:not(.active) {
            background: #2563eb;
            box-shadow: 
                inset 0 2px 0 rgba(255,255,255,0.4),
                inset 0 -3px 0 rgba(0,0,0,0.2),
                0 4px 0 #1e40af,
                0 6px 0 #1e3a8a,
                0 8px 6px rgba(0,0,0,0.3);
            transform: translateY(-2px) translateX(4px);
            border: 2px solid rgba(255,255,255,0.3);
            margin: -2px -2px -4px -2px; /* Compensate for border to prevent jitter */
        }
        
        .sidebar-item:hover::after {
            opacity: 0.3;
        }
        
        /* ACTIVE STATE - 3D DEPTH */
        .sidebar-item.active {
            background: #db2777;
            box-shadow: 
                inset 0 2px 0 rgba(255,255,255,0.4),
                inset 0 -3px 0 rgba(0,0,0,0.2),
                0 6px 0 #9f1239,
                0 8px 0 #881337,
                0 10px 0 #4c0519,
                0 12px 8px rgba(0,0,0,0.3),
                0 16px 20px rgba(0,0,0,0.4);
            transform: translateY(-2px);
            border: 2px solid rgba(255,255,255,0.3);
        }
        
        .sidebar-item.active::before {
            background: rgba(255,255,255,0.25);
        }
        
        .sidebar-item.active svg {
            filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));
            transform: scale(1.1);
        }
        
        .sidebar-item.active span {
            text-shadow: 
                0 1px 0 rgba(0,0,0,0.3),
                0 2px 0 rgba(0,0,0,0.2),
                0 3px 5px rgba(0,0,0,0.4);
        }
        
        /* ===== BUTTONS & CARDS ===== */
        .stat-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-card:hover {
            transform: translateY(-12px) scale(1.03);
        }
        
        .btn-plastic {
            position: relative;
            transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .btn-plastic::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 40%;
            background: rgba(255,255,255,0.2);
            border-radius: inherit;
            pointer-events: none;
        }
        
        .btn-plastic:active {
            transform: translateY(6px);
        }
        
        /* ===== 3D ICON CONTAINER ===== */
        .icon-3d {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        
        .icon-3d::before {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 10%;
            right: 10%;
            height: 8px;
            background: rgba(0,0,0,0.3);
            border-radius: 50%;
            filter: blur(3px);
            transition: all 0.3s;
        }
        
        .icon-3d:hover::before {
            height: 12px;
            filter: blur(6px);
        }
    </style>
</head>
<body class="bg-slate-50 overflow-x-hidden">
    
    <div class="flex min-h-screen overflow-hidden">
        <!-- Sidebar Overlay (Mobile) -->
        <div id="sidebarOverlay" class="fixed inset-0 bg-black/50 z-40 lg:hidden opacity-0 pointer-events-none transition-opacity duration-300"></div>

        <!-- Sidebar -->
        <aside id="mainSidebar" class="sidebar fixed left-0 top-0 h-full w-64 z-50 rounded-r-3xl border-r-4 border-blue-300 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 flex flex-col">
            <!-- Logo -->
            <div class="p-6 pb-4 flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <div class="w-14 h-14 bg-pink-500 rounded-2xl shadow-[0_4px_0_#db2777] border-2 border-pink-300 flex items-center justify-center">
                        <span class="font-plastic text-white text-xl font-bold">KH</span>
                    </div>
                    <div>
                        <h2 class="font-plastic text-white text-xl text-3d">Admin</h2>
                        <p class="text-blue-100 text-xs font-bold uppercase tracking-wider">Dashboard</p>
                    </div>
                </div>
                <!-- Close Button (Mobile) -->
                <button id="closeSidebarBtn" class="lg:hidden text-white hover:text-red-300 active:scale-90 transition-transform">
                    <i class="fa-solid fa-xmark text-2xl"></i>
                </button>
            </div>

            <!-- Navigation -->
            <nav class="mt-6 px-3 space-y-2 flex-1 overflow-y-auto">
                <a href="{{ route('dashboard') }}" class="sidebar-item flex items-center gap-3 px-4 py-3 rounded-2xl text-white {{ request()->routeIs('dashboard') ? 'active' : '' }}">
                    <i class="fa-solid fa-house fa-lg w-6 text-center"></i>
                    <span>Dashboard</span>
                </a>

                <a href="{{ route('admin.projects.index') }}" class="sidebar-item flex items-center gap-3 px-4 py-3 rounded-2xl text-white {{ request()->routeIs('admin.projects.*') ? 'active' : '' }}">
                    <i class="fa-solid fa-folder-open fa-lg w-6 text-center"></i>
                    <span>Projects</span>
                </a>

                <a href="{{ route('admin.messages.index') }}" class="sidebar-item flex items-center gap-3 px-4 py-3 rounded-2xl text-white {{ request()->routeIs('admin.messages.*') ? 'active' : '' }}">
                    <i class="fa-solid fa-envelope fa-lg w-6 text-center"></i>
                    <span>Messages</span>
                </a>

                <a href="{{ route('admin.settings.edit') }}" class="sidebar-item flex items-center gap-3 px-4 py-3 rounded-2xl text-white {{ request()->routeIs('admin.settings.*') ? 'active' : '' }}">
                    <i class="fa-solid fa-gear fa-lg w-6 text-center"></i>
                    <span>Settings</span>
                </a>

                <a href="{{ route('home') }}" target="_blank" class="sidebar-item flex items-center gap-3 px-4 py-3 rounded-2xl text-white">
                    <i class="fa-solid fa-arrow-up-right-from-square fa-lg w-6 text-center"></i>
                    <span>View Site</span>
                </a>
            </nav>

            <!-- Bottom Actions -->
            <div class="p-4 space-y-2 mt-auto">
                <a href="{{ route('profile.edit') }}" class="sidebar-item flex items-center gap-3 px-4 py-3 rounded-2xl text-white font-bold {{ request()->routeIs('profile.*') ? 'active' : '' }}">
                    <i class="fa-solid fa-user-circle fa-lg w-6 text-center"></i>
                    <span>Profile</span>
                </a>

                <form method="POST" action="{{ route('logout') }}" id="logout-form">
                    @csrf
                    <button type="button" onclick="openLogoutModal()" class="sidebar-item w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white font-bold bg-red-500 hover:bg-red-600 border-2 border-transparent focus:border-white transition-colors">
                        <i class="fa-solid fa-right-from-bracket fa-lg w-6 text-center"></i>
                        <span>Logout</span>
                    </button>
                </form>
            </div>
        </aside>

        <!-- Mobile Header -->
        <div class="lg:hidden fixed top-0 left-0 right-0 z-40 bg-blue-600 border-b-4 border-blue-300 shadow-lg">
            <div class="flex items-center justify-between p-4">
                <div class="flex items-center gap-2">
                    <div class="w-10 h-10 bg-pink-500 rounded-xl shadow-[0_3px_0_#db2777] border-2 border-pink-300 flex items-center justify-center">
                        <span class="font-plastic text-white text-lg font-bold">KH</span>
                    </div>
                    <span class="font-plastic text-white text-lg text-3d">Admin</span>
                </div>
                <button id="mobileMenuBtn" class="w-12 h-12 bg-yellow-400 rounded-xl shadow-[0_4px_0_#ca8a04] border-b-2 border-r-2 border-yellow-300 flex flex-col items-center justify-center gap-1 active:translate-y-1 active:shadow-none transition-all">
                    <div class="w-6 h-1 bg-yellow-900 rounded-full"></div>
                    <div class="w-6 h-1 bg-yellow-900 rounded-full"></div>
                    <div class="w-6 h-1 bg-yellow-900 rounded-full"></div>
                </button>
            </div>
        </div>


        <!-- Logout Modal -->
        <div id="logoutModal" class="fixed inset-0 z-50 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300">
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="closeLogoutModal()"></div>
            <div class="relative bg-white rounded-3xl p-8 max-w-sm w-[90%] border-b-8 border-r-8 border-gray-300 shadow-2xl transform scale-95 transition-transform duration-300" id="logoutModalContent">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-200">
                    <i class="fa-solid fa-right-from-bracket text-3xl text-red-500"></i>
                </div>
                <h3 class="text-2xl font-plastic text-gray-800 text-center mb-2">Ready to Leave?</h3>
                <p class="text-gray-500 text-center font-bold mb-8">Are you sure you want to log out of the admin session?</p>
                <div class="flex gap-4">
                    <button type="button" onclick="closeLogoutModal()" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl border-b-4 border-gray-300 active:border-b-0 active:translate-y-1 transition-all">Cancel</button>
                    <button type="button" onclick="document.getElementById('logout-form').submit()" class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all">Logout</button>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <main class="flex-1 min-w-0 max-w-[100vw] overflow-x-hidden lg:overflow-x-visible lg:ml-64 pt-20 lg:pt-0">
            <div class="p-4 sm:p-6 md:p-8 mt-2 lg:mt-0">
                @yield('content')
            </div>
        </main>
    </div>

    <script>
        // Logout Modal Functions
        function openLogoutModal() {
            const modal = document.getElementById('logoutModal');
            const content = document.getElementById('logoutModalContent');
            modal.classList.remove('opacity-0', 'pointer-events-none');
            content.classList.remove('scale-95');
        }

        function closeLogoutModal() {
            const modal = document.getElementById('logoutModal');
            const content = document.getElementById('logoutModalContent');
            modal.classList.add('opacity-0', 'pointer-events-none');
            content.classList.add('scale-95');
        }

        // Register GSAP ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        
        // Mobile Sidebar Toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const closeSidebarBtn = document.getElementById('closeSidebarBtn');
        const mainSidebar = document.getElementById('mainSidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        function toggleSidebar() {
            const isClosed = mainSidebar.classList.contains('-translate-x-full');
            if (isClosed) {
                mainSidebar.classList.remove('-translate-x-full');
                sidebarOverlay.classList.remove('opacity-0', 'pointer-events-none');
            } else {
                mainSidebar.classList.add('-translate-x-full');
                sidebarOverlay.classList.add('opacity-0', 'pointer-events-none');
            }
        }

        if (mobileMenuBtn && closeSidebarBtn && sidebarOverlay) {
            mobileMenuBtn.addEventListener('click', toggleSidebar);
            closeSidebarBtn.addEventListener('click', toggleSidebar);
            sidebarOverlay.addEventListener('click', toggleSidebar);
        }
        
        // GSAP Sidebar Icon Animation on Page Load
        gsap.utils.toArray('.sidebar-item').forEach((item, index) => {
            gsap.from(item, {
                x: -30,
                opacity: 0,
                duration: 0.4,
                delay: 0.1 + (index * 0.08),
                ease: 'back.out(1.2)',
                clearProps: 'all'
            });
        });

        // Enable CSS transitions after GSAP entrance animations are mostly done
        setTimeout(() => {
            document.body.classList.add('gsap-ready');
        }, 1500);
    </script>
    
    @stack('scripts')
</body>
</html>
