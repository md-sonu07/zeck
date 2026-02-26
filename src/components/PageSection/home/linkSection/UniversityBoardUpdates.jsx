import { GraduationCap, ArrowRight, ChevronRight, Newspaper } from 'lucide-react';

const admissions = [
    { title: 'BRABU UG Admission 2026 Online Form' },
    { title: 'Bihar DElEd Admission 2026 Apply Online' },
    { title: 'IGNOU January Session Admission 2026' },
    { title: 'PPU Graduation Admission Online Form' },
    { title: 'NVS Class 6 Admission 2026 Started' },
    { title: 'Bihar B.Ed Common Entrance Test (CET) 2026' },
];

const universityNews = [
    { title: 'Magadh University Part 3 Exam Date 2026' },
    { title: 'VKSU Ara Graduation Part 1 Admit Card' },
    { title: 'LNMU UG Part 2 Exam Results 2026 Out' },
    { title: 'Purnea University Registration 2026' },
    { title: 'BSEB 12th Compartmental Form Online' },
    { title: 'Patliputra University Exam Form 2026' },
];

const UniversityBoardUpdates = () => {
    return (
            <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md shadow-slate-200/60 dark:shadow-black/20 card-lift">

                {/* Header Bar */}
                <div className="bg-linear-to-r from-purple-700 to-indigo-800 px-5 py-3">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <GraduationCap size={15} /> University & Admission
                    </h2>
                </div>

                {/* Two-column grid — layout unchanged */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Admissions Column */}
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            Admissions
                        </p>
                        <ul className="text-sm space-y-1">
                            {admissions.map((item, index) => (
                                <li
                                    key={index}
                                    className="group relative border-l-2 border-transparent hover:border-purple-500 transition-all duration-200"
                                >
                                    <span className="absolute inset-0 bg-linear-to-r from-purple-50 to-transparent dark:from-purple-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-r-md" />
                                    <a
                                        href="#"
                                        className="relative flex items-start gap-2 px-2 py-2.5"
                                    >
                                        <ChevronRight
                                            size={13}
                                            className="shrink-0 text-purple-300 dark:text-purple-700 group-hover:text-purple-600 group-hover:translate-x-0.5 mt-0.5 transition-all duration-200"
                                        />
                                        <span className="text-slate-600 dark:text-slate-300 group-hover:text-purple-700 dark:group-hover:text-purple-400 group-hover:font-medium transition-all duration-200 leading-snug">
                                            {item.title}
                                        </span>
                                    </a>
                                </li>
                            ))}
                            <li className="pt-1 px-2">
                                <a
                                    href="#"
                                    className="group/link text-xs font-bold text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 inline-flex items-center gap-1.5 no-underline transition-colors duration-200"
                                >
                                    View All Admissions
                                    <ArrowRight size={11} className="transition-transform duration-200 group-hover/link:translate-x-1" />
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* University News Column */}
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                            University News
                        </p>
                        <ul className="text-sm space-y-1">
                            {universityNews.map((item, index) => (
                                <li
                                    key={index}
                                    className="group relative border-l-2 border-transparent hover:border-purple-500 transition-all duration-200"
                                >
                                    <span className="absolute inset-0 bg-linear-to-r from-purple-50 to-transparent dark:from-purple-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-r-md" />
                                    <a
                                        href="#"
                                        className="relative flex items-start gap-2 px-2 py-2.5"
                                    >
                                        <Newspaper
                                            size={13}
                                            className="shrink-0 text-purple-300 dark:text-purple-700 group-hover:text-purple-600 mt-0.5 transition-colors duration-200"
                                        />
                                        <span className="text-slate-600 dark:text-slate-300 group-hover:text-purple-700 dark:group-hover:text-purple-400 group-hover:font-medium transition-all duration-200 leading-snug">
                                            {item.title}
                                        </span>
                                    </a>
                                </li>
                            ))}
                            <li className="pt-1 px-2">
                                <a
                                    href="#"
                                    className="group/link text-xs font-bold text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 inline-flex items-center gap-1.5 no-underline transition-colors duration-200"
                                >
                                    View All Updates
                                    <ArrowRight size={11} className="transition-transform duration-200 group-hover/link:translate-x-1" />
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>
            </section>
    );
};

export default UniversityBoardUpdates;