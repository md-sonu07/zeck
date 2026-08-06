import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { Search, Loader2, Download, X, ChevronDown, Trash2 } from 'lucide-react';
import DynamicIdCard from '../../../components/ui/DynamicIdCard';
import * as htmlToImage from 'html-to-image';

const IdCardsManagementPage = () => {
    const [staff, setStaff] = useState([]);
    const [students, setStudents] = useState([]);
    const [savedCards, setSavedCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('students');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [showManualForm, setShowManualForm] = useState(false);
    const [manualFormData, setManualFormData] = useState({
        type: 'student',
        fullName: '',
        mobile: '',
        roleOrCourse: '',
        dob: '',
        address: '',
        college: '',
        session: '',
        profileImage: null,
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const resetManualForm = () => {
        setManualFormData({
            type: 'student',
            fullName: '',
            mobile: '',
            roleOrCourse: '',
            dob: '',
            address: '',
            college: '',
            session: '',
            profileImage: null,
            file: null,
            _id: null,
            originalType: undefined,
        });
        setIsDropdownOpen(false);
    };

    const isManualCard = (p) => Boolean(p?.roleOrCourse) || p?.originalType === 'manual';

    const displayName = (tab, p) => {
        if (isManualCard(p)) return p.fullName;
        return tab === 'staff' ? p.name : p.personalInfo?.fullName;
    };
    const displayPhone = (tab, p) => {
        if (isManualCard(p)) return p.mobile || 'N/A';
        return tab === 'staff' ? (p.phone || 'N/A') : (p.contactInfo?.mobile || 'N/A');
    };
    const displayCourse = (tab, p) => {
        if (isManualCard(p)) return p.roleOrCourse || 'Course';
        return tab === 'staff' ? 'Admin/Staff' : (p.customCourse || p.course?.title || 'Course');
    };
    const displayAvatar = (tab, p) => {
        const fallback = (n) => `https://ui-avatars.com/api/?name=${encodeURIComponent(n || 'S')}&background=0D8ABC&color=fff`;
        if (isManualCard(p)) return p.profileImage || fallback(p.fullName);
        return tab === 'staff'
            ? (p.profileImageUrl || fallback(p.name))
            : (p.personalInfo?.profileImageUrl || fallback(p.personalInfo?.fullName));
    };

    const openEditForm = (type, data) => {
        const isManual = type === 'manual' || isManualCard(data);

        const formatDateForInput = (dateString) => {
            if (!dateString) return '';
            const d = new Date(dateString);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        };

        const addressInfo = isManual ? data.address : (type === 'staff' ? (data.address || 'Zoya Education Centre') :
            (data.addressInfo?.permanent ?
                `${data.addressInfo.permanent.addressLine}, ${data.addressInfo.permanent.city}, ${data.addressInfo.permanent.state}-${data.addressInfo.permanent.pincode}`
                : ''
            ));

        setManualFormData({
            _id: isManual ? data._id : data._id,
            originalType: isManual ? (data.originalType || 'manual') : type,
            type: type === 'staff' || (isManual && data.type === 'staff') ? 'staff' : 'student',
            fullName: isManual ? data.fullName : (type === 'staff' ? data.name : data.personalInfo?.fullName || ''),
            mobile: isManual ? data.mobile : (type === 'staff' ? (data.phone || '') : (data.contactInfo?.mobile || '')),
            roleOrCourse: isManual ? data.roleOrCourse : (type === 'staff' ? (data.role || 'Admin/Staff') : (data.customCourse || data.course?.title || '')),
            dob: isManual ? data.dob : (type === 'staff' ? (data.dob || '') : formatDateForInput(data.personalInfo?.dateOfBirth)),
            address: addressInfo,
            college: isManual ? (data.college || '') : (data.college || ''),
            session: isManual ? (data.session || '') : (data.session || ''),
            profileImage: isManual ? data.profileImage : (type === 'staff' ? data.avatar : (data.documents?.find(d => d.name === 'Passport Size Photo')?.files[0] || null)),
            file: null,
        });
        setSelectedPerson(null);
        setShowManualForm(true);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, admissionsRes, idCardsRes] = await Promise.all([
                api.get('/users'),
                api.get('/admissions/all'),
                api.get('/id-cards').catch(() => ({ data: [] })),
            ]);

            // Filter admins/staff or users with ID card generation enabled
            setStaff(usersRes.data.filter(u => u.isAdmin || u.generateIdCard));
            // Filter approved students
            const admissionsData = Array.isArray(admissionsRes.data) ? admissionsRes.data : (admissionsRes.data.data || []);
            setStudents(admissionsData);
            // Saved manual ID cards
            setSavedCards(Array.isArray(idCardsRes.data) ? idCardsRes.data : []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        const idCardElement = document.getElementById('id-card-node');
        if (!idCardElement) return;

        setGenerating(true);
        try {
            const dataUrl = await htmlToImage.toPng(idCardElement, {
                quality: 1.0,
                pixelRatio: 2,
            });
            const link = document.createElement('a');
            const cardName = selectedPerson.name || selectedPerson.data?.fullName || selectedPerson.personalInfo?.fullName || 'Generated';
            link.download = `ID_Card_${cardName}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Error generating ID card:', error);
        } finally {
            setGenerating(false);
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (person) => {
        const name = displayName(activeTab, person);
        if (!window.confirm(`Delete ID card for "${name}"? This cannot be undone.`)) return;

        setDeletingId(person._id);
        try {
            let endpoint;
            if (isManualCard(person)) {
                endpoint = `/id-cards/${person._id}`;
            } else if (activeTab === 'students') {
                endpoint = `/admissions/${person._id}`;
            } else {
                endpoint = `/users/${person._id}`;
            }
            await api.delete(endpoint);
            setSelectedPerson(null);
            await fetchData();
        } catch (error) {
            console.error('Error deleting ID card:', error);
            alert('Failed to delete. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchTerm]);

    const manualStudents = savedCards.filter(c => c.type !== 'staff');
    const manualStaff = savedCards.filter(c => c.type === 'staff');

    const filteredData = activeTab === 'staff'
        ? [...staff, ...manualStaff].filter(p => displayName('staff', p)?.toLowerCase().includes(searchTerm.toLowerCase()))
        : [...students, ...manualStudents].filter(p => displayName('students', p)?.toLowerCase().includes(searchTerm.toLowerCase()));

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">ID Card Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Generate ID cards for Staff and Students</p>
                </div>
                <button
                    onClick={() => {
                        resetManualForm();
                        setShowManualForm(true);
                    }}
                    className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Create Manual ID Card
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                        <button
                            onClick={() => setActiveTab('students')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'students' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            Students ({students.length + savedCards.filter(c => c.type !== 'staff').length})
                        </button>
                        <button
                            onClick={() => setActiveTab('staff')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'staff' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            Staff ({staff.length + savedCards.filter(c => c.type === 'staff').length})
                        </button>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                        <input
                            type="text"
                            placeholder="Search name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-800 dark:text-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Name</th>
                                    <th className="px-6 py-4 font-semibold">Phone</th>
                                    <th className="px-6 py-4 font-semibold">{activeTab === 'staff' ? 'Role' : 'Course'}</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {paginatedData.map((person, index) => {
                                    const personType = isManualCard(person) ? 'manual' : activeTab;
                                    const name = displayName(activeTab, person);
                                    const phone = displayPhone(activeTab, person);
                                    const course = displayCourse(activeTab, person);
                                    const avatarSrc = displayAvatar(activeTab, person);

                                    return (
                                    <tr
                                        key={person._id || index}
                                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                                        onClick={() => setSelectedPerson({ type: personType, data: person })}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm flex-shrink-0">
                                                    <img
                                                        src={avatarSrc}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900 dark:text-white">
                                                        {name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                                            {phone}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                                                {course}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openEditForm(activeTab, person);
                                                    }}
                                                    className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                    title="Edit Details"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedPerson({ type: personType, data: person });
                                                    }}
                                                    className="px-3 py-1.5 text-xs font-semibold bg-primary text-white hover:bg-primary/90 rounded-lg shadow-sm transition-all shadow-primary/20 flex items-center gap-1.5"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                                                    Card
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(person);
                                                    }}
                                                    disabled={deletingId === person._id}
                                                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Delete ID Card"
                                                >
                                                    {deletingId === person._id ? (
                                                        <Loader2 size={16} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    );
                                })}
                                {paginatedData.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                            No ID cards generated yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> results
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm font-medium rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 px-2">
                                Page {currentPage} of {totalPages}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm font-medium rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ID Card Modal */}
            {selectedPerson && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">ID Card Preview</h3>
                            <button
                                onClick={() => setSelectedPerson(null)}
                                className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-900 flex justify-center items-start">
                            <div className="shadow-lg my-4">
                                <div id="id-card-node">
                                    <DynamicIdCard person={selectedPerson} />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-white dark:bg-slate-800">
                            <button
                                onClick={() => {
                                    openEditForm(selectedPerson.type, selectedPerson.data);
                                }}
                                className="px-4 py-2 cursor-pointer text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center gap-2 transition-colors mr-auto"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                Edit Info
                            </button>
                            <button
                                onClick={async () => {
                                    setGenerating(true);
                                    try {
                                        const element = document.getElementById('id-card-node');
                                        const image = await htmlToImage.toPng(element, { quality: 1.0, pixelRatio: 2 });

                                        const printIframe = document.createElement('iframe');
                                        printIframe.style.position = 'absolute';
                                        printIframe.style.top = '-9999px';
                                        document.body.appendChild(printIframe);

                                        printIframe.contentWindow.document.open();
                                        printIframe.contentWindow.document.write(`
                                            <html>
                                                <head>
                                                    <title>Print ID Card</title>
                                                    <style>
                                                        body { margin: 0; display: flex; justify-content: center; align-items: center; background-color: white; height: 100vh; overflow: hidden; }
                                                        img { max-width: 100%; max-height: 95vh; object-fit: contain; }
                                                        @media print {
                                                            @page { margin: 0; size: auto; }
                                                            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                                                        }
                                                    </style>
                                                </head>
                                                <body>
                                                    <img src="${image}" onload="window.print();" />
                                                </body>
                                            </html>
                                        `);
                                        printIframe.contentWindow.document.close();

                                        // Cleanup after print dialog
                                        setTimeout(() => {
                                            if (document.body.contains(printIframe)) {
                                                document.body.removeChild(printIframe);
                                            }
                                        }, 3000);
                                    } catch (error) {
                                        console.error('Error printing ID card:', error);
                                    } finally {
                                        setGenerating(false);
                                    }
                                }}
                                disabled={generating}
                                className="px-4 py-2 cursor-pointer text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                                {generating ? 'Processing...' : 'Print'}
                            </button>
                            <button
                                onClick={handleDownload}
                                disabled={generating}
                                className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center gap-2 transition-colors"
                            >
                                {generating ? (
                                    <Loader2 className="animate-spin" size={16} />
                                ) : (
                                    <Download size={16} />
                                )}
                                {generating ? 'Generating...' : 'Download PNG'}
                            </button>
                            <button
                                onClick={() => setSelectedPerson(null)}
                                className="px-4 cursor-pointer py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Manual Form Modal */}
            {showManualForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setShowManualForm(false)}></div>
                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 dark:border-slate-700 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Create ID Card</h3>
                                <p className="text-xs font-semibold text-slate-500 mt-1">Manually enter details for custom generation.</p>
                            </div>
                            <button
                                onClick={() => setShowManualForm(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">

                            <div className="relative">
                                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Card Type</label>
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 dark:text-white"
                                >
                                    <span className="capitalize">{manualFormData.type}</span>
                                    <ChevronDown size={16} className={`text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setManualFormData({ ...manualFormData, type: 'student' });
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${manualFormData.type === 'student' ? 'text-primary bg-primary/5 dark:bg-primary/10' : 'text-slate-700 dark:text-slate-300'}`}
                                        >
                                            Student
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setManualFormData({ ...manualFormData, type: 'staff' });
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${manualFormData.type === 'staff' ? 'text-primary bg-primary/5 dark:bg-primary/10' : 'text-slate-700 dark:text-slate-300'}`}
                                        >
                                            Staff
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={manualFormData.fullName}
                                    onChange={(e) => setManualFormData({ ...manualFormData, fullName: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 dark:text-white"
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                                    {manualFormData.type === 'staff' ? 'Designation' : 'Course / Class'}
                                </label>
                                <input
                                    type="text"
                                    value={manualFormData.roleOrCourse}
                                    onChange={(e) => setManualFormData({ ...manualFormData, roleOrCourse: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 dark:text-white"
                                    placeholder={manualFormData.type === 'staff' ? 'e.g. Director' : 'e.g. B.Tech Computer Science'}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Mobile</label>
                                    <input
                                        type="text"
                                        value={manualFormData.mobile}
                                        onChange={(e) => setManualFormData({ ...manualFormData, mobile: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 dark:text-white"
                                        placeholder="e.g. 9876543210"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">D.O.B</label>
                                    <input
                                        type="date"
                                        value={manualFormData.dob}
                                        onChange={(e) => setManualFormData({ ...manualFormData, dob: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Short Address</label>
                                <input
                                    type="text"
                                    value={manualFormData.address}
                                    onChange={(e) => setManualFormData({ ...manualFormData, address: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 dark:text-white"
                                    placeholder="e.g. Kursakanta, Araria"
                                />
                            </div>

                            {manualFormData.type === 'student' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">College</label>
                                        <input
                                            type="text"
                                            value={manualFormData.college}
                                            onChange={(e) => setManualFormData({ ...manualFormData, college: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 dark:text-white"
                                            placeholder="e.g. Zoya College"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Session</label>
                                        <input
                                            type="text"
                                            value={manualFormData.session}
                                            onChange={(e) => setManualFormData({ ...manualFormData, session: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 dark:text-white"
                                            placeholder="e.g. 2023-2025"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Profile Image</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex-1 cursor-pointer">
                                        <div className="px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-md text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                            <span className="text-sm font-semibold text-primary">Click to upload image</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        const file = e.target.files[0];
                                                        const url = URL.createObjectURL(file);
                                                        setManualFormData({ ...manualFormData, profileImage: url, file: file });
                                                    }
                                                }}
                                            />
                                        </div>
                                    </label>
                                    {manualFormData.profileImage && (
                                        <div className="shrink-0 size-14 rounded-xl overflow-hidden border-2 border-primary/20">
                                            <img src={manualFormData.profileImage} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                        <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowManualForm(false)}
                                className="py-3 cursor-pointer bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        setLoading(true);
                                        const id = manualFormData._id;
                                        const isManualCard = manualFormData.originalType === 'manual' || !manualFormData._id;
                                        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
                                        const formData = new FormData();
                                        formData.append('fullName', manualFormData.fullName);
                                        formData.append('mobile', manualFormData.mobile);
                                        formData.append('dob', manualFormData.dob);
                                        formData.append('address', manualFormData.address);

                                        let savedCard = null;

                                        if (isManualCard) {
                                            formData.append('type', manualFormData.type);
                                            formData.append('roleOrCourse', manualFormData.roleOrCourse);
                                            formData.append('college', manualFormData.type === 'student' ? manualFormData.college : '');
                                            formData.append('session', manualFormData.type === 'student' ? manualFormData.session : '');

                                            if (manualFormData.file) {
                                                formData.append('profileImage', manualFormData.file);
                                            }

                                            if (id) {
                                                savedCard = (await api.put(`/id-cards/${id}`, formData, config)).data;
                                            } else {
                                                savedCard = (await api.post('/id-cards', formData, config)).data;
                                            }
                                        } else {
                                            const type = manualFormData.originalType || manualFormData.type;

                                            if (type === 'student' || type === 'students') {
                                                formData.append('college', manualFormData.college);
                                                formData.append('session', manualFormData.session);
                                                formData.append('course', manualFormData.roleOrCourse);
                                            } else {
                                                formData.append('name', manualFormData.fullName);
                                                formData.append('phone', manualFormData.mobile);
                                                formData.append('role', manualFormData.roleOrCourse);
                                            }

                                            if (manualFormData.file) {
                                                formData.append('profileImage', manualFormData.file);
                                            }

                                            if (id) {
                                                if (type === 'student' || type === 'students') {
                                                    await api.put(`/admissions/${id}/details`, formData, config);
                                                } else {
                                                    await api.put(`/users/${id}/details`, formData, config);
                                                }
                                            }
                                        }

                                        const wasNewManual = isManualCard && !id;
                                        setShowManualForm(false);
                                        setSelectedPerson({ type: 'manual', data: savedCard || manualFormData });

                                        // Refetch data to show updated lists
                                        await fetchData();
                                        if (wasNewManual) setActiveTab(savedCard?.type === 'staff' ? 'staff' : 'students');

                                    } catch (error) {
                                        console.error('Error updating details:', error);
                                        alert('Failed to save details to database, but ID card will still be generated.');
                                        setShowManualForm(false);
                                        setSelectedPerson({ type: 'manual', data: manualFormData });
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={!manualFormData.fullName || !manualFormData.roleOrCourse || loading}
                                className="py-3 cursor-pointer flex items-center justify-center bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save & Generate Card'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IdCardsManagementPage;
