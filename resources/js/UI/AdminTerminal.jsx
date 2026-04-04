import React, { useMemo, useState, useContext, useEffect, useRef } from 'react';
import {
    Boxes,
    ChevronDown,
    ExternalLink,
    FolderKanban,
    Home,
    Inbox,
    Maximize2,
    Minimize2,
    LogOut,
    Mail,
    Minus,
    Plus,
    Save,
    SquarePen,
    Terminal,
    Trash2,
    X,
    Monitor,
    TerminalSquare,
    Smartphone,
    RotateCw,
} from 'lucide-react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

// Context to communicate between OS components
export const OSContext = React.createContext({
    windows: [],
    closeWindow: (id) => { },
    focusWindow: (id) => { },
    minimizeWindow: (id) => { },
    setTitle: (id, title) => { },
    navigateMenu: (href) => { },
    wallpaper: '',
    setWallpaper: (url) => { },
});

const xfceIconColors = {
    Dashboard: 'text-amber-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]',
    AdminProjects: 'text-sky-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]',
    Trash: 'text-zinc-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]',
    AdminProjectCreate: 'text-emerald-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]',
    AdminMessages: 'text-blue-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]',
    Terminal: 'text-zinc-800 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]',
    Appearance: 'text-indigo-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]',
};

const XfceIcon = ({ itemKey, Icon, className, size = 48 }) => {
    const color = xfceIconColors[itemKey] || 'text-zinc-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]';

    return (
        <div className={cx("flex items-center justify-center relative", className)} style={{ width: size, height: size }}>
            <Icon size={size - 8} className={cx("absolute", color)} strokeWidth={1.5} />
        </div>
    );
};

const toneClassNames = {
    neutral: 'border-zinc-400 text-zinc-800 hover:bg-zinc-100',
    blue: 'border-sky-500 text-sky-800 hover:bg-sky-50',
    green: 'border-emerald-500 text-emerald-800 hover:bg-emerald-50',
    amber: 'border-amber-500 text-amber-800 hover:bg-amber-50',
    red: 'border-rose-500 text-rose-800 hover:bg-rose-50',
};

const NAV_ITEMS = [
    { key: 'Trash', label: 'Trash', href: '#trash', icon: Trash2, tone: 'neutral' },
    { key: 'AdminProjects', label: 'File System', href: '/admin/projects', icon: FolderKanban, tone: 'neutral' },
    { key: 'Dashboard', label: 'Home', href: '/dashboard', icon: Home, tone: 'neutral' },
    { key: 'Terminal', label: 'Terminal Emulator', href: '#terminal', icon: TerminalSquare, tone: 'neutral' },
    { key: 'AdminProjectCreate', label: 'New Project', href: '/admin/projects/create', icon: Plus, tone: 'green' },
    { key: 'AdminMessages', label: 'Mail', href: '/admin/messages', icon: Mail, tone: 'blue' },
    { key: 'Appearance', label: 'Display Settings', href: '#appearance', icon: Monitor, tone: 'neutral' },
];

export const AdminTerminalButton = ({
    children,
    className = '',
    icon: Icon = null,
    tone = 'neutral',
    type = 'button',
    ...props
}) => {
    return (
        <button
            type={type}
            className={cx(
                'inline-flex items-center justify-center gap-2 rounded px-4 py-1.5 text-[13px] font-sans border bg-[#fcfcfc] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.1)] transition active:bg-[#e0e0e0] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] disabled:cursor-not-allowed disabled:opacity-50 text-[#333]',
                toneClassNames[tone] || toneClassNames.neutral,
                className
            )}
            {...props}
        >
            {Icon ? <Icon size={14} strokeWidth={2} /> : null}
            <span>{children}</span>
        </button>
    );
};

export const AdminDesktop = ({ windows, closeWindow, focusWindow, minimizeWindow, setTitle, navigateMenu, children }) => {
    const [wallpaper, setWallpaperState] = useState(() => localStorage.getItem('admin_wallpaper') || '');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showApplicationsMenu, setShowApplicationsMenu] = useState(false);
    const [isMobilePortrait, setIsMobilePortrait] = useState(false);
    const [isMobileLandscape, setIsMobileLandscape] = useState(false);
    const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(Boolean(document.fullscreenElement));
    const applicationsMenuRef = useRef(null);

    const setWallpaper = (url) => {
        setWallpaperState(url);
        if (url) localStorage.setItem('admin_wallpaper', url);
        else localStorage.removeItem('admin_wallpaper');
    };

    const handleLogout = async () => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        try {
            const response = await fetch('/logout', { method: 'POST', headers: { 'X-CSRF-TOKEN': csrfToken, Accept: 'application/json' } });
            window.location.href = response.redirected ? response.url : '/login?screen=sddm';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const osContextValue = {
        windows,
        closeWindow,
        focusWindow,
        minimizeWindow,
        setTitle,
        navigateMenu,
        wallpaper,
        setWallpaper
    };

    const activeWindow = [...windows].reverse().find((windowItem) => !windowItem.isMinimized) ?? null;
    const sessionLabel = 'XFCE';

    useEffect(() => {
        const syncViewportMode = () => {
            const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
            const portrait = window.matchMedia('(orientation: portrait)').matches;
            const compactWidth = window.innerWidth < 1100;

            setIsMobilePortrait(coarsePointer && compactWidth && portrait);
            setIsMobileLandscape(coarsePointer && compactWidth && !portrait);
        };

        const syncFullscreenState = () => {
            setIsBrowserFullscreen(Boolean(document.fullscreenElement));
        };

        syncViewportMode();
        syncFullscreenState();

        window.addEventListener('resize', syncViewportMode);
        window.addEventListener('orientationchange', syncViewportMode);
        document.addEventListener('fullscreenchange', syncFullscreenState);

        return () => {
            window.removeEventListener('resize', syncViewportMode);
            window.removeEventListener('orientationchange', syncViewportMode);
            document.removeEventListener('fullscreenchange', syncFullscreenState);
        };
    }, []);

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (!applicationsMenuRef.current?.contains(event.target)) {
                setShowApplicationsMenu(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
        };
    }, []);

    const toggleBrowserFullscreen = async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
                return;
            }

            await document.documentElement.requestFullscreen();
        } catch (error) {
            console.error('Fullscreen request failed:', error);
        }
    };

    const desktopIcons = useMemo(() => {
        const positions = [
            { top: '32px', left: '18px' },
            { top: '116px', left: '18px' },
            { top: '200px', left: '18px' },
            { top: '284px', left: '18px' },
            { top: '368px', left: '18px' },
            { top: '452px', left: '18px' },
        ];

        const targetKeys = ['Trash', 'AdminProjects', 'Dashboard'];
        const items = NAV_ITEMS.filter(n => targetKeys.includes(n.key));

        return items.map((item, index) => ({
            ...item,
            isActive: activeWindow && (activeWindow.page === item.key || (activeWindow.page.includes('Project') && item.key === 'AdminProjects')),
            position: positions[index] || { top: `${32 + index * 84}px`, left: '18px' },
        }));
    }, [activeWindow]);

    return (
        <OSContext.Provider value={osContextValue}>
            <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#245D8B] font-sans selection:bg-sky-500/30 text-[#e0e0e0]">
                {/* Desktop Background */}
                <div
                    className={cx(
                        "absolute inset-0 transition-all duration-500 overflow-hidden",
                        wallpaper
                            ? "bg-cover bg-center bg-no-repeat"
                            : "bg-[#1E5871]"
                    )}
                    style={wallpaper ? { backgroundImage: `url(${wallpaper})` } : {}}
                >
                    {!wallpaper && (
                        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-90 pointer-events-none">
                            <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="xfce-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#256c87" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#1e5871" stopOpacity="0" />
                                    </linearGradient>
                                    <linearGradient id="xfce-grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#81c496" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#1e5871" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <rect width="100%" height="100%" fill="#1E5871" />
                                <path d="M-100,-100 L400,800 L800,-100 Z" fill="url(#xfce-grad1)" />
                                <path d="M1200,-100 L400,800 L1200,1200 Z" fill="url(#xfce-grad2)" />
                                <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#2a7795" strokeWidth="20" opacity="0.4" />
                                <circle cx="50%" cy="50%" r="50%" fill="none" stroke="#81c496" strokeWidth="15" opacity="0.3" />
                                <circle cx="50%" cy="50%" r="60%" fill="none" stroke="#8369a8" strokeWidth="10" opacity="0.3" />
                            </svg>
                            <svg className="relative w-48 h-48 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-0" viewBox="0 0 512 512" fill="#fff" xmlns="http://www.w3.org/2000/svg">
                                <path d="M473 349c-10-8-25-15-40-15-20 0-41 12-58 26 2-10 3-21 3-32 0-35-15-68-41-91-23-22-54-34-85-34-21 0-42 6-61 17-23-26-59-42-97-42-45 0-85 24-106 63l-14-11c-6-5-15-4-19 2-5 6-4 15 2 19l24 19c-13 17-22 37-25 59h-24c-8 0-14 6-14 14s6 14 14 14h22c2 17 8 34 16 49L3 416c-6 5-6 14-2 19 5 6 14 6 19 2l32-26c19 23 45 40 76 48v8c0 8 6 14 14 14s14-6 14-14v-4c22 3 44 1 65-5 24 18 53 29 84 29 20 0 39-4 57-11 50-20 86-63 94-118 6 4 13 8 20 8 20 0 37-14 50-31 5-6 4-15-2-19zm-389 57c-24-11-42-32-50-57l25 21c6 5 15 4 19-2 5-6 4-15-2-19l-34-29c4-27 15-51 32-69 22-25 54-38 87-38 23 0 46 7 66 19-27 14-49 37-62 65-43 9-78 39-95 80l-12-10c-6-5-15-4-19 2-5 6-4 15 2 19l31 25c-8 16-13 34-16 52-6-3-11-6-16-9zm215 54c-55 0-101-44-105-99h33c8 0 14-6 14-14s-6-14-14-14h-33c4-54 49-98 105-98 58 0 105 47 105 105s-47 106-105 106zm129-106c-11 8-20 18-24 18s-13-10-24-18c-3-2-3-5 0-7 11-8 20-18 24-18s13 10 24 18c3 2 3 5 0 7z"/>
                                <circle cx="340" cy="280" r="16" fill="#1E5871" />
                            </svg>
                        </div>
                    )}

                    <div className="relative z-10 flex h-full flex-col">
                        <div className={cx(
                            "z-40 shrink-0 flex items-center justify-between bg-[#2d323a]/95 border-b border-[#1b1e23] px-1 text-[12px] text-[#f1f1f1] shadow-[0_1px_3px_rgba(0,0,0,0.5)]",
                            isMobileLandscape ? "h-[24px]" : "h-[26px]"
                        )}>
                            <div className="flex items-center h-full min-w-0">
                                <div ref={applicationsMenuRef} className="relative h-full shrink-0">
                                    <button
                                        type="button"
                                        className={cx(
                                            "flex h-full items-center gap-1.5 transition-colors cursor-default select-none group focus:outline-none shrink-0 px-2",
                                            showApplicationsMenu ? "bg-black/30" : "hover:bg-white/10",
                                            isMobileLandscape ? "px-2 text-[11px]" : "px-3"
                                        )}
                                        onClick={() => setShowApplicationsMenu((current) => !current)}
                                    >
                                        <div className="w-[14px] h-[14px] flex items-center justify-center rounded-full bg-white/20 text-white font-bold text-[9px] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">X</div>
                                        <span className="font-medium tracking-wide">Applications</span>
                                    </button>

                                    {showApplicationsMenu && (
                                        <div className="absolute left-0 top-full z-50 min-w-[240px] overflow-hidden rounded-b-[3px] border border-[#1b1e23] bg-[#2d323a] shadow-[0_10px_24px_rgba(0,0,0,0.5)]">
                                            <div className="border-b border-[#1b1e23] bg-[#2d323a] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9cb6d9]">
                                                Applications
                                            </div>

                                            <div className="py-1">
                                                {NAV_ITEMS.map((item) => {
                                                    const Icon = item.icon;
                                                    return (
                                                        <button
                                                            key={`applications-menu-${item.key}`}
                                                            type="button"
                                                            onClick={() => {
                                                                setShowApplicationsMenu(false);
                                                                navigateMenu(item.href);
                                                            }}
                                                            className="flex w-full items-center gap-3 px-3 py-2 text-left text-[12px] text-[#ddd] transition hover:bg-[#3e84c4] hover:text-white"
                                                        >
                                                            <Icon size={15} strokeWidth={2.1} />
                                                            <span className="flex-1">{item.label}</span>
                                                        </button>
                                                    );
                                                })}

                                                <div className="my-1 h-px bg-white/10" />

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowApplicationsMenu(false);
                                                        setShowLogoutConfirm(true);
                                                    }}
                                                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-[12px] text-[#ddd] transition hover:bg-[#3e84c4] hover:text-white"
                                                >
                                                    <LogOut size={15} strokeWidth={2.1} />
                                                    <span className="flex-1">Log Out</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="h-[14px] w-[1px] bg-white/10 shrink-0 mx-1" />

                                <div className={cx(
                                    "flex h-full items-center gap-[2px] overflow-hidden ml-1 text-[11px]",
                                    isMobileLandscape ? "max-w-[40vw]" : "max-w-md"
                                )}>
                                    {windows.map((win) => {
                                        const isFocused = activeWindow && activeWindow.id === win.id;
                                        return (
                                            <button
                                                key={`task-${win.id}`}
                                                className={cx(
                                                    "flex h-[22px] items-center gap-1.5 border border-transparent rounded-[2px] transition-colors select-none focus:outline-none truncate px-2",
                                                    isMobileLandscape ? "max-w-[110px]" : "max-w-[150px]",
                                                    isFocused
                                                        ? "bg-black/30 border-black/40 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                                                        : win.isMinimized
                                                            ? "bg-black/10 text-white/45 hover:bg-white/5"
                                                            : "bg-transparent hover:bg-white/10 text-white/70"
                                                )}
                                                onClick={() => focusWindow(win.id)}
                                            >
                                                <span className="truncate flex-1 text-left">{win.title || win.page}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center h-full shrink-0 gap-3 px-2 text-[11px] text-white/90 font-medium select-none">
                                <div>100%</div>
                                <div>{(new Date()).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} {(new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                {isMobileLandscape && (
                                    <button onClick={toggleBrowserFullscreen} className="hover:text-white text-white/80 transition-colors ml-1">
                                        <Maximize2 size={12} strokeWidth={2.4} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className={cx("relative flex-1", isMobileLandscape ? "p-0 pb-[72px]" : "p-2")}>
                            {desktopIcons.map(({ key, label, icon: Icon, isActive, position, href }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onDoubleClick={() => navigateMenu(href)}
                                    onClick={() => navigateMenu(href)}
                                    className="group absolute flex w-[72px] flex-col items-center gap-1.5 rounded-[4px] px-1 py-1 text-center border outline-none z-0 hover:bg-white/10 hover:border-white/20 transition-colors"
                                    style={{
                                        ...position,
                                        borderColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                                        backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent'
                                    }}
                                >
                                    <XfceIcon itemKey={key} Icon={Icon} size={42} className={cx("transition-opacity", isActive ? "opacity-100" : "opacity-90")} />
                                    <span className="w-full text-[11px] font-medium leading-[1.2] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,1)] break-words text-center select-none" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>
                                        {label}
                                    </span>
                                </button>
                            ))}

                            {children}

                            {!isMobileLandscape ? (
                                <div className="absolute inset-x-0 bottom-2 z-30 flex justify-center px-4 pointer-events-none">
                                    <div className="flex h-[40px] items-center gap-1.5 px-1.5 rounded-[4px] bg-[#2D323A]/90 border border-[#1b1e23] shadow-[0_8px_16px_rgba(0,0,0,0.4)] pointer-events-auto backdrop-blur-md">
                                        <button onClick={() => setShowApplicationsMenu(!showApplicationsMenu)} className="w-[32px] h-[32px] flex items-center justify-center rounded-[3px] hover:bg-white/10 active:bg-black/30 transition-colors">
                                            <div className="w-[20px] h-[20px] flex items-center justify-center rounded-full bg-white/20 text-white font-bold text-[13px] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">X</div>
                                        </button>
                                        <div className="w-[1px] h-[20px] bg-white/10 mx-0.5" />
                                        <button onClick={() => navigateMenu('#terminal')} className="w-[32px] h-[32px] flex items-center justify-center rounded-[3px] hover:bg-white/10 active:bg-black/30 text-zinc-300 transition-colors"><TerminalSquare size={20} strokeWidth={1.5} /></button>
                                        <button onClick={() => navigateMenu('/admin/projects')} className="w-[32px] h-[32px] flex items-center justify-center rounded-[3px] hover:bg-white/10 active:bg-black/30 text-sky-400 transition-colors"><FolderKanban size={20} strokeWidth={1.5} /></button>
                                        <button onClick={() => navigateMenu('/dashboard')} className="w-[32px] h-[32px] flex items-center justify-center rounded-[3px] hover:bg-white/10 active:bg-black/30 text-amber-400 transition-colors"><Home size={20} strokeWidth={1.5} /></button>
                                    </div>
                                </div>
                            ) : null}

                            {isMobileLandscape ? (
                                <div className="absolute inset-x-2 bottom-2 z-30">
                                    <div className="flex h-[40px] items-center gap-1.5 px-1.5 rounded-[4px] bg-[#2D323A]/95 border border-[#1b1e23] shadow-[0_8px_16px_rgba(0,0,0,0.4)] pointer-events-auto backdrop-blur-md overflow-x-auto">
                                        <button onClick={() => setShowApplicationsMenu(!showApplicationsMenu)} className="min-w-[32px] h-[32px] flex items-center justify-center rounded-[3px] hover:bg-white/10 active:bg-black/30 transition-colors shrink-0">
                                            <div className="w-[20px] h-[20px] flex items-center justify-center rounded-full bg-white/20 text-white font-bold text-[13px] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">X</div>
                                        </button>
                                        <div className="w-[1px] h-[20px] bg-white/10 mx-0.5 shrink-0" />
                                        <button onClick={() => navigateMenu('#terminal')} className="min-w-[32px] h-[32px] flex items-center justify-center rounded-[3px] hover:bg-white/10 active:bg-black/30 text-zinc-300 transition-colors shrink-0"><TerminalSquare size={20} strokeWidth={1.5} /></button>
                                        <button onClick={() => navigateMenu('/admin/projects')} className="min-w-[32px] h-[32px] flex items-center justify-center rounded-[3px] hover:bg-white/10 active:bg-black/30 text-sky-400 transition-colors shrink-0"><FolderKanban size={20} strokeWidth={1.5} /></button>
                                        <button onClick={() => navigateMenu('/dashboard')} className="min-w-[32px] h-[32px] flex items-center justify-center rounded-[3px] hover:bg-white/10 active:bg-black/30 text-amber-400 transition-colors shrink-0"><Home size={20} strokeWidth={1.5} /></button>
                                    </div>
                                </div>
                            ) : null}

                            {isMobilePortrait ? (
                                <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#05090f]/88 px-6 text-center backdrop-blur-md">
                                    <div className="w-full max-w-sm rounded-[28px] border border-white/12 bg-black/35 px-6 py-7 text-white shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-300/25 bg-sky-400/10 text-sky-200">
                                            <Smartphone size={28} strokeWidth={1.8} />
                                        </div>
                                        <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-sky-200/80">
                                            XFCE Session Locked
                                        </div>
                                        <div className="mt-3 text-2xl font-semibold tracking-tight">
                                            Rotate to Landscape
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-white/72">
                                            Admin desktop only runs in landscape on mobile so the XFCE desktop can use the full screen area.
                                        </p>
                                        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-white/84">
                                            <RotateCw size={16} strokeWidth={2} />
                                            <span>Turn your device sideways</span>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <AdminTerminalConfirm
                        open={showLogoutConfirm}
                        title="Log Out"
                        message={`Are you sure you want to close the session and log out of the XFCE environment?`}
                        confirmLabel="Log Out"
                        onCancel={() => setShowLogoutConfirm(false)}
                        onConfirm={handleLogout}
                    />
                </div>
            </div>
        </OSContext.Provider>
    );
};

export const AdminWindow = ({
    windowId,
    title,
    subtitle,
    meta = [],
    actions = [],
    children,
    initialWidth = 850,
    initialHeight = 550,
    hideMenuBar = false,
    hideToolbar = false,
    hideSidebar = false,
    hideStatusBar = false,
    contentClassName = '',
}) => {
    const os = useContext(OSContext);

    // Register the title with the OS context when it changes
    useEffect(() => {
        if (os.setTitle && title) {
            os.setTitle(windowId, title);
        }
    }, [title, windowId, os.setTitle]);

    const activeWindow = os.windows[os.windows.length - 1];
    const isFocused = activeWindow && activeWindow.id === windowId;

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isCompactTouchSession, setIsCompactTouchSession] = useState(false);

    // Stagger initial positions slightly based on window length to prevent pure overlapping
    const offset = (os.windows.findIndex(w => w.id === windowId) * 20) || 0;
    const [pos, setPos] = useState({ x: 150 + offset, y: 60 + offset });
    const [size, setSize] = useState({ w: initialWidth, h: initialHeight });
    const minWindowWidth = 400;
    const minWindowHeight = 300;

    useEffect(() => {
        const syncCompactSession = () => {
            const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
            const portrait = window.matchMedia('(orientation: portrait)').matches;
            const compactWidth = window.innerWidth < 1100;

            setIsCompactTouchSession(coarsePointer && compactWidth && !portrait);
        };

        syncCompactSession();
        window.addEventListener('resize', syncCompactSession);
        window.addEventListener('orientationchange', syncCompactSession);

        return () => {
            window.removeEventListener('resize', syncCompactSession);
            window.removeEventListener('orientationchange', syncCompactSession);
        };
    }, []);

    const useFullscreenLayout = isFullscreen || isCompactTouchSession;
    const showMenuBar = !hideMenuBar && !isCompactTouchSession;
    const showToolbar = !hideToolbar;
    const showSidebar = !hideSidebar && !isCompactTouchSession;
    const showWindowHeader = Boolean(title || subtitle || meta.length || actions.length);

    const focusObject = () => os.focusWindow(windowId);

    const handleMouseDown = (e) => {
        if (useFullscreenLayout) return;
        if (e.target.closest('.window-controls')) return;

        focusObject();
        e.preventDefault();
        const startX = e.clientX - pos.x;
        const startY = e.clientY - pos.y;

        const onMouseMove = (moveEvent) => {
            setPos({
                x: moveEvent.clientX - startX,
                y: Math.max(0, moveEvent.clientY - startY)
            });
        };
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const handleResizeDown = (direction, e) => {
        if (useFullscreenLayout) return;
        focusObject();
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const startW = size.w;
        const startH = size.h;
        const startLeft = pos.x;
        const startTop = pos.y;

        const onMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            let nextWidth = startW;
            let nextHeight = startH;
            let nextLeft = startLeft;
            let nextTop = startTop;

            if (direction.includes('right')) {
                nextWidth = Math.max(minWindowWidth, startW + deltaX);
            }

            if (direction.includes('left')) {
                nextWidth = Math.max(minWindowWidth, startW - deltaX);
                nextLeft = startLeft + (startW - nextWidth);
            }

            if (direction.includes('bottom')) {
                nextHeight = Math.max(minWindowHeight, startH + deltaY);
            }

            if (direction.includes('top')) {
                nextHeight = Math.max(minWindowHeight, startH - deltaY);
                nextTop = Math.max(0, startTop + (startH - nextHeight));
            }

            setPos({
                x: nextLeft,
                y: nextTop,
            });

            setSize({
                w: nextWidth,
                h: nextHeight,
            });
        };
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const resizeHandles = [
        { key: 'top', direction: 'top', className: 'absolute left-3 right-3 top-0 h-1 cursor-n-resize z-50' },
        { key: 'bottom', direction: 'bottom', className: 'absolute bottom-0 left-3 right-3 h-1 cursor-s-resize z-50' },
        { key: 'left', direction: 'left', className: 'absolute left-0 top-3 bottom-3 w-1 cursor-w-resize z-50' },
        { key: 'right', direction: 'right', className: 'absolute right-0 top-3 bottom-3 w-1 cursor-e-resize z-50' },
        { key: 'top-left', direction: 'top-left', className: 'absolute left-0 top-0 h-3 w-3 cursor-nw-resize z-50' },
        { key: 'top-right', direction: 'top-right', className: 'absolute right-0 top-0 h-3 w-3 cursor-ne-resize z-50' },
        { key: 'bottom-left', direction: 'bottom-left', className: 'absolute bottom-0 left-0 h-3 w-3 cursor-sw-resize z-50' },
        { key: 'bottom-right', direction: 'bottom-right', className: 'absolute bottom-0 right-0 h-3 w-3 cursor-se-resize z-50 flex items-end justify-end p-[2px]' },
    ];

    return (
        <div
            onMouseDownCapture={focusObject}
            className={cx(
                'absolute flex flex-col bg-[#F4F4F4] overflow-hidden',
                useFullscreenLayout
                    ? cx(
                        'inset-0 z-50 shadow-[0_0_0_1px_rgba(0,0,0,0.3)]',
                        isCompactTouchSession ? 'rounded-none' : 'rounded-t-[5px] rounded-b-[3px]'
                    )
                    : 'rounded-t-[5px] rounded-b-[3px] shadow-[0_15px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,0,0,0.3)]',
                isFocused ? 'z-30' : 'z-20 opacity-[0.98]'
            )}
            style={!useFullscreenLayout ? { left: `${pos.x}px`, top: `${pos.y}px`, width: `${size.w}px`, height: `${size.h}px` } : {}}
        >
            {/* Title Bar */}
            <div
                className={cx(
                    "flex items-center justify-between px-1 border-b select-none shrink-0",
                    isCompactTouchSession ? "h-[30px]" : "h-[24px]",
                    isFocused
                        ? "bg-[#D6D6D6] border-[#B5B5B5] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                        : "bg-[#E3E3E3] border-[#B5B5B5] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] opacity-90"
                )}
                onDoubleClick={() => setIsFullscreen(!useFullscreenLayout)}
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center gap-1.5 px-1.5 shrink-0 pointer-events-none">
                    <Terminal size={12} strokeWidth={2.5} className={isFocused ? "text-[#333]" : "text-[#888]"} />
                    <span className={cx(
                        "text-[12px] font-bold tracking-wide pointer-events-none",
                        isFocused ? "text-[#222]" : "text-[#777]"
                    )} style={{ textShadow: isFocused ? '0 1px 0 rgba(255,255,255,0.6)' : 'none' }}>
                        {title}
                    </span>
                </div>
                <div className="flex-1" />
                <div className="window-controls flex items-center gap-[2px] pr-0.5 shrink-0" onMouseDown={e => e.stopPropagation()}>
                    <button
                        type="button"
                        className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-[2px] border border-[#A1A1A1] bg-[#DBDBDB] text-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_1px_rgba(0,0,0,0.05),0_1px_1px_rgba(0,0,0,0.1)] hover:bg-[#EAEAEA] active:bg-[#C9C9C9]"
                        onClick={() => os.minimizeWindow(windowId)}
                    >
                        <Minus size={10} strokeWidth={4} className={!isFocused ? 'opacity-50' : ''} />
                    </button>
                    <button
                        type="button"
                        className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-[2px] border border-[#A1A1A1] bg-[#DBDBDB] text-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_1px_rgba(0,0,0,0.05),0_1px_1px_rgba(0,0,0,0.1)] hover:bg-[#EAEAEA] active:bg-[#C9C9C9]"
                        onClick={() => setIsFullscreen(!useFullscreenLayout)}
                    >
                        {useFullscreenLayout ? <Minimize2 size={10} strokeWidth={3} className={!isFocused ? 'opacity-50' : ''} /> : <Maximize2 size={10} strokeWidth={3} className={!isFocused ? 'opacity-50' : ''} />}
                    </button>
                    <button
                        type="button"
                        className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-[2px] border border-[#A1A1A1] bg-[#DBDBDB] text-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-1px_1px_rgba(0,0,0,0.05),0_1px_1px_rgba(0,0,0,0.1)] hover:border-[#b34848] hover:bg-[#DF7373] hover:text-white active:bg-[#D55F5F]"
                        onClick={() => os.closeWindow(windowId)}
                    >
                        <X size={10} strokeWidth={4} className={!isFocused ? 'opacity-50' : ''} />
                    </button>
                </div>
            </div>

            {/* Menu bar */}
            {showMenuBar && (
                <div className="flex h-[24px] items-center gap-3 bg-[#EAEAEA] border-b border-[#D4D4D4] px-1 text-[11px] text-zinc-800 select-none shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,1)]">
                    <span className="hover:border-[#96B4D6] hover:bg-[#DDE9F6] border border-transparent px-1.5 py-0.5 rounded-[3px] cursor-default leading-tight">File</span>
                    <span className="hover:border-[#96B4D6] hover:bg-[#DDE9F6] border border-transparent px-1.5 py-0.5 rounded-[3px] cursor-default leading-tight">Edit</span>
                    <span className="hover:border-[#96B4D6] hover:bg-[#DDE9F6] border border-transparent px-1.5 py-0.5 rounded-[3px] cursor-default leading-tight">View</span>
                    <span className="hover:border-[#96B4D6] hover:bg-[#DDE9F6] border border-transparent px-1.5 py-0.5 rounded-[3px] cursor-default leading-tight">Help</span>
                </div>
            )}

            {/* Toolbar */}
            {showToolbar && (
                <div className={cx(
                    "flex items-center gap-1 bg-[#F5F5F5] border-b border-[#D0D0D0] px-2 shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,1)]",
                    isCompactTouchSession ? "h-[30px]" : "h-[32px]"
                )}>
                    <div className="flex px-1 gap-1">
                        <button className="p-1 px-[6px] hover:border-[#96B4D6] hover:bg-[#DDE9F6] border border-transparent rounded-[3px] cursor-default text-zinc-600"><ChevronDown size={14} className="rotate-90" strokeWidth={1.5} /></button>
                        <button className="p-1 px-[6px] hover:border-[#96B4D6] hover:bg-[#DDE9F6] border border-transparent rounded-[3px] cursor-default text-zinc-600"><ChevronDown size={14} className="-rotate-90" strokeWidth={1.5} /></button>
                    </div>
                    <div className="w-[1px] h-[20px] bg-[#D4D4D4] shadow-[1px_0_0_rgba(255,255,255,0.7)] mx-0.5"></div>
                    <button className="p-1 px-1.5 hover:border-[#96B4D6] hover:bg-[#DDE9F6] border border-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] bg-transparent rounded-[3px] cursor-default text-zinc-600 focus:outline-none" onClick={() => os.navigateMenu('/dashboard')}>
                        <Home size={14} />
                    </button>
                    <div className="w-[1px] h-[20px] bg-[#D4D4D4] shadow-[1px_0_0_rgba(255,255,255,0.7)] mx-0.5"></div>
                    <div className="flex-1 flex items-center bg-white border border-[#B0B0B0] shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] rounded-[3px] h-[24px] px-2 text-[11px] text-zinc-700 truncate ml-1 select-none focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500/30">
                        <Terminal size={12} className="mr-2 text-zinc-400" />
                        /admin/window/{windowId}
                    </div>
                </div>
            )}

            {/* Window Body */}
            <div className="flex-1 flex overflow-hidden text-zinc-800" style={showSidebar ? {} : { backgroundColor: 'transparent' }}>
                {/* Sidebar */}
                {showSidebar && (
                    <div className="w-[160px] border-r border-[#C5C5C5] bg-[#F4F4F4] overflow-y-auto hidden md:block select-none shrink-0 shadow-[inset_-1px_0_0_rgba(255,255,255,0.6)]">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase px-3 py-1.5 pt-3">Places</div>
                        <div className="flex flex-col px-1 pb-2">
                            {NAV_ITEMS.filter(item => item.href.startsWith('/') || item.key === 'Trash').map(nav => (
                                <button
                                    key={nav.key}
                                    className={cx(
                                        "flex items-center gap-2.5 px-2 py-1 text-[12px] cursor-default rounded-[3px] border border-transparent mx-1 mb-[1px]",
                                        "text-zinc-800 hover:bg-[#DDE9F6] hover:border-[#adc4e3] focus:outline-none"
                                    )}
                                    onClick={() => os.navigateMenu(nav.href)}
                                >
                                    <nav.icon size={16} className={nav.tone === 'blue' ? 'text-blue-500' : (nav.tone === 'green' ? 'text-emerald-500' : 'text-zinc-500')} />
                                    <span className="truncate">{nav.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className={cx(
                    "flex-1 overflow-auto relative transition-opacity flex flex-col",
                    showSidebar ? "bg-white" : "bg-white",
                    contentClassName,
                    !isFocused && 'opacity-[0.85] pointer-events-none'
                )}>
                    {/* Content Header overlay preventer */}
                    {!isFocused && <div className="absolute inset-0 z-40 bg-transparent" onClick={focusObject} />}

                    {showWindowHeader ? (
                        <div className={cx("flex-1", isCompactTouchSession ? "p-3" : "p-4")}>
                            <header className="mb-4 text-zinc-800 border-b border-zinc-200 pb-4">
                                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                    <div>
                                        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
                                        {subtitle && <p className="mt-1 text-[13px] text-zinc-600">{subtitle}</p>}
                                    </div>

                                    {actions.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {actions.map((action) => (
                                                <AdminTerminalButton key={action.label} tone={action.tone} icon={action.icon} onClick={action.onClick}>
                                                    {action.label}
                                                </AdminTerminalButton>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {meta.length > 0 ? (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {meta.map((item) => (
                                            <span
                                                key={`${item.label}-${item.value}`}
                                                className={cx(
                                                    'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em]',
                                                    item.tone === 'green' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : '',
                                                    item.tone === 'blue' ? 'border-sky-200 bg-sky-50 text-sky-700' : '',
                                                    item.tone === 'amber' ? 'border-amber-200 bg-amber-50 text-amber-700' : '',
                                                    item.tone === 'red' ? 'border-rose-200 bg-rose-50 text-rose-700' : '',
                                                    !['green', 'blue', 'amber', 'red'].includes(item.tone) ? 'border-zinc-200 bg-zinc-100 text-zinc-700' : ''
                                                )}
                                            >
                                                <span className="opacity-70">{item.label}</span>
                                                <span className="tracking-[0.08em] normal-case">{item.value}</span>
                                            </span>
                                        ))}
                                    </div>
                                ) : null}
                            </header>
                            <div className="text-[13px]">
                                {children}
                            </div>
                        </div>
                    ) : (
                        <div className={cx("flex-1 w-full h-full text-[13px]", isCompactTouchSession ? "p-2.5" : "")}>
                            {children}
                        </div>
                    )}
                </div>
            </div>

            {/* Status bar */}
            {!hideStatusBar && (
                <div className="flex h-5 items-center bg-[#EDEDED] border-t border-[#D4D4D4] px-2 text-[11px] text-zinc-600 shrink-0 select-none">
                    {title} window active
                </div>
            )}

            {/* Resize Handles */}
            {!useFullscreenLayout && (
                <>
                    {resizeHandles.map((handle) => (
                        <div
                            key={handle.key}
                            className={handle.className}
                            onMouseDown={(event) => handleResizeDown(handle.direction, event)}
                        >
                            {handle.key === 'bottom-right' ? (
                                <div className="h-1.5 w-1.5 border-b border-r border-zinc-400" />
                            ) : null}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

// Expose the other components cleanly
export const AdminTerminalPanel = ({ title, command, children, className = '', headerAction = null }) => {
    return (
        <section className={cx('rounded border border-[#B5B5B5] bg-[#F2F2F2] p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)] mb-4', className)}>
            {(title || headerAction) ? (
                <div className="mb-3 flex flex-col gap-2 border-b border-[#D4D4D4] pb-2 sm:flex-row sm:items-center sm:justify-between shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                    <div>
                        {title && <h2 className="text-[13px] font-bold text-[#333] mb-0.5 tracking-wide" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.8)' }}>{title}</h2>}
                    </div>
                    {headerAction}
                </div>
            ) : null}
            <div className="text-zinc-800">
                {children}
            </div>
        </section>
    );
};

export const AdminTerminalStat = ({ label, value, hint, tone = 'neutral' }) => {
    const accents = {
        neutral: 'bg-[#FDFDFD]',
        blue: 'bg-[#EAF2FA]',
        green: 'bg-[#EBF7EF]',
        amber: 'bg-[#FDF9EA]',
        red: 'bg-[#F9ECEB]',
    };

    return (
        <div className={cx('rounded-[3px] border border-[#a0a0a0] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.05)]', accents[tone] || accents.neutral)}>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#666]">{label}</div>
            <div className="mt-1 text-2xl font-bold text-[#111]">{value}</div>
            {hint && <div className="mt-1 text-[11px] opacity-90 text-[#555]">{hint}</div>}
        </div>
    );
};

export const AdminTerminalAction = ({ icon: Icon, label, description, tone = 'neutral', onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cx(
                'rounded-[3px] border p-2.5 text-left transition shadow-[0_1px_1px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)]',
                toneClassNames[tone] || toneClassNames.neutral
            )}
        >
            <div className="flex items-start gap-3">
                {Icon && <div className="p-1 rounded bg-black/5 border border-black/10 shadow-sm"><Icon size={16} strokeWidth={2} className="opacity-80" /></div>}
                <div>
                    <div className="text-[12px] font-bold text-[#222] tracking-wide">{label}</div>
                    <div className="mt-0.5 text-[11px] opacity-90 text-[#444] leading-tight">{description}</div>
                </div>
            </div>
        </button>
    );
};

export const AdminTerminalTable = ({ columns, rows, emptyLabel = 'No records found.' }) => {
    if (!rows.length) {
        return <AdminTerminalEmpty title={emptyLabel} description="Nothing to display in this list." />;
    }

    return (
        <div className="overflow-hidden rounded-[4px] border border-[#a0a0a0] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="hidden grid-cols-[repeat(var(--col-count),minmax(0,1fr))] bg-[linear-gradient(180deg,#F5F5F5_0%,#E4E4E4_100%)] border-b border-[#a0a0a0] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] md:grid" style={{ '--col-count': columns.length }}>
                {columns.map((column, i) => (
                    <div key={column} className={cx("px-3 py-1.5 text-[11px] font-bold text-[#444] border-r border-[#bebebe] last:border-0 shadow-[1px_0_0_rgba(255,255,255,0.7)]", i === 0 ? "border-l-0" : "")} style={{ textShadow: '0 1px 0 rgba(255,255,255,0.8)' }}>{column}</div>
                ))}
            </div>

            <div className="divide-y divide-[#D4D4D4]">
                {rows.map((row, rowIndex) => (
                    <div key={row.key || rowIndex} className="grid md:grid-cols-[repeat(var(--col-count),minmax(0,1fr))] hover:bg-[#DDE9F6] transition-colors" style={{ '--col-count': columns.length }}>
                        {row.cells.map((cell, cellIndex) => (
                            <div key={`${row.key || rowIndex}-${cellIndex}`} className={cx("min-w-0 px-3 py-2 border-r border-[#E0E0E0] md:last:border-0 flex items-center")}>
                                <div className="mb-1 text-[10px] font-bold text-zinc-500 md:hidden uppercase tracking-wider">{columns[cellIndex]}</div>
                                <div className="text-[12px] text-zinc-800 truncate">{cell}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
export const AdminTerminalField = ({
    label,
    name,
    value,
    onChange,
    error,
    as = 'input',
    rows = 5,
    className = '',
    ...props
}) => {
    const fieldClassName = cx(
        'w-full rounded-[2px] border border-[#a0a0a0] bg-white px-2.5 py-1.5 text-[12px] text-[#333] outline-none transition focus:border-[#60a0f0] focus:ring-1 focus:ring-[#60a0f0] shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)] mt-1',
        as === 'textarea' ? 'min-h-[100px] resize-y' : '',
        className
    );

    return (
        <label className="block mb-3">
            <div className="text-[12px] font-bold text-[#444] px-0.5">{label}</div>
            {as === 'textarea' ? (
                <textarea name={name} value={value} onChange={onChange} rows={rows} className={fieldClassName} {...props} />
            ) : (
                <input name={name} value={value} onChange={onChange} className={fieldClassName} {...props} />
            )}
            {error ? <div className="mt-1 text-[11px] font-bold text-[#b34848] tracking-wide">{error}</div> : null}
        </label>
    );
};

export const AdminTerminalStatusPicker = ({ value, onChange }) => {
    const items = [
        { value: 'draft', label: 'Draft', description: 'Hidden from public', icon: SquarePen },
        { value: 'published', label: 'Published', description: 'Visible to public', icon: Save },
    ];

    return (
        <div className="mb-3">
             <div className="text-[12px] font-bold text-[#444] px-0.5 mb-1">Status</div>
             <div className="flex gap-0 border border-[#a0a0a0] rounded-[2px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] bg-white overflow-hidden w-fit">
                 {items.map((item, index) => {
                     const isActive = value === item.value;
                     const Icon = item.icon;

                     return (
                         <label
                             key={item.value}
                             className={cx(
                                 'cursor-pointer transition flex items-center gap-2 px-3 py-1.5',
                                 isActive
                                     ? 'bg-[linear-gradient(180deg,#D4E6FA_0%,#B8D5F6_100%)] text-[#1A4B85] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]'
                                     : 'bg-[linear-gradient(180deg,#F8F8F8_0%,#E4E4E4_100%)] text-[#444] hover:bg-[linear-gradient(180deg,#FFFFFF_0%,#ECECEC_100%)]',
                                 index > 0 ? 'border-l border-[#a0a0a0]' : ''
                             )}
                         >
                             <input
                                 type="radio"
                                 name="status"
                                 value={item.value}
                                 checked={isActive}
                                 onChange={onChange}
                                 className="sr-only"
                             />
                             <Icon size={14} className={isActive ? "text-[#1A4B85]" : "text-[#666]"} strokeWidth={isActive ? 2.5 : 2} />
                             <div className="text-[12px] font-bold" style={isActive ? { textShadow: '0 1px 0 rgba(255,255,255,0.6)' } : {}}>{item.label}</div>
                         </label>
                     );
                 })}
             </div>
        </div>
    );
};

export const AdminTerminalUpload = ({ label, imagePreview, onChange, error }) => {
    return (
        <label className="block mb-3">
            <div className="mb-1 text-[12px] font-bold text-[#444]">{label || 'Upload file'}</div>
            <div className="rounded-[3px] border border-[#a0a0a0] bg-[#FAFAFA] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] p-3 transition focus-within:border-sky-500 hover:border-[#808080]">
                <input type="file" accept="image/*" onChange={onChange} className="mb-2 block w-full text-[12px] text-zinc-600 file:mr-3 file:rounded-[2px] file:border file:border-[#a0a0a0] file:bg-[linear-gradient(180deg,#F5F5F5_0%,#E0E0E0_100%)] file:px-3 file:py-1 file:font-bold file:text-[#333] file:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_1px_rgba(0,0,0,0.05)] hover:file:bg-[linear-gradient(180deg,#FAFAFA_0%,#E8E8E8_100%)] active:file:bg-[linear-gradient(180deg,#D0D0D0_0%,#E5E5E5_100%)] active:file:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] cursor-pointer" />
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-56 mt-2 rounded-[2px] border border-[#888] bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] p-1 shadow-[0_1px_3px_rgba(0,0,0,0.2)] object-contain" />
                ) : (
                    <div className="rounded-[2px] border border-dashed border-[#b0b0b0] bg-white px-3 py-6 text-center text-[12px] text-[#666] shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] mt-2">
                        No image selected. Upload PNG or JPG.
                    </div>
                )}
            </div>
            {error ? <div className="mt-1 text-[12px] text-rose-600">{error}</div> : null}
        </label>
    );
};

export const AdminTerminalNotice = ({ type = 'info', message }) => {
    const classNames = {
        info: 'bg-[linear-gradient(180deg,#F0F6FC_0%,#E0EEFA_100%)] text-[#2C5282]',
        success: 'bg-[linear-gradient(180deg,#F0FAF2_0%,#E0F5E6_100%)] text-[#276749]',
        error: 'bg-[linear-gradient(180deg,#FEF2F2_0%,#FEE2E2_100%)] text-[#9B2C2C]',
    };

    return (
        <div className={cx('rounded-[3px] border border-[#a0a0a0] px-3 py-2 text-[12px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_1px_rgba(0,0,0,0.05)] mb-3', classNames[type] || classNames.info)}>
            {message}
        </div>
    );
};

export const AdminTerminalEmpty = ({ title, description, action = null }) => {
    return (
        <div className="rounded-[4px] border border-[#a0a0a0] bg-[#FAFAFA] px-4 py-8 text-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(180deg,#F5F5F5_0%,#E0E0E0_100%)] text-[#888] shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)] border border-[#c0c0c0]">
                <Inbox size={26} strokeWidth={1.5} />
            </div>
            <div className="mt-4 text-[13px] font-bold text-[#333] tracking-wide" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.8)' }}>{title}</div>
            <div className="mx-auto mt-1 max-w-sm text-[12px] text-[#666]">{description}</div>
            {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
        </div>
    );
};

export const AdminTerminalConfirm = ({
    open,
    title,
    message,
    onCancel,
    onConfirm,
    confirmLabel = 'Confirm',
}) => {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 font-sans backdrop-blur-[1px]">
            <div className="w-full max-w-sm rounded-[5px] border border-[#a0a0a0] bg-[#F2F2F2] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,0,0,0.3)] overflow-hidden">
                {/* Dialog Titlebar */}
                <div className="bg-[linear-gradient(180deg,#EBEBEB_0%,#C9C9C9_100%)] border-b border-[#a9a9a9] px-2 py-1 text-[12px] font-bold text-[#333] tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] text-center h-[24px]">
                    Confirm Action
                </div>

                <div className="p-4 bg-white border-b border-[#e0e0e0]">
                    <div className="mt-0.5 text-[14px] font-bold text-zinc-800 flex items-center gap-2">
                        <div className="text-amber-500"><Inbox size={18} /></div>
                        {title}
                    </div>
                    <div className="mt-2 ml-6 text-[12px] text-zinc-600 leading-relaxed">{message}</div>
                </div>

                <div className="bg-[#F6F6F6] p-3 flex justify-end gap-2 border-t border-[#e0e0e0]">
                    <button
                        onClick={onCancel}
                        className="rounded-[3px] border border-[#a0a0a0] bg-[linear-gradient(180deg,#Fcfcfc_0%,#e0e0e0_100%)] px-4 py-1.5 text-[12px] text-zinc-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_1px_rgba(0,0,0,0.1)] hover:bg-[linear-gradient(180deg,#FFF_0%,#Eaeaea_100%)] active:bg-[linear-gradient(180deg,#d5d5d5_0%,#Eaeaea_100%)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-[3px] border border-[#b34848] bg-[linear-gradient(180deg,#E88686_0%,#C85050_100%)] px-4 py-1.5 text-[12px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_1px_rgba(0,0,0,0.1)] hover:bg-[linear-gradient(180deg,#F09898_0%,#D06060_100%)] active:bg-[linear-gradient(180deg,#B04444_0%,#C85050_100%)] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] flex items-center gap-1.5"
                    >
                        <Trash2 size={13} strokeWidth={2.5} />
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const adminTerminalIcons = {
    Boxes,
    FolderKanban,
    LogOut,
    Mail,
    Plus,
    Save,
};
