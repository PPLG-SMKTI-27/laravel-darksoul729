import React, { useState } from 'react';
import {
    AdminTerminalButton,
    AdminTerminalConfirm,
    AdminTerminalNotice,
    AdminTerminalPanel,
    AdminWindow,
    AdminTerminalTable,
    adminTerminalIcons,
} from '../../UI/AdminTerminal';

const AdminMessages = ({ windowId, messages: initialMessages }) => {
    const [messages, setMessages] = useState(initialMessages || []);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [notice, setNotice] = useState(null);

    const handleConfirmDelete = async () => {
        if (!messageToDelete) {
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const formData = new FormData();
            formData.append('_method', 'DELETE');

            const response = await fetch(`/admin/messages/${messageToDelete.id}`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: formData,
            });

            if (response.ok) {
                setMessages(messages.filter((message) => message.id !== messageToDelete.id));
                setNotice({ type: 'success', message: `Message from "${messageToDelete.name}" deleted.` });
            } else {
                setNotice({ type: 'error', message: 'Failed to delete message.' });
            }
        } catch (error) {
            console.error('Delete error:', error);
            setNotice({ type: 'error', message: 'Error deleting message.' });
        } finally {
            setMessageToDelete(null);
        }
    };

    const rows = messages.map((message) => ({
        key: message.id,
        cells: [
            <div className="space-y-1">
                <div className="font-bold text-[#333]">{message.name}</div>
                <a href={`mailto:${message.email}`} className="break-all font-bold text-[#1A4B85] hover:text-[#2C62A8] hover:underline">
                    {message.email}
                </a>
            </div>,
            <span className={message.is_read ? 'text-[#666]' : 'font-bold text-emerald-700'}>{message.is_read ? 'read' : 'new'}</span>,
            <div className="line-clamp-3 text-[12px] text-[#444] leading-tight">{message.message}</div>,
            <span className="text-[#666]">{new Date(message.created_at).toLocaleDateString()}</span>,
            <div className="flex flex-wrap gap-2">
                <AdminTerminalButton tone="green" onClick={() => { window.location.href = `mailto:${message.email}?subject=Re:%20Your%20Message`; }}>
                    Reply
                </AdminTerminalButton>
                <AdminTerminalButton tone="red" onClick={() => { setMessageToDelete(message); }}>
                    Delete
                </AdminTerminalButton>
            </div>,
        ],
    }));

    return (
        <AdminWindow
            windowId={windowId}
            title="Messages"
            subtitle="Lightweight inbox for contact submissions and follow-up replies."
            meta={[
                { label: 'total', value: messages.length, tone: 'neutral' },
                { label: 'new', value: messages.filter((message) => !message.is_read).length, tone: 'green' },
            ]}
        >
            <AdminTerminalPanel title="Inbox" command="$ adminctl inbox --list">
                <div className="space-y-4">
                    {notice ? <AdminTerminalNotice type={notice.type} message={notice.message} /> : null}
                    <AdminTerminalTable
                        columns={['sender', 'status', 'message', 'received', 'actions']}
                        rows={rows}
                        emptyLabel="No messages found"
                    />
                </div>
            </AdminTerminalPanel>

            <AdminTerminalConfirm
                open={Boolean(messageToDelete)}
                title="Delete Message"
                message={`Delete message from "${messageToDelete?.name}" permanently?`}
                confirmLabel="Delete"
                onCancel={() => { setMessageToDelete(null); }}
                onConfirm={handleConfirmDelete}
            />
        </AdminWindow>
    );
};

export default AdminMessages;
