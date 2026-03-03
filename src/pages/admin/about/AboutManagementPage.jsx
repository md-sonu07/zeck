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

    // Image handling
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        dispatch(fetchAboutSettings());
    }, [dispatch]);

    useEffect(() => {
        if (settings) {
            setTitle(settings.title || '');
            setDescription(settings.description || '');
            setImageUrl(settings.imageUrl || '');
            if (settings.imageUrl) {
                setImagePreview(settings.imageUrl);
            }
        }
    }, [settings]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
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

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Feature Image
                            </label>
                            <label className="flex flex-col items-center justify-center gap-2 w-full px-4 py-8 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 cursor-pointer transition-all">
                                <Upload size={24} className="text-slate-400" />
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                    {imageFile ? imageFile.name : 'Upload New Image'}
                                </span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
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
                        {imagePreview ? (
                            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                                <img src={imagePreview} alt="About Preview" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-full aspect-video rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
                                <ImageIcon size={48} className="opacity-20 mb-2" />
                                <p className="text-xs font-medium">No Image Uploaded</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">
                                {title || 'The Headline Title'}
                            </h2>
                            <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 line-clamp-6 whitespace-pre-line">
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
