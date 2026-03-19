import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserProfileApi, updateUserProfileApi } from '../../api/user.api';

export const getProfile = createAsyncThunk('user/getProfile', async (_, { rejectWithValue }) => {
    try {
        const response = await getUserProfileApi();
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const updateProfile = createAsyncThunk('user/updateProfile', async (data, { rejectWithValue }) => {
    try {
        const response = await updateUserProfileApi(data);
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});
