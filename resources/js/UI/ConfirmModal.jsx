import React from 'react';
import ToyIcon from './ToyIcon';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger" // danger, success, warning, info
}) => {
    if (!isOpen) return null;

    const typeConfig = {
        danger: {
            icon: 'trash',
            iconBg: 'from-red-400 to-red-600',
            iconBorder: 'border-red-800',
            confirmBg: 'from-red-400 to-red-600',
            confirmBorder: 'border-red-800',
            ringColor: 'ring-red-200'
        },
        success: {
            icon: 'check',
            iconBg: 'from-green-400 to-green-600',
            iconBorder: 'border-green-800',
            confirmBg: 'from-green-400 to-green-600',
            confirmBorder: 'border-green-800',
            ringColor: 'ring-green-200'
        },
        warning: {
            icon: 'warning',
            iconBg: 'from-yellow-400 to-yellow-600',
            iconBorder: 'border-yellow-800',
            confirmBg: 'from-yellow-400 to-yellow-600',
            confirmBorder: 'border-yellow-800',
            ringColor: 'ring-yellow-200'
        },
        info: {
            icon: 'message',
            iconBg: 'from-blue-400 to-blue-600',
            iconBorder: 'border-blue-800',
            confirmBg: 'from-blue-400 to-blue-600',
            confirmBorder: 'border-blue-800',
            ringColor: 'ring-blue-200'
        }
    };

    const config = typeConfig[type] || typeConfig.info;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative animate-scaleIn">
                {/* Shadow Layer */}
                <div className="absolute inset-0 bg-purple-400 rounded-3xl opacity-40 transform translate-y-3 translate-x-3 blur-md"></div>

                {/* Modal */}
                <div className="relative bg-white rounded-3xl p-8 max-w-md w-full border-b-8 border-r-8 border-purple-300 shadow-2xl overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-40 transform translate-x-32 -translate-y-32 pointer-events-none"></div>

                    <div className="relative z-10">
                        {/* Icon */}
                        <div className="text-center mb-6">
                            <div className="inline-block mb-6 relative group">
                                {/* Icon shadow */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${config.iconBg} rounded-full opacity-30 transform translate-y-2 translate-x-2 blur-sm`}></div>

                                {/* Icon Container */}
                                <div className={`relative w-24 h-24 bg-gradient-to-br ${config.iconBg} rounded-full border-b-6 ${config.iconBorder} shadow-xl ring-4 ${config.ringColor} flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1`}>
                                    <div className="absolute inset-0 bg-white opacity-20 rounded-full"></div>
                                    <div className="relative scale-150">
                                        <ToyIcon type={config.icon} size="xl" />
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl font-black text-gray-800 mb-3"
                                style={{
                                    textShadow: `
                                        0 1px 0 #d1d5db,
                                        0 2px 0 #9ca3af,
                                        0 3px 5px rgba(0,0,0,0.15)
                                    `
                                }}>
                                {title}
                            </h2>

                            {/* Message */}
                            <p className="text-gray-600 text-base font-medium leading-relaxed px-4">
                                {message}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mt-8">
                            {/* Cancel Button */}
                            <button
                                onClick={onClose}
                                className="flex-1 relative bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800 font-black py-4 px-6 rounded-xl border-b-4 border-gray-600 shadow-lg hover:shadow-xl active:border-b-0 active:translate-y-1 transition-all duration-200 overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <span className="relative text-lg"
                                    style={{
                                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                    }}>
                                    {cancelText}
                                </span>
                            </button>

                            {/* Confirm Button */}
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`flex-1 relative bg-gradient-to-br ${config.confirmBg} text-white font-black py-4 px-6 rounded-xl border-b-4 ${config.confirmBorder} shadow-lg hover:shadow-xl active:border-b-0 active:translate-y-1 transition-all duration-200 overflow-hidden group`}
                            >
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                <span className="relative text-lg"
                                    style={{
                                        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                    }}>
                                    {confirmText}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { 
                        transform: scale(0.9) translateY(-20px); 
                        opacity: 0; 
                    }
                    to { 
                        transform: scale(1) translateY(0); 
                        opacity: 1; 
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
            `}</style>
        </div>
    );
};

export default ConfirmModal;
