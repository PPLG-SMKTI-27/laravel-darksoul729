import React, { useContext, useState, useRef, useEffect } from 'react';
import { AdminWindow, AdminTerminalPanel, AdminTerminalButton, OSContext } from './AdminTerminal';
import { RefreshCw } from 'lucide-react';

export const LocalAppearance = ({ windowId }) => {
    const os = useContext(OSContext);

    const setRandomWallpaper = () => {
        os.setWallpaper(`https://picsum.photos/1920/1080?random=${Date.now()}`);
    };

    const resetWallpaper = () => {
        os.setWallpaper('');
    };

    return (
        <AdminWindow
            windowId={windowId}
            title="Display Settings"
            subtitle="Customize the appearance of your desktop environment."
            initialWidth={500}
            initialHeight={350}
            actions={[]}
        >
            <div className="p-4 w-full h-full">
                <AdminTerminalPanel title="Desktop Wallpaper" className="mb-0">
                    <div className="space-y-4">
                        <p className="text-[12px] text-[#444] mb-3 leading-relaxed">
                            Choose a new random high-resolution wallpaper from the web or revert to the classic XFCE defaults.
                        </p>
                        <div className="flex gap-2">
                            <AdminTerminalButton tone="blue" onClick={setRandomWallpaper} icon={RefreshCw}>
                                Fetch Random Wallpaper
                            </AdminTerminalButton>
                            <AdminTerminalButton tone="neutral" onClick={resetWallpaper} disabled={!os.wallpaper}>
                                Reset to Default
                            </AdminTerminalButton>
                        </div>
                        {os.wallpaper && (
                            <div className="mt-4 rounded-[2px] border border-[#a0a0a0] overflow-hidden relative shadow-[inset_0_1px_3px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.8)] inline-block bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] p-1">
                                <img src={os.wallpaper} alt="Current Wallpaper" className="h-32 w-auto object-cover border border-[#888] rounded-[1px] shadow-sm" />
                            </div>
                        )}
                    </div>
                </AdminTerminalPanel>
            </div>
        </AdminWindow>
    );
};

export const LocalTerminal = ({ windowId }) => {
    const [history, setHistory] = useState([
        { type: 'system', text: 'Welcome to XFCE Terminal Emulator' },
        { type: 'system', text: 'Type "help" to see available commands.' },
    ]);
    const [input, setInput] = useState('');
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!input.trim()) return;

            const cmd = input.trim();
            const newHistory = [...history, { type: 'input', text: `admin@xfce:~$ ${cmd}` }];

            const args = cmd.toLowerCase().split(' ');

            if (args[0] === 'clear') {
                setHistory([]);
                setInput('');
                return;
            } else if (args[0] === 'help') {
                newHistory.push({ type: 'output', text: 'Available commands: clear, help, date, whoami, echo, ls, pwd' });
            } else if (args[0] === 'date') {
                newHistory.push({ type: 'output', text: new Date().toString() });
            } else if (args[0] === 'whoami') {
                newHistory.push({ type: 'output', text: 'admin' });
            } else if (args[0] === 'pwd') {
                newHistory.push({ type: 'output', text: '/home/admin' });
            } else if (args[0] === 'echo') {
                newHistory.push({ type: 'output', text: cmd.substring(5) });
            } else if (args[0] === 'ls') {
                newHistory.push({ type: 'output', text: 'Desktop  Documents  Downloads  Music  Pictures  Public  Templates  Videos' });
            } else {
                newHistory.push({ type: 'error', text: `bash: ${args[0]}: command not found` });
            }

            setHistory(newHistory);
            setInput('');
        }
    };

    return (
        <AdminWindow
            windowId={windowId}
            title="Terminal"
            initialWidth={650}
            initialHeight={400}
            hideMenuBar={true}
            hideToolbar={true}
            hideSidebar={true}
            hideStatusBar={true}
            contentClassName="!bg-black"
            actions={[]}
        >
            <div
                className="flex h-full w-full flex-col bg-black px-3 py-2 text-[13px] leading-relaxed text-[#d4d4d4] cursor-text"
                style={{ fontFamily: '"Liberation Mono", "DejaVu Sans Mono", "Ubuntu Mono", "Cascadia Mono", monospace' }}
                onClick={() => inputRef.current?.focus()}
            >
                <div className="flex-1 overflow-y-auto">
                    {history.map((line, i) => (
                        <div key={i} className={
                            line.type === 'error' ? 'text-zinc-400'
                                : line.type === 'system' ? 'text-zinc-400'
                                    : line.type === 'input' ? 'font-bold text-white'
                                        : 'text-zinc-300'
                        }>
                            {line.type === 'input' ? (
                                <span><span className="text-zinc-300 font-bold">admin@linux-desktop:~/Desktop$</span> {line.text.substring(line.text.indexOf('$ ') + 2)}</span>
                            ) : line.text}
                        </div>
                    ))}
                    <div className="flex mt-1 items-center">
                        <span className="mr-2 font-bold whitespace-nowrap text-zinc-300">admin@linux-desktop:~/Desktop$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="min-w-0 flex-1 border-0 bg-transparent px-0 py-0 font-bold text-white outline-none ring-0 focus:border-transparent focus:outline-none focus:ring-0"
                            style={{ boxShadow: 'none' }}
                            autoFocus
                            spellCheck={false}
                        />
                    </div>
                    <div ref={bottomRef} className="h-4" />
                </div>
            </div>
        </AdminWindow>
    );
};
