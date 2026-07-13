import { createSlice } from '@reduxjs/toolkit';
import {
    fetchGallery,
    fetchAllGallery,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem
} from '../thunk/galleryThunk';

const gallerySlice = createSlice({
    name: 'gallery',
    initialState: {
        data: [],
        allData: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearGalleryError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGallery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGallery.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchGallery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllGallery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllGallery.fulfilled, (state, action) => {
                state.loading = false;
                state.allData = action.payload;
            })
            .addCase(fetchAllGallery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createGalleryItem.fulfilled, (state, action) => {
                state.allData.unshift(action.payload);
                state.data.unshift(action.payload);
            })
            .addCase(updateGalleryItem.fulfilled, (state, action) => {
                const updateInList = (list) => {
                    const index = list.findIndex(item => item._id === action.payload._id);
                    if (index !== -1) list[index] = action.payload;
                };
                updateInList(state.allData);
                updateInList(state.data);
            })
            .addCase(deleteGalleryItem.fulfilled, (state, action) => {
                state.allData = state.allData.filter(item => item._id !== action.payload);
                state.data = state.data.filter(item => item._id !== action.payload);
            });
    }
});

export const { clearGalleryError } = gallerySlice.actions;
export default gallerySlice.reducer;
