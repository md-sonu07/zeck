import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/courseCategory.api.js';

export const fetchCourseCategories = createAsyncThunk(
    'courseCategories/fetchAll',
    async (includeDeleted, { rejectWithValue }) => {
        try {
            const { data } = await api.getCourseCategoriesApi(includeDeleted);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

export const fetchActiveCourseCategories = createAsyncThunk(
    'courseCategories/fetchActive',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.getActiveCourseCategoriesApi();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

export const createCourseCategory = createAsyncThunk(
    'courseCategories/create',
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await api.createCourseCategoryApi(formData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create category');
        }
    }
);

export const updateCourseCategory = createAsyncThunk(
    'courseCategories/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const { data } = await api.updateCourseCategoryApi(id, formData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update category');
        }
    }
);

export const deleteCourseCategory = createAsyncThunk(
    'courseCategories/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.deleteCourseCategoryApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
        }
    }
);

export const restoreCourseCategory = createAsyncThunk(
    'courseCategories/restore',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.restoreCourseCategoryApi(id);
            return { id, message: data.message };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to restore category');
        }
    }
);

export const reorderCourseCategories = createAsyncThunk(
    'courseCategories/reorder',
    async (orders, { rejectWithValue }) => {
        try {
            const { data } = await api.reorderCourseCategoriesApi(orders);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to reorder');
        }
    }
);

const courseCategorySlice = createSlice({
    name: 'courseCategories',
    initialState: { data: [], activeData: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourseCategories.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchCourseCategories.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
            .addCase(fetchCourseCategories.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchActiveCourseCategories.fulfilled, (state, action) => { state.activeData = action.payload; })
            .addCase(createCourseCategory.fulfilled, (state, action) => { state.data.push(action.payload); })
            .addCase(updateCourseCategory.fulfilled, (state, action) => {
                const idx = state.data.findIndex(c => c._id === action.payload._id);
                if (idx !== -1) state.data[idx] = action.payload;
            })
            .addCase(deleteCourseCategory.fulfilled, (state, action) => {
                const idx = state.data.findIndex(c => c._id === action.payload);
                if (idx !== -1) state.data[idx].deletedAt = new Date().toISOString();
            })
            .addCase(reorderCourseCategories.fulfilled, (state, action) => {
                state.data = action.payload;
            });
    }
});

export default courseCategorySlice.reducer;
