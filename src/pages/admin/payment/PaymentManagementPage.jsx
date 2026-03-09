import React, { useState } from 'react';
import { CreditCard, History, Settings } from 'lucide-react';
import ApplicationHistoryPage from './ApplicationHistoryPage';
import PaymentSettingsPage from './PaymentSettingsPage';

const PaymentManagementPage = () => {
    const [activeTab, setActiveTab] = useState('history');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                        <CreditCard className="text-primary" /> Payment By Users
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Manage payment settings and view application history.</p>
                </div>

                {/* Tab Switcher */}
                <div className="flex w-full sm:w-auto items-center p-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60">
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'history'
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        <History size={16} />
                        History
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'settings'
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        <Settings size={16} />
                        Settings
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in duration-300">
                {activeTab === 'history' ? (
                    <ApplicationHistoryPage isComponent={true} />
                ) : (
                    <PaymentSettingsPage isComponent={true} />
                )}
            </div>
        </div>
    );
};

export default PaymentManagementPage;
