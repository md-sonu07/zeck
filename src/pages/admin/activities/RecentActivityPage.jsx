import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Users,
    Briefcase,
    FileText,
    CheckCircle,
    Clock,
    Filter,
    ChevronDown,
    Search,
    CreditCard,
    ArrowLeft,
    Loader2,
    MessageSquare
} from 'lucide-react';
import { getActivities } from '../../../store/thunk/dashboardThunk';
import { fetchCategories } from '../../../store/thunk/categoryThunk';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

/* ── Custom Dropdown ─────────────────────────────────────── */
const CustomSelect = ({ label, options, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = React.useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selected = options.find((o) => o.value === value) || options[0];

    return (
        <div ref={ref} className="relative flex-1 min-w-[200px]">
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">
                {label}
            </label>

            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className={`w-full h-11 flex items-center justify-between gap-2 px-4 rounded-xl border text-sm font-bold transition-all duration-200 bg-slate-50 dark:bg-slate-900 cursor-pointer
                    ${open
                        ? 'border-primary ring-2 ring-primary/20 bg-white dark:border-primary/50'
                        : 'border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600'
                    }`}
            >
                <span className={`truncate ${selected.value ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                    {selected.label}
                </span>
                <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-primary' : 'rotate-0 text-slate-500'}`}
                />
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div className="absolute top-full left-0 z-50 mt-1.5 w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl shadow-slate-200/40 dark:shadow-black/60 overflow-hidden">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => { onChange(opt.value); setOpen(false); }}
                                className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-left transition-colors duration-150
                                    ${value === opt.value
                                        ? 'bg-primary/5 text-primary font-bold'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/40 font-semibold'
                                    }`}
                            >
                                <span>{opt.label}</span>
                                {value === opt.value && <Check size={14} className="shrink-0 text-primary" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


const RecentActivityPage = () => {
    const dispatch = useDispatch();
    const { allActivities, isActivitiesLoading } = useSelector((state) => state.dashboard);
    const { data: categories } = useSelector((state) => state.categories);

    const [filters, setFilters] = useState({
        type: '',
        resourceType: '',
        subCategory: '',
        hasPayment: false
    });

    useEffect(() => {
        dispatch(getActivities(filters));
    }, [dispatch, filters]);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Build dynamic options
    const ACTIVITY_TYPES = [
        { label: 'All Activities', value: '' },
        { label: 'Posts (Articles)', value: 'article' },
        { label: 'User Registrations', value: 'user' },
        { label: 'Payments', value: 'payment' },
        { label: 'Contact Messages', value: 'contact' }
    ];

    const RESOURCE_TYPES = React.useMemo(() => {
        const res = categories?.find(c => c.type === 'resources');
        const items = (res?.values || []).map(v => ({ label: v, value: v }));
        return [{ label: 'All Resources', value: '' }, ...items];
    }, [categories]);

    const MAIN_CATEGORIES = React.useMemo(() => {
        const res = categories?.find(c => c.type === 'subcategories');
        const items = (res?.values || []).map(v => ({ label: v, value: v }));
        return [{ label: 'All Categories', value: '' }, ...items];
    }, [categories]);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Latest Jobs': return Briefcase;
            case 'Admit Card': return FileText;
            case 'Result': return CheckCircle;
            case 'User': return Users;
            case 'Payment': return CreditCard;
            case 'Contact': return MessageSquare;
            default: return FileText;
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'Latest Jobs': return "text-blue-500 bg-blue-50 dark:bg-blue-500/10";
            case 'Admit Card': return "text-amber-500 bg-amber-50 dark:bg-amber-500/10";
            case 'Result': return "text-purple-500 bg-purple-50 dark:bg-purple-500/10";
            case 'User': return "text-green-500 bg-green-50 dark:bg-green-500/10";
            case 'Payment': return "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10";
            case 'Contact': return "text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10";
            default: return "text-slate-500 bg-slate-50 dark:bg-slate-500/10";
        }
    };

    const handleFilterUpdate = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: checked
        }));
    };


    const getAdminPath = (activity) => {
        if (activity.type === 'user') return '/admin/users';
        if (activity.type === 'payment') return '/admin/payments';
        if (activity.type === 'contact') return '/admin/contact-messages';

        // Map iconType/resource to admin routes
        const rt = activity.iconType;
        switch (rt) {
            case 'Latest Jobs': return '/admin/latest-news';
            case 'Admit Card': return '/admin/admit-cards';
            case 'Result': return '/admin/results';
            case 'Latest News': return '/admin/latest-news';
            case 'University': return '/admin/university';
            case 'Admission': return '/admin/admission';
            case 'Answer Key': return '/admin/answer-key';
            default: return '/admin/page-articles';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Recent Activity</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Detailed log of all system events and updates.</p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-visible">
                <div className="flex flex-wrap gap-4 items-end">
                    <CustomSelect
                        label="Activity Type"
                        options={ACTIVITY_TYPES}
                        value={filters.type}
                        onChange={(val) => handleFilterUpdate('type', val)}
                    />

                    {(!filters.type || filters.type === 'article') && (
                        <>
                            <CustomSelect
                                label="Resource Type"
                                options={RESOURCE_TYPES}
                                value={filters.resourceType}
                                onChange={(val) => handleFilterUpdate('resourceType', val)}
                            />

                            <CustomSelect
                                label="Main Category"
                                options={MAIN_CATEGORIES}
                                value={filters.subCategory}
                                onChange={(val) => handleFilterUpdate('subCategory', val)}
                            />

                            <div className="flex items-center gap-2 pb-2 h-[42px]">
                                <label className="relative inline-flex items-center cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="hasPayment"
                                        checked={filters.hasPayment}
                                        onChange={handleCheckboxChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    <span className="ml-3 text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1 group-hover:text-primary transition-colors">
                                        <CreditCard size={14} /> Paid Only
                                    </span>
                                </label>
                            </div>
                        </>
                    )}
                </div>
            </div>


            {/* Activities List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden">
                {isActivitiesLoading ? (
                    <div className="p-20 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="size-12 text-primary animate-spin" />
                        <p className="text-slate-500 font-medium animate-pulse">Fetching latest updates...</p>
                    </div>
                ) : allActivities.length > 0 ? (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {allActivities.map((activity) => (
                            <Link
                                key={activity.id}
                                to={getAdminPath(activity)}
                                className="block p-6 hover:bg-slate-50/80 dark:hover:bg-slate-700/20 transition-all duration-300 group hover:shadow-md hover:scale-[1.005] active:scale-100"
                            >
                                <div className="flex gap-4">
                                    <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${getColor(activity.iconType)}`}>
                                        {React.createElement(getIcon(activity.iconType), { size: 24 })}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors truncate">{activity.action}</h3>
                                                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-0.5 line-clamp-1">{activity.details}</p>
                                            </div>
                                            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 whitespace-nowrap">
                                                    <Clock size={12} /> {formatTime(activity.time)}
                                                </span>
                                                {activity.metadata?.payment > 0 && (
                                                    <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                                                        ₹{activity.metadata.payment}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {activity.metadata?.category && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">
                                                    {activity.metadata.category}
                                                </span>
                                                {activity.metadata.subCategory && (
                                                    <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">
                                                        {activity.metadata.subCategory}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (

                    <div className="p-20 text-center">
                        <div className="bg-slate-50 dark:bg-slate-900 size-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Activities Found</h3>
                        <p className="text-slate-500 max-w-xs mx-auto text-sm mt-1">Try adjusting your filters to find what you're looking for.</p>
                        <button
                            onClick={() => setFilters({ type: '', resourceType: '', mainCategory: '', hasPayment: false })}
                            className="mt-6 text-primary font-bold text-sm hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentActivityPage;
