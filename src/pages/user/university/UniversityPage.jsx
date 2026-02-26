import React from 'react';
import { GraduationCap, ChevronRight, Home, MapPin, Award, ExternalLink, MessageCircle, ChevronLeft, Send, School } from 'lucide-react';
import FilterStrip from "../../../components/PageSection/home/FilterStrip";

const universities = [
    { id: 1, tags: ['Central', 'Top Rated'], title: 'University of Delhi (DU)', location: 'New Delhi', type: 'Central University', established: '1922', courses: 'UG, PG, PhD', rating: 'A++', btn: 'View Details', btnStyle: 'bg-indigo-600 text-white hover:bg-indigo-700' },
    { id: 2, tags: ['State', 'Bihar'], title: 'Patna University', location: 'Patna, Bihar', type: 'State University', established: '1917', courses: 'Arts, Science, Commerce', rating: 'B+', btn: 'View Details', btnStyle: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white' },
    { id: 3, tags: ['Central', 'Premier'], title: 'Jawaharlal Nehru University (JNU)', location: 'New Delhi', type: 'Central University', established: '1969', courses: 'PG, Research', rating: 'A++', btn: 'View Details', btnStyle: 'bg-indigo-600 text-white hover:bg-indigo-700' },
    { id: 4, tags: ['Central', 'UP'], title: 'Banaras Hindu University (BHU)', location: 'Varanasi, UP', type: 'Central University', established: '1916', courses: 'All Streams', rating: 'A', btn: 'View Details', btnStyle: 'bg-indigo-600 text-white hover:bg-indigo-700' },
    { id: 5, tags: ['State', 'West Bengal'], title: 'University of Calcutta', location: 'Kolkata, WB', type: 'State University', established: '1857', courses: 'UG, PG, Research', rating: 'A', btn: 'View Details', btnStyle: 'bg-indigo-600 text-white hover:bg-indigo-700' },
    { id: 6, tags: ['Deemed', 'Private'], title: 'BITS Pilani', location: 'Pilani, Rajasthan', type: 'Deemed University', established: '1964', courses: 'Engg, Science, Pharmacy', rating: 'A', btn: 'View Details', btnStyle: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white' },
    { id: 7, tags: ['Central', 'Aligarh'], title: 'Aligarh Muslim University (AMU)', location: 'Aligarh, UP', type: 'Central University', established: '1920', courses: 'Medical, Engg, Arts', rating: 'A+', btn: 'View Details', btnStyle: 'bg-indigo-600 text-white hover:bg-indigo-700' },
    { id: 8, tags: ['State', 'Maharashtra'], title: 'University of Mumbai', location: 'Mumbai, MH', type: 'State University', established: '1857', courses: 'Multi-disciplinary', rating: 'A', btn: 'View Details', btnStyle: 'bg-indigo-600 text-white hover:bg-indigo-700' },
];

const categories = [
    { label: 'Central Universities', count: 54 },
    { label: 'State Universities', count: 460 },
    { label: 'Deemed Universities', count: 128 },
    { label: 'Private Universities', count: 430 },
    { label: 'Top Ranking (NIRF)', count: 100 },
    { label: 'Distance Learning', count: 85 },
];

const tagColor = (tag) => {
    const map = {
        Central: 'bg-indigo-100 text-indigo-700',
        State: 'bg-blue-100 text-blue-700',
        Deemed: 'bg-purple-100 text-purple-700',
        Private: 'bg-slate-200 text-slate-700',
        'Top Rated': 'bg-amber-100 text-amber-700',
        Bihar: 'bg-green-100 text-green-700',
        UP: 'bg-orange-100 text-orange-700',
        Premier: 'bg-rose-100 text-rose-700'
    };
    return map[tag] || 'bg-slate-100 text-slate-600';
};

export default function UniversityPage() {
    const filtered = universities;
    return (
        <div className="pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
            {/* Hero */}
            <div className="bg-linear-to-r from-indigo-600 via-indigo-700 to-purple-700 px-4 py-6">
                <div className="max-w-[1200px] mx-auto">
                    <nav className="flex items-center gap-1.5 text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Home size={10} /> <ChevronRight size={10} /> <span className="text-white">Universities</span>
                    </nav>
                    <h1 className="text-2xl font-black text-white tracking-tight">Top Universities in India 2026</h1>
                    <p className="text-indigo-200 text-xs mt-1">Explore rankings, courses, and admission details for premier institutions.</p>
                </div>
            </div>

            <FilterStrip />

            <div className="max-w-[1200px] mx-auto px-4 mt-4">
                <div className="flex gap-6">
                    {/* Main */}
                    <div className="flex-1 min-w-0 space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {filtered.length} Institutions</p>
                        {filtered.map(uni => (
                            <div key={uni.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-400/30 transition-all duration-200">
                                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
                                    {/* Left Content */}
                                    <div className="flex-1 px-5 py-6 md:px-6 md:py-8">
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {uni.tags.map(t => <span key={t} className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${tagColor(t)}`}>{t}</span>)}
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug hover:text-indigo-600 cursor-pointer transition-colors mb-4">{uni.title}</h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</p>
                                                <div className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                                                    <MapPin size={10} className="text-indigo-500" />
                                                    {uni.location}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">University Type</p>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{uni.type}</p>
                                            </div>
                                            <div className="hidden sm:block">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Established</p>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{uni.established}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Action Section */}
                                    <div className="w-full md:w-48 xl:w-56 shrink-0 bg-slate-50/50 dark:bg-slate-900/10 px-5 py-6 md:px-6 md:py-8 flex flex-col items-center justify-center text-center gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NAAC Rating</p>
                                            <div className="flex items-center justify-center gap-1 text-xs font-black uppercase tracking-wider text-indigo-600">
                                                <Award size={12} />
                                                {uni.rating}
                                            </div>
                                        </div>
                                        <a href="#" className={`w-full text-[10px] font-black px-4 py-2.5 rounded-lg uppercase tracking-wider transition-all duration-200 whitespace-nowrap text-center shadow-sm hover:shadow-md ${uni.btnStyle}`}>
                                            {uni.btn}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-2 mt-10 pb-6">
                            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-indigo-600 hover:border-indigo-400/30 transition-all duration-200">
                                <ChevronLeft size={18} />
                            </button>
                            <button className="size-10 flex items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30 transform scale-110">
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
                                42
                            </button>
                            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-indigo-600 hover:border-indigo-400/30 transition-all duration-200">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-80 shrink-0 hidden lg:block space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institution Type</p>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-indigo-600 px-4 py-3 flex items-center gap-2">
                                <School size={13} className="text-white" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Browse by Category</h3>
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-4 pt-3 pb-1">Universities</p>
                            <ul>
                                {categories.map((c, i) => (
                                    <li key={i} className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer group transition-colors">
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">{c.label}</span>
                                        <span className="text-[10px] font-black text-slate-400">{c.count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-indigo-600 px-4 py-3 flex items-center gap-2">
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
                                        <div><p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">{s.label}</p><p className="text-[10px] text-slate-400">{s.sub}</p></div>
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
