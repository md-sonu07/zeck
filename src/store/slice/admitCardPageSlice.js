import { createSlice } from '@reduxjs/toolkit';
import {
    fetchAdmitCardPages,
    fetchAdmitCardPageById,
    fetchAdmitCardPageBySlug,
    createAdmitCardPage,
    updateAdmitCardPage,
    deleteAdmitCardPage
} from '../thunk/admitCardPageThunk';

const admitCardPageSlice = createSlice({
    name: 'admitCardPages',
    initialState: {
        pages: [],
        currentPage: null,
        loading: false,
        error: null
    },
    reducers: {
        clearCurrentPage: (state) => {
            state.currentPage = null;
        },
        resetAdmitCardPageStatus: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdmitCardPages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdmitCardPages.fulfilled, (state, action) => {
                state.loading = false;
                state.pages = action.payload;
            })
            .addCase(fetchAdmitCardPages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAdmitCardPageById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdmitCardPageById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentPage = action.payload;
            })
            .addCase(fetchAdmitCardPageById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAdmitCardPageBySlug.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdmitCardPageBySlug.fulfilled, (state, action) => {
                state.loading = false;
                state.currentPage = action.payload;
            })
            .addCase(fetchAdmitCardPageBySlug.rejected, (state, action) => {
                state.loading = false;
                state.currentPage = null;
                state.error = action.payload;
            })
            .addCase(createAdmitCardPage.fulfilled, (state, action) => {
                state.pages.unshift(action.payload);
            })
            .addCase(updateAdmitCardPage.fulfilled, (state, action) => {
                const index = state.pages.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.pages[index] = action.payload;
                }
                if (state.currentPage && state.currentPage._id === action.payload._id) {
                    state.currentPage = action.payload;
                }
            })
            .addCase(deleteAdmitCardPage.fulfilled, (state, action) => {
                state.pages = state.pages.filter(p => p._id !== action.payload);
                if (state.currentPage && state.currentPage._id === action.payload) {
                    state.currentPage = null;
                }
            });
    }
});

export const { clearCurrentPage, resetAdmitCardPageStatus } = admitCardPageSlice.actions;
export default admitCardPageSlice.reducer;
