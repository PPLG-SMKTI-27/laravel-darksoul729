@extends('layouts.admin')

@section('title', 'General Settings')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="w-full min-w-0">
            <h1 class="font-plastic text-2xl sm:text-3xl md:text-4xl text-blue-600 text-3d-blue truncate">
                ⚙️ General Settings
            </h1>
            <p class="text-sm sm:text-base text-gray-600 font-bold mt-2">Manage your public profile and website configuration</p>
        </div>
    </div>

    <!-- Success Message -->
    @if(session('success'))
    <div class="relative bg-green-500 text-white rounded-2xl p-4 border-b-4 border-green-700 shadow-lg">
        <div class="flex items-center gap-3">
            <i class="fa-solid fa-circle-check text-xl"></i>
            <span class="font-bold">{{ session('success') }}</span>
        </div>
    </div>
    @endif

    <form method="POST" action="{{ route('admin.settings.update') }}" class="relative bg-white rounded-3xl p-6 md:p-8 border-b-8 border-r-8 border-blue-200 shadow-xl space-y-8">
        @csrf
        @method('PUT')
        
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-full -z-10"></div>

        <!-- Group 1: Hero Section Name -->
        <div>
            <h3 class="font-plastic text-xl text-blue-500 mb-4 border-b-2 border-dashed border-blue-100 pb-2 flex items-center gap-2">
                <i class="fa-solid fa-user"></i> Homepage Hero Area
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div class="space-y-2">
                    <label for="hero_title_1" class="block font-bold text-gray-700">First Name (Top Title) <span class="text-red-500">*</span></label>
                    <input type="text" name="hero_title_1" id="hero_title_1" value="{{ old('hero_title_1', $setting->hero_title_1) }}" required
                        class="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:border-blue-500 focus:ring-0 focus:bg-white transition-colors shadow-inner"
                        placeholder="e.g. KEVIN">
                    @error('hero_title_1')
                        <p class="text-red-500 text-sm font-bold mt-1">{{ $message }}</p>
                    @enderror
                </div>
                
                <div class="space-y-2">
                    <label for="hero_title_2" class="block font-bold text-gray-700">Last Name (Bottom Title) <span class="text-red-500">*</span></label>
                    <input type="text" name="hero_title_2" id="hero_title_2" value="{{ old('hero_title_2', $setting->hero_title_2) }}" required
                        class="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:border-blue-500 focus:ring-0 focus:bg-white transition-colors shadow-inner"
                        placeholder="e.g. HERMANSYAH">
                    @error('hero_title_2')
                        <p class="text-red-500 text-sm font-bold mt-1">{{ $message }}</p>
                    @enderror
                </div>
            </div>

            <div class="space-y-2">
                <label for="hero_subtitle" class="block font-bold text-gray-700">Hero Subtitle <span class="text-red-500">*</span></label>
                <input type="text" name="hero_subtitle" id="hero_subtitle" value="{{ old('hero_subtitle', $setting->hero_subtitle) }}" required
                    class="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:border-blue-500 focus:ring-0 focus:bg-white transition-colors shadow-inner"
                    placeholder="Brief description under your name">
                @error('hero_subtitle')
                    <p class="text-red-500 text-sm font-bold mt-1">{{ $message }}</p>
                @enderror
            </div>
        </div>

        <!-- Group 2: Footer / About Text -->
        <div>
            <h3 class="font-plastic text-xl text-blue-500 mb-4 border-b-2 border-dashed border-blue-100 pb-2 flex items-center gap-2">
                <i class="fa-solid fa-address-card"></i> About & Call to Action
            </h3>
            
            <div class="space-y-2">
                <label for="about_text" class="block font-bold text-gray-700">Call To Action Text</label>
                <textarea name="about_text" id="about_text" rows="3"
                    class="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:border-blue-500 focus:ring-0 focus:bg-white transition-colors shadow-inner"
                    placeholder="Text showing in the footer/contact CTA area">{{ old('about_text', $setting->about_text) }}</textarea>
                <p class="text-xs text-gray-500 font-bold">This appears in the 'Ready to Collaborate?' section on the landing page.</p>
                @error('about_text')
                    <p class="text-red-500 text-sm font-bold mt-1">{{ $message }}</p>
                @enderror
            </div>
        </div>

        <!-- Group 3: Social Links -->
        <div>
            <h3 class="font-plastic text-xl text-blue-500 mb-4 border-b-2 border-dashed border-blue-100 pb-2 flex items-center gap-2">
                <i class="fa-solid fa-link"></i> Contact & Social Links
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Email -->
                <div class="space-y-2">
                    <label for="contact_email" class="block font-bold text-gray-700">Contact Email</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i class="fa-solid fa-envelope text-gray-400"></i>
                        </div>
                        <input type="email" name="contact_email" id="contact_email" value="{{ old('contact_email', $setting->contact_email) }}"
                            class="w-full pl-10 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:border-blue-500 focus:ring-0 focus:bg-white transition-colors shadow-inner">
                    </div>
                </div>

                <!-- GitHub -->
                <div class="space-y-2">
                    <label for="github_url" class="block font-bold text-gray-700">GitHub Profile URL</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i class="fa-brands fa-github text-gray-400"></i>
                        </div>
                        <input type="url" name="github_url" id="github_url" value="{{ old('github_url', $setting->github_url) }}"
                            class="w-full pl-10 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:border-blue-500 focus:ring-0 focus:bg-white transition-colors shadow-inner">
                    </div>
                </div>

                <!-- LinkedIn -->
                <div class="space-y-2">
                    <label for="linkedin_url" class="block font-bold text-gray-700">LinkedIn Profile URL</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i class="fa-brands fa-linkedin text-gray-400"></i>
                        </div>
                        <input type="url" name="linkedin_url" id="linkedin_url" value="{{ old('linkedin_url', $setting->linkedin_url) }}"
                            class="w-full pl-10 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:border-blue-500 focus:ring-0 focus:bg-white transition-colors shadow-inner">
                    </div>
                </div>

                <!-- Instagram -->
                <div class="space-y-2">
                    <label for="instagram_url" class="block font-bold text-gray-700">Instagram Profile URL</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i class="fa-brands fa-instagram text-gray-400"></i>
                        </div>
                        <input type="url" name="instagram_url" id="instagram_url" value="{{ old('instagram_url', $setting->instagram_url) }}"
                            class="w-full pl-10 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:border-blue-500 focus:ring-0 focus:bg-white transition-colors shadow-inner">
                    </div>
                </div>
            </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-6 border-t-2 border-gray-100 flex flex-col sm:flex-row gap-4">
            <button type="submit" class="w-full sm:flex-1 bg-blue-500 text-white font-plastic text-lg px-6 py-4 rounded-xl border-b-6 border-r-6 border-blue-700 shadow-xl hover:bg-blue-600 active:border-b-0 active:border-r-0 active:translate-y-2 active:translate-x-2 transition-all flex items-center justify-center gap-3 btn-plastic">
                <i class="fa-solid fa-floppy-disk"></i>
                SAVE SETTINGS
            </button>
        </div>
    </form>
</div>
@endsection
