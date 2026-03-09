import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Trash2, CheckCircle2, ChevronRight, Mail, Clock, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllContactMessagesApi, updateContactMessageStatusApi, deleteContactMessageApi } from '../../../api/contact.api';
import ConfirmationModal from '../../../components/common/ConfirmationModal';


const ContactMessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [messageToDelete, setMessageToDelete] = useState(null);


    const fetchMessages = async () => {
        try {
            setLoading(true);
            const data = await getAllContactMessagesApi();
            setMessages(data);
        } catch (error) {
            toast.error('Failed to load user messages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        const loadingToast = toast.loading('Updating message status...');
        try {
            const updated = await updateContactMessageStatusApi(id, status);
            setMessages(messages.map(msg => msg._id === id ? updated : msg));
            if (selectedMessage?._id === id) setSelectedMessage(updated);
            toast.success(`Message marked as ${status}`, { id: loadingToast });
        } catch (error) {
            toast.error('Failed to update status', { id: loadingToast });
        }
    };

    const handleDeleteClick = (id) => {
        setMessageToDelete(id);
    };

    const confirmDelete = async () => {
        if (!messageToDelete) return;

        const loadingToast = toast.loading('Deleting message...');
        try {
            await deleteContactMessageApi(messageToDelete);
            setMessages(messages.filter(msg => msg._id !== messageToDelete));
            if (selectedMessage?._id === messageToDelete) setSelectedMessage(null);
            toast.success('Message deleted successfully', { id: loadingToast });
        } catch (error) {
            toast.error('Failed to delete message', { id: loadingToast });
        } finally {
            setMessageToDelete(null);
        }
    };

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusConfig = {
        'unread': { label: 'Unread', bg: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20', dot: 'bg-rose-500' },
        'read': { label: 'Read', bg: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20', dot: 'bg-blue-500' },
        'replied': { label: 'Replied', bg: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20', dot: 'bg-emerald-500' }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2 tracking-tight">
                        <MessageSquare className="text-primary" /> User Messages
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Review and manage contact submissions from users.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm overflow-hidden animate-in fade-in duration-300">
                {/* Header & Search */}
                <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium transition-shadow"
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row min-h-[500px]">
                    {/* Message List */}
                    <div className="w-full lg:w-1/3 border-r border-slate-100 dark:border-slate-700/60 flex flex-col h-[600px] overflow-hidden bg-slate-50/30 dark:bg-slate-800/30">
                        {loading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            </div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
                                <ShieldAlert size={40} className="text-slate-400 mb-4" />
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No messages found</p>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                    {filteredMessages.map((msg) => (
                                        <button
                                            key={msg._id}
                                            onClick={() => {
                                                setSelectedMessage(msg);
                                                if (msg.status === 'unread') handleUpdateStatus(msg._id, 'read');
                                            }}
                                            className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors ${selectedMessage?._id === msg._id ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-primary' : 'border-l-4 border-transparent'}`}
                                        >
                                            <div className="flex items-start justify-between mb-1">
                                                <h3 className={`text-sm truncate pr-2 ${msg.status === 'unread' ? 'font-black text-slate-800 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                                                    {msg.name}
                                                </h3>
                                                <span className="text-[10px] font-bold text-slate-400 shrink-0 mt-0.5">
                                                    {new Date(msg.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className={`text-[11px] truncate mb-2 ${msg.status === 'unread' ? 'font-bold text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                                                {msg.subject}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-widest ${statusConfig[msg.status].bg}`}>
                                                    <span className={`size-1.5 rounded-full ${statusConfig[msg.status].dot} ${msg.status === 'unread' ? 'animate-pulse' : ''}`}></span>
                                                    {statusConfig[msg.status].label}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Message Details */}
                    <div className="flex-1 h-[600px] overflow-y-auto bg-white dark:bg-slate-800/50 p-6 md:p-8 custom-scrollbar">
                        {selectedMessage ? (
                            <div className="max-w-3xl animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-start justify-between gap-4 mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="size-14 rounded-2xl bg-linear-to-br from-primary to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 shrink-0">
                                            {selectedMessage.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">{selectedMessage.name}</h2>
                                            <a href={`mailto:${selectedMessage.email}`} className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors flex items-center gap-1.5 mt-0.5">
                                                <Mail size={14} /> {selectedMessage.email}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${statusConfig[selectedMessage.status].bg}`}>
                                            <span className={`size-2 rounded-full ${statusConfig[selectedMessage.status].dot}`}></span>
                                            {statusConfig[selectedMessage.status].label}
                                        </span>
                                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                            <Clock size={12} /> {new Date(selectedMessage.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 dark:border-slate-700 pb-2">Subject</p>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{selectedMessage.subject}</h3>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 dark:border-slate-700 pb-2">Message</p>
                                        <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-700 mt-8">
                                        <a
                                            href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                            onClick={() => {
                                                if (selectedMessage.status !== 'replied') handleUpdateStatus(selectedMessage._id, 'replied');
                                            }}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5"
                                        >
                                            <Mail size={16} /> Reply via Email
                                        </a>
                                        {selectedMessage.status === 'unread' && (
                                            <button
                                                onClick={() => handleUpdateStatus(selectedMessage._id, 'read')}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                                            >
                                                <CheckCircle2 size={16} /> Mark as Read
                                            </button>
                                        )}
                                        {selectedMessage.status === 'replied' && (
                                            <button
                                                onClick={() => handleUpdateStatus(selectedMessage._id, 'read')}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                                            >
                                                Mark Unreplied
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteClick(selectedMessage._id)}
                                            className="p-3 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white dark:bg-red-500/10 dark:hover:bg-red-600 rounded-xl transition-all ml-auto"
                                            title="Delete Message"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                <MessageSquare size={64} className="text-slate-300 mb-6" />
                                <h3 className="text-lg font-black text-slate-600 dark:text-slate-400">No Message Selected</h3>
                                <p className="text-sm font-medium text-slate-500 mt-2 max-w-[200px]">Select a message from the list to view its details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reusable Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!messageToDelete}
                onClose={() => setMessageToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Message"
                message="Are you sure you want to delete this message? This action cannot be undone."
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default ContactMessagesPage;
