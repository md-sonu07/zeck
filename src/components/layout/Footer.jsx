import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContactSettings } from '../../store/thunk/contactThunk';
import { fetchAboutSettings } from '../../store/thunk/aboutThunk';
import { fetchPageSections } from '../../store/thunk/pageSectionThunk';
import {
    Send,
    ChevronRight,
    MapPin,
    Mail,
    Phone,
    Instagram,
    Youtube
} from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';

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
        { icon: <WhatsAppIcon size={18} />, url: contactSettings?.whatsappLink, hoverBg: 'hover:bg-[#25D366]' },
        { icon: <Send size={18} />, url: contactSettings?.telegramLink, hoverBg: 'hover:bg-[#2CA5E0]' },
        { icon: <Instagram size={18} />, url: contactSettings?.instagramLink, hoverBg: 'hover:bg-[#E4405F]' },
        { icon: <Youtube size={18} />, url: contactSettings?.youtubeLink, hoverBg: 'hover:bg-[#FF0000]' },
    ].filter(link => link.url);

    return (
        <footer className="bg-slate-900 border-t-4 border-primary pb-8">
            <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {/* Brand Column */}
                <div className="col-span-1 lg:col-span-1">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="text-white font-black text-lg">ZC</span>
                        </div>
                        <h3 className="text-white font-black text-xl tracking-tight">Zoya Eduction Centre</h3>
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
                        {([
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

                {/* Contact */}
                <div>
                    <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-primary">
                        Contact Office
                    </h4>
                    <div className="space-y-5">
                        <Link to="/contact" className="flex items-start gap-4 group cursor-pointer">
                            <div className="size-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                <MapPin className="text-primary group-hover:scale-110 transition-transform" size={12} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm text-slate-400 leading-relaxed font-bold group-hover:text-primary transition-colors">
                                    {contactSettings?.address || 'Kursakanta'}
                                </p>
                                {contactSettings?.addressSub && <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{contactSettings.addressSub}</span>}
                            </div>
                        </Link>
                        <a href={`mailto:${contactSettings?.email || 'contact@zoyaonline.com'}?subject=Hello from Zoya Education Centre`} className="flex items-center gap-4 group cursor-pointer">
                            <div className="size-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                <Mail className="text-primary group-hover:scale-110 transition-transform" size={12} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm text-slate-400 font-bold group-hover:text-primary transition-colors">{contactSettings?.email || 'contact@zoyaonline.com'}</p>
                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                                    {contactSettings?.emailSub || 'Get direct support'}
                                </span>
                            </div>
                        </a>
                        <Link to="/contact" className="flex items-center gap-4 group cursor-pointer">
                            <div className="size-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                <Phone className="text-primary group-hover:scale-110 transition-transform" size={12} />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm text-slate-400 font-bold group-hover:text-primary transition-colors">{contactSettings?.phoneNo || '+91 91XXX XXXXX'}</p>
                                {contactSettings?.phoneSub && <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{contactSettings.phoneSub}</span>}
                            </div>
                        </Link>
                    </div>
                </div>

                {/* WhatsApp Group QR Code Section */}
                {aboutSettings?.whatsappGroupUrl && (
                    <div className="bg-slate-800/40 py-8 px-6 rounded-2xl border border-slate-700/50 flex flex-col items-center gap-4 w-full lg:col-span-1">
                        <div className="text-center space-y-1">
                            <h4 className="text-white font-black text-sm uppercase tracking-widest leading-tight">Join WhatsApp Group</h4>
                            <p className="text-[10px] text-slate-500 font-medium">Daily updates on WhatsApp</p>
                        </div>
                        <div className="p-3 bg-white rounded-xl shadow-md overflow-hidden group w-fit">
                            <a
                                href={contactSettings?.whatsappLink || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <img
                                    src={aboutSettings.whatsappGroupUrl}
                                    alt="WhatsApp Group QR"
                                    className="w-32 h-32 md:w-36 md:h-36 object-contain transition-all duration-500 ease-out group-hover:scale-105"
                                />
                            </a>
                        </div>
                        <a
                            href={contactSettings?.whatsappLink || "https://chat.whatsapp.com/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full px-4 text-nowrap py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            <WhatsAppIcon size={14} />
                            Join Now
                        </a>
                    </div>
                )}
            </div>

            <div className="max-w-[1200px] mx-auto px-4 mt-8 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    © {new Date().getFullYear()} {aboutSettings?.title || 'Zoya Eduction Centre'}. All Rights Reserved.
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                    Created by ❤️ <a href="https://www.instagram.com/danish_farhan07/" target="_blank" rel="noopener noreferrer">Danish Farhan</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
