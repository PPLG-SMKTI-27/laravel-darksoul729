<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fitur - Menuju Sukses</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'sans-serif'] },
                    colors: {
                        brand: {
                            dark: '#0f172a',    /* Slate 900 */
                            primary: '#2563eb', /* Blue 600 */
                            light: '#f8fafc'    /* Slate 50 */
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="text-slate-600 bg-white antialiased">

    @include('partials.navbar')

    <header class="pt-32 pb-20 bg-brand-dark text-white text-center px-6">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-3xl md:text-5xl font-bold tracking-tight mb-6">Fitur Unggulan</h1>
            <p class="text-slate-400 text-lg leading-relaxed">
                Temukan alat canggih yang dirancang untuk memaksimalkan produktivitas dan kesuksesan Anda.
            </p>
        </div>
    </header>

    <main class="bg-white">
        
        <section class="py-20 px-6 max-w-6xl mx-auto">
            <div class="flex flex-wrap justify-center gap-3 mb-12">
                <button class="px-6 py-2 rounded-full text-sm font-semibold bg-brand-primary text-white">Semua</button>
                <button class="px-6 py-2 rounded-full text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200">Productivity</button>
                <button class="px-6 py-2 rounded-full text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200">Analytics</button>
                <button class="px-6 py-2 rounded-full text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200">Collab</button>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <div class="p-8 border border-slate-200 rounded-xl hover:border-brand-primary transition group bg-white">
                    <div class="w-12 h-12 bg-blue-50 text-brand-primary rounded-lg flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">Dashboard Analytics</h3>
                    <p class="text-sm mb-4">Visualisasi data real-time yang mudah dipahami.</p>
                    <ul class="text-sm space-y-2 text-slate-500">
                        <li class="flex items-center gap-2"><span class="text-brand-primary">✓</span> Custom widgets</li>
                        <li class="flex items-center gap-2"><span class="text-brand-primary">✓</span> Data export</li>
                    </ul>
                </div>

                <div class="p-8 border border-slate-200 rounded-xl hover:border-brand-primary transition group bg-white">
                    <div class="w-12 h-12 bg-blue-50 text-brand-primary rounded-lg flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">Goal Tracking</h3>
                    <p class="text-sm mb-4">Tetapkan dan pantau tujuan dengan sistem tracking.</p>
                    <ul class="text-sm space-y-2 text-slate-500">
                        <li class="flex items-center gap-2"><span class="text-brand-primary">✓</span> Milestone tracking</li>
                        <li class="flex items-center gap-2"><span class="text-brand-primary">✓</span> Reminders</li>
                    </ul>
                </div>

                <div class="p-8 border border-slate-200 rounded-xl hover:border-brand-primary transition group bg-white">
                    <div class="w-12 h-12 bg-blue-50 text-brand-primary rounded-lg flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">Smart Scheduling</h3>
                    <p class="text-sm mb-4">Kelola waktu dengan kalender pintar otomatis.</p>
                    <ul class="text-sm space-y-2 text-slate-500">
                        <li class="flex items-center gap-2"><span class="text-brand-primary">✓</span> Auto scheduling</li>
                        <li class="flex items-center gap-2"><span class="text-brand-primary">✓</span> Conflict detection</li>
                    </ul>
                </div>
                
                <div class="p-8 border border-slate-200 rounded-xl hover:border-brand-primary transition group bg-white">
                    <div class="w-12 h-12 bg-blue-50 text-brand-primary rounded-lg flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">Collaboration</h3>
                    <p class="text-sm mb-4">Kerja sama tim real-time tanpa hambatan.</p>
                </div>

                <div class="p-8 border border-slate-200 rounded-xl hover:border-brand-primary transition group bg-white">
                    <div class="w-12 h-12 bg-blue-50 text-brand-primary rounded-lg flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">Security</h3>
                    <p class="text-sm mb-4">Proteksi data level enterprise & enkripsi 256-bit.</p>
                </div>

                <div class="p-8 border border-slate-200 rounded-xl hover:border-brand-primary transition group bg-white">
                    <div class="w-12 h-12 bg-blue-50 text-brand-primary rounded-lg flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">Automation</h3>
                    <p class="text-sm mb-4">Otomasi tugas berulang agar tim lebih fokus pada strategi.</p>
                </div>
            </div>
        </section>
    </main>

    <footer class="bg-white pt-16 pb-8 border-t border-slate-200">
        <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
            <div class="col-span-1 md:col-span-2">
                <span class="font-bold text-slate-900 text-lg">🚀 Menuju Sukses</span>
                <p class="mt-4 text-sm text-slate-500 max-w-xs">Membantu Anda mencapai tujuan hidup.</p>
            </div>
            <div>
                <h4 class="font-bold text-slate-900 mb-4">Produk</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="#" class="hover:text-brand-primary">Fitur</a></li>
                    <li><a href="#" class="hover:text-brand-primary">Pricing</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-bold text-slate-900 mb-4">Legal</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="#" class="hover:text-brand-primary">Privacy</a></li>
                    <li><a href="#" class="hover:text-brand-primary">Terms</a></li>
                </ul>
            </div>
        </div>
        <div class="text-center text-sm text-slate-400 pt-8 border-t border-slate-200">
            &copy; 2026 Menuju Sukses. All rights reserved.
        </div>
    </footer>

</body>
</html>
