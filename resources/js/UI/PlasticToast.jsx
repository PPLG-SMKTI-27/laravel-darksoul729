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
        success: '✅',
        error: '⚠️',
        info: 'ℹ️',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className={`fixed top-6 right-6 z-[60] px-6 py-4 rounded-xl border-2 font-black text-white flex items-center gap-3 min-w-[300px] ${colors[type] || colors.info}`}
        >
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
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
