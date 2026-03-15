import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchImportantServices } from '../../../store/thunk/importantServiceThunk';
import { fetchContactSettings } from '../../../store/thunk/contactThunk';
import { Home, ChevronRight, Briefcase, CheckCircle2, MessageCircle, Send, Sparkles, Loader2, Phone, MapPin } from 'lucide-react';

const ServicesPage = () => {
    const dispatch = useDispatch();
    const { data: allServices, loading } = useSelector((state) => state.importantServices);
    const { settings: contactDetail } = useSelector((state) => state.contact);

    React.useEffect(() => {
        dispatch(fetchImportantServices());
        dispatch(fetchContactSettings());
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
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {services.map(service => (
                                    <div
                                        key={service._id}
                                        className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col h-full"
                                    >
                                        {/* Image Area - Fixed Height for vertical layout */}
                                        <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
                                            <img
                                                src={service.image}
                                                alt={service.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm">
                                                <CheckCircle2 size={10} className="text-primary" />
                                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">Verified</span>
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="mb-3">
                                                <h3 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors leading-snug line-clamp-1 mb-1.5">
                                                    {service.title}
                                                </h3>
                                                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                                                    {service.summary}
                                                </p>
                                            </div>

                                            <div className="mt-auto space-y-4">
                                                {/* Meta Info */}
                                                <div className="flex flex-wrap items-center justify-between gap-y-2 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 max-w-[150px]">
                                                        <MapPin size={12} className="shrink-0" />
                                                        <span className="truncate">{contactDetail?.address || 'Location Unavailable'}</span>
                                                    </div>
                                                    
                                                </div>

                                                {/* Contact Actions */}
                                                <div className="grid grid-cols-2 gap-2 mt-4">
                                                    <a
                                                        href={`tel:${contactDetail?.phoneNo}`}
                                                        className="flex items-center text-nowrap justify-center gap-1.5 py-2.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-200 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-300 border border-transparent"
                                                    >
                                                        <Phone size={15} />
                                                        <span>Call Now</span>
                                                    </a>
                                                    <a
                                                        href={contactDetail?.whatsappLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center text-nowrap justify-center gap-1.5 py-2.5 px-3 bg-green-500/10 dark:bg-green-500/10 hover:bg-green-500 hover:text-white transition-all duration-200 rounded-xl text-[11px] font-bold text-green-600 dark:text-green-400 border border-green-500/20"
                                                    >
                                                        <MessageCircle size={15} />
                                                        <span>WhatsApp</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
