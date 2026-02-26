import { Key, ArrowRight, ChevronRight, BookOpen } from 'lucide-react';

const answerKeys = [
    { title: 'RRB Group D Answer Key 2026' },
    { title: 'CG Vyapam TET Answer Key 2026' },
    { title: 'SSC CGL Tier II Answer Key 2026' },
    { title: 'AFCAT Exam Answer Key 2026' },
    { title: 'MP Police SI Answer Key 2026' },
    { title: 'SSC Delhi Police Constable Answer Key 2026' },
];

const syllabi = [
    { title: 'Railway Group D Syllabus 2026' },
    { title: 'JSSC Kakshpal Syllabus 2026' },
    { title: 'UP Police Constable Syllabus 2026' },
    { title: 'MP Police Constable Syllabus 2025' },
    { title: 'Bihar STET Syllabus 2025' },
    { title: 'RRB ALP Syllabus 2025' },
];

const AnswerKeySyllabus = () => {
    return (
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md shadow-slate-200/60 dark:shadow-black/20 card-lift">

            {/* Header Bar */}
            <div className="bg-linear-to-r from-slate-700 to-slate-800 px-5 py-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Key size={15} /> Answer Key & Syllabus
                </h2>
            </div>

            {/* Two-column grid — layout unchanged */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Answer Key Column */}
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                        Answer Key
                    </p>
                    <ul className="text-sm space-y-1">
                        {answerKeys.map((item, index) => (
                            <li
                                key={index}
                                className="group relative border-l-2 border-transparent hover:border-primary transition-all duration-200"
                            >
                                <span className="absolute inset-0 bg-linear-to-r from-blue-50 to-transparent dark:from-primary/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-r-md" />
                                <a
                                    href="#"
                                    className="relative flex items-start gap-2 px-2 py-2.5"
                                >
                                    <ChevronRight
                                        size={13}
                                        className="shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-primary group-hover:translate-x-0.5 mt-0.5 transition-all duration-200"
                                    />
                                    <span className="text-slate-600 dark:text-slate-300 group-hover:text-primary group-hover:font-medium transition-all duration-200 leading-snug">
                                        {item.title}
                                    </span>
                                </a>
                            </li>
                        ))}
                        <li className="pt-1 px-2">
                            <a
                                href="#"
                                className="group/link text-xs font-bold text-primary hover:text-primary/80 inline-flex items-center gap-1.5 no-underline transition-colors duration-200"
                            >
                                View All Answer Keys
                                <ArrowRight size={11} className="transition-transform duration-200 group-hover/link:translate-x-1" />
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Syllabus Column */}
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">
                        Syllabus
                    </p>
                    <ul className="text-sm space-y-1">
                        {syllabi.map((item, index) => (
                            <li
                                key={index}
                                className="group relative border-l-2 border-transparent hover:border-primary transition-all duration-200"
                            >
                                <span className="absolute inset-0 bg-linear-to-r from-blue-50 to-transparent dark:from-primary/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-r-md" />
                                <a
                                    href="#"
                                    className="relative flex items-start gap-2 px-2 py-2.5"
                                >
                                    <BookOpen
                                        size={13}
                                        className="shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-primary mt-0.5 transition-colors duration-200"
                                    />
                                    <span className="text-slate-600 dark:text-slate-300 group-hover:text-primary group-hover:font-medium transition-all duration-200 leading-snug">
                                        {item.title}
                                    </span>
                                </a>
                            </li>
                        ))}
                        <li className="pt-1 px-2">
                            <a
                                href="#"
                                className="group/link text-xs font-bold text-primary hover:text-primary/80 inline-flex items-center gap-1.5 no-underline transition-colors duration-200"
                            >
                                View All Syllabi
                                <ArrowRight size={11} className="transition-transform duration-200 group-hover/link:translate-x-1" />
                            </a>
                        </li>
                    </ul>
                </div>

            </div>
        </section>

    );
};

export default AnswerKeySyllabus;