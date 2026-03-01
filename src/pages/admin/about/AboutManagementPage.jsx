import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAboutSettings, updateAboutSettings } from '../../../store/thunk/aboutThunk';
import { Save, Image as ImageIcon, FileText, Upload, Eye, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AboutManagementPage = () => {
    const dispatch = useDispatch();
    const { settings, loading } = useSelector((state) => state.about);
    const [activeTab, setActiveTab] = useState('edit');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    // Image handling for Local Files
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setActiveTab('preview');
    };

    const handleSave = async () => {
        const toastId = toast.loading('Saving about page settings...');
        try {
            const formData = {
                title,
                description,
                imageUrl: imagePreview || imageUrl,
            };
            await dispatch(updateAboutSettings(formData)).unwrap();
            toast.success('About page updated successfully!', { id: toastId });
            setActiveTab('preview');
        } catch (error) {
            toast.error(error || 'Failed to save about settings.', { id: toastId });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">About Us Settings</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Manage the core content displayed on the public About page.</p>
                </div>

                {/* Tab Switcher */}
                <div className="flex w-full sm:w-auto items-center p-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60">
                    <button
                        onClick={() => setActiveTab('edit')}
                        className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'edit'
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        <Edit2 size={16} />
                        Edit Content
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'preview'
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        <Eye size={16} />
                        Preview
                    </button>
                </div>
            </div>

            {/* Content Display */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {activeTab === 'preview' ? (
                    <div className="p-6 md:p-8 space-y-8">

                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-4">
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
                                    {title || 'No title set'}
                                </h3>
                                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                                    {(description || 'No description set').split('\n').map((paragraph, idx) => (
                                        <p key={idx} className="mb-4">{paragraph}</p>
                                    ))}
                                </div>
                            </div>
                            {imagePreview && (
                                <div className="w-full md:w-1/3 rounded-2xl overflow-hidden shadow-md shrink-0 self-start">
                                    <img src={imagePreview} alt="Story Preview" className="w-full h-auto object-cover" />
                                </div>
                            )}
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className={`flex items-center gap-2 px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                <Save size={18} />
                                {loading ? 'Saving...' : 'Confirm & Save'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Title & Description */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                                    <FileText className="text-primary" size={20} />
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Main Story Content</h2>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Headline Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-800 dark:text-white font-medium transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Detailed Description</label>
                                    <textarea
                                        required
                                        rows="8"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-800 dark:text-white font-medium transition-all resize-none"
                                    />
                                </div>
                            </div>

                            {/* Right Column: Local Image Upload File */}
                            <div className="flex flex-col space-y-6">
                                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                                    <ImageIcon className="text-amber-500" size={20} />
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Image Upload</h2>
                                </div>

                                <div className="flex-1 flex flex-col space-y-4 pt-1">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Upload Image</label>

                                    <div className="relative flex-1 min-h-[200px]">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="file-upload"
                                        />

                                        <label
                                            htmlFor="file-upload"
                                            className={`absolute inset-0 flex flex-col items-center justify-center gap-4 w-full h-full border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 overflow-hidden group
                                                ${imagePreview
                                                    ? 'border-transparent bg-slate-900 border-none'
                                                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            {imagePreview ? (
                                                <>
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200">
                                                        <Upload size={32} className="mb-2" />
                                                        <span className="font-bold text-sm tracking-widest uppercase">Replace Image</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="size-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                        <Upload className="text-slate-400 group-hover:text-primary transition-colors" size={28} />
                                                    </div>
                                                    <div className="text-center px-6">
                                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                                            Click or drop image here
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-2">
                                                            Supported formats: SVG, PNG, JPG (Max 5MB)
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                    {imageFile && (
                                        <p className="text-xs text-center font-semibold text-primary truncate px-2">
                                            Selected: {imageFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
                            >
                                <Eye size={18} />
                                Preview Changes
                            </button>
                        </div>

                    </form>
                )}
            </div>
        </div>
    );
};

export default AboutManagementPage;
