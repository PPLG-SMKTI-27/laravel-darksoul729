<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hubungi Kami - Menuju Sukses</title>
    
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
            <h1 class="text-3xl md:text-5xl font-bold tracking-tight mb-6">Hubungi Kami</h1>
            <p class="text-slate-400 text-lg leading-relaxed">
                Tim kami siap membantu Anda 24/7. Konsultasi, bantuan teknis, atau sekadar menyapa.
            </p>
        </div>
    </header>

    <main>
        <section class="py-12 -mt-10 px-6 relative z-10">
            <div class="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
                <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-lg text-center hover:-translate-y-1 transition duration-300">
                    <div class="w-12 h-12 mx-auto bg-blue-50 text-brand-primary rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                    </div>
                    <h3 class="font-bold text-slate-900 mb-1">Email</h3>
                    <a href="mailto:info@menujusukses.com" class="text-sm text-brand-primary hover:underline">info@menujusukses.com</a>
                </div>

                <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-lg text-center hover:-translate-y-1 transition duration-300">
                    <div class="w-12 h-12 mx-auto bg-blue-50 text-brand-primary rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                    </div>
                    <h3 class="font-bold text-slate-900 mb-1">Telepon</h3>
                    <a href="tel:+62812345678" class="text-sm text-brand-primary hover:underline">+62 812-3456-789</a>
                </div>

                <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-lg text-center hover:-translate-y-1 transition duration-300">
                    <div class="w-12 h-12 mx-auto bg-blue-50 text-brand-primary rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
                    </div>
                    <h3 class="font-bold text-slate-900 mb-1">WhatsApp</h3>
                    <a href="#" class="text-sm text-brand-primary hover:underline">Chat 24/7</a>
                </div>

                <div class="bg-white p-8 rounded-xl border border-slate-200 shadow-lg text-center hover:-translate-y-1 transition duration-300">
                    <div class="w-12 h-12 mx-auto bg-blue-50 text-brand-primary rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    </div>
                    <h3 class="font-bold text-slate-900 mb-1">Lokasi</h3>
                    <span class="text-sm text-slate-500">Jakarta, Indonesia</span>
                </div>
            </div>
        </section>

        <section class="py-20 px-6 bg-brand-light">
            <div class="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
                
                <div class="lg:col-span-2 bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 class="text-2xl font-bold text-slate-900 mb-8">Kirim Pesan</h2>
                    <form id="contactForm" class="space-y-6">
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                                <input type="text" class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-brand-primary focus:ring-2 focus:ring-blue-100 transition outline-none" placeholder="John Doe" required>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                <input type="email" class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-brand-primary focus:ring-2 focus:ring-blue-100 transition outline-none" placeholder="john@email.com" required>
                            </div>
                        </div>

                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">Nomor Telepon</label>
                                <input type="tel" class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-brand-primary focus:ring-2 focus:ring-blue-100 transition outline-none" placeholder="0812...">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">Kategori</label>
                                <select class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-brand-primary focus:ring-2 focus:ring-blue-100 transition outline-none bg-white">
                                    <option>Umum</option>
                                    <option>Kerjasama</option>
                                    <option>Bantuan Teknis</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Pesan</label>
                            <textarea rows="5" class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-brand-primary focus:ring-2 focus:ring-blue-100 transition outline-none" placeholder="Tulis pesan Anda..."></textarea>
                        </div>

                        <button class="w-full bg-brand-primary text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition">Kirim Pesan</button>
                    </form>
                </div>

                <div class="space-y-6">
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 class="font-bold text-slate-900 mb-2">Jam Operasional</h3>
                        <p class="text-sm text-slate-500">Senin - Jumat: 09.00 - 18.00</p>
                        <p class="text-sm text-slate-500">Sabtu: 09.00 - 14.00</p>
                    </div>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 class="font-bold text-slate-900 mb-2">Alamat</h3>
                        <p class="text-sm text-slate-500">Jl. Sudirman No. 123, Jakarta</p>
                    </div>
                    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 class="font-bold text-slate-900 mb-2">Support</h3>
                        <p class="text-sm text-slate-500">Tim kami siap membantu Anda 24/7.</p>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="bg-white py-8 border-t border-slate-200 text-center text-sm text-slate-400">
        &copy; 2026 Menuju Sukses. All rights reserved. | Designed with ❤️ by Kevin
    </footer>

</body>
</html>
