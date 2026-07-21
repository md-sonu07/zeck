import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGallery } from '../../../store/thunk/galleryThunk';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, LayoutGrid, Users } from 'lucide-react';
import SEO from '../../../components/common/SEO';
import { GallerySkeleton } from '../../../components/common/Skeleton';

const getOptimizedUrl = (url, width, height, quality = 80) => {
    if (!url) return '';
    if (url.includes('ik.imagekit.io')) {
        // Handle existing query params if any
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}tr=w-${width},h-${height},fo-auto,q-${quality}`;
    }
    return url;
};

const getLightboxUrl = (url) => {
    if (!url) return '';
    if (url.includes('ik.imagekit.io')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}tr=w-1600,q-85`;
    }
    return url;
};

const Card = ({ item, aspect, onClick, width, height }) => (
    <div onClick={onClick} className="cursor-pointer group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className={`${aspect} relative overflow-hidden bg-slate-100 dark:bg-slate-900`}>
            <img
                src={getOptimizedUrl(item.imageUrl, width, height)}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                fetchPriority={item.order < 4 ? 'high' : 'auto'}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        </div>
        <div className="p-4">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-2 py-1 rounded-lg">
                {item.category}
            </span>
            <h3 className="font-bold text-slate-800 dark:text-white text-sm mt-2 leading-tight">
                {item.title}
            </h3>
            {item.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                </p>
            )}
        </div>
    </div>
);

const GalleryPage = () => {
    const dispatch = useDispatch();
    const { data: items, loading } = useSelector((state) => state.gallery);

    const [lightboxImg, setLightboxImg] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(-1);
    const [lightboxList, setLightboxList] = useState([]);



    const memberItems = items.filter(item => item.category === 'Our Team');
    const otherItems = items.filter(item => item.category === 'Highlights & Moments');

    const openLightbox = (list, index) => {
        setLightboxList(list);
        setLightboxIndex(index);
        setLightboxImg(list[index]);
    };

    const closeLightbox = () => {
        setLightboxImg(null);
        setLightboxIndex(-1);
        setLightboxList([]);
    };

    const navigateLightbox = (dir) => {
        const newIndex = lightboxIndex + dir;
        if (newIndex >= 0 && newIndex < lightboxList.length) {
            setLightboxIndex(newIndex);
            setLightboxImg(lightboxList[newIndex]);
        }
    };

    useEffect(() => {
        const handleKey = (e) => {
            if (!lightboxImg) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightboxImg, lightboxIndex, lightboxList.length]);

    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        dispatch(fetchGallery()).finally(() => {
            setInitialLoad(false);
        });
    }, [dispatch]);

    if ((loading || initialLoad) && items.length === 0) return <GallerySkeleton />;

    return (
        <>
            <SEO
                title="Gallery - Zoya Education Centre"
                description="Explore photos of our members, events, achievements and important moments at Zoya Education Centre."
                keywords="gallery, photos, members, events, achievements, zoya education centre"
            />
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
                <div className="flex items-center gap-4 mb-10">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <LayoutGrid size={26} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                            Photo Gallery
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            Capturing moments and memories
                        </p>
                    </div>
                </div>

                {/* Row 1: Our Team (portrait) */}
                {memberItems.length > 0 && (
                    <section className="mb-14">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Users size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                                Our Team
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {memberItems.map((item, index) => (
                                <Card
                                    key={item._id}
                                    item={item}
                                    aspect="aspect-[4/3]"
                                    width={600}
                                    height={450}
                                    onClick={() => openLightbox(memberItems, index)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Row 2: Highlights & Moments (wider) */}
                {otherItems.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <ImageIcon size={20} />
                            </div>
                            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                                Highlights & Moments
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {otherItems.map((item, index) => (
                                <Card
                                    key={item._id}
                                    item={item}
                                    aspect="aspect-[16/10]"
                                    width={800}
                                    height={500}
                                    onClick={() => openLightbox(otherItems, index)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {items.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="size-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                            <ImageIcon size={36} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400">No images yet</h3>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Gallery coming soon.</p>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightboxImg && (
                <div
                    className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 size-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-10"
                    >
                        <X size={24} />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
                        disabled={lightboxIndex === 0}
                        className="absolute left-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-10 disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
                        disabled={lightboxIndex === lightboxList.length - 1}
                        className="absolute right-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all z-10 disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={24} />
                    </button>

                    <div
                        className="max-w-5xl max-h-[85vh] flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={getLightboxUrl(lightboxImg.imageUrl)}
                            alt={lightboxImg.title}
                            className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl bg-black/50"
                            decoding="async"
                        />
                        <div className="mt-4 text-center">
                            <h3 className="text-lg font-bold text-white">{lightboxImg.title}</h3>
                            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">{lightboxImg.category}</span>
                            {lightboxImg.description && (
                                <p className="text-sm text-white/70 mt-1">{lightboxImg.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GalleryPage;
