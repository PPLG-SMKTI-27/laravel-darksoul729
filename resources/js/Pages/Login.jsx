import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PlasticCard from '../UI/PlasticCard';
import PlasticButton from '../UI/PlasticButton';
import Robot3D from '../components/3D/Robot3D';

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
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
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
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">

            {/* AMBIENT BACKGROUND */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-pink-50 -z-20"></div>
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] -z-10"></div>

            {/* FLOATING SHAPES */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>

            {/* BACK BUTTON */}
            <div className="absolute top-6 left-6 z-50">
                <button
                    onClick={() => window.location.href = '/'}
                    className="group flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md text-slate-600 font-black rounded-full border-2 border-white shadow-sm hover:scale-105 transition-all"
                >
                    <span className="text-lg">↩</span> Return to Shop
                </button>
            </div>

            {/* MAIN WIDE CARD CONTAINER - COLLECTOR'S BOX STYLE */}
            <div className="w-full max-w-5xl perspective-1000">
                <PlasticCard color="pink" title="MEMBER EXCLUSIVE SET" className="w-full">
                    <div className="flex flex-col md:flex-row min-h-[500px]">

                        {/* LEFT: ROBOT SHOWCASE (The 'Product') */}
                        <div className="w-full md:w-1/2 bg-gradient-to-b from-blue-50 to-blue-100/50 relative overflow-hidden flex flex-col items-center justify-center p-8 border-b-4 md:border-b-0 md:border-r-4 border-dashed border-slate-200/60">
                            {/* Product Badge */}
                            <div className="absolute top-6 left-6 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-md shadow-sm transform -rotate-2 border border-yellow-200 z-10">
                                LIMITED EDITION
                            </div>

                            {/* 3D Scene */}
                            <div className="relative w-full h-[300px] md:h-full min-h-[300px]">
                                <Canvas
                                    dpr={1}
                                    frameloop="demand"
                                    camera={{ position: [0, 0.5, 6], fov: 40 }}
                                    className="bg-transparent"
                                    shadows={false}
                                >
                                    <Suspense fallback={null}>
                                        <ambientLight intensity={1.4} />
                                        <directionalLight position={[5, 10, 5]} intensity={2} />
                                        <pointLight position={[-5, 5, -5]} intensity={1} color="#3b82f6" />
                                        <group position={[0, -1.3, 0]}>
                                            <Robot3D scale={1.5} />
                                        </group>
                                        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
                                    </Suspense>
                                </Canvas>
                            </div>

                            {/* Decorative Nameplate */}
                            <div className="mt-4 text-center">
                                <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
                                    Security Bot
                                </h3>
                                <p className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase mt-1">
                                    Series 1 • Gatekeeper
                                </p>
                            </div>
                        </div>

                        {/* RIGHT: LOGIN FORM (The 'Manual/Access') */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
                            {/* Pattern Overlay */}
                            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>

                            <div className="relative z-10 max-w-sm mx-auto w-full">
                                <div className="mb-8 text-center md:text-left">
                                    <h2 className="text-2xl font-black text-slate-800 mb-2">ACCESS TERMINAL</h2>
                                    <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                        Welcome, Collector. Please verify your identity to access the archives.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Email Field */}
                                    <div className="group">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                            Authorized ID
                                        </label>
                                        <div className="relative transition-transform duration-200 focus-within:scale-[1.02]">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-slate-50 text-slate-800 font-bold p-4 pl-12 rounded-xl border-2 border-slate-200 outline-none focus:border-pink-400 focus:bg-white shadow-sm transition-colors"
                                                placeholder="user@system.dev"
                                                required
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl grayscale opacity-50 group-focus-within:grayscale-0 group-focus-within:opacity-100 transition-all">
                                                📧
                                            </div>
                                        </div>
                                        {errors.email && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.email}</p>}
                                    </div>

                                    {/* Password Field */}
                                    <div className="group">
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                            Access Code
                                        </label>
                                        <div className="relative transition-transform duration-200 focus-within:scale-[1.02]">
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-slate-50 text-slate-800 font-bold p-4 pl-12 rounded-xl border-2 border-slate-200 outline-none focus:border-pink-400 focus:bg-white shadow-sm transition-colors tracking-widest"
                                                placeholder="••••••"
                                                required
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl grayscale opacity-50 group-focus-within:grayscale-0 group-focus-within:opacity-100 transition-all">
                                                🔐
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <PlasticButton
                                            color="blue"
                                            type="submit"
                                            className="w-full py-4 rounded-xl text-lg shadow-md hover:shadow-lg hover:-translate-y-1"
                                            disabled={processing}
                                        >
                                            {processing ? 'VERIFYING...' : 'INITIATE SESSION'}
                                        </PlasticButton>
                                    </div>
                                </form>

                                <div className="mt-8 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
                                    <span>ToyLogic Systems</span>
                                    <span>SECURE CONN</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </PlasticCard>
            </div>
        </div>
    );
};


export default Login;
