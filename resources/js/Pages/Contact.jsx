import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import MainLayout from '../Layout/MainLayout';
import PlasticToast from '../UI/PlasticToast';

const contactChannels = [
    { label: 'Site Center', symbol: 'SC', value: 'panzekyuv@gmail.com' },
    { label: 'Coordinates', symbol: 'ID', value: 'Jakarta, Indonesia' },
    { label: 'Turnaround', symbol: '48', value: 'Reply in 1-2 days' },
];

const Animated3DTitle = ({ text }) => {
    // Volcanic/Genting specific palette
    const palette3D = [
        { front: '#ffdd44', drop: '#b08a11' }, // BRIGHT SUN YELLOW
        { front: '#ff9c3a', drop: '#d17215' }, // HOT ORANGE
        { front: '#ff6b35', drop: '#c84313' }, // FIERY ORANGE
        { front: '#e64a19', drop: '#9b2c00' }, // RUST ORANGE
        { front: '#f44336', drop: '#aa2e25' }, // RED
    ];

    const generate3DShadow = (dropColor) => `
        0 1px 0 ${dropColor},
        0 2px 0 ${dropColor},
        0 3px 0 ${dropColor},
        0 4px 0 ${dropColor},
        0 5px 0 ${dropColor},
        0 6px 0 ${dropColor},
        0 7px 0 ${dropColor},
        0 8px 0 ${dropColor},
        0 15px 15px rgba(0,0,0,0.5)
    `;

    const words = text.split(' ');
    let globalIndex = 0;

    return (
        <h2 className="flex flex-wrap gap-4 md:gap-7 items-center justify-center">
            {words.map((word, wIdx) => (
                <div key={wIdx} className="flex pb-4">
                    {word.split('').map((char, cIdx) => {
                        const idx = globalIndex++;
                        const colorSet = palette3D[idx % palette3D.length];
                        
                        return (
                            <motion.span
                                key={idx}
                                className="block text-5xl md:text-6xl lg:text-[5.5rem] font-black uppercase"
                                style={{
                                    color: colorSet.front,
                                    textShadow: generate3DShadow(colorSet.drop),
                                    marginLeft: char === 'I' ? '0.2rem' : '0.1rem',
                                    marginRight: char === 'I' ? '0.2rem' : '0.1rem'
                                }}
                                animate={{ y: [0, -12, 0] }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: idx * 0.1,
                                }}
                            >
                                {char}
                            </motion.span>
                        );
                    })}
                </div>
            ))}
        </h2>
    );
};

const InputField = ({ label, name, type = 'text', value, onChange, error, isTextArea }) => {
    const [focused, setFocused] = useState(false);
    return (
        <div className="relative mb-8 w-full group">
            <label className={`absolute left-4 transition-all duration-300 pointer-events-none z-10 font-bold uppercase tracking-widest ${
                focused || value 
                ? '-top-3 text-[10px] text-[#ffb071] bg-[#100906] px-3 py-0.5 rounded-full shadow-[0_4px_6px_rgba(0,0,0,0.8)] border border-[#4a2215]' 
                : 'top-5 text-[11px] text-[#8a4e35]'
            }`}>
                {label}
            </label>
            {isTextArea ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="w-full rounded-[1.2rem] border-[2px] border-[#30160d] bg-[#0a0503] p-5 pt-6 text-sm font-semibold text-[#ffd6b0] outline-none transition-all focus:border-[#e04a1b] focus:bg-[#150703] shadow-[inset_0_10px_20px_rgba(0,0,0,0.95),0_2px_0_rgba(255,255,255,0.03)] focus:shadow-[inset_0_10px_20px_rgba(0,0,0,0.95),0_0_20px_rgba(224,74,27,0.3)] min-h-[160px] resize-y"
                    style={{ textShadow: focused ? '0 0 10px rgba(255,176,113,0.5)' : 'none' }}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className="w-full rounded-[1.2rem] border-[2px] border-[#30160d] bg-[#0a0503] p-5 pt-6 text-sm font-semibold text-[#ffd6b0] outline-none transition-all focus:border-[#e04a1b] focus:bg-[#150703] shadow-[inset_0_10px_20px_rgba(0,0,0,0.95),0_2px_0_rgba(255,255,255,0.03)] focus:shadow-[inset_0_10px_20px_rgba(0,0,0,0.95),0_0_20px_rgba(224,74,27,0.3)]"
                    style={{ textShadow: focused ? '0 0 10px rgba(255,176,113,0.5)' : 'none' }}
                />
            )}
            {error && <p className="absolute -bottom-5 left-3 text-[10px] font-black uppercase tracking-wider text-[#ff3333] drop-shadow-[0_0_5px_rgba(255,51,51,0.8)]">{error}</p>}
        </div>
    );
};

const BentoModule = ({ children, delay = 0, className = "" }) => (
    <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full rounded-[2.5rem] bg-[linear-gradient(145deg,#d26841_0%,#9e3e20_100%)] p-2 sm:p-4 shadow-[0_35px_80px_rgba(15,5,0,0.8),inset_0_4px_10px_rgba(255,188,150,0.5),inset_0_-8px_15px_rgba(100,20,5,0.6)] border border-[#e5825a]/50 ${className}`}
    >
        <div className="pointer-events-none absolute inset-x-12 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffeedd]/50 to-transparent" />
        
        <div className="relative h-full rounded-[2rem] bg-[#100704] border-t-2 border-b-[4px] border-l-2 border-r-2 border-[#000000] p-6 lg:p-10 overflow-hidden flex flex-col justify-center shadow-[inset_0_20px_50px_rgba(0,0,0,1)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,108,67,0.15)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuNCIvPgo8cmVjdCB4PSIxIiB5PSIxIiB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPC9zdmc+')] pointer-events-none opacity-50" />
            
            <div className="relative z-20 w-full h-full flex flex-col">
                {children}
            </div>
        </div>
    </motion.div>
);

const Contact = ({ page }) => {
    const [formData, setFormData] = useState(() => ({
        name: '',
        email: '',
        message: '',
        company: '',
        form_started_at: Math.floor(Date.now() / 1000),
    }));
    const [formErrors, setFormErrors] = useState({});
    const [submitState, setSubmitState] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const csrf = typeof document !== 'undefined' ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '' : '';

    const validateForm = () => {
        const nextErrors = {};
        if (!formData.name.trim()) nextErrors.name = 'Field ini wajib diisi.';
        if (!formData.email.trim()) {
            nextErrors.email = 'Field ini wajib diisi.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            nextErrors.email = 'Format email tidak sesuai.';
        }
        if (!formData.message.trim()) {
            nextErrors.message = 'Pesan wajib diisi.';
        } else if (formData.message.trim().length < 10) {
            nextErrors.message = 'Detailkan pesan sedikit lagi (min. 10 chars).';
        }
        return nextErrors;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(current => ({ ...current, [name]: value }));
        setFormErrors(current => {
            if (!current[name] && !current.form) return current;
            const nextErrors = { ...current };
            delete nextErrors[name];
            delete nextErrors.form;
            return nextErrors;
        });
        if (submitState?.type === 'error') setSubmitState(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = validateForm();
        if (Object.keys(nextErrors).length > 0) {
            setFormErrors(nextErrors);
            setSubmitState({
                type: 'error',
                message: 'Pengecekan formulir gagal. Pastikan semua kotak terisi dengan benar.',
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitState(null);
        setFormErrors({});

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    message: formData.message.trim(),
                    company: formData.company,
                    form_started_at: formData.form_started_at,
                }),
            });

            const contentType = response.headers.get('content-type') ?? '';
            const payload = contentType.includes('application/json') ? await response.json() : null;

            if (response.ok) {
                setFormData({
                    name: '', email: '', message: '', company: '',
                    form_started_at: Math.floor(Date.now() / 1000),
                });
                setSubmitState({
                    type: 'success',
                    message: payload?.message ?? 'Transmisi terkirim dengan sukses. Kami akan segera merespons.',
                });
                return;
            }

            if (response.status === 422 && payload?.errors) {
                const nextServerErrors = {};
                Object.entries(payload.errors).forEach(([key, messages]) => {
                    nextServerErrors[key] = Array.isArray(messages) ? messages[0] : messages;
                });
                setFormErrors(nextServerErrors);
                setSubmitState({
                    type: 'error',
                    message: payload.message ?? nextServerErrors.form ?? 'Validasi gagal sesuai dengan standar.',
                });
                return;
            }

            setSubmitState({
                type: 'error',
                message: payload?.message ?? 'Terjadi anomali saat pengiriman pesan. Coba lagi dalam beberapa saat.',
            });
        } catch (error) {
            setSubmitState({
                type: 'error',
                message: 'Komunikasi jaringan terputus. Silakan periksa koneksi Anda.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormIncomplete = !formData.name.trim() || !formData.email.trim() || !formData.message.trim();

    return (
        <MainLayout page={page} fullBleed>
            <div className="relative isolate min-h-screen overflow-x-hidden text-[#fff2e8] bg-[#29140c]">
                {submitState && (
                    <PlasticToast
                        message={submitState.message}
                        type={submitState.type}
                        onClose={() => setSubmitState(null)}
                    />
                )}

                {/* Base Background Ambient */}
                <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundColor: '#e04a1b',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='100' y1='33' x2='100' y2='-3'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='100' y1='135' x2='100' y2='97'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='%23bf3004' fill-opacity='0.65'%3E%3Crect x='100' width='100' height='100'/%3E%3Crect y='100' width='100' height='100'/%3E%3C/g%3E%3Cg fill-opacity='0.55'%3E%3Cpolygon fill='url(%23a)' points='100 30 0 0 200 0'/%3E%3Cpolygon fill='url(%23b)' points='100 100 0 130 0 100 200 100 200 130'/%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundSize: '100px 100px',
                        }}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,214,170,0.12),transparent_35%),linear-gradient(180deg,rgba(40,15,5,0.2)_0%,rgba(20,5,0,0.85)_100%)]" />
                    
                    {/* 2 Floating Cards - Adapted to the new theme */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        <motion.div 
                            initial={prefersReducedMotion ? { opacity: 0.15 } : { opacity: 0.15, y: 0 }}
                            animate={prefersReducedMotion ? {} : { y: [0, -30, 0], rotate: [-10, -12, -10] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[20%] left-[5%] md:left-[10%] opacity-30 blur-[3px]"
                        >
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] bg-gradient-to-br from-[#d46c43] to-[#802509] border-[3px] border-[#ffa37c]/20 shadow-[10px_15px_30px_rgba(0,0,0,0.6),inset_0_5px_15px_rgba(255,188,150,0.3)]" />
                        </motion.div>

                        <motion.div 
                            initial={prefersReducedMotion ? { opacity: 0.15 } : { opacity: 0.15, y: 0 }}
                            animate={prefersReducedMotion ? {} : { y: [0, 35, 0], rotate: [12, 15, 12] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-[20%] right-[3%] md:right-[8%] opacity-30 blur-[4px]"
                        >
                            <div className="w-40 h-40 md:w-64 md:h-64 rounded-[2.5rem] bg-gradient-to-tr from-[#9e3e20] to-[#501300] border-[2px] border-[#d26841]/20 shadow-[-10px_-15px_30px_rgba(0,0,0,0.7),inset_0_-5px_15px_rgba(200,60,20,0.4)]" />
                        </motion.div>
                    </div>
                </div>

                <div className="relative z-10 w-full max-w-[1300px] mx-auto min-h-screen px-4 py-24 sm:px-6 lg:px-8">
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                      
                      {/* Top Left: Title */}
                      <BentoModule delay={0.1} className="lg:col-span-7">
                         <div className="flex-grow flex flex-col items-center justify-center text-center py-6">
                             <div className="inline-flex items-center gap-3 rounded-full border border-[#d46c43]/40 bg-[#2d1b13]/80 px-4 py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-[#ffb071] shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(255,176,113,0.2)] mb-8">
                                 <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb071] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d46c43] border border-[#ffb071]"></span>
                                 </span>
                                 SADSA UPLINK COMMS
                             </div>

                             <Animated3DTitle text="SAY HELLO" />

                             <p className="mt-10 max-w-lg mx-auto text-[1rem] sm:text-[1.1rem] font-medium leading-relaxed text-[#f3d9ce]/70 text-center">
                                 Drop your inquiries, briefs, or just say hi. We are ready to transform your ideas into tangible realities. The system is online and ready for transmission.
                             </p>
                         </div>
                      </BentoModule>
                      
                      {/* Top Right: Info */}
                      <BentoModule delay={0.2} className="lg:col-span-5">
                         <div className="flex-grow flex flex-col justify-center gap-4 py-4">
                             {contactChannels.map((channel) => (
                                 <div key={channel.label} className="relative flex flex-col items-center text-center bg-[#150703]/30 px-6 py-6 rounded-[1.5rem] border border-[#30160d] hover:bg-[#1a0a04] transition-colors shadow-[inset_0_4px_10px_rgba(0,0,0,0.4)] overflow-hidden">
                                     <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#d46c43]/30 to-transparent" />
                                     <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#d46c43]">{channel.label}</p>
                                     <p className="text-[0.95rem] lg:text-base font-bold text-[#fff1e6] tracking-wide mt-2">{channel.value}</p>
                                 </div>
                             ))}
                         </div>
                      </BentoModule>
                      
                      {/* Bottom: The Form */}
                      <BentoModule delay={0.3} className="lg:col-span-12">
                          <form onSubmit={handleSubmit} className="w-full flex-grow flex flex-col justify-center py-4" noValidate>
                               <input type="hidden" name="_token" value={csrf} />
                               
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                   <InputField 
                                       label="Name / Alias" 
                                       name="name" 
                                       value={formData.name} 
                                       onChange={handleInputChange} 
                                       error={formErrors.name} 
                                   />
                                   <InputField 
                                       label="Secure Email" 
                                       name="email" 
                                       type="email"
                                       value={formData.email} 
                                       onChange={handleInputChange} 
                                       error={formErrors.email} 
                                   />
                               </div>
                               
                               <InputField 
                                   label="Transmission Protocol" 
                                   name="message" 
                                   isTextArea 
                                   value={formData.message} 
                                   onChange={handleInputChange} 
                                   error={formErrors.message} 
                               />

                               {formErrors.form && <p className="text-sm font-black text-[#ff3333] mb-4 drop-shadow-md text-center uppercase">{formErrors.form}</p>}

                               <div className="mt-8 mb-2 flex justify-end items-center border-t border-[#30160d] pt-8">
                                  <button 
                                       type="submit" 
                                       disabled={isSubmitting || isFormIncomplete}
                                       className="group relative w-full sm:w-auto min-w-[300px] overflow-hidden rounded-[1rem] bg-gradient-to-b from-[#e04a1b] to-[#9e3e20] px-10 py-5 text-[14px] font-black uppercase tracking-[0.3em] text-white shadow-[0_15px_30px_rgba(60,15,0,0.8),inset_0_4px_10px_rgba(255,200,150,0.6),inset_0_-4px_15px_rgba(100,20,5,0.7)] transition-all hover:brightness-125 active:translate-y-2 active:shadow-[0_5px_10px_rgba(60,15,0,0.8),inset_0_4px_10px_rgba(255,200,150,0.4),inset_0_-2px_10px_rgba(100,20,5,0.7)] disabled:opacity-50 disabled:pointer-events-none border border-[#ffa37c]/30"
                                   >
                                       <span className="relative z-10 flex items-center justify-center gap-3">
                                           {isSubmitting ? (
                                                <>
                                                    TRANSMITTING
                                                    <span className="h-4 w-4 animate-spin rounded-full border-[3px] border-[#ffb071]/30 border-t-[#ffb071]" />
                                                </>
                                           ) : 'INITIATE UPLINK'}
                                       </span>
                                       <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                   </button>
                               </div>
                           </form>
                      </BentoModule>
                   </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Contact;
