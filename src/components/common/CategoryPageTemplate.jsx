import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles } from '../../store/thunk/articleThunk';
import { ChevronRight, Home, MessageCircle, ChevronLeft, Send, MapPin, Calendar, Info } from 'lucide-react';
import { CategorySkeleton } from './Skeleton';
import FilterStrip from '../PageSection/home/FilterStrip';
import { Link } from 'react-router-dom';
import QuickLinksWidget from './QuickLinksWidget';
import SEO from './SEO';

const isNew = (article) => {
    const date = article?.postDate || article?.createdAt;
    if (!date) return false;
    const now = new Date();
    const post = new Date(date);
    const diffInDays = (now - post) / (1000 * 60 * 60 * 24);
    return diffInDays <= 2;
};

const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
        case 'started':
            return {
                bg: 'bg-green-500',
                text: 'text-green-600'
            };
        case 'completed':
            return {
                bg: 'bg-blue-500',
                text: 'text-blue-600'
            };
        case 'data expand':
            return {
                bg: 'bg-orange-500',
                text: 'text-orange-600'
            };
        default:
            return {
                bg: 'bg-red-500',
                text: 'text-rose-600'
            };
    }
};

const CategoryPageTemplate = ({ category, theme = 'primary', icon: Icon = Info, title: pageTitle, description, filter: customFilter, limit = 40 }) => {
    const dispatch = useDispatch();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

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
                setCurrentPage(1); // Reset to page 1 on category change
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

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentArticles = displayArticles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(displayArticles.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) {
        return <CategorySkeleton />;
    }

    return (
        <div className="pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <SEO
                title={pageTitle || `${category || 'Latest'} 2026`}
                description={description || `Latest ${category || 'news'} notifications, updates, and information. Stay updated with Zoya Education Center.`}
                keywords={`${category || 'education'}, ${category || 'news'} 2026, government jobs, sarkari naukri, exam updates, Zoya Education Center`}
            />
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
                            {isLoading ? 'Fetching Updates...' : `Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, displayArticles.length)} of ${displayArticles.length} ${activeFilters ? 'Results' : (category || 'Updates')}`}
                        </p>

                        {currentArticles.length > 0 ? (
                            <>
                                {currentArticles.map(article => (
                                    <div key={article._id} className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-${theme}-400/30 transition-all duration-200`}>
                                        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
                                            <div className="flex-1 px-5 py-6 md:px-6 md:py-8">
                                                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300`}>{article.subCategory}</span>
                                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-blue-100 text-blue-700`}>{article.location}</span>
                                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider text-white animate-pulse ${getStatusStyles(article.status).bg}`}>{article.status || 'NEW'}</span>

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
                                                    <p className={`text-xs font-black uppercase tracking-wider ${getStatusStyles(article.status).text}`}>
                                                        {article.status || 'New'}
                                                    </p>
                                                </div>
                                                <Link to={`/${(category || article.mainCategory || 'news').toLowerCase().replace(/\s+/g, '-')}/${article.slug}`} className={`w-full text-[10px] font-black px-4 py-2.5 rounded-lg uppercase tracking-wider transition-all duration-200 whitespace-nowrap text-center shadow-sm hover:shadow-md bg-${theme === 'primary' ? 'primary' : theme + '-600'} text-white hover:opacity-90`}>
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination UI */}
                                {totalPages > 1 && (
                                    <div className="flex flex-wrap justify-center items-center gap-2 pt-8 pb-4">
                                        <button
                                            onClick={() => paginate(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="size-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>

                                        {[...Array(totalPages)].map((_, i) => {
                                            const page = i + 1;
                                            // Show first, last, current, and pages around current
                                            if (
                                                page === 1 ||
                                                page === totalPages ||
                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => paginate(page)}
                                                        className={`size-10 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${currentPage === page
                                                            ? `bg-${theme === 'primary' ? 'primary' : theme + '-600'} text-white shadow-lg shadow-${theme === 'primary' ? 'primary' : theme + '-600'}/25`
                                                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            } else if (
                                                page === currentPage - 2 ||
                                                page === currentPage + 2
                                            ) {
                                                return <span key={page} className="text-slate-400 px-1">...</span>;
                                            }
                                            return null;
                                        })}

                                        <button
                                            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="size-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-slate-400 font-bold">{activeFilters ? 'No results found for your filters.' : `No ${category || 'Updates'} found at the moment.`}</p>
                            </div>
                        )}
                    </div>

                    <aside className="w-full lg:w-80 shrink-0 space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Quick Links
                        </p>
                        <QuickLinksWidget />
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
