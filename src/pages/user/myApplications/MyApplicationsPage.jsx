import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Eye, Download, XCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchMyAdmissions, updateAdmissionStatus } from '../../../store/slice/admissionSlice.js';
import SEO from '../../../components/common/SEO.jsx';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    under_review: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    waitlisted: 'bg-purple-100 text-purple-800',
    changes_requested: 'bg-orange-100 text-orange-800',
    withdrawn: 'bg-gray-100 text-gray-800'
};

const MyApplicationsPage = () => {
    const dispatch = useDispatch();
    const { myApplications, loading } = useSelector((state) => state.admissions);

    useEffect(() => {
        dispatch(fetchMyAdmissions());
    }, [dispatch]);

    const handleWithdraw = async (id) => {
        if (!confirm('Withdraw this application?')) return;
        try {
            await dispatch(updateAdmissionStatus({ id, status: 'withdrawn' })).unwrap();
            toast.success('Application withdrawn');
        } catch (err) { toast.error(err); }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Applications</h1>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : myApplications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg mb-4">You haven't submitted any applications yet.</p>
                    <Link to="/courses" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark">
                        Browse Courses
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {myApplications.map(app => (
                        <div key={app._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-mono text-gray-500">{app.applicationId}</p>
                                    <h3 className="font-semibold">{app.course?.name}</h3>
                                    <p className="text-sm text-gray-500">Submitted: {new Date(app.submittedAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded text-xs ${statusColors[app.status] || 'bg-gray-100'}`}>
                                        {app.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplicationsPage;