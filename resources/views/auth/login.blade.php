<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>PanzekOS Terminal Login</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        :root {
            color-scheme: dark;
        }

        html,
        body {
            margin: 0;
            min-height: 100%;
            background: #050505;
        }

        body {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            color: #d4d4d4;
        }

        .terminal-screen {
            min-height: 100vh;
            background: #050505;
        }

        .boot-overlay,
        .sddm-overlay {
            position: fixed;
            inset: 0;
            z-index: 80;
            display: none;
        }

        .boot-overlay.is-visible,
        .sddm-overlay.is-visible {
            display: block;
        }

        .boot-overlay {
            overflow: hidden;
            background: #0a0a0a;
            color: #d4d4d8;
            opacity: 1;
            transition: opacity 220ms ease;
        }

        .boot-overlay.is-fading {
            opacity: 0;
        }

        .boot-overlay::before {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at top, rgba(255, 255, 255, 0.03), transparent 32%);
        }

        .boot-overlay::after {
            content: "";
            position: absolute;
            inset: 0;
            opacity: 0.06;
            background-image: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12) 1px, transparent 1px, transparent 3px);
        }

        .boot-overlay-inner {
            position: relative;
            height: 100%;
            padding: 1.2rem 1rem;
            overflow: hidden;
        }

        .boot-overlay-console {
            font-size: 13px;
            line-height: 1.9;
            color: #d4d4d8;
            white-space: pre-wrap;
            word-break: break-word;
        }

        .boot-line {
            min-height: 1.4em;
            animation: boot-line-in 180ms ease-out;
        }

        .boot-prompt {
            padding-top: 0.7rem;
            color: #71717a;
        }

        .sddm-overlay {
            overflow: hidden;
            background:
                radial-gradient(circle at top left, rgba(242, 243, 221, 0.35), transparent 25%),
                linear-gradient(135deg, #6f888f 0%, #839ca0 24%, #9bb2b4 52%, #7e9598 100%);
        }

        .sddm-overlay::after {
            content: "";
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(2px);
        }

        .sddm-shell {
            position: relative;
            z-index: 1;
            min-height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            text-align: center;
            font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
        }

        .sddm-card {
            width: min(100%, 360px);
        }

        .sddm-avatar {
            width: 96px;
            height: 96px;
            margin: 0 auto 1.4rem;
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.7);
            background: linear-gradient(135deg, #f5f5f4 0%, #cbd5e1 100%);
            color: #334155;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            font-weight: 600;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.18);
        }

        .sddm-user {
            margin: 0 0 1.1rem;
            color: rgba(255, 255, 255, 0.88);
            font-size: 0.92rem;
            font-weight: 500;
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.45);
        }

        .sddm-form {
            width: min(100%, 212px);
            margin: 0 auto;
        }

        .sddm-input-row {
            display: flex;
            align-items: stretch;
            overflow: hidden;
            border: 1px solid rgba(0, 0, 0, 0.35);
            background: rgba(0, 0, 0, 0.3);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 1px 4px rgba(0, 0, 0, 0.28);
        }

        .sddm-password {
            flex: 1;
            min-width: 0;
            height: 32px;
            padding: 0 0.75rem;
            border: 0;
            outline: 0;
            background: transparent;
            color: #fff;
            font-size: 13px;
        }

        .sddm-password::placeholder {
            color: rgba(255, 255, 255, 0.35);
        }

        .sddm-submit {
            width: 36px;
            border: 0;
            border-left: 1px solid rgba(255, 255, 255, 0.15);
            background: rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.88);
            font-size: 1.2rem;
            cursor: pointer;
        }

        .sddm-error {
            min-height: 1rem;
            margin-top: 0.75rem;
            color: rgba(255, 228, 230, 0.95);
            font-size: 11px;
        }

        .sddm-corner-control {
            position: fixed;
            bottom: 1.4rem;
            z-index: 3;
        }

        .sddm-corner-control.left {
            left: 1.4rem;
        }

        .sddm-corner-control.right {
            right: 1.4rem;
        }

        .sddm-session-menu {
            position: absolute;
            left: 0;
            bottom: calc(100% + 0.65rem);
            min-width: 176px;
            padding: 0.45rem;
            border: 1px solid rgba(255, 255, 255, 0.18);
            border-radius: 1rem;
            background: rgba(20, 24, 29, 0.72);
            box-shadow: 0 18px 40px rgba(0, 0, 0, 0.24);
            backdrop-filter: blur(14px);
            opacity: 0;
            transform: translateY(6px);
            pointer-events: none;
            transition: opacity 160ms ease, transform 160ms ease;
        }

        .sddm-session-menu.is-open {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }

        .sddm-session-toggle,
        .sddm-power-button,
        .sddm-session-option {
            color: rgba(255, 255, 255, 0.78);
            border-radius: 999px;
            border: 1px solid rgba(255, 255, 255, 0.18);
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(10px);
        }

        .sddm-session-toggle,
        .sddm-power-button {
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            min-height: 38px;
            padding: 0.45rem 0.95rem;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            cursor: pointer;
            transition: background 160ms ease, color 160ms ease, border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
        }

        .sddm-session-toggle:hover,
        .sddm-power-button:hover {
            background: rgba(255, 255, 255, 0.14);
            color: rgba(255, 255, 255, 0.98);
            transform: translateY(-1px);
        }

        .sddm-session-toggle-arrow {
            font-size: 0.9rem;
            line-height: 1;
            transform: rotate(180deg);
        }

        .sddm-session-options {
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
        }

        .sddm-session-option {
            width: 100%;
            padding: 0.55rem 0.85rem;
            text-align: left;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            cursor: pointer;
            transition: background 160ms ease, color 160ms ease, border-color 160ms ease, transform 160ms ease;
        }

        .sddm-session-option.is-active {
            border-color: rgba(147, 197, 253, 0.95);
            background: rgba(59, 130, 246, 0.22);
            color: rgba(255, 255, 255, 0.98);
            transform: translateY(-1px);
        }

        .sddm-power-button {
            justify-content: center;
        }

        .sddm-power-icon {
            font-size: 0.95rem;
            line-height: 1;
        }

        @media (max-width: 640px) {
            .sddm-corner-control {
                bottom: 1rem;
            }

            .sddm-corner-control.left {
                left: 1rem;
            }

            .sddm-corner-control.right {
                right: 1rem;
            }
        }

        @keyframes boot-line-in {
            from {
                opacity: 0;
                transform: translateY(4px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .terminal-live-line {
            display: flex;
            align-items: center;
            gap: 0.35rem;
            min-height: 1.75rem;
            margin-top: 0.15rem;
        }

        .terminal-prompt {
            color: #71717a;
            white-space: pre-wrap;
            word-break: break-word;
        }

        .terminal-capture {
            flex: 1;
            min-width: 0;
            border: 0;
            outline: 0;
            background: transparent;
            color: #e4e4e7;
            font: inherit;
            padding: 0;
            margin: 0;
            caret-color: #e4e4e7;
            appearance: none;
            -webkit-appearance: none;
            border-radius: 0;
            box-shadow: none;
            font-size: 16px;
        }

        .terminal-desktop-capture {
            position: fixed;
            left: -9999px;
            top: 0;
            width: 1px;
            height: 1px;
            opacity: 0;
            pointer-events: none;
        }

        .terminal-capture::placeholder {
            color: transparent;
        }

        .terminal-capture[data-mask="true"] {
            -webkit-text-security: disc;
        }

        .terminal-capture:-webkit-autofill,
        .terminal-capture:-webkit-autofill:hover,
        .terminal-capture:-webkit-autofill:focus {
            -webkit-text-fill-color: #e4e4e7;
            -webkit-box-shadow: 0 0 0 1000px #050505 inset;
        }

        .terminal-cursor {
            display: inline-block;
            width: 0.7ch;
            animation: terminal-cursor 1s steps(1) infinite;
        }

        .terminal-line {
            word-break: break-word;
            white-space: pre-wrap;
        }

        .terminal-mobile-shell {
            display: none;
            position: fixed;
            right: 0.75rem;
            bottom: calc(env(safe-area-inset-bottom, 0px) + 0.75rem);
            left: 0.75rem;
            z-index: 20;
            border: 1px solid #1f1f23;
            border-radius: 0.9rem;
            background: rgba(5, 5, 5, 0.96);
            box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
            padding: 0.75rem 0.85rem 0.8rem;
            backdrop-filter: blur(8px);
        }

        .terminal-mobile-meta {
            margin-bottom: 0.35rem;
            font-size: 0.66rem;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: #71717a;
        }

        .terminal-mobile-prompt {
            display: block;
            margin-bottom: 0.2rem;
            font-size: 0.72rem;
            line-height: 1.2rem;
            color: #a1a1aa;
            word-break: break-word;
        }

        .terminal-screen.mobile-input-mode {
            padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 6.5rem);
        }

        .terminal-screen.mobile-input-mode #terminal-live-line {
            display: none !important;
        }

        .terminal-screen.mobile-input-mode #terminal-mobile-shell {
            display: block;
        }

        .terminal-screen.desktop-input-mode #terminal-live-line {
            display: flex;
        }

        .terminal-screen.desktop-input-mode #terminal-mobile-shell {
            display: none;
        }

        @keyframes terminal-cursor {
            0%,
            49% {
                opacity: 1;
            }

            50%,
            100% {
                opacity: 0;
            }
        }
    </style>
</head>
<body>
    <main id="terminal-root" class="terminal-screen relative px-3 py-3 sm:px-5 sm:py-4">
        <div id="terminal-console" class="text-[12px] leading-6 sm:text-[14px] sm:leading-7"></div>
        <div id="terminal-live-line" class="text-[12px] leading-6 sm:text-[14px] sm:leading-7">
            <span id="terminal-prompt" class="terminal-prompt"></span>
            <span id="terminal-live-value" class="break-all text-zinc-200"></span>
            <span id="terminal-cursor" class="terminal-cursor text-zinc-400">_</span>
        </div>
        <input
            id="terminal-capture"
            class="terminal-capture terminal-desktop-capture"
            type="text"
            inputmode="text"
            enterkeyhint="go"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
        >
        <div id="terminal-mobile-shell" class="terminal-mobile-shell">
            <div class="terminal-mobile-meta">Terminal Input</div>
            <span id="terminal-mobile-prompt" class="terminal-mobile-prompt"></span>
            <div class="terminal-live-line text-[13px] leading-6">
                <input
                    id="terminal-mobile-capture"
                    class="terminal-capture"
                    type="text"
                    inputmode="text"
                    enterkeyhint="go"
                    autocapitalize="off"
                    autocomplete="off"
                    autocorrect="off"
                    spellcheck="false"
                >
                <span id="terminal-mobile-cursor" class="terminal-cursor text-zinc-400">_</span>
            </div>
        </div>

        <form id="terminal-login-form" method="POST" action="{{ route('login') }}" class="hidden">
            @csrf
            <input id="hidden-email" type="hidden" name="email" value="{{ old('email') }}">
            <input id="hidden-password" type="hidden" name="password">
        </form>

        <div id="boot-overlay" class="boot-overlay">
            <div class="boot-overlay-inner">
                <div id="boot-overlay-console" class="boot-overlay-console"></div>
                <div class="boot-prompt">guest@panzekos:~$ <span class="terminal-cursor">_</span></div>
            </div>
        </div>

        <div id="sddm-overlay" class="sddm-overlay">
            <div class="sddm-shell">
                <div class="sddm-card">
                    <div id="sddm-avatar" class="sddm-avatar">AD</div>
                    <p id="sddm-user" class="sddm-user">admin@panzekos</p>
                    <form id="sddm-form" class="sddm-form">
                        <div class="sddm-input-row">
                            <input
                                id="sddm-password"
                                class="sddm-password"
                                type="password"
                                placeholder="Password"
                                autocomplete="current-password"
                            >
                            <button class="sddm-submit" type="submit" aria-label="Unlock session">›</button>
                        </div>
                    </form>
                    <div id="sddm-error" class="sddm-error"></div>
                </div>
            </div>

            <div class="sddm-corner-control left">
                <div id="sddm-session-menu" class="sddm-session-menu">
                    <div class="sddm-session-options" aria-label="Desktop Environment">
                        <button id="sddm-session-xfce" class="sddm-session-option" type="button" data-session="xfce">XFCE</button>
                    </div>
                </div>
                <button id="sddm-session-toggle" class="sddm-session-toggle" type="button" aria-haspopup="true" aria-expanded="false">
                    <span id="sddm-session-label">XFCE</span>
                    <span class="sddm-session-toggle-arrow">▲</span>
                </button>
            </div>

            <div class="sddm-corner-control right">
                <button id="sddm-shutdown-button" class="sddm-power-button" type="button">
                    <span class="sddm-power-icon">⏻</span>
                    <span>Shutdown</span>
                </button>
            </div>
        </div>
    </main>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const rootEl = document.getElementById('terminal-root');
            const consoleEl = document.getElementById('terminal-console');
            const captureEl = document.getElementById('terminal-capture');
            const promptEl = document.getElementById('terminal-prompt');
            const liveValueEl = document.getElementById('terminal-live-value');
            const liveLineEl = document.getElementById('terminal-live-line');
            const mobileShellEl = document.getElementById('terminal-mobile-shell');
            const mobileCaptureEl = document.getElementById('terminal-mobile-capture');
            const mobilePromptEl = document.getElementById('terminal-mobile-prompt');
            const formEl = document.getElementById('terminal-login-form');
            const hiddenEmailEl = document.getElementById('hidden-email');
            const hiddenPasswordEl = document.getElementById('hidden-password');
            const bootOverlayEl = document.getElementById('boot-overlay');
            const bootOverlayConsoleEl = document.getElementById('boot-overlay-console');
            const sddmOverlayEl = document.getElementById('sddm-overlay');
            const sddmAvatarEl = document.getElementById('sddm-avatar');
            const sddmUserEl = document.getElementById('sddm-user');
            const sddmFormEl = document.getElementById('sddm-form');
            const sddmPasswordEl = document.getElementById('sddm-password');
            const sddmErrorEl = document.getElementById('sddm-error');
            const sddmSessionLabelEl = document.getElementById('sddm-session-label');
            const sddmSessionMenuEl = document.getElementById('sddm-session-menu');
            const sddmSessionToggleEl = document.getElementById('sddm-session-toggle');
            const sddmShutdownButtonEl = document.getElementById('sddm-shutdown-button');
            const sddmSessionButtons = Array.from(document.querySelectorAll('[data-session]'));

            if (!rootEl || !consoleEl || !captureEl || !promptEl || !liveValueEl || !liveLineEl || !mobileShellEl || !mobileCaptureEl || !mobilePromptEl || !formEl || !hiddenEmailEl || !hiddenPasswordEl || !bootOverlayEl || !bootOverlayConsoleEl || !sddmOverlayEl || !sddmAvatarEl || !sddmUserEl || !sddmFormEl || !sddmPasswordEl || !sddmErrorEl || !sddmSessionLabelEl || !sddmSessionMenuEl || !sddmSessionToggleEl || !sddmShutdownButtonEl || !sddmSessionButtons.length) {
                return;
            }

            const shellPrompt = 'guest@panzekos:~$ ';
            const usernamePrompt = 'secure-gate login:';
            const passwordPrompt = 'password:';
            const existingEmail = @json(old('email'));
            const errorMessage = @json($errors->first());
            const statusMessage = @json(session('status'));
            const rememberedSddmUser = @json(session('sddm_user') ?? request('user'));
            const openSddmOnLoad = @json(session('show_sddm_login', request('screen') === 'sddm'));
            const bootSequence = [
                { text: 'PanzekOS 24.10 LTS secure-gate tty0', delay: 120, tone: '#d4d4d8' },
                { text: 'Welcome to PanzekOS 24.10 LTS (GNU/Linux 6.15.0-pz-generic x86_64)', delay: 340, tone: '#d4d4d8' },
                { text: '', delay: 500, tone: '#71717a' },
                { text: '[    0.182441] kernel: Initializing Panzek secure memory map', delay: 760, tone: '#a3e635' },
                { text: '[    0.401992] kernel: Loading cgroup namespaces and io scheduler', delay: 1060, tone: '#d4d4d8' },
                { text: '[    0.694210] kernel: Reserving admin framebuffer at 1920x1080', delay: 1360, tone: '#d4d4d8' },
                { text: '[    0.982411] systemd[1]: Reached target Graphical Interface.', delay: 1660, tone: '#a3e635' },
                { text: '[    1.248031] sddm[221]: Starting Simple Desktop Display Manager...', delay: 1980, tone: '#a3e635' },
                { text: '[    1.584220] sddm[221]: Display server started on seat0', delay: 2280, tone: '#d4d4d8' },
                { text: '[    1.912544] sddm[221]: Theme "panzek-terminal" loaded', delay: 2580, tone: '#d4d4d8' },
                { text: '[    2.236214] sddm[221]: Session ready for ' + (existingEmail || 'admin@panzekos'), delay: 2920, tone: '#a3e635' },
            ];

            let mode = existingEmail || errorMessage ? 'username' : 'shell';
            let currentValue = existingEmail || '';
            let typedUsername = rememberedSddmUser || existingEmail || '';
            let typedPassword = '';
            let isSubmitting = false;
            let isComposing = false;
            let isSddmMode = false;
            let redirectPath = '/dashboard';
            let isSessionMenuOpen = false;
            const topOffsetLines = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
            const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
            const isMobileInputMode = () => coarsePointerQuery.matches && window.innerWidth < 1100;
            const captureInputs = [captureEl, mobileCaptureEl];

            const lines = [
                ...Array.from({ length: topOffsetLines }, () => ({ text: '', tone: 'text-zinc-500' })),
                { text: 'PanzekOS 24.10 LTS secure-gate tty0', tone: 'text-zinc-200' },
                { text: 'Welcome to PanzekOS 24.10 LTS (GNU/Linux 6.15.0-pz-generic x86_64)', tone: 'text-zinc-300' },
                { text: 'The programs included with the PanzekOS system are free software.', tone: 'text-zinc-500' },
                { text: 'PanzekOS comes with ABSOLUTELY NO WARRANTY, to the extent permitted by law.', tone: 'text-zinc-500' },
                { text: 'Last login: Fri Mar 19 21:04:19 2026 from 127.0.0.1', tone: 'text-zinc-500' },
                { text: '', tone: 'text-zinc-500' },
                { text: 'Type `login` to authenticate. Other commands: help, clear, home, uname -a, whoami, neofetch.', tone: 'text-zinc-400' },
            ];

            if (statusMessage) {
                lines.push({ text: statusMessage, tone: 'text-emerald-300' });
            }

            if (errorMessage) {
                lines.push({ text: `Authentication failure: ${errorMessage}`, tone: 'text-rose-300' });
                lines.push({ text: 'Retry secure-gate login.', tone: 'text-zinc-400' });
            }

            const getPrompt = () => {
                if (mode === 'username') {
                    return usernamePrompt;
                }

                if (mode === 'password') {
                    return passwordPrompt;
                }

                if (mode === 'authenticating') {
                    return 'root@secure-gate:~$ ';
                }

                return shellPrompt;
            };

            const escapeHtml = (value) => {
                return value
                    .replaceAll('&', '&amp;')
                    .replaceAll('<', '&lt;')
                    .replaceAll('>', '&gt;');
            };

            const getDisplayValue = () => {
                if (mode === 'password') {
                    return '•'.repeat(currentValue.length);
                }

                return currentValue;
            };

            const syncDesktopLiveValue = () => {
                liveValueEl.textContent = getDisplayValue();
            };

            const getActiveCapture = () => {
                return isMobileInputMode() ? mobileCaptureEl : captureEl;
            };

            const applyInputModeClasses = () => {
                rootEl.classList.toggle('mobile-input-mode', isMobileInputMode());
                rootEl.classList.toggle('desktop-input-mode', !isMobileInputMode());
            };

            const printLine = (text, tone = 'text-zinc-400') => {
                lines.push({ text, tone });
            };

            const printHtmlLine = (html, tone = '') => {
                lines.push({ html, tone });
            };

            const syncSddmIdentity = () => {
                const userLabel = typedUsername || 'admin@panzekos';
                const initials = userLabel
                    .split('@')[0]
                    .split(/[.\-_ ]+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => (part[0] || '').toUpperCase())
                    .join('') || 'AD';

                sddmUserEl.textContent = userLabel;
                sddmAvatarEl.textContent = initials;
            };

            const syncDesktopEnvironmentSelection = () => {
                localStorage.setItem('admin_desktop_environment', 'xfce');
                sddmSessionLabelEl.textContent = 'XFCE';

                sddmSessionButtons.forEach((button) => {
                    button.classList.toggle('is-active', button.dataset.session === 'xfce');
                });
            };

            const syncSessionMenuState = () => {
                sddmSessionMenuEl.classList.toggle('is-open', isSessionMenuOpen);
                sddmSessionToggleEl.setAttribute('aria-expanded', isSessionMenuOpen ? 'true' : 'false');
            };

            const startBootSequence = (showSddmAfterBoot = true) => {
                syncSddmIdentity();
                sddmOverlayEl.classList.remove('is-visible');
                isSddmMode = false;
                bootOverlayConsoleEl.innerHTML = '';
                bootOverlayEl.classList.remove('is-fading');
                bootOverlayEl.classList.add('is-visible');

                bootSequence.forEach((line) => {
                    window.setTimeout(() => {
                        const lineEl = document.createElement('div');
                        lineEl.className = 'boot-line';
                        lineEl.style.color = line.tone;
                        lineEl.textContent = line.text || '\u00A0';
                        bootOverlayConsoleEl.appendChild(lineEl);
                    }, line.delay);
                });

                const totalDuration = Math.max(...bootSequence.map((line) => line.delay)) + 900;

                window.setTimeout(() => {
                    bootOverlayEl.classList.add('is-fading');
                }, totalDuration - 220);

                window.setTimeout(() => {
                    bootOverlayEl.classList.remove('is-visible');
                    bootOverlayEl.classList.remove('is-fading');

                    if (!showSddmAfterBoot) {
                        window.location.href = redirectPath;
                        return;
                    }

                    sddmPasswordEl.value = '';
                    sddmErrorEl.textContent = '';
                    sddmOverlayEl.classList.add('is-visible');
                    isSddmMode = true;
                    sddmPasswordEl.focus({ preventScroll: true });
                }, totalDuration);
            };

            const authenticateCredentials = async (email, password) => {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                const response = await fetch(formEl.action, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                });

                if (response.redirected) {
                    const redirectUrl = new URL(response.url, window.location.origin);

                    if (redirectUrl.pathname === '/login') {
                        throw new Error('Email atau password salah.');
                    }

                    return `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`;
                }

                if (response.ok) {
                    return '/dashboard';
                }

                const payload = await response.json().catch(() => ({}));
                throw new Error(payload?.errors?.email?.[0] || payload?.message || 'Email atau password salah.');
            };

            const startLogin = () => {
                mode = 'username';
                currentValue = typedUsername || '';
                render();
            };

            const goHome = () => {
                window.location.href = '/';
            };

            const handleShellCommand = (command) => {
                const normalized = command.trim();

                printLine(`${shellPrompt} ${command}`, 'text-zinc-200');

                if (!normalized) {
                    return;
                }

                if (normalized === 'help') {
                    printLine('Available commands: login, clear, home, uname -a, whoami, motd, neofetch', 'text-zinc-400');
                    return;
                }

                if (normalized === 'clear') {
                    lines.length = 0;
                    Array.from({ length: topOffsetLines }, () => ({ text: '', tone: 'text-zinc-500' })).forEach((line) => {
                        lines.push(line);
                    });
                    return;
                }

                if (normalized === 'home' || normalized === 'exit') {
                    printLine('Leaving secure gate...', 'text-zinc-500');
                    render();
                    setTimeout(goHome, 120);
                    return;
                }

                if (normalized === 'whoami') {
                    printLine('guest', 'text-zinc-300');
                    return;
                }

                if (normalized === 'uname -a') {
                    printLine('Linux secure-gate 6.15.0-pz-generic #1 SMP PanzekOS x86_64 GNU/Linux', 'text-zinc-300');
                    return;
                }

                if (normalized === 'motd') {
                    printLine('PanzekOS secure gateway ready. Authenticate to continue.', 'text-zinc-400');
                    return;
                }

                if (normalized === 'neofetch') {
                    const compactFetch = window.innerWidth < 640;
                    const logoLines = [
                        '██████╗    ██████╗ ',
                        '██╔══██╗  ██╔═══██╗',
                        '██████╔╝  ██║   ██║',
                        '██╔═══╝   ██║   ██║',
                        '██║       ██║   ██║',
                        '██║       ╚██████╔╝',
                        '╚═╝        ╚═════╝ ',
                    ];
                    const infoLines = [
                        'guest@panzekos',
                        '--------------',
                        'OS: PanzekOS 24.10 LTS x86_64',
                        'Host: secure-gate',
                        'Kernel: 6.15.0-pz-generic',
                        'Shell: pzsh 1.0.0',
                        'Theme: blackwhite-terminal',
                        'Terminal: tty0',
                        'User: guest',
                    ];

                    if (compactFetch) {
                        logoLines.forEach((line, index) => {
                            const color = index < 3 ? '#5ea8ff' : '#31d7ff';
                            printHtmlLine(`<span style="color:${color}">${escapeHtml(line)}</span>`);
                        });
                        printLine('', 'text-zinc-400');
                        infoLines.forEach((line) => {
                            printLine(line, 'text-zinc-300');
                        });
                        return;
                    }

                    const combinedLines = [
                        ['██████╗    ██████╗ ', 'guest@panzekos'],
                        ['██╔══██╗  ██╔═══██╗', '--------------'],
                        ['██████╔╝  ██║   ██║', 'OS: PanzekOS 24.10 LTS x86_64'],
                        ['██╔═══╝   ██║   ██║', 'Host: secure-gate'],
                        ['██║       ██║   ██║', 'Kernel: 6.15.0-pz-generic'],
                        ['██║       ╚██████╔╝', 'Shell: pzsh 1.0.0'],
                        ['╚═╝        ╚═════╝ ', 'Theme: blackwhite-terminal'],
                        ['', 'Terminal: tty0'],
                        ['', 'User: guest'],
                    ];

                    combinedLines.forEach(([logo, info], index) => {
                        const logoColor = index < 3 ? '#5ea8ff' : '#31d7ff';
                        const paddedLogo = logo.padEnd(24, ' ');
                        printHtmlLine(
                            `<span style="display:inline-block;min-width:24ch;color:${logo ? logoColor : 'transparent'}">${escapeHtml(paddedLogo)}</span>  <span style="color:#d4d4d8">${escapeHtml(info)}</span>`
                        );
                    });

                    return;
                }

                if (normalized === 'login') {
                    startLogin();
                    return;
                }

                printLine(`command not found: ${normalized}`, 'text-rose-300');
            };

            const submitAuth = async () => {
                if (!typedUsername.trim()) {
                    printLine('Username cannot be empty.', 'text-rose-300');
                    mode = 'username';
                    currentValue = '';
                    render();
                    return;
                }

                if (!typedPassword.length) {
                    printLine('Password cannot be empty.', 'text-rose-300');
                    mode = 'password';
                    currentValue = '';
                    render();
                    return;
                }

                isSubmitting = true;
                mode = 'authenticating';
                printLine(`root@secure-gate:~$ auth --user ${typedUsername} --grant-access`, 'text-zinc-200');
                printLine('Verifying credentials against PanzekOS secure gate...', 'text-zinc-500');
                render();

                try {
                    redirectPath = await authenticateCredentials(typedUsername, typedPassword);
                    startBootSequence(true);
                    return;
                } catch (error) {
                    printLine(`Authentication failure: ${error.message}`, 'text-rose-300');
                    printLine('Retry secure-gate login.', 'text-zinc-400');
                    mode = 'username';
                    currentValue = typedUsername;
                    typedPassword = '';
                    isSubmitting = false;
                    render();
                }
            };

            const handleEnter = () => {
                if (isSubmitting) {
                    return;
                }

                if (mode === 'shell') {
                    const command = currentValue;
                    currentValue = '';
                    handleShellCommand(command);
                    render();
                    return;
                }

                if (mode === 'username') {
                    printLine(`${usernamePrompt} ${currentValue}`, 'text-zinc-200');
                    typedUsername = currentValue.trim();
                    currentValue = '';
                    mode = 'password';
                    render();
                    return;
                }

                if (mode === 'password') {
                    printLine(`${passwordPrompt} ${'•'.repeat(currentValue.length)}`, 'text-zinc-200');
                    typedPassword = currentValue;
                    currentValue = '';
                    submitAuth();
                }
            };

            sddmFormEl.addEventListener('submit', (event) => {
                event.preventDefault();

                if (!typedUsername.trim()) {
                    sddmErrorEl.textContent = 'User session tidak ditemukan. Login dari terminal dulu.';
                    return;
                }

                if (typedPassword && sddmPasswordEl.value !== typedPassword) {
                    sddmErrorEl.textContent = 'Password salah. Masukkan password login yang sama.';
                    sddmPasswordEl.focus({ preventScroll: true });
                    return;
                }

                if (typedPassword) {
                    sddmErrorEl.textContent = '';
                    sddmOverlayEl.classList.remove('is-visible');
                    isSddmMode = false;
                    window.location.href = redirectPath;
                    return;
                }

                sddmErrorEl.textContent = 'Authenticating session...';

                authenticateCredentials(typedUsername, sddmPasswordEl.value)
                    .then((path) => {
                        typedPassword = sddmPasswordEl.value;
                        redirectPath = path;
                        sddmErrorEl.textContent = '';
                        sddmOverlayEl.classList.remove('is-visible');
                        isSddmMode = false;
                        window.location.href = redirectPath;
                    })
                    .catch((error) => {
                        sddmErrorEl.textContent = error.message || 'Password salah.';
                        sddmPasswordEl.focus({ preventScroll: true });
                    });
            });

            sddmSessionButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    syncDesktopEnvironmentSelection();
                    isSessionMenuOpen = false;
                    syncSessionMenuState();
                });
            });

            sddmSessionToggleEl.addEventListener('click', () => {
                isSessionMenuOpen = !isSessionMenuOpen;
                syncSessionMenuState();
            });

            sddmShutdownButtonEl.addEventListener('click', () => {
                window.location.href = '/';
            });

            document.addEventListener('pointerdown', (event) => {
                if (!isSessionMenuOpen) {
                    return;
                }

                if (
                    event.target instanceof HTMLElement
                    && (sddmSessionMenuEl.contains(event.target) || sddmSessionToggleEl.contains(event.target))
                ) {
                    return;
                }

                isSessionMenuOpen = false;
                syncSessionMenuState();
            });

            const render = () => {
                const displayLines = lines.map((line) => {
                    if (line.html) {
                        return `<div class="terminal-line ${line.tone}">${line.html}</div>`;
                    }

                    return `<div class="terminal-line ${line.tone}">${escapeHtml(line.text)}</div>`;
                }).join('');

                consoleEl.innerHTML = `
                    <div class="h-full w-full whitespace-pre-wrap break-words">
                        ${displayLines}
                    </div>
                `;

                if (isSubmitting) {
                    liveLineEl.style.display = 'none';
                    mobileShellEl.hidden = true;
                } else {
                    applyInputModeClasses();
                    liveLineEl.style.display = isMobileInputMode() ? 'none' : 'flex';
                    mobileShellEl.hidden = false;
                    promptEl.textContent = getPrompt();
                    syncDesktopLiveValue();
                    mobilePromptEl.textContent = getPrompt();

                    captureInputs.forEach((input) => {
                        input.type = 'text';
                        input.inputMode = 'text';
                        input.dataset.mask = mode === 'password' ? 'true' : 'false';
                        input.autocomplete = mode === 'password' ? 'current-password' : mode === 'username' ? 'username' : 'off';
                        input.enterKeyHint = mode === 'username' ? 'next' : 'go';
                        if (input.value !== currentValue) {
                            input.value = currentValue;
                        }
                    });
                }

                window.requestAnimationFrame(() => {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: isMobileInputMode() ? 'auto' : 'smooth' });
                });
            };

            const syncFromCapture = (sourceInput) => {
                currentValue = sourceInput.value;
                syncDesktopLiveValue();

                captureInputs.forEach((input) => {
                    if (input !== sourceInput && input.value !== currentValue) {
                        input.value = currentValue;
                    }
                });
            };

            const focusCapture = () => {
                const activeCapture = getActiveCapture();

                if (isSubmitting || isSddmMode || document.activeElement === activeCapture) {
                    return;
                }

                activeCapture.focus({ preventScroll: true });
            };

            captureInputs.forEach((input) => {
                input.addEventListener('input', () => {
                    syncFromCapture(input);
                });

                input.addEventListener('compositionstart', () => {
                    isComposing = true;
                });

                input.addEventListener('compositionend', () => {
                    isComposing = false;
                    syncFromCapture(input);
                });

                input.addEventListener('keydown', (event) => {
                    if (isComposing) {
                        return;
                    }

                    if (event.key === 'Enter') {
                        event.preventDefault();
                        handleEnter();
                        focusCapture();
                        return;
                    }

                    if (event.key === 'Tab') {
                        event.preventDefault();
                    }
                });
            });

            rootEl.addEventListener('pointerdown', (event) => {
                if (isSubmitting) {
                    return;
                }

                if (event.target instanceof HTMLElement && event.target.closest('input, button, a, label')) {
                    return;
                }

                window.requestAnimationFrame(() => {
                    focusCapture();
                });
            });

            render();
            syncDesktopEnvironmentSelection();
            syncSessionMenuState();

            if (openSddmOnLoad) {
                syncSddmIdentity();
                sddmOverlayEl.classList.add('is-visible');
                isSddmMode = true;
                sddmPasswordEl.focus({ preventScroll: true });
            } else if (!isMobileInputMode()) {
                focusCapture();
            }

            window.addEventListener('resize', () => {
                render();
            });
        });
    </script>
</body>
</html>
