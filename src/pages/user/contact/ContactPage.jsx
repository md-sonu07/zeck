import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContactSettings } from '../../../store/thunk/contactThunk';
import {
    Mail, Phone, MapPin, Send,
    Clock, CheckCircle2, ChevronDown, ExternalLink,
    Home, ChevronRight as Chevron, Loader2
} from 'lucide-react';
import { ContactSkeleton } from '../../../components/common/Skeleton';
import WhatsAppIcon from '../../../components/common/WhatsAppIcon';
import { submitContactMessageApi } from '../../../api/contact.api';
import toast from 'react-hot-toast';
import SEO from '../../../components/common/SEO';


/* ── FAQ Accordion ────────────────────────────────────── */

const faqs = [
    { q: 'How do I get notified about new job postings?', a: 'Join our Telegram or WhatsApp channel for instant alerts. We post every new government job notification within minutes of official release.' },
    { q: 'Are the admit cards and results on your site official?', a: 'We link directly to official government/board websites. We never host PDFs ourselves — all links redirect to original sources.' },
    { q: 'Can I request a specific exam or recruitment to be covered?', a: 'Yes! Use the contact form or message us on WhatsApp. We typically add it within 24–48 hours.' },
    { q: 'Is the service completely free?', a: 'Absolutely. Zoya Education Centre is 100% free. We do not charge for any content or notifications.' },
];

/* ── FAQ Accordion ────────────────────────────────────── */
const FaqItem = ({ q, a, index }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`rounded-xl border transition-all duration-200 overflow-hidden
            ${open
                ? 'border-primary/30 bg-primary/2 shadow-md shadow-primary/10'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
            }`}
        >
            <button
                onClick={() => setOpen(p => !p)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left group"
            >
                <span className={`shrink-0 size-6 rounded-full text-xs font-black flex items-center justify-center transition-colors
                    ${open ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                    {index + 1}
                </span>
                <span className={`flex-1 text-sm font-bold transition-colors ${open ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>
                    {q}
                </span>
                <ChevronDown size={16}
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180 text-primary' : ''}`}
                />
            </button>
            {open && (
                <div className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-primary/10 pt-3 ml-10">
                    {a}
                </div>
            )}
        </div>
    );
};

/* ── Contact Page ─────────────────────────────────────── */
const ContactPage = () => {
    const dispatch = useDispatch();
    const { settings, loading: settingsLoading } = useSelector((state) => state.contact);

    if (settingsLoading && !settings) {
        return <ContactSkeleton />;
    }

    const infoCards = [
        {
            icon: Phone, label: 'Call Us',
            value: settings?.phoneNo || '+91 9162653235',
            sub: settings?.phoneSub || 'Get direct support',
            color: 'bg-blue-500', ring: 'ring-blue-500/20', text: 'text-blue-600 dark:text-blue-400',
            href: settings?.phoneNo ? `tel:${settings.phoneNo}` : 'tel:+919162653235',
        },
        {
            icon: Mail, label: 'Email Us',
            value: settings?.email || 'zoyaeducationcentre@gmail.com',
            sub: settings?.emailSub || 'Reply within 24 hours',
            color: 'bg-primary', ring: 'ring-primary/20', text: 'text-primary',
            href: settings?.email ? `mailto:${settings.email}` : 'mailto:zoyaeducationcentre@gmail.com',
        },
        {
            icon: MapPin, label: 'Visit Us',
            value: settings?.address || 'Man Road, Kursakanta, Araria, Bihar-854331',
            sub: settings?.addressSub || 'Near Gandhi Maidan',
            color: 'bg-rose-500', ring: 'ring-rose-500/20', text: 'text-rose-600 dark:text-rose-400',
            href: null,
        },
        {
            icon: Clock, label: 'Working Hours',
            value: settings?.workingHours || '9:00 AM – 6:00 PM',
            sub: settings?.workingHoursSub || 'Monday to Saturday',
            color: 'bg-amber-500', ring: 'ring-amber-500/20', text: 'text-amber-600 dark:text-amber-400',
            href: null,
        },
    ];

    const [form, setForm] = useState({ name: '', phone: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await submitContactMessageApi(form);
            setSubmitted(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputBase = 'w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200';

    return (
        <div className="pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <SEO
                title="Contact Us"
                description="Get in touch with Zoya Education Center. We are here to help you with your queries regarding government jobs, admissions, and results."
                keywords="contact, support, query, education center, patna"
            />

            {/* ── Hero Bar ──────────────────────────────────────── */}
            <div className="bg-linear-to-r from-primary via-blue-600 to-blue-700 px-4 py-6">
                <div className="max-w-[1200px] mx-auto">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1.5 text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Home size={10} /> <Chevron size={10} />
                        <span className="text-white">Contact Us</span>
                    </nav>
                    <h1 className="text-2xl font-black text-white tracking-tight">Contact Us</h1>
                    <p className="text-blue-200 text-xs mt-1">We respond within 24 hours &mdash; usually much faster.</p>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4">

                {/* ── Info Cards ──────────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 -mt-5 mb-10">
                    {infoCards.map((card, i) => (
                        <div key={i} className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-lg shadow-slate-200/60 dark:shadow-black/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                            <div className={`size-10 ${card.color} rounded-xl flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-110 transition-transform duration-200`}>
                                <card.icon size={18} />
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                            {card.href
                                ? <a href={card.href} className={`block text-xs font-bold ${card.text} leading-snug`}>{card.value}</a>
                                : <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-snug">{card.value}</p>
                            }
                            <p className="text-[10px] text-slate-400 mt-0.5">{card.sub}</p>
                        </div>
                    ))}
                </div>

                {/* ── Main Grid ───────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">

                    {/* ── Contact Form ── */}
                    <div className="lg:col-span-8">
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md shadow-slate-200/60 dark:shadow-black/20">
                            <div className="bg-linear-to-r from-primary to-blue-700 px-6 py-4 flex items-center gap-3">
                                <div className="size-8 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Send size={15} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-black text-white">Send Us a Message</h2>
                                    <p className="text-blue-200 text-[10px]">Fill the form — we'll get back to you shortly</p>
                                </div>
                            </div>

                            <div className="p-6">
                                {submitted ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                                        <div className="size-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center shadow-lg shadow-green-200/50">
                                            <CheckCircle2 className="text-green-500" size={40} />
                                        </div>
                                        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mt-2">Message Sent!</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                                            Thank you for reaching out. We'll contact you on <strong className="text-slate-700 dark:text-slate-200">{form.phone}</strong> within 24 hours.
                                        </p>
                                        <button
                                            onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', subject: '', message: '' }); }}
                                            className="mt-3 text-xs font-bold text-primary border border-primary/30 hover:bg-primary hover:text-white px-5 py-2 rounded-lg transition-all duration-200"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name *</label>
                                                <input name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" className={inputBase} />
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Contact No *</label>
                                                <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Your contact number" className={inputBase} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Subject *</label>
                                            <input name="subject" value={form.subject} onChange={handleChange} required placeholder="How can we help?" className={inputBase} />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Message *</label>
                                            <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Write your message here..." className={`${inputBase} resize-none`} />
                                        </div>
                                        <button
                                            type="submit" disabled={loading}
                                            className="group w-full bg-primary hover:bg-primary/90 disabled:opacity-60 active:scale-[0.98] text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                                    </svg>
                                                    Sending…
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Right Panel ── */}
                    <div className="lg:col-span-4 space-y-5">

                        {/* Quick Contact */}
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-md shadow-slate-200/60 dark:shadow-black/20">
                            <div className="sec-bar px-5 py-3">
                                <h2 className="text-xs font-black text-white uppercase tracking-widest">Quick Connect</h2>
                            </div>
                            <div className="p-4 space-y-3">
                                {[
                                    {
                                        href: settings?.whatsappLink || 'https://wa.me/919162653235',
                                        icon: <WhatsAppIcon size={20} />,
                                        bg: 'bg-[#25D366]', hoverBg: 'hover:bg-[#25D366]/12',
                                        border: 'border-[#25D366]/25', hoverBorder: 'hover:border-[#25D366]/50',
                                        label: 'WhatsApp Us',
                                        sub: settings?.whatsappSub || 'Fastest response',
                                        accent: 'group-hover:text-[#25D366]',
                                    },
                                    {
                                        href: settings?.telegramLink || 'https://t.me/zoyacenter',
                                        icon: <Send size={20} />,
                                        bg: 'bg-[#2CA5E0]', hoverBg: 'hover:bg-[#2CA5E0]/12',
                                        border: 'border-[#2CA5E0]/25', hoverBorder: 'hover:border-[#2CA5E0]/50',
                                        label: 'Telegram Channel',
                                        sub: settings?.telegramSub || 'Instant job alerts',
                                        accent: 'group-hover:text-[#2CA5E0]',
                                    },
                                ].map((s, i) => (
                                    <a key={i} href={s.href} target="_blank" rel="noreferrer"
                                        className={`group flex items-center gap-3 px-4 py-3.5 bg-slate-50 dark:bg-slate-700/30 ${s.hoverBg} border ${s.border} ${s.hoverBorder} rounded-xl transition-all duration-200`}
                                    >
                                        <div className={`size-10 ${s.bg} rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                                            {s.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{s.label}</p>
                                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{s.sub}</p>
                                        </div>
                                        <ExternalLink size={13} className={`text-slate-300 ${s.accent} transition-colors`} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Office Location Card */}
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-black/20 group">
                            {/* Embedded Google Map */}
                            <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                                <iframe
                                    src={settings?.mapEmbedSrc || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14391.229158525313!2d85.13114065!3d25.61141315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed585d56441b8f%3A0xe543c7ae00755714!2sGandhi%20Maidan%2C%20Patna%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Office Location"
                                    className="grayscale hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100"
                                ></iframe>
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/20 to-transparent" />
                            </div>

                            <div className="p-5">
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                        <MapPin size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-1">Corporate Office</h3>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Patna HQ, Bihar</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                        Near Gandhi Maidan, Patna<br />
                                        Bihar – 800001, India
                                    </p>

                                    <a
                                        href={settings?.mapEmbedSrc ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}` : "https://maps.google.com"}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex w-full items-center justify-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-300 shadow-md"
                                    >
                                        <ExternalLink size={14} />
                                        Get Directions
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── FAQ ─────────────────────────────────────────── */}
                <div className="mb-2">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Frequently Asked Questions</p>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => <FaqItem key={i} index={i} {...faq} />)}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContactPage;
