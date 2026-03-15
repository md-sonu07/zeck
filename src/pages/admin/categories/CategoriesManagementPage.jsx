import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategoryValue, updateCategory } from '../../../store/thunk/categoryThunk';
import {
    Plus, Building2, BookOpen, MapPin, X, LayoutGrid, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const CategoriesManagementPage = () => {
    const dispatch = useDispatch();
    const { data: categories, loading } = useSelector((state) => state.categories);

    // Derived states
    const availableSubs = categories.find(t => t.type === 'subcategories')?.values || [];
    const availableRes = categories.find(t => t.type === 'resources')?.values || [];
    const availableLocs = categories.find(t => t.type === 'locations')?.values || [];

    // Modal State
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null, type: null });

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // --- ACTIONS ---
    const confirmDelete = async () => {
        const { item, type } = deleteModal;
        let endpointType = '';
        let currentValues = [];

        if (type === 'sub') {
            endpointType = 'subcategories';
            currentValues = availableSubs.filter(i => i !== item);
        } else if (type === 'res') {
            endpointType = 'resources';
            currentValues = availableRes.filter(i => i !== item);
        } else if (type === 'loc') {
            endpointType = 'locations';
            currentValues = availableLocs.filter(i => i !== item);
        }

        const loadingToast = toast.loading('Deleting category value...');
        try {
            await dispatch(updateCategory({
                type: endpointType,
                values: currentValues
            })).unwrap();

            toast.success('Category value deleted successfully', { id: loadingToast });
            setDeleteModal({ isOpen: false, item: null, type: null });
        } catch (error) {
            console.error('Error deleting category value:', error);
            toast.error('Failed to delete. Please try again.', { id: loadingToast });
        }
    };

    const handleAddValue = async (type, value, inputRef) => {
        if (!value.trim()) return;

        let endpointType = '';
        if (type === 'sub') endpointType = 'subcategories';
        else if (type === 'res') endpointType = 'resources';
        else if (type === 'loc') endpointType = 'locations';

        const loadingToast = toast.loading('Adding category value...');
        try {
            await dispatch(addCategoryValue({
                type: endpointType,
                value: value.trim()
            })).unwrap();

            toast.success('Category value added successfully', { id: loadingToast });
            inputRef.value = '';
        } catch (error) {
            console.error('Error adding category value:', error);
            toast.error('Failed to add. Maybe it already exists?', { id: loadingToast });
        }
    };

    if (loading && categories.length === 0) return (
        <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                        <LayoutGrid className="text-primary" />
                        Categories Management
                    </h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Configure site structure and post classifications.</p>
                </div>
            </div>

            {/* Registry Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                {[
                    { title: 'Categories', data: availableSubs, type: 'sub', icon: Building2 },
                    { title: 'Resources', data: availableRes, type: 'res', icon: BookOpen },
                    { title: 'Locations', data: availableLocs, type: 'loc', icon: MapPin },
                ].map((section) => (
                    <div key={section.title} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col h-[550px]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl">
                                <section.icon size={20} className="text-primary" />
                            </div>
                            <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-sm">{section.title}</h3>
                        </div>

                        {/* Add Input */}
                        <div className="flex gap-2 mb-6">
                            <input
                                type="text"
                                placeholder={`New ${section.title.slice(0, -1)}...`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddValue(section.type, e.target.value, e.target);
                                    }
                                }}
                                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-semibold outline-none focus:border-primary transition-all text-slate-800 dark:text-white"
                            />
                            <button
                                onClick={(e) => {
                                    const input = e.currentTarget.parentElement.querySelector('input');
                                    handleAddValue(section.type, input.value, input);
                                }}
                                className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        {/* List Area */}
                        <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                            {section.data.length === 0 ? (
                                <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-center text-slate-400 h-full min-h-[120px]">
                                    <span className="text-xs font-bold mb-1">No items found</span>
                                    <span className="text-[10px]">e.g. {section.type === 'sub' ? 'Railway, Defence' : section.type === 'res' ? 'Admit Card, Result' : 'Bihar, UP'}</span>
                                </div>
                            ) : (
                                section.data.map((item) => (
                                    <div key={item} className="group p-3 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-50 dark:border-slate-700 rounded-xl flex items-center justify-between hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all border-dashed">
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item}</span>
                                        <button
                                            onClick={() => setDeleteModal({ isOpen: true, item, type: section.type })}
                                            className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                        onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                    ></div>

                    {/* Modal Card */}
                    <div className="relative bg-white dark:bg-slate-800 w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 p-8 text-center animate-in zoom-in-95 duration-200">
                        <div className="size-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-100 dark:border-red-500/20">
                            <Trash2 size={32} />
                        </div>

                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tight">Confirm Deletion</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 leading-relaxed">
                            Are you sure you want to remove <span className="text-slate-800 dark:text-white font-black underline italic">"{deleteModal.item}"</span> from the database? This action cannot be reversed.
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                                className="py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/30 hover:bg-red-600 hover:-translate-y-0.5 transition-all"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesManagementPage;
