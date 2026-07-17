import React from 'react';

const Input = ({ label, required, size = 'default', className = '', ...props }) => {
    const isSmall = size === 'sm';
    
    return (
        <div className="w-full">
            {label && (
                <label className={`block font-bold text-slate-700 dark:text-slate-300 ml-1 mb-1.5 ${isSmall ? 'text-[11px]' : 'text-xs uppercase tracking-wider'}`}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                className={`w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 dark:text-white font-medium transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-slate-300 dark:hover:border-slate-600 ${
                    isSmall ? 'px-3 py-2 rounded-md text-sm' : 'px-4 py-3 rounded-xl'
                } ${className}`}
                required={required}
                {...props}
            />
        </div>
    );
};

export default Input;
