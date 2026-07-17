import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BookMarked, PlusCircle, Edit, Trash2, Copy, Search, Loader2, Image as ImageIcon, EyeOff, Upload, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import PopupModel from '../../../components/ui/PopupModel';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import { fetchCourseCategories } from '../../../store/slice/courseCategorySlice.js';
import {
    fetchCourses, createCourse, updateCourse, deleteCourse, duplicateCourse
} from '../../../store/slice/courseSlice.js';

const emptyForm = {
    name: '', category: '', duration: '', eligibility: '',
    feeType: 'fixed', feeComponents: [], studentCreditCard: false
};

const FeeSection = ({ feeComponents, onChange }) => {
    const addComp = (type) => {
        const nc = { label: '', amount: 0, type };
        if (type === 'yearly') { const n = feeComponents.filter(c => c.type === 'yearly').length + 1; nc.label = `Year ${n}`; nc.year = n; }
        if (type === 'semester') { const n = feeComponents.filter(c => c.type === 'semester').length + 1; nc.label = `Semester ${n}`; nc.semester = n; }
        onChange([...feeComponents, nc]);
    };
    const upd = (idx, field, val) => { const u = [...feeComponents]; u[idx] = { ...u[idx], [field]: val }; onChange(u); };
    const total = feeComponents.reduce((s, c) => s + (Number(c.amount) || 0), 0);
    return (
        <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
                {['fixed', 'yearly', 'semester', 'custom'].map(t => (
                    <button key={t} type="button" onClick={() => addComp(t)}
                        className="px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-all uppercase tracking-wider">+ {t}</button>
                ))}
            </div>
            {feeComponents.map((c, i) => (
                <div key={i} className="flex gap-2 items-center">
                    <input type="text" value={c.label} onChange={e => upd(i, 'label', e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Label" />
                    <input type="number" value={c.amount} onChange={e => upd(i, 'amount', Number(e.target.value))}
                        className="w-32 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Amount" />
                    <button type="button" onClick={() => onChange(feeComponents.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                </div>
            ))}
            <div className="text-right font-bold text-sm text-slate-700 dark:text-slate-300">Total: ₹{total.toLocaleString('en-IN')}</div>
        </div>
    );
};



const CoursesManagementPage = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { data: courses, loading } = useSelector((state) => state.courses);
    const { data: categories } = useSelector((state) => state.courseCategories);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ ...emptyForm });

    useEffect(() => {
        dispatch(fetchCourses());
        dispatch(fetchCourseCategories());
    }, [dispatch]);

    const activeCourses = courses.filter(c => !c.deletedAt && !c.isArchived && (!categoryId || (c.category && (c.category._id === categoryId || c.category === categoryId))));
    const filtered = activeCourses.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.courseCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        setForm({ ...emptyForm });
        setEditingId(null);
    };

    const startAdd = () => { 
        resetForm(); 
        if (categoryId) setForm(prev => ({ ...prev, category: categoryId }));
        setShowForm(true); 
    };

    const startEdit = (course) => {
        setEditingId(course._id);
        setForm({
            name: course.name, category: course.category?._id || course.category,
            duration: course.duration || '', eligibility: course.eligibility || '',
            feeType: course.feeType || 'fixed',
            feeComponents: course.feeComponents || [],
            studentCreditCard: course.studentCreditCard || false
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const loadingToast = toast.loading(editingId ? 'Updating...' : 'Creating...');
        try {
            const fd = new FormData();
            fd.append('courseData', JSON.stringify(form));
            if (editingId) {
                await dispatch(updateCourse({ id: editingId, formData: fd })).unwrap();
                toast.success('Course updated', { id: loadingToast });
            } else {
                await dispatch(createCourse(fd)).unwrap();
                toast.success('Course created', { id: loadingToast });
            }
            setShowForm(false);
            resetForm();
        } catch (err) {
            toast.error(err || 'Failed to save', { id: loadingToast });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        const loadingToast = toast.loading('Deleting...');
        try { await dispatch(deleteCourse(itemToDelete)).unwrap(); toast.success('Deleted', { id: loadingToast }); }
        catch (err) { toast.error('Failed', { id: loadingToast }); }
        finally { setItemToDelete(null); }
    };

    const handleDuplicate = async (id) => {
        const loadingToast = toast.loading('Duplicating...');
        try { await dispatch(duplicateCourse(id)).unwrap(); toast.success('Duplicated', { id: loadingToast }); }
        catch (err) { toast.error('Failed', { id: loadingToast }); }
    };

    const tabs = ['basic', 'fee', 'documents', 'questions'];

    return (
        <div className="space-y-6">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
                <div>
                    {categoryId && (
                        <button onClick={() => navigate('/admin/courses')} className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-primary mb-2 transition-colors">
                            <ArrowLeft size={16} /> Back to Categories
                        </button>
                    )}
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <BookMarked className="text-primary" /> Courses
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Create and manage dynamic courses with fee structures, documents, and custom questions.</p>
                </div>
                <Button onClick={startAdd} icon="pluscircle">Add Course</Button>
            </div>

            <PopupModel
                isOpen={showForm}
                onClose={() => { setShowForm(false); resetForm(); }}
                title={editingId ? 'Edit Course' : 'Add New Course'}
                maxWidth="max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Course Name <span className="text-red-500">*</span></label>
                            <input type="text" required placeholder="e.g. Bachelor of Science" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white font-medium" />
                        </div>
                        {!categoryId && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Category <span className="text-red-500">*</span></label>
                                <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white font-medium">
                                    <option value="">Select Category</option>
                                    {categories.filter(c => !c.deletedAt).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                        )}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Eligibility</label>
                            <input type="text" placeholder="e.g. 10+2 with Bio, UG NEET Qualified" value={form.eligibility} onChange={e => setForm({ ...form, eligibility: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white font-medium" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Duration</label>
                            <input type="text" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 4½ + 1 Year Internship = 5½ Years"
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-white font-medium" />
                        </div>
                        
                        <div className="md:col-span-2 mt-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
                                <input type="checkbox" checked={form.studentCreditCard} onChange={e => setForm({ ...form, studentCreditCard: e.target.checked })} className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary" />
                                Student Credit Card Available
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                        <label className="block text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Fee Structure</label>
                        <FeeSection feeComponents={form.feeComponents} onChange={c => setForm({ ...form, feeComponents: c })} />
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
                        <Button type="submit" loading={saving}>{editingId ? 'Update' : 'Create'}</Button>
                    </div>
                </form>
            </PopupModel>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="Search courses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium" />
                    </div>
                    <span className="text-xs font-bold text-slate-500">{activeCourses.length} courses</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Image</th>
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Code / Name</th>
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Duration</th>
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Seats</th>
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="p-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {loading && filtered.length === 0 ? (
                                <tr><td colSpan="7" className="p-10 text-center">
                                    <Loader2 className="animate-spin text-primary inline-block mb-2" />
                                    <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Loading...</p>
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="7" className="p-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-300"><BookMarked size={32} /></div>
                                        <p className="text-sm font-bold text-slate-400">{searchTerm ? 'No matching courses.' : 'No courses yet.'}</p>
                                        <Button variant="link" size="sm" onClick={startAdd}>Add your first course</Button>
                                    </div>
                                </td></tr>
                            ) : filtered.map(course => (
                                <tr key={course._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                                    <td className="p-4">
                                        <div className="size-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-700 shadow-sm bg-slate-100">
                                            {course.thumbnail ? (
                                                <img src={course.thumbnail} alt={course.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20} /></div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">{course.courseCode}</p>
                                        <p className="font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors text-[14px]">{course.name}</p>
                                    </td>
                                    <td className="p-4"><span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{course.category?.name || 'N/A'}</span></td>
                                    <td className="p-4 text-sm font-medium text-slate-600 dark:text-slate-300">{course.duration}</td>
                                    <td className="p-4 text-sm font-bold text-slate-600 dark:text-slate-300">{course.totalSeats}</td>
                                    <td className="p-4">
                                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${course.admissionOpen
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400'
                                            : 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-500/10 dark:text-red-400'}`}>
                                            <span className={`size-1.5 rounded-full ${course.admissionOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`}></span>
                                            {course.admissionOpen ? 'Open' : 'Closed'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleDuplicate(course._id)} title="Duplicate"><Copy size={16} /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => startEdit(course)} title="Edit"><Edit size={16} /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => setItemToDelete(course._id)} title="Delete" className="hover:text-red-500 hover:bg-red-50"><Trash2 size={16} /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleDelete}
                title="Delete Course"
                message="This course will be soft-deleted and can be restored later."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default CoursesManagementPage;
