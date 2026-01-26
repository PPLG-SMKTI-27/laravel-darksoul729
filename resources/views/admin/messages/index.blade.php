@extends('layouts.admin')

@section('title', 'Messages')

@section('content')
    <div class="mb-12">
        <h2 class="text-3xl font-bold text-white mb-2 uppercase tracking-wide">Messages</h2>
        <p class="text-gray-500 text-xs font-mono uppercase tracking-widest">Incoming transmissions</p>
    </div>

    <div class="border border-white/10 bg-[#0a0a0a]">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="text-[10px] text-gray-500 font-mono uppercase tracking-widest border-b border-white/5">
                        <th class="p-6 font-normal">Sender</th>
                        <th class="p-6 font-normal">Message</th>
                        <th class="p-6 font-normal">Date</th>
                        <th class="p-6 font-normal text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="text-xs font-mono text-gray-400">
                    @forelse($messages as $message)
                        <tr class="border-b border-white/5 hover:bg-white/5 transition group">
                            <td class="p-6">
                                <span class="block text-white font-bold text-sm mb-1 group-hover:text-white transition">{{ $message->name }}</span>
                                <span class="text-[10px] text-gray-600 block">{{ $message->email }}</span>
                            </td>
                            <td class="p-6">
                                <p class="text-gray-400 max-w-sm truncate">{{ $message->message }}</p>
                            </td>
                            <td class="p-6">{{ $message->created_at->format('Y-m-d H:i') }}</td>
                            <td class="p-6 text-right">
                                <form action="{{ route('admin.messages.destroy', $message) }}" method="POST" onsubmit="return confirm('Delete this transmission?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-gray-500 hover:text-red-500 transition">DEL</button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="p-12 text-center text-gray-600">
                                No transmissions received. Quiet on the front.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        <div class="p-6 border-t border-white/10">
            {{ $messages->links() }}
        </div>
    </div>
@endsection
