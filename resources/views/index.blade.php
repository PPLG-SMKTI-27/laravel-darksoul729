<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menuju Sukses - Modern Platform</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'sans-serif'] },
                    colors: {
                        brand: {
                            dark: '#0f172a', /* Slate 900 */
                            primary: '#2563eb', /* Blue 600 */
                            light: '#f8fafc' /* Slate 50 */
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="text-slate-600 bg-white antialiased">

    @include('partials.navbar')

    <section id="home" class="pt-32 pb-20 bg-brand-dark text-white text-center px-6">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Bangun Masa Depan <span class="text-blue-500">Tanpa Batas</span>
            </h1>
            <p class="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                Platform modern untuk merencanakan, melacak, dan mencapai target hidup Anda dengan data yang akurat.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <a href="#" class="px-8 py-3 bg-brand-primary rounded-lg font-semibold hover:bg-blue-600 transition">Mulai Gratis</a>
                <a href="#" class="px-8 py-3 bg-slate-800 border border-slate-700 rounded-lg font-semibold hover:bg-slate-700 transition">Pelajari Dulu</a>
            </div>
        </div>
    </section>

    <section id="features" class="py-24 px-6 bg-white">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-slate-900 mb-4">Fitur Utama</h2>
                <p class="text-slate-500">Semua yang Anda butuhkan dalam satu tempat.</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="p-8 border border-slate-200 rounded-xl hover:border-blue-500 transition group">
                    <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-3">Analitik Real-time</h3>
                    <p class="text-sm leading-relaxed">Pantau progress Anda dengan dashboard data yang bersih.</p>
                </div>

                <div class="p-8 border border-slate-200 rounded-xl hover:border-blue-500 transition group">
                    <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-3">Sistem Cepat</h3>
                    <p class="text-sm leading-relaxed">Akses platform tanpa loading lama di perangkat apapun.</p>
                </div>

                <div class="p-8 border border-slate-200 rounded-xl hover:border-blue-500 transition group">
                    <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-3">Keamanan Data</h3>
                    <p class="text-sm leading-relaxed">Enkripsi tingkat perusahaan untuk melindungi privasi Anda.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="py-16 bg-brand-primary text-white">
        <div class="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-500/30">
            <div>
                <h3 class="text-4xl font-extrabold mb-1">10K+</h3>
                <p class="text-blue-100 text-sm">Pengguna</p>
            </div>
            <div>
                <h3 class="text-4xl font-extrabold mb-1">95%</h3>
                <p class="text-blue-100 text-sm">Kepuasan</p>
            </div>
            <div>
                <h3 class="text-4xl font-extrabold mb-1">50+</h3>
                <p class="text-blue-100 text-sm">Fitur</p>
            </div>
            <div>
                <h3 class="text-4xl font-extrabold mb-1">24/7</h3>
                <p class="text-blue-100 text-sm">Support</p>
            </div>
        </div>
    </section>

    <footer class="bg-brand-light pt-16 pb-8 border-t border-slate-200">
        <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
            <div class="col-span-1 md:col-span-2">
                <span class="font-bold text-slate-900 text-lg">🚀 Menuju Sukses</span>
                <p class="mt-4 text-sm text-slate-500 max-w-xs">Membantu Anda mencapai tujuan hidup dengan lebih efektif dan terukur.</p>
            </div>
            <div>
                <h4 class="font-bold text-slate-900 mb-4">Produk</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="#" class="hover:text-brand-primary">Fitur</a></li>
                    <li><a href="#" class="hover:text-brand-primary">Integrasi</a></li>
                    <li><a href="#" class="hover:text-brand-primary">Harga</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-bold text-slate-900 mb-4">Legal</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="#" class="hover:text-brand-primary">Privasi</a></li>
                    <li><a href="#" class="hover:text-brand-primary">Syarat</a></li>
                </ul>
            </div>
        </div>
        <div class="text-center text-sm text-slate-400 pt-8 border-t border-slate-200">
            &copy; 2026 Menuju Sukses. All rights reserved.
        </div>
    </footer>

</body>
</html>
