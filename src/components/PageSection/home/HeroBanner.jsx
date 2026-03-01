import { Newspaper, CheckCircle, IdCard } from 'lucide-react';

const HeroBanner = () => {
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    {/* Hero text */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="live-dot"></span>
                            <span className="text-green-300 text-[10px] font-bold tracking-[0.2em] uppercase">
                                Real-time News Updates Today
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black text-white leading-[1.15]">
                            India's Most Trusted<br className="hidden sm:block" />
                            <span className="text-yellow-300 drop-shadow-sm">Latest News & Recruitment Portal</span>
                        </h2>
                        <p className="text-white/70 text-sm mt-3 max-w-lg leading-relaxed font-medium">
                            Get instant access to Latest News, Results, Admit Cards & Syllabus — specifically curated for dedicated candidates.
                        </p>
                        <div className="flex flex-wrap gap-3 mt-6">
                            <a href="/latest-news"
                                className="inline-flex items-center gap-2 bg-white text-primary font-bold text-[11px] px-5 py-2.5 rounded-full shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                                <Newspaper size={12} /> LATEST NEWS
                            </a>
                            <a href="/result"
                                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] px-5 py-2.5 rounded-full border border-white/20 backdrop-blur-sm transition-all duration-200">
                                <CheckCircle size={12} /> RESULTS
                            </a>
                            <a href="/admit-card"
                                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] px-5 py-2.5 rounded-full border border-white/20 backdrop-blur-sm transition-all duration-200">
                                <IdCard size={12} /> ADMIT CARDS
                            </a>
                        </div>
                    </div>

                    {/* Stats cards */}
                    <div className="hidden sm:grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-3 md:min-w-[360px] lg:min-w-[420px]">
                        {[
                            { label: 'News Updates', value: '5000+' },
                            { label: 'Results', value: '1200+' },
                            { label: 'Admit Cards', value: '800+' },
                            { label: 'Visitors/mo', value: '10L+' }
                        ].map((stat, idx) => (
                            <div key={idx} className="stat-card bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 text-center cursor-default hover:bg-white/10 transition-colors">
                                <p className="text-xl md:text-2xl font-black text-white">{stat.value.replace('+', '')}<span className="text-yellow-300">+</span></p>
                                <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1 font-bold">{stat.label}</p>
                            </div>
                        ))}
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
