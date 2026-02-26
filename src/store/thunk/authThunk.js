import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerApi, logoutApi } from '../../api/auth.api';

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
    try {
        const response = await loginApi(data);
        localStorage.setItem('userInfo', JSON.stringify(response));
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
    try {
        const response = await registerApi(data);
        localStorage.setItem('userInfo', JSON.stringify(response));
        return response;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    await logoutApi();
    localStorage.removeItem('userInfo');
});
