@extends('layouts.admin')

@section('title', 'Messages')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div>
        <h1 class="font-plastic text-3xl md:text-4xl text-pink-600 text-3d">
            ✉️ Messages
        </h1>
        <p class="text-gray-600 font-bold mt-2">View and manage contact form submissions</p>
    </div>

    <!-- Messages List -->
    <div class="space-y-4">
        @forelse($messages as $message)
        <div class="relative group {{ $message->is_read ? 'opacity-75' : '' }}">
            <div class="absolute inset-0 bg-pink-300 rounded-3xl opacity-20 transform translate-y-2 translate-x-2 blur-sm"></div>
            <div class="relative bg-white rounded-3xl p-6 border-b-8 border-r-8 border-pink-200 shadow-xl hover:shadow-2xl transition-all overflow-hidden">
                @if(!$message->is_read)
                <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200 to-transparent rounded-full blur-2xl opacity-50"></div>
                @endif
                
                    <div class="flex items-start justify-between gap-4 mb-4">
                        <div class="flex items-center gap-3 sm:gap-4 overflow-hidden">
                            <div class="w-12 h-12 sm:w-14 sm:h-14 bg-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg border-b-4 border-r-4 border-pink-700 flex-shrink-0">
                                {{ strtoupper(substr($message->name, 0, 1)) }}
                            </div>
                            <div class="min-w-0 flex-1">
                                <h3 class="font-bold text-gray-800 text-base sm:text-lg truncate">{{ $message->name }}</h3>
                                <p class="text-xs sm:text-sm text-gray-500 font-bold truncate">{{ $message->email }}</p>
                            </div>
                        </div>
                        
                        <div class="flex flex-col items-end gap-1 flex-shrink-0">
                            @if(!$message->is_read)
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-green-500 text-white border-b-2 sm:border-b-4 border-green-700 shadow">
                                New
                            </span>
                            @endif
                            <span class="text-[10px] sm:text-xs text-gray-400 font-mono text-right">
                                {{ $message->created_at->diffForHumans() }}
                            </span>
                        </div>
                    </div>
                    
                    <div class="bg-pink-50 rounded-2xl p-4 border-2 border-pink-100 mb-4">
                        <p class="text-gray-700 font-bold leading-relaxed text-sm sm:text-base">{{ $message->message }}</p>
                    </div>

                    <div class="flex justify-end">
                        <form method="POST" action="{{ route('admin.messages.destroy', $message) }}" class="w-full sm:w-auto">
                            @csrf
                            @method('DELETE')
                            <button type="submit" onclick="return confirm('Delete this message?')" class="w-full sm:w-auto bg-red-500 text-white px-5 py-3 sm:py-2 rounded-xl border-b-4 border-r-4 border-red-700 shadow hover:bg-red-600 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 transition-all font-bold text-sm flex items-center justify-center sm:justify-start gap-2">
                                <i class="fa-solid fa-trash"></i> Delete
                            </button>
                        </form>
                    </div>
            </div>
        </div>
        @empty
        <div class="relative">
            <div class="absolute inset-0 bg-gray-300 rounded-3xl opacity-20 transform translate-y-2 translate-x-2 blur-sm"></div>
            <div class="relative bg-white rounded-3xl p-8 md:p-16 border-b-8 border-r-8 border-gray-200 shadow-xl text-center overflow-hidden">
                <div class="relative z-10">
                    <div class="mb-6">
                        <i class="fa-solid fa-envelope-open text-6xl text-gray-300 mx-auto"></i>
                    </div>
                    <h3 class="text-3xl font-bold text-gray-700 mb-3" style="text-shadow: 0 1px 0 #9ca3af, 0 2px 0 #6b7280, 0 3px 5px rgba(0,0,0,0.15);">
                        No Messages Yet
                    </h3>
                    <p class="text-gray-600 font-bold">Messages from the contact form will appear here.</p>
                </div>
            </div>
        </div>
        @endforelse
    </div>
</div>
@endsection
