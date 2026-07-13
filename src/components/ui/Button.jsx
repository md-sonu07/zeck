import { Loader2 } from 'lucide-react';

const variants = {
    primary:
        'bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20',
    secondary:
        'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20',
    outline:
        'border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/50 hover:text-primary',
    ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700',
    link: 'text-primary hover:underline',
};

const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-md',
    lg: 'px-8 py-3 text-lg',
};

const Button = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon: Icon,
    children,
    className = '',
    ...props
}) => {
    const base = 'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

    return (
        <button
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <Loader2 size={16} className="animate-spin shrink-0" />
            ) : Icon ? (
                <Icon size={16} className="shrink-0" />
            ) : null}
            {children && <span className="leading-none">{children}</span>}
        </button>
    );
};

export default Button;
