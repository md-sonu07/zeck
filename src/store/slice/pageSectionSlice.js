import { createSlice } from '@reduxjs/toolkit';
import { fetchPageSections, createPageSection, deletePageSection } from '../thunk/pageSectionThunk';

const pageSectionSlice = createSlice({
    name: 'pageSections',
    initialState: {
        sections: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch sections
            .addCase(fetchPageSections.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPageSections.fulfilled, (state, action) => {
                state.loading = false;
                state.sections = action.payload;
            })
            .addCase(fetchPageSections.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create section
            .addCase(createPageSection.fulfilled, (state, action) => {
                state.sections.unshift(action.payload);
            })
            // Delete section
            .addCase(deletePageSection.fulfilled, (state, action) => {
                state.sections = state.sections.filter(s => s._id !== action.payload);
            });
    }
});

export default pageSectionSlice.reducer;
