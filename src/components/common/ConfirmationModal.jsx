import React from 'react';
import { OctagonAlert, X, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger" // danger, warning, info
}) => {
    if (!isOpen) return null;

    const themes = {
        danger: {
            icon: Trash2,
            iconClass: "text-red-500 bg-red-100 dark:bg-red-500/10",
            btnVariant: "danger",
        },
        warning: {
            icon: OctagonAlert,
            iconClass: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
            btnVariant: "primary",
        },
        info: {
            icon: OctagonAlert,
            iconClass: "text-primary bg-primary/10",
            btnVariant: "primary",
        }
    };

    const theme = themes[type] || themes.danger;
    const Icon = theme.icon;

    return (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            ></div>
            <div className="relative bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 text-center flex flex-col items-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <X size={18} />
                    </button>

                    <div className={`size-16 rounded-full flex items-center justify-center mb-6 ${theme.iconClass}`}>
                        <Icon size={32} />
                    </div>

                    <h3 className="text-xl font-black text-slate-800 dark:text-white mt-2">{title}</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2">{message}</p>

                    <div className="grid grid-cols-2 gap-3 w-full mt-8">
                        <Button 
                            variant="secondary" 
                            onClick={onClose} 
                            className="w-full py-3.5 text-xs uppercase tracking-widest"
                        >
                            {cancelText}
                        </Button>
                        <Button 
                            variant={theme.btnVariant} 
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }} 
                            className="w-full py-3.5 text-xs uppercase tracking-widest hover:-translate-y-0.5"
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
