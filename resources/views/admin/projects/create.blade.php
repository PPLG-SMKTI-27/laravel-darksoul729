@extends('layouts.admin')

@section('title', 'New Project')

@section('content')
    <div class="max-w-3xl mx-auto">
        <div class="mb-12">
            <a href="{{ route('admin.projects.index') }}" class="text-gray-500 hover:text-white text-xs font-mono uppercase tracking-widest mb-4 inline-block">< Back to List</a>
            <h2 class="text-3xl font-bold text-white mb-2 uppercase tracking-wide">New Project</h2>
        </div>

        <form action="{{ route('admin.projects.store') }}" method="POST" enctype="multipart/form-data" class="space-y-8">
            @csrf

            <!-- Title -->
            <div>
                <label for="title" class="block text-xs font-mono font-bold text-gray-400 mb-2 uppercase tracking-widest">Project Title</label>
                <input type="text" name="title" id="title" value="{{ old('title') }}" class="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 text-white focus:border-white focus:outline-none transition font-mono text-sm rounded-none" required>
                @error('title') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
            </div>

            <!-- Description -->
            <div>
                <label for="description" class="block text-xs font-mono font-bold text-gray-400 mb-2 uppercase tracking-widest">Description</label>
                <textarea name="description" id="description" rows="5" class="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 text-white focus:border-white focus:outline-none transition font-mono text-sm rounded-none" required>{{ old('description') }}</textarea>
                @error('description') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Link -->
                <div>
                    <label for="link" class="block text-xs font-mono font-bold text-gray-400 mb-2 uppercase tracking-widest">Project URL</label>
                    <input type="url" name="link" id="link" value="{{ old('link') }}" class="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 text-white focus:border-white focus:outline-none transition font-mono text-sm rounded-none">
                    @error('link') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>

                <!-- Status -->
                <div>
                    <label for="status" class="block text-xs font-mono font-bold text-gray-400 mb-2 uppercase tracking-widest">Status</label>
                    <select name="status" id="status" class="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 text-white focus:border-white focus:outline-none transition font-mono text-sm rounded-none">
                        <option value="draft" {{ old('status') == 'draft' ? 'selected' : '' }}>DRAFT</option>
                        <option value="published" {{ old('status') == 'published' ? 'selected' : '' }}>PUBLISHED</option>
                    </select>
                    @error('status') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>
            </div>

            <!-- Image -->
            <div>
                <label for="image" class="block text-xs font-mono font-bold text-gray-400 mb-2 uppercase tracking-widest">Project Image</label>
                <input type="file" name="image" id="image" class="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 text-white focus:border-white focus:outline-none transition font-mono text-sm rounded-none file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-mono file:bg-gray-800 file:text-white hover:file:bg-gray-700">
                @error('image') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
            </div>

            <div class="pt-6 border-t border-gray-800">
                <button type="submit" class="w-full bg-white text-black font-display font-bold uppercase py-4 rounded-none hover:bg-gray-300 transition tracking-widest border border-white">
                    Save Project
                </button>
            </div>
        </form>
    </div>
@endsection
