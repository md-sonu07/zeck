import React from 'react';
import { BadgeCheck, ArrowRight, ChevronRight } from 'lucide-react';

const admitCards = [
    { title: 'RVUNL Technician Mains Admit Card 2026' },
    { title: 'WBSSC Group C and D Admit Card 2026' },
    { title: 'MPPSC SET Admit Card 2026' },
    { title: 'RRB JE Admit Card 2026 Download' },
    { title: 'NVS Class 11 Admit Card 2026 (JH & WB)' },
    { title: 'BPSC ASO Mains Admit Card 2026' },
    { title: 'UPSSSC Enforcement Constable PET Admit Card 2026' },
    { title: 'AFCAT Admit Card 2026 Download' },
    { title: 'SSC CGL Tier 2 Admit Card 2026' },
    { title: 'CTET Admit Card 2026 Download' },
];

const AdmitCardSection = () => {
    return (
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md shadow-slate-200/60 dark:shadow-black/20 card-lift">

            {/* Header Bar */}
            <div className="bg-linear-to-r from-blue-600 to-blue-700 px-5 py-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <BadgeCheck size={16} /> Admit Card
                </h2>
                <a
                    href="/admit-card"
                    className="group/btn text-[11px] text-white/75 hover:text-white border border-white/30 hover:border-white/70 hover:bg-white/10 px-2.5 py-0.5 rounded-full transition-all duration-200 inline-flex items-center gap-1.5"
                >
                    View All
                    <ArrowRight size={11} className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </a>
            </div>

            {/* Admit Card List */}
            <ul className="text-sm">
                {admitCards.map((card, index) => (
                    <li
                        key={index}
                        className="group relative border-l-[3px] border-transparent hover:border-blue-500 transition-all duration-200"
                    >
                        {/* Hover glow strip */}
                        <span className="absolute inset-0 bg-linear-to-r from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                        <a
                            href="#"
                            className="relative flex items-center gap-2.5 px-4 py-[11px]"
                        >
                            <ChevronRight
                                size={13}
                                className="shrink-0 text-blue-300 dark:text-blue-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200"
                            />
                            <span className="text-[13px] text-slate-600 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-300 group-hover:font-medium transition-all duration-200 leading-snug">
                                {card.title}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700 text-center">
                <a
                    href="/admit-card"
                    className="group/footer text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1.5 transition-colors duration-200 no-underline"
                >
                    View All Admit Cards
                    <ArrowRight size={11} className="transition-transform duration-200 group-hover/footer:translate-x-1" />
                </a>
            </div>
        </section>
    );
};

export default AdmitCardSection;