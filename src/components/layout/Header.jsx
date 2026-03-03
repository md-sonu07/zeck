import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../store/slice/themeSlice';
import {
    Search,
    Menu,
    X,
    Sun,
    Moon,
    User,
    House,
    FileText,
    CheckCircle,
    Key,
    Book,
    GraduationCap,
    Mail,
    Newspaper
} from 'lucide-react';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { userInfo } = useSelector((state) => state.auth);
    const { darkMode } = useSelector((state) => state.theme);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Home', path: '/', icon: House },
        { name: 'Latest News', path: '/latest-news', icon: Newspaper },
        { name: 'Admit Card', path: '/admit-card', icon: FileText },
        { name: 'Result', path: '/result', icon: CheckCircle },
        { name: 'Answer Key', path: '/answer-key', icon: Key },
        { name: 'Syllabus', path: '/syllabus', icon: Book },
        { name: 'Admission', path: '/admission', icon: GraduationCap },
        { name: 'Contact Us', path: '/contact', icon: Mail },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (trimmed) {
            navigate(`/search?q=${encodeURIComponent(trimmed)}`);
            setSearchQuery('');
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Header Content (Logo Row) */}
            <header className="flex items-center justify-between py-2 md:py-4 gap-4">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-3 shrink-0 group">
                    <div className="">
                        <div className="size-11 sm:size-12 rounded-md flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                            <img
                                src={darkMode ? "/logo/crop-logoo.png" : "/logo/light-logo.png"}
                                alt="Zoya Education Centre"
                                className="w-full h-full object-contain scale-[1.2] brightness-110"
                            />
                        </div>
                    </div>
                    <div className="leading-tight hidden sm:block">
                        <h1 className="text-lg md:text-[1.35rem] font-black tracking-tighter flex items-center">
                            <span className="text-primary">Zoya</span>
                            <span className="text-slate-800 dark:text-white ml-1">Education Centre</span>
                        </h1>
                        <p className="hidden sm:block text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.15em] mt-0.5">
                            Recent Updates · Results · Admit Cards
                        </p>
                    </div>
                </Link>

                {/* Right Actions Section */}
                <div className="flex items-center gap-3">
                    {/* Desktop Search Bar */}
                    <form onSubmit={handleSearch} className="hidden md:flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-1 py-1 gap-2 focus-within:border-primary focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:shadow-[0_0_0_4px_rgba(23,115,207,0.08)] transition-all w-72 lg:w-96">
                        <Search className="text-slate-400 shrink-0" size={16} />
                        <input
                            type="text"
                            placeholder="Search news, results, admit cards..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none focus:ring-0 text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 w-full px-2"
                        />
                        <button
                            type="submit"
                            className="bg-primary text-white text-[10px] font-black uppercase px-4 py-2 rounded-lg hover:bg-primary-dark transition-all active:scale-95 shrink-0"
                        >
                            Search
                        </button>
                    </form>

                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className="size-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-all active:scale-95"
                            title={darkMode ? 'Light Mode' : 'Dark Mode'}
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {/* Profile/Login Button */}
                        <Link
                            to={userInfo ? "/profile" : "/login"}
                            className={`flex size-10 items-center justify-center rounded-xl border transition-all active:scale-95 ${userInfo
                                    ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary'
                                    : 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                }`}
                            title={userInfo ? "My Profile" : "Sign In to your account"}
                        >
                            {userInfo ? (
                                <div className="size-8 rounded-full bg-linear-to-br from-primary to-primary-dark text-white flex items-center justify-center text-[10px] font-black shadow-md uppercase animate-in fade-in duration-500">
                                    {userInfo.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                            ) : (
                                <User size={18} />
                            )}
                        </Link>


                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsOpen(true)}
                            className="md:hidden size-10 flex items-center justify-center bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            <div className={`fixed inset-0 z-100 md:hidden transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
                <div
                    className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsOpen(false)}
                ></div>
                <div className={`absolute top-0 right-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="size-9 rounded-xl bg-linear-to-br from-primary to-primary-dark text-white flex items-center justify-center font-black text-sm uppercase">ZC</div>
                            <span className="font-black text-base uppercase tracking-tighter text-slate-800 dark:text-white">Zoya Centre</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="size-9 cursor-pointer rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-6 px-4 hide-scrollbar">
                        {/* Mobile Search Bar */}
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-1 py-1 gap-2 focus-within:border-primary focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                                <Search className="text-slate-400 shrink-0" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none outline-none focus:ring-0 text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 w-full px-2"
                                />
                                <button
                                    type="submit"
                                    className="bg-primary cursor-pointer text-white text-[10px] font-black uppercase px-4 py-2 rounded-lg hover:bg-primary-dark transition-all active:scale-95 shrink-0"
                                >
                                    Go
                                </button>
                            </div>
                        </form>

                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 pl-3 flex items-center gap-2">
                            <div className="w-1 h-3 bg-primary rounded-full"></div>
                            Main Navigation
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                            {navLinks.map((link, idx) => (
                                <Link
                                    key={idx}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-primary/5 hover:text-primary transition-all border border-transparent hover:border-primary/10"
                                >
                                    <link.icon size={18} />
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
