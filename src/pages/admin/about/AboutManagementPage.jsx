import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAboutSettings, updateAboutSettings } from '../../../store/thunk/aboutThunk';
import { Save, Image as ImageIcon, FileText, Upload, Loader2, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const AboutManagementPage = () => {
    const dispatch = useDispatch();
    const { settings, loading } = useSelector((state) => state.about);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [banner1Url, setBanner1Url] = useState('');
    const [banner2Url, setBanner2Url] = useState('');
    const [whatsappGroupUrl, setWhatsappGroupUrl] = useState('');

    // Image handling
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const [banner1File, setBanner1File] = useState(null);
    const [banner1Preview, setBanner1Preview] = useState('');

    const [banner2File, setBanner2File] = useState(null);
    const [banner2Preview, setBanner2Preview] = useState('');

    const [whatsappFile, setWhatsappFile] = useState(null);
    const [whatsappPreview, setWhatsappPreview] = useState('');

    useEffect(() => {
        dispatch(fetchAboutSettings());
    }, [dispatch]);

    useEffect(() => {
        if (settings) {
            setTitle(settings.title || '');
            setDescription(settings.description || '');

            setImageUrl(settings.imageUrl || '');
            if (settings.imageUrl) setImagePreview(settings.imageUrl);

            setBanner1Url(settings.banner1Url || '');
            if (settings.banner1Url) setBanner1Preview(settings.banner1Url);

            setBanner2Url(settings.banner2Url || '');
            if (settings.banner2Url) setBanner2Preview(settings.banner2Url);

            setWhatsappGroupUrl(settings.whatsappGroupUrl || '');
            if (settings.whatsappGroupUrl) setWhatsappPreview(settings.whatsappGroupUrl);
        }
    }, [settings]);

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'main') {
                    setImageFile(file);
                    setImagePreview(reader.result);
                } else if (type === 'banner1') {
                    setBanner1File(file);
                    setBanner1Preview(reader.result);
                } else if (type === 'banner2') {
                    setBanner2File(file);
                    setBanner2Preview(reader.result);
                } else if (type === 'whatsapp') {
                    setWhatsappFile(file);
                    setWhatsappPreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const toastId = toast.loading('Saving about page settings...');
        try {
            const formData = {
                title,
                description,
                imageUrl: imagePreview || imageUrl,
                banner1Url: banner1Preview || banner1Url,
                banner2Url: banner2Preview || banner2Url,
                whatsappGroupUrl: whatsappPreview || whatsappGroupUrl,
            };
            await dispatch(updateAboutSettings(formData)).unwrap();
            toast.success('About page updated successfully!', { id: toastId });
        } catch (error) {
            toast.error(error || 'Failed to save about settings.', { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Info className="text-primary" /> About Us Settings
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage the core content for the public About page.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Edit Form */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Headline Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter title"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white font-medium"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Description
                            </label>
                            <textarea
                                rows="6"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter detailed description"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white font-medium resize-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Feature Image
                                </label>
                                <label className="flex flex-col items-center justify-center gap-2 w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 cursor-pointer transition-all">
                                    <Upload size={20} className="text-slate-400" />
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                        {imageFile ? imageFile.name : 'Main Photo'}
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, 'main')}
                                    />
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Banner 1
                                </label>
                                <label className="flex flex-col items-center justify-center gap-2 w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 cursor-pointer transition-all">
                                    <Upload size={20} className="text-slate-400" />
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                        {banner1File ? banner1File.name : 'Promo Banner 1'}
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, 'banner1')}
                                    />
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Banner 2
                                </label>
                                <label className="flex flex-col items-center justify-center gap-2 w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 cursor-pointer transition-all">
                                    <Upload size={20} className="text-slate-400" />
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                        {banner2File ? banner2File.name : 'Promo Banner 2'}
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, 'banner2')}
                                    />
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    WhatsApp QR
                                </label>
                                <label className="flex flex-col items-center justify-center gap-2 w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 cursor-pointer transition-all">
                                    <Upload size={20} className="text-slate-400" />
                                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                        {whatsappFile ? whatsappFile.name : 'Group QR Code'}
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, 'whatsapp')}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-md disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin size-4" /> : <Save className="size-4" />}
                                {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Live Preview */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Live Preview</h3>
                    </div>

                    <div className="flex-1 p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Image</p>
                                {imagePreview ? (
                                    <div className="w-full aspect-video rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-video rounded-lg bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                        <ImageIcon size={20} className="opacity-20" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Banner 1</p>
                                {banner1Preview ? (
                                    <div className="w-full aspect-video rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                                        <img src={banner1Preview} alt="Banner 1" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-video rounded-lg bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                        <ImageIcon size={20} className="opacity-20" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Banner 2</p>
                                {banner2Preview ? (
                                    <div className="w-full aspect-video rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                                        <img src={banner2Preview} alt="Banner 2" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-video rounded-lg bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                        <ImageIcon size={20} className="opacity-20" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">WhatsApp QR</p>
                                {whatsappPreview ? (
                                    <div className="w-full aspect-video rounded-lg overflow-hidden border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                                        <img src={whatsappPreview} alt="WhatsApp QR" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-video rounded-lg bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                        <ImageIcon size={20} className="opacity-20" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
                                {title || 'The Headline Title'}
                            </h2>
                            <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 line-clamp-4 whitespace-pre-line">
                                {description || 'Your content description will appear here...'}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Public View Mockup</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutManagementPage;
