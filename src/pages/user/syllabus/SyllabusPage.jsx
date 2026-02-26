import React from 'react';
import { Book, ChevronRight, Home, Download, ExternalLink, MessageCircle, ChevronLeft, Send } from 'lucide-react';
import FilterStrip from '../../../components/PageSection/home/FilterStrip';

const syllabi = [
    { id: 1, tags: ['SSC', 'Central Govt'], title: 'SSC CGL 2026 Syllabus & Exam Pattern', post: 'Various Posts', subjects: 'GK, English, Quant, Reasoning', examType: 'Tier I & II', btn: 'Download PDF', btnStyle: 'bg-emerald-600 text-white hover:bg-emerald-700', isNew: true },
    { id: 2, tags: ['Railway', 'Central Govt'], title: 'RRB NTPC Syllabus 2026', post: 'Non-Technical Popular Cat.', subjects: 'GK, Maths, Reasoning', examType: 'CBT 1 & 2', btn: 'Download PDF', btnStyle: 'bg-emerald-600 text-white hover:bg-emerald-700', isNew: true },
    { id: 3, tags: ['UPSC', 'Central Govt'], title: 'UPSC IAS Syllabus 2026 (Prelims + Mains)', post: 'IAS / IPS / IFS', subjects: 'GS Paper I-IV + Optional', examType: 'Prelims + Mains', btn: 'Download PDF', btnStyle: 'bg-emerald-600 text-white hover:bg-emerald-700', isNew: false },
    { id: 4, tags: ['BPSC', 'Bihar State'], title: 'Bihar BPSC 70th CCE Syllabus', post: 'Various PCS Posts', subjects: 'GS, History, Geography, Polity', examType: 'Prelims + Mains', btn: 'Download PDF', btnStyle: 'bg-emerald-600 text-white hover:bg-emerald-700', isNew: false },
    { id: 5, tags: ['Police', 'UP State'], title: 'UP Police Constable Syllabus 2026', post: 'Constable', subjects: 'GK, Hindi, Numeric, Mental Ability', examType: 'Written Test', btn: 'Download PDF', btnStyle: 'bg-emerald-600 text-white hover:bg-emerald-700', isNew: true },
    { id: 6, tags: ['Banking', 'Central Govt'], title: 'SBI PO Syllabus 2026', post: 'Probationary Officer', subjects: 'Reasoning, Quant, English, GK', examType: 'Prelims + Mains', btn: 'Download PDF', btnStyle: 'bg-emerald-600 text-white hover:bg-emerald-700', isNew: false },
    { id: 7, tags: ['Defence', 'Central Govt'], title: 'Indian Army Agniveer Syllabus 2026', post: 'Agniveer', subjects: 'GK, Maths, Physics, Chemistry', examType: 'Written + Physical', btn: 'Download PDF', btnStyle: 'bg-emerald-600 text-white hover:bg-emerald-700', isNew: false },
];

const categories = [
    { label: 'SSC Syllabus', count: 11 },
    { label: 'Railway Syllabus', count: 8 },
    { label: 'Banking Syllabus', count: 6 },
    { label: 'State PSC Syllabus', count: 19 },
    { label: 'Police Syllabus', count: 14 },
    { label: 'Defence Syllabus', count: 7 },
];

const tagColor = (tag) => {
    const map = { Railway: 'bg-orange-100 text-orange-700', 'Central Govt': 'bg-blue-100 text-blue-700', Police: 'bg-slate-200 text-slate-700', 'Bihar State': 'bg-green-100 text-green-700', 'UP State': 'bg-violet-100 text-violet-700', SSC: 'bg-sky-100 text-sky-700', BPSC: 'bg-teal-100 text-teal-700', UPSC: 'bg-indigo-100 text-indigo-700', Defence: 'bg-emerald-100 text-emerald-700', Banking: 'bg-amber-100 text-amber-700' };
    return map[tag] || 'bg-slate-100 text-slate-600';
};

export default function SyllabusPage() {
    const filtered = syllabi;
    return (
        <div className="pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className="bg-linear-to-r from-emerald-600 via-emerald-700 to-green-700 px-4 py-6">
                <div className="max-w-[1200px] mx-auto">
                    <nav className="flex items-center gap-1.5 text-emerald-200 text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Home size={10} /> <ChevronRight size={10} /> <span className="text-white">Syllabus</span>
                    </nav>
                    <h1 className="text-2xl font-black text-white tracking-tight">Exam Syllabus 2026</h1>
                    <p className="text-emerald-100 text-xs mt-1">Complete syllabus &amp; exam pattern for all government exams.</p>
                </div>
            </div>

            <FilterStrip />

            <div className="max-w-[1200px] mx-auto px-4 mt-4">
                <div className="flex gap-6">
                    <div className="flex-1 min-w-0 space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {filtered.length} Syllabus</p>
                        {filtered.map(s => (
                            <div key={s.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-400/30 transition-all duration-200">
                                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
                                    <div className="flex-1 px-5 py-6 md:px-6 md:py-8">
                                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                                            {s.tags.map(t => <span key={t} className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${tagColor(t)}`}>{t}</span>)}
                                            {s.isNew && <span className="bg-green-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">New</span>}
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug hover:text-emerald-600 cursor-pointer transition-colors mb-4">{s.title}</h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Post Name</p>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{s.post}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Key Subjects</p>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{s.subjects}</p>
                                            </div>
                                            <div className="hidden sm:block">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Exam Type</p>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{s.examType}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-48 xl:w-56 shrink-0 bg-slate-50/50 dark:bg-slate-900/10 px-5 py-6 md:px-6 md:py-8 flex flex-col items-center justify-center text-center gap-4">
                                        <a href="#" className={`w-full text-[10px] font-black px-4 py-2.5 rounded-lg uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md ${s.btnStyle}`}>
                                            <Download size={12} />
                                            {s.btn}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-2 mt-10 pb-6">
                            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-emerald-600 hover:border-emerald-400/30 transition-all duration-200">
                                <ChevronLeft size={18} />
                            </button>
                            <button className="size-10 flex items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/30 transform scale-110">
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
                            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-emerald-600 hover:border-emerald-400/30 transition-all duration-200">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="w-80 shrink-0 hidden lg:block space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syllabus Categories</p>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-emerald-600 px-4 py-3 flex items-center gap-2">
                                <Book size={13} className="text-white" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Browse by Exam</h3>
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 pt-3 pb-1">Categories</p>
                            <ul>
                                {categories.map((c, i) => (
                                    <li key={i} className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer group transition-colors">
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-emerald-600 transition-colors">{c.label}</span>
                                        <span className="text-[10px] font-black text-slate-400">{c.count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-emerald-600 px-4 py-3 flex items-center gap-2">
                                <MessageCircle size={13} className="text-white" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Join Our Community</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {[{
                                    label: 'Telegram Channel',
                                    sub: 'Get latest syllabus',
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
                                        <div><p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 transition-colors">{s.label}</p><p className="text-[10px] text-slate-400">{s.sub}</p></div>
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
