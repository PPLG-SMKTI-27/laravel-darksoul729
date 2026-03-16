import React from 'react';
import { Atom, Braces, FileCode2, PanelsTopLeft } from 'lucide-react';

const HtmlLogo = ({ className = '' }) => {
    return (
        <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
            <defs>
                <linearGradient id="html-shell" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff8a3d" />
                    <stop offset="100%" stopColor="#ff4d4d" />
                </linearGradient>
                <linearGradient id="html-core" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff2d8" />
                    <stop offset="100%" stopColor="#ffd166" />
                </linearGradient>
            </defs>

            <path d="M48 30h160l-16 178-64 18-64-18L48 30Z" fill="url(#html-shell)" />
            <path d="M128 46h65l-13 151-52 15V46Z" fill="#ff6c39" opacity="0.72" />
            <path d="M84 80h89l-3 24h-59l3 29h53l-7 47-32 9-32-9-2-28h25l1 10 8 3 9-3 2-15H92l-8-90Z" fill="url(#html-core)" />
        </svg>
    );
};

const CssLogo = ({ className = '' }) => {
    return (
        <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
            <defs>
                <linearGradient id="css-shell" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#54c6ff" />
                    <stop offset="100%" stopColor="#315dff" />
                </linearGradient>
            </defs>

            <path d="M48 30h160l-16 178-64 18-64-18L48 30Z" fill="url(#css-shell)" />
            <path d="M128 46h65l-13 151-52 15V46Z" fill="#2f52d6" opacity="0.7" />
            <path d="M90 80h84l-4 24h-50l3 29h44l-7 47-32 9-31-9-2-28h25l1 10 8 3 8-3 2-15H98l-8-90Z" fill="#ffffff" />
        </svg>
    );
};

const JavaScriptLogo = ({ className = '' }) => {
    return (
        <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
            <defs>
                <linearGradient id="js-panel" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffe66d" />
                    <stop offset="100%" stopColor="#ffb703" />
                </linearGradient>
            </defs>

            <rect x="32" y="32" width="192" height="192" rx="36" fill="url(#js-panel)" />
            <rect x="32" y="32" width="192" height="192" rx="36" fill="#ffffff" opacity="0.08" />
            <path d="M146 92h28v80c0 28-14 40-35 40-18 0-29-9-34-20l21-13c4 7 7 13 15 13 7 0 12-3 12-17V92Zm-69 95c6 10 14 18 29 18 12 0 20-6 20-14 0-10-8-13-21-19l-7-3c-20-8-33-18-33-40 0-20 15-35 39-35 17 0 29 6 38 22l-21 13c-5-8-9-11-17-11s-13 5-13 11c0 8 5 11 16 16l7 3c23 10 36 20 36 42 0 24-19 37-44 37-24 0-39-11-47-26l18-14Z" fill="#111827" />
        </svg>
    );
};

const ReactLogo = ({ className = '' }) => {
    return (
        <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
            <defs>
                <linearGradient id="react-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7dd3fc" />
                    <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
            </defs>

            <circle cx="128" cy="128" r="22" fill="url(#react-glow)" />
            <ellipse cx="128" cy="128" rx="84" ry="34" fill="none" stroke="url(#react-glow)" strokeWidth="14" />
            <ellipse cx="128" cy="128" rx="84" ry="34" fill="none" stroke="url(#react-glow)" strokeWidth="14" transform="rotate(60 128 128)" />
            <ellipse cx="128" cy="128" rx="84" ry="34" fill="none" stroke="url(#react-glow)" strokeWidth="14" transform="rotate(120 128 128)" />
        </svg>
    );
};

export const navigationLinks = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Skills', href: '/skills', active: true },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
];

export const skills = [
    {
        name: 'HTML',
        badge: 'HTML5',
        description: 'Experienced in creating structured and semantic web pages using HTML5.',
        Icon: FileCode2,
        Logo: HtmlLogo,
        accentClassName: 'from-orange-300 via-orange-400 to-rose-500',
        glowClassName: 'shadow-[0_0_65px_rgba(251,146,60,0.35)]',
        panelClassName: 'from-orange-500/30 via-orange-400/10 to-transparent',
        modalGlowClassName: 'from-orange-500/30 via-rose-400/18 to-transparent',
        modalAccentClassName: 'shadow-[0_0_80px_rgba(251,146,60,0.32)]',
        offsetClassName: 'xl:translate-y-8',
    },
    {
        name: 'CSS',
        badge: 'CSS3',
        description: 'Skilled in styling responsive and visually appealing web pages with CSS3.',
        Icon: PanelsTopLeft,
        Logo: CssLogo,
        accentClassName: 'from-sky-300 via-blue-400 to-indigo-500',
        glowClassName: 'shadow-[0_0_65px_rgba(59,130,246,0.34)]',
        panelClassName: 'from-sky-500/30 via-blue-400/10 to-transparent',
        modalGlowClassName: 'from-sky-400/28 via-blue-400/18 to-transparent',
        modalAccentClassName: 'shadow-[0_0_80px_rgba(56,189,248,0.28)]',
        offsetClassName: 'xl:translate-y-0',
    },
    {
        name: 'JavaScript',
        badge: 'JS',
        description: 'Proficient in building interactive web applications using vanilla JavaScript.',
        Icon: Braces,
        Logo: JavaScriptLogo,
        accentClassName: 'from-yellow-200 via-amber-300 to-orange-400',
        glowClassName: 'shadow-[0_0_65px_rgba(251,191,36,0.35)]',
        panelClassName: 'from-amber-400/30 via-yellow-300/10 to-transparent',
        modalGlowClassName: 'from-yellow-300/28 via-amber-300/16 to-transparent',
        modalAccentClassName: 'shadow-[0_0_80px_rgba(251,191,36,0.26)]',
        offsetClassName: 'xl:-translate-y-4',
    },
    {
        name: 'React',
        badge: 'React',
        description: 'Experienced in building dynamic and fast user interfaces using React.',
        Icon: Atom,
        Logo: ReactLogo,
        accentClassName: 'from-cyan-200 via-sky-300 to-blue-500',
        glowClassName: 'shadow-[0_0_65px_rgba(56,189,248,0.34)]',
        panelClassName: 'from-cyan-400/30 via-sky-300/10 to-transparent',
        modalGlowClassName: 'from-cyan-300/26 via-sky-300/18 to-transparent',
        modalAccentClassName: 'shadow-[0_0_80px_rgba(34,211,238,0.28)]',
        offsetClassName: 'xl:translate-y-6',
    },
];
