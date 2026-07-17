import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    House,
    Briefcase,
    FileText,
    CheckCircle,
    Image,
    GraduationCap,
    School,
    Info,
    Mail,
    Newspaper
} from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/', icon: House },
        { name: 'University & Courses', path: '/university-cources', icon: School },
        // { name: 'Admission', path: '/admission', icon: GraduationCap },
        { name: 'Admit Card', path: '/admit-cards', icon: FileText },
        { name: 'Latest News', path: '/latest-news', icon: Newspaper },
        { name: 'Result', path: '/result', icon: CheckCircle },
        { name: 'Service', path: '/service', icon: Briefcase },
        { name: 'Gallery', path: '/gallery', icon: Image },
        { name: 'About Us', path: '/about', icon: Info },
        { name: 'Contact Us', path: '/contact', icon: Mail },
    ];

    return (
        <nav id="mainNav" className="hidden md:block bg-linear-to-r from-primary to-primary-dark rounded-xl shadow-lg shadow-primary/10 overflow-hidden">
            <ul id="navMenu" className="flex flex-row flex-wrap items-center justify-start px-2">
                {navLinks.map((link, idx) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <li key={idx}>
                            <Link
                                to={link.path}
                                className={`nav-link ${isActive ? 'nav-active' : ''}`}
                            >
                                <link.icon
                                    size={14}
                                    className={`${isActive ? 'text-white' : 'text-white/50'} group-hover:text-white transition-colors`}
                                />
                                {link.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Navbar;