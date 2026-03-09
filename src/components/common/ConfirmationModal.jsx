import React from 'react';
import { OctagonAlert, X } from 'lucide-react';

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
            icon: OctagonAlert,
            iconClass: "text-red-500 bg-red-50 dark:bg-red-500/10",
            confirmBtn: "bg-red-500 hover:bg-red-600 shadow-red-500/30",
        },
        warning: {
            icon: OctagonAlert,
            iconClass: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
            confirmBtn: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/30",
        },
        info: {
            icon: OctagonAlert,
            iconClass: "text-primary bg-primary/10",
            confirmBtn: "bg-primary hover:bg-primary/90 shadow-primary/30",
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
            <div className="relative bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
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

                    <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{title}</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">{message}</p>

                    <div className="grid grid-cols-2 gap-3 w-full mt-8">
                        <button
                            onClick={onClose}
                            className="py-3.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`py-3.5 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:-translate-y-0.5 transition-all ${theme.confirmBtn}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
