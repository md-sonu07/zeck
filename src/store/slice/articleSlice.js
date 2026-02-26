import { createSlice } from '@reduxjs/toolkit';
import { fetchArticles, updateArticle, createArticle, deleteArticle } from '../thunk/articleThunk';

const articleSlice = createSlice({
    name: 'articles',
    initialState: {
        items: [],
        loading: false,
        error: null,
        createSuccess: false,
        updateSuccess: false,
    },
    reducers: {
        resetArticleStatus: (state) => {
            state.createSuccess = false;
            state.updateSuccess = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Articles
            .addCase(fetchArticles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchArticles.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Article
            .addCase(updateArticle.pending, (state) => {
                state.loading = true;
                state.updateSuccess = false;
            })
            .addCase(updateArticle.fulfilled, (state, action) => {
                state.loading = false;
                state.updateSuccess = true;
                const index = state.items.findIndex((item) => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Article
            .addCase(createArticle.pending, (state) => {
                state.loading = true;
                state.createSuccess = false;
            })
            .addCase(createArticle.fulfilled, (state, action) => {
                state.loading = false;
                state.createSuccess = true;
                state.items.unshift(action.payload);
            })
            .addCase(createArticle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Article
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
            });
    }
});

export const { resetArticleStatus } = articleSlice.actions;
export default articleSlice.reducer;
