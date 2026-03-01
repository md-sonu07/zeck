import { createSlice } from '@reduxjs/toolkit';
import { fetchSearchResults } from '../thunk/searchThunk';

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        results: [],
        loading: false,
        error: null,
        activeFilters: null,
    },
    reducers: {
        clearSearchResults: (state) => {
            state.results = [];
            state.activeFilters = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchResults.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                // Set activeFilters immediately so the UI shows the results section with a loader
                state.activeFilters = action.meta.arg || {};
            })
            .addCase(fetchSearchResults.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload || [];
            })
            .addCase(fetchSearchResults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
