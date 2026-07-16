import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    FileText, List, PlusCircle, Edit, Trash2, EyeOff, ExternalLink, Upload, Search, Loader2, Image as ImageIcon, ChevronLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import TabButton from '../../../components/ui/TabButton';
import PopupModel from '../../../components/ui/PopupModel';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import {
    fetchAdmitCardPages,
    createAdmitCardPage,
    updateAdmitCardPage,
    deleteAdmitCardPage
} from '../../../store/thunk/admitCardPageThunk';

const AdmitCardPagesManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pages, loading } = useSelector((state) => state.admitCardPages);

    const [activeTab, setActiveTab] = useState('manage');
    const [editingId, setEditingId] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = pages?.filter(page =>
        page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (page.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    useEffect(() => {
        dispatch(fetchAdmitCardPages({ includeInactive: 'true' }));
    }, [dispatch]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setIsActive(true);
        setSelectedFile(null);
        setImagePreview('');
        setEditingId(null);
    };

    const startAdd = () => {
        resetForm();
        setActiveTab('add');
    };

    const startEdit = (page) => {
        setEditingId(page._id);
        setTitle(page.title);
        setDescription(page.description || '');
        setIsActive(page.isActive !== false);
        setSelectedFile(null);
        setImagePreview(page.imageUrl || '');
        setActiveTab('add');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return toast.error('Title is required');
        setSaving(true);
        const loadingToast = toast.loading(editingId ? 'Updating...' : 'Adding...');

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('isActive', isActive);
            if (selectedFile) formData.append('image', selectedFile);

            if (editingId) {
                await dispatch(updateAdmitCardPage({ id: editingId, formData })).unwrap();
                toast.success('Page updated', { id: loadingToast });
            } else {
                await dispatch(createAdmitCardPage(formData)).unwrap();
                toast.success('Page created', { id: loadingToast });
            }

            resetForm();
            setActiveTab('manage');
        } catch (error) {
            toast.error('Failed to save page', { id: loadingToast });
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        const loadingToast = toast.loading('Deleting...');
        try {
            await dispatch(deleteAdmitCardPage(itemToDelete)).unwrap();
            toast.success('Deleted successfully', { id: loadingToast });
        } catch (error) {
            toast.error('Failed to delete', { id: loadingToast });
        } finally {
            setItemToDelete(null);
        }
    };

    const toggleActive = async (page) => {
        const formData = new FormData();
        formData.append('title', page.title);
        formData.append('description', page.description || '');
        formData.append('isActive', !page.isActive);
        const loadingToast = toast.loading('Updating...');
        try {
            await dispatch(updateAdmitCardPage({ id: page._id, formData })).unwrap();
            toast.success(!page.isActive ? 'Activated' : 'Deactivated', { id: loadingToast });
        } catch (error) {
            toast.error('Failed to update status', { id: loadingToast });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <FileText className="text-primary" /> Admit Card Pages
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage admit card page groups displayed on the public site.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={startAdd} icon="pluscircle">
                        Add University & College
                    </Button>
                </div>
            </div>

            <PopupModel
                isOpen={activeTab === 'add'}
                onClose={() => setActiveTab('manage')}
                title={editingId ? 'Edit Page' : 'Add New Page'}
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Admit Card A"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Description
                        </label>
                        <textarea
                            rows="3"
                            placeholder="Optional description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white font-medium resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Status
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsActive(!isActive)}
                            className={`flex items-center gap-2 w-full px-4 py-3 rounded-md font-bold text-sm transition-all ${isActive
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400'
                                : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-700 dark:text-slate-400'
                                }`}
                        >
                            {isActive ? <EyeOff size={16} /> : <EyeOff size={16} />}
                            {isActive ? 'Active' : 'Inactive'}
                        </button>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Header Image
                        </label>
                        <label className="flex flex-col items-center justify-center gap-2 w-full px-4 py-8 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 cursor-pointer transition-all">
                            <Upload size={24} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                {selectedFile ? selectedFile.name : 'Click to upload image'}
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={() => setActiveTab('manage')}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={saving} icon="save">
                            {editingId ? 'Update' : 'Publish'}
                        </Button>
                    </div>
                </form>
            </PopupModel>

            <div className={`transition-all duration-300 block`}>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search pages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Image</th>
                                    <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Details</th>
                                    <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {loading && filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-10 text-center">
                                            <Loader2 className="animate-spin text-primary inline-block mb-2" />
                                            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Loading...</p>
                                        </td>
                                    </tr>
                                ) : filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-300">
                                                    <FileText size={32} />
                                                </div>
                                                <p className="text-sm font-bold text-slate-400">{searchTerm ? 'No matching pages.' : 'No pages yet.'}</p>
                                                <Button variant="link" size="sm" onClick={startAdd}>Add your first page</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((page) => (
                                        <tr key={page._id}
                                            className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group cursor-pointer"
                                            onClick={() => navigate('/admin/admit-cards/' + page._id)}
                                        >
                                            <td className="p-4">
                                                <div className="size-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700 shadow-sm bg-slate-100">
                                                    {page.imageUrl ? (
                                                        <img src={page.imageUrl} alt={page.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <ImageIcon size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors text-[14px]">{page.title}</p>
                                                    {page.description && (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-medium mt-1">{page.description}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleActive(page); }}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${page.isActive
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                                        : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-700 dark:text-slate-400'
                                                        }`}
                                                >
                                                    <span className={`size-1.5 rounded-full ${page.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                                    {page.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="sm" onClick={() => navigate('/admin/admit-cards/' + page._id)} title="View Cards">
                                                        <ExternalLink size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => startEdit(page)} title="Edit">
                                                        <Edit size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => setItemToDelete(page._id)} title="Delete" className="hover:text-red-500 hover:bg-red-50">
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Page"
                message="All admit cards in this page will also be deleted. This cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default AdmitCardPagesManagement;
