import { createAsyncThunk } from '@reduxjs/toolkit';
import * as galleryApi from '../../api/gallery.api';

export const fetchGallery = createAsyncThunk(
    'gallery/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await galleryApi.getGalleryApi();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch gallery');
        }
    }
);

export const fetchAllGallery = createAsyncThunk(
    'gallery/fetchAllAdmin',
    async (_, { rejectWithValue }) => {
        try {
            return await galleryApi.getAllGalleryApi();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch gallery');
        }
    }
);

export const createGalleryItem = createAsyncThunk(
    'gallery/create',
    async (formData, { rejectWithValue }) => {
        try {
            return await galleryApi.createGalleryApi(formData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create gallery item');
        }
    }
);

export const updateGalleryItem = createAsyncThunk(
    'gallery/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            return await galleryApi.updateGalleryApi(id, formData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update gallery item');
        }
    }
);

export const deleteGalleryItem = createAsyncThunk(
    'gallery/delete',
    async (id, { rejectWithValue }) => {
        try {
            await galleryApi.deleteGalleryApi(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete gallery item');
        }
    }
);
