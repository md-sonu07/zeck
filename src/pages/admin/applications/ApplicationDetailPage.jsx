import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, ClipboardList, User, Phone, Mail, MapPin, GraduationCap, FileText, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchAdmissionById, clearCurrentAdmission, updateAdmissionStatus } from '../../../store/slice/admissionSlice.js';
import Button from '../../../components/ui/Button';

const statusColors = {
    pending: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400',
    under_review: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400',
    approved: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400',
    rejected: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400',
    waitlisted: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400',
    changes_requested: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400',
    withdrawn: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
};

const DetailRow = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">{value || '—'}</span>
    </div>
);

const SectionCard = ({ icon: Icon, title, children }) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2">
            <Icon size={16} className="text-primary" />
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest">{title}</h3>
        </div>
        <div className="p-5">{children}</div>
    </div>
);

const ApplicationDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentAdmission: app, loading } = useSelector((state) => state.admissions);

    useEffect(() => {
        dispatch(fetchAdmissionById(id));
        return () => dispatch(clearCurrentAdmission());
    }, [dispatch, id]);

    const handleStatus = async (status) => {
        const remarks = status === 'changes_requested' ? prompt('Enter changes requested:') : '';
        const loadingToast = toast.loading('Updating...');
        try {
            await dispatch(updateAdmissionStatus({ id, status, remarks })).unwrap();
            toast.success(`Application ${status.replace('_', ' ')}`, { id: loadingToast });
        } catch (err) {
            toast.error('Failed', { id: loadingToast });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-sm font-medium text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!app) {
        return (
            <div className="text-center py-20">
                <p className="text-lg font-bold text-slate-400">Application not found</p>
                <Button variant="link" onClick={() => navigate('/admin/applications')} className="mt-2">Back to Applications</Button>
            </div>
        );
    }

    const getStatusLabel = (s) => s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/admin/applications')}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <ArrowLeft size={18} className="text-slate-500" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{app.applicationId}</h1>
                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${statusColors[app.status] || ''}`}>
                                <span className={`size-1.5 rounded-full ${app.status === 'approved' ? 'bg-emerald-500 animate-pulse' : app.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                                {getStatusLabel(app.status)}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">Submitted {new Date(app.submittedAt).toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleStatus('approved')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <CheckCircle size={14} /> Approve
                    </Button>
                    <Button size="sm" onClick={() => handleStatus('rejected')} className="bg-red-600 hover:bg-red-700 text-white">
                        <XCircle size={14} /> Reject
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleStatus('under_review')}>
                        Mark Under Review
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleStatus('changes_requested')}>
                        Request Changes
                    </Button>
                </div>
            </div>

            {app.remarks && (
                <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-4 flex items-start gap-3">
                    <MessageSquare size={18} className="text-orange-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1">Remarks</p>
                        <p className="text-sm font-medium text-orange-800 dark:text-orange-200">{app.remarks}</p>
                    </div>
                </div>
            )}

            <SectionCard icon={User} title="Personal Information">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                    <DetailRow label="Full Name" value={app.personalInfo?.fullName} />
                    <DetailRow label="Father Name" value={app.personalInfo?.fatherName} />
                    <DetailRow label="Mother Name" value={app.personalInfo?.motherName} />
                    <DetailRow label="Gender" value={app.personalInfo?.gender} />
                    <DetailRow label="Date of Birth" value={app.personalInfo?.dateOfBirth ? new Date(app.personalInfo.dateOfBirth).toLocaleDateString() : null} />
                    <DetailRow label="Marital Status" value={app.personalInfo?.maritalStatus} />
                    <DetailRow label="Nationality" value={app.personalInfo?.nationality} />
                    <DetailRow label="Religion" value={app.personalInfo?.religion} />
                    <DetailRow label="Category" value={app.personalInfo?.category} />
                    <DetailRow label="Blood Group" value={app.personalInfo?.bloodGroup} />
                </div>
            </SectionCard>

            <SectionCard icon={Phone} title="Contact Information">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    <DetailRow label="Mobile" value={app.contactInfo?.mobile} />
                    <DetailRow label="Alternate Mobile" value={app.contactInfo?.alternateMobile} />
                    <DetailRow label="Email" value={app.contactInfo?.email} />
                </div>
            </SectionCard>

            <SectionCard icon={MapPin} title="Address Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Permanent Address</h4>
                        <div className="space-y-2.5">
                            <DetailRow label="Address" value={app.addressInfo?.permanent?.addressLine} />
                            <DetailRow label="State" value={app.addressInfo?.permanent?.state} />
                            <DetailRow label="District" value={app.addressInfo?.permanent?.district} />
                            <DetailRow label="City" value={app.addressInfo?.permanent?.city} />
                            <DetailRow label="Pincode" value={app.addressInfo?.permanent?.pincode} />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Current Address</h4>
                        {app.addressInfo?.sameAsPermanent ? (
                            <p className="text-sm italic text-slate-400">Same as permanent address</p>
                        ) : (
                            <div className="space-y-2.5">
                                <DetailRow label="Address" value={app.addressInfo?.current?.addressLine} />
                                <DetailRow label="State" value={app.addressInfo?.current?.state} />
                                <DetailRow label="District" value={app.addressInfo?.current?.district} />
                                <DetailRow label="City" value={app.addressInfo?.current?.city} />
                                <DetailRow label="Pincode" value={app.addressInfo?.current?.pincode} />
                            </div>
                        )}
                    </div>
                </div>
            </SectionCard>

            <SectionCard icon={GraduationCap} title="Education Information">
                {app.educationInfo?.length > 0 ? (
                    <div className="space-y-4">
                        {app.educationInfo.map((edu, i) => (
                            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                                <p className="text-xs font-bold text-primary uppercase mb-3">{edu.level || `Qualification #${i + 1}`}</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                    <DetailRow label="Board" value={edu.board} />
                                    <DetailRow label="Institution" value={edu.institution} />
                                    <DetailRow label="Roll Number" value={edu.rollNumber} />
                                    <DetailRow label="Passing Year" value={edu.passingYear} />
                                    <DetailRow label="Marks" value={edu.marks} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-400">No education details provided.</p>
                )}
            </SectionCard>

            <SectionCard icon={FileText} title="Uploaded Documents">
                {app.documents?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {app.documents.map((doc, i) => (
                            <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{doc.name}</p>
                                    <p className="text-[10px] text-slate-400">{doc.files?.length || 0} file(s)</p>
                                </div>
                                {doc.files?.map((url, fi) => (
                                    <a key={fi} href={url} target="_blank" rel="noopener noreferrer"
                                        className="text-xs font-bold text-primary hover:underline shrink-0">
                                        View
                                    </a>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-400">No documents uploaded.</p>
                )}
            </SectionCard>

            {app.answers?.length > 0 && (
                <SectionCard icon={FileText} title="Custom Question Responses">
                    <div className="space-y-3">
                        {app.answers.map((a, i) => (
                            <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{a.questionLabel}</p>
                                <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">
                                    {Array.isArray(a.answer) ? a.answer.join(', ') : a.answer || '—'}
                                </p>
                            </div>
                        ))}
                    </div>
                </SectionCard>
            )}

            <SectionCard icon={ClipboardList} title="Course Information">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <DetailRow label="Course" value={app.course?.name} />
                    <DetailRow label="Code" value={app.course?.courseCode} />
                    <DetailRow label="Duration" value={app.course?.duration} />
                    <DetailRow label="Eligibility" value={app.course?.eligibility} />
                </div>
            </SectionCard>

            <div className="flex items-center justify-center gap-3 pb-8">
                <Button onClick={() => handleStatus('approved')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6">
                    <CheckCircle size={16} /> Approve
                </Button>
                <Button onClick={() => handleStatus('rejected')} className="bg-red-600 hover:bg-red-700 text-white px-6">
                    <XCircle size={16} /> Reject
                </Button>
                <Button variant="secondary" onClick={() => navigate('/admin/applications')}>
                    Back to List
                </Button>
            </div>
        </div>
    );
};

export default ApplicationDetailPage;
