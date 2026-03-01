import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Send,
    Facebook,
    Youtube,
    IdCard,
    UserRound,
    FileText,
    HeartPulse,
    GraduationCap,
    Contact,
    Bolt,
    Share2,
    Users,
    ChevronRight,
    LinkIcon,
    ArrowRight,
    Phone,
    Instagram,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchImportantServices } from '../../../store/thunk/importantServiceThunk';
import { fetchContactSettings } from '../../../store/thunk/contactThunk';

// Official WhatsApp brand icon — Lucide doesn't include one
const WhatsAppIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const Sidebar = () => {
    const dispatch = useDispatch();
    const { data: allServices, loading: servicesLoading } = useSelector((state) => state.importantServices);
    const { settings: contactSettings } = useSelector((state) => state.contact);

    useEffect(() => {
        dispatch(fetchImportantServices());
        dispatch(fetchContactSettings());
    }, [dispatch]);

    const activeServices = allServices?.filter(s => s.status === 'active') || [];

    // Build social links dynamically from contact settings
    const socialLinks = useMemo(() => {
        if (!contactSettings) return [];
        const links = [];
        if (contactSettings.telegramLink) {
            links.push({
                name: 'Join Telegram Channel',
                icon: Send,
                color: 'bg-[#2CA5E0]',
                glow: 'group-hover:shadow-[#2CA5E0]/30',
                sub: contactSettings.telegramSub || 'Get instant job alerts',
                href: contactSettings.telegramLink,
            });
        }
        if (contactSettings.whatsappLink) {
            links.push({
                name: 'Join WhatsApp Channel',
                icon: WhatsAppIcon,
                color: 'bg-[#25D366]',
                glow: 'group-hover:shadow-[#25D366]/30',
                sub: contactSettings.whatsappSub || 'Daily updates & notifications',
                href: contactSettings.whatsappLink,
            });
        }
        if (contactSettings.facebookLink) {
            links.push({
                name: 'Facebook Page',
                icon: Facebook,
                color: 'bg-[#1877F2]',
                glow: 'group-hover:shadow-[#1877F2]/30',
                sub: contactSettings.facebookSub || 'Like & follow our page',
                href: contactSettings.facebookLink,
            });
        }
        if (contactSettings.youtubeLink) {
            links.push({
                name: 'YouTube Channel',
                icon: Youtube,
                color: 'bg-[#FF0000]',
                glow: 'group-hover:shadow-[#FF0000]/30',
                sub: contactSettings.youtubeSub || 'Watch guidance videos',
                href: contactSettings.youtubeLink,
            });
        }
        if (contactSettings.instagramLink) {
            links.push({
                name: 'Instagram',
                icon: Instagram,
                color: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
                glow: 'group-hover:shadow-[#833AB4]/30',
                sub: contactSettings.instagramSub || 'Follow us on Instagram',
                href: contactSettings.instagramLink,
            });
        }
        return links;
    }, [contactSettings]);

    const quickLinks = activeServices.length > 0
        ? activeServices.map(s => ({ name: s.title, icon: FileText, isDynamic: true }))
        : [
            { name: 'Aadhar Card Download', icon: IdCard },
            { name: 'Voter ID Card Download', icon: UserRound },
            { name: 'RTPS Bihar Services', icon: FileText },
            { name: 'Ayushman Card Apply', icon: HeartPulse },
            { name: 'Post Matric Scholarship', icon: GraduationCap },
            { name: 'e-Shram Card Download', icon: Contact },
        ];

    const helplineNumber = contactSettings?.phoneNo || '123456789';

    return (
        <aside className="space-y-6">

            {/* ── Quick Links ────────────────────────────────── */}
            <div className="section-label mb-6">
                <Bolt className="text-yellow-500" size={10} /> Quick Actions
            </div>
            <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                <div className="sec-bar px-5 py-3">
                    <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <LinkIcon size={14} /> Important Services
                    </h2>
                </div>

                <ul className="">
                    {servicesLoading ? (
                        <div className="p-4 text-center">
                            <Bolt className="animate-spin text-primary inline-block" size={20} />
                        </div>
                    ) : (
                        quickLinks.map((link, idx) => (
                            <li key={idx} className="group relative border-l-2 border-transparent hover:border-primary transition-all duration-200">
                                <span className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                {link.isDynamic ? (
                                    <Link to="/service" className="relative flex items-center gap-3 px-4 py-3.5 no-underline">
                                        <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-200">
                                            <link.icon size={16} />
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate">
                                            {link.name}
                                        </span>
                                        <ChevronRight size={14} className="ml-auto text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                                    </Link>
                                ) : (
                                    <a href="#" className="relative flex items-center gap-3 px-4 py-3.5 no-underline">
                                        <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-200">
                                            <link.icon size={16} />
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate">
                                            {link.name}
                                        </span>
                                        <ChevronRight size={14} className="ml-auto text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                                    </a>
                                )}
                            </li>
                        ))
                    )}
                </ul>
            </section>

            {/* ── Help & Support ──────────────────────────────── */}
            <div className="section-label mb-2">
                <Phone className="text-emerald-500" size={10} /> Support Center
            </div>
            <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-linear-to-r from-emerald-500 to-teal-600 px-5 py-3">
                    <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Phone size={14} /> Help Desk
                    </h2>
                </div>
                <div className="p-4">
                    <a
                        href={`tel:${helplineNumber}`}
                        className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 group hover:border-emerald-500 transition-colors duration-300 no-underline"
                    >
                        <div className="size-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                            <Phone size={22} />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Helpline Number</p>
                            <p className="text-xl font-black text-slate-800 dark:text-white group-hover:text-emerald-500 transition-colors">{helplineNumber}</p>
                        </div>
                    </a>
                </div>
            </section>

            {/* ── Social Connect ─────────────────────────────── */}
            <div className="section-label mb-2">
                <Share2 className="text-primary" size={10} /> Stay Connected
            </div>
            <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                <div className="sec-bar px-5 py-3">
                    <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Users size={14} /> Join Community
                    </h2>
                </div>

                <div className="p-2 space-y-1">
                    {socialLinks.length > 0 ? (
                        socialLinks.map((social, idx) => (
                            <a
                                key={idx}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-all duration-200 no-underline"
                            >
                                {/* Brand icon */}
                                <div className={`size-10 rounded-xl ${social.color} ${social.glow} flex items-center justify-center text-white shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-200 shrink-0`}>
                                    <social.icon size={20} />
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors duration-200 leading-snug">
                                        {social.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                                        {social.sub}
                                    </p>
                                </div>

                                {/* Chevron */}
                                <ChevronRight
                                    size={14}
                                    className="shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200"
                                />
                            </a>
                        ))
                    ) : (
                        <div className="py-6 text-center text-slate-400 text-xs font-medium">
                            No social links configured yet.
                        </div>
                    )}
                </div>
            </section>

        </aside>
    );
};

export default Sidebar;
