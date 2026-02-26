import { createAsyncThunk } from '@reduxjs/toolkit';
import * as contactApi from '../../api/contact.api';

export const fetchContactSettings = createAsyncThunk(
    'contact/fetchSettings',
    async (_, { rejectWithValue }) => {
        try {
            return await contactApi.getContactSettingsApi();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch contact settings');
        }
    }
);

export const updateContactSettings = createAsyncThunk(
    'contact/updateSettings',
    async (updates, { rejectWithValue }) => {
        try {
            return await contactApi.updateContactSettingsApi(updates);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update contact settings');
        }
    }
);
