import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaymentSlips, deletePaymentSlip } from '../../../store/slice/paymentSlipSlice';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2, Eye, FileText, AlertCircle, FileDown, Settings, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import { fetchSlipSettings, updateSlipSettings } from '../../../store/thunk/slipSettingThunk';


const PaymentSlipsPage = () => {
    const dispatch = useDispatch();
    const { paymentSlips, loading, error } = useSelector((state) => state.paymentSlips);
    const { settings: slipSettings, loading: settingsLoading } = useSelector((state) => state.slipSetting);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    // Local state for settings editing
    const [tempUniversities, setTempUniversities] = useState([]);
    const [tempCourses, setTempCourses] = useState([]);
    const [newUniversity, setNewUniversity] = useState('');
    const [newCourse, setNewCourse] = useState('');

    useEffect(() => {
        dispatch(fetchPaymentSlips());
        dispatch(fetchSlipSettings());
    }, [dispatch]);

    useEffect(() => {
        if (slipSettings) {
            setTempUniversities(slipSettings.universities || []);
            setTempCourses(slipSettings.courses || []);
        }
    }, [slipSettings]);

    // Handle Delete
    const confirmDelete = async () => {
        if (!itemToDelete) return;
        const loadingToast = toast.loading('Deleting payment slip...');
        try {
            await dispatch(deletePaymentSlip(itemToDelete)).unwrap();
            toast.success('Payment slip deleted successfully', { id: loadingToast });
        } catch (err) {
            toast.error(err || 'Failed to delete payment slip', { id: loadingToast });
        } finally {
            setItemToDelete(null);
        }
    };

    // Filter slips
    const filteredSlips = paymentSlips?.filter(slip =>
        slip.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slip.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slip.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Settings Handlers
    const handleAddUniversity = () => {
        if (!newUniversity.trim()) return;
        if (tempUniversities.includes(newUniversity.trim())) {
            toast.error('University already exists');
            return;
        }
        setTempUniversities([...tempUniversities, newUniversity.trim()]);
        setNewUniversity('');
    };

    const handleRemoveUniversity = (index) => {
        setTempUniversities(tempUniversities.filter((_, i) => i !== index));
    };

    const handleAddCourse = () => {
        if (!newCourse.trim()) return;
        if (tempCourses.includes(newCourse.trim())) {
            toast.error('Course already exists');
            return;
        }
        setTempCourses([...tempCourses, newCourse.trim()]);
        setNewCourse('');
    };

    const handleRemoveCourse = (index) => {
        setTempCourses(tempCourses.filter((_, i) => i !== index));
    };

    const handleSaveSettings = async () => {
        const loadingToast = toast.loading('Saving settings...');
        try {
            await dispatch(updateSlipSettings({
                universities: tempUniversities,
                courses: tempCourses
            })).unwrap();
            toast.success('Settings updated successfully', { id: loadingToast });
            setShowSettingsModal(false);
        } catch (err) {
            toast.error(err || 'Failed to update settings', { id: loadingToast });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="text-primary" />
                        Payment Slips
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage generated payment receipts</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowSettingsModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all rounded-xl text-xs font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                        <Settings size={18} />
                        Slip Setting
                    </button>
                    <Link
                        to="/admin/payment-slips/create"
                        className="btn-slate-premium"
                    >
                        <Plus size={20} />
                        Generate Slip
                    </Link>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Invoice #, Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                    />
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {/* Main Content Area */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {loading && paymentSlips.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        Loading payment slips...
                    </div>
                ) : filteredSlips?.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                        <FileText size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                        <p className="font-medium text-lg text-slate-600 dark:text-slate-400">No payment slips found</p>
                        <p className="text-sm mt-1 mb-4">You haven't generated any payment slips yet.</p>
                        <Link
                            to="/admin/payment-slips/create"
                            className="text-primary hover:underline font-medium"
                        >
                            Create your first slip
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 text-nowrap dark:border-slate-700">
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-sm">Invoice #</th>
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-sm">Date</th>
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-sm">Student</th>
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-sm">Amount</th>
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-sm">Status</th>
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-nowrap dark:divide-slate-700">
                                {filteredSlips?.map((slip) => (
                                    <tr
                                        key={slip._id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group"
                                    >
                                        <td className="p-4 font-medium">
                                            <Link
                                                to={`/admin/payment-slips/create?slipId=${slip._id}&view=true`}
                                                className="text-slate-900 dark:text-white hover:text-primary transition-colors"
                                            >
                                                ZEC- {slip.invoiceNumber.slice(-4)}
                                            </Link>
                                        </td>
                                        <td className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                            {new Date(slip.date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <Link
                                                to={`/admin/payment-slips/create?slipId=${slip._id}&view=true`}
                                                className="block hover:opacity-80 transition-opacity"
                                            >
                                                <p className="font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">{slip.studentName}</p>
                                                <p className="text-xs text-slate-500">{slip.studentEmail}</p>
                                            </Link>
                                        </td>
                                        <td className="p-4 font-semibold text-slate-900 dark:text-emerald-400">
                                            ₹{slip.total}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${slip.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                slip.status === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                                                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {slip.status.toLowerCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/admin/payment-slips/create?slipId=${slip._id}&view=true`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="p-2 text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="View receipt"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setItemToDelete(slip._id);
                                                    }}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete slip"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Reusable Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Payment Slip"
                message="Are you sure? This will permanently remove this record and cannot be undone."
                confirmText="Delete"
                type="danger"
            />

            {/* Slip Settings Modal */}
            {showSettingsModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowSettingsModal(false)}></div>
                    <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
                            <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                                <Settings className="text-primary" />
                                Slip Generation Settings
                            </h2>
                            <button onClick={() => setShowSettingsModal(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-8 hide-scrollbar">
                            {/* Universities */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Universities Management</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newUniversity}
                                        onChange={(e) => setNewUniversity(e.target.value)}
                                        placeholder="Add new University name..."
                                        className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm dark:text-white"
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddUniversity()}
                                    />
                                    <button
                                        onClick={handleAddUniversity}
                                        className="px-4 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all active:scale-95 text-xs uppercase"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {tempUniversities.map((uni, idx) => (
                                        <div key={idx} className="flex items-center gap-2 pl-3 pr-1 py-1 bg-slate-100 dark:bg-slate-700/50 rounded-full border border-slate-200 dark:border-slate-600">
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{uni}</span>
                                            <button onClick={() => handleRemoveUniversity(idx)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-red-500 transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {tempUniversities.length === 0 && <p className="text-xs text-slate-400 italic">No universities added yet.</p>}
                                </div>
                            </div>

                            {/* Courses */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Courses Management</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newCourse}
                                        onChange={(e) => setNewCourse(e.target.value)}
                                        placeholder="Add new Course name..."
                                        className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm dark:text-white"
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddCourse()}
                                    />
                                    <button
                                        onClick={handleAddCourse}
                                        className="px-4 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all active:scale-95 text-xs uppercase"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {tempCourses.map((course, idx) => (
                                        <div key={idx} className="flex items-center gap-2 pl-3 pr-1 py-1 bg-slate-100 dark:bg-slate-700/50 rounded-full border border-slate-200 dark:border-slate-600">
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{course}</span>
                                            <button onClick={() => handleRemoveCourse(idx)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-red-500 transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {tempCourses.length === 0 && <p className="text-xs text-slate-400 italic">No courses added yet.</p>}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                            <button
                                onClick={handleSaveSettings}
                                disabled={settingsLoading}
                                className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-black rounded-xl hover:bg-primary/90 transition-all active:scale-95 text-sm uppercase tracking-widest shadow-md disabled:opacity-50"
                            >
                                <Save size={18} />
                                {settingsLoading ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentSlipsPage;
