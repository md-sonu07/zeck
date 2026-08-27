import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  Users, DollarSign, CreditCard, AlertTriangle, CheckCircle, Clock,
  Plus, Search, X, Eye, Edit, Trash2, Printer,
  ArrowUpDown, BarChart3, TrendingUp, Calendar, FileSpreadsheet
} from 'lucide-react';
import {
  fetchCandidates, createCandidate, updateCandidate,
  deleteCandidate, addPayment, editPayment, removePayment,
  fetchStats, fetchCourseRevenueReport, fetchMonthlyCollectionReport,
  fetchCandidateById
} from '../../../store/thunk/candidatePaymentThunk';

const StatCard = ({ title, value, icon: iconComponent, color, isLoading }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 dark:border-slate-700/60 flex items-start justify-between group">
    <div className="flex-1 min-w-0">
      <p className="text-[11px] sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 truncate">{title}</p>
      {isLoading ? (
        <div className="h-9 w-16 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-lg mt-1" />
      ) : (
        <h3 className="text-xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight truncate">{value}</h3>
      )}
    </div>
    <div className={`size-9 sm:size-12 rounded-xl flex items-center justify-center text-white shadow-lg ${color} group-hover:scale-110 transition-transform duration-300 shrink-0 ml-2`}>
      {React.createElement(iconComponent, { className: 'size-5 sm:size-6' })}
    </div>
  </div>
);

const SortIcon = ({ field, sortField, sortDir }) => {
  if (sortField !== field) return <ArrowUpDown size={12} className="opacity-30" />;
  return <ArrowUpDown size={12} className={`transition-transform ${sortDir === 1 ? 'rotate-180' : ''}`} />;
};

const formatDate = (d) => {
  if (!d) return '-';
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return '-';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const initialCandidateForm = {
  candidateName: '', mobileNumber: '', course: '', university: '', college: '', session: '', type: 'Student',
  dealAmount: '', admissionDate: new Date().toISOString().split('T')[0], notes: ''
};
const initialPaymentForm = {
  amount: '', paymentDate: new Date().toISOString().split('T')[0], paymentMethod: 'Cash', transactionId: '', remark: ''
};

const CandidateOnlyPaymentPage = () => {
  const dispatch = useDispatch();
  const { candidates, page, pages, courses, stats, loading } = useSelector((s) => s.candidatePayment);
  const { courseRevenueReport, monthlyCollectionReport } = useSelector((s) => s.candidatePayment);

  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState(-1);

  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [candidateForm, setCandidateForm] = useState(initialCandidateForm);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentCandidateId, setPaymentCandidateId] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailCandidate, setDetailCandidate] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmPaymentDelete, setConfirmPaymentDelete] = useState(null);

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printCandidate, setPrintCandidate] = useState(null);

  const [showReports, setShowReports] = useState(false);

  const handleSort = (field) => {
    setSortField(field);
    setSortDir(prev => prev === -1 ? 1 : -1);
  };

  const fetchData = useCallback(() => {
    const params = { page: currentPage, limit: 50, sort: sortField, order: sortDir, type: 'Student', noAgent: 'true' };
    if (searchQuery) params.search = searchQuery;
    if (courseFilter) params.course = courseFilter;
    if (statusFilter) params.status = statusFilter;
    dispatch(fetchCandidates(params));
  }, [dispatch, currentPage, searchQuery, courseFilter, statusFilter, sortField, sortDir]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { dispatch(fetchStats({ noAgent: 'true' })); }, [dispatch]);

  const getStatusBadge = (status) => {
    const styles = {
      Paid: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      Pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
      'Extra Paid': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${styles[status] || 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
        {status || 'Unknown'}
      </span>
    );
  };

  const openAddCandidate = () => {
    setEditingCandidate(null);
    setCandidateForm(initialCandidateForm);
    setShowCandidateModal(true);
  };

  const openEditCandidate = (c) => {
    setEditingCandidate(c);
    setCandidateForm({
      candidateName: c.candidateName, mobileNumber: c.mobileNumber, course: c.course,
      university: c.university || '', college: c.college || '', session: c.session || '', type: c.type || 'Student',
      dealAmount: c.dealAmount, admissionDate: c.admissionDate ? new Date(c.admissionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      notes: c.notes || ''
    });
    setShowCandidateModal(true);
  };

  const handleCandidateSubmit = async (e) => {
    e.preventDefault();
    const data = { ...candidateForm, dealAmount: Number(candidateForm.dealAmount) };
    try {
      if (editingCandidate) {
        await dispatch(updateCandidate({ id: editingCandidate._id, data })).unwrap();
        toast.success('Candidate updated');
      } else {
        await dispatch(createCandidate(data)).unwrap();
        toast.success('Candidate created');
      }
      setShowCandidateModal(false);
      dispatch(fetchStats());
    } catch { toast.error('Operation failed'); }
  };

  const confirmDeleteCandidate = (c) => setConfirmDelete(c);
  const handleDeleteCandidate = async () => {
    if (!confirmDelete) return;
    try {
      await dispatch(deleteCandidate(confirmDelete._id)).unwrap();
      toast.success('Candidate deleted');
      setConfirmDelete(null);
      dispatch(fetchStats());
    } catch { toast.error('Delete failed'); }
  };

  const openDetail = async (c) => {
    try {
      const result = await dispatch(fetchCandidateById(c._id)).unwrap();
      setDetailCandidate(result.candidate);
      setShowDetailModal(true);
    } catch { toast.error('Failed to load details'); }
  };

  const openAddPayment = (candidateId) => {
    setPaymentCandidateId(candidateId);
    setEditingPayment(null);
    setPaymentForm(initialPaymentForm);
    setShowPaymentModal(true);
  };

  const openEditPayment = (candidateId, payment) => {
    setEditingPayment(payment);
    setPaymentForm({
      amount: payment.amount, paymentDate: new Date(payment.paymentDate).toISOString().split('T')[0],
      paymentMethod: payment.paymentMethod, transactionId: payment.transactionId || '', remark: payment.remark || ''
    });
    setPaymentCandidateId(candidateId);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const data = { ...paymentForm, amount: Number(paymentForm.amount) };
    try {
      if (editingPayment) {
        await dispatch(editPayment({ id: paymentCandidateId, data: { ...data, paymentId: editingPayment._id } })).unwrap();
        toast.success('Payment updated');
      } else {
        await dispatch(addPayment({ id: paymentCandidateId, data })).unwrap();
        toast.success('Payment added');
      }
      setShowPaymentModal(false);
    } catch { toast.error('Operation failed'); }
  };
  const confirmDeletePayment = (candidateId, payment) => {
    setConfirmPaymentDelete({ id: candidateId, paymentId: payment._id });
  };

  const handleDeletePayment = async () => {
    if (!confirmPaymentDelete) return;
    try {
      const result = await dispatch(removePayment(confirmPaymentDelete)).unwrap();
      toast.success('Payment deleted');
      setDetailCandidate(result.candidate);
      setConfirmPaymentDelete(null);
    } catch { toast.error('Delete failed'); }
  };

  const totalCollection = stats?.totalCollection || 0;
  const totalDueAmount = stats?.totalDueAmount || 0;
  const totalPaidCandidates = stats?.totalPaidCandidates || 0;
  const totalPendingCandidates = stats?.totalPendingCandidates || 0;

  const openPrint = async (c) => {
    try {
      const result = await dispatch(fetchCandidateById(c._id)).unwrap();
      setPrintCandidate(result.candidate);
      setShowPrintModal(true);
    } catch { toast.error('Failed to load details'); }
  };

  const printCandidateReport = () => {
    if (!printCandidate) return;
    const printWindow = window.open('', '_blank');
    const paymentsHTML = printCandidate.payments?.map((p, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${formatDate(p.paymentDate)}</td>
        <td>₹${p.amount.toLocaleString()}</td>
        <td>${p.paymentMethod}</td>
        <td>${p.transactionId || '-'}</td>
        <td>${p.remark || '-'}</td>
      </tr>
    `).join('') || '';
    printWindow.document.write(`
      <html><head><title>Payment Report - ${printCandidate.candidateName}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px; }
        .header img { height: 60px; margin-bottom: 10px; }
        .header h1 { color: #1e40af; margin: 0; font-size: 24px; }
        .header h2 { margin: 5px 0; font-size: 18px; color: #555; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 30px; }
        .info-item { padding: 8px 12px; background: #f8fafc; border-radius: 6px; }
        .info-item label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold; }
        .info-item .value { font-size: 15px; font-weight: bold; color: #1e293b; margin-top: 2px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #1e40af; color: white; padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; }
        td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        tr:nth-child(even) { background: #f8fafc; }
        .summary { display: flex; justify-content: space-between; padding: 20px; background: #f1f5f9; border-radius: 8px; }
        .summary div { text-align: center; }
        .summary .label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold; }
        .summary .amount { font-size: 20px; font-weight: bold; margin-top: 4px; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .Paid { background: #dcfce7; color: #166534; }
        .Pending { background: #fef3c7; color: #92400e; }
        .Extra { background: #dbeafe; color: #1e40af; }
        .notice-box { margin-top: 24px; border: 2px solid #b91c1c; border-radius: 8px; background: #fef2f2; padding: 14px 16px; text-align: center; }
        .notice-box h4 { margin: 0 0 4px; font-size: 14px; font-weight: 900; color: #b91c1c; }
        .notice-box h5 { margin: 0 0 8px; font-size: 12px; font-weight: 800; color: #1e293b; }
        .notice-box p { margin: 0; font-size: 11px; line-height: 1.6; color: #334155; text-align: justify; }
        .notice-box .sign { margin-top: 8px; font-size: 11px; font-weight: 700; color: #1e293b; text-align: right; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        @media print { body { margin: 20px; } }
      </style></head><body>
        <div class="header">
          <img src="/logo/light-logo.png" alt="ZOYA Education Center" />
          <h1>ZOYA EDUCATION CENTER & TRUST</h1>
          <p style="color:#64748b;font-size:12px;font-weight:600;margin:4px 0 8px;">AN ISO 9001:2015 Certified Organization</p>
          <h2>Candidate Payment Report</h2>
        </div>
        <div class="info-grid">
          <div class="info-item"><label>Candidate Name</label><div class="value">${printCandidate.candidateName}</div></div>
          <div class="info-item"><label>Mobile Number</label><div class="value">${printCandidate.mobileNumber}</div></div>
          <div class="info-item"><label>Course</label><div class="value">${printCandidate.course}</div></div>
          <div class="info-item"><label>Admission Date</label><div class="value">${formatDate(printCandidate.admissionDate)}</div></div>
          <div class="info-item"><label>University / Board</label><div class="value">${printCandidate.university || '-'}</div></div>
          <div class="info-item"><label>College</label><div class="value">${printCandidate.college || '-'}</div></div>
          <div class="info-item"><label>Session</label><div class="value">${printCandidate.session || '-'}</div></div>
          <div class="info-item"><label>Candidate ID</label><div class="value">${printCandidate.candidateId || '-'}</div></div>
          <div class="info-item"><label>Deal Amount</label><div class="value">₹${printCandidate.dealAmount?.toLocaleString()}</div></div>
        </div>
        <h3 style="margin-bottom: 10px;">Payment History</h3>
        <table>
          <thead><tr><th>#</th><th>Date</th><th>Amount</th><th>Method</th><th>Transaction ID</th><th>Remark</th></tr></thead>
          <tbody>${paymentsHTML || '<tr><td colspan="6" style="text-align:center;color:#94a3b8;">No payments recorded</td></tr>'}</tbody>
        </table>
        <div class="summary">
          <div><div class="label">Total Paid</div><div class="amount" style="color:#166534;">₹${printCandidate.totalPaid?.toLocaleString()}</div></div>
          <div><div class="label">Due Amount</div><div class="amount" style="color:#dc2626;">₹${Math.max(printCandidate.dueAmount || 0, 0).toLocaleString()}</div></div>
          <div><div class="label">Status</div><div class="amount"><span class="status-badge ${printCandidate.paymentStatus === 'Extra Paid' ? 'Extra' : printCandidate.paymentStatus}">${printCandidate.paymentStatus}</span></div></div>
        </div>
        <div class="notice-box">
          <h4>★ महत्वपूर्ण सूचना ★</h4>
          <h5>Admission Cancellation एवं Fee Refund Policy</h5>
          <p>सभी विद्यार्थियों एवं अभिभावकों को सूचित किया जाता है कि <b>Admission/नामांकन</b> हो जाने के बाद यदि कोई विद्यार्थी किसी भी कारणवश अपना <b>Admission Cancel</b> कराता है या संस्था/कॉलेज छोड़ता है, तो जमा की गई <b>Admission Fee, Course Fee</b> अथवा अन्य किसी भी प्रकार की भुगतान राशि <b>Refund/वापस नहीं की जाएगी।</b></p>
          <div class="sign">धन्यवाद।<br/>प्रबंधन<br/><b>ZOYA EDUCATION CENTRE & TRUST</b></div>
        </div>
        <div class="footer">Generated on ${new Date().toLocaleString('en-IN')} | ZOYA Education Center | License: Q2A-2026-0330T117681</div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
    setShowPrintModal(false);
  };

  const handleExportCSV = () => {
    if (!candidates?.length) { toast.error('No data to export'); return; }
    const csv = [
      ['Candidate ID', 'Name', 'Mobile', 'Course', 'Type', 'Deal Amount', 'Total Paid', 'Due Amount', 'Status', 'Admission Date'].join(','),
      ...candidates.map(c => [
        c.candidateId || '', c.candidateName, c.mobileNumber, c.course, c.type || 'Student',
        c.dealAmount || 0, c.totalPaid || 0, c.dueAmount || 0, c.paymentStatus || 'Pending',
        c.admissionDate ? new Date(c.admissionDate).toLocaleDateString('en-IN') : ''
      ].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'candidate-payments-report.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <CreditCard className="text-primary" /> Candidate Payments
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Manage candidate payments, dues, reports, and more</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => { setShowReports(!showReports); if (!showReports) { dispatch(fetchCourseRevenueReport({ noAgent: 'true' })); dispatch(fetchMonthlyCollectionReport({ noAgent: 'true' })); } }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer">
            <BarChart3 size={16} /> {showReports ? 'Hide Reports' : 'Reports'}
          </button>
          <button onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer">
            <FileSpreadsheet size={16} /> Export
          </button>
          <button onClick={openAddCandidate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95 cursor-pointer">
            <Plus size={16} /> Add Candidate
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Collection" value={`₹${totalCollection.toLocaleString()}`} icon={TrendingUp} color="bg-linear-to-br from-green-500 to-emerald-600" isLoading={loading} />
        <StatCard title="Total Due Amount" value={`₹${totalDueAmount.toLocaleString()}`} icon={AlertTriangle} color="bg-linear-to-br from-red-500 to-rose-600" isLoading={loading} />
        <StatCard title="Paid Candidates" value={totalPaidCandidates} icon={CheckCircle} color="bg-linear-to-br from-teal-500 to-cyan-600" isLoading={loading} />
        <StatCard title="Pending Candidates" value={totalPendingCandidates} icon={Clock} color="bg-linear-to-br from-purple-500 to-indigo-600" isLoading={loading} />
      </div>

      {/* Reports */}
      {showReports && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-3">Course Revenue Report</h3>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-slate-200 dark:border-slate-700"><th className="py-2 pr-3 text-left font-bold text-slate-500">Course</th><th className="py-2 pr-3 text-right font-bold text-slate-500">Count</th><th className="py-2 text-right font-bold text-slate-500">Revenue</th></tr></thead>
                <tbody>
                  {courseRevenueReport?.map((r, i) => {
                    const courseName = r.course ?? r._id ?? '-';
                    const revenue = r.totalRevenue ?? r.totalPaid ?? r.totalDeal ?? 0;
                    return (
                    <tr key={i} className="border-t border-slate-100 dark:border-slate-700/60">
                      <td className="py-3 pr-3 font-semibold">{courseName}</td>
                      <td className="py-3 pr-3 text-right">{r.count ?? 0}</td>
                      <td className="py-3 text-right text-green-600 font-semibold">₹{Number(revenue).toLocaleString()}</td>
                    </tr>
                    );
                  }) || null}
                  {(!courseRevenueReport?.length) && <tr><td colSpan="3" className="py-8 text-center text-slate-400">No data</td></tr>}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-3">Monthly Collection Report</h3>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-slate-200 dark:border-slate-700"><th className="py-2 pr-3 text-left font-bold text-slate-500">Month</th><th className="py-2 pr-3 text-right font-bold text-slate-500">Count</th><th className="py-2 text-right font-bold text-slate-500">Collection</th></tr></thead>
                <tbody>
                  {monthlyCollectionReport?.map((r, i) => (
                    <tr key={i} className="border-t border-slate-100 dark:border-slate-700/60">
                      <td className="py-3 pr-3 font-semibold">{r.month ?? '-'}</td>
                      <td className="py-3 pr-3 text-right">{r.count ?? 0}</td>
                      <td className="py-3 text-right text-green-600 font-semibold">₹{Number(r.total ?? 0).toLocaleString()}</td>
                    </tr>
                  )) || null}
                  {(!monthlyCollectionReport?.length) && <tr><td colSpan="3" className="py-8 text-center text-slate-400">No data</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search by name, mobile, or ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
          )}
        </div>
        <select value={courseFilter} onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
          <option value="">All Courses</option>
          {courses?.map((c, i) => <option key={i} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
          <option value="">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Extra Paid">Extra Paid</option>
        </select>
      </div>

      {/* Candidates Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="sticky top-0 px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">#</th>
                <th className="sticky top-0 px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('candidateName')}>
                  <span className="flex items-center gap-1">Candidate <SortIcon field="candidateName" sortField={sortField} sortDir={sortDir} /></span>
                </th>
                <th className="sticky top-0 px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mobile</th>
                <th className="sticky top-0 px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Course</th>
                <th className="sticky top-0 px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                <th className="sticky top-0 px-4 py-3.5 text-right text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('dealAmount')}>
                  <span className="flex items-center justify-end gap-1">Deal <SortIcon field="dealAmount" sortField={sortField} sortDir={sortDir} /></span>
                </th>
                <th className="sticky top-0 px-4 py-3.5 text-right text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Paid</th>
                <th className="sticky top-0 px-4 py-3.5 text-right text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Due</th>
                <th className="sticky top-0 px-4 py-3.5 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="sticky top-0 px-4 py-3.5 text-right text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {loading && candidates.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 9 }).map((_, j) => <td key={j} className="px-4 py-3.5"><div className="h-4 bg-slate-100 dark:bg-slate-700 animate-pulse rounded" /></td>)}</tr>
                ))
              ) : candidates.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users size={40} className="text-slate-300 dark:text-slate-600" />
                      <p className="text-slate-500 dark:text-slate-400 font-medium">No candidates found</p>
                      <button onClick={openAddCandidate} className="text-primary text-sm font-bold hover:underline cursor-pointer">Add your first candidate</button>
                    </div>
                  </td>
                </tr>
              ) : (
                candidates.map((c, i) => (
                  <tr key={c._id} onClick={() => openDetail(c)} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer">
                    <td className="px-4 py-3.5 text-sm font-medium text-slate-500">{(page - 1) * 50 + i + 1}</td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white text-sm">{c.candidateName}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{c.candidateId || ''}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-400 font-medium">{c.mobileNumber}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-400 font-medium">{c.course}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-400 font-medium">{c.type || 'Student'}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-slate-800 dark:text-white text-right">₹{c.dealAmount?.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-green-600 dark:text-green-400 text-right">₹{c.totalPaid?.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-right">
                      <span className={c.dueAmount > 0 ? 'text-red-600 dark:text-red-400' : c.dueAmount < 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}>
                        ₹{Math.abs(c.dueAmount || 0).toLocaleString()}{c.dueAmount < 0 ? ' (Excess)' : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">{getStatusBadge(c.paymentStatus)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={(e) => { e.stopPropagation(); openDetail(c); }} className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5 transition-all cursor-pointer" title="View"><Eye size={15} /></button>
                        <button onClick={(e) => { e.stopPropagation(); openEditCandidate(c); }} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all cursor-pointer" title="Edit"><Edit size={15} /></button>
                        <button onClick={(e) => { e.stopPropagation(); confirmDeleteCandidate(c); }} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all cursor-pointer" title="Delete"><Trash2 size={15} /></button>
                        <button onClick={(e) => { e.stopPropagation(); openAddPayment(c._id); }} className="p-1.5 rounded-lg text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 transition-all cursor-pointer" title="Add Payment"><Plus size={15} /></button>
                        <button onClick={(e) => { e.stopPropagation(); openPrint(c); }} className="p-1.5 rounded-lg text-slate-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all cursor-pointer" title="Print"><Printer size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-700/60">
            <p className="text-sm text-slate-500 font-medium">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button disabled={currentPage <= 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all cursor-pointer">Previous</button>
              <button disabled={currentPage >= pages} onClick={() => setCurrentPage(p => Math.min(pages, p + 1))}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all cursor-pointer">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Candidate Modal */}
      {showCandidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCandidateModal(false)} />
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 p-6 pb-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800 dark:text-white">{editingCandidate ? 'Edit Candidate' : 'Add Candidate'}</h2>
              <button onClick={() => setShowCandidateModal(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handleCandidateSubmit} className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Candidate Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Candidate Name <span className="text-red-500">*</span></label>
                    <input required placeholder="Enter full name" value={candidateForm.candidateName} onChange={(e) => setCandidateForm(f => ({ ...f, candidateName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Mobile Number <span className="text-red-500">*</span></label>
                    <input required placeholder="Enter mobile number" value={candidateForm.mobileNumber} onChange={(e) => setCandidateForm(f => ({ ...f, mobileNumber: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Course <span className="text-red-500">*</span></label>
                    <input required placeholder="Enter course name" value={candidateForm.course} onChange={(e) => setCandidateForm(f => ({ ...f, course: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">University / Board</label>
                    <input placeholder="Enter university or board name" value={candidateForm.university} onChange={(e) => setCandidateForm(f => ({ ...f, university: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">College</label>
                    <input placeholder="Enter college name" value={candidateForm.college} onChange={(e) => setCandidateForm(f => ({ ...f, college: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Session</label>
                    <input placeholder="e.g. 2024-2025" value={candidateForm.session} onChange={(e) => setCandidateForm(f => ({ ...f, session: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Candidate ID</label>
                    <input disabled value={editingCandidate?.candidateId || 'Auto Generated'}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 font-medium cursor-not-allowed" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Deal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Deal Amount (₹) <span className="text-red-500">*</span></label>
                    <input required type="number" min="0" placeholder="Enter deal amount" value={candidateForm.dealAmount} onChange={(e) => setCandidateForm(f => ({ ...f, dealAmount: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Admission Date</label>
                    <input type="date" value={candidateForm.admissionDate} onChange={(e) => setCandidateForm(f => ({ ...f, admissionDate: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Notes</label>
                    <textarea rows="2" placeholder="Additional notes..." value={candidateForm.notes} onChange={(e) => setCandidateForm(f => ({ ...f, notes: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setShowCandidateModal(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={loading}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary/90 shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer">
                  {loading ? 'Saving...' : editingCandidate ? 'Update Candidate' : 'Add Candidate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700">
            <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 p-6 pb-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800 dark:text-white">{editingPayment ? 'Edit Payment' : 'Add Payment'}</h2>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"><X size={18} /></button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Amount (₹) <span className="text-red-500">*</span></label>
                <input required type="number" min="1" placeholder="Enter payment amount" value={paymentForm.amount} onChange={(e) => setPaymentForm(f => ({ ...f, amount: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Payment Date</label>
                  <input type="date" value={paymentForm.paymentDate} onChange={(e) => setPaymentForm(f => ({ ...f, paymentDate: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Payment Method</label>
                  <select value={paymentForm.paymentMethod} onChange={(e) => setPaymentForm(f => ({ ...f, paymentMethod: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none">
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Transaction ID</label>
                <input placeholder="Transaction reference (optional)" value={paymentForm.transactionId} onChange={(e) => setPaymentForm(f => ({ ...f, transactionId: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Remark</label>
                <input placeholder="Remark (optional)" value={paymentForm.remark} onChange={(e) => setPaymentForm(f => ({ ...f, remark: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setShowPaymentModal(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all cursor-pointer">Cancel</button>
                <button type="submit" disabled={loading}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary/90 shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer">
                  {loading ? 'Saving...' : editingPayment ? 'Update Payment' : 'Add Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && detailCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => { setShowDetailModal(false); setDetailCandidate(null); }} />
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 p-6 pb-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800 dark:text-white">Candidate Payment Ledger</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => { setShowDetailModal(false); openPrint(detailCandidate); }} className="p-2 rounded-lg text-slate-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all cursor-pointer" title="Print"><Printer size={16} /></button>
                <button onClick={() => { setShowDetailModal(false); setDetailCandidate(null); }} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"><X size={18} /></button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2 md:col-span-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Candidate Name</p><p className="font-bold text-slate-800 dark:text-white mt-1">{detailCandidate.candidateName}</p></div>
                    <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mobile</p><p className="font-bold text-slate-800 dark:text-white mt-1">{detailCandidate.mobileNumber}</p></div>
                    <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Course</p><p className="font-bold text-slate-800 dark:text-white mt-1">{detailCandidate.course}</p></div>
                    <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Admission Date</p><p className="font-bold text-slate-800 dark:text-white mt-1">{formatDate(detailCandidate.admissionDate)}</p></div>
                    <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">University / Board</p><p className="font-bold text-slate-800 dark:text-white mt-1">{detailCandidate.university || '-'}</p></div>
                    <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">College</p><p className="font-bold text-slate-800 dark:text-white mt-1">{detailCandidate.college || '-'}</p></div>
                    <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Session</p><p className="font-bold text-slate-800 dark:text-white mt-1">{detailCandidate.session || '-'}</p></div>
                    <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Candidate ID</p><p className="font-bold text-slate-800 dark:text-white mt-1">{detailCandidate.candidateId || '-'}</p></div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
                  <p className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">Deal Amount</p>
                  <p className="text-xl font-black text-blue-700 dark:text-blue-300 mt-1">₹{detailCandidate.dealAmount?.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-100 dark:border-green-500/20">
                  <p className="text-[11px] font-bold text-green-500 uppercase tracking-wider">Total Paid</p>
                  <p className="text-xl font-black text-green-700 dark:text-green-300 mt-1">₹{detailCandidate.totalPaid?.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-500/20">
                  <p className="text-[11px] font-bold text-red-500 uppercase tracking-wider">Remaining Due</p>
                  <p className="text-xl font-black text-red-700 dark:text-red-300 mt-1">₹{Math.max(detailCandidate.dueAmount || 0, 0).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/60 flex flex-col justify-center">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</p>
                  <div className="mt-1">{getStatusBadge(detailCandidate.paymentStatus)}</div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 dark:text-white">Payment History</h3>
                  <button onClick={() => { setShowDetailModal(false); openAddPayment(detailCandidate._id); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs bg-primary text-white hover:bg-primary/90 transition-all cursor-pointer"><Plus size={14} /> Add Payment</button>
                </div>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50">
                        <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">#</th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Method</th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Remark</th>
                        <th className="px-4 py-3 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                      {detailCandidate.payments?.length === 0 ? (
                        <tr><td colSpan="7" className="px-4 py-8 text-center text-slate-400 font-medium">No payments recorded yet</td></tr>
                      ) : (
                        [...(detailCandidate.payments || [])].reverse().map((p, i) => (
                          <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td className="px-4 py-3 text-sm text-slate-500">{detailCandidate.payments.length - i}</td>
                            <td className="px-4 py-3 text-sm font-bold text-slate-800 dark:text-white">₹{p.amount?.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatDate(p.paymentDate)}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">{p.paymentMethod}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{p.transactionId || '-'}</td>
                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{p.remark || '-'}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => { setShowDetailModal(false); openEditPayment(detailCandidate._id, p); }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all cursor-pointer" title="Edit Payment"><Edit size={14} /></button>
                                <button onClick={() => confirmDeletePayment(detailCandidate._id, p)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all cursor-pointer" title="Delete Payment"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {detailCandidate.payments?.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-4">Payment Timeline</h3>
                  <div className="space-y-0">
                    {[...(detailCandidate.payments || [])].reverse().map((p, i) => (
                      <div key={p._id} className="flex gap-4 relative pb-6 last:pb-0">
                        {i < detailCandidate.payments.length - 1 && (
                          <div className="absolute top-5 left-[15px] bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
                        )}
                        <div className={`size-8 rounded-full flex items-center justify-center shrink-0 z-10 ${p.amount >= 0 ? 'bg-green-100 dark:bg-green-500/10 text-green-600' : 'bg-red-100 dark:bg-red-500/10 text-red-600'}`}>
                          <TrendingUp size={14} />
                        </div>
                        <div className="flex-1 mt-0.5">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-slate-800 dark:text-white">₹{p.amount?.toLocaleString()}</p>
                            <p className="text-xs text-slate-400 font-medium">{formatDate(p.paymentDate)}</p>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{p.paymentMethod}{p.transactionId ? ` • ${p.transactionId}` : ''}</p>
                          {p.remark && <p className="text-xs text-slate-400 mt-0.5 italic">"{p.remark}"</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-6 text-center">
            <AlertTriangle size={40} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Delete Candidate?</h3>
            <p className="text-sm text-slate-500 mb-6">This will permanently remove <strong>{confirmDelete.candidateName}</strong> and all their payments.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDelete(null)} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all cursor-pointer">Cancel</button>
              <button onClick={handleDeleteCandidate} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-all cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Delete Confirmation */}
      {confirmPaymentDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setConfirmPaymentDelete(null)} />
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-6 text-center">
            <AlertTriangle size={40} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">Delete Payment?</h3>
            <p className="text-sm text-slate-500 mb-6">Remove this payment record? This cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmPaymentDelete(null)} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all cursor-pointer">Cancel</button>
              <button onClick={handleDeletePayment} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-all cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Print Modal */}
      {showPrintModal && printCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => { setShowPrintModal(false); setPrintCandidate(null); }} />
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-8 text-center">
            <Printer size={48} className="mx-auto text-primary mb-4" />
            <h3 className="text-lg font-black text-slate-800 dark:text-white">Print Candidate Report</h3>
            <p className="text-sm text-slate-500 mt-2">Generate a printable payment report for <strong className="text-slate-700 dark:text-slate-300">{printCandidate.candidateName}</strong></p>
            <div className="flex gap-3 mt-6 justify-center">
              <button onClick={() => { setShowPrintModal(false); setPrintCandidate(null); }}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all cursor-pointer">Cancel</button>
              <button onClick={printCandidateReport}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary/90 shadow-lg transition-all active:scale-95 cursor-pointer"><Printer size={16} className="inline mr-1.5" /> Print</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateOnlyPaymentPage;
