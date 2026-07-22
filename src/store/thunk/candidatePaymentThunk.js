import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/candidatePayment.api';

export const fetchCandidates = createAsyncThunk('candidatePayment/fetchCandidates', async (params, { rejectWithValue }) => {
  try { return await api.getAllCandidatesApi(params); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch candidates'); }
});

export const fetchCandidateById = createAsyncThunk('candidatePayment/fetchById', async (id, { rejectWithValue }) => {
  try { return await api.getCandidateByIdApi(id); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch candidate'); }
});

export const createCandidate = createAsyncThunk('candidatePayment/create', async (data, { rejectWithValue }) => {
  try { return await api.createCandidateApi(data); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to create candidate'); }
});

export const updateCandidate = createAsyncThunk('candidatePayment/update', async ({ id, data }, { rejectWithValue }) => {
  try { return await api.updateCandidateApi(id, data); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to update candidate'); }
});

export const deleteCandidate = createAsyncThunk('candidatePayment/delete', async (id, { rejectWithValue }) => {
  try { return await api.deleteCandidateApi(id); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to delete candidate'); }
});

export const addPayment = createAsyncThunk('candidatePayment/addPayment', async ({ id, data }, { rejectWithValue }) => {
  try { return await api.addPaymentApi(id, data); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to add payment'); }
});

export const editPayment = createAsyncThunk('candidatePayment/editPayment', async ({ id, data }, { rejectWithValue }) => {
  try { return await api.updatePaymentApi(id, data); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to update payment'); }
});

export const removePayment = createAsyncThunk('candidatePayment/removePayment', async ({ id, paymentId }, { rejectWithValue }) => {
  try { return await api.deletePaymentApi(id, paymentId); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to delete payment'); }
});

export const fetchStats = createAsyncThunk('candidatePayment/fetchStats', async (_, { rejectWithValue }) => {
  try { return await api.getCandidatePaymentStatsApi(); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch stats'); }
});

export const fetchCourseRevenueReport = createAsyncThunk('candidatePayment/courseRevenue', async (_, { rejectWithValue }) => {
  try { return await api.getCourseRevenueReportApi(); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch report'); }
});

export const fetchMonthlyCollectionReport = createAsyncThunk('candidatePayment/monthlyCollection', async (_, { rejectWithValue }) => {
  try { return await api.getMonthlyCollectionReportApi(); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch report'); }
});
