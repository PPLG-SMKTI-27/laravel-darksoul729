<div id="cursor-dot"></div>
<div id="cursor-ring"></div>
<canvas id="webgl-canvas"></canvas>
<div class="texture-noise"></div>
<div class="texture-vignette"></div>
<div class="scanlines"></div>

<!-- Page Transition Overlay -->
<div id="transition-overlay" class="fixed inset-0 z-[9999] pointer-events-none flex flex-col h-screen w-full">
    <!-- Top Half -->
    <div id="transition-top" class="relative bg-black h-1/2 w-full transform -translate-y-full will-change-transform z-50 flex items-end justify-center overflow-visible">
        <!-- Jagged Edge Bottom -->
        <div class="absolute -bottom-12 left-0 w-full h-12 bg-black" style="clip-path: polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%);"></div>
        <!-- Logo -->
        <div class="mb-8 text-4xl font-graffiti text-white">PNZK</div>
    </div>
    
    <!-- Bottom Half -->
    <div id="transition-bottom" class="relative bg-black h-1/2 w-full transform translate-y-full will-change-transform z-50 flex items-start justify-center overflow-visible">
        <!-- Jagged Edge Top -->
        <div class="absolute -top-12 left-0 w-full h-12 bg-black" style="clip-path: polygon(0% 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%);"></div>
        <div class="mt-8 font-mono text-xs text-brand-acid uppercase tracking-widest">Loading Resources...</div>
    </div>
</div>

<svg style="display: none;">
    <defs>
        <filter id="liquify">
            <feTurbulence baseFrequency="0.015" numOctaves="3" result="warp" type="fractalNoise"></feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="3" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
        </filter>
        <filter id="turbulence">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
        </filter>
    </defs>
</svg>
