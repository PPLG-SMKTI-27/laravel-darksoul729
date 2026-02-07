import React, { useState } from 'react';
import PlasticCard from '../UI/PlasticCard';
import PlasticButton from '../UI/PlasticButton';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
            const csrfToken = csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : '';

            const response = await fetch('/login', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.redirected) {
                const redirectUrl = new URL(response.url);

                if (redirectUrl.pathname === '/login') {
                    setErrors({ email: 'Invalid credentials.' });
                    return;
                }

                window.location.href = response.url;
                return;
            }

            const contentType = response.headers.get('content-type') || '';
            const data = contentType.includes('application/json')
                ? await response.json().catch(() => ({}))
                : {};

            if (response.ok) {
                localStorage.setItem('plastic_flash', JSON.stringify({ message: 'Welcome back, Commander!', type: 'success' }));
                window.location.href = '/dashboard';
            } else {
                setErrors(data.errors || { email: 'Invalid credentials.' });
            }
        } catch (error) {
            setErrors({ email: 'System error. Try again.' });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">

            {/* DESKTOP ONLY: LIQUID WAVE BACKGROUND */}
            <div className="hidden md:block absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                {/* Wave 1 - Back */}
                <div className="absolute bottom-[-10vh] left-0 w-[200%] h-[50vh] opacity-30 animate-wave-slow">
                    <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-blue-300">
                        <path fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>

                {/* Wave 2 - Middle */}
                <div className="absolute bottom-[-15vh] right-0 w-[200%] h-[60vh] opacity-40 animate-wave-medium" style={{ animationDelay: '-5s' }}>
                    <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-purple-300">
                        <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>

                {/* Wave 3 - Front */}
                <div className="absolute bottom-[-20vh] left-[-50%] w-[200%] h-[60vh] opacity-20 animate-wave-fast" style={{ animationDelay: '-2s' }}>
                    <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-blue-400">
                        <path fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,154.7C384,128,480,96,576,117.3C672,139,768,213,864,234.7C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>

            <style>{`
                @keyframes wave {
                    0% { transform: translateX(0); }
                    50% { transform: translateX(-25%); }
                    100% { transform: translateX(0); }
                }
                .animate-wave-slow { animation: wave 25s ease-in-out infinite; }
                .animate-wave-medium { animation: wave 18s ease-in-out infinite; }
                .animate-wave-fast { animation: wave 12s ease-in-out infinite; }
            `}</style>

            {/* BACK BUTTON */}
            <div className="absolute top-6 left-6 z-50">
                <button
                    onClick={() => window.location.href = '/'}
                    className="group flex items-center gap-2 px-5 py-2.5 bg-white text-slate-600 font-black rounded-xl border-2 border-slate-200 shadow-[0_4px_0_#cbd5e1] active:shadow-none active:translate-y-1 transition-all"
                >
                    <span className="text-lg">↩</span>
                    <span className="hidden md:inline">Return</span>
                </button>
            </div>

            {/* MAIN LOGIN CONTAINER */}
            <div className="w-full max-w-4xl relative z-10">
                <PlasticCard color="blue" title="USER AUTH" className="w-full">
                    <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden min-h-[500px]">

                        {/* LEFT: DECORATIVE PANEL (CSS ONLY - NO HEAVY 3D) */}
                        <div className="w-full md:w-5/12 bg-blue-50 p-8 flex flex-col justify-between relative overflow-hidden">
                            {/* Abstract Shapes */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-bl-[4rem] opacity-50"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200 rounded-tr-[3rem] opacity-50"></div>

                            <div className="relative z-10">
                                <h2 className="text-4xl font-black text-slate-800 leading-[0.9]">
                                    WELCOME <br />
                                    <span className="text-blue-500">BACK!</span>
                                </h2>
                                <p className="mt-4 text-slate-500 font-bold text-sm">
                                    Access your dashboard to manage projects and settings.
                                </p>
                            </div>

                            <div className="relative z-10 mt-8 hidden md:block">
                                {/* CSS Illustration of a Key or Lock */}
                                <div className="w-24 h-24 bg-white rounded-2xl border-4 border-slate-200 shadow-xl flex items-center justify-center mx-auto transform rotate-6">
                                    <div className="text-4xl">🔐</div>
                                </div>
                            </div>

                            <div className="mt-auto relative z-10 hidden md:block">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                                    System v3.0
                                </p>
                            </div>
                        </div>

                        {/* RIGHT: LOGIN FORM */}
                        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 text-slate-800 font-bold p-4 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:bg-white outline-none transition-colors"
                                        placeholder="user@example.com"
                                        required
                                    />
                                    {errors.email && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 text-slate-800 font-bold p-4 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:bg-white outline-none transition-colors"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <div className="pt-4">
                                    <PlasticButton
                                        color="blue"
                                        type="submit"
                                        className="w-full py-4 text-lg shadow-md active:scale-95 transition-transform"
                                        disabled={processing}
                                    >
                                        {processing ? 'Logging In...' : 'LOG IN'}
                                    </PlasticButton>
                                </div>
                            </form>
                        </div>

                    </div>
                </PlasticCard>
            </div>

        </div>
    );
};

export default Login;
