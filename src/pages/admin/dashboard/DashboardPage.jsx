import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import {
    Users,
    Briefcase,
    FileText,
    CheckCircle,
    TrendingUp,
    Clock,
    Loader2,
    AlertCircle,
    Files,
    CreditCard,
    MessageSquare
} from 'lucide-react';

import { getDashboardStats } from '../../../store/thunk/dashboardThunk';

const StatCard = ({ title, value, icon: Icon, color, trend, isLoading }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/60 flex items-start justify-between card-lift stat-card group">
            <div className="flex-1">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                {isLoading ? (
                    <div className="h-9 w-24 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-lg mt-1"></div>
                ) : (
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{value}</h3>
                )}

                {trend && !isLoading && (
                    <div className="flex items-center gap-1 mt-3 text-xs font-bold text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-md w-fit">
                        <TrendingUp size={12} />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
            <div className={`size-12 rounded-xl flex items-center justify-center text-white shadow-lg ${color} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                <Icon size={24} />
            </div>
        </div>
    );
};

const DashboardPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { stats, recentActivity, isLoading, error } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(getDashboardStats());
    }, [dispatch]);

    const handleActivityClick = (activity) => {
        switch (activity.type) {
            case 'user':
                navigate('/admin/users');
                break;
            case 'payment':
                navigate('/admin/payments');
                break;
            case 'contact':
                navigate('/admin/contact-messages');
                break;
            case 'admin_log':
                if (activity.action.toLowerCase().includes('payment slip')) {
                    navigate('/admin/payment-slips');
                } else {
                    navigate('/admin/activities');
                }
                break;
            case 'article':
            default:
                navigate('/admin/activities');
                break;
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Latest Jobs': return Briefcase;
            case 'Admit Card': return FileText;
            case 'Result': return CheckCircle;
            case 'User': return Users;
            case 'Payment': return CreditCard;
            case 'Contact': return MessageSquare;
            default: return FileText;
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'Latest Jobs': return "text-blue-500 bg-blue-50 dark:bg-blue-500/10";
            case 'Admit Card': return "text-amber-500 bg-amber-50 dark:bg-amber-500/10";
            case 'Result': return "text-purple-500 bg-purple-50 dark:bg-purple-500/10";
            case 'User': return "text-green-500 bg-green-50 dark:bg-green-500/10";
            case 'Payment': return "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10";
            case 'Contact': return "text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10";
            default: return "text-slate-500 bg-slate-50 dark:bg-slate-500/10";
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-full mb-4">
                    <AlertCircle className="text-red-500" size={48} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Failed to Load Dashboard</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">{error}</p>
                <button
                    onClick={() => dispatch(getDashboardStats())}
                    className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
                >
                    Retry Loading
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Welcome back! Here's what's happening today.</p>
                </div>
                {isLoading && <Loader2 className="animate-spin text-primary" size={24} />}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    icon={Users}
                    color="bg-linear-to-br from-primary to-blue-600"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Admit Cards"
                    value={stats?.totalAdmitCards || 0}
                    icon={FileText}
                    color="bg-linear-to-br from-amber-500 to-orange-600"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Results Out"
                    value={stats?.totalResults || 0}
                    icon={CheckCircle}
                    color="bg-linear-to-br from-purple-500 to-indigo-600"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Total Posts"
                    value={stats?.totalArticles || 0}
                    icon={Files}
                    color="bg-linear-to-br from-pink-500 to-rose-600"
                    isLoading={isLoading}
                />
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Recent Activity</h2>
                        <Link to="/admin/activities" className="text-primary text-sm font-semibold hover:underline">View All</Link>
                    </div>

                    <div className="p-6">
                        {isLoading && recentActivity.length === 0 ? (
                            <div className="space-y-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex gap-4 animate-pulse">
                                        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-700"></div>
                                        <div className="flex-1 space-y-2 mt-1">
                                            <div className="h-4 w-1/3 bg-slate-100 dark:bg-slate-700 rounded"></div>
                                            <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-700 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : recentActivity.length > 0 ? (
                            <>
                                <div className="space-y-6">
                                    {recentActivity.map((activity, index) => (
                                        <div
                                            key={activity.id + index}
                                            onClick={() => handleActivityClick(activity)}
                                            className="flex gap-4 relative group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-3 -mx-3 -my-1 rounded-xl transition-all"
                                        >
                                            {/* Timeline line */}
                                            {index !== recentActivity.length - 1 && (
                                                <div className="absolute top-[44px] left-[31px] bottom-[-28px] w-px bg-slate-200 dark:bg-slate-700"></div>
                                            )}
                                            <div className={`size-10 rounded-full flex items-center justify-center shrink-0 z-10 ${getColor(activity.iconType)} group-hover:scale-110 transition-transform`}>
                                                {React.createElement(getIcon(activity.iconType), { size: 18 })}
                                            </div>
                                            <div className="flex-1 mt-0.5">
                                                <p className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">{activity.action}</p>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">{activity.details}</p>
                                                <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-slate-400">
                                                    <Clock size={12} />
                                                    {formatTime(activity.time)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    to="/admin/activities"
                                    className="mt-6 -mx-6 -mb-6 p-4 block text-center border-t border-slate-100 dark:border-slate-700/60 text-sm font-bold text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all rounded-b-2xl"
                                >
                                    View All Activity
                                </Link>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-slate-500 dark:text-slate-400 font-medium">No recent activity found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700/60">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Quick Actions</h2>
                    </div>
                    <div className="p-4 space-y-2">
                        <button
                            onClick={() => navigate('/admin/latest-news')}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left group"
                        >
                            <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 dark:text-white">Post a Job / News</p>
                                <p className="text-xs text-slate-500 font-medium tracking-wide border border-transparent">Create a new listing</p>
                            </div>
                        </button>
                        <button
                            onClick={() => navigate('/admin/admit-cards')}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left group"
                        >
                            <div className="size-10 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 dark:text-white">Upload Admit Card</p>
                                <p className="text-xs text-slate-500 tracking-wide font-medium">Publish new admit card link</p>
                            </div>
                        </button>
                        <button
                            onClick={() => navigate('/admin/results')}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left group"
                        >
                            <div className="size-10 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 dark:text-white">Declare Result</p>
                                <p className="text-xs text-slate-500 tracking-wide font-medium">Add new exam results</p>
                            </div>
                        </button>
                        <button
                            onClick={() => navigate('/admin/payment-slips/create')}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left group"
                        >
                            <div className="size-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <CreditCard size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 dark:text-white">Generate Payment Slip</p>
                                <p className="text-xs text-slate-500 tracking-wide font-medium">Create and print a new invoice</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;

