import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, FileText, PlusCircle, Upload, X, Trash2, Edit, Search, Download, Loader2, ChevronLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import TabButton from '../../../components/ui/TabButton';
import PopupModel from '../../../components/ui/PopupModel';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import { fetchAdmitCardPageById } from '../../../store/thunk/admitCardPageThunk';
import {
    fetchAdmitCardsByPage,
    createAdmitCard,
    updateAdmitCard,
    deleteAdmitCard,
    bulkCreateAdmitCards
} from '../../../store/thunk/admitCardThunk';

const AdmitCardsManagement = () => {
    const { pageId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentPage } = useSelector((state) => state.admitCardPages);
    const { cards, loading } = useSelector((state) => state.admitCards);

    const [activeTab, setActiveTab] = useState('manage');
    const [editingId, setEditingId] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [saving, setSaving] = useState(false);
    const [viewingCard, setViewingCard] = useState(null);

    const [collegeName, setCollegeName] = useState('');
    const [studentName, setStudentName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [admitCardFile, setAdmitCardFile] = useState(null);
    const [additionalInfo, setAdditionalInfo] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [showBulk, setShowBulk] = useState(false);
    const [bulkText, setBulkText] = useState('');

    useEffect(() => {
        if (pageId) {
            dispatch(fetchAdmitCardPageById(pageId));
            dispatch(fetchAdmitCardsByPage({ pageId, params: { includeInactive: 'true' } }));
        }
    }, [dispatch, pageId]);

    const resetForm = () => {
        setCollegeName(''); setStudentName(''); setRollNumber('');
        setAdmitCardFile(null); setAdditionalInfo(''); setEditingId(null);
    };

    const startAdd = () => {
        resetForm();
        setActiveTab('add');
        setShowBulk(false);
    };

    const handleFileSelect = (e) => {
        if (e.target.files[0]) setAdmitCardFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!studentName.trim() || !rollNumber.trim() || !collegeName.trim()) {
            return toast.error('Student Name, Application No, and College Name are required');
        }
        setSaving(true);
        const loadingToast = toast.loading(editingId ? 'Updating...' : 'Adding...');

        try {
            const formData = new FormData();
            formData.append('page', pageId);
            formData.append('collegeName', collegeName);
            formData.append('studentName', studentName);
            formData.append('rollNumber', rollNumber);
            formData.append('additionalInfo', additionalInfo);
            if (admitCardFile) formData.append('admitCardFile', admitCardFile);

            if (editingId) {
                await dispatch(updateAdmitCard({ id: editingId, formData })).unwrap();
                toast.success('Card updated', { id: loadingToast });
            } else {
                await dispatch(createAdmitCard(formData)).unwrap();
                toast.success('Card created', { id: loadingToast });
            }

            resetForm();
            setActiveTab('manage');
        } catch (error) {
            toast.error('Failed to save card', { id: loadingToast });
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (card) => {
        setEditingId(card._id);
        setCollegeName(card.collegeName);
        setStudentName(card.studentName);
        setRollNumber(card.rollNumber);
        setAdditionalInfo(card.additionalInfo || '');
        setAdmitCardFile(null);
        setActiveTab('add');
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        const loadingToast = toast.loading('Deleting...');
        try {
            await dispatch(deleteAdmitCard(itemToDelete)).unwrap();
            toast.success('Deleted successfully', { id: loadingToast });
        } catch (error) {
            toast.error('Failed to delete', { id: loadingToast });
        } finally {
            setItemToDelete(null);
        }
    };

    const handleBulkUpload = async () => {
        if (!bulkText.trim()) return toast.error('Paste admit card data first');
        const lines = bulkText.trim().split('\n');
        const cardsData = lines.map(line => {
            const parts = line.split(',').map(s => s.trim());
            if (parts.length < 3) return null;
            return { collegeName: parts[0], studentName: parts[1], rollNumber: parts[2] };
        }).filter(Boolean);
        if (cardsData.length === 0) return toast.error('Format: CollegeName, StudentName, ApplicationNo');
        const loadingToast = toast.loading('Uploading ' + cardsData.length + ' cards...');
        try {
            await dispatch(bulkCreateAdmitCards({ pageId, cards: cardsData })).unwrap();
            toast.success(cardsData.length + ' cards created', { id: loadingToast });
            setBulkText(''); setShowBulk(false);
        } catch (error) {
            toast.error('Bulk upload failed', { id: loadingToast });
        }
    };

    const filteredCards = cards.filter(c =>
        c.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.collegeName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/admin/admit-card-pages')} className="border-r border-slate-100 dark:border-slate-700 rounded-none pr-2">
                        <ChevronLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <FileText className="text-primary" /> {currentPage?.title || 'Admit Cards'}
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">{cards.length} card(s) in this page.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => { setShowBulk(!showBulk); setActiveTab('manage'); }}
                        icon="download"
                    >
                        Add Bulk Admit Cards
                    </Button>
                    <Button
                        onClick={startAdd}
                        icon="pluscircle"
                    >
                        Add Admit Cards
                    </Button>
                </div>
            </div>

            {showBulk && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                    <h3 className="font-semibold text-sm text-slate-800 dark:text-white mb-1">Bulk Upload</h3>
                    <p className="text-xs text-slate-500 mb-3">Format per line: <strong>College, StudentName, ApplicationNo</strong></p>
                    <textarea
                        rows="4"
                        placeholder={"ABC College, John Doe, 2024001\nXYZ College, Jane Smith, 2024002"}
                        value={bulkText}
                        onChange={(e) => setBulkText(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white font-mono text-sm resize-none"
                    />
                    <div className="flex items-center gap-2 mt-3">
                        <Button size="sm" onClick={handleBulkUpload}>Upload</Button>
                        <Button size="sm" variant="ghost" onClick={() => setShowBulk(false)}>Cancel</Button>
                    </div>
                </div>
            )}

            <PopupModel
                isOpen={activeTab === 'add' && !showBulk}
                onClose={() => { setActiveTab('manage'); resetForm(); }}
                title={editingId ? 'Edit Admit Card' : 'Add New Card'}
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                College <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="ABC College"
                                value={collegeName}
                                onChange={(e) => setCollegeName(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Student Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="John Doe"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Application No <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="2024001"
                                value={rollNumber}
                                onChange={(e) => setRollNumber(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Admit Card File
                        </label>
                        <label className="flex flex-col items-center justify-center gap-2 w-full px-4 py-6 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary/50 cursor-pointer transition-all">
                            <Upload size={20} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                {admitCardFile ? admitCardFile.name : 'Click to upload image or PDF'}
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={handleFileSelect}
                            />
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Additional Info
                        </label>
                        <input
                            type="text"
                            placeholder="Optional notes..."
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white font-medium"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={() => { setActiveTab('manage'); resetForm(); }}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={saving} icon="save">
                            {editingId ? 'Update' : 'Add Card'}
                        </Button>
                    </div>
                </form>
            </PopupModel>

            <PopupModel
                isOpen={!!viewingCard}
                onClose={() => setViewingCard(null)}
                title="Admit Card Details"
                maxWidth="max-w-3xl"
            >
                {viewingCard && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Application No</p>
                                <p className="text-sm font-semibold text-slate-800 dark:text-white">{viewingCard.rollNumber}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Name</p>
                                <p className="text-sm font-semibold text-slate-800 dark:text-white">{viewingCard.studentName}</p>
                            </div>
                            <div className="col-span-2 md:col-span-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">College</p>
                                <p className="text-sm font-semibold text-slate-800 dark:text-white">{viewingCard.collegeName}</p>
                            </div>
                            {viewingCard.additionalInfo && (
                                <div className="col-span-full mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Additional Info</p>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{viewingCard.additionalInfo}</p>
                                </div>
                            )}
                        </div>

                        {viewingCard.admitCardFile ? (
                            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-video md:aspect-[1/1.2] relative flex items-center justify-center">
                                {viewingCard.admitCardFile.toLowerCase().endsWith('.pdf') ? (
                                    <iframe src={viewingCard.admitCardFile} className="w-full h-full border-0" title="Admit Card PDF" />
                                ) : (
                                    <img src={viewingCard.admitCardFile} alt="Admit Card" className="w-full h-full object-contain" />
                                )}
                            </div>
                        ) : (
                            <div className="p-10 text-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                                <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                                <p className="text-sm font-bold text-slate-400">No admit card file uploaded.</p>
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <Button variant="secondary" onClick={() => setViewingCard(null)}>Close</Button>
                        </div>
                    </div>
                )}
            </PopupModel>

            <div className={`transition-all duration-300 block`}>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by name, application no, or college..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                    <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Application No</th>
                                    <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Student Name</th>
                                    <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">College</th>
                                    <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">File</th>
                                    <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {loading && cards.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-10 text-center">
                                            <Loader2 className="animate-spin text-primary inline-block mb-2" />
                                            <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Loading...</p>
                                        </td>
                                    </tr>
                                ) : filteredCards.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-300">
                                                    <FileText size={32} />
                                                </div>
                                                <p className="text-sm font-bold text-slate-400">{searchTerm ? 'No matching cards.' : 'No admit cards yet.'}</p>
                                                <Button variant="link" size="sm" onClick={startAdd}>Add your first card</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCards.map((card) => (
                                        <tr key={card._id}
                                            className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group cursor-pointer"
                                            onClick={() => setViewingCard(card)}
                                        >
                                            <td className="p-4 font-bold text-slate-800 dark:text-white text-xs">{card.rollNumber}</td>
                                            <td className="p-4 text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">{card.studentName}</td>
                                            <td className="p-4 text-slate-500 text-sm">{card.collegeName}</td>
                                            <td className="p-4">
                                                {card.admitCardFile ? (
                                                    <a href={card.admitCardFile} target="_blank" rel="noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:underline"
                                                    >
                                                        <FileText size={13} /> View
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="sm" onClick={() => startEdit(card)} title="Edit">
                                                        <Edit size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => setItemToDelete(card._id)} title="Delete" className="hover:text-red-500 hover:bg-red-50">
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-4 py-3 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50">
                        Showing {filteredCards.length} of {cards.length} card(s)
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Admit Card"
                message="This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default AdmitCardsManagement;
