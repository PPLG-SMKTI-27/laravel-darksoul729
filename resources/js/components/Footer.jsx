import React from 'react';
import PlasticButton from '../UI/PlasticButton';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            name: 'Github',
            url: 'https://github.com',
            // Custom 3D Toy Icon (Generated)
            img: '/images/github-toy.png',
            color: 'bg-indigo-500 border-indigo-700'
        },
        {
            name: 'LinkedIn',
            url: 'https://linkedin.com',
            // Custom 3D Toy Icon (Generated)
            img: '/images/linkedin-toy.png',
            color: 'bg-blue-400 border-blue-600'
        },
        {
            name: 'Email',
            url: 'mailto:kevin@example.com',
            // Custom 3D Toy Icon (Generated)
            img: '/images/email-toy.png',
            color: 'bg-pink-500 border-pink-700'
        }
    ];

    const quickLinks = [
        { name: 'Home', url: '/' },
        { name: 'Projects', url: '/projects' },
        { name: 'Skills', url: '/skills' },
        { name: 'Contact', url: '/contact' }
    ];

    return (
        <footer className="relative mt-24 mb-12 px-4">
            <div className="max-w-7xl mx-auto">

                {/* TOY CONSOLE CONTAINER - BLUE EDITION */}
                <div className="relative bg-blue-600 rounded-[3rem] p-8 md:p-12 shadow-[0_25px_50px_-12px_rgba(37,99,235,0.5)] border-b-[12px] border-r-[12px] border-blue-800 overflow-hidden ring-4 ring-blue-500">

                    {/* Plastic Texture & Screws */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>
                    <div className="absolute top-6 left-6 w-4 h-4 rounded-full bg-blue-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border-b border-blue-700 flex items-center justify-center opacity-75"><div className="w-2 h-0.5 bg-blue-800 rotate-45"></div></div>
                    <div className="absolute top-6 right-6 w-4 h-4 rounded-full bg-blue-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border-b border-blue-700 flex items-center justify-center opacity-75"><div className="w-2 h-0.5 bg-blue-800 rotate-45"></div></div>
                    <div className="absolute bottom-6 left-6 w-4 h-4 rounded-full bg-blue-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border-b border-blue-700 flex items-center justify-center opacity-75"><div className="w-2 h-0.5 bg-blue-800 rotate-45"></div></div>
                    <div className="absolute bottom-6 right-6 w-4 h-4 rounded-full bg-blue-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] border-b border-blue-700 flex items-center justify-center opacity-75"><div className="w-2 h-0.5 bg-blue-800 rotate-45"></div></div>

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

                        {/* 1. BRAND SECTION (Span 5) */}
                        <div className="md:col-span-5 flex flex-col items-start gap-6">
                            <div className="relative z-10">
                                {/* 3D "Molded" Text Effect */}
                                <h3 className="font-black leading-[0.85] tracking-tighter select-none">
                                    <span className="block text-[3.5rem] md:text-[4.5rem] text-white drop-shadow-lg"
                                        style={{ textShadow: "0 2px 0 #cbd5e1, 0 4px 0 #94a3b8, 0 6px 0 #64748b, 0 8px 0 #475569, 0 10px 10px rgba(0,0,0,0.3)" }}>
                                        KEVIN
                                    </span>
                                    <span className="block text-[2.5rem] md:text-[3.2rem] text-yellow-400 drop-shadow-lg scale-y-90 origin-top"
                                        style={{ textShadow: "0 2px 0 #fcd34d, 0 4px 0 #fbbf24, 0 6px 0 #d97706, 0 8px 0 #b45309, 0 10px 10px rgba(0,0,0,0.3)" }}>
                                        HERMANSYAH
                                    </span>
                                </h3>
                            </div>

                            {/* Engraved Subtitle */}
                            <p className="text-blue-200 font-bold text-lg max-w-sm pl-1 leading-tight"
                                style={{ textShadow: "1px 1px 0 rgba(255,255,255,0.1), -1px -1px 0 rgba(0,0,0,0.5)" }}>
                                Full-stack developer crafting exceptional digital experiences.
                            </p>
                        </div>

                        {/* 2. NAVIGATION - 3D AQUARIUM BLOCKS (Span 4) */}
                        <div className="md:col-span-4">
                            <h4 className="text-cyan-200 font-black text-xs uppercase tracking-[0.2em] mb-6 border-b-2 border-cyan-400/30 pb-2 inline-block">Menu Select</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {quickLinks.map((link, i) => (
                                    <a key={i} href={link.url} className="group relative block transition-transform duration-300 hover:-translate-y-1">
                                        {/* Aquarium Glass Container */}
                                        <div className="relative h-14 bg-cyan-500/20 backdrop-blur-md rounded-xl border-[3px] border-cyan-300/50 shadow-[inset_0_0_10px_rgba(34,211,238,0.3),0_10px_20px_rgba(0,0,0,0.2)] overflow-hidden flex items-center justify-center group-hover:bg-cyan-400/30 group-hover:border-cyan-200 transition-all">

                                            {/* Water Wave Effect */}
                                            <div className="absolute bottom-0 left-0 w-[200%] h-full bg-gradient-to-t from-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            {/* Gloss Shine */}
                                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>

                                            <span className="relative z-10 font-black text-white text-sm uppercase tracking-wider drop-shadow-md group-hover:scale-110 transition-transform">
                                                {link.name}
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* 3. SOCIAL BUTTONS - TRUE 3D ICONS (Span 3) */}
                        <div className="md:col-span-3 flex flex-col items-center md:items-end gap-6">
                            <div className="flex gap-4">
                                {socialLinks.map((social, i) => (
                                    <a key={i} href={social.url} target="_blank" className="group relative transition-transform duration-300 hover:scale-110 md:hover:scale-125">
                                        {/* Floating Glass Bubble */}
                                        <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/30 group-hover:border-white/60 transition-colors`}>

                                            {/* 3D Icon Image */}
                                            <img
                                                src={social.img}
                                                alt={social.name}
                                                className="w-14 h-14 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] transform group-hover:-translate-y-2 group-hover:rotate-6 transition-transform duration-300"
                                            />

                                            {/* Reflection */}
                                            <div className="absolute top-2 right-2 w-4 h-4 bg-white/40 rounded-full blur-[2px]"></div>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            <div className="bg-blue-900/50 rounded-full px-6 py-2 border border-blue-500/50 flex items-center gap-3 backdrop-blur-sm">
                                <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80] animate-pulse"></div>
                                <span className="text-blue-100 font-mono text-xs font-bold uppercase">System Online</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="mt-12 pt-6 border-t-2 border-blue-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-blue-200 text-xs font-bold uppercase tracking-wider">
                        <p>© {currentYear} KEVIN_HERMANSYAH // V3.0</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-yellow-300 transition-colors">Privacy_Config</a>
                            <a href="#" className="hover:text-yellow-300 transition-colors">Term_Logic</a>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;
