import { Link } from 'react-router-dom';
import {
    Facebook,
    MessageCircle,
    Send,
    ChevronRight,
    MapPin,
    Mail,
    Phone
} from 'lucide-react';

const Footer = () => {
    const quickLinks = [
        { label: 'About Agency', path: '/about' },
        { label: 'Latest Vacancy', path: '/latest-jobs' },
        { label: 'Download Admit Card', path: '/admit-card' },
        { label: 'Checked Results', path: '/result' },
        { label: 'Syllabus Updates', path: '/syllabus' },
    ];

    return (
        <footer className="bg-slate-900 border-t-4 border-primary pb-8">
            <div className="max-w-[1200px] mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {/* Brand Column */}
                <div className="col-span-1 lg:col-span-1">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="text-white font-black text-lg">ZO</span>
                        </div>
                        <h3 className="text-white font-black text-xl tracking-tight">Zoya Online Centre</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-400 font-medium">
                        India's most trusted recruitment portal since 2018. We provide accurate and reliable information to help you secure your future in public service.
                    </p>
                    <div className="flex gap-4 mt-8">
                        <a href="#" className="size-10 bg-slate-800 hover:bg-primary text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg">
                            <Facebook size={18} />
                        </a>
                        <a href="#" className="size-10 bg-slate-800 hover:bg-[#25D366] text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg">
                            <MessageCircle size={18} />
                        </a>
                        <a href="#" className="size-10 bg-slate-800 hover:bg-[#2CA5E0] text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg">
                            <Send size={18} />
                        </a>
                    </div>
                </div>

                {/* Navigation */}
                <div>
                    <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-primary">
                        Quick Exploration
                    </h4>
                    <ul className="space-y-4">
                        {quickLinks.map((link, idx) => (
                            <li key={idx}>
                                <Link to={link.path} className="text-slate-400 hover:text-primary transition-colors text-sm font-bold flex items-center gap-2 group">
                                    <ChevronRight size={10} className="text-primary/40 group-hover:text-primary transition-colors" />
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Policies */}
                <div>
                    <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-primary">
                        Terms & Policies
                    </h4>
                    <ul className="space-y-4">
                        {['Privacy Policy', 'Terms of Service', 'Disclaimer Notice', 'Cookie Policy', 'Sitemap'].map((item, idx) => (
                            <li key={idx}>
                                <a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm font-bold flex items-center gap-2 group">
                                    <ChevronRight size={10} className="text-primary/40 group-hover:text-primary transition-colors" />
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-primary">
                        Contact Office
                    </h4>
                    <div className="space-y-5">
                        <div className="flex items-start gap-4">
                            <div className="size-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                <MapPin className="text-primary" size={12} />
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed font-bold">
                                Main Bazar Road, Bihar, India – 000000
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="size-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                <Mail className="text-primary" size={12} />
                            </div>
                            <p className="text-sm text-slate-400 font-bold">contact@zoyaonline.com</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="size-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                <Phone className="text-primary" size={12} />
                            </div>
                            <p className="text-sm text-slate-400 font-bold">+91 91XXX XXXXX</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 mt-8 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    © 2024 Zoya Online Centre. All Rights Reserved.
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                    Designed with ❤️ for candidates
                </p>
            </div>
        </footer>
    );
};

export default Footer;
