@extends('layouts.admin')

@section('title', 'Manage Projects')

@section('content')
<div class="space-y-10 pb-16 font-bold select-none" style="font-family: 'Fredoka', 'Arial Black', sans-serif;">
    
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 px-2">
        <div class="relative">
            <h1 class="text-6xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-none" 
                style="text-shadow: 0 4px 0 #4f46e5, 0 8px 0 #3730a3, 0 12px 10px rgba(0,0,0,0.2); -webkit-text-stroke: 3px #4f46e5;">
                PROJECTS
            </h1>
            <div class="inline-block mt-4 bg-yellow-400 px-6 py-2 rounded-2xl border-b-[6px] border-r-[4px] border-yellow-600 shadow-lg transform -rotate-1">
                <p class="text-indigo-900 font-black text-xl tracking-wide uppercase italic">
                    Manage your toy collection!
                </p>
            </div>
        </div>

        <a href="{{ route('admin.projects.create') }}" 
           class="w-full md:w-auto group relative inline-flex items-center justify-center px-12 py-6 text-white bg-pink-500 rounded-[2.5rem] 
                  border-b-[14px] border-r-[6px] border-pink-700 
                  hover:bg-pink-400 hover:-translate-y-1
                  active:border-b-0 active:translate-y-[14px] 
                  transition-all duration-75 shadow-2xl overflow-hidden">
            
            <div class="flex items-center gap-4 relative z-10 text-emboss">
                <i class="fa-solid fa-circle-plus text-4xl shadow-sm"></i>
                <span class="text-3xl font-black italic tracking-widest">NEW TOY</span>
            </div>
            
            <div class="absolute top-0 left-0 w-full h-1/2 bg-white/30 rounded-t-[2.5rem]"></div>
            <div class="absolute bottom-2 right-4 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
        </a>
    </div>

    <div class="relative group">
        <div class="absolute inset-0 bg-black/15 translate-y-8 translate-x-4 rounded-[4rem] blur-xl group-hover:opacity-100 transition-opacity"></div>
        
        <div class="relative bg-[#4a8aff] p-5 md:p-8 rounded-[4rem] border-b-[20px] border-r-[10px] border-[#2e5bb0] shadow-2xl">
            
            <div class="bg-white rounded-[3rem] overflow-hidden border-[6px] border-[#2e5bb0] shadow-[inset_0_10px_20px_rgba(0,0,0,0.1)]">
                
                <div class="hidden md:block overflow-x-auto">
                    <table class="w-full min-w-[1040px] table-fixed border-separate border-spacing-0">
                        <thead>
                            <tr class="bg-[#f0f7ff] border-b-[6px] border-blue-100">
                                <th class="w-[52%] py-7 px-10 text-left text-blue-500 uppercase italic text-lg tracking-widest">Project Details</th>
                                <th class="w-[14%] py-7 px-6 text-center text-blue-500 uppercase italic text-lg tracking-widest">Status</th>
                                <th class="w-[14%] py-7 px-6 text-left text-blue-500 uppercase italic text-lg tracking-widest">Added</th>
                                <th class="w-[20%] py-7 px-6 text-right text-blue-500 uppercase italic text-lg tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-[4px] divide-blue-50">
                            @forelse($projects as $project)
                            <tr class="group hover:bg-blue-50/70 transition-colors duration-200">
                                <td class="py-7 px-10 align-middle">
                                    <div class="flex items-center gap-6">
                                        <div class="relative shrink-0 w-28 h-28 p-2 bg-white rounded-[2rem] border-b-8 border-gray-200 shadow-lg transition-transform duration-200 group-hover:scale-105">
                                            @if($project->image && file_exists(storage_path('app/public/' . $project->image)))
                                                <img src="{{ asset('storage/' . $project->image) }}" class="w-full h-full object-cover rounded-[1.5rem] border-4 border-blue-50">
                                            @else
                                                <div class="w-full h-full bg-blue-100 rounded-[1.5rem] flex items-center justify-center border-4 border-blue-50">
                                                    <i class="fa-solid fa-shapes text-5xl text-blue-300"></i>
                                                </div>
                                            @endif
                                            <div class="absolute top-2 left-2 w-1/2 h-4 bg-white/40 rounded-full blur-[2px]"></div>
                                        </div>
                                        <div class="max-w-[520px]">
                                            <h3 class="font-black text-gray-800 text-3xl uppercase tracking-tight leading-tight mb-2 line-clamp-1">{{ $project->title }}</h3>
                                            <p class="text-blue-400 text-base md:text-lg italic font-bold opacity-80 line-clamp-2">{{ Str::limit($project->description, 80) }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-7 px-6 text-center align-middle">
                                    <span class="inline-flex items-center justify-center min-w-[150px] px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest shadow-lg border-b-[6px] whitespace-nowrap 
                                        {{ $project->status === 'published' ? 'bg-green-400 text-green-900 border-green-600' : 'bg-orange-400 text-orange-900 border-orange-600' }}">
                                        {{ $project->status }}
                                    </span>
                                </td>
                                <td class="py-7 px-6 align-middle">
                                    <span class="text-gray-400 font-black italic text-lg uppercase whitespace-nowrap">{{ $project->created_at->format('M d, Y') }}</span>
                                </td>
                                <td class="py-7 px-6 align-middle">
                                    <div class="flex items-center justify-end gap-3 flex-wrap min-w-[160px]">
                                        <a href="{{ route('admin.projects.edit', $project) }}" 
                                           class="bg-blue-500 text-white w-16 h-16 flex items-center justify-center rounded-2xl border-b-[8px] border-blue-700 hover:bg-blue-400 active:border-b-0 active:translate-y-2 transition-all shadow-xl">
                                            <i class="fa-solid fa-pen-nib text-2xl"></i>
                                        </a>
                                        <form method="POST" action="{{ route('admin.projects.destroy', $project) }}" onsubmit="return confirm('Hapus mainan ini dari box?');">
                                            @csrf @method('DELETE')
                                            <button type="submit" class="bg-pink-500 text-white w-16 h-16 flex items-center justify-center rounded-2xl border-b-[8px] border-pink-700 hover:bg-pink-400 active:border-b-0 active:translate-y-2 transition-all shadow-xl">
                                                <i class="fa-solid fa-trash-can text-2xl"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="4" class="py-32 text-center">
                                    <div class="inline-block animate-bounce">
                                        <i class="fa-solid fa-box-open text-9xl text-gray-200"></i>
                                    </div>
                                    <p class="mt-8 font-black text-gray-300 text-4xl italic uppercase">Toy Box Is Empty!</p>
                                </td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>

                <div class="md:hidden p-6 space-y-10">
                    @forelse($projects as $project)
                    <div class="bg-blue-50 rounded-[3.5rem] p-8 border-b-[12px] border-r-[6px] border-blue-200 shadow-xl relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-full h-8 bg-white/40"></div>
                        
                        <div class="flex flex-col items-center text-center gap-6 mt-4">
                            <div class="bg-white p-4 rounded-[2.5rem] shadow-2xl border-[6px] border-blue-400">
                                @if($project->image)
                                    <img src="{{ asset('storage/' . $project->image) }}" class="w-40 h-40 object-cover rounded-[1.5rem]">
                                @else
                                    <div class="w-40 h-40 flex items-center justify-center"><i class="fa-solid fa-shapes text-6xl text-blue-100"></i></div>
                                @endif
                            </div>
                            
                            <div>
                                <h3 class="text-3xl font-black text-gray-800 uppercase tracking-tighter leading-tight">{{ $project->title }}</h3>
                                <p class="text-blue-400 font-bold italic mt-2 uppercase text-sm tracking-widest">{{ $project->status }} • {{ $project->created_at->format('M Y') }}</p>
                            </div>

                            <div class="flex gap-5 w-full pt-4">
                                <a href="{{ route('admin.projects.edit', $project) }}" class="flex-1 bg-blue-500 text-white py-5 rounded-[2rem] border-b-[10px] border-blue-700 font-black text-2xl shadow-lg active:border-b-0 active:translate-y-2 transition-all">EDIT</a>
                                <form action="{{ route('admin.projects.destroy', $project) }}" method="POST" class="flex-1">
                                    @csrf @method('DELETE')
                                    <button class="w-full bg-[#e94d89] text-white py-5 rounded-[2rem] border-b-[10px] border-[#b02e60] font-black text-2xl shadow-lg active:border-b-0 active:translate-y-2 transition-all">DELETE</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    @empty
                    <div class="text-center py-20 uppercase italic font-black text-gray-300 text-2xl">Nothing found!</div>
                    @endforelse
                </div>
                </div>
        </div>
    </div>
</div>

<style>
    /* Tambahkan font Fredoka One untuk gaya mainan yang lebih kental */
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@700&display=swap');
    
    body {
        background-color: #f0f7ff; /* Background halaman menyesuaikan */
    }

    .text-emboss {
        text-shadow: 0 3px 0 rgba(0,0,0,0.25);
    }

    /* Efek halus saat klik tombol */
    .active\:border-b-0:active {
        border-right-width: 0px !important;
    }
</style>
@endsection
