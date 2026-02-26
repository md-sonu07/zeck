import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../../../store/thunk/userThunk';
import {
    User, Mail, Shield, LogOut, BadgeCheck, Bookmark, ChevronRight,
    Eye, Calendar, Heart, ExternalLink, Send, MessageCircle
} from 'lucide-react';
import { logout as logoutUser } from '../../../store/thunk/authThunk';
import { useNavigate, Link } from 'react-router-dom';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userDetails, loading } = useSelector((state) => state.user);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const savedCount = userDetails?.savedPosts?.length || userInfo?.savedPosts?.length || 0;

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] bg-slate-100 dark:bg-slate-950 py-10 px-4">
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
                                    <div className="size-20 md:size-24 rounded-2xl bg-white/15 backdrop-blur-sm p-[3px] shadow-lg shrink-0">
                                        <div className="size-full rounded-[13px] bg-white dark:bg-slate-900 flex items-center justify-center">
                                            <span className="text-2xl md:text-3xl font-black text-primary select-none">{getInitials(userDetails?.name)}</span>
                                        </div>
                                    </div>

                                    {/* Name + Email */}
                                    <div className="flex-1 text-center md:text-left min-w-0">
                                        <h1 className="text-xl md:text-2xl font-bold text-white">{userDetails?.name || 'User'}</h1>
                                        <p className="text-sm text-blue-100 mt-0.5 truncate">{userDetails?.email}</p>
                                        <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-white/15 rounded-full border border-white/20">
                                            <BadgeCheck size={11} className="text-white" />
                                            <span className="text-[9px] font-bold text-white uppercase tracking-widest">{userDetails?.isAdmin ? 'Admin' : 'Member'}</span>
                                        </div>
                                    </div>

                                    {/* Info Cards */}
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-center min-w-[75px]">
                                            <p className="text-[10px] text-blue-200 font-semibold mb-0.5">Role</p>
                                            <p className="text-xs font-bold text-white">{userDetails?.isAdmin ? 'Admin' : 'Member'}</p>
                                        </div>
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
                                <div className="flex items-center justify-between px-6 md:px-8 py-4">
                                    <div className="flex items-center gap-3">
                                        <Mail size={15} className="text-primary" />
                                        <span className="text-xs font-semibold text-slate-500">Email</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{userDetails?.email}</span>
                                </div>
                                <div className="flex items-center justify-between px-6 md:px-8 py-4">
                                    <div className="flex items-center gap-3">
                                        <Shield size={15} className="text-orange-500" />
                                        <span className="text-xs font-semibold text-slate-500">Role</span>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{userDetails?.isAdmin ? 'Administrator' : 'Member'}</span>
                                </div>
                            
                                <div className="flex items-center justify-between px-6 md:px-8 py-4">
                                    <div className="flex items-center gap-3">
                                        <User size={15} className="text-green-500" />
                                        <span className="text-xs font-semibold text-slate-500">Status</span>
                                    </div>
                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">Active ✓</span>
                                </div>
                            </div>

                            {/* Bottom Buttons */}
                            <div className="border-t border-slate-100 dark:border-slate-800 px-6 md:px-8 py-5 flex flex-wrap gap-3">
                                {userDetails?.isAdmin && (
                                    <Link to="/admin" className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all active:scale-95 shadow-lg shadow-primary/25">
                                        <Shield size={14} /> Admin Panel
                                    </Link>
                                )}
                                <Link to="/saved-posts" className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all active:scale-95">
                                    <Bookmark size={14} /> Saved Posts
                                    {savedCount > 0 && <span className="bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">{savedCount}</span>}
                                </Link>
                                <button onClick={handleLogout} className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10 dark:hover:text-red-400 transition-all active:scale-95 cursor-pointer">
                                    <LogOut size={14} /> Log Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-72 shrink-0 space-y-5">
                        {/* Saved Collection */}
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

                        {/* Community */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MessageCircle size={11} /> Community</h3>
                            </div>
                            <div className="p-4 space-y-2">
                                <a href="https://t.me/zoyacenter" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <div className="size-8 bg-[#2CA5E0] rounded-lg flex items-center justify-center text-white shrink-0"><Send size={13} /></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">Telegram</p>
                                        <p className="text-[10px] text-slate-400">Instant alerts</p>
                                    </div>
                                </a>
                                <a href="#" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <div className="size-8 bg-[#25D366] rounded-lg flex items-center justify-center text-white shrink-0"><MessageCircle size={13} /></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">WhatsApp</p>
                                        <p className="text-[10px] text-slate-400">Quick support</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
