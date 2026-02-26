import React from 'react';
import { Briefcase, ChevronRight, Home, Calendar, Users, ExternalLink, MessageCircle, ChevronLeft, Send } from 'lucide-react';
import FilterStrip from '../../../components/PageSection/home/FilterStrip';

const jobs = [
    { id: 1, tags: ['Railway', 'Central Govt'], title: 'RRB Group D Recruitment 2026 Online Form', post: 'Group D', totalPosts: '32,000+', education: '10th Pass', lastDate: '28 Mar 2026', dateColor: 'text-rose-600', btn: 'Apply Online', btnStyle: 'bg-primary text-white hover:bg-primary/90' },
    { id: 2, tags: ['Police', 'Bihar State'], title: 'Bihar Police Constable 2026 New Vacancy Announcement', post: 'Constable GD', totalPosts: '21,391 Posts', education: '12th Pass', status: 'Coming Soon', dateColor: 'text-green-600', btn: 'Details', btnStyle: 'border border-primary text-primary hover:bg-primary hover:text-white' },
    { id: 3, tags: ['SSC', 'Central Govt'], title: 'SSC CGL 2026 Notification Online Form', post: 'Various Posts', totalPosts: '17,000+', education: 'Graduation', lastDate: '05 Apr 2026', dateColor: 'text-rose-600', btn: 'Apply Online', btnStyle: 'bg-primary text-white hover:bg-primary/90' },
    { id: 4, tags: ['Defence', 'Central Govt'], title: 'Indian Army Agniveer Recruitment 2026', post: 'Agniveer', totalPosts: '25,000+', education: '10th / 12th', lastDate: '15 Mar 2026', dateColor: 'text-rose-600', btn: 'Apply Online', btnStyle: 'bg-primary text-white hover:bg-primary/90' },
    { id: 5, tags: ['Banking', 'Central Govt'], title: 'SBI PO Recruitment 2026 Online Form', post: 'Probationary Officer', totalPosts: '600 Posts', education: 'Graduation', lastDate: '30 Mar 2026', dateColor: 'text-rose-600', btn: 'Apply Online', btnStyle: 'bg-primary text-white hover:bg-primary/90' },
    { id: 6, tags: ['Central Govt'], title: 'India Post GDS Recruitment 2026 Online Form', post: 'Gramin Dak Sevak', totalPosts: '44,228 Posts', education: '10th Pass', lastDate: '25 Mar 2026', dateColor: 'text-rose-600', btn: 'Apply Online', btnStyle: 'bg-primary text-white hover:bg-primary/90' },
    { id: 7, tags: ['State Govt', 'UP'], title: 'UPPSC PCS 2026 Notification', post: 'Various PCS Posts', totalPosts: '220 Posts', education: 'Graduation', lastDate: '20 Mar 2026', dateColor: 'text-rose-600', btn: 'Details', btnStyle: 'border border-primary text-primary hover:bg-primary hover:text-white' },
    { id: 8, tags: ['Defence', 'Central Govt'], title: 'CRPF Head Constable Recruitment 2026', post: 'Head Constable', totalPosts: '1,458 Posts', education: '12th Pass', lastDate: '18 Apr 2026', dateColor: 'text-rose-600', btn: 'Apply Online', btnStyle: 'bg-primary text-white hover:bg-primary/90' },
];

const categories = [
    { label: 'UPSC / SSC Jobs', count: 242 },
    { label: 'Railway Jobs', count: 156 },
    { label: 'Bank / Insurance', count: 89 },
    { label: 'Teaching Jobs', count: 312 },
    { label: 'Medical / Health', count: 124 },
    { label: 'Police / Defence', count: 203 },
];

const tagColor = (tag) => {
    const map = { Railway: 'bg-orange-100 text-orange-700', 'Central Govt': 'bg-blue-100 text-blue-700', Police: 'bg-slate-200 text-slate-700', 'Bihar State': 'bg-green-100 text-green-700', SSC: 'bg-sky-100 text-sky-700', Defence: 'bg-emerald-100 text-emerald-700', Banking: 'bg-amber-100 text-amber-700', 'State Govt': 'bg-purple-100 text-purple-700', UP: 'bg-violet-100 text-violet-700' };
    return map[tag] || 'bg-slate-100 text-slate-600';
};

export default function LatestJobsPage() {
    const filtered = jobs;
    return (
        <div className="pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
            {/* Hero */}
            <div className="bg-linear-to-r from-primary via-blue-600 to-blue-700 px-4 py-6">
                <div className="max-w-[1200px] mx-auto">
                    <nav className="flex items-center gap-1.5 text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Home size={10} /> <ChevronRight size={10} /> <span className="text-white">Latest Jobs</span>
                    </nav>
                    <h1 className="text-2xl font-black text-white tracking-tight">Latest Government Jobs 2026</h1>
                    <p className="text-blue-200 text-xs mt-1">Updated daily — all central &amp; state govt recruitments in one place.</p>
                </div>
            </div>

            <FilterStrip />

            <div className="max-w-[1200px] mx-auto px-4 mt-4">
                <div className="flex gap-6">
                    {/* Main */}
                    <div className="flex-1 min-w-0 space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {filtered.length} Notifications</p>
                        {filtered.map(job => (
                            <div key={job.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200">
                                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
                                    {/* Left Content */}
                                    <div className="flex-1 px-5 py-6 md:px-6 md:py-8">
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {job.tags.map(t => <span key={t} className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${tagColor(t)}`}>{t}</span>)}
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug hover:text-primary cursor-pointer transition-colors mb-4">{job.title}</h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Post Name</p>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{job.post}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Posts</p>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{job.totalPosts}</p>
                                            </div>
                                            <div className="hidden sm:block">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Education</p>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{job.education}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Action Section */}
                                    <div className="w-full md:w-48 xl:w-56 shrink-0 bg-slate-50/50 dark:bg-slate-900/10 px-5 py-6 md:px-6 md:py-8 flex flex-col items-center justify-center text-center gap-4">
                                        <div className="space-y-1">
                                            {job.status ? (
                                                <>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                                    <p className={`text-xs font-black uppercase tracking-wider ${job.dateColor}`}>{job.status}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Date</p>
                                                    <p className={`text-xs font-black uppercase tracking-wider ${job.dateColor}`}>{job.lastDate}</p>
                                                </>
                                            )}
                                        </div>
                                        <a href="#" className={`w-full text-[10px] font-black px-4 py-2.5 rounded-lg uppercase tracking-wider transition-all duration-200 whitespace-nowrap text-center shadow-sm hover:shadow-md ${job.btnStyle}`}>
                                            {job.btn}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-2 mt-10 pb-6">
                            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-primary hover:border-primary/30 transition-all duration-200">
                                <ChevronLeft size={18} />
                            </button>
                            <button className="size-10 flex items-center justify-center rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 transform scale-110">
                                1
                            </button>
                            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                2
                            </button>
                            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                3
                            </button>
                            <span className="text-slate-400 font-bold px-1">...</span>
                            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                12
                            </button>
                            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-primary hover:border-primary/30 transition-all duration-200">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-80 shrink-0 hidden lg:block space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Categories</p>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-primary px-4 py-3 flex items-center gap-2">
                                <Briefcase size={13} className="text-white" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Browse by Field</h3>
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 pt-3 pb-1">Job Categories</p>
                            <ul>
                                {categories.map((c, i) => (
                                    <li key={i} className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer group transition-colors">
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">{c.label}</span>
                                        <span className="text-[10px] font-black text-slate-400">{c.count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-primary px-4 py-3 flex items-center gap-2">
                                <MessageCircle size={13} className="text-white" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Join Our Community</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {[{
                                    label: 'Telegram Channel',
                                    sub: 'Instant job alerts',
                                    color: 'bg-[#2CA5E0]',
                                    href: 'https://t.me/zoyacenter',
                                    icon: <Send size={14} />
                                },
                                {
                                    label: 'WhatsApp Group',
                                    sub: 'Fastest response',
                                    color: 'bg-[#25D366]',
                                    href: '#',
                                    icon: <MessageCircle size={14} />
                                }
                                ].map((s, i) => (
                                    <a key={i} href={s.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg p-2 -mx-2 transition-colors group">
                                        <div className={`size-8 ${s.color} rounded-lg flex items-center justify-center text-white shrink-0`}>
                                            {s.icon}
                                        </div>
                                        <div><p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">{s.label}</p><p className="text-[10px] text-slate-400">{s.sub}</p></div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
