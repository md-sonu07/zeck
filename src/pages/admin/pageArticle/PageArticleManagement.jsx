import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Briefcase,
    School,
    GraduationCap,
    FileText,
    CheckCircle,
    BookOpen,
    Key,
    ArrowRight,
    Plus,
    Trash2,
    X,
    Layout,
    Newspaper,
    Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchPageSections, createPageSection, deletePageSection } from '../../../store/thunk/pageSectionThunk';

const defaultSections = [
    { id: '1', title: 'Latest News', path: '/admin/latest-news', iconName: 'Newspaper', color: 'bg-blue-500', description: 'Manage new and recent updates', isDefault: true },
    { id: '2', title: 'Result', path: '/admin/results', iconName: 'CheckCircle', color: 'bg-green-500', description: 'Publish final or preliminary exam results', isDefault: true },
    // { id: '3', title: 'Answer Key', path: '/admin/answer-key', iconName: 'Key', color: 'bg-teal-500', description: 'Upload official answer keys and objections', isDefault: true },
    { id: '4', title: 'Admission', path: '/admin/admission', iconName: 'GraduationCap', color: 'bg-indigo-500', description: 'Update college and entrance admissions', isDefault: true },
    { id: '5', title: 'Admit Card', path: '/admin/admit-card', iconName: 'FileText', color: 'bg-orange-500', description: 'Manage admit cards and exam tickets', isDefault: true },
];

const iconMap = {
    Briefcase, School, GraduationCap, FileText, CheckCircle, BookOpen, Key, Layout, Newspaper
};

const PageArticleManagement = () => {
    const dispatch = useDispatch();
    const { sections: customSections, loading } = useSelector((state) => state.pageSections);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchPageSections());
    }, [dispatch]);

    const handleAddClick = () => {
        setNewTitle('');
        setIsAddModalOpen(true);
    };

    const confirmAdd = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) {
            toast.error('Please enter a section name');
            return;
        }

        const newSection = {
            title: newTitle.trim(),
            path: `/admin/custom/${encodeURIComponent(newTitle.trim())}`,
            iconName: 'Layout',
            color: 'bg-primary',
            description: `Manage content for ${newTitle.trim()}`,
            isDefault: false
        };

        try {
            await dispatch(createPageSection(newSection)).unwrap();
            setIsAddModalOpen(false);
            toast.success('New section created');
        } catch (error) {
            toast.error(error || 'Failed to create section');
        }
    };

    const handleDeleteClick = (e, id) => {
        e.preventDefault();
        setSectionToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (sectionToDelete) {
            try {
                await dispatch(deletePageSection(sectionToDelete)).unwrap();
                setIsDeleteModalOpen(false);
                setSectionToDelete(null);
                toast.success('Section deleted');
            } catch (error) {
                toast.error(error || 'Failed to delete section');
            }
        }
    };

    // Combine hardcoded defaults with backend custom sections
    const allSections = [...defaultSections, ...customSections];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Page Articles</h1>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">Select a section to manage its content and posts.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Create New Page Box */}
                <button
                    onClick={handleAddClick}
                    className="group bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-primary/50 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-center min-h-[160px]"
                >
                    <div className="size-12 rounded-xl bg-white dark:bg-slate-800 text-slate-400 group-hover:text-primary flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300">
                        <Plus size={24} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">
                            Create New Page
                        </h3>
                        <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                            Add a custom section
                        </p>
                    </div>
                </button>

                {allSections.map((section) => {
                    const IconComp = iconMap[section.iconName] || Layout;
                    return (
                        <Link
                            key={section._id || section.id}
                            to={section.path}
                            className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 hover:shadow-md hover:shadow-slate-200/80 dark:hover:border-slate-600 transition-all duration-300 flex flex-col items-start gap-4"
                        >
                            {!section.isDefault && (
                                <button
                                    onClick={(e) => handleDeleteClick(e, section._id)}
                                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100 z-10"
                                    title="Delete section"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}

                            <div className={`size-12 rounded-xl text-white flex items-center justify-center shadow-lg ${section.color} group-hover:scale-110 transition-transform duration-300`}>
                                <IconComp size={24} />
                            </div>

                            <div className="space-y-1.5 w-full">
                                <div className="flex items-center justify-between w-full">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
                                        {section.title}
                                    </h3>
                                    <ArrowRight size={16} className="text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all pr-6 group-hover:pr-0" />
                                </div>
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed max-w-[90%]">
                                    {section.description}
                                </p>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {/* Add Section Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md p-6 m-4 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                                <Plus size={24} className="text-primary" />
                                Add New Field
                            </h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={confirmAdd} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                    Field Name
                                </label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="e.g. Special Updates"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="px-5 py-2.5 text-sm font-bold bg-primary text-white hover:bg-primary-dark rounded-xl shadow-md shadow-primary/20 transition-all active:scale-95">
                                    Create Field
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-sm p-6 m-4 text-center animate-in zoom-in-95 duration-200">
                        <div className="size-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Delete Section?</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                            Are you sure you want to remove this section? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                                Cancel
                            </button>
                            <button onClick={confirmDelete} className="px-6 py-2.5 text-sm font-bold bg-red-500 text-white hover:bg-red-600 rounded-xl shadow-md shadow-red-500/20 transition-all active:scale-95">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="fixed bottom-6 right-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 animate-in slide-in-from-right-10">
                    <Loader2 size={18} className="animate-spin text-primary" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-tight">Syncing with server...</span>
                </div>
            )}

        </div>
    );
};

export default PageArticleManagement;
