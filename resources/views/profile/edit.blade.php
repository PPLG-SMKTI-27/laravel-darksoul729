@extends('layouts.admin')

@section('title', 'Manage Profile')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div class="w-full min-w-0">
            <h1 class="font-plastic text-2xl sm:text-3xl md:text-4xl text-purple-600 text-3d-purple truncate">
                👤 My Profile
            </h1>
            <p class="text-sm sm:text-base text-gray-600 font-bold mt-2">Manage your account settings and password.</p>
        </div>
    </div>

    <div class="space-y-8">
        <!-- Update Profile Information -->
        <div class="relative bg-white rounded-3xl p-6 md:p-8 border-b-8 border-r-8 border-purple-200 shadow-xl overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10"></div>
            <div class="max-w-xl">
                @include('profile.partials.update-profile-information-form')
            </div>
        </div>

        <!-- Update Password -->
        <div class="relative bg-white rounded-3xl p-6 md:p-8 border-b-8 border-r-8 border-blue-200 shadow-xl overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
            <div class="max-w-xl">
                @include('profile.partials.update-password-form')
            </div>
        </div>

        <!-- Delete User -->
        <div class="relative bg-white rounded-3xl p-6 md:p-8 border-b-8 border-r-8 border-red-200 shadow-xl overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10"></div>
            <div class="max-w-xl">
                @include('profile.partials.delete-user-form')
            </div>
        </div>
    </div>
</div>
@endsection
