<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="PANZEKK - Digital Vandal Portfolio V2 Ultimate">
<meta name="author" content="Kevin Hermansyah">
<meta name="csrf-token" content="{{ csrf_token() }}">
<title>PANZEKK</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;700&family=Rubik+Wet+Paint&display=swap" rel="stylesheet">

<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/htmx.org@1.9.10" integrity="sha384-D1Kt99CQMDuVetoL1lrYwg5t+9QdHe7NLX/SoJYkXDFfX37iInKRy5xLSi8nO7UC" crossorigin="anonymous"></script>

<script>
    tailwind.config = {
        theme: {
            extend: {
                fontFamily: { 
                    sans: ['Inter', 'sans-serif'],
                    display: ['Space Grotesk', 'sans-serif'],
                    // The primary graffiti font
                    graffiti: ['"Rubik Wet Paint"', 'cursive'] 
                },
                colors: {
                    void: '#030303',
                    concrete: '#111111',
                    ash: '#222222',
                    mist: '#888888',
                    paper: '#eeeeee',
                    spray: '#ffffff',
                    acid: '#ccff00',
                    blood: '#ff0000'
                },
                backgroundImage: {
                    'noise': "url('https://www.transparenttextures.com/patterns/stardust.png')",
                },
                cursor: {
                    'none': 'none',
                },
                screens: {
                    'xs': '475px',
                    '3xl': '1600px',
                }
            }
        }
    }
</script>

<style>
    /* ========================================
    CORE RESET & VARIABLES
    ========================================
    */
    :root {
        --cursor-size: 20px;
        --spray-color: rgba(255, 255, 255, 0.15);
        --primary-color: #ffffff;
        --accent-color: #ff003c;
        --easing: cubic-bezier(0.19, 1, 0.22, 1);
    }

    *, *::before, *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    html, body {
        width: 100%;
        height: 100%;
        background-color: #030303;
        color: #eeeeee;
        cursor: none; /* Custom Cursor Active */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
    }

    ::selection {
        background: var(--accent-color);
        color: #fff;
    }

    /* ========================================
    SCROLL BEHAVIOR (LENIS)
    ========================================
    */
    html.lenis { height: auto; }
    .lenis.lenis-smooth { scroll-behavior: auto; }
    .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
    .lenis.lenis-stopped { overflow: hidden; }

    /* ========================================
    TEXTURES & FILTERS
    ========================================
    */
    .texture-noise {
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        pointer-events: none;
        z-index: 9000;
        opacity: 0.4;
    }

    .texture-vignette {
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%);
        pointer-events: none;
        z-index: 8999;
    }

    .scanlines {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
        background-size: 100% 4px;
        pointer-events: none;
        z-index: 8998;
        opacity: 0.3;
    }

    /* ========================================
    TYPOGRAPHY UTILITIES
    ========================================
    */
    .liquid-text {
        filter: url('#liquify');
        display: inline-block;
        will-change: transform;
    }

    .text-stroke-white {
        -webkit-text-stroke: 1px white;
        color: transparent;
    }
    
    .text-stroke-black {
        -webkit-text-stroke: 1px black;
        color: transparent;
    }

    .font-graffiti {
        /* Force the graffiti font on elements with this class */
        font-family: 'Rubik Wet Paint', cursive; 
    }

    /* Responsive Typography Clamp */
    .clamp-xl { font-size: clamp(3rem, 10vw, 12rem); }
    .clamp-lg { font-size: clamp(2rem, 5vw, 6rem); }
    .clamp-md { font-size: clamp(1.5rem, 3vw, 4rem); }

    /* ========================================
    CUSTOM CURSOR
    ========================================
    */
    #cursor-dot {
        width: var(--cursor-size);
        height: var(--cursor-size);
        background-color: white;
        position: fixed;
        border-radius: 50%;
        z-index: 10000;
        pointer-events: none;
        transform: translate(-50%, -50%);
        mix-blend-mode: exclusion;
        transition: width 0.3s, height 0.3s, background-color 0.3s;
    }

    #cursor-ring {
        width: 50px;
        height: 50px;
        border: 1px solid rgba(255, 255, 255, 0.5);
        position: fixed;
        border-radius: 50%;
        z-index: 9999;
        pointer-events: none;
        transform: translate(-50%, -50%);
        mix-blend-mode: exclusion; /* Changed to match dot for visibility */
        transition: width 0.3s, height 0.3s, border-color 0.3s;
    }

    /* Interaction States */
    body.hovering #cursor-dot {
        width: 10px;
        height: 10px;
        background-color: var(--accent-color);
    }
    body.hovering #cursor-ring {
        width: 80px;
        height: 80px;
        border-color: white;
        border-style: dashed;
        animation: spin 4s linear infinite;
    }

    @keyframes spin {
        to { transform: translate(-50%, -50%) rotate(360deg); }
    }

    /* ========================================
    LOADER
    ========================================
    */
    .loader-wrap {
        position: fixed;
        inset: 0;
        background: #030303;
        z-index: 20000;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    
    .loader-text {
        font-family: 'Rubik Wet Paint', cursive;
        font-size: 15vw;
        line-height: 0.8;
        color: #1a1a1a;
        position: relative;
        -webkit-text-stroke: 1px #333;
    }

    .loader-text::before {
        content: attr(data-text);
        position: absolute;
        top: 0; left: 0;
        width: 0%;
        height: 100%;
        color: #fff;
        -webkit-text-stroke: 0px;
        overflow: hidden;
        border-right: 2px solid white;
        animation: loadText 2s var(--easing) forwards;
    }

    @keyframes loadText {
        0% { width: 0%; }
        100% { width: 100%; border-color: transparent; }
    }

    /* ========================================
    GLITCH EFFECTS
    ========================================
    */
    .glitch { position: relative; }
    .glitch::before, .glitch::after {
        content: attr(data-text);
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background: #030303;
    }
    .glitch::before {
        left: 2px;
        text-shadow: -1px 0 #ff00c1;
        clip: rect(44px, 450px, 56px, 0);
        animation: glitch-anim 5s infinite linear alternate-reverse;
    }
    .glitch::after {
        left: -2px;
        text-shadow: -1px 0 #00fff9;
        clip: rect(44px, 450px, 56px, 0);
        animation: glitch-anim2 5s infinite linear alternate-reverse;
    }

    @keyframes glitch-anim {
        0% { clip: rect(31px, 9999px, 94px, 0); }
        4.16% { clip: rect(91px, 9999px, 43px, 0); }
        8.33% { clip: rect(13px, 9999px, 7px, 0); }
        100% { clip: rect(56px, 9999px, 88px, 0); }
    }
    @keyframes glitch-anim2 {
        0% { clip: rect(65px, 9999px, 100px, 0); }
        100% { clip: rect(12px, 9999px, 88px, 0); }
    }

    /* ========================================
    COMPONENTS & SECTIONS
    ========================================
    */
    
    /* Mobile Menu */
    .mobile-menu {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: #080808;
        z-index: 40;
        transform: translateY(-100%);
        transition: transform 0.6s var(--easing);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2rem;
    }
    .mobile-menu.active { transform: translateY(0); }

    /* Repo Cards */
    .repo-card {
        background: #080808;
        border: 1px solid #333;
        padding: 2rem;
        position: relative;
        transition: all 0.4s var(--easing);
        transform-style: preserve-3d;
    }
    .repo-card::before {
        content: '';
        position: absolute;
        top: -5px; left: 50%; transform: translateX(-50%) rotate(-1deg);
        width: 30%; height: 10px;
        background: rgba(255,255,255,0.1);
        box-shadow: 0 1px 3px rgba(0,0,0,0.5);
    }
    .repo-card:hover {
        transform: translateY(-10px) scale(1.02);
        border-color: #fff;
        box-shadow: 8px 8px 0 #fff;
        z-index: 10;
    }

    /* Canvas */
    #webgl-canvas {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        z-index: -1;
        opacity: 0.4;
    }

    /* Drip Animation */
    .drip-line {
        width: 3px;
        background: white;
        position: absolute;
        animation: dripDown 3s infinite;
    }
    @keyframes dripDown {
        0% { height: 0; opacity: 1; top: 100%; }
        50% { height: 60px; opacity: 1; }
        100% { height: 100px; opacity: 0; top: 150%; }
    }

    /* Marquee */
    .marquee-container {
        position: relative;
        width: 100vw;
        overflow: hidden;
        background: #fff;
        color: #000;
        transform: rotate(-2deg) scale(1.1);
        box-shadow: 0 0 50px rgba(255,255,255,0.2);
        z-index: 20;
        padding: 2rem 0;
    }
    .marquee-track { display: flex; white-space: nowrap; }
    
    /* Skills Grid */
    .skill-tag {
        border: 1px solid #333;
        padding: 0.5rem 1.5rem;
        border-radius: 999px;
        transition: 0.3s;
        cursor: default;
    }
    .skill-tag:hover {
        background: #fff;
        color: #000;
        border-color: #fff;
    }

    /* ========================================
    MEDIA QUERIES (ADDITIONAL)
    ========================================
    */
    @media (max-width: 768px) {
        .repo-card { margin-bottom: 2rem; }
        .hero-title span { display: block; }
    }
</style>
