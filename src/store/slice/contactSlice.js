import { createSlice } from '@reduxjs/toolkit';
import { fetchContactSettings, updateContactSettings } from '../thunk/contactThunk';

const contactSlice = createSlice({
    name: 'contact',
    initialState: {
        settings: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearContactError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Settings
            .addCase(fetchContactSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContactSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload;
            })
            .addCase(fetchContactSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Settings
            .addCase(updateContactSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateContactSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload; // Update central store immediately with fresh DB response
            })
            .addCase(updateContactSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearContactError } = contactSlice.actions;
export default contactSlice.reducer;
