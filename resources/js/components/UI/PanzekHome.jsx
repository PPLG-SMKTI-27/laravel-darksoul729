import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wifi,
    BatteryFull,
    Signal,
    Settings,
    Terminal as TerminalIcon,
    Camera as CameraIcon,
    MessageCircle,
    Music as MusicIcon,
    Circle,
    Square,
    ChevronLeft,
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Send,
    Volume2,
    Zap,
    Image as ImageIcon,
    LockKeyhole,
    Flashlight,
    AppWindow,
    Search,
    UserRoundPlus
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

const CameraApp = ({ onCapture }) => {
    const [shutter, setShutter] = useState(false);
    const [streamState, setStreamState] = useState('requesting');
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                if (!navigator.mediaDevices?.getUserMedia) {
                    throw new Error('MediaDevices unavailable');
                }

                const preferredConstraints = [
                    { video: { facingMode: { ideal: 'environment' } }, audio: false },
                    { video: { facingMode: { ideal: 'user' } }, audio: false },
                    { video: true, audio: false }
                ];

                let mediaStream = null;

                for (const constraints of preferredConstraints) {
                    try {
                        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                        break;
                    } catch (constraintError) {
                        mediaStream = null;
                        if (constraints === preferredConstraints[preferredConstraints.length - 1]) {
                            throw constraintError;
                        }
                    }
                }

                if (!mediaStream) {
                    throw new Error('Unable to open camera');
                }

                streamRef.current = mediaStream;
                setStreamState('live');
            } catch (err) {
                console.error("Camera error:", err);
                setError(err.name === 'NotAllowedError' ? 'Permission Denied' : 'Camera Unavailable');
                setStreamState('error');
            }
        };

        startCamera();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        const mediaStream = streamRef.current;

        if (!video || !mediaStream) {
            return;
        }

        video.srcObject = mediaStream;

        const handleLoadedMetadata = async () => {
            try {
                await video.play();
                setStreamState('ready');
            } catch (playError) {
                console.error('Video play error:', playError);
                setError('Preview blocked');
                setStreamState('error');
            }
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);

        if (video.readyState >= 1) {
            handleLoadedMetadata();
        }

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            if (video.srcObject) {
                video.srcObject = null;
            }
        };
    }, [streamState]);

    const triggerShutter = () => {
        if (!videoRef.current || !canvasRef.current) return;

        setShutter(true);
        setTimeout(() => setShutter(false), 150);

        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onCapture?.(dataUrl);

        // Success Haptic/Sound feel
        if (window.navigator?.vibrate) {
            window.navigator.vibrate(20);
        }
    };

    const showVideo = streamState === 'live' || streamState === 'ready';

    return (
        <div className="relative h-full bg-black flex items-center justify-center overflow-hidden">
            {showVideo ? (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : null}

            {streamState !== 'ready' ? (
                <div className="flex flex-col items-center gap-3 text-white/50 px-6 text-center">
                    <CameraIcon size={40} className="opacity-20 mb-2" />
                    <p className="text-[10px] bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                        {error || (streamState === 'requesting' ? 'Requesting Camera Access...' : 'Preparing Camera Preview...')}
                    </p>
                </div>
            ) : null}

            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Viewfinder UI */}
            <div className="absolute inset-4 border border-white/20 flex flex-col justify-between p-2 pointer-events-none z-10">
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
            {streamState === 'ready' && (
                <button
                    onClick={triggerShutter}
                    className="absolute bottom-20 w-14 h-14 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-transform z-20 shadow-xl"
                >
                    <div className="w-11 h-11 rounded-full bg-white/30 backdrop-blur-md border border-white/20" />
                </button>
            )}
        </div>
    );
};

const GalleryApp = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('panzek_captured_photos');
        if (stored) {
            try {
                setImages(JSON.parse(stored).reverse());
            } catch (e) {
                console.error("Gallery parse error", e);
            }
        }
    }, []);

    return (
        <div className="flex flex-col h-full bg-zinc-950 text-white p-2">
            <div className="flex items-center justify-between px-2 py-3 border-b border-white/5 mb-2">
                <h4 className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Captured</h4>
                <ImageIcon size={14} className="text-zinc-500" />
            </div>

            {images.length > 0 ? (
                <div className="grid grid-cols-3 gap-1 overflow-y-auto pr-1 flex-1 content-start pb-4">
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="aspect-square bg-zinc-900 rounded-sm overflow-hidden cursor-pointer active:opacity-70 transition-opacity"
                            onClick={() => setSelectedImage(img)}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-20 gap-2">
                    <ImageIcon size={32} />
                    <p className="text-[9px] font-bold">LENS EMPTY</p>
                </div>
            )}

            {/* Fullscreen Viewer */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-[100] bg-black flex flex-col"
                    >
                        <div className="flex items-center p-4">
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
                            >
                                <ChevronLeft size={20} strokeWidth={3} />
                            </button>
                        </div>
                        <div className="flex-1 flex items-center justify-center p-4">
                            <img src={selectedImage} alt="Full view" className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const MESSAGES_DEVICE_STORAGE_KEY = 'panzek_messages_device_id_v1';
const CHAT_ACCENTS = [
    'from-emerald-400 to-emerald-600',
    'from-sky-400 to-blue-600',
    'from-rose-400 to-pink-600',
    'from-violet-400 to-purple-600',
    'from-amber-400 to-orange-500',
];

const getChatDeviceId = () => {
    if (typeof window === 'undefined') {
        return '';
    }

    const existingDeviceId = localStorage.getItem(MESSAGES_DEVICE_STORAGE_KEY);

    if (existingDeviceId) {
        return existingDeviceId;
    }

    const nextDeviceId = window.crypto?.randomUUID?.() ?? `panzek-device-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(MESSAGES_DEVICE_STORAGE_KEY, nextDeviceId);

    return nextDeviceId;
};

const getChatAccent = (code) => {
    const digits = code.replace(/\D/g, '');
    const sum = digits.split('').reduce((carry, value) => carry + Number(value), 0);
    return CHAT_ACCENTS[sum % CHAT_ACCENTS.length];
};

const getCsrfToken = () => {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
};

const chatRequest = async (url, options = {}) => {
    const config = {
        method: options.method ?? 'GET',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...(options.method && options.method !== 'GET'
                ? {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                }
                : {}),
        },
        ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    };

    const response = await fetch(url, config);
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.message ?? 'Chat request failed.');
    }

    return payload;
};

const MessagesApp = ({ onHome }) => {
    const [deviceId, setDeviceId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [profileNameInput, setProfileNameInput] = useState('');
    const [profile, setProfile] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [threads, setThreads] = useState({});
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [friendCodeInput, setFriendCodeInput] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [searchFeedback, setSearchFeedback] = useState('');
    const [syncError, setSyncError] = useState('');

    const applyServerState = (payload) => {
        setProfile(payload.profile ?? null);
        setContacts((payload.contacts ?? []).map((contact) => ({
            ...contact,
            accent: getChatAccent(contact.code),
        })));
        setThreads(payload.threads ?? {});
    };

    const fetchState = async (nextDeviceId, options = {}) => {
        const silent = options.silent ?? false;

        try {
            const payload = await chatRequest(`/chat/state/${encodeURIComponent(nextDeviceId)}`);
            applyServerState(payload);
            setSyncError('');
        } catch (error) {
            if (error.message !== 'Chat user not found.') {
                setSyncError('Gagal sinkron ke server chat.');
            }
        } finally {
            if (!silent) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        const nextDeviceId = getChatDeviceId();
        setDeviceId(nextDeviceId);
        fetchState(nextDeviceId);
    }, []);

    useEffect(() => {
        if (!deviceId || !profile) {
            return;
        }

        const interval = window.setInterval(() => {
            if (document.hidden) {
                return;
            }

            fetchState(deviceId, { silent: true });
        }, 3000);

        return () => window.clearInterval(interval);
    }, [deviceId, profile]);

    useEffect(() => {
        if (!selectedContactId) {
            return;
        }

        if (!contacts.some((contact) => String(contact.id) === String(selectedContactId))) {
            setSelectedContactId(null);
        }
    }, [contacts, selectedContactId]);

    const selectedContact = contacts.find((contact) => contact.id === selectedContactId) ?? null;
    const selectedMessages = selectedContact ? (threads[selectedContact.id] ?? []) : [];

    const createProfile = async () => {
        const trimmedName = profileNameInput.trim();

        if (!trimmedName) {
            return;
        }

        try {
            setIsLoading(true);
            const payload = await chatRequest('/chat/register', {
                method: 'POST',
                body: {
                    device_id: deviceId,
                    name: trimmedName,
                },
            });

            applyServerState(payload);
            setProfileNameInput('');
            setSyncError('');
            setSearchFeedback('');
        } catch (error) {
            setSyncError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const addFriendByCode = async () => {
        const normalizedCode = friendCodeInput.trim().toUpperCase();

        if (!normalizedCode) {
            setSearchFeedback('Masukkan code dulu.');
            return;
        }

        if (normalizedCode === profile?.code) {
            setSearchFeedback('Itu code milikmu sendiri.');
            return;
        }

        try {
            const foundPayload = await chatRequest(`/chat/users/search?${new URLSearchParams({
                device_id: deviceId,
                code: normalizedCode,
            }).toString()}`);

            if (foundPayload.contact?.already_added) {
                setSearchFeedback(`${foundPayload.contact.name} sudah ada di daftar.`);
                const existingContact = contacts.find((contact) => contact.code === normalizedCode);
                if (existingContact) {
                    setSelectedContactId(existingContact.id);
                }
                return;
            }

            const payload = await chatRequest('/chat/contacts', {
                method: 'POST',
                body: {
                    device_id: deviceId,
                    contact_code: normalizedCode,
                },
            });

            applyServerState(payload);
            setFriendCodeInput('');
            setSearchFeedback(`Tersambung dengan ${foundPayload.contact.name}.`);

            const nextContact = (payload.contacts ?? []).find((contact) => contact.code === normalizedCode);
            if (nextContact) {
                setSelectedContactId(nextContact.id);
            }
        } catch (error) {
            setSearchFeedback(error.message);
        }
    };

    const sendMessage = async () => {
        if (!selectedContact || !messageInput.trim()) {
            return;
        }

        try {
            const payload = await chatRequest('/chat/messages', {
                method: 'POST',
                body: {
                    device_id: deviceId,
                    recipient_code: selectedContact.code,
                    body: messageInput.trim(),
                },
            });

            applyServerState(payload);
            setMessageInput('');
            setSearchFeedback('');
        } catch (error) {
            setSearchFeedback(error.message);
        }
    };

    if (isLoading && !profile) {
        return (
            <div className="flex h-full items-center justify-center bg-[linear-gradient(180deg,#f8fbff_0%,#edf4ff_100%)] px-6 text-center">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-400">Syncing</p>
                    <p className="mt-2 text-[11px] font-semibold text-slate-600">Menyiapkan messaging deck...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex h-full flex-col justify-between bg-[linear-gradient(180deg,#f8fbff_0%,#edf4ff_100%)] p-4 text-slate-900">
                <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.28em] text-sky-500">Messaging Setup</p>
                    <h4 className="mt-2 text-[19px] font-black leading-tight">Masukkan nama dulu</h4>
                    <p className="mt-2 text-[9px] leading-relaxed text-slate-500">
                        Pertama kali buka, kamu perlu bikin identitas chat. Setelah itu sistem akan generate code seperti nomor pribadi.
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="rounded-[1.35rem] border border-slate-200 bg-white/90 p-3 shadow-[0_14px_35px_rgba(148,163,184,0.14)]">
                        <label className="text-[7px] font-black uppercase tracking-[0.26em] text-slate-400">Display Name</label>
                        <input
                            value={profileNameInput}
                            onChange={(event) => setProfileNameInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    createProfile();
                                }
                            }}
                            placeholder="Ketik nama kamu"
                        className="mt-2 w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-3 py-3 text-[11px] font-semibold text-slate-800 outline-none transition focus:border-sky-300"
                        />
                    </div>

                    {syncError ? (
                        <p className="text-[8px] font-semibold text-rose-500">{syncError}</p>
                    ) : null}

                    <button
                        type="button"
                        onClick={createProfile}
                        className="flex w-full items-center justify-center rounded-[1.1rem] bg-[linear-gradient(180deg,#38bdf8_0%,#2563eb_100%)] px-4 py-3 text-[9px] font-black uppercase tracking-[0.3em] text-white shadow-[0_10px_24px_rgba(37,99,235,0.3)] transition active:scale-[0.98]"
                    >
                        Continue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-[linear-gradient(180deg,#f8fbff_0%,#edf4ff_100%)] text-slate-900">
            <div className="border-b border-slate-200/80 px-3 py-3">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={selectedContact ? () => setSelectedContactId(null) : onHome}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 shadow-[0_6px_14px_rgba(148,163,184,0.12)]"
                        >
                            <ChevronLeft size={12} strokeWidth={3} />
                        </button>
                        <div>
                            <p className="text-[12px] font-black text-slate-800">{selectedContact ? selectedContact.name : 'Messages'}</p>
                            <p className="mt-0.5 text-[7px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                                {selectedContact ? selectedContact.code : profile.name}
                            </p>
                        </div>
                    </div>
                    {!selectedContact && <Send size={13} className="mt-0.5 text-sky-500" />}
                </div>

                {!selectedContact && (
                    <>
                        <div className="mt-3 rounded-[1.2rem] border border-slate-200 bg-white/90 px-3 py-2 shadow-[0_10px_24px_rgba(148,163,184,0.1)]">
                            <p className="text-[7px] font-black uppercase tracking-[0.26em] text-slate-400">Your Code</p>
                            <div className="mt-1 flex items-center justify-between gap-2">
                                <p className="text-[11px] font-black tracking-[0.14em] text-slate-800">{profile.code}</p>
                                <button
                                    type="button"
                                    onClick={() => navigator.clipboard?.writeText(profile.code)}
                                    className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[7px] font-black uppercase tracking-[0.2em] text-slate-500"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div className="mt-3 flex gap-2">
                            <div className="flex flex-1 items-center gap-2 rounded-[1.1rem] border border-slate-200 bg-white px-3 py-2 shadow-[0_8px_18px_rgba(148,163,184,0.1)]">
                                <Search size={12} className="text-slate-400" />
                                <input
                                    value={friendCodeInput}
                                    onChange={(event) => setFriendCodeInput(event.target.value.toUpperCase())}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            addFriendByCode();
                                        }
                                    }}
                                    placeholder="Cari teman pakai code"
                                    className="w-full bg-transparent text-[10px] font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={addFriendByCode}
                                className="flex items-center justify-center rounded-[1.1rem] bg-[linear-gradient(180deg,#22c55e_0%,#16a34a_100%)] px-3 text-white shadow-[0_10px_18px_rgba(34,197,94,0.25)] transition active:scale-[0.98]"
                            >
                                <UserRoundPlus size={14} />
                            </button>
                        </div>

                        {searchFeedback ? (
                            <p className="mt-2 text-[8px] font-semibold text-slate-500">{searchFeedback}</p>
                        ) : null}
                        {syncError ? (
                            <p className="mt-1 text-[8px] font-semibold text-rose-500">{syncError}</p>
                        ) : null}
                    </>
                )}
            </div>

            {selectedContact ? (
                <>
                    <div className="flex-1 overflow-y-auto px-2 pb-2 pt-2">
                        <div className="flex min-h-full flex-col rounded-[1.15rem] border border-slate-200 bg-white/92 p-2 shadow-[0_14px_30px_rgba(148,163,184,0.1)]">
                            <div className="flex-1 space-y-2 overflow-y-auto px-1 pb-2">
                                {selectedMessages.map((message) => (
                                    <div key={message.id} className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[78%] rounded-[1rem] px-3 py-2 ${message.from === 'me' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-700'}`}>
                                            <p className="text-[9px] font-semibold leading-relaxed">{message.text}</p>
                                            <p className={`mt-1 text-[6px] font-bold uppercase tracking-[0.16em] ${message.from === 'me' ? 'text-white/70' : 'text-slate-400'}`}>{message.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-200/70 bg-white/80 px-2 py-2 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <input
                                value={messageInput}
                                onChange={(event) => setMessageInput(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        sendMessage();
                                    }
                                }}
                                placeholder={`Chat ${selectedContact.name}`}
                                className="flex-1 rounded-[1rem] border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                            />
                            <button
                                type="button"
                                onClick={sendMessage}
                                className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-[linear-gradient(180deg,#38bdf8_0%,#2563eb_100%)] text-white shadow-[0_10px_18px_rgba(37,99,235,0.24)] transition active:scale-[0.98]"
                            >
                                <Send size={13} />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 overflow-y-auto px-2 py-2">
                    {contacts.length > 0 ? (
                        <div className="space-y-2">
                            {contacts.map((contact) => {
                                const contactMessages = threads[contact.id] ?? [];
                                const lastMessage = contactMessages[contactMessages.length - 1];

                                return (
                                    <button
                                        key={contact.id}
                                        type="button"
                                        onClick={() => setSelectedContactId(contact.id)}
                                        className="flex w-full items-center gap-2 rounded-[1.1rem] border border-slate-200 bg-white p-2 text-left shadow-[0_12px_24px_rgba(148,163,184,0.1)] transition active:scale-[0.99]"
                                    >
                                        <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${contact.accent} text-[10px] font-black text-white`}>
                                            {contact.name[0]}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="truncate text-[9px] font-black text-slate-800">{contact.name}</p>
                                                <p className="text-[6px] font-semibold text-slate-400">{lastMessage?.time ?? '--:--'}</p>
                                            </div>
                                            <p className="mt-0.5 truncate text-[8px] font-medium text-slate-500">{lastMessage?.text ?? 'Belum ada pesan'}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <MessageCircle size={22} />
                            </div>
                            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">No Friends Yet</p>
                            <p className="mt-2 text-[9px] leading-relaxed text-slate-500">Masukkan code teman di atas untuk mulai bikin daftar chat seperti WhatsApp mini.</p>
                        </div>
                    )}
                </div>
            )}
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
    const [lockTime, setLockTime] = useState('');
    const [activeApp, setActiveApp] = useState(null);
    const [performanceMode, setPerformanceMode] = useState(120);
    const [isLocked, setIsLocked] = useState(true);
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
            setLockTime(now.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            }));
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

    const transitionProps = {
        type: 'spring',
        stiffness: performanceMode === 120 ? 400 : 260,
        damping: performanceMode === 120 ? 30 : 20
    };
    const closeActiveApp = () => setActiveApp(null);
    const unlockScreen = () => setIsLocked(false);
    const goHome = () => {
        setActiveApp(null);
        setIsLocked(false);
    };
    const openApp = (appName) => {
        setIsLocked(false);
        setActiveApp(appName);
    };
    const formattedShortDate = useMemo(() => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }, []);

    const apps = useMemo(() => ([
        { id: 4, name: 'Settings', icon: <Settings size={isCompactScreen ? 16 : 18} strokeWidth={2.5} />, color: 'from-gray-500 to-gray-700', action: () => openApp('Settings') },
        { id: 5, name: 'Terminal', icon: <TerminalIcon size={isCompactScreen ? 16 : 18} strokeWidth={2.5} />, color: 'from-slate-700 to-slate-900', action: () => openApp('Terminal') },
        { id: 6, name: 'Camera', icon: <CameraIcon size={isCompactScreen ? 16 : 18} strokeWidth={2.5} />, color: 'from-yellow-400 to-yellow-600', action: () => openApp('Camera') },
        { id: 9, name: 'Gallery', icon: <ImageIcon size={isCompactScreen ? 16 : 18} strokeWidth={2.5} />, color: 'from-orange-400 to-orange-600', action: () => openApp('Gallery') },
        { id: 7, name: 'Messages', icon: <MessageCircle size={isCompactScreen ? 16 : 18} strokeWidth={2.5} />, color: 'from-emerald-400 to-emerald-600', action: () => openApp('Messages') },
        { id: 8, name: 'Music', icon: <MusicIcon size={isCompactScreen ? 16 : 18} strokeWidth={2.5} />, color: 'from-rose-400 to-rose-600', action: () => openApp('Music') }
    ]), [isCompactScreen]);

    return (
        <motion.div
            ref={screenRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: performanceMode === 120 ? 0.3 : 0.5, ease: 'easeOut' }}
            className="absolute inset-0 z-10 overflow-hidden flex flex-col font-sans"
            style={{
                background:
                    'radial-gradient(circle at 18% 16%, rgba(255,255,255,0.2), transparent 26%), radial-gradient(circle at 72% 22%, rgba(244,114,182,0.2), transparent 24%), radial-gradient(circle at 62% 70%, rgba(96,165,250,0.18), transparent 28%), linear-gradient(165deg, #0f172a 0%, #1e1b4b 42%, #2d1b69 68%, #4c1d95 100%)',
            }}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.16))] pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '100% 28px', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent 90%)' }} />

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
                    {isLocked ? (
                        <motion.div
                            key="lockscreen"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.26 }}
                            className="relative flex flex-1 flex-col justify-between px-4 pb-3 pt-5"
                        >
                            <div className="flex items-start justify-between">
                                <p className="text-[8px] font-semibold tracking-[0.32em] text-white/55 uppercase">Locked</p>
                                <button
                                    type="button"
                                    onClick={() => onNavigate?.('/')}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/14 bg-black/15 text-white/80 backdrop-blur-xl transition active:scale-95"
                                >
                                    <AppWindow size={14} />
                                </button>
                            </div>

                            <div className="flex flex-col items-center justify-center text-center text-white">
                                <p className="text-[8px] font-semibold uppercase tracking-[0.36em] text-white/55">Lock Screen</p>
                                <div className={isCompactScreen ? 'mt-3 text-[42px] font-extralight leading-none tracking-[-0.04em]' : 'mt-4 text-[56px] font-extralight leading-none tracking-[-0.05em]'}>
                                    {time}
                                </div>
                                <p className="mt-2 text-[10px] font-medium text-white/78">{lockTime}</p>
                                <p className="mt-4 text-[8px] font-medium text-white/60">Tap unlock to enter</p>
                            </div>

                            <div className="flex items-end justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={() => openApp('Camera')}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-black/15 text-white backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_28px_rgba(15,23,42,0.28)] transition active:scale-95"
                                >
                                    <CameraIcon size={16} />
                                </button>

                                <button
                                    type="button"
                                    onClick={unlockScreen}
                                    className="flex-1 rounded-full border border-white/18 bg-white/12 px-4 py-3 text-center text-[8px] font-black uppercase tracking-[0.32em] text-white backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_16px_36px_rgba(15,23,42,0.3)] transition active:scale-[0.98]"
                                >
                                    Unlock
                                </button>

                                <button
                                    type="button"
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-black/15 text-white backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_28px_rgba(15,23,42,0.28)] transition active:scale-95"
                                >
                                    <Flashlight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ) : !activeApp ? (
                        <motion.div
                            key="homescreen"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={transitionProps}
                            className="flex flex-col flex-1 px-3 pb-3 pt-2"
                        >
                            <div className="flex items-center justify-between px-1 text-white">
                                <div>
                                    <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-white/55">Home</p>
                                    <p className="mt-1 text-[9px] font-medium text-white/75">{formattedShortDate}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsLocked(true)}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/14 bg-black/15 text-white/88 backdrop-blur-xl transition active:scale-95"
                                >
                                    <LockKeyhole size={15} />
                                </button>
                            </div>

                            <div className={`mt-4 grid grid-cols-3 flex-1 content-start ${isCompactScreen ? 'gap-x-3 gap-y-4 px-2' : 'gap-x-4 gap-y-4 px-3'}`}>
                                {apps.map((app, index) => (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05, ...transitionProps }}
                                        className="flex flex-col items-center gap-1 cursor-pointer group"
                                        onClick={app.action}
                                    >
                                        <div className={`flex items-center justify-center rounded-[20px] border border-white/20 text-white bg-gradient-to-br ${app.color} shadow-lg shadow-black/30 transition-transform group-hover:scale-105 active:scale-95 ${isCompactScreen ? 'h-[44px] w-[44px]' : 'h-[50px] w-[50px]'}`}
                                            style={{
                                                boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.28), inset 0 -8px 14px rgba(0,0,0,0.16), 0 14px 24px rgba(0,0,0,0.18)'
                                            }}>
                                            {app.icon}
                                        </div>
                                        <span className={`text-white/90 font-semibold tracking-wide drop-shadow-md ${isCompactScreen ? 'text-[6px]' : 'text-[7px]'}`}>
                                            {app.name}
                                        </span>
                                    </motion.div>
                                ))}
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
                            {activeApp !== 'Messages' && (
                                <div className={`absolute left-0 right-0 top-0 z-30 flex items-center pointer-events-none ${isCompactScreen ? 'h-5 px-2' : 'h-6 px-3'}`}>
                                    <span className="text-[8px] font-black text-white/50 uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm mt-1">{activeApp}</span>
                                </div>
                            )}

                            {/* App Content Area - Full Height */}
                            <div className="flex-1 overflow-hidden">
                                {activeApp === 'Settings' && <SettingsApp performanceMode={performanceMode} setPerformanceMode={setPerformanceMode} />}
                                {activeApp === 'Terminal' && <TerminalApp />}
                                {activeApp === 'Camera' && (
                                    <CameraApp onCapture={(img) => {
                                        const stored = localStorage.getItem('panzek_captured_photos');
                                        let photos = [];
                                        if (stored) {
                                            try {
                                                photos = JSON.parse(stored);
                                            } catch (e) {
                                            }
                                        }
                                        photos.push(img);
                                        if (photos.length > 30) {
                                            photos.shift();
                                        }
                                        localStorage.setItem('panzek_captured_photos', JSON.stringify(photos));
                                    }} />
                                )}
                                {activeApp === 'Gallery' && <GalleryApp />}
                                {activeApp === 'Messages' && <MessagesApp onHome={goHome} />}
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
                    {activeApp && activeApp !== 'Messages' && (
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
                                onClick={goHome}
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
