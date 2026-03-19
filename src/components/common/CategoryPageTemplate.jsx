import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles } from '../../store/thunk/articleThunk';
import { ChevronRight, Home, MessageCircle, ChevronLeft, Send, MapPin, Calendar, Info } from 'lucide-react';
import { CategorySkeleton } from './Skeleton';
import FilterStrip from '../PageSection/home/FilterStrip';
import { Link } from 'react-router-dom';

const isNew = (article) => {
    const date = article?.postDate || article?.createdAt;
    if (!date) return false;
    const now = new Date();
    const post = new Date(date);
    const diffInDays = (now - post) / (1000 * 60 * 60 * 24);
    return diffInDays <= 2;
};

const CategoryPageTemplate = ({ category, theme = 'primary', icon: Icon = Info, title: pageTitle, description, filter: customFilter, limit = 40 }) => {
    const dispatch = useDispatch();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Read from search Redux state
    const { results: searchResults, loading: searchLoading, activeFilters } = useSelector((state) => state.search);

    useEffect(() => {
        const getArticles = async () => {
            try {
                setLoading(true);
                const query = { limit };
                if (category) query.mainCategory = category;

                const result = await dispatch(fetchArticles(query)).unwrap();
                let filteredResult = result || [];

                if (customFilter) {
                    filteredResult = filteredResult.filter(customFilter);
                }

                setArticles(filteredResult);
            } catch (error) {
                console.error(`Failed to fetch ${category || 'articles'}:`, error);
            } finally {
                setLoading(false);
            }
        };
        getArticles();
    }, [dispatch, category, customFilter]);

    // Determine what to display: search results if filters are active, otherwise default articles
    const displayArticles = activeFilters ? searchResults : articles;
    const isLoading = activeFilters ? searchLoading : loading;

    const themeClasses = {
        primary: 'bg-primary text-primary',
        green: 'bg-green-600 text-green-600',
        blue: 'bg-blue-600 text-blue-600',
        indigo: 'bg-indigo-600 text-indigo-600',
        amber: 'bg-amber-600 text-amber-600',
    };

    const currentTheme = themeClasses[theme] || themeClasses.primary;
    const [bgClass, textColor] = currentTheme.split(' ');

    if (isLoading) {
        return <CategorySkeleton />;
    }

    return (
        <div className="pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className={`${bgClass} px-4 py-6`}>

                <div className="max-w-[1200px] mx-auto">
                    <nav className="flex items-center gap-1.5 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Home size={10} /> <ChevronRight size={10} /> <span className="text-white">{category || 'News'}</span>
                    </nav>
                    <h1 className="text-2xl font-black text-white tracking-tight">{pageTitle || `${category || 'Latest'} 2026`}</h1>
                    <p className="text-white/80 text-xs mt-1">{description || `Latest ${category || 'news'} notifications and updates.`}</p>
                </div>
            </div>

            <FilterStrip />

            <div className="max-w-[1200px] mx-auto px-4 mt-4">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 min-w-0 space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {isLoading ? 'Fetching Updates...' : `Showing ${displayArticles.length} ${activeFilters ? 'Search Results' : (category || 'Updates')}`}
                        </p>

                        {displayArticles.length > 0 ? (
                            displayArticles.map(article => (
                                <div key={article._id} className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-${theme}-400/30 transition-all duration-200`}>
                                    <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
                                        <div className="flex-1 px-5 py-6 md:px-6 md:py-8">
                                            <div className="flex flex-wrap items-center gap-1.5 mb-3">
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300`}>{article.subCategory}</span>
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-blue-100 text-blue-700`}>{article.location}</span>
                                                {isNew(article) && <span className="bg-green-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">New</span>}
                                            </div>
                                            <Link to={`/${(category || article.mainCategory || 'news').toLowerCase().replace(/\s+/g, '-')}/${article.slug}`}>
                                                <h2 className={`text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug hover:${textColor} cursor-pointer transition-colors mb-4`}>{article.title}</h2>
                                            </Link>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Post Date</p>
                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                        {new Date(article.postDate || article.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</p>
                                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{article.location || 'India'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-48 xl:w-56 shrink-0 bg-slate-50/50 dark:bg-slate-900/10 px-5 py-6 md:px-6 md:py-8 flex flex-col items-center justify-center text-center gap-4">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                                <p className={`text-xs font-black uppercase tracking-wider text-green-600`}>Active</p>
                                            </div>
                                            <Link to={`/${(category || article.mainCategory || 'news').toLowerCase().replace(/\s+/g, '-')}/${article.slug}`} className={`w-full text-[10px] font-black px-4 py-2.5 rounded-lg uppercase tracking-wider transition-all duration-200 whitespace-nowrap text-center shadow-sm hover:shadow-md bg-${theme === 'primary' ? 'primary' : theme + '-600'} text-white hover:opacity-90`}>
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-slate-400 font-bold">{activeFilters ? 'No results found for your filters.' : `No ${category || 'Updates'} found at the moment.`}</p>
                            </div>
                        )}
                    </div>

                    <aside className="w-full lg:w-80 shrink-0 space-y-6">
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className={`${bgClass} px-4 py-3 flex items-center gap-2`}>

                                <Icon size={14} className="text-white" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Community</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                <a href="https://t.me/zoyacenter" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg p-2 -mx-2 transition-colors group">
                                    <div className="size-8 bg-[#2CA5E0] rounded-lg flex items-center justify-center text-white shrink-0">
                                        <Send size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">Telegram Channel</p>
                                        <p className="text-[10px] text-slate-400">Instant Alerts</p>
                                    </div>
                                </a>
                                <a href="#" className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg p-2 -mx-2 transition-colors group">
                                    <div className="size-8 bg-[#25D366] rounded-lg flex items-center justify-center text-white shrink-0">
                                        <MessageCircle size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">WhatsApp Group</p>
                                        <p className="text-[10px] text-slate-400">Daily Updates</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CategoryPageTemplate;
