import React, { useState, useEffect } from 'react';
import {
    Megaphone, Plus, Trash2, Edit3, Save, X, ExternalLink,
    CheckCircle2, AlertCircle, Info
} from 'lucide-react';
import {
    getMarqueesApi, createMarqueeApi, updateMarqueeApi, deleteMarqueeApi
} from '../../../api/marquee.api';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../../components/common/ConfirmationModal';


const MarqueeManagementPage = () => {
    const [marquees, setMarquees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);


    // Form state
    const [formData, setFormData] = useState({
        text: '',
        link: '',
        isActive: true
    });

    useEffect(() => {
        fetchMarquees();
    }, []);

    const fetchMarquees = async () => {
        try {
            const data = await getMarqueesApi();
            setMarquees(data);
        } catch (error) {
            console.error('Error fetching marquees:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Adding announcement...');
        try {
            const newItem = await createMarqueeApi(formData);
            setMarquees([newItem, ...marquees]);
            setIsAddModalOpen(false);
            setFormData({ text: '', link: '', isActive: true });
            toast.success('Announcement added successfully', { id: loadingToast });
        } catch (error) {
            console.error(error);
            toast.error('Failed to add announcement', { id: loadingToast });
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Updating announcement...');
        try {
            const updated = await updateMarqueeApi(editingItem._id, formData);
            setMarquees(marquees.map(m => m._id === updated._id ? updated : m));
            setEditingItem(null);
            setFormData({ text: '', link: '', isActive: true });
            toast.success('Announcement updated successfully', { id: loadingToast });
        } catch (error) {
            console.error(error);
            toast.error('Failed to update announcement', { id: loadingToast });
        }
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        const loadingToast = toast.loading('Deleting announcement...');
        try {
            await deleteMarqueeApi(itemToDelete);
            setMarquees(marquees.filter(m => m._id !== itemToDelete));
            toast.success('Announcement deleted successfully', { id: loadingToast });
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete announcement', { id: loadingToast });
        } finally {
            setItemToDelete(null);
        }
    };

    const startEdit = (item) => {
        setEditingItem(item);
        setFormData({
            text: item.text,
            link: item.link || '',
            isActive: item.isActive
        });
    };

    const toggleStatus = async (item) => {
        const loadingToast = toast.loading('Updating status...');
        try {
            const updated = await updateMarqueeApi(item._id, { isActive: !item.isActive });
            setMarquees(marquees.map(m => m._id === updated._id ? updated : m));
            toast.success(`Announcement ${updated.isActive ? 'activated' : 'deactivated'}`, { id: loadingToast });
        } catch (error) {
            console.error('Error toggling status:', error);
            toast.error('Failed to update status', { id: loadingToast });
        }
    };

    if (loading) return (
        <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                        <Megaphone className="text-primary" />
                        Announcement Bar
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Manage scrolling news and critical updates for the homepage.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({ text: '', link: '', isActive: true });
                        setIsAddModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                >
                    <Plus size={20} />
                    Add Announcement
                </button>
            </div>

            {/* List Area */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Announcement Content</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                            {marquees.map((item) => (
                                <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => toggleStatus(item)}
                                                className={`relative w-11 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 ${item.isActive ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                                            >
                                                <div className={`size-4 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${item.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </button>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${item.isActive ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                                {item.isActive ? 'Active' : 'Draft'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-xl">
                                            <p className="font-bold text-slate-800 dark:text-slate-200 leading-relaxed truncate">
                                                {item.text}
                                            </p>
                                            {item.link && (
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline mt-1"
                                                >
                                                    <ExternalLink size={10} />
                                                    {item.link}
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => startEdit(item)}
                                                className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={() => setItemToDelete(item._id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {marquees.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-40">
                                            <Info size={48} className="mb-4" />
                                            <p className="font-bold text-slate-500">No active announcements</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Overlay */}
            {(isAddModalOpen || editingItem) && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => {
                            setIsAddModalOpen(false);
                            setEditingItem(null);
                        }}
                    ></div>

                    <div className="relative bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
                        <form onSubmit={editingItem ? handleUpdateSubmit : handleAddSubmit} className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                                    {editingItem ? 'Edit Announcement' : 'New Announcement'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        setEditingItem(null);
                                    }}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Announcement Text</label>
                                    <textarea
                                        required
                                        rows="3"
                                        placeholder="Enter the message to display..."
                                        value={formData.text}
                                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-slate-800 dark:text-white font-semibold transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Link URL (Optional)</label>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-slate-800 dark:text-white font-semibold transition-all"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">Active Status</p>
                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">Show this on the live website</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${formData.isActive ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                                    >
                                        <div className={`size-6 bg-white rounded-full shadow-md transition-transform duration-300 ${formData.isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-10">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        setEditingItem(null);
                                    }}
                                    className="py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
                                >
                                    {editingItem ? 'Save Changes' : 'Create Now'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reusable Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Announcement"
                message="Are you sure you want to delete this announcement? This action cannot be undone."
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default MarqueeManagementPage;
