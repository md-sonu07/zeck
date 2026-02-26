import React, { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, Search, Filter, ChevronDown, Check, X } from 'lucide-react';

/* ── Data ────────────────────────────────────────────────── */
const CATEGORIES = [
    { label: 'All Streams', value: '' },
    { label: 'Central Govt', value: 'central' },
    { label: 'State Govt', value: 'state' },
    { label: 'Railway', value: 'railway' },
    { label: 'Defence / Army', value: 'defence' },
    { label: 'Police', value: 'police' },
    { label: 'Banking', value: 'banking' },
];

const STATES = [
    { label: 'All States', value: '' },
    { label: 'Uttar Pradesh', value: 'up' },
    { label: 'Bihar', value: 'bihar' },
    { label: 'Rajasthan', value: 'raj' },
    { label: 'Madhya Pradesh', value: 'mp' },
    { label: 'All India', value: 'all-india' },
];

const RESOURCES = [
    { label: 'Select Type', value: '' },
    { label: 'Latest Jobs', value: 'jobs' },
    { label: 'Admit Card', value: 'admit' },
    { label: 'Result', value: 'result' },
    { label: 'Answer Key', value: 'answer-key' },
];

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

/* ── FilterStrip ─────────────────────────────────────────── */
const FilterStrip = () => {
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [state, setState] = useState('');
    const [resource, setResource] = useState('');

    const hasFilters = keyword || category || state || resource;

    const clearAll = () => { setKeyword(''); setCategory(''); setState(''); setResource(''); };

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
                    <button className="group bg-primary hover:bg-primary/90 active:scale-[0.97] text-white font-black text-xs uppercase tracking-widest py-[11px] px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-primary/40">
                        <Filter size={14} className="group-hover:rotate-12 transition-transform duration-200" />
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterStrip;
