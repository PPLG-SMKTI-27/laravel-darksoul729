<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tentang Kami - Menuju Sukses</title>
    
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
            <h1 class="text-3xl md:text-5xl font-bold tracking-tight mb-6">Tentang Kami</h1>
            <p class="text-slate-400 text-lg leading-relaxed">
                Membantu Anda mencapai potensi penuh melalui teknologi dan bimbingan profesional sejak 2019.
            </p>
        </div>
    </header>

    <main>
        <section class="py-20 px-6">
            <div class="max-w-4xl mx-auto text-center">
                <span class="text-brand-primary font-semibold tracking-wider uppercase text-sm">Siapa Kami?</span>
                <h2 class="text-3xl font-bold text-slate-900 mt-2 mb-8">Platform Terdepan untuk Kesuksesan</h2>
                <div class="text-lg text-slate-600 space-y-6 leading-relaxed text-justify md:text-center">
                    <p>
                        Menuju Sukses adalah platform inovatif yang dirancang khusus untuk memberdayakan individu dan organisasi. Dengan pengalaman lebih dari 5 tahun, kami telah membantu lebih dari 10,000 pengguna mencapai tujuan mereka.
                    </p>
                    <p>
                        Kami bukan sekadar platform, tetapi mitra perjalanan Anda. Dengan kombinasi teknologi canggih, komunitas supportif, dan bimbingan ahli, kami memastikan Anda tidak pernah merasa sendirian dalam perjalanan menuju sukses.
                    </p>
                </div>
            </div>
        </section>

        <section class="py-20 bg-brand-light px-6">
            <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                <div class="bg-white p-10 rounded-2xl border border-slate-200 hover:border-brand-primary transition shadow-sm">
                    <div class="w-12 h-12 bg-blue-50 text-brand-primary rounded-lg flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-900 mb-4">Misi Kami</h3>
                    <p class="text-slate-600 leading-relaxed">
                        Menyediakan platform komprehensif yang memberdayakan setiap individu untuk mencapai tujuan mereka melalui teknologi inovatif dan komunitas supportif.
                    </p>
                </div>

                <div class="bg-white p-10 rounded-2xl border border-slate-200 hover:border-brand-primary transition shadow-sm">
                    <div class="w-12 h-12 bg-blue-50 text-brand-primary rounded-lg flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-900 mb-4">Visi Kami</h3>
                    <p class="text-slate-600 leading-relaxed">
                        Menjadi katalis transformasi positif di Asia Tenggara, menciptakan ekosistem di mana setiap orang memiliki kesempatan yang sama untuk sukses.
                    </p>
                </div>
            </div>
        </section>

        <section class="py-20 px-6 max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold text-center text-slate-900 mb-12">Nilai Inti</h2>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="p-6 border border-slate-100 rounded-xl hover:shadow-lg transition">
                    <h4 class="font-bold text-brand-primary text-lg mb-2">Pemberdayaan</h4>
                    <p class="text-sm text-slate-500">Setiap orang berhak mendapatkan alat untuk mencapai potensi penuh.</p>
                </div>
                <div class="p-6 border border-slate-100 rounded-xl hover:shadow-lg transition">
                    <h4 class="font-bold text-brand-primary text-lg mb-2">Kolaborasi</h4>
                    <p class="text-sm text-slate-500">Bersama kita lebih kuat melalui komunitas yang saling mendukung.</p>
                </div>
                <div class="p-6 border border-slate-100 rounded-xl hover:shadow-lg transition">
                    <h4 class="font-bold text-brand-primary text-lg mb-2">Integritas</h4>
                    <p class="text-sm text-slate-500">Transparansi dan kejujuran dalam setiap interaksi.</p>
                </div>
                <div class="p-6 border border-slate-100 rounded-xl hover:shadow-lg transition">
                    <h4 class="font-bold text-brand-primary text-lg mb-2">Keunggulan</h4>
                    <p class="text-sm text-slate-500">Terus berinovasi untuk memberikan nilai terbaik.</p>
                </div>
                <div class="p-6 border border-slate-100 rounded-xl hover:shadow-lg transition">
                    <h4 class="font-bold text-brand-primary text-lg mb-2">Inovasi</h4>
                    <p class="text-sm text-slate-500">Mencari cara baru agar pengalaman pengguna makin baik.</p>
                </div>
                <div class="p-6 border border-slate-100 rounded-xl hover:shadow-lg transition">
                    <h4 class="font-bold text-brand-primary text-lg mb-2">Keberlanjutan</h4>
                    <p class="text-sm text-slate-500">Membangun solusi jangka panjang yang berdampak positif.</p>
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
                    <h3 class="text-4xl font-extrabold mb-1">120+</h3>
                    <p class="text-blue-100 text-sm">Mentor</p>
                </div>
                <div>
                    <h3 class="text-4xl font-extrabold mb-1">5</h3>
                    <p class="text-blue-100 text-sm">Negara</p>
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
                <h4 class="font-bold text-slate-900 mb-4">Perusahaan</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="#" class="hover:text-brand-primary">Tim Kami</a></li>
                    <li><a href="#" class="hover:text-brand-primary">Karir</a></li>
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
            &copy; 2026 Menuju Sukses. All rights reserved. | Designed with ❤️ by Kevin
        </div>
    </footer>

</body>
</html>
