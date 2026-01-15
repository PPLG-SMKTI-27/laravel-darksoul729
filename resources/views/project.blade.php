<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project - Menuju Sukses</title>
    
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
            <h1 class="text-3xl md:text-5xl font-bold tracking-tight mb-6">Project Kami</h1>
            <p class="text-slate-400 text-lg leading-relaxed">
                Ringkasan progres dan rencana kerja agar setiap target tercapai tepat waktu.
            </p>
        </div>
    </header>

    <main>
        <section class="py-12 -mt-10 px-6 relative z-10">
            <div class="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
                <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-lg">
                    <div class="text-xs uppercase tracking-wider text-slate-400 mb-3">Pemilik Project</div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">{{ $name }}</h3>
                    <p class="text-sm text-slate-500">Penanggung jawab utama pengembangan dan eksekusi.</p>
                </div>

                <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-lg">
                    <div class="text-xs uppercase tracking-wider text-slate-400 mb-3">Status</div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">Aktif</h3>
                    <p class="text-sm text-slate-500">Sedang berjalan dengan fokus pada pertumbuhan dan stabilitas.</p>
                </div>

                <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-lg">
                    <div class="text-xs uppercase tracking-wider text-slate-400 mb-3">Target Rilis</div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">Q3 2026</h3>
                    <p class="text-sm text-slate-500">Milestone utama ditutup dengan evaluasi mingguan.</p>
                </div>
            </div>
        </section>

        <section class="py-20 px-6">
            <div class="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <span class="text-brand-primary font-semibold tracking-wider uppercase text-sm">Ringkasan</span>
                    <h2 class="text-3xl font-bold text-slate-900 mt-3 mb-6">Rencana Kerja Utama</h2>
                    <p class="text-slate-600 leading-relaxed">
                        Setiap tahapan difokuskan pada kualitas dan kejelasan arah, mulai dari riset, prototyping,
                        hingga peluncuran yang siap digunakan pengguna.
                    </p>
                    <div class="mt-8 flex flex-wrap gap-3">
                        <span class="px-4 py-2 rounded-full bg-brand-primary text-white text-sm font-semibold">Update Mingguan</span>
                        <span class="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold">Monitoring KPI</span>
                    </div>
                </div>

                <div class="bg-brand-light border border-slate-200 rounded-2xl p-8">
                    <ul class="space-y-5">
                        <li class="flex items-start gap-4">
                            <span class="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-brand-primary font-bold">01</span>
                            <div>
                                <h3 class="font-bold text-slate-900">Riset & Validasi</h3>
                                <p class="text-sm text-slate-500">Mengumpulkan insight pengguna dan memastikan kebutuhan utama.</p>
                            </div>
                        </li>
                        <li class="flex items-start gap-4">
                            <span class="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-brand-primary font-bold">02</span>
                            <div>
                                <h3 class="font-bold text-slate-900">Desain & Prototipe</h3>
                                <p class="text-sm text-slate-500">Membuat alur yang jelas untuk pengalaman pengguna terbaik.</p>
                            </div>
                        </li>
                        <li class="flex items-start gap-4">
                            <span class="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-brand-primary font-bold">03</span>
                            <div>
                                <h3 class="font-bold text-slate-900">Implementasi</h3>
                                <p class="text-sm text-slate-500">Pengembangan inti dan integrasi fitur prioritas.</p>
                            </div>
                        </li>
                        <li class="flex items-start gap-4">
                            <span class="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-brand-primary font-bold">04</span>
                            <div>
                                <h3 class="font-bold text-slate-900">Peluncuran</h3>
                                <p class="text-sm text-slate-500">Uji coba akhir, perbaikan, dan release bertahap.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <section class="py-16 bg-brand-primary text-white">
            <div class="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-500/30">
                <div>
                    <h3 class="text-4xl font-extrabold mb-1">12</h3>
                    <p class="text-blue-100 text-sm">Sprint</p>
                </div>
                <div>
                    <h3 class="text-4xl font-extrabold mb-1">4</h3>
                    <p class="text-blue-100 text-sm">Tim Inti</p>
                </div>
                <div>
                    <h3 class="text-4xl font-extrabold mb-1">18</h3>
                    <p class="text-blue-100 text-sm">Fitur Prioritas</p>
                </div>
                <div>
                    <h3 class="text-4xl font-extrabold mb-1">98%</h3>
                    <p class="text-blue-100 text-sm">Target Capaian</p>
                </div>
            </div>
        </section>

        <section class="py-20 px-6 bg-white">
            <div class="max-w-4xl mx-auto text-center">
                <h2 class="text-3xl font-bold text-slate-900 mb-4">Siap melangkah ke tahap berikutnya?</h2>
                <p class="text-slate-500 mb-8">
                    Kami terbuka untuk kolaborasi, masukan, dan ide baru demi membuat project ini lebih matang.
                </p>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <a href="/contact" class="px-8 py-3 bg-brand-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition">Diskusi Project</a>
                    <a href="/feature" class="px-8 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition">Lihat Fitur</a>
                </div>
            </div>
        </section>
    </main>

    <footer class="bg-white pt-16 pb-8 border-t border-slate-200">
        <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-12">
            <div class="col-span-1 md:col-span-2">
                <span class="font-bold text-slate-900 text-lg">Menuju Sukses</span>
                <p class="mt-4 text-sm text-slate-500 max-w-xs">Membantu Anda mencapai tujuan hidup.</p>
            </div>
            <div>
                <h4 class="font-bold text-slate-900 mb-4">Produk</h4>
                <ul class="space-y-2 text-sm">
                    <li><a href="#" class="hover:text-brand-primary">Fitur</a></li>
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
            &copy; 2026 Menuju Sukses. All rights reserved. | Designed with love by Kevin
        </div>
    </footer>

</body>
</html>
