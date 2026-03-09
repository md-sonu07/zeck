import { createSlice } from '@reduxjs/toolkit';
import { fetchApplications, updateApplicationStatus, fetchMyApplications, deleteApplication, removeApplicationDocument } from '../thunk/applicationThunk';
import { logout } from '../thunk/authThunk';


const applicationSlice = createSlice({
    name: 'applications',
    initialState: {
        applications: [],
        myApplications: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearApplicationError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload.applications || [];
            })
            .addCase(fetchApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch My
            .addCase(fetchMyApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.myApplications = action.payload.applications || [];
            })
            .addCase(fetchMyApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Status
            .addCase(updateApplicationStatus.fulfilled, (state, action) => {
                const updatedApp = action.payload.application;
                const index = state.applications.findIndex(app => app._id === updatedApp._id);
                if (index !== -1) {
                    state.applications[index] = updatedApp;
                }
            })

            // Remove Document
            .addCase(removeApplicationDocument.fulfilled, (state, action) => {
                const { documents } = action.payload;
                const appId = action.meta.arg.id;
                const index = state.applications.findIndex(app => app._id === appId);
                if (index !== -1) {
                    state.applications[index].documents = documents;
                }
            })

            // Delete
            .addCase(deleteApplication.fulfilled, (state, action) => {
                state.applications = state.applications.filter(app => app._id !== action.payload.id);
            })

            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.applications = [];
                state.myApplications = [];
                state.loading = false;
                state.error = null;
            });
    }
});

export const { clearApplicationError } = applicationSlice.actions;
export default applicationSlice.reducer;

