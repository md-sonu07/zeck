import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CheckCircle2, ArrowRight, ChevronRight, Loader2 } from 'lucide-react';
import { ListItemsSkeleton } from '../../../common/Skeleton';
import { fetchArticles } from '../../../../store/thunk/articleThunk';
import { Link } from 'react-router-dom';

const ResultsSection = () => {
    const dispatch = useDispatch();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getResults = async () => {
            try {
                setLoading(true);
                const result = await dispatch(fetchArticles({ mainCategory: 'Result', limit: 10 })).unwrap();
                setResults(result || []);
            } catch (error) {
                console.error('Failed to fetch results:', error);
            } finally {
                setLoading(false);
            }
        };
        getResults();
    }, [dispatch]);

    return (
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md shadow-slate-200/60 dark:shadow-black/20 card-lift">

            {/* Header Bar */}
            <div className="bg-linear-to-r from-green-600 to-green-700 px-5 py-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 size={16} /> Results
                </h2>
                <Link
                    to="/result"
                    className="group/btn text-[11px] text-white/75 hover:text-white border border-white/30 hover:border-white/70 hover:bg-white/10 px-2.5 py-0.5 rounded-full transition-all duration-200 inline-flex items-center gap-1.5"
                >
                    View All
                    <ArrowRight size={11} className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </Link>
            </div>

            {/* Results List */}
            <ul className="text-sm min-h-[100px]">
                {loading ? (
                    <div className="p-0">
                        <ListItemsSkeleton count={6} />
                    </div>
                ) : results.length > 0 ? (
                    results.map((result, index) => (
                        <li
                            key={result._id}
                            className="group relative border-l-[3px] border-transparent hover:border-green-500 transition-all duration-200"
                        >
                            {/* Hover glow strip */}
                            <span className="absolute inset-0 bg-linear-to-r from-green-50 to-transparent dark:from-green-950/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                            <Link
                                to={`/${result.mainCategory?.toLowerCase().replace(/\s+/g, '-')}/${result.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative flex items-center justify-between gap-2.5 px-4 py-[11px]"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <ChevronRight
                                        size={13}
                                        className="shrink-0 text-green-300 dark:text-green-600 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all duration-200"
                                    />
                                    <span className="text-[14px] font-semibold text-slate-700 dark:text-slate-200 group-hover:text-green-700 dark:group-hover:text-green-300 transition-all duration-200 leading-snug truncate">
                                        {result.title}
                                    </span>
                                </div>
                                {result.status?.toLowerCase() === 'new' && (
                                    <span className="shrink-0 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md animate-pulse">
                                        NEW
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))
                ) : (
                    <div className="py-8 text-center text-slate-400 text-xs font-medium">
                        No results found.
                    </div>
                )}
            </ul>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700 text-center">
                <Link
                    to="/result"
                    className="group/footer text-xs font-bold text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 inline-flex items-center gap-1.5 transition-colors duration-200 no-underline"
                >
                    View All Results
                    <ArrowRight size={11} className="transition-transform duration-200 group-hover/footer:translate-x-1" />
                </Link>
            </div>
        </section>
    );
};

export default ResultsSection;
