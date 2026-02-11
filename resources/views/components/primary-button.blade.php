<button {{ $attributes->merge(['type' => 'submit', 'class' => 'inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-b-4 border-blue-700 rounded-xl font-bold text-sm text-white uppercase tracking-widest active:border-b-0 active:translate-y-1 transition-all duration-150 shadow-lg']) }}>
    {{ $slot }}
</button>
