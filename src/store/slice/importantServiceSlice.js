import { createSlice } from '@reduxjs/toolkit';
import {
    fetchImportantServices,
    createImportantService,
    updateImportantServiceStatus,
    updateImportantService,
    deleteImportantService
} from '../thunk/importantServiceThunk';

const importantServiceSlice = createSlice({
    name: 'importantServices',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearImportantServiceError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Services
            .addCase(fetchImportantServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchImportantServices.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchImportantServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Service
            .addCase(createImportantService.fulfilled, (state, action) => {
                state.data.unshift(action.payload);
            })
            // Update Service Status
            .addCase(updateImportantServiceStatus.fulfilled, (state, action) => {
                const index = state.data.findIndex(s => s._id === action.payload._id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            // Update Service
            .addCase(updateImportantService.fulfilled, (state, action) => {
                const index = state.data.findIndex(s => s._id === action.payload._id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            // Delete Service
            .addCase(deleteImportantService.fulfilled, (state, action) => {
                state.data = state.data.filter(s => s._id !== action.payload);
            });
    }
});

export const { clearImportantServiceError } = importantServiceSlice.actions;
export default importantServiceSlice.reducer;
