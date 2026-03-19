import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Newspaper, ArrowRight, ChevronRight, Loader2 } from 'lucide-react';
import { ListItemsSkeleton } from '../../../common/Skeleton';
import { fetchArticles } from '../../../../store/thunk/articleThunk';
import { Link } from 'react-router-dom';

const LatestNewsSection = () => {
    const dispatch = useDispatch();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getLatestNews = async () => {
            try {
                setLoading(true);
                const result = await dispatch(fetchArticles({ limit: 40 })).unwrap();
                setArticles(result || []);
            } catch (error) {
                console.error('Failed to fetch latest updates:', error);
            } finally {
                setLoading(false);
            }
        };

        getLatestNews();
    }, [dispatch]);

    const getStatusColor = (article) => {
        switch (article.status?.toLowerCase()) {
            case 'started': return 'bg-green-500';
            case 'completed': return 'bg-blue-500';
            case 'data expand': return 'bg-orange-500';
            default: return 'bg-red-500';
        }
    };

    const displayArticles = articles;

    return (
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md shadow-slate-200/60 dark:shadow-black/20 card-lift">

            {/* Header Bar */}
            <div className="sec-bar px-5 py-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Newspaper size={15} /> Recent Updates
                </h2>
                <Link
                    to="/latest-news"
                    className="group/btn text-[11px] font-semibold text-white/80 hover:text-white border border-white/30 px-3 py-1 rounded-full hover:border-white/70 hover:bg-white/10 transition-all duration-200 inline-flex items-center gap-1.5"
                >
                    View All
                    <ArrowRight size={11} className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </Link>
            </div>

            {/* Job List */}
            <ul className="min-h-[100px]">
                {loading ? (
                    <div className="p-0">
                        <ListItemsSkeleton count={10} />
                    </div>
                ) : displayArticles.length > 0 ? (
                    displayArticles.map((article, index) => (
                        <li
                            key={article._id}
                            className="group relative border-l-[3px] border-transparent hover:border-primary transition-all duration-200"
                        >
                            {/* Hover glow strip */}
                            <span className="absolute inset-0 bg-linear-to-r from-blue-50 to-transparent dark:from-primary/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

                            <Link
                                to={`/${(article.mainCategory || 'news').toLowerCase().replace(/\s+/g, '-')}/${article.slug}`}
                                className="relative flex items-center justify-between gap-3 px-4 py-[11px]"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    {/* Number */}
                                    <span className="text-[10px] font-bold text-primary/40 group-hover:text-primary shrink-0 w-5 transition-colors duration-200 text-center">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </span>

                                    {/* Chevron */}
                                    <ChevronRight
                                        size={13}
                                        className="shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200"
                                    />

                                    <div className="min-w-0">
                                        <p className="text-[14px] font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-all duration-200 leading-snug truncate">
                                            {article.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="inline-block text-[11px] bg-primary/10 group-hover:bg-primary/20 text-primary font-semibold px-2.5 py-0.5 rounded-md transition-colors duration-200">
                                                {article.mainCategory === 'Latest Job' ? 'Latest News' : article.mainCategory}
                                            </span>
                                            {article.subCategory && (
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    • {article.subCategory}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right badge / status */}
                                <div className="shrink-0">
                                    <span className={`text-[9px] font-extrabold ${getStatusColor(article)} text-white px-2 py-0.5 rounded-md tracking-wide animate-pulse uppercase`}>
                                        {article.status || 'NEW'}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))
                ) : (
                    <div className="py-8 text-center text-slate-400 text-xs font-medium">
                        No latest news updates.
                    </div>
                )}
            </ul>

            {/* Footer */}
            <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700 text-center">
                <Link
                    to="/latest-news"
                    className="group/footer text-xs font-bold text-primary hover:text-primary/80 inline-flex items-center gap-1.5 transition-colors duration-200 no-underline"
                >
                    View All Latest News
                    <ArrowRight size={11} className="transition-transform duration-200 group-hover/footer:translate-x-1" />
                </Link>
            </div>
        </section>
    );
};

export default LatestNewsSection;
