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

            if (!rootEl || !consoleEl || !captureEl || !promptEl || !liveValueEl || !liveLineEl || !mobileShellEl || !mobileCaptureEl || !mobilePromptEl || !formEl || !hiddenEmailEl || !hiddenPasswordEl) {
                return;
            }

            const shellPrompt = 'guest@panzekos:~$ ';
            const usernamePrompt = 'secure-gate login:';
            const passwordPrompt = 'password:';
            const existingEmail = @json(old('email'));
            const errorMessage = @json($errors->first());
            const statusMessage = @json(session('status'));

            let mode = existingEmail || errorMessage ? 'username' : 'shell';
            let currentValue = existingEmail || '';
            let typedUsername = existingEmail || '';
            let typedPassword = '';
            let isSubmitting = false;
            let isComposing = false;
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

            const submitAuth = () => {
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
                hiddenEmailEl.value = typedUsername;
                hiddenPasswordEl.value = typedPassword;
                printLine(`root@secure-gate:~$ auth --user ${typedUsername} --grant-access`, 'text-zinc-200');
                printLine('Verifying credentials against PanzekOS secure gate...', 'text-zinc-500');
                render();
                formEl.submit();
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

                if (isSubmitting || document.activeElement === activeCapture) {
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

            if (!isMobileInputMode()) {
                focusCapture();
            }

            window.addEventListener('resize', () => {
                render();
            });
        });
    </script>
</body>
</html>
