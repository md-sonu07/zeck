import { createAsyncThunk } from '@reduxjs/toolkit';
import * as importantServiceApi from '../../api/importantService.api';

export const fetchImportantServices = createAsyncThunk(
    'importantServices/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await importantServiceApi.getImportantServicesApi();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
        }
    }
);

export const createImportantService = createAsyncThunk(
    'importantServices/create',
    async (serviceData, { rejectWithValue }) => {
        try {
            return await importantServiceApi.createImportantServiceApi(serviceData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create service');
        }
    }
);

export const updateImportantServiceStatus = createAsyncThunk(
    'importantServices/updateStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            return await importantServiceApi.updateImportantServiceApi(id, { status });
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update service status');
        }
    }
);

export const updateImportantService = createAsyncThunk(
    'importantServices/update',
    async ({ id, serviceData }, { rejectWithValue }) => {
        try {
            return await importantServiceApi.updateImportantServiceApi(id, serviceData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update service');
        }
    }
);

export const deleteImportantService = createAsyncThunk(
    'importantServices/delete',
    async (id, { rejectWithValue }) => {
        try {
            await importantServiceApi.deleteImportantServiceApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete service');
        }
    }
);
