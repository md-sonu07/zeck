import { createSlice } from '@reduxjs/toolkit';
import { fetchPaymentSettings, updatePaymentSettings } from '../thunk/paymentThunk';

const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        settings: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearPaymentError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchPaymentSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaymentSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload.settings;
            })
            .addCase(fetchPaymentSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updatePaymentSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePaymentSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload.settings;
            })
            .addCase(updatePaymentSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;
