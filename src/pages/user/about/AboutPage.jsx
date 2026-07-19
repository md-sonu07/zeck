import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, Heart, Star, Loader2 } from 'lucide-react';
import { AboutSkeleton } from '../../../components/common/Skeleton';
import { fetchAboutSettings } from '../../../store/thunk/aboutThunk';
import SEO from '../../../components/common/SEO';

export default function AboutPage() {
    const dispatch = useDispatch();
    const { settings, loading } = useSelector((state) => state.about);

    useEffect(() => {
        dispatch(fetchAboutSettings());
    }, [dispatch]);

    const title = settings?.title || 'Welcome to Zoya Education Center';
    const description = settings?.description || 'Hi! We are here to help you easily find the right government jobs, admission updates, and results. We want to make sure you get the best and most honest information without any confusion.';
    const imageUrl = settings?.imageUrl || '/logo/about-img.jpeg';
    const banner1Url = settings?.banner1Url;
    const banner2Url = settings?.banner2Url;
    const whatsappGroupUrl = settings?.whatsappGroupUrl;

    if (loading && !settings) {
        return <AboutSkeleton />;
    }

    return (
        <div className="pb-16 bg-white dark:bg-slate-950 min-h-screen">
            <SEO
                title="About Us"
                description={description}
                image={imageUrl}
            />

            {/* Main Content: Text Left, Image Right */}
            <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Left: Text */}
                    <div className="flex-1 space-y-8">
                        <div className="space-y-4">
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] bg-primary/10 dark:bg-primary/20 text-primary w-fit px-3 py-1.5 rounded-full inline-block">Our Story</h4>
                            <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600">{title}</span>
                            </h1>
                            <div className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-xl font-medium pt-2 space-y-3">
                                {description.split('\n').map((para, idx) => (
                                    <p key={idx}>{para}</p>
                                ))}
                            </div>
                        </div>

                        <div className="hidden sm:block space-y-6 pt-4 max-w-xl">
                            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 flex gap-4">
                                <div className="mt-1">
                                    <Star className="text-amber-500 fill-amber-500" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Our Mission</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        To share very fast and true updates about new jobs and schools so that students like you can succeed easily.
                                    </p>
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 flex gap-4">
                                <div className="mt-1">
                                    <Heart className="text-rose-500 fill-rose-500" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Our Promise</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        We promise to always give you real, simple information you can trust, whenever you need it to move forward.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Image*/}
                    <div className="flex-1 w-full max-w-sm lg:max-w-md relative  sm:mt-16 lg:mt-0 mx-auto lg:ml-auto lg:mr-0 z-10 flex flex-col gap-8">
                        {/* Premium Portrait Frame */}
                        <div className="relative rounded-2xl shadow-2xl overflow-hidden group border border-slate-200/50 dark:border-slate-800/80">
                            {/* Inner Glow / Overlay */}
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 dark:ring-white/10 z-20 pointer-events-none"></div>
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent z-10 pointer-events-none"></div>

                            {/* Image */}
                            <img
                                src={imageUrl}
                                alt="About - Zoya Education Center"
                                className="w-full aspect-3/4 object-cover object-[center_top] transform transition-transform duration-700 group-hover:scale-[1.03]"
                            />

                            {/* Floating Badge inside the frame's bottom */}
                            <div className="absolute bottom-6 left-6 right-6 z-30 flex justify-center">
                                <div className="bg-white/95 text-slate-800 dark:bg-slate-900/95 dark:text-white backdrop-blur-md p-3 px-5 rounded-2xl shadow-xl flex items-center gap-4 w-full max-w-[280px] border border-slate-200/60 dark:border-slate-700/60 transform transition-transform group-hover:-translate-y-1 duration-500">
                                    <div className="shrink-0 size-11 flex items-center justify-center bg-linear-to-br from-green-400 to-emerald-600 rounded-full shadow-lg text-white">
                                        <CheckCircle size={22} className="drop-shadow-sm fill-green-500/30" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5 leading-none">Shop Owner</p>
                                        <p className="text-base font-black leading-none tracking-tight">Md Ashfak</p>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Decorative background shadow */}
                        <div className="absolute -inset-1 bg-linear-to-tr from-primary/30 to-blue-500/20 rounded-[3rem] blur-2xl -z-10 opacity-50 dark:opacity-30"></div>
                    </div>
                </div>

                {/* Promotional Banners */}
                {(banner1Url || banner2Url) && (
                    <div className="mt-20 space-y-12">
                        <div className="text-center space-y-3">
                            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary">Special Updates</h4>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Our Posters & Banners</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {banner1Url && (
                                <div className="rounded-md overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group">
                                    <img
                                        src={banner1Url}
                                        alt="Promotion Banner 1"
                                        className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.02]"
                                    />
                                </div>
                            )}
                            {banner2Url && (
                                <div className="rounded-md overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group">
                                    <img
                                        src={banner2Url}
                                        alt="Promotion Banner 2"
                                        className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-[1.02]"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
