import React from 'react';
import { Briefcase, ArrowRight, ChevronRight } from 'lucide-react';

const jobs = [
    { id: '01', title: 'Indian Army Agniveer Recruitment 2026', category: 'Defence', badge: 'STARTED', badgeColor: 'bg-green-500' },
    { id: '02', title: 'RRB Group D Recruitment 2026 Online', category: 'Railway', badge: 'NEW', badgeColor: 'bg-red-500' },
    { id: '03', title: 'Bihar Police Constable GD Close Cadre Vacancy 2026', category: 'Bihar Police', badge: 'NEW', badgeColor: 'bg-red-500' },
    { id: '04', title: 'India Post GDS Recruitment 2026 Online', category: 'Post Office', year: '2026' },
    { id: '05', title: 'Delhi High Court JJA Recruitment 2026', category: 'High Court', year: '2026' },
    { id: '06', title: 'RTPS Bihar – Apply For जाति/आवासीय/आय प्रमाण', category: 'Bihar Govt', year: 'Online' },
    { id: '07', title: 'RBI Assistant Recruitment 2026', category: 'Banking', year: '2026' },
    { id: '08', title: 'SSC CPO SI Vacancy Details 2026', category: 'SSC', year: '2026' },
];

const LatestJobsSection = () => {
    return (
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md shadow-slate-200/60 dark:shadow-black/20 card-lift">

            {/* Header Bar */}
            <div className="sec-bar px-5 py-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Briefcase size={15} /> Latest Jobs
                </h2>
                <a
                    href="/latest-jobs"
                    className="group/btn text-[11px] font-semibold text-white/80 hover:text-white border border-white/30 px-3 py-1 rounded-full hover:border-white/70 hover:bg-white/10 transition-all duration-200 inline-flex items-center gap-1.5"
                >
                    View All
                    <ArrowRight size={11} className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </a>
            </div>

            {/* Job List */}
            <ul className="">
                {jobs.map((job) => (
                    <li
                        key={job.id}
                        className="group relative border-l-[3px] border-transparent hover:border-primary transition-all duration-200"
                    >
                        {/* Hover glow strip */}
                        <span className="absolute inset-0 bg-linear-to-r from-blue-50 to-transparent dark:from-primary/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

                        <a href="#" className="relative flex items-center justify-between gap-3 px-4 py-[11px]">
                            <div className="flex items-center gap-2.5 min-w-0">
                                {/* Number */}
                                <span className="text-[10px] font-bold text-primary/40 group-hover:text-primary shrink-0 w-5 transition-colors duration-200">
                                    {job.id}
                                </span>

                                {/* Chevron */}
                                <ChevronRight
                                    size={13}
                                    className="shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200"
                                />

                                <div className="min-w-0">
                                    <p className="text-[13px] text-slate-600 dark:text-slate-300 group-hover:text-primary group-hover:font-medium transition-all duration-200 leading-snug">
                                        {job.title}
                                    </p>
                                    <span className="mt-1 inline-block text-[10px] bg-primary/10 group-hover:bg-primary/20 text-primary font-semibold px-2 py-0.5 rounded-md transition-colors duration-200">
                                        {job.category}
                                    </span>
                                </div>
                            </div>

                            {/* Right badge / year */}
                            <div className="shrink-0">
                                {job.badge ? (
                                    <span className={`text-[9px] font-extrabold ${job.badgeColor} text-white px-2 py-0.5 rounded-md tracking-wide animate-pulse`}>
                                        {job.badge}
                                    </span>
                                ) : (
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                        {job.year}
                                    </span>
                                )}
                            </div>
                        </a>
                    </li>
                ))}
            </ul>

            {/* Footer */}
            <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700 text-center">
                <a
                    href="/latest-jobs"
                    className="group/footer text-xs font-bold text-primary hover:text-primary/80 inline-flex items-center gap-1.5 transition-colors duration-200 no-underline"
                >
                    View All Latest Jobs
                    <ArrowRight size={11} className="transition-transform duration-200 group-hover/footer:translate-x-1" />
                </a>
            </div>
        </section>
    );
};

export default LatestJobsSection;
