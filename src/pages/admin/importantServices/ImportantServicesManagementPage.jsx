import { useState, useEffect } from 'react';
import {
    Save,
    Image as ImageIcon,
    FileText,
    List,
    PlusCircle,
    Trash2,
    Edit,
    Sparkles,
    Search,
    Clock,
    CheckCircle,
    Upload
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchImportantServices,
    createImportantService,
    updateImportantServiceStatus,
    updateImportantService,
    deleteImportantService
} from '../../../store/thunk/importantServiceThunk';

const ImportantServicesManagementPage = () => {
    const [activeTab, setActiveTab] = useState('manage'); // 'add' or 'manage'
    const [editingId, setEditingId] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Form state
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [summary, setSummary] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const dispatch = useDispatch();
    const { data: services, loading } = useSelector((state) => state.importantServices);

    useEffect(() => {
        dispatch(fetchImportantServices());
    }, [dispatch]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImageUrl(previewUrl);
        }
    };

    const startAdd = () => {
        setTitle('');
        setImageUrl('');
        setSummary('');
        setSelectedFile(null);
        setEditingId(null);
        setActiveTab('add');
    };

    const startEdit = (service) => {
        setEditingId(service._id);
        setTitle(service.title);
        setSummary(service.summary);
        setImageUrl(service.image || '');
        setSelectedFile(null);
        setActiveTab('add');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading(editingId ? 'Updating service...' : 'Adding service...');
        try {
            const serviceData = {
                title,
                image: imageUrl, // In real app, this would be the server response URL after upload
                summary,
                status: "active",
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            };

            if (editingId) {
                await dispatch(updateImportantService({ id: editingId, serviceData })).unwrap();
                toast.success("Successfully updated service", { id: loadingToast });
            } else {
                await dispatch(createImportantService(serviceData)).unwrap();
                toast.success("Successfully added service", { id: loadingToast });
            }

            // Reset form
            setTitle('');
            setImageUrl('');
            setSummary('');
            setSelectedFile(null);
            setEditingId(null);
            setActiveTab('manage');
        } catch (error) {
            toast.error(`Failed to ${editingId ? 'update' : 'add'} service`, { id: loadingToast });
        }
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        const loadingToast = toast.loading('Deleting service...');
        try {
            await dispatch(deleteImportantService(itemToDelete)).unwrap();
            toast.success('Service deleted successfully', { id: loadingToast });
        } catch (error) {
            toast.error('Failed to delete service', { id: loadingToast });
        } finally {
            setItemToDelete(null);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const loadingToast = toast.loading('Updating status...');
        const newStatus = currentStatus === 'active' ? 'draft' : 'active';
        try {
            await dispatch(updateImportantServiceStatus({ id, status: newStatus })).unwrap();
            toast.success(`Service ${newStatus === 'active' ? 'activated' : 'deactivated'}`, { id: loadingToast });
        } catch (error) {
            toast.error('Failed to update status', { id: loadingToast });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Important Services</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Manage core services displayed on the website.</p>
                </div>

                {/* Tab Switcher */}
                <div className="flex w-full sm:w-auto items-center p-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60">
                    <button
                        onClick={() => setActiveTab('manage')}
                        className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'manage'
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        <List size={16} />
                        Manage View
                    </button>
                    <button
                        onClick={startAdd}
                        className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'add'
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        <PlusCircle size={16} />
                        Add New
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {activeTab === 'add' ? (
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Text Content */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                                    <FileText className="text-primary" size={20} />
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Service Information</h2>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Service Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter service title..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-800 dark:text-white font-medium transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Detailed Summary</label>
                                    <textarea
                                        required
                                        rows="10"
                                        placeholder="Provide a detailed description of the service..."
                                        value={summary}
                                        onChange={(e) => setSummary(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-800 dark:text-white font-medium transition-all resize-none"
                                    />
                                </div>
                            </div>

                            {/* Right Column: Image Upload */}
                            <div className="flex flex-col space-y-6">
                                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                                    <ImageIcon className="text-amber-500" size={20} />
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Service Image</h2>
                                </div>

                                <div className="flex-1 flex flex-col space-y-4 pt-1">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Select Thumbnail</label>
                                    <div className="relative flex-1 min-h-[300px]">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="service-image-upload"
                                        />
                                        <label
                                            htmlFor="service-image-upload"
                                            className={`absolute inset-0 flex flex-col items-center justify-center gap-4 w-full h-full border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 overflow-hidden group
                                                ${imageUrl
                                                    ? 'border-transparent bg-slate-900 border-none'
                                                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            {imageUrl ? (
                                                <>
                                                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200">
                                                        <Upload size={32} className="mb-2" />
                                                        <span className="font-bold text-sm tracking-widest uppercase">Replace Image</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="size-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                        <Upload className="text-slate-400 group-hover:text-primary transition-colors" size={28} />
                                                    </div>
                                                    <div className="text-center px-6">
                                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Click to upload image</p>
                                                        <p className="text-xs text-slate-500 mt-2">Recommended: 1200x800px</p>
                                                    </div>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                    {selectedFile && (
                                        <p className="text-xs text-center font-semibold text-primary truncate px-2">
                                            {selectedFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5"
                            >
                                <Save size={18} />
                                {editingId ? 'Update Service' : 'Publish Service'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Management Table / Grid */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden relative">
                        {loading && (
                            <div className="absolute inset-0 bg-white/50 dark:bg-slate-800/50 z-10 flex items-center justify-center backdrop-blur-sm">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        )}
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search services..."
                                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary text-sm font-medium"
                                />
                            </div>
                            <button onClick={startAdd} className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all">
                                <PlusCircle size={16} />
                                Add Service
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                        <th className="p-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Service Information</th>
                                        <th className="p-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="p-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Date Added</th>
                                        <th className="p-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                                    {services.length > 0 ? services.map((service) => (
                                        <tr key={service._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-12 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700 shadow-xs">
                                                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">{service.title}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-medium mt-0.5">{service.summary}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => toggleStatus(service._id, service.status)}
                                                        className={`relative w-11 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 ${service.status === 'active' ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                                                    >
                                                        <div className={`size-4 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${service.status === 'active' ? 'translate-x-5' : 'translate-x-0'}`} />
                                                    </button>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${service.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                                        {service.status === 'active' ? 'Active' : 'Draft'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                                                    <Clock size={14} className="text-slate-400" />
                                                    {service.date}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => startEdit(service)} className="p-2 text-slate-400 hover:text-primary bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors" title="Edit Content">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => setItemToDelete(service._id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-lg transition-colors" title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="p-12 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-3">
                                                    <div className="size-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-300">
                                                        <Sparkles size={32} />
                                                    </div>
                                                    <p className="text-slate-500 font-bold">No services found. Add your first service to get started.</p>
                                                    <button onClick={() => setActiveTab('add')} className="text-primary font-bold hover:underline">Click here to add</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {itemToDelete && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setItemToDelete(null)}></div>
                    <div className="relative bg-white dark:bg-slate-800 w-full max-w-sm rounded-4xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 text-center flex flex-col items-center">
                            <div className="size-16 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-6">
                                <Trash2 className="text-red-500" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white mt-2">Delete Service</h3>
                            <p className="text-sm font-medium text-slate-500 mt-2">Are you sure? This action cannot be undone and will permanently remove this service from your website.</p>

                            <div className="grid grid-cols-2 gap-3 w-full mt-8">
                                <button
                                    onClick={() => setItemToDelete(null)}
                                    className="py-3.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="py-3.5 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-500/30 hover:bg-red-600 hover:-translate-y-0.5 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default ImportantServicesManagementPage;
