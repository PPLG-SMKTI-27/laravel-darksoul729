import React from 'react';

export default function MountainBackground() {
    return (
        <div className="absolute inset-x-0 bottom-[100px] top-0 pointer-events-none z-0 overflow-hidden flex items-end justify-center mix-blend-multiply opacity-80">
            {/* The mountains match the blue sky theme, creating atmospheric depth */}
            <svg 
                viewBox="0 0 1440 600" 
                className="w-[200vw] h-auto min-w-[1440px] md:w-full md:min-w-full drop-shadow-[0_-20px_40px_rgba(255,255,255,0.3)] select-none" 
                preserveAspectRatio="xMidYMax slice"
            >
                <defs>
                    <linearGradient id="mnt1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8cbced" />
                        <stop offset="100%" stopColor="#d8ecf8" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="mnt2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#5f9cd8" />
                        <stop offset="100%" stopColor="#8cbced" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="mnt3" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4387c6" />
                        <stop offset="100%" stopColor="#6ea6db" />
                    </linearGradient>
                    <linearGradient id="mnt4" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#2c72b8" />
                        <stop offset="100%" stopColor="#4a9ad4" />
                    </linearGradient>
                    <linearGradient id="mnt-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
                    </linearGradient>
                </defs>

                {/* Furthest Background Layer */}
                <path fill="url(#mnt1)" d="M0,600 L0,350 L120,400 L250,280 L400,380 L520,220 L680,350 L850,180 L1020,380 L1200,250 L1350,380 L1440,300 L1440,600 Z" />

                {/* Second Farthest Layer */}
                <path fill="url(#mnt2)" d="M0,600 L50,420 L180,320 L300,450 L480,260 L620,380 L750,220 L920,420 L1080,280 L1250,450 L1440,360 L1440,600 Z" />
                
                {/* Giant Majestic Central Peak */}
                <g>
                    {/* Shadow / Base */}
                    <path fill="url(#mnt3)" d="M150,600 L380,350 L580,120 L680,250 L780,80 L980,350 L1150,220 L1350,500 L1440,420 L1440,600 Z" />
                    {/* Highlight Side (Light from Left) */}
                    <path fill="url(#mnt-highlight)" d="M380,350 L580,120 L680,250 L780,80 L980,350 L1150,220 L1350,500 L1440,420 L1440,600 L150,600 Z" />
                </g>

                {/* Foreground Layer */}
                <path fill="url(#mnt4)" d="M0,600 L180,480 L350,550 L520,380 L700,520 L850,400 L1050,550 L1220,420 L1440,580 L1440,600 Z" />
                <path fill="url(#mnt-highlight)" d="M180,480 L350,550 L520,380 L700,520 L850,400 L1050,550 L1220,420 L1440,580 L1440,600 L0,600 Z" />
            </svg>
        </div>
    );
}
