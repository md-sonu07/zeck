import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../store/thunk/categoryThunk';
import { fetchArticles, createArticle, deleteArticle, updateArticle } from '../../../store/thunk/articleThunk';
import { Save, Image as ImageIcon, Link as LinkIcon, Type, X, FileText, List, PlusCircle, ListTree, ChevronDown, Layers, MapPin, AlignLeft, AlignCenter, AlignRight, ListOrdered, Minus, Table, Eraser, Calendar, Clock, Upload, Trash2, MoreVertical, ExternalLink, CheckCircle, CircleDashed, PlayCircle, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../../components/common/ConfirmationModal';

import { Link } from 'react-router-dom';
import slug from 'slug';

const PostManagementPage = ({ categoryTitle }) => {
    const dispatch = useDispatch();
    const { data: categories } = useSelector((state) => state.categories);
    const { items: articles, loading } = useSelector((state) => state.articles);

    const [activeTab, setActiveTab] = useState('manage');
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [editArticleId, setEditArticleId] = useState(null);
    const [articleToDelete, setArticleToDelete] = useState(null);


    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Form state
    const [title, setTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState('');
    const [isResourceDropdownOpen, setIsResourceDropdownOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [ytLink, setYtLink] = useState('');
    const [lastDate, setLastDate] = useState('');
    const [postDate, setPostDate] = useState('');
    const [content, setContent] = useState('');
    const [paymentPrice, setPaymentPrice] = useState('');
    const [paymentDiscountPercent, setPaymentDiscountPercent] = useState('');
    const [submittingAction, setSubmittingAction] = useState(null);
    
    // Derived Taxonomies
    const [availableResources, setAvailableResources] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableLocations, setAvailableLocations] = useState([]);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchArticles({ mainCategory: categoryTitle, includeDrafts: 'true' }));
        setSelectedResource('');
        setCurrentPage(1); // Reset page on category/tab change
    }, [dispatch, categoryTitle]);

    useEffect(() => {
        if (categories.length > 0) {
            setAvailableCategories(categories.find(t => t.type === 'subcategories')?.values || []);
            setAvailableResources(categories.find(t => t.type === 'resources')?.values || []);
            setAvailableLocations(categories.find(t => t.type === 'locations')?.values || []);
        }
    }, [categories]);

    // Fix for Content Editor being blank when editing
    useEffect(() => {
        if (activeTab === 'add' && contentRef.current) {
            if (contentRef.current.innerHTML !== content) {
                contentRef.current.innerHTML = content || '';
            }
        }
    }, [activeTab, editArticleId, content]);

    const contentRef = useRef(null);
    const [activeFormats, setActiveFormats] = useState({});

    // Custom Table Popup State
    const [isTablePopupOpen, setIsTablePopupOpen] = useState(false);
    const [tableRows, setTableRows] = useState(2);
    const [tableCols, setTableCols] = useState(2);

    // Additional Custom Modals State
    const [isResetPopupOpen, setIsResetPopupOpen] = useState(false);
    const [isLinkPopupOpen, setIsLinkPopupOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
    const [editorImageUrl, setEditorImageUrl] = useState('');

    // Header Image Selector State
    const [isHeaderImageSelectorOpen, setIsHeaderImageSelectorOpen] = useState(false);
    const [headerImageTab, setHeaderImageTab] = useState('upload'); // 'upload' or 'link'
    const headerFileRef = useRef(null);

    const [savedSelection, setSavedSelection] = useState(null);

    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            setSavedSelection(selection.getRangeAt(0));
        }
    };

    const restoreSelection = () => {
        if (contentRef.current) {
            contentRef.current.focus();
        }
        if (savedSelection) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(savedSelection);
        }
    };

    const updateFormattingState = () => {
        if (!contentRef.current) return;
        setActiveFormats({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            strikeThrough: document.queryCommandState('strikeThrough'),
            h3: document.queryCommandValue('formatBlock') === 'h3',
            justifyLeft: document.queryCommandState('justifyLeft'),
            justifyCenter: document.queryCommandState('justifyCenter'),
            justifyRight: document.queryCommandState('justifyRight'),
            insertUnorderedList: document.queryCommandState('insertUnorderedList'),
            insertOrderedList: document.queryCommandState('insertOrderedList')
        });
    };

    const handleFormat = (command, value = null) => {
        document.execCommand(command, false, value);
        if (contentRef.current) {
            setContent(contentRef.current.innerHTML);
            contentRef.current.focus();
        }
        updateFormattingState();
    };

    const handleLinkClick = () => {
        saveSelection();
        setLinkUrl('');
        setIsLinkPopupOpen(true);
    };

    const confirmLinkInsert = () => {
        setIsLinkPopupOpen(false);
        restoreSelection();
        if (linkUrl && linkUrl.trim() !== '') {
            let finalUrl = linkUrl;
            if (!/^https?:\/\//i.test(finalUrl)) finalUrl = 'https://' + finalUrl;
            handleFormat('createLink', finalUrl);
        }
    };

    const handleImageClick = () => {
        saveSelection();
        setEditorImageUrl('');
        setIsImagePopupOpen(true);
    };

    const confirmImageInsert = () => {
        setIsImagePopupOpen(false);
        restoreSelection();
        if (editorImageUrl && editorImageUrl.trim() !== '') {
            handleFormat('insertImage', editorImageUrl);
        }
    };

    const handleClearEditor = () => {
        setIsResetPopupOpen(true);
    };

    const confirmClearEditor = () => {
        setIsResetPopupOpen(false);
        if (contentRef.current) {
            contentRef.current.innerHTML = '';
            setContent('');
            updateFormattingState();
        }
    };

    const confirmTableInsert = () => {
        setIsTablePopupOpen(false);
        restoreSelection();

        if (tableRows && tableCols && !isNaN(tableRows) && !isNaN(tableCols)) {
            let tableHTML = '<table class="w-full border-collapse border border-slate-300 dark:border-slate-600 my-4 text-sm text-center bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-sm"><tbody>';
            for (let i = 0; i < parseInt(tableRows); i++) {
                tableHTML += '<tr>';
                for (let j = 0; j < parseInt(tableCols); j++) {
                    const isHeader = i === 0;
                    const cellTag = isHeader ? 'th' : 'td';
                    const cellClasses = isHeader
                        ? 'border border-slate-300 dark:border-slate-600 p-3 bg-slate-100 dark:bg-slate-700/50 font-bold'
                        : 'border border-slate-300 dark:border-slate-600 p-3';
                    tableHTML += `<${cellTag} class="${cellClasses}">${isHeader ? 'Header' : 'Data'}</${cellTag}>`;
                }
                tableHTML += '</tr>';
            }
            tableHTML += '</tbody></table><p><br></p>';
            handleFormat('insertHTML', tableHTML);
        }
    };

    const handleHeaderFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result);
                setIsHeaderImageSelectorOpen(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e, saveAsDraft = false) => {
        e.preventDefault();

        const finalContent = contentRef.current ? contentRef.current.innerHTML : content;

        if (!saveAsDraft) {
            if (!finalContent || finalContent.trim() === '' || finalContent === '<br>') {
                toast.error('Content Editor cannot be empty.');
                return;
            }

            if (!selectedCategory) {
                toast.error('Please select a Sub Category.');
                return;
            }

            if (!selectedResource) {
                toast.error('Please select a Resource.');
                return;
            }

            if (!selectedLocation) {
                toast.error('Please select a Location.');
                return;
            }
        }

        setSubmittingAction(saveAsDraft ? 'draft' : 'publish');

        const postData = {
            title,
            mainCategory: categoryTitle, // Admin section category
            subCategory: selectedCategory,
            resourceType: selectedResource,
            location: selectedLocation,
            shortSummary: description,
            content: finalContent,
            imageUrl,
            ytLink,
            postDate: postDate || new Date(),
            lastDate: lastDate || null,
            paymentPrice: paymentPrice && !isNaN(paymentPrice) ? Number(paymentPrice) : undefined,
            paymentDiscountPercent: paymentDiscountPercent && !isNaN(paymentDiscountPercent) ? Number(paymentDiscountPercent) : 0,
            isDraft: saveAsDraft
        };

        try {
            if (editArticleId) {
                await dispatch(updateArticle({ id: editArticleId, articleData: postData })).unwrap();
                toast.success(saveAsDraft ? 'Draft saved!' : 'Successfully updated post!');
            } else {
                await dispatch(createArticle(postData)).unwrap();
                toast.success(saveAsDraft ? 'Draft saved!' : 'Successfully added post!');
            }

            // Reset form
            setTitle('');
            setSelectedCategory('');
            setSelectedResource('');
            setSelectedLocation('');
            setLastDate('');
            setPostDate('');
            setDescription('');
            setImageUrl('');
            setYtLink('');
            setPaymentPrice('');
            setPaymentDiscountPercent('');
            setContent('');
            setEditArticleId(null);
            if (contentRef.current) {
                contentRef.current.innerHTML = '';
            }
            setActiveTab('manage');
            dispatch(fetchArticles({ mainCategory: categoryTitle, includeDrafts: 'true' }));
        } catch (error) {
            console.error('Error saving post:', error);
            const msg = typeof error === 'string' ? error : (error?.message || 'Failed to save post.');
            if (msg.includes('validation failed')) {
                toast.error('Please fill out all required fields.');
            } else {
                toast.error(msg);
            }
        } finally {
            setSubmittingAction(null);
        }
    };

    const handleEditArticle = (e, art) => {
        e.stopPropagation();
        setEditArticleId(art._id);
        setTitle(art.title || '');
        setSelectedCategory(art.subCategory || '');
        setSelectedResource(art.resourceType || '');
        setSelectedLocation(art.location || '');
        setDescription(art.shortSummary || '');
        setImageUrl(art.imageUrl || '');
        setYtLink(art.ytLink || '');
        setPaymentPrice(art.paymentPrice || '');
        setPaymentDiscountPercent(art.paymentDiscountPercent || '');
        setContent(art.content || '');
        setPostDate(art.postDate ? new Date(art.postDate).toISOString().split('T')[0] : '');
        setLastDate(art.lastDate ? new Date(art.lastDate).toISOString().split('T')[0] : '');
        setActiveTab('add');
        setOpenDropdownId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const confirmDeleteArticle = async () => {
        if (!articleToDelete) return;
        const loadingToast = toast.loading('Deleting article...');
        try {
            await dispatch(deleteArticle(articleToDelete)).unwrap();
            toast.success('Article deleted successfully', { id: loadingToast });
            setOpenDropdownId(null);
        } catch (error) {
            console.error('Error deleting:', error);
            toast.error(error || 'Failed to delete article', { id: loadingToast });
        } finally {
            setArticleToDelete(null);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const loadingToast = toast.loading('Updating status...');
        try {
            await dispatch(updateArticle({ id, articleData: { status: newStatus } })).unwrap();
            toast.success('Status updated successfully', { id: loadingToast });
            setOpenDropdownId(null);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(error || 'Failed to update status', { id: loadingToast });
        }
    };

    // Pagination Calculation
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentArticles = articles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(articles.length / itemsPerPage);

    return (
        <div className="space-y-6">
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{categoryTitle}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Manage and create entries for the {categoryTitle} section.</p>
                </div>

                {/* Tab Switcher */}
                <div className="flex w-full sm:w-auto items-center p-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60">
                    <button
                        onClick={() => setActiveTab('manage')}
                        className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'manage'
                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        <List size={16} />
                        Manage View
                    </button>
                    <button
                        onClick={() => setActiveTab('add')}
                        className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${activeTab === 'add'
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        <PlusCircle size={16} />
                        Add New
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {activeTab === 'add' ? (
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">

                        <div className="space-y-6">
                            {/* Title Section - Prominent at the top */}
                            <div className="space-y-2 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <label className="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                                    <Type size={18} className="text-primary" />
                                    Post Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder={`Enter ${categoryTitle} title...`}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-5 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-xl font-bold text-slate-800 dark:text-white transition-all shadow-sm"
                                />
                            </div>

                            {/* Summary & Media Section - Sequential Workflow */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Short Summary Section */}
                                <div className="space-y-2 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <label className="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                                        <AlignLeft size={18} className="text-primary" />
                                        Short Summary <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        required
                                        rows="4"
                                        placeholder={`Quick summary for the card view...`}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-5 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-medium text-slate-700 dark:text-slate-200 resize-none transition-all shadow-sm leading-relaxed"
                                    />
                                </div>

                                {/* Banner Selection Part - Redesigned for Premium Look */}
                                <div className="space-y-2 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                                            <ImageIcon size={18} className="text-primary" />
                                            Banner Media
                                        </label>
                                        {imageUrl && (
                                            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-green-500/20">
                                                <div className="size-1 bg-green-500 rounded-full animate-pulse"></div>
                                                Live Asset
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col md:flex-row items-center gap-6">
                                        <div className="w-full md:w-40 h-28 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center group relative shrink-0 transition-all hover:border-primary/50">
                                            {imageUrl ? (
                                                <>
                                                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                        <button type="button" onClick={() => setIsHeaderImageSelectorOpen(true)} className="p-2.5 bg-white rounded-xl text-slate-900 shadow-2xl scale-90 group-hover:scale-100 transition-all duration-300">
                                                            <Upload size={18} />
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <button type="button" onClick={() => setIsHeaderImageSelectorOpen(true)} className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-primary transition-all bg-slate-50/50 dark:bg-slate-900/30">
                                                    <div className="size-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                                                        <PlusCircle size={20} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Media</span>
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">
                                                * High-resolution landscapes work best. This will be the first thing your readers see.
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsHeaderImageSelectorOpen(true)}
                                                    className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-slate-700 dark:text-slate-200 hover:border-primary hover:text-primary transition-all shadow-sm flex items-center gap-2 group"
                                                >
                                                    <ImageIcon size={14} className="group-hover:rotate-12 transition-transform" />
                                                    {imageUrl ? 'Modify Banner' : 'Browse Gallery'}
                                                </button>
                                                {imageUrl && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setImageUrl('')}
                                                        className="size-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-red-500 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shadow-sm group"
                                                    >
                                                        <X size={16} className="group-hover:rotate-90 transition-transform" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Left Column: Rich Content Editor (Priority) */}
                                <div className="lg:col-span-8 flex flex-col h-full space-y-6">
                                    {/* Categorization Ribbon */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        {/* Category Select */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                <ListTree size={14} className="text-orange-500" />
                                                Sub Category <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                    className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border ${isDropdownOpen ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:outline-none flex items-center justify-between transition-all group shadow-sm text-sm`}
                                                >
                                                    <span className={`font-semibold ${selectedCategory ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                                                        {selectedCategory ? (availableCategories.find(c => c.toLowerCase() === selectedCategory.toLowerCase()) || selectedCategory) : 'Select...'}
                                                    </span>
                                                    <ChevronDown size={16} className={`text-slate-400 group-hover:text-orange-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-orange-500' : ''}`} />
                                                </button>

                                                {isDropdownOpen && (
                                                    <>
                                                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                                                        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                                            {availableCategories.map((cat, i) => {
                                                                const isSelected = selectedCategory === cat.toLowerCase();
                                                                return (
                                                                    <button
                                                                        key={i}
                                                                        type="button"
                                                                        onClick={() => { setSelectedCategory(cat.toLowerCase()); setIsDropdownOpen(false); }}
                                                                        className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors flex items-center justify-between ${isSelected ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                                                    >
                                                                        <span>{cat}</span>
                                                                        {isSelected && <span className="text-orange-500">✓</span>}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Resource Select */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                <Layers size={14} className="text-violet-500" />
                                                Resource <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsResourceDropdownOpen(!isResourceDropdownOpen)}
                                                    className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border ${isResourceDropdownOpen ? 'border-violet-500 ring-1 ring-violet-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:outline-none flex items-center justify-between transition-all group shadow-sm text-sm`}
                                                >
                                                    <span className={`font-semibold ${selectedResource ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                                                        {selectedResource ? (availableResources.find(c => c.toLowerCase() === selectedResource.toLowerCase()) || selectedResource) : 'Select...'}
                                                    </span>
                                                    <ChevronDown size={16} className={`text-slate-400 group-hover:text-violet-500 transition-transform duration-300 ${isResourceDropdownOpen ? 'rotate-180 text-violet-500' : ''}`} />
                                                </button>

                                                {isResourceDropdownOpen && (
                                                    <>
                                                        <div className="fixed inset-0 z-10" onClick={() => setIsResourceDropdownOpen(false)}></div>
                                                        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                                            {availableResources.map((res, i) => {
                                                                const isSelected = selectedResource === res.toLowerCase();
                                                                return (
                                                                    <button
                                                                        key={i}
                                                                        type="button"
                                                                        onClick={() => { setSelectedResource(res.toLowerCase()); setIsResourceDropdownOpen(false); }}
                                                                        className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors flex items-center justify-between ${isSelected ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                                                    >
                                                                        <span>{res}</span>
                                                                        {isSelected && <span className="text-violet-500">✓</span>}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Location Select */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                                <MapPin size={14} className="text-teal-500" />
                                                Location <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                                                    className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border ${isLocationDropdownOpen ? 'border-teal-50 ring-1 ring-teal-500' : 'border-slate-200 dark:border-slate-700'} rounded-xl focus:outline-none flex items-center justify-between transition-all group shadow-sm text-sm`}
                                                >
                                                    <span className={`font-semibold ${selectedLocation ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                                                        {selectedLocation ? (availableLocations.find(c => c.toLowerCase() === selectedLocation.toLowerCase()) || selectedLocation) : 'Select...'}
                                                    </span>
                                                    <ChevronDown size={16} className={`text-slate-400 group-hover:text-teal-500 transition-transform duration-300 ${isLocationDropdownOpen ? 'rotate-180 text-teal-500' : ''}`} />
                                                </button>

                                                {isLocationDropdownOpen && (
                                                    <>
                                                        <div className="fixed inset-0 z-10" onClick={() => setIsLocationDropdownOpen(false)}></div>
                                                        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                                            <div className="max-h-52 overflow-y-auto custom-scrollbar">
                                                                {availableLocations.map((loc, i) => {
                                                                    const isSelected = selectedLocation === loc.toLowerCase();
                                                                    return (
                                                                        <button
                                                                            key={i}
                                                                            type="button"
                                                                            onClick={() => { setSelectedLocation(loc.toLowerCase()); setIsLocationDropdownOpen(false); }}
                                                                            className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors flex items-center justify-between ${isSelected ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                                                        >
                                                                            <span>{loc}</span>
                                                                            {isSelected && <span className="text-teal-500">✓</span>}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 flex-1 flex flex-col">
                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                            <FileText size={16} className="text-green-500" />
                                            Content Editor <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative flex-1 flex flex-col">
                                            {/* Lightweight Editor Toolbar */}
                                            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-100 dark:bg-slate-800 border-x border-t border-slate-200 dark:border-slate-700 rounded-t-xl shrink-0">
                                                {[
                                                    { label: 'B', command: 'bold', style: <b>B</b> },
                                                    { label: 'I', command: 'italic', style: <i>I</i> },
                                                    { label: 'U', command: 'underline', style: <u>U</u> },
                                                    { label: 'S', command: 'strikeThrough', style: <s>S</s> }
                                                ].map((btn, i) => {
                                                    const isActive = activeFormats[btn.command];
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={i}
                                                            onMouseDown={(e) => {
                                                                e.preventDefault();
                                                                handleFormat(btn.command);
                                                            }}
                                                            className={`size-8 flex items-center justify-center font-bold rounded-md transition-colors ${isActive ? 'bg-green-500 text-white shadow-sm shadow-green-500/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                                            title={btn.label}
                                                        >
                                                            {btn.style}
                                                        </button>
                                                    );
                                                })}
                                                <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                                                {[
                                                    { label: 'Align Left', command: 'justifyLeft', icon: <AlignLeft size={16} /> },
                                                    { label: 'Align Center', command: 'justifyCenter', icon: <AlignCenter size={16} /> },
                                                    { label: 'Align Right', command: 'justifyRight', icon: <AlignRight size={16} /> }
                                                ].map((btn, i) => {
                                                    const isActive = activeFormats[btn.command];
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={`align-${i}`}
                                                            onMouseDown={(e) => { e.preventDefault(); handleFormat(btn.command); }}
                                                            className={`size-8 flex items-center justify-center rounded-md transition-colors ${isActive ? 'bg-green-500 text-white shadow-sm shadow-green-500/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                                            title={btn.label}
                                                        >
                                                            {btn.icon}
                                                        </button>
                                                    );
                                                })}
                                                <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                                                {[
                                                    { label: 'Bullet List', command: 'insertUnorderedList', icon: <List size={16} /> },
                                                    { label: 'Number List', command: 'insertOrderedList', icon: <ListOrdered size={16} /> }
                                                ].map((btn, i) => {
                                                    const isActive = activeFormats[btn.command];
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={`list-${i}`}
                                                            onMouseDown={(e) => { e.preventDefault(); handleFormat(btn.command); }}
                                                            className={`size-8 flex items-center justify-center rounded-md transition-colors ${isActive ? 'bg-green-500 text-white shadow-sm shadow-green-500/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                                            title={btn.label}
                                                        >
                                                            {btn.icon}
                                                        </button>
                                                    );
                                                })}
                                                <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                                                <button
                                                    type="button"
                                                    onMouseDown={(e) => { e.preventDefault(); handleFormat('insertHorizontalRule'); }}
                                                    className="size-8 flex items-center justify-center rounded-md transition-colors text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                                    title="Page Divider (Horizontal Rule)"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                                                <button
                                                    type="button"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        handleFormat('formatBlock', 'H3');
                                                    }}
                                                    className={`px-2 h-8 text-xs font-bold font-mono rounded-md transition-colors ${activeFormats['h3'] ? 'bg-green-500 text-white shadow-sm shadow-green-500/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                                                    title="Heading 3"
                                                >
                                                    H3
                                                </button>
                                                <button
                                                    type="button"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        saveSelection();
                                                        setIsTablePopupOpen(true);
                                                    }}
                                                    className="size-8 flex items-center justify-center rounded-md transition-colors text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 mx-1"
                                                    title="Insert Table"
                                                >
                                                    <Table size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        handleImageClick();
                                                    }}
                                                    className="px-2 h-8 text-xs font-bold font-mono text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1 mx-1"
                                                    title="Insert Image"
                                                >
                                                    <ImageIcon size={14} />
                                                    <span className="mt-[2px]">IMG</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        handleLinkClick();
                                                    }}
                                                    className="px-2 h-8 text-xs font-bold font-mono text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                                                    title="Hyperlink"
                                                >
                                                    Link
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleClearEditor}
                                                    className="ml-auto px-2 h-8 text-xs font-bold font-mono text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors flex items-center gap-1"
                                                    title="Clear Editor Content"
                                                >
                                                    <Eraser size={14} />
                                                    Reset
                                                </button>
                                            </div>

                                            <div
                                                ref={contentRef}
                                                contentEditable={true}
                                                suppressContentEditableWarning={true}
                                                onInput={(e) => setContent(e.currentTarget.innerHTML)}
                                                onMouseUp={updateFormattingState}
                                                onKeyUp={updateFormattingState}
                                                className="w-full flex-1 min-h-[400px] px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-b-xl focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-slate-800 dark:text-white transition-all text-lg leading-relaxed overflow-y-auto [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:my-3 [&_a]:text-primary [&_a]:underline"
                                                style={{ outline: "none" }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Sidebar Settings */}
                                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                                    {/* Timeline Card */}
                                    <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                        <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Clock size={14} className="text-blue-500" /> Date & Timeline
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Post Date</label>
                                                <input
                                                    type="date"
                                                    value={postDate}
                                                    onChange={(e) => setPostDate(e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm font-bold text-slate-700 dark:text-slate-200"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Last Date</label>
                                                <input
                                                    type="date"
                                                    value={lastDate}
                                                    onChange={(e) => setLastDate(e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all text-sm font-bold text-slate-700 dark:text-slate-200"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar Extras */}
                                    <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
                                        <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Layers size={14} className="text-violet-500" /> Embedded Media
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-red-500 uppercase tracking-widest pl-1 flex items-center gap-1">
                                                    <LinkIcon size={12} /> YouTube Video Link
                                                </label>
                                                <input
                                                    type="url"
                                                    placeholder="https://youtube.com/..."
                                                    value={ytLink}
                                                    onChange={(e) => setYtLink(e.target.value)}
                                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all text-xs font-semibold"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Section */}
                                    <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
                                        <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <span className="text-emerald-500 font-bold">₹</span> Payment & Pricing
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-2">
                                                <div className="space-y-1.5 flex-1">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Base Price (₹)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="e.g. 220"
                                                        value={paymentPrice}
                                                        onChange={(e) => setPaymentPrice(e.target.value)}
                                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-xs font-semibold"
                                                    />
                                                </div>
                                                <div className="space-y-1.5 flex-1">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Discount (%)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="e.g. 10"
                                                        value={paymentDiscountPercent}
                                                        onChange={(e) => setPaymentDiscountPercent(e.target.value)}
                                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                                                    />
                                                </div>
                                            </div>

                                            {/* Preview Calculated Final Price */}
                                            {paymentPrice && paymentDiscountPercent && Number(paymentDiscountPercent) > 0 && Number(paymentPrice) > 0 && (
                                                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                                                    <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Final Price:</span>
                                                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                                                        ₹{Math.round(Number(paymentPrice) - (Number(paymentPrice) * (Number(paymentDiscountPercent) / 100)))}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={(e) => handleSubmit(e, true)}
                                disabled={submittingAction !== null}
                                className={`flex items-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 font-black rounded-2xl transition-all active:scale-95 uppercase tracking-widest text-xs border border-slate-200 dark:border-slate-600 ${submittingAction !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {submittingAction === 'draft' ? (
                                    <CircleDashed size={18} className="animate-spin" />
                                ) : (
                                    <FileText size={18} />
                                )}
                                {submittingAction === 'draft' ? 'Saving...' : 'Save as Draft'}
                            </button>
                            <button
                                type="submit"
                                disabled={submittingAction !== null}
                                className={`flex items-center gap-2 px-10 py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl shadow-xl shadow-primary/30 transition-all ${submittingAction !== null ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 active:scale-95'} uppercase tracking-widest text-xs`}
                            >
                                {submittingAction === 'publish' ? (
                                    <CircleDashed size={18} className="animate-spin" />
                                ) : (
                                    <Save size={18} />
                                )}
                                {submittingAction === 'publish' 
                                    ? (editArticleId ? 'Updating...' : 'Publishing...') 
                                    : `${editArticleId ? 'Update' : 'Publish'} ${categoryTitle} Post`
                                }
                            </button>
                        </div>

                    </form>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/60 animate-in fade-in zoom-in-95 duration-200">
                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : articles.length > 0 ? (
                        <>
                            <div className="overflow-x-auto min-h-[600px] pb-24 custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Title</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Setup</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Pricing</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Location</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                                        {currentArticles.map((art) => (
                                            <tr
                                                key={art._id}
                                                className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-all group border-dashed relative cursor-pointer"
                                                onClick={() => window.open(`/${slug(art.mainCategory, { lower: true })}/${art.slug || art._id}`, '_blank')}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {art.status === 'Completed' ? (
                                                            <CheckCircle size={14} className="text-green-500" />
                                                        ) : art.status === 'Started' ? (
                                                            <PlayCircle size={14} className="text-blue-500" />
                                                        ) : art.status === 'Data Expand' ? (
                                                            <CircleDashed size={14} className="text-purple-500" />
                                                        ) : (
                                                            <CircleDashed size={14} className="text-slate-400" />
                                                        )}
                                                        <div className="font-bold text-slate-800 dark:text-white leading-tight">{art.title}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{new Date(art.createdAt).toLocaleDateString()}</div>
                                                        {art.isDraft && (
                                                            <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                                                                Draft
                                                            </span>
                                                        )}
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm ${art.status === 'Completed' ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400' :
                                                            art.status === 'Started' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' :
                                                                art.status === 'Data Expand' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400' :
                                                                    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                            }`}>
                                                            {art.status || 'New'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-black text-orange-500 uppercase">{art.subCategory}</span>
                                                        <span className="text-[10px] font-black text-blue-500 uppercase">{art.resourceType}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        {art.paymentPrice ? (
                                                            <>
                                                                <span className="text-[13px] font-black text-slate-800 dark:text-white">
                                                                    ₹{art.paymentDiscountPercent ? Math.round(Number(art.paymentPrice) - (Number(art.paymentPrice) * (Number(art.paymentDiscountPercent) / 100))) : art.paymentPrice}
                                                                </span>
                                                                {art.paymentDiscountPercent && art.paymentDiscountPercent > 0 ? (
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-[11px] font-bold text-slate-400 line-through decoration-slate-400">
                                                                            ₹{art.paymentPrice}
                                                                        </span>
                                                                        <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1 rounded-sm">
                                                                            -{art.paymentDiscountPercent}%
                                                                        </span>
                                                                    </div>
                                                                ) : null}
                                                            </>
                                                        ) : (
                                                            <span className="inline-block w-max text-[9px] font-black text-slate-500 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-sm uppercase tracking-widest">
                                                                Free
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400">
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin size={12} className="text-emerald-500" />
                                                        {art.location}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right static md:relative">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={(e) => handleEditArticle(e, art)}
                                                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all"
                                                            title="Edit Article"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenDropdownId(openDropdownId === art._id ? null : art._id);
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                                                        >
                                                            <MoreVertical size={16} />
                                                        </button>
                                                    </div>

                                                    {/* Actions Dropdown */}
                                                    {openDropdownId === art._id && (
                                                        <>
                                                            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); }}></div>
                                                            <div
                                                                className="absolute right-6 top-16 md:top-12 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <div className="p-1 space-y-0.5 relative z-50">
                                                                    <Link
                                                                        to={`/${slug(art.mainCategory, { lower: true })}/${art.slug || art._id}`}
                                                                        target="_blank"
                                                                        className="flex items-center gap-2 w-full px-3 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                                                                    >
                                                                        <ExternalLink size={14} className="text-slate-400" />
                                                                        View Article
                                                                    </Link>
                                                                    <div className="h-px bg-slate-100 dark:bg-slate-700/50 my-1"></div>
                                                                    <div className="px-3 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Set Status</div>
                                                                    {['New', 'Started', 'Data Expand', 'Completed'].map((statusOption) => (
                                                                        <button
                                                                            key={statusOption}
                                                                            onClick={() => handleStatusChange(art._id, statusOption)}
                                                                            className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-bold rounded-lg transition-colors ${art.status === statusOption
                                                                                ? 'bg-primary/10 text-primary'
                                                                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                                                                }`}
                                                                        >
                                                                            <div className={`size-1.5 rounded-full ${statusOption === 'Completed' ? 'bg-green-500' :
                                                                                statusOption === 'Started' ? 'bg-blue-500' :
                                                                                    statusOption === 'Data Expand' ? 'bg-purple-500' :
                                                                                        'bg-slate-400'
                                                                                }`}></div>
                                                                            {statusOption}
                                                                        </button>
                                                                    ))}
                                                                    <div className="h-px bg-slate-100 dark:bg-slate-700/50 my-1"></div>
                                                                    <button
                                                                        onClick={() => setArticleToDelete(art._id)}
                                                                        className="flex items-center gap-2 w-full px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        Showing <span className="font-bold text-slate-800 dark:text-white">{indexOfFirstItem + 1}</span> to <span className="font-bold text-slate-800 dark:text-white">{Math.min(indexOfLastItem, articles.length)}</span> of <span className="font-bold text-slate-800 dark:text-white">{articles.length}</span> Entries
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>

                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`size-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${currentPage === i + 1
                                                    ? 'bg-primary text-white shadow-sm shadow-primary/30'
                                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-12 text-center flex flex-col items-center justify-center">
                            <div className="size-20 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-700">
                                <FileText size={32} className="text-slate-400" />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">No {categoryTitle} Posts Yet</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto mb-6">
                                There are currently no posts in the {categoryTitle} section. Click "Add New" to create your first post.
                            </p>
                            <button
                                onClick={() => setActiveTab('add')}
                                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                            >
                                <PlusCircle size={18} />
                                Create First {categoryTitle} Post
                            </button>
                        </div>
                    )}
                </div>
            )
            }

            {/* Custom Table Popup Modal */}
            {
                isTablePopupOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Table size={18} className="text-primary" />
                                    Insert Table
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsTablePopupOpen(false)}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Number of Rows</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={tableRows}
                                        onChange={(e) => setTableRows(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-800 dark:text-white transition-all text-sm font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Number of Columns</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={tableCols}
                                        onChange={(e) => setTableCols(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-800 dark:text-white transition-all text-sm font-bold"
                                    />
                                </div>
                            </div>
                            <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
                                <button
                                    type="button"
                                    onClick={() => setIsTablePopupOpen(false)}
                                    className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmTableInsert}
                                    className="px-5 py-2.5 text-sm font-bold bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5"
                                >
                                    Insert Table
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Custom Link Popup Modal */}
            {
                isLinkPopupOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <LinkIcon size={18} className="text-primary" />
                                    Insert Link
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsLinkPopupOpen(false)}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">URL destination</label>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    autoFocus
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-800 dark:text-white transition-all text-sm font-bold"
                                />
                            </div>
                            <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
                                <button
                                    type="button"
                                    onClick={() => setIsLinkPopupOpen(false)}
                                    className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmLinkInsert}
                                    className="px-5 py-2.5 text-sm font-bold bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/30 transition-all"
                                >
                                    Insert
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Custom Image Popup Modal */}
            {
                isImagePopupOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <ImageIcon size={18} className="text-blue-500" />
                                    Insert Image Address
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsImagePopupOpen(false)}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Image Source URL</label>
                                <input
                                    type="url"
                                    placeholder="https://domain.com/image.png"
                                    value={editorImageUrl}
                                    onChange={(e) => setEditorImageUrl(e.target.value)}
                                    autoFocus
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-white transition-all text-sm font-bold"
                                />
                            </div>
                            <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
                                <button
                                    type="button"
                                    onClick={() => setIsImagePopupOpen(false)}
                                    className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmImageInsert}
                                    className="px-5 py-2.5 text-sm font-bold bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                                >
                                    Insert Picture
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Custom Reset Confirmation Modal */}
            {
                isResetPopupOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-red-200 dark:border-red-900/50 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700 bg-red-50 dark:bg-red-900/10">
                                <h3 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                                    <Eraser size={18} />
                                    Clear Editor?
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                                    Are you sure you want to completely erase the current content? You will lose any unsaved formatting or text.
                                </p>
                            </div>
                            <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
                                <button
                                    type="button"
                                    onClick={() => setIsResetPopupOpen(false)}
                                    className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                >
                                    Keep Writing
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmClearEditor}
                                    className="px-5 py-2.5 text-sm font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/30 transition-all hover:-translate-y-0.5"
                                >
                                    Yes, Clear It
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Premium Header Image Selector Modal */}
            {
                isHeaderImageSelectorOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsHeaderImageSelectorOpen(false)}></div>

                        <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] border border-white/20 dark:border-slate-700/50 w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                            {/* Compact Header Section */}
                            <div className="px-8 pt-8 pb-4">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                            <div className="size-8 bg-primary/10 rounded-xl flex items-center justify-center">
                                                <ImageIcon size={16} className="text-primary" />
                                            </div>
                                            Post Banner
                                        </h3>
                                        <p className="text-[11px] text-slate-500 font-medium pl-10">Choose your post media</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsHeaderImageSelectorOpen(false)}
                                        className="size-10 bg-slate-50 dark:bg-slate-700/40 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-all active:scale-90"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Compact Tab Switcher */}
                                <div className="p-1 bg-slate-100/50 dark:bg-slate-900/50 rounded-xl flex gap-1">
                                    {[
                                        { id: 'upload', label: 'Upload', icon: <Upload size={12} /> },
                                        { id: 'link', label: 'URL Link', icon: <LinkIcon size={12} /> }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setHeaderImageTab(tab.id)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${headerImageTab === tab.id
                                                ? 'bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-slate-200/50'
                                                : 'text-slate-500 hover:text-slate-700'
                                                }`}
                                        >
                                            {tab.icon}
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="px-8 pb-8 space-y-6">
                                {headerImageTab === 'upload' ? (
                                    <div className="space-y-6">
                                        <input
                                            type="file"
                                            ref={headerFileRef}
                                            onChange={handleHeaderFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <div
                                            onClick={() => headerFileRef.current.click()}
                                            className="group cursor-pointer relative"
                                        >
                                            <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-violet-500/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                                            <div className="relative p-8 bg-slate-50 dark:bg-slate-900/50 rounded-4xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center transition-all group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:border-primary/40">
                                                <div className="size-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-md border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
                                                    <Upload size={24} className="text-primary" />
                                                </div>
                                                <h4 className="text-base font-black text-slate-900 dark:text-white mb-1">Upload Media</h4>
                                                <p className="text-[11px] text-slate-500 font-medium">PNG, JPG or WebP (Max 5MB)</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">Media Web Address</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                                    <LinkIcon size={16} className="text-slate-400 group-focus-within:text-primary transition-colors" />
                                                </div>
                                                <input
                                                    type="url"
                                                    placeholder="Paste image link here..."
                                                    value={imageUrl}
                                                    onChange={(e) => setImageUrl(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-xs font-semibold"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Live Preview Section */}
                                {imageUrl && (
                                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2 flex items-center gap-2">
                                            <div className="size-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                            Media Preview
                                        </label>
                                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner group">
                                            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => setImageUrl('')}
                                                className="absolute top-2 right-2 size-8 bg-black/50 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-red-500 transition-all active:scale-90"
                                            >
                                                <Eraser size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsHeaderImageSelectorOpen(false)}
                                        className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
                                    >
                                        {imageUrl ? 'Confirm' : 'Cancel'}
                                    </button>
                                    {imageUrl && (
                                        <button
                                            type="button"
                                            onClick={() => setImageUrl('')}
                                            className="px-6 bg-slate-100 dark:bg-slate-700/50 text-slate-500 rounded-2xl hover:text-red-500 transition-colors"
                                        >
                                            <Eraser size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Confirmation Modals */}
            <ConfirmationModal
                isOpen={!!articleToDelete}
                onClose={() => setArticleToDelete(null)}
                onConfirm={confirmDeleteArticle}
                title="Delete Article"
                message="Are you sure you want to delete this article? This action cannot be undone."
                confirmText="Delete"
                type="danger"
            />

            <ConfirmationModal
                isOpen={isResetPopupOpen}
                onClose={() => setIsResetPopupOpen(false)}
                onConfirm={confirmClearEditor}
                title="Clear Editor Content"
                message="This will completely wipe all the content you've written. Are you sure you want to reset?"
                confirmText="Reset Now"
                type="warning"
            />
        </div>
    );
};

export default PostManagementPage;
