import { createSlice } from '@reduxjs/toolkit';
import { fetchAboutSettings, updateAboutSettings } from '../thunk/aboutThunk';

const aboutSlice = createSlice({
    name: 'about',
    initialState: {
        settings: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearAboutError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchAboutSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAboutSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload;
            })
            .addCase(fetchAboutSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateAboutSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAboutSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload;
            })
            .addCase(updateAboutSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearAboutError } = aboutSlice.actions;
export default aboutSlice.reducer;
