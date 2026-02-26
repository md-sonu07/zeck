import { createSlice } from '@reduxjs/toolkit';
import { login, register, logout } from '../thunk/authThunk';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
        loading: false,
        error: null,
    },
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        clearCredentials: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.userInfo = action.payload;
                state.loading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register
            .addCase(register.fulfilled, (state, action) => {
                state.userInfo = action.payload;
                state.loading = false;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.userInfo = null;
                state.loading = false;
            });
    },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
