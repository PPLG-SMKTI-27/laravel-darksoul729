@extends('layouts.admin')

@section('title', 'Dashboard')

@section('content')
<div class="space-y-8" id="dashboardContainer">
    
    <!-- Welcome Section -->
    <div class="relative gsap-hero">
        <div class="absolute inset-0 bg-purple-500 rounded-3xl opacity-10 blur-xl"></div>
        <div class="relative bg-white rounded-3xl p-6 md:p-10 border-b-8 border-r-8 border-purple-200 shadow-2xl overflow-hidden">
            <!-- Animated Background Pattern -->
            <div class="absolute inset-0 opacity-10">
                <div class="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl animate-pulse"></div>
                <div class="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>
            
            <div class="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left">
                <div class="flex flex-col items-center lg:items-start gap-4">
                    <div class="flex items-center gap-4">
                        <div class="w-20 h-20 bg-purple-500 rounded-2xl shadow-[0_6px_0_#7c3aed] border-4 border-purple-200 flex items-center justify-center transform hover:rotate-6 transition-transform">
                            <i class="fa-solid fa-user-shield fa-2xl text-white"></i>
                        </div>
                        <div>
                            <h1 class="font-plastic text-3xl md:text-5xl text-purple-600 text-3d">
                                ADMIN BOARD
                            </h1>
                            <p class="text-gray-600 font-bold text-sm md:text-lg mt-1">
                                Welcome back, <span class="text-purple-600 font-bold">{{ auth()->user()->name }}</span>!
                            </p>
                        </div>
                    </div>
                    
                    <!-- Quick Stats Mini -->
                    <div class="flex flex-wrap justify-center lg:justify-start gap-3 mt-2">
                        <div class="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full border-2 border-purple-300">
                            <div class="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                            <span class="text-xs md:text-sm font-bold text-purple-700">{{ $stats['total'] }} Projects</span>
                        </div>
                        <div class="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full border-2 border-green-300">
                            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span class="text-xs md:text-sm font-bold text-green-700">{{ $stats['published'] }} Published</span>
                        </div>
                    </div>
                </div>
                
                <button type="button" onclick="openLogoutModal()" class="group relative bg-red-500 text-white font-plastic px-8 py-4 rounded-2xl border-b-8 border-r-8 border-red-700 shadow-xl hover:bg-red-600 active:border-b-2 active:border-r-2 active:translate-y-2 active:translate-x-2 transition-all duration-200 overflow-hidden btn-plastic gsap-button">
                    <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div class="flex items-center gap-3">
                        <i class="fa-solid fa-right-from-bracket text-2xl transform group-hover:-translate-x-1 transition-transform"></i>
                        <span class="text-lg">LOGOUT</span>
                    </div>
                </button>
            </div>
        </div>
    </div>

    <!-- Statistics Grid -->
    <div class="gsap-stagger">
        <h2 class="font-plastic text-2xl md:text-3xl text-blue-600 text-3d-blue mb-6 flex items-center gap-3">
            <span class="text-4xl">📊</span>
            Statistics Overview
        </h2>
        
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <!-- Total Projects -->
            <div class="stat-card relative group gsap-card">
                <div class="absolute inset-0 bg-blue-800 rounded-3xl opacity-40 transform translate-y-2 translate-x-2 blur-sm"></div>
                <div class="relative bg-blue-500 rounded-3xl p-6 border-b-8 border-r-8 border-blue-700 shadow-2xl cursor-pointer overflow-hidden">
                    <div class="absolute inset-0 opacity-20">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
                    </div>
                    <div class="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/40 to-transparent rounded-t-3xl"></div>
                    
                    <div class="relative z-10">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <p class="text-white/90 text-xs font-bold uppercase tracking-wider mb-1">Total</p>
                                <p class="text-white text-4xl md:text-5xl font-bold">{{ $stats['total'] }}</p>
                            </div>
                            <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                                <i class="fa-solid fa-layer-group fa-xl text-white"></i>
                            </div>
                        </div>
                        <div class="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div class="h-full bg-white/60 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Published -->
            <div class="stat-card relative group gsap-card">
                <div class="absolute inset-0 bg-green-800 rounded-3xl opacity-40 transform translate-y-2 translate-x-2 blur-sm"></div>
                <div class="relative bg-green-500 rounded-3xl p-6 border-b-8 border-r-8 border-green-700 shadow-2xl cursor-pointer overflow-hidden">
                    <div class="absolute inset-0 opacity-20">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
                    </div>
                    <div class="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/40 to-transparent rounded-t-3xl"></div>
                    
                    <div class="relative z-10">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <p class="text-white/90 text-xs font-bold uppercase tracking-wider mb-1">Published</p>
                                <p class="text-white text-4xl md:text-5xl font-bold">{{ $stats['published'] }}</p>
                            </div>
                            <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                                <i class="fa-solid fa-circle-check fa-xl text-white"></i>
                            </div>
                        </div>
                        <div class="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div class="h-full bg-white/60 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Drafts -->
            <div class="stat-card relative group gsap-card">
                <div class="absolute inset-0 bg-orange-800 rounded-3xl opacity-40 transform translate-y-2 translate-x-2 blur-sm"></div>
                <div class="relative bg-orange-500 rounded-3xl p-6 border-b-8 border-r-8 border-orange-700 shadow-2xl cursor-pointer overflow-hidden">
                    <div class="absolute inset-0 opacity-20">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
                    </div>
                    <div class="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/40 to-transparent rounded-t-3xl"></div>
                    
                    <div class="relative z-10">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <p class="text-white/90 text-xs font-bold uppercase tracking-wider mb-1">Drafts</p>
                                <p class="text-white text-4xl md:text-5xl font-bold">{{ $stats['draft'] }}</p>
                            </div>
                            <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                                <i class="fa-solid fa-pen-to-square fa-xl text-white"></i>
                            </div>
                        </div>
                        <div class="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div class="h-full bg-white/60 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Messages -->
            <div class="stat-card relative group gsap-card">
                <div class="absolute inset-0 bg-pink-800 rounded-3xl opacity-40 transform translate-y-2 translate-x-2 blur-sm"></div>
                <div class="relative bg-pink-500 rounded-3xl p-6 border-b-8 border-r-8 border-pink-700 shadow-2xl cursor-pointer overflow-hidden">
                    <div class="absolute inset-0 opacity-20">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
                    </div>
                    <div class="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/40 to-transparent rounded-t-3xl"></div>
                    
                    <div class="relative z-10">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <p class="text-white/90 text-xs font-bold uppercase tracking-wider mb-1">Messages</p>
                                <p class="text-white text-4xl md:text-5xl font-bold">{{ $stats['messages'] }}</p>
                            </div>
                            <div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                                <i class="fa-solid fa-envelope-open-text fa-xl text-white"></i>
                            </div>
                        </div>
                        <div class="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div class="h-full bg-white/60 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Quick Actions - 2 columns -->
        <div class="lg:col-span-2 gsap-fade-left">
            <h2 class="font-plastic text-2xl md:text-3xl text-green-600 text-3d-green mb-6 flex items-center gap-3">
                <span class="text-4xl">⚡</span>
                Quick Actions
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <a href="{{ route('admin.projects.create') }}" class="stat-card relative group gsap-action-card">
                    <div class="absolute inset-0 bg-green-300 rounded-3xl opacity-30 transform translate-y-2 translate-x-2 blur-sm"></div>
                    <div class="relative bg-green-500 rounded-3xl p-6 md:p-8 border-b-8 border-r-8 border-green-700 shadow-2xl hover:shadow-3xl transition-all overflow-hidden btn-plastic">
                        <div class="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                            <div class="absolute inset-0 bg-white/20"></div>
                        </div>
                        <div class="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/30 to-transparent rounded-t-3xl"></div>
                        
                        <div class="relative z-10 flex flex-col items-center gap-4">
                            <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center transform group-hover:scale-125 group-hover:-translate-y-2 transition-all duration-300">
                                <i class="fa-solid fa-plus fa-2xl text-white"></i>
                            </div>
                            <span class="text-white font-plastic text-lg md:text-xl text-center uppercase tracking-wider">New Project</span>
                        </div>
                    </div>
                </a>

                <a href="{{ route('admin.projects.index') }}" class="stat-card relative group gsap-action-card">
                    <div class="absolute inset-0 bg-blue-300 rounded-3xl opacity-30 transform translate-y-2 translate-x-2 blur-sm"></div>
                    <div class="relative bg-blue-500 rounded-3xl p-6 md:p-8 border-b-8 border-r-8 border-blue-700 shadow-2xl hover:shadow-3xl transition-all overflow-hidden btn-plastic">
                        <div class="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                            <div class="absolute inset-0 bg-white/20"></div>
                        </div>
                        <div class="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/30 to-transparent rounded-t-3xl"></div>
                        
                        <div class="relative z-10 flex flex-col items-center gap-4">
                            <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center transform group-hover:scale-125 group-hover:-translate-y-2 transition-all duration-300">
                                <i class="fa-solid fa-list-check fa-2xl text-white"></i>
                            </div>
                            <span class="text-white font-plastic text-lg md:text-xl text-center uppercase tracking-wider">Manage</span>
                        </div>
                    </div>
                </a>

                <a href="{{ route('admin.messages.index') }}" class="stat-card relative group gsap-action-card">
                    <div class="absolute inset-0 bg-pink-300 rounded-3xl opacity-30 transform translate-y-2 translate-x-2 blur-sm"></div>
                    <div class="relative bg-pink-500 rounded-3xl p-6 md:p-8 border-b-8 border-r-8 border-pink-700 shadow-2xl hover:shadow-3xl transition-all overflow-hidden btn-plastic">
                        <div class="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                            <div class="absolute inset-0 bg-white/20"></div>
                        </div>
                        <div class="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/30 to-transparent rounded-t-3xl"></div>
                        
                        <div class="relative z-10 flex flex-col items-center gap-4">
                            <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center transform group-hover:scale-125 group-hover:-translate-y-2 transition-all duration-300">
                                <i class="fa-solid fa-envelope-open-text fa-2xl text-white"></i>
                            </div>
                            <span class="text-white font-plastic text-lg md:text-xl text-center uppercase tracking-wider">Messages</span>
                        </div>
                    </div>
                </a>
            </div>
        </div>

        <!-- Activity/Info Panel - 1 column -->
        <div class="gsap-fade-right">
            <h2 class="font-plastic text-2xl md:text-3xl text-purple-600 text-3d-purple mb-6 flex items-center gap-3">
                <span class="text-4xl">📈</span>
                Activity
            </h2>
            
            <div class="relative">
                <div class="absolute inset-0 bg-purple-300 rounded-3xl opacity-20 transform translate-y-2 translate-x-2 blur-sm"></div>
                <div class="relative bg-white rounded-3xl p-6 border-b-8 border-r-8 border-purple-200 shadow-xl">
                    <div class="space-y-4">
                        <div class="flex items-center gap-3 p-3 rounded-2xl bg-green-50 border-2 border-green-200">
                            <div class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                                <i class="fa-solid fa-circle-check text-white"></i>
                            </div>
                            <div>
                                <p class="font-bold text-green-700 text-sm">{{ $stats['published'] }} Published</p>
                                <p class="text-green-600 text-xs font-bold">Projects Live</p>
                            </div>
                        </div>
                        
                        <div class="flex items-center gap-3 p-3 rounded-2xl bg-orange-50 border-2 border-orange-200">
                            <div class="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                                <i class="fa-solid fa-pen-to-square text-white"></i>
                            </div>
                            <div>
                                <p class="font-bold text-orange-700 text-sm">{{ $stats['draft'] }} Drafts</p>
                                <p class="text-orange-600 text-xs font-bold">In Progress</p>
                            </div>
                        </div>
                        
                        <div class="flex items-center gap-3 p-3 rounded-2xl bg-pink-50 border-2 border-pink-200">
                            <div class="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center">
                                <i class="fa-solid fa-envelope-open-text text-white"></i>
                            </div>
                            <div>
                                <p class="font-bold text-pink-700 text-sm">{{ $stats['messages'] }} New</p>
                                <p class="text-pink-600 text-xs font-bold">Unread Messages</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-6 pt-6 border-t-4 border-dashed border-purple-200">
                        <div class="text-center">
                            <p class="text-purple-600 font-bold text-lg mb-2">Total Projects</p>
                            <p class="text-5xl font-plastic text-purple-500 text-3d-purple">{{ $stats['total'] }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Projects -->
    <div class="gsap-fade-up">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 class="font-plastic text-2xl md:text-3xl text-pink-600 text-3d-pink flex items-center gap-3">
                <span class="text-4xl">📁</span>
                Recent Projects
            </h2>
            <a href="{{ route('admin.projects.index') }}" class="inline-flex items-center gap-2 text-purple-600 font-bold hover:underline">
                View All
                <i class="fa-solid fa-arrow-right"></i>
            </a>
        </div>
        
        @if($recentProjects && $recentProjects->count() > 0)
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @foreach($recentProjects as $project)
                <div class="stat-card relative group gsap-project-card">
                    <div class="absolute inset-0 bg-purple-300 rounded-3xl opacity-30 transform translate-y-2 translate-x-2 blur-sm"></div>
                    <div class="relative bg-white rounded-3xl overflow-hidden border-b-8 border-r-8 border-purple-200 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-3 cursor-pointer" onclick="window.location.href='{{ route('admin.projects.edit', $project) }}'">
                        <!-- Image or Placeholder -->
                        <div class="relative h-48 overflow-hidden border-b-4 border-purple-100">
                            @if($project->image && file_exists(storage_path('app/public/' . $project->image)))
                                <img src="{{ asset('storage/' . $project->image) }}" alt="{{ $project->title }}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
                            @else
                                <div class="w-full h-full bg-purple-100 flex items-center justify-center">
                                    <i class="fa-solid fa-image text-4xl text-purple-300 opacity-50"></i>
                                </div>
                            @endif
                            <div class="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/20 to-transparent"></div>
                            
                            <!-- Status Badge -->
                            <div class="absolute top-4 right-4">
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg border-b-4 {{ $project->status === 'published' ? 'bg-green-500 text-white border-green-700' : 'bg-orange-500 text-white border-orange-700' }}">
                                    {{ $project->status }}
                                </span>
                            </div>
                        </div>
                        
                        <!-- Content -->
                        <div class="p-5">
                            <h3 class="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                                {{ $project->title }}
                            </h3>
                            <p class="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                {{ Str::limit($project->description, 80) }}
                            </p>
                            
                            <div class="flex items-center justify-between pt-4 border-t-2 border-purple-100">
                                <p class="text-xs text-gray-400 font-mono">
                                    {{ $project->created_at->format('M d, Y') }}
                                </p>
                                <span class="flex items-center gap-1 text-purple-600 text-sm font-bold group-hover:translate-x-2 transition-transform">
                                    Edit
                                    <i class="fa-solid fa-arrow-right"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        @else
            <!-- Empty State -->
            <div class="relative">
                <div class="absolute inset-0 bg-gray-300 rounded-3xl opacity-20 transform translate-y-2 translate-x-2 blur-sm"></div>
                <div class="relative bg-white rounded-3xl p-8 md:p-16 border-b-8 border-r-8 border-gray-200 shadow-xl text-center overflow-hidden">
                    <div class="absolute inset-0 bg-gray-50"></div>
                    
                    <div class="relative z-10">
                        <div class="w-32 h-32 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                            <i class="fa-solid fa-folder-open text-5xl text-gray-400"></i>
                        </div>
                        <h3 class="text-3xl font-bold text-gray-700 mb-3">No Projects Yet</h3>
                        <p class="text-gray-600 mb-8 text-lg font-bold">Create your first project to get started!</p>
                        <a href="{{ route('admin.projects.create') }}" class="inline-flex items-center gap-3 bg-blue-500 text-white font-plastic py-4 px-10 rounded-full border-b-6 border-blue-700 shadow-xl hover:bg-blue-600 active:border-b-0 active:translate-y-2 transition-all btn-plastic">
                            <i class="fa-solid fa-plus text-xl"></i>
                            <span class="text-xl">CREATE FIRST PROJECT</span>
                        </a>
                    </div>
                </div>
            </div>
        @endif
    </div>
</div>

@endsection

@push('scripts')
<script>
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        // Register GSAP ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Hero Animation - Main container
        gsap.from('.gsap-hero', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out',
            clearProps: 'all'
        });
        
        // Stagger Stat Cards
        gsap.from('.gsap-card', {
            duration: 0.6,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            delay: 0.3,
            ease: 'back.out(1.7)',
            clearProps: 'all'
        });
        
        // Action Cards
        gsap.from('.gsap-action-card', {
            duration: 0.6,
            scale: 0.8,
            opacity: 0,
            stagger: 0.15,
            delay: 0.5,
            ease: 'back.out(1.7)',
            clearProps: 'all'
        });
        
        // Fade sections
        gsap.from('.gsap-fade-left', {
            duration: 0.8,
            x: -50,
            opacity: 0,
            delay: 0.7,
            ease: 'power2.out',
            clearProps: 'all'
        });
        
        gsap.from('.gsap-fade-right', {
            duration: 0.8,
            x: 50,
            opacity: 0,
            delay: 0.7,
            ease: 'power2.out',
            clearProps: 'all'
        });
        
        // ScrollTrigger for sections (if needed for longer pages)
        gsap.utils.toArray('.gsap-fade-up').forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                clearProps: 'all'
            });
        });
        
        // Project Cards Stagger
        gsap.from('.gsap-project-card', {
            duration: 0.6,
            y: 40,
            opacity: 0,
            stagger: 0.1,
            delay: 1,
            ease: 'back.out(1.7)',
            clearProps: 'all'
        });
    });
</script>
@endpush
