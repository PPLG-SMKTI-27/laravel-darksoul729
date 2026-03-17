import React from 'react';

const createSeededRandom = (seed) => {
    let value = seed;

    return () => {
        value = (value * 16807) % 2147483647;

        return (value - 1) / 2147483646;
    };
};

const createStars = (count, seed) => {
    const random = createSeededRandom(seed);

    return Array.from({ length: count }, (_, index) => ({
        id: `star-${seed}-${index}`,
        left: `${random() * 100}%`,
        top: `${random() * 100}%`,
        size: `${random() * 2.1 + 1}px`,
        opacity: random() * 0.7 + 0.2,
        duration: `${random() * 5 + 4}s`,
        delay: `${random() * 3}s`,
    }));
};

const createNebulaDots = (count, seed) => {
    const random = createSeededRandom(seed);

    return Array.from({ length: count }, (_, index) => ({
        id: `dust-${seed}-${index}`,
        left: `${random() * 100}%`,
        top: `${random() * 100}%`,
        size: `${random() * 10 + 6}px`,
        opacity: random() * 0.18 + 0.08,
        duration: `${random() * 10 + 10}s`,
        delay: `${random() * 4}s`,
    }));
};

const stars = createStars(42, 23);
const nebulaDots = createNebulaDots(12, 71);

const SpaceBackground = () => {
    return (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <style>{`
                @keyframes skills-twinkle {
                    0%, 100% { opacity: 0.25; transform: scale(0.9); }
                    50% { opacity: 1; transform: scale(1.15); }
                }

                @keyframes skills-drift {
                    0%, 100% { transform: translate3d(0, 0, 0); }
                    50% { transform: translate3d(12px, -18px, 0); }
                }
            `}</style>

            <div className="absolute inset-0 bg-[#050816]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(89,118,255,0.18),transparent_18%),radial-gradient(circle_at_20%_24%,rgba(244,114,182,0.14),transparent_24%),radial-gradient(circle_at_82%_20%,rgba(96,165,250,0.16),transparent_24%),radial-gradient(circle_at_50%_55%,rgba(139,92,246,0.12),transparent_28%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b1027_0%,#070b1d_48%,#050816_100%)] opacity-95" />

            <div className="absolute -left-16 top-28 h-44 w-44 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,239,213,0.9),rgba(244,114,182,0.45)_45%,rgba(76,29,149,0.28)_100%)] opacity-80" />
            <div className="absolute left-20 top-[34rem] h-16 w-16 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.9),rgba(216,180,254,0.45)_50%,rgba(88,28,135,0.18)_100%)] opacity-80" />
            <div className="absolute right-12 top-24 h-52 w-52 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.75),rgba(96,165,250,0.4)_42%,rgba(30,64,175,0.28)_100%)] opacity-85" />
            <div className="absolute right-[24%] top-[20rem] h-28 w-28 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(96,165,250,0.5),rgba(37,99,235,0.5)_55%,rgba(15,23,42,0.15)_100%)] opacity-75" />
            <div className="absolute right-[22%] top-[21.7rem] h-12 w-40 rounded-full border-[6px] border-indigo-200/20 opacity-60" />

            <div className="absolute left-1/2 top-52 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-400/10 blur-[110px]" />
            <div className="absolute left-1/2 top-[24rem] h-96 w-[36rem] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[150px]" />
            <div className="absolute inset-x-0 top-[42rem] bottom-0 bg-[radial-gradient(circle_at_50%_14%,rgba(96,165,250,0.1),transparent_18%),radial-gradient(circle_at_22%_38%,rgba(167,139,250,0.08),transparent_22%),radial-gradient(circle_at_78%_60%,rgba(244,114,182,0.08),transparent_22%)]" />

            {stars.map((star) => (
                <span
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: star.left,
                        top: star.top,
                        width: star.size,
                        height: star.size,
                        opacity: star.opacity,
                        boxShadow: '0 0 10px rgba(255,255,255,0.55)',
                        animation: `skills-twinkle ${star.duration} ease-in-out ${star.delay} infinite`,
                    }}
                />
            ))}

            {nebulaDots.map((dot) => (
                <span
                    key={dot.id}
                    className="absolute rounded-full bg-sky-200/60 blur-[1px]"
                    style={{
                        left: dot.left,
                        top: dot.top,
                        width: dot.size,
                        height: dot.size,
                        opacity: dot.opacity,
                        animation: `skills-drift ${dot.duration} ease-in-out ${dot.delay} infinite`,
                    }}
                />
            ))}
        </div>
    );
};

export default SpaceBackground;
