import { useState, useEffect } from 'react';
import AppIcon from '../../../components/ui/AppIcon';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/ui/Button';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import PopupModel from '../../../components/ui/PopupModel';
import {
    fetchAllGallery,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem
} from '../../../store/thunk/galleryThunk';

const CATEGORIES = [
    { value: 'Our Team', icon: 'Users' },
    { value: 'Highlights & Moments', icon: 'Sparkles' },
];

const GalleryManagementPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [previewItem, setPreviewItem] = useState(null);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const [searchTerm, setSearchTerm] = useState('');

    const dispatch = useDispatch();
    const { allData: items, loading } = useSelector((state) => state.gallery);

    const filteredItems = items?.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    useEffect(() => {
        dispatch(fetchAllGallery());
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
        setCategory('');
        setIsActive(true);
        setSelectedFile(null);
        setImagePreview('');
        setEditingId(null);
    };

    const startAdd = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const startEdit = (item) => {
        setEditingId(item._id);
        setTitle(item.title);
        setDescription(item.description || '');
        setCategory(item.category);
        setIsActive(item.isActive);
        setSelectedFile(null);
        setImagePreview(item.imageUrl);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!category) {
            toast.error('Please select a category');
            return;
        }

        if (!editingId && !selectedFile) {
            toast.error('Please select an image');
            return;
        }
        setSaving(true);
        const loadingToast = toast.loading(editingId ? 'Updating...' : 'Adding...');

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('isActive', isActive);
            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            if (editingId) {
                await dispatch(updateGalleryItem({ id: editingId, formData })).unwrap();
                toast.success('Gallery item updated', { id: loadingToast });
            } else {
                await dispatch(createGalleryItem(formData)).unwrap();
                toast.success('Gallery item added', { id: loadingToast });
            }

            resetForm();
            setIsModalOpen(false);
        } catch (error) {
            toast.error(`Failed to ${editingId ? 'update' : 'add'} item`, { id: loadingToast });
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        const loadingToast = toast.loading('Deleting...');
        try {
            await dispatch(deleteGalleryItem(itemToDelete)).unwrap();
            toast.success('Deleted successfully', { id: loadingToast });
        } catch (error) {
            toast.error('Failed to delete', { id: loadingToast });
        } finally {
            setItemToDelete(null);
        }
    };

    const toggleActive = async (item) => {
        const loadingToast = toast.loading('Updating...');
        try {
            const formData = new FormData();
            formData.append('title', item.title);
            formData.append('description', item.description || '');
            formData.append('category', item.category);
            formData.append('isActive', !item.isActive);
            await dispatch(updateGalleryItem({ id: item._id, formData })).unwrap();
            toast.success(!item.isActive ? 'Activated' : 'Deactivated', { id: loadingToast });
        } catch (error) {
            toast.error('Failed to update status', { id: loadingToast });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <AppIcon name="Image" className="text-primary" /> Gallery Management
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage images displayed on the public gallery page.</p>
                </div>
            </div>

            <PopupModel
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? 'Edit Gallery Item' : 'Add New Image'}
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Title
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Annual Sports Day 2026"
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
                            Category
                        </label>
                        <div className="flex gap-3">
                            {CATEGORIES.map(({ value: val, icon: IconName }) => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setCategory(val)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-bold text-sm transition-all ${category === val
                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary/50'
                                        }`}
                                >
                                    <AppIcon name={IconName} size={16} />
                                    {val}
                                </button>
                            ))}
                        </div>
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
                            <AppIcon name={isActive ? 'Eye' : 'EyeOff'} size={16} />
                            {isActive ? 'Active' : 'Inactive'}
                        </button>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Image
                        </label>
                        <label className="flex flex-col items-center justify-center gap-2 w-full px-4 py-8 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 cursor-pointer transition-all">
                            <AppIcon name="Upload" size={24} className="text-slate-400" />
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
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
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
                            <AppIcon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search gallery..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium"
                            />
                        </div>
                        <Button onClick={startAdd} icon="PlusCircle" className="w-full md:w-auto">
                            Add Image
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Image</th>
                                    <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Details</th>
                                    <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {loading && filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-10 text-center">
                                            <AppIcon name="Loader2" className="animate-spin text-primary inline-block mb-2" />
                                            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Loading...</p>
                                        </td>
                                    </tr>
                                ) : filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-300">
                                                    <AppIcon name="Image" size={32} />
                                                </div>
                                                <p className="text-sm font-bold text-slate-400">No gallery items found.</p>
                                                <Button variant="link" size="sm" onClick={startAdd}>Add your first image</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item) => (
                                        <tr key={item._id} onClick={() => setPreviewItem(item)} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group cursor-pointer">
                                            <td className="p-4">
                                                <div className="size-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700 shadow-sm bg-slate-100 flex items-center justify-center">
                                                    {item.imageUrl ? (
                                                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <AppIcon name="Image" className="text-slate-400" size={24} />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors text-[14px]">{item.title}</p>
                                                    {item.description && (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-medium mt-1">{item.description}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1.5">
                                                    {item.category === 'Our Team' ? (
                                                        <AppIcon name="Users" size={14} className="text-primary" />
                                                    ) : (
                                                        <AppIcon name="Sparkles" size={14} className="text-primary" />
                                                    )}
                                                    <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                                                        {item.category}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleActive(item); }}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                                        item.isActive
                                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                                            : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-700 dark:text-slate-400'
                                                    }`}
                                                >
                                                    <span className={`size-1.5 rounded-full ${item.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                                    {item.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); startEdit(item); }} title="Edit">
                                                        <AppIcon name="Edit" size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setItemToDelete(item._id); }} title="Delete" className="hover:text-red-500 hover:bg-red-50">
                                                        <AppIcon name="Trash" size={16} />
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
                title="Delete Gallery Item"
                message="Are you sure? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />

            <PopupModel
                isOpen={!!previewItem}
                onClose={() => setPreviewItem(null)}
                title="Preview Gallery Image"
                maxWidth="max-w-3xl"
            >
                {previewItem && (
                    <div className="space-y-6">
                        <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden flex justify-center items-center p-4">
                            {previewItem.imageUrl ? (
                                <img src={previewItem.imageUrl} alt={previewItem.title} className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm" />
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                                    <AppIcon name="Image" size={48} className="mb-4" />
                                    <p>No image available</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{previewItem.title}</h3>
                                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                                    {previewItem.category}
                                </span>
                            </div>
                            {previewItem.description ? (
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{previewItem.description}</p>
                            ) : (
                                <p className="text-slate-400 dark:text-slate-500 text-sm italic">No description provided.</p>
                            )}
                        </div>
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                            <Button onClick={() => setPreviewItem(null)} variant="secondary">
                                Close Preview
                            </Button>
                        </div>
                    </div>
                )}
            </PopupModel>
        </div>
    );
};

export default GalleryManagementPage;
