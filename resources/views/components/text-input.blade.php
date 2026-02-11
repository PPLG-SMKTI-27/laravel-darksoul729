@props(['disabled' => false])

<input @disabled($disabled) {{ $attributes->merge(['class' => 'border-2 border-blue-200 focus:border-pink-500 focus:ring-pink-500 rounded-xl shadow-sm bg-blue-50/50 text-slate-700 transition-all duration-300 placeholder-slate-400']) }}>
