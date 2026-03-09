import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaymentSlips, deletePaymentSlip } from '../../../store/slice/paymentSlipSlice';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2, Eye, FileText, AlertCircle, FileDown } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../../components/common/ConfirmationModal';


const PaymentSlipsPage = () => {
    const dispatch = useDispatch();
    const { paymentSlips, loading, error } = useSelector((state) => state.paymentSlips);
    const [searchTerm, setSearchTerm] = useState('');
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchPaymentSlips());
    }, [dispatch]);

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
                <Link
                    to="/admin/payment-slips/create"
                    className="btn-slate-premium"
                >
                    <Plus size={20} />
                    Generate Slip
                </Link>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Invoice #, Name, or Email..."
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
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-sm">Invoice #</th>
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-sm">Date</th>
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-sm">Student</th>
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-sm">Amount</th>
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-sm">Status</th>
                                    <th className="p-4 font-semibold text-slate-600 dark:text-slate-400 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredSlips?.map((slip) => (
                                    <tr key={slip._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                        <td className="p-4 font-medium text-slate-900 dark:text-white">
                                            {slip.invoiceNumber}
                                        </td>
                                        <td className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                            {new Date(slip.date).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium text-slate-900 dark:text-white">{slip.studentName}</p>
                                            <p className="text-xs text-slate-500">{slip.studentEmail}</p>
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
                                                {/* Passing view=true to auto-open the preview modal */}
                                                <Link
                                                    to={`/admin/payment-slips/create?slipId=${slip._id}&view=true`}
                                                    className="p-2 text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="View receipt"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => setItemToDelete(slip._id)}
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
        </div>
    );
};

export default PaymentSlipsPage;
