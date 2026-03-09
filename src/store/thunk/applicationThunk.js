import { createAsyncThunk } from '@reduxjs/toolkit';
import * as applicationApi from '../../api/application.api';

export const fetchApplications = createAsyncThunk(
    'applications/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await applicationApi.getAllApplicationsApi();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
        }
    }
);

export const fetchMyApplications = createAsyncThunk(
    'applications/fetchMy',
    async (_, { rejectWithValue }) => {
        try {
            return await applicationApi.getMyApplicationsApi();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch your applications');
        }
    }
);


export const updateApplicationStatus = createAsyncThunk(
    'applications/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            return await applicationApi.updateApplicationStatusApi(id, status);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update status');
        }
    }
);

export const deleteApplication = createAsyncThunk(
    'applications/delete',
    async (id, { rejectWithValue }) => {
        try {
            return await applicationApi.deleteApplicationApi(id);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete application');
        }
    }
);
export const removeApplicationDocument = createAsyncThunk(
    'applications/removeDocument',
    async ({ id, documentUrl }, { rejectWithValue }) => {
        try {
            return await applicationApi.removeApplicationDocumentApi(id, documentUrl);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove document');
        }
    }
);
