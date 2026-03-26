import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BadgeCheck, ArrowRight, ChevronRight, Loader2 } from 'lucide-react';
import { ListItemsSkeleton } from '../../../common/Skeleton';
import { fetchArticles } from '../../../../store/thunk/articleThunk';
import { Link } from 'react-router-dom';

const AdmitCardSection = () => {
    const dispatch = useDispatch();
    const [admitCards, setAdmitCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAdmitCards = async () => {
            try {
                setLoading(true);
                const result = await dispatch(fetchArticles({ mainCategory: 'Admit Card', limit: 10 })).unwrap();
                setAdmitCards(result || []);
            } catch (error) {
                console.error('Failed to fetch admit cards:', error);
            } finally {
                setLoading(false);
            }
        };
        getAdmitCards();
    }, [dispatch]);

    return (
        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md shadow-slate-200/60 dark:shadow-black/20 card-lift">

            {/* Header Bar */}
            <div className="bg-linear-to-r from-blue-600 to-blue-700 px-5 py-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <BadgeCheck size={16} /> Admit Card
                </h2>
                <Link
                    to="/admit-card"
                    className="group/btn text-[11px] text-white/75 hover:text-white border border-white/30 hover:border-white/70 hover:bg-white/10 px-2.5 py-0.5 rounded-full transition-all duration-200 inline-flex items-center gap-1.5"
                >
                    View All
                    <ArrowRight size={11} className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </Link>
            </div>

            {/* Admit Card List */}
            <ul className="text-sm min-h-[100px]">
                {loading ? (
                    <div className="p-0">
                        <ListItemsSkeleton count={6} />
                    </div>
                ) : admitCards.length > 0 ? (
                    admitCards.map((card, index) => (
                        <li
                            key={card._id}
                            className="group relative border-l-[3px] border-transparent hover:border-blue-500 transition-all duration-200"
                        >
                            {/* Hover glow strip */}
                            <span className="absolute inset-0 bg-linear-to-r from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                            <Link
                                to={`/${card.mainCategory?.toLowerCase().replace(/\s+/g, '-')}/${card.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative flex items-center gap-2.5 px-4 py-[11px]"
                            >
                                <ChevronRight
                                    size={13}
                                    className="shrink-0 text-blue-300 dark:text-blue-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200"
                                />
                                <span className="text-[14px] font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-all duration-200 leading-snug truncate">
                                    {card.title}
                                </span>
                            </Link>
                        </li>
                    ))
                ) : (
                    <div className="py-8 text-center text-slate-400 text-xs font-medium">
                        No admit cards found.
                    </div>
                )}
            </ul>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700 text-center">
                <Link
                    to="/admit-card"
                    className="group/footer text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1.5 transition-colors duration-200 no-underline"
                >
                    View All Admit Cards
                    <ArrowRight size={11} className="transition-transform duration-200 group-hover/footer:translate-x-1" />
                </Link>
            </div>
        </section>
    );
};

export default AdmitCardSection;