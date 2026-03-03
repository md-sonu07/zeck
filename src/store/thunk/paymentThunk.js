import { createAsyncThunk } from '@reduxjs/toolkit';
import * as paymentApi from '../../api/payment.api';

export const fetchPaymentSettings = createAsyncThunk(
    'payment/fetchSettings',
    async (_, { rejectWithValue }) => {
        try {
            return await paymentApi.getPaymentSettingsApi();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment settings');
        }
    }
);

export const updatePaymentSettings = createAsyncThunk(
    'payment/updateSettings',
    async (updates, { rejectWithValue }) => {
        try {
            return await paymentApi.updatePaymentSettingsApi(updates);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update payment settings');
        }
    }
);
