import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContactSettings } from '../../store/thunk/contactThunk';
import { fetchAboutSettings } from '../../store/thunk/aboutThunk';
import { fetchPageSections } from '../../store/thunk/pageSectionThunk';
import {
    Facebook,
    MessageCircle,
    Send,
    ChevronRight,
    MapPin,
    Mail,
    Phone,
    Instagram,
    Youtube
} from 'lucide-react';

const Footer = () => {
    const dispatch = useDispatch();
    const { settings: contactSettings } = useSelector((state) => state.contact);
    const { settings: aboutSettings } = useSelector((state) => state.about);
    const { sections } = useSelector((state) => state.pageSections);

    useEffect(() => {
        if (!contactSettings) dispatch(fetchContactSettings());
        if (!aboutSettings) dispatch(fetchAboutSettings());
        if (sections.length === 0) dispatch(fetchPageSections());
    }, [dispatch, contactSettings, aboutSettings, sections.length]);

    const socialLinks = [
        { icon: <Facebook size={18} />, url: contactSettings?.facebookLink, hoverBg: 'hover:bg-primary' },
        { icon: <MessageCircle size={18} />, url: contactSettings?.whatsappLink, hoverBg: 'hover:bg-[#25D366]' },
        { icon: <Send size={18} />, url: contactSettings?.telegramLink, hoverBg: 'hover:bg-[#2CA5E0]' },
        { icon: <Instagram size={18} />, url: contactSettings?.instagramLink, hoverBg: 'hover:bg-[#E4405F]' },
        { icon: <Youtube size={18} />, url: contactSettings?.youtubeLink, hoverBg: 'hover:bg-[#FF0000]' },
    ].filter(link => link.url);

    return (
        <footer className="bg-slate-900 border-t-4 border-primary pb-8">
            <div className="max-w-[1200px] mx-auto px-4 pt-16 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {/* Brand Column */}
                <div className="col-span-1 lg:col-span-1">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="text-white font-black text-lg">ZC</span>
                        </div>
                        <h3 className="text-white font-black text-xl tracking-tight">{aboutSettings?.title || 'Zoya Eduction Centre'}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-400 font-medium">
                        {aboutSettings?.description || "India's most trusted recruitment portal since 2018. We provide accurate and reliable information to help you secure your future in public service."}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-8">
                        {socialLinks.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`size-10 bg-slate-800 ${link.hoverBg} text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg`}
                            >
                                {link.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div>
                    <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-primary">
                        Quick Exploration
                    </h4>
                    <ul className="space-y-4">
                        {(sections.length > 0 ? sections : [
                            { title: 'About Agency', path: '/about' },
                            { title: 'Latest Vacancy', path: '/latest-news' },
                            { title: 'Download Admit Card', path: '/admit-card' },
                            { title: 'Checked Results', path: '/result' },
                            { title: 'Syllabus Updates', path: '/syllabus' },
                        ]).map((link, idx) => (
                            <li key={idx}>
                                <Link to={link.path} className="text-slate-400 hover:text-primary transition-colors text-sm font-bold flex items-center gap-2 group">
                                    <ChevronRight size={10} className="text-primary/40 group-hover:text-primary transition-colors" />
                                    {link.title}
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
                            <div className="flex flex-col">
                                <p className="text-sm text-slate-400 leading-relaxed font-bold">
                                    {contactSettings?.address || 'Main Bazar Road, Bihar, India – 000000'}
                                </p>
                                {contactSettings?.addressSub && <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{contactSettings.addressSub}</span>}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="size-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                <Mail className="text-primary" size={12} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm text-slate-400 font-bold">{contactSettings?.email || 'contact@zoyaonline.com'}</p>
                                {contactSettings?.emailSub && <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{contactSettings.emailSub}</span>}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="size-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                <Phone className="text-primary" size={12} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm text-slate-400 font-bold">{contactSettings?.phoneNo || '+91 91XXX XXXXX'}</p>
                                {contactSettings?.phoneSub && <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{contactSettings.phoneSub}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 mt-8 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    © {new Date().getFullYear()} {aboutSettings?.title || 'Zoya Eduction Centre'}. All Rights Reserved.
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                    Designed with ❤️ for candidates
                </p>
            </div>
        </footer>
    );
};

export default Footer;
