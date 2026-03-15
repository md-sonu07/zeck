import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../../../store/slice/authSlice';
import { getArticleByIdApi, toggleSavePostApi } from '../../../api/articleapi';
import {
    Calendar, MapPin, Tag, ArrowLeft, Loader2, PlayCircle,
    Share2, Bookmark, BookmarkCheck, CheckCircle2, Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import './quill-content.css';
import SEO from '../../../components/common/SEO';

const ArticleDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [savingPost, setSavingPost] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const data = await getArticleByIdApi(slug);
                setArticle(data);
                if (data.title) document.title = `${data.title} - Zoya Education`;
            } catch (error) {
                console.error("Failed to fetch article:", error);
                toast.error(`Error loading article content`);
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchArticle();
    }, [slug, navigate]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: article?.title,
                url: window.location.href
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    // Check if post is saved when article loads
    useEffect(() => {
        if (article && userInfo?.savedPosts) {
            setIsSaved(userInfo.savedPosts.includes(article._id));
        }
    }, [article, userInfo]);

    const handleSaveToggle = async () => {
        if (!userInfo) {
            toast.error('Please login to save posts');
            navigate('/login');
            return;
        }
        try {
            setSavingPost(true);
            const res = await toggleSavePostApi(article._id);
            setIsSaved(res.saved);
            // Update Redux store with new savedPosts
            dispatch(setCredentials({ ...userInfo, savedPosts: res.savedPosts }));
            toast.success(res.saved ? 'Post saved!' : 'Post removed from saved');
        } catch (error) {
            toast.error('Failed to save post');
        } finally {
            setSavingPost(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-primary size-10" />
                <p className="mt-4 text-slate-500 font-medium">Loading details...</p>
            </div>
        );
    }

    if (!article) return null;

    const finalPrice = article.paymentPrice
        ? Math.round(Number(article.paymentPrice) - (Number(article.paymentPrice) * (Number(article.paymentDiscountPercent || 0) / 100)))
        : 0;

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 pb-20 font-sans">
            <SEO
                title={article.title}
                description={article.shortSummary || article.content?.substring(0, 160).replace(/<[^>]*>?/gm, '')}
                image={article.imageUrl}
                keywords={`${article.mainCategory}, ${article.subCategory || ''}, ${article.tags?.join(', ') || ''}`}
                type="article"
            />

            {/* Premium Header: Breadcrumbs + Navigation */}
            <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-40 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 xl:px-8 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
                        <button
                            onClick={() => navigate(-1)}
                            className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/10 transition-all duration-300 active:scale-95 shrink-0 shadow-sm"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div className="flex items-center gap-2 text-[12px] sm:text-sm font-bold whitespace-nowrap overflow-hidden">
                            <Link
                                to="/"
                                className="text-slate-400 hover:text-primary transition-colors cursor-pointer shrink-0"
                            >
                                Home
                            </Link>
                            <span className="text-slate-300 dark:text-slate-700 shrink-0 font-medium hidden sm:inline">/</span>
                            <span
                                className="text-slate-400 hover:text-primary transition-colors cursor-pointer truncate max-w-[80px] sm:max-w-none capitalize"
                            >
                                {article.mainCategory}
                            </span>
                            <span className="text-slate-300 dark:text-slate-700 shrink-0 font-medium hidden sm:inline">/</span>

                            <span className="text-primary font-black truncate max-w-[100px] sm:max-w-sm ml-1 hidden min-[400px]:inline">
                                {article.title}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <button
                            onClick={handleShare}
                            className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 transition-all duration-300 active:scale-95 shadow-sm"
                            title="Share"
                        >
                            <Share2 size={16} />
                        </button>
                        <button
                            onClick={handleSaveToggle}
                            className={`size-9 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-95 shadow-sm ${isSaved
                                ? 'bg-amber-500 text-white shadow-amber-500/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-amber-500 hover:bg-amber-500/10'
                                }`}
                            title={isSaved ? "Saved" : "Save"}
                        >
                            {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-4 xl:px-8 mt-6 md:mt-10">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

                    {/* LEFT COLUMN: Main Content */}
                    <main className="lg:col-span-8 space-y-6">

                        {/* Title + Quick Info */}
                        <div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-snug mb-4">
                                {article.title}
                            </h1>

                            {/* Info Chips */}
                            <div className="flex flex-wrap items-center gap-2.5 text-sm">
                                <span className="bg-primary/10 text-primary font-bold px-3.5 py-1.5 rounded-lg border border-primary/20 capitalize">{article.mainCategory}</span>
                                {article.subCategory && (
                                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 capitalize">{article.subCategory}</span>
                                )}
                                {article.resourceType && (
                                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 capitalize">{article.resourceType}</span>
                                )}
                                <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">|</span>
                                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium capitalize">
                                    <MapPin size={14} /> {article.location || 'India'}
                                </span>
                                <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">|</span>
                                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                                    <Calendar size={14} /> {new Date(article.postDate || article.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                                {article.lastDate && (
                                    <>
                                        <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">|</span>
                                        <span className="text-red-500 flex items-center gap-1.5 font-bold">
                                            <Calendar size={14} /> Due: {new Date(article.lastDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Short Summary */}
                        {article.shortSummary && (
                            <div className="bg-primary/5 dark:bg-primary/10 border-l-4 border-primary rounded-r-xl px-5 py-4">
                                <p className="text-slate-600 dark:text-slate-300 text-md leading-relaxed">
                                    {article.shortSummary}
                                </p>
                            </div>
                        )}

                        {/* Banner Image */}
                        {article.imageUrl && (
                            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                <img
                                    src={article.imageUrl}
                                    alt={article.title}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}

                        {/* Article Content */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-10">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 pb-3 border-b border-slate-100 dark:border-slate-700">
                                Full Details
                            </h2>
                            <div
                                className="custom-article-content"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        </div>

                    </main>

                    {/* RIGHT COLUMN: Sidebar Widgets */}
                    <aside className="lg:col-span-4">
                        <div className="flex flex-col gap-6">

                            {/* Fee & Apply Widget */}
                            {article.paymentPrice > 0 && (
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                    <div className="bg-slate-800 dark:bg-slate-700 px-5 py-3 flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-400" />
                                        <h3 className="text-xs font-bold text-white">Fee Structure</h3>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-400">Base Fee</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">₹{article.paymentPrice}</span>
                                        </div>
                                        {article.paymentDiscountPercent > 0 && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400">Discount</span>
                                                <span className="font-semibold text-emerald-500">-{article.paymentDiscountPercent}%</span>
                                            </div>
                                        )}
                                        <div className="border-t border-dashed border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-center">
                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">You Pay</span>
                                            <span className="text-2xl font-extrabold text-primary">₹{finalPrice}</span>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/apply/${article.slug}`)}
                                            className="w-full mt-2 bg-linear-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/25"
                                        >
                                            <CheckCircle2 size={16} />
                                            Apply Now
                                        </button>

                                    </div>
                                </div>
                            )}

                            {/* At A Glance Widget */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="bg-slate-800 dark:bg-slate-700 px-5 py-3 flex items-center gap-2">
                                    <Info size={14} className="text-blue-400" />
                                    <h3 className="text-xs font-bold text-white">At A Glance</h3>
                                </div>
                                <div className="p-5 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-400">
                                            <Calendar size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Posted On</p>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">
                                                {new Date(article.postDate || article.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>

                                    {article.lastDate && (
                                        <div className="flex items-center gap-3 bg-red-50/50 dark:bg-red-900/10 -mx-5 px-5 py-3">
                                            <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500">
                                                <Calendar size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Deadline</p>
                                                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                                                    {new Date(article.lastDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {article.location && (
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-400">
                                                <MapPin size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                                                <p className="text-sm font-bold text-slate-800 dark:text-white">{article.location}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Share & Bookmark Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleShare}
                                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-all"
                                >
                                    <Share2 size={16} /> Share
                                </button>
                                <button
                                    onClick={handleSaveToggle}
                                    disabled={savingPost}
                                    className={`flex-1 border rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-semibold transition-all ${isSaved
                                        ? 'bg-primary/10 border-primary/30 text-primary'
                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary'
                                        }`}
                                >
                                    {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                                    {isSaved ? 'Saved' : 'Save'}
                                </button>
                            </div>

                            {/* YouTube Video Widget */}
                            {article.ytLink && (
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                    <div className="bg-slate-800 dark:bg-slate-700 px-5 py-3 flex items-center gap-2">
                                        <PlayCircle size={14} className="text-red-400" />
                                        <h3 className="text-xs font-bold text-white">Video Guide</h3>
                                    </div>
                                    <div className="p-4">
                                        <div className="relative pt-[56.25%] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${article.ytLink.split('v=')[1]?.split('&')[0] || article.ytLink.split('/').pop()}`}
                                                className="absolute inset-0 w-full h-full"
                                                allowFullScreen
                                                title="YouTube video player"
                                            ></iframe>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tags Widget */}
                            {article.tags && article.tags.length > 0 && (
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                    <div className="bg-slate-800 dark:bg-slate-700 px-5 py-3 flex items-center gap-2">
                                        <Tag size={14} className="text-slate-300" />
                                        <h3 className="text-xs font-bold text-white">Related Keywords</h3>
                                    </div>
                                    <div className="p-5 flex flex-wrap gap-2">
                                        {article.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-100 dark:border-slate-700 hover:text-primary hover:border-primary/30 transition-all cursor-pointer capitalize"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetailPage;
