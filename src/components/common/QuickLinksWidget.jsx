import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const QuickLinksWidget = () => {
    const links = [
        { label: 'Latest News', to: '/latest-news', color: 'text-blue-500' },
        { label: 'Admit Card', to: '/admit-cards', color: 'text-orange-500' },
        { label: 'Results', to: '/result', color: 'text-green-500' },
        { label: 'Answer Key', to: '/answer-key', color: 'text-purple-500' },
        { label: 'Gallery', to: '/gallery', color: 'text-cyan-500' },
        { label: 'Admission', to: '/admission', color: 'text-pink-500' },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-800 dark:bg-slate-700 px-4 py-3 flex items-center gap-2">
                <ChevronRight size={13} className="text-slate-300" />
                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Quick Links</h3>
            </div>
            <ul>
                {links.map((link, i) => (
                    <li key={i}>
                        <Link
                            to={link.to}
                            className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer group transition-colors"
                        >
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">
                                {link.label}
                            </span>
                            <ChevronRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuickLinksWidget;
