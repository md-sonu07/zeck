import React from 'react';
import { Key, ChevronRight, Home, FileText, ExternalLink, MessageCircle, ChevronLeft, Send } from 'lucide-react';
import FilterStrip from '../../../components/PageSection/home/FilterStrip';

const keys = [
    { id: 1, tags: ['SSC', 'Central Govt'], title: 'SSC CGL Tier I Answer Key 2025', post: 'Various Posts', released: '20 Jan 2026', objection: '25 Jan 2026', status: 'Active', statusColor: 'text-green-600', btn: 'View Answer Key', btnStyle: 'bg-primary text-white hover:bg-primary/90', isNew: true },
    { id: 2, tags: ['Railway', 'Central Govt'], title: 'RRB NTPC Answer Key 2025', post: 'Non-Technical Popular Cat.', released: '10 Feb 2026', objection: '15 Feb 2026', status: 'Active', statusColor: 'text-green-600', btn: 'View Answer Key', btnStyle: 'bg-primary text-white hover:bg-primary/90', isNew: true },
    { id: 3, tags: ['BPSC', 'Bihar State'], title: 'Bihar BPSC 70th Prelims Answer Key', post: 'Various PCS Posts', released: '05 Feb 2026', objection: '10 Feb 2026', status: 'Closed', statusColor: 'text-rose-500', btn: 'View Key', btnStyle: 'border border-primary text-primary hover:bg-primary hover:text-white', isNew: false },
    { id: 4, tags: ['SSC', 'Central Govt'], title: 'SSC CHSL Tier I Answer Key 2025', post: 'LDC / JSA / PA', released: '18 Jan 2026', objection: '22 Jan 2026', status: 'Closed', statusColor: 'text-rose-500', btn: 'View Key', btnStyle: 'border border-primary text-primary hover:bg-primary hover:text-white', isNew: false },
    { id: 5, tags: ['Police', 'UP State'], title: 'UP Police Constable Answer Key 2025', post: 'Constable', released: '28 Jan 2026', objection: '02 Feb 2026', status: 'Closed', statusColor: 'text-rose-500', btn: 'View Key', btnStyle: 'border border-primary text-primary hover:bg-primary hover:text-white', isNew: false },
];

const categories = [
    { label: 'SSC Answer Keys', count: 14 },
    { label: 'Railway Answer Keys', count: 9 },
    { label: 'Banking Answer Keys', count: 7 },
    { label: 'State PSC Answer Keys', count: 18 },
    { label: 'Police Answer Keys', count: 12 },
    { label: 'Defence Answer Keys', count: 5 },
];

const tagColor = (tag) => {
    const map = { Railway: 'bg-orange-100 text-orange-700', 'Central Govt': 'bg-blue-100 text-blue-700', Police: 'bg-slate-200 text-slate-700', 'Bihar State': 'bg-green-100 text-green-700', 'UP State': 'bg-violet-100 text-violet-700', SSC: 'bg-sky-100 text-sky-700', BPSC: 'bg-teal-100 text-teal-700' };
    return map[tag] || 'bg-slate-100 text-slate-600';
};

export default function AnswerKeyPage() {
    const filtered = keys;
    return (
        <div className="pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className="bg-linear-to-r from-blue-600 via-blue-700 to-sky-700 px-4 py-6">
                <div className="max-w-[1200px] mx-auto">
                    <nav className="flex items-center gap-1.5 text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Home size={10} /> <ChevronRight size={10} /> <span className="text-white">Answer Key</span>
                    </nav>
                    <h1 className="text-2xl font-black text-white tracking-tight">Answer Keys 2026</h1>
                    <p className="text-blue-100 text-xs mt-1">Official answer keys with objection window details.</p>
                </div>
            </div>

            <FilterStrip />

            <div className="max-w-[1200px] mx-auto px-4 mt-4">
                <div className="flex gap-6">
                    {/* Main */}
                    <div className="flex-1 min-w-0 space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {filtered.length} Answer Keys</p>
                        {filtered.map(k => (
                            <div key={k.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-400/30 transition-all duration-200">
                                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
                                    <div className="flex-1 px-5 py-6 md:px-6 md:py-8">
                                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                                            {k.tags.map(t => <span key={t} className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${tagColor(t)}`}>{t}</span>)}
                                            {k.isNew && <span className="bg-green-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">New</span>}
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug hover:text-blue-600 cursor-pointer transition-colors mb-4">{k.title}</h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Post Name</p>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{k.post}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Released On</p>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{k.released}</p>
                                            </div>
                                            <div className="hidden sm:block">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Objection Last Date</p>
                                                <p className="text-xs font-black text-rose-500">{k.objection}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-48 xl:w-56 shrink-0 bg-slate-50/50 dark:bg-slate-900/10 px-5 py-6 md:px-6 md:py-8 flex flex-col items-center justify-center text-center gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Objection</p>
                                            <p className={`text-xs font-black uppercase tracking-wider ${k.statusColor}`}>{k.status}</p>
                                        </div>
                                        <a href="#" className={`w-full text-[10px] font-black px-4 py-2.5 rounded-lg uppercase tracking-wider transition-all duration-200 whitespace-nowrap text-center shadow-sm hover:shadow-md ${k.btnStyle}`}>
                                            {k.btn}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-2 mt-10 pb-6">
                            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:border-blue-400/30 transition-all duration-200">
                                <ChevronLeft size={18} />
                            </button>
                            <button className="size-10 flex items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30 transform scale-110">
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
                            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:border-blue-400/30 transition-all duration-200">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-80 shrink-0 hidden lg:block space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Answer Key Categories</p>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-blue-600 px-4 py-3 flex items-center gap-2">
                                <Key size={13} className="text-white" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Browse by Exam</h3>
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 pt-3 pb-1">Categories</p>
                            <ul>
                                {categories.map((c, i) => (
                                    <li key={i} className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer group transition-colors">
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-blue-600 transition-colors">{c.label}</span>
                                        <span className="text-[10px] font-black text-slate-400">{c.count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-blue-600 px-4 py-3 flex items-center gap-2">
                                <MessageCircle size={13} className="text-white" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Join Our Community</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {[{
                                    label: 'Telegram Channel',
                                    sub: 'Instant key alerts',
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
                                        <div><p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 transition-colors">{s.label}</p><p className="text-[10px] text-slate-400">{s.sub}</p></div>
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
