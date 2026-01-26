@extends('layouts.admin')

@section('title', 'Overview')

@section('content')
    <div class="mb-12">
        <h2 class="text-3xl font-bold text-white mb-2 uppercase tracking-wide">System Overview</h2>
        <p class="text-gray-500 text-xs font-mono uppercase tracking-widest">Welcome back, {{ auth()->user()->name }}</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <!-- Stat Card 1 -->
        <div class="border border-white/10 p-6 bg-[#0a0a0a] hover:border-white/30 transition group">
            <div class="flex justify-between items-start mb-4">
                <span class="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Total Projects</span>
                <svg class="w-4 h-4 text-gray-700 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <h3 class="text-3xl font-bold text-white">{{ $stats['total'] }}</h3>
            <div class="mt-2 text-[10px] text-gray-600 font-mono">
                <span class="text-green-500">+{{ $stats['published'] }}</span> published
            </div>
        </div>

        <!-- Stat Card 2 -->
        <div class="border border-white/10 p-6 bg-[#0a0a0a] hover:border-white/30 transition group">
            <div class="flex justify-between items-start mb-4">
                <span class="text-[10px] text-gray-500 font-mono uppercase tracking-widest">System Status</span>
                <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <h3 class="text-3xl font-bold text-white">ONLINE</h3>
            <div class="mt-2 text-[10px] text-gray-600 font-mono">
                Lat: 24ms | Uptime: 99.9%
            </div>
        </div>

         <!-- Stat Card 3 -->
         <div class="border border-white/10 p-6 bg-[#0a0a0a] hover:border-white/30 transition group">
            <div class="flex justify-between items-start mb-4">
                <span class="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Pending Messages</span>
                <svg class="w-4 h-4 text-gray-700 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h3 class="text-3xl font-bold text-white">5</h3>
            <div class="mt-2 text-[10px] text-gray-600 font-mono">
                Action required
            </div>
        </div>
    </div>

    <!-- Recent Activity / Projects -->
    <div class="border border-white/10 bg-[#0a0a0a]">
        <div class="flex items-center justify-between p-6 border-b border-white/10">
            <h3 class="text-sm font-bold text-white uppercase tracking-widest">Recent Projects</h3>
            <a href="{{ route('admin.projects.create') }}" class="text-[10px] font-mono border border-white/20 px-3 py-1 hover:bg-white hover:text-black transition uppercase tracking-widest">
                + New Entry
            </a>
        </div>
        
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="text-[10px] text-gray-500 font-mono uppercase tracking-widest border-b border-white/5">
                        <th class="p-6 font-normal">ID</th>
                        <th class="p-6 font-normal">Project Name</th>
                        <th class="p-6 font-normal">Status</th>
                        <th class="p-6 font-normal">Date</th>
                        <th class="p-6 font-normal text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-xs font-mono text-gray-400">
                    @forelse($recentProjects as $project)
                        <tr class="border-b border-white/5 hover:bg-white/5 transition group">
                            <td class="p-6 text-gray-600">#{{ $project->id }}</td>
                            <td class="p-6 text-white font-bold group-hover:text-white transition">{{ $project->title }}</td>
                            <td class="p-6">
                                <span class="px-2 py-1 text-[10px] border border-opacity-50 {{ $project->status === 'published' ? 'bg-green-900/30 text-green-500 border-green-900/50' : 'bg-yellow-900/30 text-yellow-500 border-yellow-900/50' }}">
                                    {{ strtoupper($project->status) }}
                                </span>
                            </td>
                            <td class="p-6">{{ $project->updated_at->format('Y-m-d') }}</td>
                            <td class="p-6 text-right">
                                <a href="{{ route('admin.projects.edit', $project) }}" class="text-gray-500 hover:text-white mr-4 transition">EDIT</a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="p-12 text-center text-gray-600">No activity logged.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
@endsection
