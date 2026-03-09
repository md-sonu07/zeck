import React, { useState, useEffect, useRef } from "react";
import {
    ChevronLeft, FileEdit, Printer, User, Building2,
    CreditCard, Save, Loader2, CheckCircle2, Eye, Download, X
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPaymentSlip, fetchPaymentSlipById } from "../../../store/slice/paymentSlipSlice";
import toast from "react-hot-toast";

const CreatePaymentSlipPage = () => {
    const [searchParams] = useSearchParams();
    const slipId = searchParams.get('slipId');
    const isViewMode = searchParams.get('view') === 'true';
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const invoiceRef = useRef(null);
    const { loading } = useSelector((state) => state.paymentSlips);
    const { settings: contactSettings } = useSelector((state) => state.contact);
    const [showPreview, setShowPreview] = useState(false);

    const [formData, setFormData] = useState({
        studentName: "",
        studentEmail: "",
        studentPhone: "",
        universityName: "",
        serviceType: "",
        appliedDate: new Date().toISOString().split('T')[0],
        subtotal: 0,
        processingFee: 0,
        total: 0,
        status: "APPROVED",
        invoiceNumber: `ZEC-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (isViewMode) {
            setShowPreview(true);
        }
    }, [isViewMode]);

    useEffect(() => {
        if (slipId) {
            dispatch(fetchPaymentSlipById(slipId))
                .unwrap()
                .then((data) => {
                    setFormData(prev => ({
                        ...prev,
                        ...data,
                        appliedDate: data.appliedDate ? new Date(data.appliedDate).toISOString().split('T')[0] : prev.appliedDate,
                        date: data.date ? new Date(data.date).toISOString().split('T')[0] : prev.date
                    }));
                });
        }
    }, [slipId, dispatch]);

    useEffect(() => {
        const sub = Number(formData.subtotal) || 0;
        const fee = Number(formData.processingFee) || 0;
        setFormData(prev => ({ ...prev, total: sub + fee }));
    }, [formData.subtotal, formData.processingFee]);

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
                            size: portrait;
                        }
                        body {
                            margin: 0;
                            padding: 10mm 15mm;
                            -webkit-print-color-adjust: exact; 
                            print-color-adjust: exact; 
                            background-color: white !important;
                        }
                    </style>
                </head>
                <body>
                    <div class="max-w-[800px] mx-auto">
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
        if (!formData.universityName) {
            toast.error('Service/University is required');
            return;
        }

        const loadingToast = toast.loading(slipId ? 'Updating...' : 'Generating...');
        try {
            await dispatch(createPaymentSlip(formData)).unwrap();
            toast.success('Done!', { id: loadingToast });
            setTimeout(() => navigate('/admin/payment-slips'), 500);
        } catch (err) {
            toast.error(err || 'Failed', { id: loadingToast });
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <button
                        onClick={() => navigate('/admin/payment-slips')}
                        className="flex items-center gap-1 text-slate-500 hover:text-primary transition-colors mb-2 text-sm font-bold"
                    >
                        <ChevronLeft size={16} /> Payment Slips
                    </button>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <FileEdit className="text-primary" />
                        {slipId ? 'Review & Edit Slip' : 'Create New Receipt'}
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    {slipId && (
                        <button onClick={handlePrint} className="btn-slate-premium">
                            <Printer size={18} /> Print Record
                        </button>
                    )}
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
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] ml-1">Full Name</label>
                                        <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} required
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white font-medium placeholder:text-slate-300 shadow-sm"
                                            placeholder="Student's legal name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] ml-1">Email ID</label>
                                        <input type="email" name="studentEmail" value={formData.studentEmail} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white font-medium placeholder:text-slate-300 shadow-sm"
                                            placeholder="student@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] ml-1">Phone Number</label>
                                        <input type="text" name="studentPhone" value={formData.studentPhone} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white font-medium placeholder:text-slate-300 shadow-sm"
                                            placeholder="+91 00000 00000"
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
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] ml-1">Service / University *</label>
                                        <input type="text" name="universityName" value={formData.universityName} onChange={handleChange} required
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white font-medium placeholder:text-slate-300 shadow-sm"
                                            placeholder="Target Institutional Service"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] ml-1">Service Type</label>
                                        <input type="text" name="serviceType" value={formData.serviceType} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white font-medium placeholder:text-slate-300 shadow-sm"
                                            placeholder="e.g. Documents Only"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] ml-1">Applied Date</label>
                                        <input type="date" name="appliedDate" value={formData.appliedDate} onChange={handleChange}
                                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-primary/10 outline-none transition-all dark:text-white font-bold"
                                        />
                                    </div>
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
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] ml-1">Subtotal (₹)</label>
                                        <input type="number" name="subtotal" value={formData.subtotal} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white font-bold text-lg shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.14em] ml-1">Proc. Fee (₹)</label>
                                        <input type="number" name="processingFee" value={formData.processingFee} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white font-bold text-lg shadow-sm"
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
                            <div className={`bg-white p-10 relative flex flex-col min-h-[700px] text-[#1e293b] ${showPreview ? "w-full max-w-[800px] rounded-2xl shadow-sm " : ""}`} ref={invoiceRef}>
                                {/* Watermark */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
                                    <span className="text-6xl font-black transform -rotate-45 block whitespace-nowrap text-slate-300 print:text-slate-900 tracking-tighter">ZOYA EDUCATION</span>
                                </div>

                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-widest border-b border-slate-50 pb-2">
                                    <span>PAYMENT SLIP ID: {formData.invoiceNumber}</span>
                                    <span>PRINTED: {new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase()}</span>
                                </div>

                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">🎓</span>
                                        <div>
                                            <p className="font-extrabold text-xl text-slate-800 tracking-tighter uppercase leading-none">ZOYA EDUCATION</p>
                                            <p className="font-bold text-[9px] tracking-[0.2em] text-slate-500 uppercase leading-none mt-1">CENTER</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100/50 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                        <CheckCircle2 size={12} />
                                        {formData.status.toUpperCase()}
                                    </div>
                                </div>

                                <div className="flex justify-between items-end mb-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">INVOICE NUMBER</p>
                                        <p className="font-bold text-lg text-slate-800 tracking-tight leading-none">{formData.invoiceNumber}</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">DATE</p>
                                        <p className="font-bold text-lg text-slate-800 tracking-tight leading-none">{new Date(formData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border border-slate-100 rounded-xl px-5 py-2.5 mb-8 text-[11px] font-bold text-slate-500 bg-slate-50/10">
                                    <div className="flex items-center gap-1.5 text-slate-600">📞 {contactSettings?.phoneNo || '+91 98765 43210'}</div>
                                    <div className="flex items-center gap-1.5 text-slate-600">✉️ {contactSettings?.email || 'support@zoyacenter.in'}</div>
                                </div>

                                <div className="space-y-8 flex-1">
                                    <div>
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-4 border-b border-slate-50 pb-1">STUDENT DETAILS</h3>
                                        <div className="grid grid-cols-[100px_1fr] gap-y-2 text-[13px]">
                                            <div className="text-slate-500 font-medium">Name</div><div className="text-right text-slate-800 font-bold">{formData.studentName || '—'}</div>
                                            <div className="text-slate-500 font-medium">Email</div><div className="text-right text-slate-800 font-medium">{formData.studentEmail || '—'}</div>
                                            {formData.studentPhone && (
                                                <><div className="text-slate-500 font-medium">Phone</div><div className="text-right text-slate-800 font-medium">{formData.studentPhone}</div></>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-4 border-b border-slate-50 pb-1">SERVICE DETAILS</h3>
                                        <div className="grid grid-cols-[100px_1fr] gap-y-2 text-[13px]">
                                            <div className="text-slate-500 font-medium">Service</div><div className="text-right text-slate-800 font-bold">{formData.universityName || '—'}</div>
                                            <div className="text-slate-500 font-medium">Type</div><div className="text-right text-blue-600 font-bold">{formData.serviceType || 'Documents Only'}</div>
                                            <div className="text-slate-500 font-medium">Applied Date</div><div className="text-right text-slate-800 font-medium">{new Date(formData.appliedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#f0fdf4] border border-emerald-100 rounded-2xl p-6 mt-10 shadow-sm">
                                    <p className="text-[13px] font-black text-slate-800 mb-3">Payment Summary</p>
                                    <div className="space-y-3 text-[13px] font-medium border-b border-dashed border-emerald-200 pb-4 mb-3">
                                        <div className="flex justify-between text-slate-600"><span>Subtotal</span><span className="text-slate-800">₹{formData.subtotal.toLocaleString()}</span></div>
                                        <div className="flex justify-between text-slate-600"><span>Processing Fee</span><span className="text-slate-800">₹{formData.processingFee.toLocaleString()}</span></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[15px] font-black text-slate-800 uppercase tracking-tighter">Total</span>
                                        <span className="text-3xl font-black text-emerald-600 tracking-tighter">₹{formData.total.toLocaleString()}</span>
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
