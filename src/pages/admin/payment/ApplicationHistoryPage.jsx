import React, { useState, useEffect } from 'react';
import { CreditCard, FileText, Loader2, Eye, X, Image as ImageIcon, History, Check, Search, Filter, Trash2, Receipt, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplications, updateApplicationStatus, deleteApplication, removeApplicationDocument } from '../../../store/thunk/applicationThunk';
import { apiBaseUrl } from '../../../api/axios';
import InvoiceModal from '../../../components/InvoiceModal';
import ConfirmationModal from '../../../components/common/ConfirmationModal';

const ApplicationHistoryPage = ({ isComponent = false }) => {
    const dispatch = useDispatch();
    const { applications, loading } = useSelector((state) => state.applications);
    const [selectedAppForDocs, setSelectedAppForDocs] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToRemoveDoc, setItemToRemoveDoc] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const filteredApplications = applications.filter((app) => {
        const matchesSearch = searchTerm === '' ||
            app.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.article?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusConfig = {
        pending: { label: 'Pending', bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-500/20', dot: 'bg-amber-500' },
        approved: { label: 'Approved', bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/20', dot: 'bg-emerald-500' },
        rejected: { label: 'Rejected', bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-500/20', dot: 'bg-red-500' },
    };

    useEffect(() => {
        dispatch(fetchApplications());
    }, [dispatch]);

    const handleStatusUpdate = async (id, status) => {
        const loadingToast = toast.loading(`Updating status to ${status}...`);
        try {
            await dispatch(updateApplicationStatus({ id, status })).unwrap();
            toast.success(`Application marked as ${status}`, { id: loadingToast });
        } catch (error) {
            toast.error(error || "Failed to update status", { id: loadingToast });
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        const loadingToast = toast.loading('Deleting application...');
        try {
            await dispatch(deleteApplication(itemToDelete)).unwrap();
            toast.success('Application deleted successfully', { id: loadingToast });
        } catch (error) {
            toast.error(error || 'Failed to delete application', { id: loadingToast });
        } finally {
            setItemToDelete(null);
        }
    };

    const handleRemoveDoc = async () => {
        if (!itemToRemoveDoc) return;
        const loadingToast = toast.loading('Removing asset...');
        try {
            await dispatch(removeApplicationDocument({
                id: itemToRemoveDoc.appId,
                documentUrl: itemToRemoveDoc.url
            })).unwrap();
            toast.success('Asset removed successfully', { id: loadingToast });
        } catch (error) {
            toast.error(error || 'Failed to remove asset', { id: loadingToast });
        } finally {
            setItemToRemoveDoc(null);
        }
    };

    if (loading && applications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <div className="relative">
                    <div className="size-12 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-primary animate-spin"></div>
                    <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary size-5" />
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing Records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {!isComponent && (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <History className="text-primary" /> Application History
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Review user applications and payments.</p>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Search & Filter Bar */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row gap-3 justify-between items-center">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or service..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Filter size={16} className="text-slate-400 hidden md:block" />
                        {['all', 'pending', 'approved', 'rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${statusFilter === status
                                    ? status === 'all' ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                                        : status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                                            : status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                                : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                                    : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {status === 'all' ? 'All' : status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                <th className="p-4">User Details</th>
                                <th className="p-4">Service</th>
                                <th className="p-4">Type & Verification</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Applied Date</th>
                                <th className="p-4 text-right">Status Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredApplications.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="size-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300">
                                                <CreditCard size={32} />
                                            </div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No applications found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredApplications.map((app) => (
                                    <tr key={app._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {app.user?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-primary transition-colors">{app.user?.name || 'Unknown'}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium">{app.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">{app.article?.title || 'Unknown'}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-2 items-start">
                                                <span className={`px-2.5 py-1 text-nowrap rounded-lg text-[10px] font-black uppercase tracking-widest ${app.paymentType === 'payment' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'}`}>
                                                    {app.paymentType === 'payment' ? 'Full Payment' : 'Documents Only'}
                                                </span>

                                                {app.documents && app.documents.length > 0 ? (
                                                    <button
                                                        onClick={() => setSelectedAppForDocs(app)}
                                                        className="flex items-center gap-2 px-2 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-primary hover:text-white dark:hover:bg-primary text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-bold transition-all shadow-sm"
                                                    >
                                                        <FileText size={12} />
                                                        <span>Assets ({app.documents.length})</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">No Documents</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-black text-slate-800 dark:text-white text-sm">₹{app.amount.toLocaleString()}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                <span className="text-[10px] text-slate-500 font-medium">{new Date(app.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${statusConfig[app.status].bg} ${statusConfig[app.status].text} ${statusConfig[app.status].border}`}>
                                                    <span className={`size-1.5 rounded-full ${statusConfig[app.status].dot} ${app.status === 'pending' ? 'animate-pulse' : ''}`}></span>
                                                    {statusConfig[app.status].label}
                                                </span>

                                                <div className="relative">
                                                    <button
                                                        data-dropdown-id={app._id}
                                                        onClick={() => setOpenDropdown(openDropdown === app._id ? null : app._id)}
                                                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-200 dark:hover:bg-slate-700/50 rounded-xl transition-all"
                                                        aria-label="Actions"
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>

                                                    {openDropdown === app._id && (
                                                        <>
                                                            <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)}></div>
                                                            <div className="fixed z-50 w-48 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-y-auto max-h-[80vh] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 custom-scrollbar"
                                                                style={(() => {
                                                                    const btn = document.querySelector(`[data-dropdown-id="${app._id}"]`);
                                                                    if (!btn) return {};
                                                                    const rect = btn.getBoundingClientRect();
                                                                    const dropdownHeight = 280; // Estimated max height
                                                                    const spaceBelow = window.innerHeight - rect.bottom;

                                                                    if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
                                                                        // Show above if not enough space below but enough space above
                                                                        return { bottom: window.innerHeight - rect.top + 8, right: window.innerWidth - rect.right };
                                                                    }
                                                                    // Default: show below
                                                                    return { top: rect.bottom + 8, right: window.innerWidth - rect.right };
                                                                })()}
                                                            >
                                                                <div className="p-1.5 flex flex-col gap-0.5">
                                                                    <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Change Status</div>
                                                                    {Object.entries(statusConfig).map(([key, config]) => (
                                                                        <button
                                                                            key={key}
                                                                            onClick={() => {
                                                                                if (key !== app.status) handleStatusUpdate(app._id, key);
                                                                                setOpenDropdown(null);
                                                                            }}
                                                                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${app.status === key
                                                                                ? `${config.bg} ${config.text}`
                                                                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                                                                }`}
                                                                        >
                                                                            <span className={`size-2 rounded-full ${config.dot}`}></span>
                                                                            <span className="flex-1 text-left uppercase tracking-widest">{config.label}</span>
                                                                            {app.status === key && <Check size={14} className={config.text} />}
                                                                        </button>
                                                                    ))}

                                                                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2"></div>

                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedInvoice(app);
                                                                            setOpenDropdown(null);
                                                                        }}
                                                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
                                                                    >
                                                                        <Receipt size={14} className="text-primary" />
                                                                        <span className="flex-1 text-left uppercase tracking-widest">View Invoice</span>
                                                                    </button>

                                                                    <button
                                                                        onClick={() => {
                                                                            setItemToDelete(app._id);
                                                                            setOpenDropdown(null);
                                                                        }}
                                                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                                                                    >
                                                                        <Trash2 size={14} className="text-red-500" />
                                                                        <span className="flex-1 text-left uppercase tracking-widest">Delete Record</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Asset Modal */}
            {selectedAppForDocs && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm shadow-sm" onClick={() => setSelectedAppForDocs(null)}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <FileText className="text-primary" /> Submitted Assets
                            </h2>
                            <button onClick={() => setSelectedAppForDocs(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2 custom-scrollbar">
                            {selectedAppForDocs.documents.map((doc, idx) => {
                                const fullUrl = doc.startsWith('http') ? doc : `${apiBaseUrl}${doc}`;
                                const isImage = doc.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                                return (
                                    <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col gap-3 group/asset">
                                        {isImage ? (
                                            <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
                                                <img src={fullUrl} alt="doc" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/asset:opacity-100 flex flex-col items-center justify-center text-white transition-opacity font-bold text-xs gap-3">
                                                    <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg transition-all">
                                                        <Eye size={16} /> View Full
                                                    </a>
                                                    <button
                                                        onClick={() => setItemToRemoveDoc({ appId: selectedAppForDocs._id, url: doc })}
                                                        className="flex items-center gap-2 px-4 py-2 bg-red-500/80 hover:bg-red-600 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={16} /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative aspect-square flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 group/file">
                                                <FileText className="text-slate-300 size-12 mb-4" />
                                                <div className="flex flex-col gap-2 w-full px-4">
                                                    <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-all">
                                                        <Eye size={14} /> Open
                                                    </a>
                                                    <button
                                                        onClick={() => setItemToRemoveDoc({ appId: selectedAppForDocs._id, url: doc })}
                                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-all"
                                                    >
                                                        <Trash2 size={14} /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        <p className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-widest">Asset #{idx + 1}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Application Delete Modal */}
            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleDelete}
                title="Delete Application"
                message="Are you sure? This will permanently remove this application record and cannot be undone."
                confirmText="Delete Record"
                type="danger"
            />

            {/* Asset Remove Modal */}
            <ConfirmationModal
                isOpen={!!itemToRemoveDoc}
                onClose={() => setItemToRemoveDoc(null)}
                onConfirm={handleRemoveDoc}
                title="Remove Asset"
                message="Are you sure you want to remove this specific document from the record? This cannot be undone."
                confirmText="Remove Asset"
                type="warning"
            />

            {/* Invoice Modal */}
            {selectedInvoice && (
                <InvoiceModal
                    application={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                />
            )}
        </div>
    );
};

export default ApplicationHistoryPage;
