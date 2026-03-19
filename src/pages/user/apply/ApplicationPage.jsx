import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
    Upload,
    MessageSquare,
    CreditCard,
    ArrowLeft,
    FileText,
    X,
    Loader2,
    Eye,
    QrCode,
    Copy,
    Check
} from 'lucide-react';
import { ApplicationSkeleton } from '../../../components/common/Skeleton';
import toast from 'react-hot-toast';
import { getArticleByIdApi } from '../../../api/articleapi';
import { submitApplicationApi } from '../../../api/application.api';

import { fetchPaymentSettings } from '../../../store/thunk/paymentThunk';



const FilePreviewItem = ({ file, onRemove, onPreview }) => {
    const [url, setUrl] = useState(null);
    const isImage = file.type.startsWith('image/');

    useEffect(() => {
        if (isImage) {
            const objectUrl = URL.createObjectURL(file);
            setUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [file, isImage]);

    return (
        <div className="relative p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl group flex flex-col items-center justify-center text-center overflow-hidden animate-in zoom-in-95 hover:bg-white dark:hover:bg-slate-800 transition-colors">
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-3 right-3 z-10 size-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-all hover:bg-red-600"
            >
                <X size={16} />
            </button>

            <div className="size-24 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary mb-3 shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700 relative group/preview">
                {isImage ? (
                    <>
                        <img
                            src={url}
                            alt="preview"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/preview:scale-110"
                        />
                        <button
                            type="button"
                            onClick={() => onPreview(url)}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center text-white transition-opacity"
                        >
                            <div className="size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <Eye size={20} />
                            </div>
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center">
                        <FileText size={32} className="text-red-500" />
                        <span className="text-[10px] font-black mt-1 uppercase tracking-widest text-slate-400">PDF Document</span>
                    </div>
                )}
            </div>


            <p className="text-[9px] font-bold text-slate-700 dark:text-slate-200 truncate w-full px-2">{file.name}</p>
            <p className="text-[8px] text-slate-400 mt-0.5 font-medium">{(file.size / 1024).toFixed(0)} KB</p>
        </div>
    );
};

const ApplicationPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const dispatch = useDispatch();

    const { settings: paymentSettings } = useSelector((state) => state.payment);



    // Form State
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [activeOption, setActiveOption] = useState('documents');
    const [previewImage, setPreviewImage] = useState(null);


    useEffect(() => {
        const fetchArticleData = async () => {
            try {
                setLoading(true);
                const articleData = await getArticleByIdApi(slug);
                setArticle(articleData);
            } catch (error) {
                console.error("Failed to fetch data for application:", error);
                toast.error("Error loading application details");
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchArticleData();
        dispatch(fetchPaymentSettings());
    }, [slug, navigate, dispatch]);



    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    if (loading) {
        return <ApplicationSkeleton />;
    }

    const finalPrice = article?.paymentPrice
        ? Math.round(Number(article.paymentPrice) - (Number(article.paymentPrice) * (Number(article.paymentDiscountPercent || 0) / 100)))
        : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userInfo) {
            toast.error("Please login to proceed with application");
            navigate('/login');
            return;
        }

        if (activeOption === 'documents' && files.length === 0 && !message.trim()) {
            toast.error("Please provide some information or upload documents");
            return;
        }

        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append('articleId', article._id);
            formData.append('paymentType', activeOption);
            formData.append('message', message);
            formData.append('amount', finalPrice);

            if (files && files.length > 0) {
                files.forEach(file => {
                    formData.append('files', file);
                });
            }

            const response = await submitApplicationApi(formData);
            if (response.success) {
                toast.success("Application details captured! Proceeding to next step...");
                setMessage('');
                setFiles([]);
                navigate('/profile'); // or wherever you'd like
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit application");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 xl:px-8 py-4 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors shrink-0">
                        <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-lg font-black text-slate-800 dark:text-white tracking-tight leading-tight line-clamp-1">
                            {article?.title}
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Application Process</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-8">


                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
                    {/* Option 1: Documents */}
                    <button
                        onClick={() => setActiveOption('documents')}
                        className={`p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all text-left flex flex-col items-start ${activeOption === 'documents'
                            ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}
                    >
                        <div className={`size-8 sm:size-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 transition-colors ${activeOption === 'documents' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                            <FileText className="size-4 sm:size-6" />
                        </div>
                        <h3 className={`text-[11px] sm:text-lg font-black tracking-tight leading-tight ${activeOption === 'documents' ? 'text-primary' : 'text-slate-800 dark:text-white'}`}>Documents & Info</h3>
                        <p className="hidden sm:block text-sm text-slate-500 font-medium mt-1 leading-relaxed">Upload required documents and provide additional details.</p>
                    </button>

                    {/* Option 2: Payment */}
                    <button
                        onClick={() => setActiveOption('payment')}
                        className={`p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all text-left relative overflow-hidden flex flex-col items-start ${activeOption === 'payment'
                            ? 'bg-emerald-500/5 border-emerald-500 shadow-lg shadow-emerald-500/10'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-500/50'}`}
                    >
                        <div className={`size-8 sm:size-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 transition-colors ${activeOption === 'payment' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                            <CreditCard className="size-4 sm:size-6" />
                        </div>
                        <h3 className={`text-[11px] sm:text-lg font-black tracking-tight leading-tight ${activeOption === 'payment' ? 'text-emerald-500' : 'text-slate-800 dark:text-white'}`}>Direct Application</h3>
                        <p className="hidden sm:block text-sm text-slate-500 font-medium mt-1 leading-relaxed italic">Fast track your process with a direct payment of ₹{finalPrice}.</p>

                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-emerald-500 text-white text-[8px] sm:text-[9px] font-black px-1.5 sm:px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                            ₹{finalPrice}
                        </div>
                    </button>
                </div>


                <div className="bg-white dark:bg-slate-800 rounded-4xl shadow-sm border border-slate-100 dark:border-slate-700/60 p-6 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Step 1 & 2: Documents & Information (Only shows if activeOption is 'documents') */}
                        {activeOption === 'documents' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                {/* Step 1: Multiple File Upload */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                                        <Upload className="text-primary" size={20} />
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Upload Documents</h2>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Upload Button Card */}
                                        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-all group">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*,.pdf"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all">
                                                <PlusCircle size={20} />
                                            </div>
                                            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Add Files</p>
                                            <p className="text-[10px] text-slate-400 mt-1">Images or PDFs</p>
                                        </label>

                                        {/* File Previews */}
                                        {files.map((file, idx) => (
                                            <FilePreviewItem
                                                key={idx}
                                                file={file}
                                                onRemove={() => removeFile(idx)}
                                                onPreview={(url) => setPreviewImage(url)}
                                            />
                                        ))}
                                    </div>
                                </div>


                                {/* Step 2: Message Field */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                                        <MessageSquare className="text-amber-500" size={20} />
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Additional Information</h2>
                                    </div>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows="5"
                                        placeholder="Tell us more about your application or mention specific requirements..."
                                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-700 dark:text-white font-medium transition-all"
                                    />
                                </div>
                            </div>
                        )}


                        {/* Step 3: Payment Section (Only shows if activeOption is 'payment') */}
                        {activeOption === 'payment' && (
                            <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-300">
                                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                                    <QrCode className="text-emerald-500" size={20} />
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Direct Payment via UPI</h2>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-900 rounded-4xl p-5 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                                    <div className="size-44 sm:size-52 bg-white p-3 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0 group relative cursor-pointer" onClick={() => setPreviewImage(paymentSettings?.qrCodeImage || '/upi_qr.png')}>
                                        <img
                                            src={paymentSettings?.qrCodeImage || '/upi_qr.png'}
                                            alt="UPI QR Code"
                                            className="w-full h-full object-contain"
                                        />
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl sm:rounded-3xl">
                                            <div className="size-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-800 shadow-sm">
                                                <Eye size={20} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-6 flex flex-col items-center md:items-start text-center md:text-left w-full">
                                        <div className="w-full">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pay To UPI ID</p>
                                            <div className="flex items-center justify-center md:justify-start gap-2">
                                                <div className="bg-emerald-500/5 text-emerald-600 px-4 py-2.5 rounded-xl font-bold text-sm border border-emerald-500/10">
                                                    {paymentSettings?.upiId || 'zoyacenter@upl'}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(paymentSettings?.upiId || "zoyacenter@upl");
                                                        toast.success("UPI ID Copied!");
                                                    }}
                                                    className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:text-emerald-500 transition-all text-slate-400 shadow-sm hover:shadow-md active:scale-90"
                                                >
                                                    <Copy size={16} />
                                                </button>

                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1 w-full">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Payable Amount</p>
                                            <h3 className="text-4xl font-black text-slate-800 dark:text-white mt-1">₹{finalPrice}</h3>
                                        </div>

                                        <div className="flex flex-col gap-3 w-full max-w-[260px] md:max-w-none">
                                            <div className="flex items-start gap-3 text-xs font-bold text-slate-500 dark:text-slate-400 text-left">
                                                <div className="size-5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Check size={12} />
                                                </div>
                                                <span className="leading-tight">Scan using any UPI App (GPay, PhonePe, etc.)</span>
                                            </div>
                                            <div className="flex items-start gap-3 text-xs font-bold text-slate-500 dark:text-slate-400 text-left">
                                                <div className="size-5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Check size={12} />
                                                </div>
                                                <span className="leading-tight">Take a screenshot of payment for confirmation.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}



                        {/* Payment Summary */}
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-700">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Service Amount</p>
                                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">₹{finalPrice}</h3>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-10 py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl shadow-xl shadow-primary/25 transition-all hover:-translate-y-1 active:scale-[0.98] text-sm uppercase tracking-widest flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Processing...' : 'Proceed & Apply'} <ArrowLeft className="rotate-180" size={16} />
                                </button>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setPreviewImage(null)}>

                    <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-all p-2 bg-white/10 hover:bg-white/20 rounded-full">
                        <X size={24} />
                    </button>
                    <div className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
                        <img
                            src={previewImage}
                            alt="Full Preview"
                            className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-xl shadow-2xl border border-white/10"
                        />
                    </div>
                </div>
            )}

        </div>
    );
};


const PlusCircle = ({ size }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export default ApplicationPage;
