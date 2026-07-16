import { useState, useEffect } from 'react';
import AppIcon from '../../../components/ui/AppIcon';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/ui/Button';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import PopupModel from '../../../components/ui/PopupModel';
import {
    fetchImportantServices,
    createImportantService,
    updateImportantServiceStatus,
    updateImportantService,
    deleteImportantService
} from '../../../store/thunk/importantServiceThunk';

const ImportantServicesManagementPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        setIsModalOpen(true);
    };

    const startEdit = (service) => {
        setEditingId(service._id);
        setTitle(service.title);
        setSummary(service.summary);
        setImageUrl(service.image || '');
        setSelectedFile(null);
        setIsModalOpen(true);
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
            setIsModalOpen(false);
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
                        <AppIcon name="Sparkles" className="text-primary" /> Important Services
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage core services displayed on the website.</p>
                </div>
            </div>

            <PopupModel
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingId ? 'Edit Service' : 'Configure New Service'}
                maxWidth="max-w-2xl"
            >
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
                            rows="4"
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
                            {editingId ? 'Update Service' : 'Publish Service'}
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
                                placeholder="Search services..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium"
                            />
                        </div>
                        <Button onClick={startAdd} icon="PlusCircle" className="w-full md:w-auto">
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
                                            <AppIcon name="Loader2" className="animate-spin text-primary inline-block mb-2" />
                                            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Loading Records...</p>
                                        </td>
                                    </tr>
                                ) : filteredServices.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-300">
                                                    <AppIcon name="Sparkles" size={32} />
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
                                                    <div className="size-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700 shadow-sm bg-slate-100 flex items-center justify-center">
                                                        {service.image ? (
                                                            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <AppIcon name="Image" className="text-slate-400" size={24} />
                                                        )}
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
                                                        <AppIcon name="Edit" size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => setItemToDelete(service._id)} title="Delete Service" className="hover:text-red-500 hover:bg-red-50">
                                                        <AppIcon name="Trash2" size={16} />
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
            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Service"
                message="Are you sure? This action cannot be undone and will permanently remove this service from your website."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div >
    );
};

export default ImportantServicesManagementPage;
