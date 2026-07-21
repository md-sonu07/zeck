import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile } from '../../../store/thunk/userThunk';
import {
    User, Mail, Shield, LogOut, BadgeCheck, Bookmark, ChevronRight,
    Send, MessageCircle, CreditCard, Clock, CheckCircle2, XCircle, Eye, FileText, X, Edit, Phone, Loader2, Save, Camera, Upload
} from 'lucide-react';
import WhatsAppIcon from '../../../components/common/WhatsAppIcon';
import { ProfileSkeleton } from '../../../components/common/Skeleton';

import { logout as logoutUser } from '../../../store/thunk/authThunk';
import { fetchMyApplications } from '../../../store/thunk/applicationThunk';
import { fetchMyAdmissions } from '../../../store/slice/admissionSlice';
import { fetchContactSettings } from '../../../store/thunk/contactThunk';

import { useNavigate, Link } from 'react-router-dom';
import { apiBaseUrl } from '../../../api/axios';
import toast from 'react-hot-toast';
import SEO from '../../../components/common/SEO';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userDetails, loading } = useSelector((state) => state.user);
    const { userInfo } = useSelector((state) => state.auth);
    const { myApplications, loading: appsLoading } = useSelector((state) => state.applications);
    const { myApplications: myAdmissions, loading: admissionsLoading } = useSelector((state) => state.admissions);
    const { settings: contactSettings } = useSelector((state) => state.contact);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!userInfo || !userInfo._id) {
            navigate('/login', { replace: true });
        } else {
            dispatch(getProfile());
            dispatch(fetchMyApplications());
            dispatch(fetchMyAdmissions());
            dispatch(fetchContactSettings());
        }
    }, [dispatch, userInfo, navigate]);


    const combinedActivities = [
        ...(myApplications || []).map(app => ({
            ...app,
            activityType: 'application',
            title: app.article?.title || 'Unknown Post',
            date: app.createdAt,
            displayAmount: app.amount || 0,
            displayType: app.paymentType === 'payment' ? 'Direct Payment' : 'Documents Only'
        })),
        ...(myAdmissions || []).map(adm => ({
            ...adm,
            activityType: 'admission',
            title: adm.course?.name || 'Course Application',
            date: adm.submittedAt,
            displayAmount: adm.course?.totalFee || 0,
            displayType: 'Course Admission',
            documents: (adm.documents || []).flatMap(d => d.files || [])
        }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Consolidate all documents from all applications for the "All Data" view
    const allDocuments = combinedActivities?.reduce((acc, app) => {
        let flatDocs = [];
        if (app.activityType === 'application') {
            flatDocs = app.documents || [];
        } else if (app.activityType === 'admission') {
            flatDocs = (app.documents || []).flatMap(d => d.files || []);
        }

        if (flatDocs.length > 0) {
            flatDocs.forEach(docUrl => {
                acc.push({
                    url: docUrl,
                    appName: app.title,
                    status: app.status,
                    date: app.date,
                    appId: app._id,
                    fullApp: app
                });
            });
        }
        return acc;
    }, []) || [];

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleEditProfile = () => {
        setEditName(userDetails?.name || '');
        setEditEmail(userDetails?.email || '');
        setEditPhone(userDetails?.phone || '');
        setAvatarPreview(userDetails?.avatar || null);
        setAvatarFile(null);
        setIsEditModalOpen(true);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const formData = new FormData();
            formData.append('name', editName);
            formData.append('email', editEmail);
            formData.append('phone', editPhone);
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            await dispatch(updateProfile(formData)).unwrap();
            setIsEditModalOpen(false);
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err || 'Failed to update profile');
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    const savedCount = userDetails?.savedPosts?.length ?? userInfo?.savedPosts?.length ?? 0;

    if (loading) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="min-h-[80vh] bg-slate-100 dark:bg-slate-950 py-10 px-4">
            <SEO
                title="My Profile"
                description="Your personal profile on Zoya Education Center."
                noindex={true}
            />
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-5">

                    {/* Profile Box */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

                            {/* Banner with Avatar + Profile Details */}
                            <div className="bg-linear-to-r from-primary via-blue-500 to-indigo-600 relative overflow-hidden p-6 md:p-8">
                                <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                                <div className="absolute -bottom-16 -right-16 size-48 bg-white/5 rounded-full blur-3xl"></div>

                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-5 md:gap-6">
                                    {/* Avatar */}
                                    <div className="size-36 rounded-3xl md:rounded-2xl bg-white/20 backdrop-blur-sm p-[4px] md:p-[3px] shadow-2xl shadow-black/30 md:shadow-lg shrink-0 ring-2 ring-white/30 md:ring-0">
                                        <div className="size-full rounded-[22px] md:rounded-[13px] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                                            {userDetails?.avatar ? (
                                                <img src={userDetails.avatar} alt="Avatar" className="size-full object-cover" />
                                            ) : (
                                                <span className="text-4xl md:text-3xl font-black text-primary select-none tracking-tight">{getInitials(userDetails?.name)}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Name + Email */}
                                    <div className="flex-1 text-center md:text-left min-w-0">
                                        <h1 className="text-2xl font-bold text-white hidden md:block">{userDetails?.name || 'User'}</h1>
                                        <p className="text-sm text-blue-100 mt-0.5 truncate hidden md:block">{userDetails?.email}</p>
                                        <div className="inline-flex items-center max-md:hidden gap-1.5 mt-2 px-3 py-1 bg-white/15 rounded-full border border-white/20">
                                            <BadgeCheck size={11} className="text-white" />
                                            <span className="text-[9px] font-bold text-white uppercase tracking-widest">{userDetails?.isAdmin ? 'Admin' : 'Member'}</span>
                                        </div>
                                    </div>

                                    {/* Info Cards */}
                                    <div className="flex items-center gap-2 md:gap-3 ">
                                        <Link to="/admin" className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-center min-w-[75px]">
                                            <p className="text-[10px] text-blue-200 font-semibold mb-0.5">Role</p>
                                            <p className="text-xs font-bold text-white">{userDetails?.isAdmin ? 'Admin' : 'Member'}</p>
                                        </Link>
                                        <Link to="/saved-posts" className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-center min-w-[75px] hover:bg-white/20 transition-colors">
                                            <p className="text-[10px] text-blue-200 font-semibold mb-0.5">Saved</p>
                                            <p className="text-lg font-black text-white leading-none">{savedCount}</p>
                                        </Link>
                                        <div className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-center min-w-[75px]">
                                            <p className="text-[10px] text-blue-200 font-semibold mb-0.5">Status</p>
                                            <p className="text-xs font-bold text-green-300">Active ✓</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detail Rows */}
                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                <div className="flex md:hidden items-center justify-between px-6 md:px-8 py-4">
                                    <div className="flex items-center gap-3">
                                        <User size={15} className="text-primary" />
                                        <span className="text-xs font-black text-slate-500">Name</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-700 dark:text-slate-200">{userDetails?.name}</span>
                                </div>
                                <div className="flex items-center justify-between px-6 md:px-8 py-4">
                                    <div className="flex items-center gap-3">
                                        <Mail size={15} className="text-primary" />
                                        <span className="text-xs font-black text-slate-500">Email</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-700 dark:text-slate-200">{userDetails?.email}</span>
                                </div>
                                <div className="flex items-center justify-between px-6 md:px-8 py-4">
                                    <div className="flex items-center gap-3">
                                        <Phone size={15} className="text-green-500" />
                                        <span className="text-xs font-black text-slate-500">Phone</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-700 dark:text-slate-200">{userDetails?.phone || 'Not Provided'}</span>
                                </div>
                                <div className="flex items-center justify-between px-6 md:px-8 py-4">
                                    <div className="flex items-center gap-3">
                                        <Shield size={15} className="text-orange-500" />
                                        <span className="text-xs font-black text-slate-500">Role</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-700 dark:text-slate-200">{userDetails?.isAdmin ? 'Admin' : 'Member'}</span>
                                </div>


                            </div>

                            {/* Bottom Buttons */}
                            <div className="border-t border-slate-100 dark:border-slate-800 px-4 md:px-8 py-4 md:py-5 flex flex-col md:flex-row md:items-center gap-3">
                                {userDetails?.isAdmin && (
                                    <Link to="/admin" className="flex items-center justify-center gap-2.5 px-4 py-4 md:px-5 md:py-2.5 w-full md:w-auto bg-primary text-white rounded-2xl md:rounded-xl text-xs md:text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all active:scale-95 shadow-lg shadow-primary/25">
                                        <Shield size={18} className="md:hidden" /><Shield size={14} className="hidden md:block" /> Admin Panel
                                    </Link>
                                )}
                                <button onClick={handleEditProfile} className="flex-1 md:flex-none text-nowrap flex items-center justify-center gap-2 px-4 py-4 md:px-5 md:py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl md:rounded-xl text-xs md:text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all active:scale-95">
                                    <Edit size={16} className="md:size-3.5 group-hover:rotate-4 transition-transform" /> Edit Profile
                                </button>
                                {/* Saved + Logout row */}
                                <div className="flex items-center gap-3 w-full md:w-auto md:ml-auto">
                                    <Link to="/saved-posts" className="flex-1 md:flex-none text-nowrap flex items-center justify-center gap-2 px-4 py-4 md:px-5 md:py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl md:rounded-xl text-xs md:text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all active:scale-95">
                                        <Bookmark size={18} className="md:hidden" /><Bookmark size={14} className="hidden md:block" /> Saved Posts
                                        {savedCount > 0 && <span className="bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">{savedCount}</span>}
                                    </Link>
                                    <button onClick={handleLogout} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-4 md:px-5 md:py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl md:rounded-xl text-xs md:text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10 dark:hover:text-red-400 transition-all active:scale-95 cursor-pointer">
                                        <LogOut size={18} className="md:hidden" /><LogOut size={14} className="hidden md:block" /> Log Out
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Activities Section: History & Documents */}
                        <div className="mt-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="px-6 md:px-8 py-5 border-b border-slate-50 dark:border-slate-800">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                        <Clock className="text-primary" size={20} /> My Activities
                                    </h2>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                {appsLoading || admissionsLoading ? (
                                    <div className="p-10 flex flex-col items-center justify-center gap-3">
                                        <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                        <p className="text-xs font-bold text-slate-400 italic">Fetching...</p>
                                    </div>
                                ) : (
                                    combinedActivities?.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <div className="size-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200 dark:border-slate-700">
                                                <CreditCard className="text-slate-300" size={30} />
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Applications Found</h3>
                                            <p className="text-xs text-slate-500 mt-1 max-w-[240px] mx-auto">You haven't submitted any applications or payments yet.</p>
                                        </div>
                                    ) : (
                                        combinedActivities.map((app) => (
                                            <div key={app._id} onClick={() => navigate('/my-applications')} className="px-4 md:px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer border-b border-slate-50 dark:border-slate-800 last:border-0">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${app.status === 'approved' ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10' :
                                                            app.status === 'rejected' ? 'bg-rose-50 text-rose-500 dark:bg-rose-500/10' :
                                                                'bg-amber-50 text-amber-500 dark:bg-amber-500/10'
                                                            }`}>
                                                            {app.status === 'approved' ? <CheckCircle2 size={20} /> :
                                                                app.status === 'rejected' ? <XCircle size={20} /> :
                                                                    <Clock size={20} />}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-primary transition-colors">
                                                                    {app.title}
                                                                </h3>
                                                                <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded sm:hidden ${app.status === 'approved' ? 'text-emerald-500 bg-emerald-50' :
                                                                    app.status === 'rejected' ? 'text-rose-500 bg-rose-50' : 'text-amber-500 bg-amber-50'
                                                                    }`}>{app.status}</span>
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(app.date).toLocaleDateString()}</span>
                                                                <span className="size-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">₹{app.displayAmount?.toLocaleString('en-IN')}</span>
                                                                <span className="size-1 bg-slate-200 dark:bg-slate-700 rounded-full hidden sm:block"></span>
                                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md hidden sm:block">
                                                                    {app.displayType}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-end gap-3 shrink-0">
                                                        <div className="hidden sm:block text-right">
                                                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${app.status === 'approved' ? 'text-emerald-500' :
                                                                app.status === 'rejected' ? 'text-rose-500' : 'text-amber-500'
                                                                }`}>{app.status}</p>
                                                            <p className="text-[9px] font-bold text-slate-400 mt-0.5">Application State</p>
                                                        </div>
                                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-72 shrink-0 space-y-5">
                        <Link to="/saved-posts" className="block bg-linear-to-br from-primary to-indigo-600 rounded-2xl p-5 shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all group overflow-hidden relative">
                            <div className="absolute -top-10 -right-10 size-32 bg-white/5 rounded-full blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="size-10 rounded-xl bg-white/15 flex items-center justify-center">
                                        <Bookmark size={18} className="text-white" />
                                    </div>
                                    <ChevronRight size={18} className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </div>
                                <h3 className="text-sm font-bold text-white mb-0.5">Saved Collection</h3>
                                <p className="text-[10px] text-blue-200">Your bookmarked articles</p>
                                <div className="mt-3 pt-3 border-t border-white/15 flex items-center gap-2">
                                    <span className="text-2xl font-black text-white">{savedCount}</span>
                                    <span className="text-[9px] font-bold text-blue-200 uppercase tracking-widest">Posts Saved</span>
                                </div>
                            </div>
                        </Link>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MessageCircle size={11} /> Community</h3>
                            </div>
                            <div className="p-4 space-y-2">
                                <a href={contactSettings?.telegramLink || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <div className="size-8 bg-[#2CA5E0] rounded-lg flex items-center justify-center text-white shrink-0"><Send size={13} /></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">Telegram</p>
                                        <p className="text-[10px] text-slate-400">{contactSettings?.telegramSub || "Instant alerts"}</p>
                                    </div>
                                </a>
                                <a href={contactSettings?.whatsappLink || "#"} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <div className="size-8 bg-[#25D366] rounded-lg flex items-center justify-center text-white shrink-0"><WhatsAppIcon size={13} /></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">WhatsApp</p>
                                        <p className="text-[10px] text-slate-400">{contactSettings?.whatsappSub || "Quick support"}</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsEditModalOpen(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="mb-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Edit Profile</h2>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Update your identification</p>
                                </div>
                                <button onClick={() => setIsEditModalOpen(false)} className="p-2.5 cursor-pointer bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 rounded-2xl transition-all active:scale-90">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="space-y-5">
                                {/* Avatar Upload */}
                                {userDetails?.isAdmin && (
                                    <div className="flex flex-col items-center gap-4 mb-2">
                                        <div className="relative group">
                                            <div className="size-24 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-200 dark:border-slate-700 group-hover:border-primary transition-colors">
                                                {avatarPreview ? (
                                                    <img src={avatarPreview} alt="Preview" className="size-full object-cover" />
                                                ) : (
                                                    <User size={32} className="text-slate-300" />
                                                )}
                                                <div className="absolute rounded-xl inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                                    <Camera size={20} className="text-white" />
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={handleAvatarChange}
                                                />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 p-1.5 bg-primary text-white rounded-lg shadow-lg">
                                                <Upload size={12} />
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Photo</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Full Name</label>
                                    <div className="group relative transition-all duration-300">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary/50 transition-all placeholder:text-slate-400"
                                            placeholder="Full Name"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Email Address</label>
                                    <div className="group relative transition-all duration-300">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary/50 transition-all placeholder:text-slate-400"
                                            placeholder="Email Address"
                                            value={editEmail}
                                            onChange={(e) => setEditEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">Phone Number</label>
                                    <div className="group relative transition-all duration-300">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary/50 transition-all placeholder:text-slate-400"
                                            placeholder="Phone Number"
                                            value={editPhone}
                                            onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ''))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-primary hover:bg-primary-dark disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all duration-200"
                                >
                                    {isUpdating ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
