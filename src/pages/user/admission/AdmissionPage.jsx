import React from 'react';
import { GraduationCap, ChevronRight, Home, ExternalLink, MessageCircle, Calendar, ChevronLeft, Send } from 'lucide-react';
import FilterStrip from '../../../components/PageSection/home/FilterStrip';

const admissions = [
    { id: 1, tags: ['University', 'Central'], title: 'DU Undergraduate Admission 2026', org: 'Delhi University', type: 'UG Admission', lastDate: '15 Apr 2026', dateColor: 'text-rose-600', status: 'Open', statusColor: 'text-green-600', btn: 'Apply Online', btnStyle: 'bg-teal-600 text-white hover:bg-teal-700', isNew: true },
    { id: 2, tags: ['Board', 'State'], title: 'Navodaya Vidyalaya Class 6 Admission 2026', org: 'NVS', type: 'School Admission', lastDate: '20 Mar 2026', dateColor: 'text-rose-600', status: 'Open', statusColor: 'text-green-600', btn: 'Apply Online', btnStyle: 'bg-teal-600 text-white hover:bg-teal-700', isNew: true },
    { id: 3, tags: ['University', 'Central'], title: 'JNU PG Admission 2026 – JNUEE', org: 'Jawaharlal Nehru University', type: 'PG Admission', lastDate: '10 Apr 2026', dateColor: 'text-rose-600', status: 'Open', statusColor: 'text-green-600', btn: 'Apply Online', btnStyle: 'bg-teal-600 text-white hover:bg-teal-700', isNew: false },
    { id: 4, tags: ['Board', 'State'], title: 'UP Board Scholarship 2025-26', org: 'UP Board of Education', type: 'Scholarship', lastDate: '05 Mar 2026', dateColor: 'text-amber-600', status: 'Extended', statusColor: 'text-amber-600', btn: 'Apply Now', btnStyle: 'bg-teal-600 text-white hover:bg-teal-700', isNew: false },
    { id: 5, tags: ['Technical', 'Central'], title: 'IIT JAM 2026 – PG Science Admission', org: 'IIT Mumbai', type: 'PG Admission', lastDate: '30 Mar 2026', dateColor: 'text-rose-600', status: 'Open', statusColor: 'text-green-600', btn: 'Apply Online', btnStyle: 'bg-teal-600 text-white hover:bg-teal-700', isNew: true },
    { id: 6, tags: ['Medical', 'Central'], title: 'AIIMS Nursing Admission 2026', org: 'AIIMS Delhi', type: 'UG Admission', lastDate: '25 Mar 2026', dateColor: 'text-rose-600', status: 'Open', statusColor: 'text-green-600', btn: 'Apply Online', btnStyle: 'bg-teal-600 text-white hover:bg-teal-700', isNew: false },
];

const categories = [
    { label: 'University Admissions', count: 34 },
    { label: 'School Admissions', count: 12 },
    { label: 'Technical / Engineering', count: 18 },
    { label: 'Medical / Nursing', count: 9 },
    { label: 'Scholarship Forms', count: 22 },
    { label: 'Board Admissions', count: 15 },
];

const tagColor = (tag) => {
    const map = { University: 'bg-teal-100 text-teal-700', Central: 'bg-blue-100 text-blue-700', Board: 'bg-slate-200 text-slate-700', State: 'bg-green-100 text-green-700', Technical: 'bg-orange-100 text-orange-700', Medical: 'bg-rose-100 text-rose-700' };
    return map[tag] || 'bg-slate-100 text-slate-600';
};

export default function AdmissionPage() {
    const filtered = admissions;
    return (
        <div className="pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className="bg-linear-to-r from-teal-600 via-teal-700 to-cyan-700 px-4 py-6">
                <div className="max-w-[1200px] mx-auto">
                    <nav className="flex items-center gap-1.5 text-teal-200 text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Home size={10} /> <ChevronRight size={10} /> <span className="text-white">Admission</span>
                    </nav>
                    <h1 className="text-2xl font-black text-white tracking-tight">University &amp; Board Admissions 2026</h1>
                    <p className="text-teal-100 text-xs mt-1">All latest admission forms, university notifications &amp; board updates.</p>
                </div>
            </div>

            <FilterStrip />

            <div className="max-w-[1200px] mx-auto px-4 mt-4">
                <div className="flex gap-6">
                    <div className="flex-1 min-w-0 space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {filtered.length} Admissions</p>
                        {filtered.map(a => (
                            <div key={a.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-teal-400/30 transition-all duration-200">
                                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
                                    <div className="flex-1 px-5 py-6 md:px-6 md:py-8">
                                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                                            {a.tags.map(t => <span key={t} className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${tagColor(t)}`}>{t}</span>)}
                                            {a.isNew && <span className="bg-green-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">New</span>}
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug hover:text-teal-600 cursor-pointer transition-colors mb-4">{a.title}</h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Organisation</p>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{a.org}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Type</p>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{a.type}</p>
                                            </div>
                                            <div className="hidden sm:block">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Date</p>
                                                <p className={`text-xs font-black ${a.dateColor}`}>{a.lastDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-48 xl:w-56 shrink-0 bg-slate-50/50 dark:bg-slate-900/10 px-5 py-6 md:px-6 md:py-8 flex flex-col items-center justify-center text-center gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                            <p className={`text-xs font-black uppercase tracking-wider ${a.statusColor}`}>{a.status}</p>
                                        </div>
                                        <a href="#" className={`w-full text-[10px] font-black px-4 py-2.5 rounded-lg uppercase tracking-wider transition-all duration-200 whitespace-nowrap text-center shadow-sm hover:shadow-md ${a.btnStyle}`}>
                                            {a.btn}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-2 mt-10 pb-6">
                            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-teal-600 hover:border-teal-400/30 transition-all duration-200">
                                <ChevronLeft size={18} />
                            </button>
                            <button className="size-10 flex items-center justify-center rounded-xl bg-teal-600 text-white font-bold shadow-lg shadow-teal-600/30 transform scale-110">
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
                            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-teal-600 hover:border-teal-400/30 transition-all duration-200">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="w-80 shrink-0 hidden lg:block space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admission Categories</p>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-teal-600 px-4 py-3 flex items-center gap-2">
                                <GraduationCap size={13} className="text-white" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Browse by Type</h3>
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 pt-3 pb-1">Categories</p>
                            <ul>
                                {categories.map((c, i) => (
                                    <li key={i} className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer group transition-colors">
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-teal-600 transition-colors">{c.label}</span>
                                        <span className="text-[10px] font-black text-slate-400">{c.count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-teal-600 px-4 py-3 flex items-center gap-2">
                                <MessageCircle size={13} className="text-white" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Join Our Community</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {[{
                                    label: 'Telegram Channel',
                                    sub: 'Instant admission alerts',
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
                                        <div><p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-teal-600 transition-colors">{s.label}</p><p className="text-[10px] text-slate-400">{s.sub}</p></div>
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
