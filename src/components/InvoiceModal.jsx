import React, { useRef } from 'react';
import { X, Download, Printer, Share2, Phone, Mail, MapPin, GraduationCap, Calendar, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const InvoiceModal = ({ application, onClose }) => {
    const invoiceRef = useRef(null);

    // Add this style object outside render properly wrapped later inline
    if (!application) return null;

    // Generate invoice number from ID
    const invoiceNumber = `ZEC-${new Date(application.createdAt).getFullYear()}-${application._id?.slice(-4).toUpperCase() || '0000'}`;

    const statusStyles = {
        pending: { bg: '#fef3c7', text: '#92400e', label: 'PENDING' },
        approved: { bg: '#d1fae5', text: '#065f46', label: 'APPROVED' },
        rejected: { bg: '#fee2e2', text: '#991b1b', label: 'REJECTED' },
    };

    const currentStatus = statusStyles[application.status] || statusStyles.pending;

    const handleDownloadPDF = async () => {
        const element = invoiceRef.current;
        if (!element) return;

        try {
            // Apply a small reset to fix responsive bug in html2canvas
            const originalWidth = element.style.width;
            element.style.width = '794px';
            element.style.height = '1123px'; // A4 proportional strictness

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                windowWidth: 794,
                width: 794
            });

            // recover
            element.style.width = originalWidth;
            element.style.height = 'auto';

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${invoiceNumber}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    const handlePrint = () => {
        const element = invoiceRef.current;
        if (!element) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${invoiceNumber} - Zoya Education Center</title>
                    <style>
                        body { margin: 0; padding: 20px; font-family: 'Inter', 'Segoe UI', sans-serif; background: #fff;}
                        * { box-sizing: border-box; }
                        @media print {
                            body { padding: 0; }
                            @page { margin: 0.5cm; }
                        }
                    </style>
                </head>
                <body>
                   <div style="max-width: 794px; width: 100%; margin: 0 auto; overflow: hidden;">
                      ${element.innerHTML}
                   </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    const handleWhatsAppShare = () => {
        const message = `🧾 *Payment Receipt - Zoya Education Center*\n\n📋 Invoice: ${invoiceNumber}\n�� Date: ${new Date(application.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\n\n👤 Student: ${application.user?.name || 'N/A'}\n📧 Email: ${application.user?.email || 'N/A'}\n\n📚 Service: ${application.article?.title || 'N/A'}\n💳 Type: ${application.paymentType === 'payment' ? 'Full Payment' : 'Documents Only'}\n💰 Amount: ₹${application.amount?.toLocaleString()}\n\n✅ Status: ${application.status?.toUpperCase()}\n\n🙏 Thank you for choosing Zoya Education Center!`;

        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed w-full h-full inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-[850px] max-h-[90vh] overflow-y-auto overflow-x-hidden hide-scrollbar rounded-3xl bg-slate-50 dark:bg-slate-900 animate-in zoom-in-95 fade-in duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white shadow-md transition-all"
                >
                    <X size={18} />
                </button>

                {/* ===== INVOICE CARD ===== */}
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '20px 0' }}>
                    <div ref={invoiceRef} style={{ boxSizing: 'border-box', width: '100%', maxWidth: '794px', background: '#ffffff', color: '#0f172a', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
                        <div style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>

                            {/* Watermark */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%) rotate(-35deg)',
                                fontSize: '60px',
                                fontWeight: '900',
                                color: 'rgba(0,0,0,0.03)',
                                whiteSpace: 'nowrap',
                                pointerEvents: 'none',
                                letterSpacing: '8px',
                                zIndex: 0,
                            }}>
                                ZOYA EDUCATION
                            </div>

                            {/* Content */}
                            <div style={{ position: 'relative', zIndex: 1, boxSizing: 'border-box' }}>

                                {/* Header */}
                                <table style={{ width: '100%', marginBottom: '32px', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ verticalAlign: 'top' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '48px', height: '48px', borderRadius: '12px',
                                                        background: 'linear-gradient(135deg, #1e293b, #334155)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        <span style={{ fontSize: '24px' }}>🎓</span>
                                                    </div>
                                                    <div>
                                                        <h1 style={{ fontSize: '18px', fontWeight: '900', margin: 0, color: '#1e293b', letterSpacing: '-0.5px' }}>ZOYA EDUCATION</h1>
                                                        <p style={{ fontSize: '13px', fontWeight: '700', margin: 0, color: '#1e293b' }}>CENTER</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ verticalAlign: 'top', textAlign: 'right' }}>
                                                <span style={{
                                                    padding: '6px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: '800',
                                                    letterSpacing: '1px',
                                                    background: application.status === 'approved' ? '#d1fae5' : application.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                                                    color: application.status === 'approved' ? '#065f46' : application.status === 'rejected' ? '#991b1b' : '#92400e',
                                                    display: 'inline-block'
                                                }}>
                                                    ✅ {currentStatus.label}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Invoice Meta */}
                                <table style={{ width: '100%', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px dashed #e2e8f0', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: '50%', verticalAlign: 'top' }}>
                                                <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', margin: '0 0 2px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Invoice Number</p>
                                                <p style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b', margin: 0 }}>{invoiceNumber}</p>
                                            </td>
                                            <td style={{ width: '50%', verticalAlign: 'top', textAlign: 'right' }}>
                                                <p style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', margin: '0 0 2px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</p>
                                                <p style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                                                    {new Date(application.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Contact Info */}
                                <div style={{
                                    background: '#f8fafc', borderRadius: '16px', padding: '20px', marginBottom: '24px',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ width: '50%', verticalAlign: 'middle' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontSize: '14px' }}>📞</span>
                                                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>+91 98765 43210</span>
                                                    </div>
                                                </td>
                                                <td style={{ width: '50%', verticalAlign: 'middle' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontSize: '14px' }}>📧</span>
                                                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>zoyaeducation@gmail.com</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Student Details */}
                                <div style={{ marginBottom: '24px' }}>
                                    <h3 style={{
                                        fontSize: '11px', fontWeight: '800', color: '#94a3b8', margin: '0 0 12px 0',
                                        textTransform: 'uppercase', letterSpacing: '2px',
                                    }}>Student Details</h3>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '4px 0', fontSize: '13px', fontWeight: '600', color: '#94a3b8', width: '30%' }}>Name</td>
                                                <td style={{ padding: '4px 0', fontSize: '14px', fontWeight: '700', color: '#1e293b', width: '70%', textAlign: 'right' }}>{application.user?.name || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '4px 0', fontSize: '13px', fontWeight: '600', color: '#94a3b8', width: '30%' }}>Email</td>
                                                <td style={{ padding: '4px 0', fontSize: '14px', fontWeight: '700', color: '#1e293b', width: '70%', textAlign: 'right' }}>{application.user?.email || 'N/A'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Divider */}
                                <div style={{ borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}></div>

                                {/* Service Details */}
                                <div style={{ marginBottom: '24px' }}>
                                    <h3 style={{
                                        fontSize: '11px', fontWeight: '800', color: '#94a3b8', margin: '0 0 12px 0',
                                        textTransform: 'uppercase', letterSpacing: '2px',
                                    }}>Service Details</h3>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '6px 0', fontSize: '13px', fontWeight: '600', color: '#94a3b8', width: '30%' }}>Service</td>
                                                <td style={{ padding: '6px 0', fontSize: '14px', fontWeight: '700', color: '#1e293b', width: '70%', textAlign: 'right' }}>{application.article?.title || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '6px 0', fontSize: '13px', fontWeight: '600', color: '#94a3b8', width: '30%' }}>Type</td>
                                                <td style={{ padding: '6px 0', width: '70%', textAlign: 'right' }}>
                                                    <span style={{
                                                        fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '8px',
                                                        background: application.paymentType === 'payment' ? '#d1fae5' : '#dbeafe',
                                                        color: application.paymentType === 'payment' ? '#065f46' : '#1e40af',
                                                        letterSpacing: '0.5px',
                                                        display: 'inline-block'
                                                    }}>
                                                        {application.paymentType === 'payment' ? 'Full Payment' : 'Documents Only'}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '6px 0', fontSize: '13px', fontWeight: '600', color: '#94a3b8', width: '30%' }}>Applied Date</td>
                                                <td style={{ padding: '6px 0', fontSize: '14px', fontWeight: '700', color: '#1e293b', width: '70%', textAlign: 'right' }}>
                                                    {new Date(application.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Payment Summary Box */}
                                <div style={{
                                    background: '#f0fdf4', borderRadius: '16px', padding: '24px',
                                    border: '1px solid #bbf7d0', marginTop: '40px',
                                }}>
                                    <h3 style={{
                                        fontSize: '14px', fontWeight: '900', color: '#1e293b', margin: '0 0 16px 0',
                                    }}>Payment Summary</h3>

                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <tbody>
                                            <tr>
                                                <td style={{ padding: '4px 0', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Subtotal</td>
                                                <td style={{ padding: '4px 0', fontSize: '14px', fontWeight: '700', color: '#1e293b', textAlign: 'right' }}>₹{application.amount?.toLocaleString()}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ padding: '4px 0', fontSize: '13px', fontWeight: '600', color: '#64748b' }}>Processing Fee</td>
                                                <td style={{ padding: '4px 0', fontSize: '14px', fontWeight: '700', color: '#1e293b', textAlign: 'right' }}>₹0</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2" style={{ padding: '12px 0 0 0' }}>
                                                    <div style={{ borderTop: '2px dashed #86efac', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontSize: '16px', fontWeight: '900', color: '#1e293b' }}>Total</span>
                                                        <span style={{ fontSize: '28px', fontWeight: '900', color: '#059669' }}>₹{application.amount?.toLocaleString()}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer */}
                                <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', margin: 0 }}>
                                        Thank you for choosing Zoya Education Center! 🙏
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== ACTION BUTTONS ===== */}
                <div className="p-6 pt-0 bg-slate-50 dark:bg-slate-900 flex gap-3">
                    <button
                        onClick={handleDownloadPDF}
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                        <Download size={16} /> Download PDF
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                    >
                        <Printer size={16} /> Print
                    </button>
                    <button
                        onClick={handleWhatsAppShare}
                        className="flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:-translate-y-0.5 transition-all"
                    >
                        <Share2 size={16} /> Share
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
