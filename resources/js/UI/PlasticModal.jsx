import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlasticButton from './PlasticButton';

const PlasticModal = ({ isOpen, onClose, onConfirm, title, message, type = 'warning' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="relative bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-slate-200 text-center"
            >
                {/* Top Decor */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-12 bg-slate-200 rounded-t-xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center -z-10">
                    <div className="w-16 h-2 bg-slate-300 rounded-full"></div>
                </div>

                <div className="mb-6">
                    <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center text-4xl border-4 border-white shadow-lg mb-4">
                        🤔
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2">
                        {title}
                    </h2>
                    <p className="text-slate-500 font-bold leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <PlasticButton
                        color="red"
                        onClick={onConfirm}
                        className="px-8 shadow-lg"
                    >
                        Yes, Log Out
                    </PlasticButton>
                </div>
            </motion.div>
        </div>
    );
};

export default PlasticModal;
