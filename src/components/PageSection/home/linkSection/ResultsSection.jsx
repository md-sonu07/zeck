import React from 'react';
import { CheckCircle2, ArrowRight, ChevronRight } from 'lucide-react';

const results = [
    { title: 'UPPSC LT Grade Result 2026', category: 'UP PSC', isNew: true },
    { title: 'MPESB Subedar & ASI Result 2026', category: 'MP', isNew: true },
    { title: 'JEE Mains Result 2026', category: 'Exam', year: '2026' },
    { title: 'RPF Constable Final Result 2026', category: 'Railway', year: '2026' },
    { title: 'SSC GD Final Marks 2026', category: 'SSC', year: '2026' },
    { title: 'UGC NET December 2025 Result', category: 'UGC', year: '2025' },
    { title: 'LIC AAO Mains Result 2026', category: 'Banking', year: '2026' },
    { title: 'IBPS RRB Office Assistant & Officer Score Card 2026', category: 'Banking', year: '2026' },
    { title: 'SSC CGL Tier-I Marks & Final Answer Key 2026', category: 'SSC', year: '2026' },
    { title: 'RVUNL Technician Pre Exam Result 2026', category: 'Rajasthan', year: '2026' },
];

const ResultsSection = () => {
    return (
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md shadow-slate-200/60 dark:shadow-black/20 card-lift">

            {/* Header Bar */}
            <div className="bg-linear-to-r from-green-600 to-green-700 px-5 py-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 size={16} /> Results
                </h2>
                <a
                    href="/results"
                    className="group/btn text-[11px] text-white/75 hover:text-white border border-white/30 hover:border-white/70 hover:bg-white/10 px-2.5 py-0.5 rounded-full transition-all duration-200 inline-flex items-center gap-1.5"
                >
                    View All
                    <ArrowRight size={11} className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </a>
            </div>

            {/* Results List */}
            <ul className="text-sm">
                {results.map((result, index) => (
                    <li
                        key={index}
                        className="group relative border-l-[3px] border-transparent hover:border-green-500 transition-all duration-200"
                    >
                        {/* Hover glow strip */}
                        <span className="absolute inset-0 bg-linear-to-r from-green-50 to-transparent dark:from-green-950/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                        <a
                            href="#"
                            className="relative flex items-center justify-between gap-2.5 px-4 py-[11px]"
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                <ChevronRight
                                    size={13}
                                    className="shrink-0 text-green-300 dark:text-green-600 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all duration-200"
                                />
                                <span className="text-[13px] text-slate-600 dark:text-slate-300 group-hover:text-green-700 dark:group-hover:text-green-300 group-hover:font-medium transition-all duration-200 leading-snug">
                                    {result.title}
                                </span>
                            </div>
                            {result.isNew && (
                                <span className="shrink-0 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md animate-pulse">
                                    NEW
                                </span>
                            )}
                        </a>
                    </li>
                ))}
            </ul>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700 text-center">
                <a
                    href="/results"
                    className="group/footer text-xs font-bold text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 inline-flex items-center gap-1.5 transition-colors duration-200 no-underline"
                >
                    View All Results
                    <ArrowRight size={11} className="transition-transform duration-200 group-hover/footer:translate-x-1" />
                </a>
            </div>
        </section>
    );
};

export default ResultsSection;
