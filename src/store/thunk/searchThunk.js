import { createAsyncThunk } from '@reduxjs/toolkit';
import * as articleApi from '../../api/articleapi';

export const fetchSearchResults = createAsyncThunk(
    'search/fetchFiltered',
    async (filters, { rejectWithValue }) => {
        try {
            return await articleApi.getArticlesApi(filters);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch search results');
        }
    }
);
