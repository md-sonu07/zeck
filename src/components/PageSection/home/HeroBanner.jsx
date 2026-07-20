import { Link } from 'react-router-dom';
import { Newspaper, CheckCircle, IdCard, GraduationCap, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContactSettings } from '../../../store/thunk/contactThunk';

const HeroBanner = () => {
    const dispatch = useDispatch();
    const { settings: contactSettings } = useSelector((state) => state.contact);

    useEffect(() => {
        if (!contactSettings) dispatch(fetchContactSettings());
    }, [dispatch, contactSettings]);
    return (
        <div className="relative bg-linear-to-br from-[#0d47a1] via-primary to-[#1565c0] overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/5 rounded-full blur-xl"></div>
                <div className="absolute top-4 left-4 w-2 h-2 bg-white/30 rounded-full"></div>
                <div className="absolute top-8 left-16 w-1 h-1 bg-white/20 rounded-full"></div>
                <div className="absolute bottom-4 right-32 w-2 h-2 bg-yellow-300/40 rounded-full"></div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12 relative z-10">
                <div className="flex flex-col gap-8 md:gap-12">
                    {/* Hero text */}
                    <div className="w-full">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="live-dot"></span>
                            <span className="text-green-300 text-[10px] font-bold tracking-[0.2em] uppercase">
                                Real-time News Updates Today
                            </span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-black leading-none tracking-tight">
                                <span className="bg-clip-text text-transparent bg-linear-to-b from-white to-blue-50 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
                                    ZOYA EDUCATION CENTER & TRUST
                                </span>
                            </h1>
                            {/* Minimalist Bold Certification - Clean & Authoritative */}
                            <div className="mb-8 border-l-4 border-yellow-400 pl-5 py-0.5 group cursor-default">
                                <h3 className="text-white text-xl font-black tracking-tight uppercase leading-none group-hover:translate-x-1 transition-transform duration-300">
                                   AN ISO 9001:2015 <span className="text-yellow-300 font-mono italic">Certified Organization</span>
                                </h3>
                                <p className="text-white/90 text-[10px] font-bold tracking-[0.3em] uppercase mt-2 font-mono">
                                    License: Q2A-2026-0330T117681
                                </p>
                            </div>

                            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight max-w-4xl tracking-tight -mt-4">
                                किसी भी कोर्स के लिए संपर्क करें {" "}
                                <span className="text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.4)] block sm:inline">
                                    {contactSettings?.phoneNo || '+91 9162653235'}
                                </span>
                            </h2>
                            <p className="text-white text-sm md:text-2xl font-medium mt-3 max-w-2xl">
                                बिहार स्टूडेंट क्रेडिट कार्ड योजना के माध्यम से
                            </p>
                        </div>

                        {/* Stats cards moved after headings */}
                        <div className="hidden grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-5xl ">
                            {[
                                { label: 'News Updates', value: '5000+' },
                                { label: 'Results', value: '1200+' },
                                { label: 'Admit Cards', value: '800+' },
                                { label: 'Visitors/mo', value: '10L+' }
                            ].map((stat, idx) => (
                                <div key={idx} className="stat-card group bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 text-center cursor-default hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                                    <p className="text-2xl md:text-2xl font-black text-white group-hover:scale-110 transition-transform duration-300">
                                        {stat.value.replace('+', '')}<span className="text-yellow-300">+</span>
                                    </p>
                                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-2 font-bold">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-3 mt-8">
                            <Link to="/latest-news"
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 bg-white text-primary font-bold text-[10px] px-5 py-3 rounded-xl shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300 uppercase tracking-widest whitespace-nowrap">
                                <Newspaper size={14} className="shrink-0" /> LATEST NEWS
                            </Link>

                            <Link to="university-cources"
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] px-5 py-3 rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300 uppercase tracking-widest whitespace-nowrap">
                                <GraduationCap size={14} className="shrink-0" /> UNIVERSITY
                            </Link>

                            <Link to="/result"
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] px-5 py-3 rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300 uppercase tracking-widest whitespace-nowrap">
                                <CheckCircle size={14} className="shrink-0" /> RESULTS
                            </Link>

                            <Link to="/admit-cards"
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] px-5 py-3 rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300 uppercase tracking-widest whitespace-nowrap">
                                <IdCard size={14} className="shrink-0" /> ADMIT CARDS
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wave effect at bottom */}
            <div className="hero-wave">
                <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
                    className="w-full h-8 md:h-10 block">
                    <path d="M0 32C240 10 480 0 720 8C960 16 1200 28 1440 20V32H0Z" className="fill-background-light dark:fill-background-dark" />
                </svg>
            </div>
        </div>
    );
};

export default HeroBanner;
