import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { navigateWithCleanup } from '../lib/pageTransitionCleanup';



/* ══════════════════════════════════════════════════════════════════
   WAVE MATH — mirrored CPU side to place raft correctly
══════════════════════════════════════════════════════════════════ */
const WAVE_PARAMS = [
    { dir: [1.0, 0.6], steep: 0.14, len: 40 },
    { dir: [0.6, 1.0], steep: 0.10, len: 28 },
    { dir: [-0.5, 0.8], steep: 0.07, len: 18 },
    { dir: [0.9, -0.4], steep: 0.05, len: 12 },
];
function waveHeight(x, z, t) {
    let h = 0;
    for (const w of WAVE_PARAMS) {
        const [dx, dz] = w.dir;
        const len = Math.sqrt(dx * dx + dz * dz);
        const nx = dx / len, nz = dz / len;
        const k = (2 * Math.PI) / w.len;
        const c = Math.sqrt(9.8 / k);
        const f = k * (nx * x + nz * z) - c * t;
        h += (w.steep / k) * Math.sin(f);
    }
    return h;
}

/* ══════════════════════════════════════════════════════════════════
   SKILL DATA
══════════════════════════════════════════════════════════════════ */
const SKILLS = [
    { name: 'React', color: '#61DAFB', slug: 'react', category: 'Frontend' },
    { name: 'Laravel', color: '#FF2D20', slug: 'laravel', category: 'Backend' },
    { name: 'Three.js', color: '#FFFFFF', slug: 'threedotjs', category: '3D / Web' },
    { name: 'JavaScript', color: '#F7DF1E', slug: 'javascript', category: 'Frontend' },
    { name: 'PHP', color: '#8993BE', slug: 'php', category: 'Backend' },
    { name: 'MySQL', color: '#4479A1', slug: 'mysql', category: 'Backend' },
    { name: 'TailwindCSS', color: '#38BDF8', slug: 'tailwindcss', category: 'Frontend' },
    { name: 'Vite', color: '#BD34FE', slug: 'vite', category: 'Tooling' },
    { name: 'Node.js', color: '#539E43', slug: 'nodedotjs', category: 'Backend' },
    { name: 'Git', color: '#F05032', slug: 'git', category: 'DevOps' },
    { name: 'Docker', color: '#2496ED', slug: 'docker', category: 'DevOps' },
    { name: 'CSS3', color: '#1572B6', slug: 'css3', category: 'Frontend' },
];

/* ══════════════════════════════════════════════════════════════════
   SHADERS
══════════════════════════════════════════════════════════════════ */
const WATER_VERT = /* glsl */`
precision highp float;
uniform float uTime;
uniform vec3  uSunDir;

varying vec3  vWorldPos;
varying vec3  vNormal;
varying float vFresnel;
varying vec2  vUv;

// Gerstner‐style sum of sines (vertical only for normals)
vec3 waveDisp(vec2 p, float t) {
    float h = 0.0;
    float nx = 0.0, nz = 0.0;

    // Each wave: dir, steep, wavelength
    float k, c, f, a;
    vec2 d;

    d = normalize(vec2(1.0, 0.6));  k = 6.283/40.0; c = sqrt(9.8/k); a=0.14/k; f=k*dot(d,p)-c*t;
    h += a*sin(f); nx -= d.x*a*k*cos(f); nz -= d.y*a*k*cos(f);

    d = normalize(vec2(0.6, 1.0));  k = 6.283/28.0; c = sqrt(9.8/k); a=0.10/k; f=k*dot(d,p)-c*t;
    h += a*sin(f); nx -= d.x*a*k*cos(f); nz -= d.y*a*k*cos(f);

    d = normalize(vec2(-0.5, 0.8)); k = 6.283/18.0; c = sqrt(9.8/k); a=0.07/k; f=k*dot(d,p)-c*t;
    h += a*sin(f); nx -= d.x*a*k*cos(f); nz -= d.y*a*k*cos(f);

    d = normalize(vec2(0.9,-0.4));  k = 6.283/12.0; c = sqrt(9.8/k); a=0.05/k; f=k*dot(d,p)-c*t;
    h += a*sin(f); nx -= d.x*a*k*cos(f); nz -= d.y*a*k*cos(f);

    return vec3(nx, h, nz);
}

void main() {
    vUv = uv;
    vec4 worldPos4 = modelMatrix * vec4(position, 1.0);
    vec2 xz = worldPos4.xz;

    vec3 disp  = waveDisp(xz, uTime);
    float wH   = disp.y;
    vec3 nrm   = normalize(vec3(disp.x, 1.0, disp.z));

    vec3 wPos  = worldPos4.xyz + vec3(0.0, wH, 0.0);
    vWorldPos  = wPos;
    vNormal    = nrm;

    // Fresnel (view from above → transparent, grazing → reflective)
    vec3 camDir = normalize(cameraPosition - wPos);
    vFresnel    = pow(1.0 - max(dot(nrm, camDir), 0.0), 3.0);

    gl_Position = projectionMatrix * viewMatrix * vec4(wPos, 1.0);
}
`;

const WATER_FRAG = /* glsl */`
precision highp float;

uniform vec3  uSunDir;
uniform vec3  uSunColor;
uniform float uTime;

varying vec3  vWorldPos;
varying vec3  vNormal;
varying float vFresnel;
varying vec2  vUv;

// Sky colour approximation (used for reflection)
vec3 skyColor(vec3 dir) {
    float t = clamp(dir.y * 1.4 + 0.2, 0.0, 1.0);
    vec3 bot = vec3(0.55, 0.80, 0.95);
    vec3 top = vec3(0.05, 0.18, 0.55);
    return mix(bot, top, t);
}

void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vec3 nrm     = normalize(vNormal);

    // ── Deep water colour (depth illusion) ──
    float depth  = clamp(1.0 - vFresnel, 0.0, 1.0);
    vec3 deep    = vec3(0.00, 0.06, 0.20);
    vec3 shallow = vec3(0.02, 0.30, 0.55);
    vec3 waterCol = mix(deep, shallow, depth * 0.6);

    // ── Reflection: sample sky in reflect direction ──
    vec3 reflDir = reflect(-viewDir, nrm);
    vec3 reflCol = skyColor(reflDir);

    // sun specular in reflection
    float sunSpec = pow(max(dot(reflDir, uSunDir), 0.0), 180.0) * 2.8;
    reflCol += uSunColor * sunSpec;

    // ── Blend water + reflection via Fresnel ──
    vec3 col = mix(waterCol, reflCol, vFresnel * 0.85);

    // ── Diffuse sun on water surface ──
    float diff = max(dot(nrm, uSunDir), 0.0) * 0.4;
    col += uSunColor * diff * 0.18;

    // ── Foam (white crests at high wave amplitude) ──
    float foam = smoothstep(0.55, 0.9, vWorldPos.y * 0.55 + 0.5);
    col = mix(col, vec3(1.0), foam * 0.35);

    // ── Depth transparency (alpha) ──
    float alpha = mix(0.82, 0.96, vFresnel);

    gl_FragColor = vec4(col, alpha);
}
`;

const SKY_VERT = /* glsl */`
varying vec3 vDir;
void main() {
    vDir = normalize((modelMatrix * vec4(position,1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;

const SKY_FRAG = /* glsl */`
precision highp float;
uniform vec3  uSunDir;
uniform float uTime;
varying vec3  vDir;

// Rayleigh scattering approximation
float rayleigh(float cos_angle) { return 0.75*(1.0+cos_angle*cos_angle); }

vec3 atmosphere(vec3 rayDir, vec3 sunDir) {
    float mu       = dot(rayDir, sunDir);
    float sunIntens = max(sunDir.y, 0.0);

    // Base sky gradient
    float t    = clamp(rayDir.y * 1.5, 0.0, 1.0);
    vec3 zenith= mix(vec3(0.12,0.34,0.78), vec3(0.04,0.14,0.52), t);
    vec3 horiz = vec3(0.55, 0.74, 0.96);
    vec3 sky   = mix(horiz, zenith, smoothstep(0.0, 0.6, rayDir.y));

    // Sun disc
    float sunR  = 1.0 - smoothstep(0.994, 0.9998, mu);
    vec3  sunCol= vec3(1.0, 0.95, 0.7);

    // Sun halo / atmosphere glow
    float halo  = pow(clamp(mu, 0.0, 1.0), 8.0) * 0.45;
    sky += vec3(1.0, 0.85, 0.55) * halo * sunIntens;

    // Horizon orange tint (sunset warmth)
    float horiz2= pow(1.0 - abs(rayDir.y), 4.0) * 0.35;
    sky += vec3(0.9, 0.5, 0.1) * horiz2 * sunIntens;

    sky += sunCol * (1.0 - sunR);
    return clamp(sky, 0.0, 1.0);
}

void main() {
    vec3 col = atmosphere(normalize(vDir), normalize(uSunDir));
    gl_FragColor = vec4(col, 1.0);
}
`;

function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';

    for (let index = 0; index < 6; index += 1) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }

    return code;
}

/* ══════════════════════════════════════════════════════════════════
   LANDSCAPE PROMPT
══════════════════════════════════════════════════════════════════ */
function LandscapePrompt() {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'radial-gradient(circle at 20% 18%, rgba(56,189,248,0.18), transparent 28%), radial-gradient(circle at 82% 22%, rgba(251,191,36,0.14), transparent 24%), linear-gradient(180deg, #07121d 0%, #091827 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontFamily: 'system-ui',
            textAlign: 'center',
            padding: '24px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: 320,
                borderRadius: 28,
                border: '1px solid rgba(148, 163, 184, 0.18)',
                background: 'linear-gradient(180deg, rgba(15,23,42,0.88), rgba(9,15,28,0.92))',
                boxShadow: '0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
                backdropFilter: 'blur(14px)',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16
            }}>
                <div style={{
                    width: 96,
                    height: 96,
                    borderRadius: 26,
                    background: 'linear-gradient(180deg, rgba(14,116,144,0.22), rgba(15,23,42,0.08))',
                    border: '1px solid rgba(125,211,252,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                    animation: 'rpFloat 3s ease-in-out infinite'
                }}>
                    <img
                        src="/images/rotate-device.svg"
                        alt="Rotate device"
                        style={{
                            width: 74,
                            height: 74,
                            display: 'block',
                            animation: 'rpTilt 1.8s ease-in-out infinite alternate'
                        }}
                    />
                </div>

                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 12px',
                    borderRadius: 999,
                    background: 'rgba(56,189,248,0.12)',
                    border: '1px solid rgba(125,211,252,0.18)',
                    color: '#7dd3fc',
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase'
                }}>
                    Orientation Lock
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, lineHeight: 1.15 }}>Putar layar ke landscape</h2>
                    <p style={{ margin: 0, color: 'rgba(226,232,240,0.7)', fontSize: 13, lineHeight: 1.6 }}>
                        Biar kontrol dan area bermain tampil penuh, buka mode horizontal lalu lanjutkan permainan.
                    </p>
                </div>
            </div>
            <style>{`
                @keyframes rpTilt {
                    from { transform: rotate(0deg) scale(0.98); }
                    to { transform: rotate(14deg) scale(1); }
                }
                @keyframes rpFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
            `}</style>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
const SkillsGame = () => {
    const shellRef = useRef(null);
    const mountRef = useRef(null);
    const gameRef = useRef({});
    const keysRef = useRef({});
    const stageRef = useRef('loading');

    // Swipe Look state
    const touchLookRef = useRef({ active: false, touchId: null, lastX: 0, lastY: 0 });

    const [loaded, setLoaded] = useState(false);
    const [gameStage, setGameStage] = useState('loading');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingLabel, setLoadingLabel] = useState('Menyiapkan lautan...');
    const [hud, setHud] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isPortrait, setIsPortrait] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(() => typeof document !== 'undefined' ? Boolean(document.fullscreenElement) : false);
    const [showHelp, setShowHelp] = useState(true);
    const [paused, setPaused] = useState(false);
    const [menuView, setMenuView] = useState('main');
    const [roomCode, setRoomCode] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [menuMessage, setMenuMessage] = useState('');
    const [sessionInfo, setSessionInfo] = useState(null);
    const pausedRef = useRef(false);

    const syncStage = (stage) => {
        stageRef.current = stage;
        setGameStage(stage);
    };

    useEffect(() => {
        const check = () => {
            const m = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 900;
            setIsMobile(m);
            if (m) setIsPortrait(window.innerHeight > window.innerWidth);
        };
        check();
        window.addEventListener('resize', check);
        window.addEventListener('orientationchange', check);
        return () => { window.removeEventListener('resize', check); window.removeEventListener('orientationchange', check); };
    }, []);

    useEffect(() => {
        const syncFullscreen = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };

        syncFullscreen();
        document.addEventListener('fullscreenchange', syncFullscreen);

        return () => {
            document.removeEventListener('fullscreenchange', syncFullscreen);
        };
    }, []);

    useEffect(() => {
        if (isPortrait && isMobile) return;
        // rAF ensures mount has real layout dimensions before init
        const raf = requestAnimationFrame(() => {
            void initGame();
        });
        return () => { cancelAnimationFrame(raf); destroyGame(); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPortrait]);

    /* ════════════════════════════════════════════════════════════
       INIT GAME
    ════════════════════════════════════════════════════════════ */
    async function initGame() {
        const mount = mountRef.current;
        if (!mount) return;

        syncStage('loading');
        setLoaded(false);
        setLoadingProgress(4);
        setLoadingLabel('Menyiapkan renderer...');

        const initSession = Symbol('skills-init');
        gameRef.current.initSession = initSession;

        const updateLoading = (progress, label) => {
            if (gameRef.current.initSession !== initSession) {
                return false;
            }

            setLoadingProgress(progress);
            setLoadingLabel(label);
            return true;
        };

        /* renderer */
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        mount.appendChild(renderer.domElement);
        updateLoading(12, 'Membangun langit...');

        /* scene */
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x9dcfea, 0.004);

        /* camera */
        const camera = new THREE.PerspectiveCamera(70, mount.clientWidth / mount.clientHeight, 0.05, 1200);

        /* ── SUN direction (shared across shaders) ── */
        const SUN_DIR = new THREE.Vector3(0.55, 0.42, -0.72).normalize();
        const SUN_COLOR = new THREE.Color(1.0, 0.95, 0.75);

        /* ── directional light ── */
        const sun = new THREE.DirectionalLight(0xfff4d0, 3.5);
        sun.position.copy(SUN_DIR).multiplyScalar(300);
        sun.castShadow = true;
        sun.shadow.mapSize.set(2048, 2048);
        sun.shadow.camera.near = 1;
        sun.shadow.camera.far = 600;
        sun.shadow.camera.left = -80;
        sun.shadow.camera.right = 80;
        sun.shadow.camera.top = 80;
        sun.shadow.camera.bottom = -80;
        scene.add(sun);

        const ambLight = new THREE.AmbientLight(0xb0d8f0, 0.9);
        scene.add(ambLight);

        const hemi = new THREE.HemisphereLight(0x88bbdd, 0x002244, 0.7);
        scene.add(hemi);

        /* ── SKY DOME ── */
        const skyGeo = new THREE.SphereGeometry(900, 32, 16);
        skyGeo.scale(-1, 1, -1); // render inside
        const skyMat = new THREE.ShaderMaterial({
            vertexShader: SKY_VERT,
            fragmentShader: SKY_FRAG,
            uniforms: {
                uSunDir: { value: SUN_DIR },
                uTime: { value: 0 },
            },
            side: THREE.BackSide,
            depthWrite: false,
        });
        const skyMesh = new THREE.Mesh(skyGeo, skyMat);
        scene.add(skyMesh);
        updateLoading(22, 'Membentuk ombak...');

        /* ── OCEAN ── */
        const oceanGeo = new THREE.PlaneGeometry(1400, 1400, 220, 220);
        oceanGeo.rotateX(-Math.PI / 2);
        const waterUniforms = {
            uTime: { value: 0 },
            uSunDir: { value: SUN_DIR },
            uSunColor: { value: new THREE.Color(SUN_COLOR) },
        };
        const waterMat = new THREE.ShaderMaterial({
            vertexShader: WATER_VERT,
            fragmentShader: WATER_FRAG,
            uniforms: waterUniforms,
            transparent: true,
            depthWrite: true,
        });
        const ocean = new THREE.Mesh(oceanGeo, waterMat);
        scene.add(ocean);
        updateLoading(34, 'Menggambar awan...');

        /* ── PROCEDURAL CLOUDS ── */
        function makeCloud() {
            const cvs = document.createElement('canvas');
            cvs.width = cvs.height = 512;
            const ctx = cvs.getContext('2d');
            ctx.clearRect(0, 0, 512, 512);

            const numPuffs = 5 + Math.floor(Math.random() * 5);
            for (let i = 0; i < numPuffs; i++) {
                const cx = 120 + Math.random() * 280;
                const cy = 180 + Math.random() * 160;
                const r = 60 + Math.random() * 100;
                const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
                grd.addColorStop(0, 'rgba(255,255,255,0.9)');
                grd.addColorStop(0.4, 'rgba(240,248,255,0.6)');
                grd.addColorStop(1, 'rgba(200,230,255,0.0)');
                ctx.fillStyle = grd;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();
            }

            const tex = new THREE.CanvasTexture(cvs);
            const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0.88 });
            const spr = new THREE.Sprite(mat);
            const scl = 80 + Math.random() * 120;
            spr.scale.set(scl, scl * 0.4, 1);
            spr.position.set(
                (Math.random() - 0.5) * 900,
                50 + Math.random() * 80,
                (Math.random() - 0.5) * 900,
            );
            spr.userData.speed = (Math.random() - 0.5) * 0.5;
            spr.userData.startX = spr.position.x;
            return spr;
        }
        const clouds = [];
        for (let i = 0; i < 18; i++) { const c = makeCloud(); scene.add(c); clouds.push(c); }
        updateLoading(48, 'Menyiapkan rakit...');

        /* ── SIMPLE RAFT (wooden planks) ── */
        const raftGroup = new THREE.Group();
        const plankMat = new THREE.MeshStandardMaterial({
            color: 0xb5843a,
            roughness: 0.85,
            metalness: 0.0,
        });
        /* 7 planks side by side */
        const plankW = 0.38, plankH = 0.12, plankL = 3.2, gap = 0.04;
        const totalW = 7 * (plankW + gap) - gap;
        for (let i = 0; i < 7; i++) {
            const pg = new THREE.BoxGeometry(plankW, plankH, plankL);
            const pm = new THREE.Mesh(pg, plankMat);
            pm.position.x = -totalW / 2 + i * (plankW + gap) + plankW / 2;
            pm.castShadow = pm.receiveShadow = true;
            raftGroup.add(pm);
        }
        /* cross-brace planks (underneath) */
        const braceMat = new THREE.MeshStandardMaterial({ color: 0x8b5e2a, roughness: 0.9 });
        for (const bz of [-0.9, 0.9]) {
            const bg = new THREE.BoxGeometry(totalW + 0.1, 0.09, plankW);
            const bm = new THREE.Mesh(bg, braceMat);
            bm.position.set(0, -(plankH / 2 + 0.045), bz);
            bm.castShadow = true;
            raftGroup.add(bm);
        }
        /* small bamboo/pole at front for steering grip */
        const poleMat = new THREE.MeshStandardMaterial({ color: 0xd4a55a, roughness: 0.7 });
        const poleG = new THREE.CylinderGeometry(0.045, 0.055, 0.9, 6);
        const pole = new THREE.Mesh(poleG, poleMat);
        pole.position.set(0, 0.5, -1.4);
        raftGroup.add(pole);

        /* ensure raft always renders over transparent water */
        raftGroup.renderOrder = 2;
        raftGroup.traverse(o => { if (o.isMesh) { o.renderOrder = 2; o.material.depthWrite = true; } });

        scene.add(raftGroup);
        updateLoading(58, 'Mengukir papan skill...');

        /* ── SKILL BUOYS (Wooden Signboard Style) ── */
        async function makeSkillCard(skill) {
            const cvs = document.createElement('canvas');
            cvs.width = 512; cvs.height = 256;
            const ctx = cvs.getContext('2d');

            /* Clear */
            ctx.clearRect(0, 0, 512, 256);

            /* Weathered Wood Plank Background */
            const hex = skill.color;
            // Dark dry wood base
            ctx.fillStyle = '#2a1a10';
            rrect(ctx, 16, 16, 480, 224, 8); ctx.fill();

            // Procedural Grain
            ctx.strokeStyle = '#3a2a20';
            ctx.lineWidth = 1;
            for (let i = 0; i < 40; i++) {
                ctx.beginPath();
                const ly = 20 + i * 6;
                ctx.moveTo(20, ly + Math.sin(i) * 10);
                ctx.quadraticCurveTo(256, ly + Math.cos(i) * 20, 492, ly + Math.sin(i * 0.5) * 10);
                if (i % 5 === 0) { ctx.lineWidth = 2; ctx.stroke(); }
                else { ctx.lineWidth = 0.5; ctx.stroke(); }
            }

            // Planks vertical lines
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(160, 16, 3, 224);
            ctx.fillRect(320, 16, 3, 224);

            // Iron frame/nails effect
            ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 6;
            rrect(ctx, 16, 16, 480, 224, 8); ctx.stroke();

            // Corner nails
            ctx.fillStyle = '#444';
            ctx.beginPath(); ctx.arc(32, 32, 4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(480, 32, 4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(32, 224, 4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(480, 224, 4, 0, Math.PI * 2); ctx.fill();

            /* Stenciled Brand Icon */
            const iconUrl = `https://cdn.simpleicons.org/${skill.slug}/ffffff`; // White for stenciled look
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = iconUrl;

            await new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
            });

            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            if (img.complete && img.naturalWidth > 0) {
                const iconSize = 90;
                // Slightly desaturated matte stencil
                ctx.globalAlpha = 0.85;
                ctx.drawImage(img, 88 - iconSize / 2, 122 - iconSize / 2, iconSize, iconSize);
            } else {
                ctx.font = 'bold 80px "Courier New", monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#eee';
                ctx.fillText(skill.name[0], 88, 145);
            }
            ctx.restore();

            // Text with weathered/etched feel
            ctx.font = 'bold 64px "Courier New", monospace'; ctx.fillStyle = '#fff'; ctx.textAlign = 'left';
            ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 4;
            ctx.fillText(skill.name.toUpperCase(), 185, 120);

            ctx.font = '22px "Courier New", monospace'; ctx.fillStyle = hex; // Category gets the skill color
            ctx.fillText(skill.category.toUpperCase(), 185, 160);

            return new THREE.CanvasTexture(cvs);
        }

        const skillRefs = [];
        const allSprites = [];
        const setupBuoys = async () => {
            for (let i = 0; i < SKILLS.length; i++) {
                const skill = SKILLS[i];
                updateLoading(
                    58 + Math.round(((i + 1) / SKILLS.length) * 34),
                    `Memuat skill ${i + 1}/${SKILLS.length}: ${skill.name}...`
                );
                const angle = (i / SKILLS.length) * Math.PI * 2;
                const dist = 28 + (i % 4) * 14;
                const px = Math.cos(angle) * dist;
                const pz = Math.sin(angle) * dist;
                const hex = parseInt(skill.color.replace('#', ''), 16);
                const grp = new THREE.Group();
                grp.position.set(px, 0, pz);

                /* float disc */
                const discG = new THREE.CylinderGeometry(1.4, 1.4, 0.18, 20);
                const discM = new THREE.MeshStandardMaterial({ color: 0xddbb88, roughness: 0.9 });
                const disc = new THREE.Mesh(discG, discM);
                disc.castShadow = disc.receiveShadow = true;
                grp.add(disc);

                /* thin pole */
                const pG = new THREE.CylinderGeometry(0.06, 0.07, 2.2, 8);
                const pM = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 });
                const pMesh = new THREE.Mesh(pG, pM);
                pMesh.position.y = 1.2;
                grp.add(pMesh);

                /* glowing orb */
                const oG = new THREE.SphereGeometry(0.28, 16, 16);
                const oM = new THREE.MeshStandardMaterial({ color: hex, emissive: hex, emissiveIntensity: 1.5, roughness: 0 });
                const orb = new THREE.Mesh(oG, oM);
                orb.position.y = 2.55;
                grp.add(orb);

                const pl = new THREE.PointLight(hex, 2, 12);
                pl.position.y = 2.8;
                grp.add(pl);

                /* billboard sprite */
                const tex = await makeSkillCard(skill);
                const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
                spr.scale.set(4.2, 2.1, 1);
                spr.position.y = 4.0;
                spr.userData = { skill, isCard: true };
                grp.add(spr);

                scene.add(grp);
                skillRefs.push({ grp, orb, pl, baseY: 0 });
                allSprites.push(spr); // Add to HUD raycaster
            }
        };

        /* ── PLAYER STATE ── */
        const player = { yaw: Math.PI, pitch: 0, speed: 0, heading: 0, velY: 0, onGround: true, camY: 1.2 };
        const MAX_SPEED = 10, ACCEL = 8, DECEL = 4, TURN = 1.8, GRAVITY = -18, JUMP = 8;

        /* ── POINTER LOCK ── */
        const canvas = renderer.domElement;
        const onMouseDown = () => { if (!isMobileDev()) canvas.requestPointerLock(); };
        const onMouseMove = (e) => {
            if (document.pointerLockElement === canvas) {
                player.yaw -= e.movementX * 0.002;
                player.pitch -= e.movementY * 0.002;
                player.pitch = Math.max(-0.9, Math.min(0.65, player.pitch));
            }
        };
        canvas.addEventListener('pointerdown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('keydown', e => {
            if (e.code === 'Escape') {
                if (stageRef.current !== 'playing') {
                    return;
                }
                const nowPaused = !pausedRef.current;
                pausedRef.current = nowPaused;
                setPaused(nowPaused);
                if (nowPaused && document.pointerLockElement === canvas) document.exitPointerLock();
                return;
            }
            keysRef.current[e.code] = true;
        });
        document.addEventListener('keyup', e => { keysRef.current[e.code] = false; });

        /* ── RAYCASTER HUD ── */
        const raycaster = new THREE.Raycaster();
        const screenCenter = new THREE.Vector2(0, 0);

        /* ── CLOCK ── */
        const clock = new THREE.Clock();
        let animId;

        /* ── ANIMATE ── */
        function animate() {
            animId = requestAnimationFrame(animate);
            const dt = Math.min(clock.getDelta(), 0.05);
            const time = clock.getElapsedTime();
            const keys = keysRef.current;
            const controlsEnabled = stageRef.current === 'playing' && !pausedRef.current;

            /* update shader time */
            waterUniforms.uTime.value = time;
            skyMat.uniforms.uTime.value = time;

            /* ── manual look input check ── */
            // Handled by swipe & pointer lock

            if (controlsEnabled) {
                /* ── raft analog throttle & steer ── */
                const throttle = (keys['KeyW'] || keys['ArrowUp'] ? 1 : 0) - (keys['KeyS'] || keys['ArrowDown'] ? 1 : 0);

                if (Math.abs(throttle) > 0.02) {
                    const targetAccel = throttle > 0 ? ACCEL : ACCEL * 0.6;
                    player.speed += targetAccel * dt * throttle;
                    player.speed = Math.max(-MAX_SPEED * 0.4, Math.min(MAX_SPEED, player.speed));
                } else {
                    const drag = player.speed > 0 ? -DECEL : DECEL;
                    player.speed += drag * dt;
                    if (Math.abs(player.speed) < 0.1) player.speed = 0;
                }

                const steer = (keys['KeyD'] || keys['ArrowRight'] ? 1 : 0) - (keys['KeyA'] || keys['ArrowLeft'] ? 1 : 0);

                if (Math.abs(player.speed) > 0.05) {
                    player.heading += steer * TURN * dt * (player.speed / MAX_SPEED);
                }

                /* move raft */
                raftGroup.position.x += Math.sin(player.heading) * player.speed * dt;
                raftGroup.position.z += Math.cos(player.heading) * player.speed * dt;
            } else {
                player.speed *= 0.92;
                if (Math.abs(player.speed) < 0.05) {
                    player.speed = 0;
                }
            }

            /* raft sits on water — raised above surface so planks stay solid */
            const rx = raftGroup.position.x, rz = raftGroup.position.z;
            const surfaceH = waveHeight(rx, rz, time);
            raftGroup.position.y = surfaceH + 0.15; // sit ON TOP of waves
            raftGroup.rotation.y = player.heading + Math.PI;

            /* rock gently with waves */
            raftGroup.rotation.x = Math.sin(time * 0.85 + 0.3) * 0.04;
            raftGroup.rotation.z = Math.cos(time * 0.72) * 0.03;

            /* ── JUMP ── */
            const raftTop = surfaceH + 0.14;
            if (controlsEnabled && player.onGround && keys['Space']) {
                player.velY = JUMP;
                player.onGround = false;
            }
            if (!player.onGround) {
                player.velY += GRAVITY * dt;
                player.camY += player.velY * dt;
                if (player.camY <= raftTop + 1.1) {
                    player.camY = raftTop + 1.1;
                    player.velY = 0;
                    player.onGround = true;
                }
            } else {
                player.camY = raftTop + 1.1;
            }

            /* ── camera on raft ── */
            camera.position.set(
                raftGroup.position.x,
                player.camY,
                raftGroup.position.z,
            );
            camera.rotation.order = 'YXZ';
            camera.rotation.y = player.yaw;
            camera.rotation.x = player.pitch;

            /* ── clouds drift ── */
            clouds.forEach(c => {
                c.position.x += c.userData.speed * dt * 4;
                if (Math.abs(c.position.x) > 600) c.position.x = c.userData.startX;
            });

            /* ── buoy float ── */
            skillRefs.forEach(({ grp, orb, pl }, i) => {
                const bx = grp.position.x, bz = grp.position.z;
                grp.position.y = waveHeight(bx, bz, time) + Math.sin(time * 0.6 + i) * 0.12;
                orb.material.emissiveIntensity = 1.0 + Math.sin(time * 2 + i) * 0.7;
                pl.intensity = 1.8 + Math.sin(time * 2 + i) * 0.7;
            });

            /* ── HUD raycasting ── */
            raycaster.setFromCamera(screenCenter, camera);
            const hits = raycaster.intersectObjects(allSprites);
            setHud(controlsEnabled && hits.length > 0 && hits[0].distance < 28 ? hits[0].object.userData.skill : null);

            renderer.render(scene, camera);
        }
        animate();

        await setupBuoys();

        if (gameRef.current.initSession !== initSession) {
            renderer.dispose();
            return;
        }

        updateLoading(96, 'Finalisasi world...');

        const onResize = () => {
            if (!mount) return;
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener('resize', onResize);

        gameRef.current = { ...gameRef.current, renderer, animId, onMouseMove, onMouseDown, onResize, player };
        updateLoading(100, 'World siap dimainkan');
        setLoaded(true);
        syncStage('menu');
    }

    /* helpers */
    function rrect(ctx, x, y, w, h, r) {
        ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
    }
    function isMobileDev() { return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 900; }

    function destroyGame() {
        const g = gameRef.current;
        gameRef.current.initSession = null;
        if (!g.renderer) return;
        cancelAnimationFrame(g.animId);
        document.removeEventListener('mousemove', g.onMouseMove);
        try { g.renderer.domElement.removeEventListener('pointerdown', g.onMouseDown); } catch { }
        window.removeEventListener('resize', g.onResize);
        g.renderer.dispose();
        try { if (mountRef.current && g.renderer.domElement.parentNode === mountRef.current) mountRef.current.removeChild(g.renderer.domElement); } catch { }
    }

    /* ── Touch Look Swipe Handler ── */
    const onTouchLookStart = (e) => {
        requestMobileFullscreen();
        if (paused) return;
        const t = e.touches[0];
        if (!t) return;
        touchLookRef.current = { active: true, touchId: t.identifier, lastX: t.clientX, lastY: t.clientY };
    };
    const onTouchLookMove = (e) => {
        if (!touchLookRef.current.active || paused) return;
        const t = Array.from(e.touches).find((touch) => touch.identifier === touchLookRef.current.touchId);
        if (!t) return;
        const dx = t.clientX - touchLookRef.current.lastX;
        const dy = t.clientY - touchLookRef.current.lastY;

        // Apply to player state if the game is running
        if (gameRef.current.player) {
            gameRef.current.player.yaw -= dx * 0.006;
            gameRef.current.player.pitch -= dy * 0.006;
            gameRef.current.player.pitch = Math.max(-0.9, Math.min(0.65, gameRef.current.player.pitch));
        }

        touchLookRef.current.lastX = t.clientX;
        touchLookRef.current.lastY = t.clientY;
    };
    const onTouchLookEnd = (e) => {
        const activeTouchEnded = Array.from(e.changedTouches).some((touch) => touch.identifier === touchLookRef.current.touchId);
        if (!activeTouchEnded) return;
        touchLookRef.current = { active: false, touchId: null, lastX: 0, lastY: 0 };
    };
    const mobileJump = () => { keysRef.current['Space'] = true; setTimeout(() => { keysRef.current['Space'] = false; }, 160); };

    const requestMobileFullscreen = async () => {
        if (!isMobile || isPortrait || document.fullscreenElement) return;

        const target = shellRef.current || document.documentElement;
        if (!target?.requestFullscreen) return;

        try {
            await target.requestFullscreen({ navigationUI: 'hide' });
        } catch {
            try {
                await target.requestFullscreen();
            } catch {
                // Browser blocked fullscreen. Fallback button remains visible.
            }
        }
    };

    const startGameplay = async (nextSessionInfo) => {
        setSessionInfo(nextSessionInfo);
        setMenuMessage('');
        setMenuView('main');
        setShowHelp(true);
        pausedRef.current = false;
        setPaused(false);
        syncStage('playing');
        await requestMobileFullscreen();
    };

    const handleSinglePlayer = async () => {
        await startGameplay({
            mode: 'single',
            role: 'solo',
            label: 'Single Player',
        });
    };

    const handleCreateGame = () => {
        const nextCode = generateRoomCode();
        setRoomCode(nextCode);
        setMenuMessage('Bagikan kode ini ke player 2 untuk masuk ke lobby yang sama.');
        setMenuView('multiplayer-room');
        setSessionInfo({
            mode: 'multiplayer',
            role: 'host',
            code: nextCode,
            label: 'Multiplayer Host',
        });
    };

    const handleJoinGame = () => {
        const normalizedCode = joinCode.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);

        if (normalizedCode.length !== 6) {
            setMenuMessage('Masukkan 6 karakter kode room terlebih dulu.');
            return;
        }

        setJoinCode(normalizedCode);
        setRoomCode(normalizedCode);
        setMenuMessage(`Player 2 siap masuk ke room ${normalizedCode}.`);
        setMenuView('multiplayer-room');
        setSessionInfo({
            mode: 'multiplayer',
            role: 'guest',
            code: normalizedCode,
            label: 'Multiplayer Guest',
        });
    };

    const handleCopyCode = async () => {
        if (!roomCode || !navigator.clipboard?.writeText) {
            return;
        }

        try {
            await navigator.clipboard.writeText(roomCode);
            setMenuMessage(`Kode ${roomCode} berhasil disalin.`);
        } catch {
            setMenuMessage('Browser menolak akses copy otomatis. Copy manual saja.');
        }
    };

    /* ── RENDER ── */
    if (isMobile && isPortrait) return <LandscapePrompt />;

    return (
        <div
            ref={shellRef}
            onTouchStart={onTouchLookStart}
            onTouchMove={onTouchLookMove}
            onTouchEnd={onTouchLookEnd}
            style={{ position: 'relative', width: '100%', height: isMobile ? '100dvh' : '100vh', overflow: 'hidden', background: '#001428', fontFamily: 'system-ui,sans-serif', touchAction: 'none' }}>

            <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

            {/* Loading */}
            {!loaded && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'radial-gradient(circle at 20% 18%, rgba(56,189,248,0.18), transparent 28%), radial-gradient(circle at 82% 22%, rgba(251,191,36,0.12), transparent 24%), linear-gradient(160deg,#000c20,#001840)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', gap: 22, backdropFilter: 'blur(10px)' }}>
                    <div style={{ fontSize: 58, filter: 'drop-shadow(0 0 22px #00bfff)', animation: 'skillsLoaderFloat 2.8s ease-in-out infinite' }}>🌊</div>
                    <div style={{ textAlign: 'center', maxWidth: 360, paddingInline: 20 }}>
                        <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: 3 }}>SKILLS WORLD</div>
                        <div style={{ fontSize: 12, opacity: 0.62, marginTop: 6 }}>{loadingLabel}</div>
                    </div>
                    <div style={{ width: 240, maxWidth: '80vw', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.35)' }}>
                            <div style={{ height: '100%', width: `${loadingProgress}%`, background: 'linear-gradient(90deg,#0ea5e9,#38bdf8,#93c5fd)', borderRadius: 99, boxShadow: '0 0 20px rgba(56,189,248,0.55)', transition: 'width 280ms ease' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: '"Courier New", monospace', fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.78)' }}>
                            <span>Booting</span>
                            <span>{loadingProgress}%</span>
                        </div>
                    </div>
                    <style>{`
                        @keyframes skillsLoaderFloat {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-8px); }
                        }
                    `}</style>
                </div>
            )}

            {/* Crosshair */}
            {loaded && gameStage === 'playing' && (
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 10 }}>
                    <svg width="22" height="22" viewBox="0 0 22 22">
                        <line x1="11" y1="1" x2="11" y2="8" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" />
                        <line x1="11" y1="14" x2="11" y2="21" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" />
                        <line x1="1" y1="11" x2="8" y2="11" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" />
                        <line x1="14" y1="11" x2="21" y2="11" stroke="rgba(255,255,255,0.7)" strokeWidth="1.3" />
                        <circle cx="11" cy="11" r="2" stroke="rgba(100,220,255,0.85)" strokeWidth="1.3" fill="none" />
                    </svg>
                </div>
            )}

            {isMobile && loaded && gameStage === 'playing' && (
                <div style={{ position: 'absolute', top: 18, right: 18, display: 'flex', gap: 10, zIndex: 120 }}>
                    {!isFullscreen && (
                        <button
                            onClick={requestMobileFullscreen}
                            style={{
                                padding: '10px 14px',
                                border: '2px solid rgba(120,220,255,0.28)',
                                background: 'rgba(2,14,34,0.82)',
                                borderRadius: 12,
                                color: '#9be7ff',
                                fontSize: 12,
                                fontWeight: 800,
                                letterSpacing: 1,
                                fontFamily: '"Courier New", monospace',
                                textTransform: 'uppercase',
                                backdropFilter: 'blur(8px)'
                            }}
                        >
                            Fullscreen
                        </button>
                    )}
                    <button
                        onClick={() => { pausedRef.current = true; setPaused(true); }}
                        style={{
                            padding: '10px 14px',
                            border: '2px solid rgba(255,255,255,0.24)',
                            background: 'rgba(4,12,28,0.72)',
                            borderRadius: 12,
                            color: '#fefae0',
                            fontSize: 12,
                            fontWeight: 800,
                            letterSpacing: 1,
                            fontFamily: '"Courier New", monospace',
                            textTransform: 'uppercase',
                            backdropFilter: 'blur(8px)'
                        }}
                    >
                        Menu
                    </button>
                    <button
                        onClick={() => navigateWithCleanup('/')}
                        style={{
                            padding: '10px 14px',
                            border: '2px solid rgba(255,255,255,0.24)',
                            background: 'rgba(4,12,28,0.72)',
                            borderRadius: 12,
                            color: '#fefae0',
                            fontSize: 12,
                            fontWeight: 800,
                            letterSpacing: 1,
                            fontFamily: '"Courier New", monospace',
                            textTransform: 'uppercase',
                            backdropFilter: 'blur(8px)'
                        }}
                    >
                        Home
                    </button>
                </div>
            )}

            {/* HUD */}
            {hud && gameStage === 'playing' && (
                <div style={{ position: 'absolute', top: '58%', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,8,25,0.9)', backdropFilter: 'blur(16px)', border: `1px solid ${hud.color}55`, borderRadius: 14, padding: '10px 24px', color: '#fff', textAlign: 'center', pointerEvents: 'none', zIndex: 20 }}>
                    <div style={{ fontSize: 24 }}>{hud.icon}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: hud.color }}>{hud.name}</div>
                    <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>{hud.category}</div>
                </div>
            )}


            {/* Help */}
            {loaded && gameStage === 'playing' && showHelp && !paused && (
                <>
                    <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,8,25,0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,180,255,0.2)', borderRadius: 14, padding: '12px 28px', color: '#fff', textAlign: 'center', pointerEvents: 'none', zIndex: 20, maxWidth: 380, lineHeight: 1.7 }}>
                        {isMobile
                            ? <><b>Swipe screen</b> look &nbsp;· &nbsp;<b>D-Pad</b> move</>
                            : <><b>W/S</b> throttle &nbsp;·&nbsp; <b>A</b> kiri · <b>D</b> kanan &nbsp;·&nbsp; <b>Space</b> jump · <b>ESC</b> menu</>
                        }
                        <br /><span style={{ fontSize: 11, opacity: 0.4 }}>Tap to dismiss</span>
                    </div>
                    <div style={{ position: 'absolute', inset: 0, zIndex: 19 }} onClick={() => setShowHelp(false)} />
                </>
            )}

            {/* ── NAUTICAL PAUSE MENU ── */}
            {loaded && gameStage === 'menu' && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 100,
                    background: 'rgba(5, 10, 20, 0.72)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: isMobile ? '20px' : '32px',
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: 540,
                        borderRadius: 28,
                        border: '1px solid rgba(148, 163, 184, 0.16)',
                        background: '#0b1324',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
                        padding: isMobile ? '24px' : '32px',
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 22,
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{
                                display: 'inline-flex',
                                alignSelf: 'flex-start',
                                padding: '6px 12px',
                                borderRadius: 999,
                                border: '1px solid rgba(125,211,252,0.16)',
                                background: '#10213a',
                                color: '#7dd3fc',
                                fontSize: 11,
                                fontWeight: 800,
                                letterSpacing: '0.24em',
                                textTransform: 'uppercase',
                            }}>
                                Skills World
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <h1 style={{ margin: 0, fontSize: isMobile ? 28 : 34, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                    {menuView === 'main' ? 'Main Menu' : menuView === 'multiplayer' ? 'Multiplayer Lobby' : 'Room Ready'}
                                </h1>
                                <p style={{ margin: 0, color: 'rgba(226,232,240,0.72)', fontSize: 14, lineHeight: 1.7 }}>
                                    {menuView === 'main'
                                        ? 'Pilih mode bermain dulu. Setelah itu baru karakter bisa mulai berlayar.'
                                        : menuView === 'multiplayer'
                                            ? 'Host bisa buat room baru, player 2 tinggal masukkan kode room.'
                                            : 'Bagikan room code ke player 2 atau masuk memakai kode yang sudah diberikan host.'}
                                </p>
                            </div>
                        </div>

                        {menuView === 'main' && (
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
                                <button
                                    type="button"
                                    onClick={() => void handleSinglePlayer()}
                                    style={{
                                        padding: '22px 20px',
                                        borderRadius: 22,
                                        border: '1px solid rgba(56,189,248,0.22)',
                                        background: '#10213a',
                                        color: '#fff',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7dd3fc', fontWeight: 800 }}>Solo</div>
                                    <div style={{ marginTop: 10, fontSize: 22, fontWeight: 900 }}>Single Player</div>
                                    <div style={{ marginTop: 8, fontSize: 13, color: 'rgba(226,232,240,0.72)', lineHeight: 1.6 }}>
                                        Langsung masuk ke world dan eksplor skill sendiri.
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setMenuMessage(''); setMenuView('multiplayer'); }}
                                    style={{
                                        padding: '22px 20px',
                                        borderRadius: 22,
                                        border: '1px solid rgba(148,163,184,0.16)',
                                        background: '#111827',
                                        color: '#fff',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fde68a', fontWeight: 800 }}>Party</div>
                                    <div style={{ marginTop: 10, fontSize: 22, fontWeight: 900 }}>Multiplayer</div>
                                    <div style={{ marginTop: 8, fontSize: 13, color: 'rgba(226,232,240,0.72)', lineHeight: 1.6 }}>
                                        Buat room dan share kode ke player 2 untuk masuk bareng.
                                    </div>
                                </button>
                            </div>
                        )}

                        {menuView === 'multiplayer' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr', gap: 16 }}>
                                    <div style={{
                                        borderRadius: 22,
                                        border: '1px solid rgba(56,189,248,0.18)',
                                        background: '#0f1b33',
                                        padding: '20px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 14,
                                    }}>
                                        <div>
                                            <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7dd3fc', fontWeight: 800 }}>Host</div>
                                            <div style={{ marginTop: 8, fontSize: 22, fontWeight: 800 }}>Create Game</div>
                                        </div>
                                        <p style={{ margin: 0, color: 'rgba(226,232,240,0.72)', fontSize: 13, lineHeight: 1.7 }}>
                                            Buat room baru lalu kirim kode unik ke player 2.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleCreateGame}
                                            style={{
                                                padding: '14px 16px',
                                                borderRadius: 16,
                                                border: 'none',
                                                background: '#38bdf8',
                                                color: '#07111f',
                                                fontWeight: 900,
                                                fontSize: 14,
                                                textTransform: 'uppercase',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Generate Code
                                        </button>
                                    </div>

                                    <div style={{
                                        borderRadius: 22,
                                        border: '1px solid rgba(148,163,184,0.16)',
                                        background: '#111827',
                                        padding: '20px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 14,
                                    }}>
                                        <div>
                                            <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fde68a', fontWeight: 800 }}>Player 2</div>
                                            <div style={{ marginTop: 8, fontSize: 22, fontWeight: 800 }}>Join Game</div>
                                        </div>
                                        <input
                                            type="text"
                                            value={joinCode}
                                            onChange={(event) => {
                                                setMenuMessage('');
                                                setJoinCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6));
                                            }}
                                            placeholder="Masukkan kode"
                                            style={{
                                                width: '100%',
                                                padding: '14px 16px',
                                                borderRadius: 16,
                                                border: '1px solid rgba(255,255,255,0.12)',
                                                background: '#09111f',
                                                color: '#fff',
                                                fontSize: 18,
                                                fontWeight: 800,
                                                letterSpacing: '0.28em',
                                                textTransform: 'uppercase',
                                                outline: 'none',
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleJoinGame}
                                            style={{
                                                padding: '14px 16px',
                                                borderRadius: 16,
                                                border: '1px solid rgba(148,163,184,0.18)',
                                                background: '#1f2937',
                                                color: '#e2e8f0',
                                                fontWeight: 900,
                                                fontSize: 14,
                                                textTransform: 'uppercase',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Masuk Dengan Code
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => { setMenuMessage(''); setMenuView('main'); }}
                                    style={{
                                        alignSelf: 'flex-start',
                                        padding: '12px 16px',
                                        borderRadius: 14,
                                        border: '1px solid rgba(148,163,184,0.16)',
                                        background: '#111827',
                                        color: 'rgba(226,232,240,0.8)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Kembali
                                </button>
                            </div>
                        )}

                        {menuView === 'multiplayer-room' && sessionInfo && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                <div style={{
                                    borderRadius: 24,
                                    border: '1px solid rgba(148,163,184,0.16)',
                                    background: '#0f1b33',
                                    padding: '22px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 16,
                                }}>
                                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 14 }}>
                                        <div>
                                            <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: sessionInfo.role === 'host' ? '#7dd3fc' : '#fde68a', fontWeight: 800 }}>
                                                {sessionInfo.role === 'host' ? 'Host Room' : 'Player 2 Joined'}
                                            </div>
                                            <div style={{ marginTop: 8, fontSize: 28, fontWeight: 900, letterSpacing: '0.22em' }}>{roomCode}</div>
                                        </div>
                                        {sessionInfo.role === 'host' && (
                                            <button
                                                type="button"
                                                onClick={() => void handleCopyCode()}
                                                style={{
                                                    padding: '12px 16px',
                                                    borderRadius: 14,
                                                    border: '1px solid rgba(56,189,248,0.2)',
                                                    background: '#10213a',
                                                    color: '#7dd3fc',
                                                    fontWeight: 800,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Copy Code
                                            </button>
                                        )}
                                    </div>
                                    <p style={{ margin: 0, color: 'rgba(226,232,240,0.72)', fontSize: 13, lineHeight: 1.7 }}>
                                        {sessionInfo.role === 'host'
                                            ? 'Kode room sudah siap dibagikan. Setelah player 2 dapat kodenya, host bisa mulai permainan.'
                                            : 'Kode room sudah terpasang. Lanjutkan untuk masuk sebagai player 2.'}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12 }}>
                                    <button
                                        type="button"
                                        onClick={() => void startGameplay(sessionInfo)}
                                        style={{
                                            flex: 1,
                                            padding: '16px 18px',
                                            borderRadius: 16,
                                            border: 'none',
                                            background: sessionInfo.role === 'host' ? '#38bdf8' : '#e2e8f0',
                                            color: '#07111f',
                                            fontWeight: 900,
                                            fontSize: 15,
                                            textTransform: 'uppercase',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {sessionInfo.role === 'host' ? 'Start As Host' : 'Join As Player 2'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setMenuMessage(''); setMenuView('multiplayer'); }}
                                        style={{
                                            padding: '16px 18px',
                                            borderRadius: 16,
                                            border: '1px solid rgba(148,163,184,0.16)',
                                            background: '#111827',
                                            color: 'rgba(226,232,240,0.8)',
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Ganti Room
                                    </button>
                                </div>
                            </div>
                        )}

                        <div style={{
                            minHeight: 24,
                            color: menuMessage ? '#bae6fd' : 'rgba(226,232,240,0.48)',
                            fontSize: 13,
                            lineHeight: 1.6,
                        }}>
                            {menuMessage || 'Host bisa generate kode room, lalu player 2 masuk memakai kode yang sama.'}
                        </div>
                    </div>
                </div>
            )}

            {paused && loaded && gameStage === 'playing' && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 100,
                    background: 'rgba(0,2,8,0.8)', backdropFilter: 'grayscale(1) blur(10px)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{
                        background: '#3d2b1f',
                        border: '8px solid #1a140f',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.5)',
                        borderRadius: 4, padding: '40px 50px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        position: 'relative'
                    }}>
                        {/* Iron rivets */}
                        {[0, 1, 2, 3].map(i => (
                            <div key={i} style={{ position: 'absolute', width: 12, height: 12, background: '#222', borderRadius: '50%', top: i < 2 ? 10 : 'auto', bottom: i >= 2 ? 10 : 'auto', left: i % 2 === 0 ? 10 : 'auto', right: i % 2 !== 0 ? 10 : 'auto', boxShadow: 'inset 2px 2px 2px rgba(255,255,255,0.1)' }} />
                        ))}

                        <div style={{ color: '#d4a373', fontSize: 13, letterSpacing: 5, fontWeight: 700, marginBottom: 12, textShadow: '2px 2px 0px #000' }}>SHIP LOG PAUSED</div>
                        <div style={{ fontSize: 36, fontWeight: 900, color: '#fefae0', letterSpacing: 2, marginBottom: 40, fontFamily: '"Courier New", monospace', textAlign: 'center' }}>RAFT ADVENTURE</div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 240 }}>
                            <button
                                onClick={() => { pausedRef.current = false; setPaused(false); }}
                                style={{
                                    padding: '16px', border: 'none', background: '#bc6c25', borderRadius: 4, cursor: 'pointer',
                                    color: '#fefae0', fontSize: 18, fontWeight: 800, letterSpacing: 1,
                                    fontFamily: '"Courier New", monospace', boxShadow: '0 4px 0 #603813',
                                    transition: 'transform 0.1s', textTransform: 'uppercase'
                                }}
                                onMouseDown={e => e.currentTarget.style.transform = 'translateY(2px)'}
                                onMouseUp={e => e.currentTarget.style.transform = 'translateY(0px)'}
                            >
                                Resume Voyage
                            </button>

                            <button
                                onClick={() => {
                                    pausedRef.current = false;
                                    setPaused(false);
                                    setShowHelp(true);
                                    setMenuMessage('');
                                    setMenuView('main');
                                    syncStage('menu');
                                }}
                                style={{
                                    padding: '16px', border: '2px solid #8fb8d8', background: 'rgba(143,184,216,0.08)', borderRadius: 4, cursor: 'pointer',
                                    color: '#d7efff', fontSize: 16, fontWeight: 700, letterSpacing: 1,
                                    fontFamily: '"Courier New", monospace', textTransform: 'uppercase'
                                }}
                            >
                                Main Menu
                            </button>

                            <button
                                onClick={() => { navigateWithCleanup('/'); }}
                                style={{
                                    padding: '16px', border: '2px solid #603813', background: 'transparent', borderRadius: 4, cursor: 'pointer',
                                    color: '#d4a373', fontSize: 16, fontWeight: 700, letterSpacing: 1,
                                    fontFamily: '"Courier New", monospace', textTransform: 'uppercase'
                                }}
                            >
                                Abandon Ship
                            </button>
                        </div>
                        <div style={{ marginTop: 30, fontSize: 12, color: '#d4a373', opacity: 0.6, fontFamily: 'monospace' }}>
                            {isMobile ? 'TAP MENU TO OPEN / CLOSE' : 'PRESS ESC TO CONTINUE'}
                        </div>
                    </div>
                </div>
            )}


            {/* Mobile controls */}
            {isMobile && loaded && gameStage === 'playing' && (
                <DPad keys={keysRef.current} />
            )}
        </div>
    );
};

/* ── Nautical DPad Component ── */
function DPad({ keys }) {
    const activePointersRef = useRef(new Map());

    const btnStyle = (active) => ({
        width: 60, height: 60, background: active ? '#bc6c25' : '#3d2b1f',
        border: '3px solid #1a140f', borderRadius: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fefae0', fontSize: 24, fontWeight: 900,
        boxShadow: active ? 'none' : '0 4px 0 #1a140f',
        transform: active ? 'translateY(2px)' : 'none',
        userSelect: 'none', touchAction: 'none',
        WebkitTapHighlightColor: 'transparent'
    });

    const stopTouchLook = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const setKeyState = (key, active) => {
        keys[key] = active;
        setActive((prev) => ({ ...prev, [key]: active }));
    };

    const [active, setActive] = useState({});

    useEffect(() => {
        return () => {
            activePointersRef.current.forEach((key) => {
                keys[key] = false;
            });
            activePointersRef.current.clear();
        };
    }, [keys]);

    const handlePointerDown = (key, e) => {
        stopTouchLook(e);
        activePointersRef.current.set(e.pointerId, key);
        e.currentTarget.setPointerCapture?.(e.pointerId);
        setKeyState(key, true);
    };

    const handlePointerUp = (e) => {
        stopTouchLook(e);
        const key = activePointersRef.current.get(e.pointerId);
        if (!key) {
            return;
        }
        activePointersRef.current.delete(e.pointerId);
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        setKeyState(key, false);
    };

    return (
        <div
            onPointerDown={stopTouchLook}
            onPointerMove={stopTouchLook}
            onPointerUp={stopTouchLook}
            onPointerCancel={stopTouchLook}
            onTouchStart={stopTouchLook}
            onTouchMove={stopTouchLook}
            onTouchEnd={stopTouchLook}
            style={{ position: 'absolute', bottom: 30, left: 30, display: 'grid', gridTemplateColumns: 'repeat(3, 60px)', gridTemplateRows: 'repeat(3, 60px)', gap: 8, zIndex: 110 }}
        >
            <div />
            <button
                type="button"
                style={btnStyle(active['KeyW'])}
                onPointerDown={(e) => handlePointerDown('KeyW', e)}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >↑</button>
            <div />

            <button
                type="button"
                style={btnStyle(active['KeyD'])}
                onPointerDown={(e) => handlePointerDown('KeyD', e)}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >←</button>
            <div style={{ background: '#1a140f', borderRadius: 4, opacity: 0.3 }} />
            <button
                type="button"
                style={btnStyle(active['KeyA'])}
                onPointerDown={(e) => handlePointerDown('KeyA', e)}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >→</button>

            <div />
            <button
                type="button"
                style={btnStyle(active['KeyS'])}
                onPointerDown={(e) => handlePointerDown('KeyS', e)}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >↓</button>
            <div />
        </div>
    );
}

const Skills = () => <SkillsGame />;
export default Skills;
