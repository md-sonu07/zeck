import React from 'react';
import { CheckCircle, ChevronRight, Home, Trophy, ExternalLink, MessageCircle, Calendar, ChevronLeft, Send } from 'lucide-react';
import FilterStrip from '../../../components/PageSection/home/FilterStrip';

const results = [
    { id: 1, tags: ['Railway', 'Central Govt'], title: 'RRB NTPC CBT-1 Result 2025', post: 'Non-Technical Popular Cat.', totalPosts: '35,281', declared: '15 Jan 2026', status: 'Declared', statusColor: 'text-green-600', btn: 'Check Result', btnStyle: 'bg-green-600 text-white hover:bg-green-700', isNew: true },
    { id: 2, tags: ['SSC', 'Central Govt'], title: 'SSC CHSL Tier-I Result 2025', post: 'LDC / JSA / PA / SA', totalPosts: '3,712', declared: '02 Feb 2026', status: 'Declared', statusColor: 'text-green-600', btn: 'Check Result', btnStyle: 'bg-green-600 text-white hover:bg-green-700', isNew: true },
    { id: 3, tags: ['Police', 'Bihar State'], title: 'Bihar Police SI Result 2025', post: 'Sub Inspector', totalPosts: '1,275', declared: '20 Feb 2026', status: 'Declared', statusColor: 'text-green-600', btn: 'Check Result', btnStyle: 'bg-green-600 text-white hover:bg-green-700', isNew: false },
    { id: 4, tags: ['UPSC', 'Central Govt'], title: 'UPSC IAS Final Result 2025', post: 'IAS / IPS / IFS', totalPosts: '1,016', declared: '10 Feb 2026', status: 'Declared', statusColor: 'text-green-600', btn: 'Check Result', btnStyle: 'bg-green-600 text-white hover:bg-green-700', isNew: false },
    { id: 5, tags: ['Banking', 'Central Govt'], title: 'SBI Clerk Result 2025', post: 'Junior Associate', totalPosts: '13,735', declared: '28 Jan 2026', status: 'Declared', statusColor: 'text-green-600', btn: 'Check Result', btnStyle: 'bg-green-600 text-white hover:bg-green-700', isNew: false },
    { id: 6, tags: ['SSC', 'Central Govt'], title: 'SSC CGL Tier II Result 2025', post: 'Various Posts', totalPosts: '17,000+', declared: 'Expected Mar 2026', status: 'Awaited', statusColor: 'text-amber-600', btn: 'Details', btnStyle: 'border border-primary text-primary hover:bg-primary hover:text-white', isNew: false },
];

const categories = [
    { label: 'Railway Results', count: 28 },
    { label: 'SSC Results', count: 19 },
    { label: 'Banking Results', count: 14 },
    { label: 'State PSC Results', count: 33 },
    { label: 'Police Results', count: 21 },
    { label: 'Defence Results', count: 11 },
];

const tagColor = (tag) => {
    const map = { Railway: 'bg-orange-100 text-orange-700', 'Central Govt': 'bg-blue-100 text-blue-700', Police: 'bg-slate-200 text-slate-700', 'Bihar State': 'bg-green-100 text-green-700', SSC: 'bg-sky-100 text-sky-700', Defence: 'bg-emerald-100 text-emerald-700', Banking: 'bg-amber-100 text-amber-700', UPSC: 'bg-indigo-100 text-indigo-700' };
    return map[tag] || 'bg-slate-100 text-slate-600';
};

export default function ResultPage() {
    const filtered = results;
    return (
        <div className="pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className="bg-linear-to-r from-green-600 via-green-700 to-teal-700 px-4 py-6">
                <div className="max-w-[1200px] mx-auto">
                    <nav className="flex items-center gap-1.5 text-green-200 text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Home size={10} /> <ChevronRight size={10} /> <span className="text-white">Result</span>
                    </nav>
                    <h1 className="text-2xl font-black text-white tracking-tight">Exam Results 2026</h1>
                    <p className="text-green-200 text-xs mt-1">Check your result for all government exams here.</p>
                </div>
            </div>

            <FilterStrip />

            <div className="max-w-[1200px] mx-auto px-4 mt-4">
                <div className="flex gap-6">
                    <div className="flex-1 min-w-0 space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {filtered.length} Results</p>
                        {filtered.map(r => (
                            <div key={r.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-green-400/30 transition-all duration-200">
                                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
                                    <div className="flex-1 px-5 py-6 md:px-6 md:py-8">
                                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                                            {r.tags.map(t => <span key={t} className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${tagColor(t)}`}>{t}</span>)}
                                            {r.isNew && <span className="bg-green-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">New</span>}
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug hover:text-green-600 cursor-pointer transition-colors mb-4">{r.title}</h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Post Name</p>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{r.post}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Posts</p>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{r.totalPosts}</p>
                                            </div>
                                            <div className="hidden sm:block">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Declared On</p>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{r.declared}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-48 xl:w-56 shrink-0 bg-slate-50/50 dark:bg-slate-900/10 px-5 py-6 md:px-6 md:py-8 flex flex-col items-center justify-center text-center gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                            <p className={`text-xs font-black uppercase tracking-wider ${r.statusColor}`}>{r.status}</p>
                                        </div>
                                        <a href="#" className={`w-full text-[10px] font-black px-4 py-2.5 rounded-lg uppercase tracking-wider transition-all duration-200 whitespace-nowrap text-center shadow-sm hover:shadow-md ${r.btnStyle}`}>
                                            {r.btn}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-2 mt-10 pb-6">
                            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-green-600 hover:border-green-400/30 transition-all duration-200">
                                <ChevronLeft size={18} />
                            </button>
                            <button className="size-10 flex items-center justify-center rounded-xl bg-green-600 text-white font-bold shadow-lg shadow-green-600/30 transform scale-110">
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
                            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-green-600 hover:border-green-400/30 transition-all duration-200">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="w-80 shrink-0 hidden lg:block space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Result Categories</p>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-green-600 px-4 py-3 flex items-center gap-2">
                                <Trophy size={13} className="text-white" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Browse by Exam</h3>
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 pt-3 pb-1">Categories</p>
                            <ul>
                                {categories.map((c, i) => (
                                    <li key={i} className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer group transition-colors">
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-green-600 transition-colors">{c.label}</span>
                                        <span className="text-[10px] font-black text-slate-400">{c.count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-green-600 px-4 py-3 flex items-center gap-2">
                                <MessageCircle size={13} className="text-white" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Join Our Community</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {[{
                                    label: 'Telegram Channel',
                                    sub: 'Instant result alerts',
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
                                        <div><p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-green-600 transition-colors">{s.label}</p><p className="text-[10px] text-slate-400">{s.sub}</p></div>
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
