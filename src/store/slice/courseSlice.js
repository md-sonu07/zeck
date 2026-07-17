import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/course.api.js';

export const fetchCourses = createAsyncThunk(
    'courses/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const { data } = await api.getCoursesApi(params);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
        }
    }
);

export const fetchCourseById = createAsyncThunk(
    'courses/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.getCourseByIdApi(id);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch course');
        }
    }
);

export const createCourse = createAsyncThunk(
    'courses/create',
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await api.createCourseApi(formData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create course');
        }
    }
);

export const updateCourse = createAsyncThunk(
    'courses/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const { data } = await api.updateCourseApi(id, formData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update course');
        }
    }
);

export const deleteCourse = createAsyncThunk(
    'courses/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.deleteCourseApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete course');
        }
    }
);

export const duplicateCourse = createAsyncThunk(
    'courses/duplicate',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.duplicateCourseApi(id);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to duplicate');
        }
    }
);

const courseSlice = createSlice({
    name: 'courses',
    initialState: { data: [], currentCourse: null, loading: false, error: null },
    reducers: {
        clearCurrentCourse: (state) => { state.currentCourse = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchCourses.fulfilled, (state, action) => { state.loading = false; state.data = action.payload; })
            .addCase(fetchCourses.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchCourseById.pending, (state) => { state.loading = true; })
            .addCase(fetchCourseById.fulfilled, (state, action) => { state.loading = false; state.currentCourse = action.payload; })
            .addCase(fetchCourseById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(createCourse.fulfilled, (state, action) => { state.data.unshift(action.payload); })
            .addCase(updateCourse.fulfilled, (state, action) => {
                const idx = state.data.findIndex(c => c._id === action.payload._id);
                if (idx !== -1) state.data[idx] = action.payload;
                if (state.currentCourse?._id === action.payload._id) state.currentCourse = action.payload;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                const idx = state.data.findIndex(c => c._id === action.payload);
                if (idx !== -1) state.data[idx].deletedAt = new Date().toISOString();
            })
            .addCase(duplicateCourse.fulfilled, (state, action) => { state.data.unshift(action.payload); });
    }
});

export const { clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;
