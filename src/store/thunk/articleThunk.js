import { createAsyncThunk } from '@reduxjs/toolkit';
import * as articleApi from '../../api/articleapi';

export const fetchArticles = createAsyncThunk(
    'articles/fetchByFilters',
    async (filters, { rejectWithValue }) => {
        try {
            return await articleApi.getArticlesApi(filters);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch articles');
        }
    }
);

export const updateArticle = createAsyncThunk(
    'articles/update',
    async ({ id, articleData }, { rejectWithValue }) => {
        try {
            return await articleApi.updateArticleApi({ id, articleData });
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update article');
        }
    }
);

export const createArticle = createAsyncThunk(
    'articles/create',
    async (articleData, { rejectWithValue }) => {
        try {
            return await articleApi.createArticleApi(articleData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create article');
        }
    }
);

export const deleteArticle = createAsyncThunk(
    'articles/delete',
    async (id, { rejectWithValue }) => {
        try {
            await articleApi.deleteArticleApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete article');
        }
    }
);
