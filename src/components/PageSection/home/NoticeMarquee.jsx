import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveMarquees } from '../../../store/thunk/marqueeThunk';
import { RadioTower } from 'lucide-react';

const NoticeMarquee = () => {
    const dispatch = useDispatch();
    const { activeMarquees, loading } = useSelector((state) => state.marquee);

    useEffect(() => {
        dispatch(fetchActiveMarquees());
    }, [dispatch]);

    const defaultUpdates = [
        "Welcome to Zoya Education Centre",
        "Loading latest updates...",
    ];

    const displayUpdates = activeMarquees && activeMarquees.length > 0
        ? activeMarquees.map(m => m.text)
        : defaultUpdates;


    return (
        <div className="max-w-[1200px] mx-auto mt-4 px-4 overflow-hidden">
            <div className="flex items-center bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm h-11 backdrop-blur-md">
                <div className="relative flex shrink-0 items-center gap-2.5 h-full px-5 z-10 bg-linear-to-br from-accent to-[#c0392b] shadow-[4px_0_12px_rgba(230,57,70,0.3)]">
                    <RadioTower className="text-white/90 hidden sm:block" size={16} />
                    <div className="flex flex-col leading-none">
                        <span className="text-white font-black text-[10px] tracking-[0.2em] uppercase leading-tight">LIVE</span>
                        <span className="text-white/60 font-medium text-[8px] tracking-widest uppercase">UPDATES</span>
                    </div>
                    <span className="live-dot live-dot-ring bg-white!"></span>

                    {/* Decorative slice */}
                    <div className="absolute right-0 top-0 h-full w-3 overflow-hidden pointer-events-none">
                        <div className="absolute right-0 top-0 h-full w-6 bg-background-light dark:bg-background-dark"
                            style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }}></div>
                    </div>
                </div>

                <div className="marquee-wrap flex-1 overflow-hidden h-full flex items-center bg-slate-50/30 dark:bg-transparent">
                    <div className="marquee-track whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-bold">
                        {/* Duplicate the array 4 times to ensure it covers wide screens and loops perfectly without gaps */
                            [...displayUpdates, ...displayUpdates, ...displayUpdates, ...displayUpdates].map((text, idx) => (
                                <React.Fragment key={idx}>
                                    {activeMarquees.length > 0 && activeMarquees[idx % displayUpdates.length]?.link ? (
                                        <a href={activeMarquees[idx % displayUpdates.length].link} target="_blank" rel="noopener noreferrer" className={`mx-4 hover:underline transition-colors ${idx % 2 === 1 ? 'text-accent' : 'hover:text-primary'}`}>
                                            {text}
                                        </a>
                                    ) : (
                                        <span className={`mx-4 cursor-pointer transition-colors ${idx % 2 === 1 ? 'text-accent' : 'hover:text-primary'}`}>
                                            {text}
                                        </span>
                                    )}
                                    <span className="ticker-sep opacity-30">◆</span>
                                </React.Fragment>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeMarquee;
