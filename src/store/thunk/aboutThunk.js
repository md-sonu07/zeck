import { createAsyncThunk } from '@reduxjs/toolkit';
import * as aboutApi from '../../api/about.api';

export const fetchAboutSettings = createAsyncThunk(
    'about/fetchSettings',
    async (_, { rejectWithValue }) => {
        try {
            return await aboutApi.getAboutSettingsApi();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch about settings');
        }
    }
);

export const updateAboutSettings = createAsyncThunk(
    'about/updateSettings',
    async (updates, { rejectWithValue }) => {
        try {
            return await aboutApi.updateAboutSettingsApi(updates);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update about settings');
        }
    }
);
