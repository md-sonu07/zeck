import { createAsyncThunk } from '@reduxjs/toolkit';
import * as categoryApi from '../../api/category.api';

export const fetchCategories = createAsyncThunk(
    'categories/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await categoryApi.getCategoriesApi();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

export const addCategoryValue = createAsyncThunk(
    'categories/addValue',
    async (valueData, { rejectWithValue }) => {
        try {
            return await categoryApi.addCategoryValueApi(valueData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add category value');
        }
    }
);

export const updateCategory = createAsyncThunk(
    'categories/update',
    async (categoryData, { rejectWithValue }) => {
        try {
            return await categoryApi.updateCategoryApi(categoryData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update category');
        }
    }
);
