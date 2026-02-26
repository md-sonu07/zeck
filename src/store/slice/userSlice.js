import { createSlice } from '@reduxjs/toolkit';
import { getProfile } from '../thunk/userThunk';
import { logout } from '../thunk/authThunk';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userDetails: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetUserDetails: (state) => {
            state.userDetails = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.userDetails = action.payload;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.userDetails = null;
            });
    },
});

export const { resetUserDetails } = userSlice.actions;
export default userSlice.reducer;
