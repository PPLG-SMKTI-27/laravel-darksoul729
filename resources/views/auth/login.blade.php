<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Titan+One&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet">


    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        body {
            font-family: 'Nunito', sans-serif;
        }
        .font-plastic {
            font-family: 'Titan One', cursive;
        }
        .text-3d {
            text-shadow: 
                0px 4px 0px rgba(0,0,0,0.2),
                0px 8px 0px rgba(0,0,0,0.1);
        }
        .box-plastic {
            box-shadow: 
                inset 0px 4px 0px rgba(255,255,255,0.5),
                inset 0px -4px 0px rgba(0,0,0,0.2),
                0px 8px 0px rgba(0,0,0,0.2);
        }
        .input-plastic {
            box-shadow: 
                inset 0px 4px 0px rgba(0,0,0,0.1),
                0px 2px 0px rgba(255,255,255,1);
        }
        .btn-plastic {
            transition: all 0.1s;
            box-shadow: 
                inset 0px 4px 0px rgba(255,255,255,0.4),
                0px 6px 0px rgba(0,0,0,0.2);
        }
        .btn-plastic:active {
            transform: translateY(4px);
            box-shadow: 
                inset 0px 4px 0px rgba(255,255,255,0.4),
                0px 2px 0px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body class="bg-white flex items-center justify-center min-h-screen selection:bg-yellow-300 selection:text-black">
    
    <!-- Floating Shapes Background (Optional subtle decoration) -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-10 left-10 w-16 h-16 bg-yellow-400 rounded-full box-plastic opacity-80 animate-bounce" style="animation-duration: 3s;"></div>
        <div class="absolute bottom-20 right-20 w-24 h-24 bg-blue-400 rounded-3xl box-plastic opacity-80 rotate-12"></div>
        <div class="absolute top-1/2 left-20 w-12 h-12 bg-green-400 rounded-lg box-plastic opacity-60 -rotate-45"></div>
    </div>

    <!-- Main Card -->
    <div class="relative w-full max-w-sm bg-blue-500 rounded-[3rem] p-8 border-4 border-blue-600 box-plastic z-10 mx-4">
        
        <!-- Header -->
        <div class="text-center mb-8">
            <h1 class="font-plastic text-5xl text-white text-3d tracking-wide">
                LOGIN
            </h1>
            <p class="text-blue-200 font-bold text-lg mt-2 tracking-wider uppercase">Member Access</p>
        </div>

        <form method="POST" action="{{ route('login') }}" class="space-y-6">
            @csrf

            <!-- Email Address -->
            <div>
                <label for="email" class="block text-white font-bold mb-2 ml-2 tracking-wide text-sm uppercase">Email</label>
                <input id="email" type="email" name="email" :value="old('email')" required autofocus 
                    class="w-full bg-blue-100 border-4 border-blue-400 rounded-2xl px-4 py-3 text-blue-900 font-bold focus:outline-none focus:bg-white focus:border-yellow-400 transition-colors input-plastic placeholder-blue-300"
                    placeholder="name@example.com">
                <x-input-error :messages="$errors->get('email')" class="mt-2 text-yellow-300 font-bold ml-2 bg-red-500 px-2 py-1 rounded-lg inline-block text-xs" />
            </div>

            <!-- Password -->
            <div>
                <label for="password" class="block text-white font-bold mb-2 ml-2 tracking-wide text-sm uppercase">Password</label>
                <input id="password" type="password" name="password" required autocomplete="current-password"
                    class="w-full bg-blue-100 border-4 border-blue-400 rounded-2xl px-4 py-3 text-blue-900 font-bold focus:outline-none focus:bg-white focus:border-yellow-400 transition-colors input-plastic placeholder-blue-300"
                    placeholder="••••••••">
                <x-input-error :messages="$errors->get('password')" class="mt-2 text-yellow-300 font-bold ml-2 bg-red-500 px-2 py-1 rounded-lg inline-block text-xs" />
            </div>

            <!-- Remember Me -->
            <div class="flex items-center ml-2">
                <label for="remember_me" class="inline-flex items-center cursor-pointer">
                    <div class="relative">
                        <input id="remember_me" type="checkbox" class="sr-only peer" name="remember">
                        <div class="w-10 h-6 bg-blue-700 rounded-full peer-checked:bg-green-400 peer-focus:ring-2 peer-focus:ring-yellow-300 transition-colors border-2 border-blue-800"></div>
                        <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                    </div>
                    <span class="ms-3 text-sm text-blue-100 font-bold uppercase tracking-wide">{{ __('Remember me') }}</span>
                </label>
            </div>

            <!-- Actions -->
            <div class="pt-2">
                <button type="submit" class="w-full bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-plastic text-2xl py-4 rounded-2xl border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 btn-plastic uppercase tracking-wider">
                    {{ __('Let\'s Go!') }}
                </button>
            </div>

             <div class="mt-6 text-center">
                @if (Route::has('password.request'))
                    <a class="underline text-sm text-blue-200 hover:text-white font-bold tracking-wide decoration-2 underline-offset-4" href="{{ route('password.request') }}">
                        {{ __('Forgot your password?') }}
                    </a>
                @endif
            </div>

        </form>
    </div>

    <!-- Decorative Bottom Text -->
     <div class="fixed bottom-4 text-slate-300 font-bold text-xs tracking-[0.2em] uppercase opacity-50">
        Plastic Series • Ver 1.0
    </div>

</body>
</html>
