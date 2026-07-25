import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Home, 
    Download,
    BookOpen, 
    FileCheck, 
    User, 
    Menu, 
    X, 
    Briefcase, 
    CheckCircle, 
    Image as ImageIcon, 
    School, 
    Info, 
    Mail, 
    Newspaper 
} from 'lucide-react';

const MobileBottomBar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleDownloadApp = () => {
        setIsMenuOpen(false);
    };

    const primaryNavItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/university-cources', label: 'Courses', icon: BookOpen },
        { path: 'menu', label: 'Menu', icon: Menu }, // Special action
        { path: '/course-admit-cards', label: 'Admit Card', icon: FileCheck },
        { path: '/profile', label: 'Profile', icon: User }
    ];

    const allLinks = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'University & Courses', path: '/university-cources', icon: School },
        { name: 'Latest News', path: '/latest-news', icon: Newspaper },
        { name: 'Course Admit Card', path: '/course-admit-cards', icon: FileCheck },
        { name: 'Admit Card', path: '/admit-cards', icon: FileCheck },
        { name: 'Result', path: '/result', icon: CheckCircle },
        { name: 'Service', path: '/service', icon: Briefcase },
        { name: 'Gallery', path: '/gallery', icon: ImageIcon },
        { name: 'About Us', path: '/about', icon: Info },
        { name: 'Contact Us', path: '/contact', icon: Mail },
        { name: 'Download App', path: '#download-app', icon: Download, isDownload: true },
    ];

    return (
        <>
            {/* Overlay for Menu Drawer */}
            {isMenuOpen && (
                <div 
                    className="md:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setIsMenuOpen(false)}
                ></div>
            )}

            {/* Menu Drawer */}
            <div 
                className={`md:hidden fixed bottom-16 left-0 w-full bg-white dark:bg-slate-900 border-t-2 border-primary/20 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 ease-spring ${
                    isMenuOpen ? 'translate-y-0' : 'translate-y-[120%]'
                }`}
            >
                <div className="p-5 pb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Quick Navigate</h3>
                        <button 
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 cursor-pointer bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                        {allLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            const Icon = link.icon;

                            if (link.isDownload) {
                                return (
                                    <a
                                        key={link.name}
                                        href="https://github.com/md-sonu07/zeck/releases/download/zoya.v01/Zoya.Education.apk"
                                        download="Zoya Education.apk"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex flex-col items-center justify-center p-3 rounded-2xl border transition-all active:scale-95 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:border-emerald-400"
                                    >
                                        <Icon size={22} className="mb-2" />
                                        <span className="text-[10px] font-bold text-center leading-tight">{link.name}</span>
                                    </a>
                                );
                            }

                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all active:scale-95 ${
                                        isActive 
                                            ? 'bg-primary/10 border-primary text-primary' 
                                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/50'
                                    }`}
                                >
                                    <Icon size={22} className={`mb-2 ${isActive ? 'animate-pulse' : ''}`} />
                                    <span className="text-[10px] font-bold text-center leading-tight">{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-50 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-around h-20 relative px-1">
                    {primaryNavItems.map((item) => {
                        const isMenu = item.path === 'menu';
                        const isActive = isMenu ? isMenuOpen : location.pathname === item.path;
                        const Icon = item.icon;
                        
                        return isMenu ? (
                            <button
                                key={item.path}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="relative cursor-pointer -top-5 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-md shadow-primary/40 hover:scale-105 active:scale-95 transition-all border-4 border-white dark:border-slate-900"
                            >
                                <Icon size={24} className={isMenuOpen ? 'rotate-90 transition-transform' : 'transition-transform'} />
                            </button>
                        ) : (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex flex-col items-center justify-center w-16 h-full space-y-1 transition-colors relative ${
                                    isActive 
                                        ? 'text-primary' 
                                        : 'text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-200'
                                }`}
                            >
                                {isActive && (
                                    <span className="absolute top-0 w-8 h-1 bg-primary rounded-b-full"></span>
                                )}
                                <Icon size={22} className={`${isActive ? 'animate-bounce-short' : ''} mt-1`} />
                                <span className="text-[9px] font-bold tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default MobileBottomBar;
