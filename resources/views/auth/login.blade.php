<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
    @include('partials.head')
</head>
<body data-scroll-container class="flex flex-col min-h-screen">
    @include('partials.ui')
    @include('partials.navbar')

    <main class="flex-grow flex items-center justify-center pt-32 pb-12 px-6 relative z-10 w-full">
        <div class="w-full max-w-md bg-[#050505] border border-white/10 relative overflow-hidden group hover:border-white/30 transition duration-500">
            
            <!-- Deco -->
            <div class="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
            
            <div class="p-8 text-center border-b border-white/10">
                <h2 class="text-3xl font-display font-bold text-white mb-2 uppercase tracking-wide">ACCESS PORTAL</h2>
                <p class="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Identify yourself to proceed.</p>
            </div>

            <div class="p-8">
                <div class="grid grid-cols-2 gap-4 mb-8">
                    <button class="flex items-center justify-center gap-2 py-3 border border-gray-800 hover:bg-white hover:text-black hover:border-white transition text-xs font-mono font-bold text-gray-400 uppercase tracking-widest group/btn">
                        <svg class="w-4 h-4 grayscale group-hover/btn:grayscale-0 transition" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" class="text-white group-hover/btn:text-[#4285F4]"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Google
                    </button>
                    <button class="flex items-center justify-center gap-2 py-3 border border-gray-800 hover:bg-white hover:text-black hover:border-white transition text-xs font-mono font-bold text-gray-400 uppercase tracking-widest group/btn">
                        <svg class="w-4 h-4 text-white group-hover/btn:text-black transition" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        GitHub
                    </button>
                </div>

                <div class="relative flex items-center mb-8">
                    <div class="flex-grow border-t border-gray-800"></div>
                    <span class="flex-shrink-0 mx-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">Or Authenticate Manually</span>
                    <div class="flex-grow border-t border-gray-800"></div>
                </div>

                <form action="{{ route('login') }}" method="POST" class="space-y-6">
                    @csrf
                    <div>
                        <label for="email" class="block text-xs font-mono font-bold text-gray-400 mb-2 uppercase tracking-widest">User / Email</label>
                        <div class="relative group">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span class="text-gray-600 group-hover:text-white transition">@</span>
                            </div>
                            <input type="email" name="email" id="email" class="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-gray-800 text-white placeholder-gray-700 focus:border-white focus:bg-black focus:outline-none transition font-mono text-xs rounded-none" placeholder="USER@DOMAIN.COM" value="{{ old('email') }}" required>
                            @error('email')
                                <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <label for="password" class="block text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Passcode</label>
                        </div>
                        <div class="relative group">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span class="text-gray-600 group-hover:text-white transition">#</span>
                            </div>
                            <input type="password" name="password" id="password" class="w-full pl-10 pr-10 py-3 bg-[#0a0a0a] border border-gray-800 text-white placeholder-gray-700 focus:border-white focus:bg-black focus:outline-none transition font-mono text-xs rounded-none" placeholder="••••••••" required>
                            @error('password')
                                <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                            @enderror
                            
                            <button type="button" onclick="togglePassword()" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-white focus:outline-none transition">
                                <svg id="eyeIcon" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                                </svg>
                                <svg id="eyeOffIcon" class="h-4 w-4 hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input id="remember-me" name="remember" type="checkbox" class="h-4 w-4 bg-black border-gray-700 text-white rounded focus:ring-offset-0 focus:ring-0 cursor-pointer">
                            <label for="remember-me" class="ml-2 block text-xs font-mono text-gray-500 cursor-pointer hover:text-white transition">Remember Identity</label>
                        </div>
                        <div class="text-xs font-mono">
                            <a href="#" class="text-gray-500 hover:text-white transition">Lost Code?</a>
                        </div>
                    </div>

                    <button type="submit" class="w-full bg-white text-black font-display font-bold uppercase py-4 rounded-none hover:bg-gray-300 transition tracking-widest border border-white">
                        Enter System
                    </button>
                </form>
            </div>
            
            <div class="px-8 py-4 bg-[#0a0a0a] border-t border-white/5 text-center text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                By accessing, you accept the <a href="#" class="text-gray-400 hover:text-white underline">Vandal Protocol</a>.
            </div>
        </div>
    </main>

    <footer class="py-8 text-center text-xs font-mono text-gray-600 uppercase tracking-widest">
        © 2026 PANZEKK SYSTEM
    </footer>

    <script>
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const eyeIcon = document.getElementById('eyeIcon');
            const eyeOffIcon = document.getElementById('eyeOffIcon');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.classList.add('hidden');
                eyeOffIcon.classList.remove('hidden');
            } else {
                passwordInput.type = 'password';
                eyeIcon.classList.remove('hidden');
                eyeOffIcon.classList.add('hidden');
            }
        }
    </script>
    @include('partials.scripts')
</body>
</html>
