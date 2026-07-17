import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, PlusCircle, Edit, Trash2, Search, Loader2, Image as ImageIcon, ArrowUp, ArrowDown, RotateCcw, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import PopupModel from '../../../components/ui/PopupModel';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import {
    fetchCourseCategories, createCourseCategory, updateCourseCategory,
    deleteCourseCategory, restoreCourseCategory, reorderCourseCategories
} from '../../../store/slice/courseCategorySlice.js';

const CourseCategoriesManagementPage = ({ hideHeader = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: categories, loading } = useSelector((state) => state.courseCategories);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToRestore, setItemToRestore] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: '', description: '', isActive: true });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => { dispatch(fetchCourseCategories()); }, [dispatch]);

    const activeCategories = categories.filter(c => !c.deletedAt).sort((a, b) => a.order - b.order);
    const deletedCategories = categories.filter(c => c.deletedAt);
    const filteredItems = activeCategories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        setForm({ name: '', description: '', isActive: true });
        setImageFile(null);
        setImagePreview('');
        setEditingId(null);
    };

    const startAdd = () => {
        resetForm();
        setShowForm(true);
    };

    const startEdit = (cat) => {
        setEditingId(cat._id);
        setForm({ name: cat.name, description: cat.description || '', isActive: cat.isActive });
        setImagePreview(cat.image || '');
        setImageFile(null);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return toast.error('Category name is required');
        setSaving(true);
        const loadingToast = toast.loading(editingId ? 'Updating...' : 'Creating...');
        try {
            const fd = new FormData();
            fd.append('name', form.name);
            fd.append('description', form.description);
            fd.append('isActive', form.isActive);
            if (imageFile) fd.append('image', imageFile);
            if (editingId) {
                await dispatch(updateCourseCategory({ id: editingId, formData: fd })).unwrap();
                toast.success('Category updated', { id: loadingToast });
            } else {
                await dispatch(createCourseCategory(fd)).unwrap();
                toast.success('Category created', { id: loadingToast });
            }
            setShowForm(false);
            resetForm();
        } catch (err) {
            toast.error(err || 'Failed to save', { id: loadingToast });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        const loadingToast = toast.loading('Deleting...');
        try {
            await dispatch(deleteCourseCategory(itemToDelete)).unwrap();
            toast.success('Deleted', { id: loadingToast });
        } catch (err) {
            toast.error('Failed to delete', { id: loadingToast });
        } finally {
            setItemToDelete(null);
        }
    };

    const handleRestore = async () => {
        if (!itemToRestore) return;
        const loadingToast = toast.loading('Restoring...');
        try {
            await dispatch(restoreCourseCategory(itemToRestore)).unwrap();
            toast.success('Restored', { id: loadingToast });
        } catch (err) {
            toast.error('Failed to restore', { id: loadingToast });
        } finally {
            setItemToRestore(null);
        }
    };

    const handleReorder = async (id, direction) => {
        const idx = activeCategories.findIndex(c => c._id === id);
        if (idx === -1) return;
        const newIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= activeCategories.length) return;
        const orders = [
            { id: activeCategories[idx]._id, order: activeCategories[newIdx].order },
            { id: activeCategories[newIdx]._id, order: activeCategories[idx].order }
        ];
        try {
            await dispatch(reorderCourseCategories(orders)).unwrap();
            toast.success('Reordered');
        } catch (err) { toast.error(err); }
    };

    const toggleActive = async (cat) => {
        const fd = new FormData();
        fd.append('name', cat.name);
        fd.append('description', cat.description || '');
        fd.append('isActive', !cat.isActive);
        const loadingToast = toast.loading('Updating...');
        try {
            await dispatch(updateCourseCategory({ id: cat._id, formData: fd })).unwrap();
            toast.success(!cat.isActive ? 'Activated' : 'Deactivated', { id: loadingToast });
        } catch (err) {
            toast.error('Failed', { id: loadingToast });
        }
    };

    return (
        <div className="space-y-6">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${hideHeader ? 'mb-0' : ''}`}>
                {!hideHeader ? (
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <BookOpen className="text-primary" /> Course Categories
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Create and manage course categories displayed on the public site.</p>
                    </div>
                ) : (
                    <div></div>
                )}
                <div className="flex items-center gap-3">
                    <Button onClick={startAdd} icon="pluscircle">Add Category</Button>
                </div>
            </div>

            <PopupModel
                isOpen={showForm}
                onClose={() => { setShowForm(false); resetForm(); }}
                title={editingId ? 'Edit Category' : 'Add New Category'}
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <input type="text" required placeholder="e.g. Medical Courses" value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white font-medium" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Description</label>
                        <textarea rows="3" placeholder="Optional description..." value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white font-medium resize-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Status</label>
                        <button type="button" onClick={() => setForm({ ...form, isActive: !form.isActive })}
                            className={`flex items-center gap-2 w-full px-4 py-3 rounded-md font-bold text-sm transition-all ${form.isActive
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400'
                                : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-700 dark:text-slate-400'}`}>
                            <EyeOff size={16} />
                            {form.isActive ? 'Active' : 'Inactive'}
                        </button>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Category Image</label>
                        <label className="flex flex-col items-center justify-center gap-2 w-full px-4 py-6 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 cursor-pointer transition-all">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="h-20 object-contain" />
                            ) : (
                                <ImageIcon size={24} className="text-slate-400" />
                            )}
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                {imageFile ? imageFile.name : 'Click to upload image'}
                            </span>
                            <input type="file" className="hidden" accept="image/*" onChange={e => { setImageFile(e.target.files[0]); setImagePreview(URL.createObjectURL(e.target.files[0])); }} />
                        </label>
                    </div>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
                        <Button type="submit" loading={saving}>{editingId ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </PopupModel>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="Search categories..." value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium" />
                    </div>
                    {deletedCategories.length > 0 && (
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-md">
                            {deletedCategories.length} deleted — scroll to restore
                        </span>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest w-24">Order</th>
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Image</th>
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Name</th>
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Description</th>
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading && filteredItems.length === 0 ? (
                                <tr><td colSpan="6" className="p-10 text-center">
                                    <Loader2 className="animate-spin text-primary inline-block mb-2" />
                                    <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Loading...</p>
                                </td></tr>
                            ) : filteredItems.length === 0 ? (
                                <tr><td colSpan="6" className="p-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-300"><BookOpen size={32} /></div>
                                        <p className="text-sm font-bold text-slate-400">{searchTerm ? 'No matching categories.' : 'No categories yet.'}</p>
                                        <Button variant="link" size="sm" onClick={startAdd}>Add your first category</Button>
                                    </div>
                                </td></tr>
                            ) : filteredItems.map((cat, idx) => (
                                <tr key={cat._id} onClick={() => navigate(`/admin/courses/${cat._id}`)} className="cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                                    <td className="p-4" onClick={e => e.stopPropagation()}>
                                        <div className="flex items-center gap-1">
                                            <button onClick={(e) => { e.stopPropagation(); handleReorder(cat._id, 'up'); }} disabled={idx === 0}
                                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-30">
                                                <ArrowUp size={14} />
                                            </button>
                                            <span className="text-xs font-bold text-slate-400 w-5 text-center">{cat.order}</span>
                                            <button onClick={(e) => { e.stopPropagation(); handleReorder(cat._id, 'down'); }} disabled={idx === filteredItems.length - 1}
                                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-30">
                                                <ArrowDown size={14} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="size-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700 shadow-sm bg-slate-100">
                                            {cat.image ? (
                                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <ImageIcon size={20} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors text-[14px]">{cat.name}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-medium">{cat.description || '—'}</p>
                                    </td>
                                    <td className="p-4" onClick={e => e.stopPropagation()}>
                                        <button onClick={(e) => { e.stopPropagation(); toggleActive(cat); }}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${cat.isActive
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                                : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-700 dark:text-slate-400'}`}>
                                            <span className={`size-1.5 rounded-full ${cat.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                            {cat.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); startEdit(cat); }} title="Edit">
                                                <Edit size={16} />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setItemToDelete(cat._id); }} title="Delete" className="hover:text-red-500 hover:bg-red-50">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {deletedCategories.length > 0 && (
                    <div className="border-t border-slate-100 dark:border-slate-700">
                        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Deleted Categories ({deletedCategories.length})</h3>
                        </div>
                        <table className="w-full text-left border-collapse">
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {deletedCategories.map(cat => (
                                    <tr key={cat._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 text-sm text-slate-500 line-through">{cat.name}</td>
                                        <td className="p-4 text-xs text-slate-400">{cat.deletedAt ? new Date(cat.deletedAt).toLocaleDateString() : ''}</td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="sm" onClick={() => setItemToRestore(cat._id)} title="Restore">
                                                <RotateCcw size={16} className="text-emerald-600" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleDelete}
                title="Delete Category"
                message="This category will be soft-deleted and can be restored later."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
            <ConfirmationModal
                isOpen={!!itemToRestore}
                onClose={() => setItemToRestore(null)}
                onConfirm={handleRestore}
                title="Restore Category"
                message="Restore this deleted category?"
                confirmText="Restore"
                cancelText="Cancel"
                type="success"
            />
        </div>
    );
};

export default CourseCategoriesManagementPage;
