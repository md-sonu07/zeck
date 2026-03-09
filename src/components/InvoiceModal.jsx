import React, { useRef, useEffect } from 'react';
import { X, Printer, CheckCircle2, FileText } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContactSettings } from '../store/thunk/contactThunk';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const InvoiceModal = ({ application, onClose }) => {
    const invoiceRef = useRef(null);
    const dispatch = useDispatch();
    const { settings: contactSettings } = useSelector((state) => state.contact);

    useEffect(() => {
        if (!contactSettings) {
            dispatch(fetchContactSettings());
        }
    }, [dispatch, contactSettings]);

    if (!application) return null;

    // Generate invoice number from ID
    const invoiceNumber = `ZEC-${new Date(application.createdAt).getFullYear()}-${application._id?.slice(-4).toUpperCase() || '0000'}`;

    const statusStyles = {
        pending: { bg: '#fef3c7', text: '#92400e', label: 'PENDING' },
        approved: { bg: '#d1fae5', text: '#065f46', label: 'APPROVED' },
        rejected: { bg: '#fee2e2', text: '#991b1b', label: 'REJECTED' },
    };

    const currentStatus = statusStyles[application.status] || statusStyles.pending;

    const handlePrint = () => {
        const printContent = invoiceRef.current;
        if (!printContent) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>${invoiceNumber} - Zoya Education Center</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        /* Zero-out browser margins to hide default header/footer completely */
                        @page { 
                            margin: 0; 
                            size: portrait;
                        }
                        body {
                            margin: 0;
                            padding: 10mm 15mm; /* Apply padding internally so content isn't flush against paper edge */
                            -webkit-print-color-adjust: exact; 
                            print-color-adjust: exact; 
                            background-color: white !important;
                        }
                    </style>
                </head>
                <body>
                    <!-- Removed mx-auto w-full as it's full paper width anyway -->
                    <div class="max-w-[800px] mx-auto text-nowrap">
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


    return (
        <div className="fixed w-full h-full inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-[850px] max-h-[90vh] overflow-y-auto overflow-x-hidden hide-scrollbar rounded-3xl bg-slate-50 dark:bg-slate-900 animate-in zoom-in-95 fade-in duration-300">
                <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-t-3xl border-b border-slate-200 dark:border-slate-700/60 sticky top-0 z-20">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-sm">
                        <FileText size={18} className="text-primary" />
                        Receipt Preview
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm border border-slate-200 dark:border-slate-700"
                        >
                            <Printer size={16} />
                            Print / Save PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* ===== INVOICE CARD ===== */}
                <div className="flex justify-center w-full py-8 text-black">
                    {/* THE ACTUAL SLIP TEMPLATE TO PRINT */}
                    <div className="bg-white overflow-hidden p-8 print:p-4 print:pt-0 relative w-full max-w-[800px]" ref={invoiceRef}>

                        {/* Visual Timestamp header (Matches what would be printed if it were still enabled) */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] sm:text-xs font-bold text-slate-400 mb-4 border-b border-slate-100 pb-2 uppercase tracking-wider gap-2 sm:gap-0">
                            <span>Document: {invoiceNumber}</span>
                            <span>PRINTED: {new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                        </div>

                        {/* Header */}
                        <div className="flex justify-between items-start mb-10 print:mb-4 border-b border-slate-100 pb-8 print:pb-3">
                            <div className="flex items-center gap-3">
                                {/* Use Logo if available, fallback to icon */}
                                <div className="text-3xl text-amber-500">🎓</div>
                                <div>
                                    <h1 className="font-extrabold text-xl tracking-tight text-slate-800 uppercase leading-none">ZOYA EDUCATION</h1>
                                    <h2 className="font-bold text-sm tracking-widest text-slate-500 uppercase">CENTER</h2>
                                </div>
                            </div>
                            <div className={`flex items-center gap-1.5 font-bold px-3 py-1 rounded-full text-sm ${application.status === 'approved' ? 'text-emerald-600 bg-emerald-50' : application.status === 'rejected' ? 'text-red-600 bg-red-50' : 'text-amber-600 bg-amber-50'}`}>
                                <CheckCircle2 size={16} />
                                {currentStatus.label}
                            </div>
                        </div>

                        {/* Invoice & Date Info */}
                        <div className="flex justify-between items-end mb-8 print:mb-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Invoice Number</p>
                                <p className="font-bold text-lg text-slate-800">{invoiceNumber}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</p>
                                <p className="font-bold text-lg text-slate-800">
                                    {new Date(application.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* Contact info banner */}
                        <div className="flex justify-between items-center border border-slate-200 rounded-xl p-4 print:py-2 print:px-3 mb-10 print:mb-4 text-sm font-medium text-slate-600">
                            <div className="flex items-center gap-2">
                                <span>📞</span> {contactSettings?.phoneNo || '+91 98765 43210'}
                            </div>
                            <div className="flex items-center gap-2">
                                <span>✉️</span> {contactSettings?.email || 'zoyaeducation@gmail.com'}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="mb-12 print:mb-4 space-y-8 print:space-y-3 relative">
                            {/* Watermark effect under details */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                                <span className="text-6xl font-black transform -rotate-45 block whitespace-nowrap text-slate-900">ZOYA EDUCATION</span>
                            </div>

                            {/* Student Details block */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 print:mb-2">Student Details</h3>
                                <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm font-medium">
                                    <div className="text-slate-500">Name</div>
                                    <div className="text-right text-slate-800 text-base">{application.user?.name || '—'}</div>

                                    <div className="text-slate-500">Email</div>
                                    <div className="text-right text-slate-800">{application.user?.email || '—'}</div>

                                    {application.user?.phone && (
                                        <>
                                            <div className="text-slate-500">Phone</div>
                                            <div className="text-right text-slate-800">{application.user.phone}</div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Service Details block */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 print:mb-2 mt-8 print:mt-4">Service Details</h3>
                                <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm font-medium">
                                    <div className="text-slate-500">Service</div>
                                    <div className="text-right text-slate-800 text-base font-semibold">{application.article?.title || '—'}</div>

                                    <div className="text-slate-500">Type</div>
                                    <div className="text-right text-blue-600 font-semibold">{application.paymentType === 'payment' ? 'Full Payment' : 'Documents Only'}</div>

                                    <div className="text-slate-500">Applied Date</div>
                                    <div className="text-right text-slate-800">
                                        {new Date(application.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary Box */}
                        <div className="border border-emerald-100 bg-emerald-50/30 rounded-2xl p-6 print:p-3 mb-8 print:mb-2 mt-12 print:mt-4">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 print:mb-1.5">Payment Summary</h3>

                            <div className="space-y-3 print:space-y-1 text-sm font-medium border-b border-dashed border-emerald-200 pb-4 print:pb-2 mb-4 print:mb-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Subtotal</span>
                                    <span className="text-slate-800">₹{application.amount?.toLocaleString() || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Processing Fee</span>
                                    <span className="text-slate-800">₹0</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <span className="text-base font-bold text-slate-800">Total</span>
                                <span className="text-3xl print:text-2xl font-black text-emerald-600 tracking-tight">₹{application.amount?.toLocaleString() || 0}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-xs font-medium text-slate-500 mt-16 print:mt-4 pb-4 print:pb-0">
                            Thank you for choosing Zoya Education Center! 🙏
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InvoiceModal;
