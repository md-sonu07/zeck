import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Eye, Download, XCircle, FileText, User, Mail, Phone, MapPin, BookOpen, GraduationCap, Calendar, CheckCircle2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchMyAdmissions, updateAdmissionStatus } from '../../../store/slice/admissionSlice.js';
import SEO from '../../../components/common/SEO.jsx';
import { CategorySkeleton } from '../../../components/common/Skeleton';
import { apiBaseUrl } from '../../../api/axios';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    under_review: 'bg-blue-100 text-blue-800 border-blue-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    waitlisted: 'bg-purple-100 text-purple-800 border-purple-200',
    changes_requested: 'bg-orange-100 text-orange-800 border-orange-200',
    withdrawn: 'bg-gray-100 text-gray-800 border-gray-200'
};

const MyApplicationsPage = () => {
    const dispatch = useDispatch();
    const { myApplications, loading } = useSelector((state) => state.admissions);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        dispatch(fetchMyAdmissions());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <SEO title="My Applications | Zoya Education Center" />
            
            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setPreviewImage(null)}>
                    <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setPreviewImage(null)} className="absolute -top-12 right-0 p-2 text-white hover:text-red-400 bg-white/10 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                        <img src={previewImage} alt="Document Preview" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">My Applications</h1>
                        <p className="text-sm text-slate-500 mt-2">View the complete details of your submitted applications.</p>
                    </div>
                    <Link to="/profile" className="text-primary cursor-pointer text-nowrap hover:underline text-sm font-semibold">
                        &larr; Back to Profile
                    </Link>
                </div>

                {loading ? (
                    <CategorySkeleton />
                ) : myApplications.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
                        <div className="size-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="text-slate-300 dark:text-slate-600" size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Applications Found</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">You haven't submitted any course applications yet. Start exploring our courses to apply.</p>
                        <Link to="/courses" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30">
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {myApplications.map(app => (
                            <div key={app._id} className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                                {/* Header Section */}
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 border-b border-slate-200 dark:border-slate-700">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                                                <span className="px-3 py-1 bg-white dark:bg-slate-900 rounded-lg text-xs font-bold text-slate-500 font-mono border border-slate-200 dark:border-slate-700 shadow-sm truncate max-w-[200px]">
                                                    ID: {app.applicationId}
                                                </span>
                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold border uppercase tracking-wider ${statusColors[app.status] || 'bg-gray-100'}`}>
                                                    {app.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-tight">{app.course?.name || 'Course Application'}</h2>
                                            <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                                                <Calendar size={14} /> Submitted on {new Date(app.submittedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                                    {/* Left Column */}
                                    <div className="space-y-8">
                                        {/* Personal Info */}
                                        <section>
                                            <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <User size={14} /> Personal Information
                                            </h3>
                                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 md:p-5 border border-slate-100 dark:border-slate-700/50 space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-slate-400">Full Name</p>
                                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{app.personalInfo?.fullName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-slate-400">Date of Birth</p>
                                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                            {app.personalInfo?.dateOfBirth ? new Date(app.personalInfo.dateOfBirth).toLocaleDateString() : 'N/A'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-slate-400">Father's Name</p>
                                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{app.personalInfo?.fatherName || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-slate-400">Mother's Name</p>
                                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{app.personalInfo?.motherName || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-slate-400">Gender</p>
                                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 capitalize">{app.personalInfo?.gender || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-slate-400">Category</p>
                                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 capitalize">{app.personalInfo?.category || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Contact & Address */}
                                        <section>
                                            <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <MapPin size={14} /> Contact & Address
                                            </h3>
                                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 md:p-5 border border-slate-100 dark:border-slate-700/50 space-y-5">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-slate-400">Email Address</p>
                                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{app.contactInfo?.email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-slate-400">Mobile Number</p>
                                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{app.contactInfo?.mobile}</p>
                                                    </div>
                                                </div>
                                                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Permanent Address</p>
                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                                                        {app.addressInfo?.permanent?.addressLine}, {app.addressInfo?.permanent?.city}, <br />
                                                        {app.addressInfo?.permanent?.district}, {app.addressInfo?.permanent?.state} - {app.addressInfo?.permanent?.pincode}
                                                    </p>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Additional Details (Custom Answers) */}
                                        {app.customAnswers && app.customAnswers.length > 0 && (
                                            <section>
                                                <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <BookOpen size={14} /> Additional Details
                                                </h3>
                                                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 md:p-5 border border-slate-100 dark:border-slate-700/50 space-y-4">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {app.customAnswers.map((answer, i) => (
                                                            <div key={i}>
                                                                <p className="text-[10px] uppercase font-bold text-slate-400">{answer.questionLabel}</p>
                                                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{answer.answer}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </section>
                                        )}
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-8">
                                        {/* Education */}
                                        <section>
                                            <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <GraduationCap size={14} /> Educational Qualifications
                                            </h3>
                                            <div className="space-y-3">
                                                {app.educationInfo && app.educationInfo.length > 0 ? (
                                                    app.educationInfo.map((edu, idx) => (
                                                        <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                            <div>
                                                                <p className="font-bold text-slate-800 dark:text-slate-200">{edu.level}</p>
                                                                <p className="text-xs font-medium text-slate-500 mt-0.5">{edu.board} • {edu.passingYear}</p>
                                                            </div>
                                                            <div className="sm:text-right">
                                                                <p className="text-[10px] uppercase font-bold text-slate-400">Obtained Marks</p>
                                                                <p className="font-black text-primary">{edu.marks}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-slate-500 italic p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">No educational details provided.</p>
                                                )}
                                            </div>
                                        </section>

                                        {/* Documents */}
                                        <section>
                                            <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <FileText size={14} /> Uploaded Documents
                                            </h3>
                                            <div className="space-y-3">
                                                {app.documents && app.documents.length > 0 ? (
                                                    app.documents.map((docGroup, groupIdx) => (
                                                        <div key={groupIdx} className="space-y-2">
                                                            {docGroup.files && docGroup.files.length > 0 ? (
                                                                docGroup.files.map((file, fileIdx) => {
                                                                    const fullUrl = file.startsWith('http') ? file : `${apiBaseUrl}${file}`;
                                                                    const isImage = file.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                                                                    const extractedFileName = fullUrl.split('/').pop().replace(/^[a-zA-Z0-9]+-\d+_?/, '');
                                                                    const displayName = docGroup.name.toLowerCase() === 'documents' ? extractedFileName : docGroup.name;
                                                                    
                                                                    return (
                                                                        <div key={`${groupIdx}-${fileIdx}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-3 sm:gap-0 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="size-10 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700/50">
                                                                                    {isImage ? <Eye size={16} className="text-primary" /> : <FileText size={16} className="text-primary" />}
                                                                                </div>
                                                                                <div className="min-w-0">
                                                                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                                                                                        {displayName} {docGroup.files.length > 1 ? `(Part ${fileIdx + 1})` : ''}
                                                                                    </p>
                                                                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{isImage ? 'Image File' : 'Document'}</p>
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            {isImage ? (
                                                                                <button 
                                                                                    onClick={() => setPreviewImage(fullUrl)}
                                                                                    className="w-full sm:w-auto text-center px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                                                                                >
                                                                                    Preview
                                                                                </button>
                                                                            ) : (
                                                                                <a 
                                                                                    href={fullUrl} 
                                                                                    target="_blank" 
                                                                                    rel="noreferrer"
                                                                                    className="w-full sm:w-auto justify-center px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-xs font-bold transition-colors shadow-sm inline-flex items-center gap-2"
                                                                                >
                                                                                    View <Eye size={12} />
                                                                                </a>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })
                                                            ) : null}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-slate-500 italic p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">No documents uploaded.</p>
                                                )}
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplicationsPage;