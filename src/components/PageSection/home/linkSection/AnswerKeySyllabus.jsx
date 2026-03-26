import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Key, ArrowRight, ChevronRight, BookOpen, Loader2 } from 'lucide-react';
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

const AnswerKeySyllabus = () => {
    const dispatch = useDispatch();
    const [answerKeys, setAnswerKeys] = useState([]);
    const [syllabi, setSyllabi] = useState([]);
    const [loadingKeys, setLoadingKeys] = useState(true);
    const [loadingSyllabi, setLoadingSyllabi] = useState(true);

    useEffect(() => {
        const getAnswerKeys = async () => {
            try {
                setLoadingKeys(true);
                const result = await dispatch(fetchArticles({ mainCategory: 'Answer Key', limit: 8 })).unwrap();
                setAnswerKeys(result || []);
            } catch (error) {
                console.error('Failed to fetch answer keys:', error);
            } finally {
                setLoadingKeys(false);
            }
        };

        const getSyllabi = async () => {
            try {
                setLoadingSyllabi(true);
                const result = await dispatch(fetchArticles({ mainCategory: 'Syllabus', limit: 8 })).unwrap();
                setSyllabi(result || []);
            } catch (error) {
                console.error('Failed to fetch syllabi:', error);
            } finally {
                setLoadingSyllabi(false);
            }
        };

        getAnswerKeys();
        getSyllabi();
    }, [dispatch]);

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
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center justify-between">
                        Answer Key
                    </p>
                    <ul className="text-sm space-y-1">
                        {loadingKeys ? (
                            <ListItemsSkeleton count={5} />
                        ) : answerKeys.length > 0 ? (
                            answerKeys.map((item, index) => (
                                <li
                                    key={item._id}
                                    className="group relative border-l-2 border-transparent hover:border-primary transition-all duration-200"
                                >
                                    <span className="absolute inset-0 bg-linear-to-r from-blue-50 to-transparent dark:from-primary/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-r-md" />
                                    <Link
                                        to={`/${item.mainCategory?.toLowerCase().replace(/\s+/g, '-')}/${item.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative flex items-start justify-between gap-2 px-2 py-2.5"
                                    >
                                        <div className="flex items-start gap-2 min-w-0">
                                            <ChevronRight
                                                size={13}
                                                className="shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-primary group-hover:translate-x-0.5 mt-0.5 transition-all duration-200"
                                            />
                                            <span className="text-[14px] font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-all duration-200 leading-snug truncate block w-full">
                                                {item.title}
                                            </span>
                                        </div>
                                        <span className={`shrink-0 text-[8px] font-black px-1.5 py-0.5 rounded-sm h-fit uppercase tracking-tighter text-white ${getStatusColor(item.status)}`}>
                                            {item.status || 'NEW'}
                                        </span>
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <div className="py-8 text-center text-slate-400 text-[11px] font-medium">
                                No answer keys found.
                            </div>
                        )}
                        <li className="pt-2 px-2">
                            <Link
                                to="/answer-key"
                                className="group/link text-xs font-bold text-primary hover:text-primary/80 inline-flex items-center gap-1.5 no-underline transition-colors duration-200"
                            >
                                View All Answer Keys
                                <ArrowRight size={11} className="transition-transform duration-200 group-hover/link:translate-x-1" />
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Syllabus Column */}
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center justify-between">
                        Syllabus
                    </p>
                    <ul className="text-sm space-y-1">
                        {loadingSyllabi ? (
                            <ListItemsSkeleton count={5} />
                        ) : syllabi.length > 0 ? (
                            syllabi.map((item, index) => (
                                <li
                                    key={item._id}
                                    className="group relative border-l-2 border-transparent hover:border-primary transition-all duration-200"
                                >
                                    <span className="absolute inset-0 bg-linear-to-r from-blue-50 to-transparent dark:from-primary/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-r-md" />
                                    <Link
                                        to={`/${item.mainCategory?.toLowerCase().replace(/\s+/g, '-')}/${item.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative flex items-start justify-between gap-2 px-2 py-2.5"
                                    >
                                        <div className="flex items-start gap-2 min-w-0">
                                            <BookOpen
                                                size={13}
                                                className="shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-primary mt-0.5 transition-colors duration-200"
                                            />
                                            <span className="text-[14px] font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-all duration-200 leading-snug truncate block w-full">
                                                {item.title}
                                            </span>
                                        </div>
                                        <span className={`shrink-0 text-[8px] font-black px-1.5 py-0.5 rounded-sm h-fit uppercase tracking-tighter text-white ${getStatusColor(item.status)}`}>
                                            {item.status || 'NEW'}
                                        </span>
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <div className="py-8 text-center text-slate-400 text-[11px] font-medium">
                                No syllabi found.
                            </div>
                        )}
                        <li className="pt-2 px-2">
                            <Link
                                to="/syllabus"
                                className="group/link text-xs font-bold text-primary hover:text-primary/80 inline-flex items-center gap-1.5 no-underline transition-colors duration-200"
                            >
                                View All Syllabi
                                <ArrowRight size={11} className="transition-transform duration-200 group-hover/link:translate-x-1" />
                            </Link>
                        </li>
                    </ul>
                </div>

            </div>
        </section>

    );
};

export default AnswerKeySyllabus;