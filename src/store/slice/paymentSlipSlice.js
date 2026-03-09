import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as paymentSlipApi from '../../api/paymentSlip.api';

// Async Thunks
export const createPaymentSlip = createAsyncThunk(
    'paymentSlips/create',
    async (slipData, { rejectWithValue }) => {
        try {
            return await paymentSlipApi.createPaymentSlipApi(slipData);
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const fetchPaymentSlips = createAsyncThunk(
    'paymentSlips/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await paymentSlipApi.getPaymentSlipsApi();
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const fetchPaymentSlipById = createAsyncThunk(
    'paymentSlips/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            return await paymentSlipApi.getPaymentSlipByIdApi(id);
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const deletePaymentSlip = createAsyncThunk(
    'paymentSlips/delete',
    async (id, { rejectWithValue }) => {
        try {
            await paymentSlipApi.deletePaymentSlipApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

const initialState = {
    paymentSlips: [],
    currentSlip: null,
    loading: false,
    error: null,
    success: false,
};

const paymentSlipSlice = createSlice({
    name: 'paymentSlips',
    initialState,
    reducers: {
        resetPaymentSlipStatus: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
        clearCurrentPaymentSlip: (state) => {
            state.currentSlip = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createPaymentSlip.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createPaymentSlip.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.paymentSlips.unshift(action.payload); // Add to beginning of array
                state.currentSlip = action.payload; // Useful for immediate viewing/printing
            })
            .addCase(createPaymentSlip.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch All
            .addCase(fetchPaymentSlips.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaymentSlips.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentSlips = action.payload;
            })
            .addCase(fetchPaymentSlips.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch By ID
            .addCase(fetchPaymentSlipById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaymentSlipById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentSlip = action.payload;
            })
            .addCase(fetchPaymentSlipById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete
            .addCase(deletePaymentSlip.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePaymentSlip.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.paymentSlips = state.paymentSlips.filter(slip => slip._id !== action.payload);
                if (state.currentSlip && state.currentSlip._id === action.payload) {
                    state.currentSlip = null;
                }
            })
            .addCase(deletePaymentSlip.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetPaymentSlipStatus, clearCurrentPaymentSlip } = paymentSlipSlice.actions;
export default paymentSlipSlice.reducer;
