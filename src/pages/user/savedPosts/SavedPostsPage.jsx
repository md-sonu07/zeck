import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getSavedPostsApi, toggleSavePostApi } from '../../../api/articleapi';
import {
    Bookmark, BookmarkX, Calendar, MapPin, Home, ChevronRight,
    Loader2, BookmarkCheck, ArrowLeft, Inbox, Send, MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import slug from 'slug';

const SavedPostsPage = () => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
            return;
        }
        fetchSavedPosts();
    }, [userInfo]);

    const fetchSavedPosts = async () => {
        try {
            setLoading(true);
            const data = await getSavedPostsApi();
            setSavedPosts(data);
        } catch (error) {
            console.error('Error fetching saved posts:', error);
            if (error.response?.status === 401) {
                toast.error('Please login again');
                navigate('/login');
            } else {
                toast.error('Failed to load saved posts');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (articleId) => {
        try {
            setRemovingId(articleId);
            await toggleSavePostApi(articleId);
            setSavedPosts(prev => prev.filter(p => p._id !== articleId));
            toast.success('Post removed from saved');
        } catch (error) {
            toast.error('Failed to remove post');
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
            {/* Hero Header */}
            <div className="bg-linear-to-r from-primary via-blue-600 to-blue-700 px-4 py-6">
                <div className="max-w-[1200px] mx-auto">
                    <nav className="flex items-center gap-1.5 text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-2">
                        <Link to="/" className="hover:text-white transition-colors"><Home size={10} /></Link>
                        <ChevronRight size={10} />
                        <Link to="/profile" className="hover:text-white transition-colors">Profile</Link>
                        <ChevronRight size={10} />
                        <span className="text-white">Saved Posts</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all">
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                                <BookmarkCheck size={24} /> Saved Posts
                            </h1>
                            <p className="text-blue-200 text-xs mt-1">
                                {loading ? 'Loading...' : `${savedPosts.length} saved post${savedPosts.length !== 1 ? 's' : ''}`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1200px] mx-auto px-4 mt-6">
                <div className="flex gap-6">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24">
                                <Loader2 size={40} className="text-primary animate-spin mb-4" />
                                <p className="text-sm text-slate-400 font-medium">Loading saved posts...</p>
                            </div>
                        ) : savedPosts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 px-4">
                                <div className="p-6 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
                                    <Inbox size={48} className="text-slate-300 dark:text-slate-600" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No saved posts yet</h2>
                                <p className="text-sm text-slate-400 text-center max-w-md mb-6">
                                    When you save articles by clicking the bookmark icon, they'll appear here for quick access.
                                </p>
                                <Link
                                    to="/"
                                    className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                                >
                                    Browse Articles
                                </Link>
                            </div>
                        ) : (
                            <>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                    Showing {savedPosts.length} Saved Post{savedPosts.length !== 1 ? 's' : ''}
                                </p>
                                <div className="space-y-4">
                                    {savedPosts.map((post) => (
                                        <div
                                            key={post._id}
                                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
                                        >
                                            <div className="flex flex-col md:flex-row">
                                                {/* Image thumbnail */}
                                                {post.imageUrl && (
                                                    <div className="w-full md:w-48 h-40 md:h-auto shrink-0">
                                                        <img
                                                            src={post.imageUrl}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}

                                                {/* Content */}
                                                <div className="flex-1 p-5 md:p-6">
                                                    {/* Category chips */}
                                                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                                                        <span className="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-primary/10 text-primary">
                                                            {post.mainCategory}
                                                        </span>
                                                        {post.subCategory && (
                                                            <span className="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                                                                {post.subCategory}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Title */}
                                                    <Link
                                                        to={`/${slug(post.mainCategory, { lower: true })}/${post.slug || post._id}`}
                                                        className="block"
                                                    >
                                                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug hover:text-primary transition-colors cursor-pointer mb-3">
                                                            {post.title}
                                                        </h2>
                                                    </Link>

                                                    {/* Summary */}
                                                    {post.shortSummary && (
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                                                            {post.shortSummary}
                                                        </p>
                                                    )}

                                                    {/* Meta */}
                                                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                                                        {post.location && (
                                                            <span className="flex items-center gap-1">
                                                                <MapPin size={12} /> {post.location}
                                                            </span>
                                                        )}
                                                        {post.postDate && (
                                                            <span className="flex items-center gap-1">
                                                                <Calendar size={12} /> {new Date(post.postDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </span>
                                                        )}
                                                        {post.lastDate && (
                                                            <span className="flex items-center gap-1 text-red-500 font-bold">
                                                                <Calendar size={12} /> Due: {new Date(post.lastDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action: Unsave */}
                                                <div className="shrink-0 px-5 py-4 md:py-6 flex items-center justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700">
                                                    <button
                                                        onClick={() => handleUnsave(post._id)}
                                                        disabled={removingId === post._id}
                                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 border border-red-100 dark:border-red-800/30 transition-all active:scale-95"
                                                    >
                                                        {removingId === post._id ? (
                                                            <Loader2 size={14} className="animate-spin" />
                                                        ) : (
                                                            <BookmarkX size={14} />
                                                        )}
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="w-80 shrink-0 hidden lg:block space-y-4">
                        {/* Stats Widget */}
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-slate-800 dark:bg-slate-700 px-4 py-3 flex items-center gap-2">
                                <BookmarkCheck size={13} className="text-blue-400" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Your Collection</h3>
                            </div>
                            <div className="p-5">
                                <div className="text-center py-4">
                                    <p className="text-4xl font-black text-primary mb-1">{loading ? '–' : savedPosts.length}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Posts Saved</p>
                                </div>
                                <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-2">
                                    <p className="text-[10px] text-slate-400 leading-relaxed">
                                        Save articles you want to read later. Click the <Bookmark size={10} className="inline text-primary" /> icon on any article to add it here.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links Widget */}
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-slate-800 dark:bg-slate-700 px-4 py-3 flex items-center gap-2">
                                <ChevronRight size={13} className="text-slate-300" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Quick Links</h3>
                            </div>
                            <ul>
                                {[
                                    { label: 'Latest News', to: '/latest-news', color: 'text-blue-500' },
                                    { label: 'Admit Card', to: '/admit-card', color: 'text-orange-500' },
                                    { label: 'Results', to: '/result', color: 'text-green-500' },
                                    { label: 'Answer Key', to: '/answer-key', color: 'text-purple-500' },
                                    { label: 'Syllabus', to: '/syllabus', color: 'text-cyan-500' },
                                    { label: 'Admission', to: '/admission', color: 'text-pink-500' },
                                ].map((link, i) => (
                                    <li key={i}>
                                        <Link
                                            to={link.to}
                                            className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer group transition-colors"
                                        >
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">{link.label}</span>
                                            <ChevronRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Community Widget */}
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-slate-800 dark:bg-slate-700 px-4 py-3 flex items-center gap-2">
                                <Send size={13} className="text-slate-300" />
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Join Community</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                <a href="https://t.me/zoyacenter" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg p-2 -mx-2 transition-colors group">
                                    <div className="size-8 bg-[#2CA5E0] rounded-lg flex items-center justify-center text-white shrink-0">
                                        <Send size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">Telegram Channel</p>
                                        <p className="text-[10px] text-slate-400">Instant job alerts</p>
                                    </div>
                                </a>
                                <a href="#" className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-lg p-2 -mx-2 transition-colors group">
                                    <div className="size-8 bg-[#25D366] rounded-lg flex items-center justify-center text-white shrink-0">
                                        <MessageCircle size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">WhatsApp Group</p>
                                        <p className="text-[10px] text-slate-400">Fastest response</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedPostsPage;
