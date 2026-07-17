import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Eye, Trash2, CheckCircle, XCircle, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import {
    fetchAllAdmissions, updateAdmissionStatus, deleteAdmission, bulkUpdateAdmissionStatus
} from '../../../store/slice/admissionSlice.js';
import { fetchCourses } from '../../../store/slice/courseSlice.js';

const statusColors = {
    pending: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400',
    under_review: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400',
    approved: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400',
    rejected: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400',
    waitlisted: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400',
    changes_requested: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400',
    withdrawn: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
};

const ApplicationsManagementPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: admissions, loading } = useSelector((state) => state.admissions);
    const { data: courses } = useSelector((state) => state.courses);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [selected, setSelected] = useState([]);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchAllAdmissions());
        dispatch(fetchCourses());
    }, [dispatch]);

    const filtered = admissions.filter(a => {
        if (statusFilter && a.status !== statusFilter) return false;
        if (courseFilter && a.course?._id !== courseFilter) return false;
        if (searchTerm) {
            const s = searchTerm.toLowerCase();
            if (!a.applicationId?.toLowerCase().includes(s) &&
                !a.personalInfo?.fullName?.toLowerCase().includes(s) &&
                !a.contactInfo?.mobile?.includes(s)) return false;
        }
        return true;
    });

    const handleStatusUpdate = async (id, status) => {
        const remarks = status === 'changes_requested' ? prompt('Enter changes requested:') : '';
        const loadingToast = toast.loading('Updating...');
        try {
            await dispatch(updateAdmissionStatus({ id, status, remarks })).unwrap();
            toast.success(`Application ${status.replace('_', ' ')}`, { id: loadingToast });
        } catch (err) {
            toast.error('Failed', { id: loadingToast });
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        const loadingToast = toast.loading('Deleting...');
        try {
            await dispatch(deleteAdmission(itemToDelete)).unwrap();
            toast.success('Deleted', { id: loadingToast });
        } catch (err) {
            toast.error('Failed', { id: loadingToast });
        } finally {
            setItemToDelete(null);
        }
    };

    const handleBulk = async (status) => {
        if (selected.length === 0) return toast.error('No applications selected');
        if (!confirm(`${status} ${selected.length} application(s)?`)) return;
        const loadingToast = toast.loading('Processing...');
        try {
            await dispatch(bulkUpdateAdmissionStatus({ ids: selected, status })).unwrap();
            toast.success(`${selected.length} updated`, { id: loadingToast });
            setSelected([]);
        } catch (err) {
            toast.error('Failed', { id: loadingToast });
        }
    };

    const getStatusLabel = (status) => status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <ClipboardList className="text-primary" /> Applications
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Review, approve, reject, and manage student applications.</p>
                </div>
                {selected.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">{selected.length} selected</span>
                        <Button size="sm" onClick={() => handleBulk('approved')} className="bg-emerald-600 hover:bg-emerald-700 text-white">Approve</Button>
                        <Button size="sm" onClick={() => handleBulk('rejected')} className="bg-red-600 hover:bg-red-700 text-white">Reject</Button>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder="Search by ID, name, mobile..." value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium" />
                        </div>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="">All Status</option>
                            {['pending', 'under_review', 'approved', 'rejected', 'waitlisted', 'changes_requested'].map(s => (
                                <option key={s} value={s}>{getStatusLabel(s)}</option>
                            ))}
                        </select>
                        <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)}
                            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="">All Courses</option>
                            {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest w-10">
                                    <input type="checkbox" onChange={e => { if (e.target.checked) setSelected(filtered.map(a => a._id)); else setSelected([]); }}
                                        checked={selected.length === filtered.length && filtered.length > 0} />
                                </th>
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">App ID</th>
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Student</th>
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Mobile</th>
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Course</th>
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading && filtered.length === 0 ? (
                                <tr><td colSpan="8" className="p-10 text-center">
                                    <Loader2 className="animate-spin text-primary inline-block mb-2" />
                                    <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Loading...</p>
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="8" className="p-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-300"><ClipboardList size={32} /></div>
                                        <p className="text-sm font-bold text-slate-400">{searchTerm || statusFilter || courseFilter ? 'No matching applications.' : 'No applications yet.'}</p>
                                    </div>
                                </td></tr>
                            ) : filtered.map(admission => (
                                <tr key={admission._id} onClick={() => navigate(`/admin/applications/${admission._id}`)}
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group cursor-pointer">
                                    <td className="p-4" onClick={e => e.stopPropagation()}>
                                        <input type="checkbox" checked={selected.includes(admission._id)}
                                            onChange={e => {
                                                if (e.target.checked) setSelected([...selected, admission._id]);
                                                else setSelected(selected.filter(id => id !== admission._id));
                                            }} />
                                    </td>
                                    <td className="p-4">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">{admission.applicationId}</span>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-slate-800 dark:text-white text-[14px]">{admission.personalInfo?.fullName}</p>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-slate-600 dark:text-slate-300">{admission.contactInfo?.mobile}</td>
                                    <td className="p-4">
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{admission.course?.name}</span>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-slate-500">{new Date(admission.submittedAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${statusColors[admission.status] || 'bg-slate-100 text-slate-500'}`}>
                                            <span className={`size-1.5 rounded-full ${admission.status === 'approved' ? 'bg-emerald-500 animate-pulse' : admission.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                                            {getStatusLabel(admission.status)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/applications/${admission._id}`)} title="View">
                                                <Eye size={16} />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleStatusUpdate(admission._id, 'approved')} title="Approve" className="hover:text-emerald-500 hover:bg-emerald-50">
                                                <CheckCircle size={16} />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleStatusUpdate(admission._id, 'rejected')} title="Reject" className="hover:text-red-500 hover:bg-red-50">
                                                <XCircle size={16} />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => setItemToDelete(admission._id)} title="Delete" className="hover:text-red-500 hover:bg-red-50">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleDelete}
                title="Delete Application"
                message="This application will be soft-deleted."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default ApplicationsManagementPage;
