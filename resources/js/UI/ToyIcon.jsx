import React from 'react';

// Premium 3D Toy Icons - Beautiful & Content-Specific
const ToyIcon = ({ type, size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-10 h-10',
        md: 'w-14 h-14',
        lg: 'w-20 h-20',
        xl: 'w-28 h-28',
        '2xl': 'w-36 h-36'
    };

    const iconStyles = {
        // Dashboard - Analytics Chart Icon (BETTER!)
        dashboard: (
            <div className={`${sizes[size]} ${className} relative`}>
                <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}>
                    <defs>
                        <linearGradient id="dashGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#a78bfa', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="dashGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="dashGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#34d399', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="dashGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#f472b6', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="48" fill="url(#dashGrad1)" opacity="0.1" />
                    {/* Bar chart */}
                    <rect x="15" y="50" width="12" height="35" rx="6" fill="url(#dashGrad1)" stroke="#6d28d9" strokeWidth="2" />
                    <rect x="32" y="35" width="12" height="50" rx="6" fill="url(#dashGrad2)" stroke="#1d4ed8" strokeWidth="2" />
                    <rect x="49" y="45" width="12" height="40" rx="6" fill="url(#dashGrad3)" stroke="#047857" strokeWidth="2" />
                    <rect x="66" y="25" width="12" height="60" rx="6" fill="url(#dashGrad4)" stroke="#db2777" strokeWidth="2" />
                    {/* Shine highlights */}
                    <rect x="17" y="52" width="8" height="15" rx="4" fill="white" opacity="0.3" />
                    <rect x="34" y="37" width="8" height="20" rx="4" fill="white" opacity="0.3" />
                    <rect x="51" y="47" width="8" height="18" rx="4" fill="white" opacity="0.3" />
                    <rect x="68" y="27" width="8" height="25" rx="4" fill="white" opacity="0.3" />
                </svg>
            </div>
        ),

        // Folder - Advanced 3D File Folder
        folder: (
            <div className={`${sizes[size]} ${className} relative`}>
                <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}>
                    <defs>
                        <linearGradient id="folderBody" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
                            <stop offset="50%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="folderTab" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#93c5fd', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    {/* 3D shadow base */}
                    <path d="M 15 75 L 85 75 L 85 82 L 15 82 Z" fill="#1e40af" opacity="0.6" />
                    {/* Folder body */}
                    <path d="M 10 30 L 10 70 Q 10 75 15 75 L 85 75 Q 90 75 90 70 L 90 35 Q 90 30 85 30 Z"
                        fill="url(#folderBody)" stroke="#1d4ed8" strokeWidth="2" />
                    {/* Folder tab */}
                    <path d="M 10 30 L 10 25 Q 10 20 15 20 L 35 20 L 40 25 L 55 25 L 55 30 Z"
                        fill="url(#folderTab)" stroke="#3b82f6" strokeWidth="1.5" />
                    {/* Inside shadow */}
                    <ellipse cx="50" cy="55" rx="25" ry="12" fill="black" opacity="0.15" />
                    {/* Shine highlight */}
                    <path d="M 15 35 Q 25 32 40 32 Q 55 32 65 35" stroke="white" strokeWidth="3" opacity="0.4" fill="none" strokeLinecap="round" />
                    {/* Documents inside */}
                    <rect x="35" y="45" width="15" height="20" rx="2" fill="#93c5fd" stroke="#60a5fa" strokeWidth="1" />
                    <line x1="38" y1="50" x2="47" y2="50" stroke="white" strokeWidth="1" opacity="0.6" />
                    <line x1="38" y1="54" x2="47" y2="54" stroke="white" strokeWidth="1" opacity="0.6" />
                    <line x1="38" y1="58" x2="45" y2="58" stroke="white" strokeWidth="1" opacity="0.6" />
                </svg>
            </div>
        ),

        // Plus - Modern Add Button
        plus: (
            <div className={`${sizes[size]} ${className} relative`}>
                <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}>
                    <defs>
                        <linearGradient id="plusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#4ade80', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#16a34a', stopOpacity: 1 }} />
                        </linearGradient>
                        <radialGradient id="plusShine">
                            <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.6 }} />
                            <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
                        </radialGradient>
                    </defs>
                    {/* 3D depth circle */}
                    <circle cx="52" cy="52" r="42" fill="#15803d" opacity="0.6" />
                    {/* Main circle */}
                    <circle cx="50" cy="50" r="42" fill="url(#plusGrad)" stroke="#166534" strokeWidth="3" />
                    {/* Shine effect */}
                    <ellipse cx="35" cy="35" rx="20" ry="15" fill="url(#plusShine)" />
                    {/* Plus sign - with 3D effect */}
                    {/* Vertical bar */}
                    <rect x="44" y="25" width="12" height="50" rx="6" fill="white" stroke="#dcfce7" strokeWidth="2" />
                    <rect x="46" y="27" width="8" height="20" rx="4" fill="white" opacity="0.5" />
                    {/* Horizontal bar */}
                    <rect x="25" y="44" width="50" height="12" rx="6" fill="white" stroke="#dcfce7" strokeWidth="2" />
                    <rect x="27" y="46" width="20" height="8" rx="4" fill="white" opacity="0.5" />
                </svg>
            </div>
        ),

        // Check - Success Checkmark (BETTER!)
        check: (
            <div className={`${sizes[size]} ${className} relative`}>
                <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}>
                    <defs>
                        <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#34d399', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
                        </linearGradient>
                        <radialGradient id="checkShine">
                            <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.6 }} />
                            <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
                        </radialGradient>
                    </defs>
                    {/* 3D shadow */}
                    <circle cx="52" cy="52" r="40" fill="#047857" opacity="0.5" />
                    {/* Circle */}
                    <circle cx="50" cy="50" r="40" fill="url(#checkGrad)" stroke="#065f46" strokeWidth="3" />
                    {/* Shine */}
                    <ellipse cx="35" cy="35" rx="20" ry="18" fill="url(#checkShine)" />
                    {/* Checkmark with 3D effect */}
                    <path d="M 30 50 L 42 62 L 70 34"
                        stroke="white"
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.3"
                        transform="translate(1, 1)" />
                    <path d="M 30 50 L 42 62 L 70 34"
                        stroke="white"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round" />
                </svg>
            </div>
        ),

        // Edit - Pencil with Detail
        edit: (
            <div className={`${sizes[size]} ${className} relative`}>
                <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }} transform="rotate(-45)">
                    <defs>
                        <linearGradient id="pencilBody" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="pencilEraser" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#f9a8d4', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    {/* Pencil body */}
                    <rect x="35" y="10" width="30" height="65" rx="3" fill="url(#pencilBody)" stroke="#d97706" strokeWidth="2" />
                    {/* Wood texture lines */}
                    <line x1="35" y1="25" x2="65" y2="25" stroke="#b45309" strokeWidth="0.5" opacity="0.3" />
                    <line x1="35" y1="35" x2="65" y2="35" stroke="#b45309" strokeWidth="0.5" opacity="0.3" />
                    <line x1="35" y1="45" x2="65" y2="45" stroke="#b45309" strokeWidth="0.5" opacity="0.3" />
                    <line x1="35" y1="55" x2="65" y2="55" stroke="#b45309" strokeWidth="0.5" opacity="0.3" />
                    <line x1="35" y1="65" x2="65" y2="65" stroke="#b45309" strokeWidth="0.5" opacity="0.3" />
                    {/* Eraser */}
                    <rect x="35" y="5" width="30" height="10" rx="2" fill="url(#pencilEraser)" stroke="#be185d" strokeWidth="2" />
                    <rect x="38" y="7" width="24" height="3" rx="1" fill="white" opacity="0.4" />
                    {/* Metal band */}
                    <rect x="35" y="14" width="30" height="3" fill="#d4d4d8" stroke="#71717a" strokeWidth="1" />
                    {/* Pencil tip */}
                    <polygon points="50,90 35,75 65,75" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
                    {/* Lead */}
                    <polygon points="50,95 47,90 53,90" fill="#1f2937" />
                    {/* Shine on body */}
                    <ellipse cx="45" cy="35" rx="8" ry="20" fill="white" opacity="0.3" />
                </svg>
            </div>
        ),

        // Message - Modern Mail Envelope
        message: (
            <div className={`${sizes[size]} ${className} relative`}>
                <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}>
                    <defs>
                        <linearGradient id="msgBody" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#f472b6', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="msgFlap" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#be185d', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#9f1239', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    {/* 3D shadow */}
                    <rect x="17" y="37" width="66" height="46" rx="6" fill="#9f1239" opacity="0.5" />
                    {/* Envelope body */}
                    <rect x="15" y="35" width="70" height="45" rx="6" fill="url(#msgBody)" stroke="#be185d" strokeWidth="2" />
                    {/* Back flap (peeking) */}
                    <path d="M 15 35 L 50 55 L 85 35" fill="#f9a8d4" stroke="#ec4899" strokeWidth="1.5" />
                    {/* Envelope front flap */}
                    <path d="M 15 35 L 50 60 L 85 35" fill="url(#msgFlap)" stroke="#881337" strokeWidth="2" />
                    {/* Paper inside (visible) */}
                    <rect x="22" y="42" width="56" height="30" rx="3" fill="white" stroke="#f3f4f6" strokeWidth="1" />
                    {/* Text lines on paper */}
                    <line x1="28" y1="50" x2="65" y2="50" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
                    <line x1="28" y1="56" x2="70" y2="56" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
                    <line x1="28" y1="62" x2="60" y2="62" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
                    {/* Shine effect */}
                    <ellipse cx="35" cy="48" rx="15" ry="12" fill="white" opacity="0.25" />
                    {/* Seal/sticker */}
                    <circle cx="70" cy="45" r="6" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
                    <text x="70" y="48" fontSize="8" fill="#78350f" textAnchor="middle" fontWeight="bold">!</text>
                </svg>
            </div>
        ),

        // Trash - Detailed Trash Can
        trash: (
            <div className={`${sizes[size]} ${className} relative`}>
                <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}>
                    <defs>
                        <linearGradient id="trashBody" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#f87171', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    {/* 3D shadow */}
                    <path d="M 32 30 L 28 85 Q 28 88 31 88 L 69 88 Q 72 88 72 85 L 68 30 Z" fill="#991b1b" opacity="0.5" transform="translate(2, 2)" />
                    {/* Can body */}
                    <path d="M 30 28 L 26 85 Q 26 88 29 88 L 71 88 Q 74 88 74 85 L 70 28 Z"
                        fill="url(#trashBody)" stroke="#991b1b" strokeWidth="2.5" />
                    {/* Lid */}
                    <rect x="20" y="20" width="60" height="10" rx="3" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
                    {/* Lid handle */}
                    <rect x="45" y="15" width="10" height="8" rx="4" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
                    {/* Vertical lines on can */}
                    <line x1="38" y1="35" x2="34" y2="80" stroke="#7f1d1d" strokeWidth="2" opacity="0.4" />
                    <line x1="50" y1="35" x2="50" y2="82" stroke="#7f1d1d" strokeWidth="2" opacity="0.4" />
                    <line x1="62" y1="35" x2="66" y2="80" stroke="#7f1d1d" strokeWidth="2" opacity="0.4" />
                    {/* Shine highlight */}
                    <ellipse cx="40" cy="50" rx="8" ry="20" fill="white" opacity="0.25" />
                </svg>
            </div>
        ),

        // Image - Photo Frame
        image: (
            <div className={`${sizes[size]} ${className} relative`}>
                <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}>
                    <defs>
                        <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#0891b2', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="photoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#dbeafe', stopOpacity: 1 }} />
                            <stop offset="50%" style={{ stopColor: '#93c5fd', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    {/* Frame shadow */}
                    <rect x="12" y="12" width="76" height="76" rx="8" fill="#0e7490" opacity="0.6" />
                    {/* Frame */}
                    <rect x="10" y="10" width="80" height="80" rx="8" fill="url(#frameGrad)" stroke="#0e7490" strokeWidth="3" />
                    {/* Photo inside */}
                    <rect x="18" y="18" width="64" height="64" rx="4" fill="url(#photoGrad)" />
                    {/* Sun */}
                    <circle cx="70" cy="30" r="8" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
                    {/* Mountain 1 */}
                    <polygon points="25,75 45,45 65,75" fill="#1e40af" opacity="0.8" />
                    {/* Mountain 2 */}
                    <polygon points="50,75 65,50 78,75" fill="#1e3a8a" opacity="0.9" />
                    {/* Snow caps */}
                    <polygon points="45,45 50,50 40,50" fill="white" opacity="0.9" />
                    <polygon points="65,50 68,54 62,54" fill="white" opacity="0.9" />
                    {/* Frame shine */}
                    <rect x="15" y="15" width="30" height="30" rx="4" fill="white" opacity="0.2" />
                </svg>
            </div>
        ),

        // Back Arrow
        back: (
            <div className={`${sizes[size]} ${className} relative`}>
                <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}>
                    <defs>
                        <linearGradient id="backGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#818cf8', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    {/* Shadow */}
                    <circle cx="52" cy="52" r="38" fill="#3730a3" opacity="0.5" />
                    {/* Circle */}
                    <circle cx="50" cy="50" r="38" fill="url(#backGrad)" stroke="#3730a3" strokeWidth="3" />
                    {/* Arrow */}
                    <path d="M 60 50 L 35 50" stroke="white" strokeWidth="6" strokeLinecap="round" />
                    <path d="M 35 50 L 45 40" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 35 50 L 45 60" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Shine */}
                    <ellipse cx="35" cy="35" rx="15" ry="12" fill="white" opacity="0.35" />
                </svg>
            </div>
        ),

        // Warning
        warning: (
            <div className={`${sizes[size]} ${className} relative`}>
                <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}>
                    <defs>
                        <linearGradient id="warnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    {/* Shadow */}
                    <polygon points="52,18 12,87 92,87" fill="#d97706" opacity="0.5" />
                    {/* Triangle */}
                    <polygon points="50,15 10,85 90,85" fill="url(#warnGrad)" stroke="#d97706" strokeWidth="3" strokeLinejoin="round" />
                    {/* Exclamation line */}
                    <rect x="46" y="35" width="8" height="30" rx="4" fill="white" stroke="#fef3c7" strokeWidth="1.5" />
                    {/* Exclamation dot */}
                    <circle cx="50" cy="72" r="5" fill="white" stroke="#fef3c7" strokeWidth="1.5" />
                    {/* Shine */}
                    <polygon points="50,20 35,45 65,45" fill="white" opacity="0.25" />
                </svg>
            </div>
        ),

        // Loading
        loading: (
            <div className={`${sizes[size]} ${className} relative animate-spin`}>
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" stroke="#e0e7ff" strokeWidth="8" fill="none" />
                    <circle cx="50" cy="50" r="40" stroke="#6366f1" strokeWidth="8" fill="none"
                        strokeDasharray="60 200" strokeLinecap="round" />
                </svg>
            </div>
        ),

        // Empty Box
        empty: (
            <div className={`${sizes[size]} ${className} relative`}>
                <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}>
                    <defs>
                        <linearGradient id="boxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#d1d5db', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#9ca3af', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    {/* Box body */}
                    <rect x="20" y="30" width="60" height="50" rx="4" fill="url(#boxGrad)" stroke="#6b7280" strokeWidth="2" />
                    {/* Open flaps */}
                    <path d="M 20 30 L 20 20 L 40 25 L 50 30" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.5" />
                    <path d="M 80 30 L 80 20 L 60 25 L 50 30" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1.5" />
                    {/* Inside */}
                    <rect x="25" y="32" width="50" height="8" fill="#374151" opacity="0.3" />
                    {/* Dashed empty indicator */}
                    <rect x="35" y="50" width="30" height="20" rx="2" fill="none" stroke="#6b7280" strokeWidth="2" strokeDasharray="5,3" />
                    <circle cx="50" cy="60" r="3" fill="#9ca3af" />
                </svg>
            </div>
        ),

        // Settings Gear
        settings: (
            <div className={`${sizes[size]} ${className} relative`}>
                <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}>
                    <defs>
                        <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#94a3b8', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#64748b', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    {/* Gear outer circle */}
                    <circle cx="50" cy="50" r="35" fill="url(#gearGrad)" stroke="#475569" strokeWidth="2" />
                    {/* Gear teeth */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                        <rect
                            key={i}
                            x="48"
                            y="12"
                            width="4"
                            height="12"
                            rx="2"
                            fill="#475569"
                            transform={`rotate(${angle} 50 50)`}
                        />
                    ))}
                    {/* Center hole */}
                    <circle cx="50" cy="50" r="12" fill="#334155" stroke="#1e293b" strokeWidth="2" />
                    <circle cx="50" cy="50" r="8" fill="#1e293b" />
                    {/* Shine */}
                    <ellipse cx="40" cy="40" rx="12" ry="15" fill="white" opacity="0.25" />
                </svg>
            </div>
        ),
    };

    return iconStyles[type] || iconStyles.folder;
};

export default ToyIcon;
