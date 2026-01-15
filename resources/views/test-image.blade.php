<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Image - Menuju Sukses</title>
    
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
<body class="text-slate-600 bg-brand-light antialiased flex flex-col min-h-screen">

    @include('partials.navbar')

    <main class="flex-grow pt-32 pb-20 px-6">
        <div class="max-w-3xl mx-auto">
            
            <div class="text-center mb-10">
                <h1 class="text-3xl font-bold text-slate-900 mb-2">Tampilan Gambar</h1>
                <p class="text-slate-500">Halaman pengujian aset gambar statis.</p>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
                <div class="relative rounded-xl overflow-hidden bg-slate-100 aspect-video flex items-center justify-center group">
                    
                    <img src="{{ asset('img/cat.jpg') }}" alt="Test Image" class="w-full h-full object-cover transition duration-500 group-hover:scale-105">
                    
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-6">
                        <span class="text-white font-medium">img/cat.jpg</span>
                    </div>

                </div>
                <div class="mt-4 flex justify-between items-center px-2">
                    <span class="text-sm font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">Asset Path: img/cat.jpg</span>
                    <a href="/" class="text-sm font-semibold text-brand-primary hover:underline">Kembali ke Beranda &rarr;</a>
                </div>
            </div>

        </div>
    </main>

    <footer class="bg-white py-8 border-t border-slate-200 text-center text-sm text-slate-400">
        &copy; 2026 Menuju Sukses. All rights reserved.
    </footer>

</body>
</html>
