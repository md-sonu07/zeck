import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { GraduationCap, ArrowRight, ChevronRight, Newspaper, Loader2 } from 'lucide-react';
import { ListItemsSkeleton } from '../../../common/Skeleton';
import { fetchArticles } from '../../../../store/thunk/articleThunk';
import { Link } from 'react-router-dom';

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'started': return 'bg-green-500';
        case 'completed': return 'bg-blue-500';
        case 'data expand': return 'bg-orange-500';
        default: return 'bg-red-500';
    }
};

const UniversityBoardUpdates = () => {
    const dispatch = useDispatch();
    const [admissions, setAdmissions] = useState([]);
    const [universityNews, setUniversityNews] = useState([]);
    const [loadingAdmissions, setLoadingAdmissions] = useState(true);
    const [loadingUniversity, setLoadingUniversity] = useState(true);

    useEffect(() => {
        const getAdmissions = async () => {
            try {
                setLoadingAdmissions(true);
                const result = await dispatch(fetchArticles({ mainCategory: 'Admission', limit: 8 })).unwrap();
                setAdmissions(result || []);
            } catch (error) {
                console.error('Failed to fetch admissions:', error);
            } finally {
                setLoadingAdmissions(false);
            }
        };

        const getUniversityNews = async () => {
            try {
                setLoadingUniversity(true);
                const result = await dispatch(fetchArticles({ mainCategory: 'University', limit: 8 })).unwrap();
                setUniversityNews(result || []);
            } catch (error) {
                console.error('Failed to fetch university news:', error);
            } finally {
                setLoadingUniversity(false);
            }
        };

        getAdmissions();
        getUniversityNews();
    }, [dispatch]);

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
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center justify-between">
                        Admissions
                    </p>
                    <ul className="text-sm space-y-1">
                        {loadingAdmissions ? (
                            <ListItemsSkeleton count={5} />
                        ) : admissions.length > 0 ? (
                            admissions.map((item, index) => (
                                <li
                                    key={item._id}
                                    className="group relative border-l-2 border-transparent hover:border-purple-500 transition-all duration-200"
                                >
                                    <span className="absolute inset-0 bg-linear-to-r from-purple-50 to-transparent dark:from-purple-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-r-md" />
                                    <Link
                                        to={`/${item.mainCategory?.toLowerCase().replace(/\s+/g, '-')}/${item.slug || item._id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative flex items-start justify-between gap-2 px-2 py-2.5"
                                    >
                                        <div className="flex items-start gap-2 min-w-0">
                                            <ChevronRight
                                                size={13}
                                                className="shrink-0 text-purple-300 dark:text-purple-700 group-hover:text-purple-600 group-hover:translate-x-0.5 mt-0.5 transition-all duration-200"
                                            />
                                            <span className="text-[14px] font-semibold text-slate-700 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-all duration-200 leading-snug truncate block w-full">
                                                {item.title}
                                            </span>
                                        </div>
                                        <div className="shrink-0">
                                            <span className={`text-[9px] font-extrabold ${getStatusColor(item.status)} text-white px-2 py-0.5 rounded-md tracking-wide animate-pulse uppercase`}>
                                                {item.status || 'NEW'}
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <div className="py-8 text-center text-slate-400 text-[11px] font-medium">
                                No admissions found.
                            </div>
                        )}
                        <li className="pt-2 px-2">
                            <Link
                                to="/admission"
                                className="group/link text-xs font-bold text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 inline-flex items-center gap-1.5 no-underline transition-colors duration-200"
                            >
                                View All Admissions
                                <ArrowRight size={11} className="transition-transform duration-200 group-hover/link:translate-x-1" />
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* University News Column */}
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center justify-between">
                        University News
                    </p>
                    <ul className="text-sm space-y-1">
                        {loadingUniversity ? (
                            <ListItemsSkeleton count={5} />
                        ) : universityNews.length > 0 ? (
                            universityNews.map((item, index) => (
                                <li
                                    key={item._id}
                                    className="group relative border-l-2 border-transparent hover:border-purple-500 transition-all duration-200"
                                >
                                    <span className="absolute inset-0 bg-linear-to-r from-purple-50 to-transparent dark:from-purple-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-r-md" />
                                    <Link
                                        to={`/${item.mainCategory?.toLowerCase().replace(/\s+/g, '-')}/${item.slug || item._id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative flex items-start justify-between gap-2 px-2 py-2.5"
                                    >
                                        <div className="flex items-start gap-2 min-w-0">
                                            <Newspaper
                                                size={13}
                                                className="shrink-0 text-purple-300 dark:text-purple-700 group-hover:text-purple-600 mt-0.5 transition-colors duration-200"
                                            />
                                            <span className="text-[14px] font-semibold text-slate-700 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-all duration-200 leading-snug truncate block w-full">
                                                {item.title}
                                            </span>
                                        </div>
                                        <div className="shrink-0">
                                            <span className={`text-[9px] font-extrabold ${getStatusColor(item.status)} text-white px-2 py-0.5 rounded-md tracking-wide animate-pulse uppercase`}>
                                                {item.status || 'NEW'}
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <div className="py-8 text-center text-slate-400 text-[11px] font-medium">
                                No updates found.
                            </div>
                        )}
                        <li className="pt-2 px-2">
                            <Link
                                to="/university"
                                className="group/link text-xs font-bold text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 inline-flex items-center gap-1.5 no-underline transition-colors duration-200"
                            >
                                View All Updates
                                <ArrowRight size={11} className="transition-transform duration-200 group-hover/link:translate-x-1" />
                            </Link>
                        </li>
                    </ul>
                </div>

            </div>
        </section>
    );
};

export default UniversityBoardUpdates;