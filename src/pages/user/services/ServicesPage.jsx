import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchImportantServices } from '../../../store/thunk/importantServiceThunk';
import { Home, ChevronRight, Briefcase, Clock, CheckCircle2, MessageCircle, Send, Sparkles, Loader2 } from 'lucide-react';

const ServicesPage = () => {
    const dispatch = useDispatch();
    const { data: allServices, loading } = useSelector((state) => state.importantServices);

    React.useEffect(() => {
        dispatch(fetchImportantServices());
    }, [dispatch]);

    const services = allServices.filter(s => s.status === 'active');

    return (
        <div className="pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
            {/* Header - Compact Height */}
            <div className="bg-linear-to-r from-primary to-blue-700 px-4 py-6 md:py-8">
                <div className="max-w-[1200px] mx-auto">
                    <nav className="flex items-center gap-1.5 text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Home size={10} /> <ChevronRight size={10} /> <span className="text-white">Our Services</span>
                    </nav>
                    <h1 className="text-2xl font-black text-white tracking-tight">Important Services</h1>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 mt-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Column - Full Width horizontal cards */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="text-primary" size={14} />
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                {loading ? 'Fetching services...' : `Showing ${services.length} Essential Services`}
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="animate-spin text-primary" size={40} />
                            </div>
                        ) : services.length > 0 ? (
                            services.map(service => (
                                <div
                                    key={service._id}
                                    className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
                                >
                                    <div className="flex flex-col md:flex-row items-center p-4 gap-5">
                                        {/* Small Image Thumbnail - Decreased height */}
                                        <div className="w-full md:w-40 h-32 shrink-0 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-xs bg-slate-50 dark:bg-slate-900">
                                            <img
                                                src={service.image}
                                                alt={service.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Content Area - Full width flex-1 */}
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 size={12} className="text-primary" />
                                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">Verified Service</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors leading-tight">
                                                {service.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2 md:line-clamp-3">
                                                {service.summary}
                                            </p>

                                            <div className="pt-2 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                                        <Clock size={12} />
                                                        Updated Daily
                                                    </div>
                                                </div>
                                                <button className="text-[10px] font-black text-primary hover:text-primary-dark uppercase tracking-widest flex items-center gap-1 group/btn">
                                                    Visit Website
                                                    <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-slate-400 font-bold">No verified services found at the moment.</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Remains as requested */}
                    <div className="w-full lg:w-80 shrink-0 space-y-6">
                        <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="sec-bar px-4 py-2.5 flex items-center gap-2">
                                <Briefcase size={14} className="text-white" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Support Center</h3>
                            </div>
                            <div className="p-4 bg-slate-50/50 dark:bg-slate-900/10">
                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Need help with any of our services? Join our official community for fast assistance.
                                </p>
                                <div className="mt-4 space-y-2">
                                    <a href="#" className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-primary/30 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                                                <Send size={14} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Telegram</span>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
                                    </a>
                                    <a href="#" className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-green-500/30 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 bg-green-500 rounded-lg flex items-center justify-center text-white">
                                                <MessageCircle size={14} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">WhatsApp</span>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300 group-hover:text-green-500 transition-colors" />
                                    </a>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesPage;
