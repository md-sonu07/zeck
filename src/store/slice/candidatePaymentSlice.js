import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCandidates, fetchCandidateById, createCandidate,
  updateCandidate, deleteCandidate, addPayment, editPayment,
  removePayment, fetchStats, fetchCourseRevenueReport, fetchMonthlyCollectionReport
} from '../thunk/candidatePaymentThunk';

const candidatePaymentSlice = createSlice({
  name: 'candidatePayment',
  initialState: {
    candidates: [],
    total: 0,
    page: 1,
    pages: 1,
    courses: [],
    selectedCandidate: null,
    stats: null,
    courseRevenueReport: [],
    monthlyCollectionReport: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedCandidate: (state) => { state.selectedCandidate = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null; };
    const handleRejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(fetchCandidates.pending, handlePending)
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload.candidates;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.courses = action.payload.courses;
      })
      .addCase(fetchCandidates.rejected, handleRejected)

      .addCase(fetchCandidateById.pending, handlePending)
      .addCase(fetchCandidateById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCandidate = action.payload.candidate;
      })
      .addCase(fetchCandidateById.rejected, handleRejected)

      .addCase(createCandidate.pending, handlePending)
      .addCase(createCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates.unshift(action.payload.candidate);
      })
      .addCase(createCandidate.rejected, handleRejected)

      .addCase(updateCandidate.pending, handlePending)
      .addCase(updateCandidate.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.candidates.findIndex(c => c._id === action.payload.candidate._id);
        if (idx !== -1) state.candidates[idx] = action.payload.candidate;
        if (state.selectedCandidate?._id === action.payload.candidate._id) state.selectedCandidate = action.payload.candidate;
      })
      .addCase(updateCandidate.rejected, handleRejected)

      .addCase(deleteCandidate.pending, handlePending)
      .addCase(deleteCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = state.candidates.filter(c => c._id !== action.meta.arg);
      })
      .addCase(deleteCandidate.rejected, handleRejected)

      .addCase(addPayment.pending, handlePending)
      .addCase(addPayment.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.candidate;
        const idx = state.candidates.findIndex(c => c._id === updated._id);
        if (idx !== -1) state.candidates[idx] = updated;
        if (state.selectedCandidate?._id === updated._id) state.selectedCandidate = updated;
      })
      .addCase(addPayment.rejected, handleRejected)

      .addCase(editPayment.pending, handlePending)
      .addCase(editPayment.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.candidate;
        const idx = state.candidates.findIndex(c => c._id === updated._id);
        if (idx !== -1) state.candidates[idx] = updated;
        if (state.selectedCandidate?._id === updated._id) state.selectedCandidate = updated;
      })
      .addCase(editPayment.rejected, handleRejected)

      .addCase(removePayment.pending, handlePending)
      .addCase(removePayment.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.candidate;
        const idx = state.candidates.findIndex(c => c._id === updated._id);
        if (idx !== -1) state.candidates[idx] = updated;
        if (state.selectedCandidate?._id === updated._id) state.selectedCandidate = updated;
      })
      .addCase(removePayment.rejected, handleRejected)

      .addCase(fetchStats.pending, handlePending)
      .addCase(fetchStats.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload.stats; })
      .addCase(fetchStats.rejected, handleRejected)

      .addCase(fetchCourseRevenueReport.pending, handlePending)
      .addCase(fetchCourseRevenueReport.fulfilled, (state, action) => { state.loading = false; state.courseRevenueReport = action.payload.report; })
      .addCase(fetchCourseRevenueReport.rejected, handleRejected)

      .addCase(fetchMonthlyCollectionReport.pending, handlePending)
      .addCase(fetchMonthlyCollectionReport.fulfilled, (state, action) => { state.loading = false; state.monthlyCollectionReport = action.payload.report; })
      .addCase(fetchMonthlyCollectionReport.rejected, handleRejected);
  }
});

export const { clearSelectedCandidate, clearError } = candidatePaymentSlice.actions;
export default candidatePaymentSlice.reducer;
