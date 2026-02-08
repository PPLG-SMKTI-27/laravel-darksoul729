import React, { useLayoutEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import MainLayout from '../Layout/MainLayout';
import PlasticCard from '../UI/PlasticCard';
import PlasticButton from '../UI/PlasticButton';
const Robot3D = React.lazy(() => import('../components/3D/Robot3D'));

gsap.registerPlugin(ScrollTrigger);

const Projects = ({ page, props }) => {
    const { repos = [], project = null, name = 'Portfolio' } = props;
    const selectedProject = project || null;

    const comp = useRef();
    const headerRef = useRef();
    const robotRef = useRef();

    // Plastic colors to cycle through
    const colors = ['pink', 'yellow', 'green', 'blue'];

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            if (headerRef.current) {
                gsap.from(headerRef.current.children, {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "back.out(1.7)",
                    delay: 0.2
                });
            }

            gsap.utils.toArray('.project-card').forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                    },
                    y: 50,
                    scale: 0.9,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
        }, comp);
        return () => ctx.revert();
    }, []);

    return (
        <MainLayout page={page}>
            <div ref={comp} className="flex flex-col gap-12 md:gap-24 pb-20">

                {/* Hero Section */}
                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-8 pt-4 md:pt-12 max-w-7xl mx-auto w-full px-4">

                    {/* Text Content */}
                    <div ref={headerRef} className="flex flex-col items-center md:items-start text-center md:text-left z-10 w-full md:w-1/2">
                        <h1 className="
                            text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black 
                            text-blue-500
                            leading-[0.9] tracking-tighter mb-6
                            z-20 relative
                        " style={{
                                textShadow: `
                                0 1px 0 #2563eb,
                                0 2px 0 #2563eb,
                                0 3px 0 #2563eb,
                                0 4px 0 #2563eb,
                                0 5px 0 #1d4ed8,
                                0 6px 0 #1d4ed8,
                                0 7px 0 #1d4ed8,
                                0 8px 15px rgba(0,0,0,0.3)
                            `,
                                WebkitTextStroke: '3px white',
                                paintOrder: 'stroke fill'
                            }}>
                            Creative Collector<br />
                            <span className="text-yellow-400 inline-block mt-2" style={{
                                WebkitTextStroke: '3px white',
                                textShadow: `
                                    0 1px 0 #eab308,
                                    0 2px 0 #eab308,
                                    0 3px 0 #eab308,
                                    0 4px 0 #ca8a04,
                                    0 5px 0 #ca8a04,
                                    0 6px 10px rgba(0,0,0,0.2)
                                `
                            }}>& Developer</span>
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-500 mb-8 max-w-lg leading-snug">
                            A photo-realistic 3D plastic toy / collectible figure for your digital shelf.
                        </p>

                        <div className="flex gap-4 scale-100 md:scale-110 origin-left">
                            <PlasticButton color="pink" onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })}>
                                View Collection
                            </PlasticButton>
                            <PlasticButton color="green" onClick={() => window.location.href = '/about'}>
                                About Me
                            </PlasticButton>
                        </div>
                    </div>

                    {/* Robot Character 3D Canvas */}
                    <div ref={robotRef} className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] flex-shrink-0 z-20">
                        {/* Simple CSS Glow instead of heavy shader */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-blue-400/20 rounded-full blur-[60px] pointer-events-none"></div>

                        <Canvas
                            dpr={1} // Strict 1.0 Pixel Ratio for performance
                            camera={{ position: [0, 0, 6], fov: 45 }} // Fixed framing
                            className="bg-transparent"
                            style={{ width: '100%', height: '100%' }}
                            // Disable expensive features
                            shadows={false}
                        >
                            <Suspense fallback={null}>
                                <ambientLight intensity={1.2} />
                                <directionalLight position={[5, 10, 5]} intensity={2} />
                                <pointLight position={[-5, 5, -5]} intensity={1} color="#pink" />

                                <group position={[0, -1, 0]}>
                                    <Robot3D scale={1.2} />
                                    <ContactShadows
                                        position={[0, 0, 0]}
                                        opacity={0.4}
                                        scale={10}
                                        blur={2.5}
                                        far={4}
                                        color="#000000"
                                    />
                                </group>

                                <OrbitControls
                                    enableZoom={false}
                                    enablePan={false}
                                    autoRotate={true} // Keep rotation? User didn't complain about rotation specifically, just "heavy"
                                    autoRotateSpeed={1.5}
                                    minPolarAngle={Math.PI / 4}
                                    maxPolarAngle={Math.PI / 1.6}
                                />
                            </Suspense>
                        </Canvas>
                    </div>
                </div>

                {/* Grid Collection */}
                <div id="collection" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 max-w-7xl mx-auto w-full px-4">
                    {repos.map((repo, index) => {
                        const color = colors[index % colors.length];
                        const isNew = index < 3;

                        return (
                            <div
                                key={repo.id || index}
                                onClick={() => window.location.href = `/project?id=${repo.id}`}
                                className="cursor-pointer project-card"
                            >
                                <PlasticCard
                                    color={color}
                                    title={repo.title || `Toy Project ${index + 1}`}
                                    isNew={isNew}
                                >
                                    <div className="aspect-[4/5] flex items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-white rounded-lg group-hover:bg-blue-50 transition-colors">
                                        {repo.image_url ? (
                                            <img
                                                src={repo.image_url.startsWith('http') ? repo.image_url : `/storage/${repo.image_url}`}
                                                alt={repo.title}
                                                className="w-full h-full object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                                            />
                                        ) : (
                                            <div className="text-8xl animate-bounce">
                                                {['🤖', '🚀', '👾', '🎮'][index % 4]}
                                            </div>
                                        )}
                                    </div>
                                </PlasticCard>
                            </div>
                        );
                    })}
                </div>
            </div>
        </MainLayout>
    );
};

export default Projects;
