import { createAsyncThunk } from '@reduxjs/toolkit';
import * as dashboardApi from '../../api/dashboard.api';

export const getDashboardStats = createAsyncThunk(
    'dashboard/getStats',
    async (_, { rejectWithValue }) => {
        try {
            return await dashboardApi.fetchDashboardStats();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
        }
    }
);

export const getActivities = createAsyncThunk(
    'dashboard/getActivities',
    async (filters, { rejectWithValue }) => {
        try {
            return await dashboardApi.fetchActivities(filters);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch activities');
        }
    }
);

