import { useState, useEffect } from 'react';
import {
    Save,
    Image as ImageIcon,
    List,
    PlusCircle,
    Trash2,
    Edit,
    Upload,
    Loader2,
    Search,
    ChevronLeft,
    Eye,
    EyeOff,
    Users,
    Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/ui/Button';
import TabButton from '../../../components/ui/TabButton';
import {
    fetchAllGallery,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem
} from '../../../store/thunk/galleryThunk';

const CATEGORIES = [
    { value: 'Our Team', icon: Users },
    { value: 'Highlights & Moments', icon: Sparkles },
];

const GalleryManagementPage = () => {
    const [activeTab, setActiveTab] = useState('manage');
    const [editingId, setEditingId] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
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
        setActiveTab('add');
    };

    const startEdit = (item) => {
        setEditingId(item._id);
        setTitle(item.title);
        setDescription(item.description || '');
        setCategory(item.category);
        setIsActive(item.isActive);
        setSelectedFile(null);
        setImagePreview(item.imageUrl);
        setActiveTab('add');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!category) {
            toast.error('Please select a category');
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
            setActiveTab('manage');
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
                        <ImageIcon className="text-primary" /> Gallery Management
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage images displayed on the public gallery page.</p>
                </div>
                <div className="flex items-center gap-3">
                    <TabButton
                        active={activeTab === 'manage'}
                        onClick={() => setActiveTab('manage')}
                        icon={List}
                    >
                        Manage
                    </TabButton>
                    <TabButton
                        active={activeTab === 'add'}
                        onClick={startAdd}
                        icon={PlusCircle}
                    >
                        Add New
                    </TabButton>
                </div>
            </div>

            <div className={`transition-all duration-300 ${activeTab === 'add' ? 'block' : 'hidden'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-slate-400">
                            <Button variant="ghost" size="sm" onClick={() => setActiveTab('manage')} className="border-r border-slate-100 dark:border-slate-700 rounded-none pr-2">
                                <ChevronLeft size={20} />
                            </Button>
                            <span className="text-xs font-bold uppercase tracking-widest">
                                {editingId ? 'Edit Gallery Item' : 'Add New Image'}
                            </span>
                        </div>

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
                                    {CATEGORIES.map(({ value: val, icon: Icon }) => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => setCategory(val)}
                                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-bold text-sm transition-all ${category === val
                                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-primary/50'
                                                }`}
                                        >
                                            <Icon size={16} />
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
                                    {isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                                    {isActive ? 'Active' : 'Inactive'}
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Image
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
                                <Button type="submit" loading={saving} icon={Save}>
                                    {editingId ? 'Update' : 'Publish'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Live Preview</h3>
                        </div>
                        <div className="flex-1 p-6 flex flex-col items-center justify-center bg-slate-50/30 dark:bg-slate-900/10">
                            <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden group">
                                <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-900 relative">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 opacity-20">
                                            <ImageIcon size={48} />
                                            <p className="text-[10px] font-bold uppercase tracking-widest mt-2">No Image</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded-lg">
                                            {category || 'Category'}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                            {isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                                        {title || 'Image Title'}
                                    </h3>
                                    {description && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 text-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Public View Mockup</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`transition-all duration-300 ${activeTab === 'manage' ? 'block' : 'hidden'}`}>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search gallery..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium"
                            />
                        </div>
                        <Button onClick={startAdd} icon={PlusCircle} className="w-full md:w-auto">
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
                                            <Loader2 className="animate-spin text-primary inline-block mb-2" />
                                            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Loading...</p>
                                        </td>
                                    </tr>
                                ) : filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-300">
                                                    <ImageIcon size={32} />
                                                </div>
                                                <p className="text-sm font-bold text-slate-400">No gallery items found.</p>
                                                <Button variant="link" size="sm" onClick={startAdd}>Add your first image</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item) => (
                                        <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                                            <td className="p-4">
                                                <div className="size-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700 shadow-sm bg-slate-100">
                                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
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
                                                        <Users size={14} className="text-primary" />
                                                    ) : (
                                                        <Sparkles size={14} className="text-primary" />
                                                    )}
                                                    <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                                                        {item.category}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => toggleActive(item)}
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
                                                    <Button variant="ghost" size="sm" onClick={() => startEdit(item)} title="Edit">
                                                        <Edit size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => setItemToDelete(item._id)} title="Delete" className="hover:text-red-500 hover:bg-red-50">
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

            {itemToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setItemToDelete(null)}></div>
                    <div className="relative bg-white dark:bg-slate-800 w-full max-w-sm rounded-4xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 text-center flex flex-col items-center">
                            <div className="size-16 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-6">
                                <Trash2 className="text-red-500" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white mt-2">Delete Gallery Item</h3>
                            <p className="text-sm font-medium text-slate-500 mt-2">Are you sure? This action cannot be undone.</p>
                            <div className="grid grid-cols-2 gap-3 w-full mt-8">
                                <Button variant="secondary" onClick={() => setItemToDelete(null)} className="w-full py-3.5 text-xs uppercase tracking-widest">
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={confirmDelete} className="w-full py-3.5 text-xs uppercase tracking-widest hover:-translate-y-0.5">
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryManagementPage;
