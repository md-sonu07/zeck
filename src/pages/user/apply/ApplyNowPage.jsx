import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchCourseById, clearCurrentCourse } from '../../../store/slice/courseSlice';
import { submitApplication } from '../../../store/slice/admissionSlice';
import { ArrowLeft, BookOpen, Clock, CheckCircle2, IndianRupee, Loader2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import SEO from '../../../components/common/SEO.jsx';

const ApplyNowPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentCourse: course, loading: courseLoading } = useSelector((state) => state.courses);
    const { user: userInfo } = useSelector((state) => state.auth);
    const { loading: submitting } = useSelector((state) => state.admissions);

    const [form, setForm] = useState({
        personalInfo: { fullName: '', fatherName: '', motherName: '', gender: '', dateOfBirth: '', category: '' },
        contactInfo: { mobile: '', alternateMobile: '', email: '' },
        addressInfo: {
            permanent: { addressLine: '', state: '', district: '', city: '', pincode: '' },
            current: { addressLine: '', state: '', district: '', city: '', pincode: '' },
            sameAsPermanent: false
        },
        extraInformation: ''
    });
    const [educationEntries, setEducationEntries] = useState([]);
    const [documentFiles, setDocumentFiles] = useState({});
    const [sameAddress, setSameAddress] = useState(false);

    useEffect(() => {
        dispatch(fetchCourseById(id));
        return () => {
            dispatch(clearCurrentCourse());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (userInfo) {
            setForm(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, fullName: userInfo.name || '' },
                contactInfo: { ...prev.contactInfo, email: userInfo.email || '', mobile: userInfo.phone || '' }
            }));
        }
    }, [userInfo]);

    const updatePersonal = (field, value) => {
        setForm(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
    };

    const updateContact = (field, value) => {
        setForm(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, [field]: value } }));
    };

    const updateAddress = (type, field, value) => {
        setForm(prev => ({
            ...prev,
            addressInfo: { ...prev.addressInfo, [type]: { ...prev.addressInfo[type], [field]: value } }
        }));
    };

    const updateEdu = (idx, field, value) => {
        const updated = [...educationEntries];
        updated[idx] = { ...updated[idx], [field]: value };
        setEducationEntries(updated);
    };

    const handleFileChange = (docName, fileList) => {
        setDocumentFiles(prev => ({ ...prev, [docName]: [...(prev[docName] || []), ...Array.from(fileList)] }));
    };

    const updateExtraInfo = (value) => {
        setForm(prev => ({ ...prev, extraInformation: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        const appData = {
            course: course._id,
            personalInfo: form.personalInfo,
            contactInfo: form.contactInfo,
            addressInfo: {
                ...form.addressInfo,
                current: form.addressInfo.sameAsPermanent ? form.addressInfo.permanent : form.addressInfo.current
            },
            educationInfo: educationEntries,
            extraInformation: form.extraInformation
        };
        fd.append('applicationData', JSON.stringify(appData));
        Object.entries(documentFiles).forEach(([name, files]) => {
            files.forEach(file => fd.append('documents', file));
        });
        try {
            await dispatch(submitApplication(fd)).unwrap();
            toast.success('Application submitted successfully!');
            navigate('/my-applications');
        } catch (err) { toast.error(err); }
    };

    if (courseLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex justify-center items-center">
                <Loader2 className="animate-spin text-purple-600" size={40} />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Course Not Found</h2>
                <Button onClick={() => navigate(-1)} variant="secondary">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">

            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 xl:px-8 py-4 flex items-center gap-4">
                    <button type="button" onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors shrink-0">
                        <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-lg font-black text-slate-800 dark:text-white tracking-tight leading-tight line-clamp-1">
                            {course?.name}
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Course Application</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 mt-8 space-y-6">

                {/* Course Details Card */}
                {course && (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 md:p-6 border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 mb-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            
                            {/* Left Side: Course Info */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/50">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg md:text-xl font-black text-slate-800 dark:text-white leading-tight">{course.name}</h2>
                                        <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">{course.category?.name || course.category}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-start gap-3">
                                        <Clock className="text-slate-400 mt-0.5 shrink-0" size={16} />
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Duration</p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{course.duration}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="text-emerald-500 mt-0.5 shrink-0" size={16} />
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Eligibility</p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{course.eligibility}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Fee Breakdown */}
                            <div className="md:w-72 lg:w-80 shrink-0">
                                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 p-4 h-full flex flex-col">
                                    <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest mb-3 flex items-center gap-1">
                                        <IndianRupee size={12} /> Fee Breakdown
                                    </p>
                                    <div className="space-y-2 mb-3">
                                        {course.feeComponents && course.feeComponents.length > 0 ? (
                                            course.feeComponents.map((fee, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-xs">
                                                    <span className="font-semibold text-slate-600 dark:text-slate-400">{fee.label}</span>
                                                    <span className="font-bold text-slate-800 dark:text-white">₹{fee.amount?.toLocaleString('en-IN')}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-xs text-slate-500 italic">No detailed fee breakdown.</div>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700/50 mt-auto">
                                        <span className="text-sm font-black text-slate-800 dark:text-white">Total</span>
                                        <span className="text-base font-black text-primary">₹{course.totalFee?.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Full Name" placeholder="e.g. John Doe" required type="text" value={form.personalInfo.fullName} onChange={e => updatePersonal('fullName', e.target.value)} />
                            <Input label="Father Name" placeholder="e.g. Robert Doe" type="text" value={form.personalInfo.fatherName} onChange={e => updatePersonal('fatherName', e.target.value)} />
                            <Input label="Mother Name" placeholder="e.g. Mary Doe" type="text" value={form.personalInfo.motherName} onChange={e => updatePersonal('motherName', e.target.value)} />
                            <Select label="Gender" value={form.personalInfo.gender} onChange={e => updatePersonal('gender', e.target.value)}>
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </Select>
                            <Input label="Date of Birth" type="date" value={form.personalInfo.dateOfBirth} onChange={e => updatePersonal('dateOfBirth', e.target.value)} />
                            <Select label="Category" value={form.personalInfo.category} onChange={e => updatePersonal('category', e.target.value)}>
                                <option value="">Select</option>
                                <option value="General">General</option>
                                <option value="OBC">OBC</option>
                                <option value="SC">SC</option>
                                <option value="ST">ST</option>
                                <option value="EWS">EWS</option>
                            </Select>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Mobile Number" placeholder="e.g. 9876543210" required type="tel" value={form.contactInfo.mobile} onChange={e => updateContact('mobile', e.target.value)} />
                            <Input label="Alternate Mobile" placeholder="e.g. 9876543210" type="tel" value={form.contactInfo.alternateMobile} onChange={e => updateContact('alternateMobile', e.target.value)} />
                            <Input label="Email" placeholder="e.g. john@example.com" required type="email" value={form.contactInfo.email} onChange={e => updateContact('email', e.target.value)} />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Permanent Address</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <Input label="Address Line" placeholder="House No, Street, Landmark" type="text" value={form.addressInfo.permanent.addressLine} onChange={e => updateAddress('permanent', 'addressLine', e.target.value)} />
                            </div>
                            <Input label="State" placeholder="e.g. Maharashtra" type="text" value={form.addressInfo.permanent.state} onChange={e => updateAddress('permanent', 'state', e.target.value)} />
                            <Input label="District" placeholder="e.g. Pune" type="text" value={form.addressInfo.permanent.district} onChange={e => updateAddress('permanent', 'district', e.target.value)} />
                            <Input label="City" placeholder="e.g. Pune" type="text" value={form.addressInfo.permanent.city} onChange={e => updateAddress('permanent', 'city', e.target.value)} />
                            <Input label="Pincode" placeholder="e.g. 411001" type="text" value={form.addressInfo.permanent.pincode} onChange={e => updateAddress('permanent', 'pincode', e.target.value)} />
                        </div>

                        <div className="mt-4">
                            <label className="flex items-center gap-2 text-[13px] font-bold text-slate-600 dark:text-slate-300 ml-1">
                                <input type="checkbox" checked={sameAddress} onChange={e => setSameAddress(e.target.checked)} />
                                Current address same as permanent
                            </label>
                        </div>

                        {!sameAddress && (
                            <>
                                <h3 className="text-lg font-semibold mt-6 mb-3">Current Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <Input label="Address Line" placeholder="House No, Street, Landmark" type="text" value={form.addressInfo.current.addressLine} onChange={e => updateAddress('current', 'addressLine', e.target.value)} />
                                    </div>
                                    <Input label="State" placeholder="e.g. Maharashtra" type="text" value={form.addressInfo.current.state} onChange={e => updateAddress('current', 'state', e.target.value)} />
                                    <Input label="District" placeholder="e.g. Pune" type="text" value={form.addressInfo.current.district} onChange={e => updateAddress('current', 'district', e.target.value)} />
                                    <Input label="City" placeholder="e.g. Pune" type="text" value={form.addressInfo.current.city} onChange={e => updateAddress('current', 'city', e.target.value)} />
                                    <Input label="Pincode" placeholder="e.g. 411001" type="text" value={form.addressInfo.current.pincode} onChange={e => updateAddress('current', 'pincode', e.target.value)} />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Education Information</h2>
                        {educationEntries.map((entry, idx) => (
                            <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5 mb-4 bg-slate-50/50 dark:bg-slate-900/30">
                                <div className="flex justify-between mb-4">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Qualification #{idx + 1}</span>
                                    <button type="button" onClick={() => setEducationEntries(educationEntries.filter((_, i) => i !== idx))}
                                        className="text-red-500 hover:text-red-600 text-xs font-bold uppercase tracking-wider">Remove</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Input size="sm" label="Level" type="text" value={entry.level} onChange={e => updateEdu(idx, 'level', e.target.value)} placeholder="e.g. 10th, 12th, Graduation" />
                                    <Input size="sm" label="Board/University" placeholder="e.g. CBSE, State Board" type="text" value={entry.board} onChange={e => updateEdu(idx, 'board', e.target.value)} />
                                    <Input size="sm" label="Institution" placeholder="School / College Name" type="text" value={entry.institution} onChange={e => updateEdu(idx, 'institution', e.target.value)} />
                                    <Input size="sm" label="Roll Number" placeholder="e.g. 12345678" type="text" value={entry.rollNumber} onChange={e => updateEdu(idx, 'rollNumber', e.target.value)} />
                                    <Input size="sm" label="Passing Year" placeholder="e.g. 2023" type="text" value={entry.passingYear} onChange={e => updateEdu(idx, 'passingYear', e.target.value)} />
                                    <Input size="sm" label="Marks (%)" placeholder="e.g. 85.5" type="text" value={entry.marks} onChange={e => updateEdu(idx, 'marks', e.target.value)} />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={() => setEducationEntries([...educationEntries, { level: '', board: '', institution: '', rollNumber: '', passingYear: '', marks: '' }])}
                            className="text-primary text-sm font-bold hover:text-primary-dark transition-colors inline-flex items-center gap-1 mt-2 bg-primary/10 px-4 py-2 rounded-xl">+ Add Qualification</button>
                    </div>

                    {course?.requiredDocuments?.length > 0 && (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Document Upload</h2>
                            {course.requiredDocuments.map((doc, idx) => (
                                <div key={idx} className="mb-4">
                                    <Input
                                        label={`${doc.name} (${doc.allowedFormats?.join(', ')}, max ${doc.maxFileSize}MB)`}
                                        required={doc.required}
                                        type="file"
                                        accept={doc.allowedFormats?.map(f => `.${f}`).join(',')}
                                        multiple={doc.multiple}
                                        onChange={e => handleFileChange(doc.name, e.target.files)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Extra Information</h2>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1 mb-1.5">Description / Extra Details</label>
                            <textarea onChange={e => updateExtraInfo(e.target.value)} value={form.extraInformation} placeholder="Any additional information you would like to provide..."
                                className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 dark:text-white font-medium transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-slate-300 dark:hover:border-slate-600" rows={4} />
                        </div>
                    </div>

                    <button type="submit" disabled={submitting}
                        className="w-full py-4 bg-primary text-white rounded-xl text-base font-black shadow-lg shadow-primary/25 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 mt-8">
                        {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplyNowPage;