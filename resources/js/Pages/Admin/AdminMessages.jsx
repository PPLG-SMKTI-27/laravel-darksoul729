import React, { useState } from 'react';
import ToyIcon from '../../UI/ToyIcon';
import ConfirmModal from '../../UI/ConfirmModal';
import Toast from '../../UI/Toast';

const AdminMessages = ({ messages: initialMessages }) => {
    const [messages, setMessages] = useState(initialMessages || []);
    const [showModal, setShowModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');


    const handleDeleteClick = (message) => {
        setMessageToDelete(message);
        setShowModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!messageToDelete) return;

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const formData = new FormData();
            formData.append('_method', 'DELETE');

            const response = await fetch(`/admin/messages/${messageToDelete.id}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                },
                body: formData
            });

            if (response.ok) {
                setMessages(messages.filter(m => m.id !== messageToDelete.id));
                setShowModal(false);
                setMessageToDelete(null);
                setToastType('success');
                setToastMessage('Message deleted successfully!');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            } else {
                setShowModal(false);
                setToastType('error');
                setToastMessage('Failed to delete message');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
        } catch (error) {
            console.error('Delete error:', error);
            setShowModal(false);
            setToastType('error');
            setToastMessage('Error deleting message');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const MessageCard = ({ message }) => (
        <div className="group relative">
            {/* Shadow */}
            <div className="absolute inset-0 bg-pink-300 rounded-3xl opacity-30 transform translate-y-2 translate-x-2 blur-sm"></div>

            {/* Card */}
            <div className="relative bg-white rounded-3xl p-6 border-b-8 border-r-8 border-pink-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-100 to-transparent rounded-full blur-2xl opacity-50 transform translate-x-20 -translate-y-20 pointer-events-none"></div>

                <div className="relative z-10">
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-4">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg border-b-4 ${message.is_read
                            ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-gray-700'
                            : 'bg-gradient-to-r from-blue-400 to-blue-500 text-white border-blue-700'
                            }`}>
                            <ToyIcon type={message.is_read ? 'check' : 'message'} size="sm" />
                            {message.is_read ? 'READ' : 'NEW'}
                        </span>
                        <p className="text-xs text-gray-400 font-mono">
                            {new Date(message.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Name */}
                    <h3 className="text-2xl font-black text-gray-800 mb-2"
                        style={{
                            textShadow: `
                                0 1px 0 #d1d5db,
                                0 2px 3px rgba(0,0,0,0.1)
                            `
                        }}>
                        {message.name}
                    </h3>

                    {/* Email */}
                    <a
                        href={`mailto:${message.email}`}
                        className="text-sm text-blue-500 hover:text-blue-700 font-bold underline mb-4 block"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {message.email}
                    </a>

                    {/* Message */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200 mb-4">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {message.message}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <a
                            href={`mailto:${message.email}?subject=Re: Your Message`}
                            className="flex-1 group/btn relative bg-gradient-to-br from-green-400 to-green-600 text-white font-black py-3 px-4 rounded-xl border-b-4 border-green-800 shadow-lg hover:shadow-xl active:border-b-0 active:translate-y-1 transition-all duration-200 overflow-hidden text-center"
                        >
                            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                            <div className="relative flex items-center justify-center gap-2">
                                <ToyIcon type="message" size="sm" />
                                <span className="text-sm">REPLY</span>
                            </div>
                        </a>

                        <button
                            onClick={() => handleDeleteClick(message)}
                            className="flex-1 group/btn relative bg-gradient-to-br from-red-400 to-red-600 text-white font-black py-3 px-4 rounded-xl border-b-4 border-red-800 shadow-lg hover:shadow-xl active:border-b-0 active:translate-y-1 transition-all duration-200 overflow-hidden">

                            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                            <div className="relative flex items-center justify-center gap-2">
                                <ToyIcon type="trash" size="sm" />
                                <span className="text-sm">DELETE</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-pink-300 rounded-3xl opacity-30 transform translate-y-2 translate-x-2 blur-sm"></div>

                    <div className="relative bg-white rounded-3xl p-8 border-b-8 border-r-8 border-pink-300 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2 animate-pulse pointer-events-none"></div>

                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <h1 className="text-5xl font-black text-pink-600 mb-3"
                                    style={{
                                        textShadow: `
                                            0 1px 0 #ec4899,
                                            0 2px 0 #db2777,
                                            0 3px 0 #be185d,
                                            0 4px 5px rgba(0,0,0,0.2)
                                        `
                                    }}>
                                    MESSAGES
                                </h1>
                                <div className="flex items-center gap-3">
                                    <ToyIcon type="message" size="md" />
                                    <p className="text-gray-700 font-black text-lg"
                                        style={{
                                            textShadow: `0 1px 0 #9ca3af, 0 2px 3px rgba(0,0,0,0.1)`
                                        }}>
                                        Total Messages: {messages.length}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => window.location.href = '/dashboard'}
                                className="group/btn bg-gradient-to-br from-indigo-400 to-indigo-600 text-white font-black px-8 py-4 rounded-2xl border-b-6 border-indigo-800 shadow-xl hover:shadow-2xl active:border-b-0 active:translate-y-2 transition-all duration-200 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                                <div className="relative flex items-center gap-3">
                                    <ToyIcon type="back" size="md" />
                                    <span className="text-lg">BACK</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages Grid */}
                {messages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {messages.map((message) => (
                            <MessageCard key={message.id} message={message} />
                        ))}
                    </div>
                ) : (
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gray-300 rounded-3xl opacity-20 transform translate-y-2 translate-x-2 blur-sm"></div>

                        <div className="relative bg-white rounded-3xl p-16 border-b-8 border-r-8 border-gray-200 shadow-xl text-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="mb-6">
                                    <ToyIcon type="empty" size="2xl" className="mx-auto" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-700 mb-3"
                                    style={{
                                        textShadow: `0 1px 0 #9ca3af, 0 2px 3px rgba(0,0,0,0.1)`
                                    }}>
                                    No Messages Yet
                                </h3>
                                <p className="text-gray-600 text-lg font-bold">Your inbox is empty!</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals & Toasts */}
            <ConfirmModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Message?"
                message={`Are you sure you want to delete the message from "${messageToDelete?.name}"? This action cannot be undone.`}
                type="danger"
                confirmText="Delete"
                cancelText="Cancel"
            />

            <Toast
                isVisible={showToast}
                message={toastMessage}
                type={toastType}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default AdminMessages;
