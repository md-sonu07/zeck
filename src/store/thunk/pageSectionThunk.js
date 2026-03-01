import { createAsyncThunk } from '@reduxjs/toolkit';
import * as pageSectionApi from '../../api/pageSection.api';

export const fetchPageSections = createAsyncThunk(
    'pageSections/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await pageSectionApi.getPageSectionsApi();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch sections');
        }
    }
);

export const createPageSection = createAsyncThunk(
    'pageSections/create',
    async (sectionData, { rejectWithValue }) => {
        try {
            return await pageSectionApi.createPageSectionApi(sectionData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create section');
        }
    }
);

export const deletePageSection = createAsyncThunk(
    'pageSections/delete',
    async (id, { rejectWithValue }) => {
        try {
            await pageSectionApi.deletePageSectionApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete section');
        }
    }
);
