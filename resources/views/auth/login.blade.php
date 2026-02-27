<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Login - {{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Titan+One&family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet">


    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        body {
            font-family: 'Nunito', sans-serif;
            background-color: #f8fafc; /* bg-slate-50 */
        }
        .btn-plastic {
            transition: all 0.1s;
            box-shadow: 
                inset 0px 4px 0px rgba(255,255,255,0.4),
                inset 0px -4px 0px rgba(0,0,0,0.1),
                0px 6px 0px rgba(0,0,0,0.2);
        }
        .btn-plastic:active {
            transform: translateY(4px) scale(0.98);
            box-shadow: 
                inset 0px 4px 0px rgba(255,255,255,0.4),
                0px 2px 0px rgba(0,0,0,0.2);
        }
        /* Hidden initially to prevent FOUC before React mounts */
        #blade-content {
            opacity: 0;
            animation: fadeIn 0.5s ease-out forwards;
            animation-delay: 0.2s;
        }
        @keyframes fadeIn {
            to { opacity: 1; }
        }
        
        .back-button-plastic {
            transition: all 0.1s;
            box-shadow: 
                0px 4px 0px #cbd5e1;
        }
        .back-button-plastic:active {
            transform: translateY(4px);
            box-shadow: none;
        }
    </style>
</head>
<body class="antialiased selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden relative">
    
    <!-- BACK BUTTON -->
    <div class="absolute top-6 left-6 z-50">
        <a href="/"
            class="group flex items-center gap-2 px-5 py-2.5 bg-white text-slate-600 font-black rounded-xl border-2 border-slate-200 back-button-plastic hover:bg-slate-50 transition-colors"
        >
            <span class="text-lg">↩</span>
            <span class="hidden md:inline">Return</span>
        </a>
    </div>

    <!-- The actual Blade Login UI (Sync'd with Contact.jsx design) -->
        <div id="blade-content" class="relative min-h-[90vh] flex items-center justify-center p-4 md:p-8 w-full z-10 pt-24 md:pt-32">
            
            <div class="w-full max-w-5xl">
                <!-- The Device Chassis -->
                <div class="relative bg-slate-100 rounded-3xl md:rounded-[3rem] p-2 md:p-4 shadow-xl md:shadow-2xl border-2 md:border-4 border-white ring-2 md:ring-4 ring-slate-200/50">
                    
                    <!-- Screws / Hardware Details (Desktop Only) -->
                    <div class="hidden md:flex absolute top-6 left-6 w-4 h-4 bg-slate-300 rounded-full items-center justify-center shadow-inner"><div class="w-2 h-0.5 bg-slate-400 rotate-45"></div></div>
                    <div class="hidden md:flex absolute top-6 right-6 w-4 h-4 bg-slate-300 rounded-full items-center justify-center shadow-inner"><div class="w-2 h-0.5 bg-slate-400 rotate-45"></div></div>
                    <div class="hidden md:flex absolute bottom-6 left-6 w-4 h-4 bg-slate-300 rounded-full items-center justify-center shadow-inner"><div class="w-2 h-0.5 bg-slate-400 rotate-45"></div></div>
                    <div class="hidden md:flex absolute bottom-6 right-6 w-4 h-4 bg-slate-300 rounded-full items-center justify-center shadow-inner"><div class="w-2 h-0.5 bg-slate-400 rotate-45"></div></div>

                    <!-- Inner Interface Panel -->
                    <div class="bg-white rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-inner min-h-[auto] md:min-h-[600px] flex flex-col md:flex-row">
                        
                        <!-- LEFT PANEL: Branding & Info -->
                        <div class="w-full md:w-5/12 bg-slate-50 p-6 md:p-12 flex flex-col justify-between border-b-2 md:border-b-0 md:border-r-2 border-slate-100 relative overflow-hidden">
                            <!-- Decorative background blob -->
                            <div class="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-60 pointer-events-none transform translate-x-10 -translate-y-10"></div>
                            
                            <div class="relative z-10">
                                <h2 class="text-[10px] md:text-xs font-black tracking-[0.3em] text-slate-400 mb-4 md:mb-6 uppercase">Authentication Module</h2>
                                <h1 class="text-4xl md:text-6xl font-black text-slate-900 leading-[0.9] mb-4">
                                    <span class="block" style="text-shadow: 3px 3px 0px #cbd5e1;">ACCESS</span>
                                    <span class="block text-blue-600 mt-2" style="text-shadow: 5px 5px 0px #1e3a8a;">GRANTED</span>
                                </h1>
                                <p class="text-slate-500 font-bold text-base md:text-lg leading-snug max-w-xs">
                                    Welcome back, Commander.<br/> Enter your credentials to continue.
                                </p>
                            </div>

                            <div class="relative z-10 mt-8 hidden md:block">
                                <!-- CSS Illustration of a Key or Lock -->
                                <div class="w-20 h-20 bg-white rounded-2xl border-4 border-slate-200 shadow-lg flex items-center justify-center transform -rotate-12 transition-transform hover:rotate-0 cursor-default">
                                    <div class="text-4xl">🔐</div>
                                </div>
                            </div>

                            <div class="mt-8 relative z-10 hidden md:block">
                                <div class="inline-block bg-slate-800 text-white px-3 py-1.5 rounded-lg font-black text-xs uppercase tracking-widest bg-opacity-90">
                                    System v3.0
                                </div>
                            </div>
                        </div>

                        <!-- RIGHT PANEL: The Form -->
                        <div class="w-full md:w-7/12 p-6 md:p-12 bg-white relative flex flex-col justify-center">
                            
                            <!-- Session Status -->
                            @if (session('status'))
                                <div class="mb-4 font-bold text-sm text-green-600 bg-green-50 p-3 rounded-xl border border-green-200">
                                    {{ session('status') }}
                                </div>
                            @endif

                            <form method="POST" action="{{ route('login') }}" class="w-full space-y-5 md:space-y-6">
                                @csrf

                                <!-- Email Address -->
                                <div class="relative group">
                                    <label for="email" class="absolute left-4 top-2 md:top-3 pointer-events-none font-bold uppercase tracking-wider text-[10px] md:text-xs text-blue-500">
                                        Secure Email
                                    </label>
                                    <input id="email" type="email" name="email" value="{{ old('email') }}" required autofocus
                                        class="w-full bg-slate-50 border-2 border-slate-200 rounded-xl md:rounded-2xl px-4 pt-6 md:pt-8 pb-2 md:pb-3 font-bold text-sm md:text-base text-slate-800 focus:outline-none focus:bg-blue-50/30 focus:border-blue-400 transition-all placeholder-slate-300"
                                        placeholder="commander@darksoul.dev">
                                    
                                    @error('email')
                                        <p class="text-red-500 text-xs font-bold mt-1.5 ml-1">{{ $message }}</p>
                                    @enderror
                                </div>

                                <!-- Password -->
                                <div class="relative group">
                                    <label for="password" class="absolute left-4 top-2 md:top-3 pointer-events-none font-bold uppercase tracking-wider text-[10px] md:text-xs text-blue-500">
                                        Password
                                    </label>
                                    <input id="password" type="password" name="password" required autocomplete="current-password"
                                        class="w-full bg-slate-50 border-2 border-slate-200 rounded-xl md:rounded-2xl px-4 pt-6 md:pt-8 pb-2 md:pb-3 font-bold text-sm md:text-base text-slate-800 focus:outline-none focus:bg-blue-50/30 focus:border-blue-400 transition-all placeholder-slate-300"
                                        placeholder="••••••••">
                                        
                                    @error('password')
                                        <p class="text-red-500 text-xs font-bold mt-1.5 ml-1">{{ $message }}</p>
                                    @enderror
                                </div>

                                <!-- Remember Me & Forgot Password -->
                                <div class="flex items-center justify-between px-1">
                                    <label for="remember_me" class="inline-flex items-center cursor-pointer group">
                                        <input id="remember_me" type="checkbox" class="rounded border-slate-300 text-blue-500 shadow-sm focus:ring-blue-500" name="remember">
                                        <span class="ms-2 text-xs md:text-sm text-slate-500 font-bold tracking-wide group-hover:text-slate-700 transition-colors">{{ __('Remember me') }}</span>
                                    </label>

                                    @if (Route::has('password.request'))
                                        <a class="text-xs md:text-sm text-slate-400 hover:text-blue-500 font-bold tracking-wide transition-colors" href="{{ route('password.request') }}">
                                            {{ __('Forgot password?') }}
                                        </a>
                                    @endif
                                </div>

                                <!-- Submit Button -->
                                <div class="pt-2">
                                    <button type="submit" class="w-full bg-blue-500 hover:bg-blue-400 text-white font-black text-lg md:text-xl py-3 md:py-4 rounded-xl md:rounded-2xl border-b-4 border-blue-700 btn-plastic tracking-widest">
                                        LOG IN
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Plastic Card 'Feet' for the device (Desktop Only) -->
                <div class="hidden md:flex justify-between px-16 -mt-6 relative z-0">
                    <div class="w-24 h-8 bg-slate-200 rounded-b-2xl shadow-md border-2 border-t-0 border-white"></div>
                    <div class="w-24 h-8 bg-slate-200 rounded-b-2xl shadow-md border-2 border-t-0 border-white"></div>
                </div>
            </div>

        </div>

</body>
</html>
