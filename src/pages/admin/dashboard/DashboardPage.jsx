import React from 'react';
import {
    Users,
    Briefcase,
    FileText,
    CheckCircle,
    TrendingUp,
    Clock
} from 'lucide-react';

// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, icon: Icon, color, trend }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/60 flex items-start justify-between card-lift stat-card group">
            <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{value}</h3>

                {trend && (
                    <div className="flex items-center gap-1 mt-3 text-xs font-bold text-green-500 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-md w-fit">
                        <TrendingUp size={12} />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
            <div className={`size-12 rounded-xl flex items-center justify-center text-white shadow-lg ${color} group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={24} />
            </div>
        </div>
    );
};

const DashboardPage = () => {
    // Mock data for dashboard
    const recentActivity = [
        { id: 1, action: "New Job Added", details: "SSC CGL 2024 Notification", time: "2 hours ago", icon: Briefcase, color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10" },
        { id: 2, action: "New User Registered", details: "John Doe created an account", time: "5 hours ago", icon: Users, color: "text-green-500 bg-green-50 dark:bg-green-500/10" },
        { id: 3, action: "Admit Card Published", details: "UPSC Prelims Admit Card", time: "1 day ago", icon: FileText, color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10" },
        { id: 4, action: "Result Declared", details: "RRB NTPC Final Result", time: "2 days ago", icon: CheckCircle, color: "text-purple-500 bg-purple-50 dark:bg-purple-500/10" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors active:scale-95">
                        Download Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value="12,456" icon={Users} color="bg-linear-to-br from-primary to-blue-600" trend="+12% this week" />
                <StatCard title="Active Jobs" value="342" icon={Briefcase} color="bg-linear-to-br from-emerald-500 to-green-600" trend="+5 new today" />
                <StatCard title="Admit Cards" value="1,893" icon={FileText} color="bg-linear-to-br from-amber-500 to-orange-600" trend="+20% this month" />
                <StatCard title="Results Out" value="45" icon={CheckCircle} color="bg-linear-to-br from-purple-500 to-indigo-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Recent Activity</h2>
                        <button className="text-primary text-sm font-semibold hover:underline">View All</button>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {recentActivity.map((activity, index) => (
                                <div key={activity.id} className="flex gap-4 relative">
                                    {/* Timeline line */}
                                    {index !== recentActivity.length - 1 && (
                                        <div className="absolute top-10 left-[19px] bottom-[-24px] w-px bg-slate-200 dark:bg-slate-700"></div>
                                    )}
                                    <div className={`size-10 rounded-full flex items-center justify-center shrink-0 z-10 ${activity.color}`}>
                                        <activity.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white">{activity.action}</p>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">{activity.details}</p>
                                        <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-slate-400">
                                            <Clock size={12} />
                                            {activity.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700/60">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Quick Actions</h2>
                    </div>
                    <div className="p-4 space-y-2">
                        <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left group">
                            <div className="size-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 dark:text-white">Post a Job</p>
                                <p className="text-xs text-slate-500 font-medium tracking-wide border border-transparent">Create a new job listing</p>
                            </div>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left group">
                            <div className="size-10 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 dark:text-white">Upload Admit Card</p>
                                <p className="text-xs text-slate-500 tracking-wide font-medium">Publish new admit card link</p>
                            </div>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left group">
                            <div className="size-10 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 dark:text-white">Declare Result</p>
                                <p className="text-xs text-slate-500 tracking-wide font-medium">Add new exam results</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
