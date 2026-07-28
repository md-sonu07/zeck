import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchResults } from '../../../store/thunk/searchThunk';
import { clearSearchResults } from '../../../store/slice/searchSlice';
import { Search, ChevronRight, Home, Loader2, FileX2 } from 'lucide-react';
import { CategorySkeleton } from '../../../components/common/Skeleton';
import SEO from '../../../components/common/SEO';
import AdSlot from '../../../components/common/AdSlot';

const isNew = (article) => {
    const date = article?.postDate || article?.createdAt;
    if (!date) return false;
    const now = new Date();
    const post = new Date(date);
    const diffInDays = (now - post) / (1000 * 60 * 60 * 24);
    return diffInDays <= 2;
};

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const dispatch = useDispatch();
    const { results, loading } = useSelector((state) => state.search);

    useEffect(() => {
        if (query.trim()) {
            dispatch(fetchSearchResults({ search: query.trim() }));
        } else {
            dispatch(clearSearchResults());
        }

        return () => {
            dispatch(clearSearchResults());
        };
    }, [dispatch, query]);

    return (
        <div className="pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <SEO
                title={query ? `Search: ${query}` : 'Search'}
                description={`Search results for "${query}" on Zoya Education Center. Find government jobs, admit cards, results, and education news.`}
                noindex={true}
            />
            {/* Header Banner */}
            <div className="bg-linear-to-r from-primary to-blue-700 px-4 py-6">
                <div className="max-w-[1200px] mx-auto">
                    <nav className="flex items-center gap-1.5 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Home size={10} /> <ChevronRight size={10} /> <span className="text-white">Search Results</span>
                    </nav>
                    <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <Search size={22} />
                        Search Results
                    </h1>
                    {query && (
                        <p className="text-white/80 text-xs mt-1">
                            Showing results for: <span className="text-white font-bold">"{query}"</span>
                        </p>
                    )}
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 mt-6">
                <AdSlot adSlot="6727066150" className="min-h-[90px] mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    {loading ? 'Searching...' : `${results.length} result${results.length !== 1 ? 's' : ''} found`}
                </p>

                {loading ? (
                    <CategorySkeleton />
                ) : !query.trim() ? (
                    <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                        <Search size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                        <p className="text-slate-500 font-bold text-lg">Enter a search term</p>
                        <p className="text-slate-400 text-sm mt-1">Use the search bar to find news, results, admit cards and more.</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className="space-y-4">
                        {results.map((article) => (
                            <div key={article._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200">
                                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
                                    <div className="flex-1 px-5 py-6 md:px-6 md:py-8">
                                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                                            {article.mainCategory && (
                                                <span className="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-primary/10 text-primary">
                                                    {article.mainCategory}
                                                </span>
                                            )}
                                            {article.subCategory && (
                                                <span className="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                    {article.subCategory}
                                                </span>
                                            )}
                                            {article.location && (
                                                <span className="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-blue-100 text-blue-700">
                                                    {article.location}
                                                </span>
                                            )}
                                            {isNew(article) && (
                                                <span className="bg-green-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">New</span>
                                            )}
                                        </div>
                                        <Link to={`/${(article.mainCategory || 'news').toLowerCase().replace(/\s+/g, '-')}/${article.slug || article._id}`}>
                                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug hover:text-primary cursor-pointer transition-colors mb-4">
                                                {article.title}
                                            </h2>
                                        </Link>
                                        {article.shortSummary && (
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{article.shortSummary}</p>
                                        )}
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Post Date</p>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                    {new Date(article.postDate || article.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {article.location && (
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</p>
                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{article.location}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-full md:w-48 xl:w-56 shrink-0 bg-slate-50/50 dark:bg-slate-900/10 px-5 py-6 md:px-6 md:py-8 flex flex-col items-center justify-center text-center gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Category</p>
                                            <p className="text-xs font-black uppercase tracking-wider text-primary">{article.mainCategory || 'News'}</p>
                                        </div>
                                        <Link
                                            to={`/${(article.mainCategory || 'news').toLowerCase().replace(/\s+/g, '-')}/${article.slug || article._id}`}
                                            className="w-full text-[10px] font-black px-4 py-2.5 rounded-lg uppercase tracking-wider transition-all duration-200 whitespace-nowrap text-center shadow-sm hover:shadow-md bg-primary text-white hover:opacity-90"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                        <FileX2 size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                        <p className="text-slate-500 font-bold text-lg">No results found for "{query}"</p>
                        <p className="text-slate-400 text-sm mt-2">Try different keywords or check the spelling.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;
