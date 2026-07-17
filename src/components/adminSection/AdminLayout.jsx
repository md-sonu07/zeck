import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../store/slice/themeSlice';
import {
    LayoutDashboard,
    Users,
    FileText,
    ListTree,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
    Settings,
    Bell,
    Home,
    Info,
    PhoneCall,
    ChevronRight,
    ArrowLeft,
    Sparkles,
    Megaphone,
    History,
    CreditCard,
    MessageSquare,
    Image,
    BadgeCheck,
    BookOpen,
    BookMarked,
    ClipboardList
} from 'lucide-react';
import { logout as logoutUser } from '../../store/thunk/authThunk';




const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { darkMode } = useSelector((state) => state.theme);
    const { userInfo } = useSelector((state) => state.auth);

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/courses', label: 'Add Courses', icon: BookMarked },
        { path: '/admin/applications', label: 'Courses Applications', icon: ClipboardList },
        { path: '/admin/users', label: 'Users', icon: Users },
        { path: '/admin/categories', label: 'Categories', icon: ListTree },
        { path: '/admin/activities', label: 'Activities', icon: History },
        { path: '/admin/payment-slips', label: 'Payment Slips', icon: FileText },
        { path: '/admin/payments', label: 'Online Payments', icon: CreditCard },
        { path: '/admin/page-articles', label: 'Page Articles', icon: FileText },
        { path: '/admin/admit-card-pages', label: 'Admit Card Pages', icon: BadgeCheck },

        { path: '/admin/marquee', label: 'Announcement Bar', icon: Megaphone },
        { path: '/admin/gallery', label: 'Gallery', icon: Image },
        { path: '/admin/important-services', label: 'Important Services', icon: Sparkles },
        { path: '/admin/about-us', label: 'About Us', icon: Info },
        { path: '/admin/contact-messages', label: 'User Messages', icon: MessageSquare },
        { path: '/admin/contact-us', label: 'Contact Settings', icon: PhoneCall },
        { path: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    const subPageNames = {
        '/admin/university': 'University Management',
        '/admin/admission': 'Admission Management',
        '/admin/admit-cards': 'Admit Card Management',
        '/admin/results': 'Result Management',
        '/admin/answer-key': 'Answer Key Management',
        '/admin/latest-news': 'Latest News Management',
        '/admin/gallery': 'Gallery Management',
    };

    let currentSubPageTitle = subPageNames[location.pathname];
    if (location.pathname.startsWith('/admin/custom/')) {
        const slug = location.pathname.split('/admin/custom/')[1];
        if (slug) {
            currentSubPageTitle = `${decodeURIComponent(slug)} Management`;
        }
    }

    const directNavItem = navItems.find(item => location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)));

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-300">
            {/* Sidebar Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                {/* Sidebar Header */}
                <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
                    <Link to="/admin" className="flex items-center gap-2 text-primary font-black text-xl tracking-tight">
                        <div className="size-8 rounded-lg bg-linear-to-br from-primary to-blue-600 text-white flex items-center justify-center text-sm">ZE</div>
                        Admin Panel
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto lg:hidden text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Sidebar Nav */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar pr-1">
                    <p className="px-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 mt-2">Menu</p>
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-200"
                    >
                        <Home size={18} />
                        Back to Website
                    </Link>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'}`}
                            >
                                <item.icon size={18} className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
                {/* Admin Header */}
                <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
                    <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 max-w-full">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 shrink-0"
                        >
                            <Menu size={20} />
                        </button>
                        {/* Dynamic Breadcrumb / Title */}
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 overflow-hidden">
                            {currentSubPageTitle ? (
                                <>
                                    <Link
                                        to="/admin/page-articles"
                                        className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-primary transition-colors hover:-translate-x-0.5 shrink-0"
                                    >
                                        <ArrowLeft size={16} />
                                        <span className="hidden sm:inline">Page Articles</span>
                                        <span className="sm:hidden">Back</span>
                                    </Link>
                                    <ChevronRight size={14} className="text-slate-400 shrink-0" />
                                    <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white truncate">
                                        {currentSubPageTitle}
                                    </h2>
                                </>
                            ) : (
                                <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white truncate">
                                    {directNavItem?.label || 'Dashboard'}
                                </h2>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/admin/activities"
                            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative"
                            title="Recent Activities"
                        >
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                        </Link>

                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-linear-to-br from-primary to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white dark:ring-slate-800">
                                {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div className="hidden md:block text-sm leading-tight">
                                <p className="font-bold text-slate-800 dark:text-white">{userInfo?.name || 'Admin User'}</p>
                                <p className="text-[10px] text-slate-500 font-semibold uppercase">Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
