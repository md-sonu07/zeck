import { createSlice } from '@reduxjs/toolkit';
import { fetchCategories, addCategoryValue, updateCategory } from '../thunk/categoryThunk';

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearCategoryError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Categories
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Category Value
            .addCase(addCategoryValue.fulfilled, (state, action) => {
                const index = state.data.findIndex(c => c.type === action.payload.type);
                if (index !== -1) {
                    state.data[index] = action.payload;
                } else {
                    state.data.push(action.payload);
                }
            })
            // Update Category
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.data.findIndex(c => c.type === action.payload.type);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            });
    }
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
