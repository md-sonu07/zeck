import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    House,
    Briefcase,
    FileText,
    CheckCircle,
    Book,
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
        { name: 'University', path: '/university', icon: School },
        { name: 'Admission', path: '/admission', icon: GraduationCap },
        { name: 'Latest News', path: '/latest-news', icon: Newspaper },
        { name: 'Admit Card', path: '/admit-card', icon: FileText },
        { name: 'Result', path: '/result', icon: CheckCircle },
        { name: 'Syllabus', path: '/syllabus', icon: Book },
        { name: 'Service', path: '/service', icon: Briefcase },
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