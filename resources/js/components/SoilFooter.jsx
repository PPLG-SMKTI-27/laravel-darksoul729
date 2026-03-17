import React, { useEffect, useRef, useState } from 'react';


// ─── Screw component (matches footer corners) ────────────────────────────────

const Screw = ({ rotate = 0 }) => (
    <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#0a0402] to-[#361c10] shadow-[inset_0_1px_3px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.3)]">
        <div className="w-full h-full rounded-full border border-black/80 flex items-center justify-center">
            <div className={`w-[60%] h-[1.5px] bg-[#020617] shadow-[0_1px_0_rgba(255,255,255,0.2)]`}
                style={{ transform: `rotate(${rotate}deg)` }}
            />
        </div>
    </div>
);

const NET_NODES = [
    { id: 0, x: 6, y: 35, label: 'SRV-01', active: true },
    { id: 1, x: 18, y: 65, label: 'DB', active: true },
    { id: 2, x: 12, y: 85, label: 'CDN', active: false },
    { id: 3, x: 32, y: 20, label: 'API', active: true },
    { id: 4, x: 46, y: 68, label: 'CORE', active: true },
    { id: 5, x: 60, y: 28, label: 'GATE', active: true },
    { id: 6, x: 65, y: 80, label: 'LB', active: false },
    { id: 7, x: 78, y: 50, label: 'SRV-02', active: true },
    { id: 8, x: 88, y: 18, label: 'CDN-2', active: true },
    { id: 9, x: 92, y: 75, label: 'DB-02', active: true },
];
const NET_EDGES = [[0, 1], [0, 3], [1, 2], [1, 4], [3, 4], [3, 5], [4, 5], [4, 6], [5, 7], [6, 7], [7, 8], [7, 9]];

const SoilSysControlBridge = () => {
    const [tick, setTick] = useState(0);
    const [radarAngle, setRadarAngle] = useState(0);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const blips = [
        { id: 0, r: 30, a: 40 },
        { id: 1, r: 52, a: 130 },
        { id: 2, r: 66, a: 220 },
        { id: 3, r: 40, a: 300 },
    ];

    useEffect(() => {
        let frame;
        let last = performance.now();
        const loop = (now) => {
            const dt = now - last; last = now;
            setRadarAngle(prev => (prev + dt * 0.1) % 360);
            frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
        const t = setInterval(() => setTick(v => v + 1), 1000);
        return () => { cancelAnimationFrame(frame); clearInterval(t); };
    }, []);

    useEffect(() => {
        if (!isMapOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsMapOpen(false);
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isMapOpen]);

    const edgeOpacity = (i) => 0.25 + 0.55 * Math.abs(Math.sin((tick * 0.6 + i * 1.1)));
    const pktT = (i) => (tick * 0.3 + i * 0.45) % 1;

    const NetworkMap = ({ className, preserveAspectRatio = 'xMidYMid meet' }) => (
        <svg className={className} viewBox="0 0 100 100" preserveAspectRatio={preserveAspectRatio}>
            {NET_EDGES.map(([a, b], i) => {
                const na = NET_NODES[a], nb = NET_NODES[b];
                return (
                    <line
                        key={`e${i}`}
                        x1={na.x}
                        y1={na.y}
                        x2={nb.x}
                        y2={nb.y}
                        stroke="#f59e0b"
                        strokeWidth="0.5"
                        strokeOpacity={edgeOpacity(i)}
                        strokeDasharray="2 1"
                    />
                );
            })}
            {NET_EDGES.map(([a, b], i) => {
                const na = NET_NODES[a], nb = NET_NODES[b], t = pktT(i);
                return (
                    <circle
                        key={`p${i}`}
                        cx={na.x + (nb.x - na.x) * t}
                        cy={na.y + (nb.y - na.y) * t}
                        r="1"
                        fill="#fbbf24"
                        opacity="0.9"
                        style={{ filter: 'drop-shadow(0 0 2px #fbbf24)' }}
                    />
                );
            })}
            {NET_NODES.map(n => (
                <g key={n.id} transform={`translate(${n.x},${n.y})`}>
                    <circle r="4.5" fill="none" stroke={n.active ? '#f59e0b' : '#334155'} strokeWidth="0.4" opacity="0.3" />
                    <circle
                        r="2.5"
                        fill={n.active ? '#d97706' : '#1e293b'}
                        stroke={n.active ? '#fef3c7' : '#475569'}
                        strokeWidth="0.6"
                        className={n.active ? 'node-active' : 'node-idle'}
                    />
                    <text
                        fontSize="2.8"
                        fill={n.active ? '#fef3c7' : '#475569'}
                        textAnchor="middle"
                        dy="5.8"
                        fontFamily="monospace"
                        fontWeight="bold"
                    >
                        {n.label}
                    </text>
                </g>
            ))}
        </svg>
    );

    return (
        <div className="w-full relative select-none" style={{ background: '#2a1610' }}>
            <style>{`
                @keyframes blink-led2 { 0%,100%{opacity:1} 48%,52%{opacity:0.1} }
                @keyframes scan-bridge { 0%{transform:translateY(-100%)} 100%{transform:translateY(500%)} }
                @keyframes pulse-node { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
                @keyframes idle-node  { 0%,100%{opacity:0.7} 50%{opacity:0.3} }
                .led-blink   { animation: blink-led2 1.6s step-end infinite; }
                .node-active { animation: pulse-node 2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
                .node-idle   { animation: idle-node 3s ease-in-out infinite; }
            `}</style>

            {/* ── Top edge bevel (same as footer bottom strip) ── */}
            <div className="w-full h-[3px] bg-[#1a0c08]" />
            <div className="w-full h-[1px] bg-white/10" />

            {/* ── Horizontal body seams (matching footer style) ── */}
            <div className="absolute top-[33%] left-0 w-full h-[1.5px] bg-black/25 z-0 pointer-events-none" />
            <div className="absolute top-[33%] left-0 w-full h-[1px] bg-white/08 mt-[1.5px] z-0 pointer-events-none" />
            <div className="absolute top-[66%] left-0 w-full h-[1.5px] bg-black/20 z-0 pointer-events-none" />

            {/* ── Side plates (matching footer) ── */}
            <div className="absolute top-0 left-0 w-8 md:w-[60px] lg:w-[100px] h-full bg-[#2a1610] border-r-[4px] border-[#1a0c08] shadow-[inset_-4px_0_15px_rgba(0,0,0,0.4),inset_2px_0_10px_rgba(255,255,255,0.15)] z-10 hidden sm:flex flex-col items-center justify-around py-6">
                <div className="w-3.5 h-3.5 rounded-full bg-[#1a0c08] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center">
                    <div className="w-2 h-[1.5px] bg-[#0f0604] rotate-45" />
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#1a0c08] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#fbbf24] led-blink" />
                </div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#1a0c08] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center">
                    <div className="w-2 h-[1.5px] bg-[#0f0604] -rotate-45" />
                </div>
            </div>
            <div className="absolute top-0 right-0 w-8 md:w-[60px] lg:w-[100px] h-full bg-[#2a1610] border-l-[4px] border-[#1a0c08] shadow-[inset_4px_0_15px_rgba(0,0,0,0.4),inset_-2px_0_10px_rgba(255,255,255,0.15)] z-10 hidden sm:flex flex-col items-center justify-around py-6">
                <div className="w-3.5 h-3.5 rounded-full bg-[#1a0c08] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center">
                    <div className="w-2 h-[1.5px] bg-[#0f0604] rotate-[110deg]" />
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#1a0c08] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_6px_#facc15]" />
                </div>
                <div className="w-3.5 h-3.5 rounded-full bg-[#1a0c08] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center">
                    <div className="w-2 h-[1.5px] bg-[#0f0604] rotate-12" />
                </div>
            </div>

            {/* ── Main inner recessed panel ── */}
            <div className="relative z-10 flex items-center justify-center w-full max-w-[1240px] mx-auto px-2 py-3">
                <div className="w-full bg-[linear-gradient(160deg,#381c12_0%,#2b140c_50%,#1a0904_100%)] rounded-[16px] border-[2px] border-b-[4px] border-t-black/40 border-l-black/30 border-r-[#361c10]/40 border-b-[#422416]/60 shadow-[inset_0_15px_30px_rgba(0,0,0,0.8),inset_0_-4px_10px_rgba(66,36,22,0.3),0_2px_0_rgba(255,255,255,0.1)] p-3 relative">

                    {/* Corner screws */}
                    <div className="absolute top-2 left-2"><Screw rotate={45} /></div>
                    <div className="absolute top-2 right-2"><Screw rotate={110} /></div>
                    <div className="absolute bottom-2 left-2"><Screw rotate={12} /></div>
                    <div className="absolute bottom-2 right-2"><Screw rotate={-30} /></div>

                    {/* Panel label */}
                    <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-20 bg-[#1f0d08] border border-[#451a03] rounded px-3 py-[2px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_2px_4px_rgba(0,0,0,0.5)]">
                        <span className="text-[#f59e0b] font-mono text-[9px] tracking-[0.25em] font-bold">SYS_CTRL_BRIDGE</span>
                    </div>

                    {/* ── 3-column layout ── */}
                    <div className="flex gap-3 items-stretch mt-2">

                        {/* LEFT: Network Map Screen */}
                        <button
                            type="button"
                            onClick={() => setIsMapOpen(true)}
                            className="flex-1 min-w-0 bg-[#0a0503] rounded-[10px] border-[2px] border-t-[#1f0d08] border-l-[#1f0d08] border-r-[#f59e0b]/50 border-b-[#f59e0b] shadow-[inset_0_4px_25px_rgba(0,0,0,1),inset_0_-2px_15px_rgba(245,158,11,0.15),0_4px_6px_rgba(0,0,0,0.4)] relative overflow-hidden aspect-[16/9] min-h-[140px] md:min-h-[200px] lg:min-h-[230px] text-left group"
                            aria-label="Open network map"
                        >
                            {/* Bezel highlight */}
                            <div className="absolute top-0 left-0 right-0 h-5 bg-gradient-to-b from-white/10 to-transparent z-20 pointer-events-none rounded-t-[8px]" />
                            {/* CRT grid */}
                            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,1) 1px,transparent 1px),linear-gradient(90deg,rgba(245,158,11,1) 1px,transparent 1px)', backgroundSize: '12px 12px' }} />
                            {/* Scanbar */}
                            <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none z-10">
                                <div className="absolute left-0 right-0 h-5 bg-gradient-to-b from-transparent via-[#f59e0b]/25 to-transparent" style={{ animation: 'scan-bridge 3s linear infinite' }} />
                            </div>
                            {/* Screen label */}
                            <div className="absolute top-1.5 left-2 z-20 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#fb923c] shadow-[0_0_6px_#fb923c] led-blink" />
                                <span className="font-mono text-[7px] text-[#f59e0b] tracking-widest font-bold opacity-80">NET_TOPOLOGY</span>
                            </div>
                            <div className="absolute bottom-1.5 right-2 z-20 font-mono text-[7px] tracking-[0.28em] text-[#fde68a] opacity-0 group-hover:opacity-90 transition-opacity">
                                OPEN_MAP
                            </div>
                            <NetworkMap className="absolute inset-0 w-full h-full" />
                        </button>

                        {/* ── Divider groove ── */}
                        <div className="w-[2px] bg-[#1f0d08] shadow-[1px_0_0_rgba(255,255,255,0.08)] rounded-full self-stretch shrink-0" />

                        {/* CENTER: Radar Screen */}
                        <div className="flex-shrink-0 bg-[#0a0503] rounded-[10px] border-[2px] border-t-[#1f0d08] border-l-[#1f0d08] border-r-[#f97316]/50 border-b-[#f97316] shadow-[inset_0_4px_25px_rgba(0,0,0,1),inset_0_-2px_15px_rgba(52,211,153,0.12),0_4px_6px_rgba(0,0,0,0.4)] relative overflow-hidden flex items-center justify-center p-2 w-[150px] md:w-[170px] lg:w-[190px] min-h-[140px] md:min-h-[200px] lg:min-h-[230px]">
                            {/* Bezel highlight */}
                            <div className="absolute top-0 left-0 right-0 h-5 bg-gradient-to-b from-white/10 to-transparent z-20 pointer-events-none rounded-t-[8px]" />
                            {/* Screen label */}
                            <div className="absolute top-1.5 left-2 z-20 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#f97316] shadow-[0_0_6px_#f97316] led-blink" style={{ animationDelay: '0.4s' }} />
                                <span className="font-mono text-[7px] text-[#f97316] tracking-widest font-bold opacity-80">RADAR</span>
                            </div>
                            <svg viewBox="0 0 120 112" width="130" height="112" className="relative z-10">
                                <defs>
                                    <radialGradient id="rdGrad" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
                                        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                                    </radialGradient>
                                </defs>
                                {/* Rings */}
                                {[16, 30, 44, 56].map(r => (
                                    <circle key={r} cx="60" cy="60" r={r} fill="none" stroke="#7c2d12" strokeWidth="0.8" />
                                ))}
                                <line x1="4" y1="60" x2="116" y2="60" stroke="#7c2d12" strokeWidth="0.6" />
                                <line x1="60" y1="4" x2="60" y2="116" stroke="#7c2d12" strokeWidth="0.6" />
                                <line x1="20" y1="20" x2="100" y2="100" stroke="#7c2d12" strokeWidth="0.4" opacity="0.5" />
                                <line x1="100" y1="20" x2="20" y2="100" stroke="#7c2d12" strokeWidth="0.4" opacity="0.5" />
                                {/* Sweep */}
                                <g transform={`rotate(${radarAngle}, 60, 60)`}>
                                    <path d={`M60,60 L${60 + 56 * Math.cos(-Math.PI / 2)},${60 + 56 * Math.sin(-Math.PI / 2)} A56,56 0 0,1 ${60 + 56 * Math.cos(-Math.PI / 2 + Math.PI / 2.5)},${60 + 56 * Math.sin(-Math.PI / 2 + Math.PI / 2.5)} Z`}
                                        fill="url(#rdGrad)" />
                                    <line x1="60" y1="60" x2="60" y2="4" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.95" />
                                </g>
                                {/* Blips */}
                                {blips.map(b => {
                                    const bx = 60 + b.r * Math.cos(b.a * Math.PI / 180);
                                    const by = 60 + b.r * Math.sin(b.a * Math.PI / 180);
                                    return <circle key={b.id} cx={bx} cy={by} r="2.8" fill="#fb923c" stroke="#fdba74" strokeWidth="0.8"
                                        style={{ filter: 'drop-shadow(0 0 4px #fb923c)', animation: `blink-led2 ${1.4 + b.id * 0.5}s step-end infinite` }} />;
                                })}
                                <circle cx="60" cy="60" r="3" fill="#f97316" style={{ filter: 'drop-shadow(0 0 4px #f97316)' }} />
                                <text x="60" y="106" textAnchor="middle" fontSize="5.5" fill="#f97316" fontFamily="monospace" fontWeight="bold" opacity="0.6">RADAR_SCAN</text>
                            </svg>
                        </div>

                        {/* ── Divider groove ── */}
                        <div className="w-[2px] bg-[#1f0d08] shadow-[1px_0_0_rgba(255,255,255,0.08)] rounded-full self-stretch shrink-0" />

                        {/* RIGHT: Status panels stacked */}
                        <div className="flex-shrink-0 flex flex-col gap-2 hidden md:flex w-[150px] lg:w-[190px]">
                            {/* SYS MONITOR */}
                            <div className="flex-1 bg-[#0a0503] rounded-[10px] border-[2px] border-t-[#1f0d08] border-l-[#1f0d08] border-r-[#fbbf24]/40 border-b-[#fbbf24]/60 shadow-[inset_0_4px_15px_rgba(0,0,0,1),0_4px_6px_rgba(0,0,0,0.4)] relative overflow-hidden p-2">
                                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/10 to-transparent rounded-t-[8px] pointer-events-none" />
                                <div className="flex items-center gap-1 mb-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] shadow-[0_0_5px_#fbbf24]" />
                                    <span className="font-mono text-[7px] text-[#fbbf24] tracking-widest font-bold opacity-80">SYS_MONITOR</span>
                                </div>
                                {[
                                    { label: 'CPU', val: 72, color: '#f97316' },
                                    { label: 'MEM', val: 58, color: '#fbbf24' },
                                    { label: 'NET', val: 90, color: '#60a5fa' },
                                ].map(s => (
                                    <div key={s.label} className="flex items-center gap-1.5 mb-1">
                                        <span className="font-mono text-[7px] text-[#64748b] w-5 shrink-0">{s.label}</span>
                                        <div className="flex-1 h-[3px] bg-[#0d1a3a] rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${s.val}%`, background: s.color, boxShadow: `0 0 5px ${s.color}` }} />
                                        </div>
                                        <span className="font-mono text-[7px] w-5 text-right shrink-0" style={{ color: s.color }}>{s.val}%</span>
                                    </div>
                                ))}
                            </div>
                            {/* NET STATUS */}
                            <div className="flex-1 bg-[#0a0503] rounded-[10px] border-[2px] border-t-[#1f0d08] border-l-[#1f0d08] border-r-[#f59e0b]/40 border-b-[#f59e0b]/60 shadow-[inset_0_4px_15px_rgba(0,0,0,1),0_4px_6px_rgba(0,0,0,0.4)] relative overflow-hidden p-2">
                                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/10 to-transparent rounded-t-[8px] pointer-events-none" />
                                <div className="flex items-center gap-1 mb-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] shadow-[0_0_5px_#f59e0b] led-blink" style={{ animationDelay: '0.7s' }} />
                                    <span className="font-mono text-[7px] text-[#f59e0b] tracking-widest font-bold opacity-80">NET_STATUS</span>
                                </div>
                                {[
                                    { label: 'UPTIME', val: '99.9%', color: '#f97316' },
                                    { label: 'NODES', val: `${NET_NODES.filter(n => n.active).length}/${NET_NODES.length}`, color: '#60a5fa' },
                                    { label: 'PING', val: '14 ms', color: '#fbbf24' },
                                    { label: 'STATUS', val: 'ONLINE', color: '#f97316', blink: true },
                                ].map(s => (
                                    <div key={s.label} className="flex items-center justify-between mb-[2px]">
                                        <span className="font-mono text-[7px] text-[#475569] shrink-0">{s.label}</span>
                                        <span className="font-mono text-[7px] font-bold flex items-center gap-1" style={{ color: s.color }}>
                                            {s.blink && <span className="w-1.5 h-1.5 rounded-full led-blink" style={{ background: s.color, boxShadow: `0 0 4px ${s.color}`, display: 'inline-block' }} />}
                                            {s.val}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {isMapOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                    <div
                        className="absolute inset-0"
                        onClick={() => setIsMapOpen(false)}
                        aria-hidden="true"
                    />
                    <div className="relative w-[92vw] max-w-5xl">
                        <div className="absolute -inset-1 rounded-[22px] bg-[linear-gradient(120deg,#2d1a0f,#d97706,#2d1a0f)] opacity-70 blur-[10px]" />
                        <div className="relative rounded-[22px] border border-[#451a03] bg-[#070302] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3 border-b border-[#190a05] bg-[#0a0402]">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#fbbf24] shadow-[0_0_10px_#fbbf24]" />
                                    <span className="font-mono text-[10px] tracking-[0.35em] text-[#fde68a]">FOSSIL_CORE_NET</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsMapOpen(false)}
                                    className="px-3 py-1.5 text-[10px] font-mono tracking-[0.25em] text-[#fbbf24] border border-[#d97706] rounded-lg bg-[#170804] shadow-[inset_0_0_10px_rgba(15,118,110,0.5)] hover:text-white hover:border-[#f59e0b] transition"
                                >
                                    CLOSE
                                </button>
                            </div>
                            <div className="relative p-4 sm:p-6">
                                <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(217,119,6,1) 1px,transparent 1px),linear-gradient(90deg,rgba(217,119,6,1) 1px,transparent 1px)', backgroundSize: '18px 18px' }} />
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent opacity-70" />
                                    <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent opacity-70" />
                                </div>
                                <div className="relative aspect-[16/9] rounded-[16px] border border-[#2d1a0f] bg-[#020617] overflow-hidden">
                                    <NetworkMap className="absolute inset-0 w-full h-full" />
                                    <div className="absolute left-4 bottom-4 font-mono text-[10px] tracking-[0.3em] text-[#f59e0b]">
                                        SAT_GRID_VIEW
                                    </div>
                                    <div className="absolute right-4 top-4 text-[10px] font-mono text-[#f97316] tracking-[0.25em]">
                                        WANTED_LEVEL: 0
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Bottom edge bevel into footer ── */}
            <div className="w-full h-[1px] bg-white/10" />
        </div>
    );
};

const SoilFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative z-50 w-full mt-24 md:mt-40 select-none pb-0">
            {/* System Control Bridge decoration */}
            <SoilSysControlBridge />

            {/* Main Outer Chassis (Heavy Blue Metal) */}

            <div className="w-full bg-[#2a1610] border-y-[2px] border-[#d97706] shadow-[0_-15px_30px_rgba(0,0,0,0.3)] relative flex flex-col items-center">

                {/* Very outer side plates (Visual filler for extreme left/right edges like image) */}
                <div className="absolute top-0 left-0 w-8 md:w-[60px] lg:w-[120px] h-full bg-[#2a1610] border-r-[4px] border-[#1a0c08] shadow-[inset_-4px_0_15px_rgba(0,0,0,0.4),_inset_2px_0_10px_rgba(255,255,255,0.2)] z-0 hidden sm:flex flex-col items-center justify-between py-8 border-y-2 border-transparent">
                    <div className="w-4 h-4 rounded-full bg-[#1a0c08] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
                        <div className="w-2.5 h-[1.5px] bg-[#0f0604] rotate-45"></div>
                    </div>
                    {/* Glowing side hole */}
                    <div className="w-3 h-3 rounded-full bg-[#1a0c08] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#fbbf24]"></div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-8 md:w-[60px] lg:w-[120px] h-full bg-[#2a1610] border-l-[4px] border-[#1a0c08] shadow-[inset_4px_0_15px_rgba(0,0,0,0.4),_inset_-2px_0_10px_rgba(255,255,255,0.2)] z-0 hidden sm:flex flex-col items-center justify-between py-8 border-y-2 border-transparent">
                    <div className="w-4 h-4 rounded-full bg-[#1a0c08] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
                        <div className="w-2.5 h-[1.5px] bg-[#0f0604] rotate-45"></div>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-[#1a0c08] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)]"></div>
                    </div>
                </div>

                {/* Horizontal seam lines matching the image background texture */}
                <div className="absolute top-[25%] left-0 w-full h-[1.5px] bg-black/30 z-0"></div>
                <div className="absolute top-[25%] left-0 w-full h-[1px] bg-white/10 mt-[1.5px] z-0"></div>
                <div className="absolute bottom-[25%] left-0 w-full h-[1.5px] bg-black/30 z-0"></div>
                <div className="absolute bottom-[25%] left-0 w-full h-[1px] bg-white/10 mt-[1.5px] z-0"></div>

                {/* Primary Inner Control Board */}
                <div className="relative z-10 flex flex-col items-center w-full max-w-[1240px] px-2 py-3 lg:px-4 lg:py-4">

                    {/* The deeply recessed inner panel containing everything */}
                    <div className="w-full bg-[linear-gradient(160deg,#381c12_0%,#2b140c_50%,#1a0904_100%)] rounded-[16px] border-[2px] border-b-[4px] border-t-black/40 border-l-black/30 border-r-[#361c10]/40 border-b-[#422416]/60 shadow-[inset_0_15px_30px_rgba(0,0,0,0.8),inset_0_-4px_10px_rgba(66,36,22,0.3),_0_2px_0_rgba(255,255,255,0.1)] p-3 lg:p-4 flex flex-col xl:flex-row gap-4 lg:gap-6 items-stretch relative">

                        {/* Screws in corners of inner panel */}
                        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gradient-to-tr from-[#0a0402] to-[#361c10] shadow-[inset_0_1px_3px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.3)]">
                            <div className="w-full h-full rounded-full border border-black/80 flex items-center justify-center">
                                <div className="w-[60%] h-[1.5px] bg-[#020617] rotate-45 shadow-[0_1px_0_rgba(255,255,255,0.2)]"></div>
                            </div>
                        </div>
                        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-tr from-[#0a0402] to-[#361c10] shadow-[inset_0_1px_3px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.3)]">
                            <div className="w-full h-full rounded-full border border-black/80 flex items-center justify-center">
                                <div className="w-[60%] h-[1.5px] bg-[#020617] rotate-[110deg] shadow-[0_1px_0_rgba(255,255,255,0.2)]"></div>
                            </div>
                        </div>
                        <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-gradient-to-tr from-[#0a0402] to-[#361c10] shadow-[inset_0_1px_3px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.3)]">
                            <div className="w-full h-full rounded-full border border-black/80 flex items-center justify-center">
                                <div className="w-[60%] h-[1.5px] bg-[#020617] rotate-12 shadow-[0_1px_0_rgba(255,255,255,0.2)]"></div>
                            </div>
                        </div>
                        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-gradient-to-tr from-[#0a0402] to-[#361c10] shadow-[inset_0_1px_3px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.3)]">
                            <div className="w-full h-full rounded-full border border-black/80 flex items-center justify-center">
                                <div className="w-[60%] h-[1.5px] bg-[#020617] -rotate-[30deg] shadow-[0_1px_0_rgba(255,255,255,0.2)]"></div>
                            </div>
                        </div>

                        {/* LEFT SECTION: Logo & Copyright */}
                        <div className="flex flex-col justify-between pl-4 pr-6 py-2 relative min-w-[260px] shrink-0 border-b xl:border-b-0 xl:border-r-[2px] border-[#422416]/50 pb-4 xl:pb-0">
                            {/* Inset shadow line simulating a groove on the right */}
                            <div className="hidden xl:block absolute right-0 top-0 h-full w-[1.5px] bg-[#1f0d08] shadow-[1px_0_0_rgba(255,255,255,0.1)]"></div>

                            <div className="relative z-10 pt-1 lg:mt-2">
                                <h2 className="text-white font-black text-[38px] lg:text-[44px] tracking-tight leading-[0.85] drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)]">KEVIN</h2>
                                <h2 className="text-[#facc15] font-black text-[38px] lg:text-[44px] tracking-tight leading-[0.85] drop-shadow-[0_4px_4px_rgba(0,0,0,0.6)] mt-1 lg:mt-0" style={{ textShadow: "0 0 10px rgba(250, 204, 21, 0.4), 0 2px 4px rgba(0,0,0,0.8)" }}>HERMANSYAH</h2>
                                <p className="text-white/90 text-[11px] font-bold mt-3 tracking-wide capitalize drop-shadow-md">Underground Excavator \& Explorer</p>
                            </div>

                            <div className="flex items-center gap-2 mt-6 lg:mt-0 lg:mb-1">
                                <div className="w-3 h-3 rounded-full bg-[#1f0d08] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.2)] flex justify-center items-center">
                                    <div className="w-1.5 h-[1.5px] bg-[#0f0604] rotate-45"></div>
                                </div>
                                <div className="text-white/60 text-[9px] font-mono tracking-widest font-bold">
                                    © {currentYear} KEVIN HERMANSYAH // V3.0
                                </div>
                            </div>
                        </div>

                        {/* MIDDLE AND RIGHT SECTIONS WRAPPER */}
                        <div className="flex-grow flex flex-col gap-3 lg:gap-4 xl:gap-5 justify-between lg:py-1 w-full min-w-0">

                            {/* TOP ROW: Nav Buttons + Social Icons */}
                            <div className="flex flex-col sm:flex-row justify-between gap-4 h-auto lg:h-[46px] w-full">
                                {/* Nav Buttons */}
                                <div className="flex gap-2 lg:gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide flex-1 items-center relative">
                                    {/* Ambient Glow behind buttons */}
                                    <div className="absolute top-1/2 left-0 w-full h-[60%] bg-[#d97706]/20 blur-[15px] -translate-y-1/2 pointer-events-none"></div>

                                    {['HOME', 'PORTFOLIO', 'SKILLS', 'CONTACT'].map((item) => (
                                        <button key={item}
                                            className="flex-shrink-0 px-4 lg:px-6 h-[38px] lg:h-[42px] bg-[linear-gradient(180deg,#d97706_0%,#451a03_100%)] rounded-[10px] border border-t-[#60a5fa]/60 border-l-[#d97706]/40 border-r-[#451a03]/80 border-b-[#172554] text-white font-black text-[11px] lg:text-[13px] uppercase tracking-wider hover:brightness-110 active:scale-95 active:translate-y-[2px] transition-all relative overflow-hidden outline-none"
                                            style={{ boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.2), inset 0 -4px 6px rgba(0,0,0,0.5), 0 6px 1px #0a1338, 0 8px 12px rgba(0,0,0,0.6)' }}>

                                            {/* Top Glass Highlight */}
                                            <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/30 to-transparent rounded-t-[8px]"></div>

                                            {/* Hover Light Sweep */}
                                            <div className="absolute inset-0 w-[150%] h-full bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.2)_30%,transparent_40%)] -translate-x-full hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>

                                            <span className="relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{item}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Social Buttons (Squircle shape, slightly separated to the right) */}
                                <div className="flex gap-2 lg:gap-3 shrink-0 items-center justify-start sm:justify-end pl-2 sm:pl-0 sm:border-l-[2px] border-[#422416]/50 sm:ml-2 relative">
                                    <div className="hidden sm:block absolute left-[-2px] xl:left-[-1.5px] top-1/2 -translate-y-1/2 h-[80%] w-[1.5px] bg-[#1f0d08] shadow-[1px_0_0_rgba(255,255,255,0.1)]"></div>
                                    <div className="hidden sm:block absolute left-[-15px] top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-[#422416]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"></div>

                                    {[
                                        { icon: 'mail', bg: 'bg-[linear-gradient(180deg,#f8fafc_0%,#cbd5e1_100%)]', glow: 'bg-white/30', stroke: 'border-t-white border-b-[#94a3b8] border-x-[#e2e8f0]', content: <svg className="w-5 h-5 text-slate-700 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                                        { icon: 'ig', bg: 'bg-[linear-gradient(45deg,#facc15_0%,#ef4444_50%,#a855f7_100%)]', glow: 'bg-rose-500/30', stroke: 'border-t-[#fef08a] border-b-[#7e22ce] border-x-[#f87171]', content: <svg className="w-5 h-5 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg> },
                                        { icon: 'be', bg: 'bg-[linear-gradient(180deg,#d97706_0%,#b45309_100%)]', glow: 'bg-blue-500/30', stroke: 'border-t-[#93c5fd] border-b-[#2d1a0f] border-x-[#2563eb]', content: <span className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] font-black text-sm lg:text-base leading-none">Be</span> },
                                        { icon: 'discord', bg: 'bg-[linear-gradient(180deg,#4752c4_0%,#2c3482_100%)]', glow: 'bg-indigo-500/30', stroke: 'border-t-[#818cf8] border-b-[#1e1b4b] border-x-[#4f46e5]', content: <svg className="w-5 h-5 text-white/95 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2498-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8745-.6177-1.2498a.077.077 0 00-.0788-.0371 19.7363 19.7363 0 00-4.8855 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" /></svg> }
                                    ].map((social, i) => (
                                        <div key={i} className="relative group">
                                            {/* Outer Glow */}
                                            <div className={`absolute inset-1 ${social.glow} blur-[6px] translate-y-1 rounded-full -z-10 group-hover:blur-[10px] transition-all`}></div>

                                            <button className={`flex items-center justify-center w-[38px] h-[38px] lg:w-[42px] lg:h-[42px] rounded-[10px] ${social.bg} border-[2px] ${social.stroke} hover:brightness-110 active:scale-[0.98] active:translate-y-[2px] transition-all overflow-hidden relative outline-none`}
                                                style={{ boxShadow: 'inset 0 4px 5px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.4), 0 5px 0 #0a1338, 0 6px 8px rgba(0,0,0,0.6)' }}>

                                                {/* Top Glass Arc */}
                                                <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/40 to-transparent rounded-t-[8px]"></div>

                                                <div className="relative z-10">{social.content}</div>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* BOTTOM ROW: Screens, Status Box, Action Button & Rocket */}
                            <div className="flex flex-col lg:flex-row lg:flex-wrap xl:flex-nowrap gap-3 xl:gap-4 h-auto xl:h-[95px] w-full pt-1 lg:pt-0 justify-center xl:justify-start min-w-0">

                                {/* SCREEN 1: Globe / Graph */}
                                <div className="flex-1 w-full lg:w-auto min-w-[160px] xl:min-w-[180px] h-[100px] xl:h-[95px] bg-[#0a0503] rounded-[10px] border-[2px] border-t-[#1f0d08] border-l-[#1f0d08] border-r-[#f59e0b]/50 border-b-[#f59e0b] shadow-[inset_0_4px_25px_rgba(0,0,0,1),inset_0_-2px_15px_rgba(245,158,11,0.2),0_4px_6px_rgba(0,0,0,0.4)] p-2 relative overflow-hidden flex items-center justify-center shrink group">
                                    {/* Glass reflection top */}
                                    <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/10 to-transparent z-20 pointer-events-none"></div>

                                    {/* Grid background */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.15)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none opacity-50"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#070302]/60 to-[#070302]/90"></div>

                                    {/* Left Graph Bars */}
                                    <div className="absolute left-3 bottom-0 flex gap-[3px] items-end opacity-90 pb-3">
                                        <div className="w-1.5 h-6 bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] rounded-t-sm"></div>
                                        <div className="w-1.5 h-12 bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] rounded-t-sm"></div>
                                        <div className="w-1.5 h-5 bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] rounded-t-sm opacity-60"></div>
                                        <div className="w-1.5 h-14 bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] rounded-t-sm"></div>
                                        <div className="w-1.5 h-9 bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] rounded-t-sm"></div>
                                    </div>

                                    {/* Globe Graphic (Wireframe Style SVG) */}
                                    <div className="relative w-20 h-20 rounded-full border-[1.5px] border-[#f59e0b] shadow-[0_0_20px_#f59e0b] flex items-center justify-center z-10 bg-[#0f0604]/40 overflow-hidden">
                                        <svg className="w-[120%] h-[120%] text-[#f59e0b] opacity-80 animate-[spin_30s_linear_infinite]" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
                                            <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(30 50 50)" />
                                            <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(120 50 50)" />
                                            <ellipse cx="50" cy="50" rx="20" ry="45" fill="none" stroke="currentColor" strokeWidth="1" />
                                        </svg>
                                        <div className="absolute top-1 right-2 w-5 h-5 rounded-full bg-white/20 blur-[3px]"></div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full"></div>
                                    </div>

                                    {/* Right Graph Bars */}
                                    <div className="absolute right-3 bottom-0 flex gap-[3px] items-end pb-3">
                                        <div className="w-1.5 h-10 bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] rounded-t-sm opacity-70"></div>
                                        <div className="w-1.5 h-6 bg-[#fb923c] shadow-[0_0_8px_#fb923c] rounded-t-sm"></div>
                                        <div className="w-1.5 h-14 bg-[#fb923c] shadow-[0_0_8px_#fb923c] rounded-t-sm"></div>
                                        <div className="w-1.5 h-8 bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] rounded-t-sm opacity-50"></div>
                                    </div>
                                </div>

                                {/* STATUS BOX (Center) */}
                                <div className="flex flex-col justify-between w-full sm:w-[200px] xl:w-[200px] h-auto xl:h-[95px] gap-2 shrink-0 xl:shrink bg-gradient-to-b from-[#140805] to-[#0a0402] p-2.5 rounded-[10px] border-[2px] border-t-black/60 border-l-black/40 border-r-[#2d1a0f]/50 border-b-[#2d1a0f]/80 shadow-[inset_0_4px_15px_rgba(0,0,0,0.9),0_4px_6px_rgba(0,0,0,0.4)] relative">
                                    {/* Top Status LCD */}
                                    <div className="h-10 lg:h-[42px] bg-[#080302] rounded-[6px] border border-t-black border-b-[#451a03]/40 shadow-[inset_0_4px_10px_rgba(0,0,0,1)] flex items-center justify-center px-4 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[#f59e0b] opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#f59e0b_2px,#f59e0b_4px)] pointer-events-none"></div>
                                        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent z-20 pointer-events-none"></div>
                                        <span className="text-[#a3e635] font-mono text-[12px] lg:text-[13px] font-bold tracking-[0.15em] drop-shadow-[0_0_6px_rgba(163,230,53,0.8)] z-10">READY TO CONNECT...</span>
                                    </div>

                                    {/* Bottom Status LEDs */}
                                    <div className="flex-1 flex gap-2">
                                        <div className="flex-1 bg-[#080302] rounded-[6px] border border-t-black border-b-[#451a03]/40 shadow-[inset_0_3px_8px_rgba(0,0,0,1)] flex items-center justify-center gap-2 px-1 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#fdba74] to-[#166534] border border-[#064e3b] shadow-[0_0_12px_#fb923c,inset_0_1px_1px_rgba(255,255,255,0.6)] animate-[pulse_2s_ease-in-out_infinite]"></div>
                                            <span className="text-white font-black text-[10px] tracking-widest uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">ONLINE</span>
                                        </div>
                                        <div className="flex-1 bg-[#080302] rounded-[6px] border border-t-black border-b-[#451a03]/40 shadow-[inset_0_3px_8px_rgba(0,0,0,1)] flex items-center justify-center gap-2 px-1 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#fef08a] to-[#854d0e] border border-[#713f12] shadow-[0_0_12px_#facc15,inset_0_1px_1px_rgba(255,255,255,0.6)]"></div>
                                            <span className="text-[#facc15] font-black text-[10px] tracking-widest uppercase truncate drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">STATUS</span>
                                        </div>
                                    </div>
                                </div>

                                {/* SCREEN 2: Envelope / SEND MESSAGE container */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 min-w-0 xl:h-[95px] justify-end sm:ml-auto">
                                    {/* Envelope Screen */}
                                    <div className="w-full sm:w-[140px] xl:w-[140px] h-[90px] xl:h-[95px] bg-[#0a0503] rounded-[10px] border-[2px] border-t-[#1f0d08] border-l-[#1f0d08] border-r-[#f59e0b]/50 border-b-[#f59e0b] shadow-[inset_0_4px_25px_rgba(0,0,0,1),inset_0_-2px_15px_rgba(245,158,11,0.2),0_4px_6px_rgba(0,0,0,0.4)] relative overflow-hidden flex items-center justify-center shrink-0 group">
                                        {/* Glass reflection top */}
                                        <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/10 to-transparent z-20 pointer-events-none"></div>

                                        {/* Scanner Grid Background */}
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0%,transparent_70%)] opacity-80"></div>
                                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(245,158,11,0.3)_50%,transparent_51%),linear-gradient(transparent_49%,rgba(245,158,11,0.3)_50%,transparent_51%)] bg-[size:200%_200%] animate-[spin_10s_linear_infinite] opacity-30"></div>

                                        {/* Glowing ellipse */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[30px] border-[2px] border-[#f59e0b]/60 rounded-[100%] shadow-[0_0_15px_#f59e0b,inset_0_0_10px_#f59e0b]"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[50px] border border-[#f59e0b]/30 rounded-[100%]"></div>

                                        {/* Complete SVG Envelope */}
                                        <div className="relative z-10 w-16 h-11 bg-gradient-to-br from-white to-slate-200 shadow-[0_8px_15px_rgba(0,0,0,0.8)] transform -rotate-[5deg] skew-x-[-3deg] rounded-[4px] border-[1.5px] border-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <div className="absolute top-0 w-full h-1/2 overflow-hidden border-b-[1.5px] border-slate-300">
                                                <div className="w-full h-full border-b-[1.5px] border-slate-400 translate-y-1/2 scale-x-110"></div>
                                            </div>
                                            <svg className="w-8 h-8 text-blue-600 drop-shadow-sm z-0" fill="currentColor" viewBox="0 0 24 24"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" /><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" /></svg>
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-600 shadow-[0_0_8px_rgba(239,68,68,1)] border-[1.5px] border-red-800 flex items-center justify-center z-10">
                                                <div className="w-1 h-1 rounded-full bg-white opacity-40"></div>
                                            </div>
                                        </div>

                                        {/* Right edge tech numbers */}
                                        <div className="absolute right-2 bottom-2 text-[#f59e0b] opacity-60 text-[6px] font-mono leading-none tracking-widest text-right">
                                            <div>SYS.89.2</div>
                                            <div>LINK DET</div>
                                        </div>
                                    </div>

                                    {/* SEND MESSAGE Button */}
                                    <div className="w-full sm:w-auto flex items-center justify-end lg:items-center shrink-0 min-w-0 group relative">
                                        {/* Outer Drop Shadow & Ambient Glow */}
                                        <div className="absolute inset-2 bg-black/60 blur-[15px] translate-y-3 rounded-xl -z-10 group-hover:blur-[20px] transition-all"></div>

                                        <button className="w-full sm:w-auto h-[50px] lg:h-[60px] px-6 lg:px-10 xl:px-12 bg-[linear-gradient(180deg,#fde047_0%,#eab308_45%,#ca8a04_90%,#a16207_100%)] border-[2px] border-t-[#fef08a] border-b-[#713f12] border-x-[#b45309] rounded-[10px] text-[#451a03] font-black text-[14px] xl:text-[15px] uppercase tracking-wider hover:brightness-110 active:scale-[0.98] active:translate-y-[2px] transition-all whitespace-nowrap relative overflow-hidden flex items-center justify-center gap-2 shrink-0 shadow-[inset_0_4px_6px_rgba(255,255,255,0.7),inset_0_-6px_10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.9),0_6px_0_#713f12,0_10px_20px_rgba(0,0,0,0.8)] outline-none">
                                            {/* Specular Highlight Arc */}
                                            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-[8px]"></div>

                                            {/* Light Sweep Effect on Hover */}
                                            <div className="absolute inset-0 w-[150%] h-full bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.4)_30%,transparent_40%)] -translate-x-full group-hover:translate-x-[100%] transition-transform duration-[800ms] ease-in-out pointer-events-none"></div>

                                            <svg className="relative w-5 h-5 xl:w-6 xl:h-6 opacity-90 shrink-0 drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)] z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" /></svg>
                                            <span className="relative z-10 pt-[2px] drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">SEND MESSAGE</span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Strip: Privacy / LED Lights / Terms */}
                <div className="flex w-full items-stretch justify-center bg-[#140805] border-t-[3px] border-[#422416] h-[36px] md:h-[42px] px-auto relative z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.2)]">

                    {/* Left bevel segment */}
                    <div className="flex-1 bg-[#1f0d08] border-t border-[#d97706]/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-start px-6 md:px-12 relative">
                        {/* Screws */}
                        <div className="hidden sm:block absolute left-4 w-2 h-2 rounded-full bg-[#1f0d08] border border-[#422416]/50 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]"></div>
                        <a href="#" className="text-white/80 hover:text-white transition-colors text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] drop-shadow-md">PRIVACY POLICY</a>
                        {/* Angled cut visual simulator */}
                        <div className="absolute right-[-10px] top-0 h-full w-[20px] bg-[#1f0d08] transform skew-x-[30deg] border-t border-[#d97706]/40 z-10 border-r border-[#1f0d08]"></div>
                    </div>

                    {/* Center KPIs & Control Room Dashboard (Recessed) */}
                    <div className="shrink-0 w-[240px] md:w-[360px] bg-[#020817] shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)] flex flex-col justify-center gap-[2px] md:gap-1 px-2 md:px-4 relative z-0 border-x-2 border-[#1f0d08]/50 py-1">
                        {/* Upper Info Row */}
                        <div className="flex justify-between w-full px-2">
                            <span className="text-[#f59e0b] text-[7px] md:text-[9px] font-mono tracking-widest font-bold drop-shadow-[0_0_2px_#f59e0b]">SYS_CTRL_NODE</span>
                            <span className="text-red-500 text-[7px] md:text-[9px] font-mono tracking-widest font-bold animate-[pulse_1s_ease-in-out_infinite] drop-shadow-[0_0_4px_#ef4444]">RECORDING</span>
                        </div>

                        {/* Middle Action Row */}
                        <div className="flex items-center justify-center gap-2 md:gap-4 w-full px-2">
                            {/* Hazard stripe small block */}
                            <div className="flex-1 h-[6px] md:h-[8px] bg-[#1e293b] rounded-[2px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] border border-yellow-500/30 overflow-hidden">
                                <div className="w-full h-full bg-[repeating-linear-gradient(45deg,#000_0,#000_6px,#eab308_6px,#eab308_12px)] opacity-80"></div>
                            </div>

                            {/* Glowing NeoPixel dots */}
                            <div className="flex gap-2.5">
                                <div className="w-2 md:w-2.5 h-2 md:h-2.5 bg-[#fb923c] rounded-full shadow-[0_0_8px_#fb923c,inset_0_1px_1px_rgba(255,255,255,0.8)] opacity-90"></div>
                                <div className="w-2 md:w-2.5 h-2 md:h-2.5 bg-[#facc15] rounded-full shadow-[0_0_8px_#facc15,inset_0_1px_1px_rgba(255,255,255,0.8)] opacity-90"></div>
                                <div className="w-2 md:w-2.5 h-2 md:h-2.5 bg-[#ef4444] rounded-full shadow-[0_0_8px_#ef4444,inset_0_1px_1px_rgba(255,255,255,0.8)] opacity-90 animate-[pulse_0.5s_ease-in-out_infinite]"></div>
                            </div>

                            {/* Hazard stripe small block */}
                            <div className="flex-1 h-[6px] md:h-[8px] bg-[#1e293b] rounded-[2px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] border border-yellow-500/30 overflow-hidden">
                                <div className="w-full h-full bg-[repeating-linear-gradient(-45deg,#000_0,#000_6px,#eab308_6px,#eab308_12px)] opacity-80"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right bevel segment */}
                    <div className="flex-1 bg-[#1f0d08] border-t border-[#d97706]/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-end px-6 md:px-12 relative">
                        {/* Angled cut visual simulator */}
                        <div className="absolute left-[-10px] top-0 h-full w-[20px] bg-[#1f0d08] transform skew-x-[-30deg] border-t border-[#d97706]/40 z-10 border-l border-[#1f0d08]"></div>
                        <a href="#" className="text-white/80 hover:text-white transition-colors text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] drop-shadow-md z-20">TERMS</a>
                        {/* Screws */}
                        <div className="hidden sm:block absolute right-4 w-2 h-2 rounded-full bg-[#1f0d08] border border-[#422416]/50 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)] z-20"></div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default SoilFooter;
