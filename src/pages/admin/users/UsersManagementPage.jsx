import React, { useState, useEffect, useRef } from 'react';
import { Search, Trash2, Shield, ShieldAlert, CheckCircle, Eye, X, AlertOctagon, ChevronDown, Filter, ArrowUpDown, Check } from 'lucide-react';
import { getAllUsersApi, deleteUserApi, makeUserAdminApi, removeUserAdminApi } from '../../../api/user.api';
import toast from 'react-hot-toast';

const UsersManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortOption, setSortOption] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    const [selectedUser, setSelectedUser] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // Custom Dropdown States
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const sortDropdownRef = useRef(null);
    const roleDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false);
            }
            if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
                setIsRoleDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Custom Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        variant: 'danger', // 'danger', 'success', 'warning'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await getAllUsersApi();
            setUsers(data);
            setFilteredUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch users', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = [...users];

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (u) =>
                    u.name.toLowerCase().includes(query) ||
                    u.email.toLowerCase().includes(query)
            );
        }

        // Role Filter
        if (roleFilter !== 'all') {
            const isAdminFilter = roleFilter === 'admin';
            result = result.filter((u) => !!u.isAdmin === isAdminFilter);
        }

        // Sorting
        result.sort((a, b) => {
            if (sortOption === 'newest') {
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            } else if (sortOption === 'oldest') {
                return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
            } else if (sortOption === 'name_asc') {
                return a.name.localeCompare(b.name);
            } else if (sortOption === 'name_desc') {
                return b.name.localeCompare(a.name);
            }
            return 0;
        });

        setFilteredUsers(result);
        setCurrentPage(1); // Reset to page 1 when filters or sort change
    }, [searchQuery, roleFilter, sortOption, users]);

    // Pagination calculations
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleDeleteUser = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete User',
            message: 'Are you sure you want to permanently delete this user? This action cannot be undone.',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await deleteUserApi(id);
                    setUsers(users.filter((u) => u._id !== id));
                    closeConfirmModal();
                } catch (error) {
                    toast.error(error.response?.data?.message || "Failed to delete user");
                }
            }
        });
    };

    const handleMakeAdmin = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Make an Admin',
            message: 'Are you sure you want to make this user an admin? They will have full access to the portal.',
            variant: 'success',
            onConfirm: async () => {
                try {
                    await makeUserAdminApi(id);
                    setUsers(users.map((u) => (u._id === id ? { ...u, isAdmin: true } : u)));
                    closeConfirmModal();
                } catch (error) {
                    toast.error(error.response?.data?.message || "Failed to make user admin");
                }
            }
        });
    };

    const handleRemoveAdmin = (id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Remove Admin Privileges',
            message: 'Are you sure you want to remove admin rights from this user? They will become a standard user.',
            variant: 'warning',
            onConfirm: async () => {
                try {
                    await removeUserAdminApi(id);
                    setUsers(users.map((u) => (u._id === id ? { ...u, isAdmin: false } : u)));
                    closeConfirmModal();
                } catch (error) {
                    toast.error(error.response?.data?.message || "Failed to remove user admin");
                }
            }
        });
    };

    const closeConfirmModal = () => {
        setConfirmModal({
            isOpen: false,
            title: '',
            message: '',
            onConfirm: null,
            variant: 'danger',
        });
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setSelectedUser(null);
        setIsViewModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Users Management</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Manage user accounts and permissions.</p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium dark:text-white transition-all"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto shrink-0 relative z-20">
                    {/* Custom Sort Dropdown */}
                    <div className="relative" ref={sortDropdownRef}>
                        <button
                            onClick={() => {
                                setIsSortDropdownOpen(!isSortDropdownOpen);
                                setIsRoleDropdownOpen(false);
                            }}
                            className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-primary/50 transition-colors focus:ring-2 focus:ring-primary/20 focus:outline-none w-full md:w-[170px] justify-between shadow-sm"
                        >
                            <div className="flex items-center gap-2 truncate">
                                <ArrowUpDown size={15} className="text-slate-400" />
                                <span className="truncate">
                                    {
                                        {
                                            'newest': 'Newest First',
                                            'oldest': 'Oldest First',
                                            'name_asc': 'Name (A-Z)',
                                            'name_desc': 'Name (Z-A)'
                                        }[sortOption]
                                    }
                                </span>
                            </div>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform duration-200 ${isSortDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isSortDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-full md:w-[200px] min-w-[170px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                {[
                                    { value: 'newest', label: 'Newest First' },
                                    { value: 'oldest', label: 'Oldest First' },
                                    { value: 'name_asc', label: 'Name (A-Z)' },
                                    { value: 'name_desc', label: 'Name (Z-A)' }
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setSortOption(option.value);
                                            setIsSortDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors ${sortOption === option.value ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}
                                    >
                                        {option.label}
                                        {sortOption === option.value && <Check size={14} className="text-primary" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Custom Role Dropdown */}
                    <div className="relative" ref={roleDropdownRef}>
                        <button
                            onClick={() => {
                                setIsRoleDropdownOpen(!isRoleDropdownOpen);
                                setIsSortDropdownOpen(false);
                            }}
                            className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-primary/50 transition-colors focus:ring-2 focus:ring-primary/20 focus:outline-none w-full md:w-[150px] justify-between shadow-sm"
                        >
                            <div className="flex items-center gap-2 truncate">
                                <Filter size={15} className="text-slate-400" />
                                <span className="truncate">
                                    {
                                        {
                                            'all': 'All Roles',
                                            'admin': 'Admin',
                                            'user': 'User'
                                        }[roleFilter]
                                    }
                                </span>
                            </div>
                            <ChevronDown size={15} className={`text-slate-400 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isRoleDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-full md:w-[180px] min-w-[150px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                {[
                                    { value: 'all', label: 'All Roles' },
                                    { value: 'admin', label: 'Admin (Staff)' },
                                    { value: 'user', label: 'Standard User' }
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setRoleFilter(option.value);
                                            setIsRoleDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center justify-between transition-colors ${roleFilter === option.value ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'}`}
                                    >
                                        {option.label}
                                        {roleFilter === option.value && <Check size={14} className="text-primary" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="p-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                                <th className="p-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="p-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
                                <th className="p-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">Loading users...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">No users found.</td>
                                </tr>
                            ) : (
                                currentUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-linear-to-br from-primary to-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-white">{user.name}</p>
                                                    <p className="text-sm font-semibold text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${user.isAdmin
                                                ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20'
                                                : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                                }`}>
                                                {user.isAdmin && <ShieldAlert size={12} />}
                                                {!user.isAdmin && <Shield size={12} />}
                                                {user.isAdmin ? 'Admin' : 'User'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400">
                                                <CheckCircle size={14} /> Active
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 transition-opacity">
                                                <button
                                                    onClick={() => handleViewUser(user)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-500 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors" title="View">
                                                    <Eye size={16} />
                                                </button>

                                                {!user.isAdmin ? (
                                                    <button
                                                        onClick={() => handleMakeAdmin(user._id)}
                                                        className="p-1.5 text-slate-400 hover:text-green-500 bg-slate-100 hover:bg-green-50 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors" title="Make Admin">
                                                        <ShieldAlert size={16} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleRemoveAdmin(user._id)}
                                                        className="p-1.5 text-slate-400 hover:text-orange-500 bg-slate-100 hover:bg-orange-50 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors" title="Remove Admin">
                                                        <Shield size={16} />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between text-sm gap-4 sm:gap-0">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">
                            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} entries
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-slate-200 dark:border-slate-700 text-slate-500 font-bold rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                            >
                                Prev
                            </button>

                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`px-3 py-1 font-bold rounded-md transition-colors ${currentPage === index + 1
                                        ? 'bg-primary text-white shadow-sm shadow-primary/20'
                                        : 'border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-slate-200 dark:border-slate-700 text-slate-500 font-bold rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* View User Modal */}
            {isViewModalOpen && selectedUser && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">User Details</h3>
                            <button onClick={closeViewModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="size-16 rounded-full bg-linear-to-br from-primary to-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-lg">
                                    {selectedUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-800 dark:text-white">{selectedUser.name}</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{selectedUser.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Role</p>
                                    <p className="font-bold text-slate-700 dark:text-slate-200">{selectedUser.isAdmin ? 'Admin' : 'User'}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                    <p className="font-bold text-green-600 dark:text-green-400">Active</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl col-span-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Join Date</p>
                                    <p className="font-bold text-slate-700 dark:text-slate-200">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl col-span-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                                    <p className="font-bold text-slate-700 dark:text-slate-200">{selectedUser.phone || 'Not Provided'}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl col-span-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">User ID</p>
                                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{selectedUser._id}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
                            <button
                                onClick={closeViewModal}
                                className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Custom Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden translate-y-0 scale-100 animate-in zoom-in-95 slide-in-from-bottom-5 duration-200">
                        <div className="p-6 text-center space-y-5">
                            <div className="flex justify-center">
                                <div className={`size-16 rounded-full flex items-center justify-center 
                                    ${confirmModal.variant === 'danger' ? 'bg-red-100 text-red-500 dark:bg-red-500/10' : ''}
                                    ${confirmModal.variant === 'success' ? 'bg-green-100 text-green-500 dark:bg-green-500/10' : ''}
                                    ${confirmModal.variant === 'warning' ? 'bg-orange-100 text-orange-500 dark:bg-orange-500/10' : ''}
                                `}>
                                    <AlertOctagon size={32} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight mb-2">
                                    {confirmModal.title}
                                </h3>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    {confirmModal.message}
                                </p>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={closeConfirmModal}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmModal.onConfirm}
                                    className={`flex-1 py-3 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95
                                        ${confirmModal.variant === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : ''}
                                        ${confirmModal.variant === 'success' ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20' : ''}
                                        ${confirmModal.variant === 'warning' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' : ''}
                                    `}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManagementPage;
