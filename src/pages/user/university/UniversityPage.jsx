import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { School, ChevronRight, Home, Send, Instagram, Youtube } from 'lucide-react';
import HomeCoursesSection from '../../../components/PageSection/home/linkSection/HomeCoursesSection';
import QuickLinksWidget from '../../../components/common/QuickLinksWidget';
import SEO from '../../../components/common/SEO';
import WhatsAppIcon from '../../../components/common/WhatsAppIcon';
import AdSlot from '../../../components/common/AdSlot';
import { fetchContactSettings } from '../../../store/thunk/contactThunk';

const UniversityPage = () => {
    const dispatch = useDispatch();
    const contactDetail = useSelector((state) => state.contact.settings);
    const contactLoading = useSelector((state) => state.contact.loading);

    useEffect(() => { if (!contactDetail) dispatch(fetchContactSettings()); }, [dispatch, contactDetail]);
    return (
        <div className="pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <SEO
                title="Universities & Courses"
                description="Explore top universities, courses, fee structures, and admission details for premier institutions across India. Find BCA, BBA, MBA, B.Tech and more courses at Zoya Education Center."
                keywords="university courses, BCA, BBA, MBA, B.Tech, admission, fee structure, top universities India, Bihar university"
            />
            <div className="bg-indigo-600 px-4 py-6">
                <div className="max-w-[1200px] mx-auto">
                    <nav className="flex items-center gap-1.5 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Home size={10} /> <ChevronRight size={10} /> <span className="text-white">University & Courses</span>
                    </nav>
                    <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <School className="text-white" /> Top Universities & Courses in India 2026
                    </h1>
                    <p className="text-white/80 text-xs mt-1">Explore rankings, available courses, fee structures, and admission details for premier institutions.</p>
                </div>
            </div>

            <main className="max-w-[1200px] mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Courses List */}
                    <div className="lg:col-span-9 space-y-4">
                        <div className="section-label">
                            <School className="text-indigo-500" size={10} /> All Courses
                        </div>
                        <HomeCoursesSection hideViewAll={true} />
                    </div>

                    {/* Right Column - Sidebar */}
                    <aside className="lg:col-span-3 w-full shrink-0 space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Quick Links
                        </p>
                        <QuickLinksWidget />
                        <AdSlot adSlot="7576013317" className="min-h-[250px]" />
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-indigo-600 px-4 py-3 flex items-center gap-2">
                                <School size={14} className="text-white" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Community</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {contactLoading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 -mx-2">
                                            <div className="size-8 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
                                            <div className="flex-1 space-y-1.5">
                                                <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
                                                <div className="h-2 w-16 bg-slate-100 dark:bg-slate-700 animate-pulse rounded" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                {contactDetail?.telegramLink && (
                                <a href={contactDetail.telegramLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg p-2 -mx-2 transition-colors group">
                                    <div className="size-8 bg-[#2CA5E0] rounded-lg flex items-center justify-center text-white shrink-0">
                                        <Send size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">Telegram Channel</p>
                                        <p className="text-[10px] text-slate-400">Instant Alerts</p>
                                    </div>
                                </a>
                                )}
                                {contactDetail?.whatsappLink && (
                                <a href={contactDetail.whatsappLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg p-2 -mx-2 transition-colors group">
                                    <div className="size-8 bg-green-500 rounded-lg flex items-center justify-center text-white shrink-0">
                                        <WhatsAppIcon size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">WhatsApp Group</p>
                                        <p className="text-[10px] text-slate-400">Daily Updates</p>
                                    </div>
                                </a>
                                )}
                                {contactDetail?.instagramLink && (
                                <a href={contactDetail.instagramLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg p-2 -mx-2 transition-colors group">
                                    <div className="size-8 bg-pink-600 rounded-lg flex items-center justify-center text-white shrink-0">
                                        <Instagram size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-pink-600 transition-colors">Instagram</p>
                                        <p className="text-[10px] text-slate-400">Follow Us</p>
                                    </div>
                                </a>
                                )}
                                {contactDetail?.youtubeLink && (
                                <a href={contactDetail.youtubeLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg p-2 -mx-2 transition-colors group">
                                    <div className="size-8 bg-red-600 rounded-lg flex items-center justify-center text-white shrink-0">
                                        <Youtube size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-red-600 transition-colors">YouTube</p>
                                        <p className="text-[10px] text-slate-400">Subscribe</p>
                                    </div>
                                </a>
                                )}
                                    </>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default UniversityPage;
