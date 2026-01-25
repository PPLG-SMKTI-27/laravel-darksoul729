<div id="cursor-dot"></div>
<div id="cursor-ring"></div>
<canvas id="webgl-canvas"></canvas>
<div class="texture-noise"></div>
<div class="texture-vignette"></div>
<div class="scanlines"></div>

<!-- Page Transition Overlay -->
<!-- Page Transition Overlay (Digital Tunnel) -->
<div id="transition-overlay" class="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center bg-black opacity-100 will-change-opacity">
    <div class="tunnel-content text-center">
        <div class="mb-4 text-6xl font-graffiti text-white animate-pulse">PNZK</div>
        <div class="font-mono text-xs text-brand-acid uppercase tracking-[0.5em]">SYSTEM LOADING...</div>
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
