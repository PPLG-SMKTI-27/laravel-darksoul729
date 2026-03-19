import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Html, useProgress } from '@react-three/drei';

const Robocop3D = React.lazy(() => import('./Robocop3D'));

class ModelErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <Html center>
                    <div className="w-56 rounded-[2rem] border-[3px] border-white/80 bg-white/70 p-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-md">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                            3D Model Error
                        </div>
                        <div className="mt-2 text-xs font-semibold text-slate-600">
                            Model belum bisa dimuat. Cek koneksi atau file 3D.
                        </div>
                    </div>
                </Html>
            );
        }

        return this.props.children;
    }
}

const PerformanceOptimizer = () => {
    const { gl, setFrameloop } = useThree();

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setFrameloop(entry.isIntersecting ? 'demand' : 'never');
        }, { threshold: 0.1 });

        if (gl.domElement.parentElement) {
            observer.observe(gl.domElement.parentElement);
        }

        return () => observer.disconnect();
    }, [gl, setFrameloop]);

    return null;
};

const CanvasLoader = () => {
    const { progress, active } = useProgress();
    const [showSlowNetwork, setShowSlowNetwork] = useState(false);

    useEffect(() => {
        if (!active) {
            setShowSlowNetwork(false);
            return undefined;
        }

        const timer = setTimeout(() => {
            setShowSlowNetwork(true);
        }, 2500);

        return () => clearTimeout(timer);
    }, [active]);

    return (
        <Html center>
            <div className="w-48 rounded-[2rem] border-[3px] border-white/80 bg-white/60 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300">
                <div className="relative mb-4 h-16 w-16 animate-pulse">
                    <div className="absolute inset-0 rounded-full border-4 border-yellow-200 border-t-yellow-500 animate-spin"></div>
                    <div
                        className="absolute inset-2 rounded-full border-4 border-orange-200 border-b-orange-500 animate-spin-reverse"
                        style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-orange-600">
                        {Math.floor(progress)}%
                    </span>
                </div>
                <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 shadow-inner">
                    <div
                        className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="mt-1 text-center text-[10px] font-bold uppercase tracking-widest text-orange-500">
                    Setting up Camp...
                </div>
                {showSlowNetwork && (
                    <div className="mt-2 text-center text-[10px] font-semibold text-slate-600">
                        Koneksi lambat, model 3D masih loading.
                    </div>
                )}
            </div>
        </Html>
    );
};

const LandingHeroScene = ({ isMobile, renderSettings }) => {
    return (
        <Canvas
            camera={{ position: [0, 0.5, 7], fov: 50 }}
            dpr={renderSettings.dpr}
            frameloop="demand"
            gl={{
                powerPreference: renderSettings.powerPreference,
                antialias: renderSettings.antialias,
            }}
        >
            <PerformanceOptimizer />
            <Suspense fallback={<CanvasLoader />}>
                <ambientLight intensity={1.6} />
                <directionalLight position={[5, 10, 5]} intensity={2.8} castShadow />
                <pointLight position={[-5, 5, -5]} intensity={1.0} color="#ffffff" />
                <pointLight position={[3, 2, 3]} intensity={0.6} color="#ffeedd" />

                <group position={isMobile ? [0, -0.5, 0] : [0.6, -0.3, 0]}>
                    <ModelErrorBoundary>
                        <Robocop3D
                            scale={isMobile ? 2.8 : 3.0}
                            position={[0, 0, 0]}
                            rotation={[0, Math.PI / 5, 0]}
                        />
                    </ModelErrorBoundary>
                </group>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={false}
                />
            </Suspense>
        </Canvas>
    );
};

export default LandingHeroScene;
