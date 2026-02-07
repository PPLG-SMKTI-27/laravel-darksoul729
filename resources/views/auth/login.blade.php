<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Login</title>
    @vite(['resources/css/app.css'])
</head>
<body class="min-h-screen bg-slate-50 flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-white rounded-3xl border-4 border-white shadow-[0_8px_20px_rgba(0,0,0,0.1)] p-8">
        <div class="flex flex-col gap-2">
            <h1 class="text-3xl font-black text-slate-800">Welcome Back</h1>
            <p class="text-sm text-slate-500 font-semibold">Login to access your dashboard.</p>
        </div>

        @if ($errors->any())
            <div class="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                <ul class="list-disc pl-5">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form class="mt-6 flex flex-col gap-6" method="POST" action="{{ route('login') }}">
            @csrf

            <div class="flex flex-col gap-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                <input
                    type="email"
                    name="email"
                    value="{{ old('email') }}"
                    class="w-full bg-slate-50 text-slate-800 font-bold p-4 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:bg-white outline-none transition-colors"
                    placeholder="user@example.com"
                    required
                    autocomplete="username"
                />
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                <input
                    type="password"
                    name="password"
                    class="w-full bg-slate-50 text-slate-800 font-bold p-4 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:bg-white outline-none transition-colors"
                    placeholder="••••••••"
                    required
                    autocomplete="current-password"
                />
            </div>

            <button
                type="submit"
                class="w-full py-4 text-lg font-black text-white rounded-2xl bg-blue-500 shadow-[0_4px_0_#1d4ed8] active:shadow-none active:translate-y-1 transition-all"
            >
                Log In
            </button>
        </form>
    </div>
</body>
</html>
