import React from 'react';
import AppIcon from './AppIcon';

const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
};

const sizes = {
    xs: 'px-3 py-1.5 text-[10px]',
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
    xl: 'px-9 py-3.5 text-lg',
};

const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
    secondary: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600',
    outline: 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/50 hover:text-primary shadow-sm',
    ghost: 'text-primary hover:bg-primary/5 bg-transparent',
    subtle: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400',
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    loading = false,
    icon,
    fullWidth = false,
    type = 'button',
    ...props
}) => {
    const baseStyles = `
    inline-flex items-center justify-center gap-1.5 rounded-md font-semibold transition-all duration-200
    focus:outline-none cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

    return (
        <button
            type={type}
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (
                <AppIcon name="loader" size={iconSizes[size]} className="animate-spin" />
            ) : (
                <>
                    {icon && <AppIcon name={icon} size={iconSizes[size]} />}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
