import { createSlice } from '@reduxjs/toolkit';
import { getDashboardStats, getActivities } from '../thunk/dashboardThunk';

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        stats: null,
        recentActivity: [],
        allActivities: [],
        isLoading: false,
        isActivitiesLoading: false,
        error: null,
    },
    reducers: {
        clearDashboardError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Stats
            .addCase(getDashboardStats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getDashboardStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stats = action.payload.stats;
                state.recentActivity = action.payload.recentActivity;
            })
            .addCase(getDashboardStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // All Activities
            .addCase(getActivities.pending, (state) => {
                state.isActivitiesLoading = true;
                state.error = null;
            })
            .addCase(getActivities.fulfilled, (state, action) => {
                state.isActivitiesLoading = false;
                state.allActivities = action.payload;
            })
            .addCase(getActivities.rejected, (state, action) => {
                state.isActivitiesLoading = false;
                state.error = action.payload;
            });
    },
});


export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
