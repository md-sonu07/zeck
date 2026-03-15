import { createAsyncThunk } from '@reduxjs/toolkit';
import * as slipSettingApi from '../../api/slipSetting.api';

export const fetchSlipSettings = createAsyncThunk(
    'slipSetting/fetch',
    async (_, { rejectWithValue }) => {
        try {
            return await slipSettingApi.getSlipSettingsApi();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch slip settings');
        }
    }
);

export const updateSlipSettings = createAsyncThunk(
    'slipSetting/update',
    async (data, { rejectWithValue }) => {
        try {
            return await slipSettingApi.updateSlipSettingsApi(data);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update slip settings');
        }
    }
);
