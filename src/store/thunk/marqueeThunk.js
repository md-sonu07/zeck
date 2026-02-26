import { createAsyncThunk } from '@reduxjs/toolkit';
import * as marqueeApi from '../../api/marquee.api';

export const fetchMarquees = createAsyncThunk(
    'marquee/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await marqueeApi.getMarqueesApi();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch marquees');
        }
    }
);

export const fetchActiveMarquees = createAsyncThunk(
    'marquee/fetchActive',
    async (_, { rejectWithValue }) => {
        try {
            return await marqueeApi.getActiveMarqueesApi();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch active marquees');
        }
    }
);

export const createMarquee = createAsyncThunk(
    'marquee/create',
    async (marqueeData, { rejectWithValue }) => {
        try {
            return await marqueeApi.createMarqueeApi(marqueeData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create marquee');
        }
    }
);

export const updateMarquee = createAsyncThunk(
    'marquee/update',
    async ({ id, marqueeData }, { rejectWithValue }) => {
        try {
            return await marqueeApi.updateMarqueeApi(id, marqueeData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update marquee');
        }
    }
);

export const deleteMarquee = createAsyncThunk(
    'marquee/delete',
    async (id, { rejectWithValue }) => {
        try {
            await marqueeApi.deleteMarqueeApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete marquee');
        }
    }
);
