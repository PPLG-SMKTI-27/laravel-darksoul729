@extends('layouts.admin')

@section('title', 'Projects')

@section('content')
    <div class="flex justify-between items-end mb-12">
        <div>
            <h2 class="text-3xl font-bold text-white mb-2 uppercase tracking-wide">Projects</h2>
            <p class="text-gray-500 text-xs font-mono uppercase tracking-widest">Manage your portfolio entries</p>
        </div>
        <a href="{{ route('admin.projects.create') }}" class="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition">
            + New Project
        </a>
    </div>

    <div class="border border-white/10 bg-[#0a0a0a]">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="text-[10px] text-gray-500 font-mono uppercase tracking-widest border-b border-white/5">
                        <th class="p-6 font-normal">Title</th>
                        <th class="p-6 font-normal">Status</th>
                        <th class="p-6 font-normal">Created</th>
                        <th class="p-6 font-normal text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-xs font-mono text-gray-400">
                    @forelse($projects as $project)
                        <tr class="border-b border-white/5 hover:bg-white/5 transition group">
                            <td class="p-6">
                                <span class="block text-white font-bold text-sm mb-1 group-hover:text-white transition">{{ $project->title }}</span>
                                <span class="text-[10px] text-gray-600 truncate max-w-xs block">{{ Str::limit($project->description, 50) }}</span>
                            </td>
                            <td class="p-6">
                                <span class="px-2 py-1 text-[10px] border border-opacity-50 {{ $project->status === 'published' ? 'bg-green-900/30 text-green-500 border-green-900/50' : 'bg-yellow-900/30 text-yellow-500 border-yellow-900/50' }}">
                                    {{ strtoupper($project->status) }}
                                </span>
                            </td>
                            <td class="p-6">{{ $project->created_at->format('Y-m-d') }}</td>
                            <td class="p-6 text-right">
                                <div class="flex justify-end gap-4">
                                    <a href="{{ route('admin.projects.edit', $project) }}" class="text-gray-500 hover:text-white transition">EDIT</a>
                                    <form action="{{ route('admin.projects.destroy', $project) }}" method="POST" onsubmit="return confirm('Are you sure?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-gray-500 hover:text-red-500 transition">DEL</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="p-12 text-center text-gray-600">
                                No projects found. Start by creating one.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
@endsection
