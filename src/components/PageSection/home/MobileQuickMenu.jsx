import React from 'react';
import { Link } from 'react-router-dom';
import { 
    GraduationCap, UserPlus, Flame, IdCard, 
    FileCheck, Image, Gem, Info, Phone,
    LayoutGrid, Compass
} from 'lucide-react';

const menuItems = [
    { label: 'University', icon: GraduationCap, path: '/university', color: 'bg-blue-500' },
    { label: 'Admission', icon: UserPlus, path: '/admission', color: 'bg-emerald-500' },
    { label: 'Latest News', icon: Flame, path: '/latest-news', color: 'bg-orange-500' },
    { label: 'Admit Card', icon: IdCard, path: '/admit-cards', color: 'bg-blue-600' },
    { label: 'Result', icon: FileCheck, path: '/result', color: 'bg-purple-500' },
    { label: 'Gallery', icon: Image, path: '/gallery', color: 'bg-indigo-500' },
    { label: 'Service', icon: Gem, path: '/service', color: 'bg-pink-500' },
    { label: 'About Us', icon: Info, path: '/about', color: 'bg-slate-600' },
    { label: 'Contact Us', icon: Phone, path: '/contact', color: 'bg-red-500' },
];

const MobileQuickMenu = () => {
    return (
        <div className="md:hidden mt-8">
            <div className="section-label mb-2">
                <Compass className="text-primary" size={10} /> Quick Navigation
            </div>
            
            <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                <div className="sec-bar px-5 py-3">
                    <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <LayoutGrid size={14} /> Explore Categories
                    </h2>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900">
                    <div className="grid grid-cols-3 gap-y-6 gap-x-2">
                        {menuItems.map((item, index) => (
                            <Link 
                                key={index} 
                                to={item.path}
                                className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
                            >
                                <div className={`size-12 rounded-2xl ${item.color} flex items-center justify-center text-white shadow-lg shadow-${item.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
                                    <item.icon size={22} strokeWidth={2.5} />
                                </div>
                                <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center leading-tight">
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MobileQuickMenu;
