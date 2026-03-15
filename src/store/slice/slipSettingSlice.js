import { createSlice } from '@reduxjs/toolkit';
import { fetchSlipSettings, updateSlipSettings } from '../thunk/slipSettingThunk';

const slipSettingSlice = createSlice({
    name: 'slipSetting',
    initialState: {
        settings: {
            universities: [],
            courses: []
        },
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchSlipSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSlipSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload;
            })
            .addCase(fetchSlipSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateSlipSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSlipSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload;
            })
            .addCase(updateSlipSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default slipSettingSlice.reducer;
