import React, { useLayoutEffect, useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import MainLayout from '../Layout/MainLayout';
import PlasticCard from '../UI/PlasticCard';
import PlasticButton from '../UI/PlasticButton';
// Lazy load Robot3D
const Robot3D = React.lazy(() => import('../components/3D/Robot3D'));
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Helper to pause rendering when offscreen
const PerformanceOptimizer = () => {
    const { gl, setFrameloop } = useThree();
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            // When visible, run animation loop. When hidden, stop it.
            setFrameloop(entry.isIntersecting ? 'always' : 'never');
        }, { threshold: 0.1 });

        if (gl.domElement.parentElement) {
            observer.observe(gl.domElement.parentElement);
        }

        return () => observer.disconnect();
    }, [gl, setFrameloop]);
    return null;
};

const LandingPage = ({ page, props }) => {
    const { repos = [] } = props;
    const comp = useRef();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Hero Text Animation
            gsap.from('.hero-text', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'back.out(1.7)'
            });

            // Robot Entrance (Scale up)
            gsap.from('.hero-robot', {
                scale: 0,
                opacity: 0,
                duration: 1.2,
                ease: 'elastic.out(1, 0.5)',
                delay: 0.2
            });

            // Feature Cards Animation
            gsap.from('.feature-card', {
                scrollTrigger: {
                    trigger: '.features-section',
                    start: 'top 80%',
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power2.out'
            });

            // Projects Animation
            gsap.from('.project-card', {
                scrollTrigger: {
                    trigger: '.projects-section',
                    start: 'top 75%',
                },
                y: 80,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'elastic.out(1, 0.8)'
            });
        }, comp);
        return () => ctx.revert();
    }, []);

    const features = [
        {
            title: "JavaScript",
            desc: "Modern ES6+, React, Node.js, and TypeScript for dynamic web applications.",
            icon: "/images/javascript_toy.webp",
            color: "blue"
        },
        {
            title: "PHP",
            desc: "Laravel, MySQL, RESTful APIs, and backend development expertise.",
            icon: "/images/php_toy.webp",
            color: "pink"
        },
        {
            title: "Python",
            desc: "Data processing, automation, scripting, and backend development.",
            icon: "/images/python_toy.webp",
            color: "green"
        },
        {
            title: "SQL",
            desc: "Database design, complex queries, and data integrity optimization.",
            icon: "/images/sql_toy.webp",
            color: "yellow"
        },
        {
            title: "Git",
            desc: "Version control, team collaboration, and repository management.",
            icon: "/images/git_toy.webp",
            color: "orange"
        }
    ];

    return (
        <MainLayout page={page}>
            <div ref={comp} className="flex flex-col gap-24 pb-20">

                {/* HERO SECTION: 2-Column Layout */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-6 md:pt-12 max-w-7xl mx-auto w-full px-4">

                    {/* Left: Text Content */}
                    {/* Left: Text Content */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left z-10 w-full md:w-1/2">
                        <span className="hero-text inline-block px-4 py-1 mb-4 bg-yellow-300 text-yellow-800 font-black rounded-full text-xs md:text-sm uppercase tracking-widest border-2 border-yellow-400 transform -rotate-2">
                            Available for Hire 2026
                        </span>
                        <h1 className="hero-text font-black tracking-tighter mb-6 leading-[0.85] select-none">
                            <span className="block text-[3.5rem] sm:text-[4rem] md:text-[6.5rem] lg:text-[7.5rem] text-white drop-shadow-xl"
                                style={{ textShadow: "0 4px 0 #cbd5e1, 0 8px 0 #94a3b8, 0 12px 0 #64748b, 0 16px 0 #475569, 0 20px 20px rgba(0,0,0,0.2)" }}>
                                KEVIN
                            </span>
                            <span className="block text-[2.5rem] sm:text-[3rem] md:text-[5rem] lg:text-[6rem] text-yellow-400 drop-shadow-xl scale-y-95 origin-top"
                                style={{ textShadow: "0 4px 0 #fcd34d, 0 8px 0 #fbbf24, 0 12px 0 #d97706, 0 16px 0 #b45309, 0 20px 20px rgba(0,0,0,0.2)" }}>
                                HERMANSYAH
                            </span>
                        </h1>
                        <p className="hero-text text-lg sm:text-xl md:text-2xl font-bold text-slate-400 mb-10 max-w-lg leading-relaxed">
                            Full-stack developer crafting exceptional digital experiences.
                            <span className="block text-slate-500 mt-2">Let's build something amazing together!</span>
                        </p>
                        <div className="hero-text flex flex-wrap justify-center md:justify-start gap-4 scale-100 md:scale-110 origin-top-left">
                            <PlasticButton color="blue" onClick={() => window.location.href = '/projects'}>
                                View Projects
                            </PlasticButton>
                            <PlasticButton color="yellow" onClick={() => window.location.href = '/contact'}>
                                Hire Creator
                            </PlasticButton>
                        </div>
                    </div>

                    {/* Right: 3D Robot Showcase */}
                    <div ref={comp} className="hero-robot order-first md:order-none relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[550px] md:h-[550px] flex-shrink-0 z-20">
                        {/* Glow Effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-blue-400/30 rounded-full blur-[80px] pointer-events-none"></div>

                        <Canvas
                            dpr={[1, 1.5]} // Performance: Dynamic dpr, capped at 1.5 for sharper look on mobile without killing battery
                            frameloop="always" // We'll rely on the fact that when this component unmounts/is hidden, it stops. 
                        // Actually, "always" is better for the smooth idle animations unless we specifically hook up an intersection observer to the Canvas props. 
                        // But for now, let's keep it simple and performant. The user asked for "framedloop demand" logic in the plan, let's stick to that if possible or optimize.
                        // Actually, for continuous animation like the robot's idle movement, "always" is needed when visible.
                        // Optimization: We can toggle this based on visibility.
                        >
                            <PerformanceOptimizer />
                            <Suspense fallback={null}>
                                <ambientLight intensity={1.4} />
                                <directionalLight position={[5, 10, 5]} intensity={2.5} />
                                <pointLight position={[-5, 5, -5]} intensity={1.2} color="#ff6b9d" />

                                <group position={isMobile ? [0, -1.2, 0] : [0.8, -1.0, 0]}>
                                    <Robot3D scale={isMobile ? 1.2 : 1.35} />
                                </group>

                                <OrbitControls
                                    enableZoom={false}
                                    enablePan={false}
                                    minPolarAngle={Math.PI / 4}
                                    maxPolarAngle={Math.PI / 1.6}
                                />
                            </Suspense>
                        </Canvas>
                    </div>
                </div>

                {/* FEATURES / TOY SPECS SECTION */}
                <div className="features-section max-w-6xl mx-auto w-full px-4 mt-8">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-1 flex-grow bg-slate-200 rounded-full"></div>
                        <h2 className="text-3xl font-black text-slate-300 uppercase tracking-widest">Languages & Tech</h2>
                        <div className="h-1 flex-grow bg-slate-200 rounded-full"></div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8">
                        {features.map((feat, i) => (
                            <div key={i} className="feature-card w-full md:w-[30%] h-full">
                                <PlasticCard color={feat.color} title={feat.title} isNew={i >= 3} className="h-full">
                                    <div className="p-6 text-center flex flex-col items-center h-full">
                                        <div className="mb-6 bg-white/50 w-32 h-32 flex items-center justify-center rounded-2xl border-4 border-white/40 shadow-sm overflow-hidden transform hover:scale-110 transition-transform duration-300">
                                            <img src={feat.icon} alt={feat.title} className="w-28 h-28 object-contain drop-shadow-sm" />
                                        </div>
                                        <p className="font-bold text-slate-500 leading-snug flex-grow">
                                            {feat.desc}
                                        </p>
                                    </div>
                                </PlasticCard>
                            </div>
                        ))}
                    </div>
                </div>

                {/* NEW ARRIVALS PREVIEW */}
                <div className="projects-section max-w-6xl mx-auto w-full px-4">
                    <div className="flex justify-between items-end mb-12 px-2">
                        <div className="relative">
                            <h2 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight leading-none">
                                Featured <br />
                                <span className="
                                    text-pink-500 inline-block mt-2
                                " style={{
                                        textShadow: `
                                        0 1px 0 #db2777,
                                        0 2px 0 #db2777,
                                        0 3px 0 #db2777,
                                        0 4px 0 #be185d,
                                        0 5px 0 #be185d,
                                        0 6px 0 #be185d,
                                        0 7px 12px rgba(0,0,0,0.2)
                                    `,
                                        WebkitTextStroke: '2px white',
                                        paintOrder: 'stroke fill'
                                    }}>PROJECTS</span>
                            </h2>
                            <div className="absolute -top-6 -right-12 rotate-12 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wide border-2 border-white">
                                Collectors Edition
                            </div>
                        </div>
                        <a href="/projects" className="hidden md:block text-pink-500 font-black hover:underline decoration-4 underline-offset-4 text-lg">
                            See Collection &rarr;
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {repos.slice(0, 3).map((repo, index) => (
                            <div
                                key={repo.id || index}
                                onClick={() => window.location.href = `/project?id=${repo.id}`}
                                className="project-card cursor-pointer group relative"
                            >
                                <div className="absolute -inset-2 bg-gradient-to-r from-blue-200 to-pink-200 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></div>
                                <PlasticCard
                                    color={['blue', 'pink', 'green'][index % 3]}
                                    title={repo.title || 'Mystery Box'}
                                    className="transform transition-all duration-300 group-hover:-translate-y-4 group-hover:rotate-1"
                                >
                                    <div className="relative aspect-[4/5] bg-gradient-to-b from-slate-50 to-white rounded-lg flex items-center justify-center p-6 overflow-hidden">
                                        {/* Background Pattern */}
                                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#4a5568_1px,transparent_1px)] [background-size:16px_16px]"></div>

                                        {repo.image_url ? (
                                            <img
                                                src={repo.image_url.startsWith('http') ? repo.image_url : `/storage/${repo.image_url}`}
                                                className="w-full h-full object-contain drop-shadow-xl transform transition-transform duration-500 group-hover:scale-110"
                                                alt={repo.title}
                                            />
                                        ) : (
                                            <span className="text-7xl animate-bounce">🎁</span>
                                        )}

                                        {/* Overlay Button */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-white text-slate-900 font-black px-6 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 border-2 border-slate-100">
                                                OPEN BOX
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center px-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Series 0{index + 1}</span>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className={`w-2 h-2 rounded-full ${i < 4 ? 'bg-yellow-400' : 'bg-slate-200'}`}></div>
                                            ))}
                                        </div>
                                    </div>
                                </PlasticCard>
                            </div>
                        ))}
                        {repos.length === 0 && (
                            <div className="col-span-3 text-center py-20 bg-white/50 rounded-[3rem] border-4 border-dashed border-slate-300 flex flex-col items-center justify-center gap-4">
                                <span className="text-6xl">🚧</span>
                                <p className="font-bold text-slate-400 text-2xl">New projects being manufactured...</p>
                            </div>
                        )}
                    </div>
                    <div className="md:hidden mt-8 text-center">
                        <a href="/projects" className="text-pink-500 font-black hover:underline decoration-4 underline-offset-4 text-lg">
                            See All Collection &rarr;
                        </a>
                    </div>
                </div>

                {/* CALL TO ACTION BANNER */}
                {/* CALL TO ACTION BANNER */}
                {/* CALL TO ACTION BANNER */}
                <div className="max-w-4xl mx-auto w-full px-4 mb-20">
                    <style>{`
                        @keyframes wave {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        @keyframes rise {
                            0% { bottom: -20px; transform: translateX(0) scale(0.5); opacity: 0; }
                            50% { opacity: 1; }
                            100% { bottom: 100%; transform: translateX(20px) scale(1); opacity: 0; }
                        }
                        .wave-layer {
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            width: 200%;
                            height: 100%;
                            background-repeat: repeat-x;
                            background-position: bottom;
                            background-size: 50% auto;
                            animation: wave linear infinite;
                            z-index: 0;
                        }
                        .bubble {
                            position: absolute;
                            background: rgba(255,255,255,0.4);
                            border-radius: 50%;
                            z-index: 5;
                        }
                    `}</style>
                    <div className="relative bg-white rounded-[3rem] p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden group border-4 border-slate-100 ring-4 ring-slate-50 ring-offset-4 ring-offset-white">

                        {/* Glass Container Inner Shadow */}
                        <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_10px_20px_rgba(0,0,0,0.05)] pointer-events-none z-20"></div>

                        {/* Liquid/Wave Background Layers */}
                        {/* Wave Layers */}
                        {/* Layer 1 - Back - Lightest - Slow */}
                        <div className="wave-layer" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23fce7f3' fill-opacity='1' d='M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
                            animationDuration: '20s',
                            opacity: 1,
                            height: '110%',
                            zIndex: 1
                        }}></div>

                        {/* Layer 2 - Middle - Medium Pink - Medium Speed */}
                        <div className="wave-layer" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23f472b6' fill-opacity='0.8' d='M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
                            animationDuration: '15s',
                            animationDirection: 'reverse',
                            opacity: 1,
                            height: '100%',
                            zIndex: 2
                        }}></div>

                        {/* Layer 3 - Front - Bold Pink - Fast */}
                        <div className="wave-layer" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23db2777' fill-opacity='1' d='M0,128L48,144C96,160,192,192,288,192C384,192,480,160,576,138.7C672,117,768,107,864,122.7C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
                            animationDuration: '10s',
                            opacity: 1,
                            height: '90%',
                            zIndex: 3
                        }}></div>

                        {/* Rising Bubbles */}
                        <div className="bubble w-4 h-4 left-[20%]" style={{ animation: 'rise 4s infinite ease-in', animationDelay: '0s' }}></div>
                        <div className="bubble w-6 h-6 left-[50%]" style={{ animation: 'rise 6s infinite ease-in', animationDelay: '1s' }}></div>
                        <div className="bubble w-3 h-3 left-[70%]" style={{ animation: 'rise 5s infinite ease-in', animationDelay: '2.5s' }}></div>
                        <div className="bubble w-5 h-5 left-[35%]" style={{ animation: 'rise 7s infinite ease-in', animationDelay: '4s' }}></div>
                        <div className="bubble w-4 h-4 left-[80%]" style={{ animation: 'rise 5s infinite ease-in', animationDelay: '0.5s' }}></div>

                        {/* Texture Overlay (Subtle on white) */}
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-[0.03] z-0 pointer-events-none"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 tracking-tight">
                                Ready to <span className="text-pink-600">Collaborate?</span>
                            </h2>
                            <p className="text-slate-500 font-bold text-xl mb-8 max-w-lg mx-auto leading-relaxed">
                                Available for freelance projects and full-time opportunities. Let's create something extraordinary together!
                            </p>
                            <PlasticButton color="yellow" className="text-lg px-10 py-4 shadow-xl ring-4 ring-white/50" onClick={() => window.location.href = '/contact'}>
                                GET IN TOUCH
                            </PlasticButton>
                        </div>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
};

export default LandingPage;