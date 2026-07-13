import { useState, useEffect } from 'react';
import {
    Save,
    Image as ImageIcon,
    List,
    PlusCircle,
    Trash2,
    Edit,
    Clock,
    Upload,
    Loader2,
    Sparkles,
    Search,
    ChevronLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/ui/Button';
import TabButton from '../../../components/ui/TabButton';
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
    const [saving, setSaving] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [summary, setSummary] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    // Search state
    const [searchTerm, setSearchTerm] = useState('');

    const dispatch = useDispatch();
    const { data: services, loading } = useSelector((state) => state.importantServices);

    const filteredServices = services?.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.summary.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

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
        setSaving(true);
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
        } finally {
            setSaving(false);
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Sparkles className="text-primary" /> Important Services
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage core services displayed on the website.</p>
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
                    {/* Form Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-slate-400">
                            <Button variant="ghost" size="sm" onClick={() => setActiveTab('manage')} className="border-r border-slate-100 dark:border-slate-700 rounded-none pr-2">
                                <ChevronLeft size={20} />
                            </Button>
                            <span className="text-xs font-bold uppercase tracking-widest">
                                {editingId ? 'Edit Service' : 'Configure New Service'}
                            </span>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Service Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Overseas Admissions"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Summary / Description
                                </label>
                                <textarea
                                    required
                                    rows="6"
                                    placeholder="Enter a brief summary of the service..."
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white font-medium resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Service Thumbnail
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
                                    {editingId ? 'Update Service' : 'Publish Service'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Preview Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Live Preview</h3>
                        </div>

                        <div className="flex-1 p-6 flex flex-col items-center justify-center bg-slate-50/30 dark:bg-slate-900/10">
                            <div className="w-full max-w-[340px] bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden group">
                                <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-900 relative">
                                    {imageUrl ? (
                                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 opacity-20">
                                            <ImageIcon size={48} />
                                            <p className="text-[10px] font-bold uppercase tracking-widest mt-2">No Image</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 space-y-3">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                                        {title || 'Service Title Placeholder'}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                        {summary || 'The service description will appear here. This provides users with a brief overview of the value proposition.'}
                                    </p>
                                    <div className="pt-2 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5"><Clock size={12} /> Just Now</span>
                                        <span className="text-primary group-hover:underline cursor-pointer">Learn More →</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 text-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Public Website Mockup</span>
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
                                placeholder="Search services..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium"
                            />
                        </div>
                        <Button onClick={startAdd} icon={PlusCircle} className="w-full md:w-auto">
                            Add Service
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest uppercase">Service Details</th>
                                    <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest uppercase">Status</th>
                                    <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {loading && filteredServices.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="p-10 text-center">
                                            <Loader2 className="animate-spin text-primary inline-block mb-2" />
                                            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Loading Records...</p>
                                        </td>
                                    </tr>
                                ) : filteredServices.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-300">
                                                    <Sparkles size={32} />
                                                </div>
                                                <p className="text-sm font-bold text-slate-400">No services found.</p>
                                                <Button variant="link" size="sm" onClick={startAdd}>Add your first service</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredServices.map((service) => (
                                        <tr key={service._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700 shadow-sm bg-slate-100">
                                                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors text-[14px]">{service.title}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-medium mt-1">{service.summary}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => toggleStatus(service._id, service.status)}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${service.status === 'active'
                                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 shadow-xs'
                                                            : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600'
                                                        }`}
                                                >
                                                    <span className={`size-1.5 rounded-full ${service.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                                    {service.status === 'active' ? 'Active' : 'Draft'}
                                                </button>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => startEdit(service)} title="Edit Service">
                                                        <Edit size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => setItemToDelete(service._id)} title="Delete Service" className="hover:text-red-500 hover:bg-red-50">
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
        </div >
    );
};

export default ImportantServicesManagementPage;
