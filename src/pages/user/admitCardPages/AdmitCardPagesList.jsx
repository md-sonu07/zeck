import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAdmitCardPages } from '../../../store/thunk/admitCardPageThunk';
import { FileText, ChevronRight, Home, Search } from 'lucide-react';
import SEO from '../../../components/common/SEO';
import { CourseAdmitCardSkeleton } from '../../../components/common/Skeleton';

const AdmitCardPagesList = () => {
    const dispatch = useDispatch();
    const { pages, loading } = useSelector((state) => state.admitCardPages);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchAdmitCardPages());
    }, [dispatch]);

    useEffect(() => {
        if (!loading) setInitialLoading(false);
    }, [loading]);

    return (
        <>
            <SEO
                title="Admit Cards"
                description="Download your admit cards for all upcoming government exams. Find your admit card by roll number or name."
                keywords="admit card, hall ticket, download admit card, search admit card"
            />
            <div className="pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
                <div className="bg-blue-600 px-4 py-6">
                    <div className="max-w-[1200px] mx-auto">
                        <nav className="flex items-center gap-1.5 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-2">
                            <Home size={10} /> <ChevronRight size={10} /> <span className="text-white">Admit Cards</span>
                        </nav>
                        <h1 className="text-2xl font-black text-white tracking-tight">Download Admit Card 2026</h1>
                        <p className="text-white/80 text-xs mt-1">Search and download admit cards by roll number or name.</p>
                    </div>
                </div>

                <div className="max-w-[1200px] mx-auto px-4 mt-6">
                    {initialLoading ? (
                        <CourseAdmitCardSkeleton />
                    ) : loading ? (
                        <CourseAdmitCardSkeleton />
                    ) : pages.length === 0 ? (
                        <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                            <FileText size={48} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-slate-400 font-bold">No admit card pages available.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pages.map((page) => (
                                <Link
                                    key={page._id}
                                    to={'/admit-cards/' + page.slug}
                                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-400/30 transition-all duration-200 group"
                                >
                                    <div className="h-36 bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden">
                                        {page.imageUrl && (
                                            <img src={page.imageUrl} alt="" className="w-full h-full object-cover opacity-40" />
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <FileText size={48} className="text-white/80" />
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h2 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">
                                            {page.title}
                                        </h2>
                                        {page.description && (
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{page.description}</p>
                                        )}
                                        <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-primary">
                                            Search Admit Card <ChevronRight size={16} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdmitCardPagesList;
