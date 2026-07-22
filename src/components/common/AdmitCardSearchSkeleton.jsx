import React from 'react';
import Skeleton from './Skeleton';

const CardSearchSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <Skeleton width="60%" height="12px" />
                    <Skeleton width="90%" height="18px" className="mt-2" />
                </div>
                <div>
                    <Skeleton width="40%" height="12px" />
                    <Skeleton width="70%" height="18px" className="mt-2" />
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2">
                <Skeleton width="140px" height="36px" className="rounded-xl" />
                <Skeleton width="80px" height="14px" />
            </div>
        </div>
    </div>
);

const AdmitCardSearchSkeleton = ({ count = 4 }) => {
    return (
        <div className="mt-4 space-y-3">
            {/* <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-4">
                <div className="relative">
                    <Skeleton width="100%" height="48px" className="rounded-xl" />
                </div>
            </div> */}

            <div className="space-y-3">
                {[...Array(count)].map((_, i) => (
                    <CardSearchSkeleton key={i} />
                ))}
            </div>
        </div>
    );
};

export default AdmitCardSearchSkeleton;
