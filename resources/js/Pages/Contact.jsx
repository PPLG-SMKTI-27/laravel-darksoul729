import React, { useState } from 'react';
import MainLayout from '../Layout/MainLayout';
import PlasticButton from '../UI/PlasticButton';
import { motion } from 'framer-motion';

const Contact = ({ page }) => {
    const [focusedField, setFocusedField] = useState(null);

    return (
        <MainLayout page={page}>
            <div className="relative min-h-[90vh] flex items-center justify-center p-4 md:p-8 overflow-hidden bg-slate-50">

                {/* Background: Clean/Polos as requested - No Grid, No Floating Shapes */}

                {/* MAIN DASHBOARD INTERFACE */}
                <div className="relative z-10 w-full max-w-5xl">

                    {/* The Device Chassis - Responsive Scaling */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                        className="relative bg-slate-100 rounded-3xl md:rounded-[3rem] p-2 md:p-4 shadow-xl md:shadow-2xl border-2 md:border-4 border-white ring-2 md:ring-4 ring-slate-200/50"
                    >
                        {/* Screws / Hardware Details (Desktop Only) */}
                        <div className="hidden md:flex absolute top-6 left-6 w-4 h-4 bg-slate-300 rounded-full items-center justify-center shadow-inner"><div className="w-2 h-0.5 bg-slate-400 rotate-45"></div></div>
                        <div className="hidden md:flex absolute top-6 right-6 w-4 h-4 bg-slate-300 rounded-full items-center justify-center shadow-inner"><div className="w-2 h-0.5 bg-slate-400 rotate-45"></div></div>
                        <div className="hidden md:flex absolute bottom-6 left-6 w-4 h-4 bg-slate-300 rounded-full items-center justify-center shadow-inner"><div className="w-2 h-0.5 bg-slate-400 rotate-45"></div></div>
                        <div className="hidden md:flex absolute bottom-6 right-6 w-4 h-4 bg-slate-300 rounded-full items-center justify-center shadow-inner"><div className="w-2 h-0.5 bg-slate-400 rotate-45"></div></div>

                        {/* Inner Interface Panel */}
                        <div className="bg-white rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-inner min-h-[auto] md:min-h-[600px] flex flex-col md:flex-row">

                            {/* LEFT PANEL: Branding & Info */}
                            <div className="w-full md:w-5/12 bg-slate-50 p-6 md:p-12 flex flex-col justify-between border-b-2 md:border-b-0 md:border-r-2 border-slate-100 relative overflow-hidden">
                                {/* Decorative background blob */}
                                <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-60 pointer-events-none transform translate-x-10 -translate-y-10"></div>

                                <div>
                                    <h2 className="text-[10px] md:text-xs font-black tracking-[0.3em] text-slate-400 mb-4 md:mb-6 uppercase">Communication Module</h2>
                                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.9] mb-4">
                                        <span className="block" style={{ textShadow: '3px 3px 0px #cbd5e1' }}>LET'S</span>
                                        <span className="block text-blue-600 mt-2" style={{ textShadow: '5px 5px 0px #1e3a8a' }}>CONNECT</span>
                                    </h1>
                                    <p className="text-slate-500 font-bold text-base md:text-lg leading-snug">
                                        Ready to start a project? <br />
                                        Or just want to say hi?
                                    </p>
                                </div>

                                <div className="space-y-4 md:space-y-6 mt-8 md:mt-12 relative z-10">
                                    <div className="group cursor-pointer">
                                        <div className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-wider mb-1 group-hover:text-blue-500 transition-colors">Digital Frequency</div>
                                        <div className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
                                            <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs md:text-sm">@</span>
                                            hello@darksoul.dev
                                        </div>
                                    </div>

                                    <div className="group cursor-pointer">
                                        <div className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-wider mb-1 group-hover:text-purple-500 transition-colors">Base Coordinates</div>
                                        <div className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
                                            <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs md:text-sm">📍</span>
                                            Jakarta, Indonesia
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Sticker - Hidden on very small screens if needed, but kept for now */}
                                <div className="mt-8 transform -rotate-1 origin-bottom-left hidden md:block">
                                    <div className="inline-block bg-yellow-300 text-yellow-900 px-4 py-2 rounded-lg font-black text-sm border-2 border-yellow-400 border-b-4 shadow-sm">
                                        Open for Work!
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT PANEL: The Form */}
                            <div className="w-full md:w-7/12 p-6 md:p-12 bg-white relative">
                                <form action="/contact" method="POST" className="h-full flex flex-col justify-center space-y-4 md:space-y-6">
                                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')} />

                                    <div className="relative group">
                                        <label className={`absolute left-4 transition-all duration-200 pointer-events-none font-bold uppercase tracking-wider text-[10px] md:text-xs
                                            ${focusedField === 'name' || true ? 'top-2 md:top-3 text-blue-500' : 'top-4 md:top-5 text-slate-400'}`}>
                                            Your Name / Alias
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl md:rounded-2xl px-4 pt-6 md:pt-8 pb-2 md:pb-3 font-bold text-sm md:text-base text-slate-700 
                                                     focus:outline-none focus:bg-blue-50/30 focus:border-blue-400 transition-all"
                                            placeholder="Captain Code"
                                        />
                                    </div>

                                    <div className="relative group">
                                        <label className={`absolute left-4 transition-all duration-200 pointer-events-none font-bold uppercase tracking-wider text-[10px] md:text-xs
                                            ${focusedField === 'email' || true ? 'top-2 md:top-3 text-blue-500' : 'top-4 md:top-5 text-slate-400'}`}>
                                            Secure Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl md:rounded-2xl px-4 pt-6 md:pt-8 pb-2 md:pb-3 font-bold text-sm md:text-base text-slate-700 
                                                     focus:outline-none focus:bg-blue-50/30 focus:border-blue-400 transition-all"
                                            placeholder="captain@example.com"
                                        />
                                    </div>

                                    <div className="relative group flex-grow">
                                        <label className={`absolute left-4 transition-all duration-200 pointer-events-none font-bold uppercase tracking-wider text-[10px] md:text-xs
                                            ${focusedField === 'message' || true ? 'top-2 md:top-3 text-blue-500' : 'top-4 md:top-5 text-slate-400'}`}>
                                            Message Content
                                        </label>
                                        <textarea
                                            name="message"
                                            rows="4"
                                            onFocus={() => setFocusedField('message')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full h-full bg-slate-50 border-2 border-slate-200 rounded-xl md:rounded-2xl px-4 pt-6 md:pt-8 pb-2 md:pb-3 font-bold text-sm md:text-base text-slate-700 
                                                     focus:outline-none focus:bg-blue-50/30 focus:border-blue-400 transition-all resize-none min-h-[100px] md:min-h-[120px]"
                                            placeholder="Describe your mission..."
                                        ></textarea>
                                    </div>

                                    <div className="pt-2 md:pt-4">
                                        <PlasticButton color="blue" className="w-full text-lg md:text-xl py-3 md:py-4 shadow-lg active:scale-95 transition-transform">
                                            SEND MESSAGE
                                        </PlasticButton>
                                    </div>

                                </form>
                            </div>

                        </div>
                    </motion.div>

                    {/* Plastic Card 'Feet' for the device (Desktop Only) */}
                    <div className="hidden md:flex justify-between px-16 -mt-6 relative z-0">
                        <div className="w-24 h-8 bg-slate-200 rounded-b-2xl shadow-md border-2 border-t-0 border-white"></div>
                        <div className="w-24 h-8 bg-slate-200 rounded-b-2xl shadow-md border-2 border-t-0 border-white"></div>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
};

export default Contact;
