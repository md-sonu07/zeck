import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal, Search, Filter, ChevronDown, Check, X, Loader2, FileX2 } from 'lucide-react';
import { fetchSearchResults } from '../../../store/thunk/searchThunk';
import { clearSearchResults } from '../../../store/slice/searchSlice';
import { fetchCategories } from '../../../store/thunk/categoryThunk';
import { Link } from 'react-router-dom';

/* ── Custom Dropdown ─────────────────────────────────────── */
const CustomSelect = ({ label, options, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selected = options.find((o) => o.value === value) || options[0];

    return (
        <div ref={ref} className="relative">
            <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                {label}
            </label>

            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition-all duration-200 bg-slate-50 dark:bg-slate-900 cursor-pointer
                    ${open
                        ? 'border-primary ring-2 ring-primary/20 bg-white dark:border-primary/50'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
            >
                <span className={`truncate ${selected.value ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                    {selected.label}
                </span>
                <ChevronDown
                    size={15}
                    className={`shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${open ? 'rotate-180 text-primary' : ''}`}
                />
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div className="absolute z-200 mt-1.5 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl shadow-slate-200/60 dark:shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-left transition-colors duration-150
                                ${value === opt.value
                                    ? 'bg-primary/8 text-primary font-bold'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/40 font-semibold'
                                }`}
                        >
                            <span>{opt.label}</span>
                            {value === opt.value && <Check size={13} className="shrink-0 text-primary" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ── helper ──────────────────────────────────────────────── */
const isNew = (article) => {
    const date = article?.postDate || article?.createdAt;
    if (!date) return false;
    const now = new Date();
    const post = new Date(date);
    return (now - post) / (1000 * 60 * 60 * 24) <= 2;
};

/* ── Highlight matched keyword in text ───────────────────── */
const HighlightText = ({ text, keyword }) => {
    if (!keyword || !text) return text || null;

    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
        regex.test(part) ? (
            <mark key={i} className="bg-amber-200 dark:bg-amber-500/30 text-inherit rounded-sm px-0.5">
                {part}
            </mark>
        ) : (
            part
        )
    );
};

/* ── FilterStrip ─────────────────────────────────────────── */
const FilterStrip = () => {
    const dispatch = useDispatch();
    const categoryData = useSelector(state => state.categories.data);
    const { results: searchResults, loading: searchLoading, activeFilters } = useSelector(state => state.search);

    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [state, setState] = useState('');
    const [resource, setResource] = useState('');

    useEffect(() => {
        if (!categoryData || categoryData.length === 0) {
            dispatch(fetchCategories());
        }
    }, [dispatch, categoryData]);

    // Build dropdown options dynamically from backend data
    const CATEGORIES = useMemo(() => {
        const sub = categoryData?.find(c => c.type === 'subcategories');
        const items = (sub?.values || []).map(v => ({ label: v, value: v }));
        return [{ label: 'All Streams', value: '' }, ...items];
    }, [categoryData]);

    const STATES = useMemo(() => {
        const loc = categoryData?.find(c => c.type === 'locations');
        const items = (loc?.values || []).map(v => ({ label: v, value: v }));
        return [{ label: 'All States', value: '' }, ...items];
    }, [categoryData]);

    const RESOURCES = useMemo(() => {
        const res = categoryData?.find(c => c.type === 'resources');
        const items = (res?.values || []).map(v => ({ label: v, value: v }));
        return [{ label: 'Select Type', value: '' }, ...items];
    }, [categoryData]);

    const hasFilters = keyword || category || state || resource;

    const clearAll = () => {
        setKeyword(''); setCategory(''); setState(''); setResource('');
        dispatch(clearSearchResults());
    };

    const handleApply = () => {
        const filters = {};
        if (keyword) filters.search = keyword;
        if (category) filters.subCategory = category;
        if (state) filters.location = state;
        if (resource) filters.resourceType = resource;

        if (Object.keys(filters).length > 0) {
            dispatch(fetchSearchResults(filters));
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto px-4 mt-5 mb-2 relative z-30">
            <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 px-6 py-5 backdrop-blur-sm">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <SlidersHorizontal className="text-primary" size={12} />
                        Smart Recruitment Filter
                    </span>
                    {hasFilters && (
                        <button
                            onClick={clearAll}
                            className="flex items-center gap-1 text-[10px] font-bold text-rose-500 hover:text-rose-600 uppercase tracking-widest transition-colors"
                        >
                            <X size={11} /> Clear Filters
                        </button>
                    )}
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">

                    {/* Keyword Search */}
                    <div className="lg:col-span-2">
                        <label className="block text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                            Search Keyword
                        </label>
                        <div className="group flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 gap-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white dark:focus-within:border-primary/50 transition-all duration-200">
                            <Search className="text-slate-500 dark:text-slate-400 group-focus-within:text-primary transition-colors shrink-0" size={16} />
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleApply(); }}
                                placeholder="SSC CGL, Railway, Police..."
                                className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm font-semibold text-slate-700 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400"
                            />
                            {keyword && (
                                <button onClick={() => setKeyword('')} className="text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category */}
                    <CustomSelect
                        label="Category"
                        options={CATEGORIES}
                        value={category}
                        onChange={setCategory}
                    />

                    {/* Location */}
                    <CustomSelect
                        label="Location"
                        options={STATES}
                        value={state}
                        onChange={setState}
                    />

                    {/* Resource Type */}
                    <CustomSelect
                        label="Resource"
                        options={RESOURCES}
                        value={resource}
                        onChange={setResource}
                    />

                    {/* Apply Button */}
                    <button
                        onClick={handleApply}
                        className="group bg-primary hover:bg-primary/90 active:scale-[0.97] text-white font-black text-xs uppercase tracking-widest py-[11px] px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-primary/40"
                    >
                        <Filter size={14} className="group-hover:rotate-12 transition-transform duration-200" />
                        Apply
                    </button>
                </div>
            </div>

            {/* ── Search Results Section (below filter) ──────────── */}
            {activeFilters && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Active Filters Summary */}
                    <div className="flex flex-wrap items-center gap-2 mb-3 ml-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {searchLoading ? 'Searching...' : `${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} found`}
                        </span>
                        {!searchLoading && (keyword || category || state || resource) && (
                            <>
                                <span className="text-slate-300 dark:text-slate-600">|</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Filters:</span>
                                {keyword && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-lg">
                                        <Search size={10} /> "{keyword}"
                                    </span>
                                )}
                                {category && (
                                    <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                                        Category: {category}
                                    </span>
                                )}
                                {state && (
                                    <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg">
                                        Location: {state}
                                    </span>
                                )}
                                {resource && (
                                    <span className="text-[10px] font-bold bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-2.5 py-1 rounded-lg">
                                        Resource: {resource}
                                    </span>
                                )}
                            </>
                        )}
                    </div>

                    {searchLoading ? (
                        <div className="flex items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            <Loader2 className="animate-spin text-primary" size={36} />
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className="space-y-3">
                            {searchResults.map((article) => (
                                <Link
                                    key={article._id}
                                    to={`/${(article.mainCategory || 'news').toLowerCase().replace(/\s+/g, '-')}/${article.slug}`}
                                    className="block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-200 group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        {/* Left content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-1.5 mb-2">
                                                {article.mainCategory && (
                                                    <span className="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-primary/10 text-primary">
                                                        {article.mainCategory}
                                                    </span>
                                                )}
                                                {article.subCategory && (
                                                    <span className="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                        {article.subCategory}
                                                    </span>
                                                )}
                                                {article.location && (
                                                    <span className="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                                        {article.location}
                                                    </span>
                                                )}
                                                {isNew(article) && (
                                                    <span className="bg-green-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">New</span>
                                                )}
                                            </div>
                                            <h3 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors leading-snug">
                                                <HighlightText text={article.title} keyword={keyword} />
                                            </h3>
                                            {article.shortSummary && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                                                    <HighlightText text={article.shortSummary} keyword={keyword} />
                                                </p>
                                            )}
                                        </div>

                                        {/* Right meta */}
                                        <div className="flex items-center gap-4 md:gap-6 shrink-0">
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                                                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                                    {new Date(article.postDate || article.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-wider bg-primary text-white shadow-sm group-hover:shadow-md transition-all whitespace-nowrap">
                                                View
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            <FileX2 size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                            <p className="text-slate-500 font-bold">No results found for your filters.</p>
                            <p className="text-slate-400 text-sm mt-1">Try different keywords or change filter options.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FilterStrip;

