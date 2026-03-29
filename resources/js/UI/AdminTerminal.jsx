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

const XfceIcon = ({ Icon, tone, className }) => {
    return (
        <span className={cx("relative flex items-center justify-center p-1", className)}>
            <Icon size={40} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-90" strokeWidth={1.5} />
        </span>
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
    { key: 'Dashboard', label: 'Home', href: '/dashboard', icon: Home, tone: 'neutral' },
    { key: 'AdminProjects', label: 'File System', href: '/admin/projects', icon: FolderKanban, tone: 'neutral' },
    { key: 'AdminProjectCreate', label: 'New Project', href: '/admin/projects/create', icon: Plus, tone: 'green' },
    { key: 'AdminMessages', label: 'Mail', href: '/admin/messages', icon: Mail, tone: 'blue' },
    { key: 'Terminal', label: 'Terminal Emulator', href: '#terminal', icon: TerminalSquare, tone: 'neutral' },
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
            await fetch('/logout', { method: 'POST', headers: { 'X-CSRF-TOKEN': csrfToken, Accept: 'application/json' } });
            window.location.href = '/';
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
            { top: '32px', left: '16px' },
            { top: '112px', left: '16px' },
            { top: '192px', left: '16px' },
            { top: '272px', left: '16px' },
            { top: '352px', left: '16px' },
            { top: '432px', left: '16px' },
        ];

        return NAV_ITEMS.map((item, index) => ({
            ...item,
            isActive: activeWindow && (activeWindow.page === item.key || (activeWindow.page.includes('Project') && item.key === 'AdminProjects')),
            position: positions[index] || { top: `${32 + index * 80}px`, left: '16px' },
        }));
    }, [activeWindow]);

    return (
        <OSContext.Provider value={osContextValue}>
            <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#245D8B] font-sans selection:bg-sky-500/30 text-zinc-800">
                {/* Desktop Background */}
                <div
                    className={cx("absolute inset-0 transition-all duration-500", !wallpaper ? "bg-[radial-gradient(circle_at_center,_#347BB7_0%,_#174876_100%)]" : "bg-cover bg-center bg-no-repeat")}
                    style={wallpaper ? { backgroundImage: `url(${wallpaper})` } : {}}
                >
                    {/* Subtle Graphic */}
                    {!wallpaper && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                            <svg viewBox="0 0 100 100" className="w-[450px] h-[450px] fill-current text-white/10 blur-[2px]">
                                <polygon points="50,20 65,30 90,50 70,60 50,80 30,85 10,65 5,50 15,45 35,30" />
                            </svg>
                        </div>
                    )}

                    <div className="relative z-10 flex h-full flex-col">
                        <div className={cx(
                            "flex items-center justify-between bg-[#2D2D2D]/95 border-b border-black/40 px-2 text-[12px] text-[#E0E0E0] shadow-[0_1px_3px_rgba(0,0,0,0.5)] z-40 shrink-0",
                            isMobileLandscape ? "h-[24px]" : "h-[26px]"
                        )}>
                            <div className="flex items-center h-full min-w-0">
                                <div ref={applicationsMenuRef} className="relative h-full shrink-0">
                                    <button
                                        type="button"
                                        className={cx(
                                            "flex h-full items-center gap-1.5 hover:bg-white/10 transition-colors cursor-default select-none group focus:outline-none shrink-0",
                                            showApplicationsMenu ? "bg-white/10" : "",
                                            isMobileLandscape ? "px-2 text-[11px]" : "px-3"
                                        )}
                                        onClick={() => setShowApplicationsMenu((current) => !current)}
                                    >
                                        <div className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-sky-500 text-white font-bold text-[9px] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] group-active:bg-sky-600">
                                            X
                                        </div>
                                        <span className="font-medium tracking-wide text-white">Applications</span>
                                    </button>

                                    {showApplicationsMenu && (
                                        <div className="absolute left-0 top-full z-50 mt-[1px] min-w-[240px] overflow-hidden rounded-b-md border border-black/55 bg-[#efefef] shadow-[0_10px_24px_rgba(0,0,0,0.4)]">
                                            <div className="border-b border-black/10 bg-[linear-gradient(180deg,#fafafa_0%,#e6e6e6_100%)] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
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
                                                            className="flex w-full items-center gap-3 px-3 py-2 text-left text-[12px] text-zinc-800 transition hover:bg-[#316ac5] hover:text-white"
                                                        >
                                                            <Icon size={15} strokeWidth={2.1} />
                                                            <span className="flex-1">{item.label}</span>
                                                        </button>
                                                    );
                                                })}

                                                <div className="my-1 h-px bg-black/10" />

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowApplicationsMenu(false);
                                                        setShowLogoutConfirm(true);
                                                    }}
                                                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-[12px] text-zinc-800 transition hover:bg-[#316ac5] hover:text-white"
                                                >
                                                    <LogOut size={15} strokeWidth={2.1} />
                                                    <span className="flex-1">Log Out</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className={cx("h-[14px] w-px bg-white/20 shrink-0", isMobileLandscape ? "mx-0.5" : "mx-1")} />
                                <button className={cx(
                                    "flex h-full items-center hover:bg-white/10 transition-colors select-none cursor-default font-medium text-white focus:outline-none shrink-0",
                                    isMobileLandscape ? "px-2 text-[11px]" : "px-3"
                                )}>
                                    Places
                                </button>

                                <div className={cx(
                                    "flex h-full items-center border-l border-white/20 gap-1 overflow-hidden",
                                    isMobileLandscape ? "ml-1 pl-1 max-w-[40vw]" : "ml-2 pl-2 max-w-md"
                                )}>
                                    {windows.map((win) => {
                                        const isFocused = activeWindow && activeWindow.id === win.id;
                                        return (
                                            <button
                                                key={`task-${win.id}`}
                                                className={cx(
                                                    "flex h-[20px] items-center gap-1.5 border border-transparent rounded-[2px] transition-colors select-none focus:outline-none truncate",
                                                    isMobileLandscape ? "max-w-[110px] px-2 text-[10px]" : "max-w-[150px] px-3 text-[11px]",
                                                    isFocused
                                                        ? "bg-white/15 border-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-white"
                                                        : win.isMinimized
                                                            ? "bg-black/15 text-white/45 hover:bg-white/8"
                                                            : "hover:bg-white/10 text-white/70"
                                                )}
                                                onClick={() => focusWindow(win.id)}
                                            >
                                                <span className="truncate">{win.title || win.page}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center h-full shrink-0">
                                {!isMobileLandscape ? (
                                    <div className="flex h-full items-center px-3 hover:bg-white/10 cursor-default select-none text-[11px] text-white/80 border-l border-white/10">
                                        Workspace 1
                                    </div>
                                ) : null}
                                {isMobileLandscape ? (
                                    <button
                                        type="button"
                                        className="flex h-full items-center gap-1 border-l border-white/10 px-2 text-[11px] text-white/85 hover:bg-white/10"
                                        onClick={toggleBrowserFullscreen}
                                    >
                                        <Maximize2 size={11} strokeWidth={2.4} />
                                        <span>{isBrowserFullscreen ? 'Windowed' : 'Full'}</span>
                                    </button>
                                ) : null}
                                <div className={cx(
                                    "flex h-full items-center hover:bg-white/10 cursor-default font-medium text-white border-l border-white/10",
                                    isMobileLandscape ? "px-2 text-[11px]" : "px-3"
                                )}>
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <button
                                    className="flex h-full items-center px-2 hover:bg-rose-500 hover:text-white text-white cursor-default transition-colors border-l border-white/10 focus:outline-none"
                                    onClick={() => setShowLogoutConfirm(true)}
                                >
                                    <LogOut size={13} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>

                        <div className={cx("relative flex-1", isMobileLandscape ? "p-0 pb-[72px]" : "p-2")}>
                            {!isMobileLandscape ? desktopIcons.map(({ key, label, icon: Icon, tone, isActive, position, href }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onDoubleClick={() => navigateMenu(href)}
                                    onClick={() => navigateMenu(href)}
                                    className="group absolute flex w-[70px] flex-col items-center gap-1 rounded py-2 px-1 text-center border outline-none z-0"
                                    style={{
                                        ...position,
                                        borderColor: 'transparent',
                                        ...(isActive ? { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' } : {})
                                    }}
                                >
                                    <div className="group-active:opacity-80 transition-opacity">
                                        <XfceIcon Icon={Icon} tone={tone} className="group-hover:opacity-100" />
                                    </div>
                                    <span className="text-[11px] font-medium leading-tight text-[#f1f1f1] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] break-words w-full select-none" style={{ textShadow: "1px 1px 1px #000, 0px 1px 2px #000" }}>
                                        {label}
                                    </span>
                                </button>
                            )) : null}

                            {children}

                            {isMobileLandscape ? (
                                <div className="absolute inset-x-2 bottom-2 z-30">
                                    <div className="flex items-stretch gap-2 overflow-x-auto rounded-2xl border border-white/15 bg-[#1E1E1E]/88 px-2 py-2 shadow-[0_16px_35px_rgba(0,0,0,0.35)] backdrop-blur-md">
                                        {desktopIcons.map(({ key, label, icon: Icon, isActive, href }) => (
                                            <button
                                                key={`dock-${key}`}
                                                type="button"
                                                onClick={() => navigateMenu(href)}
                                                className={cx(
                                                    "flex min-w-[84px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-center transition",
                                                    isActive
                                                        ? "border-sky-300/60 bg-sky-400/20 text-white"
                                                        : "border-white/10 bg-white/5 text-white/85 hover:bg-white/10"
                                                )}
                                            >
                                                <XfceIcon Icon={Icon} className="p-0.5 [&_svg]:h-7 [&_svg]:w-7" />
                                                <span className="text-[10px] font-medium leading-tight">{label}</span>
                                            </button>
                                        ))}
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
                                            Admin desktop only runs in landscape on mobile so the XFCE window manager can use the full screen area.
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
                        message="Are you sure you want to close the session and log out of the XFCE environment?"
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

    const handleResizeDown = (e) => {
        if (useFullscreenLayout) return;
        focusObject();
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const startW = size.w;
        const startH = size.h;

        const onMouseMove = (moveEvent) => {
            setSize({
                w: Math.max(400, startW + (moveEvent.clientX - startX)),
                h: Math.max(300, startH + (moveEvent.clientY - startY))
            });
        };
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

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
                    isCompactTouchSession ? "h-[30px]" : "h-[26px]",
                    isFocused
                        ? "bg-[linear-gradient(180deg,#EBEBEB_0%,#C9C9C9_100%)] border-[#a9a9a9] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                        : "bg-[linear-gradient(180deg,#F5F5F5_0%,#E0E0E0_100%)] border-[#b5b5b5] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] opacity-80"
                )}
                onDoubleClick={() => setIsFullscreen(!useFullscreenLayout)}
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center gap-1.5 px-1.5 shrink-0 opacity-80 pointer-events-none">
                    <Terminal size={12} strokeWidth={2.5} className={isFocused ? "text-[#333]" : "text-[#666]"} />
                </div>
                <div className={cx(
                    "flex-1 text-center truncate text-[12px] font-bold tracking-wide pointer-events-none",
                    isFocused ? "text-[#333]" : "text-[#777]"
                )} style={{ textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}>
                    {title}
                </div>
                <div className="window-controls flex items-center gap-[2px] pr-0.5 shrink-0" onMouseDown={e => e.stopPropagation()}>
                    <button
                        type="button"
                        className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-[2px] border border-[#a0a0a0] bg-[linear-gradient(180deg,#F5F5F5_0%,#DCDCDC_100%)] text-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_1px_rgba(0,0,0,0.1)] hover:bg-[linear-gradient(180deg,#FFF_0%,#E4E4E4_100%)] active:bg-[linear-gradient(180deg,#CACACA_0%,#DCDCDC_100%)]"
                        onClick={() => os.minimizeWindow(windowId)}
                    >
                        <Minus size={10} strokeWidth={4} className={!isFocused ? 'opacity-50' : ''} />
                    </button>
                    <button
                        type="button"
                        className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-[2px] border border-[#a0a0a0] bg-[linear-gradient(180deg,#F5F5F5_0%,#DCDCDC_100%)] text-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_1px_rgba(0,0,0,0.1)] hover:bg-[linear-gradient(180deg,#FFF_0%,#E4E4E4_100%)] active:bg-[linear-gradient(180deg,#CACACA_0%,#DCDCDC_100%)]"
                        onClick={() => setIsFullscreen(!useFullscreenLayout)}
                    >
                        {useFullscreenLayout ? <Minimize2 size={10} strokeWidth={3} className={!isFocused ? 'opacity-50' : ''} /> : <Maximize2 size={10} strokeWidth={3} className={!isFocused ? 'opacity-50' : ''} />}
                    </button>
                    <button
                        type="button"
                        className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-[2px] border border-[#a0a0a0] bg-[linear-gradient(180deg,#F5F5F5_0%,#DCDCDC_100%)] text-zinc-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_1px_rgba(0,0,0,0.1)] hover:border-[#b34848] hover:bg-[linear-gradient(180deg,#E88686_0%,#C85050_100%)] hover:text-white active:bg-[linear-gradient(180deg,#B04444_0%,#C85050_100%)]"
                        onClick={() => os.closeWindow(windowId)}
                    >
                        <X size={10} strokeWidth={4} className={!isFocused ? 'opacity-50' : ''} />
                    </button>
                </div>
            </div>

            {/* Menu bar */}
            {showMenuBar && (
                <div className="flex h-6 items-center gap-4 bg-[#FAFAFA] border-b border-[#D4D4D4] px-2 text-[12px] text-zinc-700 select-none shrink-0">
                    <span className="hover:bg-zinc-200 px-1.5 py-0.5 rounded-sm cursor-default">File</span>
                    <span className="hover:bg-zinc-200 px-1.5 py-0.5 rounded-sm cursor-default">Edit</span>
                    <span className="hover:bg-zinc-200 px-1.5 py-0.5 rounded-sm cursor-default">View</span>
                    <span className="hover:bg-zinc-200 px-1.5 py-0.5 rounded-sm cursor-default">Help</span>
                </div>
            )}

            {/* Toolbar */}
            {showToolbar && (
                <div className={cx(
                    "flex items-center gap-1 bg-[#FAFAFA] border-b border-[#E0E0E0] px-2 shrink-0",
                    isCompactTouchSession ? "h-7" : "h-8"
                )}>
                    <div className="flex bg-[#EFEFEF] border border-[#D0D0D0] rounded-[2px] p-[1px]">
                        <div className="p-1 px-1.5 rounded-[2px] opacity-50"><ChevronDown size={14} className="rotate-90" /></div>
                        <div className="p-1 px-1.5 rounded-[2px] opacity-50"><ChevronDown size={14} className="-rotate-90" /></div>
                    </div>
                    <div className="w-px h-5 bg-[#D0D0D0] mx-1"></div>
                    <div className="p-1 px-1.5 hover:bg-zinc-200 rounded-[2px] cursor-default border border-transparent" onClick={() => os.navigateMenu('/dashboard')}><Home size={16} className="text-zinc-600" /></div>
                    <div className="w-px h-5 bg-[#D0D0D0] mx-1"></div>
                    <div className="flex-1 flex items-center bg-white border border-[#D0D0D0] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] rounded-[2px] h-[22px] px-2 text-[12px] text-zinc-600 truncate ml-1 select-none">
                        <Terminal size={12} className="mr-2 opacity-50" />
                        /admin/window/{windowId}
                    </div>
                </div>
            )}

            {/* Window Body */}
            <div className="flex-1 flex overflow-hidden text-zinc-800" style={showSidebar ? {} : { backgroundColor: 'transparent' }}>
                {/* Sidebar */}
                {showSidebar && (
                    <div className="w-40 border-r border-[#D4D4D4] bg-[#F2F4F7] overflow-y-auto hidden md:block select-none shrink-0">
                        <div className="text-[11px] font-bold text-zinc-500 uppercase px-3 py-2 pt-3">Places</div>
                        {NAV_ITEMS.filter(item => item.href.startsWith('/')).map(nav => (
                            <div
                                key={nav.key}
                                className={cx(
                                    "flex items-center gap-2 px-3 py-1.5 text-[12px] cursor-default",
                                    "text-zinc-700 hover:bg-[#e0e4eb]"
                                )}
                                onClick={() => os.navigateMenu(nav.href)}
                            >
                                <nav.icon size={14} className="text-[#7a92b3]" />
                                <span className="truncate">{nav.label}</span>
                            </div>
                        ))}
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

            {/* Resize Handle */}
            {!useFullscreenLayout && (
                <div
                    className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize bg-transparent z-50 flex items-end justify-end p-[2px]"
                    onMouseDown={handleResizeDown}
                >
                    <div className="w-1.5 h-1.5 border-r border-b border-zinc-400"></div>
                </div>
            )}
        </div>
    );
};

// Expose the other components cleanly
export const AdminTerminalPanel = ({ title, command, children, className = '', headerAction = null }) => {
    return (
        <section className={cx('rounded border border-[#c4c4c4] bg-[#f9f9f9] p-4 shadow-sm mb-4', className)}>
            {(title || command || headerAction) ? (
                <div className="mb-3 flex flex-col gap-2 border-b border-[#e0e0e0] pb-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        {command && <div className="text-[10px] uppercase font-mono tracking-wide text-zinc-500">{command}</div>}
                        {title && <h2 className="text-[14px] font-semibold text-zinc-800 mb-0.5">{title}</h2>}
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
        neutral: 'border-[#c4c4c4] bg-white text-zinc-800',
        blue: 'border-sky-200 bg-sky-50 text-sky-900',
        green: 'border-emerald-200 bg-emerald-50 text-emerald-900',
        amber: 'border-amber-200 bg-amber-50 text-amber-900',
        red: 'border-rose-200 bg-rose-50 text-rose-900',
    };

    return (
        <div className={cx('rounded border p-3 shadow-sm', accents[tone] || accents.neutral)}>
            <div className="text-[11px] font-medium uppercase text-zinc-500">{label}</div>
            <div className="mt-1 text-2xl font-bold">{value}</div>
            {hint && <div className="mt-1 text-[12px] opacity-75">{hint}</div>}
        </div>
    );
};

export const AdminTerminalAction = ({ icon: Icon, label, description, tone = 'neutral', onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cx(
                'rounded border p-3 text-left transition shadow-sm bg-white',
                toneClassNames[tone] || toneClassNames.neutral
            )}
        >
            <div className="flex items-start gap-3">
                {Icon && <div className="p-1 rounded bg-black/5"><Icon size={16} strokeWidth={2} className="opacity-80" /></div>}
                <div>
                    <div className="text-[13px] font-semibold">{label}</div>
                    <div className="mt-0.5 text-[12px] opacity-80">{description}</div>
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
        <div className="overflow-hidden rounded border border-[#c4c4c4] bg-white shadow-sm">
            <div className="hidden grid-cols-[repeat(var(--col-count),minmax(0,1fr))] bg-[#F0F0F0] border-b border-[#c4c4c4] md:grid" style={{ '--col-count': columns.length }}>
                {columns.map((column, i) => (
                    <div key={column} className={cx("px-3 py-1.5 text-[11px] font-bold text-zinc-600 border-r border-[#d4d4d4] last:border-0", i === 0 ? "border-l-0" : "")}>{column}</div>
                ))}
            </div>

            <div className="divide-y divide-[#E0E0E0]">
                {rows.map((row, rowIndex) => (
                    <div key={row.key || rowIndex} className="grid md:grid-cols-[repeat(var(--col-count),minmax(0,1fr))] hover:bg-sky-50 transition-colors" style={{ '--col-count': columns.length }}>
                        {row.cells.map((cell, cellIndex) => (
                            <div key={`${row.key || rowIndex}-${cellIndex}`} className={cx("min-w-0 px-3 py-2 border-r border-[#E0E0E0] md:last:border-0 flex items-center")}>
                                <div className="mb-1 text-[11px] font-bold text-zinc-500 md:hidden">{columns[cellIndex]}</div>
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
        'w-full rounded-[3px] border border-[#a0a0a0] bg-white px-2.5 py-1.5 text-[13px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] mt-1',
        as === 'textarea' ? 'min-h-[100px] resize-y' : '',
        className
    );

    return (
        <label className="block mb-3">
            <div className="text-[12px] font-medium text-zinc-700">{label}</div>
            {as === 'textarea' ? (
                <textarea name={name} value={value} onChange={onChange} rows={rows} className={fieldClassName} {...props} />
            ) : (
                <input name={name} value={value} onChange={onChange} className={fieldClassName} {...props} />
            )}
            {error ? <div className="mt-1 text-[12px] text-rose-600">{error}</div> : null}
        </label>
    );
};

export const AdminTerminalStatusPicker = ({ value, onChange }) => {
    const items = [
        { value: 'draft', label: 'Draft', description: 'hidden from public list', icon: SquarePen },
        { value: 'published', label: 'Published', description: 'visible on public list', icon: Save },
    ];

    return (
        <div className="grid gap-2 sm:grid-cols-2 mb-3">
            {items.map((item) => {
                const isActive = value === item.value;
                const Icon = item.icon;

                return (
                    <label
                        key={item.value}
                        className={cx(
                            'cursor-pointer rounded-[3px] border p-2 transition shadow-sm',
                            isActive
                                ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500'
                                : 'border-[#a0a0a0] bg-[#FAFAFA] hover:bg-white hover:border-[#808080]'
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
                        <div className="flex items-center gap-2">
                            <Icon size={16} className={isActive ? "text-sky-600" : "text-zinc-500"} />
                            <div>
                                <div className="text-[13px] font-medium text-zinc-800">{item.label}</div>
                            </div>
                        </div>
                    </label>
                );
            })}
        </div>
    );
};

export const AdminTerminalUpload = ({ imagePreview, onChange, error }) => {
    return (
        <label className="block mb-3">
            <div className="mb-1 text-[12px] font-medium text-zinc-700">Project cover image</div>
            <div className="rounded-[3px] border border-dashed border-[#a0a0a0] bg-[#FAFAFA] p-3 transition hover:border-[#808080]">
                <input type="file" accept="image/*" onChange={onChange} className="mb-2 block w-full text-[12px] text-zinc-600 file:mr-3 file:rounded-sm file:border file:border-[#b0b0b0] file:bg-[#e0e0e0] file:px-2 file:py-1 file:font-medium file:text-zinc-800 hover:file:bg-[#d0d0d0] cursor-pointer" />
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-56 mt-2 rounded border border-[#d0d0d0] bg-white p-1 shadow-sm object-contain" />
                ) : (
                    <div className="rounded border border-[#e0e0e0] bg-white px-3 py-6 text-center text-[12px] text-zinc-500 shadow-sm mt-2">
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
        info: 'border-sky-200 bg-sky-50 text-sky-800',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        error: 'border-rose-200 bg-rose-50 text-rose-800',
    };

    return (
        <div className={cx('rounded-[3px] border px-3 py-2 text-[12px] shadow-sm mb-3', classNames[type] || classNames.info)}>
            {message}
        </div>
    );
};

export const AdminTerminalEmpty = ({ title, description, action = null }) => {
    return (
        <div className="rounded-[3px] border border-[#d0d0d0] bg-[#fdfdfd] px-4 py-8 text-center shadow-inner">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
                <Inbox size={20} />
            </div>
            <div className="mt-3 text-[14px] font-semibold text-zinc-800">{title}</div>
            <div className="mx-auto mt-1 max-w-sm text-[12px] text-zinc-500">{description}</div>
            {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
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
