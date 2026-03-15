import React, { useRef, useEffect } from 'react';
import { X, Printer, FileText } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContactSettings } from '../store/thunk/contactThunk';


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
    const invoiceNumber = `ZEC-${Date.now().toString().slice(-4)}`;

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
                    <div class="print-container">
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

                {/* Actual Receipt Template Wrapper */}
                <div className="py-10 flex justify-center w-full">
                    <div className="bg-white p-4 relative flex flex-col min-h-[520px] text-slate-800 w-full max-w-[600px] rounded-2xl shadow-sm border border-slate-100" ref={invoiceRef}>
                        {/* Watermark Text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08]">
                            <div className="transform -rotate-45 text-center select-none">
                                <div className="text-7xl font-black text-slate-500/80 tracking-tighter uppercase whitespace-nowrap leading-none">ZOYA EDUCATION</div>
                                <div className="text-5xl font-black text-slate-500/80 tracking-[0.2em] uppercase leading-none mt-2">CENTRE</div>
                            </div>
                        </div>

                        {/* Header */}
                        <div className="relative z-10 border-2 border-slate-800 rounded-xl p-2 mb-2">
                            <div className="flex items-center gap-4">
                                {/* Logo Icon */}
                                <div className="w-24 h-24 rounded-full bg-[#00196a] flex items-center justify-center overflow-hidden shrink-0">
                                    <img src="/logo/crop-logoo.png" alt="Logo" className="w-full h-full object-contain p-1 shadow-indigo-800 shadow-2xl" />
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
                                <span className="text-lg font-black font-mono border-b border-dotted border-slate-400 min-w-[60px]">{invoiceNumber.slice(-4)}</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="font-bold text-slate-600">Date</span>
                                <span className="text-lg font-black font-mono border-b border-dotted border-slate-400">{new Date(application.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replaceAll('/', '-')}</span>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 space-y-1.5 px-2">
                            {/* Candidate Name */}
                            <div className="flex items-baseline gap-2">
                                <span className="font-bold text-slate-600 whitespace-nowrap">Candidate Name</span>
                                <div className="flex-1 pl-4  font-black text-lg border-b border-dotted border-slate-400 pb-1 italic text-blue-900">
                                    {application.user?.name || '..........................................................'}
                                </div>
                            </div>

                            {/* Candidate Phone */}
                            <div className="flex items-baseline gap-2">
                                <span className="font-bold text-slate-600 whitespace-nowrap">Candidate Phone</span>
                                <div className="flex-1 pl-4  font-black text-lg border-b border-dotted border-slate-400 pb-1 text-slate-700">
                                    {application.user?.phone || '..........................................................'}
                                </div>
                            </div>

                            {/* University Row */}
                            <div className="flex items-baseline gap-2">
                                <span className="font-bold text-slate-600 whitespace-nowrap">University Name</span>
                                <div className="flex-1 pl-4  font-black text-lg border-b border-dotted border-slate-400 pb-1 text-slate-700">
                                    {application.article?.subCategory || '..........................................................'}
                                </div>
                            </div>

                            {/* Course Row */}
                            <div className="flex items-baseline gap-2">
                                <span className="font-bold text-slate-600 whitespace-nowrap">Course Name</span>
                                <div className="flex-1 pl-8  font-black text-lg border-b border-dotted border-slate-400 pb-1 text-slate-700">
                                    {application.article?.resourceType || '..........................................................'}
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
                                                {application.amount > 0 ? application.amount.toLocaleString() : '..........'}/-
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
                                                ₹{application.amount?.toLocaleString()}/-
                                            </span>
                                        </div>
                                    </div>

                                    {/* Advance Row */}
                                    <div className="flex items-end gap-2">
                                        <span className="font-extrabold text-[12px] text-slate-500 uppercase tracking-tight pb-1">Advance</span>
                                        <div className="flex-1 border-b border-dotted border-slate-300 flex justify-start pl-12">
                                            <span className="text-lg font-black italic text-[#1e40af] tracking-tight">
                                                ₹{application.amount?.toLocaleString()}/-
                                            </span>
                                        </div>
                                    </div>

                                    {/* Dues Row */}
                                    <div className="flex items-end gap-2">
                                        <span className="font-extrabold text-[12px] text-slate-500 uppercase tracking-tight pb-1">Dues</span>
                                        <div className="flex-1 border-b border-dotted border-slate-300 flex justify-start pl-18 print:pl-20">
                                            <span className="text-lg font-black italic text-[#1e40af] tracking-tight">
                                                ₹0/-
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Signature Footer */}
                        <div className="mt-12 flex justify-between items-end px-2 pb-1">
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
    );
};

export default InvoiceModal;
