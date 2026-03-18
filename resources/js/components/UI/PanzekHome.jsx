import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wifi,
    BatteryFull,
    Signal,
    FolderDot,
    UserIcon,
    Mail,
    Settings,
    Terminal as TerminalIcon,
    Camera as CameraIcon,
    MessageCircle,
    Music as MusicIcon,
    Hexagon,
    Circle,
    Square,
    ChevronLeft,
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Send,
    Volume2,
    Zap
} from 'lucide-react';

const TerminalApp = () => {
    const [history, setHistory] = useState([
        { type: 'output', text: 'PanzekOS Terminal v1.0.0' },
        { type: 'output', text: 'Type "help" for a list of commands.' }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim().toLowerCase();
            const newHistory = [...history, { type: 'input', text: cmd }];

            switch (cmd) {
                case 'help':
                    newHistory.push({ type: 'output', text: 'Available commands: help, clear, whoami, projects, logs, version' });
                    break;
                case 'clear':
                    setHistory([]);
                    setInput('');
                    return;
                case 'whoami':
                    newHistory.push({ type: 'output', text: 'user: KEVIN HERMANSYAH | role: Frontend Developer' });
                    break;
                case 'projects':
                    newHistory.push({ type: 'output', text: 'Loading projects... check /projects route.' });
                    break;
                case 'logs':
                    newHistory.push({ type: 'output', text: '[ERR] System logs encrypted. Access denied.' });
                    break;
                case 'version':
                    newHistory.push({ type: 'output', text: 'PanzekOS Kernel v1.0.4-stable' });
                    break;
                case '':
                    break;
                default:
                    newHistory.push({ type: 'output', text: `Command not found: ${cmd}` });
            }

            setHistory(newHistory);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0c0c0c] text-[#34d399] font-mono p-3 text-[9px]">
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 mb-2">
                {history.map((line, i) => (
                    <div key={i} className={line.type === 'input' ? 'text-white' : ''}>
                        {line.type === 'input' ? `> ${line.text}` : line.text}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-1 border-t border-[#34d399]/20 pt-2">
                <span>$</span>
                <input
                    autoFocus
                    className="bg-transparent border-none outline-none flex-1 text-white"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleCommand}
                />
            </div>
        </div>
    );
};

const SettingsApp = ({ performanceMode, setPerformanceMode }) => {
    return (
        <div className="flex flex-col h-full bg-[#1a1a1a] text-white p-4 space-y-4">
            <h3 className="text-[14px] font-bold border-bottom border-white/10 pb-2">System Settings</h3>

            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <Zap size={16} className={performanceMode === 120 ? "text-yellow-400" : "text-gray-400"} />
                        <div>
                            <p className="text-[10px] font-semibold">Refresh Rate</p>
                            <p className="text-[8px] opacity-60">120FPS High Performance</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setPerformanceMode(performanceMode === 120 ? 60 : 120)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${performanceMode === 120 ? 'bg-green-500' : 'bg-gray-600'}`}
                    >
                        <motion.div
                            animate={{ x: performanceMode === 120 ? 22 : 2 }}
                            className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-sm"
                        />
                    </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <Volume2 size={16} className="text-blue-400" />
                        <div>
                            <p className="text-[10px] font-semibold">Sound FX</p>
                            <p className="text-[8px] opacity-60">UI Interaction Sounds</p>
                        </div>
                    </div>
                    <div className="w-10 h-5 bg-green-500 rounded-full relative">
                        <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full" />
                    </div>
                </div>
            </div>

            <div className="mt-auto items-center justify-center flex flex-col gap-1 opacity-40">
                <p className="text-[7px]">PanzekOS Build 2026.03</p>
                <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-blue-500" />
                </div>
            </div>
        </div>
    );
};

const CameraApp = () => {
    const [shutter, setShutter] = useState(false);

    const triggerShutter = () => {
        setShutter(true);
        setTimeout(() => setShutter(false), 100);
    };

    return (
        <div className="relative h-full bg-black flex items-center justify-center overflow-hidden">
            {/* Viewfinder background (Mock) */}
            <div className="absolute inset-0 opacity-40" style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop")',
                backgroundSize: 'cover'
            }} />

            {/* Viewfinder UI */}
            <div className="absolute inset-4 border border-white/20 flex flex-col justify-between p-2 pointer-events-none">
                <div className="flex justify-between items-start">
                    <div className="w-4 h-4 border-t-2 border-l-2 border-white/60" />
                    <div className="w-4 h-4 border-t-2 border-r-2 border-white/60" />
                </div>
                <div className="flex justify-between items-end">
                    <div className="w-4 h-4 border-b-2 border-l-2 border-white/60" />
                    <div className="w-4 h-4 border-b-2 border-r-2 border-white/60" />
                </div>
            </div>

            {/* Shutter Overlay */}
            <AnimatePresence>
                {shutter && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white z-50 pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* Shutter Button */}
            <button
                onClick={triggerShutter}
                className="absolute bottom-6 w-12 h-12 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-transform"
            >
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/10" />
            </button>
        </div>
    );
};

const MessagesApp = () => {
    const chats = [
        { name: 'Admin', msg: 'Welcome to PanzekOS!', time: '10:07', avatar: 'bg-red-500' },
        { name: 'System', msg: 'Performance update ready.', time: '09:12', avatar: 'bg-blue-500' },
        { name: 'Notification', msg: 'New project visitor detected.', time: 'Yesterday', avatar: 'bg-green-500' }
    ];

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] p-2 space-y-2">
            <div className="px-2 py-1 flex justify-between items-center">
                <h4 className="text-[12px] font-black text-slate-800">Messages</h4>
                <Send size={12} className="text-blue-500" />
            </div>
            <div className="space-y-1">
                {chats.map((chat, i) => (
                    <div key={i} className="flex gap-2 p-2 bg-white rounded-xl shadow-sm border border-slate-100 items-center">
                        <div className={`w-8 h-8 rounded-full ${chat.avatar} flex items-center justify-center text-white text-[10px] font-bold`}>
                            {chat.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <p className="text-[9px] font-bold text-slate-800">{chat.name}</p>
                                <p className="text-[6px] text-slate-400">{chat.time}</p>
                            </div>
                            <p className="text-[8px] text-slate-500 truncate">{chat.msg}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MusicApp = () => {
    const [playing, setPlaying] = useState(false);
    return (
        <div className="flex flex-col h-full bg-[#1e293b] p-4 items-center justify-center text-white">
            <motion.div
                animate={{ rotate: playing ? 360 : 0 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 rounded-full border-4 border-slate-700 bg-slate-900 flex items-center justify-center shadow-2xl relative"
            >
                <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-slate-900" />
                </div>
            </motion.div>

            <div className="mt-6 text-center">
                <h4 className="text-[12px] font-black tracking-tight">Vaporwave Memories</h4>
                <p className="text-[8px] text-slate-400 uppercase tracking-widest mt-1">Panzek Original Soundtrack</p>
            </div>

            <div className="flex items-center gap-6 mt-8">
                <SkipBack size={18} className="text-slate-400 hover:text-white cursor-pointer" />
                <button
                    onClick={() => setPlaying(!playing)}
                    className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-xl active:scale-95 transition-transform"
                >
                    {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </button>
                <SkipForward size={18} className="text-slate-400 hover:text-white cursor-pointer" />
            </div>

            <div className="w-full mt-10 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    animate={{ width: playing ? '100%' : '30%' }}
                    transition={{ duration: 180 }}
                    className="h-full bg-rose-500"
                />
            </div>
        </div>
    );
};

const PanzekHome = ({ onNavigate }) => {
    const [time, setTime] = useState('');
    const [activeApp, setActiveApp] = useState(null);
    const [performanceMode, setPerformanceMode] = useState(120);
    const screenRef = useRef(null);
    const [isCompactScreen, setIsCompactScreen] = useState(false);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            let hours = now.getHours();
            let mins = now.getMinutes();
            hours = hours < 10 ? '0' + hours : hours;
            mins = mins < 10 ? '0' + mins : mins;
            setTime(`${hours}:${mins}`);
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined' || !screenRef.current || typeof ResizeObserver === 'undefined') {
            return;
        }

        const observer = new ResizeObserver(([entry]) => {
            setIsCompactScreen(entry.contentRect.width < 270);
        });

        observer.observe(screenRef.current);

        return () => observer.disconnect();
    }, []);

    const apps = useMemo(() => ([
        { id: 1, name: 'Projects', icon: <FolderDot size={isCompactScreen ? 16 : 18} strokeWidth={2.5} />, color: 'from-blue-400 to-blue-600', action: () => onNavigate?.('/projects') },
        { id: 2, name: 'Profile', icon: <UserIcon size={isCompactScreen ? 16 : 18} strokeWidth={2.5} />, color: 'from-purple-400 to-purple-600', action: () => onNavigate?.('/about') },
        { id: 3, name: 'Contact', icon: <Mail size={isCompactScreen ? 16 : 18} strokeWidth={2.5} />, color: 'from-green-400 to-green-600', action: () => onNavigate?.('/contact') },
        { id: 4, name: 'Settings', icon: <Settings size={isCompactScreen ? 16 : 18} strokeWidth={2.5} />, color: 'from-gray-500 to-gray-700', action: () => setActiveApp('Settings') },
        { id: 5, name: 'Terminal', icon: <TerminalIcon size={isCompactScreen ? 16 : 18} strokeWidth={2.5} />, color: 'from-slate-700 to-slate-900', action: () => setActiveApp('Terminal') },
        { id: 6, name: 'Camera', icon: <CameraIcon size={isCompactScreen ? 16 : 18} strokeWidth={2.5} />, color: 'from-yellow-400 to-yellow-600', action: () => setActiveApp('Camera') },
        { id: 7, name: 'Messages', icon: <MessageCircle size={isCompactScreen ? 16 : 18} strokeWidth={2.5} />, color: 'from-emerald-400 to-emerald-600', action: () => setActiveApp('Messages') },
        { id: 8, name: 'Music', icon: <MusicIcon size={isCompactScreen ? 16 : 18} strokeWidth={2.5} />, color: 'from-rose-400 to-rose-600', action: () => setActiveApp('Music') }
    ]), [isCompactScreen, onNavigate]);

    const transitionProps = {
        type: 'spring',
        stiffness: performanceMode === 120 ? 400 : 260,
        damping: performanceMode === 120 ? 30 : 20
    };
    const closeActiveApp = () => setActiveApp(null);

    return (
        <motion.div
            ref={screenRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: performanceMode === 120 ? 0.3 : 0.5, ease: 'easeOut' }}
            className="absolute inset-0 bg-[#0a0a0a] z-10 overflow-hidden flex flex-col font-sans"
            style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            {/* STATUS BAR */}
            <div className={`relative z-20 flex items-center justify-between text-white drop-shadow-md ${isCompactScreen ? 'px-2.5 py-1 text-[7px]' : 'px-3 py-1.5 text-[8px]'} font-medium`}>
                <span className="ml-1 tracking-wider">{time}</span>
                <div className="flex items-center gap-1.5 opacity-90">
                    <Signal size={9} strokeWidth={3} />
                    <span className="font-bold -ml-0.5 mt-[-1px] text-[7px]">5G</span>
                    <Wifi size={9} strokeWidth={3} />
                    <BatteryFull size={11} strokeWidth={2.5} className="ml-0.5" />
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative z-20 flex flex-col">
                <AnimatePresence mode="wait">
                    {!activeApp ? (
                        <motion.div
                            key="homescreen"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={transitionProps}
                            className="flex flex-col flex-1"
                        >
                            {/* CLOCK WIDGET */}
                            <div className={`flex flex-col items-center justify-center text-white drop-shadow-lg ${isCompactScreen ? 'mt-0.5 mb-2' : 'mt-1 mb-3'}`}>
                                <div className={isCompactScreen ? 'text-[22px] font-light tracking-[0.2em]' : 'text-[28px] font-light tracking-widest'}>{time}</div>
                                <div className={isCompactScreen ? 'mt-0.5 text-[6px] font-medium uppercase tracking-[0.28em] opacity-80' : 'mt-0.5 text-[7px] font-medium tracking-widest uppercase opacity-80'}>Wed, Mar 11</div>
                            </div>

                            {/* HOME GRID */}
                            <div className={`grid grid-cols-4 flex-1 content-start ${isCompactScreen ? 'gap-x-2 gap-y-2 px-4' : 'gap-x-3 gap-y-3 px-8'}`}>
                                {apps.map((app, index) => (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05, ...transitionProps }}
                                        className="flex flex-col items-center gap-1 cursor-pointer group"
                                        onClick={app.action}
                                    >
                                        <div className={`flex items-center justify-center rounded-xl border border-white/20 text-white bg-gradient-to-br ${app.color} shadow-lg shadow-black/30 transition-transform group-hover:scale-105 active:scale-95 ${isCompactScreen ? 'h-[30px] w-[30px]' : 'h-[36px] w-[36px]'}`}
                                            style={{
                                                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 8px rgba(0,0,0,0.4)'
                                            }}>
                                            {app.icon}
                                        </div>
                                        <span className={`text-white font-semibold tracking-wide drop-shadow-md ${isCompactScreen ? 'text-[6px]' : 'text-[7px]'}`}>
                                            {app.name}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className={`px-3 pb-1 ${isCompactScreen ? 'pt-1' : 'pt-2'}`}>
                                <div className={`rounded-full border border-white/15 bg-black/28 text-white/90 backdrop-blur-sm ${isCompactScreen ? 'px-2.5 py-1 text-[6px]' : 'px-3 py-1 text-[7px]'} text-center font-bold uppercase tracking-[0.22em]`}>
                                    Tap app icon to open
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="app-screen"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={transitionProps}
                            className="flex-1 overflow-hidden relative flex flex-col"
                        >
                            {/* APP HEADER (Subtle floating) */}
                            <div className={`absolute left-0 right-0 top-0 z-30 flex items-center pointer-events-none ${isCompactScreen ? 'h-5 px-2' : 'h-6 px-3'}`}>
                                <span className="text-[8px] font-black text-white/50 uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm mt-1">{activeApp}</span>
                            </div>

                            {/* App Content Area - Full Height */}
                            <div className="flex-1 overflow-hidden">
                                {activeApp === 'Settings' && <SettingsApp performanceMode={performanceMode} setPerformanceMode={setPerformanceMode} />}
                                {activeApp === 'Terminal' && <TerminalApp />}
                                {activeApp === 'Camera' && <CameraApp />}
                                {activeApp === 'Messages' && <MessagesApp />}
                                {activeApp === 'Music' && <MusicApp />}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* FLOATING ACTION BAR & HUD (Minimalist) */}
            <div className={`absolute left-0 right-0 z-40 flex items-end justify-between px-2 pointer-events-none ${isCompactScreen ? 'bottom-0.5' : 'bottom-1'}`}>
                {/* Left HUD */}
                <span className="text-white/20 text-[6px] font-black tracking-[0.2em] mb-1">IMG_01</span>

                {/* Center Navigation Content */}
                <div className={`pointer-events-auto flex flex-col items-center ${isCompactScreen ? 'gap-1 pb-0.5' : 'gap-1.5 pb-1'}`}>
                    {activeApp && (
                        <div className={`flex items-center rounded-full border border-white/15 bg-black/45 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition-opacity ${isCompactScreen ? 'gap-1 px-1.5 py-1' : 'gap-1.5 px-2 py-1.5'}`}>
                            <button
                                type="button"
                                aria-label="Back"
                                onClick={closeActiveApp}
                                className={`flex items-center justify-center rounded-full bg-white/6 text-white/90 transition hover:bg-white/12 hover:text-white active:scale-95 touch-manipulation ${isCompactScreen ? 'h-8 w-8' : 'h-9 w-9'}`}
                            >
                                <ChevronLeft size={isCompactScreen ? 14 : 15} strokeWidth={3} />
                            </button>
                            <button
                                type="button"
                                aria-label="Home"
                                onClick={closeActiveApp}
                                className={`flex items-center justify-center rounded-full bg-white/6 text-white/90 transition hover:bg-white/12 hover:text-white active:scale-95 touch-manipulation ${isCompactScreen ? 'h-8 w-8' : 'h-9 w-9'}`}
                            >
                                <Circle size={isCompactScreen ? 10 : 11} fill="currentColor" />
                            </button>
                            <button
                                type="button"
                                aria-label="Close app"
                                onClick={closeActiveApp}
                                className={`flex items-center justify-center rounded-full bg-white/6 text-white/90 transition hover:bg-white/12 hover:text-white active:scale-95 touch-manipulation ${isCompactScreen ? 'h-8 w-8' : 'h-9 w-9'}`}
                            >
                                <Square size={isCompactScreen ? 10 : 11} fill="currentColor" />
                            </button>
                        </div>
                    )}
                    {/* Gesture Pill */}
                    <div className={`${isCompactScreen ? 'h-[3px] w-12' : 'h-1 w-16'} rounded-full bg-white/40`} />
                </div>

                {/* Right HUD */}
                <span className="text-white/20 text-[6px] font-black tracking-[0.2em] mb-1">{activeApp ? 'APP' : 'HOME'}</span>
            </div>

            {/* Screen edge glare effect */}
            <div className="absolute inset-0 rounded-lg pointer-events-none border border-white/10 shadow-[inset_0_0_15px_rgba(255,255,255,0.03)] z-50" />
        </motion.div>
    );
};

export default PanzekHome;
