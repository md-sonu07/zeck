import React from 'react';

/**
 * Global Skeleton component for loading states.
 * Supports different shapes and custom sizes.
 */
const Skeleton = ({ width, height, className = "", circle = false }) => {
    const baseClass = "animate-pulse bg-slate-200 dark:bg-slate-800";
    const shapeClass = circle ? "rounded-full" : "rounded-xl";

    const style = {
        width: width || '100%',
        height: height || '20px'
    };

    return (
        <div
            className={`${baseClass} ${shapeClass} ${className}`}
            style={style}
        />
    );
};

// --- Helper Components ---

const CardSkeleton = ({ height = "120px", className = "" }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 ${className}`}>
        <div className="flex gap-4">
            <div className="flex-1 space-y-3">
                <Skeleton width="40%" height="10px" />
                <Skeleton width="80%" height="20px" />
                <div className="flex gap-4 pt-2">
                    <Skeleton width="60px" height="12px" />
                    <Skeleton width="60px" height="12px" />
                </div>
            </div>
            <Skeleton width="100px" height="100px" className="shrink-0" />
        </div>
    </div>
);

const ListItemSkeleton = () => (
    <div className="flex items-center justify-between gap-4 p-4 border-b border-slate-50 dark:border-slate-800 last:border-0">
        <div className="flex items-center gap-3 flex-1">
            {/* <Skeleton width="24px" height="14px" /> */}
            <Skeleton width="14px" height="14px" />
            <div className="flex-1 max-w-md">
                <Skeleton width="90%" height="16px" />
                <Skeleton width="30%" height="10px" className="mt-2" />
            </div>
        </div>
        <Skeleton width="50px" height="20px" className="rounded-md shrink-0" />
    </div>
);

// --- Specialized Skeletons ---

/**
 * Article Page Skeleton Loader
 */
export const ArticleSkeleton = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 pb-20 font-sans">
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 xl:px-8 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Skeleton width="36px" height="36px" />
                        <Skeleton width="200px" height="20px" className="hidden sm:block" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton width="36px" height="36px" />
                        <Skeleton width="36px" height="36px" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 xl:px-8 mt-6 md:mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    <div className="lg:col-span-9 space-y-6">
                        <div className="space-y-4">
                            <Skeleton width="70%" height="40px" />
                            <div className="flex gap-3">
                                <Skeleton width="80px" height="24px" />
                                <Skeleton width="120px" height="24px" />
                            </div>
                        </div>
                        <Skeleton height="80px" />
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-10 space-y-4">
                            <Skeleton width="150px" height="24px" />
                            <div className="space-y-3">
                                <Skeleton height="16px" />
                                <Skeleton height="16px" />
                                <Skeleton width="80%" height="16px" />
                            </div>
                        </div>
                    </div>
                    <aside className="lg:col-span-3 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden p-5 space-y-3">
                            <Skeleton height="20px" />
                            <Skeleton height="20px" />
                            <Skeleton height="48px" className="mt-4" />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

/**
 * Profile Page Skeleton Loader
 */
export const ProfileSkeleton = () => {
    return (
        <div className="min-h-[80vh] bg-slate-100 dark:bg-slate-950 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-5">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0 space-y-6">
                        {/* Profile Box */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            {/* Banner */}
                            <div className="bg-slate-200 dark:bg-slate-800 p-6 md:p-8 animate-pulse">
                                <div className="flex flex-col md:flex-row items-center gap-5 md:gap-6">
                                    <Skeleton width="144px" height="144px" className="rounded-3xl shrink-0" />
                                    <div className="flex-1 text-center md:text-left space-y-3">
                                        <Skeleton width="220px" height="32px" className="rounded-lg mx-auto md:mx-0" />
                                        <Skeleton width="150px" height="16px" className="rounded-md mx-auto md:mx-0" />
                                        <Skeleton width="80px" height="18px" className="rounded-full mx-auto md:mx-0 mt-2" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Skeleton width="75px" height="60px" className="rounded-xl" />
                                        <Skeleton width="75px" height="60px" className="rounded-xl" />
                                        <Skeleton width="75px" height="60px" className="rounded-xl" />
                                    </div>
                                </div>
                            </div>

                            {/* Info Rows */}
                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex items-center justify-between px-6 md:px-8 py-4">
                                        <div className="flex items-center gap-3">
                                            <Skeleton width="15px" height="15px" circle />
                                            <Skeleton width="100px" height="12px" />
                                        </div>
                                        <Skeleton width="120px" height="14px" />
                                    </div>
                                ))}
                            </div>

                            {/* Buttons Area */}
                            <div className="border-t border-slate-100 dark:border-slate-800 px-4 md:px-8 py-5 flex flex-col md:flex-row gap-3">
                                <Skeleton width="140px" height="40px" className="rounded-xl" />
                                <Skeleton width="140px" height="40px" className="rounded-xl" />
                                <div className="flex gap-3 w-full md:w-auto md:ml-auto">
                                    <Skeleton width="140px" height="40px" className="rounded-xl flex-1 md:flex-none" />
                                    <Skeleton width="140px" height="40px" className="rounded-xl flex-1 md:flex-none" />
                                </div>
                            </div>
                        </div>

                        {/* Activities Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <div className="px-6 md:px-8 py-5 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <Skeleton width="150px" height="24px" className="rounded-lg" />
                                <Skeleton width="220px" height="45px" className="rounded-[1.25rem]" />
                            </div>
                            <div className="p-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="px-6 md:px-8 py-5 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <Skeleton width="48px" height="48px" className="rounded-xl shrink-0" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton width="60%" height="16px" className="rounded-md" />
                                                <div className="flex gap-2">
                                                    <Skeleton width="80px" height="10px" className="rounded-md" />
                                                    <Skeleton width="60px" height="10px" className="rounded-md" />
                                                </div>
                                            </div>
                                        </div>
                                        <Skeleton width="20px" height="20px" circle />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-72 shrink-0 space-y-5">
                        <Skeleton height="160px" className="rounded-2xl" />
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-4 space-y-4">
                            <Skeleton width="100px" height="12px" className="rounded-md" />
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-2">
                                    <Skeleton width="32px" height="32px" className="rounded-lg shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton width="60%" height="12px" className="rounded-md" />
                                        <Skeleton width="40%" height="10px" className="rounded-md" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-2">
                                    <Skeleton width="32px" height="32px" className="rounded-lg shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton width="60%" height="12px" className="rounded-md" />
                                        <Skeleton width="40%" height="10px" className="rounded-md" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Category Page (Admission, Results, etc.) Skeleton
 */
export const CategorySkeleton = () => {
    return (
        <div className="pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className="bg-primary px-4 py-8">
                <div className="max-w-[1200px] mx-auto space-y-3">
                    <Skeleton width="100px" height="12px" className="bg-white/20" />
                    <Skeleton width="300px" height="32px" className="bg-white/20" />
                    <Skeleton width="500px" height="16px" className="bg-white/20" />
                </div>
            </div>
            <div className="max-w-[1200px] mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-5">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
                            <div className="flex gap-2">
                                <Skeleton width="60px" height="16px" />
                                <Skeleton width="80px" height="16px" />
                            </div>
                            <Skeleton width="90%" height="24px" />
                            <div className="flex gap-8">
                                <div className="space-y-2">
                                    <Skeleton width="60px" height="10px" />
                                    <Skeleton width="100px" height="14px" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton width="60px" height="10px" />
                                    <Skeleton width="100px" height="14px" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-80 hidden lg:block space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
                        <Skeleton height="24px" width="120px" />
                        <div className="space-y-3">
                            <Skeleton height="40px" />
                            <Skeleton height="40px" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CourseAdmitCardSkeleton = () => {
    return (
        <div className="pb-16 bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className="max-w-[1200px] mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-5">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
                            <div className="flex gap-2">
                                <Skeleton width="60px" height="16px" />
                                <Skeleton width="80px" height="16px" />
                            </div>
                            <Skeleton width="90%" height="24px" />
                            <div className="flex gap-8">
                                <div className="space-y-2">
                                    <Skeleton width="60px" height="10px" />
                                    <Skeleton width="100px" height="14px" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton width="60px" height="10px" />
                                    <Skeleton width="100px" height="14px" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-80 hidden lg:block space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-4">
                        <Skeleton height="24px" width="120px" />
                        <div className="space-y-3">
                            <Skeleton height="40px" />
                            <Skeleton height="40px" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Home Page Skeleton
 */
export const HomeSkeleton = () => {
    return (
        <div className="pb-10 bg-slate-50 dark:bg-slate-900">
            <Skeleton height="450px" className="rounded-none" />
            <div className="max-w-[1200px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-9 space-y-8">
                        <div className="space-y-4">
                            <Skeleton width="200px" height="20px" />
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                                {[1, 2, 3, 4].map(i => <ListItemSkeleton key={i} />)}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <Skeleton width="150px" height="20px" />
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    {[1, 2, 3].map(i => <ListItemSkeleton key={i} />)}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Skeleton width="150px" height="20px" />
                                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    {[1, 2, 3].map(i => <ListItemSkeleton key={i} />)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <aside className="lg:col-span-3 space-y-6">
                        <Skeleton height="300px" />
                        <Skeleton height="200px" />
                    </aside>
                </div>
            </div>
        </div>
    );
};

/**
 * Card Base Skeleton (For News Items in Sections)
 */
export const ListItemsSkeleton = ({ count = 5 }) => (
    <div className="space-y-0">
        {[...Array(count)].map((_, i) => <ListItemSkeleton key={i} />)}
    </div>
);

/**
 * About Page Skeleton
 */
export const AboutSkeleton = () => (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-16">
        <div className="max-w-[1200px] mx-auto px-4 py-12 md:py-20 flex flex-col lg:flex-row gap-12 lg:gap-20">
            <div className="flex-1 space-y-8">
                <Skeleton width="100px" height="24px" className="rounded-full" />
                <Skeleton width="80%" height="60px" />
                <div className="space-y-4">
                    <Skeleton height="16px" />
                    <Skeleton height="16px" />
                    <Skeleton width="90%" height="16px" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
                    <Skeleton height="120px" />
                    <Skeleton height="120px" />
                </div>
            </div>
            <div className="flex-1 max-w-md mx-auto">
                <Skeleton height="600px" className="rounded-2xl" />
            </div>
        </div>
    </div>
);

/**
 * Contact Page Skeleton
 */
export const ContactSkeleton = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-16">
        <div className="bg-primary px-4 py-10">
            <div className="max-w-[1200px] mx-auto space-y-3">
                <Skeleton width="100px" height="12px" className="bg-white/20" />
                <Skeleton width="200px" height="32px" className="bg-white/20" />
            </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 -mt-5 mb-10">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} height="120px" className="shadow-lg" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 space-y-6">
                        <Skeleton width="200px" height="24px" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton height="45px" />
                            <Skeleton height="45px" />
                        </div>
                        <Skeleton height="45px" />
                        <Skeleton height="150px" />
                        <Skeleton height="50px" />
                    </div>
                </div>
                <div className="lg:col-span-4 space-y-6">
                    <Skeleton height="200px" />
                    <Skeleton height="350px" />
                </div>
            </div>
        </div>
    </div>
);

/**
 * Services Page Skeleton
 */
export const ServicesSkeleton = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-16">
        <div className="bg-primary px-4 py-10">
            <div className="max-w-[1200px] mx-auto space-y-3">
                <Skeleton width="150px" height="12px" className="bg-white/20" />
                <Skeleton width="300px" height="32px" className="bg-white/20" />
            </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-4 mt-8">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-6">
                    <Skeleton width="200px" height="20px" />
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <Skeleton height="200px" className="rounded-none" />
                                <div className="p-5 space-y-4">
                                    <Skeleton width="70%" height="20px" />
                                    <Skeleton height="12px" />
                                    <Skeleton height="12px" />
                                    <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                                        <Skeleton height="40px" />
                                        <Skeleton height="40px" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <aside className="w-80 hidden lg:block space-y-6">
                    <Skeleton height="300px" />
                </aside>
            </div>
        </div>
    </div>
);

/**
 * Application Page Skeleton
 */
export const ApplicationSkeleton = () => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="max-w-7xl mx-auto flex items-center gap-4 px-4">
                <Skeleton width="36px" height="36px" circle />
                <div className="space-y-2">
                    <Skeleton width="200px" height="20px" />
                    <Skeleton width="100px" height="10px" />
                </div>
            </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
            <div className="grid grid-cols-2 gap-4">
                <Skeleton height="150px" />
                <Skeleton height="150px" />
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-8 space-y-6">
                <div className="space-y-4">
                    <Skeleton width="150px" height="24px" />
                    <div className="grid grid-cols-3 gap-4">
                        <Skeleton height="100px" />
                        <Skeleton height="100px" />
                        <Skeleton height="100px" />
                    </div>
                </div>
                <div className="space-y-4">
                    <Skeleton width="150px" height="24px" />
                    <Skeleton height="120px" />
                </div>
                <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <div className="space-y-2">
                        <Skeleton width="100px" height="10px" />
                        <Skeleton width="150px" height="24px" />
                    </div>
                    <Skeleton width="180px" height="48px" />
                </div>
            </div>
        </div>
    </div>
);

/**
 * Gallery Page Skeleton
 */
export const GallerySkeleton = () => (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4 mb-10">
            <Skeleton width="48px" height="48px" className="rounded-xl" />
            <div className="space-y-2">
                <Skeleton width="200px" height="28px" />
                <Skeleton width="140px" height="14px" />
            </div>
        </div>
        <div className="mb-14">
            <div className="flex items-center gap-3 mb-6">
                <Skeleton width="40px" height="40px" className="rounded-xl" />
                <Skeleton width="120px" height="24px" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div className="aspect-[4/3] w-full">
                            <Skeleton height="100%" className="rounded-none" />
                        </div>
                        <div className="p-4 space-y-3">
                            <Skeleton width="60px" height="20px" className="rounded-lg" />
                            <Skeleton width="70%" height="16px" />
                            <Skeleton width="90%" height="12px" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div>
            <div className="flex items-center gap-3 mb-6">
                <Skeleton width="40px" height="40px" className="rounded-xl" />
                <Skeleton width="180px" height="24px" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <div className="aspect-[16/10] w-full">
                            <Skeleton height="100%" className="rounded-none" />
                        </div>
                        <div className="p-4 space-y-3">
                            <Skeleton width="80px" height="20px" className="rounded-lg" />
                            <Skeleton width="60%" height="16px" />
                            <Skeleton width="80%" height="12px" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default Skeleton;
