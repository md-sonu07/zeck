import { createAsyncThunk } from '@reduxjs/toolkit';
import * as admitCardPageApi from '../../api/admitCardPage.api';

export const fetchAdmitCardPages = createAsyncThunk(
    'admitCardPages/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            return await admitCardPageApi.getAdmitCardPagesApi(params);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch admit card pages');
        }
    }
);

export const fetchAdmitCardPageById = createAsyncThunk(
    'admitCardPages/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            return await admitCardPageApi.getAdmitCardPageByIdApi(id);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch admit card page');
        }
    }
);

export const fetchAdmitCardPageBySlug = createAsyncThunk(
    'admitCardPages/fetchBySlug',
    async (slug, { rejectWithValue }) => {
        try {
            return await admitCardPageApi.getAdmitCardPageBySlugApi(slug);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch admit card page');
        }
    }
);

export const createAdmitCardPage = createAsyncThunk(
    'admitCardPages/create',
    async (formData, { rejectWithValue }) => {
        try {
            return await admitCardPageApi.createAdmitCardPageApi(formData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create admit card page');
        }
    }
);

export const updateAdmitCardPage = createAsyncThunk(
    'admitCardPages/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            return await admitCardPageApi.updateAdmitCardPageApi(id, formData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update admit card page');
        }
    }
);

export const deleteAdmitCardPage = createAsyncThunk(
    'admitCardPages/delete',
    async (id, { rejectWithValue }) => {
        try {
            await admitCardPageApi.deleteAdmitCardPageApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete admit card page');
        }
    }
);
