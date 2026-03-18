import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PlasticToast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const colors = {
        success: 'bg-green-400 border-green-300 shadow-[0_4px_0_#15803d]',
        error: 'bg-red-400 border-red-300 shadow-[0_4px_0_#b91c1c]',
        info: 'bg-blue-400 border-blue-300 shadow-[0_4px_0_#1d4ed8]',
    };

    const icons = {
        success: (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
            </svg>
        ),
        error: (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            </svg>
        ),
        info: (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" />
            </svg>
        ),
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className={`fixed right-4 top-4 z-[70] flex min-w-[280px] max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border-2 px-5 py-4 font-black text-white sm:right-6 sm:top-28 sm:min-w-[300px] ${colors[type] || colors.info}`}
        >
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                {icons[type]}
            </div>
            <div>
                <div className="uppercase text-xs opacity-80 tracking-widest">Notification</div>
                <div className="text-lg leading-none mt-0.5" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.2)' }}>
                    {message}
                </div>
            </div>
            {/* Gloss */}
            <div className="absolute top-1 left-2 right-2 h-[40%] bg-gradient-to-b from-white/30 to-transparent rounded-t-lg pointer-events-none"></div>
        </motion.div>
    );
};

export default PlasticToast;
