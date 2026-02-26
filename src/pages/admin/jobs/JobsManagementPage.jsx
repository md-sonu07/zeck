import React from 'react';
import { Search, Plus, MoreVertical, Edit, Trash2, ExternalLink, Calendar, CheckCircle, Clock } from 'lucide-react';

const JobsManagementPage = () => {
    // Mock jobs data
    const jobs = [
        { id: 1, title: "SSC CGL 2024 Final Notification", category: "Central Govt", status: "published", views: 1245, date: "Oct 24, 2024" },
        { id: 2, title: "UPSC Civil Services Prelims 2024", category: "UPSC", status: "published", views: 3210, date: "Oct 20, 2024" },
        { id: 3, title: "RRB NTPC Recruitment (10,000+ Posts)", category: "Railway", status: "draft", views: 0, date: "Oct 25, 2024" },
        { id: 4, title: "UP Police Constable Vacancy", category: "State Govt", status: "published", views: 890, date: "Oct 15, 2024" },
        { id: 5, title: "IBPS PO Main Exam Date Announced", category: "Banking", status: "archived", views: 450, date: "Sep 30, 2024" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Content Management</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Manage jobs, admit cards, and results.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors active:scale-95">
                        <Plus size={16} />
                        Create New
                    </button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium dark:text-white transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar shrink-0">
                    <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-primary shrink-0">
                        <option value="all">All Content Types</option>
                        <option value="jobs">Latest Jobs</option>
                        <option value="admit_cards">Admit Cards</option>
                        <option value="results">Results</option>
                    </select>
                    <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-primary shrink-0">
                        <option value="all">All Categories</option>
                        <option value="central">Central Govt</option>
                        <option value="state">State Govt</option>
                        <option value="banking">Banking</option>
                        <option value="railway">Railway</option>
                    </select>
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="p-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title & Category</th>
                                <th className="p-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Engagement</th>
                                <th className="p-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="p-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                            {jobs.map((job) => (
                                <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                    <td className="p-4">
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-primary transition-colors cursor-pointer">{job.title}</p>
                                            <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wider">
                                                {job.category}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {job.status === 'published' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-600 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20">
                                                <CheckCircle size={12} /> Published
                                            </span>
                                        )}
                                        {job.status === 'draft' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
                                                <Clock size={12} /> Draft
                                            </span>
                                        )}
                                        {job.status === 'archived' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                                                Archived
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                                            <CheckCircle className="text-slate-400" size={14} />
                                            {job.views.toLocaleString()} views
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                                            <Calendar size={14} />
                                            {job.date}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-slate-400 hover:text-green-500 bg-slate-100 hover:bg-green-50 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors" title="View on Site">
                                                <ExternalLink size={16} />
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-primary bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors" title="Edit">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Showing 1 to 5 of 842 entries</span>
                    <div className="flex items-center gap-1">
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 text-slate-500 font-bold rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled>Prev</button>
                        <button className="px-3 py-1 bg-primary text-white font-bold rounded-md">1</button>
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 text-slate-500 font-bold rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">2</button>
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 text-slate-500 font-bold rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">3</button>
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 text-slate-500 font-bold rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobsManagementPage;
