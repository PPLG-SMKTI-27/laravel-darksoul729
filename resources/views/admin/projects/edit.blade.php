@extends('layouts.admin')

@section('title', 'Edit Project')

@section('content')
<div class="max-w-3xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
        <a href="{{ route('admin.projects.index') }}" class="bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center border-b-6 border-r-6 border-blue-700 shadow-lg hover:shadow-xl active:border-b-0 active:border-r-0 active:translate-y-2 active:translate-x-2 transition-all">
            <i class="fa-solid fa-arrow-left text-xl"></i>
        </a>
        <div>
            <h1 class="font-plastic text-3xl md:text-4xl text-blue-600 text-3d">
                ✏️ Edit Project
            </h1>
            <p class="text-gray-600 font-bold mt-2">Update project information</p>
        </div>
    </div>

    <!-- Form -->
    <div class="relative">
        <div class="absolute inset-0 bg-blue-200 rounded-3xl opacity-20 transform translate-y-2 translate-x-2 blur-sm"></div>
        <form method="POST" action="{{ route('admin.projects.update', $project) }}" enctype="multipart/form-data" class="relative bg-white rounded-3xl p-6 md:p-8 border-b-8 border-r-8 border-blue-200 shadow-xl space-y-6">
            @csrf
            @method('PUT')
            
            <!-- Title -->
            <div>
                <label for="title" class="block text-gray-700 font-bold uppercase tracking-wider mb-2">Project Title</label>
                <input type="text" name="title" id="title" value="{{ old('title', $project->title) }}" required
                    class="w-full px-4 py-3 rounded-2xl border-4 border-gray-200 focus:border-blue-400 focus:outline-none font-bold transition-colors @error('title') border-red-400 @enderror"
                    placeholder="Enter project title">
                @error('title')
                <p class="text-red-500 font-bold text-sm mt-2">{{ $message }}</p>
                @enderror
            </div>

            <!-- Description -->
            <div>
                <label for="description" class="block text-gray-700 font-bold uppercase tracking-wider mb-2">Description</label>
                <textarea name="description" id="description" rows="5" required
                    class="w-full px-4 py-3 rounded-2xl border-4 border-gray-200 focus:border-blue-400 focus:outline-none font-bold transition-colors resize-none @error('description') border-red-400 @enderror"
                    placeholder="Describe your project...">{{ old('description', $project->description) }}</textarea>
                @error('description')
                <p class="text-red-500 font-bold text-sm mt-2">{{ $message }}</p>
                @enderror
            </div>

            <!-- Current Image -->
            @if($project->image)
            <div>
                <label class="block text-gray-700 font-bold uppercase tracking-wider mb-2">Current Image</label>
                <div class="relative inline-block">
                    <img src="{{ asset('storage/' . $project->image) }}" alt="{{ $project->title }}" class="w-full max-w-md rounded-2xl border-4 border-blue-200 shadow-lg">
                </div>
            </div>
            @endif

            <!-- New Image -->
            <div>
                <label for="image" class="block text-gray-700 font-bold uppercase tracking-wider mb-2">Upload New Image (Optional)</label>
                <div class="border-4 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer" onclick="document.getElementById('image').click()">
                    <i class="fa-solid fa-cloud-arrow-up text-5xl text-gray-400 mx-auto mb-4"></i>
                    <p class="text-gray-500 font-bold">Click to upload new image</p>
                    <p class="text-gray-400 text-sm font-bold mt-1">Leave empty to keep current image</p>
                    <input type="file" name="image" id="image" accept="image/*" class="hidden" onchange="previewImage(event)">
                </div>
                <div id="imagePreview" class="mt-4 hidden">
                    <img id="preview" src="" alt="Preview" class="w-full max-w-md rounded-2xl border-4 border-blue-200 shadow-lg">
                </div>
                @error('image')
                <p class="text-red-500 font-bold text-sm mt-2">{{ $message }}</p>
                @enderror
            </div>

            <!-- Link -->
            <div>
                <label for="link" class="block text-gray-700 font-bold uppercase tracking-wider mb-2">Project Link</label>
                <input type="url" name="link" id="link" value="{{ old('link', $project->link) }}"
                    class="w-full px-4 py-3 rounded-2xl border-4 border-gray-200 focus:border-blue-400 focus:outline-none font-bold transition-colors @error('link') border-red-400 @enderror"
                    placeholder="https://github.com/username/project">
                @error('link')
                <p class="text-red-500 font-bold text-sm mt-2">{{ $message }}</p>
                @enderror
            </div>

            <!-- Status -->
            <div>
                <label for="status" class="block text-gray-700 font-bold uppercase tracking-wider mb-2">Status</label>
                <select name="status" id="status" required
                    class="w-full px-4 py-3 rounded-2xl border-4 border-gray-200 focus:border-blue-400 focus:outline-none font-bold transition-colors @error('status') border-red-400 @enderror">
                    <option value="draft" {{ old('status', $project->status) === 'draft' ? 'selected' : '' }}>📝 Draft</option>
                    <option value="published" {{ old('status', $project->status) === 'published' ? 'selected' : '' }}>✅ Published</option>
                </select>
                @error('status')
                <p class="text-red-500 font-bold text-sm mt-2">{{ $message }}</p>
                @enderror
            </div>

            <!-- Actions -->
            <div class="flex flex-col md:flex-row items-center gap-4 pt-4">
                <button type="submit" class="w-full md:flex-1 bg-blue-500 hover:bg-blue-600 text-white font-plastic py-4 px-8 rounded-2xl border-b-6 border-r-6 border-blue-700 shadow-xl hover:shadow-2xl active:border-b-0 active:border-r-0 active:translate-y-2 active:translate-x-2 transition-all text-lg">
                    💾 Save Changes
                </button>
                <a href="{{ route('admin.projects.index') }}" class="w-full md:flex-1 bg-gray-500 hover:bg-gray-600 text-white font-plastic py-4 px-8 rounded-2xl border-b-6 border-r-6 border-gray-700 shadow-xl hover:shadow-2xl active:border-b-0 active:border-r-0 active:translate-y-2 active:translate-x-2 transition-all text-lg text-center">
                    Cancel
                </a>
            </div>
        </form>
    </div>
</div>

<script>
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview').src = e.target.result;
            document.getElementById('imagePreview').classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    }
}
</script>
@endsection
