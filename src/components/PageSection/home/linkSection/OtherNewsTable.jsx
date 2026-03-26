import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Newspaper, ArrowRight, ChevronRight, Hash, Layout, LayoutGrid } from 'lucide-react';
import { fetchPageSections } from '../../../../store/thunk/pageSectionThunk';
import { fetchArticles } from '../../../../store/thunk/articleThunk';
import { Link } from 'react-router-dom';
import { ListItemsSkeleton } from '../../../common/Skeleton';

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'started': return 'bg-green-500';
        case 'completed': return 'bg-blue-500';
        case 'data expand': return 'bg-orange-500';
        default: return 'bg-red-500';
    }
};

const OtherNewsTable = () => {
    const dispatch = useDispatch();
    const { sections: customSections } = useSelector((state) => state.pageSections);
    const [articlesBySection, setArticlesBySection] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Fetch sections if not already loaded
                if (customSections.length === 0) {
                    await dispatch(fetchPageSections()).unwrap();
                }

                // Fetch all articles for custom sections specifically
                const results = await Promise.all(
                    customSections.map(section => 
                        dispatch(fetchArticles({ mainCategory: section.title, limit: 10 })).unwrap()
                    )
                );
                
                const grouped = {};
                customSections.forEach((section, index) => {
                    grouped[section.title] = results[index] || [];
                });
                
                setArticlesBySection(grouped);
            } catch (error) {
                console.error('Failed to load other news data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (customSections.length > 0) {
            loadData();
        } else {
            dispatch(fetchPageSections());
        }
    }, [dispatch, customSections]);

    if (!loading && customSections.length === 0) return null;

    return (
        <section className="">
            <div className="section-label mb-4 mt-8 flex items-center gap-2">
                <Newspaper className="text-orange-500" size={10} /> Other News & Resources
            </div>

            <div className="bg-white card-lift dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md shadow-slate-200/60 dark:shadow-black/20">
                {/* Header Bar */}
                <div className="bg-linear-to-r from-orange-500 to-amber-600 px-5 py-3">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Hash size={15} /> Other News Table
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="hidden md:table-header-group bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest w-1/3">Section Title</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest w-2/3">Recent Updates</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700 flex flex-col md:table-row-group">
                            {loading ? (
                                <tr className="flex flex-col md:table-row">
                                    <td colSpan="2" className="p-6">
                                        <ListItemsSkeleton count={5} />
                                    </td>
                                </tr>
                            ) : customSections.length > 0 ? (
                                customSections.map((section) => (
                                    <tr key={section._id} className="flex flex-col md:table-row hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-all duration-200">
                                        <td className="px-6 py-5 md:align-top border-b md:border-b-0 border-slate-50 dark:border-slate-700/50">
                                            <Link 
                                                to={`/${section.title?.toLowerCase().replace(/\s+/g, '-')}`}
                                                className="group inline-flex items-center gap-3"
                                            >
                                                <div className="size-9 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 shadow-sm shadow-orange-500/10 group-hover:shadow-orange-500/30">
                                                    <Layout size={18} className="transition-transform group-hover:rotate-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors uppercase tracking-tight">
                                                        {section.title}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors">
                                                        Custom Page
                                                    </span>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-3">
                                                {articlesBySection[section.title]?.length > 0 ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-6 gap-y-3">
                                                        {articlesBySection[section.title].map(art => (
                                                            <Link
                                                                key={art._id}
                                                                to={`/${art.mainCategory?.toLowerCase().replace(/\s+/g, '-')}/${art.slug}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-start justify-between gap-2 group/item"
                                                            >
                                                                <div className="flex items-start gap-2 min-w-0">
                                                                    <div className="mt-1.5 size-1 rounded-full bg-slate-300 dark:bg-slate-600 group-hover/item:bg-orange-500 transition-all shrink-0" />
                                                                    <span className="text-[13px] font-semibold text-slate-600 dark:text-slate-400 group-hover/item:text-orange-600 dark:group-hover/item:text-orange-400 transition-colors leading-tight line-clamp-2 md:line-clamp-1">
                                                                        {art.title}
                                                                    </span>
                                                                </div>
                                                                <div className="shrink-0">
                                                                    <span className={`text-[9px] font-extrabold ${getStatusColor(art.status)} text-white px-2 py-0.5 rounded-md tracking-wide animate-pulse uppercase`}>
                                                                        {art.status || 'NEW'}
                                                                    </span>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500 italic text-center block md:text-left">No updates available in this section.</span>
                                                )}
                                                
                                                {articlesBySection[section.title]?.length > 0 && (
                                                    <div className="pt-2 flex justify-center md:justify-start">
                                                        <Link 
                                                            to={`/${section.title?.toLowerCase().replace(/\s+/g, '-')}`}
                                                            className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 flex items-center gap-1 group/more px-3 py-1 bg-orange-50 dark:bg-orange-950/20 rounded-full md:bg-transparent md:p-0"
                                                        >
                                                            View All {section.title}
                                                            <ArrowRight size={10} className="transition-transform group-hover/more:translate-x-1" />
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default OtherNewsTable;
