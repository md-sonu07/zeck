import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContactSettings, updateContactSettings } from '../../../store/thunk/contactThunk';
import { Save, Phone, Mail, MapPin, Clock, MessageCircle, ExternalLink, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactManagementPage = () => {
    const dispatch = useDispatch();
    const { settings, loading } = useSelector((state) => state.contact);

    // Info Cards State
    const [phoneNo, setPhoneNo] = useState('');
    const [phoneSub, setPhoneSub] = useState('');

    const [email, setEmail] = useState('');
    const [emailSub, setEmailSub] = useState('');

    const [address, setAddress] = useState('');
    const [addressSub, setAddressSub] = useState('');

    const [workingHours, setWorkingHours] = useState('');
    const [workingHoursSub, setWorkingHoursSub] = useState('');

    // Quick Connect Links
    const [telegramLink, setTelegramLink] = useState('');
    const [telegramSub, setTelegramSub] = useState('');

    const [whatsappLink, setWhatsappLink] = useState('');
    const [whatsappSub, setWhatsappSub] = useState('');

    const [facebookLink, setFacebookLink] = useState('');
    const [facebookSub, setFacebookSub] = useState('');

    const [youtubeLink, setYoutubeLink] = useState('');
    const [youtubeSub, setYoutubeSub] = useState('');

    const [instagramLink, setInstagramLink] = useState('');
    const [instagramSub, setInstagramSub] = useState('');

    // Map Coordinates / Embed URL
    const [mapEmbedSrc, setMapEmbedSrc] = useState('');

    useEffect(() => {
        dispatch(fetchContactSettings());
    }, [dispatch]);

    useEffect(() => {
        if (settings) {
            setPhoneNo(settings.phoneNo || '');
            setPhoneSub(settings.phoneSub || '');
            setEmail(settings.email || '');
            setEmailSub(settings.emailSub || '');
            setAddress(settings.address || '');
            setAddressSub(settings.addressSub || '');
            setWorkingHours(settings.workingHours || '');
            setWorkingHoursSub(settings.workingHoursSub || '');
            setTelegramLink(settings.telegramLink || '');
            setTelegramSub(settings.telegramSub || '');
            setWhatsappLink(settings.whatsappLink || '');
            setWhatsappSub(settings.whatsappSub || '');
            setFacebookLink(settings.facebookLink || '');
            setFacebookSub(settings.facebookSub || '');
            setYoutubeLink(settings.youtubeLink || '');
            setYoutubeSub(settings.youtubeSub || '');
            setInstagramLink(settings.instagramLink || '');
            setInstagramSub(settings.instagramSub || '');
            setMapEmbedSrc(settings.mapEmbedSrc || '');
        }
    }, [settings]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Saving your contact updates...');
        try {
            const formData = {
                phoneNo, phoneSub, email, emailSub, address, addressSub, workingHours, workingHoursSub,
                telegramLink, telegramSub, whatsappLink, whatsappSub, facebookLink, facebookSub,
                youtubeLink, youtubeSub, instagramLink, instagramSub, mapEmbedSrc
            };
            await dispatch(updateContactSettings(formData)).unwrap();
            toast.success('Awesome! Contact details updated.', { id: toastId });
        } catch (error) {
            toast.error(error || 'Oops! Failed to save your changes. Please try again.', { id: toastId });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Contact Us Settings</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Manage public contact details and quick links.</p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">

                    {/* Section 1: Contact Detail Cards */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                            <MessageSquare className="text-primary" size={20} />
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Contact Info Display</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Phone */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-500 text-white rounded-lg"><Phone size={16} /></div>
                                    <h3 className="font-bold text-slate-700 dark:text-slate-200">Phone Details</h3>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                                    <input type="text" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} className="w-full px-3 py-2 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Subtext</label>
                                    <input type="text" value={phoneSub} onChange={(e) => setPhoneSub(e.target.value)} className="w-full px-3 py-2 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-primary text-white rounded-lg"><Mail size={16} /></div>
                                    <h3 className="font-bold text-slate-700 dark:text-slate-200">Email Details</h3>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Subtext</label>
                                    <input type="text" value={emailSub} onChange={(e) => setEmailSub(e.target.value)} className="w-full px-3 py-2 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-rose-500 text-white rounded-lg"><MapPin size={16} /></div>
                                    <h3 className="font-bold text-slate-700 dark:text-slate-200">Location Details</h3>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Primary Address</label>
                                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Subtext</label>
                                    <input type="text" value={addressSub} onChange={(e) => setAddressSub(e.target.value)} className="w-full px-3 py-2 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                </div>
                            </div>

                            {/* Working Hours */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-amber-500 text-white rounded-lg"><Clock size={16} /></div>
                                    <h3 className="font-bold text-slate-700 dark:text-slate-200">Working Hours</h3>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Timings</label>
                                    <input type="text" value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} className="w-full px-3 py-2 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Subtext</label>
                                    <input type="text" value={workingHoursSub} onChange={(e) => setWorkingHoursSub(e.target.value)} className="w-full px-3 py-2 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Quick Links & Embed */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                            <ExternalLink className="text-emerald-500" size={20} />
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Socials & Links</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Telegram */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <h3 className="font-bold text-blue-500 mb-2 truncate" title="Join Telegram Channel">Telegram Channel</h3>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">URL Link</label>
                                        <input type="url" value={telegramLink} onChange={(e) => setTelegramLink(e.target.value)} className="w-full px-3 py-1.5 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Subtext</label>
                                        <input type="text" value={telegramSub} onChange={(e) => setTelegramSub(e.target.value)} className="w-full px-3 py-1.5 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <h3 className="font-bold text-green-500 mb-2 truncate" title="Join WhatsApp Channel">WhatsApp Channel</h3>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">URL Link</label>
                                        <input type="url" value={whatsappLink} onChange={(e) => setWhatsappLink(e.target.value)} className="w-full px-3 py-1.5 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Subtext</label>
                                        <input type="text" value={whatsappSub} onChange={(e) => setWhatsappSub(e.target.value)} className="w-full px-3 py-1.5 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Facebook */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-2 truncate" title="Facebook Page">Facebook Page</h3>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">URL Link</label>
                                        <input type="url" value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} className="w-full px-3 py-1.5 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Subtext</label>
                                        <input type="text" value={facebookSub} onChange={(e) => setFacebookSub(e.target.value)} className="w-full px-3 py-1.5 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* YouTube */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <h3 className="font-bold text-red-500 mb-2 truncate" title="YouTube Channel">YouTube Channel</h3>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">URL Link</label>
                                        <input type="url" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} className="w-full px-3 py-1.5 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Subtext</label>
                                        <input type="text" value={youtubeSub} onChange={(e) => setYoutubeSub(e.target.value)} className="w-full px-3 py-1.5 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Instagram */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <h3 className="font-bold text-pink-500 mb-2 truncate" title="Instagram Profile">Instagram Profile</h3>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">URL Link</label>
                                        <input type="url" value={instagramLink} onChange={(e) => setInstagramLink(e.target.value)} className="w-full px-3 py-1.5 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Subtext</label>
                                        <input type="text" value={instagramSub} onChange={(e) => setInstagramSub(e.target.value)} className="w-full px-3 py-1.5 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Google Map iFrame Embed SRC URL</label>
                            <textarea
                                required
                                rows="3"
                                value={mapEmbedSrc}
                                onChange={(e) => setMapEmbedSrc(e.target.value)}
                                className="w-full mt-2 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-slate-800 dark:text-white font-medium transition-all"
                            />
                            <p className="text-xs text-slate-500 mt-2">Only paste the `src` attribute from Google Maps embed snippet.</p>
                        </div>
                    </div>


                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <Save size={18} />
                            {loading ? 'Saving...' : 'Save Contact Settings'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ContactManagementPage;
