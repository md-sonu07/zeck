import React from 'react';

const Select = ({ label, required, size = 'default', options = [], className = '', children, ...props }) => {
    const isSmall = size === 'sm';
    
    return (
        <div className="w-full relative">
            {label && (
                <label className={`block font-bold text-slate-700 dark:text-slate-300 ml-1 mb-1.5 ${isSmall ? 'text-[11px]' : 'text-xs uppercase tracking-wider'}`}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                className={`w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 dark:text-white font-medium transition-all shadow-sm hover:border-slate-300 dark:hover:border-slate-600 appearance-none ${
                    isSmall ? 'px-3 py-2 rounded-md text-sm' : 'px-4 py-3 rounded-xl'
                } ${className}`}
                required={required}
                {...props}
            >
                {children || options.map((opt, i) => (
                    <option key={i} value={opt.value || opt}>{opt.label || opt}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-6 text-slate-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    );
};

export default Select;
