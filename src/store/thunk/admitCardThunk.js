import { createAsyncThunk } from '@reduxjs/toolkit';
import * as admitCardApi from '../../api/admitCard.api';

export const fetchAdmitCardsByPage = createAsyncThunk(
    'admitCards/fetchByPage',
    async ({ pageId, params }, { rejectWithValue }) => {
        try {
            return await admitCardApi.getAdmitCardsByPageApi(pageId, params);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch admit cards');
        }
    }
);

export const fetchAdmitCardById = createAsyncThunk(
    'admitCards/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            return await admitCardApi.getAdmitCardByIdApi(id);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch admit card');
        }
    }
);

export const searchAdmitCards = createAsyncThunk(
    'admitCards/search',
    async (params, { rejectWithValue }) => {
        try {
            return await admitCardApi.searchAdmitCardsApi(params);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to search admit cards');
        }
    }
);

export const createAdmitCard = createAsyncThunk(
    'admitCards/create',
    async (formData, { rejectWithValue }) => {
        try {
            return await admitCardApi.createAdmitCardApi(formData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create admit card');
        }
    }
);

export const updateAdmitCard = createAsyncThunk(
    'admitCards/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            return await admitCardApi.updateAdmitCardApi(id, formData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update admit card');
        }
    }
);

export const deleteAdmitCard = createAsyncThunk(
    'admitCards/delete',
    async (id, { rejectWithValue }) => {
        try {
            await admitCardApi.deleteAdmitCardApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete admit card');
        }
    }
);

export const bulkCreateAdmitCards = createAsyncThunk(
    'admitCards/bulkCreate',
    async (data, { rejectWithValue }) => {
        try {
            return await admitCardApi.bulkCreateAdmitCardsApi(data);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to bulk create admit cards');
        }
    }
);
