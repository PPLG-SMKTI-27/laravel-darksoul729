import React, { useEffect } from 'react';
import ToyIcon from './ToyIcon';

const Toast = ({
    isVisible,
    message,
    type = 'success', // success, error, warning, info
    onClose,
    duration = 3000
}) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose && onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const typeConfig = {
        success: {
            icon: 'check',
            bg: 'from-green-400 to-green-600',
            border: 'border-green-800',
            ring: 'ring-green-200',
            title: 'Success!'
        },
        error: {
            icon: 'warning',
            bg: 'from-red-400 to-red-600',
            border: 'border-red-800',
            ring: 'ring-red-200',
            title: 'Error!'
        },
        warning: {
            icon: 'warning',
            bg: 'from-yellow-400 to-yellow-600',
            border: 'border-yellow-800',
            ring: 'ring-yellow-200',
            title: 'Warning!'
        },
        info: {
            icon: 'message',
            bg: 'from-blue-400 to-blue-600',
            border: 'border-blue-800',
            ring: 'ring-blue-200',
            title: 'Info'
        }
    };

    const config = typeConfig[type] || typeConfig.success;

    return (
        <div className="fixed bottom-8 right-8 z-50 animate-slideIn">
            {/* Shadow Layer */}
            <div className="absolute inset-0 bg-purple-400 rounded-2xl opacity-30 transform translate-y-2 translate-x-2 blur-sm"></div>

            {/* Toast */}
            <div className={`relative bg-gradient-to-br ${config.bg} rounded-2xl p-5 border-b-6 border-r-6 ${config.border} shadow-2xl ring-4 ${config.ring} max-w-md overflow-hidden`}>
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl opacity-20 transform translate-x-16 -translate-y-16 pointer-events-none"></div>

                {/* Shine effect */}
                <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/40 to-transparent rounded-t-2xl pointer-events-none"></div>

                <div className="relative z-10 flex items-center gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 transform transition-transform duration-300 hover:scale-110 hover:rotate-12">
                        <ToyIcon type={config.icon} size="lg" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h4 className="text-white font-black text-lg mb-1"
                            style={{
                                textShadow: `
                                    0 1px 0 rgba(0,0,0,0.3),
                                    0 2px 0 rgba(0,0,0,0.2),
                                    0 3px 5px rgba(0,0,0,0.3)
                                `
                            }}>
                            {config.title}
                        </h4>
                        <p className="text-white text-sm font-bold opacity-90">
                            {message}
                        </p>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group"
                    >
                        <span className="text-white font-black text-lg group-hover:rotate-90 transition-transform duration-300">×</span>
                    </button>
                </div>

                {/* Progress Bar */}
                {duration > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 overflow-hidden">
                        <div
                            className="h-full bg-white/50 animate-progress"
                            style={{
                                animation: `progress ${duration}ms linear forwards`
                            }}
                        ></div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slideIn {
                    from { 
                        transform: translateX(400px); 
                        opacity: 0; 
                    }
                    to { 
                        transform: translateX(0); 
                        opacity: 1; 
                    }
                }
                @keyframes progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .animate-slideIn {
                    animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
            `}</style>
        </div>
    );
};

// Backward compatibility: SuccessToast
export const SuccessToast = ({ isVisible, message, onClose }) => (
    <Toast isVisible={isVisible} message={message} type="success" onClose={onClose} />
);

export default Toast;
