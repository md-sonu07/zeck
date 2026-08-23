import React, { useState, useEffect, useRef } from "react";
import {
    ChevronLeft, FileEdit, Printer, User, Building2,
    CreditCard, Save, Loader2, Eye, X, ChevronDown, ArrowLeft
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPaymentSlip, fetchPaymentSlipById, updatePaymentSlip } from "../../../store/slice/paymentSlipSlice";
import { fetchSlipSettings } from "../../../store/thunk/slipSettingThunk";
import toast from "react-hot-toast";

const PremiumSelect = ({ label, name, value, options, onChange, placeholder, required, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-2" ref={containerRef}>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] ml-1">
                {label} {required && '*'}
            </label>
            <div className="relative">
                {/* Trigger - Simple & matches user's preferred style */}
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full px-4 py-3 bg-white dark:bg-slate-900 border ${isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200 dark:border-slate-700'} rounded-xl transition-all dark:text-white font-medium shadow-sm cursor-pointer flex justify-between items-center group`}
                >
                    <span className={!value ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200'}>
                        {value || placeholder}
                    </span>
                    <ChevronDown className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} size={18} />
                </div>

                {/* Decorated Open Part */}
                {isOpen && (
                    <div className="absolute z-[100] w-full mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-2 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                        <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                            {options?.length > 0 ? (
                                options.map((option, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            onChange({ target: { name, value: option } });
                                            setIsOpen(false);
                                        }}
                                        className={`px-4 py-3 text-sm font-semibold transition-all cursor-pointer flex items-center gap-3
                                            ${value === option
                                                ? 'bg-primary/5 text-primary border-r-4 border-primary'
                                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:pl-6'
                                            }`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${value === option ? 'bg-primary scale-125' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                        {option}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-6 text-center space-y-2">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter italic">No selections found</p>
                                    <p className="text-[10px] text-slate-300 dark:text-slate-600">Add them in Slip Settings</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const CreatePaymentSlipPage = () => {
    const [searchParams] = useSearchParams();
    const slipId = searchParams.get('slipId');
    const isViewMode = searchParams.get('view') === 'true';
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const invoiceRef = useRef(null);
    const { loading } = useSelector((state) => state.paymentSlips);
    const { settings: contactSettings } = useSelector((state) => state.contact);
    const { settings: slipSettings } = useSelector((state) => state.slipSetting);
    const [showPreview, setShowPreview] = useState(false);

    const [formData, setFormData] = useState({
        studentName: "",
        studentPhone: "",
        universityName: "",
        serviceType: "",
        total: 0,
        processingFee: 0,
        subtotal: 0,
        status: "APPROVED",
        invoiceNumber: `ZEC-${Date.now().toString().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (isViewMode) {
            setShowPreview(true);
        }
    }, [isViewMode]);

    useEffect(() => {
        dispatch(fetchSlipSettings());
        if (slipId) {
            dispatch(fetchPaymentSlipById(slipId))
                .unwrap()
                .then((data) => {
                    setFormData(prev => ({
                        ...prev,
                        ...data,
                        date: data.date ? new Date(data.date).toISOString().split('T')[0] : (data.appliedDate ? new Date(data.appliedDate).toISOString().split('T')[0] : prev.date)
                    }));
                });
        }
    }, [slipId, dispatch]);

    useEffect(() => {
        const tot = Number(formData.total) || 0;
        const adv = Number(formData.processingFee) || 0;
        setFormData(prev => ({ ...prev, subtotal: tot - adv }));
    }, [formData.total, formData.processingFee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePrint = () => {
        const printContent = invoiceRef.current;
        if (!printContent) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>${formData.invoiceNumber} - Zoya Education Center</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        @page { 
                            margin: 0; 
                            size: 148mm 210mm; /* A5 Size (Exactly half of A4) */
                        }
                        body {
                            margin: 0;
                            padding: 10mm; 
                            -webkit-print-color-adjust: exact; 
                            print-color-adjust: exact; 
                            background-color: white !important;
                            font-family: ui-sans-serif, system-ui, sans-serif;
                        }
                        /* Control the container size to match A5 width */
                        .print-container {
                            width: 128mm; /* 148mm - 20mm (10mm padding each side) */
                            margin: 0 auto;
                        }
                    </style>
                </head>
                <body>
                    <div class="print-container border-2 border-slate-800 rounded-xl p-4">
                        ${printContent.innerHTML}
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 1000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Robust edit mode detection
        const effectiveId = slipId || formData?._id;
        const isEdit = !!effectiveId;

        // console.log('SUBMITTING SLIP - isEdit:', isEdit, 'id:', effectiveId, 'formData:', formData);

        if (!formData.universityName) {
            toast.error('Service/University is required');
            return;
        }

        const loadingToast = toast.loading(isEdit ? 'Updating...' : 'Generating...');
        try {
            if (isEdit) {
                await dispatch(updatePaymentSlip({ id: effectiveId, formData })).unwrap();
            } else {
                await dispatch(createPaymentSlip(formData)).unwrap();
            }
            toast.success('Done!', { id: loadingToast });
            setTimeout(() => navigate('/admin/payment-slips'), 500);
        } catch (err) {
            toast.error(err || 'Failed', { id: loadingToast });
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Page Header */}
            <div className="flex items-start gap-4 pb-6">
                <button
                    onClick={() => navigate('/admin/payment-slips')}
                    className="mt-1.5 p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-90"
                    title="Go Back"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                        {slipId ? 'Review & Edit Slip' : 'Create New Receipt'}
                    </h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                        {slipId ? 'Update details for this invoice record and save changes.' : 'Issue a fresh payment confirmation and generate a receipt.'}
                    </p>
                </div>
            </div>

            <div className="flex justify-center items-start">
                <div className="w-full max-w-4xl">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-8 space-y-10">

                            {/* Student Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-700/50 pb-3">
                                    <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                        <User size={18} />
                                    </div>
                                    <h2 className="text-[17px] font-black text-slate-800 dark:text-white uppercase tracking-tight">Student Information</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] ml-1">Candidate Name</label>
                                        <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} required
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white font-medium placeholder:text-slate-300 shadow-sm"
                                            placeholder="Candidate's name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] ml-1">Candidate Phone</label>
                                        <input type="text" name="studentPhone" value={formData.studentPhone} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white font-medium placeholder:text-slate-300 shadow-sm"
                                            placeholder="+91 00000 00000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] ml-1">Apply Date</label>
                                        <input type="date" name="date" value={formData.date} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/10 outline-none transition-all dark:text-white font-bold shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Service Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-700/50 pb-3">
                                    <div className="size-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                        <Building2 size={18} />
                                    </div>
                                    <h2 className="text-[17px] font-black text-slate-800 dark:text-white uppercase tracking-tight">Service & Academic</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <PremiumSelect
                                        label="University Name"
                                        name="universityName"
                                        value={formData.universityName}
                                        options={slipSettings?.universities}
                                        onChange={handleChange}
                                        placeholder="Select University"
                                        required
                                    />
                                    <PremiumSelect
                                        label="Course Name"
                                        name="serviceType"
                                        value={formData.serviceType}
                                        options={slipSettings?.courses}
                                        onChange={handleChange}
                                        placeholder="Select Course"
                                    />
                                </div>
                            </div>

                            {/* Summary Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-700/50 pb-3">
                                    <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                        <CreditCard size={18} />
                                    </div>
                                    <h2 className="text-[17px] font-black text-slate-800 dark:text-white uppercase tracking-tight">Amount Summary</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] ml-1">Total Fee (₹)</label>
                                        <input type="number" name="total" value={formData.total} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white font-bold text-lg shadow-sm"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] ml-1">Advance (₹)</label>
                                        <input type="number" name="processingFee" value={formData.processingFee} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white font-bold text-lg shadow-sm"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] ml-1">Dues (₹)</label>
                                        <input type="number" name="subtotal" value={formData.subtotal} readOnly
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white font-bold text-lg shadow-sm hover:cursor-not-allowed opacity-80"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-100 dark:border-slate-700/50 mt-8 pt-8">
                                <button type="submit" disabled={loading}
                                    className="flex-1 py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-md transition-all active:scale-[0.98] text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {slipId ? 'Update Record' : 'Save Record'}
                                </button>

                                <div className="flex gap-4 w-full sm:w-auto">
                                    <button type="button" onClick={() => setShowPreview(true)}
                                        className="w-full sm:w-auto px-6 py-4 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all uppercase text-[10px] sm:text-xs tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <Eye size={16} /> Preview
                                    </button>
                                    <button type="button" onClick={handlePrint}
                                        className="w-full sm:w-auto px-6 py-4 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all uppercase text-[10px] sm:text-xs tracking-widest flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-600"
                                    >
                                        <Printer size={16} /> Print
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Live Preview (Hidden or Modal) */}
                <div className={showPreview ? "fixed inset-0 z-[100] flex items-center justify-center p-4" : "hidden"}>
                    {/* Backdrop */}
                    {showPreview && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowPreview(false)}></div>}

                    {/* Modal Content container */}
                    <div className={showPreview ? "relative w-full max-w-[850px] max-h-[90vh] overflow-y-auto overflow-x-hidden hide-scrollbar rounded-3xl bg-slate-50 dark:bg-slate-900 animate-in zoom-in-95 fade-in duration-300" : ""}>

                        {/* Modal Action Bar */}
                        {showPreview && (
                            <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-t-3xl border-b border-slate-200 dark:border-slate-700/60 sticky top-0 z-20">
                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-sm">
                                    <FileEdit size={18} className="text-primary" />
                                    Receipt Preview
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={handlePrint} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold transition border border-slate-200">
                                        <Printer size={16} /> Print Receipt
                                    </button>
                                    <button onClick={() => setShowPreview(false)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition border border-slate-200">
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Actual Receipt Template Wrapper */}
                        <div className={showPreview ? "py-10 flex justify-center w-full" : ""}>
                            <div className={`bg-white p-4 relative flex flex-col min-h-[520px] border-2 border-slate-800 rounded-xl text-slate-800 ${showPreview ? "w-full max-w-[600px] rounded-2xl shadow-sm border border-slate-100" : ""}`} ref={invoiceRef}>
                                {/* Watermark Text */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08]">
                                    <div className="transform -rotate-45 text-center select-none">
                                        <div className="text-7xl font-black text-slate-500/80 tracking-tighter uppercase whitespace-nowrap leading-none">ZOYA EDUCATION</div>
                                        <div className="text-5xl font-black text-slate-500/80 tracking-[0.2em] uppercase leading-none mt-2">CENTRE</div>
                                    </div>
                                </div>

                                {/* Header */}
                                <div className="relative z-10 border-b-2 border-slate-800 p-2 mb-2">
                                    <div className="flex items-center gap-4">
                                        {/* Logo Icon */}
                                        <div className="w-24 h-24 rounded-full bg-[#00196a] flex items-center justify-center overflow-hidden shrink-0">
                                            <img src="/logo/light-logo.png" alt="Logo" className="w-full h-full object-contain p-1 shadow-indigo-800 shadow-2xl" />
                                        </div>
                                        <div className="flex-1 text-center pt-1">
                                            <h1 className="text-3xl font-black text-[#00196a] tracking-tight uppercase leading-tight">ZOYA EDUCATION</h1>
                                            <div className="text-[22px] font-black text-[#00196a] tracking-[0.25em] mb-1 uppercase">CENTRE</div>

                                            <div className="flex flex-col items-center gap-1 mt-2">
                                                <p className="text-sm font-bold italic text-slate-600">
                                                    Main Road Kursakanta, Araria (Bihar) 854331
                                                </p>
                                                <p className="text-sm font-black text-emerald-600 tracking-widest uppercase">
                                                    Mob: {contactSettings?.phoneNo || '9162653235'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Receipt Title */}
                                <div className="flex justify-center mb-2">
                                    <div className="bg-[#b91c1c] text-white px-6 py-1 rounded-lg text-xs font-black tracking-widest uppercase shadow-sm">
                                        ADMISSION FEE RECEIPT
                                    </div>
                                </div>

                                {/* Ref & Date Row */}
                                <div className="flex justify-between items-center mb-2 px-2 text-xs">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-slate-600">Ref No-</span>
                                        <span className="text-lg font-black font-mono border-b border-dotted border-slate-400 min-w-[60px]">{formData.invoiceNumber.slice(-4)}</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-slate-600">Date</span>
                                        <span className="text-lg font-black font-mono border-b border-dotted border-slate-400">{new Date(formData.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replaceAll('/', '-')}</span>
                                    </div>
                                </div>

                                {/* Main Content Area */}
                                <div className="flex-1 space-y-1.5 px-2">
                                    {/* Candidate Name */}
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-slate-600 whitespace-nowrap">Candidate Name</span>
                                        <div className="flex-1 pl-4  font-black text-lg border-b border-dotted border-slate-400 pb-1 italic text-blue-900">
                                            {formData.studentName || '..........................................................'}
                                        </div>
                                    </div>

                                    {/* Candidate Phone */}
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-slate-600 whitespace-nowrap">Candidate Phone</span>
                                        <div className="flex-1 pl-4  font-black text-lg border-b border-dotted border-slate-400 pb-1 text-slate-700">
                                            {formData.studentPhone || '..........................................................'}
                                        </div>
                                    </div>

                                    {/* University Row */}
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-slate-600 whitespace-nowrap">University Name</span>
                                        <div className="flex-1 pl-4  font-black text-lg border-b border-dotted border-slate-400 pb-1 text-slate-700">
                                            {formData.universityName || '..........................................................'}
                                        </div>
                                    </div>

                                    {/* Course Row */}
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold text-slate-600 whitespace-nowrap">Course Name</span>
                                        <div className="flex-1 pl-8  font-black text-lg border-b border-dotted border-slate-400 pb-1 text-slate-700">
                                            {formData.serviceType || '..........................................................'}
                                        </div>
                                    </div>



                                    {/* Fee Summary Grid */}
                                    <div className="grid grid-cols-2 gap-8 pt-4">
                                        <div className="space-y-6">
                                            {/* Advance Box */}
                                            <div className="border-[3px] border-emerald-500 rounded-xl overflow-hidden shadow-sm flex items-center">
                                                <div className="bg-emerald-500 text-white py-2 px-4 flex items-center justify-center">
                                                    <span className="text-xl font-black">₹</span>
                                                </div>
                                                <div className="flex-1 text-center py-1.5 px-3">
                                                    <span className="text-2xl font-black italic text-slate-800 tracking-tighter">
                                                        {formData.processingFee > 0 ? formData.processingFee.toLocaleString() : '..........'}/-
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Payment Status Label */}
                                            <div className="border border-slate-200 rounded-lg p-2 text-center border-dashed">
                                                <p className="text-[#b91c1c] font-black text-xs mb-0.5">Payment</p>
                                                <p className="text-emerald-700 font-black text-[10px] uppercase tracking-tighter">Not Refundable</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-1">
                                            {/* Total Fee Row */}
                                            <div className="flex items-end gap-2">
                                                <span className="font-extrabold text-[12px] text-slate-500 uppercase tracking-tight pb-1">Total Fee</span>
                                                <div className="flex-1 border-b border-dotted border-slate-300 flex justify-start pl-10">
                                                    <span className="text-lg font-black italic text-[#1e40af] tracking-tight">
                                                        ₹{formData.total.toLocaleString()}/-
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Advance Row */}
                                            <div className="flex items-end gap-2">
                                                <span className="font-extrabold text-[12px] text-slate-500 uppercase tracking-tight pb-1">Advance</span>
                                                <div className="flex-1 border-b border-dotted border-slate-300 flex justify-start pl-12">
                                                    <span className="text-lg font-black italic text-[#1e40af] tracking-tight">
                                                        ₹{formData.processingFee.toLocaleString()}/-
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Dues Row */}
                                            <div className="flex items-end gap-2">
                                                <span className="font-extrabold text-[12px] text-slate-500 uppercase tracking-tight pb-1">Dues</span>
                                                <div className="flex-1 border-b border-dotted border-slate-300 flex justify-start pl-18 print:pl-20">
                                                    <span className="text-lg font-black italic text-[#1e40af] tracking-tight">
                                                        ₹{formData.subtotal.toLocaleString()}/-
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Important Notice - Admission Cancellation & Refund Policy */}
                                <div className="mt-6 border-2 border-red-600 rounded-lg bg-red-50 px-3 py-2.5">
                                    <h4 className="text-center text-[11px] font-black text-red-700 leading-none">★ महत्वपूर्ण सूचना ★</h4>
                                    <h5 className="text-center text-[10px] font-extrabold text-slate-800 mt-1 leading-none">Admission Cancellation एवं Fee Refund Policy</h5>
                                    <p className="text-[9px] leading-snug text-slate-700 mt-1.5 text-justify">
                                        सभी विद्यार्थियों एवं अभिभावकों को सूचित किया जाता है कि <span className="font-bold text-slate-800">Admission/नामांकन</span> हो जाने के बाद यदि कोई विद्यार्थी किसी भी कारणवश अपना <span className="font-bold text-red-700">Admission Cancel</span> कराता है या संस्था/कॉलेज छोड़ता है, तो जमा की गई <span className="font-bold">Admission Fee, Course Fee</span> अथवा अन्य किसी भी प्रकार की भुगतान राशि <span className="font-bold text-red-700">Refund/वापस नहीं की जाएगी।</span>
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-800 text-right mt-1 leading-tight">धन्यवाद।<br/>प्रबंधन — ZOYA EDUCATION CENTRE & TRUST</p>
                                </div>

                                {/* Signature Footer */}
                                <div className="mt-6 flex justify-between items-end px-2 pb-1">
                                    <div className="text-left space-y-1">
                                        <p className="text-[10px] font-black text-slate-500 uppercase">Admission Drictor</p>
                                        <p className="font-black text-lg text-blue-900 tracking-tight">Mr. Ashfak</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="w-40 border-b-2 border-slate-800 mb-2 relative">
                                            {/* Optional Seal representation */}
                                            <div className="absolute -top-18 print:-top-16 right-0 opacity-20 transform -rotate-12">
                                                <div className="w-28 h-28 rounded-full border-4 border-blue-900 flex items-center justify-center p-1">
                                                    <div className="w-full h-full rounded-full border-2 border-blue-900 border-dashed flex items-center justify-center text-[8px] font-black text-blue-900 text-center uppercase">
                                                        ZOYA EDUCATION CENTRE
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Receiver's Signature</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePaymentSlipPage;
