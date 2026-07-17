import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/admission.api.js';

export const submitApplication = createAsyncThunk(
    'admissions/submit',
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await api.submitApplicationApi(formData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit application');
        }
    }
);

export const fetchAllAdmissions = createAsyncThunk(
    'admissions/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const { data } = await api.getAllAdmissionsApi(params);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
        }
    }
);

export const fetchAdmissionById = createAsyncThunk(
    'admissions/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.getAdmissionByIdApi(id);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch application');
        }
    }
);

export const fetchMyAdmissions = createAsyncThunk(
    'admissions/fetchMine',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.getMyAdmissionsApi();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
        }
    }
);

export const updateAdmissionStatus = createAsyncThunk(
    'admissions/updateStatus',
    async ({ id, status, remarks }, { rejectWithValue }) => {
        try {
            const { data } = await api.updateAdmissionStatusApi(id, { status, remarks });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update status');
        }
    }
);

export const bulkUpdateAdmissionStatus = createAsyncThunk(
    'admissions/bulkStatus',
    async ({ ids, status, remarks }, { rejectWithValue }) => {
        try {
            const { data } = await api.bulkUpdateAdmissionStatusApi({ ids, status, remarks });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed');
        }
    }
);

export const deleteAdmission = createAsyncThunk(
    'admissions/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.deleteAdmissionApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete');
        }
    }
);

const admissionSlice = createSlice({
    name: 'admissions',
    initialState: { data: [], myApplications: [], currentAdmission: null, loading: false, error: null },
    reducers: {
        clearCurrentAdmission: (state) => { state.currentAdmission = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllAdmissions.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllAdmissions.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
            .addCase(fetchAllAdmissions.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchAdmissionById.pending, (state) => { state.loading = true; })
            .addCase(fetchAdmissionById.fulfilled, (state, action) => { state.loading = false; state.currentAdmission = action.payload; })
            .addCase(fetchAdmissionById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchMyAdmissions.pending, (state) => { state.loading = true; })
            .addCase(fetchMyAdmissions.fulfilled, (state, action) => { state.loading = false; state.myApplications = action.payload; })
            .addCase(fetchMyAdmissions.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(updateAdmissionStatus.fulfilled, (state, action) => {
                const idx = state.data.findIndex(a => a._id === action.payload._id);
                if (idx !== -1) state.data[idx] = action.payload;
                const myIdx = state.myApplications.findIndex(a => a._id === action.payload._id);
                if (myIdx !== -1) state.myApplications[myIdx] = action.payload;
                if (state.currentAdmission?._id === action.payload._id) state.currentAdmission = action.payload;
            })
            .addCase(deleteAdmission.fulfilled, (state, action) => {
                state.data = state.data.filter(a => a._id !== action.payload);
                state.myApplications = state.myApplications.filter(a => a._id !== action.payload);
            });
    }
});

export const { clearCurrentAdmission } = admissionSlice.actions;
export default admissionSlice.reducer;
